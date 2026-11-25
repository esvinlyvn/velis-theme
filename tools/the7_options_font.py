# Sửa lỗi dấu tiếng Việt (2026-11-25): bỏ 2 dòng tải sớm font FVM (chỉ Latin cơ bản) trong Theme Options → Advanced → Tracking code
# (khóa general-tracking_code, ghi chú "velis-ux: UX-16"). Font nay tải sớm từ theme con (functions.php). Giữ nguyên mọi dòng khác.
# Chạy: python3 -I tools/the7_options_font.py <bản-xuất.json> <file-nhập.json>   |   --test   (không ghi mã bảo mật vào repo)
import json, re, sys

KHOA = 'general-tracking_code'


def bo_fvm(code):
    code = re.sub(r'<!-- velis-ux: UX-16[^>]*-->\s*', '', code)
    code = re.sub(r'<link rel="preload" href="/wp-content/cache/fvm/fonts/[^"]+"[^>]*>\s*', '', code)
    return code


if sys.argv[1:] == ['--test']:
    c = '<!-- velis-ux: UX-16 – tải sớm 2 font -->\n<link rel="preload" href="/wp-content/cache/fvm/fonts/a.woff" as="font" type="font/woff" crossorigin>\n<link rel="preload" href="/wp-content/cache/fvm/fonts/b.woff" as="font" crossorigin>\n<script>x</script>'
    assert bo_fvm(c) == '<script>x</script>', repr(bo_fvm(c))
    print('test ok'); sys.exit()
o = json.load(open(sys.argv[1]))
truoc = o[KHOA]; o[KHOA] = bo_fvm(truoc)
assert 'cache/fvm' not in o[KHOA] and len(truoc) > len(o[KHOA])
json.dump(o, open(sys.argv[2], 'w'), ensure_ascii=False, separators=(',', ':'))
print('bỏ', len(truoc) - len(o[KHOA]), 'ký tự (preload font FVM)')
