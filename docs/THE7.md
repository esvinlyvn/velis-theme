# THE7.md – tính năng The7 Classic 14.5.1 kế thừa được (đọc trước khi sửa giao diện)

Nguyên tắc: **mọi thay đổi giao diện đi vào chỗ người dùng sửa được trong wp-admin** – The7 Theme Options, meta box The7 của
trang/bài, WPBakery (phần tử, mẫu, Design Options), Widget, Menu. `velis.css` của theme con chỉ dành cho việc The7 **không có**
(cột "CSS?" = có). Đọc DOM wp-admin staging ngày 2026-11-11 (chỉ đọc), kèm `data/the7/options-*.json` (954 khóa).
"Hiện tại" = giá trị trên staging **sau bước 6** (2026-11-11, `data/the7/options-buoc-6.json`). "Nên" = theo `DESIGN.md`.

Đường dẫn: **TO** = thanh quản trị → Theme Options (`admin.php?page=…`); **The7** = menu The7 Classic → Settings
(`the7-settings`); **WPB** = WPBakery Page Builder.

## 1. Bản đồ nhu cầu DESIGN.md → tính năng The7

### Màu, chữ, nút, ô nhập

| Nhu cầu | Nơi sửa (trang) | Khóa option | Hiện tại | Nên | CSS? |
|---|---|---|---|---|---|
| Màu nhấn (link, nút, active) | TO › General Appearance (`options-framework`) › Color accent | `general-accent_color_mode`, `general-accent_bg_color` | color, #B8282E | giữ | không |
| Gradient thừa (accent, loader, title) | cùng trang + Page Titles | `general-accent_bg_color_gradient`, `general-fullscreen_overlay_gradient`, `general-title_bg_gradient` | đỏ #B8282E→#9E1F26 / ngà / ink | giữ | không |
| Màu chữ tiêu đề / nội dung / phụ / link | TO › Typography (`of-fonts-menu`) › Font colors | `content-headers_color`, `content-primary_text_color`, `content-secondary_text_color`, `content-links_color` | #1A1A1A, #1A1A1A, #5C5C5C, #C42F35 | giữ | không |
| Font nội dung + 3 cỡ chữ | Typography › Basic font | `fonts-font_family`, `fonts-big_size`, `fonts-normal_size`, `fonts-small_size` | Be Vietnam Pro; 18/30, 16/25, 14/21 (19/32 từ 1600 px: `velis.css`) | giữ | không |
| H1–H6 (font, cỡ desktop/tablet/mobile, chữ hoa) | Typography › Headings | `fonts-h1-typography` … `fonts-h6-typography` (`responsive_font_size.{desktop,tablet,mobile}`), `fonts-headers-text-transform` | H1 56/36, H2 40/28, H3 22/22, H4 19 (có ô tablet); transform none | giữ | không |
| Widget (tiêu đề, nội dung, khoảng cách) | Typography › Widgets | `fonts-widget-title`, `fonts-widget-content`, `widget_gap` | 16/24, 15/24, 20 | giữ | không |
| Nút (3 cỡ: S/M/L) – màu, hover, chữ, bo góc, cao tối thiểu, bóng | TO › Buttons (`of-buttons-menu`) | `buttons-color_mode`, `buttons-hover_color(_mode)`, `buttons-text_color`, `buttons-{s,m,l}-typography`, `buttons-{s,m,l}_padding`, `buttons-{s,m,l}_border_radius`, `buttons-{s,m,l}-min-height`, `button-shadow(-hover)` | accent; hover #9E1F26; bo 2; L 48 đệm 14/28, M 48 đệm 12/24; màu/gradient phụ = đỏ | giữ | không |
| Nút phụ (viền đen, nền trong) | WPB phần tử **Button** `dt_default_button` (by Dream-Theme) – kiểu "Outline"/màu tùy chỉnh trong phần tử | – | – | dùng tùy chọn của phần tử | không |
| Ô nhập form (CF7 + The7) | TO › Contact Forms (`of-contact-menu`) | `input_height`, `input_color`, `input_bg_color`, `input_border_color`, `input_border_width`, `input_border_radius`, `input_padding` | 48, #1A1A1A, viền #C9C1B5, bo 2, đệm 12/16 | giữ | không |
| Thông báo form | Contact Forms › messages | `message_color`, `message_bg_color`, `custom_*_messages` | tiếng Việt | giữ | không |
| Bo góc chung (thẻ, khung) | General Appearance › Border radius | `general-border_radius` | 2px | giữ | không |
| Đường kẻ chia | General Appearance › Dividers | `dividers-color` | #E4DED5 | giữ | không |
| Ảnh hover | TO › Images Styling & Hovers (`of-imghoovers-menu`) | `image_hover-style`, `image_hover-color(_gradient)`, `image_hover-project_rollover_*` | none; lớp đen mờ rgba(17,17,17,.15/.6) | giữ | không |

