"""Proposal of a post kind for every published post, from words in its title (the rule the theme used to apply on its
own). Not applied: the list is reviewed in the content phase, then set by hand in velis-data ("Loại bài").
Usage: python3 -I tools/propose_post_kinds.py  → data/post-types-proposal.csv"""
import csv, html, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABELS = {'phan-tich': 'Phân tích sản phẩm', 'nhan-dinh': 'Nhận định thị trường', 'so-sanh': 'So sánh',
          'huong-dan': 'Hướng dẫn mua & pháp lý', 'tin': 'Tin tiến độ & chính sách'}
RULES = [('so-sanh', r'so sánh|\bvs\b|khác gì'),
         ('huong-dan', r'hướng dẫn|thủ tục|quy trình|pháp lý|sổ hồng|vay|hợp đồng|kinh nghiệm mua|lưu ý'),
         ('tin', r'tiến độ|chính sách|cập nhật|mở bán|bảng giá|ra mắt'),
         ('nhan-dinh', r'thị trường|nhận định|xu hướng|dự báo|triển vọng|tiềm năng')]


def propose(title):
    """(kind, matched words); default phân tích sản phẩm."""
    t = title.lower()
    for kind, rx in RULES:
        m = re.search(rx, t)
        if m:
            return kind, m.group(0)
    return 'phan-tich', ''


def main():
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from import_staging import api  # staging, read only
    posts = []
    for page in range(1, 5):
        r = api('GET', 'posts?per_page=100&page=%d&_fields=id,link,title,meta' % page)
        posts += r
        if len(r) < 100:
            break
    with open(os.path.join(ROOT, 'data', 'post-types-proposal.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['id', 'url', 'tieu_de', 'de_xuat', 'nhan', 'tu_khop', 'da_gan'])
        for p in posts:
            title = html.unescape(p['title']['rendered'])
            kind, hit = propose(title)
            w.writerow([p['id'], p['link'].replace('https://staging.velisrealty.vn', ''), title, kind, LABELS[kind], hit, p['meta'].get('velis_post_kind', '')])
    print(len(posts), 'bài')


if __name__ == '__main__':
    main()
