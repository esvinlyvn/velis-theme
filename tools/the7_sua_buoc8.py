#!/usr/bin/env python3
"""The7 bước 8 – sửa một mạch theo đánh giá độc lập (docs/reports/the7-danh-gia-doc-lap.md). Chỉ dựng nội dung WPBakery mới
từ nội dung thật đang có (src.json = REST context=edit), không ghi gì; ghi lên staging bằng trình sửa (scratch apply.mjs).

- relink(): link nội bộ tuyệt đối/mã hóa URL (`url:https%3A%2F%2Fstaging…`) → đường dẫn tương đối (C2).
- project(): trang dự án – phần đầu 1 cột (breadcrumb The7, nhãn, H1, ảnh 16:9 cắt huy hiệu, đoạn dẫn, thanh thông tin
  6 ô dữ liệu thật, nút), khối chữ dài thu "Xem thêm" (vc_toggle), khối tư vấn có form CF7 (N2, N3).
- developer(): trang chủ đầu tư – breadcrumb trong phần đầu, thu gọn khối dài, form; 1 dự án = thẻ ngang (V7).
- home(), du_an(), lien_he(), gioi_thieu(): dựng lại theo DESIGN.md (C1, N4, N5, V1, V2, V3).
Kiểm: words() trước/sau – chỉ được mất đúng các chữ liệt kê (nhãn nút cũ, khối thông tin trùng, …).

Dùng: python3 -I tools/the7_sua_buoc8.py <src.json> <out_dir>      python3 -I tools/the7_sua_buoc8.py --test
"""
import base64
import html
import json
import re
import sys
import urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import heading_case as hc  # noqa: E402

HOST = 'staging.velisrealty.vn'
CF7 = '[contact-form-7 id="19582" title="Liên Hệ"]'
TEL, ZALO = '0911 237 979', 'https://zalo.me/0911237979'
NGA, CHAMP_SOFT, INK = '#FAF7F2', '#F3ECDF', '#1A1A1A'
_n = [1763000000000]

# Dữ liệu thật lấy từ chính trang dự án trên staging (bảng "Thông tin tổng quan" / đoạn chủ đầu tư), 2026-11-12.
# Vị trí ghi theo khu vực thị trường + "(trước đây …)" vì chưa có nguồn chính thức tên phường/xã mới cho từng dự án.
FACTS = {
    19962: [('Chủ đầu tư', 'Tập đoàn Đất Xanh'), ('Vị trí', 'Nam Rạch Chiếc, khu Đông TP.HCM (trước đây Quận 2)'),
            ('Quy mô', '6,7 ha · 12 tòa tháp'), ('Sản phẩm', 'Hơn 3.000 căn hộ hạng sang'),
            ('Thiết kế', 'CPG Consultants (Singapore)'), ('Bàn giao', 'Năm 2027 (dự kiến)')],
    20067: [('Chủ đầu tư', 'Masterise Homes'), ('Vị trí', 'Đường Đỗ Xuân Hợp, khu Đông TP.HCM (trước đây Quận 2)'),
            ('Quy mô', '117,4 ha · mật độ xây dựng 28%'), ('Sản phẩm', 'Căn hộ, nhà phố, shophouse, biệt thự'),
            ('Kiến trúc', 'Foster + Partners'), ('Khởi công', 'Tháng 3/2021')],
    19855: [('Chủ đầu tư', 'Gamuda Land (Malaysia)'), ('Vị trí', 'Khu đô thị Springville, mặt tiền Tôn Đức Thắng, Nhơn Trạch'),
            ('Quy mô', '1 tòa tháp 15 tầng · 7.320 m² đất'), ('Sản phẩm', '420 căn hộ và 9 căn shophouse khối đế'),
            ('Pháp lý', 'Đã có giấy phép xây dựng'), ('Bàn giao', 'Quý 3/2028 (dự kiến)')],
    20422: [('Chủ đầu tư', 'Hướng Việt'), ('Vị trí', 'Khu đô thị Palm City, khu Đông TP.HCM (trước đây Quận 2)'),
            ('Quy mô', '1,9 ha · 2 hầm, 36 tầng'), ('Sản phẩm', '620 căn hộ, 117 căn TMDV và shophouse'),
            ('Diện tích', '33–300 m²/căn'), ('Bàn giao', 'Năm 2028')],
    19934: [('Chủ đầu tư', 'Kita Group'), ('Vị trí', '69 Võ Văn Kiệt, khu Tây TP.HCM (trước đây quận Bình Tân)'),
            ('Quy mô', 'Khoảng 3 ha · mật độ xây dựng 33,7%'), ('Sản phẩm', 'Căn hộ, studio, shophouse khối đế'),
            ('Tổng thầu', 'Newtecons'), ('Bàn giao', 'Quý 3/2028 (dự kiến)')],
    19773: [('Chủ đầu tư', 'Gamuda Land'), ('Vị trí', 'Đường Tôn Đức Thắng, Hiệp Phước, Nhơn Trạch'), ('Quy mô', '18,26 ha'),
            ('Sản phẩm', 'Nhà phố, shophouse, căn hộ'), ('Triển khai', 'Quý II/2025'), ('Bàn giao', 'Quý II/2027')],
    20360: [('Chủ đầu tư', 'Berjaya Việt Nam'), ('Phát triển', 'Vinhomes'),
            ('Vị trí', 'Xã Xuân Thới Sơn, TP.HCM (trước đây huyện Hóc Môn)'), ('Quy mô', '1.080 ha'),
            ('Sản phẩm', 'Căn hộ, nhà phố liền kề, shophouse, biệt thự, dinh thự'), ('Khởi công', '29/04/2026')],
}
# Thẻ dự án /du-an/ (DESIGN "Mỗi loại một component"): chủ đầu tư · khu vực → tên → loại → bàn giao. Mới nhất trước.
CARDS = [
    (20422, 'Hướng Việt · Khu Đông', 'Căn hộ, TMDV, shophouse', 'Năm 2028'),
    (20360, 'Vinhomes · Tây Bắc TP.HCM', 'Căn hộ, nhà phố, shophouse, biệt thự', 'chưa công bố'),
    (20067, 'Masterise Homes · Khu Đông', 'Căn hộ, nhà phố, shophouse, biệt thự', 'chưa công bố'),
    (19962, 'Đất Xanh · Khu Đông', 'Căn hộ hạng sang', 'năm 2027 (dự kiến)'),
    (19934, 'Kita Group · Tây Sài Gòn', 'Căn hộ, studio, shophouse', 'quý 3/2028 (dự kiến)'),
    (19855, 'Gamuda Land · Nhơn Trạch', 'Căn hộ', 'quý 3/2028 (dự kiến)'),
    (19773, 'Gamuda Land · Nhơn Trạch', 'Nhà phố, shophouse, căn hộ', 'quý II/2027'),
]
PROJECTS, DEVELOPERS = list(FACTS), [19593, 19625, 19633, 19637]
KEEP_OPEN = ('gioi-thieu', 'cau-hoi', 'lien-he-tu-van', 'bai-lien-quan', 'du-an', 'danh-sach', 'thong-so', 'thong-tin', 'tien-do', 'cap-nhat-tien-do')
VISIBLE_WORDS = 60  # chữ còn hiện trước "Xem thêm" (DESIGN: thu khối chữ dài; Tổng quan ~150 từ – ở đây gọn hơn để trang 360 px ≤ 16 000 px)


