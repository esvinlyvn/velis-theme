#!/usr/bin/env python3
"""Bước 16c: dựng lại trang sản phẩm (dự án / phân khu / chủ đầu tư / Chủ đầu tư) bằng phần tử WPBakery "Velis" (inc/velis-elements.php).
CHUYỂN, không viết lại: mọi chữ / ảnh / bảng / số giữ nguyên; chỉ đổi khung chứa.

  phần đầu (hàng velis-hero): giữ; lưới thông số (Inner Row velis-facts, 6 cột × Text Block) → [velis_thong_tin] (2 cột trong phần đầu)
  thân: nhóm phần tử theo H2 → mỗi nhóm một [velis_khoi]: tiêu đề = H2, nội dung = Text Block + "Xem thêm" (gộp, không còn phần tử riêng),
        minh họa = ảnh (1) / thư viện (≥ 2) / bản đồ / bảng (chuyển ra khỏi chữ) / "Điểm chính" (câu có sẵn trong khối – ưu tiên câu có số)
        nhóm có câu hỏi (vc_toggle không phải "Xem thêm") → [velis_hoi_dap]; Blog Masonry / Blog List → [velis_luoi]
        mục lục gõ tay [ez-toc] → [velis_muc_luc] ngay sau phần đầu
  hàng CTA (velis-cta) → [velis_nhan_bang_gia] (tiêu đề, lợi ích, form, dự án, ghi chú giờ giữ nguyên)
  trang dự án: thêm [velis_luoi] bài liên quan theo chuyên mục cụm (thay "Bài viết nên xem" của The7)
Dùng: python3 -I tools/the7_sua_buoc16c.py --test   (áp: scratchpad st/ap16c.py)
"""
import base64, html, json, re
from urllib.parse import quote

KEO = {'vc_column_text', 'vc_toggle', 'vc_row_inner', 'vc_column_inner', 'vc_raw_html', 'dt_default_button', 'contact-form-7',
       'ultimate_icon_list', 'vc_section', 'vc_row', 'vc_column', 'dt_breadcrumbs'}
ENC = {'vc_column_text', 'vc_toggle', 'vc_row_inner', 'vc_raw_html', 'dt_default_button', 'ultimate_icon_list'}


def pg(items):  # param_group của WPBakery: rawurlencode(JSON)
    return quote(json.dumps(items, ensure_ascii=False, separators=(',', ':')), safe="!*'()~-_.")


def raw(htm):  # textarea_raw_html: base64(rawurlencode)
    return base64.b64encode(quote(htm, safe="!*'()~-_.").encode()).decode()


def attr(s):  # giá trị thuộc tính shortcode an toàn (không ", [, ])
    s = html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
    return re.sub(r'"([^"]*)"', '“\\1”', s).replace('"', '”').replace('[', '(').replace(']', ')')


def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>|\[[^\]]*\]', ' ', s))).strip()


def tokens(s):
    """Phần tử cấp cao trong một cột: (tên, thuộc tính, ruột, nguyên văn)."""
    out, i = [], 0
    while True:
        m = re.compile(r'\[([a-z][\w-]*)((?:\s+[\w-]+="[^"]*")*)\s*\]').search(s, i)
        if not m:
            if s[i:].strip():
                out.append(('#text', '', s[i:], s[i:]))
            return out
        if s[i:m.start()].strip():
            out.append(('#text', '', s[i:m.start()], s[i:m.start()]))
        name = m.group(1)
        end = s.find('[/%s]' % name, m.end()) if name in ENC or name.startswith('vc_') and s.find('[/%s]' % name, m.end()) >= 0 and name not in ('vc_single_image', 'vc_empty_space', 'vc_gmaps', 'vc_btn', 'vc_separator') else -1
        if end >= 0:
            out.append((name, m.group(2), s[m.end():end], s[m.start():end + len(name) + 3]))
            i = end + len(name) + 3
        else:
            out.append((name, m.group(2), '', m.group(0)))
            i = m.end()


