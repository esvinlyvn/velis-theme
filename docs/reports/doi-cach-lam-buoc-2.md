# Đổi cách làm – Bước 2: mockup HTML tĩnh 3 trang

Ngày 2026-11-05. Nhánh `claude/doi-cach-lam-b2`. **Không sửa theme, không ghi gì lên staging** (chỉ đọc 4 URL qua cổng mật
khẩu xem + REST GET). Site thật không đụng tới.

## 1. Kết quả

| Mục | Kết quả |
|---|---|
| 3 file tự chứa | `mockup/dist/trang-chu.html` 4,5 MB · `the-global-city.html` 9,2 MB · `masteri-park-place.html` 2,5 MB (≤ 12 MB; CSS, JS, font, logo, ảnh nhúng data URI; build tự kiểm không còn tham chiếu mạng) |
| Mở | tải file về, mở bằng trình duyệt. Công tắc ở cuối trang hoặc tham số URL: `?hero=a` (mặc định B), `?tam=0` (ẩn nhãn ảnh tạm), `?trang-thai=menu`, `?trang-thai=loi-form` |
| Bộ đo NT (máy) | **0 lỗi** – 3 trang × 2 kiểu hero × 11 màn (M1–M5, 360, 430, 768, 1024 + 2 màn đổi DPR) – `screenshots/mockup-b2/kiem-tra/bang-nt.md` |
| check_ui (tương phản, vùng bấm, tràn, CLS) | **0 lỗi** ở 7 khung 360–1920 × 3 trang × A/B; CLS lớn nhất 0,0095 |
| Tương tác | **13/13 đạt** (`tools/mockup_interactions.mjs`) |
| Tương phản hero A (5 điểm/dòng) | **đạt mọi điểm**, thấp nhất 8,47 : 1 (The Global City, M3) |
| CSS (X-07) | **22,5 KB min · 5,4 KB gzip** (≤ 45 / ≤ 12), không `!important` (build tự kiểm) |
| Test | `node --test tools/tests/ui-media.test.mjs` 7/7 (thêm 2 test cho NT-47/48, NT-66/67) |
| Soát mắt | **4 điểm không đạt / lệch cần người dùng chọn**: NT-10 (dải nổi bật), NT-13 (khối tối trang chủ/MPP), NT-23 (3 ảnh còn logo), NT-43 (độ sáng ảnh hero A ↔ NT-47); NT-44 lệch vì NT-48 – mục 5 |

## 2. Mã nguồn

```
mockup/src/css/1-tokens.css      biến DESIGN.md (màu, chữ, khoảng cách, khung) + @font-face woff2 của theme
mockup/src/css/2-base.css        phần tử, không class
mockup/src/css/3-layout.css      wrap, section, trang 2 cột + cột phải dính, lưới theo số thẻ (data-n), rail, split
mockup/src/css/4-components.css  nút, header/menu, breadcrumb, thanh mục, hero A/B, thanh thông tin, thẻ, dải nổi bật,
                                 số liệu, chủ đầu tư, văn bản dài + "Đọc tiếp", bảng, thư viện, bản đồ, hộp "Nằm trong",
                                 thẻ bảng giá, FAQ, form, footer, CTA đáy, nhãn ảnh tạm + phóng cắt ảnh có dấu
mockup/src/css/5-utilities.css   sr-only, vài tiện ích, công tắc mockup (.mk – không đưa vào theme)
mockup/src/js/mockup.js          menu <dialog>, tô mục đang xem, "Đọc tiếp", thư viện bấm tay, lọc phân khu, lỗi form,
                                 CTA đáy ẩn/hiện, công tắc mockup
mockup/src/pages.mjs             markup 3 trang (chuỗi mẫu JS thuần) từ data/*.json + content/*.html
mockup/src/{data,content,img}    nguyên văn + ảnh lấy từ staging ngày 2026-11-05 (tools/mockup_extract.mjs, chỉ đọc)
tools/build_mockup.mjs           → mockup/dist/*.html (nhúng mọi thứ; srcset 300/600/1200; sizes theo X-01; cắt theo X-03)
```

Tên class theo khối (BEM gọn: `.card`, `.card__media`, `.hero--a`), không phụ thuộc tiền tố `v-` của theme để bước 3 đổi
tên một lần. Lệnh: `node tools/build_mockup.mjs` (in cỡ file + cỡ CSS).

## 3. Khung hero B (khung có lề) – tính độ giãn

