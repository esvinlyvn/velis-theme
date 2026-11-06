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
CSS của hero trang chủ chuyển sang kiến trúc mới, hiển thị như 2.1. Dung lượng: {{CSS}}.

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

{{KIEM_CHUNG}}

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


## 4. Việc chờ người dùng duyệt

{{CHO_DUYET}}

---
{{CUOI}}
