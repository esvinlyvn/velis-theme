# Kiểm kê UI/UX và branding trên The7 so với DESIGN.md (chỉ đọc)

**Ngày đo:** 2026-11-11.

**Cách đo:**
- Trang: staging.velisrealty.vn, vào bằng quyền khách (có mật khẩu xem).
- Công cụ: Playwright Chromium. UA Chrome desktop ở khung 1366 px, UA Android ở khung 390 px; cuộn hết trang để The7 nạp JS của plugin.
- Phạm vi: 17 trang × 2 khung, lấy computed style của mọi phần tử đang hiển thị (thanh quản trị bỏ qua).
- Không ghi gì lên staging.

**17 trang đã đo:**
- Trang chủ.
- Blog: /blog/, /blog-bds/, danh mục Palm City.
- 3 bài viết: Dòng vốn, Hướng Việt, Tiêu chuẩn bàn giao.
- 3 dự án:
  - Persa Place (đã áp mẫu);
  - The Global City, Palm River (chưa áp mẫu).
- 2 chủ đầu tư:
  - Gamuda Land (đã áp mẫu);
  - Vinhomes (chưa áp mẫu).
- Giới thiệu, Tuyển dụng, Liên hệ, 404, tìm kiếm.

**Dữ liệu:**
- Dữ liệu thô: `data/the7/ui-kiem-ke.json`.
- Ảnh bảng màu: `screenshots/the7/ui-kiem-ke/bang-mau-dang-dung-vs-design.png`.

**Chuẩn đối chiếu:**
- `DESIGN.md`, gồm token ở front-matter và các mục 1.2–1.7, Typography, Components, Inputs, Footer.
- `docs/BRAND.md`.

## Tóm tắt

| Chỉ số | Hiện tại | Mục tiêu |
|---|---|---|
| Màu đang hiển thị (chữ, nền, viền) | 33 giá trị | Chỉ token DESIGN.md |
| Màu ngoài bảng DESIGN.md | **25** (ΔE 0,4–82) | 0 |
| Font đang render | Be Vietnam Pro, Playfair, **Roboto, Arial**, Font Awesome 5 **và** 7, icomoon | 2 font chữ + 1 bộ icon |
| Kiểu đầu trang (cách hiện H1) | **3** kiểu khác nhau | 1 |
| Kiểu thẻ (dự án, bài, chủ đầu tư) | Nền xám #F5F5F5 + bóng, góc 0, tiêu đề 600/700 lẫn lộn | Thẻ trắng, viền hairline, góc 2 px, bóng chỉ khi rê chuột |
| Tiêu đề gõ CHỮ HOA trong nội dung | 38 (6 trang) | 0 |
| Tiêu đề Viết Hoa Từng Chữ | 15 (7 trang) | 0 |
| Thuộc tính style inline có màu hoặc font trong nội dung | 78 (9 trang; 6 trong số đó là icon mục lục Easy TOC) | 0 |

**Nhận xét chính:** nhóm màu chính đã đúng trong Theme Options: đỏ, chữ, link, nền tiêu đề trang, bottom bar. Phần lệch nằm ở 4 nơi:
- Theme Options **chưa đổi** ở bước 1: footer, thẻ, ô nhập, sidebar, các "stripe", và các màu ẩn của The7.
- Custom CSS cũ (velis-ux) còn mã màu riêng.
- Nội dung WPBakery có style dán thẳng vào.
- Buttonizer.

## 1. Lệch chuẩn, xếp theo mức ảnh hưởng thị giác

