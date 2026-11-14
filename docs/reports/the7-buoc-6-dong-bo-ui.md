# The7 bước 6 – đồng bộ UI/UX + nhận diện một mạch (2026-11-11, staging)

Chuẩn: `DESIGN.md`. Cách làm theo `docs/THE7.md`: Theme Options trước, rồi WPBakery (mẫu + bảng màu), rồi nội dung, CSS theme con chỉ
cho phần The7 không có. Làm theo lớp, mỗi lớp một lần: (1) Theme Options → (2) CSS một nơi → (3) WPBakery → (4) nội dung → (5) nhận diện
→ (6) đo. Nhật ký thao tác: `docs/STAGING-LOG.md` (mục bước 6).

## Kết quả đo (17 trang × 1366/390, `tools/the7_ui_audit.mjs`, cùng danh sách trang với bản kiểm kê)

| Chỉ số | Trước (`the7-ui-kiem-ke.md`) | Sau |
|---|---|---|
| Màu hiển thị (chữ, nền, viền) | 33 giá trị | 22 |
| Màu ngoài bảng DESIGN.md | **25** | **4** – 2 của Buttonizer (chưa đụng, chờ chọn thanh CTA), 2 của link "Bỏ qua tới nội dung" (chỉ hiện khi dùng phím Tab) |
| Kiểu đầu trang (H1) | 3 (44/28 căn giữa; 56 căn trái; 56 CHỮ HOA trong nội dung) | **1**: Playfair 600 56 px desktop / 36 px mobile, căn trái, nền ngà – 17/17 trang |
| Tiêu đề CHỮ HOA / Viết Hoa Từng Chữ trong nội dung | 38 / 15 | 0 / 0 (cả tiêu đề trang/bài và menu) |
| Font đang render | Be Vietnam Pro, Playfair, Roboto, Arial, Font Awesome 5 + 7, icomoon | Be Vietnam Pro, Playfair (+ 3 bộ icon). Roboto, Arial: 0 |
| Thẻ | nền #F5F5F5, bóng thường trực, góc 0 | nền trắng, viền #E4DED5, góc 2, bóng chỉ khi rê chuột |
| Footer | nền #F4F4F4, kẻ xanh lá | nền #1A1A1A, kẻ champagne 1 px, chữ #B9B9B9 |
| Ô nhập | cao 38–40, viền ≈ 1,2:1, chữ #85868C, góc 0 | cao 48, viền #C9C1B5, chữ #1A1A1A, góc 2, thông báo tiếng Việt |
| Chữ nội dung | 19/30 mọi khung | 18/30 (19/32 từ 1600 px) |
| CSS của Velis | 2 nơi: Custom CSS The7 40 dòng + `velis.css` 32 dòng | 1 nơi: `velis.css` (≈ 100 dòng, 9 KB); Custom CSS The7 trống |
| Tràn ngang / H1 ≠ 1 / ảnh hỏng (14 trang × 7 khung) | 0 / 0 / 0 | 0 / 0 / 0 |
| On-page 234 URL (`the7_check_onpage.py`) | 128 alt tên file | 128 alt tên file (không lỗi mới) |
| Lỗi console (7 trang, điện thoại) | – | 0; menu mobile, Hỏi đáp, carousel, form hiển thị: đạt |

**Lighthouse mobile** (trung vị 3 lần; trước = lần đo gần nhất bước 4/5):

| Trang | Trước | Sau | Ghi chú |
|---|---|---|---|
| Trang chủ | 87 | 91 | |
| The Global City | 89 | 94 | |
| Bài "Dòng vốn…" | 92 | 97 | |
| Persa Place | 90 | 82–86 | **tụt > 3**: chữ nhỏ lại (19 → 18) nên phần tử lớn nhất đổi từ khối chữ sang ảnh phần đầu (103 KB); TTFB staging 650–800 ms |
| /blog/ | 87 | 81–82 | **tụt > 3**: cùng lý do, ảnh thẻ đầu (88 KB) thành LCP |

