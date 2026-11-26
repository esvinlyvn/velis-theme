# Hướng dẫn viết và đăng nội dung – velisrealty.vn

Dành cho người viết nội dung, không cần biết code. Mọi việc dưới đây làm trong **wp-admin** (trang quản trị WordPress).
Dựa trên giao diện đã chốt trên staging ngày 2026-11-13 (theme con The7 1.8.1). Ảnh minh họa ở `screenshots/the7/huong-dan/`;
số trong vòng tròn đỏ trên ảnh khớp với số trong bảng của từng mục.

Tài liệu gốc khi cần tra sâu hơn:
- **viết gì, dài bao nhiêu, đặt link ở đâu: `docs/QUY-TAC-NOI-DUNG.md`** (đọc trước khi viết; khác tài liệu này thì theo tài liệu đó);
- giọng văn: `docs/VOICE.md`;
- câu chữ cấm và công bố bắt buộc: `docs/BRAND.md`;
- tên khu vực: `docs/KHU-VUC.md`;
- từ khóa: `data/keyword-map.csv`.

> **Ba điều quan trọng nhất**
> 1. Không đổi đường dẫn (URL) của bài/trang đã đăng.
> 2. Không xóa khối có chữ `velis-…` trong WPBakery (đó là "tên khuôn" giữ bố cục).
> 3. Số liệu nào cũng phải có nguồn và thời điểm; chưa có thì ghi "Chưa công bố".

---

## 1. Bản đồ nội dung

| Loại | Ví dụ | Viết ở đâu trong wp-admin | Mẫu WPBakery ("Mẫu của tôi") |
|---|---|---|---|
| Trang chủ | `/` | Trang → Trang chủ | – (đã dựng; chỉ sửa chữ) |
| Trang dự án | `/can-ho-the-prive/` | **Bài viết** → bài trong chuyên mục **Dự án** | Velis – Dự án |
| Trang phân khu | `/can-ho-palm-river/`, `/can-ho-persa-place/` | Bài viết → chuyên mục **Phân khu** | Velis – Dự án |
| Trang chủ đầu tư | `/du-an/gamuda-land/` | Trang → trang con của "Dự án" | Velis – Chủ đầu tư |
| Trang tổng | `/du-an/`, `/chu-dau-tu/` | Trang → Dự án / Chủ đầu tư | – (lưới tự lấy bài) |
| Bài blog theo cụm dự án | `/loi-suat-cho-thue-the-prive/` | Bài viết → chuyên mục **Blog → tên cụm** (vd. The Privé) | Velis – Bài viết |
| Bài thị trường | bài vĩ mô, lãi suất | Bài viết → chuyên mục **Blog** (không chọn cụm) | Velis – Bài viết |
| Giới thiệu, Liên hệ, Tuyển dụng | `/gioi-thieu/`, `/lien-he/`, `/tuyen-dung/` | Trang | – |
| Chính sách bảo mật, Điều khoản | `/chinh-sach-bao-mat/` | Trang | – |
| Khối dùng chung | footer, khối liên hệ cuối trang, "Nhận bảng giá", "Dự án nổi bật" | xem mục 1.8 | – |

### 1.1 Trang dự án (và trang phân khu) – thêm dự án mới bằng mẫu "Velis – Dự án" (cập nhật 2026-11-25)

Trang sản phẩm dựng bằng **6 phần tử Velis** (trong trình sửa WPBakery: dấu **+** → tab **Velis**, ảnh `velis/them-phan-tu.png`).
Không dùng Inner Row nhiều cột + nhiều Text Block để làm lưới, không gõ `[ez-toc]`, không thêm phần tử "Xem thêm", không thêm "Widgetised Sidebar".
Trình sửa trước | sau: `screenshots/the7/sua-tong/editor/the-prive-truoc.jpg` | `the-prive-sau.jpg`.

**Thêm dự án mới:**
1. Bài viết → Thêm bài mới → nút **Mẫu của tôi** → **"Velis – Dự án"** (mẫu có sẵn mọi phần tử, ô ghi `[…]` là chỗ điền).
2. Hàng đầu (nền ngà): sửa nhãn "Chủ đầu tư · Khu vực", H1, ảnh lớn (Single Image `velis-crop`), đoạn mở 1–2 câu (câu quan trọng nhất đặt đầu).
3. **Velis · Thông tin dự án** (`velis/thong-tin.png`): mỗi dòng một ô *Nhãn* + *Giá trị* (6 ô: chủ đầu tư, vị trí, quy mô, sản phẩm, pháp lý, bàn giao).
   Số viết theo một định dạng: `6,7 ha`, `98,5 m²`, `6,82 tỷ`, `quý 3/2028`. Số có đơn vị tự in màu champagne.
