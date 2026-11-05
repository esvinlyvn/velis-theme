# Danh sách nghiệm thu (NT) – một danh sách duy nhất

> **Quy tắc.** Đây là danh sách tiêu chí duy nhất cho giao diện và ra mắt. Tiêu chí **chỉ được thêm hoặc sửa khi người dùng
> duyệt**; mọi thay đổi ghi vào "Nhật ký" cuối file (ngày, mã, nội dung, ai duyệt). Báo cáo các bước sau in kết quả theo mã NT.
> Mã đã cấp không dùng lại cho nội dung khác; tiêu chí bỏ thì ghi "bỏ" kèm lý do.

Lập 2026-11-05 (Đổi cách làm, bước 1) bằng cách gom tiêu chí từ `BRIEF.md`, `DESIGN.md`, `CLAUDE.md`, `docs/TEMPLATES.md`, các báo
cáo giai đoạn 3–4 (vòng r5 "ấn tượng đầu tiên", r6 "sửa tổng", r7 "sửa tổng lần cuối", r8), bộ đo `tools/check_ui.mjs`
(`--suite`, `--sticky`, chế độ từng trang), `tools/ui_media.mjs`, `tools/ui_layout.mjs`, `tools/ui_gaps.mjs`, 34 tương tác
(`tools/interactions.mjs`), `tools/check_onpage.mjs`, `tools/check_schema.mjs`, và các lỗi người soát nêu sau r8.

**Cách đo**: *tự động* = script + hàm cụ thể, chạy được lại; *soát mắt* = người xem ảnh chụp/Chrome thật theo mô tả "cần nhìn gì".
"Bước 4" = cách đo sẽ được viết khi làm nghiệm thu bước 4 (đã chốt cách, chưa có code).

## 1. Ma trận màn hình chuẩn (dùng cho mọi bước sau)

| Mã màn | Viewport (CSS px) | DPR | Ghi chú |
|---|---|---|---|
| M1 | 1366×768 | 1 | laptop phổ biến |
| M2 | 1536×864 | 1,25 | **máy người dùng** – Chrome Windows 125% |
| M3 | 1920×1080 | 1 | màn rộng |
| M4 | 960×540 | 2 | Chrome phóng 200% trên màn 1920 (dưới 1024 px → bố cục tablet, header mobile) |
| M5 | 390×844 | 2 | điện thoại |

Bộ đo tự động chạy thêm 1066 px và DPR 1 / 1,25 / 2 cho từng viewport (để bắt lỗi phụ thuộc DPR); 7 khung cũ của CLAUDE.md
(360/390/430/768/1024/1366/1920) – xem xung đột X-08.

### Trang chuẩn (30 trang của bộ đo – `tools/suite-pages.txt`)

`Đ` = dùng cho ảnh màn hình đầu (6 trang) · `L` = dùng cho Lighthouse (4 trang) · `S` = 3 bài dài nhất cho cột dính (`tools/sticky-pages.txt`).

| # | Tên | URL | Đ | L |
|---|---|---|---|---|
| 1 | trang-chu | `/` | Đ | L |
| 2 | du-an | `/du-an/` | Đ | |
| 3 | the-prive | `/du-an/the-prive/` | | L |
| 4 | the-global-city | `/du-an/the-global-city/` | Đ | |
| 5 | vinhomes-saigon-park | `/du-an/vinhomes-saigon-park/` | | |
| 6 | palm-city | `/du-an/palm-city/` | | |
| 7 | spring-ville | `/du-an/spring-ville/` | | |
| 8 | ansana | `/du-an/ansana-by-kita/` | | |
| 9 | masteri-grand-view | `/du-an/the-global-city/masteri-grand-view/` | | |
| 10 | persa-place | `/du-an/spring-ville/persa-place/` | Đ | L |
| 11 | palm-river | `/du-an/palm-city/palm-river/` | | |
| 12 | ivy-park | `/du-an/vinhomes-saigon-park/ivy-park/` | | |
| 13 | nha-pho-ivy-park | `/du-an/vinhomes-saigon-park/ivy-park/nha-pho/` | | |
| 14 | nha-pho-spring-ville | `/du-an/spring-ville/nha-pho/` | | |
| 15 | bai-prive | `/blog/the-prive/loi-suat-cho-thue-the-prive/` | | L |
| 16 | bai-vinhomes | `/blog/vinhomes/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/` (S) | | |
| 17 | bai-tgc | `/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/` | | |
| 18 | bai-persa | `/blog/spring-ville/thiet-ke-biophilic-persa-place-thu-hut-gioi-tri-thuc/` | | |
| 19 | bai-ansana | `/blog/ansana-by-kita/he-thong-tien-ich-ansana-by-kita-one-stop-living-hub/` | | |
| 20 | blog | `/blog/` | | |
| 21 | cum-blog | `/blog/the-prive/` | | |
| 22 | tac-gia | `/chuyen-gia/vu-xuan/` | | |
| 23 | chu-dau-tu | `/chu-dau-tu/` | | |
| 24 | masterise-homes | `/chu-dau-tu/masterise-homes/` | | |
| 25 | gioi-thieu | `/gioi-thieu/` | Đ | |
| 26 | tuyen-dung | `/tuyen-dung/` | | |
| 27 | lien-he | `/lien-he/` | | |
| 28 | chinh-sach | `/chinh-sach-bao-mat/` | | |
| 29 | tim-kiem | `/?s=the+prive` | | |
| 30 | 404 | `/khong-ton-tai-xyz/` | | |

Màn hình đầu: thêm 1 bài dài `/blog/vinhomes/vinhomes-2026-bds-xanh-hay-greenwashing/` (S, cùng 2 bài S khác:
`…/he-sinh-thai-vingroup-…/`, `…/vi-sao-nguoi-ta-than-phien-ve-vinhomes-nhung-van-mua/`). Mọi URL trên staging.

## 2. Tiêu chí

Cột *Trang*: `30` = 30 trang chuẩn · `DA` = trang dự án / phân khu / dòng thấp tầng · `BV` = bài viết · `TC` = trang chủ.
Cột *Màn*: `MT` = ma trận M1–M5 · `BĐ` = viewport bộ đo 390/1066/1366/1536/1920 × DPR 1/1,25/2.

