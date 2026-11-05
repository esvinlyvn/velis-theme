# Giai đoạn 4 – vòng r8 (2026-11-05)

Chỉ giao diện, làm trên staging (theme velis **0.9.8**). Nhánh `claude/giai-doan-4-r8`, tách từ `claude/upbeat-fermat-04eevu`
(835ae96); PR mới thay PR #4.

Ảnh chụp bằng Playwright, `deviceScaleFactor: 2`, khung 1366 và 390. Mỗi ảnh lấy **cả bề ngang viewport** của section, ẩn header
dính và thanh tab dính, cuộn thật và chờ ảnh tải xong (`tools/shots_r8.mjs`).
- Ảnh "trước" (bản 835ae96, chụp trước khi triển khai): `screenshots/phase4-r8/truoc/`
- Ảnh "sau": `screenshots/phase4-r8/sau/`
- Tên file: `<mục>-<khung>.jpg`

## Đã làm

| # | Mục | Đã làm | Ảnh |
|---|---|---|---|
| 1 | Khung ảnh không phụ thuộc DPR | Bỏ toàn bộ cơ chế `--nw`/`--dpr` (CSS `min-resolution`, mặt nạ hero, `data-alt-w`). Hero A tràn toàn khung ở mọi DPR, chỉ phủ tối sau khối chữ. Ảnh nội dung rộng bằng cột chữ; chỉ khi file lớn nhất nhỏ hơn cột thì hiện bằng cỡ file, căn giữa (`.v-crop`, `max-width` = file lớn nhất, không phụ thuộc DPR) | `01a-hero-trang-chu`, `01b-hero-the-global-city`, `01c-anh-noi-dung`, `01d-the-du-an` |
| 2 | Phóng cắt ẩn huy hiệu | Khôi phục cơ chế d68860a: `transform: scale(--zoom)` neo ở `--focus` (góc phải trên). Hệ số: 1,12 cho hero, ảnh đầu bài, ảnh nội dung; 1,15 cho thẻ, dải nổi bật, thư viện, tiến độ, cột phải, khối "Nằm trong", "Về Velis". Huy hiệu nằm ở x 2–9 % → phóng 1,12 đã cắt 10,7 % mép trái. Mặt bằng, logo, bản đồ OSM: không phóng. Ảnh nhỏ trong dải nổi bật và thẻ Giới thiệu được bọc khung `.v-ratio` để cắt phần phóng | `02-huy-hieu-sau-nut-goi` + 20 ảnh mẫu (bên dưới) |
| 3 | Chọn đúng file | Giữ các cỡ 600/900/1600/2000/2560 và srcset tới 2560. `sizes` luôn ghi rõ (tắt `auto`) = khung × hệ số phóng × tỉ lệ cắt (ảnh rộng hơn khung `cover`: tỉ lệ ảnh/tỉ lệ khung) × biên 1,15. Biên này cần vì từ DPR > 1, Chromium lấy file nhỏ hơn khi mật độ điểm ảnh nằm dưới trung bình nhân của hai cỡ liền kề; √1,28 ≈ 1,13 là bước lớn nhất từ 600 px trở lên | `03-cot-phai-the-global-city`; số đo: mục Kiểm chứng |
| 4 | Đo độ nét | Lấy bề rộng thật của file đang hiện: nạp `currentSrc` vào `new Image()`. Mức cần = khung layout (không tính transform) × DPR × hệ số phóng; với `object-fit: cover` lấy max(bề rộng khung, chiều cao khung × tỉ lệ ảnh). Không dùng `img.naturalWidth` | bảng đo cũ/mới bên dưới |
| 5 | Ảnh cần bản gốc lớn hơn | Đã tìm trên staging (`original_image` / `-scaled`) và trên site thật (REST công khai, chỉ đọc, 233 file cùng tên): không có bản nào lớn hơn. Danh sách 17 ảnh (8 ảnh hero cần 2150 px) ở `docs/ANH-CAN-THAY.md`, mục "Ảnh cần bản gốc lớn hơn" | – |
| 6 | Mặt bằng The Privé | File gốc hỏng: srcset lấy cỡ ≤ 900 ở mọi DPR ≤ 2, ảnh lỗi thì lùi về 1024 (`data-alt` luôn là cỡ 1024). Khung theo thiết kế (≤ 50 % cột, `contain`), không phóng | `06-mat-bang-the-prive` |
| 7 | Dải "Dự án nổi bật" | Tên ≤ 2 dòng, khu vực 1 dòng có "…", thẻ `height: 100%`; giữ mũi tên. Trước: thẻ The Global City cao 112 px so với 90 px ở 768 và 1066 px (đo riêng) | `07-dai-du-an-noi-bat` |
| 8 | Khung dự phòng | Tên dự án bằng Playfair, căn giữa, nền champagne nhạt `#F3ECDF` (bỏ nền sọc), cùng tỉ lệ thẻ có ảnh; áp cho mọi lưới | `08-khung-du-phong-the-global-city` |
| 9 | Lưới bài thiếu ô | Thẻ "Xem tất cả bài về {cụm} →" (link tới chuyên mục cụm) ở lưới bài trang dự án. CSS ẩn thẻ này khi nó sẽ mở một hàng mới; khi thiếu 2 ô thì thẻ rộng 2 ô | `09-luoi-bai-vinhomes-saigon-park` |
| 10 | Meta thẻ bài | Tác giả · ngày · "N phút đọc" mỗi mục nằm trong một `span` không ngắt dòng | `10-meta-the-bai` |
| 11 | Bản đồ | Rộng bằng cột chữ: `.v-page__main .v-map` tối đa 720 px; bản đồ trong nội dung cũ nằm trong `.v-prose` | `11-vi-tri-the-prive`, `11b-vi-tri-persa-place` |
| 12 | Ảnh tiến độ | Rộng bằng cột chữ. Số cột theo số ảnh: 1 → 1; 2 hoặc 4 → 2; còn lại 3 cột, ảnh đầu rộng 2 ô khi số ảnh không chia hết cho 3 (5, 7, 8…). Mobile 2 cột, ảnh đầu tràn hàng khi số ảnh lẻ. Có test PHP cho 1–13 ảnh | `12-tien-do-the-prive` |
| 13 | Thư viện | Nền khung = nền section tối; ảnh mặt bằng/bản đồ trong thư viện hiện trọn bản vẽ (`contain`, không phóng) trên nền tối | `13-thu-vien-the-prive` |
| 14 | Chip hero | "Bàn giao" + "Từ tháng 11/2023" → "Bàn giao từ tháng 11/2023": chỉ viết thường các từ Từ, Dự kiến, Quý, Năm, Tháng, chỉ sửa ở template (`velis_label_value()`; dùng cả cho meta thẻ phân khu) | `14-chip-hero-the-global-city` |
| 15 | Cột phải bài viết | top = header dính + 24 px, chuyển động cùng header (0,2 giây); chỉ danh sách mục lục cuộn riêng (≤ 45vh, co thêm cho vừa màn hình, mờ dần ở đáy); thẻ dự án ảnh thu gọn 96 px + nút tư vấn luôn hiện đủ | `15-cot-phai-bai` (có header, vì tiêu chí là vị trí so với header) |
| 16 | Hộp tác giả | Link "Tất cả bài của Vũ Xuân" bỏ đệm và viền trong suốt → thẳng lề trái với tên | `16-hop-tac-gia` |