4. **Velis · Mục lục** (`velis/muc-luc.png`): để nguyên – tự lấy tiêu đề H2 của các khối bên dưới.
5. **Velis · Khối nội dung** (`velis/khoi.png`) – mỗi mục một khối, theo thứ tự: tổng quan → vị trí → tiện ích → mặt bằng → giá → tiến độ → pháp lý → góc nhìn CEO.
   Ô *Bài phân tích chi tiết* (không bắt buộc): chọn bài blog phân tích sâu đúng mục đó (khối Giá → bài giá, khối Pháp lý → bài pháp lý) → cuối khối hiện 1 dòng "Phân tích chi tiết: <tiêu đề bài>".
   *Tiêu đề* = H2 (câu hỏi người mua hay tìm). *Nội dung* = đoạn văn, danh sách, ảnh trong bài (viết hết, không cần "Xem thêm" – điện thoại tự thu gọn 2 khối dài nhất).
   *Minh họa* (không bắt buộc; hiện **dưới** nội dung, rộng hết khung): **Ảnh** (vị trí, phối cảnh) · **Thư viện ảnh** (tiện ích, mặt bằng, tiến độ – bấm để phóng to) ·
   **Bản đồ nhúng** (dán iframe Google Maps) · **Bảng** (bảng thông số). Khối luôn một cột – không có gì đặt cạnh chữ.
6. **Velis · Hỏi đáp** (`velis/hoi-dap.png`): 3–6 câu; mỗi câu *Câu hỏi* + *Trả lời* (40–80 chữ). Google đọc được (FAQPage) – không cần thêm gì.
7. **Velis · Nhận bảng giá** (`velis/nhan-bang-gia.png`): để trống *Tiêu đề* (tự thành "Nhận bảng giá <tên bài>"), 3 *Lợi ích*, *Form* = "Nhận bảng giá (20958)".
   Đây là form duy nhất của trang; số gọi / Zalo đổi ở Giao diện → Tùy biến → "Thanh liên hệ (điện thoại)".
8. **Velis · Lưới dự án / bài liên quan** (`velis/luoi.png`): *Loại* = Danh sách bài, *ID chuyên mục* = cụm blog của dự án (vd. The Privé = 48), *Số bài* 6.
9. Ô ngoài nội dung: bảng dưới (Sidebar: **Disabled**).

| Số trên ảnh 01 | Khối | Phần tử | Bắt buộc? |
|---|---|---|---|
| 1–5 | Đường dẫn, nhãn, H1, ảnh lớn, đoạn mở | hàng đầu (giữ nguyên cấu trúc) | có |
| 6 | Lưới thông tin | Velis · Thông tin dự án | có |
| 7 | Nút "Nhận bảng giá" + dòng gọi | nút The7 trong hàng đầu | có (giữ nguyên) |
| 8 | Mục lục | Velis · Mục lục | có (tự sinh) |
| 9–11 | Các mục + ảnh / bảng / bản đồ | Velis · Khối nội dung | có |
| 12 | Hỏi đáp | Velis · Hỏi đáp | nên có |
| 13 | Khối "Nhận bảng giá" (form) | Velis · Nhận bảng giá | có |
| 14 | Bài viết liên quan | Velis · Lưới dự án / bài liên quan | có |

**Ô ngoài nội dung (ảnh 02a, 02b):**

| Số | Ô | Viết gì |
|---|---|---|
| 1 | Tiêu đề bài | tên thường gọi của dự án (vd. "The Privé") – tiêu đề này hiện trên thẻ dự án |
| 10 | Đường dẫn | đặt 1 lần khi tạo, chữ thường không dấu, gạch nối; **không sửa** về sau |
| 4 | Danh mục | **Dự án** + chuyên mục chủ đầu tư (vd. Gamuda Land); phân khu: **Phân khu** |
| 5 | Ảnh đại diện | ảnh dùng cho thẻ dự án và khi chia sẻ (xem "Ảnh") |
| 6 | Sidebar Options | **Disabled** (trang sản phẩm không có cột phải) |
| 7 | Mô tả ngắn (Tóm tắt) | **đúng 4 dòng** cho thẻ dự án (ảnh 03): chủ đầu tư · khu vực · loại sản phẩm · "Bàn giao: …". Ô này ẩn sẵn: bật ở **Tùy chọn hiển thị** (góc phải trên) → tick "Mô tả ngắn" |
| 8 | Rank Math SEO | tiêu đề SEO, mô tả, từ khóa (mục 2) |
| 9 | Post Options → Related posts | chọn "choose category" → tick **cụm blog** của dự án (vd. Blog → The Privé). Đây cũng là chỗ để hộp "Nhận bảng giá <dự án>" bên bài blog biết bài thuộc dự án nào |

### 1.2 Trang chủ đầu tư

