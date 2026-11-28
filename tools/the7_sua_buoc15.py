#!/usr/bin/env python3
"""The7 bước 15 (điện thoại): ảnh trong hàng chỉ gồm ảnh (≥ 2 cột Single Image – tiến độ, thư viện) của trang dự án / phân khu
(chuyên mục 34, 57) chưa có hành động bấm → onclick="link_image" (bấm phóng to, lightbox The7). Trên điện thoại hàng đó thành lưới
2 cột (velis.css), ảnh nhỏ nên phải phóng to được. Chỉ ghi STAGING; ghi ID bản sửa đổi trước vào docs/STAGING-LOG.md.
Dùng: python3 -I tools/the7_sua_buoc15.py            (chạy thử: tự kiểm + liệt kê, không ghi)
      python3 -I tools/the7_sua_buoc15.py --apply    (ghi)
"""
import re, sys, json, os, subprocess
BASE = 'https://staging.velisrealty.vn/wp-json/wp/v2/'
assert 'staging.' in BASE
def api(method, path, data=None):
    cfg = 'user = "%s:%s"\n' % (os.environ['WP_USER'], os.environ['WP_APP_PASSWORD'])
    args = ['curl', '-sS', '--max-time', '120', '--cacert', '/root/.ccr/ca-bundle.crt', '-K', '-', '-X', method, BASE + path]
    if data is not None:
        args[1:1] = ['-H', 'Content-Type: application/json', '--data-binary', json.dumps(data)]
    out = subprocess.run(args, input=cfg, capture_output=True, text=True).stdout
    res = json.loads(out)
    if isinstance(res, dict) and res.get('code') and 'id' not in res:
        raise RuntimeError('%s %s → %s %s' % (method, path, res.get('code'), res.get('message')))
    return res
COL = re.compile(r'\[(vc_column_inner|vc_column)(?:\s[^\]]*)?\](.*?)\[/\1\]', re.S)
IMG = re.compile(r'\[vc_single_image(\s[^\]]*)?\]')
def fix(raw):
    n = 0
    def row(m):
        nonlocal n
        cols = COL.findall(m.group(2))
        if len(cols) < 2 or not all(re.fullmatch(r'(?:\s*\[vc_single_image(?:\s[^\]]*)?\]\s*)+', c[1]) for c in cols): return m.group(0)
        def img(mm):
            nonlocal n
            a = mm.group(1) or ''
            if 'onclick=' in a: return mm.group(0)
            n += 1; return '[vc_single_image' + a + ' onclick="link_image"]'
        return IMG.sub(img, m.group(0))
    # chỉ hàng trong cùng (không lồng): xét vc_row_inner trước, rồi vc_row không chứa vc_row_inner
    out = re.sub(r'\[vc_row_inner(\s[^\]]*)?\](.*?)\[/vc_row_inner\]', row, raw, flags=re.S)
    out = re.sub(r'\[vc_row(\s[^\]]*)?\]((?:(?!\[vc_row_inner).)*?)\[/vc_row\]', row, out, flags=re.S)
    return out, n
if __name__ == '__main__':
    t = '[vc_row_inner][vc_column_inner width="1/2"][vc_single_image image="1" img_size="large"][/vc_column_inner][vc_column_inner width="1/2"][vc_single_image image="2" onclick="custom_link" link="/x/"][/vc_column_inner][/vc_row_inner][vc_row_inner][vc_column_inner][vc_column_text]a[/vc_column_text][/vc_column_inner][vc_column_inner][vc_single_image image="3"][/vc_column_inner][/vc_row_inner]'
    o, n = fix(t); assert n == 1 and o.count('link_image') == 1 and 'image="3"]' in o, (n, o)
    apply = '--apply' in sys.argv; log = []
    for cat in (34, 57):
        for p in api('GET', f'posts?categories={cat}&per_page=50&context=edit&_fields=id,slug,content'):
            new, n = fix(p['content']['raw'])
            if n:
                rev = api('GET', f"posts/{p['id']}/revisions?per_page=1&_fields=id")
                log.append({'id': p['id'], 'slug': p['slug'], 'anh': n, 'rev_truoc': rev[0]['id'] if rev else None})
                if apply:
                    api('POST', f"posts/{p['id']}", {'content': new})
                    assert fix(api('GET', f"posts/{p['id']}?context=edit&_fields=content")['content']['raw'])[1] == 0
    print(json.dumps(log, ensure_ascii=False))
