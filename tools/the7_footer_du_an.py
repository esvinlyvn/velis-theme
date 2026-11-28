#!/usr/bin/env python3
"""Cột chân trang "Dự án" (tiện ích block-2) bỏ "Ansana by Kita" (người dùng quyết 2026-11-26). Khối Bài viết mới nhất (latest-posts,
chuyên mục Dự án) không loại được 1 bài → thay bằng khối HTML đúng markup nó đang in, bớt dòng Ansana (giao diện không đổi;
danh sách thôi tự cập nhật – sửa ở Giao diện → Tiện ích). Ghi nội dung cũ vào <log.json>. Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_footer_du_an.py <staging|that> <log.json> [--that]   |   --test
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
DS = [('The Privé', '/can-ho-the-prive/'), ('The Global City', '/the-global-city/'), ('Spring Ville', '/spring-ville/'), ('Vinhomes Saigon Park', '/vinhomes-saigon-park/')]
CU = re.compile(r'<!-- wp:latest-posts \{"categories":\[\{"id":34,"value":"Dự án"\}\],"postsToShow":6,"order":"desc","orderBy":"date","className":"velis-foot-links"\} /-->')


def moi(c):
    li = '\n'.join(f'<li><a class="wp-block-latest-posts__post-title" href="{u}">{t}</a></li>' for t, u in DS)
    html = ('<!-- wp:html -->\n<ul class="wp-block-latest-posts__list velis-foot-links wp-block-latest-posts is-layout-flow wp-block-latest-posts-is-layout-flow">'
            + li + '\n</ul>\n<!-- /wp:html -->')
    assert len(CU.findall(c)) == 1, 'không thấy đúng 1 khối latest-posts cũ'
    return CU.sub(lambda m: html, c)


def main(site, log, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    w = s.get(f'{b}/wp-json/wp/v2/widgets/block-2', params={'context': 'edit'}).json()
    cu = w['instance']['raw']['content']
    if 'wp:latest-posts' not in cu:
        print('đã thay từ trước'); return
    n = moi(cu)
    json.dump({'widget': 'block-2', 'cu': cu, 'moi': n}, open(log, 'w'), ensure_ascii=False, indent=1)
    print(n)
    if that:
        r = s.post(f'{b}/wp-json/wp/v2/widgets/block-2', json={'instance': {'raw': {'content': n}}}); r.raise_for_status()
        assert s.get(f'{b}/wp-json/wp/v2/widgets/block-2', params={'context': 'edit'}).json()['instance']['raw']['content'] == n
        print('đã ghi, đọc lại khớp')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        c = '<!-- wp:paragraph -->x<!-- /wp:paragraph -->\n\n<!-- wp:latest-posts {"categories":[{"id":34,"value":"Dự án"}],"postsToShow":6,"order":"desc","orderBy":"date","className":"velis-foot-links"} /-->\n\ny'
        n = moi(c)
        assert 'ansana' not in n.lower() and n.count('<li>') == 4 and n.startswith('<!-- wp:paragraph -->x') and n.endswith('\n\ny')
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a)
