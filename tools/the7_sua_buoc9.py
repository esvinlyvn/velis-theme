#!/usr/bin/env python3
"""The7 bước 9 – vòng sửa theo soát trực tiếp (2026-11-12). Dựng nội dung WPBakery mới từ nội dung đang có trên staging
(src.json = REST context=edit), không ghi gì; ghi lên staging bằng trình sửa (scratch apply.mjs, khóa ngày sửa).

- Một mẫu thẻ dự án duy nhất = phần tử The7 "Blog Masonry & Grid" lấy bài động (ảnh đại diện 4:3, tiêu đề bài, ô Tóm tắt 4 dòng:
  chủ đầu tư / khu vực / loại sản phẩm / "Bàn giao: …", link "Xem dự án →"); hàng chứa nó có class `velis-projects` (velis.css).
  Dùng ở trang chủ (chỉ dự án), /du-an/ (mọi bài chuyên mục Dự án), trang chủ đầu tư (dự án của CĐT đó).
- Dải "Dự án nổi bật" trong hero trang chủ = cùng phần tử, chọn bài trong ô Posts (`velis-feats` trong velis.css: thẻ ngang nhỏ, trượt).
- Trang dự án: nhãn đầu trang "chủ đầu tư · khu vực" theo một bộ tên khu vực (KHU_VUC), bỏ khối "Bài viết liên quan" của WPBakery
  (giữ "Bài viết nên xem" của The7 – chọn chuyên mục ở hộp Post Options), ảnh chỉ có huy hiệu trái dưới → class `velis-badge`.
- Đối tác: logo nền trong suốt, cân diện tích (data/the7/buoc-9/logo, Media 20820–20823).

Dùng: python3 -I tools/the7_sua_buoc9.py <src.json> <out_dir>      python3 -I tools/the7_sua_buoc9.py --test
"""
import csv
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from the7_sua_buoc8 import attr, lost, rows  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

# Một bộ tên khu vực thị trường (docs/KHU-VUC.md, cấp cụ thể nhất) – người dùng duyệt.
KHU_VUC = ('Nam Rạch Chiếc', 'Thủ Thiêm', 'Thảo Điền – An Phú', 'Khu Đông', 'Trung tâm', 'Nam Sài Gòn', 'Khu Tây', 'Tây Bắc',
           'Bình Dương', 'Nhơn Trạch – Long Thành')
# id: (tiêu đề thẻ = tiêu đề bài, chủ đầu tư, link trang CĐT, khu vực, loại sản phẩm, bàn giao) – dữ liệu thật trên trang dự án, 2026-11-12.
DU_AN = {
    20422: ('Palm River', 'Hướng Việt', None, 'Nam Rạch Chiếc', 'Căn hộ, TMDV, shophouse', 'năm 2028'),
    19962: ('The Privé', 'Đất Xanh', None, 'Nam Rạch Chiếc', 'Căn hộ hạng sang', 'năm 2027 (dự kiến)'),
    20067: ('The Global City', 'Masterise Homes', '/du-an/masterise-homes/', 'Nam Rạch Chiếc', 'Căn hộ, nhà phố, shophouse, biệt thự', 'chưa công bố'),
    19855: ('Persa Place', 'Gamuda Land', '/du-an/gamuda-land/', 'Nhơn Trạch – Long Thành', 'Căn hộ', 'quý 3/2028 (dự kiến)'),
    19934: ('Ansana by Kita', 'Kita Group', None, 'Khu Tây', 'Căn hộ, studio, shophouse', 'quý 3/2028 (dự kiến)'),
    19773: ('Spring Ville', 'Gamuda Land', '/du-an/gamuda-land/', 'Nhơn Trạch – Long Thành', 'Nhà phố, shophouse, căn hộ', 'quý 2/2027'),
    20360: ('Vinhomes Saigon Park', 'Vinhomes', '/du-an/vinhomes/', 'Tây Bắc', 'Căn hộ, nhà phố, shophouse, biệt thự', 'chưa công bố'),
}
PHAN_KHU = (20422, 19855)  # Palm River (Palm City), Persa Place (Springville): không vào lưới "Dự án Velis đang tư vấn"
HOME_GRID = [19962, 20067, 19934, 19773, 20360]  # chỉ dự án; thứ tự hiển thị do phần tử sắp theo ngày đăng, mới nhất trước
HOME_FEATS = [19962, 20067, 19934, 19773]  # dải "Dự án nổi bật": 4 dự án mới nhất (người dùng đổi trong ô Posts)
DEV_PROJECTS = {19593: [20360], 19633: [20067], 19637: [19773, 19855]}
LOGOS = {19641: 20820, 19644: 20821, 19648: 20822, 19652: 20823}  # ảnh logo cũ (nền xám) → logo nền trong suốt cân diện tích
CAT_DU_AN = 34
COLS_2 = 'desktop:2|h_tablet:2|v_tablet:2|phone:1'  # trang có cột phải (chủ đầu tư): cột chính 8/12 → 2 thẻ/hàng


