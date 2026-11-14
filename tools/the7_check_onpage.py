#!/usr/bin/env python3
"""On-page check for the The7 staging (Bước 3). Read-only: GET only, no login to wp-admin, no form.

URL set = published posts/pages/categories from REST (app password, read) + every URL of the live baseline crawl mapped to
staging (date archives, pagination, author pages). The 7 apps are never requested. Per URL: status/redirect, title, meta,
robots, canonical, H1 count, images without alt in content, junk captions; then every internal link found in content is
checked once (4xx = broken, 3xx = link to a redirect).

Staging runs with "discourage search engines" on, so every page carries noindex: robots is only reported, the paginated
noindex rule is checked from Rank Math's own setting by the caller (see docs/reports/the7-buoc-3.md).

Usage:
  REQUESTS_CA_BUNDLE=/root/.ccr/ca-bundle.crt VIEW_PASSWORD_FILE=… python3 -I tools/the7_check_onpage.py out.json
  python3 -I tools/the7_check_onpage.py --self-test
"""
import concurrent.futures as cf
import csv
import html
import json
import os
import re
import sys
import time
from urllib.parse import urljoin, urlsplit

BASE = 'https://staging.velisrealty.vn'
APPS = ('/check-can-the-prive/', '/check-sdt/', '/cmgd/', '/lucky-lead/', '/meta-check/', '/tao-qr-bank/', '/thi/', '/meta-check.zip')
SKIP = re.compile(r'^/(wp-admin|wp-json|wp-login|wp-content|wp-includes|xmlrpc|feed)|/feed/?$|\.(xml|kml|jpe?g|png|webp|gif|svg|pdf|zip)$', re.I)
DATE = re.compile(r'^/\d{4}/(\d{2}/)?(\d{2}/)?(page/\d+/)?$')
PAGED = re.compile(r'/page/\d+/?$')
OLD_BLOG = re.compile(r'^/blog-bds(/|$)')  # chuyên mục cũ, gộp vào /blog/ ở bước 5 (301 một bước, giữ số trang)
# C2 (đánh giá độc lập): link tới tên miền staging trong nội dung – dạng mã hóa URL (`url:https%3A%2F%2Fstaging…` của phần tử
# WPBakery) không được search-replace thường thay khi ra mắt → phải là 0; dạng thường được thay khi chuyển dữ liệu, chỉ đếm.
STAGING_ENC = re.compile(r'https?%3A%2F%2Fstaging\.velisrealty\.vn|%2F%2Fstaging\.velisrealty\.vn', re.I)
STAGING_PLAIN = re.compile(r'https?://staging\.velisrealty\.vn', re.I)


def staging_refs(raw):
    """(số chỗ search-replace không thấy, số chỗ dạng thường) trỏ tới staging trong content.raw. "Không thấy" = dạng mã hóa URL
    + mọi link staging nằm trong khối Raw HTML/JS (WPBakery lưu base64)."""
    import base64
    from urllib.parse import unquote
    hidden = len(STAGING_ENC.findall(raw))
    for b in re.findall(r'\[vc_raw_(?:html|js)[^\]]*\](.*?)\[/vc_raw_(?:html|js)\]', raw, re.S):
        try:
            t = unquote(base64.b64decode(b.strip()).decode('utf-8', 'replace'))
        except ValueError:
            continue
        hidden += len(STAGING_ENC.findall(t)) + len(STAGING_PLAIN.findall(t))
    return hidden, len(STAGING_PLAIN.findall(raw))


JUNK_CAPTION = re.compile(r'(\.(jpe?g|png|webp|gif)\b|^(img|dsc|dcim|screenshot|z\d{6,}|ảnh chụp màn hình)[\s_-]*\d*|^[a-z0-9]+(?:[-_][a-z0-9]+){2,}$|^\d[\d_-]{5,}$)', re.I)


def is_app(path):
    return any(path == a or path.startswith(a) for a in APPS)


def internal(href, base=BASE):
    """Normalised internal URL (no query/fragment) or None."""
    if not href or href.startswith(('#', 'mailto:', 'tel:', 'javascript:')):
        return None
    u = urlsplit(urljoin(base + '/', html.unescape(href)))
    if u.netloc not in (urlsplit(base).netloc, 'velisrealty.vn', 'www.velisrealty.vn'):
        return None
    if SKIP.search(u.path) or is_app(u.path) or u.query:
        return None
    return BASE + (u.path or '/')


