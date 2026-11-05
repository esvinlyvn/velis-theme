# Thực thể và vai trò (chủ đầu tư / đơn vị phát triển)

**BẢN NHÁP 2026-11-05.** Lập từ những gì site velisrealty.vn đang ghi (đọc REST công khai, chỉ đọc). Mọi dòng đang **"Chưa xác minh"**:
theo `content/guide/rules.md` mục 13, chưa được viết về vai trò nào cho tới khi người dùng xác nhận. Không thêm dữ liệu từ site đối thủ.

| Cột | Ý nghĩa |
|---|---|
| `du_an` | slug trong `data/architecture/projects.csv` |
| `vai_tro` | `chu_dau_tu` (chỉ pháp nhân pháp lý) · `don_vi_phat_trien` (thương hiệu) |
| `to_chuc` | Tên đầy đủ: pháp nhân ghi đủ loại hình (Công ty TNHH/CP …); thương hiệu ghi tên thương hiệu |
| `loai_to_chuc` | `phap_nhan` · `thuong_hieu` · `tap_doan` |
| `thuoc_tap_doan` | Tập đoàn mẹ → schema `parentOrganization` |
| `ten_ngan` | Tên ngắn dùng từ lần nhắc thứ hai trong bài |
| `trang_thai` | `Đã xác minh` (kèm nguồn văn bản) · `Chưa xác minh` |
| `nguon_hien_co` | Site đang ghi gì, ở đâu (để đối chiếu khi xác minh) |
| `ghi_chu` | Mâu thuẫn, việc cần làm |

Khi xác minh: đổi `trang_thai` thành `Đã xác minh`, điền nguồn (giấy phép, quyết định chủ trương đầu tư, công bố của doanh nghiệp) và ngày vào `ghi_chu`.
