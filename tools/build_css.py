"""theme/velis/css/1-tokens … 5-utilities (the ONE CSS source, shared with the mockup – tools/build_mockup.mjs) →
theme/velis/assets/velis.min.css, served on the front end and in the editor. Budget (bước 3, 2.3): ≤ 45 KB min, ≤ 12 KB gzip.
The colour and size tokens of 1-tokens.css must equal DESIGN.md front-matter (theme.json is generated from it).
Run after every CSS change: python3 -I tools/build_css.py"""
import gzip, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CSS = os.path.join(ROOT, 'theme', 'velis', 'css')
LAYERS = ['1-tokens.css', '2-base.css', '3-layout.css', '4-components.css', '5-utilities.css']
BUDGET = (45 * 1024, 12 * 1024)
# 1-tokens.css custom property → DESIGN.md front-matter key (colors.* / typography.*.desktop|mobile)
TOKENS = {'ink': 'ink', 'muted': 'body-muted', 'canvas': 'canvas', 'surface': 'surface', 'sunken': 'surface-sunken', 'dark': 'surface-dark',
          'footer': 'footer', 'line': 'hairline', 'line-strong': 'hairline-strong', 'red': 'velis-red', 'red-hover': 'velis-red-hover',
          'gold': 'champagne', 'gold-text': 'champagne-text', 'gold-light': 'champagne-light', 'champagne-soft': 'champagne-soft',
          'on-dark': 'on-dark', 'on-dark-muted': 'on-dark-muted', 'error': 'error', 'error-on-dark': 'error-on-dark'}
SIZES = {'fs-h3': ('h3', 'desktop'), 'fs-lead': ('lead', 'desktop'), 'fs-body': ('body', 'desktop'), 'fs-card': ('body-sm', 'desktop'),
         'fs-small': ('caption', 'desktop'), 'fs-label': ('eyebrow', 'desktop'), 'fs-number': ('number', 'desktop'),
         'fs-h1': ('h1', 'mobile'), 'fs-h2': ('h2', 'mobile')}


def minify(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r'([{;])\s*([\w-]+)\s*:\s*', r'\1\2:', css)  # "color : red" → "color:red" (declarations only, not :hover)
    css = re.sub(r'(?<=[\s:(,])0\.(\d)', r'.\1', css)  # 0.5 → .5
    return css.replace(';}', '}').strip() + '\n'


def front_matter():
    md = open(os.path.join(ROOT, 'DESIGN.md'), encoding='utf-8').read()
    fm = re.match(r'^---\n(.*?)\n---\n', md, re.S).group(1)
    colors = dict(re.findall(r'^  ([\w-]+): "(#[0-9A-Fa-f]{6})"', fm, re.M))
    typo = {k: dict(re.findall(r'(desktop|mobile): (\d+px)', v)) for k, v in re.findall(r'^  ([\w-]+): \{(.*)\}$', fm, re.M)}
    return colors, typo


def check_tokens(tokens_css):
    """Mismatches between the :root block of 1-tokens.css (first one = mobile values) and DESIGN.md."""
    root = re.search(r':root\s*\{(.*?)\}', tokens_css, re.S).group(1)
    var = dict(re.findall(r'--([\w-]+):\s*([^;]+);', root))
    colors, typo = front_matter()
    bad = [f'--{k} {var.get(k)} ≠ {v} {colors.get(v)}' for k, v in TOKENS.items() if (var.get(k) or '').upper() != (colors.get(v) or '').upper()]
    bad += [f'--{k} {var.get(k)} ≠ {t}.{w} {typo.get(t, {}).get(w)}' for k, (t, w) in SIZES.items() if var.get(k) != typo.get(t, {}).get(w)]
    desk = re.search(r'@media \(min-width: 1024px\) \{ :root \{(.*?)\} \}', tokens_css).group(1)
    dvar = dict(re.findall(r'--([\w-]+):\s*([^;]+);', desk))
    bad += [f'--{k} (≥ 1024) {dvar.get(k)} ≠ {t}.desktop' for k, t in (('fs-h1', 'h1'), ('fs-h2', 'h2')) if dvar.get(k) != typo[t]['desktop']]
    return bad


def build():
    src = ''.join(open(os.path.join(CSS, f), encoding='utf-8').read() for f in LAYERS)
    bad = check_tokens(open(os.path.join(CSS, LAYERS[0]), encoding='utf-8').read())
    assert not bad, 'token lệch DESIGN.md: ' + '; '.join(bad)
    out = minify(src.replace('url("../assets/fonts/', 'url("fonts/'))  # the built file lives in assets/
    assert '!important' not in out, '!important trong CSS'
    size, gz = len(out.encode()), len(gzip.compress(out.encode(), 9))
    assert size <= BUDGET[0] and gz <= BUDGET[1], f'CSS vượt ngân sách: {size} B min / {gz} B gzip'
    open(os.path.join(ROOT, 'theme', 'velis', 'assets', 'velis.min.css'), 'w', encoding='utf-8').write(out)
    return size, gz


assert minify('a { color : red; }\n/* x */ b{margin:0.5px}') == 'a{color:red}b{margin:.5px}\n'

if __name__ == '__main__':
    print('%d B min · %d B gzip' % build())