def a_of(attrs, k):
    m = re.search(r'\b%s="([^"]*)"' % re.escape(k), attrs)
    return m.group(1) if m else ''


def diem_chinh(txt, n=4):
    """Câu có sẵn trong khối (không bịa): ưu tiên câu có số, 3–5 dòng; không đủ → 2–3 câu đầu."""
    cau = [c.strip() for c in re.split(r'(?<=[.!?…])\s+(?=[A-ZĐÀ-Ỹ“"])', plain(txt)) if 20 <= len(c.strip()) <= 220]
    so = [c for c in cau if re.search(r'\d', c)]
    chon = so[:n] if len(so) >= 3 else (so + [c for c in cau if c not in so])[:3]
    return [c.rstrip('.') for c in chon]


def khoi(title, parts, cap='h2', ban_do=''):
    """Một nhóm phần tử (sau H2) → [velis_khoi] hoặc [velis_hoi_dap] hoặc [velis_luoi]."""
    chu, anh, cau_hoi, luoi, them = [], [], [], [], []
    for name, at, body, nguyen in parts:
        if name == 'vc_column_text' or name == '#text':
            chu.append(body.strip())
        elif name == 'vc_toggle':
            if 'velis-more' in a_of(at, 'el_class'):
                chu.append(body.strip())
            else:
                cau_hoi.append({'hoi': attr(a_of(at, 'title')), 'dap': body.strip()})
        elif name == 'vc_single_image':
            anh.append(a_of(at, 'image'))
        elif name == 'vc_row_inner':
            imgs = re.findall(r'\[vc_single_image[^\]]*image="(\d+)"', body)
            rest = re.sub(r'\[/?vc_(row_inner|column_inner)[^\]]*\]|\[vc_single_image[^\]]*\]', '', body).strip()
            anh += imgs
            if rest:
                chu.append(rest)
        elif name in ('dt_blog_masonry', 'dt_blog_list'):
            luoi.append(at)
        elif name == 'vc_gmaps':
            ban_do = ban_do or a_of(at, 'link')
        elif name == 'vc_empty_space':
            continue
        else:
            them.append(nguyen)  # phần tử khác (nút, mã nhúng…): giữ nguyên trong nội dung
    content = '\n'.join(x for x in chu if x) + ('\n' + '\n'.join(them) if them else '')
    t = attr(title)
    if cau_hoi:
        return '[velis_hoi_dap tieu_de="%s" gioi_thieu="%s" muc="%s"]' % (t, attr(re.sub(r'</p>\s*<p>', '\n\n', content)), pg(cau_hoi)), None
    if luoi and not plain(content):
        at = luoi[0]
        bai = a_of(at, 'posts')
        loai = 'du_an' if (bai and a_of(at, 'post_type') == 'posts' and 'resized_image_dimensions="4x3"' in at) or a_of(at, 'category') in ('34', '57', '34,57') else 'bai'
        so = a_of(at, 'dis_posts_total') or str(len(bai.split(','))) if bai else (a_of(at, 'dis_posts_total') or '3')
        return '[velis_luoi tieu_de="%s" loai="%s" danh_muc="%s" bai="%s" so="%s"]' % (t, loai, a_of(at, 'category'), bai, so), None
    ghi = None
    if len(anh) == 1:
        mh = 'minh_hoa="anh" anh="%s"' % anh[0]
    elif anh:
        mh = 'minh_hoa="thu_vien" thu_vien="%s"' % ','.join(anh)
    elif ban_do:
        b = ban_do[5:] if ban_do.startswith('#E-8_') else ban_do
        mh = 'minh_hoa="ban_do" ban_do="%s"' % b
    elif '<table' in content:
        m = re.search(r'<table.*?</table>', content, re.S)
        content = (content[:m.start()] + content[m.end():]).strip()
        mh = 'minh_hoa="bang" bang="%s"' % raw(m.group(0))
    else:
        d = diem_chinh(content)
        mh = 'minh_hoa="diem" diem="%s"' % pg([{'dong': x} for x in d])
        ghi = {'tieu_de': plain(title) or '(đoạn mở đầu)', 'diem': d}  # khối chỉ có chữ → người viết bổ sung minh họa thật
    for at in luoi:  # lưới đi kèm chữ: thêm sau khối
        pass
    out = '[velis_khoi tieu_de="%s"%s %s]%s[/velis_khoi]' % (t, '' if cap == 'h2' else ' cap="h3"', mh, '\n' + content + '\n')
    if luoi:
        at = luoi[0]
        out += '[velis_luoi tieu_de="" loai="%s" danh_muc="%s" bai="%s" so="%s"]' % ('du_an' if 'resized_image_dimensions="4x3"' in at else 'bai', a_of(at, 'category'), a_of(at, 'posts'), a_of(at, 'dis_posts_total') or '3')
    return out, ghi


