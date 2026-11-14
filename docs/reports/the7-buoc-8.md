# The7 bước 8 – sửa một mạch theo đánh giá độc lập (2026-11-12)

Nguồn lỗi: `docs/reports/the7-danh-gia-doc-lap.md` (3 Chặn · 7 Nặng · 11 Vừa · 7 Nhẹ). Làm trên STAGING, theo lớp, không quay lại vá:
**Theme Options → theme con → widget/form → mẫu WPBakery → nội dung từng trang → tài liệu**. Nhật ký: `docs/STAGING-LOG.md`
(mục 2026-11-12 bước 8). Ảnh trước | sau (360/1024/1366): `screenshots/the7/buoc-8/`.

## Kế hoạch và trạng thái

| # | Lỗi | Cách sửa | Nơi sửa (người dùng tự chỉnh được) | Trạng thái |
|---|---|---|---|---|
| C1 | Trang chủ không hero ảnh, H1 "Công ty TNHH…" | Hero tràn ảnh The Privé (19968), chuyển sắc trái → phải, H1 "Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận", đoạn dẫn, nút "Nhận tư vấn" + "Xem dự án" (viền trắng) – chữ nguyên văn bản đã duyệt (Cài đặt Velis cũ) | WPBakery: hàng `hero` (Design Options ảnh nền), 2 phần tử **Button**; title Rank Math | **Đã sửa**. Khác bản duyệt: không có dải "Dự án nổi bật" trong hero – lưới dự án ngay sau dải con số (tránh lặp 2 lần cùng 6 dự án) |
| C2 | Link nút lưu dạng `url:https%3A%2F%2Fstaging…` | Mọi link nội bộ trong 16 trang đã sửa → tương đối; công cụ on-page thêm kiểm `staging-encoded` (mã hóa URL + link trong Raw HTML base64) có self-test | `tools/the7_check_onpage.py` | **Đã sửa**: 0 / 234 URL. Dạng thường (`https://staging…`, 553 chỗ, chủ yếu bài blog) được search-replace thay khi ra mắt |
| C3 | Kế hoạch ra mắt vẫn theo theme velis | Viết lại cho The7: phương án A (chuyển CSDL + search-replace cả dạng mã hóa + danh sách trả lại cài đặt site thật), phương án B (làm lại từng thay đổi), kiểm sau ra mắt (canonical), quay lui | `docs/KE-HOACH-RA-MAT.md` | **Đã sửa** – người dùng chọn A/B |
| N1 | 1024 px menu 2 dòng, header 108 px | Header thu gọn tới 1100 px (1 khóa) | TO › Header › Mobile header `header-mobile-first_switch-after` | **Đã sửa** |
| N2 | Trang dự án 1 cột, 32–35 nghìn px ở 360, khối tư vấn không form | Cột phải dính "Sidebar dự án" (nút Nhận bảng giá, gọi, Zalo; ẩn trên điện thoại – có thanh liên hệ đáy); mục lục Easy TOC; khối chữ dài thu "Xem thêm" (~60 chữ hiện); khối "Nhận tư vấn" 2 cột có form CF7 | TO › Widget Areas + Giao diện › Widget; meta Sidebar Options; WPB **Toggle** (Extra class `velis-more`), phần tử **Contact Form 7** | **Đã sửa** – chiều cao 360 px xem bảng đo |
| N3 | Phần đầu dự án: không breadcrumb, không thanh thông tin, ảnh nhỏ lộ huy hiệu, H1 rớt chữ | Phần đầu 1 cột: phần tử **Breadcrumbs**, nhãn, H1 (`text-wrap: balance`), ảnh 16:9 cắt huy hiệu, đoạn dẫn, thanh thông tin 6 ô **dữ liệu thật** (lấy từ bảng/đoạn của chính trang), nút | WPB hàng `gioi-thieu` | **Đã sửa** |
| N4 | /du-an/ H1 hoa, thẻ thiếu thông tin, không lọc, thẻ lẻ | Tiêu đề "Dự án"; 1 thẻ ngang nổi bật + lưới 3 × 2: chủ đầu tư · khu vực → tên → loại → bàn giao → "Xem dự án →" | WPB trang 19537 (thẻ = Single Image + Text Block) | **Đã sửa**, trừ **lọc khu vực**: site chưa có phân loại khu vực (chuyên mục dự án theo chủ đầu tư, 4 dự án không có chuyên mục con) – cần thêm phân loại, để đợt dữ liệu |
| N5 | Dưới hero: số liệu lệch, đệm 35/0, 1 logo, không "Xem tất cả" | Con số 10+ · 50+ · 999+ · 99+ Playfair 48 champagne-text #8A6A3A; nhịp 96/64/48 (`velis-section`, hàng có nền có đệm dưới); đối tác lưới 4 ô đủ 4 logo; "Xem tất cả dự án", "Xem tất cả bài viết"; 3 bài; 2 hộp Thi thử / Tuyển dụng có câu mô tả | WPB trang 19526 | **Đã sửa**. Form cuối trang: dùng form "Liên hệ" của footer (đã có sẵn ngay dưới) thay vì thêm form thứ 2 chồng lên |
| N6 | Form thiếu ô đồng ý NĐ 13/2023, ô SĐT | `[acceptance dong-y]` bắt buộc + link /chinh-sach-bao-mat/ (trang có sẵn); ô SĐT đã là `type="tel"` (bàn phím số trên điện thoại) – CF7 không có tùy chọn `inputmode` | Liên hệ › Contact Form 7 › "Liên Hệ" | **Đã sửa**; nội dung chính sách bảo mật có đủ theo NĐ 13 hay không: **cần chủ site** xem |
| N7 | Thanh liên hệ che nút hero, không hiện ở tablet | Hiện sau khi cuộn qua 60 % màn đầu; < 1024 px | theme con 1.4.0 | **Đã sửa** |
| V1 | Giới thiệu toàn chữ, Title Case | Ảnh văn phòng (Media 20120, có sẵn), tiêu đề kiểu câu, khối nhấn tối (khẩu hiệu) | WPB trang 19551 | **Đã sửa**; không thêm cột phải |
| V2 | Liên hệ có 2 Raw HTML, "bạn" | Bỏ thẻ thông tin trùng (giữ link mạng xã hội vào danh sách liên hệ), bản đồ → phần tử **Google Maps**; "anh chị" | WPB trang 19544 | **Đã sửa** |
| V3 | Nút hero là shortcode thô, stat_counter khó sửa | Nút = phần tử Button riêng; con số = Text Block; mọi hàng có tên (Row ID) | WPB | **Đã sửa** |
| V4 | 2 mục lục ở bài viết | Gỡ widget Mục lục khỏi Default Sidebar (giữ Easy TOC trong bài) | Giao diện › Widget | **Đã sửa**; ảnh 2/3 cột và dải tiêu đề căn giữa trên mobile: chưa sửa |
| V5 | Đầu trang nhiều kiểu, thiếu breadcrumb | Dự án + chủ đầu tư: breadcrumb trong phần đầu WPB; còn 2 kiểu (hero trang chủ; dải tiêu đề The7 + phần đầu WPB cùng nền ngà, H1 56 căn trái) | – | **Một phần**: breadcrumb /blog/ vẫn "Chuyên mục "Blog"" (chuỗi dịch của The7 – sửa bằng Loco Translate, chưa làm) |
| V6 | Tìm kiếm/tác giả/thẻ chưa có mẫu | Gán trang mẫu 20733 | TO › Archives | **Đã sửa** |
| V7 | Vinhomes 1 dự án = thẻ nhỏ | Thẻ ngang hết khung (`velis-card-wide`) | WPB | **Đã sửa** |
| V8 | "anh/chị", từ cường điệu | "anh/chị" → "anh chị" trên 16 trang đã sửa | – | **Một phần**: viết lại từ cường điệu cần biên tập + chủ site duyệt (đổi ý câu chữ), chưa làm |
| V9 | Alt không dấu, huy hiệu in chìm | Ảnh hero/thẻ/thumbnail The7: phóng cắt 1,12 neo góc phải trên (ẩn huy hiệu góc trái dưới) | `velis.css` (`.velis-crop`, thumbnail) | **Một phần**: ảnh trong nội dung bài/thư viện vẫn lộ huy hiệu; 128 alt không dấu ở bài blog chưa sửa |
| V10 | `/du-an/the-prive/`, `/the-prive/` → bài blog | 301 regex (PHP) → `/can-ho-the-prive/` | Rank Math › Chuyển hướng | **Đã sửa** |
| V11 | Title "The Prive", Title Case | 8 title kiểu câu, có dấu | Rank Math | **Đã sửa** (`data/seo/the7-buoc-8-title.csv`) |
| Nhẹ 1 | SĐT "091 123 7979" | → "0911 237 979" (bài 20468, khóa ngày sửa) | – | **Đã sửa** |
| Nhẹ 2 | Title trùng Spring Ville / Vinhomes | Title riêng cho 4 trang chuyên mục | Rank Math (chuyên mục) | **Đã sửa**; "Chuyên gia Vũ Xuân" ×10 (phân trang tác giả) giữ – trang 2+ đã noindex |
| Nhẹ 3 | target-size, heading-order | – | – | Chưa sửa |
| Nhẹ 4 | Nút lên đầu trang đè chân trang | Chân trang chừa 64 px bên phải khi < 1024 | `velis.css` | **Đã sửa** |
| Nhẹ 5 | Khung 1300 ở 1920 (DESIGN 1320 từ 1600) | – | – | Chưa sửa (The7 chỉ có 1 giá trị) |
| Nhẹ 6 | Dự án là bài viết → BlogPosting, dòng "Chuyên mục · Bởi" | – | – | Chưa sửa |
| Nhẹ 7 | Chuyên mục `/du-an-bds/…` rỗng còn 200 | Đổi tên chuyên mục "Dự Án" → "Dự án" | – | Xóa/gộp cần duyệt riêng (như bước 7) |

