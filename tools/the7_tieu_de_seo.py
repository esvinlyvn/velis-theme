#!/usr/bin/env python3
"""Tiêu đề SEO (Rank Math rank_math_title) < 30 ký tự → 50–60 ký tự (2026-11-26). Chuyên mục cụm blog: một mẫu
"Phân tích <dự án>: giá, tiến độ, cho thuê | Velis Realty" (> 60 → bỏ ", cho thuê"); 2 bài: viết từ số liệu trong mô tả bài.
Ghi tiêu đề cũ (thẻ <title> đang hiện) / mới vào <log.json>. Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_tieu_de_seo.py <staging|that> <log.json> [--that]   |   --test
"""
import json, re, sys, os, html, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def mau(du_an):
    t = f'Phân tích {du_an}: giá, tiến độ, cho thuê | Velis Realty'
    return t if len(t) <= 60 else f'Phân tích {du_an}: giá, tiến độ | Velis Realty'


CHUYEN_MUC = {47: 'Ansana by Kita', 53: 'Palm City', 44: 'Spring Ville', 50: 'The Global City', 48: 'The Privé', 41: 'Vinhomes', 51: 'Vinhomes Saigon Park'}
BAI = {'cho-thue-the-prive': 'Tiềm năng cho thuê The Privé: khách SHTP, 20–28 triệu/tháng',
       'loi-nhuan-kep-dau-tu-the-prive-quan-2': 'Lợi nhuận kép The Privé Quận 2: tăng giá 20%, cho thuê 6%'}


def main(site, log, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    from the7_kiem_ra_mat import phien
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'; khach = phien(b)
    if that and b == LIVE:
        kiem_site_that(s)
    tieu_de = lambda link: html.unescape(re.search(r'<title>(.*?)</title>', khach.get(link + '?nc=%d' % (time.time() * 1000)).text, re.S).group(1)).strip()
    viec = [('term', cid, s.get(f'{b}/wp-json/wp/v2/categories/{cid}', params={'_fields': 'link'}).json()['link'], mau(ten)) for cid, ten in CHUYEN_MUC.items()]
    for slug, t in BAI.items():
        d = s.get(f'{b}/wp-json/wp/v2/posts', params={'slug': slug, '_fields': 'id,link'}).json()[0]
        viec.append(('post', d['id'], d['link'], t))
    out = []
    for loai, oid, link, moi in viec:
        assert 50 <= len(moi) <= 60, (moi, len(moi))
        rec = {'loai': loai, 'id': oid, 'url': link.replace(b, ''), 'cu': tieu_de(link), 'moi': moi, 'do_dai': len(moi)}
        if that:
            r = s.post(f'{b}/wp-json/rankmath/v1/updateMeta', json={'objectType': loai, 'objectID': oid, 'meta': {'rank_math_title': moi}}); r.raise_for_status()
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        for ten in CHUYEN_MUC.values():
            assert 50 <= len(mau(ten)) <= 60, (mau(ten), len(mau(ten)))
        assert all(50 <= len(t) <= 60 for t in BAI.values()), [(t, len(t)) for t in BAI.values()]
        print('test ok', {t: len(mau(t)) for t in CHUYEN_MUC.values()}, [len(t) for t in BAI.values()]); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a)
