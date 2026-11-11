#!/usr/bin/env python3
"""The7 bước 6 – đồng bộ nội dung WPBakery một lần theo DESIGN.md (chỉ đổi cách trình bày, không thêm số liệu).

1. normalize(): mọi trang/bài – tiêu đề CHỮ HOA / Viết Hoa Từng Chữ → chữ thường kiểu câu (giữ tên riêng, viết tắt),
   bỏ căn giữa + màu dán trong tiêu đề, bỏ đường kẻ chấm hồng/xanh cũ (vc_separator), bỏ font Roboto/Arial và màu lệch bảng
   trong phần tử Ultimate, nhãn nút chữ thường, số điện thoại hiển thị một kiểu "0911 237 979".
2. restructure(): trang dự án / chủ đầu tư theo mẫu "Velis – Dự án" / "Velis – Chủ đầu tư" (data/the7/mau-wpbakery):
   hero 2 cột (nhãn, H1, đoạn mở, ưu đãi có sẵn, nút Nhận tư vấn + số gọi, ảnh) → mỗi hàng cũ thành một khối velis-section
   có neo → Hỏi đáp → khối liên hệ → bài liên quan. Nội dung từng khối giữ nguyên.
3. Trang chủ, Liên hệ: chuẩn hóa thành phần (bỏ màu/font dán, khối nền theo bảng màu), giữ nội dung.

Kiểm: words() trước/sau – chỉ được mất đúng các chữ của nhãn nút cũ đã thay (in ra để soát).
Dùng: python3 -I tools/the7_dong_bo_buoc6.py <in.json> <out_dir>   (in.json = {id: {"kind","link","raw","title"}})
      python3 -I tools/the7_dong_bo_buoc6.py --test
"""
import base64
import csv
import html
import json
import re
import sys
import urllib.parse
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import heading_case as hc  # noqa: E402

B = 'https://staging.velisrealty.vn'
NAMES = set(hc.NAMES) | {'The Global City', 'Palm River', 'Palm City', 'The Privé', 'Persa Place', 'Spring Ville', 'Ansana by Kita',
                         'Vinhomes Saigon Park', 'Velis Realty', 'Sun Property', 'Hướng Việt Properties', 'Marriott', 'Ritz-Carlton',
                         'Masteri Grand View', 'Lumière Midtown', 'Vành đai 3', 'Phú Quốc', 'Đà Nẵng', 'Quảng Ninh', 'Sầm Sơn',
                         'Mũi Ông Đội', 'Ba Na Hills', 'InterContinental', 'Liên Phường', 'Quận 2', 'Võ Văn Kiệt', 'Hóc Môn', 'Vingroup',
                         'Thảo Điền', 'Eaton Park', 'Artisan Park', 'Elysian', 'Lò Lu', 'Bình Dương', 'TP. Mới', 'Âu Châu',
                         'The New Downtown', 'Grand Marina Saigon', 'Grand Marina'}
BTN = '[dt_default_button link="url:%2Flien-he%2F|title:Nh%E1%BA%ADn%20t%C6%B0%20v%E1%BA%A5n" size="big"]Nhận tư vấn[/dt_default_button]'
TEL = '[vc_column_text css=""]\n<p>Hoặc gọi <a href="tel:0911237979">0911 237 979</a></p>\n[/vc_column_text]'
CANVAS, CHAMP_SOFT = '#FAF7F2', '#F3ECDF'
_n = [1762900000000]


def css_bg(color):
    _n[0] += 1
    return f'.vc_custom_{_n[0]}{{background-color: {color} !important;}}'


# ───────────────────────── 1. chuẩn hóa chung ─────────────────────────
def is_title_case(text):
    words = [w for w in re.findall(r'[^\W\d_]+', text) if len(w) > 1]
    if len(words) < 5 or hc.is_caps(text):
        return False
    up = sum(w[0].isupper() for w in words)
    return up / len(words) >= 0.85


def case_fix(text, names):
    """CHỮ HOA hoặc Viết Hoa Từng Chữ → kiểu câu; chỉ đổi hoa/thường."""
    if hc.is_caps(text) or is_title_case(text):
        new = hc.sentence_case(text, names)
        assert new.lower() == text.lower(), (text, new)
        return new
    return text


