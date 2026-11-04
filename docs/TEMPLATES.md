# Template – Giai đoạn 3

Theme `velis` 0.6.x. Mỗi template (`theme/velis/templates/*.html`) = header + một pattern PHP (`patterns/tpl-*.php`) + footer.
Pattern chỉ ghép component (`inc/ui.php`) với dữ liệu (`inc/data.php` → plugin velis-data); không chép HTML tĩnh từ style guide.
Title/meta/robots/schema/ảnh chia sẻ: `inc/seo.php` (qua bộ lọc Rank Math).

## Danh sách template

| Template | URL mẫu trên staging | Pattern | Khối |
|---|---|---|---|
| Trang chủ | `/` | tpl-front | Hero A (H1 = câu định vị) · dự án + bộ lọc · con số (đếm từ dữ liệu, render sẵn, "+" sau số) · chủ đầu tư · góc nhìn CEO (3 bài mới) · form |
| Trang tổng dự án | `/du-an/` | tpl-projects | Hero B · bộ lọc Khu vực (Vùng → Tiểu khu), Chủ đầu tư, Loại SP, Trạng thái · lưới thẻ · form |
| Đại đô thị | `/du-an/the-global-city/` | tpl-project | Hero A · thông tin nhanh (có số phân khu) · mặt bằng tổng (nếu có ảnh) · listing phân khu 2 chế độ (Theo phân khu / Theo loại SP) + lọc chip · bảng so sánh phân khu · dòng thấp tầng gắn trực tiếp · vị trí · bài phân tích · form có danh sách phân khu |
| Phân khu | `/du-an/the-global-city/masteri-grand-view/` | tpl-project | Hero A · hộp "Nằm trong đại đô thị" · thông tin nhanh · dòng căn hộ dạng tab (neo `#can-2pn`) · thẻ dòng thấp tầng → trang riêng · tiện ích nội khu + link tiện ích chung · so sánh với phân khu anh em · bài viết · form gắn tên phân khu |
| Dòng thấp tầng | `/du-an/vinhomes-saigon-park/ivy-park/nha-pho/` | tpl-project | Hero A · "Thuộc phân khu" · thông số thấp tầng · mặt bằng từng tầng · giá (số + đơn vị + tháng/năm) · so sánh với dòng thấp tầng khác cùng phân khu · form |
| Dự án độc lập | `/du-an/the-prive/` | tpl-project | như phân khu, không có hộp "Nằm trong"; có phân khu con nếu có (Ansana → Stella 69) |
| Trang tổng chủ đầu tư | `/chu-dau-tu/` | tpl-developers | Hero B · lưới thẻ (logo, số dự án, khu vực) |
| Chủ đầu tư | `/chu-dau-tu/masterise-homes/` | tpl-developer | Hero B · dữ kiện có nguồn · dự án (lọc trạng thái) · góc nhìn CEO (nội dung) · bài viết · ghi chú quan hệ (khi có) · form |
| Blog | `/blog/` | tpl-blog | Hero B · cụm theo dự án/chủ đề · ô tìm kiếm · bài mới (lọc theo loại bài) |
| Cụm blog | `/blog/the-prive/` | tpl-cluster | Hero B (H1 "Blog {chủ đề}") · link dự án trụ cột · lưới bài lọc theo loại bài (+ theo phân khu ở cụm đại đô thị) · phân trang (trang 2+ noindex) |
| Bài viết (5 biến thể) | `/blog/the-prive/cho-thue-the-prive/` | tpl-post | breadcrumb · H1 · tác giả, ngày đăng/cập nhật, thời gian đọc · ảnh 16:9 tải ưu tiên · tóm tắt · mục lục (> 1.200 từ) · nội dung · thẻ dự án giữa bài · công bố · hộp tác giả · 3 bài cùng cụm + link dự án trụ cột · CTA "Nhận bảng giá {dự án}" |
| Tác giả | `/chuyen-gia/vu-xuan/` | tpl-author | Hero B · lĩnh vực · danh sách bài (phân trang) |
| Trang chính | `/gioi-thieu/`, `/tuyen-dung/`, `/chinh-sach-bao-mat/` | tpl-page | H1 + nội dung + một hành động chính (Liên hệ / Gửi CV) |
| Liên hệ | `/lien-he/` | tpl-page | 3 kênh ngay đầu trang (Gọi, Zalo, Form) · địa chỉ, giờ, email · bản đồ khi bấm · form |
| Tìm kiếm | `/?s=prive` | tpl-search | 2 nhóm Dự án / Bài viết; gợi ý khi rỗng (noindex) |
| 404 | `/khong-ton-tai/` | tpl-404 | thông báo · tìm kiếm · 4 liên kết chính · 3 dự án có ảnh |

