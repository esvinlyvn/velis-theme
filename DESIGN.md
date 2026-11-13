---
version: 1.0
name: velis-realty
description: Phong cách "tư vấn riêng cao cấp" cho Velis Realty – nền trắng ngà, chữ đen sâu, đỏ Velis đậm dùng tiết chế cho hành động, vàng champagne cho chi tiết mảnh, ảnh dự án thật là trung tâm. Tiêu đề Playfair Display 600, nội dung Be Vietnam Pro. Góc gần vuông, bóng rất nhẹ, nhiều khoảng trắng. Nguồn chuẩn là BRIEF.md (mục Bộ nhận diện & design system); file này sinh ra theme/velis/theme.json qua tools/build_theme_json.py.

colors:
  ink: "#1A1A1A"
  body-muted: "#5C5C5C"
  canvas: "#FAF7F2"
  surface: "#FFFFFF"
  surface-sunken: "#F2EEE8"
  surface-dark: "#111111"
  footer: "#1A1A1A"
  hairline: "#E4DED5"
  hairline-strong: "#C9C1B5"
  velis-red: "#B8282E"
  velis-red-hover: "#9E1F26"
  champagne: "#B08D57"
  champagne-text: "#8A6A3A"
  champagne-light: "#EADBC0"
  champagne-soft: "#F3ECDF"
  on-dark: "#FFFFFF"
  on-dark-muted: "#B9B9B9"
  success: "#2E6B3F"
  warning: "#8A5A00"
  error: "#B3261E"
  error-on-dark: "#F2B8B5"
  brand-logo-red: "#DC2524"
  brand-logo-gold: "#D2941B"

typography:
  font-heading: "Playfair Display, Playfair Fallback, Georgia, 'Times New Roman', serif"
  font-body: "Be Vietnam Pro, Be Vietnam Pro Fallback, Arial, sans-serif"
  h1: { fontFamily: heading, fontWeight: 600, desktop: 56px, mobile: 36px, lineHeight: 1.25 }
  h2: { fontFamily: heading, fontWeight: 600, desktop: 40px, mobile: 28px, lineHeight: 1.2 }
  h3: { fontFamily: body, fontWeight: 600, desktop: 22px, mobile: 22px, lineHeight: 1.3 }
  h4: { fontFamily: body, fontWeight: 600, desktop: 19px, mobile: 19px, lineHeight: 1.4 }
  lead: { fontFamily: body, fontWeight: 400, desktop: 19px, mobile: 19px, lineHeight: 1.6 }
  number: { fontFamily: heading, fontWeight: 600, desktop: 48px, mobile: 48px, lineHeight: 1.1 }
  body: { fontFamily: body, fontWeight: 400, desktop: 17px, mobile: 17px, lineHeight: 1.65 }
  body-sm: { fontFamily: body, fontWeight: 400, desktop: 16px, mobile: 16px, lineHeight: 1.55 }
  caption: { fontFamily: body, fontWeight: 400, desktop: 14px, mobile: 14px, lineHeight: 1.5 }
  eyebrow: { fontFamily: body, fontWeight: 600, desktop: 13px, mobile: 13px, lineHeight: 1.4, letterSpacing: 0.12em, textTransform: uppercase }
  button: { fontFamily: body, fontWeight: 600, desktop: 16px, mobile: 16px, lineHeight: 1.25 }
  price: { fontFamily: body, fontWeight: 600, fontVariantNumeric: tabular-nums }

rounded:
  none: 0px
  sm: 2px
  pill: 999px

spacing:
  unit: 8px
  "2": 8px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
  "24": 96px
  section-desktop: 96px
  section-tablet: 64px
  section-mobile: 48px
  head-gap-desktop: 40px
  head-gap-mobile: 32px
  card-gap: 24px

layout:
  columns: 12
  content: 1200px
  content-1600: 1320px
  reading-column: 760px   # template 1 cột
  gutter-desktop: 24px
  gutter-mobile: 16px
  breakpoints: [375px, 768px, 1024px, 1440px]

elevation:
  card: "0 1px 2px rgba(17, 17, 17, 0.06), 0 8px 24px rgba(17, 17, 17, 0.06)"          # thẻ ở trạng thái thường (2026-11-12)
  card-hover: "0 2px 4px rgba(17, 17, 17, 0.08), 0 16px 32px rgba(17, 17, 17, 0.10)"     # + nhích lên 2 px
  sticky-cta: "0 -4px 16px rgba(20, 20, 20, 0.10)"

motion:
  fast: 150ms
  base: 200ms
  reveal: 320ms
  reveal-distance: 14px
  image-zoom: 1.03
  easing: "cubic-bezier(0.2, 0.6, 0.2, 1)"

components:
  button-primary: { backgroundColor: "{colors.velis-red}", textColor: "{colors.on-dark}", hover: "{colors.velis-red-hover}", active: "#7F181E", disabled: "{colors.hairline} / {colors.body-muted}", typography: "{typography.button}", rounded: "{rounded.sm}", padding: 14px 28px, minHeight: 48px }
  button-secondary: { backgroundColor: transparent, textColor: "{colors.ink}", border: "1px solid {colors.ink}", hoverBackground: "{colors.ink}", hoverText: "{colors.on-dark}", active: "#000000", disabled: "border {colors.hairline-strong} / {colors.body-muted}", rounded: "{rounded.sm}", minHeight: 48px }
  button-text: { textColor: "{colors.velis-red}", underline: on-hover, minHeight: 44px }
  card-project: { backgroundColor: "{colors.surface}", border: none, shadow: "{elevation.card}", rounded: 4px, imageRatio: "4/3", hover: "{elevation.card-hover} + translateY(-2px) + image zoom", link: whole-card }
  card-developer: { backgroundColor: "{colors.surface}", border: none, shadow: "{elevation.card}", rounded: 4px, logoHeight: 48px }
  card-post: { imageRatio: "16/9", meta: "{typography.caption}" }
  fact-bar: { backgroundColor: "{colors.surface}", borderTop: "2px solid {colors.champagne}", items: 6 }
  spec-table: { header: "{colors.surface-sunken}", numbers: "{typography.price}", rowLine: "{colors.hairline}" }
  compare-table: { stickyFirstColumn: true, scroll: horizontal-on-mobile }
  product-tabs: { activeIndicator: "2px {colors.velis-red}", anchors: true }
  subzone-listing: { views: ["Theo phân khu", "Theo loại sản phẩm"], filterDrawerMobile: true }
  sticky-cta-mobile: { backgroundColor: "{colors.surface}", shadow: "{elevation.sticky-cta}", height: 64px, items: ["Gọi", "Zalo", "Nhận tư vấn"] }
  footer: { backgroundColor: "{colors.footer}", borderTop: "1px solid {colors.champagne}", textColor: "{colors.on-dark}", muted: "{colors.on-dark-muted}" }
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
- **champagne `#B08D57`** – đường kẻ, icon trang trí, chữ ≥ 24 px trên nền tối (≈ 6:1 trên `#111111`).
  Chỉ 2,92:1 trên nền ngà: **không dùng cho chữ** trên nền sáng.