def fix_heading(inner, names, log):
    text = html.unescape(re.sub(r'<[^>]+>', '', inner))
    new = case_fix(text, names)
    if new == text:
        return inner
    parts = re.split(r'(<[^>]+>)', inner)
    pos, res = 0, []
    for p in parts:
        if p.startswith('<'):
            res.append(p)
        else:
            n = len(html.unescape(p))
            res.append(html.escape(new[pos:pos + n], quote=False))
            pos += n
    log.append(('tieu-de', text.strip(), new.strip()))
    return ''.join(res)


PHONE = re.compile(r'(?<![\w:%/=.])(?:0911237979|091 123 7979|0911\.237\.979|0911 237979)(?![\w])')
HEX_OK = {'#1A1A1A', '#5C5C5C', '#FAF7F2', '#FFFFFF', '#F2EEE8', '#E4DED5', '#C9C1B5', '#B8282E', '#9E1F26', '#B08D57',
          '#F3ECDF', '#111111', '#B9B9B9', '#C42F35', '#8A6A3A'}


def text_nodes(s, fn):
    """Apply fn to text outside tags and shortcode brackets."""
    return re.sub(r'(?<=[>\]])([^<\[]+)(?=[<\[])', lambda m: fn(m.group(1)), '>' + s + '<')[1:-1]


def normalize(raw, names, log):
    s = raw
    # tiêu đề: bỏ căn giữa + màu dán, đổi chữ hoa
    s = re.sub(r'<(h[1-6])((?:\s+[\w-]+="[^"]*")*)>', lambda m: '<' + m.group(1) + re.sub(r'\s+style="[^"]*"', '', m.group(2)) + '>', s)
    s = re.sub(r'(<h([1-6])[^>]*>)(.*?)(</h\2>)', lambda m: m.group(1) + fix_heading(re.sub(r'<span style="color:[^"]*">(.*?)</span>', r'\1', m.group(3), flags=re.S), names, log) + m.group(4), s, flags=re.S)
    # đoạn căn giữa dán tay
    s = re.sub(r'<p style="text-align: center;">', '<p>', s)
    # đường kẻ cũ (chấm hồng/xanh) – khối mới dùng gạch champagne của hệ thống
    n = len(re.findall(r'\[vc_separator[^\]]*\]', s))
    if n:
        s = re.sub(r'\[vc_separator[^\]]*\]', '', s)
        log.append(('duong-ke', f'{n} vc_separator', 'bỏ'))
    # Ultimate: font Roboto/Arial và màu lệch bảng → theo theme
    s2 = re.sub(r'\s(?:title_font|desc_font|suf_pref_font|text_font_family|main_heading_font_family|sub_heading_font_family)="font_family:[^"]*"', '', s)
    s2 = re.sub(r'\s(?:desc_font_style|text_font_style)="[^"]*"', '', s2)
    s2 = re.sub(r'(desc_font_color|suf_pref_font_color|text_color)="#[0-9a-fA-F]{6}"', r'\1="#1A1A1A"', s2)
    s2 = re.sub(r'desc_font_size="desktop:\d+px;"', 'desc_font_size="desktop:48px;"', s2)
    if s2 != s:
        log.append(('ultimate', 'font Roboto / màu riêng', 'theo theme'))
        s = s2
    # nền hàng Ultimate (bg_color_value) ngoài bảng màu → bỏ, hàng theo nền hệ thống
    def ubg(m):
        if m.group(1).upper() in HEX_OK:
            return m.group(0)
        log.append(('nen-hang', 'Ultimate ' + m.group(1), 'bỏ'))
        return ''
    s = re.sub(r'\sbg_type="bg_color"\s+bg_color_value="(#[0-9a-fA-F]{6})"', ubg, s)
    # nút gõ hoa → chữ thường kiểu câu
    def btn(m):
        t = m.group(2)
        nt = case_fix(t, names)
        if nt != t:
            log.append(('nut', t, nt))
        return m.group(1) + nt + m.group(3)
    s = re.sub(r'(\[dt_default_button[^\]]*\])(.*?)(\[/dt_default_button\])', btn, s, flags=re.S)
    # số điện thoại hiển thị: một kiểu
    s3 = text_nodes(s, lambda t: PHONE.sub('0911 237 979', t))
    if s3 != s:
        log.append(('so-dien-thoai', 'cách viết khác', '0911 237 979'))
        s = s3
    # span màu dán trong đoạn văn (ngoài bảng màu) → bỏ màu
    def span(m):
        return m.group(0) if m.group(1).upper() in HEX_OK else m.group(2)
    s = re.sub(r'<span style="color: (#[0-9a-fA-F]{6});">(.*?)</span>', span, s, flags=re.S)
    return s


