# Quy tắc nội dung bắt buộc

Áp dụng cho mọi việc trong `content/` (phân tích mẫu, soạn guide, viết bài). Người dùng chốt 2026-11-05.
Thứ tự ưu tiên khi mâu thuẫn: `BRIEF.md` → file này → `content/guide/*` → `docs/`.

## 1. Chỉ học kỹ thuật

Website trong `content/samples/` là của công ty khác. Chỉ học **kỹ thuật**: cấu trúc trang, cách tổ chức slug,
sitemap, liên kết nội bộ, cách trình bày thông tin, nhịp văn.

## 2. Tuyệt đối không lấy về cho Velis bất cứ thứ gì thuộc thương hiệu của họ

- tên công ty, tên thương hiệu, slogan, tagline, khẩu hiệu, USP;
- tên tác giả, byline, chức danh, chữ ký, lời giới thiệu bản thân;
- hotline, email, địa chỉ, tên nhân viên, cam kết dịch vụ riêng của họ;
- câu chữ nguyên văn, số liệu, giá, đánh giá, hình ảnh.

Trong file phân tích chỉ mô tả bằng lời của mình; trích ví dụ tối đa 1 câu ngắn và ghi rõ
"ví dụ của đối thủ, không dùng". Số liệu/giá dự án cho bài Velis phải lấy từ nguồn gốc (chủ đầu tư, văn bản pháp lý,
dữ liệu thật trên velisrealty.vn), không lấy từ site đối thủ.

## 3. Người viết

Người viết toàn bộ nội dung Velis là **CEO Velis Realty – Vũ Xuân** (họ tên đầy đủ: Vũ Thanh Xuân, người dùng xác nhận 2026-11-05;
nguồn: `BRIEF.md`; trang tác giả `/chuyen-gia/vu-xuan/`).
Tiểu sử CEO cho Velis phải viết mới; không chép lời giới thiệu trên site đối thủ. Kinh nghiệm cũ chỉ mô tả chung
("từng quản lý sàn tại một đơn vị phân phối"), không nêu tên đơn vị cũ hay tên sàn cũ (người dùng duyệt 2026-11-05).
Không dùng tên, chức danh hay lời giới thiệu của bất kỳ ai khác. Thông tin CEO chưa có trong repo (tiểu sử, năm kinh nghiệm…)
thì ghi TODO và hỏi người dùng, không tự đặt.

## 4. Quét trước khi commit

Trước khi commit bất kỳ bài viết nào: quét bài theo danh sách cấm ở mục 9 (không phân biệt hoa thường, cả dạng không dấu).
Có trùng thì sửa, không được commit. Lệnh (bỏ dấu, không phân biệt hoa thường, số điện thoại so theo dãy số; thoát mã 1 nếu trùng):

```bash
python3 -I content/guide/scan_banned.py <file-bài> [...]
```

Ngoại lệ: `content/samples/` (tài liệu phân tích đối thủ) được phép nhắc tên domain đối thủ để định danh nguồn,
nhưng phần "áp dụng cho Velis" thì không.

## 5. Nhận định và trải nghiệm của anh Xuân (người dùng chốt 2026-11-05)

- Claude tự viết phần nhận định và trải nghiệm, **ngôi thứ nhất** của Vũ Xuân, theo giọng `docs/VOICE.md`; được kể trải nghiệm
  thực tế (dẫn khách xem nhà mẫu, tư vấn, giao dịch, theo dõi tiến độ…). **Không cần đánh dấu** trong bài.
- Ràng buộc duy nhất: chi tiết trong câu chuyện **không được mâu thuẫn** với dữ kiện trong `BRIEF.md`, `docs/BRAND.md` và facts
  (`data/architecture/*.csv`: loại căn, hướng, tiện ích, pháp lý, tiến độ…). Không chắc một chi tiết có đúng không → bỏ chi tiết đó.
- Con số trong câu chuyện cũng theo mục 6 (không có con số ngoài dữ liệu được cung cấp).
- Thay cho câu "chỉ dùng tình huống có thật do chủ site cung cấp" trong `docs/VOICE.md`.

## 6. Số liệu (người dùng chốt 2026-11-05)

- Số liệu được người dùng **cung cấp trước mỗi đợt viết**. Chỉ dùng số có trong: dữ liệu được cung cấp cho đợt đó, `BRIEF.md`,
  facts (`data/architecture/*.csv`).
- Thiếu số nào → **liệt kê và hỏi người dùng TRƯỚC khi viết**. Không tự điền, không ước lượng, không làm tròn khác nguồn.
- Bỏ quy tắc gắn mã `[XN-n]` (thay cho đoạn tương ứng trong `docs/VOICE.md`).