def css(color=None, extra=''):
    _n[0] += 1
    return f'.vc_custom_{_n[0]}{{{f"background-color: {color} !important;" if color else ""}{extra}}}'


def words(s):
    s = re.sub(r'\[vc_raw_html[^\]]*\].*?\[/vc_raw_html\]', ' ', s, flags=re.S)
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    return html.unescape(re.sub(r'<[^>]+>', ' ', s)).replace('anh/chị', 'anh chị').replace('Anh/chị', 'Anh chị').split()


def relink(raw):
    """Link nội bộ → tương đối: href/link tuyệt đối tới staging và dạng mã hóa trong `link="url:…"` của phần tử WPB."""
    raw = re.sub(r'url:https?%3A%2F%2F' + re.escape(HOST), 'url:', raw)
    return re.sub(r'(href=["\']|link=["\'])https?://' + re.escape(HOST) + r'(?=/)', r'\1', raw)


def voice(raw):
    """VOICE.md: "anh chị" (không gạch chéo)."""
    return raw.replace('anh/chị', 'anh chị').replace('Anh/chị', 'Anh chị')


def rows(raw):
    """Tách nội dung thành các hàng cấp ngoài cùng ([vc_row …][/vc_row] hoặc [vc_section …][/vc_section])."""
    out, i = [], 0
    for m in re.finditer(r'\[(vc_row|vc_section)[ \]]', raw):
        if m.start() < i:
            continue
        tag = m.group(1)
        depth, j = 0, m.start()
        for t in re.finditer(r'\[(/?)%s[ \]]' % tag, raw[m.start():]):
            depth += -1 if t.group(1) else 1
            if depth == 0:
                j = m.start() + t.end()
                break
        if raw[i:m.start()].strip():
            out.append(raw[i:m.start()])
        out.append(raw[m.start():j])
        i = j
    if raw[i:].strip():
        out.append(raw[i:])
    return out


def attr(row, name):
    m = re.search(r'%s="([^"]*)"' % name, row.split(']', 1)[0])
    return m.group(1) if m else ''


def blocks(htm):
    """Khối HTML cấp ngoài (h2, p, ul, table…) của một Text Block; chữ trơn giữa các khối giữ nguyên thành khối riêng."""
    out, i = [], 0
    for m in re.finditer(r'<(h[1-6]|p|ul|ol|table|blockquote|div|figure)\b[^>]*>', htm):
        if m.start() < i:
            continue
        tag, depth = m.group(1), 0
        for t in re.finditer(r'<(/?)%s\b[^>]*>' % tag, htm[m.start():]):
            depth += -1 if t.group(1) else 1
            if depth == 0:
                end = m.start() + t.end()
                break
        else:
            end = len(htm)
        if htm[i:m.start()].strip():
            out.append(htm[i:m.start()].strip())
        out.append(htm[m.start():end])
        i = end
    if htm[i:].strip():
        out.append(htm[i:].strip())
    return out