# ───────────────────────── 2. dựng lại theo mẫu ─────────────────────────
def top_rows(raw):
    raw = re.sub(r'\[/?vc_section[^\]]*\]', '', raw).strip()
    rows = re.findall(r'\[vc_row(?:\s[^\]]*)?\].*?\[/vc_row\]', raw, re.S)
    assert ''.join(rows).replace(' ', '').replace('\n', '') == raw.replace(' ', '').replace('\n', ''), 'top_rows lost content'
    return rows


def set_row(row, el_id=None, el_class=None, css=''):
    """Replace the opening [vc_row …] attributes el_id / el_class / css, keep the rest."""
    m = re.match(r'\[vc_row((?:\s[^\]]*)?)\]', row)
    attrs = re.sub(r'\s(?:el_id|el_class|css)="[^"]*"', '', m.group(1))
    add = (f' el_id="{el_id}"' if el_id else '') + (f' el_class="{el_class}"' if el_class else '') + f' css="{css}"'
    return '[vc_row' + attrs + add + ']' + row[m.end():]


def slug(text):
    t = html.unescape(re.sub(r'<[^>]+>', '', text)).lower()
    t = re.sub(r'[đ]', 'd', t)
    import unicodedata
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:40].strip('-')


def single_column(row):
    m = re.fullmatch(r'\[vc_row[^\]]*\]\[vc_column(?:\s[^\]]*)?\](.*)\[/vc_column\]\[/vc_row\]', row, re.S)
    if not m or '[vc_column ' in m.group(1) or '[vc_column]' in m.group(1):
        return None
    inner = m.group(1)
    # hàng con 1 cột (Spring Ville) → mở ra
    inner = re.sub(r'\[vc_row_inner\]\[vc_column_inner\](.*?)\[/vc_column_inner\]\[/vc_row_inner\]', r'\1', inner, flags=re.S)
    return inner


