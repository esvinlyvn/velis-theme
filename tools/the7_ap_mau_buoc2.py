#!/usr/bin/env python3
"""The7 bước 2: sắp lại nội dung THẬT của 3 trang mẫu theo mẫu WPBakery (data/the7/mau-wpbakery/).

Chỉ đổi bố cục (hàng/cột WPBakery), chữ hoa → chữ thường ở H1/H2, bỏ đường kẻ chấm hồng cũ; không thêm số liệu.
Đầu vào: thư mục chứa raw content (persa.txt, gamuda.txt, ban-giao.txt, lấy qua REST context=edit).
Đầu ra: <out>/{persa,gamuda,ban-giao}.new.txt
Dùng: python3 -I tools/the7_ap_mau_buoc2.py <in_dir> <out_dir>
"""
import re
import sys
from pathlib import Path

SEP = re.compile(r'\[vc_separator [^\]]*\]')
BTN = '[dt_default_button link="url:%2Flien-he%2F|title:Nh%E1%BA%ADn%20t%C6%B0%20v%E1%BA%A5n" size="big"]Nhận tư vấn[/dt_default_button]'
TEL = '[vc_column_text css=""]\n<p>Hoặc gọi <a href="tel:0911237979">0911 237 979</a></p>\n[/vc_column_text]'
_n = [1762850001000]


def css(rule):
    _n[0] += 1
    return f'.vc_custom_{_n[0]}{{{rule}}}'


PAD = 'padding-top: 48px !important;'
BG = 'background-color: #FAF7F2 !important;'


def rows(raw):
    """Top-level [vc_row]…[/vc_row] blocks (vc_section wrapper dropped)."""
    raw = re.sub(r'\[/?vc_section[^\]]*\]', '', raw)
    out = re.findall(r'\[vc_row(?:\s[^\]]*)?\].*?\[/vc_row\]', raw, re.S)
    assert ''.join(out).replace(' ', '') in raw.replace(' ', ''), 'rows() lost content'
    return out


def inner(row):
    """Content of the single [vc_column] of a row, without old separators."""
    m = re.fullmatch(r'\[vc_row[^\]]*\]\[vc_column(?:\s[^\]]*)?\](.*)\[/vc_column\]\[/vc_row\]', row, re.S)
    assert m, row[:200]
    return SEP.sub('', m.group(1))


def section(el_id, body, extra=''):
    return f'[vc_row el_id="{el_id}"{extra} css="{css(PAD)}"][vc_column]{body}[/vc_column][/vc_row]'


def heads(s, mapping):
    """Replace heading texts (exact, after stripping tags) and drop inline centring on h1/h2."""
    s = re.sub(r'<(h[12])( style="text-align: center;")?([^>]*)>', r'<\1\3>', s)
    for old, new in mapping.items():
        pat = re.compile(r'(<h[1-3][^>]*>)\s*' + re.escape(old) + r'\s*(</h[1-3]>)')
        s, k = pat.subn(lambda m: m.group(1) + new + m.group(2), s)
        assert k == 1, old
    return s


def cta(el_id, body_html, extra_css=''):
    return (f'[vc_row el_id="{el_id}" el_class="velis-cta" css="{css("margin-top: 48px !important;" + PAD + "padding-bottom: 48px !important;padding-right: 32px !important;padding-left: 32px !important;" + BG + extra_css)}"]'
            f'[vc_column][vc_column_text css=""]\n{body_html}\n[/vc_column_text]{BTN}{TEL}[/vc_column][/vc_row]')


def spec(label, value):
    return (f'[vc_column_inner width="1/4" offset="vc_col-xs-6"][vc_column_text css=""]\n<p class="velis-spec-label">{label}</p>\n'
            f'<p class="velis-spec-value">{value}</p>\n[/vc_column_text][/vc_column_inner]')


