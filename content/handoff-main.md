# Việc cần làm trên nhánh main (ngoài `content/`)

Nhánh `content` **không tự làm** các việc này, chỉ ghi lại. Từ 2026-11-05, mỗi khi phát hiện việc cần làm ngoài `content/`, ghi thêm vào đây
thay vì hỏi người dùng (`content/guide/rules.md` mục 14). Mỗi mục: việc, file, lý do/nguồn quyết định, trạng thái.

## Người dùng giao 2026-11-05

| # | Việc | File | Căn cứ | Trạng thái |
|---:|---|---|---|---|
| 1 | Bỏ quy tắc `[XN-n]`, thay bằng "chỉ dùng số liệu được cung cấp, thiếu thì hỏi trước khi viết". Bỏ "chỉ dùng tình huống có thật", thay bằng "được viết trải nghiệm ngôi thứ nhất của anh Xuân, không mâu thuẫn dữ kiện". Thêm: cấm dấu gạch dài (—), câu trung bình 15–20 từ, tối đa 30 từ | `docs/VOICE.md` | `rules.md` mục 5, 6, 11 | Chờ |
| 2 | Giữ cột `chu_dau_tu` (tên thương hiệu thị trường); thêm cột `phap_nhan` và `don_vi_phat_trien` (chỉ điền khi khác chủ đầu tư) | `data/architecture/developers.csv`, `data/architecture/projects.csv` | `rules.md` mục 13; dữ liệu nháp `content/data/entities/entities.csv` | Chờ |
| 3 | Dòng thông tin dự án: giữ "Chủ đầu tư: [thương hiệu]"; có `don_vi_phat_trien` thì thêm dòng "Phát triển: […]" | `theme/velis/patterns/tpl-project.php`, `tpl-post.php`, `theme/velis/inc/data.php` | `rules.md` mục 13 | Chờ |
| 4 | Mục pháp lý trang dự án: có `phap_nhan` thì hiện "Pháp nhân ký hợp đồng mua bán: [phap_nhan] (thuộc [chu_dau_tu])", trống thì ẩn | `theme/velis/patterns/tpl-project.php` (mục pháp lý) | `rules.md` mục 13.3 | Chờ |
| 5 | Schema `Organization`: `name` = `chu_dau_tu`, `legalName` = `phap_nhan` khi có (trang chủ đầu tư và `mentions` trong bài) | `theme/velis/inc/seo.php` | `rules.md` mục 13.4 | Chờ |
| 6 | Giữ nguyên URL và tiêu đề silo `/chu-dau-tu/{thương hiệu}/` (không đổi) | `BRIEF.md`, theme | Người dùng chốt | Ghi nhận, không cần làm |

## Phát hiện trong nhánh content

| # | Việc | File | Căn cứ | Trạng thái |
|---:|---|---|---|---|
| 7 | Gộp URL: đổi đích redirect `/cho-thue-the-prive/` và `/cho-thue-the-prive/tiem-nang-nam-rach-chiec-2028-2/` từ `/blog/the-prive/cho-thue-the-prive/` sang `/blog/the-prive/loi-suat-cho-thue-the-prive/` | `data/url-map.csv` (dòng 241–242) | Người dùng chốt gộp bài #3 The Privé; `content/keyword-map.csv` | Chờ |
| 8 | Sau khi người dùng duyệt bản nháp `content/keyword-map.csv`: thay `data/keyword-map.csv` (cùng cột, thêm `trang_thai`), cập nhật `tools/build_keyword_map.py` để không ghi đè từ khóa đã duyệt | `data/keyword-map.csv`, `tools/build_keyword_map.py` | `content/guide/pillars.md` TODO | Chờ duyệt |
| 9 | Đồng bộ kết quả xác minh chủ đầu tư (Vinhomes Saigon Park, Palm City / Palm River, Spring Ville / Persa Place) vào `docs/AUDIT-NOI-DUNG.md` mục 2.1, 2.2 khi người dùng trả lời | `docs/AUDIT-NOI-DUNG.md` | `content/audit-vai-tro-chu-dau-tu.md` | Chờ xác minh |
