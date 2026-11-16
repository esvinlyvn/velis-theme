#!/usr/bin/env python3
"""The7 bước 10 – vòng hoàn thiện (2026-11-12). Dựng nội dung WPBakery mới từ nội dung đang có trên staging (src.json, posts.json =
REST context=edit), không ghi gì; ghi lên staging bằng trình sửa cổ điển (scratch apply.mjs, khóa ngày sửa).

- Thẻ dự án: bỏ link chữ "Xem dự án →" (read_more_button="off"; cả thẻ là link tiêu đề, chữ "Xem dự án →" là trang trí ở velis.css).
- Lưới trang chủ "Dự án Velis đang tư vấn" lấy theo chuyên mục Dự án (34) – phân khu nằm ở chuyên mục "Phân khu" riêng nên tự bị loại,
  không còn danh sách chọn tay; /du-an/ lấy cả Dự án + Phân khu.
- Thứ bậc tiêu đề (D2): tiêu đề "Xem thêm" của khối thu gọn là chữ điều khiển (Use custom font → thẻ p), câu hỏi thường gặp là H3
  (trước: H4 mặc định của Toggle, nhảy cấp H2 → H4); nhãn "Dự án nổi bật" trong hero là H2. (Trang chuyên mục / tìm kiếm: The7 không
  dùng nội dung trang mẫu 20733 – chỉ cài đặt –, H2 ẩn trước danh sách nằm ở theme con, hook presscore_before_loop.)
- Ảnh hero trang chủ (E1): ảnh nền CSS → phần tử Single Image (Extra class velis-hero-bg) – thẻ <img> có srcset, tải sớm.
- Ảnh trong bài blog chỉ có huy hiệu trái dưới (C4, data/the7/buoc-9/anh-huy-hieu.csv) → class "velis-badge" trên thẻ img.
- Địa chỉ dự án cho schema Place (D1): trường tùy chỉnh velis_dia_chi = ô "Vị trí" của thanh thông tin trang dự án (+ tỉnh/thành).

Dùng: python3 -I tools/the7_sua_buoc10.py <src.json> <posts.json> <out_dir> <id_phan_khu>      python3 -I tools/the7_sua_buoc10.py --test
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CAT_DU_AN = 34
PHAN_KHU = (20422, 19855)  # Palm River (Palm City), Persa Place (Springville) → chuyên mục "Phân khu", rời chuyên mục Dự án
PROJECTS = (20422, 19962, 20067, 19855, 19934, 19773, 20360)
DEVELOPERS = (19593, 19625, 19633, 19637)
HERO_IMAGE = 19968  # ảnh hero đang dùng (nền CSS cũ) – The Privé, đã duyệt
# Ô "Vị trí" của thanh thông tin từng trang dự án (staging 2026-11-12) + tỉnh/thành – dữ liệu thật, không thêm số nhà / phường đoán.
DIA_CHI = {
    20422: 'Khu đô thị Palm City, khu Đông TP. Hồ Chí Minh (trước đây Quận 2)',
    19962: 'Nam Rạch Chiếc, khu Đông TP. Hồ Chí Minh (trước đây Quận 2)',
    20067: 'Đường Đỗ Xuân Hợp, khu Đông TP. Hồ Chí Minh (trước đây Quận 2)',
    19855: 'Khu đô thị Springville, mặt tiền Tôn Đức Thắng, Nhơn Trạch, Đồng Nai',
    19934: '69 Võ Văn Kiệt, khu Tây TP. Hồ Chí Minh (trước đây quận Bình Tân)',
    19773: 'Đường Tôn Đức Thắng, Hiệp Phước, Nhơn Trạch, Đồng Nai',
    20360: 'Xã Xuân Thới Sơn, TP. Hồ Chí Minh (trước đây huyện Hóc Môn)',
}
MORE = ' use_custom_heading="true" custom_font_container="tag:p|text_align:left" custom_use_theme_fonts="yes"'
FAQ = ' use_custom_heading="true" custom_font_container="tag:h3|text_align:left" custom_use_theme_fonts="yes"'


def toggles(raw):
    """Toggle "Xem thêm" (velis-more) → tiêu đề thẻ p; Toggle câu hỏi → H3. Toggle đã có Use custom font giữ nguyên."""
    def one(m):
        tag = m.group(0)
        if 'use_custom_heading=' in tag:
            return tag
        return tag[:-1] + (MORE if 'velis-more' in tag else FAQ) + ']'
    return re.sub(r'\[vc_toggle\b(?:"[^"]*"|[^\]"])*\]', one, raw)  # giá trị trong "…" có thể chứa ] ("[Câu hỏi 1]")


def no_read_more(raw):
    """Lưới thẻ dự án: bỏ link chữ "Xem dự án →" (cả thẻ đã là link)."""
    return raw.replace('read_more_button="default_link" read_more_button_text="Xem dự án →"', 'read_more_button="off"')


def hero_img(raw):
    """Hero trang chủ: bỏ ảnh nền CSS của section, thêm Single Image velis-hero-bg đầu cột (cùng ảnh)."""
    m = re.search(r'\[vc_section [^\]]*el_id="hero"[^\]]*\]', raw)
    head = m.group(0)
    img = re.search(r'background-image: url\([^)]*\?id=(\d+)\) !important;', head)
    new_head = re.sub(r'background-image: url\([^)]*\) !important;background-position: [^;]*;background-repeat: [^;]*;background-size: [^;]*;', '', head)
    assert img and int(img.group(1)) == HERO_IMAGE and 'background-image' not in new_head, head
    out = raw.replace(head, new_head, 1)
    first_col = out.index('[vc_column]', out.index(new_head)) + len('[vc_column]')
    return out[:first_col] + f'[vc_single_image image="{HERO_IMAGE}" img_size="full" el_class="velis-hero-bg"]' + out[first_col:]


def home(raw):
    raw = hero_img(raw)
    raw = raw.replace('<p class="velis-eyebrow">Dự án nổi bật</p>', '<h2 class="velis-eyebrow">Dự án nổi bật</h2>', 1)
    raw, n = re.subn(r'(\[dt_blog_masonry )post_type="posts" posts="[\d,]+"( mode="grid" layout="classic" image_sizing="resize" resized_image_dimensions="4x3")',
                     rf'\1post_type="category" category="{CAT_DU_AN}"\2', raw)
    assert n == 1
    return no_read_more(raw)


def du_an(raw, pk):
    raw, n = re.subn(rf'post_type="category" category="{CAT_DU_AN}"', f'post_type="category" category="{CAT_DU_AN},{pk}"', raw)
    assert n == 1
    return no_read_more(raw)


def badge_imgs(raw, ids):
    """Thêm class velis-badge vào thẻ img (wp-image-ID) của ảnh chỉ có huy hiệu trái dưới."""
    def one(m):
        tag = m.group(0)
        mid = re.search(r'\bwp-image-(\d+)\b', tag)
        if not mid or int(mid.group(1)) not in ids or re.search(r'class="[^"]*\bvelis-badge\b', tag):
            return tag
        return re.sub(r'class="([^"]*)"', r'class="\1 velis-badge"', tag, count=1)
    return re.sub(r'<img\b[^>]*>', one, raw)


def badge_plan(path=ROOT / 'data' / 'the7' / 'buoc-9' / 'anh-huy-hieu.csv'):
    """{slug bài: {id ảnh}} – các lượt "cắt được" ở bài blog."""
    out = {}
    with open(path, encoding='utf-8') as f:
        for r in csv.DictReader(f):
            if r['xu_ly'].startswith('cắt được: thêm class velis-badge'):
                out.setdefault(r['trang'].strip('/').split('/')[-1], set()).add(int(r['id']))
    return out


def build(src, posts, pk):
    out = {19526: home(src[19526]), 19537: du_an(src[19537], pk)}
    for pid in PROJECTS + DEVELOPERS:
        out[pid] = no_read_more(toggles(src[pid]))
    plan = badge_plan()
    for p in posts:
        if p['slug'] in plan:
            cur = out.get(p['id'], p['content']['raw'].replace('\r\n', '\n'))
            new = badge_imgs(cur, plan[p['slug']])
            if new != src.get(p['id'], cur):
                out[p['id']] = new
    return out


def self_test():
    t = toggles('[vc_toggle title="Xem thêm" style="text_only" el_class="velis-more"]a[/vc_toggle][vc_toggle title="Hỏi?" css=""]b[/vc_toggle]'
                '[vc_toggle title="Q" use_custom_heading="true" custom_font_container="tag:h3|text_align:left"]c[/vc_toggle]')
    assert t.count('tag:p|') == 1 and t.count('tag:h3|') == 2 and t.count('custom_use_theme_fonts="yes"') == 2, t
    assert toggles(t) == t
    g = 'read_more_button="default_link" read_more_button_text="Xem dự án →" loading_mode'
    assert no_read_more(g) == 'read_more_button="off" loading_mode'
    h = ('[vc_section full_width="stretch_row" el_id="hero" el_class="velis-home-hero velis-feats" css=".vc_custom_1{background-color: #1A1A1A !important;'
         'background-image: url(/wp-content/uploads/2026/04/can-ho-the-prive.webp?id=19968) !important;background-position: right top !important;'
         'background-repeat: no-repeat !important;background-size: cover !important;}"][vc_row][vc_column][vc_column_text css=""]<p class="velis-eyebrow">Dự án nổi bật</p>'
         '[/vc_column_text][dt_blog_masonry post_type="posts" posts="1,2" mode="grid" layout="classic" image_sizing="resize" resized_image_dimensions="13x9"]'
         '[/vc_column][/vc_row][/vc_section][vc_section el_id="du-an"][vc_row][vc_column][dt_blog_masonry post_type="posts" posts="1,2,3" mode="grid" layout="classic" '
         'image_sizing="resize" resized_image_dimensions="4x3" ' + g + '][/vc_column][/vc_row][/vc_section]')
    o = home(h)
    assert 'background-image' not in o and 'background-color: #1A1A1A' in o and o.index('[vc_single_image image="19968"') < o.index('[vc_column_text')
    assert '<h2 class="velis-eyebrow">Dự án nổi bật</h2>' in o and 'post_type="category" category="34" mode="grid"' in o and 'posts="1,2"' in o and 'Xem dự án' not in o
    assert 'category="34,57"' in du_an('[dt_blog_masonry post_type="category" category="34" ' + g + ']', 57)
    b = badge_imgs('<img class="aligncenter size-large wp-image-5" src="a"><img class="wp-image-6" src="b"><img src="c">', {5})
    assert b == '<img class="aligncenter size-large wp-image-5 velis-badge" src="a"><img class="wp-image-6" src="b"><img src="c">' and badge_imgs(b, {5}) == b
    plan = badge_plan()
    assert sum(len(v) for v in plan.values()) <= 120 and len(plan) > 50
    assert set(DIA_CHI) == set(PROJECTS) and set(PHAN_KHU) < set(PROJECTS)
    print('self-test ok')


def main(src_path, posts_path, out_dir, pk):
    d = json.load(open(src_path))
    src = {int(k): v['content']['raw'].replace('\r\n', '\n') for k, v in d.items()}
    posts = json.load(open(posts_path))
    for p in posts:
        src.setdefault(p['id'], p['content']['raw'].replace('\r\n', '\n'))
    out = build(src, posts, int(pk))
    od = Path(out_dir)
    od.mkdir(parents=True, exist_ok=True)
    for pid, new in out.items():
        (od / f'{pid}.txt').write_text(new)
        print(pid, 'len', len(src[pid]), '→', len(new), 'toggle p/h3', new.count('tag:p|'), new.count('tag:h3|'), 'badge', new.count('velis-badge"') + new.count(' velis-badge'))
    for pid in PROJECTS:
        (od / f'{pid}.meta').write_text(json.dumps({'velis_dia_chi': DIA_CHI[pid]}, ensure_ascii=False))
    for pid in PHAN_KHU:
        (od / f'{pid}.cats').write_text(str(pk))
    tdir = ROOT / 'data' / 'the7' / 'mau-wpbakery'
    for name in ('du-an', 'chu-dau-tu'):
        (tdir / f'{name}.txt').write_text(no_read_more(toggles((tdir / f'{name}.txt').read_text())))


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        self_test()
    else:
        main(*sys.argv[1:5])