### Bố cục, thẻ, section

| Nhu cầu | Nơi sửa | Khóa / thao tác | Hiện tại | Nên | CSS? |
|---|---|---|---|---|---|
| Bề rộng nội dung (khớp header) | TO › General Appearance › Layout | `general-content_width`, `general-layout` (wide/boxed) | 1300px, wide | 1200 (DESIGN content) hoặc giữ 1300 nếu khớp header | không |
| Lề trang trên/dưới, mobile | General Appearance › Main area | `general-page_content_margin`, `general-page_content_mobile_margin`, `general-switch_content_paddings` | 64/96 (ngang 50), mobile 48/48 (ngang 16) | giữ | không |
| Lề riêng 1 trang | Meta box **Page Paddings / Page Mobile Paddings** | `_dt_page_overrides_*_margin`, `_dt_mobile_page_padding_*` | trống | dùng cho trang có hero sát header | không |
| Nền thẻ/khung nội dung ("Content boxes" – thẻ blog, bài liên quan, khung widget) | General Appearance › Content boxes | `general-content_boxes_bg_color`, `general-content_boxes_decoration` (none/shadow/outline), `…_outline_color` | #FFFFFF, outline, #E4DED5 | giữ | chỉ bóng khi hover (The7 không có) |
| Nền trang | General Appearance › Background | `general-bg_color`, `general-bg_image` | trắng, không ảnh nền | giữ | không |
| Section nền ngà / tối / champagne | WPB **Row → Design Options** (màu nền, padding) + WPB **Color Picker Settings** (`vc-color-picker`, 8 ô màu dùng chung) | `wpb_js_vc_pickr_color_1..8` | #1A1A1A, #FFFFFF, #FAF7F2, #F3ECDF, #B8282E, #9E1F26, #B08D57, #5C5C5C | 8 ô = #1A1A1A, #FFFFFF, #FAF7F2, #F2EEE8, #B8282E, #9E1F26, #B08D57, #5C5C5C → người sửa chỉ chọn được màu thương hiệu | không |
| "Stripes" (3 kiểu dải nền dựng sẵn của The7) | The7 › Settings › Legacy › **The7 rows** | `the7_dashboard_settings[rows]` + khóa `stripes-stripe_{1,2,3}_*` | tắt; khóa màu đã về token (1 ngà, 2 tối, 3 champagne nhạt) | **không bật** – tính năng cũ; dùng Row Design Options + bảng màu ở trên | không |
| Khoảng cách cột WPB, breakpoint | WPB › Design options (`vc-color`) | `wpb_js_gutter`, `wpb_js_responsive_*` | gutter 50, 768/992/1200 | gutter 24 (DESIGN gutter); breakpoint giữ | không |
| Nhịp section 96/64/48 | Row Design Options (padding) trong **mẫu WPB** | – | class `velis-section` trong 3 mẫu + mọi trang dự án/chủ đầu tư | giữ | tablet/mobile khác nhau → WPB không có padding theo thiết bị: CSS 1 lớp `.velis-section` |

### Blog, danh mục, trang hệ thống