| # | Thành phần | Hiện tại (đo) | Chuẩn DESIGN.md | Trang bị | Nguồn | Sửa đúng chỗ |
|---|---|---|---|---|---|---|
| 1 | **Đầu trang (H1)** | 3 kiểu (chi tiết ngay dưới bảng) | 1 kiểu: H1 56/36, căn trái theo lưới, nền ngà | 17 | The7 Page Title + nội dung | Mục 1.1 dưới bảng |
| 2 | **Footer** | Nền **#F4F4F4**; tiêu đề #0A0A0A; chữ #6D6D6D; ô nhập góc 0, viền rgba(51,51,51,.12) | Nền #1A1A1A + **đường champagne 1 px** ở mép trên; chữ #FFFFFF / #B9B9B9; khối form "Nhận tư vấn" nền #F3ECDF, form trên thẻ trắng | 17 | Theme Options (bước 1 chưa đổi) | Mục 1.2 dưới bảng |
| 3 | **Thẻ** (lưới bài, "Bài viết nên xem", bài phân tích ở trang chủ, danh sách trang chủ đầu tư) | Nền **#F5F5F5** + bóng `0 6px 18px rgba(0,0,0,.1)` thường trực, góc 0 | Nền #FFFFFF, viền 1 px #E4DED5, góc 2 px; bóng `card-hover` chỉ khi rê chuột | 7 | Theme Options | Mục 1.3 dưới bảng |
| 4 | **Tiêu đề CHỮ HOA và Viết Hoa Từng Chữ** | 38 tiêu đề CHỮ HOA (trang chủ 6, Global City 12, Palm River 13, Vinhomes 5, Giới thiệu 1, Liên hệ 1) + 15 Viết Hoa Từng Chữ; nút gõ hoa ("NHẬN TƯ VẤN", "GỌI 0911 237 979", "THI THỬ CHỨNG CHỈ MÔI GIỚI", "ỨNG TUYỂN NGAY", "GỬI") | Chữ thường kiểu câu; chữ hoa chỉ cho eyebrow (DESIGN dòng 173) | 7 | Gõ tay trong nội dung (`text-transform` = none) | Sửa nội dung khi áp mẫu; nhãn nút sửa trong từng phần tử |
| 5 | **Màu dán trong nội dung** | Chi tiết ngay dưới bảng | Chỉ token | 7 | Style inline trong WPBakery, Ultimate, HTML dán | Mục 1.5 dưới bảng |
| 6 | **Nút nổi Buttonizer** | Tròn (bo 30 %), nền #AE0003 và **#6272FF** (xanh), bóng đỏ; che chữ trên mobile | Thanh CTA dính đáy 64 px: Gọi · Zalo · Nhận tư vấn, nền trắng, bóng `sticky-cta` | 17 | Plugin Buttonizer | Mục 1.6 dưới bảng |
| 7 | **Cỡ chữ nội dung** | Đoạn văn, li 19/30 ở **cả 1366 lẫn 390 px**. Easy TOC: p 22,8 px/500, li 18,05 px | DESIGN 1.6 (2026-11-11): chữ nội dung 18 px, 19 px từ 1600 px. Token `body` 17/1,65; mobile theo `body` | 17 | Mục 1.7 dưới bảng | Mục 1.7 dưới bảng |
| 8 | **Chữ phụ** (meta bài, breadcrumb, nhãn) | **#6E6F75** (447 phần tử, 17 trang). Ngày ở "Bài viết nên xem" #1A1A1A với opacity .5 (≈ #8D8D8D, **≈ 3,3:1, không đạt 4,5:1**) | `body-muted` #5C5C5C | 17 | Custom CSS cũ UX-08 (`!important`); class `.text-secondary` của The7 | Mục 1.8 dưới bảng |
| 9 | **Ô nhập** (CF7 ở footer và Liên hệ, ô tìm 404) | Viền rgba(51,51,51,.12) ≈ #EBEBEB (**≈ 1,2:1**, không đạt 3:1); chữ #85868C; góc 0; cao 40 px | Viền `hairline-strong` #C9C1B5; chữ #1A1A1A; góc 2 px; cao ≥ 48 px; nhãn luôn hiện | 17 | Theme Options | Mục 1.9 dưới bảng |
| 10 | **Nhịp section** | Trang chưa áp mẫu: đệm hàng 0, khoảng cách do lề phần tử. Trang áp mẫu: 48 trên, 0 dưới | 96 desktop / 64 tablet / 48 mobile; đầu khối → nội dung 40 / 32 | 17 | Design Options của từng hàng | Mục 1.10 dưới bảng |
| 11 | **Hỏi đáp (vc_toggle)** | Tiêu đề 19 px/400; icon tròn xám #BABABA viền #ACACAC; Vinhomes nền #EFEFEF | Câu hỏi đậm 600 màu ink; icon mảnh; không khung xám | 5 | WPBakery Toggle (style mặc định) | Đổi style trong phần tử Toggle (trong mẫu) hoặc 1 quy tắc CSS |
| 12 | **Tiêu đề thẻ H3** | 600 và **700** lẫn lộn (Blog, Gamuda, Vinhomes, trang chủ); 19 px ở lưới bài, 22 px nơi khác; H3 mobile 20 px | H3 600, 22/22 px; tên thẻ dự án Playfair 600 22 px | 6 | Phần tử Blog/Post của The7; `fonts-h3-typography` | Font-weight trong cài đặt từng phần tử; H3 mobile 20 → 22 |
| 13 | **Eyebrow** (`.velis-eyebrow` ở mẫu Bước 2) | 14/20, chữ thường, không giãn chữ | 13 px 600, CHỮ HOA, giãn 0,12em, #5C5C5C | 2 | velis.css | Sửa 1 quy tắc trong velis.css |
| 14 | **Bảng thông số trên mobile** | Vẫn bảng 2 cột, cột nhãn 1–2 từ một dòng (Persa Place, Palm River) | Mobile thành danh sách thẻ nhãn – giá trị; đệm ô ≥ 16 px | 3 | Bảng HTML trong nội dung | CSS dạng xếp chồng cho bảng trong `.velis-specs` |
| 15 | **Đường kẻ dưới tiêu đề khối** | Không có; Ultimate có `ult-just-icon` | Gạch champagne 48 × 1 px dưới H2 khối | — | — | Thêm vào mẫu WPBakery (Separator 48 px #B08D57) |

**Chi tiết một số dòng trong bảng:**

**1.1 Đầu trang (dòng 1)**
- 3 kiểu đang có:
  - **a)** Dải tiêu đề The7: nền ngà, H1 **44 px**, mobile **28 px**, căn giữa, cao 125 px. Dùng ở bài viết, blog, danh mục, Giới thiệu, Tuyển dụng, Liên hệ, 404, tìm kiếm.
  - **b)** Hero WPBakery: H1 56 px, căn trái, nền ngà. Dùng ở 2 trang đã áp mẫu.
  - **c)** Không có dải: H1 56 px căn giữa, CHỮ HOA, ngay trong nội dung. Dùng ở trang chủ, 2 dự án và 1 chủ đầu tư chưa áp mẫu.