def collapse(row):
    """Hàng chữ dài: giữ tiêu đề + ~60 chữ đầu, phần còn lại của các Text Block vào 1 vc_toggle "Xem thêm" ngay sau.
    Ảnh, bảng con, nút (phần tử khác Text Block) giữ nguyên chỗ, luôn hiện."""
    if len(words(row)) <= VISIBLE_WORDS * 2:
        return row
    head, body = row.split(']', 1)
    col = re.match(r'\[vc_column([^\]]*)\](.*)\[/vc_column\]\[/vc_row\]\s*$', body, re.S)
    if not col or '[vc_column ' in col.group(2) or '[vc_column]' in col.group(2):
        return row  # nhiều cột: không thu
    inner = re.findall(r'\[vc_row_inner.*?\[/vc_row_inner\]', col.group(2), re.S)  # thẻ/cột con: giữ nguyên, không tách
    body = col.group(2)
    for k, x in enumerate(inner):
        body = body.replace(x, f'\x00{k}\x00', 1)
    parts = re.split(r'(\[vc_column_text[^\]]*\].*?\[/vc_column_text\])', body, flags=re.S)
    seen, shown, hidden, out = 0, [], [], []
    for part in parts:
        t = re.match(r'(\[vc_column_text[^\]]*\])(.*?)\[/vc_column_text\]$', part, re.S)
        if not t:
            if part.strip():
                out.append(('el', part))
            continue
        vis, more = [], []
        for b in blocks(t.group(2)):
            if seen < VISIBLE_WORDS or re.match(r'<h[1-6]', b) and not more:
                vis.append(b)
                seen += len(words(b))
            else:
                more.append(b)
        if vis:
            out.append(('text', t.group(1) + '\n' + '\n'.join(vis) + '\n[/vc_column_text]'))
        if more:
            out.append(('more', '\n'.join(more)))
    res, buf = [], []
    for kind, s in out + [('end', '')]:
        if kind == 'more':
            buf.append(s)
            continue
        if buf:
            res.append('[vc_toggle title="Xem thêm" style="text_only" el_class="velis-more"]' + '\n'.join(buf) + '[/vc_toggle]')
            buf = []
        if kind != 'end':
            res.append(s)
    res = ''.join(res)
    for k, x in enumerate(inner):
        res = res.replace(f'\x00{k}\x00', x)
    return head + ']' + f'[vc_column{col.group(1)}]' + res + '[/vc_column][/vc_row]'


def facts_row(items):
    cells = ''.join(f'[vc_column_inner width="1/3" offset="vc_col-xs-6"][vc_column_text css=""]\n<p class="velis-spec-label">{k}</p>\n'
                    f'<p class="velis-spec-value">{v}</p>\n[/vc_column_text][/vc_column_inner]' for k, v in items)
    return f'[vc_row_inner el_class="velis-specs velis-facts"]{cells}[/vc_row_inner]'


BTN_TU_VAN = '[dt_default_button link="url:%23lien-he-tu-van|title:Nh%E1%BA%ADn%20t%C6%B0%20v%E1%BA%A5n" size="big"]Nhận tư vấn[/dt_default_button]'
CALL = f'[vc_column_text css=""]\n<p class="velis-call">Hoặc gọi <a href="tel:{TEL.replace(" ", "")}">{TEL}</a> · <a href="{ZALO}" target="_blank" rel="noopener">Zalo</a></p>\n[/vc_column_text]'


def contact_row(row, default_h2):
    """Khối "Nhận tư vấn" 2 cột cân: trái tiêu đề + câu dẫn + kênh liên hệ, phải form CF7 (DESIGN Form)."""
    h2 = (re.search(r'<h2[^>]*>.*?</h2>', row, re.S) or [f'<h2>{default_h2}</h2>'])[0]
    ps = [p for p in re.findall(r'<p\b[^>]*>.*?</p>', row, re.S) if not re.match(r'<p[^>]*>\s*Hoặc gọi', p)]
    lead = '\n'.join(ps) or '<p>Để lại họ tên và số điện thoại, Velis Realty gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị gọi hoặc nhắn Zalo.</p>'
    return (f'[vc_row el_id="lien-he-tu-van" el_class="velis-cta" css="{css(CHAMP_SOFT)}"][vc_column width="1/2"][vc_column_text css=""]\n'
            f'{h2}\n{lead}\n[/vc_column_text]{CALL}[/vc_column][vc_column width="1/2"]{CF7}[/vc_column][/vc_row]')