| Nhu cầu | Nơi sửa | Khóa / thao tác | Hiện tại | Nên | CSS? |
|---|---|---|---|---|---|
| Trang danh mục blog dựng bằng WPBakery | TO › **Archives and 404** (`of-archives-templates-menu`) | `template_page_id_blog_category` (+ `_full_content`) | 20733 "Mẫu trang chuyên mục blog" | giữ; sửa bố cục trong trang 20733 | không |
| Trang thẻ, tác giả, ngày, tìm kiếm | cùng trang | `template_page_id_blog_tags`, `_author`, `_date`, `_search` | 0 (mặc định The7) | gán trang mẫu (có thể dùng lại 20733 cho thẻ/tìm kiếm) | không |
| Trang 404 | cùng trang › 404 page | `template_page_id_404` | 20536 | giữ, sửa nội dung trang 20536 | không |
| Tiêu đề lưu trữ "Danh mục: …" | Archives › Archive title | `show_static_part_of_archive_title` | 0 | giữ | không |
| Lưới / danh sách bài | WPB **Blog Masonry and Grid** `dt_blog_masonry`, **Blog List** `dt_blog_list`, **Blog Carousel**, **Blog Mini** (by Dream-Theme) – mỗi phần tử có kiểu thẻ, số bài, phân trang, ảnh tỉ lệ | trong phần tử | – | dùng phần tử, **không** dùng "(old)" | không |
| Lọc danh mục (tab) | TO › Blog (`of-blog-and-portfolio-menu`) › Categorization | `general-filter_style`, `filter-typography`, `general-filter-*` | material, 600/14 | giữ | không |
| Bài viết: ngày, tác giả, danh mục, bài liên quan, nút trước/sau, ảnh đại diện | TO › Blog › Blog | `general-blog_meta_*`, `general-show_rel_posts`, `general-rel_posts_max`, `general-rel_posts_head_title`, `general-next_prev_in_blog`, `blog-thumbnail_*`, `post-show_fancy_*` | meta ngày/tác giả/danh mục; liên quan 6 "Bài viết nên xem" | giữ | không |
| Bài liên quan theo bài | Meta box **Post Options** | `_dt_post_options_related_mode` (same/custom + danh mục), `_dt_post_options_hide_thumbnail` | same / custom 44 | – | không |
| Nút chia sẻ | TO › Share Buttons (`of-likebuttons-menu`) | `social_buttons-post`, `…-button_title` | không chọn mạng nào; chữ tiếng Anh | Facebook + Zalo/Copy, "Chia sẻ bài viết" | không |

### Header, menu, tiêu đề trang, footer

