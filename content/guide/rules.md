# Quy tắc bắt buộc khi học từ website đối thủ

Áp dụng cho mọi việc trong `content/` (phân tích mẫu, soạn guide, viết bài). Người dùng chốt 2026-11-05.

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

Người viết toàn bộ nội dung Velis là **CEO Velis Realty – Vũ Xuân** (nguồn: `BRIEF.md`; trang tác giả `/chuyen-gia/vu-xuan/`).
Không dùng tên, chức danh hay lời giới thiệu của bất kỳ ai khác. Thông tin CEO chưa có trong repo (tiểu sử, năm kinh nghiệm…)
thì ghi TODO và hỏi người dùng, không tự đặt.

## 4. Quét trước khi commit

Trước khi commit bất kỳ bài viết nào: quét bài theo danh sách cấm bên dưới (không phân biệt hoa thường, cả dạng không dấu).
Có trùng thì sửa, không được commit. Lệnh (bỏ dấu, không phân biệt hoa thường, số điện thoại so theo dãy số; thoát mã 1 nếu trùng):

```bash
python3 -I content/guide/scan_banned.py <file-bài> [...]
```

Ngoại lệ: `content/samples/` (tài liệu phân tích đối thủ) được phép nhắc tên domain đối thủ để định danh nguồn,
nhưng phần "áp dụng cho Velis" thì không.

## 5. Danh sách tên đối thủ cấm xuất hiện

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

<!-- banned:end -->