## 7. Tháng/năm trong title (người dùng chốt 2026-11-05)

- Mặc định không gắn tháng/năm vào title, H2, anchor (BRIEF, `content/samples/SUMMARY.md` mục C).
- **Ngoại lệ: bài tin tiến độ** được gắn tháng/năm trong title (ví dụ dạng "Tiến độ {dự án} tháng MM/YYYY").
- Title 45–60 ký tự, meta description 120–155 ký tự (người dùng chốt 2026-11-05).

## 8. Checklist trước khi commit một bài

1. `python3 -I content/guide/scan_banned.py <bài>` không báo trùng (mục 4, 9).
2. Mọi con số trong bài đều có trong dữ liệu được cung cấp cho đợt viết, `BRIEF.md` hoặc facts (mục 6).
3. Title, meta, H1, link trụ cột đúng `content/guide/structure.md` mục SEO/AEO (title 45–60 ký tự, meta 120–155, một H1,
   không nhảy cấp heading, có link lên trang trụ cột của cụm + 2–4 link ngang).
4. Câu chuyện ngôi thứ nhất không mâu thuẫn dữ kiện trong BRIEF, BRAND, facts (mục 5).
5. Đủ thành phần tối thiểu của loại bài/loại trang (`content/guide/pillars.md` mục E2–E4).
6. Mọi link ra ngoài đều là Wikipedia và đã kiểm tra HTTP 200, đúng chủ đề (mục 10).
7. Không có dấu gạch dài (—), script ở bước 1 tự báo; câu ≤ 30 từ, đoạn ≤ 80 từ (mục 11).

## 9. Danh sách tên đối thủ cấm xuất hiện

