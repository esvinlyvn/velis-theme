# Đánh giá độc lập bản The7 trên staging (2026-11-12, chỉ đọc)

Người đánh giá: phiên con độc lập, không dùng số liệu trong các báo cáo `the7-buoc-*`; mọi số dưới đây đo lại hôm nay.
Ảnh bằng chứng (DPR 1): `/tmp/claude-0/-home-user-velis-theme/645f47ef-cdf8-517f-b4d2-97b447db900d/scratchpad/danh-gia/`
(`shots/{trang}-{khung}[-top|-bottom].png` đủ 16 trang × 7 khung; `bang-chung-*.png`; `adm/` ảnh trình sửa WPBakery; `lh/` JSON Lighthouse).

**Phạm vi:** 16 trang × 7 khung (360, 390, 430, 768, 1024, 1366, 1920): trang chủ, /blog/, /blog/the-prive/, 2 bài
(Dòng vốn, Tiêu chuẩn bàn giao Persa), 3 dự án (The Privé, The Global City, Persa Place), /du-an/, 2 chủ đầu tư (Vinhomes,
Gamuda Land), Giới thiệu, Tuyển dụng, Liên hệ, 404, tìm kiếm `?s=vinhomes`. Site không có trang thẻ (`/tag/…` → 404, 0 thẻ).
UA điện thoại thật ≤ 768 px, UA Chrome desktop từ 1024. Không gửi form, không lưu gì trong wp-admin (mở trình sửa WPBakery
backend của 6 trang và thoát; việc mở có thể ghi khóa sửa `_edit_lock` – mặc định của WordPress).

## Điểm theo trục

| Trục | Điểm | Nhận xét ngắn |
|---|---|---|
| 1. Giao diện & đồng bộ DESIGN.md | **4/10** | Sạch kỹ thuật (0 tràn ngang, 0 ảnh vỡ/méo) nhưng xa bản đã duyệt: trang chủ không hero, trang dự án 1 cột không cột phải/thanh thông tin, header vỡ ở 1024, /du-an/ và Giới thiệu sơ sài |
| 2. UX (tìm dự án → xem → liên hệ) | **5/10** | Menu mobile tốt; nhưng không lọc dự án, thẻ thiếu thông tin, trang dự án 30–35 nghìn px trên điện thoại, khối "Nhận tư vấn" trong dự án không có form |
| 3. Kỹ thuật | **8/10** | LH mobile 91–96, CLS 0, H1 = 1, title/meta đạt, 301 một bước; trừ điểm: link staging mã hóa URL, vùng bấm nhỏ |
| 4. Chủ site tự sửa được | **7/10** | Trang dự án/chủ đầu tư là các hàng WPB có tên (gioi-thieu, tong-quan…), sửa được; trừ: nút hero trang chủ là shortcode thô trong Text Block, Liên hệ có 2 khối Raw HTML, mẫu tìm kiếm/thẻ/tác giả chưa gán |
| 5. Nội dung & thương hiệu | **6/10** | SĐT thống nhất (1 ngoại lệ), favicon + OG mặc định có; trừ: "anh/chị" và từ cường điệu dày đặc ở trang dự án, chữ hoa/Title Case gõ tay |

**Tổng số lỗi:** Chặn ra mắt **3** · Nặng **7** · Vừa **11** · Nhẹ **7**.

## Số đo chính

- Lighthouse mobile (trung vị 3 lần, UA Lighthouse – FVM bỏ qua UA này nên điểm thật thấp hơn): trang chủ 96 (LCP 1,2 s),
  /blog/ 91 (LCP 2,9 s), The Privé 96 (LCP 1,5 s), bài Dòng vốn 96 (LCP 1,4 s); TBT ≤ 30 ms; CLS 0. A11y 95–97 (lỗi `target-size`
  mọi trang, `heading-order` ở dự án và /blog/, `crawlable-anchors` ở /blog/). SEO 58–66 chỉ do staging noindex.
- 16 trang × 7 khung: tràn ngang 0, ảnh hỏng 0, ảnh méo 0, H1 ≠ 1: 0. Lỗi console (UA điện thoại thật, đã cuộn): 0, trừ 1 cảnh báo
  `compute-pressure` (nhúng bên thứ ba) ở The Global City 390.
- On-page (`tools/the7_check_onpage.py`, 234 URL): 142 × 200, 91 × 301, 1 × 404; title ≤ 60 và meta ≤ 155: 0 lỗi; 128 ảnh alt không dấu;
  title trùng: "Spring Ville - Velis Realty" ×2, "Vinhomes - Velis Realty" ×2.
