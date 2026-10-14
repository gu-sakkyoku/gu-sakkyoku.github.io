#!/usr/bin/env python3
"""配布用ZIPをUTF-8のファイル名＋通常のDeflateで作り直す（Python 3.11以上）。

音源を変換・再エンコードしません。元ZIPを展開せず1MBずつ読み書きし、
完成後に全ファイルのSHA-256とZIPヘッダーを照合してから完成品にします。
Finder由来のUTF-8指定漏れは、確認済みの場合だけ明示オプションで読み直します。
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import struct
import sys
import tempfile
import unicodedata
import zipfile

CHUNK_BYTES = 1024 * 1024
UTF8_FLAG = 0x800
WINDOWS_RESERVED = re.compile(r"^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])$", re.I)
WINDOWS_FORBIDDEN = re.compile(r'[<>:"\\|?*\x00-\x1f]')


def sha256_stream(stream):
    digest = hashlib.sha256()
    while chunk := stream.read(CHUNK_BYTES):
        digest.update(chunk)
    return digest.hexdigest()


def is_mac_metadata(name):
    # AppleDouble・Finderの表示設定は音源ではないので、配布物から除きます。
    return any(part in ("__MACOSX", ".DS_Store") or part.startswith("._")
               for part in name.split("/"))


def normalized_name(name):
    # 「ブ」などの分解された濁点を「ブ」に揃えます。曲名そのものは変更しません。
    normalized = unicodedata.normalize("NFC", name)
    path = normalized[:-1] if normalized.endswith("/") else normalized
    parts = path.split("/")
    for part in parts:
        if not part or part in (".", "..") or WINDOWS_FORBIDDEN.search(part):
            raise ValueError(f"安全に展開できないファイル名です: {name!r}")
        if part.endswith((" ", ".")) or WINDOWS_RESERVED.fullmatch(part.split(".")[0]):
            raise ValueError(f"Windowsで使用できないファイル名です: {name!r}")
        if len(part.encode("utf-16-le")) // 2 > 255:
            raise ValueError(f"Windowsの名前長上限を超えています: {name!r}")
    # 展開先フォルダの長さも加わるので、一般的な260文字上限に余裕を残します。
    if len(path.encode("utf-16-le")) // 2 > 200:
        raise ValueError(f"配布用としてパスが長すぎます: {name!r}")
    return normalized


def plan_entries(archive):
    planned = []
    ignored = []
    names = set()
    types = {}
    for info in archive.infolist():
        original = info.orig_filename
        if is_mac_metadata(original):
            ignored.append(original)
            continue
        if info.flag_bits & 1:
            raise ValueError("暗号化されたZIPは受け付けません。音源の保護はWorkerが担当します。")
        mode = stat.S_IFMT(info.external_attr >> 16) if info.create_system == 3 else 0
        if mode not in (0, stat.S_IFREG, stat.S_IFDIR):
            raise ValueError(f"リンク・特殊ファイルは配布できません: {original!r}")
        name = normalized_name(original)
        key = name.rstrip("/").casefold()
        if key in names:
            raise ValueError(f"正規化後に同名のファイルがあります: {name!r}")
        names.add(key)
        parts = name.rstrip("/").split("/")
        for index in range(1, len(parts) + 1):
            prefix = "/".join(parts[:index]).casefold()
            kind = "directory" if index < len(parts) or info.is_dir() else "file"
            if prefix in types and types[prefix] != kind:
                raise ValueError(f"ファイルとフォルダの名前が衝突しています: {name!r}")
            types[prefix] = kind
        planned.append((info, name))
    if not any(not info.is_dir() for info, _ in planned):
        raise ValueError("配布できるファイルがありません。")
    # ZIP爆弾や、誤って別の大容量バックアップを指定した場合の安全停止です。
    if len(planned) > 10000 or sum(info.file_size for info, _ in planned) > 10 * 1024**3:
        raise ValueError("アルバム用の上限（10,000項目・展開後10GiB）を超えています。")
    return sorted(planned, key=lambda entry: entry[1]), ignored


def verify_archive(path, expected_files, expected_directories):
    """中央ディレクトリだけでなく各ファイル先頭のUTF-8指定も確認します。"""
    with zipfile.ZipFile(path) as archive, Path(path).open("rb") as raw:
        entries = archive.infolist()
        actual_files = {info.filename for info in entries if not info.is_dir()}
        actual_directories = {info.filename for info in entries if info.is_dir()}
        if actual_files != set(expected_files) or actual_directories != set(expected_directories):
            raise ValueError("作り直す前後でファイル・フォルダ一覧が一致しません。")
        for info in entries:
            if is_mac_metadata(info.filename) or normalized_name(info.orig_filename) != info.filename:
                raise ValueError("完成ZIPに互換性のない名前が残っています。")
            if info.compress_type not in (zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED):
                raise ValueError("完成ZIPが通常のZIP圧縮方式ではありません。")
            raw.seek(info.header_offset)
            header = raw.read(30)
            if len(header) != 30 or header[:4] != b"PK\x03\x04":
                raise ValueError("ZIPのローカルヘッダーが壊れています。")
            flags = struct.unpack_from("<H", header, 6)[0]
            name_length = struct.unpack_from("<H", header, 26)[0]
            local_name = raw.read(name_length)
            if local_name != info.filename.encode("utf-8"):
                raise ValueError("ZIP内の2か所でファイル名が一致しません。")
            if not info.filename.isascii() and not (flags & UTF8_FLAG and info.flag_bits & UTF8_FLAG):
                raise ValueError("日本語などのファイル名にUTF-8指定がありません。")
            if not info.is_dir():
                with archive.open(info) as stream:
                    # 全量を読むことでzipfileのCRC検証も行われます。
                    if sha256_stream(stream) != expected_files[info.filename]["sha256"]:
                        raise ValueError(f"音源の内容が一致しません: {info.filename!r}")


def prepare_zip(source, output, legacy_filename_encoding=None):
    source, output = Path(source).resolve(), Path(output).resolve()
    if source == output or output.exists():
        raise ValueError("元ZIP・既存ファイルは上書きしません。新しい出力先を指定してください。")
    manifest_path = output.with_suffix(output.suffix + ".manifest.json")
    if manifest_path.exists():
        raise ValueError("確認記録が既に存在します。新しい出力先を指定してください。")
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(source, metadata_encoding=legacy_filename_encoding) as original:
        planned, ignored = plan_entries(original)
        expected_files = {}
        expected_directories = []
        # 途中で停止したファイルを完成ZIPと取り違えないよう、別名で作って検証します。
        descriptor, temporary_name = tempfile.mkstemp(prefix=f".{output.stem}-", suffix=".partial", dir=output.parent)
        os.close(descriptor)
        temporary = Path(temporary_name)
        try:
            with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as rebuilt:
                for info, name in planned:
                    target = zipfile.ZipInfo(name, date_time=info.date_time)
                    target.create_system = 0
                    target.external_attr = 0x10 if info.is_dir() else 0x20
                    target.compress_type = zipfile.ZIP_STORED if info.is_dir() else zipfile.ZIP_DEFLATED
                    target.file_size = info.file_size
                    # 非ASCII名はzipfileがUTF-8で書き、両ヘッダーのbit 11を設定します。
                    # 元のMac専用extraや権限・コメントは持ち越しません。
                    if info.is_dir():
                        rebuilt.writestr(target, b"")
                        expected_directories.append(name)
                        continue
                    digest = hashlib.sha256()
                    with original.open(info) as reader, rebuilt.open(target, "w") as writer:
                        while chunk := reader.read(CHUNK_BYTES):
                            writer.write(chunk)
                            digest.update(chunk)
                    expected_files[name] = {"bytes": info.file_size, "sha256": digest.hexdigest()}
            verify_archive(temporary, expected_files, expected_directories)
            with source.open("rb") as stream:
                source_sha = sha256_stream(stream)
            with temporary.open("rb") as stream:
                output_sha = sha256_stream(stream)
            manifest = {
                "format": "ZIP / Deflate / UTF-8 filenames / NFC",
                "legacyFilenameEncoding": legacy_filename_encoding,
                "sourceSha256": source_sha,
                "zipSha256": output_sha,
                "zipBytes": temporary.stat().st_size,
                "verifiedPayloadCount": len(expected_files),
                "excludedMacMetadataCount": len(ignored),
                "files": expected_files,
            }
            # linkは既存の出力が途中で現れた場合も上書きしません（同じフォルダ内）。
            os.link(temporary, output)
            with manifest_path.open("x", encoding="utf-8") as stream:
                json.dump(manifest, stream, ensure_ascii=False, indent=2)
                stream.write("\n")
            return manifest
        finally:
            # 削除対象はこの関数自身が作った一時ファイル1個だけです。元ZIPは触りません。
            temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description="音源を変更せず、Windows/Mac向けの配布用ZIPを作成・照合します。")
    parser.add_argument("source", type=Path, help="元のZIP（上書きしません）")
    parser.add_argument("output", type=Path, help="新しい配布用ZIPの出力先")
    parser.add_argument("--legacy-filename-encoding", choices=["utf-8"], help="Finder由来のUTF-8指定漏れを確認した元ZIPだけに使用")
    args = parser.parse_args()
    if sys.version_info < (3, 11):
        parser.exit(1, "Python 3.11以上が必要です。\n")
    try:
        result = prepare_zip(args.source, args.output, args.legacy_filename_encoding)
    except (OSError, ValueError, zipfile.BadZipFile, NotImplementedError) as error:
        parser.exit(1, f"ZIPを公開せず停止しました: {error}\n")
    print(f"作成・全量照合完了: {args.output}\n音源・ファイル数: {result['verifiedPayloadCount']}\nZIP SHA-256: {result['zipSha256']}")


if __name__ == "__main__":
    main()