Điền dần trong lúc crawl. Tên **chủ đầu tư / dự án** (Vinhomes, Masterise Homes, Sun Group, Ecopark…) KHÔNG nằm trong
danh sách: đó là đối tượng Velis tư vấn, không phải thương hiệu đối thủ. Cấm là tên đơn vị phân phối, tên miền, tác giả,
slogan, hotline của họ. Mỗi dòng: `- `cụm từ` (loại, nguồn)` — chỉ phần trong dấu `` ` `` được quét.

<!-- banned:start -->
### Chung (đơn vị phân phối đứng sau nhiều domain)

- `SaleReal` (tên đơn vị; logo/ảnh tải từ salereal.vn trên mọi domain)
- `Sale Real` (biến thể)
- `salereal.vn` (tên miền)
- `SR` (hậu tố thương hiệu gắn sau tên dự án/domain)
- `Đại lý top 1` (USP trong popup)
- `Thông tin chính thức từ` (tagline footer, dạng "thông tin chính thức từ <CĐT>")

### vinhomeshocmonsr.vn

- `vinhomeshocmonsr` (tên miền, Facebook)
- `Vinhomes Hóc Môn SR` (tên site)
- `Lê Quang Hưng` (tác giả trong schema)
- `quanghung732005@gmail.com` (email tác giả)
- `Sales Vinhomes` (byline bài viết)
- `0938.007.778` (hotline, Zalo)
- `0975442140` (điện thoại trong schema)
- `Đại đô thị công viên sinh thái tri thức đáng sống bậc nhất` (slogan footer)

### vinhomescangios.vn

- `vinhomescangiosr` (Facebook)
- `Vinhomes Cần Giờ SR` (tên site)
- `0938910329` (điện thoại)
- `0915333387` (điện thoại trong schema)
- (tác giả, email, hotline 0938.007.778 / 0975442140, byline: trùng mục vinhomeshocmonsr.vn)

### vinhomebysalereal.vn

- `vinhomebysalereal` (tên miền, Facebook)
- `Vinhomes By SaleReal` (tên site)
- `VBYSR` (hậu tố title, tên viết tắt)
- `SaleReal Agency` (tên hiển thị trang chủ)
- `Công ty TNHH Dịch vụ Bất động sản SaleReal` (pháp nhân)
- `Lưu Trung Quân` (tác giả, CEO đơn vị phân phối)
- `trungquan.luu` (Facebook tác giả)
- `quanbds6669@gmail.com` (email)
- `admin@wiwi.vn` (email trong meta)
- `+84933186123` (điện thoại trong schema)
- `0933186123` (cùng số, dạng nội địa)
- `gem.phamnhu` (Facebook nhân viên)
- `nguyen.duy.phap.2` (Facebook nhân viên)
- `phucduymedia.tran` (Facebook nhân viên)
- `Đơn vị phân phối của Vinhomes` (lời tự giới thiệu)

### theprivesr.vn

- `theprivesr` (tên miền, Facebook)
- `Sales Đất Xanh` (byline bài viết – dùng tên CĐT làm byline)
- (tác giả, email, hotline 0938.007.778 / 0975442140 / 0938910329: trùng mục trên. Tên dự án/CĐT không cấm)

### masterisehomesbysalereal.vn

- `masterisehomesbysalereal` (tên miền, Facebook)
- `Masterise Homes By SaleReal` (tên site)
- `MBYSR` (hậu tố title)
- `CEO SaleReal` (chức danh tác giả trong schema)
- `Đại lý chiến lược của Masterise Homes` (lời tự giới thiệu)
- (tác giả, email, Facebook nhân viên, hotline: trùng mục vinhomebysalereal.vn)

### sungroupsr.vn

- `sungroupsr` (tên miền, Facebook)
- `Sun Group SR` (tên site)
- `SGSR` (hậu tố title)
- `SaleReal Investment` (pháp nhân liên quan)
- `Trần Duy Phúc` (nhà sáng lập – chủ tịch, trang giới thiệu)
- `Nhật Phạm` (đồng sáng lập)
- `Nguyễn Duy Pháp` (giám đốc sàn)
- `Hồ Phúc Hậu` (giám đốc sàn)
- `Phạm Như Ngọc` (giám đốc sàn)
- `Nguyễn Minh Quý` (giám đốc sàn)
- `Sàn Kaizen` (tên sàn)
- `Sàn Shinka` (tên sàn)
- `Sàn Kaito` (tên sàn)
- `hophuchau94` (Facebook)
- `MinhQuyR` (Facebook)
- `pham.nhat.113671` (Facebook)

### ecoparkbysalereal.vn

- `ecoparkbysalereal` (tên miền, Facebook)
- `Ecopark By SaleReal` (tên site)
- `EBYSR` (hậu tố title)
- `CEO của SaleReal` (chức danh tác giả)
- `Đại lý chiến lược của Ecopark` (lời tự giới thiệu)

### sunvungtausr.vn

- `sunvungtausr` (tên miền, Facebook)
- `Sales Sun Group` (byline bài viết – dùng tên CĐT làm byline)
- (tác giả, email, hotline 0938.007.778 / 0938910329: trùng mục trên; tên dự án/CĐT không cấm)

<!-- banned:end -->

### Đã xác nhận – KHÔNG cấm (người dùng xác nhận 2026-11-05)

- **Vũ Thanh Xuân** (Facebook `xuanvu.bp`) chính là CEO Velis Vũ Xuân. Trước đây anh là giám đốc sàn của đơn vị phân phối đứng sau
  các domain trong `content/samples/`, nay đã mở công ty riêng là Velis Realty. Trang giới thiệu đội ngũ của sungroupsr.vn vẫn còn hồ sơ cũ của anh.
  Không bao giờ đưa "Vũ Xuân", "Vũ Thanh Xuân" hay `xuanvu.bp` vào danh sách cấm.

## 10. Link ra ngoài (người dùng chốt 2026-11-05)

- **Chỉ dẫn đến Wikipedia**, ưu tiên `vi.wikipedia.org`, ở chỗ có bài phù hợp: địa danh, phường/xã, tuyến đường, hạ tầng, khái niệm pháp lý…
- **Không** link đến chủ đầu tư, sàn, môi giới, trang rao bán hay bất kỳ site bán hàng nào. **Không bao giờ** link đến domain trong danh sách cấm (mục 9).
- Trước khi chèn: kiểm tra URL tồn tại (HTTP 200) và đúng chủ đề. Không tự đoán URL; không có bài phù hợp thì không chèn link.
  ```bash
  curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' -L --cacert /root/.ccr/ca-bundle.crt 'https://vi.wikipedia.org/wiki/<Tên_bài>'
  ```
  200 sau chuyển hướng vẫn phải mở xem tiêu đề bài đích có đúng chủ đề (trang định hướng/disambiguation thì không dùng).
- Số liệu vẫn chỉ lấy từ dữ liệu người dùng cung cấp (mục 6), **không lấy số từ Wikipedia**.

## 11. Câu chữ (người dùng chốt 2026-11-05)

- Giữ trần `docs/VOICE.md`: tối đa 30 từ/câu, 80 từ/đoạn; thêm **mục tiêu câu trung bình 15–20 từ**.
- **Cấm dấu gạch dài (—)** trong bài.
- FAQ hiển thị + schema `FAQPage`: bài blog 3–5 câu, trang dự án 6–8 câu. Độ dài bài 1.200–2.000 từ.