def content_html(page):
    """Main content area of a The7 page: from #content to the sidebar or footer (header/menu/footer links left out)."""
    m = re.search(r'<div id="content"[^>]*>(.*?)(?:<aside id="sidebar"|<footer)', page, re.S)
    return m.group(1) if m else page


def junk_alt(alt):
    """Alt text that is a file name, not a description: 'IMG_0001', 'persa place 28', 'vi tri spring ville'."""
    return bool(JUNK_CAPTION.search(alt)) or (alt.isascii() and alt == alt.lower() and any(c.isalpha() for c in alt))


def parse(url, status, location, page):
    rec = {'url': url, 'status': status, 'location': location}
    if status != 200:
        return rec
    meta = lambda name: (re.search(r'<meta (?:name|property)="%s" content="([^"]*)"' % name, page) or [None, None])[1]
    t = re.search(r'<title>(.*?)</title>', page, re.S)
    can = re.search(r'<link rel="canonical" href="([^"]*)"', page)
    body = content_html(page)
    rec.update(
        title=html.unescape(t.group(1).strip()) if t else '',
        desc=html.unescape(meta('description') or ''),
        robots=meta('robots') or '',
        canonical=can.group(1) if can else '',
        h1=len(re.findall(r'<h1[\s>]', page)),
        img_no_alt=sorted({m for m in re.findall(r'<img(?![^>]*\balt=")[^>]*\bsrc="([^"]+)"', body)}),
        img_junk_alt=sorted({a for a in (html.unescape(x) for x in re.findall(r'<img[^>]*\balt="([^"]+)"', body)) if junk_alt(a)}),
        img_empty_alt=sorted({m for m in re.findall(r'<img[^>]*\balt=""[^>]*\bsrc="([^"]+)"', body) if 'data:image' not in m}),
        captions=[c for c in (html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.findall(
            r'<(?:figcaption|p class="wp-caption-text"|div class="vc_figure-caption")[^>]*>(.*?)</(?:figcaption|p|div)>', body, re.S)) if JUNK_CAPTION.search(c)],
        links=sorted({i for i in (internal(h) for h in re.findall(r'<a [^>]*href="([^"]*)"', body)) if i}),
    )
    return rec


def rules(rec, link_status):
    """Issues for one parsed page. link_status: {url: (status, location)}."""
    out = []
    path = urlsplit(rec['url']).path
    if DATE.match(path):
        if not (rec['status'] == 301 and (rec['location'] or '').rstrip('/').endswith('/blog')):
            out.append(('date', f"lưu trữ ngày trả {rec['status']} {rec['location'] or ''}, cần 301 → /blog/"))
        return out
    if OLD_BLOG.match(path):
        loc = urlsplit(rec['location'] or '').path
        page = PAGED.search(path)
        if rec['status'] != 301 or not loc.startswith('/blog/') or (page and not loc.endswith(page.group(0).rstrip('/') + '/')):
            out.append(('blog-bds', f"{rec['status']} {rec['location'] or ''}, cần 301 một bước → /blog/…"))
        return out
    if path == '/blog/' and rec['status'] != 200:
        out.append(('blog', f"/blog/ trả {rec['status']}"))
    if rec['status'] != 200:
        return out
    n = len(rec['title'])
    if not rec['title'] or n > 60:
        out.append(('title', f'title {n} ký tự'))
    n = len(rec['desc'])
    if not rec['desc'] or n > 155:
        out.append(('meta', f'meta {n} ký tự'))
    if rec['h1'] != 1:
        out.append(('h1', f"{rec['h1']} thẻ H1"))
    if PAGED.search(path) and 'noindex' not in rec['robots']:
        out.append(('robots', 'trang 2+ không noindex'))
    if rec['canonical'] and not PAGED.search(path) and rec['canonical'] != rec['url']:
        out.append(('canonical', f"canonical {rec['canonical']}"))
    for l in rec['links']:
        if OLD_BLOG.match(urlsplit(l).path):
            out.append(('link-blog-bds', l))
        st, loc = link_status.get(l, (None, None))
        if st and 400 <= st < 500:
            out.append(('link4xx', f'{l} → {st}'))
        elif st and 300 <= st < 400:
            out.append(('link3xx', f'{l} → {st} {loc}'))
    for c in rec['captions']:
        out.append(('caption', c))
    for s in rec['img_no_alt']:
        out.append(('alt', s))
    for a in rec['img_junk_alt']:
        out.append(('alt-junk', a))
    return out


