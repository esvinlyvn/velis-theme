# Bước 6 The7 (đồng bộ UI một lần theo DESIGN.md + docs/THE7.md): options hiện tại trên staging
# (data/the7/options-truoc-b6.json, xuất từ The7 → Export/Import) + đúng các khóa dưới → data/the7/options-buoc-6.json,
# nhập ở The7 → Theme Options → Export/Import Options. Trả lại như cũ: nhập options-truoc-b6.json.
# Chạy từ gốc repo: python3 -I tools/the7_options_buoc6.py
import json, re

o = json.load(open('data/the7/options-truoc-b6.json'))
# token DESIGN.md
INK, MUTED, CANVAS, WHITE, SUNKEN, HAIR, HAIR2 = '#1A1A1A', '#5C5C5C', '#FAF7F2', '#FFFFFF', '#F2EEE8', '#E4DED5', '#C9C1B5'
RED, RED_H, CHAMP, CHAMP_SOFT, ON_DARK_M, ERR_DARK = '#B8282E', '#9E1F26', '#B08D57', '#F3ECDF', '#B9B9B9', '#F2B8B5'
NONE = 'rgba(255,255,255,0)'
RED_GRAD = '135deg|#B8282E 30%|#9E1F26 100%'
INK_VEIL = '135deg|rgba(17,17,17,0.6) 30%|rgba(17,17,17,0.6) 100%'
B600, BODY, HEAD = 'Be Vietnam Pro:600', 'Be Vietnam Pro', 'Playfair Display:600'


def typo(fam, d, m, lh_d, lh_m):
    return {'font_family': fam, 'responsive_font_size': {'desktop': f'{d}px', 'tablet': f'{m}px', 'mobile': f'{m}px'},
            'responsive_line_height': {'desktop': f'{lh_d}px', 'tablet': f'{lh_m}px', 'mobile': f'{lh_m}px'}, 'text_transform': 'none'}