Ảnh tạm lớn nhất là file 1200 px. Ảnh hero cả 3 trang đều có dấu VELIS nên bị phóng cắt ×1,15 (X-03). Khung B **luôn rộng hơn
tỉ lệ ảnh** (khung ≥ 2:1, ảnh 1,39–1,78) → ảnh phủ theo **chiều rộng**, độ giãn = rộng khung × DPR × 1,15 / 1200.

| Màn | Rộng khung B | Độ giãn B | (so với A tràn: rộng màn) |
|---|---|---|---|
| M1 1366×768 DPR 1 | 1120 | **1,07** | 1,31 |
| M2 1536×864 DPR 1,25 | 1120 | **1,34** | 1,84 |
| M3 1920×1080 DPR 1 | 1120 | **1,07** | 1,84 |
| M4 960×540 DPR 2 | 760 | **1,46** | 1,84 |
| M5 390×844 DPR 2 | 358 | **0,69** | 0,75 |

Quy tắc khung: ≥ 1024 px rộng `min(100% − 2 lề, 1120)`; 768–1023 px `760`; < 768 px cả bề rộng trừ lề. Cao
`clamp(320px, 100svh − 380px, 560px)` để tiêu đề nằm trong màn hình đầu M1 (bề rộng không đổi theo DPR → bố cục giống nhau ở
mọi DPR; NT-01 đo 0 lệch). Kiểu A vượt 1,5 ở M2–M4 nên chỉ dùng khi có file ≥ 1920 px (X-02).

## 4. Bộ đo

### 4.1 NT × trang × hero × màn

Bảng đầy đủ (mỗi NT một hàng × 6 cột trang/hero × 11 màn): `screenshots/mockup-b2/kiem-tra/bang-nt.md`. Tóm tắt: **mọi ô = 0**.

| NT | Cách đo | Lỗi |
|---|---|---|
| NT-01 bố cục bất biến theo DPR | hộp mọi ảnh/khối M1↔1366@2, M5↔390@1 | 0 |
| NT-02 tràn ngang · NT-03 khoảng trống · NT-04 khối trống | mediaAudit + check_ui | 0 |
| NT-07, NT-08 ô trống lưới · NT-09 dải nổi bật cao đều | mediaAudit | 0 |
| NT-20 ảnh hỏng · NT-21 chọn đúng file (X-01 = d) · NT-24 khung dự phòng có tên · NT-25 khung không ảnh | mediaAudit + layoutAudit | 0 |
| NT-28 bản đồ thẳng cột chữ · NT-53 bảng ≥ 2 hàng · NT-54 meta không ngắt "phút" | mediaAudit | 0 |
| NT-55 heading viết hoa · NT-56 đúng 1 H1 | mediaAudit | 0 |
| **NT-47** lớp phủ hero A | `heroAudit`: 1 lớp linear trái→phải (+1 dọc), phủ đủ khung, không radius/blur/radial/shadow; mobile không phủ, chữ dưới ảnh | 0 |
| **NT-48** không hộp nền chữ hero | `heroAudit`: nền + bóng mọi phần tử chữ trong hero | 0 |
| **NT-66** thanh thông tin không cắt | `factsAudit`: không "…", không cắt, ≤ 3 dòng, ≤ 1 "Chi tiết" và có khối đích | 0 |
| **NT-67** chia hàng thanh thông tin | `factsAudit`: ô/hàng theo khung, 2 hàng đều, không ô trống, ô ≥ 240 px, ô cùng hàng cao bằng nhau | 0 |
| NT-85 tương phản · NT-86 vùng bấm ≥ 44 · NT-91 CLS | check_ui 7 khung | 0 · 0 · ≤ 0,0095 |
| NT-57 Đọc tiếp · NT-72 thanh mục · NT-75 thư viện · NT-76 form · NT-77 lọc · NT-79 menu + CTA · NT-80 breadcrumb · NT-87 focus | `tools/mockup_interactions.mjs` | 13/13 đạt |

Đổi trong bộ đo (dùng chung cho theme ở bước 3): `ui_media.mjs` nhận cả class mockup, đo được ảnh data URI (tên file từ
`data-file`), NT-21 theo X-01 = d (ảnh LCP `fetchpriority=high` cần file ≥ khung × DPR; ảnh khác cần đúng file Chromium chọn
cho nhu cầu thật), thêm `heroAudit`, `factsAudit`; `check_ui.mjs` nhận `BASE_URL` và chạy không cần mật khẩu khi đo máy local;
`ui_layout.mjs` nhận class mockup. Test cũ vẫn đạt.