## Đo sau khi sửa

| Chỉ số | Trước (đánh giá độc lập) | Sau |
|---|---|---|
| 16 trang × 7 khung (360–1920): tràn ngang / H1 ≠ 1 / ảnh hỏng | 0 / 0 / 0 | 0 / 0 / 0 (140 ảnh chụp; 2 lần lỗi tạm do xóa cache giữa lúc chụp, chụp lại đạt) |
| Chiều cao trang dự án ở 360 px (chuẩn ≤ 16 000) | The Privé 32 353 · The Global City 33 917 · Persa 35 365 | 15 129 · 15 247 · 15 203 |
| Chủ đầu tư ở 360 px | Vinhomes 19 131 | Vinhomes 13 418 · Gamuda 8 776 |
| Lighthouse mobile, trung vị 3 lần (Hiệu năng / Truy cập) | trang chủ 96 · /blog/ 91 · The Privé 96 · bài Dòng vốn 96 | trang chủ **89** / 97 · /blog/ 85 / 95 · The Privé 98 / 92 · Persa 91 / 92 · bài Dòng vốn 98 / 97 |
| LCP trang chủ | 1,2 s (chữ – không có ảnh hero) | 3,3 s (ảnh hero 100 KB, đã preload theo ảnh đặt trong WPBakery) |
| Màu ngoài bảng DESIGN.md (`tools/the7_ui_audit.mjs`, 17 trang × 1366/390) | 2 | 2 (cả hai của link "Bỏ qua tới nội dung", chỉ hiện khi bấm Tab) |
| On-page 234 URL (`tools/the7_check_onpage.py`) | title/mô tả/H1/link: 0 lỗi; alt không dấu 128 | 0 lỗi; **link staging mã hóa/ẩn: 0**; alt không dấu 128 (bài blog, chưa sửa) |
| Lỗi console (UA điện thoại, sau khi chạm/cuộn) | 0 | 0 (4 trang: trang chủ, dự án, chủ đầu tư, Liên hệ) |
| Tương tác điện thoại | – | thanh liên hệ ẩn ở màn đầu, hiện sau khi cuộn; "Xem thêm" mở + đổi thành "Thu gọn"; menu mở; ô đồng ý có ở mọi form |
| Ngày sửa của 16 trang/bài | – | không đổi (Lock Modified Date) |

