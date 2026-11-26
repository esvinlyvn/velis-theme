#!/usr/bin/env python3
"""Kiểm onpage + link nội bộ trên toàn sitemap (2026-11-26), khách xem, CHỈ ĐỌC:
  - tiêu đề <title> < 30 ký tự; URL chuyên mục cũ (mục A2) còn trong sitemap;
  - bài blog (chuyên mục cụm) có ≥ 1 link trong THÂN BÀI tới trang dự án / chủ đầu tư của cụm;
  - link nội bộ hỏng (thân bài + menu/footer): đích ≠ 200 sau tối đa 1 bước 301 (bỏ qua 7 ứng dụng, tệp upload, #, mailto/tel).
Dùng: python3 -I tools/the7_kiem_onpage_link.py <base> <out.json>   |   --test
"""
import json, re, sys, os, html, time
from urllib.parse import urlsplit, urljoin
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from the7_kiem_ra_mat import phien, la_ung_dung

CU = ['/du-an-bds/', '/du-an-bds/du-an-vinhomes/', '/du-an-bds/du-an-gamuda-land/', '/du-an-bds/du-an-masterise-homes/', '/du-an-bds/du-an-sungroup/',
      '/du-an-bds/du-an-ecopark/', '/du-an-bds/du-an-vinhomes/du-an-vinhomes-saigon-park/', '/du-an-bds/du-an-gamuda-land/du-an-spring-ville/', '/phan-khu/']
CUM = {'ansana': ['/ansana-by-kita/'], 'palm-city': ['/can-ho-palm-river/'], 'spring-ville': ['/spring-ville/', '/can-ho-persa-place/', '/du-an/gamuda-land/'],
       'the-global-city': ['/the-global-city/', '/du-an/masterise-homes/'], 'the-prive': ['/can-ho-the-prive/'],
       'vinhomes': ['/du-an/vinhomes/', '/vinhomes-saigon-park/'], 'vinhomes-saigon-park': ['/vinhomes-saigon-park/', '/du-an/vinhomes/']}


def than_bai(h):
    m = re.search(r'class="entry-content[^"]*"(.*?)(?:id="sidebar"|class="single-related-posts|id="footer")', h, re.S)
    return m.group(1) if m else ''


def cum_cua(h):
    """Cụm blog của bài: class category-<slug> trên <article id="post-…"> (The7)."""
    m = re.search(r'<article id="post-\d+" class="([^"]*)"', h)
    return next((c for c in re.findall(r'\bcategory-([a-z][a-z0-9-]*)', m.group(1)) if c in CUM), None) if m else None


def co_link_cum(body, cum):
    return any(re.search(r'href="[^"]*' + re.escape(d) + r'"', body) for d in CUM[cum])


def main(base, out):
    s = phien(base); host = urlsplit(base).netloc
    urls = []
    for c in re.findall(r'<loc>([^<]+)</loc>', s.get(base + '/sitemap_index.xml').text):
        urls += re.findall(r'<loc>([^<]+)</loc>', s.get(c).text)
    paths = [p for p in dict.fromkeys(urlsplit(u).path for u in urls) if not la_ung_dung(p)]
    kq = {'tieu_de_ngan': [], 'cu_trong_sitemap': [p for p in paths if p in CU], 'bai_thieu_link_cum': [], 'link_hong': {}, 'so_url': len(paths)}
    dich = {}
    for p in paths:
        r = s.get(base + p + '?nc=%d' % (time.time() * 1000))
        if 'html' not in r.headers.get('Content-Type', ''):
            kq.setdefault('khong_phai_html', []).append([p, r.headers.get('Content-Type', '')]); continue
        h = r.text
        t = html.unescape(re.search(r'<title>(.*?)</title>', h, re.S).group(1)).strip()
        if len(t) < 30:
            kq['tieu_de_ngan'].append([p, t])
        bd = re.search(r'<body[^>]*class="([^"]*)"', h)
        cum = cum_cua(h) if bd and 'single-post' in bd.group(1).split() else None
        body = than_bai(h)
        if cum:
            kq['so_bai_cum'] = kq.get('so_bai_cum', 0) + 1
        if cum and not co_link_cum(body, cum):
            kq['bai_thieu_link_cum'].append([p, cum])
        for href in re.findall(r'<a\b[^>]*href="([^"#]+)', h):
            u = urlsplit(urljoin(base + p, html.unescape(href)))
            if u.netloc != host or la_ung_dung(u.path) or '/wp-content/' in u.path or u.path.startswith('/wp-admin') or u.query:
                continue
            dich.setdefault(u.path, set()).add(p)
    for d, nguon in dich.items():
        r = s.get(base + d, allow_redirects=False, timeout=60)
        if r.status_code in (301, 302, 308):
            r = s.get(urljoin(base + d, r.headers['Location']), allow_redirects=False, timeout=60)
        if r.status_code != 200:
            kq['link_hong'][d] = [r.status_code, sorted(nguon)[:5]]
    kq['so_dich'] = len(dich)
    json.dump(kq, open(out, 'w'), ensure_ascii=False, indent=1)
    print(f"{kq['so_url']} URL, {kq['so_dich']} đích nội bộ | tiêu đề < 30: {len(kq['tieu_de_ngan'])} | URL cũ trong sitemap: {len(kq['cu_trong_sitemap'])} | "
          f"bài thiếu link cụm: {len(kq['bai_thieu_link_cum'])}/{kq.get('so_bai_cum', 0)} bài cụm | link hỏng: {len(kq['link_hong'])}")
    for k in ('tieu_de_ngan', 'cu_trong_sitemap', 'bai_thieu_link_cum'):
        for x in kq[k]: print('  ', k, x)
    for d, v in kq['link_hong'].items(): print('   link_hong', d, v)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert co_link_cum('<a href="https://x/can-ho-the-prive/">x</a>', 'the-prive') and not co_link_cum('<a href="/blog/the-prive/">', 'the-prive')
        assert cum_cua('<article id="post-1" class="post category-the-prive category-48">') == 'the-prive' and cum_cua('<body class="x">') is None
        assert cum_cua('<article id="post-2" class="post category-du-an-bds category-34">') is None
        print('test ok'); sys.exit()
    if len(a) < 2:
        sys.exit(__doc__)
    main(a[0].rstrip('/'), a[1])