def project(pid, raw):
    raw = voice(relink(raw))
    out = []
    for r in rows(raw):
        eid = attr(r, 'el_id')
        if eid == 'gioi-thieu':
            txt = re.search(r'\[vc_column_text[^\]]*\](.*?)\[/vc_column_text\]', r, re.S).group(1)
            eyebrow = re.search(r'<p class="velis-eyebrow">.*?</p>', txt).group(0)
            h1 = re.search(r'<h1[^>]*>.*?</h1>', txt, re.S).group(0)
            lead = txt.split(h1, 1)[1].strip()
            img = re.search(r'\[vc_single_image image="(\d+)"', r).group(1)
            out.append(f'[vc_row el_id="gioi-thieu" el_class="velis-hero" css="{css(NGA)}"][vc_column][dt_breadcrumbs]'
                       f'[vc_column_text css=""]\n{eyebrow}\n{h1}\n[/vc_column_text]'
                       f'[vc_single_image image="{img}" img_size="full" alignment="center" el_class="velis-crop" css=""]'
                       f'[vc_column_text css=""]\n{lead}\n[/vc_column_text]{facts_row(FACTS[pid])}{BTN_TU_VAN}{CALL}[/vc_column][/vc_row]'
                       # mục lục (Easy TOC không tự chèn ở trang dự án): điều hướng tới các khối, tiêu đề khối luôn hiện
                       '[vc_row el_id="muc-luc" el_class="velis-section velis-toc" css=""][vc_column][vc_column_text css=""]\n[ez-toc]\n[/vc_column_text][/vc_column][/vc_row]')
        elif eid == 'thong-so':  # 4 ô thông số cũ (2 ô trống) thay bằng thanh thông tin 6 ô ở phần đầu; giữ bảng
            out.append(re.sub(r'\[vc_row_inner el_class="velis-specs"\].*?\[/vc_row_inner\]', '', r, flags=re.S))
        elif eid == 'lien-he-tu-van':
            out.append(contact_row(r, 'Nhận tư vấn dự án'))
        elif eid.startswith(KEEP_OPEN):
            out.append(r)
        else:
            out.append(collapse(r))
    return ''.join(out)


def developer(pid, raw):
    raw = voice(relink(raw))
    out = []
    for r in rows(raw):
        eid = attr(r, 'el_id')
        if eid == 'gioi-thieu':  # 1 cột trong cột chính (cột phải là sidebar); logo chủ đầu tư có ở thẻ đối tác/ảnh đại diện
            head = r.split(']', 1)[0].replace(' equal_height="yes"', '').replace(' content_placement="middle"', '') + ']'
            col1 = re.search(r'\[vc_column width="7/12"\](.*?)\[/vc_column\]\[vc_column width="5/12"\]', r, re.S).group(1)
            col1 = col1.replace('link="url:%2Flien-he%2F|', 'link="url:%23lien-he-tu-van|')  # nút nhảy tới form ngay trên trang
            out.append(f'{head}[vc_column][dt_breadcrumbs]{col1}[/vc_column][/vc_row]')
        elif eid == 'lien-he-tu-van':
            out.append(contact_row(r, 'Nhận tư vấn'))
        elif 'velis-cards' in r and r.count('[vc_column_inner') == 1:  # 1 dự án = thẻ ngang hết khung (DESIGN Danh sách ≤ 2 mục)
            out.append(r.replace('[vc_column_inner width="1/2"]', '[vc_column_inner el_class="velis-card-wide"]'))
        elif eid.startswith(KEEP_OPEN):
            out.append(r)
        else:
            out.append(collapse(r))
    return ''.join(out)


def card(pid, src, wide=False):
    p = src[pid]
    link = urllib.parse.urlsplit(p['link']).path
    eyebrow, kind, done = next((e, k, d) for i, e, k, d in CARDS if i == pid)
    width = '' if wide else ' width="1/3"'
    cls = ' el_class="velis-card-wide"' if wide else ''
    return (f'[vc_column_inner{width}{cls}][vc_single_image image="{p["featured_media"]}" img_size="800x600" alignment="center" onclick="custom_link" '
            f'link="{link}" el_class="velis-crop" css=""][vc_column_text css=""]\n<p class="velis-eyebrow">{eyebrow}</p>\n'
            f'<h3><a href="{link}">{html.escape(p["title"]["raw"], quote=False)}</a></h3>\n<p>{kind}</p>\n<p class="velis-card-meta">Bàn giao: {done}</p>\n'
            f'<p class="velis-card-link"><a href="{link}">Xem dự án →</a></p>\n[/vc_column_text][/vc_column_inner]')


def du_an(raw, src):
    lead = re.search(r'\[vc_column_text css=""\](.*?)\[/vc_column_text\]', raw, re.S).group(1).strip()
    why = rows(raw)[0]
    why = why[why.index('[vc_row css=".vc_custom_1775545147936'):]
    why = re.sub(r'\[vc_row css="[^"]*"\]', f'[vc_row el_id="vi-sao" el_class="velis-section" css=""]', why, count=1)
    why = re.sub(r'<h2([^>]*)><b[^>]*>(.*?)</b></h2>', r'<h2\1>\2</h2>', why).replace('[/vc_section]', '')
    why = why.replace('của bạn', 'của anh chị')
    first, rest = CARDS[0][0], [c[0] for c in CARDS[1:]]
    grid = ''.join('[vc_row_inner el_class="velis-cards"]' + ''.join(card(i, src) for i in rest[k:k + 3]) + '[/vc_row_inner]' for k in (0, 3))
    return (f'[vc_row el_id="danh-sach" css=""][vc_column][vc_column_text css=""]\n<p class="velis-lead">{lead}</p>\n[/vc_column_text]'
            f'[vc_column_text css=""]\n<h2>Danh mục dự án bất động sản tâm điểm</h2>\n[/vc_column_text]'
            f'[vc_row_inner el_class="velis-cards"]{card(first, src, wide=True)}[/vc_row_inner]{grid}[/vc_column][/vc_row]{why}')


