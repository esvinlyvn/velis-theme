# The7 bước 14 – chốt footer + tài liệu cho người viết nội dung (2026-11-13)

Chỉ ghi staging; nhật ký `docs/STAGING-LOG.md` (mục bước 14); đưa lên site thật: `docs/the7/DUA-LEN-SITE-THAT.md` mục 34–39.
Không gửi form, không ghi `.htaccess`, không lưu trang cài đặt LiteSpeed.

## 1. Thông tin công ty

### 1.1 Email hiển thị → info@velisrealty.vn (nhận form giữ velisrealtyvn@gmail.com)

| Chỗ | Số chỗ đổi | Cách đổi | Bản trước |
|---|---|---|---|
| Trang Tuyển dụng (19542) | 4 (2 link + 2 chữ) | REST `content.raw` | rev 20738, `data/the7/buoc-14/page-19542-truoc.json` |
| Trang Chính sách bảo mật (19662) | 1 ("Email tiếp nhận") | REST | rev 20748 |
| Trang Liên hệ (19544) | 2 ("Email hỗ trợ", link + chữ) | REST | rev 20797 |
| Trang Giới thiệu (19551) | 1 | REST | rev 20802 |
| Widget HTML cột 1 footer (custom_html-6) | 2 (link + chữ) | REST widgets | `widget-custom_html-6-truoc.json` |
| Rank Math → SEO Local → Email (schema Organization / RealEstateAgent mọi trang) | 1 | màn cài đặt Rank Math | `rank-math-seo-local-truoc.json` |
| Mẫu schema Rank Math "Person" (19620, trang Giới thiệu) | 1 (`email`) | màn sửa mẫu schema | `schema-mau-19620-person-truoc.json` |
| Mẫu schema Rank Math "Job Posting" (19622, Tuyển dụng) | 1 (mô tả tin: "gửi CV đến …") | màn sửa mẫu schema | `schema-mau-19622-jobposting-truoc.json` |

Hai mẫu schema cuối không lộ ra khi quét nội dung qua REST, chỉ thấy khi quét HTML. Đó là lý do quét toàn site lần 1 còn 2 trang.

- **Đã kiểm, không có email cũ:**
  - Theme Options (955 khóa);
  - CF7 19582 / 20958 (thư, câu cảm ơn, người nhận vẫn velisrealtyvn@gmail.com);
  - mẫu WPBakery `data/the7/mau-wpbakery/`;
  - khối liên hệ cuối trang.
- **Còn trong trang riêng tư 20540 "Velis – BRAND (nội bộ)":** đây là tài liệu nội bộ chép từ site thật, private, không hiển thị. Không sửa (quy tắc trang 20538–20544).
- **Repo:** chuỗi cũ chỉ còn ở bản ghi lịch sử (dữ liệu "trước" bước 13, `tools/the7_sua_buoc8.py`, `docs/BRAND.md` chép nguyên văn, theme velis / mockup đã bỏ). Không đổi, để giữ đúng lịch sử.

**Quét lại:** HTML 141 URL (mọi trang, bài, chuyên mục đã xuất bản + 404 + tìm kiếm; trừ 7 ứng dụng) cho kết quả **0 chỗ "lienhe@velisrealty"** (kể cả dạng `%40`). Cả 141/141 trang có info@velisrealty.vn ở footer (`data/the7/buoc-14/quet-email-sau.json`).

### 1.2 MST

- **Bottom bar:** "© 2026 Công ty TNHH Velis Realty · MST: 0319425663", dòng dưới là lưu ý 13 px. Không ghi ngày cấp / nơi cấp.
- **Rank Math SEO Local → Thông tin bổ sung:** Tên pháp lý "Công ty TNHH Velis Realty" và **Mã số thuế 0319425663**. Rank Math Pro có sẵn ô này nên không cần code.

Schema Organization xuất ra như sau (đọc HTML trang chủ, Liên hệ, Giới thiệu, Tuyển dụng):

```
"@type": ["RealEstateAgent","Organization"], "email": "info@velisrealty.vn",
"legalName": "Công ty TNHH Velis Realty", "taxID": "0319425663"
```

**Kiểm schema 4 trang** bằng `node tools/the7_check_schema.mjs` với bộ từ vựng schema.org chính thức: **0 lỗi**, 1 cảnh báo cũ (`query-input` của Google ở WebSite). validator.schema.org chặn truy cập tự động nên không chạy trực tiếp được.