def nhom(toks):
    """Chia phần tử thành nhóm theo Text Block mở đầu bằng <h2>."""
    groups, cur = [], ['', []]
    for t in toks:
        if t[0] == 'vc_column_text' and re.match(r'\s*(<p[^>]*class="velis-eyebrow"[^>]*>.*?</p>\s*)?<h2', t[2], re.S):
            if cur[1] or cur[0]:
                groups.append(cur)
            h = re.search(r'<h2[^>]*>(.*?)</h2>', t[2], re.S)
            cur = [h.group(1), [(t[0], t[1], t[2][:h.start()] + t[2][h.end():], t[3])]]
        else:
            cur[1].append(t)
    if cur[1] or cur[0]:
        groups.append(cur)
    return groups


def cot(row):
    m = re.fullmatch(r'\[vc_(?:row|section)[^\]]*\]\s*(?:\[vc_row[^\]]*\])?\[vc_column[^\]]*\](.*)\[/vc_column\](?:\[/vc_row\])?\s*\[/vc_(?:row|section)\]', row, re.S)
    return m.group(1) if m else None


def thong_tin(hero):
    m = re.search(r'\[vc_row_inner[^\]]*velis-facts[^\]]*\].*?\[/vc_row_inner\]', hero, re.S)
    if not m:
        return hero
    o = re.findall(r'<p class="velis-spec-label">(.*?)</p>\s*<p class="velis-spec-value">(.*?)</p>', m.group(0), re.S)
    return hero[:m.start()] + '[velis_thong_tin cot="2" muc="%s"]' % pg([{'nhan': attr(a), 'gia_tri': attr(b)} for a, b in o]) + hero[m.end():]


def cta(row):
    c = cot(row) or row
    h = re.search(r'<h2[^>]*>(.*?)</h2>', c, re.S)
    li = re.findall(r'<li>(.*?)</li>', c, re.S)
    f = re.search(r'\[contact-form-7[^\]]*\]', c)
    goi = re.search(r'Zalo</a>\s*([^<]*)</p>', c)
    return '[velis_nhan_bang_gia tieu_de="%s" loi_ich="%s" form="%s" du_an="%s" goi_them="%s"]' % (
        attr(h.group(1)) if h else '', pg([{'dong': attr(x)} for x in li]), a_of(f.group(0), 'id') if f else '',
        attr(a_of(f.group(0), 'du-an')) if f else '', attr(goi.group(1)) if goi else '')


