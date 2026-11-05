# Số liệu dự án tham khảo (comparables)

Quy tắc: `content/guide/rules.md` mục 12. Mỗi file `<du-an>.csv` là bộ số liệu **đã được người dùng duyệt** của các dự án tham khảo
cho dự án `<du-an>` (slug trong `data/architecture/projects.csv`, ví dụ `the-prive.csv`). Bài chỉ lấy số từ đây; mọi trang dùng cùng số.

Cột (mẫu `_mau.csv`):

| Cột | Ý nghĩa |
|---|---|
| `du_an_tham_khao` | Tên dự án tham khảo (nhắc trong bài, không link) |
| `khu_vuc` | Phường/xã mới, khu vực thị trường |
| `trang_thai` | đã bàn giao / đang khai thác (bắt buộc có người thuê) |
| `loai_can` | 1 PN, 2 PN, 3 PN, penthouse… |
| `dien_tich_m2` | Diện tích, ghi rõ thông thủy hay tim tường trong `ghi_chu` |
| `chi_so` | `gia_thue` · `ty_le_lap_day` · `phi_quan_ly` · `gia_ban_thu_cap_m2` |
| `gia_tri` | Số, hoặc khoảng `a–b` |
| `don_vi` | triệu đồng/tháng · % · nghìn đồng/m²/tháng · triệu đồng/m² |
| `thoi_diem` | Tháng/năm của số liệu |
| `nguon` | Ai cung cấp/nguồn công khai (không ghi dữ liệu khách hàng) |
| `ngay_nhap` | Ngày người dùng duyệt |
| `ghi_chu` | Giả định, cách đo |
