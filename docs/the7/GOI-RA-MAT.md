# Gói ra mắt "bật công tắc" – velisrealty.vn (bản The7)

Soạn 2026-11-25. Kế hoạch gốc: `docs/KE-HOACH-RA-MAT.md` (dựng song song bộ bảng `vl2_` cạnh bộ `velis_` đang chạy, chuyển site = đổi 1 dòng
`$table_prefix`). **Người dùng tự làm** mọi bước ghi lên site thật qua cPanel; Claude chỉ đọc site thật và chạy kiểm.
**Chưa ra mắt** – làm khi người dùng ra lệnh.

## 1. Thành phần gói

| Thứ | Ở đâu | Ghi chú |
|---|---|---|
| `vl2.sql.gz` (4,7 MB, 27 MB khi giải nén) | đã gửi riêng cho người dùng trong phiên Claude (tệp đính kèm); **không** nằm trong repo | chứa mật khẩu đã băm, cấu hình gửi mail – không chuyển tiếp, xóa khỏi máy sau khi nhập |
| Mã bảo mật form The7 mới | tệp `ma-bao-mat-form-the7.txt` gửi kèm; đã nằm sẵn trong SQL | chỉ để lưu; không dán vào đâu |
| Theme con `dt-the7-child` 1.9.1, tệp uploads mới | đã có trên hosting: `/home/gdssxvdn/staging/wp-content/…` | chép bằng lệnh ở mục 3 |
| Công cụ dựng lại gói | `tools/the7_dong_goi_ra_mat.sh` (gọi `the7_doi_tien_to.py` → `the7_sua_ra_mat.php` → `the7_kiem_goi_sql.py`) | nếu sửa staging sau 2026-11-25 11:29 phải **xuất và đóng gói lại** (≈ 10 phút) |
| Công cụ kiểm sau khi bật | `tools/the7_kiem_ra_mat.py` | mục 6 |

### Gói đã sửa sẵn trong file SQL (so với staging)

| Cài đặt | Staging | Trong `vl2.sql.gz` |
|---|---|---|
| Tên miền | staging.velisrealty.vn | velisrealty.vn ở mọi dạng (thường, serialized, `\/`, mã hóa URL, base64); đường dẫn `/home/gdssxvdn/staging` → `public_html`. Quét lại: **0** |
| Tiền tố | `velis_` | `vl2_` – 46 bảng, khóa quyền `vl2_user_roles`, `vl2_capabilities`, `vl2_user_level`…, ràng buộc khóa ngoại `vl2_…` |
| Cài đặt → Đọc | Ngăn công cụ tìm kiếm | `blog_public = 1` |
| robots.txt (Rank Math) | Disallow: / (Velis Staging Guard) | `docs/robots-ra-mat.txt` (giống robots.txt site thật hôm nay) |
| Trang kết quả tìm kiếm | noindex (đã bật sẵn trên staging) | noindex |
| Plugin chạy | 19 (có Password Protected, Velis Staging Guard) | 17 – bỏ 2 plugin trên; Buttonizer vẫn tắt (đã chốt) |
| Rank Math IndexNow | tắt (ngày 1) | bật lại như site thật (khóa IndexNow cũ giữ nguyên) |
| WP Mail SMTP | "Không gửi" bật | tắt "Không gửi"; mailer Gmail SMTP velisrealtyvn@gmail.com sẵn có (bản sao từ site thật) giữ nguyên |
| Header and Footer Scripts | chỉ Facebook | Pinterest `p:domain_verify`, GA4 `G-QSJ8EH9CWB`, Facebook – giống site thật (`data/the7/ra-mat/header-scripts.html`). Bỏ dòng font Merriweather của giao diện cũ |
| The7 – mã bảo mật form | mã của staging | mã mới (cả `the7` và `the7velischild`) |
| Người dùng | admin, claude-bot | **chỉ `admin`** (theo yêu cầu): 452 bài / tệp / mục menu của claude-bot chuyển sang admin. Site thật hiện có 2 quản trị (admin, claude-bot) – muốn giữ claude-bot: đóng gói lại với `--giu-user` |
| Bộ nhớ đệm thông báo bản quyền The7 (`the7_feature_access`) | có tên miền staging (base64) | bỏ – The7 tự tải lại |

