# Bước 1 The7: options của site thật (data/the7/options-truoc.json) + nhận diện Velis → data/the7/options-buoc-1.json, nhập vào
# The7 → Theme Options → Export/Import Options. Trả lại như cũ: nhập options-truoc.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc1.py
# Velis identity on top of the live The7 options (the7-options-truoc.txt) → the7-options-b1.json. Every change is an
# ordinary The7 Theme Options value, editable later in wp-admin.
import json, copy
d = json.load(open('data/the7/options-truoc.json'))
o = copy.deepcopy(d)
RED, RED_H, LINK, INK, MUTED, CANVAS, CHAMP, HAIR = '#B8282E', '#9E1F26', '#C42F35', '#1A1A1A', '#5C5C5C', '#FAF7F2', '#B08D57', '#E4DED5'
BODY, HEAD = 'Be Vietnam Pro', 'Playfair Display:600'
B600 = 'Be Vietnam Pro:600'
def typo(fam, desk, mob=None, lh_d=None, lh_m=None, tt='none'):
    t = {'font_family': fam, 'responsive_font_size': {'desktop': f'{desk}px'}, 'responsive_line_height': {'desktop': f'{lh_d}px'}, 'text_transform': tt}
    if mob: t['responsive_font_size']['mobile'] = f'{mob}px'; t['responsive_line_height']['mobile'] = f'{lh_m}px'
    return t
o.update({
  # colours (DESIGN.md)
  'general-accent_bg_color': RED, 'general-spinner_color': RED,
  'content-headers_color': INK, 'content-primary_text_color': INK, 'content-secondary_text_color': MUTED, 'content-links_color': LINK,
  'general-title_color': INK, 'general-title_bg_color': CANVAS, 'general-breadcrumbs_color': MUTED,
  'general-title_decoration_line_color': CHAMP, 'dividers-color': HAIR,
  'buttons-hover_color': RED_H, 'buttons-hover_color_mode': 'color',
  'bottom_bar-bg_color': INK, 'bottom_bar-color': '#B9B9B9',
  'header-decoration-color': HAIR, 'header-floating_navigation-decoration-color': HAIR,
  'header-menu-font-color': MUTED, 'header-menu-hover-font-color-style': 'accent', 'header-menu-active_item-font-color': RED, 'header-menu-active_item-font-color-style': 'color',
  'header-menu-submenu-bg-color': '#FFFFFF', 'header-menu-submenu-font-color': INK,
  'header-menu-submenu-hover-bg-color': CANVAS, 'header-menu-submenu-active-bg-color': CANVAS,
  'header-mobile-menu-font-color': INK, 'header-mobile-menu-font-hover-color-style': 'accent',
  'header-mobile-menu_icon-color': INK, 'header-mobile-menu_icon-caption_color': INK,
  'header-inline-elements-near_menu-font_color': INK,
  # typography
  'fonts-font_family': BODY,
  'fonts-normal_size': {'font_size': '17px', 'line_height': '28px'},
  'fonts-big_size': {'font_size': '19px', 'line_height': '30px'},
  'fonts-small_size': {'font_size': '14px', 'line_height': '21px'},
  'fonts-h1-typography': typo(HEAD, 56, 36, 62, 40),
  'fonts-h2-typography': typo(HEAD, 40, 28, 48, 34),
  'fonts-h3-typography': typo(B600, 22, 20, 29, 26),
  'fonts-h4-typography': typo(B600, 19, None, 26),
  'fonts-h5-typography': typo(B600, 16, None, 24),
  'fonts-h6-typography': typo(B600, 14, None, 21),
  'fonts-widget-title': typo(B600, 16, None, 24), 'fonts-widget-content': typo(BODY, 15, None, 24),
  'general-page-title-typography': {'font_family': HEAD, 'text_transform': 'none', 'font_size': '44', 'line_height': '52'},
  'breadcrumbs-typography': {'font_family': BODY, 'text_transform': 'none', 'font_size': '14', 'line_height': '21'},
  'filter-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '14'},
  'top_bar-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '13'},
  'menu-mobile-microwidgets-typography': {'font_family': B600, 'font_size': '14'},
  'microwidgets-search-typography': {'font_family': BODY, 'font_size': '14'},
  'header-menu-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '15'},
  'header-menu-submenu-typography': {'font_family': BODY, 'text_transform': 'none', 'font_size': '15'},
  'header-mobile-menu-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '17'},
  'header-mobile-submenu-typography': {'font_family': BODY, 'text_transform': 'none', 'font_size': '15'},
  'header-inline-elements-near_menu-typography': {'font_family': B600, 'font_size': '15'},
  # buttons: radius 2 px, min height 48 for L (DESIGN Buttons)
  'buttons-l-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '16', 'letter_spacing': '0'},
  'buttons-m-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '15', 'letter_spacing': '0'},
  'buttons-s-typography': {'font_family': B600, 'text_transform': 'none', 'font_size': '14', 'letter_spacing': '0'},
  'buttons-l_border_radius': '2px', 'buttons-m_border_radius': '2px', 'buttons-s_border_radius': '2px',
  'buttons-l-min-height': '48px', 'buttons-m-min-height': '44px',
  # header: inline layout, 80 px, phone + "Nhận tư vấn" next to the menu
  'header-inline-height': '80px', 'header-floating_navigation-height': '72px',
  'header-inline-show_elements': '1',
  'header-inline-elements': {'top_bar_left': [], 'top_bar_right': [], 'near_menu_right': ['phone', 'button']},
  'header-inline-elements-near_menu_right-padding': '0px 0px 0px 24px',
  'header-elements-contact-phone-caption': '0911 237 979', 'header-elements-contact-phone-url': 'tel:0911237979',
  'header-elements-contact-phone-first-header-switch': 'near_logo', 'header-elements-contact-phone-second-header-switch': 'in_menu',
  'header-elements-button-1-name': 'Nhận tư vấn', 'header-elements-button-1-url': '/lien-he/',
  'header-elements-button-1-bg': 'accent', 'header-elements-button-1-hover-bg': 'color', 'header-elements-button-1-hover-bg-color': RED_H,
  'header-elements-button-1-border_radius': '2px', 'header-elements-button-1-border_width': '0px',
  'header-elements-button-1-padding': '12px 20px 12px 20px', 'header-elements-button-1-typography': {'font_family': B600, 'font_size': '15'},
  'header-elements-button-1-first-header-switch': 'near_logo', 'header-elements-button-1-second-header-switch': 'in_menu',
  # logos (Media 20682–20685, rendered from assets/brand/svg)
  'header-logo_regular': ['/wp-content/uploads/2026/11/velis-logo-44.png', 20682],
  'header-logo_hd': ['/wp-content/uploads/2026/11/velis-logo-88.png', 20683],
  'header-logo-padding': '0px 32px 0px 0px',
  'header-style-mobile-logo_regular': ['/wp-content/uploads/2026/11/velis-logo-44.png', 20682],
  'header-style-mobile-logo_hd': ['/wp-content/uploads/2026/11/velis-logo-88.png', 20683],
  'bottom_bar-logo_regular': ['/wp-content/uploads/2026/11/velis-logo-trang-40.png', 20684],
  'bottom_bar-logo_hd': ['/wp-content/uploads/2026/11/velis-logo-trang-80.png', 20685],
})
changed = sorted(k for k in o if o[k] != d.get(k))
json.dump(o, open('data/the7/options-buoc-1.json', 'w'), ensure_ascii=False)
print(len(changed), 'keys changed')
assert all(k in d for k in changed), [k for k in changed if k not in d]  # only existing The7 keys