**5 biến thể bài viết** (`velis_post_kind`; chọn ở hộp "Dự án / phân khu liên quan" khi sửa bài, để trống thì đoán theo tiêu đề):
phân tích (thẻ dự án đầu bài) · nhận định ("Quan điểm của tôi" + thời điểm) · so sánh (bảng so sánh tự động từ các dự án liên
quan) · hướng dẫn (H2 đánh số) · tin tiến độ (ngày đăng nổi bật).

## On-page

| Mục | Cách làm |
|---|---|
| Title | công thức theo brief cho trang chủ, dự án (theo cấp), chủ đầu tư, cụm, tác giả, trang tổng; ≤ 60 ký tự (`velis_fit`). Title viết tay trong Rank Math (không chứa biến `%…%`) luôn được giữ |
| Meta | công thức theo cấp; ≤ 155 ký tự (`velis_clip`) |
| H1 | đúng 1; H1 trong nội dung cũ tự hạ thành H2; tiêu đề khối theme không dùng heading khi không cần |
| Robots | trang 2+ và tìm kiếm: `noindex, follow`; phân khu / dòng thấp tầng thiếu dữ liệu: `noindex, follow` (plugin) |
| Breadcrumb | hiển thị + `BreadcrumbList` cùng một nguồn (`velis_trail`): phân khu 4 cấp, dòng thấp tầng 5 cấp |
| Schema | Organization/RealEstateAgent, WebSite (Rank Math, toàn site) · đại đô thị `Place` + `containsPlace` + `ItemList` · dự án/phân khu `ApartmentComplex`/`Residence` + `containedInPlace` · dòng căn hộ `Apartment` (Accommodation; `offers` chỉ khi có giá tỷ/căn + tháng) · dòng thấp tầng `SingleFamilyResidence` · chủ đầu tư `CollectionPage` → `Organization` · bài `BlogPosting` (+ `about` dự án) · tác giả `ProfilePage` · tuyển dụng `JobPosting` (Rank Math có sẵn) |
| Ảnh chia sẻ | cỡ `velis-og` 1200×630 cắt giữa, tạo một lần khi trang được chia sẻ lần đầu |
| Link silo | đại đô thị ↔ phân khu; phân khu ↔ phân khu anh em, ↔ dòng thấp tầng; dự án → bài trong cụm; bài → dự án trụ cột + 3 bài cùng cụm; chủ đầu tư → dự án |

## Form

Form theme gửi tới Contact Form 7 (form "Velis – Nhận tư vấn", REST `contact-form-7/v1/contact-forms/{id}/feedback`), không cần
JS của CF7. Gửi thành công → sự kiện `generate_lead` vào `dataLayer` và `gtag` (GA4). Staging tắt email nên CF7 trả `mail_failed`
và form hiện thông báo lỗi kèm hotline (đúng cấu hình).

## Hiệu năng

Front-end chỉ nạp CSS/JS của theme (+ CSS khối core): plugin cũ (WPBakery, Ultimate Addons, Easy TOC, CF7 JS, jQuery) bị gỡ khỏi
front-end bằng danh sách cho phép trong `functions.php`. Nội dung cũ dựng bằng shortcode WPBakery vì vậy hiển thị thô cho tới
giai đoạn 4.

## Chờ nội dung giai đoạn 4

- Trang chủ: "Vì sao chọn Velis" (3 lý do có bằng chứng) và "Khách hàng nói gì" (cần đồng ý) – khối chưa render vì chưa có dữ liệu.
- Dự án: tóm tắt trả lời trước (excerpt), góc nhìn CEO, FAQ, dòng thời gian tiến độ, vị trí & kết nối, tiện ích, mặt bằng tổng,
  thư viện ảnh – trường có sẵn, đang trống.
- Chủ đầu tư: logo, dữ kiện (năm thành lập, trụ sở, website…), góc nhìn CEO, đoạn mở đầu trang tổng.
- Cụm blog: đoạn giới thiệu 300–600 từ (mô tả chuyên mục).
- Bài viết, trang chính: nội dung WPBakery → khối; title/meta viết tay quá dài (danh sách trong báo cáo on-page).
- Trang tác giả: ảnh chân dung thật, tiểu sử, mạng xã hội cá nhân.
- 28 trang phân khu / dòng thấp tầng đang noindex chờ ảnh và thông số (`docs/AUDIT-NOI-DUNG.md`).
