# The7 – Bước 13: phần cuối trang (khối liên hệ cuối + footer + dòng dưới cùng) – 2026-11-13

Chỉ ghi staging (nhật ký `docs/STAGING-LOG.md` mục bước 13). Site thật chỉ đọc (một lần đọc trang chủ để so mạng xã hội / tên công ty).
Không gửi form thật. Mọi nội dung sửa được trong wp-admin – bảng đưa lên site thật: `docs/the7/DUA-LEN-SITE-THAT.md` mục 28–33.

## 1. Lỗi hiện tại → cách sửa → sửa ở đâu

| Lỗi (ảnh người dùng 1920 px) | Nguyên nhân | Sửa | Ở đâu trong wp-admin |
|---|---|---|---|
| Dải trống ~100 px nền ngà trên footer | Đệm cuối section có nền (96) + đệm cuối trang The7 (96) | Đệm cuối trang 96 → 64; có khối liên hệ cuối thì section nền cuối trang còn 64, không cộng dồn. Đo: trống ≤ 96 ở 13 trang × 6 khung | Theme Options → General → Content area margin (đáy 64); CSS theme con |
| Nửa trái footer trống, chỉ 2 dòng | Footer 1/2 + 1/2: cột trái 1 widget văn bản, cột phải form | Footer 4 cột 4/12 · 3/12 · 2/12 · 3/12: Velis Realty · Dự án · Về Velis · Kết nối | Theme Options → Footer & Bottom Bar (Layout `1/3+1/4+1/6+1/4`); Giao diện → Tiện ích → Default Footer |
| Nút "Gửi" màu be khi chưa tick | CF7 khóa nút tới khi tick đồng ý; CSS tô nút khóa màu be | Form dùng `acceptance_as_validation: on` (không khóa nút) → nút luôn đỏ; bấm khi chưa tick → lỗi tiếng Việt dưới ô đồng ý + focus về ô đó | Liên hệ → form → Cài đặt bổ sung; CSS + script theme con |
| Footer không có đường dẫn | Chưa có widget link | Dự án (6 bài mới nhất chuyên mục Dự án + "Tất cả dự án →"), Về Velis (menu 6 mục), Kết nối (7 biểu tượng) | Default Footer: Khối "Bài viết mới nhất", Menu "Velis – Về Velis (chân trang)", Khối "Biểu tượng mạng xã hội" |
| Form footer lặp với "Nhận bảng giá" | Form ở footer mọi trang | Bỏ form khỏi footer; **khối liên hệ cuối** (1 form) chỉ ở trang chưa có form; trang danh sách: cột phải đổi sang hộp liên hệ không form. Đo: ≤ 1 form mỗi trang | Tiện ích → "Khối liên hệ cuối trang"; widget area "Sidebar danh sách bài" |
| Dòng dưới cùng: "\|" thô, "Thi thử CCMG" lạc chỗ, thiếu pháp lý | Chữ bottom bar viết tay "\|"; menu FOOTER chỉ có Thi thử CCMG | Trái "© 2026 Công ty TNHH Velis Realty" + lưu ý 13 px; phải "Chính sách bảo mật · Điều khoản sử dụng" ("·" xám); Thi thử CCMG vào cột Về Velis; dòng pháp lý để trống chờ số liệu | Theme Options → Bottom bar → Text; Giao diện → Menu → vị trí Bottom = "Velis – Pháp lý (dòng cuối)" |

Khác: nút lên đầu trang cách mép 24 px (máy tính), trên thanh liên hệ 16 px (điện thoại), không đè chữ dòng cuối (đo 0 chồng lấn).
Khối liên hệ cuối: 2 cột (5/12 chữ + 7/12 form) từ 1200 px; dưới 1200 chữ trên, form dưới (form vẫn 1 hàng từ 900 px).
Thanh liên hệ dính "Nhận tư vấn" ở trang có khối liên hệ cuối nhảy tới form ngay trang đó (trước: sang /lien-he/).

## 2. Trang nào có khối liên hệ cuối (mỗi trang tối đa 1 form)