C = {
    # ── Chữ (DESIGN Typography: nội dung 18/1,7; thẻ 16; phụ 14; H1 56/36, H2 40/28, H3 22, H4 19) ──
    'fonts-big_size': {'font_size': '18px', 'line_height': '30px'},     # The7 dùng cỡ "big" cho chữ nội dung
    'fonts-normal_size': {'font_size': '16px', 'line_height': '25px'},  # chữ thẻ / widget
    'fonts-small_size': {'font_size': '14px', 'line_height': '21px'},
    'fonts-h1-typography': typo(HEAD, 56, 36, 62, 40),
    'fonts-h2-typography': typo(HEAD, 40, 28, 48, 34),
    'fonts-h3-typography': typo(B600, 22, 22, 29, 29),
    'fonts-h4-typography': typo(B600, 19, 19, 27, 27),
    # ── Tiêu đề trang (dải H1 The7) = cùng kiểu với hero mẫu: H1 56/36, căn trái, nền ngà ──
    'general-page-title-typography': {'font_family': HEAD, 'text_transform': 'none', 'font_size': '56', 'line_height': '62'},
    'general-responsive_title_size': '36', 'general-responsive_title_line_height': '40',
    'general-title_align': 'left', 'general-title_height': '160px', 'page_title-padding': '48px 50px 48px 50px',
    'general-title_bg_gradient': '0deg|#FAF7F2 30%|#FAF7F2 100%',
    'general-title_decoration_outline_color': NONE,
    'breadcrumbs_bg_color': NONE, 'breadcrumbs_border_color': NONE, 'breadcrumbs_border_width': '0px',
    # ── Khung, nền, thẻ ──
    'general-bg_image': {**o['general-bg_image'], 'image': ''},  # bỏ ảnh chấm halftone ở hai bên nội dung
    'general-border_radius': '2px',
    'general-content_boxes_bg_color': WHITE, 'general-content_boxes_decoration': 'outline',
    'general-content_boxes_decoration_outline_color': HAIR,
    'general-page_content_margin': '64px 50px 96px 50px', 'general-page_content_mobile_margin': '48px 16px 48px 16px',
    'general-accent_bg_color_gradient': RED_GRAD,
    'general-fullscreen_overlay_gradient': '135deg|#1A1A1A 30%|#1A1A1A 100%',
    # ── Nút (S/M/L): chính đỏ, chữ trắng, bo 2, cao ≥ 48 cho L/M ──
    'buttons-color': RED, 'buttons-color_gradient': RED_GRAD, 'buttons-hover_color_gradient': '135deg|#9E1F26 30%|#9E1F26 100%',
    'buttons-l_padding': '14px 28px 14px 28px', 'buttons-m_padding': '12px 24px 12px 24px', 'buttons-m-min-height': '48px',
    'buttons-border-color': RED, 'buttons-hover-border-color': RED_H,
    # ── Ô nhập + thông báo form (CF7 + The7) ──
    'input_height': '48px', 'input_color': INK, 'input_bg_color': WHITE, 'input_border_color': HAIR2,
    'input_border_radius': '2px', 'input_padding': '12px 16px 12px 16px',
    'custom_success_messages': 'Cảm ơn anh/chị, Velis Realty đã nhận được thông tin và sẽ liên hệ sớm.',
    'custom_error_messages': 'Chưa gửi được. Anh/chị vui lòng thử lại hoặc gọi 0911 237 979.',
    'custom_error_messages_validation': 'Một vài thông tin chưa đúng. Anh/chị vui lòng kiểm tra lại.',
    # ── Sidebar bài viết: nền ngà, chữ đạt tương phản, dính khi cuộn ──
    'sidebar-bg_color': CANVAS, 'sidebar-headers_color': INK, 'sidebar-primary_text_color': MUTED,
    'sidebar-decoration_outline_color': HAIR, 'sidebar-floating': True, 'sidebar-distance_to_content': '48px',
    # ── Footer tối + kẻ champagne 1 px; bottom bar cùng nền ──
    'footer-bg_color': INK, 'footer-decoration': 'outline', 'footer-decoration_outline_color': CHAMP,
    'footer-decoration-line_size': '1px', 'footer-headers_color': WHITE, 'footer-primary_text_color': ON_DARK_M,
    'footer-accent_text_color': ERR_DARK,
    'footer-padding': '64px 50px 32px 50px', 'footer-mobile_padding': '48px 16px 24px 16px',
    # ── Header / menu: các màu ẩn (lộ khi đổi kiểu) về token ──
    'header-menu-hover-font-color': RED, 'header-menu-dividers-color': HAIR,
    'header-menu-decoration-other-active-color': CANVAS, 'header-menu-decoration-other-hover-color': CANVAS,
    'header-menu-decoration-other-active-line-color': HAIR, 'header-menu-decoration-other-hover-line-color': HAIR,
    'header-menu-submenu-active-font-color': RED, 'header-menu-submenu-hover-font-color': RED,
    'header-mega-menu-desc-font-color': MUTED, 'header-mega-menu-title-font-color': INK, 'header-mega-menu-widget-font-color': INK,
    'header-mega-menu-widget-title-color': INK, 'header-mega-menu-title-hover-font-color': RED,
    'header-mega-menu-title-active_item-font-color': RED,
    'header-floating_navigation-font-color': MUTED, 'header-floating_navigation-hover-font-color': RED,
    'header-floating_navigation-active_item-font-color': RED,
    'header-floating_microwidgets-font-color': INK, 'header-floating_microwidgets-icon-color': INK,
    'header-mobile-menu-font-hover-color': RED, 'header-mobile-menu-dividers-color': HAIR,
    'header-mobile-menu_icon-caption_color-hover': RED, 'header-mobile-menu_icon-color-hover': RED,
    'header-mobile-microwidgets-font-color': INK, 'menu-mobile-microwidgets-font-color': INK,
    'header-mixed-decoration-color': HAIR, 'header-mixed-sticky-bg-color': INK, 'header-classic-menu-bg-color': INK,
    'header-transparent_bg_color': 'rgba(26,26,26,0.5)', 'top_bar-bg-color': INK,
    'header-elements-soc_icons-bg-color': INK, 'header-elements-soc_icons-hover-bg-color': RED,
    'microwidgets-search_bg-color': WHITE, 'microwidgets-search_bg-border-color': HAIR2, 'microwidgets-search_font-color': MUTED,
    # ── Ảnh hover: lớp đen mờ thay xanh ──
    'image_hover-color': 'rgba(17,17,17,0.15)', 'image_hover-color_gradient': '135deg|rgba(17,17,17,0.15) 30%|rgba(17,17,17,0.15) 100%',
    'image_hover-project_rollover_color': 'rgba(17,17,17,0.6)', 'image_hover-project_rollover_color_gradient': INK_VEIL,
    # ── Stripes (dải nền dựng sẵn, đang tắt; để đúng bảng màu nếu bật) ──
    'stripes-stripe_1_color': CANVAS, 'stripes-stripe_1_headers_color': INK, 'stripes-stripe_1_text_color': INK,
    'stripes-stripe_1_content_boxes_bg_color': WHITE, 'stripes-stripe_1_content_boxes_decoration_outline_color': HAIR,
    'stripes-stripe_1_outline_color': HAIR,
    'stripes-stripe_2_color': INK, 'stripes-stripe_2_headers_color': WHITE, 'stripes-stripe_2_text_color': ON_DARK_M,
    'stripes-stripe_2_content_boxes_bg_color': '#111111', 'stripes-stripe_2_content_boxes_decoration_outline_color': CHAMP,
    'stripes-stripe_2_outline_color': CHAMP,
    'stripes-stripe_3_color': CHAMP_SOFT, 'stripes-stripe_3_headers_color': INK, 'stripes-stripe_3_text_color': INK,
    'stripes-stripe_3_content_boxes_bg_color': WHITE, 'stripes-stripe_3_content_boxes_decoration_outline_color': HAIR,
    'stripes-stripe_3_outline_color': HAIR,
    # ── Branding: favicon do WordPress Site Icon lo (đủ cỡ 32/180/192/512); thẻ OG do Rank Math lo ──
    'general-favicon': '', 'general-favicon_hd': '',
    'the7_opengraph_tags': '0',
    # ── Custom CSS cũ "velis-ux": đã gộp vào velis.css của theme con (một nơi CSS) ──
    'general-custom_css': '/* Trống có chủ đích: CSS của Velis nằm trong theme con (velis.css). Màu, chữ, nút, ô nhập, footer: các mục Theme Options. */',
}
# mọi gradient còn lại (nút header, menu, mega menu, overlay) về đỏ Velis – không còn xanh/tím/vàng chanh
for k, v in o.items():
    if k not in C and isinstance(v, str) and 'deg|' in v:
        C[k] = INK_VEIL if 'overlay' in k else RED_GRAD
    elif k not in C and isinstance(v, str) and v.lower() in ('#333333', '#000000', '#3c3e45', '#3b3f4a', '#0a0a0a'):
        C[k] = INK  # đen/xám lệch bảng ở các kiểu header không dùng

missing = [k for k in C if k not in o]
assert not missing, missing  # chỉ đổi khóa đã có
o.update(C)
left = sorted({c.upper() for v in o.values() if isinstance(v, str) for c in re.findall(r'#[0-9a-fA-F]{6}\b', v)})
json.dump(o, open('data/the7/options-buoc-6.json', 'w'), ensure_ascii=False)
print(len(C), 'khóa đổi; mã màu hex còn trong options:', ' '.join(left))