- `/blog-bds/`, `/blog-bds/page/2/`, `/blog-bds/blog-the-prive/`, `/blog-bds/blog-gamuda-land/blog-spring-ville/`, `/blog/blog-masterise-homes/`: 301 một bước → 200.
- Canonical: **không xuất trên mọi trang** (Rank Math bỏ canonical khi trang noindex) → chưa kiểm được, phải kiểm lại ngay sau khi bỏ "Ngăn công cụ tìm kiếm".
- Chiều cao trang 360 px: The Privé 32 353, The Global City 33 917, Persa Place 35 365 px (DESIGN ≤ 16 000); Vinhomes 19 131.

## Lỗi theo mức

### Chặn ra mắt

| # | Trang / khung | Mô tả | Bằng chứng | Nguyên nhân | Sửa đúng chỗ |
|---|---|---|---|---|---|
| C1 | Trang chủ, mọi khung | **Không có hero ảnh.** Màn đầu chỉ có chữ: nhãn "Velis Realty", H1 "Công ty TNHH Velis Realty", 2 đoạn văn, 2 nút đỏ giống nhau. DESIGN (duyệt 2026-11-06): hero tràn ảnh The Privé, H1 "Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận", nút chính đỏ + nút viền trắng, dải "Dự án nổi bật". Title "Velis Realty - Công ty TNHH Velis Realty" yếu | `bang-chung-01`, `shots/home-*-top.png` | Mẫu trang chủ WPB chưa có hàng hero | WPB: hàng đầu full-width, ảnh nền (Design Options) + Fancy Titles + 2 `dt_default_button` (1 kiểu Outline); title ở Rank Math |
| C2 | Trang chủ, Gamuda Land (và có thể trang khác) | Link nút trong shortcode `dt_default_button` lưu dạng **mã hóa URL** `https%3A%2F%2Fstaging.velisrealty.vn%2F…`. Kế hoạch ra mắt chỉ search-replace `https://staging.velisrealty.vn` → bản mã hóa **không được thay**, nút "Nhận tư vấn" trên site thật sẽ trỏ về staging (khóa mật khẩu) | REST `content.raw`: 19526 có 6 chỗ, 19637 có 2 | Chọn link trong phần tử WPB lưu kiểu `url:` mã hóa | Đổi link trong phần tử thành đường dẫn tương đối `/lien-he/`; hoặc thêm bước search-replace chuỗi `https%3A%2F%2Fstaging.velisrealty.vn` và quét lại 0 kết quả trước khi mở site |
| C3 | Quy trình | `docs/KE-HOACH-RA-MAT.md` vẫn mô tả đưa **theme velis 1.0.0 + plugin velis-data** (đã bỏ 2026-11-11); không có bước cho The7: theme con 1.3.0, Theme Options của theme con, Tùy biến "Thanh liên hệ", tắt Buttonizer, xóa FVM | đọc file, dòng 9–39 | Kế hoạch chưa cập nhật sau khi đổi hướng | Viết lại kế hoạch ra mắt theo The7 (xuất/nhập options theme con, kiểm canonical sau bỏ noindex, C2) |

### Nặng