Tương phản: lỗi duy nhất còn lại là ngày ở "Bài viết nên xem" (The7 làm mờ 50 % ≈ 3,3:1) – đã sửa sau lần đo cuối (`.text-secondary`
đặc #5C5C5C, đo lại computed = 6,3:1), chưa chạy lại Lighthouse sau sửa này.

Ảnh trước | sau: `screenshots/the7/buoc-6/<trang>-{360,768,1366}.webp` (14 trang); đủ 7 khung ở scratchpad (`b6/truoc`, `b6/sau`).

## Đã đổi – sửa tiếp ở đâu trong wp-admin

| Thứ | Ở đâu |
|---|---|
| Màu, chữ (cỡ nội dung, H1–H6), nút S/M/L, ô nhập + thông báo form, thẻ (Content boxes), bo góc, tiêu đề trang (căn trái 56/36), breadcrumbs, sidebar (nền ngà, dính), footer + bottom bar | The7 → Theme Options (General Appearance, Typography, Buttons, Contact Forms, Page Titles, Sidebar, Footer & Bottom Bar) |
| Module không dùng (Portfolio, Team, Testimonials, Albums, Slideshow) đã tắt | The7 Classic → Settings |
| Bảng màu khi chọn màu trong WPBakery = 8 màu thương hiệu | WPBakery → Color Picker |
| Bài mới mở ra đã có bố cục "Velis – Bài viết" | WPBakery → General Settings → Default template |
| 3 mẫu (Dự án, Chủ đầu tư, Bài viết) – khối dùng class `velis-section` (đệm tự đổi 96/64/48 theo khung) | WPBakery → Mẫu của tôi; trong trang: hàng → Sửa → Extra class name |
| 7 trang dự án + 4 chủ đầu tư cùng một bố cục: phần đầu 2 cột (nhãn, H1, đoạn mở, ưu đãi có sẵn, "Nhận tư vấn", số gọi, ảnh) → khối có neo → Hỏi đáp → khối liên hệ → bài liên quan | Sửa trang → WPBakery (kéo thả từng hàng) |
| Trang chủ: bỏ ảnh logo đỏ chỉ để trang trí; nút "Thi thử chứng chỉ môi giới" chuyển xuống dải "Cơ hội nghề nghiệp" (nền champagne nhạt) cạnh "Ứng tuyển ngay"; nền khối xen kẽ trắng/ngà; bộ đếm theo font/màu theme | Sửa trang chủ → WPBakery |
| Site icon (dấu V, 512 px) | Giao diện → Tùy biến → Nhận dạng site (đang là media 20772) |
| Ảnh chia sẻ mặc định 1200×630 nền ngà | Rank Math → Tiêu đề & mô tả → Meta toàn trang → Hình thu nhỏ OpenGraph; ảnh đại diện 4 trang (chủ, Liên hệ, Dự án, Giới thiệu) cũng đổi sang ảnh này |
| Số gọi một kiểu "0911 237 979" | nội dung các trang đã sửa, widget footer (Giao diện → Widget → Default Footer) |
| Phần The7 không có (bóng thẻ khi rê chuột, nhịp section theo khung, eyebrow, bảng xếp chồng mobile, Hỏi đáp, Easy TOC, 404, focus bàn phím, ô nhập dùng font trang) | `the7-child/dt-the7-child/velis.css` (theme con 1.2.0) |

Chi tiết từng chữ đổi (tiêu đề, nút, đường kẻ, nền, số gọi): `data/the7/buoc-6/thay-doi-noi-dung.csv`. Kiểm "không mất chữ":
`tools/the7_dong_bo_buoc6.py` so số từ trước/sau từng trang – chỉ mất đúng nhãn nút cũ "Hotline" (Vinhomes Saigon Park, thay bằng
"Nhận tư vấn" + "Hoặc gọi 0911 237 979") và "Đang cập nhật" (Vinhomes, thay bằng thẻ dự án Vinhomes Saigon Park có trang trên site).
**Ngày sửa của cả 23 trang/bài giữ nguyên** (Rank Math Lock Modified Date); riêng 4 trang đổi ảnh đại diện qua REST bị đổi ngày sửa.

## Quay lui

The7 → Theme Options → Export/Import → nhập `data/the7/options-truoc-b6.json`; The7 Settings bật lại 5 module; tải theme con từ commit
`937c273` (1.1.4); từng trang/bài → Bản sửa đổi theo `data/the7/buoc-6/ban-sua-doi-truoc.json`; Site Icon 18678; Rank Math OG
`velis-realty.webp`; ảnh đại diện 4 trang → 19587; Color Picker / Default template theo STAGING-LOG.

## Làm lại trên site thật khi ra mắt

Nhập `options-buoc-6.json` (sau khi so với options site thật lúc đó); tắt 5 module; tải theme con 1.2.0; lưu 3 mẫu WPBakery + Color
Picker + Default template; chạy `the7_dong_bo_buoc6.py` trên nội dung site thật (đổi `B` sang tên miền thật trong `dung-lai.json`/link
eyebrow) và lưu qua màn hình Sửa có Lock Modified Date; tải 2 ảnh ở `assets/brand/png/`, đặt Site Icon + OG Rank Math + ảnh đại diện 4
trang; sửa widget footer, 4 mục menu, 11 tiêu đề chữ hoa; xóa cache FVM + LiteSpeed.

## Chưa làm / cần quyết

- **Thanh CTA dính đáy mobile** thay Buttonizer: chờ chọn (giữ Buttonizer đổi màu, hay thanh nhỏ trong theme con).
- Persa Place và /blog/ tụt Lighthouse 4–6 điểm (ảnh phần đầu/thẻ đầu thành LCP). Hướng sửa có sẵn: nén ảnh (LiteSpeed Image
  Optimization – đang chờ duyệt vì có thể ghi `.htaccess`) hoặc chọn cỡ ảnh nhỏ hơn trong phần tử.
- ≈ 95 bài blog vẫn viết số "091 123 7979"/"0911237979" trong đoạn cuối – không sửa để giữ ngày cập nhật bài; làm khi có đợt nội dung.
- Trang mẫu cho Thẻ và Tìm kiếm (`template_page_id_*`) chưa gán: site chưa có thẻ; trang tìm kiếm The7 hiện đã cùng kiểu đầu trang.
- Khung 1320 px từ 1600 px (DESIGN 1.1) chưa làm (The7 chỉ có một bề rộng nội dung).
- 4 icon Ultimate màu #333333 ở Giới thiệu, ảnh nền `gplaypattern.jpg` của chế độ boxed (không dùng) vẫn được tải.
