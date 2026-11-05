# vinhomebysalereal.vn – phân tích kỹ thuật

Crawl 2026-11-05 (697 URL sitemap, 76 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site **hub theo chủ đầu tư**: một tên miền gom toàn bộ dự án của một chủ đầu tư (≈30 dự án/phân khu/tòa) của cùng đơn vị
  phân phối đứng sau hai site vệ tinh vinhomeshocmonsr.vn, vinhomescangios.vn. Cùng nền WordPress + Elementor + Rank Math.
- Kiểu nội dung: custom post type `du-an` (82 URL: trang lưu trữ `/du-an/`, trang dự án, tiểu khu, tòa) + `post` (594) +
  15 chuyên mục "blog theo dự án" + 6 trang tĩnh.
- Slug **phẳng 1 cấp cho mọi kiểu nội dung** (CPT `du-an` bỏ tiền tố); quan hệ cha–con (dự án → phân khu → tòa) chỉ thể hiện
  qua tên trong slug, không qua đường dẫn.
- **Sitemap khai báo `http://`** (692/697 URL) trong khi canonical và link nội bộ dùng `https://` → lệch giữa sitemap và canonical.
- Trang hệ thống (chính sách bảo mật, điều khoản) dài 700–800 chữ nhưng nằm ngoài sitemap.
- Xuất bản theo đợt lớn: 364 URL có lastmod tháng 07/2025, các đợt nhỏ hơn 12/2025–01/2026, 05/2026.

## Cụm nội dung (lặp silo vệ tinh cho từng dự án)

| Nhóm | Số URL (xấp xỉ) | Mẫu slug |
|---|---:|---|
| Trang dự án (CPT) | ~30 | `<tên-dự-án>` |
| Phân khu / tiểu khu / tòa | ~46 + CPT | `phan-khu-<phân-khu>-<dự-án>`, `tieu-khu-…`, `toa-…` |
| Loại căn × dự án | 86 | `<loại-căn>-<dự-án>` |
| Giá / tiến độ / pháp lý / vị trí / tiện ích / chính sách × dự án | ~130 | `<chủ-đề>-<dự-án>` |
| Hạ tầng tác động dự án | 45 | `<hạ-tầng>-tac-dong-…-<dự-án>` |
| Câu hỏi đầu tư / nhu cầu | ~117 | `co-nen-…`, `…-cho-thue`, `vay-ngan-hang-…` |
| So sánh dự án | 14 | `so-sanh-<dự-án>-voi-cac-du-an-khac` |
| Bài về chủ đầu tư, đối tác (nhà thầu, kiến trúc, quản lý dự án), kinh nghiệm chung | ~40 | `<đối-tác>-doi-tac-…-cho-cac-du-an-<cđt>` |

Ma trận **chủ đề × dự án** sinh hàng trăm URL từ một bộ khung chung.

## Trình bày trang

- **Trang chủ** gần như không có chữ (crawler đếm 8 chữ ngoài khung): khối giới thiệu đơn vị (3 lý do) → mỗi dự án một H2/khối thẻ → blog → form.
- **Trang lưu trữ `/du-an/`** (~3.000 chữ): H2 nhóm theo **tỉnh/thành**, dưới mỗi nhóm là H2 dự án → điều hướng theo khu vực.
- **Trang dự án** (~5.000 chữ) dùng đúng thứ tự H2 của site vệ tinh: thông tin → "năm nay nên mua gì" → tiến độ → vị trí → tiện ích →
  giá (H3 chính sách) → loại hình (H3 từng loại) → phân khu (H3 từng phân khu) → lý do đầu tư → … Heading HOA.
- **Trang phân khu** (~2.500 chữ): thông tin → vị trí → tiện ích → mặt bằng (H3 loại hình) → giá → lý do mua → ai nên mua →
  **khối tác giả/người tư vấn đặt giữa trang** (H2 giới thiệu bản thân) → "phân khu khác có thể phù hợp" (liên kết anh em).
- **Trang chuyên mục** "Blog <dự án>": chỉ H1 + lưới bài, ~600 chữ (tiêu đề/trích đoạn) → mỗi dự án có trang tập hợp bài riêng.
- Bài viết 1.400–2.500 chữ; ~22% H2/H3 là câu hỏi; bảng ở 14/76 trang; ngày cập nhật hiển thị ở 45/76.

## Title, meta, schema

- Title tb 63 ký tự (21–89), hậu tố viết tắt thương hiệu; nhiều title gắn tháng ("T8", "cập nhật T1") hoặc
  "độc quyền", "đánh giá từ chuyên gia".
- Meta description có ở mọi trang (32–174 ký tự, vài trang vượt 160).
- Schema: `BlogPosting` + `Person` (CEO đơn vị làm tác giả) + `Organization`; bài còn khai báo nhiều thực thể bên thứ ba
  (ngân hàng, nhà thầu, cơ quan nhà nước) làm `Organization`.

## Nhịp văn

- Đoạn ~44 chữ, câu ~30 chữ (trung vị).
- Mở bài lặp nguyên câu hỏi của tiêu đề ở câu 1, rồi đặt bối cảnh vị trí (ví dụ của đối thủ, không dùng:
  "<Dự án> có thật sự đáng để xuống tiền … là câu hỏi được nhiều nhà đầu tư đặt ra…").
- Ngôi kể "tôi" xuất hiện nhiều (201 lần/65 bài) do tác giả là người đứng đầu đơn vị, nhưng vẫn trộn "quý khách" (149), "anh chị" (56).
  → Mô hình "người đứng đầu viết ở ngôi thứ nhất + hộp tác giả trong trang" trùng hướng BRIEF của Velis (CEO Vũ Xuân), cần làm nhất quán hơn.

## Liên kết nội bộ

- Menu cố định trỏ 3 trang dự án trọng điểm + `/blog/` + `/du-an/` (~230 link khung mỗi đích trên 76 trang mẫu).
- Thân bài: trang chủ (59), các trang dự án CPT (24, 23, 16…), rồi trang loại căn/giá/vị trí của dự án.
- Dòng chảy chính: trang dự án → phân khu (105) và → dự án khác (76); chuyên mục → loại căn/bài; phân khu → loại căn; giá → loại căn.
  Tức là **trên xuống** (dự án → phân khu → loại căn) và **ngang** (phân khu anh em, dự án cùng CĐT).
- Anchor yếu: "tham khảo dự án" (69 lần), "bấm xem thông tin & phân tích" (10), tên CĐT trần (47); phần còn lại là nguyên tiêu đề bài.

## Nên học / nên tránh (kỹ thuật)

- Học: trang lưu trữ dự án nhóm theo khu vực; trang dự án → phân khu → loại căn với liên kết anh em ("phân khu khác phù hợp");
  chuyên mục blog riêng cho từng dự án; bài về đối tác/nhà thầu của chủ đầu tư để phủ thực thể; tác giả là người đứng đầu, viết ngôi thứ nhất.
- Tránh: sitemap `http://` lệch canonical; trang chủ không có nội dung chữ; slug phẳng cho cả cấu trúc cha–con;
  anchor chung chung; title gắn tháng; hộp tác giả chèn giữa trang bán hàng; sản xuất hàng loạt theo ma trận dễ thành nội dung mỏng/lặp.
