"""実際の音源・秘密コードは使わず、ZIPの互換性と安全停止を検証します。"""
import hashlib
import importlib.util
from pathlib import Path
import stat
import struct
import tempfile
import unittest
import zipfile

SPEC = importlib.util.spec_from_file_location("album_zip", Path(__file__).resolve().parents[1] / "scripts/prepare_album_zip.py")
album_zip = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(album_zip)


class FinderStyleInfo(zipfile.ZipInfo):
    # テストだけで、Finderの「UTF-8名なのにbit 11なし」を再現します。
    def _encodeFilenameFlags(self):
        return self.filename.encode("utf-8"), self.flag_bits & ~0x800


class AlbumZipTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.source = self.root / "source.zip"
        self.output = self.root / "output.zip"

    def archive(self, entries, legacy=False):
        with zipfile.ZipFile(self.source, "w") as archive:
            for name, data in entries:
                info = FinderStyleInfo(name) if legacy else zipfile.ZipInfo(name)
                archive.writestr(info, data)

    def test_finder_utf8_is_recovered_and_flagged_in_both_headers(self):
        payload = b"synthetic audio" * 1000
        self.archive([("2027/ブルー.wav", payload), ("2027/plain.mp3", b"unchanged"),
                      ("__MACOSX/2027/._ブルー.wav", b"metadata"), ("2027/.DS_Store", b"metadata")], legacy=True)
        source_bytes = self.source.read_bytes()
        result = album_zip.prepare_zip(self.source, self.output, "utf-8")
        with zipfile.ZipFile(self.output) as archive, self.output.open("rb") as raw:
            self.assertEqual(set(archive.namelist()), {"2027/ブルー.wav", "2027/plain.mp3"})
            info = archive.getinfo("2027/ブルー.wav")
            self.assertEqual(archive.read(info), payload)
            self.assertEqual(info.compress_type, zipfile.ZIP_DEFLATED)
            self.assertTrue(info.flag_bits & 0x800)
            raw.seek(info.header_offset)
            self.assertTrue(struct.unpack_from("<H", raw.read(30), 6)[0] & 0x800)
        self.assertEqual(result["verifiedPayloadCount"], 2)
        self.assertEqual(result["excludedMacMetadataCount"], 2)
        self.assertEqual(result["files"]["2027/ブルー.wav"]["sha256"], hashlib.sha256(payload).hexdigest())
        self.assertEqual(self.source.read_bytes(), source_bytes)

    def test_valid_utf8_and_directory_structure_are_preserved(self):
        self.archive([("2027/", b""), ("2027/Disc 1/", b""), ("2027/Disc 1/星.wav", b"audio")])
        album_zip.prepare_zip(self.source, self.output)
        with zipfile.ZipFile(self.output) as archive:
            self.assertEqual(archive.namelist(), ["2027/", "2027/Disc 1/", "2027/Disc 1/星.wav"])

    def test_invalid_windows_names_are_rejected_without_renaming(self):
        for name in ["../escape.wav", "/absolute.wav", "a/../escape.wav", "a//b.wav", "a/b:bad.wav",
                     "CON.wav", "a/COM1.mp3", "a/LPT¹.wav", "a/trailing. ", "a/null\0.wav", "a\\b.wav"]:
            with self.subTest(name=name), self.assertRaises(ValueError):
                album_zip.normalized_name(name)

    def test_normalization_or_case_collisions_are_rejected(self):
        for entries in [[("a/ブ.wav", b"1"), ("a/ブ.wav", b"2")], [("A.wav", b"1"), ("a.wav", b"2")],
                        [("a", b"1"), ("a/b.wav", b"2")]]:
            with self.subTest(entries=entries):
                self.archive(entries)
                with self.assertRaises(ValueError):
                    album_zip.prepare_zip(self.source, self.output)
                self.assertFalse(self.output.exists())

    def test_existing_output_and_original_are_never_overwritten(self):
        self.archive([("a.wav", b"audio")])
        with self.assertRaises(ValueError):
            album_zip.prepare_zip(self.source, self.source)
        self.output.write_bytes(b"existing")
        with self.assertRaises(ValueError):
            album_zip.prepare_zip(self.source, self.output)
        self.assertEqual(self.output.read_bytes(), b"existing")

    def test_symlink_is_rejected(self):
        with zipfile.ZipFile(self.source, "w") as archive:
            info = zipfile.ZipInfo("link.wav")
            info.create_system = 3
            info.external_attr = (stat.S_IFLNK | 0o777) << 16
            archive.writestr(info, "../../somewhere")
        with self.assertRaises(ValueError):
            album_zip.prepare_zip(self.source, self.output)
        self.assertFalse(self.output.exists())

    def test_mac_metadata_only_archive_is_not_published(self):
        self.archive([("__MACOSX/._a.wav", b"metadata")])
        with self.assertRaises(ValueError):
            album_zip.prepare_zip(self.source, self.output)

    def test_verification_rejects_modified_payload(self):
        self.archive([("a.wav", b"changed")])
        with self.assertRaises(ValueError):
            album_zip.verify_archive(self.source, {"a.wav": {"sha256": hashlib.sha256(b"original").hexdigest()}}, [])

    def test_broken_source_crc_does_not_leave_a_distribution_zip(self):
        self.archive([("a.wav", b"original")])
        with zipfile.ZipFile(self.source) as archive:
            offset = archive.getinfo("a.wav").header_offset
        # 保存方式のダミー音源を1バイト壊し、元ZIPのCRCエラーを再現します。
        with self.source.open("r+b") as raw:
            raw.seek(offset)
            header = raw.read(30)
            name_length, extra_length = struct.unpack_from("<HH", header, 26)
            raw.seek(offset + 30 + name_length + extra_length)
            raw.write(b"X")
        with self.assertRaises(zipfile.BadZipFile):
            album_zip.prepare_zip(self.source, self.output)
        self.assertFalse(self.output.exists())
        self.assertEqual(list(self.root.glob("*.partial")), [])

    def test_verification_rejects_missing_utf8_flag(self):
        payload = b"audio"
        self.archive([("星.wav", payload)], legacy=True)
        # 正しく復元できることと、配布ZIPの指定が正しいことは別に検証します。
        with self.assertRaises(ValueError):
            album_zip.verify_archive(self.source, {"星.wav": {"sha256": hashlib.sha256(payload).hexdigest()}}, [])


if __name__ == "__main__":
    unittest.main()
