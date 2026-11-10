"""Check every row of data/url-map.csv on STAGING without following redirects (giai đoạn 5, mục 2).
  301        → exactly ONE 301 hop to url_moi, and url_moi itself answers 200 (no chain, no loop)
  410        → 410
  giữ nguyên → 200 (no redirect)
Staging sits behind the view password (plugin Password Protected): the password is read from the file in env
VIEW_PASSWORD_FILE (or env STAGING_VIEW_PASSWORD) and never printed. Read-only: GET requests only.
Usage: python3 -I tools/check_redirects.py [out.csv]   → prints totals, writes one line per URL to out.csv"""
import csv, os, sys
from urllib.parse import urljoin, urlsplit

import requests
from urllib3.util.retry import Retry

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('STAGING', 'https://staging.velisrealty.vn')
APPS = ('/check-can-the-prive', '/check-sdt', '/cmgd', '/lucky-lead', '/meta-check', '/tao-qr-bank', '/thi')


def verdict(action, expected, hops):
    """hops: list of (status, location-path or '') for the old URL then each followed Location (max 3).
    Returns '' when the row passes, else a short reason."""
    s0, loc0 = hops[0]
    if action == '410':
        return '' if s0 == 410 else 'mong 410, nhận %s' % s0
    if action == 'giữ nguyên':
        return '' if s0 == 200 else 'mong 200, nhận %s%s' % (s0, ' → ' + loc0 if loc0 else '')
    if s0 != 301:
        return 'mong 301, nhận %s%s' % (s0, ' → ' + loc0 if loc0 else '')
    if loc0 != expected:
        return 'đích sai: %s (mong %s)' % (loc0, expected)
    if len(hops) < 2:
        return 'không đọc được đích'
    s1, loc1 = hops[1]
    if s1 in (301, 302, 307, 308):
        return 'chuỗi: %s → %s %s' % (loc0, s1, loc1)
    return '' if s1 == 200 else 'đích trả %s' % s1


def is_app(path):
    """The 7 apps (and /meta-check.zip) are never requested; '/thiet-ke-…' is not '/thi/'."""
    return path == '/meta-check.zip' or any(path == a + '/' or path.startswith(a + '/') for a in APPS)


# self-check
assert is_app('/thi/') and is_app('/cmgd/x/') and is_app('/meta-check.zip') and not is_app('/thiet-ke-nha-pho/')
assert verdict('301', '/a/', [(301, '/a/'), (200, '')]) == ''
assert verdict('301', '/a/', [(301, '/b/'), (200, '')]).startswith('đích sai')
assert verdict('301', '/a/', [(301, '/a/'), (301, '/c/')]).startswith('chuỗi')
assert verdict('410', '', [(410, '')]) == '' and verdict('410', '', [(404, '')]).startswith('mong 410')
assert verdict('giữ nguyên', '/', [(200, '')]) == '' and verdict('giữ nguyên', '/', [(301, '/x/')]).startswith('mong 200')


def session():
    pw = (os.environ.get('STAGING_VIEW_PASSWORD') or open(os.environ['VIEW_PASSWORD_FILE'], encoding='utf-8').read()).strip()
    s = requests.Session()
    s.verify = '/root/.ccr/ca-bundle.crt'
    # the proxy / staging sometimes resets a connection: retry the request, never the verdict
    s.mount('https://', requests.adapters.HTTPAdapter(max_retries=Retry(total=4, connect=4, read=4, backoff_factor=2, status_forcelist=(), allowed_methods=None, raise_on_status=False)))
    s.headers['User-Agent'] = 'velis-redirect-check'
    login = BASE + '/?password-protected=login&redirect_to=' + BASE + '/'
    s.get(login)
    s.post(login, data={'password_protected_pwd': pw, 'password_protected_cookie_test': '1', 'password-protected': 'login', 'redirect_to': BASE + '/'})
    r = s.get(BASE + '/gioi-thieu/', allow_redirects=False)
    if r.status_code != 200:
        sys.exit('Đăng nhập mật khẩu xem staging thất bại (%s) – dừng' % r.status_code)
    return s


def path_of(loc):
    u = urlsplit(urljoin(BASE + '/', loc))
    return u.path + ('?' + u.query if u.query else '') if u.netloc == urlsplit(BASE).netloc else urljoin(BASE + '/', loc)


def hops(s, path):
    out, seen = [], set()
    for _ in range(3):
        if path in seen:
            out.append((-1, 'VÒNG')); break
        seen.add(path)
        r = s.get(BASE + path, allow_redirects=False, timeout=60)
        loc = path_of(r.headers['Location']) if 'Location' in r.headers else ''
        out.append((r.status_code, loc))
        if not loc or r.status_code not in (301, 302, 307, 308) or not loc.startswith('/'):
            break
        path = loc
    return out


if __name__ == '__main__':
    rows = list(csv.DictReader(open(os.path.join(ROOT, 'data', 'url-map.csv'), encoding='utf-8')))
    rows = [r for r in rows if not is_app(r['url_cu'])]
    s = session()
    res = []
    for r in rows:
        h = hops(s, r['url_cu'])
        res.append({**r, 'ket_qua': h[0][0], 'dich': h[0][1], 'loi': verdict(r['hanh_dong'], r['url_moi'], h)})
    bad = [x for x in res if x['loi']]
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'w', newline='', encoding='utf-8') as f:
            w = csv.DictWriter(f, fieldnames=['url_cu', 'hanh_dong', 'url_moi', 'uu_tien', 'ket_qua', 'dich', 'loi'], extrasaction='ignore')
            w.writeheader(); w.writerows(res)
    print('tổng', len(res), '· đạt', len(res) - len(bad), '· lỗi', len(bad))
    from collections import Counter
    print(Counter((x['hanh_dong'], x['loi'].split(':')[0][:30]) for x in bad).most_common(20))
