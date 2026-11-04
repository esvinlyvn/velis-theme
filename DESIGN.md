---
version: 1.0
name: velis-realty
description: Phong cách "tư vấn riêng cao cấp" cho Velis Realty – nền trắng ngà, chữ đen sâu, đỏ Velis đậm dùng tiết chế cho hành động, vàng champagne cho chi tiết mảnh, ảnh dự án thật là trung tâm. Tiêu đề Playfair Display 600, nội dung Be Vietnam Pro. Góc gần vuông, bóng rất nhẹ, nhiều khoảng trắng. Nguồn chuẩn là BRIEF.md (mục Bộ nhận diện & design system); file này sinh ra theme/velis/theme.json qua tools/build_theme_json.py.

colors:
  ink: "#1A1A1A"
  body-muted: "#5C5C5C"
  canvas: "#FAF8F5"
  surface: "#FFFFFF"
  surface-sunken: "#F2EEE8"
  surface-dark: "#141414"
  hairline: "#E4DED5"
  hairline-strong: "#C9C1B5"
  velis-red: "#B8282E"
  velis-red-hover: "#9E1F26"
  champagne: "#B08D57"
  champagne-text: "#8A6A3A"
  on-dark: "#FFFFFF"
  on-dark-muted: "#B9B9B9"
  success: "#2E6B3F"
  warning: "#8A5A00"
  error: "#B3261E"
  brand-logo-red: "#DC2524"
  brand-logo-gold: "#D2941B"

typography:
  font-heading: "Playfair Display, Playfair Fallback, Georgia, 'Times New Roman', serif"
  font-body: "Be Vietnam Pro, Be Vietnam Pro Fallback, Arial, sans-serif"
  h1: { fontFamily: heading, fontWeight: 600, desktop: 48px, mobile: 32px, lineHeight: 1.15 }
  h2: { fontFamily: heading, fontWeight: 600, desktop: 36px, mobile: 26px, lineHeight: 1.2 }
  h3: { fontFamily: body, fontWeight: 600, desktop: 24px, mobile: 20px, lineHeight: 1.35 }
  h4: { fontFamily: body, fontWeight: 600, desktop: 20px, mobile: 18px, lineHeight: 1.4 }
  body: { fontFamily: body, fontWeight: 400, desktop: 18px, mobile: 17px, lineHeight: 1.7 }
  body-sm: { fontFamily: body, fontWeight: 400, desktop: 16px, mobile: 16px, lineHeight: 1.6 }
  caption: { fontFamily: body, fontWeight: 400, desktop: 14px, mobile: 14px, lineHeight: 1.5 }
  eyebrow: { fontFamily: body, fontWeight: 600, desktop: 13px, mobile: 13px, lineHeight: 1.4, letterSpacing: 0.12em, textTransform: uppercase }
  button: { fontFamily: body, fontWeight: 600, desktop: 16px, mobile: 16px, lineHeight: 1.25 }
  price: { fontFamily: body, fontWeight: 600, fontVariantNumeric: tabular-nums }

rounded:
  none: 0px
  sm: 2px
  pill: 999px

spacing:
  unit: 4px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
  "24": 96px
  section-desktop: 96px
  section-mobile: 64px

layout:
  columns: 12
  content: 1200px
  reading: 720px
  gutter-desktop: 24px
  gutter-mobile: 16px
  breakpoints: [375px, 768px, 1024px, 1440px]

elevation:
  card-hover: "0 8px 24px rgba(20, 20, 20, 0.08)"
  sticky-cta: "0 -4px 16px rgba(20, 20, 20, 0.10)"

motion:
  fast: 150ms
  base: 200ms
  reveal: 320ms
  reveal-distance: 14px
  image-zoom: 1.03
  easing: "cubic-bezier(0.2, 0.6, 0.2, 1)"

components:
  button-primary: { backgroundColor: "{colors.velis-red}", textColor: "{colors.on-dark}", hover: "{colors.velis-red-hover}", typography: "{typography.button}", rounded: "{rounded.sm}", padding: 14px 28px, minHeight: 48px }
  button-secondary: { backgroundColor: transparent, textColor: "{colors.ink}", border: "1px solid {colors.ink}", hoverBackground: "{colors.ink}", hoverText: "{colors.on-dark}", rounded: "{rounded.sm}", minHeight: 48px }
  button-text: { textColor: "{colors.velis-red}", underline: on-hover, minHeight: 44px }
  card-project: { backgroundColor: "{colors.surface}", border: "1px solid {colors.hairline}", rounded: "{rounded.sm}", imageRatio: "4/3", hover: "{elevation.card-hover} + image zoom" }
  card-developer: { backgroundColor: "{colors.surface}", border: "1px solid {colors.hairline}", logoHeight: 48px }
  card-post: { imageRatio: "16/9", meta: "{typography.caption}" }
  fact-bar: { backgroundColor: "{colors.surface}", borderTop: "2px solid {colors.champagne}", items: 6 }
  spec-table: { header: "{colors.surface-sunken}", numbers: "{typography.price}", rowLine: "{colors.hairline}" }
  compare-table: { stickyFirstColumn: true, scroll: horizontal-on-mobile }
  product-tabs: { activeIndicator: "2px {colors.velis-red}", anchors: true }
  subzone-listing: { views: ["Theo phân khu", "Theo loại sản phẩm"], filterDrawerMobile: true }
  sticky-cta-mobile: { backgroundColor: "{colors.surface}", shadow: "{elevation.sticky-cta}", height: 64px, items: ["Gọi", "Zalo", "Nhận tư vấn"] }
  footer: { backgroundColor: "{colors.surface-dark}", textColor: "{colors.on-dark}", muted: "{colors.on-dark-muted}" }
