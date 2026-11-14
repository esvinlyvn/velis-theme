# Hướng dẫn viết và đăng nội dung – velisrealty.vn

Dành cho người viết nội dung, không cần biết code. Mọi việc dưới đây làm trong **wp-admin** (trang quản trị WordPress).
Dựa trên giao diện đã chốt trên staging ngày 2026-11-13 (theme con The7 1.8.1). Ảnh minh họa ở `screenshots/the7/huong-dan/`;
số trong vòng tròn đỏ trên ảnh khớp với số trong bảng của từng mục.

Tài liệu gốc khi cần tra sâu hơn:
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

### 1.1 Trang dự án (và trang phân khu)

Ảnh: trang thật `01-du-an-trang-that.jpg` · màn soạn `02a-du-an-man-soan-tren.jpg`, `02b-du-an-man-soan-duoi.jpg`.

**Ở đâu:** Bài viết → mở bài dự án (hoặc Thêm bài mới → nút **Mẫu của tôi** (ảnh 02a số 3) → "Velis – Dự án").

| Số trên ảnh 01 | Khối | Ô soạn | Bắt buộc? | Độ dài gợi ý |
|---|---|---|---|---|
| 1 | Đường dẫn "Trang chủ / Dự án / …" | tự sinh | – | – |
| 2 | Nhãn "Chủ đầu tư · Khu vực" | hàng đầu (velis-hero) → ô chữ trên H1 | có | tên khu vực theo `KHU-VUC.md` |
| 3 | Tiêu đề trang (H1) | hàng đầu → ô chữ | có | ≤ 60 ký tự, có từ khóa chính |
| 4 | Ảnh lớn đầu trang | hàng đầu → Single Image (`velis-crop`) | có | xem "Ảnh" |
| 5 | Đoạn mở | ô chữ dưới ảnh | có | 1–2 câu, ≤ 50 chữ |
| 6 | Lưới thông tin (6 ô) | Inner Row `velis-specs` – mỗi ô: nhãn + giá trị | có | mỗi giá trị ≤ 8 chữ |
| 7 | Nút "Nhận bảng giá" + dòng gọi | nút The7 | có (giữ nguyên) | – |
| 8 | Mục lục | tự sinh từ các H2 | – | – |
| 9 | Các mục H2 | mỗi mục là một hàng `velis-section` | xem thứ tự dưới | ~60 chữ phần luôn hiện |
| 10 | "Xem thêm" (phần chữ dài thu gọn) | khối Toggle `velis-more` trong mục | tùy chọn | phần còn lại của mục |
| 11 | Ảnh / thư viện ảnh rộng hết khung | Inner Row trong mục | tùy chọn | 2–3 ảnh mỗi hàng |
| 12 | Hỏi đáp | Toggle, tiêu đề = câu hỏi (H3) | nên có | 3–6 câu, mỗi trả lời 40–80 chữ |
| 13 | Khối "Nhận bảng giá" (form) | hàng `velis-cta` | có – **chỉ sửa tên dự án** | – |
| 14 | Bài viết liên quan | tự lấy theo chuyên mục (ảnh 02b số 9) | – | – |

**Gồm gì, theo thứ tự:**
1. đoạn mở;
2. bảng thông tin;
3. tổng quan;
4. vị trí;
5. tiện ích;
6. mặt bằng;
7. giá;
8. tiến độ;
9. chủ đầu tư;
10. góc nhìn CEO (tùy chọn);
11. hỏi đáp;
12. nhận bảng giá.

Mục 1–7, 9, 11 và 12 bắt buộc. Tiến độ và góc nhìn CEO thì có thông tin mới viết. Bảng thông tin dùng bảng 2 cột (nhãn | giá trị).

**Chữ tự xếp vào cột đọc 760 px ở giữa.** Ảnh, lưới thông tin, thư viện ảnh và khối "Nhận bảng giá" thì rộng hết khung. Muốn một khối rộng hết khung thì đặt nó trong **Inner Row**. Không kéo dãn bảng hay đặt độ rộng bảng bằng tay; bảng tự rộng đúng cột.

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
3. "Về <chủ đầu tư>", có "Xem thêm";
4. hỏi đáp 3 câu;
5. "Nhận bảng giá các dự án <chủ đầu tư>";
6. bài liên quan.

Chủ đầu tư có từ 2 dự án trên site trở lên mới tạo trang.

### 1.3 Trang tổng `/du-an/`, `/chu-dau-tu/`

- **/du-an/:** lưới thẻ tự lấy bài chuyên mục Dự án + Phân khu. Không cần viết gì thêm. Thêm dự án mới = đăng bài dự án đúng chuyên mục.
- **/chu-dau-tu/:** mỗi chủ đầu tư là 1 cột trong hàng `velis-devs velis-boxes`, gồm logo, tên (H2, có link tới trang chủ đầu tư) và dòng dự án. Thêm chủ đầu tư = nhân bản 1 cột rồi sửa.

### 1.4 Bài blog (theo cụm dự án và bài thị trường)

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
- số 7 – "Bài viết liên quan".

Bài thị trường (không có cụm) thì hộp ở cột phải là hộp tư vấn chung.

**Gồm gì** (theo `VOICE.md`):
1. **Mở bài** – 1 đoạn nêu vấn đề của người mua, 1 đoạn góc nhìn Vũ Xuân, ngắn, không kể thành tích.
2. **Tóm tắt nhanh** – 3–5 gạch đầu dòng có số liệu và nguồn.
3. **Thân bài theo H2** – mỗi H2 trả lời một câu hỏi; H3 nằm dưới H2, không nhảy cấp.
4. **"Rủi ro và điều cần kiểm tra"** – bắt buộc với bài phân tích đầu tư.
5. **Hộp công bố cuối bài** – nguyên văn trong `BRAND.md` mục "Công bố bắt buộc".
6. **Kết bài** – CTA mềm, dẫn về trang dự án của cụm.

