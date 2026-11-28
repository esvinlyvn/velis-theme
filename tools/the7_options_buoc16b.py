# Bước 16b The7 ("làm bóng" – DESIGN.md "Làm bóng"): thang 7 cỡ chữ 14·16·18·24·32·40·56 cho tiêu đề / menu / widget, bo góc một bộ
# (nút + ô nhập 6 px), nền ngà mới #F4EEE4 cho dải tiêu đề trang. Chỉ đổi đúng các khóa dưới; giữ nguyên mọi khóa khác.
# Chạy từ gốc repo: python3 -I tools/the7_options_buoc16b.py <bản-xuất.json> <file-nhập.json>   |   --test
import json, sys

TOKEN = 'contact_form_security_token'
NGA = '#F4EEE4'


def h(d, t, m, ld, lt, lm, o):
    return {**o, 'responsive_font_size': {'desktop': d, 'tablet': t, 'mobile': m}, 'responsive_line_height': {'desktop': ld, 'tablet': lt, 'mobile': lm}}


def thay(o):
    c = {
        'fonts-h1-typography': h('56px', '40px', '32px', '68px', '48px', '40px', o['fonts-h1-typography']),
        'fonts-h2-typography': h('40px', '32px', '24px', '48px', '40px', '32px', o['fonts-h2-typography']),
        'fonts-h3-typography': h('24px', '24px', '18px', '32px', '32px', '28px', o['fonts-h3-typography']),
        'fonts-h4-typography': h('18px', '18px', '18px', '28px', '28px', '28px', o['fonts-h4-typography']),
        'general-page-title-typography': {**o['general-page-title-typography'], 'font_size': '56', 'line_height': '68'},
        'general-responsive_title_size': '32', 'general-responsive_title_line_height': '40',
        'fonts-normal_size': {'font_size': '16px', 'line_height': '26px'},
        'fonts-widget-content': {**o['fonts-widget-content'], 'responsive_font_size': {'desktop': '16px'}},
        'header-menu-typography': {**o['header-menu-typography'], 'font_size': '16'},
        'header-menu-submenu-typography': {**o['header-menu-submenu-typography'], 'font_size': '16'},
        'header-inline-elements-near_menu-typography': {**o['header-inline-elements-near_menu-typography'], 'font_size': '16'},
        'buttons-s-typography': {**o['buttons-s-typography'], 'font_size': '16'},
        'buttons-s_border_radius': '6px', 'buttons-m_border_radius': '6px', 'buttons-l_border_radius': '6px',
        'header-elements-button-1-border_radius': '6px', 'input_border_radius': '6px', 'general-border_radius': '6px',
        'general-title_bg_color': NGA, 'general-title_bg_gradient': '0deg|%s 30%%|%s 100%%' % (NGA, NGA),
        'header-menu-submenu-hover-bg-color': NGA, 'header-menu-submenu-active-bg-color': NGA,
        # khung 1200 + đệm 48 (bội 4; trước 1300 + 50); link trong đoạn = đỏ nút (một màu đỏ); chữ dòng cuối trắng (velis.css làm mờ)
        'general-content_width': '1296px', 'general-page_content_margin': '64px 48px 64px 48px', 'footer-padding': '64px 48px 40px 48px',
        'header-inline-side-padding': '48px 48px', 'header-mobile-first_switch-side-padding': '48px 48px', 'page_title-padding': '48px 48px',
        'content-links_color': '#B8282E', 'bottom_bar-color': '#FFFFFF',
    }
    assert all(k in o for k in c), [k for k in c if k not in o]
    return c


def build(o):
    sau = {**o, **thay(o)}
    an = lambda d: {**d, TOKEN: '<đã xóa>'}
    return an(o), an(sau), sau


if sys.argv[1:] == ['--test']:
    base = {'font_family': 'X', 'text_transform': 'none'}
    keys = ['fonts-h1-typography', 'fonts-h2-typography', 'fonts-h3-typography', 'fonts-h4-typography', 'fonts-widget-content']
    o = {TOKEN: 'abc', **{k: dict(base) for k in keys}, 'general-page-title-typography': {'font_size': '56'}, 'header-menu-typography': {'font_size': '15'},
         'header-menu-submenu-typography': {}, 'header-inline-elements-near_menu-typography': {}, 'buttons-s-typography': {}, 'x': 1}
    for k in ['general-responsive_title_size', 'general-responsive_title_line_height', 'fonts-normal_size', 'buttons-s_border_radius', 'buttons-m_border_radius',
              'buttons-l_border_radius', 'header-elements-button-1-border_radius', 'input_border_radius', 'general-border_radius', 'general-title_bg_color',
              'general-title_bg_gradient', 'header-menu-submenu-hover-bg-color', 'header-menu-submenu-active-bg-color', 'general-content_width',
              'general-page_content_margin', 'footer-padding', 'header-inline-side-padding', 'header-mobile-first_switch-side-padding', 'page_title-padding',
              'content-links_color', 'bottom_bar-color']:
        o[k] = ''
    t, s, n = build(o)
    assert n[TOKEN] == 'abc' and s[TOKEN] == '<đã xóa>' and n['fonts-h2-typography']['font_family'] == 'X' and n['fonts-h2-typography']['responsive_font_size']['mobile'] == '24px'
    sizes = {int(v['responsive_font_size'][d].rstrip('px')) for k in keys[:4] for v in [n[k]] for d in ('desktop', 'tablet', 'mobile')}
    assert sizes <= {14, 16, 18, 24, 32, 40, 56}, sizes
    print('test ok'); sys.exit()
o = json.load(open(sys.argv[1]))
truoc, sau, nhap = build(o)
for f, d in (('data/the7/options-truoc-b16b.json', truoc), ('data/the7/options-buoc-16b.json', sau), (sys.argv[2], nhap)):
    json.dump(d, open(f, 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(thay(o)), 'khóa')