def dung_lai(s, cum=None, khoi_rieng=False):
    """→ (nội dung mới, danh sách khối chỉ có chữ). cum = chuyên mục bài liên quan (trang dự án).
    khoi_rieng: trang khối (chủ đầu tư) – mỗi phần tử một hàng tràn nền, nền xen kẽ trắng / ngà (không 2 khối liền nhau cùng nền)."""
    from importlib import util
    rows, i = [], 0
    while True:
        a = s.find('[vc_', i)
        if a < 0:
            break
        tag = re.match(r'\[(vc_row|vc_section)\b', s[a:])
        if not tag:
            i = a + 1
            continue
        b = s.find('[/%s]' % tag.group(1), a)
        rows.append(s[a:b + len(tag.group(1)) + 3])
        i = b + len(tag.group(1)) + 3
    assert rows, 'không có hàng'
    if 'velis_khoi' in s or 'velis_nhan_bang_gia' in s:  # đã dựng: chỉ bỏ velis-cot2 còn sót trong phần đầu
        return re.sub(r'(\[vc_row[^\]]*velis-hero[^\]]*\].*?\[/vc_row\])', lambda m: re.sub(r'\s*el_class="velis-cot2"', '', m.group(1)), s, count=1, flags=re.S), []
    out, ghi, body, have_toc = [], [], [], False
    for r in rows:
        head = r.split(']', 1)[0]
        if 'velis-hero' in head:  # phần đầu: lưới thông số → phần tử; chữ phần đầu không chia 2 cột (phần đầu đã là lưới 7/12 + 5/12)
            out.append(re.sub(r'\s*el_class="velis-cot2"', '', thong_tin(r)))
            continue
        if 'velis-cta' in head:
            body.append(cta(r))
            continue
        if 'velis-devs' in head:
            body.append(('ROW', r))
            continue
        if 'velis-body' in head:  # bản bước 16 (8/12 + cột phải): lấy cột trái, bỏ cột phải (Widgetised Sidebar)
            c = re.search(r'\[vc_column width="8/12"[^\]]*\](.*)\[/vc_column\]\[vc_column width="4/12"', r, re.S).group(1)
        else:
            c = cot(r)
        if c is None:
            body.append(('ROW', r))
            continue
        if not re.search(r'<h2|\[ez-toc|\[vc_toggle|\[dt_blog', c) and len(plain(c)) < 400:  # đoạn dẫn ngắn (Chủ đầu tư): giữ
            body.append(('ROW', r))
            continue
        toks = [t for t in tokens(c) if not (t[0] == 'vc_column_text' and '[ez-toc]' in t[2])]
        have_toc = have_toc or '[ez-toc]' in c or len(re.findall(r'<h2', c)) > 1
        for title, parts in nhom(toks):
            k, g = khoi(title, parts)
            body.append(k)
            if g:
                ghi.append(g)
    if cum:
        body.append('[velis_luoi tieu_de="Bài viết liên quan" loai="bai" danh_muc="%s" so="6"]' % cum)
    n_h2 = sum(1 for x in body if isinstance(x, str) and re.match(r'\[velis_(khoi|hoi_dap|nhan_bang_gia) tieu_de="[^"]', x))
    if n_h2 >= 3:
        body.insert(0, '[velis_muc_luc tieu_de="Nội dung chính"]')
    if khoi_rieng:
        nga = False  # phần đầu nền ngà → khối đầu nền trắng
        for x in body:
            r = x[1] if isinstance(x, tuple) else '[vc_row full_width="stretch_row" el_class="velis-section%s"][vc_column]%s[/vc_column][/vc_row]' % (' velis-nen-nga' if nga else '', x)
            if isinstance(x, tuple):
                r = re.sub(r'\s*velis-nen-nga', '', r, count=1)
                if nga:
                    r = re.sub(r'el_class="', 'el_class="velis-nen-nga ', r, count=1) if 'el_class="' in r.split(']')[0] else r.replace('[vc_row', '[vc_row el_class="velis-nen-nga"', 1)
            out.append(r)
            nga = not nga
        return ''.join(out), ghi
    # gom phần tử liền nhau vào một hàng; hàng giữ nguyên (lưới chủ đầu tư) đứng riêng
    cur = []
    for x in body:
        if isinstance(x, tuple):
            if cur:
                out.append('[vc_row][vc_column]' + ''.join(cur) + '[/vc_column][/vc_row]')
                cur = []
            out.append(x[1])
        else:
            cur.append(x)
    if cur:
        out.append('[vc_row][vc_column]' + ''.join(cur) + '[/vc_column][/vc_row]')
    return ''.join(out), ghi