### 4.2 NT không áp dụng cho trang tĩnh (lý do)

| NT | Lý do |
|---|---|
| NT-10 (ảnh thật 4 thẻ dải nổi bật – phần tương tác) · NT-70 mega menu · NT-71 header ẩn/hiện khi cuộn · NT-73 tab dòng sản phẩm · NT-74 điền sẵn dòng SP · NT-78 tìm kiếm | hành vi của theme/WordPress, mockup không dựng (giữ nguyên ở bước 3) |
| NT-12 thứ tự section trang dự án | đã giữ thứ tự template; đo bằng tay, xem mục 6 |
| NT-22, NT-35 ảnh nguồn đủ chuẩn | mọi ảnh là ảnh tạm 1200 px (biết trước là thiếu, có nhãn "ảnh tạm") |
| NT-26 alt/width/height/lazy/fetchpriority | áp dụng một phần: build sinh đủ; bước 3 đo trên theme |
| NT-30 mặt bằng phóng to, NT-37 chú thích ảnh | chưa có dữ liệu mặt bằng căn / chú thích trên 3 trang này |
| NT-32, NT-40 chọn kiểu hero ở server | mockup chọn bằng công tắc; server chọn ở bước 3 |
| NT-33 tiêu điểm 9 vị trí | chưa có trường tiêu điểm (bước 3); mockup dùng giữa ảnh |
| NT-51, NT-52 ẩn khối thiếu dữ liệu | dữ liệu cố định; ô Giá "Chưa công bố" đã có |
| NT-60–NT-65 bài viết | không có trang bài viết trong bước 2 |
| NT-88, NT-90 Lighthouse | chạy để tham khảo (mục 4.4) – file tự chứa 2,5–9,2 MB không đại diện hiệu năng thật |
| NT-92, NT-93, NT-95 dung lượng ảnh | ảnh nhúng trong HTML, không đo được như tải thật |
| NT-100–NT-102 SEO, NT-130–NT-135 ra mắt, NT-110–NT-114 thiết bị, NT-120 | không áp dụng cho mockup (mockup `noindex`) |

### 4.3 Tương phản chữ trên hero A – 5 điểm nền mỗi dòng

Cách đo (`tools/mockup_contrast.mjs`): làm trong suốt chữ + viền chip, chụp khung hero, đọc màu nền tại 10/30/50/70/90 % bề
rộng mỗi dòng (giữa dòng), so màu chữ theo WCAG. Ảnh sáng nhất (trời) là Masteri Park Place – đã gồm. Đủ dữ liệu từng dòng:
`screenshots/mockup-b2/kiem-tra/tuong-phan-hero-a.json`.

| Trang | Màn | Dòng | Điểm | Thấp nhất | Dòng thấp nhất | 5 điểm của dòng đó |
|---|---|---|---|---|---|---|
| trang-chu | M1 | 9 | 45 | 11,14 | VELIS REALTY | 12,61 / 11,44 / 12,29 / 11,14 / 11,79 |
| trang-chu | M2 | 9 | 45 | 10,22 | VELIS REALTY | 11,12 / 10,22 / 10,58 / 10,84 / 11,44 |
| trang-chu | M3 | 9 | 45 | 10,30 | VELIS REALTY | 12,28 / 13,35 / 12,77 / 10,30 / 10,43 |
| trang-chu | M4 | 11 | 55 | 9,19 | Tư vấn bất động sản cao cấp | 13,06 / 12,32 / 11,42 / 10,74 / 9,19 |
| trang-chu | M5 | 11 | 55 | 13,50 | (nền liền, không phủ) | 13,50 × 5 |
| the-global-city | M1 | 5 | 25 | 8,91 | MASTERISE HOMES · NAM RẠCH CHIẾC | 10,01 / 9,73 / 9,55 / 9,28 / 8,91 |
| the-global-city | M2 | 5 | 25 | 8,62 | idem | 9,87 / 9,69 / 9,55 / 9,87 / 8,62 |
| the-global-city | M3 | 5 | 25 | **8,47** | idem | 10,36 / 11,52 / 10,06 / 9,16 / 8,47 |
| the-global-city | M4 | 5 | 25 | 8,77 | idem | 10,17 / 9,85 / 9,57 / 9,09 / 8,77 |
| the-global-city | M5 | 5 | 25 | 13,50 | (nền liền) | 13,50 × 5 |
| masteri-park-place | M1 | 5 | 25 | 11,33 | MASTERISE HOMES · NAM RẠCH CHIẾC | 12,85 / 11,63 / 11,58 / 11,69 / 11,33 |
| masteri-park-place | M2 | 5 | 25 | 10,34 | Masteri Park Place | 16,84 / 15,98 / 12,86 / 11,37 / 10,34 |
| masteri-park-place | M3 | 5 | 25 | 8,68 | MASTERISE HOMES · NAM RẠCH CHIẾC | 11,23 / 8,95 / 12,07 / 8,68 / 9,59 |
| masteri-park-place | M4 | 5 | 25 | 11,55 | idem | 11,91 / 11,70 / 11,80 / 11,55 / 11,68 |
| masteri-park-place | M5 | 5 | 25 | 13,50 | (nền liền) | 13,50 × 5 |

