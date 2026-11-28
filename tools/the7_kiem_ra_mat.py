#!/usr/bin/env python3
"""Kiểm bước 6 kế hoạch ra mắt (docs/KE-HOACH-RA-MAT.md) – 15 phút sau khi bật công tắc. CHỈ ĐỌC (GET/HEAD).

  1. robots.txt: không "Disallow: /" cho mọi bot, có dòng Sitemap của site;
  2. 10 trang mẫu: 200, meta robots + X-Robots-Tag không noindex, 0 chuỗi "staging." trong HTML (canonical, og, link, ảnh);
  3. sitemap_index.xml + mọi sitemap con: 200, có <loc>, đủ loại post/page/category, 0 "staging.";
  4. URL có lượt nhấp (data/gsc/pages.csv): 200 hoặc đúng 1 bước 301 tới trang 200;
  5. bảng chuyển hướng (data/the7/ra-mat/chuyen-huong-mau.csv – mỗi quy tắc Rank Math đang bật 1–2 URL mẫu): 1 bước đúng đích, đích 200;
  6. 7 ứng dụng: CHỈ HEAD (CLAUDE.md), so mã với mốc – nội dung / dữ liệu ứng dụng do người dùng tự mở kiểm;
  7. (2026-11-25, dùng hằng ngày) REST contact-form-7/v1 có trong /wp-json/ (CF7 đang chạy);
  8. (2026-11-25, dùng hằng ngày) MỌI URL trong sitemap (bỏ cache bằng ?nc=…): 0 shortcode in thô; trang có khối "Nhận bảng giá"
     (class velis-cta) có đúng 1 form CF7 và form nằm trong khối. --chi-hang-ngay: chỉ chạy 7 + 8.

Dùng: python3 -I tools/the7_kiem_ra_mat.py [--base https://velisrealty.vn] [--ung-dung-chuan] [--chi-hang-ngay]   (staging: env STAGING_VIEW_PASSWORD)
      python3 -I tools/the7_kiem_ra_mat.py --ghi-moc   NGAY TRƯỚC khi bật: ghi mã HEAD hiện tại của 7 ứng dụng vào MOC_UD
      (lần kiểm sau so với mốc này thay cho mốc 2026-11-14).
      python3 -I tools/the7_kiem_ra_mat.py --test
Thoát 0 = đạt hết; 1 = có mục trượt → theo kế hoạch: quay lui bước 5.
"""
import csv, json, os, re, sys, time
from urllib.parse import urljoin, urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANG_MAU = ['/', '/du-an/', '/chu-dau-tu/', '/blog/', '/blog/the-prive/', '/can-ho-the-prive/', '/can-ho-persa-place/',
             '/huong-viet-holdings-la-ai/', '/gioi-thieu/', '/lien-he/']
UNG_DUNG = {  # mốc HEAD site thật 2026-11-14 (curl -sI)
    '/check-can-the-prive/': 405, '/check-sdt/': 200, '/cmgd/': 200, '/lucky-lead/': 302,
    '/meta-check/': 200, '/tao-qr-bank/': 200, '/thi/': 200, '/meta-check.zip': 200}
# noindex có chủ đích, giống site thật (chuyên mục blog đặt Rank Math "noindex" từ trước) – chỉ ghi chú, không tính trượt
NOINDEX_BIET = {'/blog/'}
MOC_UD = os.path.join(ROOT, 'data', 'the7', 'ra-mat', 'moc-ung-dung.json')
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


# shortcode in thô: "[tên" của shortcode hay dùng trên site, kể cả khi wptexturize đổi nháy (&#8221; …); bỏ script/style/textarea
SC_THO = re.compile(r'\[/?(?:contact-form-7|vc_\w+|ez-toc|ultimate_\w+|ult_\w+|dt_\w+|velis_\w+|rank_math\w*|gallery|caption)\b')
KHOI_NBG = re.compile(r'class="[^"]*(?<![\w-])velis-cta(?=["\s])')
FORM = re.compile(r'<form\b[^>]*class="[^"]*\bwpcf7-form\b')


def shortcode_tho(html):
    than = re.sub(r'(?is)<(script|style|textarea|noscript)\b.*?</\1>|<!--.*?-->', '', html)
    than = re.sub(r'(?s)<[^>]+>', ' ', than)  # chỉ xét chữ hiển thị, không xét thuộc tính
    return sorted(set(m.group(0) for m in SC_THO.finditer(than)))


def form_nbg_loi(html):
    """'' nếu trang không có khối Nhận bảng giá, hoặc có đúng 1 form và form nằm trong khối; không thì mô tả lỗi."""
    k = KHOI_NBG.search(html)
    if not k:
        return ''
    f = [m.start() for m in FORM.finditer(html)]
    if len(f) != 1:
        return '%d form (phải 1)' % len(f)
    # shortcut: "trong khối" = form bắt đầu sau đầu khối ≤ 20 000 ký tự HTML; nếu khối dài hơn → đo bằng trình duyệt
    return '' if 0 < f[0] - k.start() <= 20000 else 'form không nằm trong khối Nhận bảng giá'