| Trang | Khối liên hệ cuối | Form tư vấn đang có |
|---|---|---|
| Trang chủ, /du-an/, Giới thiệu, Tuyển dụng, 404 | có | khối liên hệ cuối |
| /blog/, chuyên mục, tìm kiếm, tác giả | có | khối liên hệ cuối (cột phải: hộp "Tư vấn trực tiếp" – nút nhảy tới form, không form) |
| Trang dự án / phân khu / chủ đầu tư | không | hàng CTA "Nhận bảng giá" trong bài |
| **/chu-dau-tu/** | **không** (lệch brief) | hàng CTA "Nhận bảng giá các dự án …" đã có từ bước 11–12 – giữ để không thành 2 form; muốn đổi sang khối liên hệ cuối thì xóa hàng CTA trong WPBakery là khối tự hiện |
| Bài blog | không | hộp CTA ở cột phải (theo dự án của cụm) |
| /lien-he/ | không | form trong trang |

Quy tắc (theme con, có test): không phải bài viết **và** nội dung trang không có `[contact-form-7` → hiện. Nội dung khối = widget HTML tùy chỉnh.

## 3. NAP + mạng xã hội – cần người dùng xác nhận

| Mục | Footer (bước 13) | Schema Rank Math (staging, = site thật) | Google Business Profile |
|---|---|---|---|
| Tên | Velis Realty; © Công ty TNHH Velis Realty | name "Velis Realty" (RealEstateAgent + Organization) | cần đối chiếu |
| Địa chỉ | 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh | 34 Lương Định Của · Phường Bình Trưng · Tp. Hồ Chí Minh · 700000 · VN | cần đối chiếu (GBP có thể còn "Quận 2") |
| Điện thoại | 0911 237 979 | +84 911 237 979 | cần đối chiếu |
| Email | lienhe@velisrealty.vn | lienhe@velisrealty.vn | – |
| Giờ làm việc | 08:00–21:00 hằng ngày | Mo–Su 08:00–21:00 | cần đối chiếu |
| Bản đồ | "Xem bản đồ" → Google Maps 10.7909975, 106.7442593 | hasMap cùng tọa độ | – |

Khớp nhau, không sửa schema. Câu định vị cột 1 lấy nguyên mô tả schema: "Sàn giao dịch bất động sản cao cấp chuyên tư vấn các dự án
Vinhomes, Sun Group." (bỏ "Uy tín – Chuyên nghiệp – Tận tâm") – cần duyệt.

Mạng xã hội trong footer = đúng `sameAs` của schema (7 mạng; twitter.com và x.com trùng nên chỉ hiện X). **Chưa xác minh tài khoản nào
có thật / đang hoạt động** – người dùng xác nhận, mạng nào không dùng thì xóa ở widget Kết nối **và** ở Rank Math → Tiêu đề & Meta →
Local SEO / Social (để footer và sameAs vẫn khớp):
Facebook `facebook.com/velisrealty` · YouTube `@velisrealty` · TikTok `@velisrealty` · Instagram `velisrealty` · LinkedIn `/in/velisrealty`
(trang cá nhân, không phải trang công ty) · Pinterest `velisrealty` · X `velisrealty`.

Dòng pháp lý (Mã số thuế / Giấy ĐKKD số, ngày cấp, nơi cấp): để trống, đang ẩn – thêm khi có (DUA-LEN-SITE-THAT cuối mục bước 13).

## 4. Form (mọi form: khối liên hệ cuối, "Nhận bảng giá" ngang + dọc)

- Nhãn luôn hiện ("Họ và tên", "Số điện thoại / Zalo"), placeholder chỉ là ví dụ "Ví dụ: 0911 237 979" – không lặp chữ.
- Trường ẩn: dự án (form "Nhận bảng giá"), utm_source / utm_medium / utm_campaign (lấy từ URL, giữ trong phiên); thư có "Trang: [_url]" + UTM.
  Người nhận giữ velisrealtyvn@gmail.com.
- Thử 3 trạng thái bằng chặn yêu cầu (không gửi thật), 4 form – `screenshots/the7/buoc-13/form-*.jpg`, `form.json`:

| Form | Nút lúc đầu | Chưa tick | Số sai | Đúng | Gửi kèm |
|---|---|---|---|---|---|
| Khối liên hệ cuối 1536 (1 hàng) | đỏ, không khóa | lỗi dưới ô đồng ý, focus ô đồng ý | lỗi dưới ô SĐT, focus SĐT | "Đang gửi…" → cảm ơn tại chỗ | utm thu / kiem-tra / b13 |
| Khối liên hệ cuối 390 (dọc) | như trên | như trên | như trên | như trên | utm_source thu |
| "Nhận bảng giá" The Privé 1536 | như trên | như trên | như trên | như trên | du-an "The Privé" |
| Hộp CTA bài "Dòng vốn" 1536 | như trên | như trên | như trên | như trên | du-an "Palm River" |

Hai lỗi tìm ra khi thử và đã sửa: (1) trả lời rất nhanh làm nút bị khóa lại sau khi đã mở (bấm lần sau không gửi); (2) lời nhắc lỗi mất
lúc rời ô làm nút nhảy lên đúng lúc bấm → cú bấm trượt (form dọc) – giữ chiều cao khung ô tới lần gửi sau; form 1 hàng: nút thẳng ô nhập
(dưới nhãn), không căn đáy theo lời nhắc.

## 5. Số đo

- `node tools/the7_check_footer.mjs` (mới, `--test` đạt): 13 trang × 6 khung (390–1920): **0 lỗi** – trống cuối nội dung 48–73 px (≤ 96),
  0 link gạch chân, vùng bấm ≥ 44 × 44, tương phản chữ footer ≥ 4,5:1, ≤ 1 form tư vấn, nút lên đầu không đè chữ. Trước khi sửa lần cuối:
  168 lỗi (Zalo / email cao 43 px; /blog/ + tìm kiếm 2 form; trống 101–160 px ở /chu-dau-tu/, trang sản phẩm 1024, /lien-he/).
- `node tools/the7_check_clip.mjs` (17 trang × 8 khung): chữ cắt 0, meta lệch 0, tràn ngang 0, ảnh hỏng 0, lỗi JS 0, mỗi trang 1 H1.
- `node tools/the7_check_cot.mjs`: logo header lỗi 0, cột đọc trang sản phẩm lỗi 0 (bước 12b không đổi).
- On-page toàn sitemap: 236 URL, không lỗi mới (vẫn 128 alt không dấu, 1 trang 2 H1 – chuyên mục rỗng 45, như bước 12).
- `php tools/tests/the7-child-cta-test.php`: ok (thêm: điều kiện khối liên hệ cuối, nút thanh dính nhảy tới form).

Ảnh trước | sau (`screenshots/the7/buoc-13/truoc-sau-*.jpg`): trang chủ, /du-an/, The Privé (không khối liên hệ cuối), bài "Dòng vốn"
(không khối liên hệ cuối), /blog/, 404, /lien-he/ × 1536 / 1920 / 390. Ảnh "trước" chụp trước khi sửa (có header dính chồng giữa ảnh do
chụp cả trang).

## 6. Đã bỏ qua / chưa kiểm tra / rủi ro

- Chưa thử Safari / iPhone thật (khối liên hệ cuối cần `:has()` – Safari ≥ 15.4); chưa gửi form thật trên staging.
- Footer cột "Dự án" chỉ có 5 bài (chuyên mục Dự án hiện có 5; phân khu ở chuyên mục riêng không hiện).
- Trang danh sách mất danh sách "Bài mới" ở cột phải (widget area 3 chỉ có hộp liên hệ) – trang đó đã là danh sách bài.
- Rủi ro: ID form 19582 / 20958 là của staging – site thật có thể khác (đổi trong widget). Menu "FOOTER" cũ và 2 widget footer cũ còn
  trong wp-admin (không xóa theo quy tắc), người dùng có thể xóa sau.