---

# DESIGN.md – Velis Realty

## Overview

Velis Realty là cố vấn bất động sản cao cấp do CEO Vũ Xuân dẫn dắt, không phải sàn rao vặt. Giao diện phải gợi cảm giác
một văn phòng tư vấn riêng: thoáng, chắc chắn, điềm tĩnh. Ảnh dự án thật (có bản quyền, tông ấm) là thứ duy nhất được
"lên tiếng"; chữ và khung chỉ làm nền. Đỏ Velis là tín hiệu hành động, không phải màu trang trí; vàng champagne chỉ xuất
hiện ở đường kẻ mảnh, icon trang trí và chữ lớn trên nền tối.

Nguyên tắc: một hành động chính mỗi màn hình đầu; nội dung có sẵn trong HTML (không chờ JavaScript); mọi hiệu ứng tắt được
bằng `prefers-reduced-motion`; WCAG 2.2 AA.

## Colors

### Brand & Accent
- **velis-red `#B8282E`** – nút chính, link, điểm nhấn hành động. Chữ trắng trên nút 6,21:1; chữ đỏ trên nền ngà 5,86:1.
- **velis-red-hover `#9E1F26`** – hover/nhấn (7,84:1 với chữ trắng).
- **champagne `#B08D57`** – đường kẻ, icon trang trí, chữ ≥ 24 px trên nền tối (5,96:1 trên `#141414`).
  Chỉ 2,92:1 trên nền ngà: **không dùng cho chữ** trên nền sáng.
- **champagne-text `#8A6A3A`** – chữ nhỏ màu vàng khi cần (5,00:1 trên trắng, 4,71:1 trên ngà).
- **Màu logo** `#DC2524` / `#D2941B` lấy đúng từ file Illustrator gốc; chỉ dùng trong file logo, không dùng làm màu giao diện
  (đỏ logo trên nền ngà 4,57:1, sát ngưỡng; vàng logo 2,48:1).

### Surface
- **canvas `#FAF8F5`** nền trang (trắng ngà) · **surface `#FFFFFF`** thẻ, bảng, form · **surface-sunken `#F2EEE8`** đầu bảng,
  khối phụ · **surface-dark `#141414`** footer, khối nổi bật (chữ trắng 18,42:1).
- **hairline `#E4DED5`** viền thẻ, dòng bảng · **hairline-strong `#C9C1B5`** viền ô nhập (đạt 3:1 cho thành phần UI khi
  kết hợp nhãn hiển thị).

### Text
- **ink `#1A1A1A`** chữ chính, tiêu đề (16,42:1 trên ngà) · **body-muted `#5C5C5C`** chữ phụ, ngày đăng (6,31:1) ·
  **on-dark `#FFFFFF`** / **on-dark-muted `#B9B9B9`** (9,39:1) trên nền tối.

### Semantic
- success `#2E6B3F`, warning `#8A5A00`, error `#B3261E` – chỉ cho thông báo form và nhãn trạng thái; luôn kèm chữ/icon,
  không dựa vào màu.

## Typography

### Font Family
- **Playfair Display 600** – H1, H2 và số liệu lớn; **chỉ từ 26 px (mobile) / 28 px trở lên**.
- **Be Vietnam Pro 400 / 600** – nội dung, giao diện, H3–H4, số liệu. Bảng giá dùng `font-variant-numeric: tabular-nums`.
- Tự lưu trên máy chủ: 3 file woff2 (latin + vietnamese gộp một file mỗi kiểu), preload 2 file (Be Vietnam Pro 400,
  Playfair Display 600), `font-display: swap`, font dự phòng chỉnh `size-adjust` (Arial 108,3 %, Times New Roman 112,3 %)
  để không xô lệch bố cục.

### Hierarchy (desktop / mobile, co giãn bằng `clamp()`)