def persa(raw):
    r = rows(raw)
    assert len(r) == 11, len(r)
    r = [heads(x, {}) for x in r]
    # Hàng 1: H1 + 3 đoạn mở bài + hộp ưu đãi (ultimate_ctation) + nút hotline.
    intro = re.search(r'\[/vc_column_text\]\[vc_column_text css=""\](.*?)\[/vc_column_text\]', r[0], re.S).group(1).strip()
    promo = re.search(r'\[ultimate_ctation[^\]]*\](.*?)\[/ultimate_ctation\]', r[0], re.S).group(1)
    promo = [re.sub(r'<[^>]+>', '', p).strip() for p in re.findall(r'<p[^>]*>.*?</p>', promo, re.S)]
    assert promo == ['Nhận Booking ưu tiên 50 triệu/suất', 'Suất NGOẠI GIAO - RỔ HÀNG ĐẸP - CĂN THƯỞNG'], promo
    # Hàng 2: H2 + bảng thông tin + ảnh phối cảnh 20231 + "Liên minh đối tác".
    r1 = inner(r[1])
    table = re.search(r'<table.*?</table>', r1, re.S).group(0)
    trs = re.findall(r'<tr>.*?</tr>', table, re.S)
    cell = lambda tr: [re.sub(r'\s+', ' ', re.sub(r'<(?!/?b\b)[^>]+>', '', re.sub(r'<b [^>]*>', '<b>', td))).strip()
                       for td in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
    data = {re.sub(r'</?b>', '', cell(t)[0]): (t, cell(t)[1]) for t in trs}
    keys = ['Quy mô', 'Tổng số sản phẩm', 'Diện tích đất', 'Dự kiến bàn giao']
    labels = ['Quy mô', 'Số sản phẩm', 'Diện tích đất', 'Bàn giao dự kiến']
    for k in keys:
        table = table.replace(data[k][0], '')
    table = re.sub(r'\n+', '\n', re.sub(r' style="[^"]*"', '', table))
    vitri = re.sub(r'</?b>', '', data['Vị trí'][1])
    alliance = r1[r1.index('<h3'):r1.rindex('[/vc_column_text]')].strip()
    assert '[vc_single_image image="20231"' in r1
    hero = (f'[vc_row equal_height="yes" content_placement="middle" el_id="gioi-thieu" el_class="velis-hero" css="{css(PAD + "padding-bottom: 48px !important;padding-right: 32px !important;padding-left: 32px !important;" + BG)}"]'
            '[vc_column width="1/2"][vc_column_text css=""]\n'
            '<p class="velis-eyebrow">Dự án · <a href="https://staging.velisrealty.vn/du-an/gamuda-land/">Gamuda Land</a></p>\n'
            '<h1>Căn hộ Persa Place Gamuda Land</h1>\n'
            f'<p>{vitri} · Bàn giao dự kiến {re.sub("</?b>", "", data["Dự kiến bàn giao"][1])}</p>\n'
            '<p><strong>Nhận booking ưu tiên 50 triệu/suất</strong> – suất ngoại giao, rổ hàng đẹp, căn thưởng.</p>\n'
            f'[/vc_column_text]{BTN}{TEL}[/vc_column][vc_column width="1/2"]'
            '[vc_single_image image="20231" img_size="large" alignment="center" css=""][/vc_column][/vc_row]')
    specs = section('thong-so', '[vc_column_text css=""]\n<h2>Thông tin tổng quan căn hộ Persa Place</h2>\n[/vc_column_text]'
                    '[vc_row_inner el_class="velis-specs"]' + ''.join(spec(l, data[k][1]) for k, l in zip(keys, labels)) +
                    f'[/vc_row_inner][vc_column_text css=""]\n{table}\n[/vc_column_text]')
    overview = section('tong-quan', f'[vc_column_text css=""]\n<h2>Giới thiệu căn hộ Persa Place</h2>\n{intro}\n{alliance}\n[/vc_column_text]')
    ids = ['tien-do', 'vi-tri', 'tien-ich', 'mat-bang', 'gia-ban', 'vi-sao-dau-tu', 'vi-sao-mua-o']
    mapping = {
        'CẬP NHẬT TIẾN ĐỘ THỰC TẾ PERSA GAMUDA': 'Cập nhật tiến độ thực tế Persa Gamuda',
        'VỊ TRÍ PERSA GAMUDA Ở ĐÂU? VÌ SAO NÊN MUA': 'Vị trí Persa Gamuda ở đâu? Vì sao nên mua',
        'TIỆN ÍCH PERSA PALCE CÓ GÌ': 'Tiện ích Persa Place có gì',
        'MẶT BẰNG CĂN HỘ PERSA PLACE CÓ GÌ ĐẶC BIỆT?': 'Mặt bằng căn hộ Persa Place có gì đặc biệt?',
        'GIÁ BÁN PERSA PLACE BAO NHIÊU?': 'Giá bán Persa Place bao nhiêu?',
        'TẠI SAO NÊN MUA ĐẦU TƯ PERSA PLACE LÚC NÀY?': 'Tại sao nên mua đầu tư Persa Place lúc này?',
        'VÌ SAO CĂN HỘ PERSA PLACE PHÙ HỢP VỚI NGƯỜI MUA Ở?': 'Vì sao căn hộ Persa Place phù hợp với người mua ở?',
    }
    body = [section(i, inner(x)) for i, x in zip(ids, r[2:9])]
    body = [heads(b, {k: v}) if k in b else b for b, (k, v) in zip(body, mapping.items())]
    # "Liên hệ tư vấn" (cuối hàng "người mua ở") chuyển vào khối CTA.
    last = body[-1]
    i = last.index('<h3 data-path-to-node="8">Liên hệ tư vấn</h3>')
    j = last.index('[/vc_column_text]', i)
    contact = last[i:j].strip()
    body[-1] = last[:i] + last[j:]
    contact = contact.replace('<h3 data-path-to-node="8">Liên hệ tư vấn</h3>', '<h2>Liên hệ tư vấn Persa Place</h2>')
    faq = heads(section('cau-hoi', inner(r[9])), {'CÂU HỎI THƯỜNG GẶP': 'Câu hỏi thường gặp'})
    related = section('bai-lien-quan', inner(r[10]).replace('<h3>Bài viết liên quan</h3>', '<h2>Bài viết liên quan</h2>'))
    return ''.join([hero, specs, overview, *body, faq, cta('lien-he-tu-van', contact), related])


def gamuda(raw):
    r = rows(raw)
    assert len(r) == 7, len(r)
    r0 = inner(r[0])
    h1 = re.search(r'<h1[^>]*>.*?</h1>', r0, re.S).group(0)
    assert 'Gamuda Land\r\nĐẳng Cấp Kiến Tạo Đô Thị Từ Malaysia' in h1 or 'Gamuda Land\nĐẳng Cấp Kiến Tạo Đô Thị Từ Malaysia' in h1
    text = r0[r0.index('</h1>') + 5:r0.index('[/vc_column_text]')].strip()
    assert '[vc_single_image image="19652"' in r0
    paras = re.findall(r'<p[^>]*>.*?</p>', text, re.S)
    quote, rest = paras[0], '\n'.join(paras[1:])
    assert not re.sub(r'<p[^>]*>.*?</p>', '', text, flags=re.S).strip(), 'hero text is not only paragraphs'
    hero = (f'[vc_row equal_height="yes" content_placement="middle" el_id="gioi-thieu" el_class="velis-hero" css="{css(PAD + "padding-bottom: 48px !important;padding-right: 32px !important;padding-left: 32px !important;" + BG)}"]'
            '[vc_column width="7/12"][vc_column_text css=""]\n<p class="velis-eyebrow">Chủ đầu tư</p>\n'
            f'<h1>Gamuda Land – đẳng cấp kiến tạo đô thị từ Malaysia</h1>\n{quote}\n[/vc_column_text]{BTN}[/vc_column]'
            '[vc_column width="5/12"][vc_single_image image="19652" img_size="large" alignment="center" css=""][/vc_column][/vc_row]')
    card = lambda img, url, name, place: (
        f'[vc_column_inner width="1/2"][vc_single_image image="{img}" img_size="600x400" alignment="center" onclick="custom_link" link="{url}" css=""]'
        f'[vc_column_text css=""]\n<h3><a href="{url}">{name}</a></h3>\n<p>{place}</p>\n[/vc_column_text][/vc_column_inner]')
    B = 'https://staging.velisrealty.vn'
    projects = section('du-an', '[vc_column_text css=""]\n<h2>Dự án Gamuda Land tại Velis Realty</h2>\n[/vc_column_text]'
                       '[vc_row_inner el_class="velis-cards"]' +
                       card(19825, f'{B}/spring-ville/', 'Spring Ville', 'Nhơn Trạch, Đồng Nai – đô thị cửa ngõ sân bay Long Thành') +
                       card(20231, f'{B}/can-ho-persa-place/', 'Căn hộ Persa Place', 'Trung tâm khu đô thị Springville, mặt tiền Tôn Đức Thắng, Nhơn Trạch') +
                       '[/vc_row_inner]')
    about = section('ve-gamuda-land', f'[vc_column_text css=""]\n{rest}\n[/vc_column_text]')
    mapping = [
        {'Gamuda Land Là Ai? "Mã Gen" Của Một Nhà Kiến Tạo Đô Thị': 'Gamuda Land là ai? "Mã gen" của một nhà kiến tạo đô thị'},
        {'Bản Đồ Dự Án Gamuda Land Năm 2026: Những "Cực Tăng Trưởng" Mới': 'Bản đồ dự án Gamuda Land năm 2026: những "cực tăng trưởng" mới'},
        {'Thiết Kế Biophilic – Khi Thiên Nhiên Là "Trái Tim" Của Dự Án': 'Thiết kế Biophilic – khi thiên nhiên là "trái tim" của dự án'},
        {'Tại Sao Nhà Đầu Tư Chọn Gamuda Land Năm 2026?': 'Tại sao nhà đầu tư chọn Gamuda Land năm 2026?'},
    ]
    ids = ['la-ai', 'ban-do-du-an', 'biophilic', 'vi-sao-chon']
    body = [heads(section(i, inner(x)), m) for i, x, m in zip(ids, r[1:5], mapping)]
    faq_inner = inner(r[5])
    faq = heads(section('cau-hoi', faq_inner), {'Câu Hỏi Thường Gặp Về Chủ Đầu Tư Gamuda Land': 'Câu hỏi thường gặp về chủ đầu tư Gamuda Land'})
    related = section('bai-lien-quan', inner(r[6]).replace('<h3 data-path-to-node="17">Bài viết liên quan đến các dự án của Gamuda Land</h3>',
                                                          '<h2>Bài viết liên quan đến các dự án của Gamuda Land</h2>'))
    return ''.join([hero, projects, about, *body, faq, cta('lien-he-tu-van', '<h2>Nhận tư vấn dự án Gamuda Land</h2>'), related])


def ban_giao(raw):
    r = rows(raw)
    assert len(r) == 1, len(r)
    body = inner(r[0])
    # 2 đoạn cuối mời liên hệ → khối CTA.
    i = body.index('<span style="font-weight: 400;">Anh chị đang cần xem bảng danh mục vật liệu')
    j = body.rindex('[/vc_column_text]')
    contact = body[i:j].strip()
    assert 'tel:0911237979' in contact and contact.count('<span style="font-weight: 400;">') == 3, contact[:300]
    paras = [p.strip() for p in contact.split('\n\n') if p.strip()]
    contact_html = '<h2>Liên hệ tư vấn</h2>\n' + '\n'.join(f'<p>{p}</p>' for p in paras)
    main = f'[vc_row][vc_column]{body[:i].rstrip()}\n{body[j:]}[/vc_column][/vc_row]'
    c = (f'[vc_row el_id="lien-he-tu-van" el_class="velis-cta" css="{css("margin-top: 32px !important;padding-top: 32px !important;padding-right: 32px !important;padding-bottom: 32px !important;padding-left: 32px !important;" + BG)}"]'
         f'[vc_column][vc_column_text css=""]\n{contact_html}\n[/vc_column_text]{BTN}[/vc_column][/vc_row]')
    return main + c


def words(s):
    """Visible words, for the no-content-lost check."""
    s = re.sub(r'\[[^\]]*\]|<[^>]+>|&nbsp;', ' ', s)
    return re.findall(r'\w+', s.lower())


if __name__ == '__main__':
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in [('persa', persa), ('gamuda', gamuda), ('ban-giao', ban_giao)]:
        raw = (src / f'{name}.txt').read_text()
        new = fn(raw)
        old_w, new_w = words(raw), words(new)
        from collections import Counter
        lost = Counter(old_w) - Counter(new_w)
        (out / f'{name}.new.txt').write_text(new)
        print(name, len(raw), '→', len(new), 'từ mất:', sum(lost.values()), dict(list(lost.items())[:30]))
