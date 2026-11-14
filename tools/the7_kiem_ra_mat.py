#!/usr/bin/env python3
"""Kiểm bước 6 kế hoạch ra mắt (docs/KE-HOACH-RA-MAT.md) – 15 phút sau khi bật công tắc. CHỈ ĐỌC (GET/HEAD).

  1. robots.txt: không "Disallow: /" cho mọi bot, có dòng Sitemap của site;
  2. 10 trang mẫu: 200, meta robots + X-Robots-Tag không noindex, 0 chuỗi "staging." trong HTML (canonical, og, link, ảnh);
  3. sitemap_index.xml + mọi sitemap con: 200, có <loc>, đủ loại post/page/category, 0 "staging.";
  4. URL có lượt nhấp (data/gsc/pages.csv): 200 hoặc đúng 1 bước 301 tới trang 200;
  5. bảng chuyển hướng (data/the7/ra-mat/chuyen-huong-mau.csv – mỗi quy tắc Rank Math đang bật 1–2 URL mẫu): 1 bước đúng đích, đích 200;
  6. 7 ứng dụng: CHỈ HEAD (CLAUDE.md), so mã với mốc – nội dung / dữ liệu ứng dụng do người dùng tự mở kiểm.

Dùng: python3 -I tools/the7_kiem_ra_mat.py [--base https://velisrealty.vn] [--ung-dung-chuan]   (staging: env VIEW_PASSWORD_FILE)
      python3 -I tools/the7_kiem_ra_mat.py --test
Thoát 0 = đạt hết; 1 = có mục trượt → theo kế hoạch: quay lui bước 5.
"""
import csv, os, re, sys, time
from urllib.parse import urljoin, urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANG_MAU = ['/', '/du-an/', '/chu-dau-tu/', '/blog/', '/blog/the-prive/', '/can-ho-the-prive/', '/can-ho-persa-place/',
             '/huong-viet-holdings-la-ai/', '/gioi-thieu/', '/lien-he/']
UNG_DUNG = {  # mốc HEAD site thật 2026-11-14 (curl -sI)
    '/check-can-the-prive/': 405, '/check-sdt/': 200, '/cmgd/': 200, '/lucky-lead/': 302,
    '/meta-check/': 200, '/tao-qr-bank/': 200, '/thi/': 200, '/meta-check.zip': 200}
APPS = tuple(k.rstrip('/') for k in UNG_DUNG if not k.endswith('.zip'))


def la_ung_dung(path):
    return path == '/meta-check.zip' or any(path == a + '/' or path.startswith(a + '/') for a in APPS)


def robots_loi(txt, base):
    loi, nhom, moi = [], [], True
    for dong in txt.splitlines():
        d = dong.split('#')[0].strip()
        if d.lower().startswith('user-agent:'):
            nhom = (nhom if not moi else []) + [d.split(':', 1)[1].strip()]; moi = False
            continue
        moi = True
        if d.lower().startswith('disallow:') and d.split(':', 1)[1].strip() == '/' and '*' in nhom:
            loi.append('robots.txt chặn toàn site (Disallow: /)')
    if not re.search(r'(?im)^sitemap:\s*' + re.escape(base) + r'/sitemap_index\.xml\s*$', txt):
        loi.append('robots.txt thiếu Sitemap: %s/sitemap_index.xml' % base)
    return loi


def noindex(html, headers):
    tag = [m for m in re.findall(r'<meta[^>]+>', html, re.I) if re.search(r'name=["\'](robots|googlebot)["\']', m, re.I)]
    return any('noindex' in t.lower() for t in tag) or 'noindex' in headers.get('X-Robots-Tag', '').lower()


def staging_trong(txt):
    return len(re.findall(r'staging\.velisrealty|staging%2[Ee]velisrealty', txt))


def url_gsc(path_csv):
    out = []
    for r in csv.DictReader(open(path_csv, encoding='utf-8')):
        if float(r['Lượt nhấp'] or 0) <= 0 or '#' in r['Trang hàng đầu']:
            continue
        p = urlsplit(r['Trang hàng đầu']).path or '/'
        if not la_ung_dung(p):
            out.append(p)
    return out


def phan_xu(hops, dich=None):
    """hops: [(mã, location_path)] tối đa 3 bước. dich=None: 200 hoặc 1×301→200. dich=x: đúng 1×301→x→200."""
    s0, l0 = hops[0]
    if dich is None and s0 == 200:
        return ''
    if s0 != 301:
        return 'mong %s, nhận %s%s' % ('301' if dich else '200/301', s0, ' → ' + l0 if l0 else '')
    if dich and l0 != dich:
        return 'đích sai %s (mong %s)' % (l0, dich)
    if len(hops) < 2:
        return 'đích ngoài site: %s' % l0
    s1, l1 = hops[1]
    return '' if s1 == 200 else 'chuỗi/đích lỗi: %s → %s %s' % (l0, s1, l1)


def phien(base):
    import requests
    from urllib3.util.retry import Retry
    s = requests.Session(); s.verify = '/root/.ccr/ca-bundle.crt'
    s.mount('https://', requests.adapters.HTTPAdapter(max_retries=Retry(total=4, connect=4, read=4, backoff_factor=2, status_forcelist=(), allowed_methods=None, raise_on_status=False)))
    s.headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Mobile Safari/537.36'
    if 'staging.' in base:  # trang khóa mật khẩu xem (Password Protected)
        pw = open(os.environ['VIEW_PASSWORD_FILE'], encoding='utf-8').read().strip()
        login = base + '/?password-protected=login&redirect_to=' + base + '/'
        s.get(login); s.post(login, data={'password_protected_pwd': pw, 'password_protected_cookie_test': '1', 'password-protected': 'login', 'redirect_to': base + '/'})
    return s


