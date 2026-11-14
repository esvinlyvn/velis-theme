# The7 bước 12 – chữ bị cắt / meta lệch, CTA "Nhận bảng giá", trang sản phẩm bỏ cột phải (2026-11-13, staging)

Theo soát của người dùng (Chrome 1536 + 390 px, ảnh /blog/ ở ~1920 px Chrome Windows) và 3 ảnh CTA đối thủ.
Chỉ ghi staging (nhật ký `docs/STAGING-LOG.md`), site thật chỉ đọc, không gửi form thật. Đưa lên site thật: `docs/the7/DUA-LEN-SITE-THAT.md` mục 20–26.

## 1. "Lỗi font" = chữ bị cắt, không phải font hay máy

Chẩn đoán đầu ("font FVM thiếu glyph tiếng Việt") **sai – phép đo lỗi**; đã bỏ, **không đổi cách nạp font, không tự host font**.
Font Playfair Display / Be Vietnam Pro hiển thị đủ dấu. Ảnh đối thủ lỗi khác (chữ in hoa rơi về Times – font của họ).

Bộ đo mới `tools/the7_check_clip.mjs` (self-test `--test`): mỗi nút chữ (Range.getClientRects) so với khung cắt gần nhất (overflow ≠ visible /
line-clamp); dòng meta: các mẩu cùng dòng phải cùng chân chữ ±1,5 px, cùng cỡ, cùng màu. Kèm bộ đo người đánh giá (tràn ngang, H1, ảnh hỏng, lỗi JS).
17 trang × 8 khung (360 → 1920), khách, Chrome UA thật.

| Chỗ bị cắt / lệch (trước) | Lượt | Nguyên nhân | Sửa (một lần, ở gốc) |
|---|---|---|---|
| H1 / tiêu đề trang ("Blog", "Dự án", tên bài) – mất nét trên chữ và dấu (ể, ẩ…) | 95 | Cao dòng 56/62 (1,1) + khung `.page-title-head` của The7 `overflow:hidden` | Theme Options: tiêu đề trang + H1 cao dòng **1,25** (56/70, 36/46); `velis.css` khung tiêu đề trang không cắt |
| Widget "Bài mới" – dòng đầu tiêu đề bài mất nửa trên | 35 | Quy tắc vùng bấm 44 px của bước 10: link `inline-flex` + lề âm −10 px → link nhiều dòng nhô lên 10 px, `li` của The7 `overflow:hidden` cắt | Vùng bấm bằng **đệm trên/dưới của link nội dòng** (không đổi dòng chữ, không lề âm) – áp mọi link meta / breadcrumb / sidebar / footer |
| Dòng meta "Palm City · 29/07/2026" lệch (chuyên mục cao hơn ngày 11,5 px), chấm 3 px lơ lửng | 312 | Cùng quy tắc trên (`vertical-align: middle` + `inline-flex`) + chấm phân cách của The7 là khối 3 px | `.entry-meta` một hàng `flex` chung chân chữ, 14 px / màu chữ phụ, dấu "·" xám; mọi nơi The7 in meta + danh sách sidebar mới |
| **Sau** | **0 cắt, 0 lệch** | | tràn ngang 0, mỗi trang 1 H1, ảnh hỏng 0, lỗi JS 0 (136 lượt). "Rút gọn" có chủ đích: 20 (nhãn thẻ dự án 1 dòng "…") |

Ảnh: `screenshots/the7/buoc-12/truoc-sau-{blog-tieu-de,bai-dau,blog-meta,bai-meta,blog-sidebar,bai-sidebar,trang-chu-bai}-{390,1536,1920}.jpg`.

## 2. CTA "Nhận bảng giá" – một thành phần (DESIGN.md "CTA")

