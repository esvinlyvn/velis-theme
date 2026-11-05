# theprivesr.vn – phân tích kỹ thuật

Crawl 2026-11-05 (32 URL sitemap, 28 trang mẫu; đợt đầu bị ngắt mạng, chạy lại sau khi người dùng xác nhận mạng ổn).
Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**. Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site vệ tinh **một dự án căn hộ** (khu Đông), cùng khuôn và cùng đơn vị với vinhomeshocmonsr.vn (cùng tác giả trong schema, cùng hotline).
  Nhỏ nhất trong nhóm: 27 bài + 4 trang + trang chủ.
- Slug phẳng `<chủ-đề>-<dự-án>`; loại căn đặt theo **số phòng ngủ** (`can-ho-<n>-phong-ngu-<dự-án>`, penthouse).
- Gần như mọi bài có lastmod 16/06/2026 (cập nhật hàng loạt); chỉ trang giá, tiến độ, trang chủ được cập nhật sau đó.
- Hậu tố title và byline dùng **tên chủ đầu tư** thay vì tên đơn vị phân phối → người đọc dễ hiểu nhầm là site chính thức của CĐT.

## Cụm nội dung

| Nhóm | Số URL | Ghi chú |
|---|---:|---|
| Trang dữ kiện (giá, tiến độ, pháp lý, vị trí, tiện ích, mặt bằng, nhà mẫu, hạ tầng, CĐT) | 9 | Có thêm trang **mặt bằng** riêng ("nên chọn block nào") và **nhà mẫu** |
| Loại căn theo số phòng ngủ + penthouse | 4 | Khung: thiết kế → tiêu chuẩn bàn giao → giá → 3 lý do |
| Câu hỏi đầu tư / chân dung người mua | 9 | có nên đầu tư, lướt sóng, cho thuê, thanh khoản, gia đình trẻ |
| So sánh | 2 | so với dự án cùng phân khúc; 1PN hay 2PN để cho thuê |
| Thị trường khu vực (dùng tên quận cũ) | 2 | Bài khu vực đặt tên theo quận trước sáp nhập |

## Trình bày trang

- Trang chủ ~3.900 chữ, thứ tự H2 như các site cùng khuôn (tổng quan → mở bán đợt mới → tiến độ → vị trí → tiện ích → giá → mặt bằng
  → loại căn (H3 1PN/2PN/3PN/duplex/penthouse) → lý do đầu tư → lý do mua ở → pháp lý → CĐT → FAQ). Heading HOA.
- Trang loại căn căn hộ chung cư thêm H2 **tiêu chuẩn bàn giao** — điểm phù hợp với sản phẩm căn hộ.
- Trang mặt bằng: mặt bằng tổng thể (H3 phân khu/block) → mặt bằng căn hộ (H3 loại căn, thiết kế) — trả lời "nên chọn block nào".
- Bài 1.300–1.600 chữ; ~17% H2/H3 là câu hỏi; ngày cập nhật hiển thị 25/28 trang; bảng 4/28.

## Title, meta, schema

- Title tb 60 ký tự; hậu tố tên CĐT; móc thời gian "tháng/năm" ở title trang giá, tiến độ, trang chủ.
- Meta description 27–160 ký tự; nhiều câu kết "bấm xem ngay".
- Canonical tự trỏ 28/28. Schema giống site cùng khuôn (`BlogPosting`, `Person`, `Organization`), có khai báo kiến trúc sư,
  nhà thầu, sàn chứng khoán… làm `Organization` liên quan.

## Nhịp văn

- Đoạn ~44 chữ, câu ~31 chữ — dài như các site cùng khuôn.
- Mở bài lặp lại câu hỏi tiêu đề rồi gắn ngay vị trí + tên CĐT (ví dụ của đối thủ, không dùng: "<CĐT> chủ đầu tư <dự án> có uy tín không? là câu hỏi…").
- Xưng hô trộn "bạn" (31), "anh chị", "quý khách", "tôi", "chúng tôi" gần ngang nhau.

## Liên kết nội bộ

- Vì site nhỏ, **khối "bài liên quan" cố định** (10 bài trụ: giá, tiến độ, vị trí, pháp lý, 2PN, 3PN, nút giao, tiện ích, nhà mẫu, gia đình trẻ)
  xuất hiện ở hầu hết bài → 10 trang này nhận 23–36 link thân bài mỗi trang; anchor = nguyên tiêu đề (kèm tháng).
- Menu: giá, tiến độ, CĐT, blog, liên hệ. Trang chủ nhận link khung chủ yếu qua logo.
- Link ngang trong nhóm: loại căn ↔ loại căn (20), phân tích ↔ phân tích (14); phân tích → loại căn (12).

## Nên học / nên tránh (kỹ thuật)

- Học: với dự án căn hộ, tách trang **mặt bằng/chọn block**, **nhà mẫu**, **tiêu chuẩn bàn giao** trong trang loại căn;
  loại căn theo số phòng ngủ; bài so sánh lựa chọn trong cùng dự án (1PN hay 2PN cho mục tiêu cho thuê).
- Tránh: hậu tố title/byline dùng tên CĐT (gây hiểu nhầm là kênh chính thức); khối liên quan cố định với anchor là tiêu đề có tháng
  (lỗi thời đồng loạt); tên khu vực theo quận cũ không kèm tên phường mới; câu dài, xưng hô lẫn lộn.
