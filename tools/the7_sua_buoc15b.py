#!/usr/bin/env python3
"""The7 bước 15b: đoạn mở đầu trang dự án / phân khu (Text Block thứ 2 của hàng velis-hero – sau ảnh, không phải H1 / dòng gọi /
thông số) thêm Extra class "velis-clamp" → trên điện thoại hiện 4 dòng + "Xem thêm" (velis.css + JS functions.php; máy tính không đổi).
Áp cho bài chuyên mục 34, 57 trên STAGING và mẫu data/the7/mau-wpbakery/du-an.txt. Ghi ID bản sửa đổi trước vào docs/STAGING-LOG.md.
Dùng: python3 -I tools/the7_sua_buoc15b.py            (chạy thử: tự kiểm + liệt kê, không ghi)
      python3 -I tools/the7_sua_buoc15b.py --apply    (ghi staging + mẫu trong repo)
"""
import re, sys, json, os, subprocess
BASE = 'https://staging.velisrealty.vn/wp-json/wp/v2/'
assert 'staging.' in BASE
MAU = os.path.join(os.path.dirname(__file__), '..', 'data', 'the7', 'mau-wpbakery', 'du-an.txt')
def api(method, path, data=None):
    cfg = 'user = "%s:%s"\n' % (os.environ['WP_USER'], os.environ['WP_APP_PASSWORD'])
    args = ['curl', '-sS', '--max-time', '120', '--cacert', '/root/.ccr/ca-bundle.crt', '-K', '-', '-X', method, BASE + path]
    if data is not None:
        args[1:1] = ['-H', 'Content-Type: application/json', '--data-binary', json.dumps(data)]
    res = json.loads(subprocess.run(args, input=cfg, capture_output=True, text=True).stdout)
    if isinstance(res, dict) and res.get('code') and 'id' not in res:
        raise RuntimeError('%s %s → %s %s' % (method, path, res.get('code'), res.get('message')))
    return res
HERO = re.compile(r'(\[vc_row\s[^\]]*el_class="[^"]*velis-hero[^"]*"[^\]]*\])(.*?)(\[/vc_row\])', re.S)
TEXT = re.compile(r'\[vc_column_text((?:\s[^\]]*)?)\](.*?)\[/vc_column_text\]', re.S)
def fix(raw):
    n = 0
    def hero(m):
        def text(t):
            nonlocal n
            a, body = t.group(1), t.group(2)
            if n or re.search(r'<h1|velis-call|velis-spec|velis-eyebrow', body) or 'velis-clamp' in a: return t.group(0)
            n += 1
            a = re.sub(r'el_class="([^"]*)"', r'el_class="\1 velis-clamp"', a) if 'el_class="' in a else a + ' el_class="velis-clamp"'
            return '[vc_column_text' + a + ']' + body + '[/vc_column_text]'
        return m.group(1) + TEXT.sub(text, m.group(2)) + m.group(3)
    return HERO.sub(hero, raw, count=1), n
if __name__ == '__main__':
    t = ('[vc_row el_class="velis-hero"][vc_column][vc_column_text css=""]<p class="velis-eyebrow">a</p><h1>X</h1>[/vc_column_text]'
         '[vc_single_image image="1"][vc_column_text css=""]<p>mở</p>[/vc_column_text][vc_column_text css=""]<p class="velis-call">g</p>[/vc_column_text]'
         '[/vc_column][/vc_row][vc_row el_class="velis-section"][vc_column][vc_column_text]<p>khác</p>[/vc_column_text][/vc_column][/vc_row]')
    o, n = fix(t); assert n == 1 and o.count('velis-clamp') == 1 and 'css="" el_class="velis-clamp"]<p>mở' in o, o
    assert fix(o) == (o, 0)  # chạy lại không đổi
    o2, n2 = fix(t.replace('[vc_column_text css=""]<p>mở', '[vc_column_text el_class="x"]<p>mở')); assert 'el_class="x velis-clamp"' in o2 and n2 == 1
    apply = '--apply' in sys.argv; log = []
    mau, nm = fix(open(MAU, encoding='utf-8').read()); assert nm in (0, 1)
    if apply and nm: open(MAU, 'w', encoding='utf-8').write(mau)
    for cat in (34, 57):
        for p in api('GET', f'posts?categories={cat}&per_page=50&context=edit&_fields=id,slug,content'):
            if any(x['id'] == p['id'] for x in log): continue
            new, n = fix(p['content']['raw'])
            if n:
                rev = api('GET', f"posts/{p['id']}/revisions?per_page=1&_fields=id")
                log.append({'id': p['id'], 'slug': p['slug'], 'rev_truoc': rev[0]['id'] if rev else None})
                if apply:
                    api('POST', f"posts/{p['id']}", {'content': new})
                    assert fix(api('GET', f"posts/{p['id']}?context=edit&_fields=content")['content']['raw'])[1] == 0
    print(json.dumps({'mau': nm, 'bai': log}, ensure_ascii=False))