def hero(row0, row1, eyebrow, log):
    """(hero_row, rest_of_intro_row_or_None, row1_after_image_taken)"""
    body = single_column(row0)
    if body is None:
        return set_row(row0, 'gioi-thieu', 'velis-hero', css_bg(CANVAS)), None, row1
    texts = re.findall(r'\[vc_column_text[^\]]*\](.*?)\[/vc_column_text\]', body, re.S)
    img = re.search(r'\[vc_single_image [^\]]*\]', body)
    src_row1 = False
    if not img and row1:
        img = re.search(r'\[vc_single_image [^\]]*\]', row1)
        src_row1 = bool(img)
    offer = re.search(r'\[ultimate_ctation[^\]]*\](.*?)\[/ultimate_ctation\]', body, re.S)
    allhtml = '\n'.join(t.strip() for t in texts)
    h1 = re.search(r'<h1[^>]*>.*?</h1>', allhtml, re.S).group(0)
    h1 = re.sub(r'\s*\r?\n\s*', ' – ', h1)
    after = allhtml[allhtml.index('</h1>') + 5:]
    # câu dưới H1 (H2 phụ của Spring Ville) → đoạn đậm
    after = re.sub(r'<h2[^>]*>(.*?)</h2>', r'<p><strong>\1</strong></p>', after, count=1, flags=re.S)
    blocks = re.findall(r'<p[^>]*>.*?</p>|<em>.*?</em>[^<\n]*(?:<b[^>]*>.*?</b>)?', after, re.S)
    lead = blocks[0] if blocks else ''
    rest = after.replace(lead, '', 1).strip() if lead else after.strip()
    if lead.startswith('<em>'):
        lead = f'<p>{lead}</p>'
    offer_html = ''
    if offer:
        ps = [re.sub(r'<[^>]+>', '', p).strip() for p in re.findall(r'<p[^>]*>.*?</p>', offer.group(1), re.S)]
        offer_html = '\n'.join(f'<p><strong>{p}</strong></p>' for p in ps if p)
        log.append(('hero', 'hộp ưu đãi Ultimate (chữ vàng trên đỏ)', 'đoạn đậm trong phần đầu'))
    old_btns = re.findall(r'\[dt_default_button[^\]]*\](.*?)\[/dt_default_button\]', body, re.S)
    for t in old_btns:
        log.append(('hero', f'nút cũ "{t}"', 'Nhận tư vấn + Hoặc gọi 0911 237 979'))
    left = (f'[vc_column_text css=""]\n<p class="velis-eyebrow">{eyebrow}</p>\n{h1}\n{lead}\n{offer_html}\n[/vc_column_text]{BTN}{TEL}')
    if img:
        cols = (f'[vc_column width="7/12"]{left}[/vc_column][vc_column width="5/12"]{img.group(0)}[/vc_column]')
        if src_row1:
            row1 = row1.replace(img.group(0), '', 1)
            log.append(('hero', 'ảnh đầu khối 2', 'chuyển lên phần đầu'))
    else:
        cols = f'[vc_column]{left}[/vc_column]'
    hero_row = (f'[vc_row equal_height="yes" content_placement="middle" el_id="gioi-thieu" el_class="velis-hero" css="{css_bg(CANVAS)}"]{cols}[/vc_row]')
    intro = f'[vc_row][vc_column][vc_column_text css=""]\n{rest}\n[/vc_column_text][/vc_column][/vc_row]' if re.sub(r'<[^>]+>|&nbsp;|\s', '', rest) else None
    return hero_row, intro, row1


def cta(name):
    return (f'[vc_row el_id="lien-he-tu-van" el_class="velis-cta" css="{css_bg(CHAMP_SOFT)}"][vc_column][vc_column_text css=""]\n'
            f'<h2>Nhận tư vấn {name}</h2>\n[/vc_column_text]{BTN}{TEL}[/vc_column][/vc_row]')


def cards(projects):
    cols = ''.join(
        f'[vc_column_inner width="1/2"][vc_single_image image="{img}" img_size="600x400" alignment="center" onclick="custom_link" link="{url}" css=""]'
        f'[vc_column_text css=""]\n<h3><a href="{url}">{name}</a></h3>\n<p>{place}</p>\n[/vc_column_text][/vc_column_inner]'
        for img, url, name, place in projects)
    return f'[vc_row_inner el_class="velis-cards"]{cols}[/vc_row_inner]'


def restructure(raw, name, eyebrow, log, projects=None):
    rows = top_rows(raw)
    hero_row, intro, rows1 = hero(rows[0], rows[1] if len(rows) > 1 else None, eyebrow, log)
    rest = ([rows1] if rows1 else []) + rows[2:]
    out, related, used = [hero_row], None, set()
    if projects:
        # hàng cũ chỉ có tiêu đề "Danh sách dự án …" → đặt lưới thẻ vào đó; không có thì thêm khối "Dự án … tại Velis Realty"
        empty = [r for r in rest if '[vc_column_text' in r and re.search(r'<h2[^>]*>[^<]*dự án', r, re.I)
                 and not re.sub(r'\[[^\]]*\]|<h2[^>]*>.*?</h2>|<em>Đang cập nhật</em>|<[^>]+>|&nbsp;|\s', '', r, flags=re.S)]
        if empty:
            i = rest.index(empty[0])
            rest[i] = empty[0].replace('<em>Đang cập nhật</em>', '').replace('[/vc_column][/vc_row]', cards(projects) + '[/vc_column][/vc_row]')
            log.append(('the-du-an', '"Đang cập nhật"', 'lưới thẻ dự án có trang trên site'))
        else:
            out.append(f'[vc_row el_id="du-an" el_class="velis-section" css=""][vc_column][vc_column_text css=""]\n<h2>Dự án {name} tại Velis Realty</h2>\n[/vc_column_text]{cards(projects)}[/vc_column][/vc_row]')
    if intro:
        out.append(set_row(intro, 'tong-quan', 'velis-section'))
    for r in rest:
        if not re.sub(r'\[[^\]]*\]|<[^>]+>|&nbsp;|\s', '', r):
            continue  # hàng chỉ còn đường kẻ cũ
        h = re.search(r'<h[2-4][^>]*>(.*?)</h[2-4]>', r, re.S) or re.search(r'\[dt_fancy_title title="([^"]*)"', r)
        if '[vc_toggle' in r:
            el = 'cau-hoi'
        elif h and re.search(r'liên quan|bài phân tích', h.group(1), re.I) and r is rest[-1]:
            related = r
            continue
        else:
            el = slug(h.group(1)) if h else 'noi-dung'
        while el in used:
            el += '-2'
        used.add(el)
        out.append(set_row(r, el, 'velis-section'))
    out.append(cta(name))
    if related:
        related = re.sub(r'<h3([^>]*)>(.*?)</h3>', r'<h2\1>\2</h2>', related, count=1, flags=re.S)
        related = re.sub(r'\[dt_fancy_title title="([^"]*)"[^\]]*\]', lambda m: f'[vc_column_text css=""]\n<h2>{m.group(1)}</h2>\n[/vc_column_text]', related)
        out.append(set_row(related, 'bai-lien-quan', 'velis-section'))
    return ''.join(out)