| Nhu cầu | Nơi sửa | Khóa / thao tác | Hiện tại | Nên | CSS? |
|---|---|---|---|---|---|
| Kiểu header | TO › Top Bar & Header (`of-header-menu`) › Layout | `header-layout` (inline), `header-inline-height`, `header-inline-menu-position`, `header-inline-is_fullwidth` | inline 80, menu giữa | giữ | không |
| Điện thoại, nút "Nhận tư vấn" | Header › **Microwidgets** (kéo thả vị trí) | `header-inline-elements.near_menu_right`, `header-elements-contact-phone-*`, `header-elements-button-1-*` (caption, url, màu, cỡ) | phone + Button 1 /lien-he/ | giữ; 1 cách viết số "0911 237 979" | không |
| Microwidget trên mobile | cùng mục, từng microwidget | `…-first-header-switch` / `…-second-header-switch` (near_logo / in_menu / hidden) | phone: near_logo (tablet), in_menu (phone) | phone near_logo cả 2 | không |
| Header dính khi cuộn | Header › Floating header | `header-show_floating_navigation`, `header-floating_navigation-height`, `…-style`, `…-show_after` | bật, 72, fade, 150 | giữ | không |
| Header mobile (breakpoint, cao, nền) | Header › Mobile header / Mobile menu | `header-mobile-{first,second}_switch-*`, `header-mobile-header-bg-color`, `header-mobile-decoration` | 1000/778, 70, shadow | giữ | không |
| Menu (font, màu, gạch dưới active), submenu, mega menu | Header › Menu / Submenu; The7 › Settings › **Enable Mega Menu** (bật) + trường mega trong Giao diện › Menu | `menu-*`, `header-menu-*`, `submenu-*` | – | soát màu hover = đỏ | không |
| Logo (header, mobile, dính, footer) | TO › **Branding** (`of-branding-menu`) | `header-logo_regular`, `header-style-mobile-logo_regular`, `header-style-floating-logo_regular`, `bottom_bar-logo_regular` | 20682 / 20700 / (main) / 20684 | giữ | không |
| Favicon, icon thiết bị | Branding › Favicon / Icons for handheld devices – **hoặc** WordPress › Sửa giao diện › Site Icon (ưu tiên, sinh đủ cỡ) | `general-favicon`, `general-handheld_icon-*` | Site Icon 20772 (dấu V 512); `general-favicon` trống | giữ | không |
| Tiêu đề trang (dải H1 + breadcrumbs) | TO › **Page Titles** (`of-contentarea-menu`) | `general-title_align`, `general-title_height`, `page_title-padding`, `general-title_bg_color`, `general-title_decoration*`, `general-page-title-typography`, `general-responsive_title_*` | trái, min 160, đệm 48, nền #FAF7F2; 56/62, mobile 36/40 | giữ | không |
| Ẩn/hiện dải tiêu đề theo trang | Meta box **Page Header Options** | `_dt_header_title` (enabled/disabled/fancy/slideshow) | bài 20330 enabled; trang dự án disabled (hero WPB) | 1 quy tắc: trang có hero WPB → disabled; còn lại enabled | không |
| Breadcrumbs | Page Titles › Breadcrumbs; phần tử WPB **Breadcrumbs** `dt_breadcrumbs` để đặt trong hero | `general-show_breadcrumbs`, `breadcrumbs-typography`, `general-breadcrumbs_color`, `breadcrumbs_*` | bật, 14, #5C5C5C, nền/viền trong suốt | giữ | không |
| Sidebar (cột phải bài viết) | TO › **Sidebar** (`of-sidebar-menu`) + meta **Sidebar Options** | `sidebar-width`, `sidebar-distance_to_content`, `sidebar-visual_style`, `sidebar-bg_color`, `sidebar-floating` (**dính**), `sidebar-headers_color`, `sidebar-primary_text_color`, `sidebar-responsiveness`; `_dt_sidebar_position`, `_dt_sidebar_widgetarea_id` | 360, nền #FAF7F2, dính, chữ #5C5C5C, tiêu đề #1A1A1A | giữ | không |
| Nội dung sidebar | Giao diện › Widget › **Default Sidebar** | widget: HTML "Nhận tư vấn dự án", Mục lục (Easy TOC), DT-Blog posts | có | giữ, thêm/bớt bằng kéo thả | không |
| Thêm vùng widget riêng (vd sidebar dự án) | TO › **Widget Areas** (`of-widgetareas-menu`) | `widgetareas` | Default Sidebar, Default Footer | thêm "Sidebar dự án" nếu cần | không |
| Footer (nền, chữ, kẻ trên, số cột) | TO › **Footer & Bottom Bar** (`of-footer-menu`) › Footer | `footer-style`, `footer-bg_color`, `footer-decoration` (none/outline), `footer-decoration_outline_color`, `footer-decoration-line_size`, `footer-headers_color`, `footer-primary_text_color`, `footer-accent_text_color`, `footer-layout`, `footer-padding` | #1A1A1A, outline 1px #B08D57, tiêu đề #FFFFFF, chữ #B9B9B9, accent #F2B8B5, 1/2+1/2 (2 widget) | giữ | không |
| Nội dung footer | Widget › **Default Footer**; meta **Footer Options** (`_dt_footer_show`, `_dt_footer_widgetarea_id`) | Văn bản địa chỉ, HTML liên hệ | – | sửa bằng widget | không |
| Bottom bar (logo trắng, bản quyền) | Footer & Bottom Bar › Bottom bar | `bottom_bar-enabled`, `bottom_bar-bg_color`, `bottom_bar-color`, `bottom_bar-layout`, `bottom_bar-text` (`[dt_year]`) | #1A1A1A, #B9B9B9, logo_left | giữ | không |