Học cấu trúc đối thủ (khung nổi bật, tiêu đề lợi ích cụ thể, ✓ lợi ích, form ngay trong khối, nút động từ to, hotline, dòng bảo mật), giữ nhận diện:
nền than, gạch champagne, chữ trắng, nút đỏ; **không** xanh/vàng, không "tốt nhất / duy nhất / độc quyền / suất VIP" (Luật Quảng cáo, VOICE.md).

| | Trước | Sau |
|---|---|---|
| Trang dự án / chủ đầu tư | Cột phải dính "Nhận bảng giá và tư vấn" (đoạn giải thích + nút nhảy xuống) **và** khối cuối nền ngà 2 cột (chữ dài + form "Gửi", nút xám khi chưa tick) | **Một** khối ngang trong nội dung: nhãn → H2 lợi ích → 3 ✓ → form 1 hàng (Họ tên · SĐT/Zalo · **Nhận bảng giá ngay**) ≥ 900 px, xếp dọc dưới đó → ô đồng ý → hotline 22 px |
| Bài blog (sidebar) | "Nhận tư vấn dự án" chung chung, link sang /lien-he/ | Hộp dọc **đúng dự án của cụm**: "Nhận bảng giá Palm River", form ngay trong hộp, "Xem dự án Palm River →"; bài không thuộc dự án → "Nhận bảng giá & tư vấn dự án" |
| Lead | form không biết khách xem dự án nào | form mới "Nhận bảng giá" (CF7 20958) có trường ẩn `du-an` + `[_url]` trong thư |

Thử form (chặn yêu cầu, không gửi thật – `form-*.jpg`): nút cao 52 px, lỗi SĐT tiếng Việt dưới ô, "Đang gửi…" + khóa nút, cảm ơn tại chỗ có hotline,
trường `du-an` gửi đúng ("The Privé", "Palm River"); ô đồng ý không còn làm nút xám (`acceptance_as_validation: on` – báo lỗi khi bấm).