| Token | Font | Cỡ | Dòng |
|---|---|---|---|
| h1 | Playfair 600 | 48 / 32 px | 1,15 |
| h2 | Playfair 600 | 36 / 26 px | 1,2 |
| h3 | Be Vietnam Pro 600 | 24 / 20 px | 1,35 |
| h4 | Be Vietnam Pro 600 | 20 / 18 px | 1,4 |
| body | Be Vietnam Pro 400 | 18 / 17 px | 1,7 |
| body-sm | Be Vietnam Pro 400 | 16 px | 1,6 |
| caption | Be Vietnam Pro 400 | 14 px | 1,5 |
| eyebrow | Be Vietnam Pro 600, chữ hoa, giãn 0,12em | 13 px | 1,4 |

### Principles
- Đoạn văn tối đa 68 ký tự (`max-width: 68ch`); khung đọc bài 720 px.
- Đúng một H1 mỗi trang; tiêu đề khối của theme ("Bài viết liên quan", tiêu đề footer) **không dùng thẻ heading**,
  dùng kiểu `eyebrow`.
- Không viết hoa toàn bộ tiêu đề tiếng Việt (dấu chồng lên nhau khó đọc); chữ hoa chỉ cho `eyebrow` ngắn.

## Layout

### Spacing System
Bội số 4 px: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Khoảng giữa các phần lớn 96 px desktop / 64 px mobile.

### Grid & Container
Lưới 12 cột; khung nội dung 1200 px (`wideSize`), khung đọc 720 px (`contentSize`); lề 24 px desktop / 16 px mobile.
Điểm chuyển 375 / 768 / 1024 / 1440 px.

### Whitespace Philosophy
Khoảng trắng là chất liệu sang trọng chính. Mỗi phần chỉ có một ý; tách bằng khoảng trống trước khi nghĩ tới đường kẻ.

## Elevation & Depth
Phẳng là mặc định. Chỉ hai bóng: `card-hover` (thẻ khi rê chuột) và `sticky-cta` (thanh CTA dính đáy). Không blur diện rộng,
không kính mờ.

## Shapes
- Bo góc 2 px cho nút, thẻ, ô nhập; **0 px cho ảnh lớn** (hero, thư viện) – góc vuông tạo cảm giác kiến trúc.
- Pill (999 px) chỉ cho chip dòng sản phẩm và nhãn trạng thái.
- Tỉ lệ ảnh cố định: 16:9 hero và ảnh bài viết, 4:3 thẻ, 1:1 ảnh đại diện; luôn khai báo `width`/`height`.

## Components
Mỗi thành phần có trạng thái hover, focus (viền 2 px `ink`, lệch 2 px), disabled (độ mờ 0,45, con trỏ mặc định) và bản mobile.
Tất cả được trưng bày ở trang style guide trên staging.

### Buttons
Chính (đỏ, chữ trắng) · Phụ (viền đen, hover nền đen) · Dạng chữ (đỏ, gạch chân khi hover). Cao tối thiểu 48 px
(vùng bấm ≥ 44 × 44). Đổi màu 150–200 ms.

### Header & mega menu
Logo ngang SVG (cao 40 px desktop / 32 px mobile), menu, nút "Nhận tư vấn". Thu gọn khi cuộn. Mega menu Dự án nhóm theo
chủ đầu tư → đại đô thị → phân khu, dùng `<details>`/`<button aria-expanded>`. Mobile: menu toàn màn hình bằng `<dialog>`.

### Thẻ
- **Thẻ dự án**: ảnh 4:3, nhãn trạng thái, tên (H3 khi trong lưới), chủ đầu tư, khu vực, "Giá từ … (cập nhật dd/mm/yyyy)".
- **Thẻ chủ đầu tư**: logo cao 48 px, tên, số dự án đang tư vấn, khu vực.
- **Thẻ bài viết**: ảnh 16:9, cụm (eyebrow), tiêu đề, ngày, thời gian đọc.

### Dữ liệu dự án
- **Thanh thông tin nhanh**: 6 ô (vị trí · quy mô · loại sản phẩm · bàn giao · pháp lý · giá tham khảo + ngày), viền trên
  champagne 2 px; mobile cuộn ngang có scroll-snap.
- **Bảng giá/thông số**: đầu bảng `surface-sunken`, số tabular, căn phải cột số; nguồn + ngày dưới bảng.
- **Bảng so sánh**: cột đầu ghim (`position: sticky`), mobile cuộn ngang trong khung riêng có bóng mép báo còn nội dung.
- **Tab dòng sản phẩm**: danh sách tab có neo riêng (`#penthouse`); không JS vẫn hiện toàn bộ dưới dạng các mục nối tiếp;
  có JS thì thành tab (ARIA tablist), nút "Nhận bảng giá {dòng}".