# every other font in the options (other header layouts, widgets, microwidgets) → Be Vietnam Pro, same weight, so the
# page asks for 2 families only
import re
def swap(v):
    if isinstance(v, dict): return {k: swap(x) for k, x in v.items()}
    if isinstance(v, str) and re.match(r'^(Roboto Condensed|Roboto|Montserrat|Merriweather)(:\d+)?(italic)?$', v):
        w = re.search(r':(\d+)', v); return 'Be Vietnam Pro' + (':' + ('600' if w.group(1) in ('600', '700') else w.group(1)) if w and w.group(1) != '400' else '')
    return v
for k in list(o):
    if isinstance(o[k], dict) and 'font_family' in o[k]: o[k] = swap(o[k])
    elif k.endswith('font_family') or k == 'fonts-font_family': o[k] = swap(o[k])
left = [k for k, v in o.items() if re.search(r'Roboto|Montserrat|Merriweather', json.dumps(v)) and k not in ('general-tracking_code', 'general-custom_css')]
print('fonts left:', left)
# UX-16 preloads in the tracking code: the 2 above-the-fold fonts of the new typography (FVM local copies)
FV = '/wp-content/cache/fvm/fonts/'
o['general-tracking_code'] = re.sub(r'<!-- velis-ux: UX-16.*?crossorigin>\s*<link rel="preload"[^>]*>\s*<link rel="preload"[^>]*>\s*',
  '<!-- velis-ux: UX-16 – tải sớm 2 font chính (Be Vietnam Pro 400, Playfair Display 600, bản FVM lưu trên máy chủ) để chữ không đổi dòng khi font về muộn -->\n'
  f'<link rel="preload" href="{FV}QdVPSTAyLFyeg_IDWvOJmVES_Hw3BXw.woff" as="font" type="font/woff" crossorigin>\n'
  f'<link rel="preload" href="{FV}nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebunDXbtU.woff" as="font" type="font/woff" crossorigin>\n', o['general-tracking_code'], flags=re.S)
assert 'QdVPSTAyLFyeg' in o['general-tracking_code']
json.dump(o, open('data/the7/options-buoc-1.json', 'w'), ensure_ascii=False)
print(len([k for k in o if o[k] != d.get(k)]), 'keys changed in total')

# The7 custom CSS (velis-ux patches already on the live site): same rules, new brand colours
css = o['general-custom_css']
css = css.replace('{ color: #be2529; }', '{ color: #C42F35; font-weight: 600; }').replace('#be2529', '#B8282E')
o['general-custom_css'] = css
json.dump(o, open('data/the7/options-buoc-1.json', 'w'), ensure_ascii=False)
print('custom css updated', css.count('#B8282E'), css.count('#C42F35'))

# mobile header: own 36 px logo (DESIGN.md header: 36 px mobile), Media 20700 / 20701
o.update({
  'header-style-mobile-logo_regular': ['/wp-content/uploads/2026/11/velis-logo-36.png', 20700],
  'header-style-mobile-logo_hd': ['/wp-content/uploads/2026/11/velis-logo-72.png', 20701],
  'header-mobile-first_switch-logo': 'mobile', 'header-mobile-second_switch-logo': 'mobile',
})
json.dump(o, open('data/the7/options-buoc-1.json', 'w'), ensure_ascii=False)
print(len([k for k in o if o[k] != d.get(k)]), 'keys changed in total (final)')
