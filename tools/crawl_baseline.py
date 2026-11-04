"""Read-only SEO baseline crawl of a site (no auth). Usage:
    python3 -I tools/crawl_baseline.py https://velisrealty.vn data/baseline
Writes <out>/raw/pages.jsonl (ignored by git), <out>/baseline.csv and <out>/links.csv.
"""
import csv, json, os, re, sys, threading, queue, urllib.parse as up
import requests
from bs4 import BeautifulSoup

# 7 ứng dụng trong public_html: không bao giờ truy cập (SCOPE.md)
EXCLUDE = ('/check-can-the-prive', '/check-sdt', '/cmgd', '/lucky-lead', '/meta-check', '/tao-qr-bank', '/thi')
SKIP_EXT = re.compile(r'\.(jpe?g|png|webp|avif|gif|svg|pdf|zip|mp4|webm|css|js|ico|xml|txt|docx?|xlsx?)$', re.I)
UA = 'VelisBaselineCrawler/1.0 (read-only audit)'


def excluded(path):
    return any(path == p or path.startswith(p + '/') or path.startswith(p + '.') for p in EXCLUDE)


assert excluded('/thi/') and excluded('/thi') and excluded('/meta-check.zip') and not excluded('/thi-truong/')


def norm(base_host, href, cur):
    u = up.urlsplit(up.urljoin(cur, href))
    if u.scheme not in ('http', 'https') or u.netloc != base_host:
        return None
    return up.urlunsplit((u.scheme, u.netloc, u.path or '/', u.query, ''))


def crawlable(url):
    u = up.urlsplit(url)
    p = u.path
    return not (excluded(p) or u.query or SKIP_EXT.search(p) or p.startswith(('/wp-admin', '/wp-json', '/wp-content', '/wp-includes', '/wp-login'))
                or '/feed' in p)


def parse(url, r):
    rec = {'url': url, 'status': r.status_code, 'final_url': r.url if r.url != url else '',
           'location': r.headers.get('location', ''), 'x_robots': r.headers.get('x-robots-tag', ''),
           'content_type': r.headers.get('content-type', '').split(';')[0]}
    if r.status_code != 200 or 'html' not in rec['content_type']:
        return rec, []
    s = BeautifulSoup(r.text, 'lxml')
    meta = lambda n: (s.find('meta', attrs={'name': n}) or {}).get('content', '') if s.find('meta', attrs={'name': n}) else ''
    can = s.find('link', rel='canonical')
    types = []
    for sc in s.find_all('script', type='application/ld+json'):
        try:
            d = json.loads(sc.string or '')
        except ValueError:
            types.append('INVALID_JSON'); continue
        items = d.get('@graph', [d]) if isinstance(d, dict) else d
        for it in items:
            t = it.get('@type') if isinstance(it, dict) else None
            types += t if isinstance(t, list) else [t] if t else []
    h1s = [h.get_text(' ', strip=True) for h in s.find_all('h1')]
    links = []
    for a in s.find_all('a', href=True):
        n = norm(up.urlsplit(url).netloc, a['href'], url)
        if n:
            links.append((n, a.get_text(' ', strip=True)[:120], 'nofollow' in (a.get('rel') or [])))
    for t in s(['script', 'style', 'noscript', 'header', 'footer', 'nav']):
        t.decompose()
    rec.update(title=(s.title.get_text(strip=True) if s.title else ''), meta_description=meta('description'),
               robots=meta('robots'), canonical=can.get('href', '') if can else '', h1_count=len(h1s), h1=' | '.join(h1s),
               schema_types=','.join(sorted(set(types))), words=len((s.body or s).get_text(' ', strip=True).split()),
               internal_links=len(links), internal_links_unique=len({l[0] for l in links}))
    return rec, links


def sitemap_urls(base, sess):
    out, todo = [], [base + '/sitemap_index.xml']
    while todo:
        r = sess.get(todo.pop(), timeout=30)
        locs = re.findall(r'<loc>([^<]+)</loc>', r.text)
        (todo if '<sitemapindex' in r.text else out).extend(locs)
    return out


def main(base, out, limit=3000, workers=4):
    os.makedirs(out + '/raw', exist_ok=True)
    host = up.urlsplit(base).netloc
    sess = requests.Session(); sess.headers['User-Agent'] = UA
    sm = sitemap_urls(base, sess)
    seen, q, lock = set(), queue.Queue(), threading.Lock()
    recs, edges = {}, []
    for u in [base + '/'] + sm:
        if crawlable(u) and u not in seen:
            seen.add(u); q.put(u)

    def worker():
        while True:
            try:
                u = q.get(timeout=10)
            except queue.Empty:
                return
            try:
                r = sess.get(u, timeout=30, allow_redirects=False)
                rec, links = parse(u, r)
            except requests.RequestException as e:
                rec, links = {'url': u, 'status': 0, 'error': str(e)[:200]}, []
            rec['in_sitemap'] = u in smset
            with lock:
                recs[u] = rec
                for l, txt, nf in links:
                    edges.append((u, l, txt, nf))
                nxt = [l for l, _, _ in links] + ([norm(host, rec['location'], u)] if rec.get('location') else [])
                for l in nxt:
                    if l and l not in seen and crawlable(l) and len(seen) < limit:
                        seen.add(l); q.put(l)
            q.task_done()

    smset = set(sm)
    ts = [threading.Thread(target=worker) for _ in range(workers)]
    [t.start() for t in ts]; [t.join() for t in ts]

    inlinks = {}
    for src, dst, _, _ in edges:
        inlinks.setdefault(dst, set()).add(src)
    with open(out + '/raw/pages.jsonl', 'w') as f:
        for r in recs.values():
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
    cols = ['url', 'status', 'location', 'in_sitemap', 'title', 'meta_description', 'h1_count', 'h1', 'canonical', 'robots',
            'x_robots', 'schema_types', 'words', 'internal_links_unique', 'inlinks']
    with open(out + '/baseline.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, cols, extrasaction='ignore'); w.writeheader()
        for u in sorted(recs):
            w.writerow({**recs[u], 'inlinks': len(inlinks.get(u, ()))})
    with open(out + '/raw/links.csv', 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['source', 'target', 'anchor', 'nofollow']); w.writerows(edges)
    print(f'{len(recs)} URLs, {len(edges)} internal link edges, sitemap URLs {len(sm)}')


if __name__ == '__main__':
    main(sys.argv[1].rstrip('/'), sys.argv[2])