def upgrade_applied(raw):
    """Trang đã áp mẫu bước 2 (Persa, Gamuda, bài 20330): đệm cố định 48 px → class velis-section; nền ngà/cta giữ."""
    def fix(m):
        attrs = m.group(1)
        if 'velis-hero' in attrs or 'velis-cta' in attrs:
            bg = CHAMP_SOFT if 'velis-cta' in attrs else CANVAS
            attrs = re.sub(r'\scss="[^"]*"', f' css="{css_bg(bg)}"', attrs)
            return '[vc_row' + attrs + ']'
        if 'el_id=' in attrs and re.search(r'css="\.vc_custom_\d+\{padding-top: 48px !important;\}"', attrs):
            attrs = re.sub(r'\scss="[^"]*"', ' el_class="velis-section" css=""', attrs)
        return '[vc_row' + attrs + ']'
    return re.sub(r'\[vc_row((?:\s[^\]]*)?)\]', fix, raw)


# ───────────────────────── 3. trang chủ, liên hệ ─────────────────────────
def home(raw, names, log):
    s = raw
    # khối logo đỏ trang trí (ảnh 19587) → bỏ; nút Thi thử chuyển xuống dải "Cơ hội nghề nghiệp"
    m = re.search(r'\[vc_row\]\[vc_column\]\[vc_single_image image="19587"[^\]]*\](\[dt_default_button[^\]]*\].*?\[/dt_default_button\])\[/vc_column\]\[/vc_row\]', s, re.S)
    assert m, 'home: khối logo đỏ'
    thi = re.sub(r'\scss="[^"]*"', '', m.group(1)).replace('button_alignment="btn_center"', 'button_alignment="btn_inline"')
    s = s.replace(m.group(0), '')
    log.append(('trang-chu', 'ảnh logo đỏ lớn 19587 (trang trí)', 'bỏ; nút Thi thử chuyển xuống dải Cơ hội nghề nghiệp'))
    # hero: căn trái, nhãn, nút thứ hai là số gọi
    s = s.replace('<p class="velis-cta" style="text-align: center;">', '<p>')
    s = s.replace('<h1 style="text-align: center;">', '<p class="velis-eyebrow">Velis Realty</p>\n<h1>', 1)
    # section: nền theo bảng màu, đệm hệ thống, tiêu đề căn trái
    secs = re.findall(r'\[vc_section[^\]]*\]', s)
    bgs = [None, CANVAS, None, CANVAS, CHAMP_SOFT]
    assert len(secs) == 5, len(secs)
    for tag, bg in zip(secs, bgs):
        new = '[vc_section full_width="stretch_row" el_class="velis-section"' + (f' css="{css_bg(bg)}"' if bg else ' css=""') + ']'
        if tag == secs[0]:
            new = '[vc_section el_class="velis-hero" css=""]'
        s = s.replace(tag, new, 1)
    s = re.sub(r'\[vc_row css="\.vc_custom_\d+\{padding[^"]*"\]', '[vc_row]', s)
    s = s.replace('<span style="color: #ffffff;">', '<span>')
    # thẻ dự án nổi bật: nội dung căn trái, đệm thẻ 24
    s = s.replace('post_content_paddings="10px 5px 10px 5px"', 'post_content_paddings="16px 24px 24px 24px"').replace('content_alignment="center"', 'content_alignment="left"')
    # dải nghề nghiệp: thêm nút Thi thử cạnh Ứng tuyển
    s = re.sub(r'(\[dt_default_button link="url:https%3A%2F%2Fstaging\.velisrealty\.vn%2Ftuyen-dung%2F[^\]]*)button_alignment="btn_center"(\][^\[]*\[/dt_default_button\])',
               r'\1button_alignment="btn_inline"\2' + thi, s)
    assert thi in s, 'home: nút thi thử'
    # bộ đếm Ultimate: biểu tượng champagne
    s = re.sub(r'\[stat_counter ', '[stat_counter icon_color="#B08D57" ', s)
    return normalize(s, names, log)