Không đổi: nội dung, menu, widget, form CF7 (người nhận velisrealtyvn@gmail.com), chuyển hướng Rank Math (14 quy tắc đang bật),
LiteSpeed (bộ nhớ đệm bật), FVM. Trang `/blog/` giữ **noindex** như chuyên mục blog trên site thật (cài trong Rank Math của chuyên mục) –
muốn lập chỉ mục: Bài viết → Chuyên mục → Blog → Rank Math → Robots.

### Đã kiểm (2026-11-25, trên máy làm việc – MariaDB 10.11, WordPress 7.1.5)

| Kiểm | Kết quả |
|---|---|
| `tools/the7_kiem_goi_sql.py` | ĐẠT: 46 `DROP TABLE IF EXISTS` + 46 `CREATE TABLE` + 50 `INSERT`, **đều `vl2_`**; 0 câu `DROP/TRUNCATE/ALTER` đụng `velis_` (grep riêng: 0); 0 `ALTER`, 0 `TRUNCATE`, 0 `LOCK`; 0 chuỗi staging ở mọi dạng |
| Nhập cạnh bộ `velis_` (bản staging gốc đóng vai site thật) | 46/46 bảng `vl2_`; checksum 46 bảng `velis_` trước = sau |
| WordPress chạy với `$table_prefix = 'vl2_'` | trang chủ 200 `index`; dự án, /du-an/, /lien-he/ `index`; `/?s=` `follow, noindex`; robots.txt đúng bản ra mắt; sitemap_index 200; `/blog-bds/palm-city/` 301 → `/blog/palm-city/`; GA4 + Pinterest + Facebook có trong `<head>`; 0 chuỗi "staging." |
| Đăng nhập | wp-admin vào được với tài khoản `admin`, vai Quản trị (mật khẩu thử đặt **chỉ trong CSDL thử** trên máy làm việc) |
| Giới hạn | bản thử không có The7 (theme trả phí) → giao diện hiển thị bằng Twenty Twenty-Five; giao diện thật đã kiểm trên staging |

## 2. Trước ngày bật (site thật chưa đổi gì)

1. **Đóng băng nội dung** từ lúc xuất (2026-11-25 11:29): không đăng / sửa bài, trang, media, chuyển hướng trên **cả hai** site.
   So sánh lúc xuất: site thật **0** bài / trang / media / bình luận mới từ 2026-11-11. Sửa staging sau giờ này → đóng gói lại.
2. **Sao lưu site thật**: UpdraftPlus → Sao lưu ngay (tệp + CSDL) **và** cPanel → Backup → tải bản sao lưu CSDL về máy; mở thử được.
3. **Chép tệp** (mục 3, lệnh A) – chỉ thêm tệp mới, không ghi đè, không ảnh hưởng site đang chạy.
4. **Nhập `vl2.sql.gz`**: cPanel → phpMyAdmin → bấm tên CSDL của site thật (trong `public_html/wp-config.php`, dòng `DB_NAME`) →
   tab **Nhập (Import)** → Chọn tệp `vl2.sql.gz` → bấm **Thực hiện (Go)**. Không cần chia file (4,7 MB < giới hạn tải lên của phpMyAdmin, thường 50 MB –
   xem dòng "Kích thước tối đa" ngay dưới ô chọn tệp). Kiểm ở tab SQL:
   ```sql
   SELECT SUM(table_name LIKE 'vl2\_%') AS vl2, SUM(table_name LIKE 'velis\_%') AS velis
   FROM information_schema.tables WHERE table_schema = DATABASE();
   ```
   Đúng: `vl2 = 46`, `velis` = số cũ (46). Nhập lỗi giữa chừng: nhập lại cùng tệp (tệp tự xóa `vl2_*` cũ trước khi tạo – không đụng `velis_*`).
5. Báo Claude → Claude ghi mốc 7 ứng dụng: `python3 -I tools/the7_kiem_ra_mat.py --ghi-moc` (chỉ HEAD).

## 3. Chép tệp

Đường dẫn: staging `/home/gdssxvdn/staging`, site thật `/home/gdssxvdn/public_html`.

