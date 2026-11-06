#!/usr/bin/env bash
# App Store 헤더·검색결과 이미지를 PNG로 만든다. (Google Chrome, Python Pillow 필요)
#   ./render.sh            → out/ 에 업로드용 PNG
#   GUIDE=1 ./render.sh    → 안전 영역을 표시한 확인용 PNG (out/guide/)
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="out${GUIDE:+/guide}"
mkdir -p "$OUT"

render() {
  local page=$1 width=$2 height=$3 lang=$4
  local file="$OUT/rovoca-$page-$lang-${width}x${height}.png"
  local query="lang=$lang${GUIDE:+&guide=1}"

  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=8000 \
    --window-size="$width,$height" --screenshot="$file" \
    "file://$PWD/$page.html?$query" >/dev/null 2>&1

  # Apple은 알파 채널이 있는 이미지를 받지 않으므로 RGB로 저장한다
  python3 - "$file" "$width" "$height" <<'PY'
import sys
from PIL import Image
path, width, height = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
image = Image.open(path)
if image.size != (width, height):
    sys.exit(f"{path}: {image.size} (expected {(width, height)})")
image.convert("RGB").save(path, optimize=True)
PY
  echo "$file"
}

for lang in ko en; do
  render header 3840 1646 "$lang"
  render search 3840 2560 "$lang"
done
