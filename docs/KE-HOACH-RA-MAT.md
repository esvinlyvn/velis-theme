# Kế hoạch ra mắt (site thật velisrealty.vn)

Chỉ làm vào ngày ra mắt, sau khi người dùng duyệt giai đoạn 4. Mọi bước ghi lên site thật cần duyệt riêng (CLAUDE.md).

## Ngay trước khi ra mắt – làm mới dữ liệu (bắt buộc)

Ma trận redirect và bản đồ từ khóa dựng từ ảnh chụp site ngày 2026-11-04; site vẫn có bài, ảnh, redirect mới sau ngày đó.

1. Đọc lại từ **site thật** (chỉ đọc, REST công khai + Rank Math → Chuyển hướng): bài viết, trang, chuyên mục, media,
   redirect Rank Math → ghi đè `data/inventory/*`.
2. Chạy lại `python3 -I tools/build_url_map.py` và `python3 -I tools/build_keyword_map.py`.
3. Chạy toàn bộ test: `python3 -I -m unittest discover -s tools/tests -p 'test_*.py'`, `php tools/tests/data-model-test.php`,
   `php tools/tests/plugin-load-test.php`, `php tools/tests/components-test.php`, `node tools/tests/listing-filter.test.mjs`.
   Test nào đỏ (ví dụ số bài thay đổi) → xem lại, không sửa test cho xanh.
4. So `data/url-map.csv` mới với bản đã duyệt; URL mới phát sinh thì báo người dùng trước khi nhập vào Rank Math.

## Thứ tự ra mắt

1. Sao lưu (UpdraftPlus thủ công: tệp + CSDL).
2. Cài + kích hoạt plugin `velis-data`; nhập dữ liệu dự án (`tools/import_staging.py` chỉnh sang site thật – chỉ khi được duyệt).
3. Permalink `/blog/%category%/%postname%/`, tiền tố chuyên mục `blog`; tắt "Loại bỏ cơ sở danh mục" của Rank Math
   (ghi `.htaccess` → duyệt riêng).
4. Nhập ma trận redirect (`data/url-map.csv`) vào Rank Math: `301` theo cột `url_moi`; `410` cho 43 trang ảnh không gắn bài
   (Rank Math → Chuyển hướng → "410 Content Deleted"); giữ nguyên các dòng "giữ nguyên".
5. Kích hoạt theme `velis`.
6. **Tắt Classic Editor**. Dự án, Chủ đầu tư, bài viết dùng block editor (plugin velis-data bật riêng cho 3 loại này, vì
   WPBakery đang bật "Disable Gutenberg Editor"); trang (page) vẫn WPBakery tới khi chuyển xong nội dung.
7. Tắt Buttonizer (thay bằng thanh CTA của theme).
7a. Tạo form Contact Form 7 "Velis – Nhận tư vấn" trên site thật (cùng trường như staging: your-name, your-phone, need, interest,
    note, consent) và gửi thử 1 lần; kiểm tra sự kiện `generate_lead` trong GA4 DebugView.
7b. Chạy `tools/copy_featured_images.py` phiên bản cho site thật (chỉ khi được duyệt) hoặc gắn ảnh đại diện dự án bằng tay.
7c. Gỡ font Merriweather khỏi Header and Footer Scripts (theme dùng 3 font riêng).
7d. Sau ra mắt chạy `tools/check_onpage.mjs` trên site thật: canonical chỉ kiểm được khi trang được index.
8. **Không** cài `velis-staging-guard` lên site thật.
9. Kiểm tra sau ra mắt: 32 URL có lượt nhấp GSC trả đúng đích 1 bước; sitemap không có trang noindex; Search Console gửi sitemap.

## Đã thử trên staging

| Bước | Kết quả |
|---|---|
| Tắt Classic Editor | 2026-11-04: Dự án / Chủ đầu tư / bài viết mở block editor; meta box lưu đúng (thử sửa 1 ô rồi kiểm tra REST) |
| Permalink + cụm blog | 2026-11-04: xem `docs/DATA-MODEL.md` |
| Trang phân khu / dòng thấp tầng | 35 URL dự án trả 200; 29 trang thiếu dữ liệu tự noindex |
