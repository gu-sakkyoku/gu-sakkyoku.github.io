#!/usr/bin/env bash
# CI・公開用のビルドです。
# next/font がビルド中にGoogleフォントを取りに行き、まれに一時的な失敗で止まります
# （2026-11-13：公開時のCIで1回、手元で1回。同じコードのまま、やり直すと成功）。
# そのときだけ、もう一度だけビルドします。ほかの理由の失敗は、そのまま失敗として止めます。
set -uo pipefail

log="$(mktemp)"
if npm run build 2>&1 | tee "$log"; then
  exit 0
fi

if grep -qE "next-font-loader|from Google Fonts" "$log"; then
  echo "::warning::Googleフォントの取得に一時的に失敗したため、もう一度だけビルドします。"
  rm -rf .next
  npm run build
else
  exit 1
fi
