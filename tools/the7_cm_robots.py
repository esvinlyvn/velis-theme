#!/usr/bin/env python3
"""Robots chuyên mục blog (2026-11-26, người dùng yêu cầu): chuyên mục blog (cây /blog/ + Uncategorized) có bài (tính cả chuyên mục con) → index
như các chuyên mục cụm khác (XÓA meta rank_math_robots → theo mặc định Rank Math "index, follow, max-snippet…", Rank Math tự đưa vào sitemap);
rỗng → noindex, follow. Chuyên mục cũ /du-an-bds/… (301) và /phan-khu/ (lệnh người dùng) KHÔNG đụng. In bảng trước | sau (đọc thẻ robots như khách).
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_cm_robots.py <staging|that> <log.json> [--ghi]   |   --test
"""
import json, re, sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
BLOG = 40


def can(cats):
    """id → 'index' / 'noindex' cho chuyên mục blog: có bài ở chính nó hoặc chuyên mục con → index."""
    con = {}
    for c in cats:
        con.setdefault(c['parent'], []).append(c['id'])
    by = {c['id']: c for c in cats}
    tong = lambda i: by[i]['count'] + sum(tong(k) for k in con.get(i, []))
    cay, dem = [], [BLOG]
    while dem:
        i = dem.pop(); cay.append(i); dem += con.get(i, [])
    out = {i: ('index' if tong(i) > 0 else 'noindex') for i in cay}
    for c in cats:
        if c['slug'] == 'uncategorized':
            out[c['id']] = 'index' if c['count'] > 0 else 'noindex'
    return out


def main(site, log, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    from the7_kiem_ra_mat import phien
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    khach = phien(b)
    cats = s.get(f'{b}/wp-json/wp/v2/categories', params={'per_page': 100, '_fields': 'id,slug,name,parent,count,link'}).json()
    muon = can(cats); by = {c['id']: c for c in cats}
    def rb(link):
        h = khach.get(link, params={'_': int(time.time())} if False else None).text  # khách xem (LiteSpeed có thể trả bản cache – đã purge trước)
        m = re.search(r'<meta name="robots" content="([^"]*)"', h)
        return 'noindex' if m and 'noindex' in m.group(1) else ('index' if m else '(không thẻ)')
    out = []
    for i, ky in muon.items():
        c = by[i]; truoc = rb(c['link'])
        if ghi and truoc != ky:
            val = [] if ky == 'index' else ['noindex', 'follow']
            s.post(f'{b}/wp-json/rankmath/v1/updateMeta', json={'objectType': 'term', 'objectID': i, 'meta': {'rank_math_robots': val}}).raise_for_status()
        out.append({'id': i, 'url': c['link'].replace(b, ''), 'bai': c['count'], 'truoc': truoc, 'muon': ky})
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)
    for r in out:
        print(f"{r['id']:3} {r['url']:40} bài {r['bai']:3} | trước {r['truoc']:8} → {r['muon']}")


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        cats = [{'id': 40, 'parent': 0, 'count': 0, 'slug': 'blog'}, {'id': 44, 'parent': 40, 'count': 8, 'slug': 'a'}, {'id': 62, 'parent': 44, 'count': 19, 'slug': 'b'},
                {'id': 70, 'parent': 40, 'count': 0, 'slug': 'rong'}, {'id': 1, 'parent': 0, 'count': 0, 'slug': 'uncategorized'}, {'id': 34, 'parent': 0, 'count': 5, 'slug': 'du-an-bds'}]
        assert can(cats) == {40: 'index', 44: 'index', 62: 'index', 70: 'noindex', 1: 'noindex'}, can(cats)
        print('test ok'); sys.exit()
    main(sys.argv[1], sys.argv[2], '--ghi' in sys.argv)
