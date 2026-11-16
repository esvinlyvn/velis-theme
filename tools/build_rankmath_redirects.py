"""data/url-map.csv → CSV for Rank Math → Redirections → Import & Export → Import CSV ("create or update").
301 rows → type 301 to url_moi; 410 rows → type 410 (no destination); "giữ nguyên" rows are left out.
Rows whose source already exists in Rank Math (export CSV, column id) keep that id, so the import updates them instead
of adding a second rule for the same source. Destinations are absolute on the given host (staging now, live at launch).
Usage: python3 -I tools/build_rankmath_redirects.py <host> <out.csv> [rank-math-export.csv]
       host: https://staging.velisrealty.vn | https://velisrealty.vn"""
import csv, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = ['id', 'source', 'matching', 'destination', 'type', 'category', 'status', 'ignore']


def norm(src):
    """Rank Math stores sources without the leading slash; compare without the trailing one too."""
    return src.strip('/')


def rows(matrix, host, existing):
    out = []
    for r in matrix:
        if r['hanh_dong'] not in ('301', '410'):
            continue
        dest = host.rstrip('/') + r['url_moi'] if r['hanh_dong'] == '301' else ''
        out.append({'id': existing.get(norm(r['url_cu']), ''), 'source': r['url_cu'].lstrip('/'), 'matching': 'exact',
                    'destination': dest, 'type': r['hanh_dong'], 'category': '', 'status': 'active', 'ignore': ''})
    return out


_t = rows([{'url_cu': '/a/', 'url_moi': '/b/', 'hanh_dong': '301'}, {'url_cu': '/c/', 'url_moi': '', 'hanh_dong': '410'},
           {'url_cu': '/', 'url_moi': '/', 'hanh_dong': 'giữ nguyên'}], 'https://x.vn', {'a': '7'})
assert [(r['id'], r['source'], r['destination'], r['type']) for r in _t] == [('7', 'a/', 'https://x.vn/b/', '301'), ('', 'c/', '', '410')]

if __name__ == '__main__':
    host, out = sys.argv[1], sys.argv[2]
    existing = {norm(r['source']): r['id'] for r in csv.DictReader(open(sys.argv[3], encoding='utf-8'))} if len(sys.argv) > 3 else {}
    matrix = list(csv.DictReader(open(os.path.join(ROOT, 'data', 'url-map.csv'), encoding='utf-8')))
    res = rows(matrix, host, existing)
    with open(out, 'w', newline='', encoding='utf-8') as f:
        f.write(','.join(HEAD) + '\n')  # header unquoted, as Rank Math exports it (a quoted header is rejected: "missing columns")
        csv.DictWriter(f, fieldnames=HEAD, quoting=csv.QUOTE_ALL).writerows(res)
    print(len(res), 'dòng ·', sum(r['type'] == '301' for r in res), '301 ·', sum(r['type'] == '410' for r in res), '410 ·', sum(bool(r['id']) for r in res), 'cập nhật theo id')
