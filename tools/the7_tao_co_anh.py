#!/usr/bin/env python3
"""Tạo cỡ ảnh còn thiếu cho thư viện (2026-11-26) – REST lõi WordPress: POST /wp/v2/media/<id>/post-process {action: create-image-subsizes}
(chỉ THÊM cỡ chưa có – cỡ cũ / ảnh gốc giữ nguyên; không cần plugin). Ghi số cỡ trước / sau từng ảnh vào <log.json>. Site thật: kiem_site_that().
Dùng: python3 -I tools/the7_tao_co_anh.py <staging|that> <log.json> [--that] [--chi id,id]   |   --test
"""
import json, sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
CAN = ['velis-13x9-176', 'velis-13x9-352', 'velis-4x3-320', 'velis-4x3-480', 'velis-4x3-640', 'velis-3x2-160', 'velis-3x2-320', 'velis-3x2-480', 'velis-3x2-640', 'velis-480', 'velis-640', 'velis-1x1-96']


def thieu(sizes, w, h):
    """Cỡ mới còn thiếu mà ảnh gốc đủ lớn để sinh (WordPress không phóng to)."""
    out = []
    for k in CAN:
        p = k.split('-')
        tw, th = (int(p[2]), round(int(p[2]) * {'13x9': 9 / 13, '4x3': 3 / 4, '3x2': 2 / 3, '1x1': 1}[p[1]])) if len(p) == 3 else (int(p[1]), 0)
        if k not in sizes and w > tw and (th == 0 or h >= th):
            out.append(k)
    return out


def main(site, log, that, chi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    media = []
    for pg in range(1, 50):
        r = s.get(f'{b}/wp-json/wp/v2/media', params={'per_page': 100, 'page': pg, 'media_type': 'image', 'context': 'edit', '_fields': 'id,media_details,mime_type'})
        if r.status_code != 200 or not r.json():
            break
        media += r.json()
    out = []; t0 = time.time()
    for m in media:
        if chi and m['id'] not in chi:
            continue
        md = m.get('media_details') or {}; sz = md.get('sizes') or {}
        th = thieu(sz, md.get('width', 0), md.get('height', 0))
        rec = {'id': m['id'], 'mime': m['mime_type'], 'thieu': th}
        if that and th:
            r = s.post(f"{b}/wp-json/wp/v2/media/{m['id']}/post-process", json={'action': 'create-image-subsizes'}, timeout=180)
            rec['http'] = r.status_code
            sau = (r.json().get('media_details') or {}).get('sizes', {}) if r.status_code == 200 else {}
            rec['con_thieu'] = [k for k in th if k not in sau]
        out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)
    co = [x for x in out if x['thieu']]
    print(f"{len(media)} ảnh, {len(co)} thiếu cỡ mới" + (f", đã tạo: {sum(1 for x in co if x.get('http') == 200 and not x['con_thieu'])}, lỗi / còn thiếu: {sum(1 for x in co if x.get('http') != 200 or x.get('con_thieu'))}" if that else '') + f" – {time.time()-t0:.0f} s")
    for x in co:
        if that and (x.get('http') != 200 or x.get('con_thieu')):
            print('  ', x)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert thieu({}, 1200, 675) == CAN and thieu({}, 300, 200) == ['velis-13x9-176', 'velis-3x2-160', 'velis-1x1-96'], thieu({}, 300, 200)
        assert 'velis-480' not in thieu({'velis-480': {}}, 1200, 675)
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    chi = {int(x) for x in a[a.index('--chi') + 1].split(',')} if '--chi' in a else None
    main(a[0], a[1], '--that' in a, chi)