### 2.1 Bố cục & khung

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-01 | Bố cục | Bố cục bất biến theo DPR: cùng viewport, hộp (x, y, w, h) của mọi ảnh và khối giống nhau ở DPR 1 / 1,25 / 2 | tự động: `ui_media.mjs` `runSuite` (so `boxes` với DPR 1) | lệch ≤ 1 px · 0 hộp | 30 | BĐ | r8 mục 1 |
| NT-02 | Bố cục | Không tràn ngang | tự động: `mediaAudit` `overflow`; `check_ui.mjs` `audit()` | scrollWidth ≤ clientWidth + 1 · 0 | 30 | BĐ + MT + 7 khung | BRIEF UX, check_ui |
| NT-03 | Bố cục | Khoảng trống ngang cạnh nội dung | tự động: `ui_gaps.mjs` `contentBands` + `gapRuns` (tính cột dính) | ≤ 30 % khung, không kéo dài quá 1 màn hình · từ 1024 px | 30 | BĐ ≥ 1024 | DESIGN "Khoảng trống", r5 |
| NT-04 | Bố cục | Không khối trống: khối ≥ 200×40 px không chữ, không ảnh/ô nhập, không nền ảnh (`<details>` đóng không tính) | tự động: `mediaAudit` `empty`; `ui_layout.mjs` `empty` (khung > 40 px trống) | 0 | 30 | BĐ | r6 mục 0(b), r7 |
| NT-05 | Bố cục | Khung nội dung 1200 px, từ 1600 px là 1320 px; lề 16 / 24 / 32 px (mobile / ≥ 768 / ≥ 1280); khung đọc 720 px | soát mắt + bước 4 (đo `.v-wrap`) | đúng số | 30 | MT | DESIGN Layout, r6 mục 9 |
| NT-06 | Bố cục | Danh sách ≤ 2 mục không để hàng có ô trống: 1 mục = thẻ ngang rộng hết khung, 2 mục = 2 cột | tự động: `ui_layout.mjs` `grid` (hàng 1 thẻ ≤ 50 %) | 0 | 30 | BĐ | DESIGN "Bố cục 2 cột", r6 |
| NT-07 | Bố cục | Lưới bài ≥ 3 cột: 0 ô trống hàng cuối; được thêm tối đa 1 thẻ "Xem tất cả bài về {cụm} →" | tự động: `mediaAudit` `postgrid` | 0 ô | 30 | BĐ | r8 mục 9 |
| NT-08 | Bố cục | Lưới khác (dự án, phân khu, chủ đầu tư): báo số ô trống hàng cuối | tự động: `mediaAudit` `gridinfo` (thông tin) | chỉ báo – xem X-06 | 30 | BĐ | r8 mục 9 |
| NT-09 | Bố cục | Thẻ cùng một hàng / nhóm cao bằng nhau | tự động một phần: `mediaAudit` `feats` (dải nổi bật); lưới khác: bước 4 (so chiều cao thẻ cùng `top`) | lệch ≤ 1 px | 30 | BĐ ≥ 768 | DESIGN "Thẻ", r8 mục 7 |
| NT-10 | Bố cục | Dải "Dự án nổi bật" ở hero trang chủ: mọi dự án có ảnh thật, 4 thẻ trong khung (nhiều hơn trượt ngang, có mũi tên mờ ở đầu/cuối), tên ≤ 2 dòng, khu vực 1 dòng "…", thẻ cao bằng nhau | tự động: `feats` + tương tác bước 4; soát mắt | lệch ≤ 1 px | TC | MT | r6 mục 12, r7 mục 9, r8 mục 7 |
| NT-11 | Bố cục | Nhịp section 96 / 64 px; đầu mục: eyebrow → tiêu đề Playfair (H2) → đoạn dẫn ≤ 2 dòng → kẻ champagne 48×1 | soát mắt | đúng nhịp | 30 | MT | DESIGN "Đầu mục section" |
| NT-12 | Bố cục | Thứ tự section trang dự án: Tổng quan → [Phân khu] → Sản phẩm → So sánh → Vị trí & tiện ích → Thư viện → Tiến độ & pháp lý → Góc nhìn CEO → Hỏi đáp → Bài viết → Tư vấn; thanh điều hướng mục ≤ 8, mục rỗng tự ẩn | bước 4 (đọc thứ tự `id` section) + soát | đúng thứ tự | DA | MT | DESIGN, r6 mục 15 |
| NT-13 | Bố cục | Mỗi trang ≥ 1 khối nhấn tối; section trang dự án cùng một kiểu nền ngà, Thư viện nền tối; không khung trắng có viền quanh section | soát mắt | – | 30 | MT | DESIGN "Nhịp", r6 mục 18 |
| NT-14 | Bố cục | Thông tin liên hệ (SĐT + email + địa chỉ) chỉ 1 lần trong thân trang (khối "Nhận tư vấn") | tự động: `ui_layout.mjs` `contact` | 0 lặp | 30 | BĐ | DESIGN, r6 mục 0(d), 24 |
| NT-15 | Bố cục | Khối "Nhận tư vấn" 2 cột cân (trái tiêu đề + kênh, phải form); không dải trống trước form | soát mắt + NT-03/NT-04 | – | 30 | MT | r6 mục 11, 13 |
| NT-16 | Bố cục | Bố cục 2 cột ≥ 1024 px trang có văn bản dài: cột nội dung + cột phải dính 340 px; < 1024 px một cột + thanh CTA đáy | soát mắt + bước 4 | – | DA, trang chính | MT | DESIGN "Bố cục 2 cột" |

### 2.2 Ảnh

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-20 | Ảnh | Không ảnh hỏng hiển thị; ảnh lỗi khi tải → thử cỡ 1024 rồi khung dự phòng có tên (`is-broken`) | tự động: `mediaAudit` `broken`; `audit()` `images`; `ui_layout` `images`; test `image-fallback.test.mjs` | 0 | 30 | BĐ | r6, r7, tương tác 14, 20 |
| NT-21 | Ảnh | Chọn đúng file: nếu srcset có file ≥ khung × DPR × hệ số phóng × tỉ lệ cắt (cover) thì file đang hiện ≥ mức đó; không có thì là file lớn nhất | tự động: `mediaAudit` `wrong` (bề rộng thật qua `new Image(currentSrc)`) | 0 | 30 | BĐ | r8 mục 3, 4 |
| NT-22 | Ảnh | Ảnh nguồn đủ độ phân giải cho khung | tự động: `mediaAudit` `lowres` | **thông tin** đến khi ảnh đạt chuẩn được nạp (`docs/CHUAN-ANH.md`); sau đó 0 | 30 | BĐ | r8 mục 5 |
| NT-23 | Ảnh | 0 watermark / huy hiệu / logo / chữ in sẵn nhìn thấy | soát mắt: `node tools/shots_r8.mjs --badges` (20 khung chứa ảnh, 1366 + 390); bước 4: tự động hóa khi có ảnh đạt chuẩn (NT-35) | 0 | 20 ảnh mẫu + màn hình đầu | M1, M5 | r8 mục 2 |
| NT-24 | Ảnh | Khung dự phòng: thẻ không ảnh trong nhóm có ảnh → khung có **tên** (Playfair, căn giữa, nền champagne nhạt), cùng tỉ lệ; cả nhóm không ảnh → thẻ chữ | tự động: `mediaAudit` `mixed` + `noname`; `ui_layout` `fallback` | 0 | 30 | BĐ | r7 mục 3, 4; r8 mục 8 |
| NT-25 | Ảnh | Không khung ảnh / bản đồ > 100 px mà không có ảnh | tự động: `ui_layout` `media` | 0 | 30 | BĐ | r6 mục 0(c), 2 |
| NT-26 | Ảnh | Ảnh có `width`/`height` và `alt`; lazy trừ ảnh màn hình đầu; ảnh LCP `fetchpriority="high"` | tự động: `check_onpage.mjs` rule `image`; Lighthouse; soát | 0 thiếu | 30 + toàn site | – | BRIEF Kỹ thuật, DESIGN |
| NT-27 | Ảnh | Thư viện: không dải màu sáng hai bên ảnh (nền khung = nền section tối, hoặc khung theo tỉ lệ ảnh); mặt bằng/bản đồ trong thư viện hiện trọn; mũi tên + bộ đếm "1/N" desktop, mobile lộ một phần ảnh kế | soát mắt (ảnh `13-thu-vien`) + tương tác TT-75 | 0 dải sáng | DA | MT | r8 mục 13, DESIGN |
| NT-28 | Ảnh | Bản đồ và lưới ảnh tiến độ thẳng cột chữ (`.v-prose`) | tự động: `mediaAudit` `edge` | ±1 px | DA | BĐ | r8 mục 11, 12 |
| NT-29 | Ảnh | Lưới ảnh tiến độ: không hàng cuối chỉ 1 ảnh khi > 1 ảnh; số cột theo số ảnh (1→1, 2/4→2, còn lại 3 – ảnh đầu 2 ô khi không chia hết cho 3; mobile 2 cột) | tự động: `mediaAudit` `photos`; test `components-test.php` (`velis_photo_cols`) | 0 | DA | BĐ | r7 mục 7, r8 mục 12 |
| NT-30 | Ảnh | Mặt bằng: ≤ 50 % cột, cao ≤ 520 px, `contain`, bấm phóng (`<dialog>`); file gốc hỏng → lùi cỡ 1024, khung vẫn theo thiết kế | soát mắt + tương tác TT-73 | – | DA | MT | DESIGN "Tab", r7 mục 1, r8 mục 6 |
| NT-31 | Ảnh | Ảnh minh họa ở thẻ / hero không có chữ đè (không poster, không infographic) | soát mắt: `docs/KIEM-KE-ANH.md` + tờ ảnh | 0 | 30 | – | DESIGN "Ảnh", r6 mục 4 |
| NT-32 | Ảnh | Kiểu hiển thị ảnh quyết định ở phía server theo **cỡ và tỉ lệ của file**, giống nhau trên mọi màn hình và DPR; không kéo giãn quá hệ số 1,5 (`docs/CHUAN-ANH.md` mục 3) | bước 4: so thuộc tính kiểu trên HTML với `media_details` + NT-01 | 0 sai kiểu | 30 | BĐ | bước 1 mục 2.2 |
| NT-33 | Ảnh | Mọi ảnh dùng ở khung cắt (cover) có tiêu điểm (focal point) | bước 4: đọc trường tiêu điểm qua REST cho ảnh trong `KIEM-KE-ANH` | 100 % | toàn site | – | bước 1 mục 2.2 |
| NT-34 | Ảnh | Mỗi trang dự án đúng 1 bản đồ vị trí (bản đồ trong nội dung cũ thắng bản đồ khu vực) | soát + bước 4 (đếm `.v-map` + ảnh bản đồ trong `.v-prose`) | 1 | DA | – | r7 mục 6 |
| NT-35 | Ảnh | Ảnh đầu vào đạt `docs/CHUAN-ANH.md` (cỡ, tỉ lệ, không dấu) cho vị trí đang dùng | tự động: `tools/kiem_ke_anh.mjs` (cỡ) + `data/kiem-ke-anh-mat.csv` (soát mắt dấu) | thông tin; mục tiêu 100 % hero + thẻ trước ra mắt – X-02 | DA, TC, BV | – | bước 1 mục 2 |
| NT-36 | Ảnh | Hộp "Nằm trong" luôn có ảnh nhỏ (của cha, không có thì của đại đô thị) | soát mắt | – | phân khu, dòng thấp tầng | M1 | r6 mục 3 |
| NT-37 | Ảnh | Chú thích chỉ là tên file / "Tên + số" bị ẩn; ảnh thực tế có chú thích ngày chụp + nguồn | test `components-test.php` (`velis_auto_caption`) + soát | 0 chú thích tự sinh | 30 | – | r6 mục 5, DESIGN |