def self_test():
    assert internal('/2026/04/') == BASE + '/2026/04/'
    assert internal('https://velisrealty.vn/thi/') is None and internal('/cmgd/x/') is None
    assert internal('https://staging.velisrealty.vn/wp-content/uploads/a.webp') is None
    assert internal('https://example.com/') is None and internal('tel:0911') is None
    assert DATE.match('/2026/04/20/') and DATE.match('/2026/') and DATE.match('/2026/04/page/2/') and not DATE.match('/2026-gia/')
    for junk in ('IMG_1234.jpg', 'z5432109876543_abc', 'phoi-canh-masteri-cosmo-1', 'DSC 0001', '20260411_101010'):
        assert JUNK_CAPTION.search(junk), junk
    for ok in ('Phối cảnh minh họa – nguồn: CĐT', 'Mặt bằng tầng điển hình', 'Ảnh: Masterise Homes'):
        assert not JUNK_CAPTION.search(ok) and not junk_alt(ok), ok
    assert junk_alt('persa place 28') and junk_alt('vi tri spring ville') and not junk_alt('Velis Realty') and not junk_alt('Sân bay Long Thành')
    page = ('<title>T &amp; A</title><meta name="description" content="' + 'x' * 156 + '"/><meta name="robots" content="follow, index"/>'
            '<link rel="canonical" href="https://staging.velisrealty.vn/a/" /><h1>A</h1><div id="content"><a href="/b/">b</a>'
            '<a href="/thi/">app</a><img src="u.webp"><img alt="persa place 27" src="v.webp"><figure><figcaption>IMG_0001.jpg</figcaption></figure></div><footer><a href="/c/">c</a></footer>')
    rec = parse(BASE + '/a/', 200, None, page)
    assert rec['title'] == 'T & A' and rec['links'] == [BASE + '/b/'] and rec['img_no_alt'] == ['u.webp'] and rec['captions'] == ['IMG_0001.jpg']
    kinds = sorted(k for k, _ in rules(rec, {BASE + '/b/': (404, None)}))
    assert kinds == ['alt', 'alt-junk', 'caption', 'link4xx', 'meta'], kinds
    paged = parse(BASE + '/blog/page/2/', 200, None, page.replace('follow, index', 'follow, index'))
    assert ('robots', 'trang 2+ không noindex') in rules(paged, {})
    assert rules({'url': BASE + '/2026/04/', 'status': 301, 'location': BASE + '/blog/'}, {}) == []
    assert rules({'url': BASE + '/2026/04/', 'status': 200, 'location': None}, {})[0][0] == 'date'
    ok301 = lambda src, loc: rules({'url': BASE + src, 'status': 301, 'location': BASE + loc}, {})
    assert ok301('/blog-bds/', '/blog/') == [] and ok301('/blog-bds/blog-the-prive/page/3/', '/blog/the-prive/page/3/') == []
    assert ok301('/blog-bds/page/3/', '/blog/')[0][0] == 'blog-bds'  # mất số trang
    assert ok301('/blog-bds/blog-ansana/', '/blog-bds/ansana/')[0][0] == 'blog-bds'  # chuỗi qua /blog-bds/
    assert rules({'url': BASE + '/blog-bds/', 'status': 200, 'location': None}, {})[0][0] == 'blog-bds'
    assert rules({'url': BASE + '/blog/', 'status': 404, 'location': None}, {})[0][0] == 'blog'
    import base64
    from urllib.parse import quote
    raw_html = base64.b64encode(quote('<a href="https://staging.velisrealty.vn/x/">x</a>', safe='').encode()).decode()
    assert staging_refs('[dt_default_button link="url:https%3A%2F%2Fstaging.velisrealty.vn%2Flien-he%2F|title:a"]') == (1, 0)
    assert staging_refs('<a href="https://staging.velisrealty.vn/a/">a</a> [vc_raw_html]' + raw_html + '[/vc_raw_html]') == (1, 1)
    assert staging_refs('<a href="/a/">a</a> url:%2Flien-he%2F') == (0, 0)
    rec2 = parse(BASE + '/a/', 200, None, page.replace('/b/', '/blog-bds/blog-ansana/'))
    assert 'link-blog-bds' in [k for k, _ in rules(rec2, {})]
    print('self-test ok')


