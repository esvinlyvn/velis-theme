# The7 bước 10 – vòng hoàn thiện giao diện + UX/UI + onpage (2026-11-12)

Nguồn: soát của chủ site trên Chrome 1 536 px + 390 px (mục A–F). Chỉ ghi STAGING (nhật ký `docs/STAGING-LOG.md` mục bước 10, ID bản sửa đổi
trước `data/the7/buoc-10/ban-sua-doi-truoc.json`); site thật chỉ đọc; không gửi form (thử bằng chặn yêu cầu, trả lời giả); không đụng 7 ứng dụng;
không ghi `.htaccess`. Làm theo lớp: Theme Options + The7 Settings → theme con 1.6.0 → nội dung + mẫu WPBakery (`tools/the7_sua_buoc10.py`,
có test) → CF7 / menu / Rank Math → đo. Danh sách đưa lên site thật: `docs/the7/DUA-LEN-SITE-THAT.md`. Ảnh: `screenshots/the7/buoc-10/`
(`*-truoc.jpg` / `*-sau.jpg` ở 390 / 1 536 / 1 920; `the-*`, `nut-*-5-trang-thai`, `form-3-trang-thai-*`, `thanh-lien-he-*`, `header-dinh-*`, `con-so-390`).

## Mục → cách sửa → chỗ tự sửa → trạng thái