### 2.3 Hero

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-40 | Hero | Kiểu hero chọn theo quy tắc `CHUAN-ANH.md` mục 3 (ảnh đạt → hero A tràn toàn khung; dưới chuẩn → kiểu dự phòng định sẵn), giống nhau ở mọi DPR | NT-01 + NT-32 + soát màn hình đầu | đúng kiểu | TC, DA | MT | r8 mục 1, bước 1 mục 2.2 |
| NT-41 | Hero | Lớp phủ tối sau khối chữ là **chuyển sắc liền mạch** từ mép khối chữ ra ngoài; không thành mảng mờ có cạnh / bo góc nhìn thấy, không thấy biên trên nền trời | soát mắt (màn hình đầu M1–M4); bước 4: lấy độ sáng dọc 1 hàng ngang qua vùng trời, đạo hàm lớn nhất < ngưỡng | 0 biên nhìn thấy | TC, DA | M1–M4 | người soát sau r8 |
| NT-42 | Hero | Tương phản chữ trên ảnh hero (eyebrow, H1, lead, chip) đo bằng điểm ảnh, nền = phân vị 98 độ sáng | tự động: `check_ui.mjs` `photoContrast` | ≥ 4,5:1 (chữ ≥ 24 px hoặc ≥ 18,66 px đậm: 3:1) | TC, DA | MT + 7 khung | DESIGN Hero A, r6 mục 6 |
| NT-43 | Hero | Desktop: ≥ 60 % diện tích ảnh hero giữ độ sáng gốc; khối chữ ≤ min(600 px, 46vw), góc trái dưới | soát mắt + bước 4 (tỉ lệ điểm ảnh bị phủ) | ≥ 60 % | TC, DA | M1–M3 | DESIGN Hero A, r6 mục 6 |
| NT-44 | Hero | Thành phần hero: breadcrumb (nền nhỏ riêng), eyebrow chủ đầu tư · khu vực, H1, 3–4 chip, 2 nút; trang dự án ~60vh; mobile: ảnh 4:3 trên, chữ trên dải tối đặc, không bóng chữ | soát mắt | đủ thành phần | TC, DA | MT | DESIGN, r7 mục 11 |
| NT-45 | Hero | Chip ghép nhãn + giá trị không viết hoa giữa câu ("Bàn giao từ tháng 11/2023") | test `components-test.php` (`velis_label_value`); bước 4: DOM – chip khớp `/\s(Từ|Dự kiến|Quý|Năm|Tháng)\b/` = lỗi | 0 | DA | – | r8 mục 14 |
| NT-46 | Hero | Bài test 5 giây màn hình đầu: trả lời được **A** Velis là ai · **B** trang gì · **C** có sản phẩm gì · **D** làm gì tiếp | soát mắt màn hình đầu 6 trang Đ + bài dài | 4/4 ở cả 5 màn | Đ | MT | r5 |

### 2.4 Thẻ, dữ liệu, chữ

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-50 | Thẻ | Thẻ: ảnh 4:3, cả thẻ bấm được, một link chữ cùng kiểu ở đáy ("Xem dự án →"…); không trạng thái → không nhãn; khu vực cấp cụ thể nhất; thẻ chủ đầu tư thiếu logo → khung logo trung tính | soát mắt + NT-87 | – | 30 | MT | DESIGN "Thẻ", TEMPLATES vòng sửa 2 |
| NT-51 | Dữ liệu | Thiếu dữ liệu → ẩn khối, không chữ giữ chỗ ("đang cập nhật"); quy tắc giá – xem X-05 | soát mắt + test `components-test.php` (`velis_table`) | 0 chữ giữ chỗ | 30 | – | DESIGN "Khi thiếu dữ liệu" |
| NT-52 | Dữ liệu | Thanh thông tin nhanh: đủ ô có dữ liệu, giá trị ≤ ~45 ký tự (dài thì "…" + "Chi tiết"), ≤ 2 dòng, ô cùng chiều cao, không ô lẻ; 2 cột mobile / 3 tablet / 6 desktop ≥ 1280 | soát mắt + bước 4 (chiều cao ô) | lệch ≤ 1 px | DA | MT | DESIGN, r6 mục 20 |
| NT-53 | Dữ liệu | Bảng: ≥ 2 hàng dữ liệu; bảng so sánh chỉ khi ≥ 2 hàng có dữ liệu thật, ô thiếu "Chưa công bố", là vùng full-width riêng, không cuộn ngang khi ≤ 5 cột; bảng trong nội dung rộng 100 % cột | tự động: `mediaAudit` `table`; tương tác 33 | 0 | 30 | BĐ | r6 mục 16, 22; r7 mục 5 |
| NT-54 | Chữ | Dòng meta thẻ bài (tác giả · ngày · N phút đọc) không ngắt giữa một mục | tự động: `mediaAudit` `meta` | 0 dòng bắt đầu bằng "phút" | 30 | BĐ | r8 mục 10 |
| NT-55 | Chữ | Không heading viết HOA toàn bộ (tiếng Việt) | tự động: `mediaAudit` `caps` (≥ 6 chữ cái, ≥ 85 % hoa) | 0 | 30 | BĐ | DESIGN Typography |
| NT-56 | Chữ | Đúng 1 H1 mỗi trang; tiêu đề khối theme không dùng thẻ heading | tự động: `mediaAudit` `h1`; `check_onpage` rule `h1` | = 1 | 30 + toàn site | BĐ | BRIEF On-page |
| NT-57 | Chữ | Văn bản dài của bài trụ cột cũ thu gọn sau ~250 từ (Tổng quan ~150) với nút "Đọc tiếp"; bấm thì mở hết | tự động: `interactions.mjs` 30 | đạt | DA | M1 | DESIGN, r6 mục 15 |
| NT-58 | Chữ | Không tiêu đề trùng ý ("Tổng quan X" + "Thông tin tổng quan X"); bỏ "Bài viết liên quan" và đoạn liên hệ cũ trong nội dung | test `components-test.php` (`velis_chunks`, `velis_strip_related`, `velis_strip_contact`) + soát | 0 | DA, BV | – | r6 mục 17, 21 |
| NT-59 | Chữ | Đoạn văn ≤ 68 ký tự; cỡ chữ nội dung ≥ 17 px mobile; thang chữ H1 48/32 … theo DESIGN | soát + bước 4 (đo `font-size`) | đúng số | 30 | MT | BRIEF, DESIGN |