def home(raw):
    """Trang chủ theo DESIGN "Hero (đã chốt)" + "Trang chủ dưới hero"; chữ lấy nguyên văn bản đã duyệt (velis-data Cài đặt Velis).
    Không thêm khối form riêng: form "Liên hệ" của footer (widget Default Footer) ngay dưới, nút hero nhảy tới đó (#velis-tu-van)."""
    img = '/wp-content/uploads/2026/04/can-ho-the-prive.webp?id=19968'
    hero_css = css(INK, f'background-image: url({img}) !important;background-position: right top !important;'
                        'background-repeat: no-repeat !important;background-size: cover !important;')
    stats = ''.join(f'[vc_column_inner width="1/4" offset="vc_col-xs-6"][vc_column_text css=""]\n<p class="velis-stat"><span class="velis-stat-num">{n}</span>'
                    f'<span class="velis-stat-label">{label}</span></p>\n[/vc_column_text][/vc_column_inner]'
                    for n, label in (('10+', 'Năm kinh nghiệm'), ('50+', 'Đối tác'), ('999+', 'Giao dịch'), ('99+', 'Dự án')))
    logos = ''.join(f'[vc_column_inner width="1/4" offset="vc_col-xs-6"][vc_single_image image="{i}" img_size="large" alignment="center" '
                    f'onclick="custom_link" link="/du-an/{s}/" css=""][/vc_column_inner]'
                    for i, s in ((19641, 'vinhomes'), (19644, 'masterise-homes'), (19648, 'sun-group'), (19652, 'gamuda-land')))
    values = (('01', 'Thông tin có nguồn', 'Chúng tôi cung cấp thông tin dự án đầy đủ, chính xác về pháp lý và quy hoạch, giúp khách hàng yên tâm trước mỗi quyết định.'),
              ('02', 'Hỗ trợ sau bán', 'Từ lúc tư vấn, ký kết hợp đồng đến khi nhận nhà và quản lý vận hành, Velis Realty luôn hiện diện để hỗ trợ.'),
              ('03', 'Tư duy chiến lược', 'Không chỉ bán sản phẩm, chúng tôi cung cấp giải pháp. Velis Realty phân tích dòng tiền, đánh giá tiềm năng tăng giá và tính thanh khoản của từng vị trí.'),
              ('04', 'Cập nhật quỹ căn và chính sách', 'Cập nhật quỹ căn và chính sách bán hàng ngay khi chủ đầu tư công bố.'))
    vals = '\n'.join(f'<li><span class="velis-value-num">{n}</span><h3>{t}</h3>\n<p>{d}</p></li>' for n, t, d in values)
    btn = lambda label, url, extra='': (f'[dt_default_button link="url:{urllib.parse.quote(url, safe="")}|title:{urllib.parse.quote(label)}" size="big" '
                                        f'button_alignment="btn_inline"{extra}]{label}[/dt_default_button]')
    sec = lambda eid, body, color=None, cls='velis-section': (f'[vc_row full_width="stretch_row" el_id="{eid}" el_class="{cls}" css="{css(color)}"]'
                                                              f'[vc_column]{body}[/vc_column][/vc_row]')
    text = lambda s: f'[vc_column_text css=""]\n{s}\n[/vc_column_text]'
    return (
        f'[vc_row full_width="stretch_row" el_id="hero" el_class="velis-home-hero" css="{hero_css}"][vc_column]'
        + text('<p class="velis-eyebrow">Velis Realty</p>\n<h1>Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận</h1>\n'
               '<p class="velis-lead">Căn hộ hạng sang, villa nghỉ dưỡng, shophouse của Vinhomes, Sun Group, Masterise Homes, Gamuda Land cho người mua ở '
               'và nhà đầu tư. CEO Vũ Xuân trực tiếp phân tích dòng tiền và rủi ro từng dự án.</p>')
        + btn('Nhận tư vấn', '#velis-tu-van') + btn('Xem dự án', '/du-an/', ' el_class="velis-btn-ghost"') + '[/vc_column][/vc_row]'
        + sec('con-so', f'[vc_row_inner el_class="velis-stats"]{stats}[/vc_row_inner]', None, 'velis-section velis-stats-band')
        + sec('du-an', text('<h2>Dự án Velis đang tư vấn</h2>')
              + '[dt_blog_masonry mode="grid" image_scale_animation_on_hover="disabled" bwb_columns="desktop:3|h_tablet:3|v_tablet:2|phone:1" '
                'all_posts_the_same_width="y" content_alignment="left" post_date="n" post_category="n" post_author="n" post_comments="n" '
                'post_content="off" read_more_button="off" dis_posts_total="6" posts_offset="0" category="34"]'
              + btn('Xem tất cả dự án', '/du-an/', ' button_alignment="btn_center"').replace(' button_alignment="btn_inline"', ''), NGA)
        + sec('doi-tac', text('<h2>Đối tác của chúng tôi</h2>\n<p>Velis Realty là đơn vị chuyên tư vấn và phân phối bất động sản cao cấp, tập trung vào dự án '
                              'của các chủ đầu tư có hồ sơ bàn giao và pháp lý công khai.</p>') + f'[vc_row_inner el_class="velis-logos"]{logos}[/vc_row_inner]')
        + f'[vc_row full_width="stretch_row" el_id="ve-velis" el_class="velis-section" css="{css(NGA)}"][vc_column width="1/2"]'
        + text('<p class="velis-eyebrow">Về Velis</p>\n<h2>Công ty TNHH Velis Realty</h2>\n'
               '<p>Tại Velis Realty, chúng tôi tin rằng mỗi bất động sản không chỉ là một tài sản, mà là tâm huyết và tương lai của nhà đầu tư. '
               'Velis Realty tư vấn các dự án của Vinhomes, Sun Group, Masterise Homes, Ecopark, Gamuda Land, với giỏ hàng đa dạng từ căn hộ hạng sang, '
               'villa nghỉ dưỡng đến shophouse thương mại tại các khu vực đang có hạ tầng mới tại TP.HCM và vùng lân cận.</p>\n'
               '<p>Đội ngũ chuyên gia của chúng tôi kết hợp giữa tư duy Marketing sắc bén và sự am hiểu thị trường thực chiến, cung cấp thông tin có '
               'nguồn, phân tích dòng tiền và rủi ro để khách hàng tự quyết định.</p>')
        + btn('Tìm hiểu Velis', '/gioi-thieu/') + '[/vc_column][vc_column width="1/2"]'
        + text(f'<h3 class="velis-values-title">Giá trị khác biệt tại Velis Realty</h3>\n<ol class="velis-values">\n{vals}\n</ol>') + '[/vc_column][/vc_row]'
        + sec('bai-viet', text('<h2>Bài phân tích chuyên sâu</h2>')
              + '[dt_blog_masonry mode="grid" image_scale_animation_on_hover="disabled" bwb_columns="desktop:3|h_tablet:3|v_tablet:2|phone:1" '
                'all_posts_the_same_width="y" content_alignment="left" post_author="n" post_comments="n" post_content="off" read_more_button="off" '
                'dis_posts_total="3" posts_offset="0" category="40"]'
              + btn('Xem tất cả bài viết', '/blog/', ' button_alignment="btn_center"').replace(' button_alignment="btn_inline"', ''))
        + f'[vc_row full_width="stretch_row" el_id="thi-thu-tuyen-dung" el_class="velis-section velis-boxes" equal_height="yes" css="{css(NGA)}"]'
          '[vc_column width="1/2"]'
        + text('<h3>Thi thử chứng chỉ môi giới</h3>\n<p>Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí.</p>')
        + btn('Thi thử CCMG', '/thi/') + '[/vc_column][vc_column width="1/2"]'
        + text('<h3>Cơ hội nghề nghiệp</h3>\n<p>Velis Realty đang tuyển nhiều vị trí Chuyên viên Kinh doanh Bất động sản cao cấp, làm việc toàn thời gian tại '
               'văn phòng 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh.</p>')
        + btn('Ứng tuyển ngay', '/tuyen-dung/') + '[/vc_column][/vc_row]')