| # | Yêu cầu | Cách sửa | Tự sửa trong wp-admin | Trạng thái |
|---|---|---|---|---|
| A1 | Thẻ không viền, bóng nhẹ, bo 4, rê chuột nhích 2 px, giảm chuyển động | Theme Options → Content boxes "không trang trí"; velis.css token `--velis-card-shadow(-hover)` cho mọi thẻ (dự án, phân khu, bài, chủ đầu tư, bài liên quan, 2 hộp Thi thử/Tuyển dụng); dải nổi bật cùng hệ trên nền tối; DESIGN.md "Thẻ" | Theme Options → General | **Xong** |
| A2 | Cả thẻ bấm được; bỏ link chữ chung chung; focus quanh thẻ | link tên thẻ phủ cả thẻ; "Xem dự án →" thành chữ trang trí (không link – `read_more_button="off"`); viền focus 2 px quanh thẻ | – | **Xong** – link "Xem dự án →" 30 → 0 (16 trang × 2 khung) |
| A3 | Hàng cuối căn giữa, thẻ giữ bề rộng | lưới flex theo số cột của phần tử (`data-*-columns-num`), khe 24 | số cột ở phần tử Blog Masonry & Grid | **Xong** – trang chủ 3 + 2 (lề 245/245 px ở 1 536), /du-an/ 3 + 3 + 1 (398/398) |
| A4 | Nhãn 1 dòng, tên thẳng hàng ±2 px | chủ đầu tư giữ nguyên, khu vực cắt "…", rê chuột thấy đủ (title) | dòng 1–2 ô Tóm tắt | **Xong** – nhãn cao 18 px mọi thẻ, lệch tên 0 px |
| A5 | Ảnh màn đầu không mờ dần / lười; dưới lười chuẩn, giữ khung | ô lưới The7 hiện ngay (trước: opacity 0 tới khi JS chạy – FVM hoãn JS nên thẻ trống); 4 ảnh đầu tải ngay, ảnh đầu danh sách lưu trữ `fetchpriority=high`, còn lại `loading=lazy`; khung tỉ lệ có nền `#F2EEE8` | – | **Xong** |
| B1 | Một hệ nút, 5 trạng thái, 48 px, 15–16 px | Theme Options (S/M/L, nút header), velis.css (nút form, 404, thanh liên hệ, `velis-btn-outline`), DESIGN.md "Buttons" | Theme Options → Buttons; Extra class trên phần tử Button | **Xong** – 7 kiểu → 3 (chính, phụ viền, viền trắng) |
| B2 | Vùng bấm ≥ 44 × 44 | menu, menu con (Theme Options), breadcrumb, ngày/tác giả, footer, logo, phân trang, mục lục, hỏi đáp, nút lên đầu, menu điện thoại, số điện thoại, logo đối tác, tên bài ở danh sách (velis.css, lề âm giữ nhịp dòng) | – | **Xong** – 0 / 16 trang |
| B3 | Form | kiểm SĐT VN (10 số, bắt đầu 0, cho phép dấu cách / chấm) ở máy chủ (`velis_vn_phone_ok`, test); lời nhắc tiếng Việt dưới ô (thông báo The7 chuyển sang "tại chỗ"); `inputmode="tel"`, `autocomplete` name/tel; "Đang gửi…" + khóa nút tới khi CF7 trả lời; cảm ơn tại chỗ kèm hotline; ô đồng ý bắt buộc, link chính sách `rel=noopener` | Liên hệ → Contact Form 7 → Thông báo | **Xong** (thử bằng trả lời giả) |
| B4 | Thanh liên hệ đáy | 3 nút 48 px; thân trang chừa 64 px (cuối trang không bị che); ẩn khi gõ vào bất kỳ ô nhập | Tùy biến → Thanh liên hệ | **Xong** |
| B5 | Header dính ≤ 72 / 60, không chớp mờ | kiểu "sticky" (trước "fade"); header thu gọn 60 px | Theme Options → Header | **Xong** – 72 px (1 536 / 1 920), 60 px (390), không mờ |
| C1 | Con số 2 × 2 mobile khoảng hàng ≥ 24 | lề cột | – | **Xong** – 24 px |
| C2 | Bộ tên khu vực | ghi chốt vào `docs/KHU-VUC.md` | dòng 2 ô Tóm tắt | **Xong** |
| C3 | Chuyên mục "Phân khu", lưới tự loại | tạo "Phân khu" (57); Palm River, Persa Place chuyển sang; lưới trang chủ = chuyên mục Dự án (34), /du-an/ = 34 + 57 | Bài viết → Chuyên mục; phần tử lưới → Categories | **Xong** – chuyên mục 45 "Spring Ville" (chỉ có Persa Place) nay rỗng, tự noindex như 36/37/39 |
| C4 | Cắt huy hiệu 120 lượt ảnh blog; 66 ảnh vào SAU-RA-MAT | class `velis-badge` trên thẻ img (cắt 10,7 % trái + dưới rồi phóng 1,12 – bố cục không đổi): 92 ảnh / 78 bài + 28 ảnh / 5 trang dự án; 66 lượt (51 ảnh) → `docs/SAU-RA-MAT.md` mục 14 | Image CSS Class "velis-badge" | **Xong** |
| C5 | QUIC.cloud sau ra mắt | bước 13 trong `docs/KE-HOACH-RA-MAT.md` | – | **Xong** (ghi kế hoạch) |
| D1 | Schema | trang: bỏ Article + tác giả; /du-an/, trang chủ đầu tư, blog, chuyên mục: CollectionPage + ItemList (mục = thẻ trên trang); dự án: BlogPosting + Place (địa chỉ ô "Vị trí", trường tùy chỉnh `velis_dia_chi`); BreadcrumbList = microdata của breadcrumb The7 (khớp chữ hiển thị) | trường tùy chỉnh; Rank Math giữ Service, JobPosting, Organization | **Xong** – 20 trang: 0 lỗi (kiểm cục bộ, xem dưới) |
| D2 | 1 H1, không nhảy cấp | toggle "Xem thêm" → p, hỏi đáp → H3, "Dự án nổi bật" H2, H2 ẩn trước danh sách lưu trữ | – | **Xong** phần mẫu; còn 4 trang do nội dung → `docs/AUDIT-NOI-DUNG.md` mục 14.1 |
| D3 | Alt, kích thước ảnh | mọi ảnh có alt, có width/height (0 thiếu / 16 trang); 128 alt không dấu → AUDIT mục 14.3 | – | **Xong** (không tự viết lại alt) |
| D4 | noopener, link staging, link nội bộ | 2 link mở tab mới thiếu noopener → 0; link staging mã hóa 0; thiếu: 3 bài → /spring-ville/, 3 dự án chưa có trang chủ đầu tư (AUDIT 14.2) | XFN của mục menu; CF7 | **Xong** phần theme / cài đặt |
| D5 | Mô tả /du-an/ 140–155 | 133 → 153 ký tự | Rank Math | **Xong** |
| D6 | og:image đúng ảnh trang | dự án / chủ đầu tư / bài: ảnh đại diện 1 200 px; trang chủ, /du-an/, blog: ảnh OG thương hiệu 1 200 × 630 (trang không có ảnh đại diện riêng) | Rank Math → Social | **Đạt** (không đổi) |
| E1 | Hero = ảnh thật, fetchpriority, srcset | Single Image `velis-hero-bg` + preload `imagesrcset` + `fetchpriority=high`, không lazy | đổi ảnh ở phần tử Single Image | **Xong** |
| E2 | ≤ 10 CSS, ≤ 10 JS | bỏ CSS/JS không dùng: style.css theme con, Rank Math front, Font Awesome (chỉ tải ở trang có icon FA), icomoon, Mega menu (The7 Settings), Ultimate Addons ở lưu trữ | The7 → Settings | **Chưa đạt** – xem bảng; phần còn lại là CSS từng phần tử WPBakery (5–7 tệp / trang) + jQuery/CF7 – chỉ còn cách gộp tệp (LiteSpeed/FVM) |
| E3 | Font | đã đạt từ trước: FVM tự lưu font, preload 2 font chính, `font-display: swap`; Font Awesome không tải ở trang không dùng | – | **Đạt** |
| E4 | Lighthouse | xem bảng | – | trang chủ, /blog/, The Privé **đạt**; Persa, bài **chưa** (TTFB staging) |