### 2.5 Bài viết & cột phải

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-60 | Bài viết | Cột phải dính: top = header dính + 24 px; đỉnh hộp ≥ đáy header + 16; đáy ≤ đáy màn − 16; không đè footer; nút tư vấn luôn trong màn; không thanh cuộn ngoài danh sách mục lục | tự động: `ui_media.mjs` `runSticky` / `stickyAudit` (cuộn từng 40 % màn) | 0 vi phạm | S (3 bài) | M1, M2 | r7 mục 8, r8 mục 15 |
| NT-61 | Bài viết | Mục lục cột phải hiện **≥ 5 dòng** ở 1366×768 trước khi cuộn riêng | bước 4: đếm `li` nhìn thấy trọn trong `.v-article__side .v-toc ol` ở vị trí cuộn đầu | ≥ 5 | S | M1 | người soát sau r8 |
| NT-62 | Bài viết | Thẻ dự án ở cột phải bài viết **có tên dự án** | bước 4: `.v-article__side .v-card` có chữ = tên dự án, nhìn thấy | 100 % | BV | M1, M2 | người soát sau r8 |
| NT-63 | Bài viết | Hộp tác giả: link "Tất cả bài của …" thẳng lề trái với tên tác giả | soát + bước 4 (so `left`) | ±1 px | BV | MT | r8 mục 16 |
| NT-64 | Bài viết | Thành phần bài: breadcrumb · H1 · tác giả (link) · ngày đăng / cập nhật · thời gian đọc · ảnh 16:9 · tóm tắt · mục lục khi > 1.200 từ (≥ 3 H2) · khung đọc 720 · thẻ dự án giữa bài (ẩn khi cột phải hiện) · hộp công bố (phân tích / nhận định / so sánh) · hộp tác giả · bài cùng cụm + link dự án trụ cột · CTA theo ngữ cảnh | soát mắt | đủ | BV | M1, M5 | BRIEF "Template bài viết", TEMPLATES |
| NT-65 | Bài viết | Ảnh đầu bài tải ưu tiên (không lazy, `fetchpriority="high"`) | tự động: Lighthouse (LCP element); soát HTML | đạt | BV | – | BRIEF |

### 2.6 Tương tác (34 kiểm tra của `tools/interactions.mjs`)

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-70 | Tương tác | Mega menu "Dự án": mở khi rê chuột, đóng trễ ~200 ms khi rời (sau 80 ms vẫn mở), mở khi bấm, mở bằng Enter, có link phân khu; Esc / bấm ra ngoài đóng; một menu mở một lúc | tự động: `interactions.mjs` 1–5 | 5/5 | the-prive | M1 | DESIGN Header, TEMPLATES |
| NT-71 | Tương tác | Header ẩn khi cuộn xuống (thanh mục lên top 0), hiện khi cuộn lên (thanh mục sát dưới header) | tự động: 16, 17 | 2/2 | the-prive | M1 | r5 |
| NT-72 | Tương tác | Thanh điều hướng mục: bấm cuộn tới mục; tô mục đang xem; mobile cuộn ngang, mục đầu luôn thấy, mép phải mờ dần | tự động: 10, 11, 25 | 3/3 | the-prive | M1, M5 | DESIGN, r5 |
| NT-73 | Tương tác | Tab dòng sản phẩm: tab có dữ liệu = bảng thông số + mặt bằng; tab chưa có dữ liệu = câu hướng dẫn + nút; không JS vẫn hiện đủ | tự động: 6, 7 | 2/2 | the-prive | M1 | DESIGN "Tab" |
| NT-74 | Tương tác | "Nhận bảng giá" cuộn tới form và điền sẵn dòng sản phẩm; thẻ cột phải mở form gọn tại chỗ; thẻ cột phải dự án: ảnh không đè nhãn, trạng thái / loại SP / giá (nếu có) / bàn giao, Nhận bảng giá · Gọi · Zalo | tự động: 8, 9, 31; soát thẻ | 3/3 | the-prive, the-global-city | M1 | r6 mục 19 |
| NT-75 | Tương tác | Thư viện: nút "ảnh sau" đổi bộ đếm; bấm ảnh mở lightbox; lăn chuột trên thư viện vẫn cuộn trang | tự động: 12, 13, 15 | 3/3 | the-prive | M1 | BRIEF, r5 |
| NT-76 | Tương tác | Form: chỉ Họ tên + SĐT (+ đồng ý NĐ 13/2023 có link chính sách); bỏ trống → lỗi ngay tại ô, không gửi; gửi được, email đủ trường ẩn (dự án, URL trang, utm); GA4 `generate_lead` | tự động: 18, 32; GA4 – X-09 | 2/2 + GA4 | the-prive, the-global-city | M1 | BRIEF, DESIGN Form, r6 mục 10 |
| NT-77 | Tương tác | Lọc: `/du-an/` theo Khu vực (Vùng → Tiểu khu) / Chủ đầu tư / Loại SP, chế độ "Theo phân khu & sản phẩm"; đại đô thị: chip lọc phân khu, chế độ "Theo loại sản phẩm"; trạng thái lọc trong URL, canonical về trang gốc | tự động: 19, 21, 22, 34 | 4/4 | du-an, the-global-city | M1 | DESIGN Listing, r6 mục 23 |
| NT-78 | Tương tác | Tìm kiếm khớp tên dự án / phân khu trong câu ("căn hộ palm river" → Palm River đầu tiên); kết quả 2 nhóm Dự án / Bài viết | tự động: 23 | 1/1 | tim-kiem | M1 | TEMPLATES |
| NT-79 | Tương tác | Mobile: menu toàn màn hình mở / đóng; thanh CTA đáy (Gọi · Zalo · Nhận tư vấn, 64 px, safe-area) ẩn ở đầu trang, hiện khi nút hero ra khỏi màn, ẩn lại khi về đầu; ẩn khi menu / bộ lọc mở; không che nội dung | tự động: 24, 26, 27, 28 | 4/4 | the-prive | M5 | DESIGN, r6 mục 7 |
| NT-80 | Tương tác | Breadcrumb mobile ≤ 2 dòng, mục cuối 1 dòng "…" | tự động: 29 | ≤ 2 dòng | nha-pho-ivy-park | M5 | r6 mục 8 |

Tương tác 14 và 20 (không ảnh vỡ) → NT-20; 30 ("Đọc tiếp") → NT-57; 33 (so sánh full-width) → NT-53.