/blog/ 85 (trước 91): 3 lần đo 83/85/91, dao động lớn; trang /blog/ không bị sửa ở bước này. Trang chủ thấp hơn trước vì giờ có ảnh
hero (yêu cầu C1); nén ảnh QUIC.cloud: chủ site quyết định không làm (2026-11-12).

## Lưu ý nội dung (cần chủ site)

- The Privé: bảng thông tin ghi bàn giao **năm 2027**, đoạn tiến độ ghi "giao nhà đúng tiến độ **Quý 1/2028**" – thanh thông tin đang lấy theo
  bảng; cần chủ site chốt một mốc.
- Vị trí trong thanh thông tin ghi theo khu vực thị trường "(trước đây Quận 2…)" vì chưa có nguồn chính thức tên phường/xã mới cho
  từng dự án (Vinhomes Saigon Park đã có "xã Xuân Thới Sơn" trong bài).
- Ô đồng ý dẫn tới /chinh-sach-bao-mat/ (trang có sẵn) – nội dung trang có đủ theo NĐ 13/2023 chưa: chủ site/pháp chế xem.

## Cách người dùng tự chỉnh

- **Cột phải trang dự án/chủ đầu tư:** Giao diện → Widget → "Sidebar dự án". Bật/tắt cho từng trang: sửa trang → hộp
  **Sidebar Options** (Right / Disabled, "Hide on mobile").
- **Thanh thông tin 6 ô, phần đầu, "Xem thêm":** sửa trang bằng WPBakery – hàng "gioi-thieu"; mỗi khối "Xem thêm" là một phần tử
  Toggle (Extra class `velis-more`), kéo chữ vào/ra để chọn phần hiện sẵn.
- **Trang mới:** WPBakery → Templates → "Velis – Dự án" / "Velis – Chủ đầu tư" (đã cập nhật cấu trúc mới).
- **Form:** Liên hệ → Contact Form 7 → "Liên Hệ" (một form dùng chung mọi nơi).
- **Header 1024:** Theme Options → Header → Mobile header → "Switch after".

## Quay lui

Xem cuối mục bước 8 trong `docs/STAGING-LOG.md` (options-truoc-b8, theme con 1.3.0, bản sửa đổi theo `data/the7/buoc-8/ban-sua-doi-truoc.json`,
CF7 bản cũ, widget Mục lục, title cột "truoc", chuyển hướng the-prive, tên chuyên mục).

## Quyết định của chủ site (2026-11-12)

- Nén ảnh / QUIC.cloud: **không làm** (không đăng ký QUIC.cloud). Lighthouse trang chủ 89, /blog/ 85 được chấp nhận như hiện tại.
- Mâu thuẫn bàn giao The Privé (2027 / Quý 1/2028) và nội dung trang chính sách bảo mật: **chưa sửa nội dung**, giữ nguyên.
