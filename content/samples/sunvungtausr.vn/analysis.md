# sunvungtausr.vn – phân tích kỹ thuật

Crawl 2026-11-05 (36 URL sitemap, 30 trang mẫu; đợt đầu bị ngắt mạng, chạy lại sau khi người dùng xác nhận mạng ổn).
Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**. Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site vệ tinh **một dự án** (đô thị biển), cùng khuôn và cùng tác giả/hotline với vinhomeshocmonsr.vn, theprivesr.vn.
- **Trùng dự án với site hub sungroupsr.vn** của cùng đơn vị: cùng một dự án có hai bộ trang giá/tiến độ/loại căn trên hai tên miền
  → tự cạnh tranh từ khóa (cannibalization liên tên miền). Tên domain và slug dùng tên thương mại cũ/khác của dự án,
  trong khi H1/title dùng tên mới → hai tên song song trong cùng trang.
- 31 bài + 4 trang + trang chủ; slug phẳng `<chủ-đề>-<dự-án>`. Hầu hết lastmod 13/03/2026 (cập nhật hàng loạt);
  trang chủ, giá, các loại căn cập nhật 08/2026.
- Hậu tố title lẫn lộn: phần lớn là tên CĐT, vài trang là viết tắt của site hub → dấu vết chuyển nội dung giữa hai site.

## Cụm nội dung

| Nhóm | Số URL | Ghi chú |
|---|---:|---|
| Dữ kiện (giá, tiến độ, pháp lý, vị trí, tiện ích nội/ngoại khu, CĐT) | 8 | Tách **tiện ích ngoại khu** thành trang riêng |
| Loại căn (nhà phố, đơn lập, song lập, căn hộ, tổng hợp loại hình) | 5 | |
| Đầu tư / nhu cầu (cho thuê ngắn ngày, lướt sóng, gia đình, người cao tuổi, thanh khoản) | 10 | |
| Về CĐT (hệ sinh thái, dự án đã hoàn thiện, điểm khác biệt, chất lượng bàn giao, danh sách đang mở bán) | ~5 | Bài thực thể CĐT đặt trên site một dự án |
| Hạ tầng, thị trường địa phương, so sánh | 5 | |

## Trình bày trang

- Trang chủ ~3.400 chữ, đúng khuôn site vệ tinh: tổng quan → mở booking → tiến độ → vị trí → tiện ích → giá (H3 chính sách tháng)
  → mặt bằng → loại hình (H3) → 4 lý do đầu tư → 3 lý do mua ở → FAQ. Heading HOA.
- Trang loại căn: thông tin → giá → mặt bằng & thiết kế → lý do mua (3 H3) → ai nên mua.
- Bài ~1.200–1.800 chữ; ~15% H2/H3 là câu hỏi; ngày cập nhật hiển thị 28/30; bảng 4/30.

## Title, meta, schema

- Title tb 58 ký tự; móc tháng ở trang chủ/giá. Meta description 18–159 (có trang rất ngắn).
- Canonical tự trỏ 30/30. Schema như site vệ tinh: `BlogPosting` + `Person` + `Organization`.

## Nhịp văn

- Đoạn ~41 chữ, câu ~29 chữ.
- Mở bài định nghĩa + liệt kê tên dự án nổi tiếng của CĐT để mượn uy tín
  (ví dụ của đối thủ, không dùng: "<X> không chỉ là … mà còn là biểu tượng mới của …").
- "tôi" và "chúng tôi" ngang nhau (48/48) → không rõ ai đang nói.

## Liên kết nội bộ

- Khối "bài liên quan" cố định 10 bài (giá, căn hộ, nhà phố, tiến độ, cao tốc, song lập, đơn lập, pháp lý, vị trí, công viên chủ đề)
  → mỗi bài nhận 30–34 link thân bài; anchor = nguyên tiêu đề kèm tháng.
- Menu: giá, tiến độ, nhà phố, căn hộ, blog, liên hệ (87 link khung mỗi đích).
- Không thấy link chéo có chủ đích sang site hub cùng dự án.

## Nên học / nên tránh (kỹ thuật)

- Học: trang tiện ích ngoại khu riêng; bài theo kịch bản khai thác (cho thuê ngắn ngày) và theo chân dung (người cao tuổi, gia đình).
- Tránh: **hai trang/hai site cho cùng một dự án** (tự cạnh tranh); dùng song song tên cũ/tên mới của dự án không giải thích;
  hậu tố title không thống nhất; khối liên quan cố định; giọng "tôi"/"chúng tôi" lẫn lộn.
