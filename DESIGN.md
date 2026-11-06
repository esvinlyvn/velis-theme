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
  h1: { fontFamily: heading, fontWeight: 600, desktop: 56px, mobile: 36px, lineHeight: 1.1 }
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
| h1 | Playfair 600 | 56 / 36 px | 1,1 |
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
- Dòng chữ tối đa 68 ký tự **đếm thật** (1.6): chữ Việt hẹp hơn ký tự "0" nên `max-width: 46ch` (≈ 66–68 ký tự); khung đọc bài 720 px.
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

**1.5 Nhịp nền** (sửa 2026-11-06). Xen kẽ ngà #FAF7F2 và trắng; hai khối liền nhau không cùng nền trừ khi có tiêu đề ngăn. **Nền tối
(#111111) chỉ dùng cho thư viện ảnh và khối form tư vấn** (ngay trước footer). Footer nền khác (#1A1A1A) + đường champagne 1 px ở
mép trên. Dải "Thi thử + Tuyển dụng" nền champagne nhạt #F3ECDF để tách rõ khỏi khối tối. Hero trang chủ (ảnh + lớp phủ) không
phải khối nền.

**1.6 Chữ và đường kẻ.** Dòng ≤ 68 ký tự (đếm từng ký tự trên dòng hiển thị, bỏ dấu cách ở chỗ xuống dòng – `tools/mockup_scale.mjs`).
Dùng khoảng trắng thay đường kẻ; viền chỉ cho thẻ và ô nhập. Được giữ: gạch champagne 48 px dưới tiêu đề khối (dấu nhấn NT-11),
vạch dọc mảnh giữa các cột số liệu (yêu cầu khối b), đường kẻ dòng của bảng dữ liệu và thanh thông tin dự án (1 đường dưới mỗi hàng).

**1.7 Nút, thẻ, icon.** Nút chính đỏ đặc, nút phụ viền; mọi thẻ cùng bo góc 2 px và cùng padding; icon mảnh champagne hoặc không có.

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
Phẳng là mặc định. Chỉ hai bóng: `card-hover` (thẻ khi rê chuột) và `sticky-cta` (thanh CTA dính đáy). Không blur diện rộng,
không kính mờ.

## Shapes
- Bo góc 2 px cho nút, thẻ, ô nhập; **0 px cho ảnh lớn** (hero, thư viện) – góc vuông tạo cảm giác kiến trúc.
- Pill (999 px) chỉ cho chip dòng sản phẩm và nhãn trạng thái.
- Tỉ lệ ảnh cố định: 16:9 hero và ảnh bài viết, 4:3 thẻ, 1:1 ảnh đại diện; luôn khai báo `width`/`height`.

## Components
Mỗi thành phần có trạng thái hover, focus (viền 2 px `ink`, lệch 2 px), disabled (nền `hairline`, chữ `body-muted`, ≥ 3:1)
và bản mobile. Tất cả được trưng bày ở trang style guide trên staging, với dữ liệu thật của site (The Privé, Vinhomes Saigon Park).

### Buttons
Chính (đỏ, chữ trắng) · Phụ (viền đen, hover nền đen) · Viền trắng (trên ảnh hero) · Dạng chữ (đỏ, gạch chân khi hover).
Cao tối thiểu 48 px (vùng bấm ≥ 44 × 44). Đổi màu 150–200 ms.

### Hero (đã chốt)
- **Trang chủ (duyệt: người dùng, 2026-11-06): giữ hero staging 0.9.8** – ngoại lệ có chủ đích của X-02: trang chủ luôn hero tràn,
  kể cả ảnh 1200 px. Ảnh tràn (The Privé, phóng cắt 1,12), nhãn "Velis Realty", H1 "Tư vấn bất động sản cao cấp tại TP.HCM và vùng
  lân cận" (khối chữ rộng 600 px, thẳng mép trái khung), đoạn dẫn, 2 nút ("Nhận tư vấn" đỏ, "Xem dự án" viền trắng), dải "Dự án
  nổi bật" ở đáy hero. Mobile: ảnh ở trên, chữ trên dải tối liền màu. **Chỉ 2 điểm khác 0.9.8:** (a) **một** lớp chuyển sắc tuyến
  tính trái → phải phủ toàn khung (cấm mảng phủ riêng, bo góc, blur, radial, hộp nền sau nhãn / chữ), chữ ≥ 4,5:1 tại 5 điểm /
  dòng; (b) thẻ trong dải cao bằng nhau ±1 px, tên dự án 1 dòng (không bẻ, không "…"), khu vực được xuống dòng, tối đa 4 thẻ trong
  khung, trượt bằng mũi tên / vuốt, không tự chạy. Ảnh hero khác ảnh thẻ đầu tiên của lưới dự án, không có chữ / biển in sẵn
  (ảnh Ansana – tên đường trong cảnh – chỉ dùng ở thẻ / nội dung).
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
- **Con số** 10+ · 50+ · 999+ · 99+ (dấu + sau số), dải trắng 4 cột, Playfair 48 champagne đậm.
- **Dự án**: 1 hàng tab khu vực (chọn một), lưới 3 × 2, thẻ thiếu ảnh sạch xếp cuối; "Xem tất cả dự án" giữa dưới lưới.
- **Đối tác**: căn trái như mọi khối; logo **cân theo diện tích thị giác** – mọi logo chiếm diện tích bao gần bằng nhau (±15 %),
  cao ≤ 48 px, rộng ≤ 160 px (tính từ tỉ lệ gốc của logo: rộng × cao = diện tích chung, rồi kẹp); xám đậm, hover màu gốc.
- **Giá trị khác biệt**: H2 "Công ty TNHH Velis Realty" + 2 đoạn giới thiệu nguyên văn trang cũ (đoạn dẫn), rồi 4 mục 01–04
  **2×2 dưới 1600 px, 4 cột từ 1600 px**, nút "Tìm hiểu Velis". Trang chỉ có 1 H1 (của hero).
- **Thẻ** (dự án, bài viết): link "Xem dự án" / "Đọc bài" ghim đáy thẻ – các link cùng hàng thẳng nhau ±1 px.
- **Thi thử + Tuyển dụng**: 2 hộp cùng cao; câu hộp Thi thử: "Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí."
- Trang dự án: hero B ở M4 giãn ảnh 1,52 – chấp nhận (2026-11-06).

### Bố cục 2 cột & nhịp thị giác (vòng 5)
- **Trang có văn bản dài** (dự án mọi cấp; Giới thiệu, Tuyển dụng; chính sách có mục lục): từ 1024 px là cột nội dung
  (phần còn lại) + **cột phải dính 340 px** – dự án: thẻ "Nhận bảng giá {tên}" (ảnh, trạng thái, giá nếu có, bàn giao,
  Nhận bảng giá → form điền sẵn, Gọi, Zalo); Giới thiệu: thẻ liên hệ; Tuyển dụng: thẻ "Gửi CV"; chính sách: mục lục.
  Không có gì hữu ích cho cột phải → một cột đọc 760 px canh giữa. < 1024 px: một cột + thanh CTA đáy (kể cả tablet).
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
Desktop: "Dự án" mở mega menu (chủ đầu tư → dự án, `<details>`), "Về Velis" mở menu con; một menu mở một lúc, đóng
khi bấm ra ngoài hoặc Esc. Dưới 1024 px: menu toàn màn hình `<dialog>` – hàng đầu logo + nút đóng; "Dự án" mở ra theo
chủ đầu tư, cuối danh sách có "Xem tất cả dự án →"; hotline + "Nhận tư vấn" ở cuối menu.

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
- **Listing dự án**: desktop là thanh lọc ngang gồm các ô thả xuống – Khu vực ▾ (cây Vùng → Tiểu khu), Chủ đầu tư ▾,
  Loại sản phẩm ▾ – kèm "(n)" số mục đã chọn, "Xóa lọc" và số kết quả; mỗi lúc mở một ô, đóng khi bấm ra ngoài. Mobile:
  cùng các nhóm trong ngăn kéo. Trong nhóm: khớp bất kỳ; giữa các nhóm: khớp tất cả. Chọn Vùng là chọn mọi Tiểu khu;
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
LCP ≤ 2,0 s · CLS ≤ 0,05 · INP ≤ 200 ms · JS ban đầu ≤ 60 KB nén · CSS ≤ 50 KB · font ≤ 3 file.

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
