# Kế hoạch ra mắt (site thật velisrealty.vn) – bản The7

Cập nhật 2026-11-12 (bước 8, sau đánh giá độc lập). Thay bản cũ đưa theme khối `velis` + `velis-data` (đã bỏ 2026-11-11).
Chỉ làm khi người dùng ra lệnh và chọn giờ. Mọi bước ghi lên site thật cần người dùng duyệt (CLAUDE.md); bước có thể ghi
`.htaccess` (LiteSpeed, permalink, chuyển hướng chế độ .htaccess) duyệt riêng.

Staging (chép từ site thật 2026-11-11 bằng Softaculous) đang chứa: theme con **The7 Velis (child) 1.4.0**, Theme Options của theme
con, widget, menu "Velis – Menu chính", 3 mẫu WPBakery, trang mẫu archive 20733, nội dung đã sửa (bước 2–8), Rank Math title/mô tả,
chuyển hướng, chuyên mục `/blog/…`, form CF7 có ô đồng ý, Tùy biến "Thanh liên hệ", site icon, ảnh OG. Nhật ký từng thao tác:
`docs/STAGING-LOG.md`; báo cáo `docs/reports/the7-buoc-*.md`.

## Cần người dùng chọn trước

- **Cách đưa lên site thật.**
  - **A (đề xuất): chuyển cả CSDL + `wp-content` staging → site thật** (Softaculous "Push to Live" hoặc UpdraftPlus sao lưu staging →
    khôi phục trên site thật). Ít bước nhất, đúng cái đã kiểm. Phải: (1) **đóng băng nội dung site thật** từ lúc chép staging
    (2026-11-11) – bài/trang/media/lead mới phát sinh trên site thật phải nhập lại sau khi chuyển (so ở bước 2); (2) làm **danh sách
    "trả lại như site thật"** ở bước 6 (staging đang tắt email, khóa trang, gỡ GA4…).
  - **B: làm lại từng thay đổi trên site thật** theo `docs/STAGING-LOG.md` (nhập Theme Options, tải theme con, dán nội dung, nhập
    chuyển hướng…). Không đụng CSDL ngoài phần sửa, nhưng ~40 thao tác tay, dễ sót; chỉ chọn nếu site thật có nhiều nội dung mới
    không muốn nhập lại.
- **Giờ ra mắt:** dữ liệu GSC theo ngày (`data/gsc/daily.csv`): Thứ Bảy thấp nhất. Đề xuất sáng Thứ Bảy 7:00 (giờ cụ thể là giả
  định – xem GA4 theo giờ để chốt). A ≈ 60–90 phút bảo trì; B ≈ 2–3 giờ.

## Thứ tự thao tác ngày ra mắt (phương án A)