### 1.3 Mạng xã hội, câu giới thiệu

- **Mạng xã hội:** giữ 7 mạng như người dùng xác nhận. Lưu ý: `sameAs` trong schema có 8 link vì có cả `twitter.com/velisrealty` và `x.com/velisrealty`; footer hiện 1 biểu tượng X. Chưa đổi; bỏ link twitter.com ở Rank Math → Meta mạng xã hội nếu muốn khớp 7.
- **Câu giới thiệu cột 1:** giữ nguyên, đã chuyển cho người viết nội dung (`HUONG-DAN-NOI-DUNG.md` mục 5, ưu tiên 1).

## 2. Việc tồn

### 2.1 Mã bảo mật form liên hệ The7

Khóa `contact_form_security_token` được đổi sang mã ngẫu nhiên mới (20 ký tự a-z0-9, cùng dạng mã The7 tự tạo):
1. xuất bộ options hiện tại;
2. `tools/the7_options_buoc14.py` đổi đúng khóa này và `bottom_bar-text`;
3. nhập lại;
4. xuất lại để so: 0 khóa khác file nhập, mã khác mã cũ.

Mã **không** nằm trong repo hay log: hai file `data/the7/options-*-b14.json` ghi `"<đã xóa>"`. File nhập chứa mã thật chỉ nằm ở thư mục tạm của phiên. Mã cũ vẫn còn trong lịch sử git nhưng đã hết hiệu lực trên staging. Site thật có mã riêng, làm theo DUA-LEN-SITE-THAT mục 36.

### 2.2 Bảng trang dự án rộng đúng cột 760 px

- **Gốc:** quy tắc bước 12b chỉ ép `width: 100%` cho bảng trong khối chữ. Bảng nằm **trong khối "Xem thêm" / hỏi đáp** vẫn giữ độ rộng trình soạn thảo ghi sẵn vào thẻ:
  - The Privé: 98,7 % / 98,6 % → 750 / 749 px;
  - Persa Place: 722–745 px;
  - Palm River: 734 px;
  - Ansana by Kita: **643 px**.

  Bộ đo cũ bỏ qua nội dung toggle nên không bắt được.
- **Sửa (theme con 1.8.1):** một quy tắc cho mọi bảng trong khối chữ và trong toggle của hàng `velis-section` (trang có `velis-hero`) hoặc `velis-read`. Trang mới tạo từ mẫu "Velis – Dự án" tự đúng, không phải sửa mẫu.
- **Đo:** `tools/the7_check_cot.mjs` nay mở mọi toggle trước khi đo và tính cả bảng bên trong; self-test có thêm ca bảng 98,7 %.
  - 12 trang sản phẩm × 1366/1536/1920: **18 lỗi → 0**.
  - Logo header: 0 lỗi.
- **Ảnh:** `screenshots/the7/buoc-14/truoc-sau-bang-{can-ho-the-prive,ansana-by-kita}-1536.jpg`.
- Lưới thông tin dự án, thư viện ảnh và khối "Nhận bảng giá" vẫn rộng hết khung như đã chốt ở 12b.

## 3. Tài liệu `docs/HUONG-DAN-NOI-DUNG.md`

Viết cho người viết nội dung, có 8 ảnh đánh số (`screenshots/the7/huong-dan/`):
1. trang dự án thật;
2. màn soạn dự án (2 phần);
3. thẻ dự án ↔ ô Tóm tắt;
4. màn soạn bài;
5. bài xem trước;
6. footer;
7. khối liên hệ cuối.

Các mục:
- **3.1 Bản đồ nội dung:** 10 loại, mỗi loại ghi ở đâu trong wp-admin, mẫu nào, ô nào hiện chỗ nào.
- **3.2 Quy tắc từng loại:**
  - thứ tự khối, bắt buộc / tùy chọn;
  - độ dài; ảnh (tỉ lệ, cỡ, tên file, alt);
  - giọng văn và từ cấm;
  - "Chưa công bố"; địa danh mới;
  - onpage: từ khóa từ `data/keyword-map.csv` (cột `url_cu`), vị trí đặt, title ≤ 60, mô tả 140–155, slug, H2/H3, chữ thường đầu câu, link nội bộ bắt buộc, chuyên mục, thẻ, hỏi đáp.
