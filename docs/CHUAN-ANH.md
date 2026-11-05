# Chuẩn ảnh đầu vào

Lập 2026-11-05 (Đổi cách làm, bước 1). Đặc tả **độc lập với ảnh đang có**: ảnh hiện tại phần lớn đã bị resize về ngang 1200 px
trước khi upload, khác nhau về tỉ lệ, có huy hiệu VELIS và chữ in sẵn (`docs/KIEM-KE-ANH.md`), nên **không** suy kiểu hero hay
bố cục từ ảnh hiện tại. Tiêu chí liên quan: NT-21, NT-22, NT-23, NT-31, NT-32, NT-33, NT-35, NT-40 (`docs/NGHIEM-THU.md`).
Hướng dẫn ngắn cho người gửi ảnh: `docs/HUONG-DAN-GUI-ANH.md`.

## 1. Cỡ tối thiểu theo vị trí

Cỡ tối thiểu = khung lớn nhất trong ma trận màn hình chuẩn (M1 1366×768 DPR 1 · M2 1536×864 DPR 1,25 · M3 1920×1080 DPR 1 ·
M4 960×540 DPR 2 · M5 390×844 DPR 2) × DPR, tính bằng điểm ảnh thật; trần 2560 (WordPress sinh cỡ tới 2560, ảnh lớn hơn được
giữ làm bản gốc `-scaled`). Ảnh **không có dấu** nên không còn hệ số phóng 1,12–1,15.

Khung đo theo bố cục hiện tại (khung nội dung 1200 px, từ 1600 px là 1320; cột chính trang 2 cột = khung − 388; cột chữ 720;
M4 dưới 1024 px nên mọi khối thành một cột rộng 912 px CSS = 1824 điểm ảnh). Bước 3 đổi bố cục thì tính lại bảng này
(cùng bảng `STD` trong `tools/kiem_ke_anh.mjs` – có test giữ hai bên khớp nhau).

| Mã vị trí | Vị trí | Tỉ lệ khung | Khung lớn nhất (điểm ảnh) | **Cỡ tối thiểu** | Vùng an toàn chủ thể | Vùng chữ đè |
|---|---|---|---|---|---|---|
| `hero-trang-chu` | Hero trang chủ | 16:9 gốc; hiển thị 2,1–2,8:1 desktop, 4:3 mobile | M2/M3/M4: 1920 rộng; M4 cao 907 | **1920×1080** (đề xuất 2560×1440) | 60 % giữa theo ngang, 70 % giữa theo dọc (ảnh bị cắt trên/dưới ở desktop, hai bên ở mobile) | góc trái dưới ≤ 46 % ngang × 45 % dọc: nền trời / mặt nước / mảng tối, không chi tiết quan trọng |
| `hero-du-an` | Hero dự án | như trên (~60vh) | như trên | **1920×1080** | như trên | như trên |
| `hero-phan-khu` | Hero phân khu | như trên | như trên | **1920×1080** | như trên | như trên |
| `hero-b` | Hero trang tổng / Giới thiệu (chia đôi) | 4:3 | M4: 1824×1368 (một cột) | **1920×1440** | 80 % giữa | không chữ đè |
| `the` | Thẻ dự án / phân khu | 4:3 | M4 thẻ ngang 1014 rộng; lưới 2 cột 888×666 | **1200×900** | 75 % giữa theo ngang (ảnh 16:9 bị cắt hai bên) | không |
| `dai-noi-bat` | Dải dự án nổi bật (ảnh nhỏ) | ≈ 13:9 | 208×144 | **400×300** | 70 % giữa | không |
| `anh-dai-dien-bai` | Ảnh đại diện bài (thẻ bài + đầu bài + OG) | 16:9 | đầu bài 720 CSS × 2 = 1440×810 | **1600×900** | 75 % giữa (thẻ 4:3, OG 1,91:1 cắt từ ảnh này) | không |
| `the-bai-viet` | Thẻ bài viết | 16:9 nguồn → 4:3 | như `the` | **1600×900** | như trên | không |
| `thu-vien` | Thư viện | 16:9 desktop, 3:2 mobile | M4: 1824×1026 | **1920×1080** | 85 % giữa | không |
| `tien-do` | Ảnh tiến độ | 4:3 | 1 ảnh = 720 CSS × 2 = 1440×1080 | **1440×1080** | 80 % giữa | không; ngày chụp ghi ở chú thích, không in lên ảnh |
| `mat-bang` | Mặt bằng (bấm phóng to) | tự do | đọc được chữ khi phóng: cạnh dài ≥ 2000 | **cạnh dài 2000** | toàn bộ (hiện `contain`) | chú thích trong bản vẽ được phép |
| `ban-do` | Bản đồ vị trí | 16:9 | cột chữ 720 × 2 = 1440, cao 690 | **1600×900** | ghim ở giữa ± 20 % | nhãn bản đồ được phép |
| `anh-noi-dung` | Ảnh trong nội dung | tự do | cột chữ 720 × 2 = 1440 rộng | **1440 rộng** | – | không chữ in sẵn (trừ sơ đồ) |
| `anh-dau-bai` | Ảnh đầu bài (riêng) | 16:9 | 1440×810 | **1600×900** | 75 % giữa | không |
| `cot-phai` | Thẻ "Nhận bảng giá" cột phải | 16:9 | M2: 425×239 | **800×450** | 75 % giữa | không |
| `ve-velis` | Khối "Về Velis" (trang chủ) | 4:3 | M4: 1824×1368 | **1920×1440** | 80 % giữa | không |
| `nam-trong` | Khối "Nằm trong" | 4:3 | 240×180 | **480×360** | 70 % giữa | không |
| `og` | Ảnh chia sẻ (Open Graph) | 1,91:1 | 1200×630 | **1200×630** (cắt từ ảnh đại diện) | 75 % giữa | logo chỉ ở bản OG riêng nếu cần |