GMAP = ('[vc_gmaps link="#E-8_' + base64.b64encode(urllib.parse.quote(
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4215.252255230459!2d106.743951!3d10.7909261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1'
    '!3m3!1m2!1s0x31752f37915bde71%3A0xf56c576b8b34ee62!2sVELIS%20REALTY!5e1!3m2!1svi!2s!4v1775963949163!5m2!1svi!2s" width="600" height="450" '
    'style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Bản đồ văn phòng Velis Realty"></iframe>',
    safe='').encode()).decode() + '" size="450" title="Bản đồ văn phòng Velis Realty"]')
SOCIAL = ('<li><p><b>Mạng xã hội:</b> <a href="https://www.youtube.com/@velisrealty" target="_blank" rel="noopener">YouTube</a> · '
          '<a href="https://www.tiktok.com/@velisrealty" target="_blank" rel="noopener">TikTok</a> · '
          '<a href="https://www.instagram.com/velisrealty/" target="_blank" rel="noopener">Instagram</a> · '
          '<a href="https://www.linkedin.com/in/velisrealty" target="_blank" rel="noopener">LinkedIn</a> · '
          '<a href="https://x.com/velisrealty" target="_blank" rel="noopener">X</a> · '
          '<a href="https://www.pinterest.com/velisrealty" target="_blank" rel="noopener">Pinterest</a></p></li>')