- **Listing phân khu**: hai chế độ "Theo phân khu" (thẻ phân khu có chip dòng sản phẩm, diện tích, giá từ + ngày, bàn giao,
  2 nút) và "Theo loại sản phẩm" (bảng gom). Bộ lọc giữ trạng thái trong URL (`?loai=shophouse`), mobile mở dạng ngăn
  kéo từ dưới (`<dialog>`). Trạng thái rỗng: thông báo + "Bỏ lọc" + form để lại nhu cầu.
- **Timeline tiến độ**: dòng dọc, mốc có ngày + ảnh. **Thư viện ảnh**: scroll-snap + lightbox `<dialog>`.
  **Bản đồ**: ảnh tĩnh, bấm mới tải iframe.

### Nội dung & tin cậy
FAQ (`<details>`) · Mục lục (dính desktop, thu gọn mobile) · Hộp tác giả · Hộp công bố đầu tư (nền `surface-sunken`, viền trái
champagne) · Breadcrumb · Phân trang · Trang 404.

### Inputs & Forms
Nhãn luôn hiển thị (không dùng placeholder thay nhãn), viền `hairline-strong`, focus viền `ink` 2 px, lỗi hiện ngay dưới ô
(màu `error` + icon + chữ), `inputmode="tel"` cho điện thoại, ô đồng ý xử lý dữ liệu cá nhân bắt buộc kèm link chính sách
bảo mật (Nghị định 13/2023).

### CTA dính đáy (mobile) & Footer
Thanh 64 px: Gọi · Zalo · Nhận tư vấn, có `padding-bottom: env(safe-area-inset-bottom)`, trang chừa chỗ để không che nội dung.
Footer nền `surface-dark`: khối pháp nhân, liên kết chính, ứng dụng nội bộ, mạng xã hội, chính sách; tiêu đề cột là `eyebrow`.

## Do's and Don'ts

### Do
- Ảnh thật/phối cảnh có bản quyền, ghi "Ảnh phối cảnh minh họa – nguồn: CĐT".
- Mỗi con số giá/tiến độ/pháp lý đi kèm ngày cập nhật và nguồn.
- Icon nét mảnh SVG (Lucide), cùng độ dày 1,5 px.
- Hiệu ứng hiện dần 250–400 ms một lần mỗi khối; ảnh phóng 1,03 khi rê thẻ; View Transitions khi trình duyệt hỗ trợ.

### Don't
- Không parallax nặng, video nền tự chạy trên mobile, slider tự chuyển, kính mờ diện rộng, popup che trang.
- Không bộ đếm cần JavaScript mới hiện số; không emoji làm icon; không ảnh stock chung chung.
- Không dùng champagne cho chữ nhỏ trên nền sáng; không dùng màu logo làm màu giao diện.
- Không thêm thư viện JS (jQuery, slider, animation library).

## Responsive Behavior

### Breakpoints
375 (mobile) · 768 (tablet) · 1024 (desktop nhỏ) · 1440 (desktop). Kiểm thử ở 360, 390, 430, 768, 1024, 1366, 1920 px.

### Touch Targets
≥ 44 × 44 px; khoảng cách giữa hai vùng bấm ≥ 8 px.

### Collapsing Strategy
Lưới thẻ 3 → 2 → 1 cột; thanh thông tin nhanh và bảng so sánh cuộn ngang; mục lục và bộ lọc thu vào `<details>`/`<dialog>`;
form dính bên phải (desktop) chuyển thành thanh CTA đáy (mobile).

### Image Behavior
`srcset` nhiều kích thước, AVIF/WebP, lazy-load trừ ảnh đầu trang (`fetchpriority="high"`), ảnh đầu trang ≤ 150 KB.

## Ngân sách hiệu năng
LCP ≤ 2,0 s · CLS ≤ 0,05 · INP ≤ 200 ms · JS ban đầu ≤ 60 KB nén · CSS ≤ 50 KB · font ≤ 3 file.

## Iteration Guide
Sửa token ở phần đầu file này rồi chạy `python3 -I tools/build_theme_json.py` để sinh lại `theme/velis/theme.json`.
Không sửa tay màu/cỡ chữ/khoảng cách trong `theme.json` hay CSS.

## Known Gaps
- Be Vietnam Pro 500 bị lược để giữ giới hạn 3 file font; chữ "medium" dùng 600. Cần bạn xác nhận.
- Playfair Display không có ký tự ₫; giá luôn viết bằng Be Vietnam Pro.
- Đối chiếu ui-ux-pro-max: gợi ý Glassmorphism, bảng màu teal và Cinzel/Josefin Sans bị loại (không hợp nhận diện; Cinzel
  không có tiếng Việt). Giữ checklist trước khi giao: không emoji làm icon, hover 150–300 ms, tương phản 4,5:1, focus rõ,
  reduced-motion, kiểm 375/768/1024/1440.