## Bảng đo (trước | sau)

| Chỉ số | Trước | Sau |
|---|---|---|
| Kiểu nút khác nhau (16 trang × 390/1 536) | 7 (đỏ 16 px, đỏ 15 px form, đỏ 18 px thanh liên hệ, đỏ 72 px cột phải, nút header 43 px/15 px, viền 50 px/18 px, viền trắng) | **3** (chính, phụ viền, viền trắng) – + trạng thái vô hiệu |
| Vùng bấm < 44 px ngoài đoạn văn (tổng 16 trang, 390 + 1 536) | 875 | **0** |
| Link chữ chung chung ("Xem dự án →"…, 16 trang × 2 khung) | 32 | **1** (nút "Xem dự án" ở hero → /du-an/, là nút điều hướng) |
| Ảnh thiếu alt / thiếu width-height | 0 / 0 | 0 / 0 |
| Nhảy cấp tiêu đề (trang có lỗi / 16) | 8 | **1** (Persa, do nội dung) |
| Link mở tab mới thiếu noopener (mỗi trang) | 2–3 | **0** |
| Schema 20 trang (bộ từ vựng schema.org + quy tắc Google) | trang có Article (trang chủ, /du-an/, chủ đầu tư, tuyển dụng); không ItemList / Place dự án | **0 lỗi, 0 cảnh báo** (1 thuộc tính riêng Google `query-input` – hợp lệ) |
| Số CSS / JS mỗi trang (390) | CSS 18–26, JS 11–29 | CSS **13–22**, JS **11–29** (/blog/ 25 → 15; /gioi-thieu/, /lien-he/ còn 25–29 do bản đồ Google + Ultimate trong nội dung) |
| 16 trang × 8 khung: tràn ngang / H1 ≠ 1 / ảnh hỏng / lỗi console | 0 / 0 / 0 / 0 | **0 / 0 / 0 / 0** (128 lượt; trừ 404 của chính trang không tồn tại) |
| On-page toàn sitemap (`tools/the7_check_onpage.py`) | 234 URL; alt không dấu 128 | 235 URL (+ /phan-khu/); alt không dấu 128; mới: 1 – chuyên mục 45 rỗng "2 H1" (giống mọi chuyên mục rỗng của The7, noindex, sẽ rời sitemap khi Rank Math làm mới) |
| Màu ngoài bảng (`tools/the7_ui_audit.mjs`) | 2 (link "Bỏ qua tới nội dung") | 2 (không đổi) |
| Thanh liên hệ 390 | – | 3 nút 48 px; cuối trang không bị che (thân chừa 64 px); ẩn khi gõ |
| Header dính | fade, 72 / 70 | sticky, **72 / 60**, không mờ |

