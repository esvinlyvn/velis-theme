# Kế hoạch ra mắt (site thật velisrealty.vn)

Cập nhật 2026-11-10 (giai đoạn 5). Chỉ làm khi người dùng ra lệnh và chọn giờ (giai đoạn 6). Mọi bước ghi lên site thật cần
người dùng duyệt (CLAUDE.md); bước ghi `.htaccess` (permalink, LiteSpeed) duyệt riêng.

## Cần người dùng chọn trước

- **Cách đưa dữ liệu lên site thật.**
  - **A (đề xuất): chuyển CSDL staging → site thật.** Staging là bản sao site thật đã có đủ dự án, nội dung đã chuyển, cờ ảnh,
    cài đặt Rank Math, redirect – đã kiểm ở giai đoạn 5. Cần: so bài / trang / media mới phát sinh trên site thật sau ngày chụp
    (2026-11-04) và nhập lại sau khi chuyển; search-replace `https://staging.velisrealty.vn` → `https://velisrealty.vn`.
  - **B: cài plugin + chạy script nhập trên site thật** (`tools/import_staging.py`, `run_convert.py`… bản cho site thật). Ít đụng
    CSDL hơn nhưng nhiều bước hơn, chưa chạy thử trên site thật.
- **Giờ ra mắt:** chỉ có dữ liệu GSC theo ngày (`data/gsc/daily.csv`, 24/03–01/11/2026, không có theo giờ). Thứ Bảy thấp nhất
  (TB 1,4 lượt nhấp / 32 lượt hiển thị mỗi ngày; Thứ Hai 2,6 / 50). **Đề xuất: sáng Thứ Bảy, bắt đầu 7:00** – giờ cụ thể là giả
  định (chưa có dữ liệu theo giờ), người dùng xem GA4 → Báo cáo → theo giờ để chốt.
- **Thời gian site thật bị ảnh hưởng (ước lượng):** A ≈ 60–90 phút ở chế độ bảo trì (bước 3–8); B ≈ 2–3 giờ. Sau đó 1–2 ngày
  thứ hạng có thể dao động trong lúc Google đọc lại redirect.

## Làm mới dữ liệu (ngay trước ngày ra mắt, chỉ đọc)

Ma trận redirect và bản đồ từ khóa dựng từ ảnh chụp ngày 2026-11-04.
1. Đọc lại từ site thật (REST công khai + Rank Math → Chuyển hướng) → ghi đè `data/inventory/*`.
2. `python3 -I tools/build_url_map.py`, `python3 -I tools/build_keyword_map.py`, `python3 -I tools/build_rankmath_redirects.py`.
3. `npm run test:unit` phải xanh; test đỏ → xem lại, không sửa test cho xanh.
4. So `data/url-map.csv` mới với bản đã duyệt; URL mới phát sinh → báo người dùng trước khi nhập.

## Thứ tự thao tác ngày ra mắt

| # | Thao tác | Thời gian | Người làm | Quay lui (rollback) |
|---|---|---|---|---|
| 1 | **Sao lưu site thật**: UpdraftPlus thủ công (tệp + CSDL) + bản sao lưu của hosting; tải 1 bản về máy | 20–30 phút | người dùng (Claude hướng dẫn) | – (đây là điểm quay lui của mọi bước sau) |
| 2 | **Đọc lại redirect Rank Math** trên site thật, xuất CSV, so với `data/url-map.csv` | 10 phút | Claude (chỉ đọc) | – |
| 3 | Bật chế độ bảo trì; **đưa theme `velis` 1.0.0 + plugin `velis-data` 0.3.1 + dữ liệu** (A: chuyển CSDL + search-replace; B: script nhập) | A 30 phút · B 90 phút | Claude + hosting (A: quyền CSDL) | khôi phục bản sao lưu bước 1 (UpdraftPlus → Khôi phục), kích hoạt lại theme The7 |
| 4 | **Permalink** `/blog/%category%/%postname%/`, tiền tố chuyên mục `blog`; Rank Math tắt "Loại bỏ cơ sở danh mục" (ghi `.htaccess` – duyệt riêng) | 5 phút | Claude | đặt lại permalink cũ; `.htaccess` từ bản sao lưu |
| 5 | **Redirect**: Rank Math → Chuyển hướng → Nhập CSV (`tools/build_rankmath_redirects.py`, host `velisrealty.vn`), như đã làm trên staging (434 × 301, 43 × 410) | 10 phút | Claude | xóa nhóm redirect vừa nhập (Rank Math lọc theo ngày tạo) |
| 6 | **Tắt plugin cũ** (không xóa ngay): Classic Editor, WPBakery Page Builder, Ultimate Addons for WPBakery, Easy Table of Contents, Buttonizer, Header and Footer Scripts, Fast Velocity Minify, The7 CLI; Button Contact VR đã tắt | 10 phút | Claude | bật lại từng plugin |
| 7 | **LiteSpeed Cache**: cache trang cho khách + Browser Cache (như cấu hình hiện tại trên site thật), tối ưu ảnh / WebP bật, **không** gộp / trì hoãn JS (theme chỉ có 1 tệp JS, defer sẵn), CSS gộp tắt (theme 1 tệp); xóa toàn bộ cache | 15 phút | Claude | tắt LiteSpeed; `.htaccess` từ bản sao lưu |
| 8 | **Cho phép quét + canonical domain thật**: Cài đặt → Đọc bỏ "Ngăn công cụ tìm kiếm"; kiểm Địa chỉ WordPress / trang = `https://velisrealty.vn`; KHÔNG cài `velis-staging-guard`; robots.txt theo `docs/robots-ra-mat.txt`; tắt bảo trì | 10 phút | Claude | bật lại "Ngăn công cụ tìm kiếm" |
| 9 | **Kiểm ngay**: `python3 -I tools/check_redirects.py` + `node tools/check_sitemap.mjs https://velisrealty.vn out.csv` (0 lỗi), 32 URL có lượt nhấp, gửi thử form 1 lần + GA4 DebugView (mục GA4), Lighthouse 4 trang (LCP, NT-93) | 30 phút | Claude + người dùng (hộp thư, GA4) | theo lỗi: quay lui bước liên quan |
| 10 | **Search Console**: gửi `sitemap_index.xml`; Kiểm tra URL trang chủ + 1 dự án | 10 phút | người dùng | – |
| 11 | **Theo dõi 404 trong 4 tuần**: Search Console → Trang (Không tìm thấy) + Rank Math 404 Monitor; mỗi tuần thêm redirect cho URL lỗi có lượt truy cập | 15 phút / tuần | Claude + người dùng | – |
| 12 | Sau 2 tuần ổn định: xóa hẳn plugin đã tắt ở bước 6; giữ bản sao lưu bước 1 ít nhất 30 ngày | 10 phút | người dùng duyệt | – |

## Đã thử trên staging

| Bước | Kết quả |
|---|---|
| Tắt Classic Editor | 2026-11-04: Dự án / Chủ đầu tư / bài viết mở block editor; meta box lưu đúng (thử sửa 1 ô rồi kiểm tra REST) |
| Permalink + cụm blog | 2026-11-04: xem `docs/DATA-MODEL.md` |
| Trang phân khu / dòng thấp tầng | 35 URL dự án trả 200; 29 trang thiếu dữ liệu tự noindex |
