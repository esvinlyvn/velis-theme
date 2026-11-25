#!/usr/bin/env python3
"""Bước 16 (vòng sửa tổng – một hệ bố cục + dọn CSS): biến đổi nội dung WPBakery (content.raw), không đụng chữ.

  sach(): bỏ style="…" / data-path-to-node="…" viết thẳng trong thẻ HTML (span font-weight 400 dán từ Docs, width/height ô bảng…),
          gỡ <span> trần còn lại; <br> trong tiêu đề → khoảng trắng; đoạn rỗng (<p>&nbsp;</p>) và [vc_empty_space] bỏ;
          Extra class velis-clamp bỏ; css=".vc_custom_…{…}" (CSS riêng từng trang) bỏ – nền ngà / than đổi thành Extra class
          velis-bg-ivory / velis-bg-dark (định nghĩa một lần trong velis.css).
  du_an():  trang dự án / phân khu (có hàng velis-hero + hàng velis-cta) → loại A: hàng đầu trang tràn nền (stretch_row, chữ trong khung),
          các hàng nội dung giữa gộp vào MỘT hàng 8/12 (velis-main) + 4/12 (velis-aside: Widgetised Sidebar "Cột phải dự án" = sidebar_4),
          mục lục trong bài giữ (Text Block class velis-toc – ẩn ≥ 1200), hàng CTA cuối (form duy nhất) giữ nguyên.
Dùng: python3 -I tools/the7_sua_buoc16.py --test     (áp lên staging: scratchpad st/ap16.py gọi các hàm này)
"""
import re

BG = {'#faf7f2': 'velis-nen-nga', '#1a1a1a': 'velis-nen-toi'}
DOI = {'velis-bg-ivory': 'velis-nen-nga', 'velis-bg-dark': 'velis-nen-toi'}  # tên lớp lần áp đầu → tên chốt
ASIDE = '[vc_column width="4/12" el_class="velis-aside"][vc_widget_sidebar sidebar_id="sidebar_4"][/vc_column]'


def _them_class(attrs, cls):
    if re.search(r'\bel_class="', attrs):
        return re.sub(r'el_class="([^"]*)"', lambda m: 'el_class="%s"' % ' '.join(dict.fromkeys((m.group(1) + ' ' + cls).split())), attrs, count=1)
    return attrs + ' el_class="%s"' % cls


def _bo_css_rieng(s):
    def f(m):
        tag, attrs = m.group(1), m.group(2)
        css = re.search(r'\s*css="(\.vc_custom_\d+\{[^"]*\})"', attrs)
        if not css:
            return m.group(0)
        attrs = attrs.replace(css.group(0), '')
        bg = re.search(r'background-color:\s*(#[0-9a-fA-F]{6})', css.group(1))
        if bg and bg.group(1).lower() in BG:
            attrs = _them_class(attrs, BG[bg.group(1).lower()])
        return '[%s%s]' % (tag, attrs)
    return re.sub(r'\[((?:vc|dt|ult)_\w+)((?:\s+[\w-]+="[^"]*")*)\s*\]', f, s)


def sach(s):
    s = _bo_css_rieng(s)
    s = re.sub(r'\s+css=""', '', s)
    for _ in range(3):  # nhiều thuộc tính trong một thẻ
        s = re.sub(r'(<[a-zA-Z][^<>\[\]]*?)\s+(?:style|data-path-to-node|data-index-in-node)=(?:"[^"]*"|\'[^\']*\')', r'\1', s)
    s = re.sub(r'<span>(.*?)</span>', r'\1', s, flags=re.S)
    s = re.sub(r'(<h[1-6][^>]*>)(.*?)(</h[1-6]>)', lambda m: m.group(1) + re.sub(r'\s*<br\s*/?>\s*', ' ', m.group(2)) + m.group(3), s, flags=re.S)
    s = re.sub(r'<p>(?:\s|&nbsp;|\xa0|<br\s*/?>)*</p>\s*', '', s)
    s = re.sub(r'\[vc_empty_space[^\]]*\]', '', s)
    s = re.sub(r'el_class="([^"]*)"', lambda m: 'el_class="%s"' % ' '.join(dict.fromkeys(DOI.get(c, c) for c in m.group(1).split() if c != 'velis-clamp')), s)
    s = re.sub(r'\s+el_class=""', '', s)
    return s