**Độ dài:**
- bài thường: 1.200–2.000 chữ;
- bài trụ cột: 2.500–4.000 chữ;
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

Chỉ sửa chữ trong các khối có sẵn. Hai phần **tự lấy bài, không sửa tay**:
- **lưới dự án:** chuyên mục Dự án;
- **dải "Dự án nổi bật":** chọn bài ở ô Posts của khối `velis-feats`. Phần này nhờ Quản trị viên nếu không quen WPBakery.

### 1.8 Khối dùng chung (không nằm trong bài)

| Khối | Ở đâu | Ai sửa |
|---|---|---|
| Footer 4 cột (ảnh `06-footer.jpg`) – 1: Velis Realty (logo, câu giới thiệu, hotline, Zalo, email, địa chỉ, giờ) · 2: Dự án (6 bài mới nhất chuyên mục Dự án, tự cập nhật) · 3: Về Velis (menu) · 4: Kết nối (mạng xã hội) | Giao diện → Tiện ích → **Default Footer**; cột 3 ở Giao diện → Menu → "Velis – Về Velis (chân trang)" | Quản trị viên |
| Dòng dưới cùng (5: "© … Công ty TNHH Velis Realty · MST: 0319425663" + lưu ý; 6: Chính sách bảo mật · Điều khoản) | The7 → Theme Options → Bottom bar; menu "Velis – Pháp lý (dòng cuối)" | Quản trị viên |
| Khối liên hệ cuối trang (ảnh `07-khoi-lien-he-cuoi.jpg`) – tự hiện ở trang **chưa có** form (trang chủ, /du-an/, /blog/, chuyên mục, Giới thiệu, Tuyển dụng, tìm kiếm, 404) | Giao diện → Tiện ích → **Khối liên hệ cuối trang** | Quản trị viên |
| Khối "Nhận bảng giá" trên trang dự án / chủ đầu tư | trong bài (hàng `velis-cta`); chỉ đổi tên dự án ở tiêu đề và trong `du-an="…"` | Người viết |
| Hộp "Nhận bảng giá <dự án>" ở cột phải bài blog | Giao diện → Tiện ích → Default Sidebar (chữ `{du_an}` tự thay bằng tên dự án) | Quản trị viên |
| Dải "Dự án nổi bật" | trang chủ, khối `velis-feats` | Quản trị viên |

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
| Tiêu đề SEO | ô "Tiêu đề" trong Rank Math → Chỉnh sửa đoạn trích: **≤ 60 ký tự** (Rank Math hiện số đếm) |
| Mô tả | **140–155 ký tự**, có từ khóa chính, nói rõ người đọc được gì |
| Đường dẫn | đặt 1 lần khi tạo: chữ thường không dấu, gạch nối, ≤ 5 từ chính, có từ khóa (vd. `/loi-suat-cho-thue-the-prive/`). **Không đổi đường dẫn bài đã đăng** (đổi làm mất thứ hạng; nếu bắt buộc phải nhờ Quản trị viên tạo chuyển hướng 301) |
| Tiêu đề trong bài | 1 H1 (tiêu đề), dưới là H2 rồi H3, không nhảy cấp (H2 → H4) |
| Link nội bộ bắt buộc | **bài blog → trang dự án của cụm** (ít nhất 1 link trong thân bài); **trang dự án → trang chủ đầu tư, phân khu (nếu có) và 3 bài blog** của cụm |
| Chuyên mục | bài blog: Blog + đúng 1 cụm; dự án: Dự án + chủ đầu tư; phân khu: Phân khu |
| Thẻ dự án | ảnh đại diện + Mô tả ngắn 4 dòng (mục 1.1) |
| Hỏi đáp | dùng khi người mua hay hỏi một câu cụ thể (giá, pháp lý, bàn giao, vay); 3–6 câu; câu hỏi viết đúng như người mua hỏi, trả lời thẳng ở câu đầu |

---

## 3. Quy trình đăng

1. **Viết.** Tạo bài, chọn mẫu ở "Mẫu của tôi", điền ô, rồi bấm **Lưu nháp**.
2. **Kiểm** theo checklist mục 4.
3. **Xem trước.** Bấm nút Xem trước, xem cả máy tính và điện thoại. Trên Chrome: F12 → biểu tượng điện thoại, chọn 390 px.
4. **Đăng.** Bấm nút Đăng (hoặc Cập nhật).
5. **Xóa cache.** Trên thanh đen trên cùng:
   - **LiteSpeed Cache → Xóa tất cả**;
   - mục **FVM → Clear Cache** (nếu có quyền; không có thì nhờ Quản trị viên).
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
[ ] 19 Đăng → xóa cache LiteSpeed + FVM → mở lại bằng tab ẩn danh
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
| Xóa cache FVM | – | ✓ |
| Giao diện → Menu, Tiện ích (footer, khối liên hệ cuối, hộp cột phải bài blog) | – | ✓ |
| The7 → Theme Options (màu, chữ, dòng dưới cùng, MST) | – | ✓ |
| Rank Math → cài đặt chung, SEO Local (email, địa chỉ, MST, mô tả tổ chức), chuyển hướng 301 | – | ✓ |
| Contact Form 7 (form, email nhận velisrealtyvn@gmail.com) | – | ✓ |
| Tạo / sửa người dùng, cài plugin / theme | – | ✓ |

Đầu mối Quản trị viên: chủ site (tài khoản quản trị Velis Realty).