- **3.3 Quy trình đăng:** 7 bước, gồm xóa cache và Search Console.
- **3.4 Checklist:** 20 dòng, in được.
- **3.5 Việc tồn:** 15 việc xếp theo lượt nhấp Search Console:
  - câu giới thiệu / mô tả schema sai vai trò;
  - bài Hướng Việt Holdings (239 nhấp);
  - trang chủ Title Case;
  - mốc bàn giao The Privé;
  - Chính sách bảo mật theo NĐ 13/2023;
  - địa danh cũ;
  - 128 alt không dấu;
  - 66 ảnh có chữ in sẵn;
  - …
- **3.6 Phân quyền:** bảng Biên tập viên ↔ Quản trị viên.

**Thử làm theo tài liệu:** dựng bài **nháp ID 21008** "The Privé: 6 thông số cần biết trước khi xem nhà mẫu" theo đúng hướng dẫn mục 1.4 + 2.3:
- chuyên mục Blog → The Privé, ảnh đại diện, mô tả ngắn;
- Rank Math: tiêu đề 52 ký tự, mô tả 146 ký tự, từ khóa;
- nội dung có Tóm tắt nhanh, H2, mục rủi ro, công bố, link về trang dự án.

Ảnh 04 và 05 chụp từ bài này. Kết quả:
- hộp cột phải tự thành "Nhận bảng giá The Privé";
- "Cùng dự án The Privé" liệt kê đúng 5 bài cụm.

Khi thử thấy và đã ghi vào tài liệu:
1. **Ô "Mô tả ngắn" ẩn mặc định:** phải bật ở Tùy chọn hiển thị.
2. **Ảnh đại diện tự hiện đầu bài:** bài thử chèn lại ảnh đó vào nội dung nên ảnh lặp 2 lần. Tài liệu ghi "không chèn lại".
3. **Mẫu "Velis – Bài viết" còn hàng "Liên hệ tư vấn":** bài blog đã có form ở cột phải, nên tài liệu ghi xóa hàng này khi dùng mẫu.

Bài nháp 21008 **chưa xóa** vì quy tắc dự án cấm xóa bài; chủ site xóa sau khi soát (Bài viết → Nháp → Xóa tạm).

## 4. Kiểm chứng

| Đo | Kết quả |
|---|---|
| Quét HTML 141 URL tìm "lienhe@velisrealty" | 0 (trước: 6 trang/nguồn) |
| Schema Organization: email info@, taxID, legalName | có ở 4/4 trang đo; 0 lỗi |
| CF7 người nhận | 19582, 20958 = velisrealtyvn@gmail.com (đọc, không gửi) |
| Theme Options xuất lại so file nhập | 0 khóa khác; mã bảo mật đã đổi |
| `the7_check_cot` 12 trang × 3 khung (gồm bảng trong toggle) + logo 4 trang × 4 khung × 3 trạng thái | cột lỗi 0 (trước 18) · logo lỗi 0 |
| `the7_check_clip` 17 trang × 8 khung (136 lượt) | chữ cắt 0, meta lệch 0, tràn ngang 0, ảnh hỏng 0, lỗi JS 0, mỗi trang 1 H1 |
| `the7_check_footer` 13 trang × 6 khung (trống, gạch chân, vùng bấm, tương phản, ≤ 1 form, nút lên đầu) | **0 lỗi** (78 lượt đo) |
| On-page 236 URL staging | không lỗi mới: 128 alt không dấu (nội dung, đã có trong danh sách việc tồn), 1 URL 2 H1 (chuyên mục rỗng 45, đã biết) |

Ảnh trước | sau: `screenshots/the7/buoc-14/` có footer 1536 + 390 và bảng The Privé + Ansana 1536. Ảnh "trước" của footer cắt từ ảnh "sau" bước 13, vì email và dòng MST đã đổi trước khi chụp.

Lần chạy đầu của 3 bộ đo bị đứt do proxy (ERR_TUNNEL / 403) và container khởi động lại; số trên là lần chạy lại hoàn chỉnh.

## Đã bỏ qua / chưa kiểm tra / rủi ro
- **Chưa kiểm tra:**
  - Chưa thử vai Biên tập viên thật: staging hiện không có tài khoản Biên tập viên, và quy tắc không cho tạo user. Bảng phân quyền viết theo quyền chuẩn WordPress.
  - Chưa kiểm Google Business Profile.
  - Chưa chạy validator.schema.org trực tiếp.
- **Rủi ro:**
  - Site thật phải tạo mã bảo mật riêng (mục 36), không nhập file options có "<đã xóa>".
  - Bài nháp 21008 còn trên staging, chủ site cần xóa.