def hang(s):
    """Tách các hàng cấp cao nhất [vc_row …]…[/vc_row] (hàng trong là vc_row_inner nên [/vc_row] đầu tiên là cuối hàng)."""
    out, i = [], 0
    while True:
        a = s.find('[vc_row', i)
        while a >= 0 and s.startswith('[vc_row_inner', a):
            a = s.find('[vc_row', a + 1)
        if a < 0:
            break
        b = s.find('[/vc_row]', a)
        out.append((a, b + len('[/vc_row]')))
        i = b + 1
    return out


def du_an(s):
    s = sach(s)
    if 'velis-main' in s:  # đã chuyển (chạy lại không đổi gì)
        return s
    rows = hang(s)
    txt = [s[a:b] for a, b in rows]
    iH = next(i for i, t in enumerate(txt) if re.match(r'\[vc_row[^\]]*velis-hero', t))
    iC = next(i for i, t in enumerate(txt) if re.match(r'\[vc_row[^\]]*velis-cta', t))
    assert iH < iC and s[:rows[0][0]].strip() == '' and s[rows[-1][1]:].strip() == '', 'bố cục lạ'
    hero = txt[iH]
    if 'full_width=' not in hero.split(']', 1)[0]:
        hero = hero.replace('[vc_row', '[vc_row full_width="stretch_row"', 1)
    giua = []
    for t in txt[iH + 1:iC]:
        head = t.split(']', 1)[0]
        m = re.fullmatch(r'\[vc_row[^\]]*\]\[vc_column[^\]]*\](.*)\[/vc_column\]\[/vc_row\]', t, re.S)
        assert m and len(re.findall(r'\[vc_column[\] ]', t)) == 1, 'hàng giữa nhiều cột: ' + head
        body = m.group(1)
        if 'velis-toc' in head:  # mục lục trong bài: đánh dấu Text Block để ẩn ở ≥ 1200 (cột phải có mục lục)
            body = re.sub(r'\[vc_column_text([^\]]*)\]', lambda x: '[vc_column_text%s]' % _them_class(x.group(1), 'velis-toc'), body, count=1)
        giua.append(body)
    than = '[vc_row equal_height="yes" el_class="velis-body"][vc_column width="8/12" el_class="velis-main"]' + ''.join(giua) + '[/vc_column]' + ASIDE + '[/vc_row]'
    return ''.join(txt[:iH]) + hero + than + ''.join(txt[iC:])


def gioi_thieu(s):
    """Giới thiệu: "Giá trị khác biệt" 4 biểu tượng (ultimate_icon_list, lệch kiểu) → danh sách đánh số 01–04 như trang chủ (cùng chữ);
    câu trích nằm trong cột trái (bỏ stretch_row – trang có cột phải)."""
    s = sach(s)
    m = re.search(r'\[vc_row_inner[^\]]*\](?:(?!\[/vc_row_inner\]).)*?\[ultimate_icon_list.*?\[/vc_row_inner\]', s, re.S)
    if m:
        items = re.findall(r'\[ultimate_icon_list_item[^\]]*\]\s*(.*?)\s*\[/ultimate_icon_list_item\]', m.group(0), re.S)
        li = []
        for i, it in enumerate(items, 1):
            t = re.match(r'<b>(.*?):?</b>:?\s*(.*)', it.strip(), re.S)
            assert t, it
            li.append('<li><span class="velis-value-num">%02d</span><h3>%s</h3>\n<p>%s</p></li>' % (i, t.group(1).rstrip(':'), t.group(2).strip()))
        s = s[:m.start()] + '[vc_column_text]\n<ol class="velis-values">\n' + '\n'.join(li) + '\n</ol>\n[/vc_column_text]' + s[m.end():]
    s = re.sub(r'\[vc_section full_width="stretch_row"([^\]]*velis-dark)', r'[vc_section\1', s)
    return s


