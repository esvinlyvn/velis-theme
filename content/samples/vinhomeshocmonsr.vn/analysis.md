# vinhomeshocmonsr.vn – phân tích kỹ thuật

Crawl 2026-11-05 (55 URL sitemap, 36 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site vệ tinh **một dự án** (đơn vị phân phối dựng riêng tên miền cho một đại đô thị). WordPress + Elementor + Rank Math + LiteSpeed.
- 50/55 URL là bài viết (`post`), chỉ 4 trang tĩnh (trang chủ, liên hệ, 2 trang pháp lý web) và 1 chuyên mục `/blog/`.
  Các "trang dự án con" (giá bán, tiến độ, pháp lý, vị trí, tiện ích, từng loại căn) cũng là **bài viết** chứ không phải trang.
- Slug phẳng 1 cấp, mẫu `<chủ-đề>-<tên-dự-án>` (vd dạng `tien-do-<du-an>`, `shophouse-<du-an>`): từ khóa chính ở đầu slug, tên dự án luôn ở cuối.
- 46/55 URL có lastmod cùng tháng 06/2026 → cập nhật hàng loạt (đợt tối ưu), không phải cập nhật lẻ theo sự kiện.

## Cụm nội dung (silo theo dự án)

| Nhóm | Số URL | Vai trò |
|---|---:|---|
| Trang con "dữ kiện" (giá bán, tiến độ, pháp lý, vị trí, tiện ích tổng, chủ đầu tư) | 6 | Trả lời truy vấn điều hướng `<chủ đề> + <dự án>` |
| Loại sản phẩm (nhà phố, shophouse, song lập, đơn lập, chung cư, tổng hợp loại hình) | 6 | Truy vấn `<loại căn> + <dự án>` |
| Tiện ích riêng lẻ (trường, bệnh viện, TTTM, công viên chủ đề, golf) | 5 | Mỗi tiện ích thương hiệu một bài |
| Hạ tầng / quy hoạch (metro, quốc lộ, vành đai, cao tốc, sáp nhập hành chính) | 8 | "Hạ tầng X tác động gì đến dự án" |
| Phân tích đầu tư / chân dung người mua | 15 | Câu hỏi quyết định: có nên mua, giai đoạn nào, cho thuê, thanh khoản, gia đình trẻ, người lớn tuổi |
| So sánh, lịch sử giá, chiến lược chủ đầu tư | ~10 | Mở rộng ngữ cảnh, hút truy vấn thông tin rộng |

Mô hình: 1 trang chủ dài làm trụ cột → ~12 trang dữ kiện/sản phẩm → ~35 bài câu hỏi dài đuôi.

## Trình bày trang

- **Trang chủ** ~4.900 chữ, là bản tóm tắt toàn dự án: H2 theo đúng trình tự quyết định mua
  (tổng quan → bảng giá → tiến độ → vị trí → tiện ích → giá → loại hình (H3 từng loại) → phân khu (H3 từng phân khu)
  → lý do đầu tư → lý do mua ở → chủ đầu tư → FAQ → tin phân tích). Mỗi H3 loại hình/phân khu dẫn sang trang con tương ứng.
  Heading viết HOA toàn bộ (không nên học: khó đọc, không thêm giá trị SEO).
- **Bài viết** 1.100–2.100 chữ, 1–7 H2, 3–8 H3. H1 = title bỏ hậu tố. Khoảng 13% H2/H3 là câu hỏi.
- **Trang loại căn**: khung cố định 4 H2 — giá (H3 theo phương án hoàn thiện/chính sách) → mặt bằng & thiết kế →
  lý do nên mua (3 H3) → "ai nên mua". Khung lặp y hệt giữa các loại căn → dễ sản xuất hàng loạt.
- **Trang giá**: H2 theo từng loại sản phẩm, H3 theo từng phương án thanh toán/hoàn thiện; cuối trang là "yếu tố tác động đến giá".
- Có bảng ở 4/36 trang; danh sách ul/ol ở mọi trang; trích dẫn (blockquote) ở 19/36 trang; video nhúng ở mọi trang.
- Chưa thấy FAQPage schema; FAQ chỉ là khối nội dung trên trang chủ.

## Title, meta, schema

- Title trung bình 67 ký tự (29–89), luôn có hậu tố thương hiệu chung; nhiều title chứa móc thời gian ("tháng X", "năm 2026")
  hoặc lời hứa ("lý do nên mua ngay") → tạo áp lực, dễ lỗi thời.
- Meta description 47–160 ký tự (tb 143), đều có; thường kết bằng lời kêu gọi ngắn.
- Canonical tự trỏ trên 36/36 trang; robots index, max-snippet:-1.
- Schema Rank Math: bài có `BlogPosting` + `Person` (tác giả) + `Organization` + `BreadcrumbList`; trang chủ có
  `RealEstateAgent` + `WebSite` + `Project`. Khoảng 1/3 bài **không có** JSON-LD → cấu hình không đồng đều.

## Nhịp văn

- Đoạn văn dài: trung bình ~42 chữ/đoạn; câu dài ~34 chữ (trung vị) → đặc, nhiều mệnh đề nối.
- Mở bài kiểu "nhắc lại câu hỏi + bối cảnh quy mô dự án"; từ khóa chính ở ngay câu đầu
  (ví dụ của đối thủ, không dùng: "Vì sao … là câu hỏi phản ánh đúng mối quan tâm của nhà đầu tư…").
- Xưng hô lẫn lộn "anh chị" / "quý khách" / "chúng tôi" / "tôi" trong cùng site → giọng không nhất quán.
- Trung bình ~16 thẻ in đậm mỗi bài; dùng nhiều từ tuyệt đối/so sánh nhất ở tiêu đề và CTA.

## Liên kết nội bộ

- Menu (khung) trỏ cố định tới: giá bán, liên hệ, tiến độ, nhà phố, shophouse, blog → 6 trang này nhận ~108 link khung mỗi trang.
- Trong thân bài, đích nhận nhiều link nhất: trang chủ (32), trang giá (13), bài "có nên mua" (11), vị trí (11), nhà phố (10).
- Anchor trong thân bài thường là **nguyên tiêu đề bài đích** (khối "bài liên quan" chèn giữa bài) hoặc tên dự án trần;
  ít anchor mô tả ngắn theo ngữ cảnh.
- Link chủ yếu đi **ngang trong cùng nhóm** (loại căn ↔ loại căn, tiện ích ↔ tiện ích, hạ tầng ↔ hạ tầng) và đi lên trang chủ.
  Trang chuyên mục dồn link xuống bài hạ tầng/tiện ích.

## CTA & chuyển đổi

- Mọi trang: nút gọi, nút Zalo, form trong footer, popup thu lead (giảm giá, "nhận bảng giá đợt 1").
- Popup và footer có cam kết/ưu đãi mạnh, khó kiểm chứng.

## Nên học / nên tránh (kỹ thuật)

- Học: slug `<chủ-đề>-<dự-án>` ngắn; trang chủ/dự án trụ cột tóm tắt mọi chủ đề rồi dẫn xuống trang con; khung cố định cho trang loại căn;
  cụm bài câu hỏi quyết định (có nên mua, cho ai, giai đoạn nào); hạ tầng → tác động dự án.
- Tránh: dựng trang dữ kiện dưới dạng bài viết có ngày (khó giữ "evergreen"); heading viết hoa; title có móc tháng;
  schema thiếu ở 1/3 bài; anchor = nguyên tiêu đề; đoạn/câu quá dài; xưng hô lẫn lộn; popup cam kết khó kiểm chứng.
