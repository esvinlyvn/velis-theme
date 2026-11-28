# Chuyển nội dung – giai đoạn 4

Ngày 2026-11-04 · staging. Chỉ chuyển định dạng, giữ nguyên câu chữ (không viết lại, không thêm/bớt ý, không sửa tính chính xác).

## 1. Chuyển WPBakery → khối WordPress

| | Số lượng |
|---|---|
| Bài/trang đã chuyển | 133 (bài đăng 102 + bài nháp 12 + bài trụ cột 7; trang chính 5; trang cũ không hiển thị 7) |
| Lệch số từ > 1% | 0 (lớn nhất 0,11%) |
| Tổng số từ trước → sau | 225560 → 225555 |
| Ảnh / link / link đổi sang URL mới / heading / hỏi-đáp | 247 / 585 / 430 / 1036 / 63 |
| Shortcode `[vc_` `[ult_` `[dt_` còn sót | 0 (trừ trang tài liệu riêng tư 20543 – quy tắc không đụng) |

Chi tiết từng bài: `data/content-conversion.csv`. Hai bài lệch khác 0 không do mất chữ: chữ bị thẻ in đậm cắt đôi trong bản gốc được nối lại (`triệu /m2` → `triệu/m2`, `x em` → `xem`).

Quy tắc: đậm/nghiêng, link, ảnh (alt, chú thích), bảng, danh sách giữ nguyên; gạch đầu dòng gõ tay → danh sách; Easy TOC bỏ; YouTube → khối nhúng bấm mới tải; Google Maps → ảnh bản đồ tĩnh văn phòng + link Google Maps; H1 trong bài → H2, không nhảy cấp (chữ heading không đổi). Ảnh `phoi-canh-masteri-cosmo-1-1024x576.webp` (bài The Global City) 404 cả trên site thật → bỏ.

## 2. Bài trụ cột → trang dự án

Chữ của 7 bài trụ cột vào nội dung 7 bản ghi dự án; template chia theo H2 vào ô: Tổng quan (mở đầu + mục không khớp ô nào), Dòng sản phẩm, Giá, Mặt bằng, Phân khu, Tiến độ, Vị trí, Tiện ích, Góc nhìn CEO, Chủ đầu tư, Hỏi đáp, Bài viết liên quan. H2 gốc làm tiêu đề ô (không đổi chữ). Kiểm: tổng số từ các ô = số từ bài (test `components-test.php` + chạy trên 7 bài thật). 7 bài trụ cột chuyển nháp (URL cũ 301 về trang dự án khi ra mắt).

Noindex: 8 phân khu nhận ảnh nằm dưới mục của chính phân khu trong bài trụ cột → Masteri Grand View, Lumière Midtown, Masteri Park Place đủ dữ liệu và **được index**. Còn noindex **25/29** (9 phân khu + 16 dòng thấp tầng) – danh sách và lý do: `docs/AUDIT-NOI-DUNG.md`.

## 3. Title/meta viết tay

33 title > 60 và 69 meta > 155 ký tự rút gọn bằng **cắt bớt** (meta: bỏ câu cuối; còn lại xóa vài chữ). Test `test_shorten_meta.py` kiểm mọi dòng chỉ xóa chữ và đủ giới hạn. Trước → sau: `data/title-meta-changes.csv`.

Title giữ cụm từ khóa chính (keyword-map) khi bản gốc có: 15/23; 8 title không giữ được nguyên cụm (phần lớn là từ khóa nháp lấy từ tiêu đề) mà không cắt mất ý – cột `con_tu_khoa` = "mất".

## 4. Plugin đã tắt trên staging

WPBakery Page Builder, Ultimate Addons for WPBakery, Easy Table of Contents, Header and Footer Scripts (Buttonizer đã tắt từ trước). Mã cần giữ (GA4 `G-QSJ8EH9CWB`, xác minh Pinterest + Facebook) theme tự in, chỉ trên `velisrealty.vn` – `docs/KE-HOACH-RA-MAT.md` mục 7c.

