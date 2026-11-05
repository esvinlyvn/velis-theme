# ecoparkbysalereal.vn – phân tích kỹ thuật

Crawl 2026-11-05 (207 URL sitemap, 65 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site **hub theo chủ đầu tư** (đô thị sinh thái), cùng khuôn với các hub khác: CPT `du-an` (17: lưu trữ + dự án + **phân khu**),
  ~170 bài, 5 chuyên mục blog dự án, 6 trang tĩnh. Slug phẳng; sitemap dùng `https://` (đúng, khác hai hub Vinhomes/Sun).
- **Phân khu là trang CPT riêng** (slug chỉ tên phân khu, không kèm tên dự án) → slug ngắn nhưng dễ trùng/mơ hồ.
- Nội dung cũ: 153/207 URL lastmod năm 2024, chỉ 15 URL năm 2026.
- Lỗi cấu hình: `og:site_name` mang tên site hub của chủ đầu tư khác (sao chép theme không sửa) — bài học: kiểm tra thẻ meta sau khi nhân bản site.

## Cụm nội dung

| Nhóm | Số URL (xấp xỉ) | Ghi chú |
|---|---:|---|
| Dự án + phân khu (CPT) | ~16 | Trang phân khu 2.000–3.300 chữ, dài hơn trang dự án |
| Loại căn × dự án | 34 | |
| Tiện ích riêng lẻ (từng công viên, hồ) | ~13 | Mỗi tiện ích cảnh quan một bài |
| **Đời sống / trải nghiệm** (có gì chơi, xe buýt đi tới, lãnh đạo CĐT, cho người cao tuổi) | ~80 | Truy vấn thông tin không mang ý định mua |
| Đầu tư / nhu cầu, hạ tầng, giá, tiến độ, pháp lý | ~40 | |

## Trình bày trang

- Trang chủ ~1.850 chữ: khối 3 lý do → mỗi dự án một H2 → dự án nổi bật → báo chí → blog → form (cùng khuôn sungroupsr.vn).
- **Trang phân khu** (~3.000 chữ): thông tin → vị trí → tiện ích → **mặt bằng với H3 cho từng loại sản phẩm trong phân khu**
  (townhouse, town villa, đơn lập, song lập, shop villa…) → giá → 3 lý do → ai nên mua → khối người tư vấn ngôi thứ nhất.
  Có khối "đang bán gì" dạng thẻ: loại căn + diện tích + giá + tiền thanh toán ban đầu.
- Trang loại căn/phân khu nhiều khối khuyến mại cụ thể (số căn giới hạn, % chiết khấu, ân hạn nợ gốc) đặt thành H2.
- Bài 1.400–2.300 chữ; ~19% H2/H3 là câu hỏi; breadcrumb 46/65; bảng 10/65; ngày cập nhật hiển thị 28/65.

## Title, meta, schema

- Title tb 58 ký tự, hậu tố viết tắt thương hiệu; title trang CPT kèm lời tự khen ("phân tích từ chuyên gia N năm", "đầy đủ nhất").
- Meta description có ở mọi trang (28–165). Canonical tự trỏ 65/65.
- Schema: `BlogPosting`, `Person` có `jobTitle`, `Organization`; khai báo lãnh đạo CĐT, đơn vị thi công làm thực thể liên quan.

## Nhịp văn

- Đoạn ~42 chữ, câu ~28 chữ.
- Ngôi "tôi" rất dày (268 lần/54 bài) — người đứng đầu đơn vị kể trực tiếp; vẫn trộn "quý khách" (115), "bạn" (69).
- Bài đời sống dùng giọng review, tiêu đề cảm thán có ngoặc kép (ví dụ của đối thủ, không dùng: "Review “cực đỉnh” từ A đến Z").

## Liên kết nội bộ

- Menu: 3 dự án trọng điểm + blog + lưu trữ dự án (~195 link khung mỗi đích).
- **Khối liên quan cố định toàn site** (11 bài của hai dự án) nhận 48–55 link thân bài mỗi bài, kể cả từ trang dự án khác;
  anchor = nguyên tiêu đề.
- Dòng chảy: dự án ↔ dự án/phân khu (63), chuyên mục → bài/loại căn, giá/tiến độ/hạ tầng → loại căn (27–31) — các trang dữ kiện
  đều đẩy về trang loại căn (trang chuyển đổi).

## Nên học / nên tránh (kỹ thuật)

- Học: trang phân khu đầy đủ với H3 theo từng loại sản phẩm trong phân khu; khối "đang bán gì" dạng thẻ thông số; trang dữ kiện
  dẫn về trang loại căn; bài đời sống (đi lại, tiện ích cảnh quan) cho người sắp ở.
- Tránh: meta site_name sai sau khi nhân bản; 3/4 nội dung không cập nhật từ 2024; khuyến mại cụ thể làm H2 (lỗi thời nhanh);
  title tự khen; khối liên quan cố định; slug phân khu không có tên dự án.
