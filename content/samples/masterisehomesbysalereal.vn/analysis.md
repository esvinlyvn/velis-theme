# masterisehomesbysalereal.vn – phân tích kỹ thuật

Crawl 2026-11-05 (367 URL sitemap, 77 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site **hub theo chủ đầu tư** (căn hộ cao cấp), cùng khuôn với vinhomebysalereal.vn: CPT `du-an` (18 URL: lưu trữ + ~13 dự án/phân khu),
  331 bài, 12 chuyên mục "blog <dự án>", 6 trang tĩnh. Slug phẳng 1 cấp cho mọi kiểu.
- Trang lưu trữ `/du-an/` nhóm dự án theo **tỉnh/thành** (H2 vùng → H2 dự án).
- 348/367 URL lastmod năm 2026 (vẫn hoạt động), 17 URL còn từ 2024.
- Có **breadcrumb** hiển thị ở 59/77 trang (trang chủ » blog dự án » bài) — rõ cấp cha–con dù slug phẳng.

## Cụm nội dung

| Nhóm | Số URL (xấp xỉ) | Ghi chú |
|---|---:|---|
| Trang dự án (CPT) | ~13 | Khung H2 giống site hub Vinhomes, thêm FAQ + khối người tư vấn |
| Dữ kiện × dự án (giá, tiến độ, pháp lý, vị trí, chính sách/thanh toán) | ~50 | Có thêm **phương thức thanh toán** riêng |
| Tiện ích theo **nhóm người dùng** (người cao tuổi, trẻ em, giáo dục, y tế, xanh) | ~29 | Tiện ích cắt theo chân dung cư dân thay vì theo hạng mục |
| Vật liệu / tiêu chuẩn bàn giao (sàn gỗ, thiết bị…) | vài bài | Chủ đề riêng cho căn hộ cao cấp |
| Câu hỏi đầu tư / thuê / thanh khoản | ~44 | |
| So sánh dự án | 10 | `so-sanh-<dự-án>-voi-cac-du-an-khac` |
| Phân khu + tin công trường (cất nóc, khởi công) | ~5 | Tin sự kiện gắn với phân khu cụ thể |

## Trình bày trang

- Trang dự án ~3.200 chữ: thông tin → tiến độ → vị trí → tiện ích → giá (H3 chính sách) → mặt bằng → lý do đầu tư → lý do mua ở → FAQ
  → **khối người tư vấn** (H3 giới thiệu bản thân) → tin phân tích. Heading HOA.
- Trang chuyên mục blog dự án: thiếu meta description (3/3 mẫu).
- Bài ~1.000–1.500 chữ; ~21% H2/H3 là câu hỏi; ngày cập nhật hiển thị 71/77; bảng 11/77.
- Dấu hiệu "làm mới" bằng cách đổi năm ở title nhưng H2 bên trong vẫn năm cũ (title 2026, H2 ghi 2025) → mâu thuẫn trong trang.

## Title, meta, schema

- Title tb 62 ký tự (24–94), hậu tố viết tắt thương hiệu; meta description 0–236 ký tự (3 trang thiếu, vài trang quá dài).
- Canonical tự trỏ 77/77. Schema: `BlogPosting`, `Person` có `jobTitle` (người đứng đầu đơn vị phân phối), `Organization`;
  khai báo nhiều thực thể liên quan (kiến trúc sư, tổng thầu, trường, bệnh viện, cơ quan nhà nước).

## Nhịp văn

- Đoạn ~46 chữ, câu ~27 chữ (trung vị) — ngắn hơn chút so với site vệ tinh.
- Ngôi "tôi" (97) cùng "quý khách" (101), "bạn" (64), "khách hàng" (236) → vẫn lẫn.
- Bài tiện ích theo chân dung (người cao tuổi, trẻ em) viết dạng "lợi ích cho nhóm X", tiêu đề kiểu "nơi an toàn cho…"
  (ví dụ của đối thủ, không dùng: "Nơi an toàn cho người cao tuổi <dự án>").

## Liên kết nội bộ

- Menu: 4 dự án trọng điểm + `/blog/` + `/du-an/` (~230 link khung mỗi đích).
- **Khối liên quan toàn site gắn cứng cho một dự án**: 10 bài của một dự án nhận 58–66 link thân bài mỗi bài, kể cả từ trang
  của dự án khác → dồn sức mạnh lệch, không theo ngữ cảnh. Anchor = nguyên tiêu đề có năm.
- Anchor chung chung "tham khảo dự án" (27), tên CĐT trần (52).
- Trang dự án → chuyên mục blog dự án (vùng khung) và → phân khu.

## Nên học / nên tránh (kỹ thuật)

- Học: breadcrumb hiển thị theo cấp dự án; tiện ích viết theo **chân dung cư dân**; trang **phương thức thanh toán** riêng;
  bài vật liệu/tiêu chuẩn bàn giao cho căn hộ cao cấp; tin công trường gắn phân khu; lưu trữ dự án theo vùng.
- Tránh: khối liên quan cố định cho một dự án trên mọi trang; đổi năm ở title mà không cập nhật nội dung; chuyên mục thiếu meta description;
  anchor chung chung; khối giới thiệu người tư vấn chen giữa trang dự án.