def contact(raw, names, log):
    def dec(b):
        return urllib.parse.unquote(base64.b64decode(b).decode())

    def enc(h):
        return base64.b64encode(urllib.parse.quote(h).encode()).decode()

    def raw_html(m):
        h = dec(m.group(2))
        if 'RealEstateAgent' not in h:
            return m.group(0)
        h2 = re.sub(r'\sstyle="[^"]*"', '', h)
        h2 = re.sub(r'<hr\s*>', '', h2)
        h2 = PHONE.sub('0911 237 979', h2)
        h2 = re.sub(r'<h2 itemprop="name">', '<h2 itemprop="name" class="velis-card-title">', h2)
        h2 = h2.replace('<div itemscope itemtype="https://schema.org/RealEstateAgent">', '<div itemscope itemtype="https://schema.org/RealEstateAgent" class="velis-info-card">', 1)
        log.append(('lien-he', 'khối HTML Arial nền #F9F9F9 bo 8, tiêu đề #2C3E50', 'theo theme (thẻ trắng viền hairline)'))
        return m.group(1) + enc(h2) + m.group(3)
    s = re.sub(r'(\[vc_raw_html[^\]]*\])([A-Za-z0-9+/=]+)(\[/vc_raw_html\])', raw_html, raw)
    return normalize(s, names, log)


def words(s):
    s = re.sub(r'\[vc_raw_html[^\]]*\]([A-Za-z0-9+/=]+)\[/vc_raw_html\]', lambda m: urllib.parse.unquote(base64.b64decode(m.group(1)).decode()), s)
    s = re.sub(r'\[[^\]]*\]|<[^>]+>|&nbsp;', ' ', html.unescape(s))
    s = PHONE.sub('0911 237 979', s)  # đổi cách viết số không tính là mất chữ
    return re.findall(r'\w+', s.lower())


def lost(old, new):
    return Counter(words(old)) - Counter(words(new))