def kieu_b(s, tieu_de_nga=False):
    """Trang khối (loại B: /du-an/, /chu-dau-tu/, trang chủ đầu tư): mỗi hàng cấp cao tràn nền (stretch_row, chữ trong khung 1200/1320),
    nền xen kẽ trắng / ngà (velis-nen-nga), hàng CTA nền than → không 2 khối liền nhau cùng nền; Text Block dài (> 260 ký tự chữ ≈ 2 dòng hết khung)
    thêm Extra class velis-cot2 (2 cột chữ ở ≥ 1200 thay vì 1 dòng hết khung). tieu_de_nga: trang có dải tiêu đề The7 nền ngà ở trên."""
    s = sach(s)
    rows = hang(s)
    assert rows and s[:rows[0][0]].strip() == '' and s[rows[-1][1]:].strip() == '', 'bố cục lạ'
    out, truoc = [], 'nga' if tieu_de_nga else 'toi'  # header trắng: hàng đầu (phần đầu trang) nền ngà
    for a, b in rows:
        t = s[a:b]
        head, rest = t.split(']', 1)
        cls = (re.search(r'el_class="([^"]*)"', head) or [None, ''])[1].split()
        cls = [c for c in cls if c not in ('velis-nen-nga', 'velis-nen-toi')]
        if 'velis-cta' in cls:
            nen = 'toi'
        else:
            nen = 'trang' if truoc == 'nga' else 'nga'
            if nen == 'nga':
                cls.append('velis-nen-nga')
        head = re.sub(r'\s*el_class="[^"]*"', '', head)
        if cls:
            head += ' el_class="%s"' % ' '.join(cls)
        if 'full_width=' not in head and 'velis-cta' not in cls:
            head = head.replace('[vc_row', '[vc_row full_width="stretch_row"', 1)
        def dai(m):
            chu = re.sub(r'<[^>]+>|\[[^\]]*\]', '', m.group(2))
            return '[vc_column_text%s]%s[/vc_column_text]' % (_them_class(m.group(1), 'velis-cot2') if len(chu) > 260 and 'velis-cot2' not in m.group(1) else m.group(1), m.group(2))
        rest = re.sub(r'\[vc_column_text([^\]]*)\](.*?)\[/vc_column_text\]', dai, rest, flags=re.S)
        out.append(head + ']' + rest)
        truoc = nen
    return ''.join(out)