**Ảnh mẫu huy hiệu (mục 2):** 20 ảnh (4 hero, 2 dải nổi bật, 5 thẻ, 2 thư viện, bản đồ trong nội dung, ảnh nội dung, ảnh đầu
bài, ảnh tiến độ, 2 cột phải, khối "Nằm trong"), chụp khung chứa ảnh ở 1366 và 390. Trước: `screenshots/phase4-r8/huy-hieu-truoc/`
(huy hiệu lộ ở thẻ, dải nổi bật, bản đồ, ảnh nội dung, thư viện). Sau: `screenshots/phase4-r8/huy-hieu-sau/` – **0 huy hiệu nhìn
thấy**, kể cả hero The Global City sau nút "Gọi". Ở 390 px ít hơn 2 ảnh vì cột phải ẩn trên mobile.

**Màn hình đầu** (chưa cuộn; trang chủ, The Global City, /du-an/, Persa Place, bài dài nhất, Giới thiệu × 1366×768 DPR 1,
1536×864 DPR 1,25, 1920×1080 DPR 1, 390×844 DPR 2): `screenshots/phase4-r8/man-hinh-dau/`.

## Kiểm chứng

### Bộ đo mục F

Lệnh: `node tools/check_ui.mjs --suite tools/suite-pages.txt …`, 30 trang × DPR 1 / 1,25 / 2 × viewport 390 / 1066 / 1366 / 1536 / 1920.
Bảng đủ 30 trang × từng tiêu chí × từng DPR và chi tiết từng lỗi:
- sau: `screenshots/phase4-r8/do-sau/bang.md`
- trước: `screenshots/phase4-r8/do-truoc/bang.md`

