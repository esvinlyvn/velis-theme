# Bảo mật wp-admin (2026-11-26)

## Đã làm (staging + site thật)

| Việc | Kết quả |
|---|---|
| Plugin xác thực hai lớp | Two Factor 0.17.0 (nhóm WordPress) đã cài + kích hoạt. 2FA **chưa bật cho tài khoản nào**; mỗi người tự bật cho mình, xem hướng dẫn dưới |
| Chống dò mật khẩu | Limit Login Attempts Reloaded 3.4.8, cài đặt mặc định (khóa sau 4 lần sai) |
| XML-RPC | Tắt trong theme con (`xmlrpc_enabled` = false); máy chủ vốn đã chặn (403); không plugin nào cần (không Jetpack, không ứng dụng di động) |
| Tự cập nhật | Tắt cho Rank Math + Rank Math PRO; WordPress lõi chỉ tự cập nhật bản bảo trì / bảo mật; các plugin khác vẫn tắt |
| Mật khẩu ứng dụng | Mỗi site chỉ có 1 mật khẩu: của `claude-bot`, chính là mật khẩu đang dùng. `vu-xuan` không có mật khẩu nào. Không có gì để thu hồi |

**Công cụ của dev**
- REST bằng mật khẩu ứng dụng: vẫn chạy.
- `tools/wp_admin_login.mjs`: vẫn đăng nhập được sau khi cài 2 plugin.
- **KHÔNG bật 2FA cho `claude-bot`**: công cụ đăng nhập wp-admin không nhập được mã 2FA.

## Hướng dẫn tự bật 2FA cho tài khoản của anh/chị

1. Đăng nhập wp-admin bằng tài khoản của mình, vào **Tài khoản → Hồ sơ** (`/wp-admin/profile.php`).
2. Kéo xuống mục **Two-Factor Options** (Tùy chọn xác thực hai lớp).
3. Đánh dấu **Authenticator App** (Ứng dụng xác thực).
4. Mở ứng dụng Google Authenticator / Microsoft Authenticator / 1Password trên điện thoại, quét mã QR trên màn hình.
5. Nhập mã 6 số đang hiện trong ứng dụng vào ô xác nhận, bấm **Submit / Xác minh**.
6. Đánh dấu thêm **Backup Verification Codes** (Mã dự phòng), bấm **Generate Verification Codes**. In hoặc lưu 10 mã này ở nơi an toàn: dùng khi mất điện thoại.
7. Kéo xuống cuối trang, bấm **Cập nhật hồ sơ**.
8. Thử: đăng xuất rồi đăng nhập lại. Sau mật khẩu, màn hình sẽ hỏi mã 6 số.

Mất điện thoại và hết mã dự phòng: nhờ người có quyền quản trị khác tắt 2FA cho tài khoản đó ở **Tài khoản → Sửa → Two-Factor Options**.

## Khóa trình sửa tệp (người dùng chạy trong Terminal của hosting)

Lệnh nằm trong báo cáo, mục "Lệnh Terminal". Lệnh thêm `define('DISALLOW_FILE_EDIT', true);` vào `wp-config.php` của site thật và staging, có sao lưu trước và có lệnh trả lại.
