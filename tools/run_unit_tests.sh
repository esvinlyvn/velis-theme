#!/usr/bin/env bash
# All unit tests (PHP, Node, Python) + CSS budget (tools/build_css.py fails above 45 KB min / 12 KB gzip). Exit ≠ 0 on any failure.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0
python3 -I tools/build_css.py >/dev/null || { echo "CSS vượt ngân sách"; fail=1; }
git diff --quiet -- theme/velis/assets/velis.min.css || { echo "velis.min.css chưa dựng lại sau khi sửa CSS"; fail=1; }
for f in tools/tests/*.php; do out=$(php "$f" 2>&1) || fail=1; echo "$out" | tail -2; echo "$out" | grep -qiE "FAIL|error" && fail=1; done
for f in tools/tests/*.mjs; do node --test "$f" >/dev/null 2>&1 || node "$f" >/dev/null 2>&1 || { echo "FAIL $f"; fail=1; }; done
python3 -I tools/check_hardcode.py --self-test >/dev/null && python3 -I tools/check_hardcode.py >/dev/null || { echo "FAIL check_hardcode (nội dung viết cứng trong theme)"; fail=1; }
for f in tools/tests/test_*.py; do python3 -I "$f" >/dev/null 2>&1 || { echo "FAIL $f"; fail=1; }; done
[ $fail = 0 ] && echo "unit: tất cả đạt" || { echo "unit: CÓ LỖI"; exit 1; }