def chu_hien(s):
    """Chữ người đọc thấy (để so mất chữ): bỏ thẻ / shortcode, giải mã param_group + raw."""
    t = s
    for m in re.finditer(r'\b(muc|diem|loi_ich)="([^"]*)"', s):
        try:
            from urllib.parse import unquote
            for it in json.loads(unquote(m.group(2))):
                t += ' ' + ' '.join(str(v) for v in it.values())
        except ValueError:
            pass
    for m in re.finditer(r'\b(bang|ban_do)="([A-Za-z0-9+/=]+)"', s):
        from urllib.parse import unquote
        t += ' ' + unquote(base64.b64decode(m.group(2)).decode('utf-8', 'ignore'))
    if '[velis_nhan_bang_gia' in s:  # chữ cố định của mẫu phần tử (wpb_templates/velis_nhan_bang_gia.php; số gọi từ Tùy biến)
        t += ' Tư vấn trực tiếp từ Velis Realty Hoặc gọi ngay 0911 237 979 Zalo'
    for m in re.finditer(r'\[vc_toggle[^\]]*\btitle="([^"]*)"', s):
        t += ' ' + m.group(1)
    for tag in re.findall(r'\[velis_\w+[^\]]*\]', s):
        t += ' ' + ' '.join(re.findall(r'\b(?:tieu_de|gioi_thieu|goi_them)="([^"]*)"', tag))
    for m in []:
        t += ' ' + m.group(2)
    return plain(t)


def ty_le_giu(cu, moi):
    """Tỉ lệ từ (theo bội số) của bản cũ còn trong bản mới – kiểm "mất chữ" ≥ 99 %."""
    from collections import Counter
    norm = lambda x: re.findall(r'\w+', x.lower().replace('“', '"').replace('”', '"'))
    a, b = Counter(norm(chu_hien(cu))), Counter(norm(chu_hien(moi)))
    a.pop('xem', None); a.pop('thêm', None)  # chữ nút "Xem thêm" cũ (không còn phần tử riêng)
    tong = sum(a.values())
    return sum(min(v, b[k]) for k, v in a.items()) / tong if tong else 1.0