- Sửa:
  - `general-page-title-typography` 44/52 → 56/62;
  - `general-responsive_title_size` / `_line_height` 28/34 → 36/40;
  - `general-title_align` center → left;
  - trang chưa áp mẫu: áp mẫu (đang chờ duyệt).

**1.2 Footer (dòng 2)**
- `footer-bg_color` → #1A1A1A.
- `footer-headers_color` → #FFFFFF.
- `footer-primary_text_color` → #B9B9B9.
- `footer-decoration` → line, `footer-decoration_outline_color` → #B08D57. Giá trị hiện tại là **xanh lá** rgba(129,215,66,.96).
- Khối form: hàng WPBakery hoặc widget riêng.

**1.3 Thẻ (dòng 3)**
- `general-content_boxes_bg_color` → #FFFFFF.
- `general-content_boxes_decoration` shadow → outline, `general-content_boxes_decoration_outline_color` → #E4DED5.
- Góc 2 px và bóng khi rê chuột: CSS theme con (The7 không có khóa riêng cho thẻ).

**1.5 Màu dán trong nội dung (dòng 5)**
- Đường kẻ **hồng #F4524D**: 22 chỗ ở Global City, Palm River, Vinhomes.
- Băng **#E74C3C** chữ vàng **#FFFF8D** font **Roboto**: Palm River.
- Số đếm **#DD3333** font Roboto: trang chủ, Ultimate Counter.
- Khối Arial nền #F9F9F9, bo 8 px, tiêu đề **#2C3E50**: Liên hệ.
- Nền #EFEFEF: Hỏi đáp Vinhomes.
- Dải tối **#474545** ("Cơ hội nghề nghiệp") và nền **#EDEDED**: trang chủ.
- Màu icon #333333 ở 4 icon Giới thiệu.
- Sửa từng phần tử: chọn màu token, bỏ font Roboto. Tốt nhất làm khi áp mẫu cho trang đó.