| # | Trang / khung | Mô tả | Bằng chứng | Sửa |
|---|---|---|---|---|
| N1 | Mọi trang, **1024** | Menu desktop xuống 2 dòng ("Liên hệ" rơi xuống), nút "Nhận tư vấn" bẻ 2 dòng, header cao 108 px (1366: 80) | `bang-chung-header-1024.png` | TO › Header › Mobile header: `header-mobile-first_switch-after` 1000 → ~1100 (1024 dùng header mobile, khớp DESIGN "một điểm chuyển 1024") hoặc giảm khoảng cách mục menu |
| N2 | 3 trang dự án, mọi khung | Bố cục 1 cột suốt trang: **không cột phải dính "Nhận bảng giá"**, không thanh điều hướng mục, không mục lục, không thu gọn "Xem thêm" → 19 500–22 200 px desktop, 32–35 nghìn px ở 360. Khối "Nhận tư vấn The Privé" chỉ có 1 nút, **không form**; form duy nhất ở footer | `full-da-prive-1366-*.jpg`, chiều cao ở trên | Mẫu WPB "Dự án": 2 cột 8/4 + Widget area "Sidebar dự án" (TO › Widget Areas, meta Sidebar Options) dính (`sidebar-floating`); CF7 trong khối tư vấn; Toggle/"Xem thêm" cho khối chữ dài |
| N3 | Dự án, đầu trang | Hero: không breadcrumb, không thanh thông tin 6 ô; ảnh chỉ ~320 px bên phải, lộ huy hiệu VELIS in chìm; H1 "Căn hộ The Privé Quận 2" rớt chữ "2" một mình ở 1366/1920; mobile màn đầu chỉ chữ | `bang-chung-04`, `bang-chung-05` | Mẫu WPB Dự án: thêm `dt_breadcrumbs`, hàng thông tin (Fancy List/bảng), ảnh cột rộng hơn hoặc ảnh nền; `text-wrap: balance` cho H1 (velis.css 1 dòng) |
| N4 | /du-an/ | H1 gõ hoa "DỰ ÁN"; thẻ chỉ ảnh + tên (không chủ đầu tư · khu vực · loại · bàn giao · "Xem dự án →"); không lọc khu vực; 7 thẻ 2 cột để 1 thẻ lẻ | `bang-chung-06` | Sửa tiêu đề trang 19537; thẻ bằng `dt_fancy_image` + Text Block hoặc Portfolio/Blog grid có meta; hàng chip khu vực |
| N5 | Trang chủ dưới hero | Con số: "10+" nhưng "+50", "+999", "+99" (dấu + nhỏ, lệch), chữ Be Vietnam đen thay vì Playfair 48 champagne; "Các dự án nổi bật" 3 thẻ, không "Xem tất cả dự án", section `padding 35/0` (ngoài thang 8…96) nên thẻ dính mép dưới; "Đối tác" chỉ hiện **1 logo** (Vinhomes) trên nền xám dù carousel có 4; "Cơ hội nghề nghiệp" 2 nút đỏ trơ không mô tả; 12 thẻ bài (mobile ~9 300 px) | `bang-chung-03`, `full-home-*.jpg` | WPB: sửa tiền tố/hậu tố trong `stat_counter`; padding hàng 96/64/48 (`velis-section`); `dt_carousel` số ảnh hiện 4–5; nút "Xem tất cả dự án"; Blog grid 3–6 bài |
| N6 | Mọi form CF7 | Không có ô đồng ý xử lý dữ liệu (NĐ 13/2023, DESIGN Inputs); ô SĐT không `inputmode="numeric"`; nhãn có hiển thị (tốt) | probe form `/lien-he/` | CF7 › Form: thêm `[acceptance]`, `[tel* sdt inputmode:numeric]` hoặc lớp tương đương |
| N7 | Mobile 360–430 | Thanh CTA đáy hiện **ngay màn đầu** và che 2 nút hero trang chủ; DESIGN: chỉ hiện sau khi cuộn qua nút hero, và hiện cả tablet < 1024 (đang chỉ ≤ 767) | `bang-chung-02` | `velis.css`/`functions.php` theme con: hiện sau ngưỡng cuộn (hoặc `animation-timeline: scroll()`), breakpoint 1023 |

### Vừa

| # | Trang | Mô tả | Sửa |
|---|---|---|---|
| V1 | Giới thiệu | Toàn chữ, không ảnh, không khối nhấn tối, không cột phải; tiêu đề Title Case "Tầm Nhìn & Sứ Mệnh", "Chúng Tôi Là Ai?" (`bang-chung-08`) | Sửa nội dung WPB trang 19551 |
| V2 | Liên hệ | 2 khối **Raw HTML** (khó sửa cho chủ site); câu "lắng nghe bạn" (VOICE: "anh chị"); mạng xã hội là danh sách gạch đầu dòng "Velis Realty trên X/YouTube…" | Thay Raw HTML bằng Text Block/`dt_vc_list`; sửa câu chữ |
| V3 | Trình sửa WPB trang chủ | 2 nút hero là shortcode `[dt_default_button …]` dán trong Text Block (không kéo thả/sửa bằng hộp thoại); 4 `stat_counter` hiển thị trong backend như ô đỏ toàn icon, không thấy số (`bang-chung-07`) | Tách thành phần tử Button riêng; đặt tên hàng (Row ID) như trang dự án |
| V4 | Bài viết | 2 mục lục cùng lúc (widget sidebar + Easy TOC trong bài); ảnh trong bài chỉ ~2/3 cột, lệch trái; dải tiêu đề căn giữa ở mobile nhưng căn trái ở desktop | Easy TOC: tắt chèn tự động khi có widget; ảnh "Full" trong bài |
| V5 | Đầu trang | 3 kiểu đầu trang vẫn tồn tại (hero WPB nền ngà có lề – dự án/chủ đầu tư/trang chủ; Page Title The7 – blog/bài/trang; tìm kiếm); dự án và chủ đầu tư không có breadcrumb; breadcrumb /blog/ ghi "Chuyên mục “Blog”" | Thống nhất theo THE7.md mục Page Titles; tắt tiền tố "Chuyên mục" |
| V6 | Tìm kiếm, tác giả, thẻ | `template_page_id_search/_author/_blog_tags` = trống → tìm kiếm dùng lưới 3 cột The7 mặc định, khác danh sách bài /blog/ | TO › Archives: gán trang mẫu 20733 (hoặc bản riêng) |
| V7 | Chủ đầu tư | Vinhomes chỉ có 1 dự án → 1 thẻ nhỏ, 2/3 hàng trống (DESIGN: 1 mục = thẻ ngang) | Đổi cột WPB 1/1, ảnh trái chữ phải |
| V8 | Dự án (nội dung) | "anh/chị" 32 lần (The Privé), 35 lần (TGC); từ cường điệu "siêu giàu/tinh hoa/độc quyền/tuyệt đối/đảm bảo" 16–22 lần/trang | Biên tập theo VOICE.md |
| V9 | Ảnh | 128 ảnh alt không dấu (on-page); huy hiệu VELIS in chìm lộ ở ảnh hero dự án, thẻ, bản đồ vị trí | Sửa alt trong Media; ảnh crop |
| V10 | `/du-an/the-prive/`, `/the-prive/` | WordPress đoán URL → 301 tới bài "Tại sao giới siêu giàu chọn The Privé" thay vì trang dự án `/can-ho-the-prive/` | Rank Math › Chuyển hướng: 2 dòng tới trang dự án |
| V11 | Title SEO | Title The Privé viết "The Prive" (thiếu dấu), cùng trang H1 "The Privé"; title Gamuda/The Global City Viết Hoa Từng Chữ | Rank Math meta |

