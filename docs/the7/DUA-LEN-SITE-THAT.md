# Đưa lên site thật – các thay đổi của vòng hoàn thiện (bước 10, 2026-11-12)

Danh sách đúng từng thay đổi của bước 10 trên staging (nhật ký: `docs/STAGING-LOG.md` mục bước 10; báo cáo: `docs/reports/the7-buoc-10.md`).
Phương án A (chuyển cả CSDL + `wp-content`, `docs/KE-HOACH-RA-MAT.md`) mang theo tất cả; danh sách này dùng để **kiểm sau khi chuyển**
và để **làm lại từng mục** nếu chọn phương án B. Mọi mục đều sửa được trong wp-admin, trừ file theme con.

| # | Loại | Thay đổi | Ở đâu (wp-admin) | Kiểm sau khi đưa lên |
|---|---|---|---|---|
| 1 | File theme con | **The7 Velis (child) 1.6.0**: `velis.css` (thẻ không viền + bóng, cả thẻ là link, lưới căn giữa hàng cuối, hệ nút 5 trạng thái, vùng bấm ≥ 44, form, ảnh hero thật, ảnh `velis-badge` trong bài), `functions.php` (ảnh hero tải sớm, kiểm số điện thoại VN cho CF7, "Đang gửi…", schema CollectionPage / ItemList / Place, bỏ file CSS/JS không dùng) | Giao diện → Tải lên `dist/dt-the7-child.zip` → "Thay thế bản hiện tại" | trang chủ có `<link rel=preload … imagesrcset>`; thẻ không viền; `php tools/tests/the7-child-cta-test.php` = ok trước khi đóng gói |
| 2 | Theme Options | 14 khóa (`tools/the7_options_buoc10.py` → `data/the7/options-buoc-10.json`; trước: `options-truoc-b10.json`): Content boxes **không trang trí** (bỏ viền thẻ); nút cỡ M = L (16 px, 14/28), cỡ S cao 48 / 15 px; nút "Nhận tư vấn" header 14/24 px, 16 px; mục menu 13/12/12/12 px; header dính kiểu **sticky** (không mờ dần); header thu gọn cao **60 px** (cả 2 điểm chuyển); mục menu con 13/10/12/10 px; thông báo form **tại chỗ** (`contact_form_message` = 0, trước: popup) | The7 → Theme Options → Export/Import (nhập file) – hoặc sửa tay: General → Content boxes; Buttons; Header → Microwidgets → Button 1; Header → Menu; Header → Floating; Header → Mobile | xuất lại, so 12 khóa |
| 3 | The7 → Settings | **Mega menu: tắt** (menu không dùng mega menu; bớt 1 file CSS mỗi trang) | The7 → Settings → bỏ ô "Mega menu" → Lưu | menu chính + menu điện thoại mở bình thường |
| 4 | Chuyên mục | **Tạo "Phân khu"** (`phan-khu`, cấp gốc); Palm River (20422) và Persa Place (19855) chỉ thuộc "Phân khu" (trước: Dự án / Spring Ville) | Bài viết → Chuyên mục; sửa bài → hộp Chuyên mục | trang chủ: lưới không có Palm River, Persa Place; /du-an/ đủ 7 |
| 5 | Nội dung WPBakery (khóa ngày sửa) | **Trang chủ** 19526: ảnh hero = Single Image (Extra class `velis-hero-bg`, ảnh 19968) thay ảnh nền CSS; nhãn "Dự án nổi bật" là H2; lưới "Dự án Velis đang tư vấn" = chuyên mục Dự án (34) – hết danh sách chọn tay; bỏ link "Xem dự án →" | Trang → Trang chủ → WPBakery | ảnh hero hiện, LCP là thẻ `<img>` |
| 6 | Nội dung WPBakery | **/du-an/** 19537: lưới = chuyên mục Dự án + Phân khu (`34,57` – **ID 57 là của staging, trên site thật thay bằng ID chuyên mục Phân khu mới**); bỏ link "Xem dự án →" | Trang → Dự án → phần tử Blog Masonry & Grid → Categories | 7 thẻ, hàng cuối căn giữa |
| 7 | Nội dung WPBakery | **7 trang dự án + 4 trang chủ đầu tư**: Toggle "Xem thêm" → *Use custom font* thẻ `p`; câu hỏi thường gặp → thẻ `h3`; lưới chủ đầu tư bỏ link "Xem dự án →"; ảnh trong chữ chỉ có huy hiệu trái dưới → class `velis-badge` | sửa trang/bài → WPBakery (Toggle → Use custom font; Single Image / ảnh → Extra class) | 0 lần nhảy cấp H2 → H4 do mẫu |
| 8 | Trường tùy chỉnh | `velis_dia_chi` ở 7 bài dự án (địa chỉ cho schema Place, lấy từ ô "Vị trí" của thanh thông tin) | sửa bài → hộp **Trường tùy chỉnh** | JSON-LD trang dự án có `Place` + `about` |
| 9 | Nội dung bài (khóa ngày sửa) | **78 bài blog + 5 trang dự án**: thêm class `velis-badge` vào 92 + 28 ảnh chỉ có huy hiệu trái dưới (`data/the7/buoc-9/anh-huy-hieu.csv`, cột `xu_ly` "cắt được") | sửa bài → ảnh → Tùy chọn nâng cao → Image CSS Class | ảnh không lộ huy hiệu, bố cục không đổi |
| 10 | (trong file theme con, mục 1) | H2 ẩn "Danh sách bài viết" trước danh sách bài ở trang chuyên mục / tìm kiếm (The7 in tên bài H3 ngay dưới H1; trang mẫu 20733 chỉ cấp cài đặt, không cấp nội dung – `template_page_id_*_full_content = 0`) | – | /blog/ không nhảy H1 → H3 |
| 11 | Mẫu WPBakery "Mẫu của tôi" | "Velis – Dự án", "Velis – Chủ đầu tư" lưu lại bản mới (`data/the7/mau-wpbakery/`) | WPBakery → Templates | trang mới dựng từ mẫu có toggle đúng thẻ |
| 12 | Contact Form 7 (form 19582 – mọi form) | link "Chính sách bảo mật" thêm `rel="noopener"`; thông báo: cảm ơn kèm hotline, lỗi gửi kèm hotline, "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0…", ô bắt buộc, ô đồng ý | Liên hệ → Contact Form 7 → Liên Hệ → Biểu mẫu / Thông báo | gửi thử 1 lần trên site thật (bước 9 kế hoạch ra mắt) |
| 13 | Menu | mục "Thi thử CCMG" (menu FOOTER, mở tab mới) – Quan hệ liên kết (XFN) = `noopener` | Giao diện → Menu → FOOTER → mục → "Quan hệ liên kết" (bật ở Tùy chọn hiển thị) | – |
| 14 | Rank Math | mô tả /du-an/ 153 ký tự (dữ liệu thật: 5 dự án đang tư vấn) | sửa trang /du-an/ → Rank Math → Sửa đoạn trích | thẻ meta description |
| 15 | Không đổi trên staging, làm sau ra mắt | **QUIC.cloud**: đăng ký + bật nén ảnh trên site thật (ghi `.htaccess` – duyệt riêng), xem `docs/KE-HOACH-RA-MAT.md` | LiteSpeed → Cài đặt chung | Lighthouse trang chủ, /blog/ |

Thứ tự khi làm lại (phương án B): 1 → 2 → 3 → 4 → 8 → 5–7, 9–11 (dán `content.raw` từ staging, kiểm 0 link `staging.`) → 12–14 → xóa
cache FVM + LiteSpeed. ID trên site thật có thể khác staging: chuyên mục Phân khu (57), ảnh hero (19968) – kiểm trước khi dán.

## Bước 11 (2026-11-12): trang tổng "Chủ đầu tư" + mục menu

Nhật ký: `docs/STAGING-LOG.md` mục bước 11; báo cáo: `docs/reports/the7-buoc-11.md`.

| # | Loại | Thay đổi | Ở đâu (wp-admin) | Kiểm sau khi đưa lên |
|---|---|---|---|---|
| 16 | File theme con | **1.6.1**: `velis.css` thẻ chủ đầu tư (`.velis-devs`: cùng hệ thẻ – không viền, bóng, cả thẻ là link tên, khe 24 px); `functions.php` schema ItemList lấy thêm link tên thẻ của hàng `velis-devs` | Giao diện → Tải lên → thay bản đang dùng | `/chu-dau-tu/` có `CollectionPage` + `ItemList` 4 mục |
| 17 | Trang mới | **"Chủ đầu tư"** – slug `chu-dau-tu`, cấp gốc (staging ID 20955). Nội dung = `data/the7/buoc-11/trang-chu-dau-tu.txt` (= `content.raw` trang staging) (đoạn dẫn + hàng `velis-devs velis-boxes` 4 cột: logo Media "Logo Vinhomes / Masterise Homes / Sun Group / Gamuda Land" – **ID 20820–20823 là của staging**, tên H2 có link, dòng dự án). The7: Page title **bật** (H1 + breadcrumb như /du-an/), Sidebar **không** | Trang → Thêm mới → WPBakery (dán) → The7 "Page title: Enabled", "Sidebar: Disabled" | 1 H1, breadcrumb "Trang chủ / Chủ đầu tư", 4 thẻ bấm được |
| 18 | Rank Math | title "Chủ đầu tư bất động sản cao cấp \| Velis Realty" (46), mô tả 153 ký tự (`docs/reports/the7-buoc-11.md`) | sửa trang → Rank Math → Sửa đoạn trích | thẻ title / description |
| 19 | Menu | menu chính, mục **"Chủ đầu tư"**: link tùy chỉnh `#` → trang "Chủ đầu tư" (giữ 4 menu con). Trên site thật menu chính mới được dựng ở bước trước – dựng mục này trỏ trang, không dùng `#` | Giao diện → Menu → thêm trang "Chủ đầu tư", kéo 4 mục con vào dưới, xóa mục `#` | bấm "Chủ đầu tư" (desktop + điện thoại) mở `/chu-dau-tu/` |

Phương án B: 16 → 17 → 18 → 19 → xóa cache FVM + LiteSpeed. Khi thêm trang mới phải sửa ID logo trong 4 Single Image nếu ID Media khác.

## Bước 12 (2026-11-13): chữ bị cắt / meta lệch, CTA "Nhận bảng giá", trang sản phẩm không cột phải

Nhật ký: `docs/STAGING-LOG.md` mục bước 12; báo cáo: `docs/reports/the7-buoc-12.md`.

| # | Loại | Thay đổi | Ở đâu (wp-admin) | Kiểm sau khi đưa lên |
|---|---|---|---|---|
| 20 | File theme con | **1.7.2** (1.7.0 + bước 12b: cột đọc 760 px căn giữa trang sản phẩm, bảng 100 % cột; logo điện thoại khi dính chỉ 1): `velis.css` – vùng bấm link nội dòng bằng đệm (bỏ inline-flex + lề âm), khung tiêu đề trang không cắt, dòng meta một hàng + "·", thành phần CTA (`.velis-cta` ngang, `.velis-cta-box` dọc), danh sách `.velis-post-list`; `functions.php` – chữ chờ `{du_an}` / `{du_an_link}` / `velis-if-du-an` trong widget HTML tùy chỉnh, thuộc tính `du-an` cho `[contact-form-7]`, shortcode `[velis_bai_viet so="5"]` | Giao diện → Tải lên → "Thay thế cài đặt bằng tải lên" (`dist/dt-the7-child.zip`) | `node tools/the7_check_clip.mjs out.json` (cắt 0, lệch 0); `php tools/tests/the7-child-cta-test.php` |
| 21 | Theme Options | 3 khóa: tiêu đề trang 56/**70**, tablet/mobile 36/**46**; H1 cao dòng 70/46/46 (`tools/the7_options_buoc12.py`) | Theme Options → Typography (H1) và Page Titles | "Blog", H1 bài không mất nét trên |
| 22 | Contact Form 7 | **Form mới "Nhận bảng giá"**: Sao chép form "Liên Hệ" rồi dán Form / Thư / Cài đặt bổ sung theo `data/the7/buoc-12/cf7-nhan-bang-gia.json` (trường ẩn `[hidden du-an default:shortcode_attr]`, `acceptance_as_validation: on`, thư có "Dự án: [du-an]"). **ID trên site thật khác 20958** → thay ID trong 12 trang + widget + 2 mẫu | Liên hệ → Sao chép → sửa | gửi thử 1 lần trên site thật (thư có dòng Dự án) |
| 23 | Nội dung WPBakery (khóa ngày sửa) | **12 trang sản phẩm** (7 dự án/phân khu, 4 chủ đầu tư, /chu-dau-tu/): hàng `lien-he-tu-van` mới (CTA), nút đầu trang "Nhận bảng giá" (`tools/the7_sua_buoc12.py`; dán `content.raw` từ staging, đổi ID form) | sửa trang/bài → WPBakery | form 1 hàng ở ≥ 900 px |
| 24 | Meta box The7 | 12 trang sản phẩm: **Sidebar → Disabled** (trước: phải + "Sidebar dự án") | sửa trang/bài → hộp Sidebar Options | không còn cột phải |
| 25 | Widget | Default Sidebar: "HTML tùy chỉnh" CTA = nội dung `velis-cta-box` (xem `docs/reports/the7-buoc-12.md`); thêm "HTML tùy chỉnh" `[velis_bai_viet so="5"]`; "DT-Blog posts – Bài mới" → Tiện ích không sử dụng | Giao diện → Tiện ích | bài cụm The Privé: "Nhận bảng giá The Privé", "Cùng dự án The Privé" |
| 26 | Mẫu của tôi | "Velis – Dự án", "Velis – Chủ đầu tư" lưu lại (`data/the7/mau-wpbakery/`, đổi ID form) | WPBakery → Templates | – |
| 27 | Nội dung WPBakery (khóa ngày sửa) | /chu-dau-tu/: hàng đầu `gioi-thieu` thêm Extra class **`velis-read`**; Spring Ville: 3 hàng loại sản phẩm (nhà phố / shophouse / căn hộ) 2 cột chữ + ảnh → 1 cột (chữ, nút, ảnh dưới) | sửa trang → WPBakery → Row Settings / gộp cột | `node tools/the7_check_cot.mjs out.json` (logo lỗi 0, cột lỗi 0) |

Dự án của cụm bài blog lấy từ "Bài viết liên quan → chuyên mục" (The7 Post Options) của bài dự án – trên site thật kiểm 7 bài dự án đã chọn
đúng chuyên mục cụm (bước 9). Thứ tự: 20 → 21 → 22 → 23–26 → xóa cache FVM + LiteSpeed.