### 2.7 Accessibility

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-85 | A11y | Tương phản chữ thường | tự động: `check_ui.mjs` `audit()` `contrast` | ≥ 4,5:1 (chữ lớn 3:1, disabled 3:1) | 30 | 7 khung + MT | BRIEF WCAG 2.2 AA |
| NT-86 | A11y | Vùng bấm ≥ 44×44 px, khoảng cách giữa 2 vùng bấm ≥ 8 px | tự động: `audit()` `targets` (khoảng cách: bước 4) | 0 | 30 | 7 khung + MT | BRIEF, DESIGN |
| NT-87 | A11y | Viền focus rõ (2 px ink, lệch 2 px), dùng được bàn phím; `prefers-reduced-motion` tắt hiệu ứng; cho phép phóng to; form có nhãn hiển thị, ô SĐT bàn phím số | soát + bước 4 (Tab qua trang) | đạt | 30 | M1, M5 | BRIEF, DESIGN |
| NT-88 | A11y | Lighthouse Accessibility | tự động: Lighthouse | = 100 | L (4 trang) | mobile | báo cáo Lighthouse r5–r8 |

### 2.8 Hiệu năng

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-90 | Hiệu năng | Lighthouse mobile Performance | tự động: Lighthouse 12.6.1 (4 trang L); bước 4 chuyển sang Lighthouse CI có ngân sách | ≥ 90 mỗi trang | L (4 trang) | mobile giả lập | người soát sau r8 |
| NT-91 | Hiệu năng | LCP / CLS / INP / TBT | tự động: Lighthouse (lab); field data sau ra mắt (NT-135) | LCP ≤ 2,5 s (mục tiêu 2,0); CLS ≤ 0,1 (mục tiêu 0,05); INP ≤ 200 ms | L | mobile | BRIEF ngân sách, người soát |
| NT-92 | Hiệu năng | Tổng dung lượng ảnh tải trong màn hình đầu | bước 4: Playwright đếm `transferSize` ảnh trước khi cuộn | ≤ 400 KB | L | M1, M2, M5 | người soát sau r8 – X-01 |
| NT-93 | Hiệu năng | Tổng dung lượng ảnh cả trang chủ (cuộn hết) | bước 4: như trên, sau khi cuộn hết | ≤ 1 MB | trang-chu | M1, M2 | người soát sau r8 – X-01 |
| NT-94 | Hiệu năng | CSS (min) ≤ 51 200 byte (bước 3 đặt lại ngân sách sau khi viết lại); JS tải ban đầu ≤ 60 KB nén, không jQuery, không thư viện JS; font ≤ 3 file woff2, preload 2 | tự động: `build_css.py` (in số byte); Lighthouse network | đúng ngân sách | 30 | – | BRIEF, DESIGN, r7–r8 |
| NT-95 | Hiệu năng | Ảnh đầu trang (LCP) | tự động: Lighthouse (`largest-contentful-paint-element` + `network-requests`) | ≤ 150 KB, WebP/AVIF – X-01 | L | mobile | BRIEF "Ảnh đầu trang" |

### 2.9 SEO on-page & schema

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-100 | SEO | On-page: title / meta (thiếu, > 60 / > 155 ký tự, trùng), H1, heading nhảy cấp, robots đúng loại trang, canonical, ảnh thiếu alt / width-height, og:image 1200×630, link nội bộ nofollow, từ khóa chính trùng (`data/keyword-map.csv`), link nội bộ hỏng | tự động: `check_onpage.mjs` (crawl toàn staging) | lỗi template 0, lỗi nội dung 0, link hỏng 0 | toàn site (173) | – | BRIEF "Kiểm tra tự động trước ra mắt" |
| NT-101 | SEO | Schema: 0 lỗi Schema Markup Validator, 0 cảnh báo, đủ trường bắt buộc Google | tự động: `check_schema.mjs` | 0 / 0 | 20 trang (1 trang / template) | – | BRIEF Schema |
| NT-102 | SEO | Breadcrumb hiển thị và `BreadcrumbList` cùng một nguồn (phân khu 4 cấp, dòng thấp tầng 5 cấp) | `check_schema.mjs` + soát | khớp | DA | – | TEMPLATES On-page |

### 2.10 Thiết bị & trình duyệt (chưa kiểm)

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-110 | Thiết bị | Safari iPhone thật – **chưa kiểm** | soát tay trên iPhone (Safari) hoặc dịch vụ thiết bị thật: chạy NT-70–80 bằng tay, chụp màn hình đầu 6 trang Đ, xem ảnh nét + không tràn | đạt | Đ + the-prive | iPhone thật | BRIEF nghiệm thu |
| NT-111 | Thiết bị | DPR 1,5 và 3 – **chưa kiểm** | `node tools/check_ui.mjs --suite tools/suite-pages.txt <dir> 1.5,3` (NT-01 so với DPR 1, NT-21) | như NT-01, NT-21 | 30 | 1366, 390 | r8 |
| NT-112 | Thiết bị | Chrome Android thật – **chưa kiểm** | soát tay như NT-110 | đạt | Đ | thiết bị thật | BRIEF |
| NT-113 | Thiết bị | Soát mắt trên Chrome thật (Windows 125 %, cửa sổ không bị che, không mở DevTools) – bước 4 | người soát theo danh sách NT soát mắt | đạt | Đ | M2 | bước 4 |
| NT-114 | Thiết bị | Mốc ảnh `toHaveScreenshot` (bước 4) cho trang Đ × ma trận | Playwright | sai khác ≤ ngưỡng chốt ở bước 4 | Đ | MT | lộ trình |

### 2.11 Quy trình & ra mắt (nghiệm thu ở giai đoạn 5–6)

| Mã | Nhóm | Mô tả | Cách đo | Ngưỡng | Trang | Màn | Nguồn |
|---|---|---|---|---|---|---|---|
| NT-120 | Quy trình | Thay đổi ảnh hưởng hiển thị có ảnh chụp trước/sau (desktop + mobile), không chỉ mã HTTP | báo cáo mỗi vòng | 100 % thay đổi | – | M1, M5 | CLAUDE.md, SCOPE.md |
| NT-130 | Ra mắt | 100 % URL cũ chuyển 301 một bước tới đích đúng; 0 lỗi 404 nội bộ | crawl mốc (`tools/crawl_baseline.py`) trước / sau | 100 % · 0 | toàn site | – | BRIEF nghiệm thu |
| NT-131 | Ra mắt | 8 đường dẫn ứng dụng giữ nguyên mã HTTP (`curl -sI`); 10 bot AI nhận 200 | curl | khớp mốc | 8 + 10 | – | BRIEF, CLAUDE.md |
| NT-132 | Ra mắt | Form gửi được trên site thật, email về, sự kiện GA4 ghi nhận | gửi thử + GA4 DebugView | đạt | form | – | BRIEF nghiệm thu |
| NT-133 | Ra mắt | Mỗi trang dự án đủ trường bắt buộc kèm ngày cập nhật; mỗi bài đúng một cụm và link về trang dự án | REST + `check_onpage` | 100 % | DA, BV | – | BRIEF nghiệm thu |
| NT-134 | Ra mắt | Không title / meta trùng (= NT-100 trên site thật) | `check_onpage.mjs` site thật (chỉ đọc) | 0 | toàn site | – | BRIEF |
| NT-135 | Ra mắt | Core Web Vitals mobile (dữ liệu thật) 10 trang mẫu | Search Console / CrUX | LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms | 10 | – | BRIEF nghiệm thu |

**Số tiêu chí: 93** – tự động hôm nay 47 (NT-01, 02, 03, 04, 06, 07, 08, 14, 20, 21, 22, 24, 25, 26, 28, 29, 35, 37, 42, 53, 54, 55, 56, 57, 58, 60, 65, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 85, 88, 90, 91, 94, 95, 100, 101, 102) · tự động một phần / sẽ tự động ở bước 4 21 (NT-05, 09, 10, 12, 16, 23, 32, 33, 34, 41, 43, 45, 52, 59, 61, 62, 63, 86, 87, 92, 93) · soát mắt 13 (NT-11, 13, 15, 27, 30, 31, 36, 40, 44, 46, 50, 51, 64) · thiết bị, quy trình, ra mắt 12 (NT-110, 111, 112, 113, 114, 120, 130, 131, 132, 133, 134, 135). Đếm lại: `grep -c '^| NT-' docs/NGHIEM-THU.md`.