Ghi chú: một ảnh dùng ở nhiều vị trí phải đạt cỡ lớn nhất trong các vị trí đó. Ảnh dự án nên gửi ngang 16:9 ≥ 2560×1440 để
dùng được cho mọi vị trí trừ `hero-b`, `ve-velis` (4:3 ≥ 1920×1440) và mặt bằng.

## 2. Định dạng, dung lượng, nội dung ảnh

### 2.1 Tệp gốc
- **JPG chất lượng cao** (≥ 90, sRGB) cho ảnh chụp / phối cảnh; **PNG** cho mặt bằng, sơ đồ, bản đồ. Không gửi WebP đã nén, không
  chụp màn hình, không ảnh lấy từ Zalo / Facebook (đã bị nén và thu nhỏ).
- **Không resize trước khi upload.** WordPress tự sinh các cỡ 150 / 300 / 600 / 768 / 900 / 1024 / 1536 / 1600 / 2000 / 2048 / 2560 (và 1200×630 cho ảnh chia sẻ);
  ảnh lớn hơn 2560 được giữ nguyên làm bản gốc và tạo bản `-scaled` 2560.
- Dung lượng tối đa khi upload: **đề xuất 15 MB / ảnh** (phối cảnh gốc của CĐT thường 4,7–5,5 MB); cần xác nhận giới hạn
  `upload_max_filesize` trên hosting trước khi nhập hàng loạt.
- Giữ metadata bản quyền (IPTC Copyright / Credit) nếu có; không cần EXIF máy ảnh.

### 2.2 Nội dung
- **Không watermark, không huy hiệu, không logo, không chữ in sẵn** trên ảnh dùng cho hero, thẻ, thư viện, cột phải, "Về Velis",
  ảnh đại diện bài. Chữ thuộc cảnh thật (biển tên tòa nhà) được phép.
- Không poster / tờ rơi / infographic ở các vị trí trên (dùng ở nội dung hoặc tải về PDF). Mặt bằng và bản đồ được có chữ của bản vẽ.
- Một chủ thể rõ, nằm trong vùng an toàn của vị trí; hero cần một mảng yên (trời, nước, mảng tối) ở góc trái dưới cho khối chữ.
- Ảnh phối cảnh ghi nguồn (CĐT); ảnh thực tế (tiến độ) ghi ngày chụp và người chụp trong chú thích, không in lên ảnh.

### 2.3 Bảo vệ ảnh khi không in dấu (người dùng quyết – X-04)