Mẫu "Velis – Chủ đầu tư":
1. phần đầu (H1 = tên chủ đầu tư);
2. lưới "Dự án <chủ đầu tư> tại Velis Realty", tự lấy bài theo chuyên mục chủ đầu tư;
3. "Về <chủ đầu tư>" và các mục phân tích – mỗi mục một **Velis · Khối nội dung** (mỗi khối một hàng, nền xen kẽ trắng / ngà `velis-nen-nga`);
4. **Velis · Hỏi đáp** 3 câu;
5. **Velis · Nhận bảng giá** ("Nhận bảng giá các dự án <chủ đầu tư>");
6. **Velis · Lưới dự án / bài liên quan** (lưới dự án ở mục 2 cũng là phần tử này, *Loại* = Thẻ dự án).

Chủ đầu tư có từ 2 dự án trên site trở lên mới tạo trang.

### 1.3 Trang tổng `/du-an/`, `/chu-dau-tu/`

- **/du-an/:** lưới thẻ tự lấy mọi bài có thẻ **Đang bán** (xem 1.7). Thêm dự án mới = đăng bài dự án + gắn thẻ "Đang bán".
- **/chu-dau-tu/:** mỗi chủ đầu tư là 1 cột trong hàng `velis-devs velis-boxes`, gồm logo, tên (H2, có link tới trang chủ đầu tư) và dòng dự án. Thêm chủ đầu tư = nhân bản 1 cột rồi sửa.

### 1.4 Bài blog (theo cụm dự án và bài thị trường)

Ngày sửa: bài sửa sau ngày đăng tự hiện "Cập nhật dd/mm/yyyy" cạnh ngày đăng (không cần làm gì).

Ảnh: màn soạn `04-bai-viet-man-soan.jpg` · trang thật `05-bai-viet-nhap-xem-truoc.jpg`.

| Số ảnh 04 | Ô | Viết gì |
|---|---|---|
| 1 | Tiêu đề | ≤ 60 ký tự, chữ thường đầu câu, có từ khóa chính ở đầu |
| 2 | Nội dung (WPBakery) | theo cấu trúc dưới |
| 3 | Danh mục | **Blog** + **đúng 1 cụm** (The Privé, The Global City, Palm City, Spring Ville, Ansana by Kita, Vinhomes Saigon Park, Vinhomes). Bài thị trường: chỉ "Blog" |
| 4 | Ảnh đại diện | ảnh này **tự hiện đầu bài** – không chèn lại ảnh đó vào nội dung |
| 5 | Mô tả ngắn | 1–2 câu (≤ 160 ký tự) tóm ý bài |
| 6 | Rank Math | mục 2 |
| 7 | Thẻ | không dùng |
| 8 / 9 | Lưu nháp / Xem trước | lưu nháp trước, xem trước rồi mới Đăng |

Trên trang (ảnh 05):
- số 5 – hộp "Nhận bảng giá <dự án>" ở cột phải, tự đổi theo cụm của bài;
- số 6 – "Cùng dự án …" tự liệt kê bài cùng cụm;
- số 7 – "Cùng chủ đề <dự án>": 3 bài mới nhất **cùng cụm** (tự lấy theo danh mục cụm của bài, trừ bài đang đọc; số bài đổi ở The7 → Theme Options → Blog).

Bài thị trường (không có cụm) thì hộp ở cột phải là hộp tư vấn chung.

**Gồm gì** (theo `VOICE.md`):
1. **Mở bài** – 1 đoạn nêu vấn đề của người mua, 1 đoạn góc nhìn Vũ Xuân, ngắn, không kể thành tích.
2. **Trả lời nhanh** – phần tử **Velis · Trả lời nhanh** kéo vào ngay trước khối chữ đầu bài (trang dự án: ngay trước Mục lục). Chỉ dùng cho bài trả lời một câu hỏi cụ thể: giá, pháp lý, tiến độ, bàn giao…
   - Ô *Câu hỏi*: thành H2 trên ô; viết đúng như người đọc gõ tìm, vd. "Giá The Privé 2026 bao nhiêu?".
   - Ô *Trả lời*: 2–4 câu hoặc 3–5 gạch đầu dòng. Chỉ dùng số đã có trong bài; viết số kiểu Việt (5,0–6,5 tỷ; 100–130 triệu/m²).
   - Ô *Nguồn*: nguồn bài đã ghi. Để trống thì hiện "Tổng hợp từ thông tin chủ đầu tư công bố".
   - Dòng cuối ô tự hiện "Nguồn · Cập nhật dd/mm/yyyy (ngày sửa bài) · Phân tích: <tác giả>".