def phien(base):
    import requests
    from urllib3.util.retry import Retry
    s = requests.Session(); s.verify = '/root/.ccr/ca-bundle.crt'
    s.mount('https://', requests.adapters.HTTPAdapter(max_retries=Retry(total=4, connect=4, read=4, backoff_factor=2, status_forcelist=(), allowed_methods=None, raise_on_status=False)))
    s.headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Mobile Safari/537.36'
    if 'staging.' in base:  # trang khóa mật khẩu xem (Password Protected)
        pw = os.environ.get('STAGING_VIEW_PASSWORD') or open(os.environ['VIEW_PASSWORD_FILE'], encoding='utf-8').read().strip()
        login = base + '/?password-protected=login&redirect_to=' + base + '/'
        s.get(login); s.post(login, data={'password_protected_pwd': pw, 'password_protected_cookie_test': '1', 'password-protected': 'login', 'redirect_to': base + '/'})
    return s


def chay(base, chuan_ung_dung, chi_hang_ngay=False):
    t0 = time.time(); s = phien(base); loi = []; host = urlsplit(base).netloc
    nhom = []  # (tên nhóm, số mục, số lỗi trước nhóm)

    def mo(ten, n):
        nhom.append([ten, n, len(loi)])

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

    mo('REST contact-form-7/v1 có trong /wp-json/ (Contact Form 7 đang chạy)', 1)
    r = s.get(base + '/wp-json/', timeout=60)
    if 'contact-form-7/v1' not in (r.json().get('namespaces', []) if r.ok else []):
        loi.append('REST: không có contact-form-7/v1 (HTTP %s) – CF7 không chạy, mọi form in thô' % r.status_code)
    idx = s.get(base + '/sitemap_index.xml', timeout=60)
    urls = []
    for c in (re.findall(r'<loc>([^<]+)</loc>', idx.text) if idx.ok else []):
        urls += re.findall(r'<loc>([^<]+)</loc>', s.get(c, timeout=60).text)
    if not urls and 'staging.' in base:  # staging chặn sitemap (403) → danh sách trang + bài đã xuất bản qua REST (WP_* theo wp_cred)
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from wp_cred import wp_auth
        for loai in ('pages', 'posts'):
            for trang in range(1, 20):
                r = s.get('%s/wp-json/wp/v2/%s' % (base, loai), params={'per_page': 100, 'page': trang, '_fields': 'link'}, auth=wp_auth(base), timeout=60)
                if r.status_code != 200 or not r.json():
                    break
                urls += [x['link'] for x in r.json()]
    urls = [u for u in dict.fromkeys(urls) if urlsplit(u).netloc == host and not la_ung_dung(urlsplit(u).path)]
    if not urls:
        loi.append('không lấy được URL nào (sitemap_index.xml HTTP %s)' % idx.status_code)
    mo('%d URL sitemap: 0 shortcode in thô; khối Nhận bảng giá có đúng 1 form trong khối' % len(urls), len(urls))
    n_nbg = 0
    for u in urls:
        r = s.get(u + ('&' if '?' in u else '?') + 'nc=%d' % (time.time() * 1000), timeout=60)
        if r.status_code != 200:
            loi.append('sitemap %s: HTTP %s' % (urlsplit(u).path, r.status_code)); continue
        tho = shortcode_tho(r.text); fl = form_nbg_loi(r.text); n_nbg += bool(KHOI_NBG.search(r.text))
        if tho:
            loi.append('shortcode thô %s: %s' % (urlsplit(u).path, ', '.join(tho)))
        if fl:
            loi.append('Nhận bảng giá %s: %s' % (urlsplit(u).path, fl))
    print('  (ghi chú) %d / %d URL có khối Nhận bảng giá' % (n_nbg, len(urls)))
    if chi_hang_ngay:
        return ket_qua(base, nhom, loi, t0, '%d URL sitemap' % len(urls))
    mo('robots.txt (không chặn toàn site, có Sitemap)', 1)
    r = s.get(base + '/robots.txt', timeout=60)
    loi += ['robots: ' + x for x in robots_loi(r.text if r.ok else '', base)]
    mo('10 trang mẫu: 200, không noindex (meta + X-Robots-Tag), 0 chuỗi "staging."', len(TRANG_MAU))
    for p in TRANG_MAU:
        r = s.get(base + p, timeout=60)
        if r.status_code != 200:
            loi.append('trang %s: %s' % (p, r.status_code)); continue
        if noindex(r.text, r.headers):
            if p in NOINDEX_BIET:
                print('  (ghi chú) %s noindex – cài đặt có sẵn của chuyên mục, giống site thật' % p)
            else:
                loi.append('trang %s: noindex' % p)
        if staging_trong(r.text):
            loi.append('trang %s: %d chuỗi staging' % (p, staging_trong(r.text)))
    mo('sitemap_index.xml + mọi sitemap con: 200, có <loc>, 0 "staging."', 1)
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
    mo('%d URL có lượt nhấp (Search Console): 200 hoặc 1 bước 301 → 200' % len(gsc), len(gsc))
    for p in gsc:
        x = phan_xu(buoc(p))
        if x:
            loi.append('GSC %s: %s' % (p, x))
    mau = list(csv.DictReader(open(os.path.join(ROOT, 'data', 'the7', 'ra-mat', 'chuyen-huong-mau.csv'), encoding='utf-8')))
    mo('%d URL mẫu của mọi quy tắc chuyển hướng: 1 bước 301 đúng đích' % len(mau), len(mau))
    for m in mau:
        x = phan_xu(buoc(m['url_mau']), m['dich'])
        if x:
            loi.append('chuyển hướng %s: %s' % (m['url_mau'], x))
    moc = json.load(open(MOC_UD)) if os.path.exists(MOC_UD) else UNG_DUNG
    mo('7 ứng dụng (+ meta-check.zip): HEAD đúng mã mốc %s' % ('ghi ngay trước khi bật' if moc is not UNG_DUNG else '2026-11-14')
       + ('' if chuan_ung_dung else ' – chỉ ghi chú'), len(moc))
    for p, ma in moc.items():
        h = s.head(base + p, allow_redirects=False, timeout=60).status_code
        if h != ma:
            (loi if chuan_ung_dung else []).append('ứng dụng %s: HEAD %s (mốc %s)' % (p, h, ma))
            if not chuan_ung_dung:
                print('  (ghi chú) ứng dụng %s: HEAD %s, mốc site thật %s' % (p, h, ma))
    return ket_qua(base, nhom, loi, t0, '%d trang mẫu, %d sitemap con, %d URL GSC, %d URL chuyển hướng mẫu, %d ứng dụng (HEAD)'
                   % (len(TRANG_MAU), len(con), len(gsc), len(mau), len(UNG_DUNG)))