def test():
    hero = ('[vc_row full_width="stretch_row" el_id="gioi-thieu" el_class="velis-hero velis-nen-nga"][vc_column][dt_breadcrumbs][vc_column_text]<h1>Dự án A</h1>[/vc_column_text]'
            '[vc_row_inner el_class="velis-specs velis-facts"][vc_column_inner width="1/3"][vc_column_text]<p class="velis-spec-label">Quy mô</p>\n<p class="velis-spec-value">6,7 ha</p>[/vc_column_text][/vc_column_inner]'
            '[vc_column_inner width="1/3"][vc_column_text]<p class="velis-spec-label">Bàn giao</p>\n<p class="velis-spec-value">Năm 2027 "dự kiến"</p>[/vc_column_text][/vc_column_inner][/vc_row_inner][/vc_column][/vc_row]')
    than = ('[vc_row equal_height="yes" el_class="velis-body"][vc_column width="8/12" el_class="velis-main"][vc_column_text el_class="velis-toc"][ez-toc][/vc_column_text]'
            '[vc_column_text]<p>Mở đầu có 120 m² và 3 phòng ngủ. Câu thứ hai có 10 phút. Câu ba có 50 triệu/m². Câu bốn không số nhưng đủ dài để chọn.</p>[/vc_column_text]'
            '[vc_toggle title="Xem thêm" style="text_only" el_class="velis-more"]<p>Phần ẩn trước đây.</p>[/vc_toggle]'
            '[vc_column_text]<h2>Tiến độ</h2><p>Đã lên tầng 22.</p>[/vc_column_text][vc_row_inner][vc_column_inner width="1/2"][vc_single_image image="11"][/vc_column_inner][vc_column_inner width="1/2"][vc_single_image image="12"][/vc_column_inner][/vc_row_inner]'
            '[vc_column_text]<h2>Thông số</h2><p>Bảng dưới.</p><table><tr><td>A</td><td>1</td></tr></table>[/vc_column_text]'
            '[vc_column_text]<h2>Câu hỏi</h2><p>Dẫn.</p>[/vc_column_text][vc_toggle title="Pháp lý ra sao?"]<p>Đã có sổ.</p>[/vc_toggle]'
            '[/vc_column][vc_column width="4/12" el_class="velis-aside"][vc_widget_sidebar sidebar_id="sidebar_4"][/vc_column][/vc_row]')
    ct = ('[vc_row el_id="lien-he-tu-van" el_class="velis-cta"][vc_column][vc_column_text]<p class="velis-eyebrow">Tư vấn trực tiếp từ Velis Realty</p><h2>Nhận bảng giá Dự án A</h2>'
          '<ul class="velis-checks"><li>Bảng giá</li><li>Giỏ hàng</li></ul>[/vc_column_text][contact-form-7 id="20958" title="Nhận bảng giá" du-an="Dự án A"]'
          '[vc_column_text]<p class="velis-cta-call">Hoặc gọi <a href="tel:0911237979">0911 237 979</a> · <a href="https://zalo.me/0911237979">Zalo</a> (08:00–21:00 hằng ngày)</p>[/vc_column_text][/vc_column][/vc_row]')
    cu = hero + than + ct
    moi, ghi = dung_lai(cu, cum='48')
    assert 'vc_widget_sidebar' not in moi and 'velis-facts' not in moi and '[ez-toc]' not in moi and 'velis-more' not in moi, moi
    assert '[velis_thong_tin cot="2" muc="' in moi and '“dự kiến”' in json.dumps(json.loads(__import__('urllib.parse').parse.unquote(re.search(r'velis_thong_tin cot="2" muc="([^"]*)"', moi).group(1))), ensure_ascii=False)
    assert '[velis_muc_luc' in moi and moi.index('[velis_muc_luc') < moi.index('[velis_khoi')
    assert 'minh_hoa="thu_vien" thu_vien="11,12"' in moi and 'minh_hoa="bang" bang="' in moi and '<table' not in moi.split('minh_hoa="bang"')[1].split('[/velis_khoi]')[0]
    assert '[velis_hoi_dap tieu_de="Câu hỏi"' in moi and '[velis_nhan_bang_gia tieu_de="Nhận bảng giá Dự án A"' in moi and 'goi_them="(08:00–21:00 hằng ngày)"' in moi and 'form="20958"' in moi
    assert '[velis_luoi tieu_de="Bài viết liên quan" loai="bai" danh_muc="48" so="6"]' in moi
    assert ghi and ghi[0]['tieu_de'] == '(đoạn mở đầu)' and all(d in plain(cu) or d + '.' in plain(cu) for d in ghi[0]['diem']), ghi
    assert ty_le_giu(cu, moi) >= 0.99, ty_le_giu(cu, moi)
    assert dung_lai(moi)[0] == moi
    assert 'velis-cot2' not in dung_lai(moi.replace('[vc_column_text]<h1>', '[vc_column_text el_class="velis-cot2"]<h1>'))[0]
    kb, _ = dung_lai(cu, khoi_rieng=True)
    rows = re.findall(r'\[vc_row[^\]]*\]', kb)
    assert all('stretch_row' in r for r in rows) and [('velis-nen-nga' in r) for r in rows[1:4]] == [False, True, False], rows
    assert ty_le_giu('<p>một hai ba bốn</p>', '<p>một hai</p>') == 0.5
    print('test: OK')


if __name__ == '__main__':
    test()