## 3. Bảng đối chiếu tiêu chí cũ → mã NT

Mọi tiêu chí trong các nguồn dưới đây đã có mã; cột cuối = mã NT.

### 3.1 Bộ đo `check_ui.mjs --suite` (`tools/ui_media.mjs` CRIT / INFO) và `--sticky`

| Tiêu chí cũ (khóa) | NT |
|---|---|
| Ảnh hỏng (`broken`) | NT-20 |
| Chọn sai file (`wrong`) | NT-21 |
| Lệch theo DPR > 1 px (`dpr`) | NT-01 |
| Nhóm thẻ trộn thiếu khung (`mixed`) | NT-24 |
| Khung dự phòng không tên (`noname`) | NT-24 |
| Dải nổi bật lệch cao (`feats`) | NT-09, NT-10 |
| Ảnh lẻ lưới tiến độ (`photos`) | NT-29 |
| Bản đồ / lưới lệch cột chữ (`edge`) | NT-28 |
| Ô trống lưới bài (`postgrid`) | NT-07 |
| Meta ngắt "phút" (`meta`) | NT-54 |
| Khối trống (`empty`) | NT-04 |
| Bảng < 2 hàng (`table`) | NT-53 |
| Tràn ngang (`overflow`) | NT-02 |
| H1 ≠ 1 (`h1`) | NT-56 |
| Heading HOA (`caps`) | NT-55 |
| Khoảng trống > 30 % (`gaps`) | NT-03 |
| Ảnh nguồn thiếu độ phân giải (`lowres`, thông tin) | NT-22 |
| Ảnh mờ – cách đo cũ (`blurryOld`, thông tin) | thay bằng NT-21 + NT-22 (bẫy B-09) |
| Ô trống lưới khác (`gridinfo`, thông tin) | NT-08 |
| `--sticky`: đỉnh ≥ đáy header + 16, đáy ≤ màn − 16, nút tư vấn trong màn, không thanh cuộn ngoài mục lục, không đè footer | NT-60 |

### 3.2 `check_ui.mjs` chế độ từng trang (`audit`, `photoContrast`, `ui_layout.mjs`, `ui_gaps.mjs`)

| Tiêu chí cũ | NT |
|---|---|
| Tràn ngang (`overflow`) | NT-02 |
| Ảnh rỗng / không tải (`images`) | NT-20 |
| Tương phản chữ < AA (`contrast`) | NT-85 |
| Vùng bấm < 44 px (`targets`) | NT-86 |
| Khoảng trống > 30 % (`gaps`) | NT-03 |
| Bố cục (a) hàng lưới 1 thẻ ≤ 50 % | NT-06 |
| Bố cục (b) khung > 40 px trống | NT-04 |
| Bố cục (c) khung ảnh / bản đồ không có ảnh | NT-25 |
| Bố cục (d) khối liên hệ lặp | NT-14 |
| Bố cục (e) khung dự phòng không tên | NT-24 |
| CLS (đo trước khi cuộn) | NT-91 |
| Tương phản chữ trên ảnh hero (phân vị 98) | NT-42 |

### 3.3 34 tương tác (`tools/interactions.mjs`, thứ tự in kết quả)

| # | Tương tác | NT |
|---|---|---|
| 1–5 | Mega menu: rê chuột, đóng trễ 200 ms, bấm, có phân khu, Enter | NT-70 |
| 6–7 | Tab có / chưa có dữ liệu | NT-73 |
| 8–9 | "Nhận bảng giá" cuộn tới form, điền sẵn dòng | NT-74 |
| 10–11 | Thanh mục: bấm cuộn, tô mục đang xem | NT-72 |
| 12–13 | Thư viện: ảnh sau, lightbox | NT-75 |
| 14 | Không ảnh vỡ (The Privé) | NT-20 |
| 15 | Lăn chuột trên thư viện vẫn cuộn trang | NT-75 |
| 16–17 | Header ẩn / hiện, thanh mục theo header | NT-71 |
| 18 | Form báo lỗi khi bỏ trống, không gửi | NT-76 |
| 19 | Lọc /du-an/ Khu Đông | NT-77 |
| 20 | Không ảnh vỡ (/du-an/) | NT-20 |
| 21–22 | Chip lọc phân khu; chế độ "Theo loại sản phẩm" | NT-77 |
| 23 | Tìm kiếm Palm River | NT-78 |
| 24 | Mobile: menu mở | NT-79 |
| 25 | Mobile: thanh mục cuộn ngang | NT-72 |
| 26–28 | Mobile: CTA đáy ẩn đầu trang / hiện sau nút hero / ẩn lại | NT-79 |
| 29 | Breadcrumb mobile ≤ 2 dòng | NT-80 |
| 30 | "Đọc tiếp" | NT-57 |
| 31 | Thẻ cột phải mở form gọn | NT-74 |
| 32 | Gửi thử đủ trường ẩn | NT-76 |
| 33 | Bảng so sánh full-width, không cuộn ngang | NT-53 |
| 34 | /du-an/ "Theo phân khu & sản phẩm" | NT-77 |

### 3.4 On-page (`check_onpage.mjs`) và schema (`check_schema.mjs`)

| Quy tắc cũ | NT |
|---|---|
| title / meta (thiếu, dài, trùng) · `h1` · `heading` nhảy cấp · `robots` · `canonical` · `image` (alt, width/height) · `og` 1200×630 · `link` nofollow · `keyword` trùng · link nội bộ hỏng | NT-100 (ảnh: thêm NT-26; H1: NT-56) |
| Schema Markup Validator lỗi / cảnh báo · trường bắt buộc Google | NT-101 |
| Breadcrumb ↔ `BreadcrumbList` | NT-102 |

### 3.5 BRIEF.md

| Tiêu chí cũ | NT |
|---|---|
| Nghiệm thu: 301 một bước 100 %, 0 lỗi 404 | NT-130 |
| Nghiệm thu: Core Web Vitals mobile 10 trang | NT-91 (lab), NT-135 (field) |
| Nghiệm thu: 0 lỗi tương phản, vùng bấm, tràn ngang ở 7 khung; Safari iPhone kiểm tay | NT-85, NT-86, NT-02, NT-110 – X-08 |
| Nghiệm thu: schema hợp lệ; không title / meta trùng | NT-101, NT-100, NT-134 |
| Nghiệm thu: trường bắt buộc + ngày; mỗi bài 1 cụm + link dự án | NT-133 |
| Nghiệm thu: form gửi được, email, GA4 | NT-76, NT-132 |
| Nghiệm thu: 8 đường dẫn ứng dụng, 10 bot AI | NT-131 |
| Ngân sách: LCP ≤ 2,0 s, INP ≤ 200 ms, CLS ≤ 0,05, TTFB ≤ 300 ms, JS ≤ 60 KB nén, CSS ≤ 50 KB, font ≤ 3, ảnh đầu trang ≤ 150 KB | NT-91, NT-94, NT-95 (TTFB: NT-91 ghi chú – đo khi có cache ở giai đoạn 5) |
| UX: tương phản 4,5:1, vùng bấm 44, focus, phóng to, chữ ≥ 17 px, không tràn, form có nhãn + lỗi tại ô + bàn phím số | NT-85, NT-86, NT-87, NT-59, NT-02, NT-76 |
| Kỹ thuật ảnh: srcset, AVIF/WebP, lazy trừ đầu trang, khai báo kích thước; bản đồ / video ảnh tĩnh trước | NT-21, NT-26, NT-25 |
| Hiệu ứng: hiện dần 250–400 ms, ảnh phóng 1,03 khi rê, View Transitions, tắt khi reduced-motion; không parallax / slider tự chuyển / popup | NT-87 (reduced-motion), NT-50 (rê thẻ), soát mắt chung NT-13 |
| Template trang chính (một hành động chính ở màn hình đầu), bài viết, dự án, chủ đầu tư | NT-46, NT-64, NT-12, NT-44 |
| Heading: đúng 1 H1, không nhảy cấp, tiêu đề khối theme không dùng heading | NT-56, NT-100 |