def ket_qua(base, nhom, loi, t0, tom_tat):
    print('%s – %s – %.0f s' % (base, tom_tat, time.time() - t0))
    for i, (ten, n, dau) in enumerate(nhom):
        cuoi = nhom[i + 1][2] if i + 1 < len(nhom) else len(loi)
        print('  %-7s %s%s' % ('ĐẠT' if cuoi == dau else 'TRƯỢT', ten, '' if cuoi == dau else ' – %d lỗi' % (cuoi - dau)))
    print('KẾT QUẢ: ' + ('ĐẠT' if not loi else 'TRƯỢT %d mục → theo kế hoạch: quay lui (sửa lại $table_prefix = \'velis_\')' % len(loi)))
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
    assert shortcode_tho('<p>[contact-form-7 id=&#8221;20958&#8243; title=&#8221;X&#8221;]</p>') == ['[contact-form-7']
    assert shortcode_tho('<p>[vc_row][/vc_row] [ez-toc]</p>') == ['[/vc_row', '[ez-toc', '[vc_row']
    assert shortcode_tho('<script>x="[vc_row]"</script><textarea>[velis_khoi]</textarea><a title="[dt_x]">Giá [tên dự án]</a>') == []
    nbg = '<div class="vc_row velis-cta"><h2>Nhận bảng giá</h2><form action="/" class="wpcf7-form init"></form></div>'
    assert form_nbg_loi('<div class="velis-cta-bar"></div>') == '' and form_nbg_loi(nbg) == ''
    assert form_nbg_loi('<div class="velis-cta">[contact-form-7 id=&#8221;1&#8243;]</div>') == '0 form (phải 1)'
    assert form_nbg_loi(nbg + '<form class="wpcf7-form"></form>') == '2 form (phải 1)'
    assert form_nbg_loi('<form class="wpcf7-form"></form><div class="velis-cta"></div>').startswith('form không nằm')
    print('test: OK (%d URL GSC có lượt nhấp, đã bỏ ứng dụng)' % len(g))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        test(); sys.exit(0)
    if a == ['--ghi-moc']:
        s = phien('https://velisrealty.vn')
        moc = {p: s.head('https://velisrealty.vn' + p, allow_redirects=False, timeout=60).status_code for p in UNG_DUNG}
        json.dump(moc, open(MOC_UD, 'w'), indent=1); print('mốc ứng dụng (HEAD):', moc, '→', MOC_UD); sys.exit(0)
    sys.exit(chay(a[a.index('--base') + 1].rstrip('/') if '--base' in a else 'https://velisrealty.vn', '--ung-dung-chuan' in a,
                  '--chi-hang-ngay' in a))
