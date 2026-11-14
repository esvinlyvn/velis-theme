"""ALL-CAPS headings in editor content → sentence case. Only letter case changes (no word added, removed or changed):
lower case, then a capital for the first letter, names (projects, developers, places from the site's own data +
NAMES below) and acronyms / tokens with digits. Writes data/heading-case-changes.csv; --write saves on STAGING.
Usage: python3 -I tools/heading_case.py [--write]"""
import csv, html, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES = ['Velis Realty', 'Velis', 'Vũ Xuân', 'TP.HCM', 'TP. HCM', 'TPHCM', 'TP. Hồ Chí Minh', 'Hồ Chí Minh', 'Sài Gòn', 'Việt Nam', 'Hà Nội',
         'Thủ Đức', 'Thủ Thiêm', 'Nam Rạch Chiếc', 'Rạch Chiếc', 'Giồng Ông Tố', 'Giòng Ông Tố', 'An Phú', 'Bình Trưng', 'Thạnh Mỹ Lợi',
         'Nhơn Trạch', 'Long Thành', 'Đồng Nai', 'Hiệp Phước', 'Cát Lái', 'Bình Tân', 'Võ Văn Kiệt', 'Hóc Môn', 'Tây Bắc', 'Mộc Bài',
         'Khu Đông', 'Khu Tây', 'Mai Chí Thọ', 'Liên Phường', 'Phú Mỹ Hưng', 'Tôn Đức Thắng', 'Quận', 'Masterise Homes', 'Masterise',
         'Masteri', 'Lumière', 'Grand View', 'Cosmo Central', 'Park Place', 'Đất Xanh', 'Kita Group', 'Kita', 'Gamuda Land', 'Gamuda',
         'Springville', 'Vinhomes', 'Vingroup', 'VinFast', 'Vinschool', 'Sun Group', 'Hướng Việt', 'Keppel Land', 'Ecopark', 'Ansana',
         'Stella', 'Ivy Park', 'Global Park', 'Laguna Park', 'Zen Park', 'Golf Park', 'Palm', 'Persa', 'Privé', 'Prive', 'The', 'Boston',
         'Barcelona', 'Canary Wharf', 'Nhật Bản', 'Singapore', 'Malaysia', 'Wellness', 'Panorama', 'Sky Garden', 'Yoga', 'Biophilic',
         'Metro', 'Puzzle Parking', 'GO!', 'Gem Riverside', 'Cloud 9', 'Ngũ Cực', 'Hallmark']
ACRONYMS = {'CEO', 'ROI', 'ROE', 'ESG', 'TOD', 'CBD', 'PN', 'VND', 'VNĐ', 'USD', 'BĐS', 'HCM', 'TMDV', 'SHTP', 'OCB', 'HVH', 'FDI', 'SOHO',
            'CĐT', 'NNN', 'VN', 'QL', 'TP', 'F&B', 'KCN', 'GPXD', 'BOT', 'FAQ', 'TNHH'}


def is_caps(text):
    letters = [c for c in text if c.isalpha()]
    return len(letters) >= 6 and sum(c.isupper() for c in letters) / len(letters) >= 0.85


def sentence_case(text, names):
    out = text.lower()
    for n in sorted(names, key=len, reverse=True):  # longest first: "Nam Rạch Chiếc" before "Rạch Chiếc"
        out = re.sub(r'(?<!\w)' + re.escape(n.lower()) + r'(?!\w)', n, out)
    words = re.split(r'(\s+)', out)
    src = re.split(r'(\s+)', text)
    for i, w in enumerate(words):
        core = re.sub(r'^\W+|\W+$', '', src[i])
        if core.upper() in ACRONYMS or re.search(r'\d', core):  # acronyms and "2PN", "QL1A", "F0" keep the original case
            words[i] = src[i]
    out = ''.join(words)
    # capital letter: start of the heading, after a numbering "1. " and after a sentence end . ? !
    return re.sub(r'(^\W*(?:\d+\.\s+["“(]?)?|[.?!]\s+["“(]?)(\w)', lambda m: m.group(1) + m.group(2).upper(), out)


def convert(raw, names, log):
    def fix(m):
        inner = m.group(2)
        text = html.unescape(re.sub(r'<[^>]+>', '', inner))
        if not is_caps(text):
            return m.group(0)
        parts = re.split(r'(<[^>]+>)', inner)
        plain = ''.join(p for p in parts if not p.startswith('<'))
        new = sentence_case(html.unescape(plain), names)
        # write the new text back over the text nodes, tags untouched
        pos, res = 0, []
        for p in parts:
            if p.startswith('<'):
                res.append(p)
            else:
                n = len(html.unescape(p))
                res.append(html.escape(new[pos:pos + n], quote=False))
                pos += n
        after = ''.join(res)
        assert html.unescape(re.sub(r'<[^>]+>', '', after)).lower() == text.lower()  # only case changed
        log.append((text, html.unescape(re.sub(r'<[^>]+>', '', after))))
        return m.group(1) + after + m.group(3)
    return re.sub(r'(<h[1-6][^>]*>)(.*?)(</h[1-6]>)', fix, raw, flags=re.S)


def main(write):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from import_staging import api
    names = set(NAMES)
    for t in ('du-an', 'chu-dau-tu'):  # project and developer names (categories / regions hold common words: "Dự án", "Trung tâm")
        for x in api('GET', '%s?per_page=100&_fields=title' % t):
            names.add(html.unescape(x['title']['rendered']))
    names = {n for n in names if n and not n.isupper()}
    items = []
    for kind, extra in (('posts', '&status=publish,draft'), ('pages', ''), ('du-an', '')):
        for page in range(1, 5):
            r = api('GET', '%s?context=edit&per_page=100&page=%d&_fields=id,slug,status,content%s' % (kind, page, extra))
            items += [(kind, p) for p in r if p['status'] != 'private']  # private doc pages are never touched
            if len(r) < 100:
                break
    rows = []
    for kind, p in items:
        log = []
        new = convert(p['content']['raw'], names, log)
        rows += [(kind, p['id'], p['slug'], a, b) for a, b in log]
        if write and log:
            api('POST', '%s/%d' % (kind, p['id']), {'content': new})
    with open(os.path.join(ROOT, 'data', 'heading-case-changes.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['loai', 'id', 'slug', 'truoc', 'sau'])
        w.writerows(rows)
    print(len(rows), 'heading ·', len({r[1] for r in rows}), 'trang/bài', '· đã ghi' if write else '· chạy thử')


if __name__ == '__main__':
    main('--write' in sys.argv)