def main(out):
    import requests
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    ca = os.environ.get('REQUESTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
    api = requests.Session(); api.verify = ca; api.auth = (os.environ['WP_USER'], os.environ['WP_APP_PASSWORD'])

    def getall(path, **params):
        res, page = [], 1
        while True:
            r = api.get(f'{BASE}/wp-json/{path}', params={'per_page': 100, 'page': page, **params}, timeout=60)
            if r.status_code == 401:
                raise SystemExit('REST 401 – dừng, không thử lại')
            r.raise_for_status(); res += r.json()
            if page >= int(r.headers.get('X-WP-TotalPages', 1)):
                return res
            page += 1

    items = [x for t in ('posts', 'pages') for x in getall(f'wp/v2/{t}', status='publish', context='edit', _fields='id,link,content')]
    urls = {x['link'] for x in items}
    refs = {x['link']: staging_refs(x['content']['raw']) for x in items}
    urls |= {x['link'] for x in getall('wp/v2/categories', _fields='link,count') if x['count']}
    base_csv = os.path.join(os.path.dirname(__file__), '..', 'data', 'baseline', 'baseline.csv')
    for row in csv.DictReader(open(base_csv, encoding='utf-8')):
        u = internal(row['url'])
        if u:
            urls.add(u)
    urls = sorted(u for u in urls if not is_app(urlsplit(u).path))

    s = requests.Session(); s.verify = ca; s.headers['User-Agent'] = 'Mozilla/5.0 velis-staging-check'
    pw = open(os.environ['VIEW_PASSWORD_FILE']).read().strip()
    form = s.get(BASE + '/', timeout=60).text
    if 'password_protected_pwd' in form:
        r = s.post(BASE + '/', data={'password_protected_pwd': pw, 'password-protected': 'login', 'redirect_to': BASE + '/'}, timeout=60)
        if 'password_protected_pwd' in r.text:
            raise SystemExit('mật khẩu xem trang sai – dừng')

    def get(u, **kw):
        for wait in (2, 4, 8, 0):  # the proxy drops a connection now and then
            try:
                return s.get(u, allow_redirects=False, timeout=90, **kw)
            except requests.ConnectionError:
                if not wait:
                    raise
                time.sleep(wait)

    def fetch(u):
        r = get(u)
        return parse(u, r.status_code, r.headers.get('location'), r.text if r.status_code == 200 else '')

    with cf.ThreadPoolExecutor(6) as ex:
        recs = list(ex.map(fetch, urls))
    links = sorted({l for r in recs for l in r.get('links', [])} - {r['url'] for r in recs if r['status'] == 200})
    known = {r['url']: (r['status'], r['location']) for r in recs}

    def head(u):
        r = get(u, stream=True); r.close()
        return u, (r.status_code, r.headers.get('location'))

    with cf.ThreadPoolExecutor(6) as ex:
        known.update(dict(ex.map(head, links)))
    issues = {r['url']: rules(r, known) for r in recs}
    for u, (enc, plain) in refs.items():
        if enc:
            issues.setdefault(u, []).append(('staging-encoded', f'{enc} link staging mã hóa URL trong nội dung'))
    plain_total = sum(p for _, p in refs.values())
    summary = {}
    for lst in issues.values():
        for k, _ in lst:
            summary[k] = summary.get(k, 0) + 1
    summary['staging-plain(info)'] = plain_total
    json.dump({'urls': len(recs), 'summary': summary, 'pages': recs, 'issues': {u: i for u, i in issues.items() if i}},
              open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(recs), 'URL;', json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    if sys.argv[1:] == ['--self-test']:
        self_test()
    else:
        main(sys.argv[1])