### Thành phần nội dung (WPBakery)

| Nhu cầu | Phần tử nên dùng (WPB › Add Element) | Ghi chú |
|---|---|---|
| Tiêu đề section (eyebrow → H2 → dẫn) | **Fancy Titles** `dt_fancy_title` hoặc Text Block + thẻ H2 | không dùng `ultimate_heading` (font/màu riêng) |
| Đường kẻ champagne 48 px | **Fancy Separators** `dt_fancy_separator` (màu, độ dày, rộng) | thay đường kẻ chấm hồng |
| Nút trong nội dung | **Button** `dt_default_button` | ăn theo TO › Buttons; không dùng `ult_buttons`, `dt_button (old)` |
| FAQ | **Toggle** `vc_toggle` (mẫu Bước 2 đang dùng) hoặc **Accordion** `vc_accordion` (by Dream-Theme) | |
| Thẻ dự án / chủ đầu tư | **Fancy Media** `dt_fancy_image` + Text Block, hoặc **Multipurpose Carousel** `dt_carousel` | thẻ ăn theo Content boxes |
| Danh sách có biểu tượng, thông số | **Fancy List** `dt_vc_list`, **Icon with text** `dt_icon_text` | |
| Bảng giá / thông số | bảng HTML trong Text Block (TinyMCE Advanced có công cụ bảng) | màu bảng: CSS 1 lớp nếu cần |
| Slider ảnh | **Media Gallery Carousel** `dt_media_gallery_carousel` | không dùng Slideshow (CPT không có, xem §3) |
| Form | CF7 (đang dùng) – ăn theo TO › Contact Forms | |
| Mẫu trang mặc định cho bài/trang mới | WPB › General Settings › **Default template** (`wpb_js_default_template_post_type[post]`, `[page]`) | gán "Velis – Bài viết" cho post → bài mới mở ra đã có bố cục |
| Áp thiết lập meta box hàng loạt | Meta box **Settings Presets** (`the7-post-meta-presets-box`) | lưu bộ thiết lập sidebar/footer/header của 1 bài → áp cho bài khác |

### Việc The7 không có (chỉ ở đây mới viết CSS/PHP)

| Nhu cầu | Lý do | Cách tối thiểu |
|---|---|---|
| Thanh CTA dính đáy mobile (Gọi · Zalo · Nhận tư vấn) | The7 Classic không có; Buttonizer đã tắt (2026-11-12) | **Đã làm (người dùng chọn b):** theme con 1.3.0 `functions.php` + `velis.css` (`.velis-cta-bar`); số gọi, link Zalo, link tư vấn sửa ở Giao diện → Tùy biến → "Thanh liên hệ (điện thoại)". Không dùng class `velis-cta` (đó là hàng liên hệ trong mẫu WPBakery) |
| Bóng thẻ chỉ khi hover | Content boxes chỉ có none/shadow/outline cố định | 1 quy tắc `:hover` |
| Padding section khác nhau theo thiết bị | Row Design Options chỉ 1 giá trị | lớp `.velis-section` |
| Ảnh OG mặc định | Không phải việc The7 – dùng **Rank Math** › Tiêu đề & mô tả › Ảnh OG mặc định; tắt `the7_opengraph_tags` (TO › Advanced) để không trùng thẻ OG | không code |

## 2. Không làm (The7 đã có)

- Không viết CSS cho màu chữ, link, nút, ô nhập, footer, sidebar, tiêu đề trang, breadcrumbs, font, cỡ H1–H6 – tất cả có khóa ở §1.
- Không viết PHP template cho trang danh mục/thẻ/tìm kiếm/404 – dùng `template_page_id_*`.
- Không dựng bố cục bài/trang trong PHP – dùng mẫu WPB + Default template.
- Không viết CSS bóp chiều rộng bài viết – dùng sidebar The7 (`_dt_sidebar_position=right`, `sidebar-floating`).
- Không tự làm header dính, menu mobile, mega menu – Floating header, Mobile menu, Enable Mega Menu.
- Không thêm favicon bằng code – Site Icon của WordPress.