3. **Thân bài theo H2** – mỗi H2 trả lời một câu hỏi; H3 nằm dưới H2, không nhảy cấp. Giữa bài: tối đa 2 thẻ **Velis · Đọc thêm** (ô *Bài đích* chọn từ danh sách + ô *Một dòng: người đọc sẽ biết thêm gì*), đặt ngay sau đoạn nhắc tới chủ đề. Muốn chèn giữa một khối chữ: tách khối Text Block làm hai rồi kéo thẻ vào giữa.
4. **"Rủi ro và điều cần kiểm tra"** – bắt buộc với bài phân tích đầu tư.
5. **Hộp công bố cuối bài** – nguyên văn trong `BRAND.md` mục "Công bố bắt buộc".
6. **Kết bài** – CTA mềm, dẫn về trang dự án của cụm.

**Độ dài:** theo nhu cầu người tìm (`QUY-TAC-NOI-DUNG.md` mục 2) – bài trả lời 1 câu hỏi 400–800 chữ, bài phân tích sâu mới dài;
- câu: ≤ 30 chữ;
- đoạn: ≤ 80 chữ.

**Không cần** thêm khối "Liên hệ tư vấn" cuối bài vì cột phải đã có form. Mẫu "Velis – Bài viết" còn hàng "Liên hệ tư vấn" (nút dẫn tới /lien-he/): xóa hàng đó khi dùng mẫu cho bài blog.

### 1.5 Giới thiệu, Liên hệ, Tuyển dụng

- Sửa chữ trực tiếp trong WPBakery. Giữ nguyên hàng và khối.
- **Email hiển thị:** info@velisrealty.vn.
- **Hotline:** 0911 237 979.
- **Địa chỉ:** 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh.

Ba thông tin này phải khớp footer và schema (Rank Math → Tiêu đề & Meta → SEO Local, chỉ Quản trị viên sửa).

### 1.6 Chính sách bảo mật, Điều khoản

Trang chữ thuần (H2 cho từng mục). Chính sách bảo mật cần viết lại theo Nghị định 13/2023/NĐ-CP (mục 5). Sửa nội dung xong báo Quản trị viên kiểm footer (link ở dòng dưới cùng).

### 1.7 Trang chủ

Chỉ sửa chữ trong các khối có sẵn. Lưới dự án trang chủ, lưới /du-an/ và dải "Dự án nổi bật" **tự lấy bài theo thẻ** (từ 2026-11-26), không sửa tay phần tử:

| Muốn | Làm (trong bài / trang dự án, ô **Thẻ** bên phải trình sửa) |
|---|---|
| Đưa sản phẩm lên lưới trang chủ + /du-an/ | gắn thẻ **Đang bán** (bất kể chuyên mục: dự án, phân khu, dòng sản phẩm…) |
| Rút sản phẩm xuống (trang vẫn giữ, vẫn mở được) | bỏ thẻ **Đang bán** |
| Lên dải "Dự án nổi bật" (ảnh đầu trang chủ, tối đa 4) | gắn thêm thẻ **Nổi bật** |
| Đổi thứ tự | sửa **ngày đăng** (mới nhất đứng trước) |
| Chưa bán / ngừng bán nhưng giữ trang (như Ansana by Kita) | để trang **Công khai**, **không** gắn "Đang bán" |

- Phân khu / dòng sản phẩm: thêm 1 dòng cuối ở ô **Tóm tắt** dạng "<tên> · <dự án mẹ>" (vd. "Palm River · Palm City") – thẻ dự án hiện dòng này.
- Thẻ chỉ áp cho **Bài viết** (trang dự án là bài viết). Trang lưu trữ /tag/… để noindex, không có trong sitemap (Rank Math – đừng bật lại).

Trên điện thoại (bước 15): lưới dự án là dải trượt ngang. Từ 2026-11-25 không còn `velis-clamp` / "Xem thêm" đặt tay: máy tính hiện hết;
điện thoại tự thu gọn tối đa 2 Khối nội dung dài nhất (không thu giá, pháp lý, tiến độ, hỏi đáp). Nền khối trang chủ / trang khối: Extra class
`velis-nen-nga` (ngà) xen kẽ với trắng – không đặt màu nền trong Design Options (DESIGN.md "Nền khối").

### 1.8 Khối dùng chung (không nằm trong bài)