## 5. Kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| On-page toàn staging | 173 trang · lỗi template 0 · lỗi nội dung 0 · link hỏng 0 (`onpage-giai-doan-4.md`) |
| Ảnh | 191 trang · 899 URL ảnh (src, mọi cỡ srcset, og:image) · lỗi 0 (`anh-giai-doan-4.md`) |
| Schema | 20 trang · 0 lỗi · 0 cảnh báo (`schema-giai-doan-4.md`) |
| Lighthouse mobile | perf 97–99 · a11y 100 · JS 14 KB · CSS 43 KB · 3 font (`lighthouse-giai-doan-4.md`) |
| 12 khung (360 → 1920) | 33/33 trang sạch (bảng dưới) |

| Trang | 12 khung sạch |
|---|---|
| /blog/palm-city/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/ | 12/12 |
| /blog/ansana-by-kita/he-thong-tien-ich-ansana-by-kita-one-stop-living-hub/ | 12/12 |
| /blog/palm-city/danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/ | 12/12 |
| /blog/spring-ville/thiet-ke-biophilic-persa-place-thu-hut-gioi-tri-thuc/ | 12/12 |
| /blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/ | 12/12 |
| /blog/the-prive/velis-realty-phan-phoi-doc-quyen-thap-9-the-prive/ | 12/12 |
| /blog/vinhomes/vinhomes-smart-city-hay-big-brother-quyen-rieng-tu-cua-cu-dan-o-dau/ | 12/12 |
| /blog/vinhomes-saigon-park/tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/ | 12/12 (chạy lại sau khi sửa nút tràn 360px) |
| /blog/the-prive/loi-suat-cho-thue-the-prive/ | 12/12 |
| /blog/vinhomes-saigon-park/thiet-ke-cong-nang-nha-pho-lien-ke-vinhomes-saigon-park/ | 12/12 (chạy lại sau khi sửa nút tràn 360px) |
| /blog/vinhomes/vinfast-tram-sac-cu-hich-hay-ganh-nang-cho-bds-vinhomes-2026/ | 12/12 |
| /blog/vinhomes/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/ | 12/12 |
| /blog/the-global-city/bi-an-dong-von-trieu-do-the-global-city/ | 12/12 |
| /blog/spring-ville/he-tien-ich-can-ho-spring-ville-co-du-cho-nhu-cau-song-hang-ngay-khong/ | 12/12 |
| /blog/palm-city/huong-viet-holdings-la-ai/ | 12/12 |
| /blog/spring-ville/kiem-chung-thuc-te-ban-giao-gamuda-land-persa-place/ | 12/12 |
| /blog/spring-ville/giai-ma-khoang-cach-persa-place-tphcm/ | 12/12 |
| /blog/spring-ville/persa-place-tang-gia-khi-van-hanh-san-bay-long-thanh/ | 12/12 |
| /blog/the-global-city/bi-quyet-chia-nho-mat-bang-shophouse-soho/ | 12/12 |
| /blog/the-global-city/dinh-thu-the-global-city-tam-the-dac-quyen/ | 12/12 |
| /du-an/the-prive/ | 12/12 |
| /du-an/vinhomes-saigon-park/ | 12/12 |
| /du-an/the-global-city/ | 12/12 |
| /du-an/palm-city/palm-river/ | 12/12 |
| /du-an/spring-ville/ | 12/12 |
| /du-an/spring-ville/persa-place/ | 12/12 |
| /du-an/ansana-by-kita/ | 12/12 |
| / | 12/12 |
| /gioi-thieu/ | 12/12 |
| /lien-he/ | 12/12 |
| /tuyen-dung/ | 12/12 |
| /chinh-sach-bao-mat/ | 12/12 |
| /dieu-khoan-su-dung/ | 12/12 |

Ảnh 390 và 1366 của 20 bài mẫu + The Privé: `screenshots/phase4/`; báo cáo từng trang: `screenshots/phase4/*-report.md`.
