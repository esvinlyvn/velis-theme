# Việc sau ra mắt (lập 2026-11-09, bước 4 – giao diện khóa, theme 1.0.0)

Các mục dưới đây **không chặn khóa giao diện**: hoặc do nội dung / ảnh / dữ liệu, hoặc chỉ kiểm được trên site thật / thiết bị
thật. Mục nào đụng tới giao diện thì làm theo quy tắc khóa (`CLAUDE.md`): cập nhật ảnh mốc + người dùng duyệt.

| # | Việc | Vì sao còn lại | Ai / khi nào |
|---|---|---|---|
| 1 | **iPhone / Safari thật**: mở trang chủ, The Global City, The Privé, lưu PDF – xác nhận không còn khối đen | WebKit trên Linux (Playwright) không tái hiện được khối đen; cách sửa (bỏ `mask-image`, lớp mờ vẽ bằng phần tử) dựa trên nguyên nhân suy luận. Dải "Dự án nổi bật" từ 768 px (nằm trên ảnh) **vẫn dùng `mask-image`** – nếu iPad còn khối đen thì bỏ lớp mờ ở đó | người dùng, ngày ra mắt |
| 2 | **LCP** đo lại khi bật LiteSpeed Cache trên site thật (≤ 2,5 s) | staging tắt cache, TTFB 0,9–2,4 s; Lighthouse CI chỉ cảnh báo LCP | ngày ra mắt |
| 2b | **NT-93 ngân sách ảnh trang chủ cả trang ≤ 1 MB**: đo 1 008 KB (M1) / 1 042 KB (M2) | vượt 18 KB ở M2; đo lại khi LiteSpeed tối ưu ảnh (WebP/AVIF); nếu vẫn vượt, giảm chất lượng ảnh – đụng giao diện nên cần duyệt + cập nhật mốc | ngày ra mắt |
| 3 | **Lighthouse SEO – bật lại mục `is-crawlable`** khi chạy trên site thật | staging cố ý noindex nên `lighthouserc.json` tắt mục này (có mục này SEO = 66) | ngày ra mắt |
| 4 | **Lệch mockup do độ dài chữ**: The Global City – khối hỏi đáp (+77 px), 3 thẻ phân khu trên điện thoại (25–50 px) | bố cục giống mockup; chữ trên staging dài / ngắn khác bản trích của mockup | không cần sửa; cập nhật mockup khi nội dung chốt |
| 5 | **Ảnh hero `/du-an/` trùng ảnh thẻ The Global City** trong lưới bên dưới | chưa có ảnh sạch thứ hai đủ lớn | khi có ảnh mới |
| 6 | **Mặt bằng The Privé** (ID 19976–19978): file gốc hỏng, theme bỏ khỏi `srcset` | cần tải lại bản gốc | nội dung |
| 7 | **Ảnh cần bản gốc / bản sạch** (có huy hiệu, chữ in sẵn, logo; thiếu cỡ) | danh sách theo ưu tiên: `docs/KIEM-KE-ANH.md` mục "Ảnh cần bản gốc", `data/anh-can-ban-goc.csv`; 44 ảnh "không che được" đang hiện khung có tên | nội dung |
| 8 | **Logo chủ đầu tư vào Media** + gán `velis_logo` | staging chưa có; theme dùng tạm 4 logo đóng gói (`theme/velis/assets/brand/doi-tac/`) | nội dung |
| 9 | **Mockup chưa có menu thả xuống** (theme đã có) | mockup chỉ là tài liệu thiết kế; cập nhật khi sửa mockup lần tới | thiết kế |
| 10 | **Tên khu vực 2 cấp**: dải nổi bật / thẻ hiện khu vực con (vd. "Nhơn Trạch – Long Thành"), tab trang chủ / bộ lọc `/du-an/` hiện khu vực cha ("Vùng vệ tinh") | đúng thiết kế 2 cấp (`docs/KHU-VUC.md`) nhưng người đọc có thể thấy khác tên | người dùng chọn: giữ 2 cấp hay một cấp |
| 11 | **Secret GitHub `STAGING_VIEW_PASSWORD`** (Settings → Secrets → Actions) | workflow `kiem-tra.yml` cần để chạy trên staging; Claude không đặt được secret | người dùng |
| 12 | **4 trang `/du-an/{chủ đầu tư}/` trả 404** (ID 19593, 19633, 19625, 19637 – trùng địa chỉ loại nội dung Dự án) | 301 sang `/chu-dau-tu/{slug}/` đã có trong `data/url-map.csv`; 0 link nội bộ trỏ tới | áp redirect ngày ra mắt (`docs/AUDIT-NOI-DUNG.md` mục 12) |