| Phương án | Cách làm | Được | Mất |
|---|---|---|---|
| A. Ảnh sạch + bản quyền trong metadata và điều khoản | Ghi IPTC Copyright / Credit "Velis Realty" hoặc tên CĐT; chân trang ghi điều khoản sử dụng ảnh | Ảnh đẹp nhất, không phải cắt khung, không tốn phí | Người khác vẫn tải được; chỉ có căn cứ khi tranh chấp |
| B. Bản sạch cho website, bản có dấu cho mạng xã hội / Zalo | Xuất hai bản khi nhận ảnh; website chỉ nhận bản sạch | Mạng xã hội (nơi hay bị lấy ảnh) vẫn có dấu | Thêm một bước xuất ảnh mỗi lần |
| C. Dấu chìm vô hình (dịch vụ trả phí, ví dụ Digimarc) | Nhúng mã vào điểm ảnh, dò bản sao trên web | Không thấy bằng mắt, có thể truy vết | Có phí; không ngăn được việc tải; cần thêm công cụ |
| D. Dấu nhỏ đặt trong vùng an toàn luôn bị cắt (sát mép trên–phải của khung 16:9) | Quy định vị trí dấu theo vùng cắt từng vị trí | Ít lộ | Vị trí cắt khác nhau theo màn hình nên không bảo đảm 0 dấu (ngược NT-23) |

Lưu ý: dù chọn phương án nào, WordPress vẫn lưu bản gốc có URL công khai; "không phát hành bản gốc" cần thêm quy tắc chặn
truy cập file `-scaled` gốc (ghi `.htaccess` – phải duyệt riêng theo SCOPE.md).

### 2.4 Tên file và alt
- Tên file: chữ thường, không dấu, gạch ngang, `{du-an}-{noi-dung}-{so}.jpg` – ví dụ `the-prive-phoi-canh-toan-canh-01.jpg`,
  `persa-place-tien-do-2026-03-01.jpg`, `palm-river-mat-bang-can-2pn.png`. Không dùng tên máy ảnh (`IMG_1234`), không dấu cách.
- Alt: mô tả điều nhìn thấy + tên dự án, ≤ 125 ký tự, không mở đầu bằng "Hình ảnh", không nhồi từ khóa – ví dụ "Phối cảnh The
  Privé nhìn từ sông Giồng Ông Tố lúc hoàng hôn".
- Chú thích: phối cảnh "Phối cảnh minh họa – nguồn: {CĐT}"; ảnh thực tế "Ảnh thực tế tháng {mm/yyyy} – {nguồn}".

## 3. Hiển thị khi ảnh KHÔNG đạt chuẩn (bước 3 làm theo; tiêu chí NT-32, NT-33, NT-40)

Nguyên tắc chung (đã chốt): **kiểu hiển thị do cỡ và tỉ lệ của FILE quyết định, ở phía server**, giống nhau trên mọi màn hình và
DPR; không bao giờ kéo giãn quá hệ số 1,5 so với file. Mỗi quy tắc dưới đây có ≥ 2 phương án – người dùng chọn.

### 3.1 Hero dưới chuẩn (file < 1920 rộng)

Hệ số kéo giãn ở M2/M3/M4 (1920 điểm ảnh) = 1920 / bề rộng file; ≤ 1,5 ⇔ file ≥ 1280. Ảnh hero hiện tại đều 1200 px (hệ số 1,6).

| Phương án | File ≥ 1920 | 1280 ≤ file < 1920 | File < 1280 (8 hero hiện tại) | Cái giá |
|---|---|---|---|---|
| H-A | Hero A tràn toàn khung | Hero A tràn (kéo ≤ 1,5, hơi mềm ở màn 2×) | **Hero dải**: khung cao cố định, ảnh rộng tối đa = file (không kéo giãn) đặt bên phải, nền tối liền màu bên trái chứa khối chữ – cùng một kiểu ở mọi màn | Màn rộng thấy nền tối hai bên ảnh; cần thiết kế dải ở mockup bước 2 |
| H-B | Hero A | Hero A | **Hero chia đôi** (kiểu hero B): chữ trên nền ngà bên trái, ảnh 4:3 bên phải | Trang dự án mất cảm giác "ảnh lớn"; đồng bộ với trang tổng |
| H-C | Hero A | Hero A | **Hero chữ** (không ảnh, nền tối + tên chìm như hero hiện có khi thiếu ảnh), ảnh đưa xuống thư viện | Ấn tượng thấp nhất; tránh hoàn toàn ảnh mờ |

### 3.2 Tiêu điểm (focal point) cho mọi tỉ lệ đầu vào

