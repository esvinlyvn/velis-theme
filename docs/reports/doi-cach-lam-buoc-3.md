# Đổi cách làm – Bước 3: viết lại giao diện theme theo mockup (2026-11-06)

Nhánh `claude/doi-cach-lam-b3` (tách từ `claude/doi-cach-lam-b2` vì PR #7 chưa merge). Theme velis **1.0.0** và plugin
velis-data **0.3.0** đang chạy trên staging. Site thật chỉ đọc. Không sửa nội dung bài / trang, không đụng `.htaccess`
và 7 ứng dụng, không thêm plugin.

## 0. Chuẩn bị

- Đã đọc CLAUDE.md, BRIEF.md, DESIGN.md (gồm "Quy tắc bố cục" 1.1–1.8), NGHIEM-THU.md, CHUAN-ANH.md, TEMPLATES.md,
  báo cáo bước 2 (mục 9–12) và toàn bộ `mockup/src/`.
- Môi trường: có `WP_STAGING_URL` và Application Password (REST `users/me` trả 200). Không lần đăng nhập nào thất bại.
- Mốc trước khi đổi gì: hero trang chủ staging 0.9.8 ở M1–M5, ảnh + hộp H1 / đoạn dẫn / 2 nút / dải
  (`screenshots/b3/truoc/`, công cụ `tools/shots_b3.mjs`).

## 1. Quyết định đã ghi (Duyệt: người dùng, 2026-11-06)

Ghi ở `docs/NGHIEM-THU.md` (nhật ký) và `DESIGN.md` (mục Hero, "Trang chủ dưới hero", quy tắc 1.1 và 1.5):

- Chuẩn thị giác = mockup PR #7 bản eda87a0 + "Quy tắc bố cục" 1.1–1.8, trừ hero trang chủ.
- Hero trang chủ giữ hero 0.9.8 (ngoại lệ có chủ đích của X-02), chỉ sửa: một lớp gradient trái → phải; thẻ trong dải
  cao bằng nhau, tên 1 dòng.
- Con số 10+ · 50+ · 999+ · 99+. Câu hộp Thi thử đã duyệt. Giá trị khác biệt 2×2 dưới 1600 px, 4 cột từ 1600 px.
- 1.5 sửa: nền tối chỉ cho thư viện ảnh và khối form. Tên thẻ dự án Playfair 22 px: ngoại lệ có chủ đích.
- M4 hệ số giãn 1,52 ở hero B trang dự án: chấp nhận. `--error-on-dark` #F2B8B5 có trong DESIGN.md.
- Ảnh Ansana có tên đường trong cảnh: dùng ở thẻ / nội dung, không dùng ở hero.
- DESIGN.md và mockup nói cùng một điều: CSS là **một nguồn chung** `theme/velis/css/1-tokens … 5-utilities`; mockup và
  theme cùng dựng từ đó (`tools/build_mockup.mjs`, `tools/build_css.py`); `theme.json` sinh lại từ DESIGN.md.

## 2. Viết lại

### 2.1 Hero trang chủ

Giữ nguyên bố cục, chữ, nút, ảnh (The Privé), dải "Dự án nổi bật", vị trí và cỡ chữ của 0.9.8. Đã sửa đúng 2 điểm:

- a. Lớp phủ: **một** `linear-gradient(90deg …)` phủ toàn khung (`.hero--home::before`). Đã bỏ mảng phủ cục bộ + blur,
  hộp nền sau nhãn "VELIS REALTY" và bóng chữ.
- b. Thẻ trong dải cao bằng nhau (90 px), tên dự án 1 dòng ở mọi khung, khu vực được xuống dòng; tối đa 4 thẻ trong khung,
  trượt bằng mũi tên / vuốt, không tự chạy.

Để tên luôn 1 dòng, ảnh nhỏ trong thẻ giảm 104 → 72 px và dải gọn trong khung (ở M4 dải rộng 912 px thay vì 1200 px
tràn mép như 0.9.8) – chờ duyệt (mục 4).

### 2.2 Trang chủ dưới hero

Theo mockup eda87a0: con số → dự án (tab khu vực, "Xem tất cả dự án" mở `/du-an/?khu=…` đã lọc) → đối tác → giá trị khác
biệt (H2 "Công ty TNHH Velis Realty" + 2 đoạn nguyên văn trang cũ + 4 mục) → bài phân tích → Thi thử + Tuyển dụng → form →
footer. Trang có đúng 1 H1. Thẻ đầu lưới dự án (Ansana) khác ảnh hero (The Privé).

5 chỉnh sửa: (1) logo đối tác cân theo diện tích (≤ 48 × 160 px); (2) link "Xem dự án" / "Đọc bài" ghim đáy thẻ;
(3) hộp Thi thử có câu đã duyệt, 2 hộp cùng cao; (4) khối đối tác căn trái; (5) giá trị khác biệt 2×2 dưới 1600 px.
Staging chưa có logo chủ đầu tư nên theme mang sẵn 4 logo đã làm sạch của trang cũ (dùng khi chủ đầu tư chưa có logo).

### 2.3 CSS

Toàn bộ CSS cũ đã xóa (style.css chỉ còn phần đầu WordPress). Kiến trúc tokens → base → layout → components → utilities,
không lớp vá, không `!important` (build từ chối nếu có). Token kiểm khớp DESIGN.md mỗi lần build; `theme.json` sinh lại.
CSS của hero trang chủ chuyển sang kiến trúc mới, hiển thị như 2.1. Dung lượng: **30,9 KB min / 6,8 KB gzip** (ngân sách 45 / 12 KB).

### 2.4 Template

Mọi loại trang dùng component của mockup (không còn class `v-` nào – test render quét tĩnh mọi file theme).

- Có mockup: trang chủ (hero theo 2.1), trang dự án (đại đô thị, dự án độc lập), phân khu, dòng thấp tầng.
- Chưa có mockup, dựng từ component sẵn có: `/du-an/` (lọc chip, đọc `?khu=`, `?cdt=`, `?loai=`), chủ đầu tư (danh sách +
  chi tiết), blog / cụm / bài viết (cột phải giữ), tác giả, Giới thiệu, Liên hệ, Tuyển dụng, tìm kiếm, 404, trang chính sách.

**Đã bỏ (theo mockup – chờ duyệt):** mega menu "Dự án" và menu con "Về Velis"; header ẩn khi cuộn (nay dính cố định như
mockup); bảng "Theo loại sản phẩm" ở trang đại đô thị; chế độ "Theo phân khu & sản phẩm" + bộ lọc dạng ngăn kéo ở `/du-an/`
(nay là hàng chip); trang style guide; ô "Mục lục" dính cột phải tự co; biểu tượng play đè ảnh YouTube (thay bằng nút
"Phát video"); câu chờ duyệt trong khối "Velis tư vấn".

**Cần kiểu mới – chờ duyệt** (chưa tạo kiểu mới; mỗi mục vẽ bằng component sẵn có):

| Chỗ cần | Đang dùng |
|---|---|
| Phóng to ảnh (thư viện, tiến độ, mặt bằng) | `dialog.lightbox` – **kiểu mới duy nhất đã thêm**, để giữ chức năng phóng ảnh |
| Ô tìm kiếm | ô nhập + nút của form tư vấn (nút "Tìm" nằm dưới ô) |
| Mục lục bài / trang chính sách | dòng hỏi đáp (FAQ) |
| Phân trang | nút viền |
| Link cụm bài ở /blog/ | nút viền |
| Hồ sơ tác giả, thẻ liên hệ cột phải | thẻ "Velis tư vấn" (advisor) |
| Tóm tắt đầu bài | nhãn + đoạn dẫn |
| Trích dẫn trong bài | hộp chú thích (disclosure) |
| Logo trang chủ đầu tư | hàng logo đối tác |
| 2 danh sách ở Giới thiệu | danh sách số 01–04 (giá trị) |
| Dòng căn hộ (tab) | chip + danh sách thông tin |
| "Dự án đang tư vấn" (Liên hệ, Giới thiệu) | hàng chip (vùng bấm 44 px) |

### 2.5 Ảnh (phía server, giống nhau ở mọi màn / DPR)

- Hero trang dự án / phân khu: file ≥ 1920 px → kiểu A, nhỏ hơn → kiểu B; hero trang chủ luôn tràn.
  `?velis_hero=a|b` ép kiểu chỉ trên staging (dùng khi kiểm).
- Cờ "có dấu" (`velis_mark`, nhập 178 ảnh từ `data/kiem-ke-anh-mat.csv`): có huy hiệu → cắt khung W-A; sạch → không cắt;
  logo / chữ không che được → khung có tên ở hero / thẻ / cột phải.
- Tiêu điểm F-B: ô chọn 9 vị trí trong màn sửa Media (velis-data 0.3.0), dùng làm `object-position` cho ảnh sạch.
- `sizes` / `srcset` theo X-01 (ảnh LCP lấy file ≥ khung × DPR; ảnh khác theo khung × DPR × hệ số cắt).

### 2.6 Chức năng giữ nguyên

Form CF7 + trường ẩn `interest` / `page-url` / `utm`; thanh CTA dính mobile; schema; title / meta; breadcrumb; redirect;
thanh mục; thư viện; hỏi đáp; lọc phân khu; cột phải bài viết; khối "Velis tư vấn dự án này". Lọc ở trang chủ dẫn tới
`/du-an/` đã lọc sẵn. Không thêm plugin.

### 2.7 Triển khai

Theme 0.9.8 → 1.0.0, velis-data 0.2.7 → 0.3.0 qua wp-admin (Tải lên → thay bản đang dùng). Các lần tải và mọi ghi khác:
`docs/STAGING-LOG.md` mục "2026-11-06 – Bước 3".

## 3. Kiểm chứng (trên staging)

### 3.1 Hero trang chủ (trước 0.9.8 | sau 1.0.0) – `screenshots/b3/hero/`, `screenshots/b3/sau/`

| Đo | Kết quả |
|---|---|
| Hộp H1, đoạn dẫn, nút 1, nút 2, dải (M1–M5) so với mốc | **0,0 px** ở mọi hộp, chữ giống hệt; trừ **dải ở M4 hẹp hơn 288 px** (912 thay vì 1200 – chờ duyệt, mục 4) – `sau/so-moc-0.9.8.txt` |
| Ảnh trước \| sau | `hero/truoc-sau-M1..M5.jpg`: chỉ khác lớp phủ và thẻ trong dải |
| Lớp phủ | một `linear-gradient(90deg …)` trên `.hero--home::before`; không mảng phủ, blur, radial, bo góc, hộp nền sau chữ – ảnh cận `hero/can-ranh-gioi-lop-phu-M2.jpg` (sau) và `…-truoc.jpg` (0.9.8: mảng mờ + hộp nhãn) |
| Tương phản chữ hero, 5 điểm / dòng (nhãn, H1, đoạn dẫn, "Dự án nổi bật") | **đạt mọi điểm**; thấp nhất trang chủ 6,91 (M3), TGC / MPP hero A thấp nhất 7,67 – `kiem-tra/tuong-phan-hero.json` (`tools/mockup_contrast.mjs` chế độ staging) |
| Ảnh hero ≠ ảnh thẻ đầu lưới | hero The Privé, thẻ đầu Ansana by Kita; ảnh The Privé được cắt khung che huy hiệu |

### 3.2 So với mockup – hộp component chính (`tools/compare_mockup.mjs`, `screenshots/b3/so-mockup/so-hop.md`)

Lệch x / rộng / cao của hộp thứ n cùng selector (header, hero, nút, dải, thanh thông tin, thanh mục, đầu khối, thẻ, số liệu,
đối tác, giá trị, Thi thử / Tuyển dụng, cột phải, thư viện, hỏi đáp, form, footer). Ảnh cạnh nhau mockup | staging ở 1536:
`so-mockup/*-mockup-staging-1536.jpg`.

| Trang | M1–M3 | M4 | M5 |
|---|---|---|---|
| Trang chủ | 25/25 hộp ≤ 2 px | 25/25 | 25/25 |
| The Global City (A và B) | 34/35 – cột phải thấp hơn 79 px | 34/34 | 32/34 – 1 thẻ phân khu cao hơn 25 px, hỏi đáp thấp hơn 224 px |
| Masteri Park Place (A và B) | 19/20 – cột phải thấp hơn 79 px | 19/19 | 19/19 |

Phần lệch còn lại đều do **chữ**, không do giao diện: cột phải – mockup có câu chờ duyệt ("Velis Realty là đơn vị tư vấn,
phân phối; chủ đầu tư dự án là …", gắn nhãn chờ duyệt), theme chưa hiện câu chưa duyệt; thẻ phân khu M5 – dữ liệu staging
dài hơn bản trích mockup ("616 căn hộ (8 căn/sàn)" xuống thêm 1 dòng); hỏi đáp M5 – câu trả lời đầu trên staging ngắn hơn bản
trích. Đã sửa để khớp mockup trong vòng này: thẻ dự án bỏ "N phân khu ·", thanh thông tin (bàn giao ngắn, pháp lý bỏ nhãn lặp,
phân khu không có ô "Sản phẩm"), phân khu thấp tầng có khung tên, hỏi đáp mở câu đầu, form không còn dòng trạng thái rỗng.

### 3.3 Soát mắt 1.1–1.8 – mọi loại trang (mục 2.4)

Xem từng ảnh cả trang ở 1366 và 390 px (theme 1.0.0 bản cuối). 1.2 / 1.3 / 1.6 có thêm số đo máy ở 3.4.

| Loại trang | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 1.7 | 1.8 | Ảnh (1366 \| 390) |
|---|---|---|---|---|---|---|---|---|---|
| Trang chủ | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/trang-chu.jpg` |
| Đại đô thị (The Global City) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/tgc.jpg` |
| Phân khu (Masteri Park Place) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/mpp.jpg` |
| Dòng thấp tầng (Shophouse SOHO) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/thap-tang.jpg` |
| Dự án độc lập (The Privé) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/doc-lap.jpg` |
| /du-an/ | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/du-an.jpg` |
| /du-an/?khu=khu-dong (lọc sẵn) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/du-an-loc.jpg` |
| Chủ đầu tư – danh sách | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/chu-dau-tu.jpg` |
| Chủ đầu tư – chi tiết (Masterise Homes) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/cdt-sun.jpg` |
| Blog | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/blog.jpg` |
| Cụm blog (The Privé) | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/cum.jpg` |
| Bài viết | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/bai.jpg` |
| Tác giả | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/tac-gia.jpg` |
| Giới thiệu | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/gioi-thieu.jpg` |
| Liên hệ | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/lien-he.jpg` |
| Tuyển dụng | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/tuyen-dung.jpg` |
| Chính sách | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/chinh-sach.jpg` |
| Tìm kiếm | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/tim-kiem.jpg` |
| 404 | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | `screenshots/b3/soat-mat/404.jpg` |

Ghi chú khi soát (đã sửa trong vòng này): trang chính sách không có mục lục đặt chữ lệch khỏi mép khung → thêm thẻ "Liên hệ
Velis" ở cột phải (chữ thẳng mép, không để trống 40 % bên phải); 3 hàng lọc ở `/du-an/` hàng đầu dạt phải → mọi hàng thẳng
mép trái; breadcrumb trên mobile xuống 4 dòng → 1 dòng cuộn ngang. Còn để ý (đạt nhưng nên xem): bộ lọc `/du-an/` trên
điện thoại dài ~2 màn hình trước thẻ đầu; danh sách chủ đầu tư chỉ có chữ (staging chưa có logo) nên thưa; trang chủ đầu tư
chưa có dự án chỉ có đầu trang + form; tên vùng ở `/du-an/` là "Vùng vệ tinh" (tên mục khu vực) còn tab trang chủ là
"Nhơn Trạch – Long Thành".

### 3.4 Đo máy – bản cuối trên staging

| Bộ đo | Kết quả | File |
|---|---|---|
| Bộ NT (`check_ui --suite`): 30 trang chuẩn × DPR 1 / 1,25 / 2 × M5 / M4 / M1 / M2 / M3 | **0 lỗi** ở mọi cột lỗi (cột thông tin: NT-22 ảnh nguồn thiếu độ phân giải 785, NT-21 cách đo cũ 598, NT-08 0) | `kiem-tra/suite/bang.md` |
| check_ui 7 khung (360 · 390 · 430 · 768 · 1024 · 1366 · 1920), 30 trang | **0 lỗi** / 210 dòng (tràn ngang, ảnh rỗng, tương phản, vùng bấm, khoảng trống, bố cục); CLS lớn nhất 0,008 | `kiem-tra/check-ui.md` |
| Thang chữ 1.3 + khoảng cách 1.2 + dòng ≤ 68 ký tự (`mockup_scale --staging`), 30 trang × 5 màn | **0 ngoại lệ** | `kiem-tra/thang-staging.md` |
| Tương tác – 24 của mockup trên staging (`tools/interactions_b3.mjs`) | **24/24 đạt** | `kiem-tra/tuong-tac-mockup-24.txt` |
| Tương tác – bộ 34 (`tools/interactions.mjs`) | **25 đạt, 0 lỗi, 9 bỏ**: 8 kiểm chức năng đã bỏ (mega menu ×5, header ẩn khi cuộn ×2, bảng "Theo loại sản phẩm" ×1) + 1 gửi thử (xem dưới) | `kiem-tra/tuong-tac-34.txt` |
| Gửi thử form thật | **không gửi**: trước khi gửi đã đọc `/wp-json/velis/v1/last-lead` – staging đã ghi 1 lần gửi trong ngày 2026-11-06 (không phải của bộ đo), nên theo quy tắc "đúng 1 lần mỗi vòng" không gửi thêm. Trường ẩn `interest` / `page-url` / `utm` kiểm bằng yêu cầu CF7 chặn tại máy (bộ 24) | – |
| on-page (crawl từ trang chủ) | **173 trang, 0 lỗi** template / nội dung, 0 link hỏng | `kiem-tra/onpage/` |
| Schema (28 trang, validator.schema.org + thuộc tính bắt buộc Google) | **0 lỗi, 0 cảnh báo** | `kiem-tra/schema.md` |
| Lighthouse mobile (trang chủ, The Global City, bài viết, /du-an/) | hiệu năng **94 · 98 · 99 · 99** (≥ 90 đạt); LCP 2,7 · 2,2 · 1,9 · 2,1 s – **trang chủ chưa đạt ≤ 2,5 s** (chạy lại: 2,7 và 2,5 s); a11y 100, BP 100; SEO 66 do staging đặt noindex | `kiem-tra/lighthouse.txt` |
| CSS | 30,9 KB min / 6,8 KB gzip (≤ 45 / 12) | `tools/build_css.py` |

LCP trang chủ: phần lớn là thời gian chờ máy chủ (TTFB 0,9–2,4 s – staging đang tắt cache LiteSpeed từ ngày 1); ảnh hero tải
0,2–1,1 s. Cần đo lại khi bật cache / trên site thật (bước 4).

Bộ đo được sửa trong vòng này (không nới tiêu chí): `ui_media` đếm ô lưới theo số cột thẻ chiếm (thẻ đầu rộng 2 cột ở lưới 5 /
7 thẻ không còn bị tính là ô trống) và tải lại trang khi staging trả 5xx / ảnh lỗi do quá tải (≤ 3 lần); `ui_layout` không coi
khung có tên (ảnh không che được dấu) ở hero là "khung ảnh rỗng"; `mockup_scale` không đếm breadcrumb là đoạn văn và tải lại
khi CSS theme chưa về; `interactions.mjs` kiểm "Đọc tiếp" đúng khối được bấm, chế độ không gửi ghi là "bỏ", không phải "đạt";
thêm `tools/compare_mockup.mjs`, `tools/interactions_b3.mjs`, chế độ staging cho `tools/mockup_contrast.mjs`.

Sửa theme sau đo (B3-5): `sizes` của thẻ theo đúng số cột (thẻ rộng, thẻ 2 cột, ảnh tiến độ, thẻ dự án giữa bài, hero B
mobile 4:3); ảnh trong bài giữ tỉ lệ khung theo thuộc tính (không lệch theo DPR); ảnh tiến độ 2 cột trên điện thoại (NT-29);
bảng / đường kẻ / chú thích ảnh trong bài theo thang 1.2; vùng bấm 44 px cho hotline / Zalo / email ở khối form và thẻ cột
phải, link trong danh sách, nút "Trang sau"; "Dự án đang tư vấn" thành hàng chip; breadcrumb mobile 1 dòng cuộn ngang;
`aria-current` chỉ ở mục đang xem.

## 4. Việc chờ người dùng duyệt

1. **Dải "Dự án nổi bật" ở M4 rộng 912 px** thay vì 1200 px của 0.9.8 (bản cũ tràn mép màn hình). Cần gọn trong khung để
   tên dự án 1 dòng và tối đa 4 thẻ. Đây là hộp duy nhất của hero lệch > 2 px so với mốc.
2. **Ảnh nhỏ trong thẻ của dải 104 → 72 px** (để tên 1 dòng ở mọi khung).
3. **Dải tối dưới ảnh hero trên điện thoại #141414 → #111111** (token tối chung).
4. **Chức năng đã bỏ theo mockup** (mục 2.4) và **8 mục tương tác SKIP** tương ứng của bộ 34: mega menu (5), header ẩn khi
   cuộn (2), bảng "Theo loại sản phẩm" ở đại đô thị (1). Muốn giữ chức năng nào thì phải dựng lại (cần kiểu mới).
5. **Kiểu mới duy nhất đã thêm: khung phóng ảnh (lightbox)**, và danh sách "cần kiểu mới – chờ duyệt" ở mục 2.4 (tìm kiếm,
   mục lục, phân trang, hồ sơ tác giả, trích dẫn, logo chủ đầu tư … đang vẽ bằng component sẵn có).
6. **Câu chờ duyệt trong khối "Velis tư vấn"** ("Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là …") có ở
   mockup (gắn nhãn chờ duyệt) nhưng theme chưa hiện – lý do khối cột phải thấp hơn mockup 79 px (mục 3.2). Duyệt câu thì
   theme hiện câu và hộp khớp.
7. **Trang chính sách không có mục lục**: cột phải là thẻ "Liên hệ Velis" (component có sẵn) – để chữ thẳng mép khung mà
   không bỏ trống 40 % bên phải. DESIGN.md cũ ghi "một cột đọc 760 px canh giữa" – cần chọn một trong hai.
8. Giữ / bỏ: `/du-an/masterise-homes/` và 3 trang cùng kiểu trả 404 (trang đã đăng nhưng địa chỉ trùng loại nội dung dự án)
   – không phải lỗi theme, cần quyết định nội dung.

---
Đã bỏ qua / chưa kiểm tra: không gửi thử form thật trong vòng này (staging đã có 1 lần gửi trong ngày); Safari / iPhone thật
chưa thử; Lighthouse đo trên staging tắt cache.
Rủi ro: LCP trang chủ 2,5–2,7 s (> 2,5) do TTFB staging; các mục ở phần 4 (dải M4, chức năng đã bỏ, kiểu mới, câu chờ duyệt)
cần người dùng chọn trước bước 4.