- **champagne-text `#8A6A3A`** – chữ nhỏ màu vàng khi cần (5,00:1 trên trắng, 4,71:1 trên ngà).
- **Màu logo** `#DC2524` / `#D2941B` lấy đúng từ file Illustrator gốc; chỉ dùng trong file logo, không dùng làm màu giao diện
  (đỏ logo trên nền ngà 4,57:1, sát ngưỡng; vàng logo 2,48:1).

### Surface
- **canvas `#FAF7F2`** nền ngà · **surface `#FFFFFF`** dải trắng xen kẽ, thẻ, form · **surface-sunken `#F2EEE8`** đầu bảng ·
  **champagne-soft `#F3ECDF`** dải nhạt (Thi thử + Tuyển dụng) · **champagne-light `#EADBC0`** vạch dọc giữa cột số liệu ·
  **surface-dark `#111111`** khối tối duy nhất (form tư vấn, chữ trắng ≈ 19:1) · **footer `#1A1A1A`** + đường champagne 1 px ·
  **error-on-dark `#F2B8B5`** chữ lỗi trên nền tối.
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
- **Playfair Display 600** – H1, H2, số liệu lớn và tên thẻ dự án (22 px – ngoại lệ có chủ đích, chữ có chân giữ chất "tư vấn riêng" ở thẻ).
- **Be Vietnam Pro 400 / 600** – nội dung, giao diện, H3–H4, số liệu. Bảng giá dùng `font-variant-numeric: tabular-nums`.
- Tự lưu trên máy chủ: 3 file woff2 (latin + vietnamese gộp một file mỗi kiểu), preload 2 file (Be Vietnam Pro 400,
  Playfair Display 600), `font-display: swap`, font dự phòng chỉnh `size-adjust` (Arial 108,3 %, Times New Roman 112,3 %)
  để không xô lệch bố cục.

### Hierarchy (thang chữ 1.3 – desktop ≥ 1024 / mobile)

| Token | Font | Cỡ | Dòng |
|---|---|---|---|
| h1 | Playfair 600 | 56 / 36 px | 1,25 (bước 12: 1,1 làm khung tiêu đề trang cắt nét chữ / dấu chồng tiếng Việt) |
| số liệu | Playfair 600 | 48 px | 1,1 |
| h2 | Playfair 600 | 40 / 28 px | 1,2 |
| h3 | Be Vietnam Pro 600 (tên thẻ dự án: Playfair 600) | 22 px | 1,3 |
| dẫn (lead) | Be Vietnam Pro 400 | 19 px | 1,6 |
| thân | Be Vietnam Pro 400 | 17 px | 1,65 |
| thẻ | Be Vietnam Pro 400 | 16 px | 1,55 |
| phụ | Be Vietnam Pro 400 | 14 px | 1,5 |
| nhãn (eyebrow) | Be Vietnam Pro 600, chữ hoa, giãn 0,12em – chỉ nhãn nhỏ | 13 px | 1,4 |

Không có cỡ nào khác (đo bằng `tools/mockup_scale.mjs`). `h4` trong front-matter = 19 px chỉ để `theme.json` có đủ khóa.

### Principles
- Chữ nội dung 18 px / 1,7 (19 px từ 1600 px), dòng ≤ 90 ký tự **đếm thật** (2026-11-11, thay mép chữ 664 px): mọi thứ trong cột chính rộng bằng cột, độ dài dòng giữ bằng cỡ chữ; chữ phụ ngoài cột chính giữ `max-width: 46ch`.
- Đúng một H1 mỗi trang; tiêu đề khối của theme ("Bài viết liên quan", tiêu đề footer) **không dùng thẻ heading**,
  dùng kiểu `eyebrow`.
- Không viết hoa toàn bộ tiêu đề tiếng Việt (dấu chồng lên nhau khó đọc); chữ hoa chỉ cho `eyebrow` ngắn.

## Quy tắc bố cục (chốt 2026-11-05, sửa 2026-11-06 – áp cho mockup và theme)

**Chuẩn thị giác (duyệt: người dùng, 2026-11-06):** mockup PR #7 bản `eda87a0` + các quy tắc 1.1–1.8 dưới đây, **trừ hero trang chủ**
(= hero staging 0.9.8, xem "Hero"). CSS dùng chung một nguồn: `theme/velis/css/1-tokens.css` → `2-base.css` → `3-layout.css`
→ `4-components.css` → `5-utilities.css` (mockup đọc cùng file + `mockup/src/css/mockup.css` cho công tắc duyệt). Mockup và
DESIGN.md không được nói khác nhau.

Đo được thì có bộ đo; còn lại soát bằng mắt (bảng trong `docs/reports/doi-cach-lam-buoc-2.md` mục 12). Cách đếm ghi ngay dưới từng quy tắc.

**1.1 Lưới.** 12 cột, khung 1200 px (1320 px từ 1600 px), khe 24 px. Mọi khối thẳng mép khung (logo, chữ, ảnh, nút "Nhận tư vấn"
ở header); không khối nào tự thụt vào, kể cả khối đối tác (căn trái như mọi khối). Chữ hero trang chủ thẳng mép trái khung.

**1.2 Thang khoảng cách.** Chỉ 8 · 16 · 24 · 32 · 48 · 64 · 96. Khoảng đệm section 96 desktop / 64 tablet / 48 mobile; tiêu đề khối →
nội dung 40 desktop / 32 mobile (giá trị 40 duy nhất ngoài thang); giữa các thẻ 24. Đếm: mọi margin / padding / gap đã tính của
phần tử hiển thị (margin `auto` dùng để canh, không tính); `tools/mockup_scale.mjs` liệt kê ngoại lệ, phải = 0.

**1.3 Thang chữ.** Bảng Hierarchy ở trên – không cỡ nào khác. **Tối đa 3 cỡ chữ mỗi khối**, đếm phần *nội dung* của khối:
không tính đầu khối (nhãn + H1/H2 + đoạn dẫn – mẫu NT-11) và nút / điều khiển (cỡ cố định của hệ thống).

**1.4 Một điểm nhìn.** Mỗi khối đúng một tiêu điểm thị giác; không đặt hai thứ nặng ngang nhau cạnh nhau.

