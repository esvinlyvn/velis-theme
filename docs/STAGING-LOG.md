# Nhật ký thay đổi trên STAGING (staging.velisrealty.vn)

Chỉ ghi thay đổi trên staging. Site thật không bị ghi.

## 2026-11-04 – Ngày 1, bước 1: khóa staging

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| siteurl / home | https://staging.velisrealty.vn | giữ nguyên | kiểm tra qua `/wp-json/` |
| REST + Application Password (user `claude-bot`, administrator) | chạy | chạy (kiểm lại sau khi khóa: `/wp/v2/users/me` 200) | — |
| Ngăn công cụ tìm kiếm (`blog_public=0`) | đã bật sẵn | giữ | wp-admin → Cài đặt đọc |
| Khóa trang bằng mật khẩu | không có (khách xem được toàn bộ) | Plugin **Password Protected 2.8.6** (wordpress.org): bật; cho phép administrator + user đã đăng nhập; **không** mở REST cho khách; feed bị chặn; nhớ 14 ngày | cài qua REST, cấu hình wp-admin; bỏ qua opt-in Freemius. Mật khẩu xem trang báo riêng, không lưu trong repo |
| WP Mail SMTP | gửi email bình thường | **Không gửi (Do Not Send)** bật | wp-admin → WP Mail SMTP → Linh tinh |
| Header and Footer Scripts | GA4 `G-QSJ8EH9CWB` (gtag.js), Pinterest `p:domain_verify`, font Merriweather, Facebook domain verification | còn font Merriweather + Facebook domain verification (không thuộc phạm vi yêu cầu) | wp-admin → Cài đặt → Header and Footer Scripts |
| LiteSpeed Cache | active | **inactive** (plugin tắt) | REST `/wp/v2/plugins` |
| UpdraftPlus lịch backup | Tệp: Thủ công, CSDL: Thủ công, không có lịch | giữ (đã tắt sẵn) | kiểm tra wp-admin |
| Rank Math Instant Indexing (IndexNow) | bật module | **tắt module** | REST `rankmath/v1/saveModule` |

Kiểm chứng (khách chưa đăng nhập):
- `/`, `/gioi-thieu/`, `/feed/` → 302 về form mật khẩu; `/wp-json/wp/v2/posts` → 401.
- `/robots.txt` và `/sitemap_index.xml` vẫn trả 200 (Rank Math phục vụ trước khi plugin khóa chạy; chỉ lộ danh sách URL staging, không lộ nội dung).
- `<meta name="robots" content="nofollow, noindex">` trên trang chủ staging.
- Không còn gtag/GTM/Pinterest trong HTML staging.
- WP Mail SMTP hiển thị "GỬI EMAIL BỊ TẮT". Lưu ý: trang "Email thử nghiệm" của plugin vẫn gửi được; đã thử 1 lần tới `velis-staging-test@example.com` (tên miền dành riêng, không nhận thư).

## 2026-11-04 – Ngày 1, bước 3: theme velis

| Mục | Trước | Sau |
|---|---|---|
| Theme | The7 14.4.5 (`dt-the7`) active | **velis 0.1.1** active (tải zip qua wp-admin → Giao diện → Thêm mới → Tải lên). The7 vẫn cài, kích hoạt lại được để quay lui |
| Trang style guide | — | Trang ID 20679 `/velis-style-guide/`, template "Style guide Velis"; noindex nhờ "Ngăn công cụ tìm kiếm" toàn staging (meta Rank Math riêng không ghi được qua REST) |

Ghi chú: nội dung cũ dựng bằng shortcode The7 (`[dt_default_button]`, `[dt_blog_masonry]`…) hiện hiển thị dạng chữ thô
trên staging vì The7 đã tắt; sẽ chuyển sang khối ở các ngày sau. Buttonizer (nút nổi Zalo/Gọi cũ) vẫn bật nên còn chồng
lên thanh CTA mới ở góc trái.
