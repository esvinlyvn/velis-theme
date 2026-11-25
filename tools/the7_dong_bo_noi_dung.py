#!/usr/bin/env python3
"""Đưa nội dung (content.raw) bài / trang từ staging lên site thật – chỉ khi an toàn (2026-11-26).

Cùng ID ở 2 site (site thật dựng từ CSDL staging). Nội dung staging (và revision) được đổi địa chỉ staging → site thật bằng
bien_doi() của the7_doi_tien_to.py (như gói vl2: URL thường, mã hóa URL, JSON, base64 [vc_raw_html]); còn "staging" → không ghi.
Với mỗi bài / trang có content.raw (đã đổi địa chỉ) staging ≠ site thật:
  - "an_toan": content site thật hiện tại TRÙNG một revision trên staging (site thật chưa bị ai sửa riêng) → được ghi bản staging;
  - "lech": site thật có nội dung không có trong lịch sử staging (đã sửa riêng trên site thật) → KHÔNG ghi, báo.
Ghi (--that): kiem_site_that() trước; ghi content site thật cũ + ID revision trước/sau vào <log.json>; đọc lại context=edit phải trùng staging.
--ghi-de id,id: ghi cả bài "lech" đã chỉ định (người dùng duyệt; bản site thật cũ nằm trong <log.json> + revision).
Dùng: python3 -I tools/the7_dong_bo_noi_dung.py <log.json> [--that] [--chi id,id] [--ghi-de id,id]   |   --test
"""
import json, sys, os
from collections import Counter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from the7_doi_tien_to import bien_doi


def sang_that(raw):
    return bien_doi(raw, Counter())


def phan_loai(staging_raw, live_raw, staging_revs):
    if staging_raw == live_raw:
        return 'giong'
    return 'an_toan' if live_raw in staging_revs else 'lech'


def lay_het(s, base, typ):
    out = {}
    for pg in range(1, 30):
        r = s.get(f'{base}/wp-json/wp/v2/{typ}', params={'per_page': 100, 'page': pg, 'context': 'edit', 'status': 'publish,private,draft', '_fields': 'id,slug,status,content,link'})
        if r.status_code != 200 or not r.json():
            break
        out.update({d['id']: d for d in r.json()})
    return out


def revs(s, base, typ, i):
    r = s.get(f'{base}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 100, 'context': 'edit', '_fields': 'id,content'})
    return [sang_that(x['content']['raw']) for x in r.json()] if r.status_code == 200 else []


def main(log, that, chi, ghi_de=()):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    def ss(b):
        s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'; return s
    st, lv = ss(STAGING), ss(LIVE)
    if that:
        kiem_site_that(lv)
    kq = []
    for typ in ('pages', 'posts'):
        A, B = lay_het(st, STAGING, typ), lay_het(lv, LIVE, typ)
        for i, d in A.items():
            if chi and i not in chi:
                continue
            if i not in B:
                kq.append({'id': i, 'loai': typ, 'slug': d['slug'], 'kq': 'khong_co_tren_site_that'}); continue
            sr, lr = sang_that(d['content']['raw']), B[i]['content']['raw']
            assert 'staging' not in sr.lower() or 'staging' in lr.lower(), (i, 'còn chuỗi staging sau khi đổi địa chỉ')
            if sr == lr:
                continue
            k = phan_loai(sr, lr, revs(st, STAGING, typ, i))
            rec = {'id': i, 'loai': typ, 'slug': d['slug'], 'kq': k}
            if that and (k == 'an_toan' or i in ghi_de):
                rv = lv.get(f'{LIVE}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
                rec['rev_truoc'] = rv[0]['id'] if rv else None; rec['cu'] = lr
                w = lv.post(f'{LIVE}/wp-json/wp/v2/{typ}/{i}', json={'content': sr}); w.raise_for_status()
                lai = lv.get(f'{LIVE}/wp-json/wp/v2/{typ}/{i}', params={'context': 'edit', '_fields': 'content'}).json()['content']['raw']
                rec['doc_lai_trung'] = lai == sr
                rec['rev_sau'] = lv.get(f'{LIVE}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
            print({k2: v for k2, v in rec.items() if k2 != 'cu'})
            kq.append(rec)
    json.dump(kq, open(log, 'w'), ensure_ascii=False, indent=1)
    print('tổng', len(kq), {x: sum(r['kq'] == x for r in kq) for x in ('an_toan', 'lech', 'khong_co_tren_site_that')})


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert phan_loai('a', 'a', []) == 'giong'
        assert phan_loai('moi', 'cu', ['moi', 'cu']) == 'an_toan'
        assert phan_loai('moi', 'sua-rieng', ['moi', 'cu']) == 'lech'
        assert sang_that('<a href="https://staging.velisrealty.vn/a/">x</a> https%3A%2F%2Fstaging.velisrealty.vn') == '<a href="https://velisrealty.vn/a/">x</a> https%3A%2F%2Fvelisrealty.vn'
        print('test ok'); sys.exit()
    if not a:
        sys.exit(__doc__)
    chi = {int(x) for x in a[a.index('--chi') + 1].split(',')} if '--chi' in a else None
    main(a[0], '--that' in a, chi, {int(x) for x in a[a.index('--ghi-de') + 1].split(',')} if '--ghi-de' in a else set())