| # | Thao tác | Người làm | Quay lui |
|---|---|---|---|
| 1 | **Sao lưu site thật**: UpdraftPlus thủ công (tệp + CSDL) + bản sao lưu của hosting; tải 1 bản về máy | người dùng (Claude hướng dẫn) | – (điểm quay lui của mọi bước) |
| 2 | **So nội dung mới** trên site thật kể từ 2026-11-11 (REST công khai: bài, trang, media theo `modified_after`; Rank Math → Chuyển hướng, 404) → danh sách cần nhập lại | Claude (chỉ đọc) | – |
| 3 | **Quét lại staging** trước khi chuyển: `python3 -I tools/the7_check_onpage.py out.json` → `staging-encoded` = 0 (link staging dạng mã hóa URL hoặc nằm trong Raw HTML base64 – search-replace không thấy; bước 8 đã đưa về 0) | Claude | sửa trên staging rồi quét lại |
| 4 | Bật bảo trì; **chuyển CSDL + wp-content** staging → site thật; **search-replace** `https://staging.velisrealty.vn` → `https://velisrealty.vn` (cả bảng options/postmeta, dạng serialized – công cụ của Softaculous/UpdraftPlus/WP-CLI tự xử lý) **và** chuỗi mã hóa `https%3A%2F%2Fstaging.velisrealty.vn` → `https%3A%2F%2Fvelisrealty.vn` | Claude + hosting | khôi phục bản sao lưu bước 1 |
| 5 | **Quét lại**: `SELECT … LIKE '%staging.velisrealty%'` trên `posts`, `postmeta`, `options` (qua công cụ của hosting) = 0; Rank Math → Chuyển hướng: đích không còn `staging.` (các quy tắc `/blog-bds/…`, lưu trữ ngày đang lưu đích tuyệt đối staging) | Claude | sửa từng quy tắc |
| 6 | **Trả lại cài đặt của site thật** (staging khác site thật có chủ đích): **gỡ** plugin `velis-staging-guard` và **Password Protected** (tắt + xóa); WP Mail SMTP bỏ "Do Not Send" (gửi email lại); Header and Footer Scripts: thêm lại GA4 + Pinterest như site thật (bản cũ trong `docs/STAGING-LOG.md` mục 2026-11-11); Rank Math bật lại IndexNow; UpdraftPlus lịch như site thật; Cài đặt → Đọc **bỏ** "Ngăn công cụ tìm kiếm"; Địa chỉ WordPress / trang = `https://velisrealty.vn` | Claude | bật lại từng mục |
| 7 | **Buttonizer**: giữ tắt (đã chốt) – thanh liên hệ dính đáy của theme con thay thế; kiểm Tùy biến → "Thanh liên hệ (điện thoại)" đúng số/Zalo | Claude | bật lại Buttonizer |
| 8 | **Cache**: FVM → Clear Everything; LiteSpeed → Xóa tất cả (chỉ purge; thay đổi cài đặt LiteSpeed như nén ảnh/QUIC.cloud là việc riêng, duyệt riêng vì ghi `.htaccess`) | Claude | – |
| 9 | Tắt bảo trì. **Kiểm ngay**: on-page toàn sitemap (title ≤ 60, mô tả ≤ 155, 1 H1, **canonical tự trỏ** – trên staging không đo được vì noindex), 32 URL có lượt nhấp (GSC) trả 200/301 một bước, `/blog-bds/*` → `/blog/*`, lưu trữ ngày → `/blog/`, `/the-prive/` → trang dự án; gửi thử form 1 lần (email về hộp thư) + GA4 DebugView; ảnh 360/1366 trang chủ, 1 dự án, 1 bài; Lighthouse 4 trang | Claude + người dùng (hộp thư, GA4) | quay lui bước liên quan |
| 10 | **Nhập lại nội dung mới** của bước 2 (nếu có) | Claude | – |
| 11 | **Search Console**: gửi `sitemap_index.xml`; Kiểm tra URL trang chủ, `/blog/`, 1 dự án | người dùng | – |
| 12 | **Theo dõi 404 trong 4 tuần** (Search Console + Rank Math 404 Monitor); thêm chuyển hướng cho URL lỗi có lượt truy cập | Claude + người dùng | – |

## Phương án B – danh sách làm lại trên site thật (nếu không chuyển CSDL)

Theo thứ tự, mỗi dòng có trong `docs/STAGING-LOG.md` kèm cách quay lui:
1. Tải `dist/dt-the7-child.zip` (theme con 1.4.0) → kích hoạt; nhập Theme Options của theme con (`data/the7/options-buoc-8.json` –
   **sửa trước**: logo/ảnh trỏ ID Media của site thật; `template_page_id_*` trỏ ID trang mẫu tạo ở bước 4).
2. Media: 6 logo PNG (`the7-child/logo/`), site icon chữ V, ảnh OG 1200×630 (`assets/brand/png/`).
3. Menu "Velis – Menu chính" → vị trí primary; widget Default Sidebar (Nhận tư vấn, Bài mới), **Sidebar dự án** (Nhận bảng giá),
   Default Footer.
4. Trang mẫu chuyên mục (WPBakery, bản nháp) → The7 → Archives: chuyên mục, tìm kiếm, tác giả, thẻ; trang 404.
5. WPBakery: 3 mẫu "Mẫu của tôi" (`data/the7/mau-wpbakery/`), mẫu mặc định cho bài, bảng màu 8 ô.
6. Nội dung các trang/bài đã sửa (bước 2, 3, 5, 6, 8): dán `content.raw` từ staging (REST) – kiểm 0 link `staging.`; meta The7
   (Sidebar Options, Page Paddings trang chủ) và Rank Math "Lock Modified Date".
7. Chuyên mục: `blog-bds` → `blog` + cụm `/blog/{cụm}/`, tên "Dự án"; trang Blog cũ → nháp; 3 chuyên mục rỗng đã gỡ.
8. Rank Math: title/mô tả (`data/seo/the7-buoc-3-title-meta.csv`, `data/seo/the7-buoc-8-title.csv`), noindex trang 2+, chuyển hướng
   (8 regex `/blog-bds/…`, lưu trữ ngày, `/the-prive/`, 2 chuyên mục rỗng) – **đích ghi tương đối hoặc `https://velisrealty.vn`**.
9. CF7 form 19582 (ô đồng ý NĐ 13/2023), Tùy biến "Thanh liên hệ", tắt Buttonizer, xóa cache FVM + LiteSpeed; rồi bước 9–12 ở trên.

## Không đưa lên site thật

`velis-staging-guard`, Password Protected, cài đặt tắt email, bản nháp tự động do mở "Thêm mới" (WordPress tự dọn), các trang tài liệu
nội bộ 20538–20544 (giữ Riêng tư, noindex).