### Nhẹ

1. Bài Dòng vốn có SĐT viết "091 123 7979" (chuẩn "0911 237 979").
2. Title trùng "Spring Ville - Velis Realty", "Vinhomes - Velis Realty" (cụm blog và danh mục `/du-an-bds/` cũ); "Chuyên gia Vũ Xuân" ×10 (phân trang tác giả).
3. Lighthouse `target-size` mọi trang; `heading-order` dự án và /blog/.
4. Mobile cuối trang: nút "lên đầu trang" đè lên dòng "Chính sách bảo mật" ở bottom bar (`bang-chung-09`).
5. 1920 px: khung nội dung giữ 1300 px (DESIGN 1320 từ 1600).
6. Dự án là bài viết nên schema là `BlogPosting` và có dòng "Chuyên mục: Dự Án · Bởi Vũ Xuân · ngày" cuối trang.
7. Danh mục `/du-an-bds/…` (Ecopark, Sun Group, Masterise rỗng) và `/uncategorized/` vẫn 200.

## Điểm làm tốt (đã kiểm)

Menu mobile (toàn màn hình, mục con mở bằng nút +, thanh đáy tự ẩn khi menu mở); focus bàn phím viền 2 px #1A1A1A; header dính;
footer nền tối + logo trắng; danh sách /blog/ ảnh trái chữ phải, phân trang; bài viết có cột phải dính (tư vấn, mục lục, bài mới);
SĐT thống nhất ở header/footer/thanh đáy; favicon (Site Icon) và OG mặc định 1200×630; 0 tràn ngang ở 7 khung.

## Top 10 việc nên sửa trước khi ra mắt

1. Dựng hero trang chủ đúng bản duyệt (C1) – WPB, ảnh + H1 + 2 nút.
2. Đổi link nút sang tương đối và thêm search-replace chuỗi mã hóa URL (C2).
3. Viết lại `KE-HOACH-RA-MAT.md` cho The7 (C3), kèm bước kiểm canonical sau bỏ noindex.
4. Sửa header 1024 (N1) – 1 khóa Theme Options.
5. Mẫu Dự án: 2 cột + sidebar dự án dính + form tư vấn tại chỗ + thu gọn khối chữ (N2), breadcrumb + thanh thông tin (N3).
6. /du-an/: tiêu đề thường, thẻ có thông tin + "Xem dự án →", hàng chip khu vực (N4).
7. Trang chủ dưới hero: con số, padding section theo thang, đối tác đủ logo, "Xem tất cả dự án" (N5).
8. Form: ô đồng ý NĐ 13 + bàn phím số (N6).
9. Thanh CTA đáy: chỉ hiện sau khi cuộn qua hero, tới 1023 px (N7).
10. Giới thiệu + Liên hệ: bỏ Raw HTML, sửa Title Case, giọng "anh chị" (V1, V2, V8).

Đã bỏ qua / chưa kiểm tra: trình sửa WPBakery frontend (phiên mở bị ngắt do container khởi động lại), Tùy biến, Safari/iPhone thật, hover từng thẻ, tương phản đo bằng điểm ảnh, chính tả toàn văn.
Rủi ro: canonical chưa kiểm được trên staging (noindex); điểm Lighthouse cao hơn thực tế vì FVM bỏ qua UA Lighthouse.
