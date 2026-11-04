"""Build data/keyword-map.csv: one main keyword per new URL (BRIEF.md "Bản đồ từ khóa" + "Từ khóa, tránh ăn thịt lẫn nhau")
and report every conflict.  Usage: python3 -I tools/build_keyword_map.py
Sources, in order: rule of the URL's level (dự án / phân khu / dòng thấp tầng / đại đô thị / chủ đầu tư / cụm / trang chính),
decisions taken at a gate,
a Search Console query whose words all appear in the post slug, else the post title (proposal – needs review).
Rank Math focus keywords on the live site are empty (checked 2026-11-04), so none are reused.
"""
import csv, json, os, re, sys, unicodedata
from collections import defaultdict

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = lambda *p: os.path.join(ROOT, 'data', *p)
STOP = {'va', 'cua', 'cho', 'la', 'co', 'khong', 'nhung', 'the', 'tai', 'voi', 'trong', 'nam', 'gi', 'ai', 'nao', 'bao', 'nhieu'}
FIXED = {
    '/': ('velis realty', 'velis; tư vấn bất động sản cao cấp', 'điều hướng thương hiệu'),
    '/gioi-thieu/': ('velis realty là ai', 'giới thiệu velis realty', 'thông tin thương hiệu'),
    '/lien-he/': ('liên hệ velis realty', 'hotline velis realty', 'liên hệ'),
    '/tuyen-dung/': ('tuyển dụng chuyên viên kinh doanh bất động sản', 'tuyển dụng velis realty', 'tuyển dụng'),
    '/du-an/': ('dự án bất động sản cao cấp tp.hcm', 'dự án velis đang tư vấn', 'khám phá'),
    '/chu-dau-tu/': ('chủ đầu tư bất động sản uy tín', 'danh sách chủ đầu tư', 'khám phá'),
    '/blog/': ('phân tích bất động sản', 'blog bất động sản velis', 'thông tin'),
    '/chuyen-gia/vu-xuan/': ('vũ xuân', 'vũ xuân velis realty; ceo velis realty', 'thông tin tác giả'),
}
# Posts that already earn clicks keep the query they rank for (brief: "Trang đang có lượt nhấp giữ nguyên từ khóa").
RANKING = {'/blog/palm-city/huong-viet-holdings-la-ai/': ('hướng việt holding', 'hướng việt holdings; chủ đầu tư hướng việt là ai', 'Search Console – đang xếp hạng (17 nhấp, 449 hiển thị)')}
# Decisions at gate 2 (2026-11-04): two Privé rental posts used to share "cho thuê the prive".
DECIDED = {
    '/blog/the-prive/cho-thue-the-prive/': ('cho thuê căn hộ the prive', 'tiềm năng cho thuê the privé', 'chốt cổng 2'),
    '/blog/the-prive/loi-suat-cho-thue-the-prive/': ('lợi suất cho thuê the prive', 'tỷ suất lợi nhuận cho thuê the privé', 'chốt cổng 2'),
}
DRAFT = 'nháp – đề xuất từ tiêu đề, chưa duyệt'
NO_KEYWORD = ('/chinh-sach-bao-mat/', '/dieu-khoan-su-dung/', '/locations.kml')


def fold(s):
    s = unicodedata.normalize('NFD', s.lower()).replace('đ', 'd')
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))).strip()


def title_keyword(title):
    """First clause of the title, max 7 words, lower-case (proposal)."""
    head = re.split(r'[:?–—|]| - ', title)[0]
    head = re.sub(r'[“”"]', '', head).strip()
    return ' '.join(head.lower().split()[:7])


def gsc_for_slug(slug, queries, names=frozenset()):
    """Best Search Console query that appears as a contiguous phrase in the slug and that says more than a project /
    developer name (at least one topic word outside `names`) – a bare name belongs to the project page."""
    best = None
    for q, clicks, impr in queries:
        words = [w for w in fold(q).split() if w not in STOP]
        topical = any(w not in names for w in words) and any(w in names for w in words)  # a named thing + a topic
        phrase = '-'.join(fold(q).split())
        if len(words) >= 2 and topical and ('-' + phrase + '-') in ('-' + slug + '-') and (best is None or (clicks, impr) > best[1:]):  # contiguous phrase in the slug
            best = (q, clicks, impr)
    return best