| Phương án | Cách làm | Cái giá |
|---|---|---|
| F-A | Trường tiêu điểm x/y (%) cho từng ảnh trong velis-data (bấm chọn điểm trên ảnh trong wp-admin); theme dùng làm `object-position` cho mọi khung | Viết thêm một ô chọn điểm (JS nhỏ trong wp-admin); mỗi ảnh mất 5 giây đặt điểm |
| F-B | 9 vị trí định sẵn (trái / giữa / phải × trên / giữa / dưới) chọn bằng danh sách thả xuống | Ít chính xác hơn; không cần JS |
| F-C | Mặc định giữa ảnh, chỉ đặt ngoại lệ bằng F-B | Nhanh nhất; ảnh lệch chủ thể bị cắt sai đến khi có người phát hiện |

### 3.3 Ảnh có watermark / huy hiệu / chữ in sẵn (đang là hầu hết ảnh – `KIEM-KE-ANH.md`)

| Phương án | Cách xử lý từng vị trí | Cái giá |
|---|---|---|
| W-A (hiện tại) | Phóng 1,12 (hero, ảnh đầu bài, nội dung) / 1,15 (thẻ, thư viện, tiến độ, cột phải…) neo góc phải trên → cắt mép trái và đáy; che được cả huy hiệu trái dưới (đa số) lẫn trái trên (ảnh Vinhomes cũ) vì huy hiệu nằm trong 9 % mép trái | Mất 10,7–13 % mép; file cần lớn hơn 12–15 % (nặng hơn, NT-92/93); ảnh có chữ in sẵn vẫn lộ chữ; mặt bằng / bản đồ không cắt được |
| W-B | Ảnh có dấu không dùng ở hero / thẻ / cột phải; dùng khung dự phòng có tên (thẻ) hoặc kiểu hero dự phòng (3.1) đến khi có ảnh sạch; thư viện / nội dung vẫn hiện ảnh (cắt như W-A) | Gần như mọi thẻ thành khung tên cho tới khi có ảnh gốc |
| W-C | Thay toàn bộ ảnh có dấu bằng bản gốc sạch trước ra mắt (danh sách `data/anh-can-ban-goc.csv`); không cắt | Phụ thuộc thời gian lấy ảnh từ CĐT; dự án thiếu ảnh dời ra mắt |

Quy tắc cứng (không phụ thuộc phương án): ảnh poster / tờ rơi / có chữ chiếm > 5 % diện tích **không** dùng ở hero, thẻ, cột
phải; chỉ dùng trong nội dung hoặc thư viện (hiện trọn, `contain`).

### 3.4 Ảnh nhỏ hơn khung ở vị trí khác

| Vị trí | Phương án 1 | Phương án 2 |
|---|---|---|
| Thẻ | Kéo giãn ≤ 1,5 (file ≥ 800 cho khung 1200); dưới đó khung dự phòng có tên | Luôn dùng ảnh, chấp nhận mềm |
| Thư viện | Ảnh hiện bằng cỡ file, căn giữa trên nền tối của section (không dải sáng – NT-27) | Bỏ ảnh dưới 1280 khỏi thư viện |
| Nội dung | Hiện bằng cỡ file, căn giữa (đang làm – `.v-crop`) | Kéo tới cột chữ nếu ≤ 1,5 |

## 4. Quy trình nhập ảnh

1. Nhận bản gốc theo `HUONG-DAN-GUI-ANH.md` (đúng tỉ lệ, không dấu, không resize).
2. Đặt tên file theo 2.4; upload vào Thư viện Media trên **staging** (bản gốc, một lần).
3. WordPress tự sinh các cỡ tới 2560 (ngưỡng `big_image_size_threshold`; ảnh lớn hơn thành `-scaled`).
4. Chạy kiểm tra: `VIEW_PASSWORD_FILE=… node tools/kiem_ke_anh.mjs collect <cache>` rồi `… report <cache>` – ảnh phải "Đạt" ở mọi
   vị trí được dùng; soát dấu bằng mắt trên tờ ảnh `docs/kiem-ke-anh/` và ghi `data/kiem-ke-anh-mat.csv`.
5. Đặt tiêu điểm (3.2), alt, chú thích; gắn vào dự án / bài.
6. Khi ra mắt: chuyển ảnh cùng nội dung sang site thật theo kế hoạch ra mắt.

## 5. Nhật ký

| Ngày | Thay đổi | Duyệt |
|---|---|---|
| 2026-11-05 | Lập chuẩn (bước 1) | chờ người dùng duyệt |
