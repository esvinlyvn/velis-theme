#!/usr/bin/env python3
"""Dựng font tự lưu cho theme con (sửa lỗi dấu tiếng Việt 2026-11-25): FVM tự tải Google Fonts về /wp-content/cache/fvm/fonts/*.woff chỉ có
Latin cơ bản (thiếu ấ ầ ậ ặ ă đ ơ ư ữ …) → chữ rơi về font khác. Nguồn: tệp TTF chính thức github.com/google/fonts (OFL, ofl/bevietnampro,
ofl/playfairdisplay). Mỗi độ đậm MỘT tệp woff2 gồm latin + latin-ext + vietnamese (giữ kern / mark để dấu ghép đúng chỗ).
Dùng: python3 -I tools/the7_font_tieng_viet.py <thư mục TTF tải về> <thư mục ra>   |   --kiem <woff2…>   |   --test
"""
import os, sys
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

# latin + latin-ext + vietnamese (unicode-range của Google Fonts / @fontsource) – gộp
DAI = [(0x0000, 0x02FF), (0x0300, 0x036F), (0x1D00, 0x1DBF), (0x1E00, 0x1EFF), (0x2000, 0x206F), (0x20A0, 0x20C0),
       (0x2113, 0x2113), (0x2122, 0x2122), (0x2190, 0x2193), (0x2212, 0x2215), (0x2C60, 0x2C7F), (0xA720, 0xA7FF), (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD)]
VIET = [0x102, 0x103, 0x110, 0x111, 0x128, 0x129, 0x168, 0x169, 0x1A0, 0x1A1, 0x1AF, 0x1B0] + list(range(0x1EA0, 0x1EFA))
RA = {  # tệp ra: (nguồn, trục wght hoặc None)
    'be-vietnam-pro-400.woff2': ('bevietnampro/BeVietnamPro-Regular.ttf', None),
    'be-vietnam-pro-500.woff2': ('bevietnampro/BeVietnamPro-Medium.ttf', None),
    'be-vietnam-pro-600.woff2': ('bevietnampro/BeVietnamPro-SemiBold.ttf', None),
    'playfair-display-400.woff2': ('playfairdisplay/PlayfairDisplay[wght].ttf', 400),
    'playfair-display-600.woff2': ('playfairdisplay/PlayfairDisplay[wght].ttf', 600),
}


def thieu_viet(path):
    cm = TTFont(path).getBestCmap()
    return [hex(c) for c in VIET if c not in cm]


def dung(src_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for ra, (src, w) in RA.items():
        f = TTFont(os.path.join(src_dir, src))
        if w:
            f = instancer.instantiateVariableFont(f, {'wght': w}, updateFontNames=True)
        opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.name_IDs = ['*']; opt.notdef_outline = True; opt.hinting = False
        s = subset.Subsetter(opt); s.populate(unicodes=[u for a, b in DAI for u in range(a, b + 1)]); s.subset(f)
        p = os.path.join(out_dir, ra); subset.save_font(f, p, opt)
        miss = thieu_viet(p)
        assert not miss, (ra, miss)
        print('%-28s %6d B  tiếng Việt đủ %d/%d' % (ra, os.path.getsize(p), len(VIET), len(VIET)))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--kiem':
        bad = 0
        for p in a[1:]:
            m = thieu_viet(p); bad += bool(m); print(os.path.basename(p), 'ĐỦ tiếng Việt' if not m else 'THIẾU %d: %s' % (len(m), ' '.join(m[:8])))
        sys.exit(1 if bad else 0)
    if a == ['--test']:
        assert 0x1EF9 in VIET and 0x0103 in VIET and len(VIET) == 102 and set(RA) and all(any(x <= u <= y for x, y in DAI) for u in VIET)
        print('test: OK'); sys.exit(0)
    dung(a[0], a[1])