def test():
    raw = ('[vc_row el_id="gioi-thieu" el_class="velis-hero" css=".vc_custom_1{background-color: #FAF7F2 !important;}"][vc_column][vc_column_text css="" el_class="velis-clamp"]'
           '<h1>Tên<br />dự án</h1><p><span style="font-weight: 400;">Mở đầu</span></p><p>&nbsp;</p>[/vc_column_text][/vc_column][/vc_row]'
           '[vc_row el_id="muc-luc" el_class="velis-section velis-toc" css=""][vc_column][vc_column_text css=""][ez-toc][/vc_column_text][/vc_column][/vc_row]'
           '[vc_row el_id="a" el_class="velis-section"][vc_column][vc_column_text]<h2>A</h2><table style="width: 98%;"><tr><td style="width: 50%;" data-path-to-node="3">x</td></tr></table>[/vc_column_text]'
           '[vc_row_inner][vc_column_inner width="1/2"][vc_single_image image="1"][/vc_column_inner][vc_column_inner width="1/2"][vc_empty_space height="32px"][/vc_column_inner][/vc_row_inner][/vc_column][/vc_row]'
           '[vc_row el_id="lien-he-tu-van" el_class="velis-cta"][vc_column][contact-form-7 id="1"][/vc_column][/vc_row]')
    out = du_an(raw)
    assert 'style=' not in out and 'data-path' not in out and 'vc_custom' not in out and 'velis-clamp' not in out, out
    assert '<h1>Tên dự án</h1>' in out and '<p>Mở đầu</p>' in out and '&nbsp;' not in out and 'vc_empty_space' not in out
    assert out.startswith('[vc_row full_width="stretch_row" el_id="gioi-thieu" el_class="velis-hero velis-nen-nga"]'), out[:120]
    assert out.count('[vc_row ') == 3 and out.count('[vc_row_inner') == 1, out
    assert '[vc_column width="8/12" el_class="velis-main"][vc_column_text el_class="velis-toc"][ez-toc]' in out
    assert ASIDE + '[/vc_row][vc_row el_id="lien-he-tu-van" el_class="velis-cta"]' in out
    assert len(hang(out)) == 3 and du_an(out) == out
    try:
        du_an('[vc_row el_class="velis-hero"][vc_column][/vc_column][/vc_row][vc_row][vc_column width="1/2"]a[/vc_column][vc_column width="1/2"]b[/vc_column][/vc_row][vc_row el_class="velis-cta"][vc_column][/vc_column][/vc_row]')
        raise SystemExit('phải chặn hàng nhiều cột')
    except AssertionError:
        pass
    s2 = sach('[vc_row css=".vc_custom_9{background-color: #1A1A1A !important;}"][vc_column]<h2 class="x">A<br>B</h2>[/vc_column][/vc_row]')
    assert s2 == '[vc_row el_class="velis-nen-toi"][vc_column]<h2 class="x">A B</h2>[/vc_column][/vc_row]', s2
    g = gioi_thieu('[vc_section][vc_row][vc_column][vc_column_text]<h2>Giá trị</h2>[/vc_column_text][vc_row_inner content_placement="top"][vc_column_inner width="1/2"][ultimate_icon_list icon_size="14"]'
                   '[ultimate_icon_list_item icon="far fa-x"]<b data-index-in-node="0">Thông tin có nguồn:</b> Câu một.[/ultimate_icon_list_item][/ultimate_icon_list][/vc_column_inner][vc_column_inner width="1/2"][ultimate_icon_list]'
                   '[ultimate_icon_list_item icon="y"]\n\n<b>Hỗ trợ:</b> Câu hai.\n\n[/ultimate_icon_list_item][/ultimate_icon_list][/vc_column_inner][/vc_row_inner][/vc_column][/vc_row][/vc_section]'
                   '[vc_section full_width="stretch_row" el_id="k" el_class="velis-dark"][vc_row][vc_column]q[/vc_column][/vc_row][/vc_section]')
    assert '<li><span class="velis-value-num">01</span><h3>Thông tin có nguồn</h3>\n<p>Câu một.</p></li>' in g and '<h3>Hỗ trợ</h3>\n<p>Câu hai.</p>' in g, g
    assert 'ultimate' not in g and 'vc_row_inner' not in g and '[vc_section el_id="k"' in g, g
    b = kieu_b('[vc_row el_class="velis-hero velis-bg-ivory"][vc_column][vc_column_text]<h1>A</h1>[/vc_column_text][/vc_column][/vc_row]'
               '[vc_row el_class="velis-section"][vc_column][vc_column_text]<p>' + 'chữ ' * 200 + '</p>[/vc_column_text][/vc_column][/vc_row]'
               '[vc_row el_class="velis-section"][vc_column]x[/vc_column][/vc_row][vc_row el_class="velis-cta"][vc_column]f[/vc_column][/vc_row][vc_row][vc_column]y[/vc_column][/vc_row]')
    hs = [h.split(']')[0] for h in b.split('[vc_row')[1:]]
    assert hs[0] == ' full_width="stretch_row" el_class="velis-hero velis-nen-nga"' and 'velis-nen-nga' not in hs[1] and 'velis-nen-nga' in hs[2], hs
    assert hs[3] == ' el_class="velis-cta"' and hs[4] == ' full_width="stretch_row" el_class="velis-nen-nga"', hs
    assert b.count('velis-cot2') == 1 and kieu_b(b) == b
    print('test: OK')


if __name__ == '__main__':
    test()