| Thứ | Staging | Site thật | Việc |
|---|---|---|---|
| Theme con `dt-the7-child` | 1.9.1 | chưa có | chép thư mục |
| Theme cha `dt-the7` | 14.5.1 | 14.5.1 | không |
| Plugin | 19 thư mục | cùng tên + **cùng phiên bản** (so REST 2026-11-25) | **không chép plugin nào**; không chép `password-protected`, `velis-staging-guard` |
| Uploads | 245 media | 233 media | 35 tệp media mới (danh sách dưới) + 11 cỡ ảnh cắt sẵn (webp) chỉ có trên staging → chép **cả thư mục ở chế độ không ghi đè** |
| `uploads/the7-css/` (CSS The7 sinh ra) | theo Theme Options của theme con | **cùng tên, khác nội dung** (CSS theme cha) | thay **lúc bật** (lệnh B), sao lưu bản cũ để quay lui |

**Lệnh A** – cPanel → Nâng cao → **Terminal**, dán một lần (trước ngày bật):
```bash
cd /home/gdssxvdn && cp -an staging/wp-content/themes/dt-the7-child public_html/wp-content/themes/ && cp -an staging/wp-content/uploads/. public_html/wp-content/uploads/ && cp -an staging/wp-content/languages/. public_html/wp-content/languages/ && cp -a public_html/wp-content/uploads/the7-css public_html/wp-content/uploads/the7-css-velis-truoc && echo XONG
```
`-n` = không ghi đè tệp đã có. Kiểm: `ls public_html/wp-content/themes/` có `dt-the7-child`; `ls public_html/wp-content/uploads/2026/11/ | grep -c velis-logo` ≥ 15.

**Lệnh B** – ngay sau khi sửa `$table_prefix` (bước 5 mục 4):
```bash
cd /home/gdssxvdn && cp -a staging/wp-content/uploads/the7-css/. public_html/wp-content/uploads/the7-css/ && echo XONG
```

**Không có Terminal** (Trình quản lý tệp): (1) `staging/wp-content/themes` → chọn `dt-the7-child` → **Sao chép** → đích
`/public_html/wp-content/themes`; (2) `staging/wp-content/uploads/2026/11` → chọn hết → Sao chép → đích `/public_html/wp-content/uploads/2026/11`
(Trình quản lý tệp **ghi đè** tệp trùng tên – trong thư mục này chỉ là cùng ảnh; 11 cỡ ảnh cắt sẵn ở 2026/03–06 không chép được theo cách này,
The7 có thể tự cắt lại khi trang được mở – chưa kiểm chắc → nên dùng Terminal); (3) đổi tên `public_html/wp-content/uploads/the7-css` thành
`the7-css-velis-truoc` **chỉ khi bật**, rồi Sao chép `staging/wp-content/uploads/the7-css` sang `public_html/wp-content/uploads/`.

35 tệp media chỉ có trên staging (đường dẫn từ `wp-content`; mỗi tệp có cả bản ở `/home/gdssxvdn/staging/wp-content/…`):
```
uploads/2026/11/doi-tac-gamuda-land{,-150x128,-300x96}.webp
uploads/2026/11/doi-tac-masterise-homes{,-150x128,-300x96}.webp
uploads/2026/11/doi-tac-sun-group{,-150x128,-300x96}.webp
uploads/2026/11/doi-tac-vinhomes{,-150x128,-300x96}.webp
uploads/2026/11/velis-logo-36{,-150x36}.png
uploads/2026/11/velis-logo-44{,-150x44}.png
uploads/2026/11/velis-logo-72{,-150x72,-300x69}.png
uploads/2026/11/velis-logo-88{,-150x88,-300x69}.png
uploads/2026/11/velis-logo-trang-40{,-150x40}.png
uploads/2026/11/velis-logo-trang-80{,-150x80,-300x69}.png
uploads/2026/11/velis-og-mac-dinh-1200x630-1{,-1024x538,-150x150,-300x158,-768x403}.png
uploads/2026/11/velis-site-icon-512{,-150x150,-300x300}.png
```
Cỡ ảnh cắt sẵn chỉ có trên staging (trang mẫu yêu cầu, site thật trả 404) – ví dụ `uploads/2026/04/can-ho-the-prive-768x532.webp`,
`…-768x576.webp`, `uploads/2026/03/phoi-canh-spring-ville-728x546.webp` (đủ 11 tệp trong báo cáo `docs/reports/the7-goi-ra-mat.md`; tìm được từ 11 trang mẫu × 2 khung, có thể còn cỡ khác ở trang ít xem – lệnh A chép hết).

