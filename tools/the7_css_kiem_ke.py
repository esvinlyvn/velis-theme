#!/usr/bin/env python3
"""Kiểm kê một tệp CSS (docs/the7/CSS-KIEM-KE.md): số dòng, số quy tắc, số !important, và các quy tắc ĐẶT BỀ RỘNG CHO CHỮ
(width / max-width / min-width ≠ 100 % / auto / none, đơn vị ch, text-wrap: balance | pretty) trên bộ chọn chữ nội dung
(h1–h6, p, li, ul, ol, table, td, blockquote, .wpb_text_column, .vc_toggle, .entry-content, .velis-quote, khối chữ …).
Dùng: python3 -I tools/the7_css_kiem_ke.py <tệp.css> [--liet-ke]   |   --test
"""
import re, sys

CHU = re.compile(r'(^|[\s>+~,(])(h[1-6]|p|li|ul|ol|table|td|th|blockquote)\b|\.(wpb_text_column|vc_toggle|entry-content|velis-quote|velis-lead|velis-khoi__chu|velis-404-msg|wpb_wrapper)\b')
BO_QUA = re.compile(r'\b(img|svg|iframe|input|button|select|textarea|figure)\b|velis-(logos|post-list|feats|projects|cta-bar|devs)|\.paginator|#footer|#bottom-bar|\.masthead|#sidebar|\.blog-shortcode')


def quy_tac(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out = []
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        sel, body = m.group(1).strip(), m.group(2)
        if sel.startswith('@'):
            continue
        out.append((sel, body))
    return out


def be_rong_chu(sel, body):
    """Quy tắc đặt / giới hạn bề rộng cho chữ nội dung → lý do, hoặc ''."""
    if not CHU.search(sel) or BO_QUA.search(sel) or '::' in sel or 'icon' in sel:  # trang trí (gạch, dấu tích, biểu tượng) không phải chữ
        return ''
    for k, v in re.findall(r'(max-width|min-width|width|text-wrap)\s*:\s*([^;]+)', body):
        v = v.replace('!important', '').strip()
        if k == 'text-wrap' and v in ('balance', 'pretty'):
            return 'text-wrap: ' + v
        if k != 'text-wrap' and v not in ('100%', 'auto', 'none', '0', 'max-content', 'fit-content') and not v.startswith('calc(100%'):
            return '%s: %s' % (k, v)
    return ''


def kiem_ke(css):
    qt = quy_tac(css)
    rong = [(s, ly) for s, b in qt for ly in [be_rong_chu(s, b)] if ly]
    return {'dong': css.count('\n') + (0 if css.endswith('\n') else 1), 'quy_tac': len(qt),
            'important': len(re.findall(r'!important', re.sub(r'/\*.*?\*/', '', css, flags=re.S))), 'be_rong_chu': rong}


def test():
    css = """/* x !important */
.velis-hero h1 { text-wrap: balance; }
.entry-content table { width: 100%; }
.velis-section .wpb_wrapper > .wpb_text_column { max-width: 760px; margin: 0 auto; }
.velis-logos img { width: 200px; }
p { margin: 0 !important; }
@media (min-width: 1600px) { :root { --x: 1px; } }
"""
    k = kiem_ke(css)
    assert k['important'] == 1 and k['quy_tac'] == 6, k
    assert [l for _, l in k['be_rong_chu']] == ['text-wrap: balance', 'max-width: 760px'], k['be_rong_chu']
    print('test: OK')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        test(); sys.exit(0)
    k = kiem_ke(open(a[0], encoding='utf-8').read())
    print('dòng %d · quy tắc %d · !important %d · quy tắc bề rộng chữ %d' % (k['dong'], k['quy_tac'], k['important'], len(k['be_rong_chu'])))
    if '--liet-ke' in a:
        for s, l in k['be_rong_chu']:
            print('  -', l, '←', s[:140])