Tổng mỗi DPR, mỗi ô cộng qua 30 trang × 5 viewport:

| Tiêu chí | Trước DPR 1 | 1,25 | 2 | **Sau DPR 1** | **1,25** | **2** |
|---|---|---|---|---|---|---|
| Ảnh hỏng | 0 | 0 | 0 | **0** | **0** | **0** |
| Chọn sai file (mục 3) | 0 | 0 | 0 | **0** | **0** | **0** |
| Bố cục lệch theo DPR > 1 px (mục 1, so với DPR 1) | – | 307 | 510 | – | **0** | **0** |
| Nhóm thẻ trộn thiếu khung | 0 | 0 | 0 | **0** | **0** | **0** |
| Khung dự phòng không tên | 0 | 0 | 0 | **0** | **0** | **0** |
| Thẻ dải nổi bật lệch cao (≥ 768 px) | 0* | 0* | 0* | **0** | **0** | **0** |
| Ảnh lẻ ở lưới tiến độ | 16 | 16 | 16 | **0** | **0** | **0** |
| Bản đồ / lưới tiến độ lệch cột chữ > 1 px | 21 | 21 | 21 | **0** | **0** | **0** |
| Ô trống hàng cuối lưới bài ≥ 3 cột | 16 | 16 | 16 | **0** | **0** | **0** |
| Dòng meta bắt đầu bằng "phút" | 70 | 70 | 70 | **0** | **0** | **0** |
| Khối trống / bảng < 2 hàng / tràn ngang / H1 ≠ 1 / heading HOA / khoảng trống > 30 % | 0 | 0 | 0 | **0** | **0** | **0** |
| *Thông tin:* ảnh nguồn thiếu độ phân giải | 32 | 49 | 486 | 34 | 126 | 596 |
| *Thông tin:* ô trống ở lưới khác | 11 | 11 | 11 | 11 | 11 | 11 |

\* Bản "trước" được đo khi bộ đo còn so chiều cao `li` (luôn bằng nhau trong lưới), sau đó tôi sửa sang đo thẻ `.v-feat`. Đo
riêng cùng ngày trên bản 835ae96: thẻ The Global City cao 112 px, các thẻ khác 90 px ở 768 và 1066 px; ở 1366/1536/1920 bằng nhau.

- **Ảnh nguồn thiếu độ phân giải** không tính là lỗi giao diện. Đây là ảnh mà ngay file lớn nhất cũng nhỏ hơn mức cần (chủ yếu
  ảnh gốc 1200 px ở hero, cần 2150 px). Sau sửa số này tăng vì khung không còn bị thu nhỏ theo DPR. Danh sách cần thay ở
  `docs/ANH-CAN-THAY.md`.
- **Ô trống ở lưới khác** (chỉ báo số lượng): `/du-an/` 6 thẻ trong 4 cột → 2 ô (1366–1920); Vinhomes Saigon Park phân khu
  3 thẻ trong 2 cột → 1 ô; `/chu-dau-tu/` 7 thẻ → 1–2 ô.

**Cột phải bài viết (mục 15)**: `--sticky tools/sticky-pages.txt`, 3 bài dài nhất (3735 / 3316 / 3291 từ), cuộn từ đầu tới cuối
từng 40 % màn hình, ở 1366×768 DPR 1 và 1536×864 DPR 1,25.
- Trước: 67 / 33 / 2 / 2 / 61 / 55 vi phạm.
- Sau: **0** ở cả 6 lượt (33–40 vị trí mỗi lượt).
- Lưu ý: bản "trước" đo sau 120 ms mỗi bước, bản "sau" sau 350 ms (chờ header trượt xong). Chi tiết: `do-truoc/cot-dinh.json`, `do-sau/cot-dinh.json`.