def safe_badge_ids(path=ROOT / 'data' / 'kiem-ke-anh-mat.csv'):
    """Ảnh chỉ có huy hiệu VELIS ở góc trái dưới (soát mắt) – phóng cắt 1,12 neo phải trên là an toàn; ảnh có chữ/poster/bản đồ thì không."""
    with open(path, encoding='utf-8') as f:
        return {int(r['id']) for r in csv.DictReader(f, delimiter=';') if r['co_dau'] == 'huy-hieu-velis' and r['vi_tri'] == 'trái dưới'}


def excerpt(pid):
    """Ô Tóm tắt của bài dự án: 4 dòng cách nhau 1 dòng trống (mỗi dòng thành 1 đoạn – velis.css xếp lên thẻ)."""
    _, dev, _, area, kind, done = DU_AN[pid]
    assert area in KHU_VUC, area
    return f'{dev}\n\n{area}\n\n{kind}\n\nBàn giao: {done}'


def eyebrow(pid):
    _, dev, link, area, *_ = DU_AN[pid]
    return f'<p class="velis-eyebrow">{f"<a href={chr(34)}{link}{chr(34)}>{dev}</a>" if link else dev} · {area}</p>'


def grid(ids=None, n=12, cols='desktop:3|h_tablet:3|v_tablet:2|phone:1'):
    """Lưới thẻ dự án (The7 Blog Masonry & Grid, chế độ lưới CSS): theo danh sách bài, hoặc mọi bài chuyên mục Dự án."""
    src = f'post_type="posts" posts="{",".join(map(str, ids))}"' if ids else f'post_type="category" category="{CAT_DU_AN}"'
    return (f'[dt_blog_masonry {src} mode="grid" layout="classic" image_sizing="resize" resized_image_dimensions="4x3" '
            'image_scale_animation_on_hover="disabled" image_hover_bg_color="disabled" '
            f'bwb_columns="{cols}" gap_between_posts="12px" all_posts_the_same_width="y" content_alignment="left" '
            'post_content_paddings="24px 24px 24px 24px" post_date="n" post_category="n" post_author="n" post_comments="n" '
            'post_content="show_excerpt" read_more_button="default_link" read_more_button_text="Xem dự án →" '
            f'loading_mode="disabled" dis_posts_total="{n}" orderby="date" order="desc"]')


def feats(ids):
    """Dải "Dự án nổi bật" trong hero: thẻ ngang nhỏ (ảnh 13:9 + tên + khu vực), tối đa 4, trượt tay (velis.css .velis-feats)."""
    return ('[vc_column_text css="" el_class="velis-feats-title"]\n<p class="velis-eyebrow">Dự án nổi bật</p>\n[/vc_column_text]'
            f'[dt_blog_masonry post_type="posts" posts="{",".join(map(str, ids))}" mode="grid" layout="classic" image_sizing="resize" '
            'resized_image_dimensions="13x9" image_scale_animation_on_hover="disabled" image_hover_bg_color="disabled" '
            'bwb_columns="desktop:4|h_tablet:3|v_tablet:2|phone:1" gap_between_posts="6px" all_posts_the_same_width="y" '
            'content_alignment="left" content_bg="n" post_content_paddings="0px 0px 0px 0px" post_date="n" post_category="n" '
            'post_author="n" post_comments="n" post_content="show_excerpt" read_more_button="off" loading_mode="disabled" '
            'dis_posts_total="4" orderby="date" order="desc"]')


def add_class(row_head, cls):
    """Thêm class vào Extra class của hàng (row/section) – giữ class sẵn có."""
    if f'el_class="' in row_head:
        return re.sub(r'el_class="([^"]*)"', lambda m: f'el_class="{(m.group(1) + " " + cls).strip()}"' if cls not in m.group(1).split() else m.group(0), row_head, count=1)
    return row_head.replace(']', f' el_class="{cls}"]', 1)


def head_add(row, cls):
    head, rest = row.split(']', 1)
    return add_class(head + ']', cls) + rest