| Khối | Ở đâu | Ai sửa |
|---|---|---|
| Footer 4 cột (ảnh `06-footer.jpg`) – 1: Velis Realty (logo, câu giới thiệu, hotline, Zalo, email, địa chỉ, giờ) · 2: Dự án (6 bài mới nhất chuyên mục Dự án, tự cập nhật) · 3: Về Velis (menu) · 4: Kết nối (mạng xã hội) | Giao diện → Tiện ích → **Default Footer**; cột 3 ở Giao diện → Menu → "Velis – Về Velis (chân trang)" | Quản trị viên |
| Dòng dưới cùng (5: "© … Công ty TNHH Velis Realty · MST: 0319425663" + lưu ý; 6: Chính sách bảo mật · Điều khoản) | The7 → Theme Options → Bottom bar; menu "Velis – Pháp lý (dòng cuối)" | Quản trị viên |
| Khối liên hệ cuối trang (ảnh `07-khoi-lien-he-cuoi.jpg`) – tự hiện ở trang **chưa có** form (trang chủ, /du-an/, /blog/, chuyên mục, Giới thiệu, Tuyển dụng, tìm kiếm, 404) | Giao diện → Tiện ích → **Khối liên hệ cuối trang** | Quản trị viên |
| Khối "Nhận bảng giá" trên trang dự án / chủ đầu tư | trong bài (hàng `velis-cta`); chỉ đổi tên dự án ở tiêu đề và trong `du-an="…"` | Người viết |
| Hộp "Nhận bảng giá <dự án>" ở cột phải bài blog | Giao diện → Tiện ích → Default Sidebar (chữ `{du_an}` tự thay bằng tên dự án) | Quản trị viên |
| Dải "Dự án nổi bật" | thẻ **Nổi bật** trên bài dự án (xem 1.7) | Người viết |

---

## 2. Quy tắc chung: ảnh, giọng văn, onpage

### 2.1 Ảnh

| Loại | Tỉ lệ | Cỡ tối thiểu | Ghi chú |
|---|---|---|---|
| Ảnh đại diện (thẻ, chia sẻ) | 3:2 (thẻ cắt 3:2) | 1200 × 800 px | chủ thể ở giữa |
| Ảnh lớn đầu trang dự án | 16:9 | 1920 × 1080 px | – |
| Ảnh trong bài / mục | tự do; ngang ưu tiên | rộng ≥ 1200 px | – |
| Mặt bằng | giữ nguyên tỉ lệ | rộng ≥ 1600 px | bản sạch, chữ chú thích đọc được |
| Logo chủ đầu tư | ngang, nền trong | cao ≥ 80 px | PNG/SVG |

- **Không** watermark, huy hiệu VELIS, logo đơn vị khác, chữ in sẵn (giá, khẩu hiệu, "QUẬN 2"…). Cần bản gốc thì xin chủ đầu tư; xem `docs/HUONG-DAN-GUI-ANH.md`, `docs/CHUAN-ANH.md`.
- **Ảnh tiến độ / thư viện** đặt nhiều ảnh trong các cột cạnh nhau (Inner Row, mỗi cột chỉ có ảnh): trên điện thoại thành lưới 2 cột ảnh nhỏ,
  nên mỗi Single Image chọn **On click action → Open lightbox** (link_image – mở cửa sổ ảnh, không chuyển trang; KHÔNG dùng "Link to large image").
- **Tóm tắt (Excerpt)** của bài blog không hiện ở danh sách bài trên điện thoại (chỉ ảnh, nhãn cụm, tiêu đề, ngày) – tiêu đề phải tự đủ nghĩa
  trong 3 dòng (≈ 70 ký tự). Dòng "cụm · ngày · N phút đọc" dưới H1 bài tự sinh (cụm = chuyên mục con đầu tiên), không gõ tay.
- **Tên file** viết thường không dấu, gạch nối, mô tả ảnh: `the-prive-phoi-canh-ven-song.jpg`, không đặt `IMG_1234.jpg`.
- **Alt (Văn bản thay thế)** viết có dấu, tả đúng ảnh trong một câu ngắn, ví dụ "Phối cảnh The Privé nhìn từ sông Giồng Ông Tố". Không nhồi từ khóa và không chép tên file. Ảnh phối cảnh thì ghi thêm chú thích "Ảnh phối cảnh minh họa – nguồn: CĐT".

### 2.2 Viết thế nào

- **Giọng văn** theo `VOICE.md`:
  - xưng "tôi" (Vũ Xuân), gọi người đọc "anh chị", không dùng "bạn";
  - nghiêm túc, dữ kiện trước, cảm xúc sau.
- **Số liệu phải có nguồn và thời điểm** (vd. "theo thông báo của CĐT ngày 10/04/2026"). Không tự ước tính rồi trình bày như số liệu thị trường.
- **Giá:** chưa có giá chính thức thì ghi **"Chưa công bố"**. Không ghi "giá rumor", không ghi giá dự đoán.
- **Từ cấm** (Luật Quảng cáo, `BRAND.md`), chỉ dùng khi có văn bản dẫn nguồn:
  - so sánh nhất: "tốt nhất", "duy nhất", "số 1", "đầu tiên", "bậc nhất", "đắc địa nhất";
  - "độc quyền", "chính thức", "cam kết", "đảm bảo lợi nhuận", "chắc chắn tăng giá";
  - hứa lợi nhuận: "x2", "lãi …% trong … tháng";
  - "siêu giàu", "tinh hoa", "thượng lưu" (không bao giờ đưa vào tiêu đề).
