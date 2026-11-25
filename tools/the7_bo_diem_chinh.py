#!/usr/bin/env python3
"""Bỏ ô "Điểm chính" khỏi phần tử "Velis · Khối nội dung" (người dùng yêu cầu 2026-11-25): xóa minh_hoa="diem", diem="…", ben="…"
trong [velis_khoi …]; chữ nội dung không đổi (kiểm: phần ngoài thẻ mở [velis_khoi …] giữ nguyên từng ký tự).
STAGING: sửa qua REST content.raw (WP_* qua wp_cred), ghi revision trước/sau vào <log.json>.
Dùng: python3 -I tools/the7_bo_diem_chinh.py --test | --tep <tệp mẫu> | --staging <id,id,…> <log.json> [--that]   (không --that = chạy khô)
"""
import json, re, sys

THE = re.compile(r'\[velis_khoi\b[^\]]*\]')
BO = re.compile(r'\s+(?:minh_hoa="diem"|diem="[^"]*"|ben="[^"]*")')


def bo(content):
    return THE.sub(lambda m: BO.sub('', m.group(0)), content)


def ngoai_the(c):
    return THE.sub('', c)


def _test():
    c = ('[vc_row][velis_khoi tieu_de="A" minh_hoa="diem" diem="%5B%7B%22dong%22%3A%22x%22%7D%5D" ben="trai"]<p>Chữ</p>[/velis_khoi]'
         '[velis_khoi tieu_de="B" minh_hoa="bang" bang="JTND"]<p>diem="giữ" trong chữ</p>[/velis_khoi][vc_column_text]minh_hoa="diem"[/vc_column_text]')
    r = bo(c)
    assert r == ('[vc_row][velis_khoi tieu_de="A"]<p>Chữ</p>[/velis_khoi][velis_khoi tieu_de="B" minh_hoa="bang" bang="JTND"]'
                 '<p>diem="giữ" trong chữ</p>[/velis_khoi][vc_column_text]minh_hoa="diem"[/vc_column_text]'), r
    assert ngoai_the(r) == ngoai_the(c) and bo(r) == r
    print('test ok')


def staging(ids, log, that):
    sys.path.insert(0, __file__.rsplit('/', 1)[0])
    import requests
    from wp_cred import wp_auth, STAGING
    s = requests.Session(); s.auth = wp_auth(STAGING); s.verify = '/root/.ccr/ca-bundle.crt'
    out = []
    for i in ids:
        typ = None
        for t in ('pages', 'posts'):
            r = s.get(f'{STAGING}/wp-json/wp/v2/{t}/{i}', params={'context': 'edit', '_fields': 'id,content,link'})
            if r.status_code == 200:
                typ, d = t, r.json(); break
        if r.status_code == 401:
            raise SystemExit('401 – dừng')
        c = d['content']['raw']; n = bo(c)
        assert ngoai_the(n) == ngoai_the(c)
        rv = s.get(f'{STAGING}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
        rec = {'id': i, 'loai': typ, 'link': d['link'], 'rev_truoc': rv[0]['id'] if rv else None, 'diem_bo': c.count('minh_hoa="diem"'), 'doi': c != n}
        if that and c != n:
            w = s.post(f'{STAGING}/wp-json/wp/v2/{typ}/{i}', json={'content': n}); w.raise_for_status()
            rec['rev_sau'] = s.get(f'{STAGING}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        _test()
    elif a[:1] == ['--tep']:
        t = open(a[1]).read(); n = bo(t); assert ngoai_the(n) == ngoai_the(t); open(a[1], 'w').write(n); print(a[1], 'bỏ', t.count('minh_hoa="diem"'))
    elif a[:1] == ['--staging']:
        staging([int(x) for x in a[1].split(',')], a[2], '--that' in a)
    else:
        sys.exit(__doc__)