def badge(raw, safe):
    """Ảnh WPBakery chỉ có huy hiệu trái dưới, chưa có Extra class → `velis-badge` (phóng cắt, giữ tỉ lệ ảnh)."""
    def one(m):
        tag = m.group(0)
        if 'el_class=' in tag or int(m.group(1)) not in safe:
            return tag
        return tag[:-1] + ' el_class="velis-badge"]'
    return re.sub(r'\[vc_single_image image="(\d+)"[^\]]*\]', one, raw)


def project(pid, raw, safe):
    out = []
    for r in rows(raw):
        eid = attr(r, 'el_id')
        if eid == 'bai-lien-quan':
            continue  # trùng "Bài viết nên xem" của The7 (cùng chuyên mục blog của dự án, chọn ở Post Options)
        if eid == 'gioi-thieu':
            r = re.sub(r'<p class="velis-eyebrow">.*?</p>', eyebrow(pid), r, count=1)
        out.append(badge(r, safe))
    return ''.join(out)


def developer(pid, raw, safe):
    out = []
    for r in rows(raw):
        if 'el_class="velis-cards"' in r:
            r = re.sub(r'\[vc_row_inner el_class="velis-cards"\].*\[/vc_row_inner\]', grid(DEV_PROJECTS[pid], cols=COLS_2), r, flags=re.S)
            r = head_add(r, 'velis-projects')
        out.append(badge(r, safe))
    return ''.join(out)


def du_an(raw):
    """Bỏ thẻ ngang + 2 lưới thẻ tĩnh, thay bằng 1 lưới động mọi bài chuyên mục Dự án (mới nhất trước)."""
    r = rows(raw)
    i = next(k for k, x in enumerate(r) if 'el_class="velis-cards"' in x)
    body = re.sub(r'(\[vc_row_inner el_class="velis-cards"\].*?\[/vc_row_inner\])+', grid(), r[i], count=1, flags=re.S)
    assert 'velis-cards' not in body
    r[i] = head_add(body, 'velis-projects')
    return ''.join(r)


def home(raw):
    r = rows(raw)
    for k, x in enumerate(r):
        eid = attr(x, 'el_id')
        if eid == 'hero':
            x = x.replace('[/dt_default_button][/vc_column][/vc_row][/vc_section]', '[/dt_default_button]' + feats(HOME_FEATS) + '[/vc_column][/vc_row][/vc_section]', 1)
            assert 'velis-feats' in x
            r[k] = head_add(x, 'velis-feats')
        elif eid == 'du-an':
            x = re.sub(r'\[dt_blog_masonry [^\]]*\]', grid(HOME_GRID, n=6), x, count=1)
            r[k] = head_add(x, 'velis-projects')
        elif eid == 'doi-tac':
            for old, new in LOGOS.items():
                assert f'image="{old}" img_size="large"' in x
                x = x.replace(f'image="{old}" img_size="large"', f'image="{new}" img_size="full"')
            r[k] = x
    return ''.join(r)


def template_du_an(t):
    t = re.sub(r'<p class="velis-eyebrow">.*?</p>', '<p class="velis-eyebrow">[Chủ đầu tư] · [Khu vực thị trường – docs/KHU-VUC.md]</p>', t, count=1)
    return ''.join(x for x in rows(t) if attr(x, 'el_id') != 'bai-lien-quan')


def template_chu_dau_tu(t):
    t = t.replace('<p>[1 dự án: đổi cột thành 1/1 + class velis-card-wide (thẻ ngang)]</p>',
                  '<p>[Chọn dự án của chủ đầu tư ở ô Posts của phần tử Blog Masonry &amp; Grid bên dưới]</p>')
    return ''.join(head_add(re.sub(r'\[vc_row_inner el_class="velis-cards"\].*\[/vc_row_inner\]', grid([0], cols=COLS_2).replace('posts="0"', 'posts=""'), x, flags=re.S), 'velis-projects')
                   if 'el_class="velis-cards"' in x else x for x in rows(t))


def build(src, safe):
    out = {}
    for x in src.values():
        x['content']['raw'] = x['content']['raw'].replace('\r\n', '\n')
    for pid in DU_AN:
        out[pid] = project(pid, src[pid]['content']['raw'], safe)
    for pid in (19593, 19625, 19633, 19637):
        out[pid] = developer(pid, src[pid]['content']['raw'], safe)
    out[19537] = du_an(src[19537]['content']['raw'])
    out[19526] = home(src[19526]['content']['raw'])
    return out