- **Địa danh** theo đơn vị hành chính mới (từ 01/07/2025 TP.HCM bỏ cấp quận):
  - viết phường/xã mới, có thể kèm tên cũ, ví dụ "phường Bình Trưng (trước đây Quận 2)";
  - không viết "Quận 2" hay "TP. Thủ Đức" như đơn vị hiện hành;
  - khu vực thị trường (Nam Rạch Chiếc, Khu Đông, Nhơn Trạch – Long Thành…) lấy đúng tên trong `KHU-VUC.md`.
- **Chữ hoa:** tiêu đề và H2/H3 viết **chữ thường đầu câu** ("Giá bán The Privé bao nhiêu?"). Không Title Case ("Giá Bán The Privé"), không VIẾT HOA cả câu. Tên riêng giữ hoa.

### 2.3 Onpage (Rank Math – hộp "Rank Math SEO" dưới nội dung)

| Việc | Quy tắc |
|---|---|
| Từ khóa chính / phụ | tra `data/keyword-map.csv`: cột `url_cu` = đường dẫn hiện tại của bài, lấy `tu_khoa_chinh`, `tu_khoa_phu` (cột `url_moi` là phương án cũ, **không** dùng làm URL). Bài mới: chọn 1 từ khóa chính người mua thật sự gõ, không trùng từ khóa chính của bài khác cùng cụm |
| Đặt từ khóa | H1 (tốt nhất ở đầu), câu đầu đoạn mở, ít nhất 1 H2, alt 1 ảnh, đường dẫn |
| Tiêu đề SEO | ô "Tiêu đề" trong Rank Math → Chỉnh sửa đoạn trích: **50–60 ký tự**, có tên dự án (Rank Math hiện số đếm). Trang chuyên mục cụm: mẫu "Phân tích <dự án>: giá, tiến độ, cho thuê \| Velis Realty" (dài quá 60 thì bỏ ", cho thuê") |
| Mô tả | **140–155 ký tự**, có từ khóa chính, nói rõ người đọc được gì |
| Đường dẫn | đặt 1 lần khi tạo: chữ thường không dấu, gạch nối, ≤ 5 từ chính, có từ khóa (vd. `/loi-suat-cho-thue-the-prive/`). **Không đổi đường dẫn bài đã đăng** (đổi làm mất thứ hạng; nếu bắt buộc phải nhờ Quản trị viên tạo chuyển hướng 301) |
| Tiêu đề trong bài | 1 H1 (tiêu đề), dưới là H2 rồi H3, không nhảy cấp (H2 → H4) |
| Link nội bộ bắt buộc | **mỗi bài mới: 1 link về trang dự án của cụm + 1–2 link sang bài cùng cụm** (trong thân bài, gắn vào cụm từ có sẵn, không đặt trong tiêu đề); **trang dự án → trang chủ đầu tư, phân khu (nếu có) và 3 bài blog** của cụm. Kiểm: `python3 -I tools/the7_kiem_onpage_link.py <site> out.json` |
| Chuyên mục | bài blog: Blog + đúng 1 cụm; dự án: Dự án + chủ đầu tư; phân khu: Phân khu |
| Thẻ dự án | ảnh đại diện + Mô tả ngắn 4 dòng (mục 1.1) |
| Hỏi đáp | dùng khi người mua hay hỏi một câu cụ thể (giá, pháp lý, bàn giao, vay); 3–6 câu; câu hỏi viết đúng như người mua hỏi, trả lời thẳng ở câu đầu |

---

## 3. Quy trình đăng

1. **Viết.** Tạo bài, chọn mẫu ở "Mẫu của tôi", điền ô, rồi bấm **Lưu nháp**.
2. **Kiểm** theo checklist mục 4.
3. **Xem trước.** Bấm nút Xem trước, xem cả máy tính và điện thoại. Trên Chrome: F12 → biểu tượng điện thoại, chọn 390 px.
4. **Đăng.** Bấm nút Đăng (hoặc Cập nhật).
5. **Xóa cache.** Trên thanh đen trên cùng: **LiteSpeed Cache → Xóa tất cả** (site chỉ còn một plugin tối ưu – FVM đã gỡ 2026-11-25).
6. **Kiểm trang thật.** Mở bằng cửa sổ ẩn danh trên máy tính và điện thoại. Xem ảnh, form, thẻ dự án, mục lục.
7. **Báo Search Console (trang mới).** Search Console → Kiểm tra URL → dán URL → **Yêu cầu lập chỉ mục**. Bài sửa nhỏ thì không cần.

---

## 4. Checklist mỗi lần đăng (in ra, ≤ 25 dòng)

