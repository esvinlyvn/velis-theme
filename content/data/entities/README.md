# Chủ đầu tư / đơn vị phát triển theo dự án

**BẢN NHÁP 2026-11-05.** Quy tắc: `content/guide/rules.md` mục 13. Lập từ những gì site velisrealty.vn đang ghi (REST công khai, chỉ đọc);
không dùng dữ liệu site đối thủ. Một dòng một dự án/phân khu.

| Cột | Ý nghĩa |
|---|---|
| `du_an` | slug trong `data/architecture/projects.csv` |
| `ten_thi_truong` | Tên thương hiệu dự án dùng để marketing; tên hiển thị ở mọi nơi |
| `so_huu_cong_ty_du_an` | Thương hiệu có sở hữu/chi phối công ty dự án: `Có` · `Không` · `Chưa xác minh` |
| `chu_dau_tu_hien_thi` | Có hoặc Chưa xác minh → thương hiệu; Không → bên sở hữu |
| `don_vi_phat_trien` | Chỉ điền khi `so_huu_cong_ty_du_an` = Không (thương hiệu) |
| `phap_nhan` | Pháp nhân ký hợp đồng mua bán; chỉ hiện ở mục pháp lý trang dự án và `legalName` khi đã có nguồn |
| `thuoc_tap_doan` | Thương hiệu/tập đoàn của pháp nhân, dùng trong câu "(thuộc …)" |
| `nguon`, `ngay` | Văn bản xác minh (giấy phép, quyết định chủ trương, hợp đồng mẫu, công bố doanh nghiệp) và ngày |
| `uu_tien_kiem_tra` | `Cao` khi có mâu thuẫn hoặc nghi không sở hữu; `Trung bình` khi chỉ thiếu nguồn |
| `ghi_chu` | Site đang ghi gì, ở đâu |