### 3.6 DESIGN.md

| Mục | NT |
|---|---|
| Màu, tương phản | NT-85 |
| Typography (Playfair ≥ 26/28 px, thang chữ, 68 ký tự, không viết HOA) | NT-59, NT-55 |
| Layout (khung 1200/1320, lề, điểm chuyển) | NT-05 |
| Hero A (phủ cục bộ, ≥ 60 % sáng, chữ ≥ 4,5:1, thành phần, mobile 4:3) | NT-41–44 |
| Form gọn, khối Nhận tư vấn 2 cột | NT-76, NT-15 |
| Bố cục 2 cột & nhịp, khối tối, liên hệ 1 lần, danh sách ≤ 2, thanh mục ≤ 8, khoảng trống | NT-16, NT-13, NT-14, NT-06, NT-12, NT-03 |
| Ảnh nét (khung không phụ thuộc DPR, phóng cắt, sizes, khung dự phòng, bộ đo) | NT-01, NT-21–24 |
| Đầu mục section | NT-11 |
| Ảnh: tỉ lệ cố định, góc vuông, chú thích | NT-31, NT-37, NT-35 |
| Header & menu | NT-70, NT-71, NT-79 |
| Thẻ | NT-50, NT-09 |
| Khi thiếu dữ liệu | NT-51 – X-05 |
| Thanh thông tin nhanh, bảng thông số / so sánh, tab, listing, thư viện, bản đồ, timeline tiến độ, ảnh tiến độ, chip hero | NT-52, NT-53, NT-73, NT-77, NT-27, NT-34, NT-29, NT-28, NT-45 |
| Nội dung & tin cậy (bố cục bài, mục lục, FAQ, hộp tác giả, công bố) | NT-60, NT-61, NT-63, NT-64 |
| CTA dính đáy & footer | NT-79 |
| Ngân sách hiệu năng | NT-91, NT-94 |

### 3.7 CLAUDE.md / SCOPE.md

| Tiêu chí cũ | NT |
|---|---|
| Kiểm chứng bằng ảnh trước / sau (desktop + mobile) | NT-120 |
| Template mới chụp ở 7 khung 360–1920 | NT-02, NT-85, NT-86 – X-08 |
| Không thêm thư viện JS, không jQuery | NT-94 |
| 7 ứng dụng giữ nguyên | NT-131 |

### 3.8 Báo cáo các vòng

| Vòng · mục | NT |
|---|---|
| r5 bài test 5 giây (A–D) | NT-46 |
| r5 khoảng trống > 30 %, thanh mục không hở khi header ẩn / hiện | NT-03, NT-71 |
| r6 mục 0 (cuộn thật, bố cục a–e) | NT-04, NT-06, NT-14, NT-24, NT-25 |
| r6 mục 1–2 (ảnh The Privé, bản đồ theo cây) | NT-20, NT-25 |
| r6 mục 3 (hộp "Nằm trong" có ảnh) | NT-36 |
| r6 mục 4 (ảnh thẻ có chữ đè) | NT-31 |
| r6 mục 5 (chú thích tự sinh) | NT-37 |
| r6 mục 6 (hero phủ cục bộ) | NT-43, NT-42 |
| r6 mục 7–8 (CTA mobile, breadcrumb) | NT-79, NT-80 |
| r6 mục 9 (khung 1200 / 1320) | NT-05 |
| r6 mục 10–11 (form, khối Nhận tư vấn) | NT-76, NT-15 |
| r6 mục 12 (dải nổi bật mọi dự án có ảnh) | NT-10 |
| r6 mục 13 (dải trống trước form) | NT-15, NT-04 |
| r6 mục 14 (Góc nhìn CEO mobile trượt ngang ~1,2 thẻ) | NT-06 (lưới), soát mắt NT-50 |
| r6 mục 15–18 (thứ tự section, so sánh full-width, bài liên quan cũ, khung trắng) | NT-12, NT-53, NT-58, NT-13 |
| r6 mục 19–21 (thẻ cột phải, thanh thông tin, tiêu đề trùng ý) | NT-74, NT-52, NT-58 |
| r6 mục 22–24 (bảng nội dung 100 %, /du-an/ theo phân khu, trang chính liên hệ 1 lần) | NT-53, NT-77, NT-14 |
| r7 mục 1 (ảnh nét – nay thay bằng r8) | NT-21, NT-22 |
| r7 mục 2 (thư viện tải trước, ảnh hỏng bị bỏ khỏi thư viện) | NT-27, NT-20 |
| r7 mục 3–4 (khung dự phòng có tên) | NT-24 |
| r7 mục 5 (so sánh < 2 hàng ẩn) | NT-53 |
| r7 mục 6 (một bản đồ) | NT-34 |
| r7 mục 7 (ảnh tiến độ dạng lưới, bấm phóng) | NT-29 |
| r7 mục 8 (cột phải bài dính) | NT-60 |
| r7 mục 9 (mũi tên dải dự án) | NT-10 |
| r7 mục 10 (khối "Về Velis" trích nguyên văn ≤ 60 từ) | NT-51 (không tự viết chữ mới), test `velis_sentence_run` |
| r7 mục 11 (bỏ bóng chữ hero mobile) | NT-44 |
| r8 mục 1–16 | NT-01, NT-23, NT-21, NT-21/NT-22 (đo), NT-22/NT-35, NT-30, NT-10, NT-24, NT-07, NT-54, NT-28, NT-29, NT-27, NT-45, NT-60, NT-63 |
| Sau r8 (người soát): hero thành mảng mờ có cạnh; thẻ dự án cột phải thiếu tên; mục lục < 5 dòng; ngân sách hiệu năng; CSS; Safari / DPR 1,5 / 3 | NT-41, NT-62, NT-61, NT-90–93, NT-94, NT-110, NT-111 |

## 4. Xung đột cần người dùng quyết (chưa tự chọn)

