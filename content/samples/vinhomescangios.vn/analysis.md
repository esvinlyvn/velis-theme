# vinhomescangios.vn – phân tích kỹ thuật

Crawl 2026-11-05 (86 URL sitemap, 37 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- **Cùng khuôn** với vinhomeshocmonsr.vn (cùng đơn vị, cùng theme Elementor, cùng tác giả trong schema, cùng hotline):
  site vệ tinh một dự án, 81/86 URL là `post`, slug phẳng `<chủ-đề>-<dự-án>`.
- lastmod: 52 URL tháng 06/2026, 23 tháng 07, 7 tháng 08 → vẫn xuất bản/cập nhật đều sau đợt tối ưu.
- **Lỗ hổng sitemap**: các trang phân khu (`phan-khu-<tên>-<dự-án>`) trả 200 và được trỏ từ trang loại căn,
  nhưng không có trong sitemap → trang mồ côi với công cụ tìm kiếm. (Bài học: sitemap phải sinh tự động từ mọi loại nội dung.)

## Cụm nội dung

| Nhóm | Số URL (xấp xỉ) | Ghi chú |
|---|---:|---|
| Trang dữ kiện (giá, tiến độ, pháp lý, vị trí, tiện ích tổng, chủ đầu tư) | 6 | Giống site Hóc Môn |
| Loại căn | 14 | Nhiều hơn: ngoài loại hình chung còn tách theo vị trí/đặc điểm (góc, phân khu) |
| Công trình/tiện ích có tên riêng (nhà hát, safari, outlet, lagoon, khu vui chơi…) | ~12 | Mỗi công trình thương hiệu một bài |
| Hạ tầng (metro, cầu, cao tốc kết nối) | 11 | "Hạ tầng X – đòn bẩy cho dự án" |
| Phân tích đầu tư / định vị thị trường (du lịch, MICE, ESG, so với điểm đến khác) | ~25 | Nhiều bài "định vị" vĩ mô |
| So sánh / thời điểm mua | 3 | "Mua ngay hay chờ" |

## Trình bày trang

- Trang chủ ~5.700 chữ, cùng thứ tự H2 như site Hóc Môn, thêm H2 "quỹ căn đặc biệt", "mặt bằng", "pháp lý".
  Mỗi H3 loại hình/phân khu là cổng sang trang con. Heading viết HOA.
- Trang loại căn: khung thông tin → giá (H3 chính sách) → mặt bằng & thiết kế → lý do nên mua (3 H3) → ai nên mua.
  Title gắn "giỏ hàng tháng X" → lỗi thời sau 1 tháng.
- Bảng xuất hiện ở 10/37 trang (nhiều hơn site Hóc Môn): bảng giá, bảng thông số loại căn.
- Bài viết 1.300–2.200 chữ; ~16% H2/H3 là câu hỏi.

## Title, meta, schema

- Title tb 64 ký tự, hậu tố thương hiệu chung; meta description có trên mọi trang (47–160 ký tự).
- Canonical tự trỏ 37/37. Schema giống site Hóc Môn: `BlogPosting` + `Person` + `Organization`, trang chủ `RealEstateAgent`.
  Schema bài nhắc cả thực thể bên thứ ba (cơ quan nhà nước, hãng tư vấn) dưới dạng `Organization` (`mentions`/`about`).

## Nhịp văn

- Đoạn ~44 chữ, câu ~31 chữ (trung vị) — vẫn dài.
- Mở bài: định nghĩa ngay ở câu 1 ("<Tên công trình> là …, tọa lạc …, diện tích …") → kiểu answer-first, dễ được trích đoạn.
  (ví dụ của đối thủ, không dùng: "<X> là tổ hợp tiện ích … tọa lạc ngay trung tâm phân khu …").
- Xưng hô lẫn lộn mạnh: "quý khách" 71, "tôi" 68, "chúng tôi" 47, "anh chị" 23, "bạn" 18 lần trên 32 bài.
- Dùng nhiều so sánh nhất ("lớn nhất", "duy nhất") và tính từ định vị; in đậm dày (~25 thẻ/bài).

## Liên kết nội bộ

- Menu cố định: giá, tiến độ, nhà phố, shophouse, blog, liên hệ (~108 link khung mỗi trang).
- Thân bài: trang chủ 33, giá 12, shophouse 10, "có nên đầu tư" 9, nhà phố 9, tiến độ 8.
- Trang loại căn trỏ sang trang phân khu với anchor "<loại căn> <phân khu> <dự án>" → ma trận loại căn × phân khu
  (đây là cách liên kết tốt, chỉ hỏng vì phân khu thiếu trong sitemap).
- Ít khối "bài liên quan" hơn site Hóc Môn (2/37 trang) — link chủ yếu chèn trong đoạn văn.

## Nên học / nên tránh (kỹ thuật)

- Học: câu định nghĩa ở câu đầu; ma trận loại căn × phân khu bằng link trong ngữ cảnh; bảng thông số trong trang loại căn;
  mỗi công trình/tiện ích lớn có trang riêng khi có đủ dữ kiện.
- Tránh: trang tồn tại nhưng thiếu trong sitemap; title gắn tháng; bài "định vị vĩ mô" nhiều so sánh nhất, khó kiểm chứng;
  xưng hô lẫn lộn; heading viết hoa.
