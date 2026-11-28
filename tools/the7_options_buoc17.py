# Bước 17 The7 (2026-11-26, người dùng yêu cầu "thang tiêu đề trong nội dung"): H2 ≥ 32 / 26, H3 ≥ 24 / 21, H4 ≥ chữ thân + 1 (21 / 18),
# H5 / H6 không nhỏ hơn chữ thân (thân bài 18–20 px máy tính, 16 px điện thoại); cuối bài 3 bài cùng cụm. Chỉ đổi đúng các khóa dưới.
# Chạy từ gốc repo: python3 -I tools/the7_options_buoc17.py <bản-xuất.json> <file-nhập.json> [tên-bản-lưu=buoc-17]   |   --test
import json, sys

TOKEN = 'contact_form_security_token'


def h(d, t, m, ld, lt, lm, o):
    return {**o, 'responsive_font_size': {'desktop': d, 'tablet': t, 'mobile': m}, 'responsive_line_height': {'desktop': ld, 'tablet': lt, 'mobile': lm}}


def thay(o):
    c = {
        'fonts-h2-typography': h('40px', '32px', '26px', '48px', '40px', '34px', o['fonts-h2-typography']),
        'fonts-h3-typography': h('24px', '24px', '21px', '32px', '32px', '30px', o['fonts-h3-typography']),
        'fonts-h4-typography': h('21px', '21px', '18px', '30px', '30px', '28px', o['fonts-h4-typography']),
        'fonts-h5-typography': h('20px', '20px', '17px', '28px', '28px', '26px', o['fonts-h5-typography']),
        'fonts-h6-typography': h('20px', '20px', '16px', '28px', '28px', '24px', o['fonts-h6-typography']),
        'general-rel_posts_max': '3',
    }
    assert all(k in o for k in c), [k for k in c if k not in o]
    return c


def build(o):
    sau = {**o, **thay(o)}
    an = lambda d: {**d, TOKEN: '<đã xóa>'}
    return an(o), an(sau), sau


if sys.argv[1:] == ['--test']:
    keys = ['fonts-h%d-typography' % i for i in range(2, 7)]
    o = {TOKEN: 'abc', **{k: {'font_family': 'X', 'text_transform': 'none'} for k in keys}, 'general-rel_posts_max': '6', 'x': 1}
    t, s, n = build(o)
    assert n[TOKEN] == 'abc' and s[TOKEN] == '<đã xóa>' and t['general-rel_posts_max'] == '6' and n['general-rel_posts_max'] == '3' and n['x'] == 1
    px = lambda k, d: int(n[k]['responsive_font_size'][d].rstrip('px'))
    for d, than in (('desktop', 20), ('mobile', 16)):  # H2 > H3 > H4 ≥ thân + 1, H5/H6 ≥ thân
        assert px(keys[0], d) > px(keys[1], d) > px(keys[2], d) >= than + 1 and min(px(keys[3], d), px(keys[4], d)) >= than, d
    assert px(keys[0], 'mobile') >= 26 and px(keys[1], 'mobile') >= 21 and n[keys[0]]['font_family'] == 'X'
    print('test ok'); sys.exit()
o = json.load(open(sys.argv[1])); ten = sys.argv[3] if len(sys.argv) > 3 else 'buoc-17'
truoc, sau, nhap = build(o)
for f, d in ((f'data/the7/options-truoc-{ten}.json', truoc), (f'data/the7/options-{ten}.json', sau), (sys.argv[2], nhap)):
    json.dump(d, open(f, 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(thay(o)), 'khóa')