def lien_he(raw):
    """Bỏ 2 khối Raw HTML: thẻ thông tin trùng danh sách liên hệ (giữ link mạng xã hội vào danh sách), bản đồ → phần tử Google Maps."""
    raw = re.sub(r'\[vc_empty_space[^\]]*\]', '', raw)
    raw = re.sub(r'\[vc_raw_html[^\]]*\].*?\[/vc_raw_html\]', '', raw, flags=re.S)
    raw = raw.replace('Chúng tôi luôn sẵn sàng lắng nghe bạn!', 'Velis Realty luôn sẵn sàng lắng nghe anh chị')
    raw = raw.replace('Dù bạn đang', 'Dù anh chị đang').replace('số vốn của bạn', 'số vốn của anh chị')
    raw = re.sub(r'(<b[^>]*>Zalo Business:</b>) 0911 237 979', rf'\1 <a href="{ZALO}" target="_blank" rel="noopener">{TEL}</a>', raw)
    raw = re.sub(r'(<b[^>]*>Hotline:</b>) 0911 237 979', rf'\1 <a href="tel:0911237979">{TEL}</a>', raw)
    raw = re.sub(r'(<b[^>]*>Email hỗ trợ:</b>) lienhe@velisrealty\.vn', r'\1 <a href="mailto:lienhe@velisrealty.vn">lienhe@velisrealty.vn</a>', raw)
    raw = raw.replace('</ul>\n[/vc_column_text][vc_row_inner]', SOCIAL + '\n</ul>\n[/vc_column_text][vc_row_inner]', 1)
    raw = raw.replace('[contact-form-7 id="19582"]', CF7)
    return raw.replace('[/vc_row_inner][/vc_column][/vc_row][/vc_section]', '[/vc_row_inner]' + GMAP + '[/vc_column][/vc_row][/vc_section]', 1)


def gioi_thieu(raw):
    """Tiêu đề Viết Hoa Từng Chữ → kiểu câu; nhãn giá trị kiểu câu; bản đồ Raw HTML → phần tử Google Maps;
    ảnh văn phòng (Media 20120, có sẵn) ở đầu; câu khẩu hiệu thành khối nhấn tối (DESIGN: mỗi trang ít nhất một khối nhấn tối)."""
    for a, b in (('Tầm Nhìn &amp; Sứ Mệnh', 'Tầm nhìn &amp; sứ mệnh'), ('Chúng Tôi Là Ai?', 'Chúng tôi là ai?'), ('Thông Tin Có Nguồn:', 'Thông tin có nguồn:'),
                 ('Hỗ Trợ Sau Bán:', 'Hỗ trợ sau bán:'), ('Tư Duy Chiến Lược:', 'Tư duy chiến lược:'), ('Cập Nhật Quỹ Căn Và Chính Sách:', 'Cập nhật quỹ căn và chính sách:')):
        assert a in raw, a
        raw = raw.replace(a, b)
    raw = re.sub(r'\[vc_raw_html[^\]]*\].*?\[/vc_raw_html\]', GMAP, raw, flags=re.S)
    quote = re.search(r'<p style="text-align: center;"[^>]*>(<b[^>]*>"Thành công.*?</b>)</p>\n', raw, re.S)
    raw = raw.replace(quote.group(0), '')
    raw = raw.replace('[vc_row][vc_column][vc_row_inner][vc_column_inner]',
                      '[vc_row][vc_column][vc_single_image image="20120" img_size="full" alignment="center" el_class="velis-crop" css=""]'
                      '[vc_row_inner][vc_column_inner]', 1)
    band = (f'[vc_row full_width="stretch_row" el_id="khau-hieu" el_class="velis-section velis-dark" css="{css(INK)}"][vc_column]'
            f'[vc_column_text css=""]\n<p class="velis-quote">{quote.group(1)}</p>\n[/vc_column_text][/vc_column][/vc_row]')
    i = raw.index('[vc_section][vc_row][vc_column][vc_column_text css=""]\n<h2 data-path-to-node="16">')
    return raw[:i] + band + raw[i:]


def sections(raw):
    """Hàng tràn khung dùng vc_section (như trang chủ cũ): vc_row full_width + FVM hoãn js_composer_front → lỗi
    "vc_initVideoBackgrounds is not defined" trong console."""
    def one(m):
        a = m.group(1)
        eq = ' equal_height="yes"' if 'equal_height="yes"' in a else ''
        a = a.replace(' full_width="stretch_row"', '').replace(' equal_height="yes"', '')
        return f'[vc_section full_width="stretch_row"{a}][vc_row{eq}]{m.group(2)}[/vc_row][/vc_section]'
    return re.sub(r'\[vc_row full_width="stretch_row"([^\]]*)\](.*?)\[/vc_row\]', one, raw, flags=re.S)