def chay(base, chuan_ung_dung):
    t0 = time.time(); s = phien(base); loi = []; host = urlsplit(base).netloc

    def buoc(path):
        out, seen = [], set()
        for _ in range(3):
            if path in seen:
                out.append((-1, 'VÒNG')); break
            seen.add(path); r = s.get(base + path, allow_redirects=False, timeout=60)
            loc = r.headers.get('Location', ''); u = urlsplit(urljoin(base + path, loc)) if loc else None
            lp = (u.path + ('?' + u.query if u.query else '')) if u and u.netloc == host else (loc and urljoin(base + path, loc))
            out.append((r.status_code, lp or ''))
            if not lp or not lp.startswith('/') or r.status_code not in (301, 302, 307, 308):
                break
            path = lp
        return out

    r = s.get(base + '/robots.txt', timeout=60)
    loi += ['robots: ' + x for x in robots_loi(r.text if r.ok else '', base)]
    for p in TRANG_MAU:
        r = s.get(base + p, timeout=60)
        if r.status_code != 200:
            loi.append('trang %s: %s' % (p, r.status_code)); continue
        if noindex(r.text, r.headers):
            loi.append('trang %s: noindex' % p)
        if staging_trong(r.text):
            loi.append('trang %s: %d chuỗi staging' % (p, staging_trong(r.text)))
    r = s.get(base + '/sitemap_index.xml', timeout=60)
    con = re.findall(r'<loc>([^<]+)</loc>', r.text) if r.ok else []
    if not con:
        loi.append('sitemap_index.xml: %s, 0 sitemap con' % r.status_code)
    for kieu in ('post-sitemap', 'page-sitemap', 'category-sitemap'):
        if con and not any(kieu in c for c in con):
            loi.append('sitemap thiếu ' + kieu)
    for c in con:
        rc = s.get(c, timeout=60)
        if rc.status_code != 200 or '<loc>' not in rc.text or staging_trong(rc.text):
            loi.append('sitemap %s: %s, staging=%d' % (urlsplit(c).path, rc.status_code, staging_trong(rc.text)))
    gsc = url_gsc(os.path.join(ROOT, 'data', 'gsc', 'pages.csv'))
    for p in gsc:
        x = phan_xu(buoc(p))
        if x:
            loi.append('GSC %s: %s' % (p, x))
    mau = list(csv.DictReader(open(os.path.join(ROOT, 'data', 'the7', 'ra-mat', 'chuyen-huong-mau.csv'), encoding='utf-8')))
    for m in mau:
        x = phan_xu(buoc(m['url_mau']), m['dich'])
        if x:
            loi.append('chuyển hướng %s: %s' % (m['url_mau'], x))
    for p, ma in UNG_DUNG.items():
        h = s.head(base + p, allow_redirects=False, timeout=60).status_code
        if h != ma:
            (loi if chuan_ung_dung else []).append('ứng dụng %s: HEAD %s (mốc %s)' % (p, h, ma))
            if not chuan_ung_dung:
                print('  (ghi chú) ứng dụng %s: HEAD %s, mốc site thật %s' % (p, h, ma))
    print('%s – %d trang mẫu, %d sitemap con, %d URL GSC, %d URL chuyển hướng mẫu, %d ứng dụng (HEAD) – %.0f s'
          % (base, len(TRANG_MAU), len(con), len(gsc), len(mau), len(UNG_DUNG), time.time() - t0))
    print('KẾT QUẢ: ' + ('ĐẠT' if not loi else 'TRƯỢT %d mục' % len(loi)))
    for x in loi:
        print('  - ' + x)
    return 0 if not loi else 1


def test():
    b = 'https://velisrealty.vn'
    assert robots_loi('User-agent: *\nDisallow: /wp-admin/\nSitemap: %s/sitemap_index.xml\n' % b, b) == []
    assert robots_loi('User-agent: *\nDisallow: /\n', b)[0].startswith('robots.txt chặn')
    assert robots_loi('User-agent: *\nDisallow:\n', b) == ['robots.txt thiếu Sitemap: %s/sitemap_index.xml' % b]
    assert noindex('<meta name="robots" content="noindex, nofollow">', {})
    assert noindex('<meta name="robots" content="index, follow">', {'X-Robots-Tag': 'noindex'})
    assert not noindex('<meta name="robots" content="follow, index, max-snippet:-1">', {})
    assert staging_trong('<link rel="canonical" href="https://staging.velisrealty.vn/x/"> https%3A%2F%2Fstaging%2Evelisrealty') == 2
    assert la_ung_dung('/thi/') and la_ung_dung('/lucky-lead/login.php') and not la_ung_dung('/thiet-ke-cong-nang/')
    assert phan_xu([(200, '')]) == '' and phan_xu([(301, '/a/'), (200, '')]) == ''
    assert phan_xu([(301, '/a/'), (301, '/b/')]).startswith('chuỗi') and phan_xu([(404, '')]).startswith('mong')
    assert phan_xu([(301, '/blog/'), (200, '')], '/blog/') == '' and phan_xu([(301, '/x/'), (200, '')], '/blog/').startswith('đích sai')
    g = url_gsc(os.path.join(ROOT, 'data', 'gsc', 'pages.csv'))
    assert '/' in g and '/thi/' not in g and all(not la_ung_dung(p) for p in g), g
    print('test: OK (%d URL GSC có lượt nhấp, đã bỏ ứng dụng)' % len(g))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        test(); sys.exit(0)
    sys.exit(chay(a[a.index('--base') + 1].rstrip('/') if '--base' in a else 'https://velisrealty.vn', '--ung-dung-chuan' in a))