Ngưỡng 4,5 : 1 – **đạt mọi điểm (565 điểm)**. Chữ nằm trong 0–40 % bề rộng (giới hạn `min(560px, 40vw)`), nơi lớp phủ còn
78–86 % đen; vùng ảnh bên phải (≥ 76 %) giữ độ sáng gốc. Ghi chú: khi đo, thanh CTA đáy (cố định ở < 1024 px) được ẩn vì ở M4
nó che đáy hero – không phải lỗi tương phản.

### 4.4 Lighthouse local (tham khảo)

| Trang | Hero | Dạng | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|---|
| trang-chu | A | mobile | 54 | 100 | 96 | 54 | 23,7 s | 0,000 | 118 ms |
| trang-chu | A | desktop | 61 | 100 | 100 | 54 | 3,9 s | 0,001 | 5 ms |
| trang-chu | B | mobile | 55 | 100 | 100 | 54 | 23,8 s | 0,000 | 74 ms |
| trang-chu | B | desktop | 61 | 100 | 100 | 54 | 3,9 s | 0,005 | 7 ms |
| the-global-city | A | mobile | 51 | 100 | 100 | 54 | 47,9 s | 0,000 | 223 ms |
| the-global-city | A | desktop | 55 | 100 | 100 | 54 | 7,8 s | 0,003 | 29 ms |
| the-global-city | B | mobile | 50 | 100 | 100 | 54 | 47,9 s | 0,000 | 249 ms |
| the-global-city | B | desktop | 55 | 100 | 100 | 54 | 7,8 s | 0,006 | 45 ms |
| masteri-park-place | A | mobile | 55 | 100 | 100 | 54 | 13,6 s | 0,000 | 66 ms |
| masteri-park-place | A | desktop | 76 | 100 | 100 | 54 | 2,3 s | 0,003 | 0 ms |
| masteri-park-place | B | mobile | 55 | 100 | 100 | 54 | 13,6 s | 0,000 | 27 ms |
| masteri-park-place | B | desktop | 76 | 100 | 100 | 54 | 2,3 s | 0,006 | 0 ms |

Đọc đúng: **Perf thấp vì cả trang là một file HTML 2,5–9,2 MB** (ảnh nhúng data URI – yêu cầu "tự chứa"); LCP mô phỏng 3G
tính cả thời gian tải hết file. Không dùng để so với theme. SEO 54 là do mockup cố ý `noindex` và không có meta description.
A11y 100 ở mọi lượt; BP 100 trừ trang chủ hero A mobile (96, "errors-in-console" – lặp lại ở 2 lần chạy Lighthouse nhưng Playwright mô phỏng mobile không bắt được lỗi nào; chưa rõ nguyên nhân).

## 5. Soát mắt (NT soát mắt áp dụng được)

Soát trên ảnh chụp mục 8 (đã xem bằng mắt từng ảnh dẫn chứng). **Không đạt / lệch được ghi thẳng, chưa sửa** – cần người dùng
chọn hướng.