def proper_name(name, parent):
    """Phân khu keyword = its own name: "Khu 1 – Ivy Park" → "ivy park"; a generic name gets the parent's."""
    n = re.sub(r'\s*\(.*\)', '', name.split('–')[-1]).strip().lower()
    return n if n not in ('thấp tầng', 'cao tầng') else '%s %s' % (n, parent)


def build():
    projects = {r['slug']: r for r in csv.DictReader(open(D('architecture', 'projects.csv')))}
    devs = {r['slug']: r for r in csv.DictReader(open(D('architecture', 'developers.csv')))}
    queries = [(r[k[0]], int(r[k[1]]), int(r[k[2]])) for r in csv.DictReader(open(D('gsc', 'queries.csv'))) for k in [list(r)]]
    urlmap = list(csv.DictReader(open(D('url-map.csv'))))
    clusters = {r['url_moi']: r for r in csv.DictReader(open(D('blog-clusters.csv')))}
    titles = {r['url_moi']: r['tieu_de'] for r in clusters.values()}
    names = frozenset(w for n in [p['ten'] for p in projects.values()] + [d['ten'] for d in devs.values()] for w in fold(n).split()) | {'can', 'ho', 'du', 'an', 'gia', 'velis', 'realty', 'rach', 'chiec', 'thu', 'thiem', 'nhon', 'trach', 'quan'}
    old_of = defaultdict(list)
    gsc_clicks = defaultdict(int)
    for r in urlmap:
        old_of[r['url_moi']].append(r['url_cu'])
        gsc_clicks[r['url_moi']] += int(r['gsc_nhap'] or 0)
    rows = {}

    def add(url, kw, sec, intent, src):
        rows[url] = {'url_moi': url, 'url_cu': ' '.join(sorted(o for o in old_of.get(url, []) if not o.startswith('/20') and o != url)[:3]),
                     'tu_khoa_chinh': kw, 'tu_khoa_phu': sec, 'y_dinh': intent, 'nguon': src, 'gsc_nhap': gsc_clicks.get(url, 0), 'xung_dot': ''}

    for url, (kw, sec, intent) in FIXED.items():
        add(url, kw, sec, intent, 'quy tắc trang chính')
    for p in projects.values():
        parent = projects[p['cha']]['ten'].lower() if p['cha'] else ''
        name = proper_name(p['ten'], parent) if p['cap'] == 'phan-khu' else p['ten'].lower()
        if p['cap'] == 'dai-do-thi':
            add(p['url_moi'], name, 'khu đô thị %s; giá %s' % (name, name), 'tổng quan đại đô thị', 'quy tắc đại đô thị')
        elif p['cap'] == 'phan-khu':
            add(p['url_moi'], name, '%s %s; giá %s' % (name, parent, name), 'mua – phân khu', 'quy tắc phân khu')
        else:
            add(p['url_moi'], name, 'giá %s; căn hộ %s' % (name, name), 'mua – dự án', 'quy tắc dự án')
    for r in csv.DictReader(open(D('architecture', 'lowrise.csv'), encoding='utf-8')):  # "{dòng} {phân khu}"
        add(r['url_moi'], r['tu_khoa'], 'giá %s' % r['tu_khoa'], 'mua – dòng thấp tầng', 'quy tắc dòng thấp tầng')
    for d in devs.values():
        if d['url_moi'].startswith('/chu-dau-tu/') and d['url_moi'] != '/chu-dau-tu/':
            n = d['ten'].lower()
            add(d['url_moi'], n, 'dự án %s; %s là ai' % (n, n), 'tìm hiểu chủ đầu tư', 'quy tắc chủ đầu tư')
    for r in urlmap:
        u = r['url_moi']
        m = re.match(r'^/blog/([^/]+)/$', u)
        if m and u not in rows:
            name = next((p['ten'] for p in projects.values() if p['slug'] == m.group(1)), None) or next((d['ten'] for d in devs.values() if d['slug'] == m.group(1)), m.group(1))
            add(u, 'phân tích %s' % name.lower(), 'kinh nghiệm mua %s' % name.lower(), 'thông tin – cụm', 'quy tắc cụm blog')
    for u, title in titles.items():
        slug = u.strip('/').split('/')[-1]
        g = gsc_for_slug(slug, queries, names)
        if u in RANKING or u in DECIDED:
            kw, sec, src = RANKING.get(u) or DECIDED[u]
            add(u, kw, sec, 'thông tin', src)
        elif g:
            add(u, g[0], title_keyword(title), 'thông tin', 'Search Console (%d nhấp, %d hiển thị)' % (g[1], g[2]))
        else:
            add(u, title_keyword(title), '', 'thông tin', DRAFT)

    # conflicts: same main keyword on two URLs; a post targeting a project / subzone / developer keyword or "giá {dự án}"
    by_kw = defaultdict(list)
    for r in rows.values():
        by_kw[fold(r['tu_khoa_chinh'])].append(r['url_moi'])
    page_kw = {fold(r['tu_khoa_chinh']): r['url_moi'] for r in rows.values() if not r['url_moi'].startswith('/blog/') or r['url_moi'].count('/') == 3}
    for p in projects.values():
        page_kw.setdefault('gia ' + fold(p['ten']), p['url_moi'])
    conflicts = []
    for kw, urls in by_kw.items():
        if len(urls) > 1:
            for u in urls:
                rows[u]['xung_dot'] = 'trùng từ khóa chính với ' + ', '.join(x for x in urls if x != u)
            conflicts.append(('trùng từ khóa chính', kw, urls))
    for r in rows.values():
        k = fold(r['tu_khoa_chinh'])
        if r['url_moi'].count('/') == 4 and r['url_moi'].startswith('/blog/'):
            hit = page_kw.get(k) or next((u for pk, u in page_kw.items() if pk and k.startswith(pk + ' ') and k.split()[0] in ('gia', 'bang')), None)
            if hit and hit != r['url_moi']:
                r['xung_dot'] = (r['xung_dot'] + '; ' if r['xung_dot'] else '') + 'bài nhắm từ khóa của trang ' + hit
                conflicts.append(('bài viết ăn từ khóa trang trụ cột', k, [r['url_moi'], hit]))
    near = lambda a, b: a != b and (a.rstrip('s') == b.rstrip('s'))  # holding / holdings
    for r in rows.values():
        k = fold(r['tu_khoa_chinh'])
        for pk, u in page_kw.items():
            if u != r['url_moi'] and near(k, pk):
                r['xung_dot'] = (r['xung_dot'] + '; ' if r['xung_dot'] else '') + 'gần trùng từ khóa trang ' + u
                conflicts.append(('gần trùng (số ít/số nhiều)', k + ' ~ ' + pk, [r['url_moi'], u]))
    return rows, conflicts


def main():
    rows, conflicts = build()
    cols = ['url_moi', 'url_cu', 'tu_khoa_chinh', 'tu_khoa_phu', 'y_dinh', 'nguon', 'gsc_nhap', 'xung_dot']
    with open(D('keyword-map.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, cols)
        w.writeheader()
        w.writerows(sorted(rows.values(), key=lambda r: (-int(r['gsc_nhap']), r['url_moi'])))
    src = defaultdict(int)
    for r in rows.values():
        src[r['nguon'].split(' (')[0]] += 1
    print('URL có từ khóa: %d · nguồn: %s · xung đột: %d' % (len(rows), dict(src), len(conflicts)))
    for c in conflicts:
        print('  %s: "%s" → %s' % (c[0], c[1], ' | '.join(c[2])))


if __name__ == '__main__':
    sys.exit(main())