def build(src):
    """{id: (new_raw, allowed_lost_words)}."""
    out = {}
    for x in src.values():  # nội dung cũ lưu CRLF; textarea của trình sửa cũng đổi về LF
        x['content']['raw'] = x['content']['raw'].replace('\r\n', '\n')
    for pid in PROJECTS:
        out[pid] = project(pid, src[pid]['content']['raw'])
    for pid in DEVELOPERS:
        out[pid] = developer(pid, src[pid]['content']['raw'])
    out[19537] = du_an(src[19537]['content']['raw'], src)
    out[19526] = sections(home(src[19526]['content']['raw']))
    out[19544] = lien_he(src[19544]['content']['raw'])
    out[19551] = sections(gioi_thieu(src[19551]['content']['raw']))
    p = src[20468]['content']['raw']
    assert '091 123 7979' in p
    out[20468] = p.replace('091 123 7979', TEL)
    for pid in (19773, 19637):
        assert 'staging' not in out[pid] or 'url:https%3A' not in out[pid]
    return out


def lost(old, new):
    from collections import Counter
    a, b = Counter(words(old)), Counter(words(new))
    return {w: n for w, n in (a - b).items()}


def self_test():
    assert relink('[dt_default_button link="url:https%3A%2F%2Fstaging.velisrealty.vn%2Flien-he%2F|title:x"]') == '[dt_default_button link="url:%2Flien-he%2F|title:x"]'
    assert relink('<a href="https://staging.velisrealty.vn/a/">') == '<a href="/a/">' and relink('link="https://staging.velisrealty.vn/b/"') == 'link="/b/"'
    assert relink('<a href="https://example.com/">') == '<a href="https://example.com/">'
    assert voice('Anh/chị và anh/chị') == 'Anh chị và anh chị'
    r = rows('[vc_row a][vc_column][vc_row_inner][/vc_row_inner][/vc_column][/vc_row][vc_section][vc_row][/vc_row][/vc_section]')
    assert len(r) == 2 and r[0].endswith('[/vc_row]') and r[1].startswith('[vc_section]'), r
    assert blocks('<h2>A</h2>\n<p>b <b>c</b></p>x<ul><li>d</li></ul>') == ['<h2>A</h2>', '<p>b <b>c</b></p>', 'x', '<ul><li>d</li></ul>']
    long = '[vc_row el_id="vi-tri" el_class="velis-section" css=""][vc_column][vc_column_text css=""]\n<h2>Vị trí</h2>\n' + \
           '\n'.join(f'<p>{"chữ " * 40}{i}</p>' for i in range(5)) + '\n[/vc_column_text][vc_single_image image="1"][/vc_column][/vc_row]'
    c = collapse(long)
    assert c.count('[vc_toggle') == 1 and '<h2>Vị trí</h2>' in c.split('[vc_toggle')[0] and '[vc_single_image image="1"]' in c.split('[/vc_toggle]')[1]
    assert sorted(words(c)) == sorted(words(long) + ['Xem', 'thêm'][:0]), 'collapse giữ đủ chữ'
    short = long.replace('chữ ' * 40, 'chữ ')
    assert collapse(short) == short
    assert collapse(long.replace('[vc_column]', '[vc_column width="1/2"]').replace('[/vc_column][/vc_row]', '[/vc_column][vc_column width="1/2"][/vc_column][/vc_row]')).count('vc_toggle') == 0
    cr = contact_row('[vc_row el_id="lien-he-tu-van"][vc_column][vc_column_text]<h2>Nhận tư vấn X</h2><p>Hoặc gọi <a href="tel:1">1</a></p>[/vc_column_text][/vc_column][/vc_row]', 'd')
    assert '<h2>Nhận tư vấn X</h2>' in cr and CF7 in cr and 'velis-cta' in cr
    assert 'href="#E-8_' not in GMAP and GMAP.startswith('[vc_gmaps link="#E-8_')
    sec = sections('[vc_row full_width="stretch_row" el_id="a" el_class="b" equal_height="yes" css=".x{}"][vc_column]c[/vc_column][/vc_row]')
    assert sec == '[vc_section full_width="stretch_row" el_id="a" el_class="b" css=".x{}"][vc_row equal_height="yes"][vc_column]c[/vc_column][/vc_row][/vc_section]', sec
    print('self-test ok')


def main(src_path, out_dir):
    d = json.load(open(src_path))
    src = {x['id']: x for x in d['pages'] + d['posts']}
    out = build(src)
    od = Path(out_dir)
    od.mkdir(parents=True, exist_ok=True)
    report = {}
    for pid, new in out.items():
        assert 'url:https%3A%2F%2F' + HOST not in new and '%2F%2F' + HOST not in new, pid
        (od / f'{pid}.txt').write_text(new)
        report[pid] = {'title': src[pid]['title']['raw'], 'lost': lost(src[pid]['content']['raw'], new),
                       'toggles': new.count('el_class="velis-more"'), 'len': [len(src[pid]['content']['raw']), len(new)]}
    json.dump(report, open(od / 'report.json', 'w'), ensure_ascii=False, indent=1)
    for pid, r in report.items():
        print(pid, r['title'][:30], 'toggles', r['toggles'], 'len', r['len'], 'lost', dict(list(r['lost'].items())[:12]), '…' if len(r['lost']) > 12 else '')


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        self_test()
    else:
        main(*sys.argv[1:3])