| NT | Kết luận | Dẫn chứng | Ghi chú |
|---|---|---|---|
| NT-05 khung 1200/1320, lề 16/24/32, khung đọc 720 | đạt | `man-dau/trang-chu-a-M3.jpg` (nội dung 300–1620 px = 1320), `ca-trang/the-global-city-b-M1.jpg` | |
| NT-10 dải dự án nổi bật | **lệch** | `man-dau/trang-chu-a-M3.jpg` | 5 thẻ cùng hàng ở ≥ 1024 px (không trượt, không mũi tên); khu vực **xuống dòng** thay vì 1 dòng "…" vì "Nhơn Trạch – Lo…" mất nghĩa. Đề xuất sửa chữ NT-10 theo mockup; nếu không duyệt, bước 3 làm đúng NT-10 cũ |
| NT-11 nhịp section, đầu mục eyebrow → H2 → dẫn → kẻ champagne | đạt | `ca-trang/trang-chu-b-M1.jpg` | |
| NT-13 ≥ 1 khối nhấn tối mỗi trang | **không đạt** ở trang chủ và MPP khi hero B | `ca-trang/masteri-park-place-b-M1.jpg` | TGC có Thư viện nền tối; trang chủ/MPP chỉ có footer tối. Đề xuất: khối "Về Velis" (trang chủ) và "Nằm trong The Global City" (MPP) nền tối, hoặc tính footer |
| NT-15 khối Nhận tư vấn 2 cột cân | đạt | `ca-trang/trang-chu-b-M1.jpg` | |
| NT-16 2 cột + cột phải dính 340 px ≥ 1024; < 1024 một cột + CTA đáy | đạt | `can-canh/trang-thai-tab-vi-tri-M1.jpg`, `man-dau/the-global-city-b-M4.jpg` | |
| NT-23 không dấu / logo in sẵn | **không đạt 3 ảnh** | `ca-trang/the-global-city-b-M1.jpg` (thẻ Masteri Grand View) | phóng cắt che huy hiệu VELIS ở 25 file; còn logo "MASTERI" giữa ảnh Grand View, logo TGC/Masterise ở ảnh shophouse (thư viện), huy hiệu trên mặt bằng (không cắt) – AUDIT mục 9 |
| NT-27 thư viện | đạt | `ca-trang/the-global-city-b-M1.jpg`, `ca-trang/the-global-city-b-M5.jpg` | nền khung tối, mặt bằng `contain`, mũi tên + "1/11", mobile lộ ảnh kế |
| NT-31 ảnh hero/thẻ không chữ đè | đạt | `man-dau/*` | |
| NT-36 hộp "Nằm trong" có ảnh | đạt | `ca-trang/masteri-park-place-b-M1.jpg` | |
| NT-41 chuyển sắc liền, không cạnh | đạt | `can-canh/lop-phu-the-global-city-M2.jpg`, `…-M3.jpg`, `can-canh/lop-phu-masteri-park-place-M2.jpg`, `…-M3.jpg` | không thấy biên trên nền trời MPP |
| NT-43 ≥ 60 % ảnh giữ độ sáng gốc | **không đạt** | `man-dau/masteri-park-place-a-M1.jpg` | lớp phủ về 0 ở 76 % bề rộng → ~25–30 % ảnh giữ sáng gốc. Xung đột với NT-47 (1 lớp phủ cả khung) + tương phản 5 điểm: chữ chạy tới ~45 % bề rộng ở M3. Chọn: (a) nới NT-43 còn ≥ 25 %, (b) thu khối chữ ≤ 30vw rồi kéo lớp phủ về 0 ở 40 % |
| NT-44 thành phần hero | **lệch** | `man-dau/the-global-city-a-M1.jpg` | breadcrumb không có "nền nhỏ riêng" (NT-48 mới cấm hộp nền – theo NT-48); 2 chip vì dữ liệu chỉ có 2; hero A cao ~74vh ở M1 (không phải ~60vh) để chữ + nút vừa; mobile ảnh 4:3 trên, chữ trên nền đặc – đạt |
| NT-46 bài test 5 giây | đạt | `man-dau/*-M1.jpg` | trang chủ: Velis (eyebrow + H1) · tư vấn BĐS cao cấp · sản phẩm (đoạn dẫn + dải dự án) · 2 nút; dự án: tên + chủ đầu tư · khu vực + chip + "Nhận bảng giá" |
| NT-50 thẻ | đạt | `ca-trang/trang-chu-b-M1.jpg` | ảnh 4:3, cả thẻ bấm được, 1 link đáy |
| NT-51, NT-64 | không áp dụng | | dữ liệu cố định; không có trang bài viết |