## 3. Module The7 bật mà không dùng (đề xuất tắt ở The7 › Settings)

| Module | Khóa `the7_dashboard_settings[…]` | Hiện tại | Ghi chú |
|---|---|---|---|
| Portfolio, Testimonials, Team, Photo Albums, Slideshows | `portfolio`, `testimonials`, `team`, `albums`, `slideshow` | **tắt** (bước 6) | Không có menu quản trị; `edit.php?post_type=dt_portfolio…` trả lỗi → CPT không đăng ký (thiếu plugin The7 Elements/Core). Tắt để gọn, không mất dữ liệu |
| Deprecated Mega-Menu Settings | `deprecated_mega_menu_settings` | bật | Kiểm menu không dùng trường mega cũ rồi tắt |
| Microsite, Slideshow Options, Fancy Title, Microsite Logo (meta box) | – | hiện trên mọi trang/bài | Ẩn bằng Screen Options của người dùng; không dùng |
| Nhóm "The7 Old" trong WPB (`dt_banner`, `dt_blog_posts`, `dt_button`, `dt_gap`, `dt_teaser`, `dt_quote`, `dt_call_to_action`, `dt_blog_scroller`) | – | hiện | Không dùng trong mẫu mới; nội dung cũ còn shortcode nào thì thay dần |
| WPB Module Manager: AI, SEO, Automapper… | `wpb_js_modules` | bật hết | không ảnh hưởng giao diện; để nguyên |

## 4. Bẫy

- **Options lưu theo theme**: theme con có bộ Theme Options riêng (`optionsframework` theo tên theme). Đổi theme = mất cài đặt; bộ gốc ở `data/the7/options-truoc.json`.
- **Nhập options ghi đè cả bộ** (Export/Import): chỉ nhập khi đã xuất bộ hiện tại; sửa lẻ thì sửa đúng khóa (công cụ `tools/the7_options_buoc*.py` chỉ đổi khóa liệt kê).
- **Custom CSS cũ "velis-ux"** – đã gộp vào `velis.css` ở bước 6, Theme Options → Custom CSS để trống, đừng viết thêm vào đó. Trước đó (`general-custom_css`, 4,6 KB: UX-01, 03, 04, 07, 08, 15, 16, 18, 21) và **Custom JS** (`general-tracking_code`: preload font UX-16) ở TO › Advanced – nguồn của nhiều lệch chuẩn (UX-08 chữ #6E6F75, UX-18 bóp 740 px). Gộp phần còn cần vào `velis.css`, xóa phần The7 đã có option.
- **FVM gộp CSS/JS** (`advanced-fvm_enable_integration`): sau mọi thay đổi options/CSS phải xóa cache FVM + LiteSpeed (thanh quản trị › FVM › Clear Everything; LiteSpeed › Xóa tất cả). FVM còn **hoãn JS plugin tới khi chạm/cuộn và bỏ qua trình duyệt "Headless/Lighthouse"** → điểm Lighthouse cao hơn thực tế.
- **Lưu trang LiteSpeed có thể ghi `.htaccess`** – chỉ purge (CLAUDE.md).
- **Preset/skin** `skin15r`: chọn lại skin ở TO › Skins sẽ ghi đè hàng trăm khóa – không bấm.
- **Mở `post-new.php`** tạo bản nháp tự động (WordPress tự dọn sau 7 ngày) – ghi log nếu lỡ mở trên staging.
- The7 › Settings › **Disable The7 15 upgrade checks** đang tắt → thông báo nâng cấp 15 vẫn hiện; bật nếu người dùng muốn ẩn (không đổi giao diện site).
- Dải tiêu đề The7 (Page Titles) và hero trong mẫu WPB là **2 nguồn H1** – mỗi trang chỉ bật 1 (meta `_dt_header_title`).