**1.5 Nhịp nền** (sửa 2026-11-11). Xen kẽ ngà #FAF7F2 và trắng; hai khối liền nhau phải phân biệt được bằng nền. **Nền tối chỉ dùng
cho footer (#1A1A1A + đường champagne 1 px ở mép trên) và thư viện ảnh.** Khối form "Nhận tư vấn" nền champagne nhạt #F3ECDF, form
nằm trên thẻ trắng viền mảnh; dải "Thi thử + Tuyển dụng" phía trên nền ngà (khác nền khối form). Hero trang chủ (ảnh + lớp phủ) không
phải khối nền.

**1.6 Chữ và đường kẻ.** Dòng ≤ 90 ký tự (chữ nội dung 18 px, 19 px từ 1600 px; sửa 2026-11-11, trước: 80, 68) (đếm từng ký tự trên dòng hiển thị, bỏ dấu cách ở chỗ xuống dòng – `tools/mockup_scale.mjs`).
Dùng khoảng trắng thay đường kẻ; viền chỉ cho thẻ và ô nhập. Được giữ: gạch champagne 48 px dưới tiêu đề khối (dấu nhấn NT-11),
vạch dọc mảnh giữa các cột số liệu (yêu cầu khối b), đường kẻ dòng của bảng dữ liệu và thanh thông tin dự án (1 đường dưới mỗi hàng).

**1.7 Nút, thẻ, icon.** Nút chính đỏ đặc, nút phụ viền; mọi thẻ cùng bo góc 4 px (sửa 2026-11-12, trước 2 px), không viền, cùng padding;
icon mảnh champagne hoặc không có.

**1.8 Nhãn "ảnh tạm".** Mặc định **ẩn**; bật bằng công tắc mockup, trạng thái ghi `#tam-1` trên địa chỉ.

## Layout

### Spacing System
Chỉ 8 · 16 · 24 · 32 · 48 · 64 · 96 (+ 40: tiêu đề khối → nội dung, desktop) – xem "Quy tắc bố cục" 1.2.

### Grid & Container
Lưới 12 cột; khung nội dung 1200 px (1320 px từ 1600 px), khung đọc 720 px; khe 24 px; lề trang 16 px (< 768) / 24 px / 32 px (≥ 1280).
Điểm chuyển 375 / 768 / 1024 / 1440 px.

### Whitespace Philosophy
Khoảng trắng là chất liệu sang trọng chính. Mỗi phần chỉ có một ý; tách bằng khoảng trống trước khi nghĩ tới đường kẻ.

## Elevation & Depth
Phẳng là mặc định. Chỉ ba bóng: `card` (thẻ), `card-hover` (thẻ khi rê chuột) và `sticky-cta` (thanh CTA dính đáy). Không blur diện rộng,
không kính mờ.

## Shapes
- Bo góc 2 px cho nút, ô nhập; 4 px cho thẻ; **0 px cho ảnh lớn** (hero, thư viện) – góc vuông tạo cảm giác kiến trúc.
- Pill (999 px) chỉ cho chip dòng sản phẩm và nhãn trạng thái.
- Tỉ lệ ảnh cố định: 16:9 hero và ảnh bài viết, 4:3 thẻ, 1:1 ảnh đại diện; luôn khai báo `width`/`height`.

## Components
Mỗi thành phần có trạng thái hover, focus (viền 2 px `ink`, lệch 2 px), disabled (nền `hairline`, chữ `body-muted`, ≥ 3:1)
và bản mobile. Tất cả được trưng bày ở trang style guide trên staging, với dữ liệu thật của site (The Privé, Vinhomes Saigon Park).

### Thẻ (chốt 2026-11-12 – mọi thẻ: dự án, phân khu, bài, chủ đầu tư, bài liên quan)
- **Không viền.** Nền trắng, bo góc 4 px, bóng `card`; rê chuột: bóng `card-hover` + nhích lên 2 px (200 ms); tắt chuyển động khi người
  dùng bật "giảm chuyển động". Trên ảnh hero (dải "Dự án nổi bật"): nền tối, không bóng, cùng bo góc và cùng nhích.
- **Cả thẻ là một link**: chữ của link là tên thẻ (tên dự án / tiêu đề bài); "Xem dự án →" chỉ là chữ trang trí, không phải link riêng
  (không có link chữ chung chung lặp lại). Link phụ trong thẻ bài (chuyên mục, ngày) vẫn bấm riêng. Focus bàn phím: viền 2 px quanh cả thẻ.
- **Lưới**: khe 24 px; số cột theo phần tử (3 / 2 / 1); hàng cuối thiếu thẻ thì **căn giữa**, thẻ giữ bề rộng.
- **Thẻ dự án**: nhãn "chủ đầu tư · khu vực" luôn 1 dòng (khu vực cắt "…", rê chuột thấy đủ) → tên cùng hàng thẳng nhau ±2 px.
- Ảnh thẻ trong màn đầu tải ngay (không lười, không mờ dần); ảnh dưới `loading="lazy"`, khung giữ sẵn tỉ lệ.

### Buttons
Chính (đỏ, chữ trắng) · Phụ (viền đen, hover nền đen) · Viền trắng (trên ảnh hero) · Dạng chữ (đỏ, gạch chân khi hover).
**Một hệ (chốt 2026-11-12):** chính và phụ cùng cao 48 px (desktop và mobile), cùng bo 2 px, cùng chữ 16 px / 600 (15 px chỉ cho cỡ S);
đổi màu 150–200 ms. Đủ 5 trạng thái, chữ ≥ 4,5:1 ở mọi trạng thái:

| Trạng thái | Chính | Phụ (viền) | Viền trắng (trên ảnh) |
|---|---|---|---|
| Thường | nền `#B8282E`, chữ trắng 6,21:1 | viền + chữ `#1A1A1A` | viền + chữ trắng |
| Rê chuột | nền `#9E1F26` (7,84:1) | nền `#1A1A1A`, chữ trắng | nền trắng, chữ `#1A1A1A` |
| Bấm | nền `#7F181E` (10,23:1) | nền `#000000`, chữ trắng | nền `#F3ECDF`, chữ `#1A1A1A` |
| Focus bàn phím | viền 2 px `#1A1A1A` lệch 2 px | như chính | viền 2 px trắng |
| Vô hiệu | nền `#E4DED5`, chữ `#5C5C5C` (5,0:1) | viền `#C9C1B5`, chữ `#5C5C5C` | – |

Nơi đặt: phần tử Button của The7 (cỡ S/M/L chuẩn trong Theme Options → Buttons; nút phụ = Extra class `velis-btn-outline`, viền trắng
= `velis-btn-ghost`), nút Gửi của form, nút "Nhận tư vấn" ở header và thanh liên hệ đáy, nút trang 404. Nút biểu tượng (mở mục lục,
hỏi đáp, menu, lên đầu trang) vùng bấm ≥ 44 × 44. Mọi link / nút ngoài đoạn văn có vùng bấm ≥ 44 × 44 (breadcrumb, ngày / tác giả,
footer, phân trang, số điện thoại header).

### Hero (đã chốt)
- **Trang chủ (duyệt: người dùng, 2026-11-06): giữ hero staging 0.9.8** – ngoại lệ có chủ đích của X-02: trang chủ luôn hero tràn,
  kể cả ảnh 1200 px. Ảnh tràn (The Privé, phóng cắt 1,12), nhãn "Velis Realty", H1 "Tư vấn bất động sản cao cấp tại TP.HCM và vùng
  lân cận" (khối chữ rộng 600 px, thẳng mép trái khung), đoạn dẫn, 2 nút ("Nhận tư vấn" đỏ, "Xem dự án" viền trắng), dải "Dự án
  nổi bật" ở đáy hero. Mobile: ảnh ở trên, chữ trên dải tối liền màu. **Chỉ 2 điểm khác 0.9.8:** (a) **một** lớp chuyển sắc tuyến
  tính trái → phải phủ toàn khung (cấm mảng phủ riêng, bo góc, blur, radial, hộp nền sau nhãn / chữ), chữ ≥ 4,5:1 tại 5 điểm /
  dòng; (b) thẻ trong dải cao bằng nhau ±1 px, tên dự án 1 dòng (không bẻ, không "…"), khu vực được xuống dòng, tối đa 4 thẻ trong
  khung, trượt bằng mũi tên / vuốt, không tự chạy. Ảnh hero khác ảnh thẻ đầu tiên của lưới dự án, không có chữ / biển in sẵn
  (ảnh Ansana – tên đường trong cảnh – chỉ dùng ở thẻ / nội dung). **Từ 2026-11-11:** chữ, 2 nút, ảnh nền lấy từ Cài đặt Velis
  (plugin velis-data); dải "Dự án nổi bật" = dự án được tick "Nổi bật" theo thứ tự mới nhất trước, không tick dự án nào thì 4 dự án
  mới nhất; dự án chưa có ảnh vẫn được hiện (khung có tên). Lưới dự án trang chủ tên "Dự án Velis đang tư vấn".
- **A** – trang dự án, trang phân khu (vòng 6; mô tả dải dự án dưới đây là bản trang chủ cũ, đã thay; lớp phủ theo NT-47: một
  chuyển sắc trái → phải phủ toàn khung). Ảnh tràn rộng. **Desktop (≥ 1024 px): không phủ cả ảnh** – chỉ
  một lớp nền mờ cục bộ (#141414 82 %, blur 36 px) sau khối chữ ở góc trái dưới (khối chữ ≤ min(600 px, 46vw)), ≥ 60 % diện tích
  ảnh giữ độ sáng gốc; breadcrumb có nền nhỏ riêng; chữ ≥ 4,5:1 (đo bằng điểm ảnh, `tools/check_ui.mjs`). Tablet: lớp phủ từ dưới
  lên; mobile: ảnh 4:3 ở trên, chữ trên dải tối. Trong hero: breadcrumb, eyebrow chủ đầu tư · khu vực, H1, 3–4 chip, 2 nút.
  Trang dự án cao ~60vh; trang chủ: đáy hero là dải **mọi dự án có ảnh thật** (4 thẻ trong khung, nhiều hơn thì trượt ngang; thẻ cao bằng nhau – tên ≤ 2 dòng, khu vực 1 dòng cắt "…").
  Chưa có ảnh: dải tối + tên chìm.
- **Form** (mọi nơi): chỉ Họ tên + Số điện thoại (cùng hàng từ 768 px), ô đồng ý, nút Gửi; dự án / URL trang / utm là trường
  ẩn gửi kèm email. Khối "Nhận tư vấn" 2 cột cân: trái tiêu đề + kênh liên hệ, phải form. Thẻ "Nhận bảng giá" ở cột phải
  trang dự án mở form gọn tại chỗ.
- **Khung**: 1200 px; từ 1600 px là 1320 px. Thanh CTA đáy (mobile/tablet) chỉ hiện sau khi cuộn qua nút của hero.
- **B** – trang tổng (Dự án, Chủ đầu tư, Blog, cụm blog). Chia đôi 5:6, chữ trên nền ngà, tiêu đề `text-wrap: balance`.

### Trang chủ dưới hero (duyệt: người dùng, 2026-11-06)
Thứ tự: con số → dự án (tab khu vực) → đối tác → giá trị khác biệt → bài phân tích → thi thử + tuyển dụng → form → footer.
Mọi chữ, con số, nút của các khối này nằm ở **Cài đặt Velis** (2026-11-11; theme không giữ nội dung – `tools/check_hardcode.py`);
logo đối tác = ảnh đại diện của từng bài Chủ đầu tư.
- **Con số** 10+ · 50+ · 999+ · 99+ (dấu + sau số), dải trắng 4 cột, Playfair 48 champagne đậm.
- **Dự án**: 1 hàng tab khu vực (chọn một), lưới 3 × 2, thẻ thiếu ảnh sạch xếp cuối; "Xem tất cả dự án" giữa dưới lưới.
- **Đối tác** (2026-11-11): tiêu đề + 1 dòng mô tả ở trên; lưới logo trải hết bề ngang khung – số ô = số logo, ô bằng nhau, đường
  chia 1 px giữa các ô, logo căn giữa ô, **cân theo diện tích thị giác** (6 800 px², cao ≤ 64, rộng ≤ 200 – khoảng 56 px với logo 2:1;
  lệch ≤ 15 %); xám đậm, hover màu gốc; mobile 2 cột. Trang / danh sách chủ đầu tư giữ 2 304 px², ≤ 48 × 160.
- **Khối "Công ty TNHH Velis Realty"** (2026-11-11, không ảnh): 2 cột 6/12 + 6/12 trải hết khung. Trái: nhãn "Về Velis", H2,
  2 đoạn giới thiệu nguyên văn trang cũ, nút "Tìm hiểu Velis". Phải: tiêu đề nhỏ "Giá trị khác biệt tại Velis Realty" + 4 giá trị
  dạng danh sách đánh số 01–04 (số Playfair champagne lớn, tiêu đề, đoạn ngắn), ngăn bằng đường kẻ mảnh, không thẻ; hai cột cao lệch
  ≤ 15 %; mobile: chữ rồi danh sách. Trang chỉ có 1 H1 (của hero).
- **Thẻ** (dự án, bài viết): link "Xem dự án" / "Đọc bài" ghim đáy thẻ – các link cùng hàng thẳng nhau ±1 px.
- **Thi thử + Tuyển dụng**: dải nền ngà, 2 hộp trắng cùng cao; câu hộp Thi thử: "Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí."
- Trang dự án: hero B ở M4 giãn ảnh 1,52 – chấp nhận (2026-11-06).

### Bố cục template (vòng bố cục + ổn định – Duyệt: người dùng, 2026-11-10; thay "cột đọc 576 px" và "tối đa 1 vùng Đọc tiếp")
- **Template 2 cột** (dự án, phân khu, dòng, bài, Giới thiệu, Tuyển dụng, tác giả): cột chính 8/12 + cột phải 4/12, rãnh 48 px
  (khung 1200 → 768 | 384); mép phải cột phải trùng mép khung; cột phải ≤ 34 % khung; 768–1023 px một cột, khối cột phải
  xuống sau thanh thông tin.
- **Template 1 cột** (chính sách, tìm kiếm, 404): khung đọc 760 px căn giữa; breadcrumb, tiêu đề, nội dung cùng mép.
- **Khung 2 cột ở mọi bề rộng** (2026-11-11): khung tối đa 1 320 px (1 200 dưới 1 600), căn giữa; cột chính đúng 8/12, cột phải đúng
  4/12, rãnh 48 px (1 200 → 768 | 384; 1 320 → 848 | 424). **Không** đặt max-width riêng cho đoạn văn / tiêu đề / ảnh / bảng trong cột
  chính – mọi thứ rộng bằng cột; độ dài dòng giữ bằng cỡ chữ: 18 px dưới 1 600, 19 px từ 1 600, ≤ 90 ký tự/dòng. Cột phải và mục lục
  bắt đầu ngang mép trên nội dung cột chính (lệch ≤ 8 px), dính khi cuộn. Chữ dài trên trang rộng hết khung ("Về {chủ đầu tư}",
  giới thiệu /du-an/) cũng vào khung này, cột phải là ô "Nhận tư vấn" ngắn. Đo: `tools/check_layout_b5.mjs` (1 366 / 1 536 / 1 920 / 2 560).
- **Phần đầu trang** (mọi template trừ trang chủ, kiểu B): trái 7/12 (nhãn, H1, đoạn dẫn), phải 5/12 (nút căn đáy, căn phải);
  thanh thông tin rộng hết khung; mobile một cột. Hero A (ảnh ≥ 1920 px) giữ khối chữ trên ảnh (NT-43); hero trang chủ không đổi.
- **Độ dài trang dự án / phân khu / dòng**: mọi khối chữ cao quá 520 px thu còn ~360 px + "Xem thêm" / "Thu gọn" mở tại chỗ;
  không thu lưới thẻ, bảng thông tin, thư viện, FAQ, form; tiêu đề không mờ; lớp mờ cùng màu nền (an toàn Safari); in mở hết;
  tab mục nhảy tới khối nào thì khối đó mở. Khối "Bài viết" 1 hàng 3 thẻ + "Tất cả bài". Mục tiêu ≤ 12.000 px (M2), ≤ 16.000 px (iPhone 14).
- **Mỗi loại một component**: thẻ dự án (ảnh 4:3; chủ đầu tư · khu vực → tên → loại sản phẩm → bàn giao, thiếu thì "Bàn giao:
  chưa công bố" → "Xem dự án →"), thẻ phân khu dọc, thẻ chủ đầu tư (khung 4:3 của thẻ dự án, logo cân diện tích hoặc khung tên),
  thẻ bài, danh sách cột phải (mỗi mục một dòng, cả dòng là link), nút biểu tượng trên nền tối (thư viện, khung phóng to).
- **Danh sách bài viết** (2026-11-11; /blog/, cụm, tác giả, nhóm "Bài viết" của tìm kiếm): mỗi dòng một bài – ảnh 4:3 bên trái
  (280 px desktop, 112 px mobile – danh sách 12 bài vẫn lướt nhanh; ảnh trên chữ sẽ thành thẻ), nhãn cụm → tiêu đề cỡ H3 → tóm tắt
  2 dòng → tác giả · ngày · phút đọc → "Đọc bài →"; đường kẻ mảnh giữa các dòng; cả dòng bấm được; bài mới nhất cùng cấu trúc. Danh sách
  ở cột chính 8/12; cột phải: chọn cụm + ô "Nhận tư vấn" ngắn (mobile: hàng chip cụm dưới phần đầu trang). 12 bài/trang, phân trang
  cuối danh sách. Thẻ bài dạng ô (trang dự án, trang chủ) giữ nguyên.
- **Link không gạch chân** (2026-11-11): mặc định mọi link không gạch chân ở trạng thái thường. Link điều hướng (breadcrumb, footer,
  danh sách) màu chữ phụ, rê chuột đỏ (footer nền tối: đỏ nhạt #F2B8B5); link trong đoạn văn đỏ `--red-link` #C42F35, đậm 600, rê
  chuột hiện gạch chân mảnh; focus bàn phím viền rõ. #C42F35 ≥ 4,7:1 trên ngà / trắng / champagne nhạt và ≥ 3:1 so với chữ thường.
  Đo: 0 thẻ `a` gạch chân ở trạng thái thường trên mọi template (`tools/check_layout_b5.mjs`, cột `underline`).
- **Khung phóng to ảnh**: ảnh trọn trong 90vw × 85vh, nền tối ≥ 90 %, ảnh có cờ dấu cắt W-A như ngoài trang, nút đóng 48 px,
  Esc / bấm nền / vuốt xuống đóng, ‹ › và phím mũi tên chuyển ảnh, đóng xong focus về ảnh đã bấm; mở được cả ảnh trong bài.

### Bố cục 2 cột & nhịp thị giác (vòng 5 – phần cột rộng / Đọc tiếp đã thay bằng mục trên)
- **Trang có văn bản dài** (dự án mọi cấp; Giới thiệu, Tuyển dụng): từ 1024 px là cột nội dung
  (phần còn lại) + **cột phải dính 340 px** – dự án: thẻ "Nhận bảng giá {tên}" (ảnh, trạng thái, giá nếu có, bàn giao,
  Nhận bảng giá → form điền sẵn, Gọi, Zalo); Giới thiệu: thẻ liên hệ; Tuyển dụng: thẻ "Gửi CV".
  **Trang chính sách và trang không có gì hữu ích cho cột phải → một cột đọc canh giữa** (chốt 2026-11-06).
  Cột chính / cột phải / độ dài chữ: xem "Bố cục template" ở trên (2026-11-10). Khoảng dọc giữa 2 khối ≤ 96 px,
  2 khối cùng nền không cộng dồn đệm. Thứ bậc nhìn thấy: tiêu đề khối > H2 nội dung > H3 (H2 nội dung đứng ngay sau tiêu đề
  khối hiện cỡ H3). Khối chữ dài: thu gọn từng khối (2026-11-10).
  Khối "Velis tư vấn dự án này" kết thúc bằng câu vai trò (chữ phụ 14 px): "Velis Realty là đơn vị tư vấn, phân phối; chủ
  đầu tư dự án là {chủ đầu tư}." – chủ đầu tư từ dữ liệu, nối bằng dấu phẩy; không có thì ẩn câu (duyệt 2026-11-06). < 1024 px: một cột + thanh CTA đáy (kể cả tablet).
- Khối rộng (danh sách phân khu, so sánh, thư viện, bản đồ) **vừa cột nội dung**: phân khu 2 cột, bảng so sánh cuộn ngang
  có cột tên ghim – để cột phải dính liên tục suốt trang (đẹp và nhất quán hơn việc ngắt cột cho một khối full-width).
- **Nhịp**: không lặp một khuôn suốt trang. Trang dự án (vòng 6): các section cùng một kiểu nền ngà (không khung trắng có
  viền), Thư viện trên nền tối, bảng so sánh là **vùng full-width riêng** thoát khỏi 2 cột (không cuộn ngang khi ≤ 5 cột).
  Thứ tự: Tổng quan → [Phân khu] → Sản phẩm → So sánh → Vị trí & tiện ích → Thư viện → Tiến độ & pháp lý → Góc nhìn CEO →
  Hỏi đáp → Bài viết → Tư vấn. Văn bản dài của bài trụ cột cũ nằm sau dữ liệu của section, thu gọn sau ~250 từ (Tổng quan
  ~150 từ) với "Đọc tiếp". Trang khác: nền ngà, dải trắng toàn chiều ngang, **mỗi trang ít nhất một khối nhấn tối**.
- Thông tin liên hệ (điện thoại + email + địa chỉ) chỉ một lần trong thân trang (khối "Nhận tư vấn"); thẻ cột phải của
  Giới thiệu là dự án đang tư vấn, của Tuyển dụng là "Gửi CV".
- Danh sách ≤ 2 mục: 1 mục = thẻ ngang rộng hết khung (ảnh trái, chữ phải), 2 mục = 2 cột; không để hàng có ô trống.
- **Thanh điều hướng mục** tối đa 8 mục: Tổng quan · Sản phẩm · Phân khu · Vị trí & tiện ích · Thư viện · Tiến độ & pháp lý ·
  Hỏi đáp · Tư vấn (mục không có nội dung tự ẩn); mobile cuộn ngang, mục đầu luôn thấy.
- **Khoảng trống**: từ 1024 px không vùng nào có khoảng trống ngang cạnh nội dung > 30 % khung kéo dài quá 1 màn hình
  (`tools/check_ui.mjs` tự kiểm ở 1100 / 1366 / 1536 / 1920).

### Ảnh nét (vòng r8)
- Khung ảnh **chỉ theo thiết kế và viewport**, không phụ thuộc mật độ điểm ảnh (DPR): cùng viewport, hộp mọi ảnh/khối ở
  DPR 1 / 1,25 / 2 lệch ≤ 1 px. Hero A tràn toàn khung ở mọi DPR. Ảnh trong nội dung rộng bằng cột chữ; chỉ khi file lớn
  nhất nhỏ hơn cột thì ảnh hiện bằng cỡ file, căn giữa (`.v-crop`, `max-width` = file lớn nhất).
- Phóng cắt `--zoom` 1,12 (hero, ảnh đầu bài, ảnh nội dung) / 1,15 (thẻ, dải nổi bật, thư viện, tiến độ, cột phải) neo ở
  `--focus` (góc phải trên) để đẩy huy hiệu VELIS in chìm (góc trái dưới) ra ngoài khung. Mặt bằng, logo, bản đồ OSM: không phóng.
- `srcset` tới 2560 px (thêm cỡ 600 / 900 / 1600 / 2000 / 2560); `sizes` luôn tường minh và **nhân hệ số phóng**
  (`velis_sizes()`), không dùng `sizes="auto"` (bỏ qua phép phóng).
- Nhóm thẻ có ảnh: thẻ thiếu ảnh dùng khung dự phòng có tên (Playfair, căn giữa, nền champagne nhạt), cùng tỉ lệ; cả nhóm
  không ảnh thì thẻ chữ. Ảnh lỗi khi tải → thử cỡ 1024, rồi khung dự phòng có tên (`is-broken`).
- Bộ đo bắt buộc: `node tools/check_ui.mjs --suite tools/suite-pages.txt <thư mục>` – DPR 1 / 1,25 / 2 × viewport 390 /
  1066 / 1366 / 1536 / 1920, cuộn thật, chờ ảnh. Độ nét đo bằng bề rộng thật của file đang hiện (nạp `currentSrc` vào
  `new Image()`), không dùng `img.naturalWidth`. Mọi cột lỗi = 0; "ảnh nguồn thiếu độ phân giải" chỉ để thông tin
  (`docs/KIEM-KE-ANH.md`, chuẩn `docs/CHUAN-ANH.md`). Cột phải bài viết: `--sticky tools/sticky-pages.txt`.

### Đầu mục section
Eyebrow → tiêu đề Playfair (H2) → đoạn dẫn ≤ 2 dòng màu `body-muted` → đường kẻ champagne 48 × 1 px. Nhịp: 96/64 px giữa
section, 32 px từ đầu mục tới nội dung, 24 px giữa các khối, 8 px eyebrow → tiêu đề.

### Ảnh
16:9 hero/ảnh đầu bài · 3:2 thư viện (21:10 desktop) và ảnh tiến độ · 4:3 mọi loại thẻ · 1:1 đại diện. Góc vuông.
Mọi khung ảnh nhận `--focus` (object-position) và `--zoom` (phóng nhẹ neo theo điểm lấy nét) để đẩy huy hiệu in chìm ra
ngoài khung (xem "Ảnh nét"). Ảnh minh họa không có chữ đè (không infographic). Thiếu ảnh: khung champagne nhạt + tên dự án (Playfair, căn giữa).
Mặt bằng và bản đồ dùng `contain`/không cắt nội dung. Chú thích 14 px: nội dung · nguồn · ngày chụp.

### Header & menu
Logo 44 px (40 px khi thu gọn) desktop, 36 px mobile; hotline bấm gọi được; nút "Nhận tư vấn". Một điểm chuyển 1024 px.
Desktop (chốt 2026-11-06, sửa 2026-11-11): "Dự án" mở menu thả xuống (6 dự án mới nhất + "Tất cả dự án", tự lấy từ danh sách dự án),
"Về Velis" mở menu con (Giới thiệu, Tuyển dụng); "Liên hệ" là một mục riêng trên thanh menu. Mục menu sửa trong Giao diện → Menu
(vị trí "Menu chính (đầu trang)"; footer "Chân trang – Khám phá"), chưa gán menu thì dùng cấu trúc trên. Số điện thoại ở header:
biểu tượng điện thoại + số (Cài đặt Velis, không chữ "Gọi hotline"), vẫn là link tel:, aria-label "Gọi {số}"; nút hành động giữ chữ "Gọi {số}" – dựng bằng component header, mở bằng hover, click và bàn phím (Enter / Space / mũi tên, Esc đóng);
một menu mở một lúc, đóng khi bấm ra ngoài. Header không tự ẩn khi cuộn. Dưới 1024 px: menu toàn màn hình `<dialog>` –
"Dự án" và "Về Velis" là mục có mục con; hotline + "Nhận tư vấn" ở cuối menu.

### Thẻ (dự án, chủ đầu tư, bài viết, phân khu)
Cùng ảnh 4:3; cao bằng nhau trong một hàng; **cả thẻ bấm được** + **một link chữ ở đáy cùng một kiểu** ("Xem dự án →",
"Xem chủ đầu tư →", "Đọc bài →", "Xem phân khu →"). Thẻ phân khu trong listing có thêm nút "Nhận bảng giá" phía trên link.
Không có trạng thái → không nhãn. Thiếu giá →
một dòng "Giá: chưa công bố" chữ mờ, không đậm, không lặp "chưa công bố" lần nào khác trong thẻ. Khu vực hiện cấp cụ thể
nhất. Thẻ chủ đầu tư: khung logo trung tính dùng chung (biểu tượng tòa nhà) khi chưa có logo.

### Khi thiếu dữ liệu
- Trường trống → ẩn cả khối (ô thông tin, dòng trong bảng nhỏ, "phù hợp với ai", ảnh tác giả), không chữ giữ chỗ.
- Bảng (`velis_table()`): cột/hàng mà mọi ô trống → ẩn, thay bằng một dòng ghi chú dưới bảng.
- Bộ lọc/sắp xếp: chỉ hiện nhóm có ít nhất 2 giá trị khác nhau trong danh sách.
- Giá là ngoại lệ: luôn hiện, chữ mờ khi chưa công bố.
- Diện tích (`velis_area()`): thông thủy là số chính, tim tường là số phụ; chỉ có một loại thì ghi rõ loại.

### Dữ liệu dự án
- **Thanh thông tin nhanh**: đủ 6 ô (vị trí · quy mô · sản phẩm · bàn giao · pháp lý · giá tham khảo), 2 cột mobile,
  3 tablet, 6 desktop (≥ 1280 px); không bao giờ cắt ngang.
- **Bảng thông số**: chữ căn trái, số căn phải, đệm ô ≥ 16 px; mobile thành danh sách thẻ (nhãn – giá trị).
- **Bảng so sánh**: cột "Tiêu chí" ghim; dưới 1024 px có bóng mép phải và chữ "Vuốt để xem thêm"; ô thiếu ghi
  "Chưa công bố" (không dùng "—"); hàng cuối là nút "Xem phân khu".
- **Tab dòng sản phẩm**: cột thông tin (bảng nhỏ: diện tích, phòng ngủ, hướng/số lượng nếu có, bàn giao, giá từ + ngày;
  "phù hợp với ai"; CTA) + ảnh mặt bằng ≤ 50 % chiều rộng, cao ≤ 520 px, `contain`, bấm phóng to (`<dialog>`).
  Mobile: thông tin và CTA trước, ảnh sau. Không JS vẫn hiện đủ các mục nối tiếp.
- **Listing phân khu**: ≥ 1280 px 3 cột, tablet 2, mobile 1. **Chỉ 1 nhóm lọc có dữ liệu → hàng chip phía trên lưới,
  không cột bộ lọc** (mọi khung). Từ 2 nhóm trở lên: desktop cột bộ lọc bên trái + sắp xếp + số kết quả + xóa lọc. Dưới 1024 px: ngăn kéo trượt từ dưới lên, có đầu (tiêu đề + đóng) và chân dính ("Xóa lọc" | "Xem N kết quả",
  N cập nhật khi chọn). Nhóm theo loại sản phẩm: chỉ căn hộ → Cao tầng; có cả căn hộ và thấp tầng → Hỗn hợp; còn lại →
  Thấp tầng. Giá trị trống không khớp bộ lọc đang bật.
- **Listing dự án** (chốt 2026-11-06): 3 nhóm có nhãn "Khu vực", "Chủ đầu tư", "Loại sản phẩm", mỗi nhóm một hàng chip;
  mobile: 3 ô chọn thả xuống. Tên khu vực lấy từ dữ liệu khu vực, thống nhất toàn site. Lưới: mới nhất trước theo ngày đăng (2026-11-11,
  không còn "thẻ có ảnh trước"); dự án chưa có ảnh dùng khung có tên. Trong nhóm: khớp bất kỳ; giữa các nhóm: khớp tất cả. Chọn Vùng là chọn mọi Tiểu khu;
  Tiểu khu chọn một phần thì Vùng ở trạng thái "một phần".
  Trạng thái lọc trong URL (`?loai=can-ho`), canonical về trang đại đô thị, noindex.
- **Thư viện ảnh**: desktop có mũi tên + bộ đếm "1/12", mobile lộ một phần ảnh kế tiếp + bộ đếm.
- **Bản đồ**: ảnh tĩnh OpenStreetMap tông xám + ghim đỏ Velis, giữ ghi công; cao tối đa 420 px desktop / 320 px mobile;
  nút "Xem trên Google Maps" ở giữa cạnh dưới.
- **Timeline tiến độ**: dòng dọc, mốc có ngày, ảnh có chú thích ngày chụp + nguồn.
- **Ảnh tiến độ** (vòng r8): lưới rộng bằng cột chữ; số cột theo số ảnh – 1 → 1, 2 / 4 → 2, còn lại 3 cột (ảnh đầu rộng
  2 ô khi số ảnh không chia hết cho 3); mobile 2 cột, ảnh đầu tràn hàng khi số ảnh lẻ. Bản đồ cũng rộng bằng cột chữ.
- **Chip hero** ghép nhãn + giá trị viết thường chữ đầu của từ thường ("Bàn giao từ tháng 11/2023").

### Nội dung & tin cậy
Bố cục bài: cột đọc 720 px + cột phải dính (≥ 1280 px; top = header dính + 24 px): mục lục (chỉ danh sách cuộn riêng, cao ≤ 45vh, mờ dần ở đáy) + thẻ dự án ảnh thu gọn + nút tư vấn – cả cột luôn vừa màn hình, tô đậm mục đang đọc; dưới đó mục lục
nằm trong cột đọc, 2 cột khi > 6 mục. FAQ (`<details>`) · Hộp tác giả (ảnh chân dung thật – chưa có thì ẩn khung ảnh;
link mạng xã hội cá nhân; "Xem tất cả bài viết") · Hộp công bố
(15 px, rộng bằng cột đọc, chữ `ink` trên `surface-sunken`) · Breadcrumb · Phân trang · Trang 404.

### CTA "Nhận bảng giá" (chốt 2026-11-13 – một thành phần, mọi nơi cần lead)
Học cấu trúc CTA bán hàng (khung nổi bật, lợi ích cụ thể, form ngay trong khối, nút động từ, hotline, dòng bảo mật) nhưng giữ nhận diện
và giọng: không xanh/vàng, không "tốt nhất / duy nhất / độc quyền / suất VIP".
- Khung: nền than `#1A1A1A`, gạch champagne 3 px trên, bo 4; chữ trắng, nhãn + dấu ✓ champagne sáng `#D9BE8C` (9,8:1).
- Thứ tự: nhãn "Tư vấn trực tiếp từ Velis Realty" → H2 lợi ích cụ thể ("Nhận bảng giá & giỏ hàng <dự án>") → 3 dòng ✓ ngắn
  (chỉ điều có thật trên site) → form CF7 "Nhận bảng giá": Họ và tên · Số điện thoại / Zalo · nút đỏ "Nhận bảng giá ngay" (cao 52)
  → ô đồng ý NĐ 13 (bắt buộc, link Chính sách bảo mật) → "Hoặc gọi ngay 0911 237 979 · Zalo (08:00–21:00 hằng ngày)" (số 22 px).
- Bản ngang (hàng WPBakery `velis-cta`, trang dự án / phân khu / chủ đầu tư / trang tổng chủ đầu tư): khối giữa ≤ 880 px, form 1 hàng
  (2 ô + nút) từ 900 px, dưới đó xếp dọc. Bản dọc (widget sidebar bài blog, `.velis-cta-box`): cùng thứ tự, form xếp dọc,
  tiêu đề và trường ẩn "du-an" theo dự án của cụm bài (không thuộc dự án → "Nhận bảng giá & tư vấn dự án"), thêm link "Xem dự án …".
- Mỗi trang một CTA chính đầy đủ + thanh liên hệ đáy (mobile). Không đoạn giải thích dài trong khối.

### Dòng meta bài
Chuyên mục · tác giả · ngày: một hàng chung đường chân chữ, 14 px / 1,5, màu chữ phụ `#5C5C5C`, dấu "·" xám giữa các mục,
xuống dòng gọn khi hẹp. Vùng bấm link meta nở bằng đệm trên/dưới (không đổi dòng chữ, không lề âm).

### Trang sản phẩm (chốt 2026-11-13)
Trang dự án, phân khu, chủ đầu tư, trang tổng chủ đầu tư: **không cột phải** (The7 → Sidebar: Disabled), khung nội dung 1200 px;
CTA là khối ngang trong nội dung.
**Một cột đọc 760 px căn giữa khung** (bước 12b, người dùng chốt 2026-11-13) cho mọi khối chữ: đoạn văn, H2/H3, danh sách, bảng (rộng 100 % cột),
mục lục, hỏi đáp / "Xem thêm", chữ phần đầu (trừ nhãn + H1), nút + dòng gọi phần đầu – cùng mép trái/phải ±1 px, trống trái = phải.
Rộng hết khung 1200 px: phần đầu (breadcrumb, nhãn, H1, ảnh), lưới thông tin dự án, khối "Nhận bảng giá", ảnh (Single Image), thư viện ảnh /
Inner Row, video, lưới thẻ (phân khu, bài). Không xếp chữ cạnh ảnh 2 cột trong trang sản phẩm: chữ trong cột đọc, ảnh xuống dưới.
Cách áp: hàng `velis-section` của trang có phần đầu `velis-hero` (mẫu "Velis – Dự án" / "Velis – Chủ đầu tư" đã có); trang khác thêm
Extra class `velis-read` cho hàng cần cột đọc (vd. /chu-dau-tu/). Muốn một khối rộng hết khung: đặt trong Inner Row.
Đo: `node tools/the7_check_cot.mjs out.json cot` (12 trang × 1366/1536/1920).
Bài blog giữ sidebar phải: CTA bản dọc theo dự án + danh sách "Cùng dự án …" rồi "Bài mới" (không trùng "Bài viết liên quan" cuối bài).

### Inputs & Forms
Trường: Họ tên · Số điện thoại (`inputmode="numeric"`) · Nhu cầu (Mua ở / Đầu tư / Cho thuê, không chọn sẵn) · Dự án/phân khu (tự điền
theo trang, sửa được) · Ghi chú (không bắt buộc) · ô đồng ý xử lý dữ liệu cá nhân (Nghị định 13/2023). Nhãn luôn hiển thị,
lỗi ngay dưới ô. Desktop: form cạnh khối thông tin liên hệ (2 cột).

### CTA dính đáy (mobile) & Footer
Thanh 64 px: Gọi · Zalo (zalo.me) · Nhận tư vấn, có `env(safe-area-inset-bottom)`; ẩn khi menu hoặc bộ lọc đang mở;
footer chừa khoảng đệm cuối bằng chiều cao thanh. Footer nền `surface-dark`, **không có khối pháp lý**:
giới thiệu ngắn + liên hệ, Khám phá, Ứng dụng (chỉ ứng dụng), mạng xã hội dạng hàng icon SVG có `aria-label`; hàng cuối:
bản quyền + "Chính sách bảo mật", thẳng lưới. Chữ trên nền tối ≥ 4,5:1.

### Khu vực
Hai cấp Vùng → Tiểu khu (danh sách ở `docs/KHU-VUC.md`). Thẻ hiện cấp cụ thể nhất; bộ lọc chọn được cả hai cấp.
Địa chỉ dùng phường/xã mới, có thể kèm "(trước đây …)".

## Do's and Don'ts

### Do
- Ảnh thật/phối cảnh có bản quyền, ghi "Ảnh phối cảnh minh họa – nguồn: CĐT".
- Mỗi con số giá/tiến độ/pháp lý đi kèm ngày cập nhật và nguồn.
- Icon nét mảnh SVG (Lucide), cùng độ dày 1,5 px; icon thương hiệu mạng xã hội từ Simple Icons (CC0).
- Hiệu ứng hiện dần 250–400 ms một lần mỗi khối; ảnh phóng 1,03 khi rê thẻ; View Transitions khi trình duyệt hỗ trợ.

### Don't
- Không parallax nặng, video nền tự chạy trên mobile, slider tự chuyển, kính mờ diện rộng, popup che trang.
- Không bộ đếm cần JavaScript mới hiện số; không emoji làm icon; không ảnh stock chung chung.
- Không dùng champagne cho chữ nhỏ trên nền sáng; không dùng màu logo làm màu giao diện.
- Không thêm thư viện JS (jQuery, slider, animation library).

## Responsive Behavior

### Breakpoints
375 (mobile) · 768 (tablet) · 1024 (desktop nhỏ, điểm chuyển header) · 1280 (lưới 3–4 cột, mục lục bên cạnh) · 1440.
Kiểm thử ở 360, 390, 430, 768, 1024, 1366, 1920 px + 1023/1025 quanh điểm chuyển header.

### Touch Targets
≥ 44 × 44 px; khoảng cách giữa hai vùng bấm ≥ 8 px.

### Collapsing Strategy
Lưới thẻ 4/3 → 2 → 1 cột; thông tin nhanh 6 → 3 → 2 cột; bảng thông số thành thẻ; bảng so sánh cuộn ngang; bộ lọc thu vào
`<dialog>`; form dính bên phải (desktop) chuyển thành thanh CTA đáy (mobile).

### Image Behavior
`srcset` nhiều kích thước, AVIF/WebP, lazy-load trừ ảnh đầu trang (`fetchpriority="high"`), ảnh đầu trang ≤ 150 KB.

## Ngân sách hiệu năng
LCP ≤ 2,0 s (đo lại ngày ra mắt khi bật LiteSpeed; số đo ở staging tắt cache chỉ để tham khảo – 2026-11-06) · CLS ≤ 0,05 · INP ≤ 200 ms · JS ban đầu ≤ 60 KB nén · CSS ≤ 50 KB · font ≤ 3 file.

## Iteration Guide
Sửa token ở phần đầu file này rồi chạy `python3 -I tools/build_theme_json.py` để sinh lại `theme/velis/theme.json`.
Không sửa tay màu/cỡ chữ/khoảng cách trong `theme.json` hay CSS.

## Known Gaps
- Vòng 2026-11-05 ("Quy tắc bố cục"): front-matter đã đổi theo thang mới nhưng **chưa sinh lại `theme/velis/theme.json`**
  (vòng này không sửa theme) – làm ở Bước 3 bằng `python3 -I tools/build_theme_json.py` (đã chạy thử trên bản sao: chạy được).
- Be Vietnam Pro 500 bị lược để giữ giới hạn 3 file font (đã chốt 400/600).
- Playfair Display không có ký tự ₫; giá luôn viết bằng Be Vietnam Pro.
- Đối chiếu ui-ux-pro-max: gợi ý Glassmorphism, bảng màu teal và Cinzel/Josefin Sans bị loại (không hợp nhận diện; Cinzel
  không có tiếng Việt). Giữ checklist trước khi giao: không emoji làm icon, hover 150–300 ms, tương phản 4,5:1, focus rõ,
  reduced-motion, kiểm 375/768/1024/1440.