**Câu chữ cần duyệt** (lấy từ nội dung đang có: /chinh-sach-bao-mat/ "bảng giá chi tiết, giỏ hàng, chính sách bán hàng và phân tích tiềm năng đầu tư
theo đúng nhu cầu"; /lien-he/ "phù hợp với mục tiêu và số vốn", 08:00–21:00). Sửa ở WPBakery (Text Block của hàng CTA) / widget HTML:
- Nhãn: "Tư vấn trực tiếp từ Velis Realty"
- H2: "Nhận bảng giá & giỏ hàng <dự án>" · "Nhận bảng giá các dự án <chủ đầu tư>" · Sun Group: "Nhận tư vấn dự án Sun Group" (site chưa có dự án Sun Group đang phân phối)
- ✓ "Bảng giá chi tiết và chính sách bán hàng mới nhất" · "Giỏ hàng căn đang có, chọn theo nhu cầu và số vốn" · "Phân tích pháp lý và tiềm năng đầu tư của dự án"
  (Sun Group: "Thông tin dự án và pháp lý cập nhật" · "Phân tích tiềm năng đầu tư theo đúng nhu cầu" · "Phương án phù hợp với mục tiêu và số vốn")
- Nút: "Nhận bảng giá ngay" · ô nhập: "Họ và tên", "Số điện thoại / Zalo"
- Dưới form: "Hoặc gọi ngay 0911 237 979 · Zalo (08:00–21:00 hằng ngày)"; nút đầu trang dự án "Nhận tư vấn" → "Nhận bảng giá"
- Không dùng "miễn phí" (site chưa ghi tư vấn miễn phí) – nếu đúng, chủ site thêm vào ✓.

## 3. Trang sản phẩm bỏ cột phải; bài blog tối ưu sidebar

- 12 trang (7 dự án/phân khu, 4 chủ đầu tư, /chu-dau-tu/): **The7 Sidebar → Disabled** (meta box, không CSS ẩn); nội dung full khung.
  ~~Chữ đọc ở cột giữa 720 px~~ – bỏ ở 1.7.1, thay bằng cột đọc 760 px căn giữa ở bước 12b (mục 5).
- Mẫu "Velis – Dự án", "Velis – Chủ đầu tư" (Mẫu của tôi + `data/the7/mau-wpbakery/`) có hàng CTA mới. Trang mới dựng từ mẫu: chọn Sidebar: Disabled.
- Bài blog giữ sidebar: hộp CTA theo dự án (dự án = bài dự án có "Bài viết liên quan → chuyên mục" = cụm của bài – đổi ở trang dự án, không cấu hình mới)
  + danh sách `[velis_bai_viet]` "Cùng dự án …" rồi "Bài mới" (ảnh nhỏ + tiêu đề tới 3 dòng + meta một hàng), **bỏ bài đã hiện ở "Bài viết nên xem" cuối bài**
  (đo 3 bài: trùng 0). Widget The7 "Bài mới" chuyển sang Tiện ích không sử dụng (không xóa).

| Nơi người dùng tự sửa | Cách |
|---|---|
| Chữ CTA trang sản phẩm | sửa trang → WPBakery → hàng "lien-he-tu-van" → Text Block; tên dự án lead: thuộc tính `du-an` của shortcode form |
| Chữ CTA sidebar bài blog | Giao diện → Tiện ích → Default Sidebar → HTML tùy chỉnh (giữ `{du_an}`, `{du_an_link}`) |
| Dự án của một cụm bài | trang dự án → The7 Post Options → Bài viết liên quan → chọn chuyên mục cụm |
| Số bài sidebar | widget HTML `[velis_bai_viet so="5"]` |
| Ô form, nút, thư | Liên hệ → "Nhận bảng giá" |

## 4. Số đo

| Bộ đo | Trước | Sau |
|---|---|---|
| Chữ bị cắt (17 trang × 8 khung) | 130 | **0** |
| Dòng meta lệch | 312 | **0** |
| Tràn ngang / H1 ≠ 1 / ảnh hỏng / lỗi JS | – | 0 / 0 / 0 / 0 |
| On-page (`the7_check_onpage.py`, 236 URL) | 235 URL (bước 10–11) | 0 lỗi mới: chỉ còn 128 alt không dấu (nội dung, AUDIT mục 14) + 2 H1 ở chuyên mục rỗng 45 (đã biết, noindex) |
| Lighthouse mobile (trung vị 3) | trang chủ 95, The Privé 98, bài "Dòng vốn" 92 (bước 10) | trang chủ 93 (LCP 2,7 s, CLS 0,023), The Privé **98** (CLS 0), bài "Dòng vốn" 92 (CLS 0); Accessibility 97, SEO 100, Best Practices 100 cả 3 – không tụt ngoài dao động đo |

Test: `php tools/tests/the7-child-cta-test.php` (dự án của cụm, chữ chờ, thuộc tính du-an, chia danh sách không trùng), `python3 -I tools/the7_sua_buoc12.py --test`,
`node tools/the7_check_clip.mjs --test` – đạt.

Đã bỏ qua / chưa kiểm tra: chưa thử Safari/iPhone thật và chưa gửi form thật (thư có dòng "Dự án" chỉ kiểm qua cấu hình); bài 20330 (tiêu chuẩn bàn giao Persa Place) vẫn có khối "Liên hệ tư vấn" riêng trong nội dung cạnh hộp CTA sidebar.
Rủi ro: ID form 20958 và ảnh / chuyên mục là của staging – trên site thật phải thay ID; cụm Vinhomes (41) chưa có bài dự án trỏ tới nên dùng CTA chung.

## 5. Bước 12b – sửa 2 lỗi sau soát (Chrome 1536 + 390), theme con 1.7.2

| Lỗi | Nguyên nhân | Sửa (ở đâu) |
|---|---|---|
| Header dính trên điện thoại hiện **2 logo** cạnh nhau (mọi trang, 360–1024 px) | Khi dính, The7 ẩn logo thường bằng `.sticky-mobile-on .mobile-branding * { display: none }` rồi hiện logo dính riêng; quy tắc vùng bấm 44 px của theme con (`.mobile-branding a.same-logo { display: inline-flex }`, bước 10) mạnh hơn nên logo thường không ẩn | `velis.css`: quy tắc đó chỉ áp khi header **chưa dính** (`.masthead:not(.sticky-mobile-on)`); không cần đổi Theme Options |
| Trang sản phẩm: đoạn đầu trang nằm trái, bảng và phần dưới lại rộng hết khung – không thành một cột đọc | 1.7.1 bỏ cột 720 px; WPBakery không có "độ rộng tối đa" cho phần tử; 1 số bảng mang `width` % trực tiếp từ trình soạn thảo (98,8 % / 101 %); Spring Ville có 3 hàng 2 cột chữ \| ảnh | `velis.css`: **cột đọc 760 px căn giữa** cho mọi khối chữ trong hàng `velis-section` của trang có phần đầu `velis-hero` (mẫu "Velis – Dự án" / "Velis – Chủ đầu tư" đã có 2 class này → trang mới tạo từ mẫu tự đúng) + chữ phần đầu (trừ nhãn, H1) + nút / dòng gọi phần đầu; bảng 100 % cột; class mới `velis-read` cho hàng ở trang khác (/chu-dau-tu/). Nội dung: /chu-dau-tu/ hàng đầu thêm `velis-read`; Spring Ville 3 hàng → 1 cột (chữ, nút, ảnh dưới) |

Rộng hết khung 1200 px (không vào cột): breadcrumb, nhãn, H1, ảnh phần đầu, lưới thông tin dự án, khối "Nhận bảng giá", ảnh / thư viện ảnh (Inner Row),
video, lưới thẻ phân khu / bài, "Bài viết nên xem". Muốn một khối rộng hết khung: đặt trong Inner Row (WPBakery).

Bộ đo mới `tools/the7_check_cot.mjs` (`--test` đạt): (a) số logo thấy được trong khung nhìn = 1 ở 360/390/768/1024 × đầu trang / đang dính / menu mở
(4 trang); (b) 12 trang sản phẩm × 1366/1536/1920: mọi khối chữ cùng mép ±1 px, rộng ≤ 760 px, trống trái − phải ≤ 2 px.

| Bộ đo | Trước (1.7.1) | Sau (1.7.2) |
|---|---|---|
| Logo ≠ 1 (16 trang×khung × 3 trạng thái) | 32 (dính 2, menu mở 2 – mọi khung) | **0** |
| Cột đọc (36 trang×khung) | 279 lỗi (đoạn đầu 1106 px lệch trái, phần dưới 1170 px) | **0** – mép 388/1148 ở 1536 (303/1063 ở 1366, 580/1340 ở 1920), rộng 760, trống 220 = 220 |
| Chữ cắt / meta lệch / tràn ngang / H1 ≠ 1 / ảnh hỏng / lỗi JS (17 trang × 8 khung) | 0 (bước 12) | **0** / 0 / 0 / 0 / 0 / 0 (chỉ còn "rút gọn" cố ý ở thẻ: line-clamp) |
| On-page (236 URL) | 128 alt không dấu + H1 chuyên mục rỗng 45 | như cũ – không lỗi mới |

Ảnh trước | sau: `screenshots/the7/buoc-12b/` – header dính 390 / 768; The Privé, The Global City, Spring Ville cả trang ở 1536.

Đã bỏ qua / chưa kiểm tra: chưa thử Safari/iPhone thật (`:has()` cần Safari ≥ 15.4); dòng "Hoặc gọi … · Zalo" + nút phần đầu nay nằm trong cột đọc (dưới lưới thông tin) – nếu muốn thẳng mép lưới thì báo.
Rủi ro: trang sản phẩm mới phải dùng hàng `velis-section` + phần đầu `velis-hero` (có sẵn trong mẫu) – thiếu class thì chữ sẽ rộng hết khung.