```
CHECKLIST ĐĂNG BÀI / TRANG – velisrealty.vn                        Ngày: ____  Người viết: ____
[ ] 1  Tiêu đề (H1) ≤ 60 ký tự, chữ thường đầu câu, có từ khóa chính
[ ] 2  Từ khóa chính lấy từ data/keyword-map.csv (hoặc đã thống nhất), không trùng bài khác cùng cụm
[ ] 3  Rank Math: tiêu đề SEO ≤ 60 · mô tả 140–155 ký tự · đã nhập từ khóa chính
[ ] 4  Đường dẫn: thường, không dấu, gạch nối – bài cũ KHÔNG đổi đường dẫn
[ ] 5  Chuyên mục: blog = Blog + 1 cụm · dự án = Dự án + chủ đầu tư · phân khu = Phân khu
[ ] 6  Ảnh đại diện ≥ 1200×800, không watermark / chữ in sẵn; không chèn lại vào nội dung
[ ] 7  Mô tả ngắn: dự án = 4 dòng (CĐT · khu vực · loại · "Bàn giao: …") · bài = 1–2 câu
[ ] 8  Mọi ảnh có alt có dấu, tả đúng ảnh; tên file không dấu, có nghĩa
[ ] 9  H2 → H3 không nhảy cấp; mỗi H2 trả lời 1 câu hỏi
[ ] 10 Câu ≤ 30 chữ, đoạn ≤ 80 chữ; xưng "tôi", gọi "anh chị"
[ ] 11 Số liệu có nguồn + thời điểm; giá chưa có → "Chưa công bố"
[ ] 12 Không từ cấm: nhất / duy nhất / số 1 / độc quyền / chính thức / cam kết / x2 / lãi …% …
[ ] 13 Địa danh: phường/xã mới (trước đây Quận …); khu vực theo KHU-VUC.md
[ ] 14 Link nội bộ: bài → trang dự án của cụm · dự án → CĐT + phân khu + 3 bài
[ ] 15 Bài đầu tư: có mục "Rủi ro và điều cần kiểm tra" + hộp công bố cuối bài
[ ] 16 Trang dự án: Sidebar = Disabled; khối "Nhận bảng giá" đúng tên dự án
[ ] 17 Trang dự án: Post Options → Related = cụm blog của dự án
[ ] 18 Xem trước máy tính + điện thoại (390 px): không chữ tràn, ảnh hiện đủ
[ ] 19 Đăng → LiteSpeed Cache → Xóa tất cả → mở lại bằng tab ẩn danh
[ ] 20 Trang mới: Search Console → Kiểm tra URL → Yêu cầu lập chỉ mục
```

---

## 5. Việc nội dung đang chờ (xếp theo lượt truy cập)

Lượt nhấp lấy từ `data/gsc/pages.csv` (Search Console 3 tháng). Trang đông khách làm trước.

| Ưu tiên | Việc | Trang / phạm vi | Nguồn |
|---|---|---|---|
| 1 | Câu giới thiệu cột 1 footer và mô tả tổ chức trong schema đang ghi "Sàn giao dịch bất động sản cao cấp chuyên tư vấn các dự án Vinhomes, Sun Group." Câu này sai vai trò, phải là "đơn vị tư vấn, phân phối". Cần viết lại 1 câu cho cả hai chỗ (Quản trị viên dán vào Tiện ích footer và Rank Math → SEO Local → Thẻ mô tả). | mọi trang (footer) + schema | báo cáo bước 13–14 |
| 2 | Bài nhiều lượt nhất (239 nhấp): rà câu chữ cường điệu, alt không dấu ("hallmark thu thiem; palm city"), tiêu đề | `/huong-viet-holdings-la-ai/` | GSC; AUDIT mục 14.3 |
| 3 | Trang chủ (114 nhấp): 4 mục "Giá trị khác biệt" đang Title Case ("Thông Tin Có Nguồn"…) → chữ thường đầu câu | `/` | AUDIT mục 13 |
| 4 | **Mốc bàn giao The Privé**: bảng tổng quan ghi "Năm 2027", mục tiến độ ghi "Quý 1/2028" → chủ site chọn 1 mốc có nguồn | `/can-ho-the-prive/` + bài cụm | AUDIT mục 2.6 |
| 5 | Persa Place (22 nhấp): 3 tiêu đề H4 ngay dưới H2 → H3; 11 ảnh (bản đồ, mặt bằng, tiến độ) có chữ in sẵn cần bản gốc | `/can-ho-persa-place/` | AUDIT 14.1; SAU-RA-MAT mục 14 |
| 6 | Penthouse / Garden Duplex The Privé (12 nhấp): alt không dấu, câu cường điệu | `/penthouse-garden-duplex-the-prive-quan-2/` | AUDIT 14.3 |
| 7 | **Chính sách bảo mật** viết lại theo Nghị định 13/2023/NĐ-CP (mục đích xử lý, loại dữ liệu form thu, thời gian lưu, quyền của chủ thể dữ liệu, đầu mối liên hệ info@velisrealty.vn) | `/chinh-sach-bao-mat/` | yêu cầu chủ site |
| 8 | **Địa danh cũ** "Quận 2 (nay là TP. Thủ Đức)", "Phường An Phú, Quận 2" ở ô địa chỉ / mục Vị trí The Privé, The Global City và bài cụm → phường mới (trước đây Quận 2) | trang dự án + bài | AUDIT mục 8, 13 |
| 9 | **Tiêu đề viết hoa từng chữ** trong nội dung cũ (vd. "Velis Realty Phân Phối Độc Quyền Tháp 9 The Privé") → chữ thường đầu câu; đồng thời bỏ "độc quyền" nếu không có văn bản | bài cụm The Privé + trang cũ | AUDIT mục 7, 13 |
| 10 | **128 alt không dấu** trên 100 trang → viết lại có dấu, tả đúng ảnh (danh sách đủ ở AUDIT 14.3) | 100 trang | AUDIT 14.3 |
| 11 | **Câu chữ cường điệu**: "giới siêu giàu", "tinh hoa", "lợi nhuận 15–20%", "Giá Rumor", "đẹp nhất dự án" … → thay bằng dữ kiện có nguồn | bài + trang dự án | VOICE.md; AUDIT mục 7–8 |
| 12 | **66 ảnh có chữ in sẵn / huy hiệu** cần ảnh gốc từ chủ đầu tư (danh sách theo ID) | Spring Ville, Persa Place, Vinhomes Saigon Park, Palm River, The Privé | SAU-RA-MAT mục 14 |
| 13 | **Dự án thiếu ảnh**: mặt bằng The Privé (3 file gốc hỏng: ID 19976–19978), ảnh hero thứ hai cho `/du-an/` | The Privé, /du-an/ | SAU-RA-MAT mục 5–6 |
| 14 | Link nội bộ thiếu: 3 bài cụm Spring Ville chưa link `/spring-ville/`; The Privé (Đất Xanh), Palm River (Hướng Việt), Ansana (Kita Group) chưa có link chủ đầu tư | bài cụm + trang dự án | AUDIT 14.2 |
| 15 | **Mô tả ngắn của 102 bài blog đang trống** → viết 1–2 câu (dùng cho danh sách bài và chia sẻ) | 102 bài | kiểm REST 2026-11-13 |