**1.6 Nút nổi (dòng 6)**
- Kế hoạch đã chốt là tắt Buttonizer khi ra mắt. Khi đó **cần thứ thay thế**: The7 không có thanh CTA dính đáy, nên phải làm bằng Buttonizer đổi kiểu, hoặc 1 đoạn HTML + CSS trong theme con (cần duyệt).

**1.7 Cỡ chữ nội dung (dòng 7)**
- Nguồn:
  - The7 dùng `--the7-base-font-big` cho `body`, tức `fonts-big_size` 19/30, không phải `fonts-normal_size` 17/28;
  - Easy TOC có cỡ chữ riêng.
- Sửa:
  - `fonts-big_size` → 18/30;
  - `fonts-normal_size` → 16/25 (body-sm);
  - ≥ 1600 px: 19 px bằng 1 dòng CSS;
  - Easy TOC → Cài đặt → cỡ chữ 16 px, đậm 400.

**1.8 Chữ phụ (dòng 8)**
- The7 → Theme Options → Custom CSS: đổi #6e6f75 → #5C5C5C (4 chỗ), #b4b5bb → #5C5C5C.
- Đặt `.text-secondary` = #5C5C5C, không dùng opacity.

**1.9 Ô nhập (dòng 9)**
- `input_border_color` → #C9C1B5.
- `input_color` → #1A1A1A.
- `input_border_radius` → 2px.
- `input_height` → 48px.

**1.10 Nhịp section (dòng 10)**
- Trong mẫu WPBakery: gắn class `velis-section` cho hàng.
- Thêm 3 dòng CSS đệm 96/64/48. WPBakery Design Options không có đệm theo khung màn hình.

**Ngoài phạm vi kiểm kê này:** bóp ngang ở bài viết là do Custom CSS cũ **UX-18** ("khối chữ tối đa 740px, căn giữa"). Fork T7-5 đang xử lý. DESIGN.md (dòng 409) quy định bài viết dùng cột đọc 720 px + cột phải dính (mục lục, thẻ dự án, nút tư vấn), không phải cột giữa có lề trống.

## 2. Màu "ẩn" trong Theme Options: chưa hiện nhưng sẽ lộ khi dùng tính năng đó

Đổi luôn trong cùng đợt để không bị "chắp vá" lần sau. Giá trị lấy từ `data/the7/options-buoc-4.json`.

