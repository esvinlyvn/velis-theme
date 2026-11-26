#!/usr/bin/env python3
"""Lưới dự án theo thẻ (2026-11-26): đổi thuộc tính dt_blog_masonry ở trang chủ + /du-an/ từ lọc chuyên mục / chọn bài sang "Posts by tags"
(tùy chọn sẵn của phần tử The7: post_type="tags" tags="<ID thẻ>" – phần tử KHÔNG nhận slug; ID tra theo từng site). Chỉ đổi thuộc tính, chữ ngoài thẻ mở giữ nguyên; ghi revision trước / sau.
Dùng: python3 -I tools/the7_luoi_theo_the.py <staging|that> <log.json> [--that]   |   --test
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# (slug trang, chuỗi cũ trong thẻ mở, chuỗi mới)
SUA = [('trang-chu', 'post_type="posts" posts="19962,20067,19934,19773"', 'post_type="tags" tags="{noi-bat}"'),
       ('trang-chu', 'post_type="category" category="34"', 'post_type="tags" tags="{dang-ban}"'),
       ('du-an', 'post_type="category" category="34,57"', 'post_type="tags" tags="{dang-ban}"')]
# lưới Đang bán: mọi bài có thẻ (dis_posts_total=-1); dải Nổi bật giữ dis_posts_total="4"
THE = re.compile(r'\[dt_blog_masonry\b(?:[^\]"]|"[^"]*")*\]')


def sua(c, slug, tid):
    def f(m):
        t = m.group(0)
        for sl, cu, moi in SUA:
            if sl == slug and cu in t:
                t = t.replace(cu, moi.format_map(tid))
                if '{dang-ban}' in moi:
                    t = re.sub(r'dis_posts_total="\d*"', 'dis_posts_total="-1"', t)
        return t
    return THE.sub(f, c)


def main(site, log, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    tid = {k: s.get(f'{b}/wp-json/wp/v2/tags', params={'slug': k, '_fields': 'id'}).json()[0]['id'] for k in ('dang-ban', 'noi-bat')}
    print('ID thẻ', tid)
    out = []
    for slug in dict.fromkeys(x[0] for x in SUA):
        d = s.get(f'{b}/wp-json/wp/v2/pages', params={'slug': slug, 'context': 'edit', '_fields': 'id,content'}).json()[0]
        c = d['content']['raw']; n = sua(c, slug, tid)
        assert THE.sub('', c) == THE.sub('', n), 'chữ ngoài thẻ bị đổi'
        can = sum(1 for sl, cu, _ in SUA if sl == slug)
        da = sum(1 for sl, cu, moi in SUA if sl == slug and moi.format_map(tid) in n and cu not in n)
        rv = s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()
        rec = {'id': d['id'], 'slug': slug, 'doi': c != n, 'muc_da_doi': f'{da}/{can}', 'rev_truoc': rv[0]['id'] if rv else None}
        if that and c != n:
            assert da == can, rec
            s.post(f"{b}/wp-json/wp/v2/pages/{d['id']}", json={'content': n}).raise_for_status()
            assert s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}", params={'context': 'edit', '_fields': 'content'}).json()['content']['raw'] == n
            rec['rev_sau'] = s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        c = ('x[dt_blog_masonry post_type="posts" posts="19962,20067,19934,19773" dis_posts_total="4"]y'
             '[dt_blog_masonry post_type="category" category="34" dis_posts_total="6" orderby="date"]z[dt_blog_masonry category="40" dis_posts_total="3"]')
        tid = {'dang-ban': 60, 'noi-bat': 61}
        n = sua(c, 'trang-chu', tid)
        assert n == ('x[dt_blog_masonry post_type="tags" tags="61" dis_posts_total="4"]y'
                     '[dt_blog_masonry post_type="tags" tags="60" dis_posts_total="-1" orderby="date"]z[dt_blog_masonry category="40" dis_posts_total="3"]'), n
        assert sua(c, 'du-an', tid) == c and sua(n, 'trang-chu', tid) == n
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a)
