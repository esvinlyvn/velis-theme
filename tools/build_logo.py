"""Build Velis logo SVG variants from the vector paths extracted from the original Illustrator PDF.
Usage: python3 -I tools/build_logo.py   (writes assets/brand/svg/*.svg)
"""
import json, os

HERE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'brand', 'svg')
SRC = json.load(open(os.path.join(HERE, 'source-paths.json')))
COL = SRC['colors']
PATHS = SRC['paths']


def bbox(groups):
    ps = [p for p in PATHS if p['group'] in groups]
    x0 = min(p['bbox'][0] for p in ps); y0 = min(p['bbox'][1] for p in ps)
    x1 = max(p['bbox'][0] + p['bbox'][2] for p in ps); y1 = max(p['bbox'][1] + p['bbox'][3] for p in ps)
    return x0, y0, x1, y1


def paths(groups, white):
    return ''.join(f'<path fill="{"#FFFFFF" if white else COL[p["color"]]}" d="{p["d"]}"/>' for p in PATHS if p['group'] in groups)


def svg(w, h, body, title):
    w, h = round(w, 2), round(h, 2)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


def vertical(white=False, pad=0):
    x0, y0, x1, y1 = bbox({'mark', 'velis', 'realty'})
    g = f'<g transform="translate({pad - x0:.2f} {pad - y0:.2f})">{paths({"mark", "velis", "realty"}, white)}</g>'
    return svg(x1 - x0 + 2 * pad, y1 - y0 + 2 * pad, g, 'Velis Realty')


def horizontal(white=False):
    mx0, my0, mx1, my1 = bbox({'mark'})
    tx0, ty0, tx1, ty1 = bbox({'velis', 'realty'})
    th = ty1 - ty0
    s = th * 1.12 / (my1 - my0)          # mark a touch taller than the text block, optically balanced
    mw, mh = (mx1 - mx0) * s, (my1 - my0) * s
    gap = th * 0.32
    W, H = mw + gap + (tx1 - tx0), mh
    mark = f'<g transform="translate(0 0) scale({s:.5f}) translate({-mx0:.2f} {-my0:.2f})">{paths({"mark"}, white)}</g>'
    text = f'<g transform="translate({mw + gap - tx0:.2f} {(H - th) / 2 - ty0:.2f})">{paths({"velis", "realty"}, white)}</g>'
    return svg(W, H, mark + text, 'Velis Realty')


def mark(white=False, square=False):
    x0, y0, x1, y1 = bbox({'mark'})
    w, h = x1 - x0, y1 - y0
    if not square:
        return svg(w, h, f'<g transform="translate({-x0:.2f} {-y0:.2f})">{paths({"mark"}, white)}</g>', 'Velis Realty')
    side = max(w, h) * 1.1    # favicon: centred with a small safe margin
    return svg(side, side, f'<g transform="translate({(side - w) / 2 - x0:.2f} {(side - h) / 2 - y0:.2f})">{paths({"mark"}, white)}</g>', 'Velis Realty')


OUT = {
    'velis-logo-vertical.svg': vertical(),
    'velis-logo-vertical-white.svg': vertical(white=True),
    'velis-logo-horizontal.svg': horizontal(),
    'velis-logo-horizontal-white.svg': horizontal(white=True),
    'velis-mark.svg': mark(),
    'velis-mark-white.svg': mark(white=True),
    'favicon.svg': mark(square=True),
}

if __name__ == '__main__':
    assert len(PATHS) == 14 and {p['group'] for p in PATHS} == {'mark', 'velis', 'realty'}
    for name, data in OUT.items():
        open(os.path.join(HERE, name), 'w').write(data)
        print(name, len(data))
