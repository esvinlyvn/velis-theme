"""Paste the JSON-LD of 20 page templates (STAGING, guest view behind the view password) into validator.schema.org and
count errors / warnings per page (giai đoạn 5, mục 3). Only the extracted JSON-LD is sent – never cookies or the page.
Usage: python3 -I tools/validate_schema_org.py out.md"""
import json, os, re, sys

import requests

BASE = os.environ.get('STAGING', 'https://staging.velisrealty.vn')
PAGES = ['/', '/du-an/', '/du-an/the-prive/', '/du-an/the-global-city/', '/du-an/vinhomes-saigon-park/', '/du-an/spring-ville/persa-place/',
         '/du-an/the-global-city/masteri-park-place/', '/du-an/palm-city/palm-river/', '/du-an/vinhomes-saigon-park/ivy-park/nha-pho/',
         '/blog/the-prive/loi-suat-cho-thue-the-prive/', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/', '/blog/',
         '/blog/the-prive/', '/chuyen-gia/vu-xuan/', '/chu-dau-tu/', '/chu-dau-tu/masterise-homes/', '/gioi-thieu/', '/tuyen-dung/',
         '/lien-he/', '/chinh-sach-bao-mat/']


def ld_blocks(html):
    return re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html, re.S)


def summary(res):
    """validator response → (errors, warnings, types)"""
    groups = res.get('tripleGroups', [])
    return res.get('numErrors', sum(g.get('numErrors', 0) for g in groups)), sum(g.get('numWarnings', 0) for g in groups), sorted({g.get('type', '') for g in groups})


assert ld_blocks('<script type="application/ld+json">{"a":1}</script>') == ['{"a":1}']
assert summary({'numErrors': 0, 'tripleGroups': [{'numWarnings': 2, 'type': 'Article'}]}) == (0, 2, ['Article'])

if __name__ == '__main__':
    pw = (os.environ.get('STAGING_VIEW_PASSWORD') or open(os.environ['VIEW_PASSWORD_FILE'], encoding='utf-8').read()).strip()
    s = requests.Session(); s.verify = '/root/.ccr/ca-bundle.crt'
    login = BASE + '/?password-protected=login&redirect_to=' + BASE + '/'
    s.get(login); s.post(login, data={'password_protected_pwd': pw, 'password_protected_cookie_test': '1', 'password-protected': 'login', 'redirect_to': BASE + '/'})
    v = requests.Session(); v.verify = '/root/.ccr/ca-bundle.crt'
    rows, tot = [], 0
    for path in PAGES:
        blocks = ld_blocks(s.get(BASE + path, timeout=60).text)
        code = ''.join('<script type="application/ld+json">%s</script>' % b for b in blocks)
        res = json.loads(v.post('https://validator.schema.org/validate', data={'html': code}, timeout=120).text.split('\n', 1)[1])
        e, w, t = summary(res)
        tot += e
        rows.append('| %s | %d | %d | %d | %s |' % (path, len(blocks), e, w, ', '.join(t)))
        print(path, e, w, t)
    md = '# validator.schema.org – 20 mẫu trang (staging, %s)\n\n| Trang | Khối JSON-LD | Lỗi | Cảnh báo | Kiểu gốc |\n|---|---|---|---|---|\n%s\n\n**Tổng lỗi: %d**\n' % (BASE, '\n'.join(rows), tot)
    open(sys.argv[1], 'w', encoding='utf-8').write(md)
    print('tổng lỗi', tot)