| Khóa | Giá trị hiện tại | Nên đặt |
|---|---|---|
| `buttons-color` (khi chế độ "màu") | #81d742 (xanh lá) | #B8282E |
| `buttons-color_gradient` / `buttons-hover_color_gradient` | hồng → cam | bỏ (chế độ accent / màu) |
| `sidebar-headers_color` / `sidebar-primary_text_color` / `sidebar-bg_color` | #333333 / #85868c / rgba(0,0,0,.04) | #1A1A1A / #5C5C5C / #FAF7F2 hoặc trong suốt. **Cần ngay nếu bài viết chuyển sang có cột phải.** |
| `stripes-stripe_1/2/3_*` (nền, tiêu đề, chữ, viền) | #f4f4f5, #23242a, #616267, viền #44bb70, #dd3333, #c1edaf… | stripe 1 = ngà #FAF7F2 / ink; stripe 2 = #1A1A1A / #FFFFFF; stripe 3 = #F3ECDF / ink |
| `general-content_boxes_bg_color` | #f5f5f5 | #FFFFFF (mục 1, dòng 3) |
| `header-menu-hover-font-color` | #3c3e45 (đang chạy chế độ accent nên hiện đỏ) | #B8282E |
| `header-menu-submenu-hover-font-gradient`, `header-mega-menu-*-gradient`, `header-menu-dividers-color` | gradient xanh lá, vàng, tím; #8224e3 | bỏ; #E4DED5 |
| `header-menu-decoration-other-*` | tím, đỏ nhạt | #E4DED5 / trong suốt |
| `header-mega-menu-*-font-color` | #3b3f4a | #1A1A1A |
| `image_hover-project_rollover_color` | rgba(53,130,222,.9) (xanh dương) | rgba(17,17,17,.6) hoặc tắt |
| `general-accent_bg_color_gradient`, `general-title_bg_gradient` | xanh ngọc | bỏ |
| `breadcrumbs_border_color` / `breadcrumbs_bg_color` | rgba(198,196,31,.2) (vàng chanh) | trong suốt |
| `general-title_decoration_outline_color` | rgba(30,115,190,0) | trong suốt (giữ) |
| `microwidgets-search_*` | #f4f4f4 / #e2e2e2 / #aaaaaa | #FFFFFF / #C9C1B5 / #5C5C5C |
| `header-mobile-menu_close_icon-color` / caption | #fff trên nền trắng | #1A1A1A |
| `top_bar-*`, `header-mixed-*`, `header-transparent_bg_color` (#eeee22) | không dùng | đặt về token, phòng khi bật |
| `footer-decoration_outline_color` | xanh lá | #B08D57 (mục 1, dòng 2) |
| `input_*` | mục 1, dòng 9 | mục 1, dòng 9 |

## 3. Ánh xạ token DESIGN.md → nơi đặt trong The7

| Token / thành phần | Giá trị | Đặt ở đâu | Trạng thái |
|---|---|---|---|
| ink | #1A1A1A | `content-headers_color`, `content-primary_text_color`, `general-title_color`, `header-menu-submenu-font-color`, `header-mobile-menu-font-color` | Đúng |
| body-muted | #5C5C5C | `content-secondary_text_color`, `header-menu-font-color`, `general-breadcrumbs_color`, Custom CSS (UX-08) | **Custom CSS còn #6E6F75** |
| canvas | #FAF7F2 | `general-title_bg_color`, `header-menu-submenu-hover-bg-color`, nền hàng WPBakery (mẫu) | Đúng; thêm stripe 1 |
| surface | #FFFFFF | `general-bg_color`, `header-bg-color`, `general-content_boxes_bg_color` | **Thẻ đang #F5F5F5** |
| surface-sunken | #F2EEE8 | Đầu bảng: CSS theme con (`.velis-specs th`); hộp công bố | Chưa dùng |
| surface-dark / footer | #111111 / #1A1A1A | `bottom_bar-bg_color` (đúng), `footer-bg_color` | **Footer đang #F4F4F4** |
| hairline | #E4DED5 | `dividers-color`, `header-decoration-color`, viền thẻ (`general-content_boxes_decoration_outline_color`) | Viền thẻ chưa đặt |
| hairline-strong | #C9C1B5 | `input_border_color` | **Chưa** |
| velis-red / hover | #B8282E / #9E1F26 | `general-accent_bg_color`, `buttons-hover_color`, `header-elements-button-1-hover-bg-color`, `general-spinner_color` | Đúng |
| red-link | #C42F35 | `content-links_color`, velis.css (link trong đoạn) | Đúng |
| champagne | #B08D57 | `general-title_decoration_line_color`, `footer-decoration_outline_color`, gạch 48 px trong mẫu | **Footer chưa; gạch chưa có** |
| champagne-soft | #F3ECDF | Nền khối "Nhận tư vấn" (hàng WPBakery), stripe 3 | Chưa dùng |
| on-dark-muted / error-on-dark | #B9B9B9 / #F2B8B5 | `bottom_bar-color`, `footer-primary_text_color`; velis.css (link footer khi rê chuột) | Bottom bar đúng, footer chưa |
| H1 56/36, H2 40/28, H3 22/22, H4 19 | — | `fonts-h1..h4-typography` | H1, H2, H4 đúng; **H3 mobile 20**; **tiêu đề trang 44/28** (`general-page-title-typography`, `general-responsive_title_*`) |
| Chữ nội dung 18 (19 từ 1600), caption 14 | — | `fonts-big_size` (body dùng), `fonts-normal_size`, `fonts-small_size` | **19 ở mọi khung** |
| Nút chính | đỏ đặc, chữ trắng 16/600, cao 48, góc 2 | `buttons-l-*` (đúng), `buttons-m-*` (44 px, dùng cho CF7 và nút header) | Gần đúng; nút header 43 px |
| Nút phụ (viền ink) | — | Không có trong Theme Options. Dùng WPBakery Button style "outline" màu custom #1A1A1A, hoặc class `velis-btn-secondary` + CSS | Chưa có |
| Bo góc | 2 px nút, thẻ, ô nhập; 0 ảnh lớn | `buttons-*_border_radius` (đúng), `input_border_radius` (0), `general-border_radius` (0) | **Ô nhập 0**; thẻ cần CSS |
| Bóng | Chỉ `card-hover`, `sticky-cta` | `general-content_boxes_decoration` (shadow → outline); `button-shadow` trong suốt (đúng) | **Thẻ có bóng thường trực** |
| Khoảng section 96/64/48 | — | Class hàng `velis-section` + CSS (WPBakery không có đệm theo khung) | Chưa có |
| Eyebrow | 13/600/uppercase/.12em | velis.css `.velis-eyebrow` | **Lệch** |
| Logo | header 44, mobile 36, footer trắng 40 | `header-logo_*`, `header-style-mobile-logo_*`, `bottom_bar-logo_*` | Đúng |

## 4. Branding (BRAND.md)

| Mục | Hiện tại | Vấn đề | Đề xuất |
|---|---|---|---|
| Logo header, mobile, footer | PNG mới (velis-logo-44/36, velis-logo-trang-40), alt "Velis Realty" | Đạt | — |
| Logo header dính khi cuộn | Chưa đo | — | Kiểm ở đợt sửa |
| Favicon / site icon | `/2026/03/Logo-Velis-Realty-28.png` 28×28: **cả logo + chữ "VELIS" thu vào 28 px**, không đọc được. Không có bản 512, apple-touch-icon; `general-favicon_hd` trống | Mờ trên tab và màn hình chính điện thoại | Chỉ dấu "V" (đỏ + vàng logo gốc) từ `assets/brand/svg`, PNG 512 → WordPress Site Icon (Tùy biến → Nhận dạng site) + `general-favicon`/`_hd` |
| Ảnh OG mặc định (Rank Math) | `velis-realty.webp` 1200×628, nền đỏ gradient sáng + logo vàng dập nổi | Gradient đỏ không thuộc bảng (#B8282E); trùng ảnh khối đỏ lớn ở trang chủ | Làm ảnh OG 1200×630 mới: nền ngà hoặc ink, logo chuẩn, khẩu hiệu "Hành trình vươn tới thịnh vượng" (chờ chủ site duyệt câu chữ) |
| theme-color, og:site_name | #B8282E, "Velis Realty" | Đạt | — |
| Định dạng số điện thoại | Header "0911 237 979"; Liên hệ "091 123 7979" và "0911237979"; Giới thiệu "0911237979" | 3 cách viết | Thống nhất "0911 237 979" (sửa nội dung) |
| Chữ trên nút / CTA | "Nhận tư vấn" (header, mẫu) và "NHẬN TƯ VẤN", "GỬI", "ỨNG TUYỂN NGAY" (gõ hoa); Palm River "Nhận Booking ưu tiên…" | Lẫn lộn | Chữ thường kiểu câu; một câu CTA chính "Nhận tư vấn" |
| Khối "VELIS" đỏ lớn ở trang chủ | Ảnh logo trên nền đỏ gradient, chiếm khoảng 1 màn hình | Một điểm nhìn nặng không mang thông tin (DESIGN 1.4) | Đề xuất bỏ hoặc thay ảnh dự án thật (chờ duyệt) |
| Nút nổi | Buttonizer xanh #6272FF + đỏ #AE0003, tròn | Sai bảng màu, che chữ | Mục 1, dòng 6 |
| Trang 404 | Dải tiêu đề The7 + ô tìm; nút tìm **Arial, bo 4 px** | Lệch font, bo góc | Theo chuẩn nút / ô nhập ở mục 1, dòng 9 |
| Font thừa | Roboto (inline), Arial (inline Liên hệ, nút 404), Font Awesome **5 và 7** cùng nạp | Thêm request, lệch chữ | Bỏ inline; tắt bộ icon không dùng (đo lại sau) |

## 5. Thứ tự sửa đề xuất (một đợt, không chắp vá)

1. **Theme Options một lần, cả bộ:** mục 2 và các khóa ở mục 1 (footer, thẻ, ô nhập, chữ, tiêu đề trang). Sinh bằng `tools/the7_options_buoc1.py` (thêm khóa), chỉ đổi đúng các khóa này trên bộ hiện tại, không nhập lại file cũ.
2. **Custom CSS cũ (velis-ux) + velis.css:**
   - đổi #6E6F75 → #5C5C5C;
   - bỏ UX-18 (740 px) khi bố cục 2 cột của T7-5 xong;
   - sửa eyebrow;
   - thêm thẻ (góc 2 px, viền, bóng khi rê chuột), section 96/64/48, bảng thông số dạng xếp chồng trên mobile, gạch champagne.

   Gộp UX-xx còn cần vào velis.css để còn **một** nơi CSS.
3. **Mẫu WPBakery Bước 2:** cập nhật theo 1–2 (class section, separator champagne, nút phụ). Sau đó **áp mẫu cho mọi trang dự án và chủ đầu tư**; đây cũng là lúc dọn hết màu dán và chữ hoa (mục 1, dòng 4–5). Cần người dùng duyệt 3 trang mẫu.
4. **Trang chủ và Liên hệ:**
   - bỏ Roboto, #DD3333, #474545, #EDEDED, khối Arial;
   - nút gõ hoa → chữ thường;
   - quyết định khối logo đỏ lớn.
5. **Branding:**
   - site icon / favicon "V" 512;
   - ảnh OG mới;
   - thống nhất cách viết số điện thoại;
   - thay Buttonizer bằng thanh CTA dính đáy (cần duyệt).
6. **Đo lại** bằng chính script này (`tools/the7_ui_audit.mjs`, danh sách trang trong `data/the7/ui-kiem-ke.json` → `trang`). Mục tiêu: 0 màu ngoài bảng, 1 kiểu đầu trang, 0 tiêu đề chữ hoa, chỉ 2 font chữ.

Đã bỏ qua / chưa kiểm tra:
- Trạng thái hover/focus, menu con, header dính khi cuộn, khung 768/1024/1920.
- Trang chưa nằm trong 17 trang (các dự án khác, Tuyển dụng chi tiết).
- Màu trong ảnh (logo đối tác, ảnh có chữ).

Phân loại "nguồn" (WPBakery / Ultimate / nội dung) là suy theo class. Rủi ro: đổi `fonts-big_size` và hộp nội dung The7 ảnh hưởng toàn site, nên phải chụp lại 7 khung trước khi duyệt.