---

## 6. Phân quyền

Người viết dùng tài khoản **Biên tập viên** (Editor) do Quản trị viên tạo. Bảng dưới theo quyền chuẩn của WordPress. Trên staging hiện chưa có tài khoản Biên tập viên để thử, nên bảng **chưa thử thực tế** trên bản The7.

| Việc | Biên tập viên | Phải nhờ Quản trị viên |
|---|---|---|
| Viết / sửa / đăng mọi bài và trang, tải ảnh, sửa alt | ✓ | – |
| Chọn chuyên mục, tạo chuyên mục mới | ✓ | – (nhưng cụm mới nên báo trước) |
| Rank Math trong từng bài (tiêu đề, mô tả, từ khóa, schema bài) | ✓ | – |
| Mẫu WPBakery "Mẫu của tôi": dùng | ✓ | lưu/sửa mẫu gốc: báo Quản trị viên |
| Xóa cache LiteSpeed | ✓ thường có trên thanh quản trị | nếu không thấy nút |
| Giao diện → Menu, Tiện ích (footer, khối liên hệ cuối, hộp cột phải bài blog) | – | ✓ |
| The7 → Theme Options (màu, chữ, dòng dưới cùng, MST) | – | ✓ |
| Rank Math → cài đặt chung, SEO Local (email, địa chỉ, MST, mô tả tổ chức), chuyển hướng 301 | – | ✓ |
| Contact Form 7 (form, email nhận velisrealtyvn@gmail.com) | – | ✓ |
| Tạo / sửa người dùng, cài plugin / theme | – | ✓ |

Đầu mối Quản trị viên: chủ site (tài khoản quản trị Velis Realty).


## Bổ sung 2026-11-26

- **Persa Place**: chuyên mục con của Spring Ville (`/blog/spring-ville/persa-place/`). Bài về Persa Place chọn **chỉ** chuyên mục Persa Place (không chọn thêm Spring Ville).
- **/du-an/ – thẻ lọc**: mỗi trang dự án Đang bán gắn 1 thẻ khu vực (Khu Đông / Khu Tây / Tây Bắc / Vùng vệ tinh) và các thẻ loại hình có bán (Căn hộ / Nhà phố / Shophouse / Biệt thự).
  Nút lọc ở /du-an/ tự hiện theo thẻ. Trang thẻ không lên Google (noindex, không vào sitemap).
- **Trang tác giả** (`/chuyen-gia/<tên>/`): điền ở **Tài khoản → Hồ sơ** – "Thông tin tiểu sử" + mục "Trang tác giả" (chức danh, chứng chỉ hành nghề, liên hệ, ID ảnh chân dung trong Thư viện).
  Ô nào trống thì khách không thấy.