Lighthouse mobile (trung vị 3 lần; Hiệu năng / Truy cập / Thực hành / SEO, LCP, CLS):

| Trang | Bước 9 (Hiệu năng) | Bước 10 |
|---|---|---|
| Trang chủ | 86 | **95** / 100 / 100 / 100, LCP 2,5 s, CLS 0,023 |
| /blog/ | 87 | **92** / 100 / 100 / 88*, LCP 2,7 s, CLS 0 |
| The Privé | 98 | **98** / 100 / 100 / 100, LCP 1,7 s, CLS 0 |
| Persa Place | 91 | **93** / 97** / 100 / 100, LCP 2,9 s, CLS 0 |
| Bài "Dòng vốn" | 92 | **92** / 100 / 100 / 100, LCP 1,4 s, CLS 0 |

Mục tiêu E4: trang chủ ≥ 90 ✔, /blog/ ≥ 90 ✔, trang dự án ≥ 95 (The Privé ✔, Persa ✘ 93), bài ≥ 95 ✘ 92, CLS ≤ 0,05 ✔. Nguyên nhân thật của
phần chưa đạt: thời gian phản hồi máy chủ staging 0,5–3,5 s (Lighthouse "server-response-time"; bài "Dòng vốn" chờ 3,5 s ở cả 3 lần) – không do
theme; ảnh chưa nén (QUIC.cloud sau ra mắt). *SEO /blog/ 88: link "…" của phân trang The7 là `javascript:void(0)`. **Persa: 1 link trong
đoạn văn chỉ phân biệt bằng màu (nội dung). Lighthouse vẫn chấm cao hơn thực tế (FVM bỏ qua UA Lighthouse).

Schema: validator.schema.org trả trang "sorry" của Google cho yêu cầu tự động → kiểm bằng `tools/the7_check_schema.mjs` với bộ từ vựng
schema.org bản chính thức (schemaorg-current-https.jsonld) + quy tắc Google (`tools/check_schema.mjs`). 20 trang: trang chủ, /du-an/, 4 trang
chủ đầu tư, 7 dự án, /blog/, /blog/the-prive/, 2 bài, Giới thiệu, Liên hệ, Tuyển dụng – 0 lỗi.

## Cần anh/chị quyết

1. **Gộp file CSS/JS (E2)**: không bật gộp thì không xuống ≤ 10 được (WPBakery tải CSS riêng từng phần tử). Bật gộp của LiteSpeed (hoặc FVM)
   sau ra mắt? (LiteSpeed có thể ghi `.htaccess` – duyệt riêng.)
2. **Chuyên mục 45 "Spring Ville"** (dưới Gamuda Land) nay rỗng: giữ (noindex, như Ecopark / Masterise / Sun Group) hay gộp + 301?
3. Breadcrumb "Dự án" của The7 trỏ `/du-an-bds/` (lưu trữ chuyên mục, gần trùng /du-an/): có chuyển hướng `/du-an-bds/` → `/du-an/` không?
4. Nội dung: 4 trang nhảy cấp tiêu đề, 3 bài thiếu link về /spring-ville/, 128 alt không dấu (AUDIT mục 14), 66 ảnh cần gốc (SAU-RA-MAT mục 14).

Đã bỏ qua / chưa kiểm tra: chưa thử Safari / iPhone thật; form chỉ thử bằng trả lời giả (không gửi thật); validator.schema.org không truy cập được.
Rủi ro: chuyên mục Palm River / Persa Place đổi (breadcrumb hiện "Phân khu"); trên site thật ID chuyên mục Phân khu (57) và ảnh hero có thể khác.