### Đo cũ / đo mới trên cùng bản 835ae96 (mục 4)

| | Bảng cũ (`bo-do-anh-giai-doan-4.md`) | Đo mới, cùng bản 835ae96 |
|---|---|---|
| Cách tính | khung (đã tính transform) × DPR > file × 1,15 | khung layout × DPR × hệ số phóng (× tỉ lệ cắt nếu `cover`) so với file thật của `currentSrc` |
| Viewport | 390 / 1066 / 1366 / 1920 | thêm 1536 |
| Kết quả | ảnh mờ 0 | chọn sai file 0; ảnh nguồn thiếu độ phân giải 567 (32 / 49 / 486 theo DPR); theo cách cũ vẫn 0 |

Kết luận: bảng cũ "0 ảnh mờ" đúng với chính cách tính của nó, vì vòng trước thu khung xuống ≤ file × 1,15 / DPR. Biên 15 % đã
che 567 trường hợp file nhỏ hơn mức cần. Cách đo mới không còn biên đó, và tách "trình duyệt chọn sai file" (lỗi giao diện)
khỏi "ảnh nguồn nhỏ" (cần ảnh gốc).

### Chạy lại

| Kiểm tra | Kết quả |
|---|---|
| 34 tương tác (`tools/interactions.mjs`, viết lại từ danh sách vòng trước vì script cũ không có trong repo) | **34/34** – `screenshots/phase4-r8/kiem-tra/tuong-tac.txt` (gửi thử 1 lần, đủ trường ẩn dự án / URL / utm) |
| On-page toàn staging | 173 trang · lỗi template 0 · lỗi nội dung 0 · link hỏng 0 – `kiem-tra/onpage.md` |
| Schema | 20 trang · 0 lỗi · 0 cảnh báo – `kiem-tra/schema.md` |
| Lighthouse mobile (12.6.1) | Trang chủ 88 · dự án 89 · phân khu 94 · bài 99 (a11y 100, best practices 100); LCP 2,0–2,7 s, CLS 0–0,067 – `kiem-tra/lighthouse.txt`. Vòng trước 93–99: điểm giảm vì `sizes` giờ chọn file lớn hơn (phóng × tỉ lệ cắt × biên) để đạt tiêu chí 3, ví dụ ảnh "Về Velis" lazy gần màn hình đầu lấy bản 1200 px (250 KB). Chạy lại trang chủ được 90 |
| CSS | **51 123 byte** ≤ 51 200 (gộp 20 khai báo trùng để bù phần thêm mới) |
| Test | `components-test.php` (sizes, `velis_label_value`, số cột ảnh tiến độ 1–13), `ui-media.test.mjs` (đo độ nét bằng file thật, sai file, các quy tắc r8), các test PHP/Node/Python cũ: đạt |

## Nội dung thấy khi soát – chỉ ghi (mục G)

`docs/AUDIT-NOI-DUNG.md` mục 8:
- "Quận 2 (nay là TP. Thủ Đức)" ở The Privé và 1 bài.
- 60 chỗ số thập phân dạng "4.5%" trên 13 trang.
- Dòng địa chỉ lặp nguyên văn câu đầu đoạn mục Vị trí: The Privé (thấy trên màn hình) và 5 dự án khác (kiểm tra tự động).

## Công cụ mới

- `tools/suite-pages.txt`, `tools/sticky-pages.txt`: danh sách trang.
- `tools/merge_suite.mjs`: gộp các lần chạy chia trang.
- `tools/shots_r8.mjs`: ảnh trước/sau, `--first`, `--badges`.
- `tools/interactions.mjs`: 34 tương tác.

Bỏ qua / chưa kiểm tra: chưa kiểm tay trên Safari iPhone thật; DPR 1,5 / 3 chưa đo; Lighthouse chỉ 4 trang. Rủi ro: ảnh nặng hơn
(hiệu năng 88–99) do ưu tiên độ nét; ảnh hero chỉ hết mờ khi có bản gốc ≥ 2150 px.