## 4. Bật công tắc (≈ 5 phút)

1. Claude: chạy lại so sánh nội dung mới (chỉ đọc) – phải là 0.
2. Trình quản lý tệp → `public_html/wp-config.php` → **Tải về** (bản dự phòng) → **Sửa**: dòng `$table_prefix = 'velis_';` → `$table_prefix = 'vl2_';` → Lưu.
   Không đổi dòng nào khác.
3. Terminal: **lệnh B** (CSS The7).
4. Đăng nhập `https://velisrealty.vn/wp-login.php` bằng **admin** (mật khẩu admin như lúc tạo staging) →
   **The7 → Theme Options → Lưu tùy chọn** (không đổi gì – The7 tạo lại CSS với tên miền thật).
5. Thanh quản trị: **LiteSpeed Cache → Xóa tất cả (Purge All)**; **FVM → Clear Cache**. Không mở / lưu trang cài đặt LiteSpeed
   (có thể ghi `.htaccess`). CDN / Cloudflare (nếu có): xóa cache.

## 5. Kiểm trong 15 phút

- Claude: `python3 -I tools/the7_kiem_ra_mat.py --ung-dung-chuan` – in **ĐẠT / TRƯỢT** từng nhóm: robots.txt; 10 trang mẫu (200, meta robots +
  X-Robots-Tag không noindex – riêng `/blog/` noindex là cài đặt có sẵn, chỉ ghi chú; 0 "staging."); sitemap_index + sitemap con;
  34 URL có lượt nhấp Search Console (200 hoặc 1 bước 301); 17 URL mẫu phủ cả 14 quy tắc chuyển hướng đang bật; 7 ứng dụng + `meta-check.zip`
  HEAD đúng mã đã ghi ở bước 2.5 (bình thường: 200; `/check-can-the-prive/` 405 vì không nhận HEAD; `/lucky-lead/` 302 về trang đăng nhập).
  Chạy thử với site thật hôm nay (bản cũ): 26 giây; trượt đúng các mục của giao diện mới (chưa có /chu-dau-tu/, chuyển hướng /blog-bds/…).
- Người dùng: mở từng ứng dụng, dữ liệu đúng; gửi 1 form → thư về velisrealtyvn@gmail.com; GA4 → Realtime có lượt xem;
  xem trang chủ, 1 dự án, 1 bài trên điện thoại + máy tính.
- **Bất kỳ mục nào trượt → quay lui ngay.**

## 6. Quay lui (≈ 3 phút)

1. `wp-config.php`: `$table_prefix = 'vl2_';` → `'velis_'` → Lưu.
2. Terminal: `cd /home/gdssxvdn/public_html/wp-content/uploads && cp -a the7-css-velis-truoc/. the7-css/ && echo XONG`
3. Xóa cache LiteSpeed + FVM. Bộ `velis_` và mọi tệp cũ không bị đụng → site cũ trở lại nguyên trạng. Tệp mới chép thêm vô hại.

## 7. Sau khi ổn

Search Console: gửi `sitemap_index.xml`, Kiểm tra URL trang chủ / `/blog/` / 1 dự án. LiteSpeed → QUIC.cloud: nếu báo khóa sai tên miền,
liên kết lại (duyệt riêng – có thể ghi `.htaccess`). UpdraftPlus: đặt lịch sao lưu. Xóa bài nháp thử 21008. Giữ bộ `velis_` ≥ 30 ngày.
Theo dõi 4 tuần theo `docs/KE-HOACH-RA-MAT.md` bước 8.

## Điểm chưa chắc

- Mật khẩu `admin` trong gói là bản từ lúc tạo staging (site thật không đọc được mật khẩu) – nếu đã đổi trên site thật sau đó, dùng mật khẩu cũ
  hoặc "Quên mật khẩu" (thư về velisrealtyvn@gmail.com).
- `/meta-check/` và `/meta-check.zip` trên site thật hôm nay trả **404** (mốc 2026-11-14: 200) – người dùng xác nhận đã gỡ chủ đích.
- 7 ứng dụng: nơi lưu dữ liệu chưa xác nhận (A/B/C trong `docs/KE-HOACH-RA-MAT.md`) – cần trước khi bật.