Trạng thái nhìn thấy: menu mobile mở `can-canh/trang-thai-menu-M5.jpg` · thanh mục đang "Vị trí & tiện ích"
`can-canh/trang-thai-tab-vi-tri-M1.jpg` · FAQ câu đầu mở `can-canh/trang-thai-faq-mo-M1.jpg` · lỗi form (3 ô)
`can-canh/trang-thai-loi-form-M5.jpg` (header + thanh mục dính vẫn hiện – không ẩn phần dính khi chụp).

## 6. Thay đổi so với theme hiện tại (và so với nội dung staging)

Mọi chữ là nguyên văn staging (ngày 2026-11-05). Những chỗ khác cấu trúc:

| # | Thay đổi | Trang | Vì sao |
|---|---|---|---|
| 1 | Hero có 2 kiểu cùng cấu trúc chữ/nút: A tràn (1 lớp chuyển sắc trái → phải + lớp dọc nhẹ ở đáy), B khung có lề, chữ ngoài ảnh (mặc định) | cả 3 | X-02, mục 2.3–2.4 |
| 2 | Breadcrumb + thanh mục nằm **trên** hero (không đè lên ảnh); thanh mục bám khung nội dung, không kéo dãn | TGC, MPP | Berkeley; NT-48; thanh MPP ngắn (4 mục) |
| 3 | Thanh thông tin chia hàng theo số ô (TGC 8 ô 4+4, MPP 6 ô 3+3), giá trị đầy đủ, thêm ô **Giá: Chưa công bố**, "Chi tiết" 1 lần (Vị trí → mục Vị trí) | TGC, MPP | NT-66/67, X-05 |
| 4 | MPP: bỏ ô "Sản phẩm: Căn hộ" khỏi thanh (đã có ở chip hero và thẻ bảng giá) để thanh đủ 6 ô | MPP | yêu cầu "6 ô" |
| 5 | Ô Pháp lý TGC dùng giá trị trường `velis_legal` bỏ tiền tố "Hình thức sở hữu:" (nhãn ô đã nói) – không viết câu mới | TGC | ≤ 3 dòng ở 360 px |
| 6 | Ô Bàn giao TGC dùng bản ngắn có sẵn "Từ tháng 11/2023" (chip hero / thẻ bảng giá); bản dài ở mục Tổng quan | TGC | NT-66 |
| 7 | Trang chủ thêm **lưới dự án** (6 thẻ, dữ liệu thẻ của `/du-an/`) với tiêu đề ghép từ nhãn có sẵn "Dự án đang tư vấn"; dải nổi bật (ảnh nhỏ + tên + khu vực) ngay dưới hero | trang chủ | mục 2.7, Berkeley |
| 8 | Thẻ kiểu Aman: ảnh lớn, không viền, nhãn (chủ đầu tư · khu vực) + tên Playfair + 1–2 dòng + 1 link; cả thẻ bấm được | cả 3 | Aman, NT-50 |
| 9 | Khung dự phòng có tên cho Palm City, Masteri Cosmo Central, Thấp tầng (không ảnh) | trang chủ, TGC | NT-24 |
| 10 | Bảng so sánh MPP bỏ cột lặp phân khu đang xem; cột đang xem tô nền + "(trang này)" | MPP | lỗi mẫu – ghi AUDIT mục 9 |
| 11 | Thẻ bảng giá TGC bỏ cặp dòng lặp | TGC | lỗi mẫu – ghi AUDIT mục 9 |
| 12 | Mục Vị trí TGC: 1 bản đồ (bản đồ OSM khu Nam Rạch Chiếc của staging, đang dùng ở MPP) + địa chỉ + "Xem trên Google Maps"; bỏ ảnh bản đồ trong văn bài cũ (`vi-tri-the-global-city.webp`, có dấu) | TGC | NT-34 |
| 13 | Mục "Tiến độ & pháp lý" thêm dòng Pháp lý lấy từ trường `velis_legal` (tên tab có "pháp lý" nhưng khối cũ chỉ có tiến độ) | TGC | khớp tên tab |
| 14 | Video YouTube trong mục Tiến độ (ảnh `hqdefault`) → khung có tên "Video tiến độ (YouTube – không nhúng trong mockup)" | TGC | file tự chứa, không tải mạng |
| 15 | Heading trong văn bài cũ hạ H2 → H3 (dưới H2 của mục) | TGC | NT-56/heading |
| 16 | Bài viết TGC hiện 6/7 bài + link "Tất cả bài The Global City" | TGC | lưới 3 cột không ô trống (NT-07) |
| 17 | Bộ lọc phân khu: giữ chip theo loại (Căn hộ / Biệt thự / Dinh thự / Shophouse / Xóa lọc) + "Hiển thị n/5"; **chưa dựng** chế độ "Theo loại sản phẩm" | TGC | rút gọn mockup – bước 3 giữ của theme |
| 18 | CTA đáy mobile ẩn ở đầu trang, hiện khi cuộn qua nút hero | cả 3 | NT-79 (giống theme) |
| 19 | Ảnh có dấu VELIS phóng ×1,15 neo phải-trên (X-03 = a, chỉ ảnh có cờ: 25/27 file); mặt bằng không cắt | cả 3 | X-03 |
| 20 | Nhãn "ảnh tạm" (hero: "ảnh tạm – ảnh thật sẽ nét") ở góc phải-trên mọi ảnh, bật/tắt bằng công tắc | cả 3 | mục 2.6 |

