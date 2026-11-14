#!/usr/bin/env python3
"""The7 bước 12 (2026-11-13) – CTA "Nhận bảng giá" một thành phần cho trang sản phẩm. Dựng nội dung WPBakery mới từ nội dung đang có
(src.json = REST context=edit: [{id, raw}]), không ghi gì; ghi lên staging bằng trình sửa cổ điển (scratch apply.mjs, khóa ngày sửa).

- Hàng "lien-he-tu-van" (class velis-cta, 2 cột chữ + form) → một cột: nhãn, H2 lợi ích, 3 dòng ✓, form CF7 "Nhận bảng giá"
  (ID FORM, trường ẩn du-an = tên dự án), dòng gọi hotline / Zalo. Chữ đổi được trong WPBakery (Text Block), màu ở velis.css.
- Nút ở phần đầu trang "Nhận tư vấn" → "Nhận bảng giá" (cùng đích #lien-he-tu-van); trang không có bảng giá (Sun Group): giữ.
- /chu-dau-tu/ (chưa có khối tư vấn): thêm hàng CTA chung cuối trang.
- Lời (docs/VOICE.md, không cường điệu): lấy từ nội dung đang có – /chinh-sach-bao-mat/ ("bảng giá chi tiết, giỏ hàng, chính sách bán
  hàng và phân tích tiềm năng đầu tư theo đúng nhu cầu"), /lien-he/ ("phương án phù hợp với mục tiêu và số vốn", 08:00–21:00).

Dùng: python3 -I tools/the7_sua_buoc12.py <src.json> <out_dir>       python3 -I tools/the7_sua_buoc12.py --test
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FORM = 20958  # CF7 "Nhận bảng giá" (staging) – site thật: ID mới khi tạo, xem docs/the7/DUA-LEN-SITE-THAT.md
# Trang sản phẩm → (tên dự án ghi vào lead, tiêu đề H2, có bảng giá/giỏ hàng)
PAGES = {
    20422: ('Palm River', 'Nhận bảng giá &amp; giỏ hàng Palm River', True),
    19962: ('The Privé', 'Nhận bảng giá &amp; giỏ hàng The Privé', True),
    20067: ('The Global City', 'Nhận bảng giá &amp; giỏ hàng The Global City', True),
    19855: ('Persa Place', 'Nhận bảng giá &amp; giỏ hàng Persa Place', True),
    19934: ('Ansana by Kita', 'Nhận bảng giá &amp; giỏ hàng Ansana by Kita', True),
    19773: ('Spring Ville', 'Nhận bảng giá &amp; giỏ hàng Spring Ville', True),
    20360: ('Vinhomes Saigon Park', 'Nhận bảng giá &amp; giỏ hàng Vinhomes Saigon Park', True),
    19593: ('Vinhomes', 'Nhận bảng giá các dự án Vinhomes', True),
    19633: ('Masterise Homes', 'Nhận bảng giá các dự án Masterise Homes', True),
    19637: ('Gamuda Land', 'Nhận bảng giá các dự án Gamuda Land', True),
    19625: ('Sun Group', 'Nhận tư vấn dự án Sun Group', False),  # site chưa có dự án Sun Group đang phân phối – không hứa bảng giá
    20955: ('', 'Nhận bảng giá &amp; tư vấn dự án', True),
}
CHECKS_GIA = ('Bảng giá chi tiết và chính sách bán hàng mới nhất', 'Giỏ hàng căn đang có, chọn theo nhu cầu và số vốn',
              'Phân tích pháp lý và tiềm năng đầu tư của dự án')
CHECKS_TU_VAN = ('Thông tin dự án và pháp lý cập nhật', 'Phân tích tiềm năng đầu tư theo đúng nhu cầu',
                 'Phương án phù hợp với mục tiêu và số vốn')
CALL = ('<p class="velis-cta-call">Hoặc gọi ngay <a href="tel:0911237979">0911 237 979</a> · '
        '<a href="https://zalo.me/0911237979" target="_blank" rel="noopener">Zalo</a> (08:00–21:00 hằng ngày)</p>')


def cta_row(name, h2, gia=True, form=FORM):
    checks = ''.join(f'<li>{c}</li>' for c in (CHECKS_GIA if gia else CHECKS_TU_VAN))
    return ('[vc_row el_id="lien-he-tu-van" el_class="velis-cta"][vc_column][vc_column_text css=""]\n'
            '<p class="velis-eyebrow">Tư vấn trực tiếp từ Velis Realty</p>\n'
            f'<h2>{h2}</h2>\n<ul class="velis-checks">{checks}</ul>\n'
            f'[/vc_column_text][contact-form-7 id="{form}" title="Nhận bảng giá" du-an="{name}"][vc_column_text css=""]\n'
            f'{CALL}\n[/vc_column_text][/vc_column][/vc_row]')


CTA_RE = re.compile(r'\[vc_row\b[^\]]*el_id="lien-he-tu-van"[^\]]*\].*?\[/vc_row\]', re.S)
BTN_OLD = 'link="url:%23lien-he-tu-van|title:Nh%E1%BA%ADn%20t%C6%B0%20v%E1%BA%A5n"'
BTN_NEW = 'link="url:%23lien-he-tu-van|title:Nh%E1%BA%ADn%20b%E1%BA%A3ng%20gi%C3%A1"'


def build(pid, raw):
    name, h2, gia = PAGES[pid]
    row = cta_row(name, h2, gia)
    n = len(CTA_RE.findall(raw))
    assert n <= 1, (pid, 'nhiều hàng lien-he-tu-van', n)
    raw = CTA_RE.sub(lambda m: row, raw) if n else raw.rstrip() + row
    if gia:
        raw = re.sub(r'\[dt_default_button ' + re.escape(BTN_OLD) + r'([^\]]*)\]Nhận tư vấn\[/dt_default_button\]',
                     lambda m: f'[dt_default_button {BTN_NEW}{m.group(1)}]Nhận bảng giá[/dt_default_button]', raw)
    return raw


def template(raw, name_ph, h2_ph):
    """Mẫu WPBakery: cùng hàng CTA, chữ chờ tên dự án."""
    return CTA_RE.sub(lambda m: cta_row(name_ph, h2_ph), raw).replace(BTN_OLD + ' size="big"]Nhận tư vấn', BTN_NEW + ' size="big"]Nhận bảng giá')


def test():
    old = ('[vc_row el_id="gioi-thieu"][vc_column][dt_default_button ' + BTN_OLD + ' size="big"]Nhận tư vấn[/dt_default_button][/vc_column][/vc_row]'
           '[vc_row el_id="cau-hoi"][vc_column]x[/vc_column][/vc_row][vc_row el_id="lien-he-tu-van" el_class="velis-cta" css=".a{}"][vc_column width="1/2"]a'
           '[/vc_column][vc_column width="1/2"][contact-form-7 id="19582" title="Liên Hệ"][/vc_column][/vc_row][vc_row el_id="bai-lien-quan"][vc_column]b[/vc_column][/vc_row]')
    new = build(19962, old)
    assert new.count('lien-he-tu-van"') == 1 and 'contact-form-7 id="20958"' in new and 'du-an="The Privé"' in new and '19582' not in new
    assert new.index('el_id="cau-hoi"') < new.index('velis-cta') < new.index('bai-lien-quan'), 'giữ đúng vị trí'
    assert ']Nhận bảng giá[/dt_default_button]' in new and 'Nhận tư vấn' not in new and 'Giỏ hàng căn' in new
    sun = build(19625, old)
    assert ']Nhận tư vấn[/dt_default_button]' in sun and 'Nhận tư vấn dự án Sun Group' in sun and 'Bảng giá chi tiết' not in sun
    hub = build(20955, '[vc_row el_id="gioi-thieu"][vc_column]x[/vc_column][/vc_row]')
    assert hub.endswith('[/vc_row]') and hub.count('el_class="velis-cta"') == 1 and 'du-an=""' in hub
    assert build(19962, new) == new, 'chạy lại không đổi'
    for t in ('du-an.txt', 'chu-dau-tu.txt'):
        assert len(CTA_RE.findall((ROOT / 'data/the7/mau-wpbakery' / t).read_text())) == 1, t
    print('test ok')


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        test()
        sys.exit()
    src, out = json.load(open(sys.argv[1])), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    by = {x['id']: x['raw'] for x in src}
    for pid in PAGES:
        new = build(pid, by[pid])
        (out / f'{pid}.txt').write_text(new)
        print(pid, PAGES[pid][0] or '(chung)', len(by[pid]), '→', len(new))
    d = ROOT / 'data/the7/mau-wpbakery'
    (d / 'du-an.txt').write_text(template((d / 'du-an.txt').read_text(), '[Tên dự án]', 'Nhận bảng giá &amp; giỏ hàng [tên dự án]'))
    (d / 'chu-dau-tu.txt').write_text(template((d / 'chu-dau-tu.txt').read_text(), '[Tên chủ đầu tư]', 'Nhận bảng giá các dự án [tên chủ đầu tư]'))
    print('mẫu: du-an.txt, chu-dau-tu.txt')