def self_test():
    assert all(DU_AN[i][3] in KHU_VUC for i in DU_AN) and set(HOME_GRID) | set(PHAN_KHU) == set(DU_AN) and not set(HOME_GRID) & set(PHAN_KHU)
    assert excerpt(19962) == 'Đất Xanh\n\nNam Rạch Chiếc\n\nCăn hộ hạng sang\n\nBàn giao: năm 2027 (dự kiến)'
    assert eyebrow(20067) == '<p class="velis-eyebrow"><a href="/du-an/masterise-homes/">Masterise Homes</a> · Nam Rạch Chiếc</p>'
    assert 'post_type="posts" posts="1,2"' in grid([1, 2]) and 'category="34"' in grid() and 'Xem dự án →' in grid()
    assert add_class('[vc_row el_id="a" el_class="velis-section" css=""]', 'velis-projects') == '[vc_row el_id="a" el_class="velis-section velis-projects" css=""]'
    assert add_class('[vc_row el_id="a" css=""]', 'x') == '[vc_row el_id="a" css="" el_class="x"]'
    assert add_class('[vc_row el_class="x"]', 'x') == '[vc_row el_class="x"]'
    b = badge('[vc_single_image image="5" img_size="full"][vc_single_image image="6" el_class="velis-crop"][vc_single_image image="7"]', {5, 6})
    assert b == '[vc_single_image image="5" img_size="full" el_class="velis-badge"][vc_single_image image="6" el_class="velis-crop"][vc_single_image image="7"]', b
    raw = ('[vc_row el_id="gioi-thieu" el_class="velis-hero"][vc_column][vc_column_text]<p class="velis-eyebrow">Dự án · Palm City</p><h1>X</h1>[/vc_column_text][/vc_column][/vc_row]'
           '[vc_row el_id="bai-lien-quan" el_class="velis-section"][vc_column][/vc_column][/vc_row]')
    p = project(20422, raw, set())
    assert 'bai-lien-quan' not in p and 'Hướng Việt · Nam Rạch Chiếc' in p and '<h1>X</h1>' in p
    d = du_an('[vc_row el_id="danh-sach" css=""][vc_column][vc_column_text css=""]<h2>D</h2>[/vc_column_text][vc_row_inner el_class="velis-cards"][vc_column_inner]a[/vc_column_inner][/vc_row_inner]'
              '[vc_row_inner el_class="velis-cards"][vc_column_inner]b[/vc_column_inner][/vc_row_inner][/vc_column][/vc_row][vc_row el_id="vi-sao"][vc_column][/vc_column][/vc_row]')
    assert d.count('[dt_blog_masonry') == 1 and 'velis-projects' in d and '<h2>D</h2>' in d and 'vi-sao' in d, d
    assert len(safe_badge_ids()) > 100 and 19968 in safe_badge_ids()
    print('self-test ok')


def main(src_path, out_dir):
    d = json.load(open(src_path))
    src = {int(k): v for k, v in d.items()}
    safe = safe_badge_ids()
    out = build(src, safe)
    od = Path(out_dir)
    od.mkdir(parents=True, exist_ok=True)
    report = {}
    for pid, new in out.items():
        (od / f'{pid}.txt').write_text(new)
        report[pid] = {'title': src[pid]['title']['raw'], 'lost': lost(src[pid]['content']['raw'], new), 'badge': new.count('velis-badge'),
                       'grids': new.count('[dt_blog_masonry'), 'len': [len(src[pid]['content']['raw']), len(new)]}
    for pid in DU_AN:
        (od / f'{pid}.excerpt').write_text(excerpt(pid))
        if src[pid]['title']['raw'] != DU_AN[pid][0]:
            (od / f'{pid}.title').write_text(DU_AN[pid][0])
            report[pid]['new_title'] = DU_AN[pid][0]
    tdir = ROOT / 'data' / 'the7' / 'mau-wpbakery'
    for name, fn in (('du-an', template_du_an), ('chu-dau-tu', template_chu_dau_tu)):
        (od / f'mau-{name}.txt').write_text(fn((tdir / f'{name}.txt').read_text()))
    json.dump(report, open(od / 'report.json', 'w'), ensure_ascii=False, indent=1)
    for pid, r in report.items():
        print(pid, r['title'][:24], '→', r.get('new_title', '='), 'badge', r['badge'], 'grids', r['grids'], 'len', r['len'], 'lost', dict(list(r['lost'].items())[:10]))


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        self_test()
    else:
        main(*sys.argv[1:3])