| Mã | Mâu thuẫn | Phương án |
|---|---|---|
| X-01 | **Độ nét ↔ dung lượng ảnh.** NT-21 (file ≥ khung × DPR × phóng × tỉ lệ cắt) đẩy trang chủ lên 923 KB ảnh, Lighthouse 88; NT-90 (≥ 90), NT-92 (≤ 400 KB màn đầu), NT-93 (≤ 1 MB trang chủ), NT-95 (ảnh đầu ≤ 150 KB – BRIEF) | (a) Độ nét trước, nới ngân sách: màn đầu ≤ 600 KB, trang chủ ≤ 1,5 MB, LCP vẫn ≤ 2,5 s. (b) Ngân sách trước: trần DPR hiệu dụng 1,5 cho ảnh ngoài màn đầu (ảnh lazy dùng file khung × min(DPR, 1,5)), chấp nhận hơi mềm ở DPR 2. (c) AVIF + chất lượng 70 cho cỡ ≥ 1600 (giảm ~30–40 % dung lượng; cần bật AVIF trên hosting) rồi giữ nguyên NT-21. (d) Chỉ ảnh LCP giữ độ nét đầy đủ, mọi ảnh khác cỡ theo khung × DPR không nhân biên 1,15 |
| X-02 | **Hero tràn rộng ↔ ảnh dưới chuẩn.** 8 ảnh hero hiện 1200 px (cần ≥ 1920) | (a) Giữ hero tràn rộng, chấp nhận mờ cho tới khi có bản gốc (`data/anh-can-ban-goc.csv`). (b) Ảnh dưới chuẩn dùng kiểu hero dự phòng (`CHUAN-ANH.md` mục 3.1) cho tới khi có bản gốc. (c) Hoãn ra mắt dự án có hero dưới chuẩn |
| X-03 | **Ẩn watermark bằng cắt khung ↔ mất mép ảnh.** Phóng 1,12–1,15 neo góc phải trên cắt 10,7–13 % mép trái và đáy; mặt bằng / bản đồ / ảnh có chữ bị mất nội dung mép | (a) Giữ cắt khung cho ảnh có huy hiệu, không cắt ảnh sạch (cần cờ "có dấu" từng ảnh – `data/kiem-ke-anh-mat.csv`). (b) Không cắt; thay toàn bộ ảnh có huy hiệu bằng bản gốc sạch trước ra mắt. (c) Không cắt, chấp nhận huy hiệu (thương hiệu Velis) – ngược NT-23 |
| X-04 | **Bảo vệ ảnh ↔ ảnh sạch.** Nếu không in huy hiệu thì bảo vệ bản quyền bằng gì | xem `CHUAN-ANH.md` mục 2.3 (≥ 2 phương án) |
| X-05 | **Giá khi thiếu dữ liệu.** DESIGN: "Giá là ngoại lệ: luôn hiện, chữ mờ khi chưa công bố"; TEMPLATES vòng sửa 2: "Thẻ: không còn dòng Giá: chưa công bố" | (a) Thẻ không hiện dòng giá, trang dự án hiện "Chưa công bố" ở thanh thông tin. (b) Luôn hiện ở mọi nơi (chữ mờ) |
| X-06 | **Ô trống ở lưới khác** (NT-08: `/du-an/` 6 thẻ / 4 cột, phân khu VSP 3 / 2 cột, `/chu-dau-tu/` 7 thẻ) | (a) Chỉ báo, không lỗi. (b) Lỗi như NT-07; lấp bằng thẻ "Xem tất cả" / đổi số cột theo số thẻ |
| X-07 | **Ngân sách CSS** 51 200 byte đã sát trần, phải gộp khai báo mới thêm được | (a) Giữ 51 200 cho bước 3. (b) Đặt lại ở bước 3 sau khi viết lại (đề xuất ≤ 45 KB min, ≤ 12 KB gzip) |
| X-08 | **Màn hình kiểm.** CLAUDE.md / BRIEF: 7 khung 360–1920; bước này: ma trận 5 màn M1–M5 | (a) Ma trận 5 màn cho ảnh mốc + soát mắt; 7 khung giữ cho kiểm tự động tràn ngang / tương phản / vùng bấm. (b) Chỉ ma trận 5 màn |
| X-09 | **GA4 trên staging.** GA4 đã gỡ khỏi staging (ngày 1) nên NT-76 không kiểm được `generate_lead` trước ra mắt | (a) Kiểm bằng GA4 DebugView trên staging với property thử. (b) Kiểm ngày ra mắt (NT-132) |

## 5. Bẫy đo đã gặp – và cách đo đúng

| Mã | Bẫy | Cách đo đúng |
|---|---|---|
| B-01 | `img.naturalWidth` của ảnh có srcset w-descriptor đã quy đổi theo `sizes` → luôn ra "đủ nét" (file 900 px báo 568) | Bề rộng file thật: nạp `currentSrc` vào `new Image()` rồi đọc `naturalWidth`; hoặc hậu tố `-{W}x{H}` trong tên file; file gốc không hậu tố → `media_details` qua REST |
| B-02 | Khung `cover`: bề rộng file cần không chỉ là bề rộng khung | cần = max(bề rộng khung, chiều cao khung × tỉ lệ ảnh) × DPR × hệ số phóng; đo khung bằng layout (bỏ transform) |
| B-03 | Ảnh lazy chưa tải khi đo / chụp; ảnh tải xong nhưng chưa vẽ | Cuộn thật hết trang (bước ≤ 0,6 màn, chờ 150 ms), chờ mọi `img.complete`, cuộn về đầu chờ ≥ 900 ms (header trở lại cỡ đầy đủ), rồi mới đo / chụp |
| B-04 | Chụp phần tử cao bị ghép; chụp riêng thẻ `<img>` đang phóng kéo theo phần tràn ra ngoài khung | Chụp **khung chứa** (`.v-card__media`, `.v-hero--full`, `li` thư viện…), hoặc `clip` theo hộp section trên ảnh `fullPage` |
| B-05 | Header dính / thanh tab dính / cột dính đè lên ảnh hoặc bị ẩn khi chụp | Ảnh trước/sau ghi rõ: ẩn `.v-header`, `.v-secnav`, `.v-sticky-cta` (visibility hidden); riêng ảnh cột phải bài viết **giữ** header vì tiêu chí là vị trí so với header (`tools/shots_r8.mjs`) |
| B-06 | `<details>` đóng bị tính là khối trống | Bỏ qua phần tử trong `details:not([open])` trừ `summary` (`shown()` trong `ui_media.mjs`) |
| B-07 | Trang test thiếu `charset=utf-8` → chữ tiếng Việt sai mã, quy tắc tìm "phút" không chạy | Route test luôn `contentType: 'text/html; charset=utf-8'` (`tools/tests/ui-media.test.mjs`) |
| B-08 | DevTools chiếm chỗ làm hẹp viewport; Chrome làm chậm hẹn giờ (timer throttling) khi cửa sổ bị che → hiệu ứng / lazy chạy khác | Soát mắt với cửa sổ không bị che, DevTools tách cửa sổ riêng; đo tự động bằng Playwright headless với viewport cố định |
| B-09 | Cách đo cũ cho phép biên 1,15 (khung × DPR ≤ file × 1,15) → che 567 trường hợp ảnh thiếu độ phân giải trên bản 835ae96 | Không biên; tách "chọn sai file" (NT-21, lỗi giao diện) khỏi "ảnh nguồn nhỏ" (NT-22, cần ảnh gốc) |
| B-10 | Hiệu ứng header (0,2 s) đang chạy khi đo cột dính → vi phạm giả | Chờ ≥ 350 ms sau mỗi bước cuộn (`runSticky`) |
| B-11 | Chromium chọn file **nhỏ hơn** mức cần khi DPR > 1 và mật độ nằm dưới trung bình nhân hai cỡ liền kề | Đo bằng file thật (B-01); `sizes` có biên 1,15 ≥ √1,28 (bước lớn nhất giữa hai cỡ từ 600 px) |
| B-12 | Bộ lọc ảnh nội dung (`wp_content_img_tag`) chạy cả trên HTML template (hero) | Chỉ xử lý khi `$context === 'the_content'` |
| B-13 | Đo chiều cao `li` trong lưới một hàng (luôn bằng nhau) thay vì thẻ bên trong | Đo phần tử nhìn thấy (`.v-feat`), không đo ô lưới |
| B-14 | Màn hình chờ (loader) / hộp cookie che trang khi chụp site ngoài | Chờ ≥ 6–12 s, bấm nút đồng ý cookie rồi chụp (`docs/THAM-CHIEU.md`) |
| B-15 | So kết quả "trước / sau" đo bằng hai phiên bản bộ đo khác nhau | Ghi phiên bản bộ đo trong báo cáo; khi đổi quy tắc, đo lại cả bản "trước" nếu còn triển khai được, không thì ghi rõ |

## 6. Nhật ký

| Ngày | Mã | Thay đổi | Duyệt |
|---|---|---|---|
| 2026-11-05 | NT-01 → NT-135, X-01 → X-09, B-01 → B-15 | Lập danh sách (Đổi cách làm bước 1) | chờ người dùng duyệt |
