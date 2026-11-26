#!/usr/bin/env python3
"""Gắn link nội bộ còn thiếu (2026-11-26) – KHÔNG đổi chữ: bọc <a> quanh lần xuất hiện ĐẦU TIÊN của cụm từ đã có trong thân bài,
bỏ qua tiêu đề (h1–h6), chữ đã nằm trong <a>, thuộc tính shortcode / thẻ HTML, script/style. Bài đã có link tới đích → bỏ qua.
Kiểm: chữ hiển thị (bỏ thẻ) trước = sau. Ghi revision trước / sau vào <log.json>. Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_gan_link.py <staging|that> <log.json> [--that]   |   --test
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

TOK = re.compile(r'(\[[^\]]*\]|<[^>]+>)')
VSP = (r'Vinhomes Saigon Park|Saigon Park', '/vinhomes-saigon-park/')
VIN = (r'Vinhomes(?! Saigon Park)', '/du-an/vinhomes/')
# slug bài (hoặc tiền tố) → danh sách (mẫu cụm từ, đường dẫn đích); mẫu dài đặt trước
VIEC = {'phap-ly-can-ho-spring-ville-co-gi': [(r'Spring Ville', '/spring-ville/')],
        'mua-nha-bang-luong-persa-place-nhon-trach': [(r'Persa Place', '/can-ho-persa-place/')],
        'nhon-trach-2026-diem-roi-ha-tang-persa-place': [(r'Persa Place', '/can-ho-persa-place/')]}
VIN_TIEN_TO = ['cau-truc-danh-muc-dau-tu-2026', 'tich-san-bang-bds-vinhomes', 'roi-cho-thue-can-ho-vinhomes-2026', 'bds-vinhomes-2026-kenh-tru-an',
               'vinhomes-2026-va-su-troi-day', 'vinfast-tram-sac', 'he-sinh-thai-vingroup', 'vi-sao-nguoi-ta-than-phien', 'vinhomes-2026-bds-xanh', 'vinhomes-smart-city']


def chu(c):
    return TOK.sub('', c)


def gan(c, mau, url):
    """(nội dung mới, 'gắn' | 'đã có' | 'không có cụm từ')."""
    duong_dan = re.sub(r'^https?://[^/]+', '', url)
    if re.search(r'href="[^"]*' + re.escape(duong_dan) + '"', c):
        return c, 'đã có'
    phan = TOK.split(c); trong_a = trong_h = trong_ma = 0
    for i, p in enumerate(phan):
        if i % 2:  # thẻ
            t = p.lower()
            if re.match(r'<a[\s>]', t): trong_a += 1
            elif t.startswith('</a'): trong_a = max(0, trong_a - 1)
            elif re.match(r'<h[1-6][\s>]', t): trong_h += 1
            elif re.match(r'</h[1-6]', t): trong_h = max(0, trong_h - 1)
            elif re.match(r'<(script|style)[\s>]', t): trong_ma += 1
            elif re.match(r'</(script|style)', t): trong_ma = max(0, trong_ma - 1)
            continue
        if trong_a or trong_h or trong_ma:
            continue
        m = re.search(r'(?<![\w-])(' + mau + r')(?![\w-])', p)
        if m:
            phan[i] = p[:m.start()] + f'<a href="{url}">{m.group(1)}</a>' + p[m.end():]
            n = ''.join(phan); assert chu(n) == chu(c)
            return n, 'gắn'
    return c, 'không có cụm từ'


def main(site, log, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    viec = dict(VIEC)
    for tt in VIN_TIEN_TO:
        r = s.get(f'{b}/wp-json/wp/v2/posts', params={'search': tt.replace('-', ' ')[:40], 'per_page': 20, '_fields': 'slug'}).json()
        slug = next((x['slug'] for x in r if x['slug'].startswith(tt)), None)
        if not slug:
            r = s.get(f'{b}/wp-json/wp/v2/posts', params={'categories': 41, 'per_page': 50, '_fields': 'slug'}).json()
            slug = next((x['slug'] for x in r if x['slug'].startswith(tt)), None)
        viec[slug or tt + '…(không tìm thấy)'] = [VSP, VIN]
    out = []
    for slug, ds in viec.items():
        d = s.get(f'{b}/wp-json/wp/v2/posts', params={'slug': slug, 'context': 'edit', '_fields': 'id,content'}).json()
        if not d:
            out.append({'slug': slug, 'kq': 'không thấy bài'}); print(out[-1]); continue
        d = d[0]; c = d['content']['raw']; n = c; kq = []
        for mau, duong in ds:
            n, k = gan(n, mau, b + duong); kq.append(f'{duong}: {k}')
        rec = {'id': d['id'], 'slug': slug, 'kq': kq}
        if that and n != c:
            rec['rev_truoc'] = (s.get(f"{b}/wp-json/wp/v2/posts/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json() or [{}])[0].get('id')
            s.post(f"{b}/wp-json/wp/v2/posts/{d['id']}", json={'content': n}).raise_for_status()
            assert s.get(f"{b}/wp-json/wp/v2/posts/{d['id']}", params={'context': 'edit', '_fields': 'content'}).json()['content']['raw'] == n
            rec['rev_sau'] = s.get(f"{b}/wp-json/wp/v2/posts/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        c = '[vc_column_text title="Vinhomes"]<h2>Vinhomes 2026</h2><p>Mua <a href="/x/">Vinhomes</a> tại Vinhomes Saigon Park, rồi Vinhomes khác.</p>[/vc_column_text]'
        n, k = gan(c, *VSP[:1], 'https://s/vinhomes-saigon-park/') if False else gan(c, VSP[0], 'https://s/vinhomes-saigon-park/')
        assert k == 'gắn' and '<a href="https://s/vinhomes-saigon-park/">Vinhomes Saigon Park</a>' in n, n
        n2, k2 = gan(n, VIN[0], 'https://s/du-an/vinhomes/')
        assert k2 == 'gắn' and 'rồi <a href="https://s/du-an/vinhomes/">Vinhomes</a> khác' in n2 and '<h2>Vinhomes 2026</h2>' in n2, n2
        assert gan(n2, VIN[0], 'https://s/du-an/vinhomes/')[1] == 'đã có' and gan('<p>Không</p>', 'Spring Ville', 'https://s/spring-ville/')[1] == 'không có cụm từ'
        assert chu(n2) == chu(c)
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a)
