"""Minify theme/velis/style.css → theme/velis/assets/velis.min.css (served on the front end; brief budget CSS ≤ 50 KB).
style.css stays the source (WordPress reads its header). Run after every CSS change: python3 -I tools/build_css.py"""
import os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'theme', 'velis')


def minify(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};,>])\s*', r'\1', css)
    css = re.sub(r'([{;])\s*([\w-]+)\s*:\s*', r'\1\2:', css)  # "color : red" → "color:red" (declarations only, not :hover)
    css = re.sub(r'(?<=[\s:(,])0\.(\d)', r'.\1', css)  # 0.5 → .5
    return css.replace(';}', '}').strip() + '\n'


def build():
    out = minify(open(os.path.join(ROOT, 'style.css'), encoding='utf-8').read())
    open(os.path.join(ROOT, 'assets', 'velis.min.css'), 'w', encoding='utf-8').write(out)
    return out


if __name__ == '__main__':
    print(len(build().encode()), 'bytes')
