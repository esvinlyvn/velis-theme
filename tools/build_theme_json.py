"""Generate theme/velis/theme.json from the token front matter of DESIGN.md (single source of truth).
Usage: python3 -I tools/build_theme_json.py
"""
import json, os, re
import yaml

ROOT = os.path.join(os.path.dirname(__file__), '..')
md = open(os.path.join(ROOT, 'DESIGN.md'), encoding='utf-8').read()
T = yaml.safe_load(re.match(r'^---\n(.*?)\n---\n', md, re.S).group(1))
C, TY, SP, L = T['colors'], T['typography'], T['spacing'], T['layout']

NAMES = {'ink': 'Mực (chữ chính)', 'body-muted': 'Chữ phụ', 'canvas': 'Nền ngà', 'surface': 'Trắng', 'surface-sunken': 'Nền phụ',
         'surface-dark': 'Nền tối', 'hairline': 'Đường kẻ', 'hairline-strong': 'Đường kẻ đậm', 'velis-red': 'Đỏ Velis',
         'velis-red-hover': 'Đỏ Velis đậm', 'champagne': 'Champagne', 'champagne-text': 'Champagne (chữ)', 'on-dark': 'Chữ trên nền tối',
         'on-dark-muted': 'Chữ phụ trên nền tối', 'success': 'Thành công', 'warning': 'Cảnh báo', 'error': 'Lỗi'}
FONT = {'heading': 'var(--wp--preset--font-family--heading)', 'body': 'var(--wp--preset--font-family--body)'}
SIZES = ['caption', 'body-sm', 'body', 'h4', 'h3', 'h2', 'h1']


def slug(name):  # WP kebab-cases slugs for CSS vars ('h1' -> 'h-1'), so use unambiguous names
    return 'heading-' + name[1] if re.fullmatch(r'h\d', name) else name


def size(name):
    t = TY[name]
    if t['desktop'] == t['mobile']:
        return {'slug': slug(name), 'name': name, 'size': t['desktop'], 'fluid': False}
    return {'slug': slug(name), 'name': name, 'size': t['desktop'], 'fluid': {'min': t['mobile'], 'max': t['desktop']}}


def heading(name):
    t = TY[name]
    return {'typography': {'fontFamily': FONT[t['fontFamily']], 'fontSize': f'var(--wp--preset--font-size--{slug(name)})',
                           'fontWeight': str(t['fontWeight']), 'lineHeight': str(t['lineHeight'])}}


def face(family, weight, file):
    return {'fontFamily': family, 'fontWeight': str(weight), 'fontStyle': 'normal', 'fontDisplay': 'swap',
            'src': [f'file:./assets/fonts/{file}.woff2']}


theme = {
    '$schema': 'https://schemas.wp.org/trunk/theme.json',
    'version': 3,
    'settings': {
        'appearanceTools': True,
        'useRootPaddingAwareAlignments': False,
        'color': {'defaultPalette': False, 'defaultGradients': False, 'defaultDuotone': False, 'custom': False,
                  'customGradient': False,
                  'palette': [{'slug': k, 'name': NAMES[k], 'color': v} for k, v in C.items() if k in NAMES]},
        'typography': {
            'defaultFontSizes': False, 'customFontSize': False, 'fluid': {'minViewportWidth': L['breakpoints'][0], 'maxViewportWidth': L['breakpoints'][-1]},
            'fontFamilies': [
                {'slug': 'heading', 'name': 'Playfair Display', 'fontFamily': TY['font-heading'],
                 'fontFace': [face('Playfair Display', 600, 'playfair-display-600')]},
                {'slug': 'body', 'name': 'Be Vietnam Pro', 'fontFamily': TY['font-body'],
                 'fontFace': [face('Be Vietnam Pro', 400, 'be-vietnam-pro-400'), face('Be Vietnam Pro', 600, 'be-vietnam-pro-600')]},
            ],
            'fontSizes': [size(n) for n in SIZES],
        },
        'spacing': {'defaultSpacingSizes': False, 'blockGap': None, 'units': ['px', 'rem', '%', 'vw'],
                    'spacingSizes': [{'slug': k, 'name': k, 'size': v} for k, v in SP.items() if k.isdigit()]},
        'layout': {'contentSize': L['reading-column'], 'wideSize': L['content']},  # 760 px reading column (the 664 px measure was dropped 2026-11-11)
        'custom': {'radius': T['rounded'], 'shadow': T['elevation'], 'motion': T['motion'],
                   'section': {'desktop': SP['section-desktop'], 'tablet': SP['section-tablet'], 'mobile': SP['section-mobile']},
                   'gutter': {'desktop': L['gutter-desktop'], 'mobile': L['gutter-mobile']}},
        'shadow': {'defaultPresets': False, 'presets': [{'slug': k, 'name': k, 'shadow': v} for k, v in T['elevation'].items()]},
    },
    # no global styles: the front end and the editor use the theme CSS (theme/velis/css → assets/velis.min.css) whose tokens are
    # checked against DESIGN.md (tools/build_css.py); element / block styles here would out-rank it (:root :where()) and
    # blockGap would add margins between template blocks outside the space scale (bước 3, 2.3)
    'styles': {},
    'templateParts': [{'name': 'header', 'title': 'Header', 'area': 'header'}, {'name': 'footer', 'title': 'Footer', 'area': 'footer'}],
}

if __name__ == '__main__':
    assert C['velis-red'] == '#B8282E' and TY['h1']['desktop'] == '56px', 'token lệch BRIEF.md / DESIGN.md 1.3'  # H1 56 px: thang chữ 1.3, người dùng chốt 2026-11-05
    out = os.path.join(ROOT, 'theme', 'velis', 'theme.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(theme, f, ensure_ascii=False, indent='\t')
        f.write('\n')
    print('wrote', out)
