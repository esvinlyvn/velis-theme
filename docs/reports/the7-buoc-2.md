# The7 – bước 2: mẫu WPBakery cho trang dự án, chủ đầu tư, bài viết (staging, 2026-11-11)

Mục tiêu: bố cục nằm trong WPBakery, kéo thả được, không nằm trong PHP. Toàn bộ 109 bài trên site đều dựng bằng WPBakery
(thường chỉ 1 khối chữ dài), nên cả 3 loại đều có mẫu WPBakery.

## 3 mẫu đã lưu (WPBakery → Mẫu của tôi)

| Mẫu | Các hàng (kéo lên/xuống, xóa, nhân đôi được) |
|---|---|
| **Velis – Dự án** | Phần đầu (nền ngà: chủ đầu tư, H1, vị trí, ưu đãi, nút **Nhận tư vấn** + số gọi, ảnh) → Thông số chính (4 ô) + bảng → Giới thiệu → Vị trí → Tiện ích → Mặt bằng (3 ảnh bấm phóng to) → Giá bán → Câu hỏi thường gặp (khối Toggle) → Liên hệ tư vấn (nền ngà) → Bài viết liên quan |
| **Velis – Chủ đầu tư** | Phần đầu (tên, giới thiệu, logo) → Lưới dự án (ảnh + tên + vị trí, bấm vào trang dự án) → Giới thiệu → Câu hỏi → Liên hệ tư vấn → Bài viết liên quan (khối The7 Blog list, chọn chuyên mục) |
| **Velis – Bài viết** | Mở bài → ảnh → các ý chính (H2) → khối Liên hệ tư vấn. Tiêu đề, breadcrumb, mục lục (Easy TOC), "Bài viết nên xem" vẫn do The7/plugin tự hiện như cũ |

Nền, khoảng cách hàng nằm trong **Design Options** của từng hàng, nên sửa được ngay trong WPBakery. `velis.css` (theme con 1.1.1)
chỉ thêm kiểu chữ cho vài class trong mẫu (dòng nhỏ phía trên H1, 4 ô thông số, tên dự án trong lưới).
Bản gốc của mẫu: `data/the7/mau-wpbakery/`.

## Áp thử trên 3 trang (chỉ sắp lại nội dung thật đang có)

- **Căn hộ Persa Place** (bài 19855): giờ có 13 hàng.
  - Lên phần đầu: H1, vị trí và hạn bàn giao lấy từ bảng thông tin. Hộp chữ vàng "Nhận Booking ưu tiên 50 triệu/suất…" thành một dòng trong phần đầu.
  - 4 dòng của bảng thành 4 ô thông số: quy mô, số sản phẩm, diện tích đất, bàn giao.
  - Đoạn "Liên hệ tư vấn" ở cuối bài thành khối liên hệ.
  - Nút "HOTLINE: 0911237979" thay bằng nút **Nhận tư vấn** và dòng "Hoặc gọi 0911 237 979".
- **Gamuda Land** (trang 19637): giờ có 10 hàng. Thêm lưới 2 dự án đã có trang trên site: Spring Ville và Persa Place. Mô tả vị trí lấy từ chính nội dung site.
- **Tiêu chuẩn bàn giao Persa Place** (bài 20330): 2 đoạn cuối mời liên hệ thành khối "Liên hệ tư vấn".
- Tiêu đề H1/H2 gõ CHỮ HOA hoặc Viết Hoa Từng Chữ đã đổi sang chữ thường kiểu câu. Sửa luôn lỗi gõ "PALCE" thành "Place".
- Bỏ đường kẻ chấm hồng cũ.
- Đối chiếu bằng máy: ngoài các thay đổi trên, không mất chữ nào (`tools/the7_ap_mau_buoc2.py`).

## Kết quả đo (khách xem staging, sau khi xóa cache)

| Bộ đo | Trước | Sau |
|---|---|---|
| 3 trang × 7 khung (360–1920): tràn ngang / số H1 ≠ 1 / ảnh hỏng | 0 / 0 / 0 | 0 / 0 / 0 |
| Link gạch chân, link tương phản < 4,5:1 | — | 0, 0 |
| Lighthouse mobile – Persa Place (Perf / A11y) | 94 / 87 (bước 1) | 92 / 90 |
| – Gamuda Land | chưa đo | 93 / 87 |
| – Tiêu chuẩn bàn giao | chưa đo | 93 / 92 |
| Trình sửa WPBakery (Backend) | 1 khối chữ dài | từng hàng có tên (`gioi-thieu`, `thong-so`, `vi-tri`…), kéo thả được |

Lỗi A11y còn lại đều có từ trước, thuộc nội dung và plugin:
- ảnh thiếu alt;
- thứ tự tiêu đề H3 nằm trong H2 của bài;
- vùng bấm nhỏ của nút nổi Buttonizer.

Ảnh:
- trang sau khi áp mẫu: `screenshots/the7/sau-b2/` (360, 768, 1366; đủ 7 khung nằm ngoài repo);
- trước | sau và ảnh chụp trình sửa: `screenshots/the7/truoc-sau-b2/`.

## Tạo trang dự án mới từ mẫu (wp-admin)

1. **Bài viết → Thêm Bài Viết** (dự án hiện là bài trong chuyên mục "Dự án"), gõ tiêu đề.
2. Bấm **Backend Editor** (nút xanh WPBakery).
3. Trên thanh xanh, bấm biểu tượng **Templates** (hình chồng lớp) → tab **My Templates** → bấm **Velis – Dự án**.
4. Từng khối: rê chuột → bút chì để sửa chữ, ảnh. Thay mọi chữ trong ngoặc vuông `[…]`. Khối không dùng thì bấm thùng rác, muốn đổi thứ tự thì kéo tay cầm ⠿ của hàng.
5. Màu nền, khoảng cách một hàng: bút chì của hàng → tab **Design Options**.
6. **Xem trước**, rồi **Đăng**.

Trang chủ đầu tư làm như vậy, chọn mẫu **Velis – Chủ đầu tư** (đây là Trang, đặt trang cha "Dự án").
Bài blog chọn mẫu **Velis – Bài viết**.

Quy tắc khi điền:
- Vị trí ghi theo phường/xã mới, có thể kèm "(trước đây Quận 2)".
- Giá phải ghi kèm thời điểm.
- Không điền số liệu chưa có nguồn.

## Quay lui

- Nội dung: Sửa bài → **Bản sửa đổi** → khôi phục 20577 (Persa Place), 20563 (Gamuda Land), 20653 (Tiêu chuẩn bàn giao).
- Mẫu: WPBakery → Templates → My Templates → xóa 3 mẫu `Velis – …`.
- CSS: tải lại theme con 1.0.0 (commit a81a0b7).

## Chưa làm (chờ người dùng xem 3 trang mẫu)

- Áp mẫu cho các trang và bài còn lại.
- Nội dung, để làm ở bước 3:
  - Gamuda Land còn ghi "TP. Thủ Đức", tên này đã bỏ từ 01/07/2025.
  - Vị trí Persa Place ghi "Nhơn Trạch" mà không có tên xã mới. Không tự điền vì chưa đối chiếu được nguồn chính thức.
  - Tiêu đề H3 vẫn Viết Hoa Từng Chữ.
  - Ảnh thiếu alt.
- "Bài viết nên xem" của The7 ở cuối bài blog đang hiện khoảng 26 bài, rất dài. Có thể giảm trong The7 → Theme Options → Blog.