## 7. Học từ đâu

| Chi tiết | Aman | Berkeley | DESIGN.md | Quyết định |
|---|---|---|---|---|
| Khoảng trắng rộng, nhịp section 96/64 px | ✓ | | ✓ (nhịp) | |
| Ảnh lớn trong khung có lề, chữ ngoài ảnh (hero B) | ✓ | | | X-02 = b |
| Thẻ không viền: nhãn + tên serif + 1–2 dòng + 1 link | ✓ | | ✓ (Playfair tên) | X-05 = a (không dòng giá) |
| Header tối giản (logo · 5 mục · hotline ≥ 1280 · 1 nút) | ✓ | | ✓ | |
| Trang dự án ưu tiên thông tin: breadcrumb → thanh mục → ảnh → tên/khu vực/chủ đầu tư → thanh thông tin có Giá "Chưa công bố" → "Nhận bảng giá" + gọi | | ✓ | | X-05 |
| Dải dự án dưới hero trang chủ (ảnh nhỏ + tên + khu vực) | | ✓ | | NT-10 |
| Màu đỏ #B8282E, champagne #B08D57, nền #FAF8F5, logo SVG theme, Playfair Display + Be Vietnam Pro (woff2 theme) | | | ✓ | |
| Lớp phủ 1 dải chuyển sắc trái → phải, không mảng | | | | mục 2.4, NT-47 |
| Ảnh chọn theo khung × DPR, LCP chặt | | | | X-01 = d |
| Cắt chỉ ảnh có cờ | | | | X-03 = a |
| Lưới không ô trống (số cột theo số thẻ) | | | | X-06 = b |
| CSS ≤ 45 KB / 12 KB gzip | | | | X-07 = b |
| Ma trận M1–M5 cho ảnh chụp, 7 khung cho đo máy | | | | X-08 = a |

Không chép nhận diện của Aman/Berkeley (không font, màu, logo, ảnh, câu chữ).

## 8. Ảnh chụp

`screenshots/mockup-b2/`:
- `man-dau/<trang>-<a|b>-<M1..M5>.jpg` – màn hình đầu (30 ảnh)
- `ca-trang/<trang>-<a|b>-<M1..M5>.jpg` – cả trang, cuộn thật, chờ ảnh, giữ phần dính (30 ảnh; thu về rộng ≤ 1000 px)
- `can-canh/lop-phu-<the-global-city|masteri-park-place>-<M2|M3>.jpg` – 600×400 ranh giới lớp phủ hero A
- `can-canh/thanh-thong-tin-mpp-<M1|M2|1024|M5>.jpg` – thanh thông tin MPP
- `can-canh/trang-thai-*.jpg` – menu mobile mở, thanh mục đang ở "Vị trí", FAQ mở, lỗi form
- `kiem-tra/bang-nt.md`, `kiem-tra/ket-qua.json`, `kiem-tra/tuong-phan-hero-a.json`

---
Đã bỏ qua / chưa kiểm tra: Safari/iPhone thật, DPR 1,5; Lighthouse không đại diện (file tự chứa); chế độ lọc "Theo loại sản phẩm", mega menu, header ẩn khi cuộn không dựng trong mockup.
Rủi ro: soát mắt còn 4 điểm chờ quyết (NT-10/13/23/43); ảnh tạm 1200 px vẫn mờ ở hero A M2–M4 (đúng như nhãn); 3 ảnh có logo/chữ in sẵn ngoài huy hiệu (AUDIT mục 9) cần file gốc sạch; nhánh xếp chồng trên PR #5/#6 chưa merge.
