#!/usr/bin/env python3
"""Bỏ ô "Điểm chính" khỏi phần tử "Velis · Khối nội dung" (người dùng yêu cầu 2026-11-25): xóa minh_hoa="diem", diem="…", ben="…"
trong [velis_khoi …]; chữ nội dung không đổi (kiểm: phần ngoài thẻ mở [velis_khoi …] giữ nguyên từng ký tự).
STAGING: sửa qua REST content.raw (WP_* qua wp_cred), ghi revision trước/sau vào <log.json>.
Dùng: python3 -I tools/the7_bo_diem_chinh.py --test | --tep <tệp mẫu> | --staging <id,id,…> <log.json> [--that]   (không --that = chạy khô)
--cot3 (2026-11-26, người soát: khung đầu trang trả về như site thật): thay việc trên bằng bỏ cot="2" khỏi [velis_thong_tin] (về mặc định 3 cột).
"""
import json, re, sys

THE = re.compile(r'\[velis_khoi\b(?:[^\]"]|"[^"]*")*\]')  # "]" trong giá trị nháy (tiêu đề mẫu "[tên dự án]") không đóng thẻ
BO = re.compile(r'\s+(?:minh_hoa="diem"|diem="[^"]*"|ben="[^"]*")')


def bo(content):
    return THE.sub(lambda m: BO.sub('', m.group(0)), content)


THE_TT = re.compile(r'\[velis_thong_tin\b(?:[^\]"]|"[^"]*")*\]')


def bo_cot2(content):
    return THE_TT.sub(lambda m: m.group(0).replace(' cot="2"', ''), content)


def ngoai_the(c, the=THE):
    return the.sub('', c)


def _test():
    c = ('[vc_row][velis_khoi tieu_de="A" minh_hoa="diem" diem="%5B%7B%22dong%22%3A%22x%22%7D%5D" ben="trai"]<p>Chữ</p>[/velis_khoi]'
         '[velis_khoi tieu_de="B" minh_hoa="bang" bang="JTND"]<p>diem="giữ" trong chữ</p>[/velis_khoi][vc_column_text]minh_hoa="diem"[/vc_column_text]')
    r = bo(c)
    assert r == ('[vc_row][velis_khoi tieu_de="A"]<p>Chữ</p>[/velis_khoi][velis_khoi tieu_de="B" minh_hoa="bang" bang="JTND"]'
                 '<p>diem="giữ" trong chữ</p>[/velis_khoi][vc_column_text]minh_hoa="diem"[/vc_column_text]'), r
    assert ngoai_the(r) == ngoai_the(c) and bo(r) == r
    m = '[velis_khoi tieu_de="Giá [tên dự án]?" minh_hoa="diem" diem="x" ben="phai"]<p>[tên dự án]</p>[/velis_khoi]'
    assert bo(m) == '[velis_khoi tieu_de="Giá [tên dự án]?"]<p>[tên dự án]</p>[/velis_khoi]', bo(m)
    t = '[velis_thong_tin cot="2" muc="%5B%5D"][velis_khoi tieu_de="cot=\\"2\\""]x cot="2"[/velis_khoi]'
    assert bo_cot2(t) == '[velis_thong_tin muc="%5B%5D"][velis_khoi tieu_de="cot=\\"2\\""]x cot="2"[/velis_khoi]', bo_cot2(t)
    assert ngoai_the(bo_cot2(t), THE_TT) == ngoai_the(t, THE_TT)
    print('test ok')


def staging(ids, log, that, f=bo, the=THE):
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
        c = d['content']['raw']; n = f(c)
        assert ngoai_the(n, the) == ngoai_the(c, the)
        rv = s.get(f'{STAGING}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
        rec = {'id': i, 'loai': typ, 'link': d['link'], 'rev_truoc': rv[0]['id'] if rv else None, 'diem_bo': c.count('minh_hoa="diem"'), 'doi': c != n}
        if that and c != n:
            w = s.post(f'{STAGING}/wp-json/wp/v2/{typ}/{i}', json={'content': n}); w.raise_for_status()
            rec['rev_sau'] = s.get(f'{STAGING}/wp-json/wp/v2/{typ}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    f, the = (bo_cot2, THE_TT) if '--cot3' in a else (bo, THE)
    a = [x for x in a if x != '--cot3']
    if a == ['--test']:
        _test()
    elif a[:1] == ['--tep']:
        t = open(a[1]).read(); n = f(t); assert ngoai_the(n, the) == ngoai_the(t, the); open(a[1], 'w').write(n); print(a[1], 'đổi', t != n)
    elif a[:1] == ['--staging']:
        staging([int(x) for x in a[1].split(',')], a[2], '--that' in a, f, the)
    else:
        sys.exit(__doc__)