# ───────────────────────── tự kiểm ─────────────────────────
def _test():
    n = NAMES | {'The Privé'}
    assert case_fix('Câu Hỏi Thường Gặp Về Sun Group', n) == 'Câu hỏi thường gặp về Sun Group'
    assert case_fix('Thông Tin Liên Hệ Trực Tiếp', n) == 'Thông tin liên hệ trực tiếp'
    assert case_fix('CĂN HỘ THE PRIVÉ QUẬN 2', n) == 'Căn hộ The Privé Quận 2'
    assert case_fix('Tiến độ thi công thần tốc và Sự minh bạch về Pháp lý', n) == 'Tiến độ thi công thần tốc và Sự minh bạch về Pháp lý'
    assert case_fix('Nhịp 2: Chốt lời (Tháng 8 - Tháng 10/2026)', n) == 'Nhịp 2: Chốt lời (Tháng 8 - Tháng 10/2026)'  # chữ hoa rải rác: giữ
    assert case_fix('Thế Trận "Vùng Đệm" Thảo Điền Và Sức Bật Từ Dòng Khách Cao Cấp', n) == 'Thế trận "vùng đệm" Thảo Điền và sức bật từ dòng khách cao cấp'
    log = []
    s = normalize('<h1 style="text-align: center;">ĐẠI ĐÔ THỊ THE GLOBAL CITY</h1>[vc_separator color="juicy_pink"]<p>Gọi 091 123 7979 '
                  '<a href="tel:0911237979">x</a></p>[dt_default_button link="url:tel%3A0911237979"]GỌI NGAY[/dt_default_button]'
                  '[vc_toggle title="A"]b[/vc_toggle]', n, log)
    assert s == ('<h1>Đại đô thị The Global City</h1><p>Gọi 0911 237 979 <a href="tel:0911237979">x</a></p>'
                 '[dt_default_button link="url:tel%3A0911237979"]Gọi ngay[/dt_default_button][vc_toggle title="A"]b[/vc_toggle]'), s
    row0 = ('[vc_row][vc_column][vc_column_text css=""]\n<h1 style="text-align: center;">X</h1>\n[/vc_column_text][vc_column_text css=""]\n'
            '<p>Mở bài.</p>\n<p>Đoạn hai.</p>\n[/vc_column_text][vc_separator][/vc_column][/vc_row]')
    row1 = '[vc_row][vc_column][vc_column_text css=""]\n<h2>Thông tin</h2>\n[/vc_column_text][vc_single_image image="5" css=""][/vc_column][/vc_row]'
    faq = '[vc_row][vc_column][vc_column_text]<h2>Câu hỏi</h2>[/vc_column_text][vc_toggle title="q"]a[/vc_toggle][/vc_column][/vc_row]'
    rel = '[vc_row][vc_column][vc_column_text]<h3>Bài viết liên quan</h3><ul><li>a</li></ul>[/vc_column_text][/vc_column][/vc_row]'
    raw = row0 + row1 + faq + rel
    log = []
    out = restructure(normalize(raw, n, log), 'X', 'Dự án', log)
    assert out.index('el_id="gioi-thieu"') < out.index('el_id="tong-quan"') < out.index('el_id="thong-tin"') < out.index('el_id="cau-hoi"') \
        < out.index('el_id="lien-he-tu-van"') < out.index('el_id="bai-lien-quan"'), out
    assert '[vc_single_image image="5"' in out.split('el_id="tong-quan"')[0], 'ảnh lên phần đầu'
    assert not lost(raw, out), lost(raw, out)
    assert '<h2>Bài viết liên quan</h2>' in out
    print('tự kiểm: ok')


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        _test()
        sys.exit()
    src, out = json.load(open(sys.argv[1])), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    cfg = json.load(open(Path(__file__).resolve().parent.parent / 'data/the7/buoc-6/dung-lai.json'))
    rows = []
    for pid, it in src.items():
        log = []
        c = cfg.get(pid, {})
        mode = c.get('mode', 'normalize')
        raw = it['raw']
        if mode == 'project':
            new = restructure(normalize(raw, NAMES, log), c['name'], c['eyebrow'], log, c.get('projects'))
        elif mode == 'upgrade':
            new = upgrade_applied(normalize(raw, NAMES, log))
        elif mode == 'home':
            new = home(raw, NAMES, log)
        elif mode == 'contact':
            new = contact(raw, NAMES, log)
        else:
            new = normalize(raw, NAMES, log)
        if new == raw:
            continue
        if mode == 'normalize' and it['kind'] == 'posts' and {k for k, _, _ in log} <= {'so-dien-thoai'}:
            continue  # bài blog chỉ khác cách viết số: không sửa để giữ ngày cập nhật bài
        lo = lost(raw, new)
        (out / f'{pid}.txt').write_text(new)
        rows += [(pid, it['link'], a, b, c2) for a, b, c2 in log]
        print(pid, mode, it['link'].replace(B, ''), len(raw), '→', len(new), 'thay đổi', len(log), 'chữ mất:', dict(lo) if lo else 0)
    with open(out / 'thay-doi.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['id', 'url', 'loai', 'truoc', 'sau'])
        w.writerows(rows)
