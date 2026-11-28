# Báo cáo – gói ra mắt "bật công tắc" (2026-11-25)

Hướng dẫn cho người dùng: `docs/the7/GOI-RA-MAT.md`. **Chưa ra mắt.** Site thật chỉ đọc (REST GET, HEAD, trang công khai); staging chỉ xuất
dữ liệu (UpdraftPlus "Sao lưu ngay" – chỉ CSDL, 11:29), không đổi cài đặt nào.

| Mục | Kết quả |
|---|---|
| 1. Rank Math noindex trang tìm kiếm | đã bật sẵn trên staging (`noindex_search = on`) → không sửa; gói thử: `/?s=` `follow, noindex` |
| 2. `vl2.sql.gz` | 4,7 MB (27 MB giải nén), 46 bảng `vl2_`; đổi tiền tố 167 định danh + 13 khóa + 1 ràng buộc khóa ngoại; 8 836 chuỗi staging thay (22 serialized, 1 139 serialized hợp lệ trước = sau); sửa sẵn 10 cài đặt (`tools/the7_sua_ra_mat.php`); `the7_kiem_goi_sql.py` ĐẠT; grep `DROP/TRUNCATE/ALTER` + `velis_` = **0** |
| 2. Thử nhập | cạnh bộ `velis_`: 46/46, checksum `velis_` không đổi; WordPress 7.1.5 + Rank Math chạy, đăng nhập admin được, robots / noindex / mã theo dõi / sitemap / chuyển hướng đúng |
| 3. Tệp | plugin: 0 cần chép (cùng phiên bản); theme con `dt-the7-child` 1.9.1; uploads: 35 media + 11 cỡ ảnh cắt sẵn; **`uploads/the7-css/` khác nội dung** (site thật: CSS theme cha; `css-vars.css` staging có 1 URL staging) → thay lúc bật + The7 Theme Options "Lưu" để sinh lại; sao lưu bản cũ để quay lui |
| 4. `tools/the7_kiem_ra_mat.py` | in ĐẠT / TRƯỢT theo nhóm; `--ghi-moc` ghi mã HEAD 7 ứng dụng ngay trước khi bật; chạy với site thật hôm nay 26 s – trượt đúng các mục của giao diện mới (site thật còn bản cũ) |

## Phát hiện

- Site thật có **2 quản trị: `admin` và `claude-bot`** (claude-bot đăng ký 2026-11-03). Yêu cầu "không có claude-bot" + "giữ 2 tài khoản như site thật"
  không cùng đạt được → gói theo ý "không có claude-bot" (còn 1 quản trị); `--giu-user` dựng bản giữ cả hai.
- `/meta-check/` và `/meta-check.zip`: HEAD **404** hôm nay (mốc 2026-11-14: 200).
- `/blog/` noindex: cài Rank Math riêng của chuyên mục blog, đã có trên site thật (`/blog-bds/` hôm nay noindex) – giữ nguyên, hỏi người dùng.
- Site thật: 0 bài / trang / media / bình luận mới từ 2026-11-11 (REST, 2026-11-25).

11 cỡ ảnh cắt sẵn chỉ có trên staging (trang mẫu yêu cầu, site thật 404):
```
uploads/2026/03/phoi-canh-persa-place-3-768x576.webp
uploads/2026/03/phoi-canh-spring-ville-728x546.webp
uploads/2026/03/phoi-canh-spring-ville-768x532.webp
uploads/2026/04/can-ho-the-prive-768x532.webp
uploads/2026/04/can-ho-the-prive-768x576.webp
uploads/2026/04/the-global-city-3-1-768x532.webp
uploads/2026/04/the-global-city-3-1-768x576.webp
uploads/2026/04/vi-tri-ansana-by-kita-768x532.webp
uploads/2026/04/vi-tri-ansana-by-kita-768x576.webp
uploads/2026/05/vinhomes-saigon-park-768x576.webp
uploads/2026/06/palm-city-768x576.webp
```

Đã bỏ qua / chưa kiểm tra: giao diện The7 với bộ `vl2_` chỉ kiểm trên staging (bản thử cục bộ không có The7); phpMyAdmin của hosting chưa thử nhập; 7 ứng dụng chưa xác nhận nơi lưu dữ liệu.
