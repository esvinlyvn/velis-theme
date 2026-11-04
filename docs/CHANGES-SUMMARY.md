<!-- Nguồn: velisrealty.vn trang riêng tư ID 20544 (velis-doc-changes-summary), sửa đổi 2026-11-04T07:21:52. Lấy qua REST (chỉ đọc) ngày 2026-11-04. -->

# CHANGES-SUMMARY – velisrealty.vn (tóm tắt changes.md + điểm hoàn tác quan trọng)

> Cập nhật 2026-11-03. Bản đầy đủ: `audit-output/changes.md` (nhật ký) và `audit-output/rollback.md` (giá trị cũ, cách hoàn tác). Tệp sao lưu nội dung nằm trong `audit-output/rollback/`.

## Đã thay đổi trên site (theo đợt)
| Đợt | Nội dung chính | Hoàn tác |
|---|---|---|
| A1 | Rank Math Redirections → Fallback: soft-404 thành 404 thật | Rank Math → Redirections → Settings → Fallback cũ (rollback.md) |
| 3–5 | Trang Tuyển dụng 19542 xuất bản + JobPosting (mẫu 19622); schema doanh nghiệp (bỏ legalName sai, https, geo); xóa chuỗi lạ ở ô Maps API; lưu trữ ngày 200 + noindex; 2 redirect 1 bước; mẫu Person/Website user 1 | Từng mục trong rollback.md |
| 2a | Sửa link hỏng (`http://vinhomes`, `te;:`); slug tác giả `vu-xuan`; meta description 20 URL chuyên mục; giờ mở cửa schema; sameAs còn 8 | rollback.md mục 2a |
| 2b–2c | 20 SEO title; alt cho ảnh Thư viện (`alt-changes.csv`); llms.txt (module Rank Math); gỡ SEO WPBakery 5 trang; tắt đổi chữ hoa alt | rollback.md mục 2b–2c |
| UX Bước A | UpdraftPlus + backup (DB + plugins); cập nhật WP Mail SMTP, Easy TOC, Advanced Editor Tools, Buttonizer, FVM 3.5.8, Ultimate Addons 3.21.6, The7 CLI 1.1 | Bản sao lưu UpdraftPlus 17:22; phiên bản cũ trong rollback.md |
| Sửa UX/UI | WPBakery bật lại responsive (+ CSS bù padding desktop); nhãn form CF7; viền focus; CTA trang chủ; menu FOOTER chứa "THI THỬ CCMG"; bỏ "24/7"; thống nhất Sun Group/The Privé (298 chỗ, 29 bài-trang, 2 chuyên mục); /lien-he/ còn 6 hồ sơ mạng xã hội; preload font + giữ chỗ header (CLS); The7: tiêu đề trang mobile 28px, header mobile dính, điểm chuyển header 1000px | The7 Custom CSS/Tracking code: xóa khối `velis-ux: UX-xx` (bản cuối: `rollback/velis-ux-custom-css-final.css`, `velis-ux-tracking-code-final.html`); nội dung gốc trong `rollback/` |
| A–D | Loco Translate + `languages/loco/themes/the7mk2-vi.po` (23 chuỗi); trang mẫu 404 riêng tư **20536**; gỡ script dịch cũ; gỡ 23 fontFace không tồn tại khỏi Font Library; UX-04 (menu mobile không nhận Tab khi đóng); nhãn aria tiếng Việt; chuyển Chat Button → **Buttonizer 3.6.1** (plugin cũ tắt) | Loco: xóa bản dịch hoặc tắt Loco; The7 → Archives and 404 → `template_page_id_404` = — Select —; global styles: `rollback/global-styles-19348-before-fontremove.json`; Buttonizer: tắt plugin mới, bật lại `button-contact-vr` |
| Nội dung – chuẩn bị | Chỉ tạo 7 trang PRIVATE lưu tài liệu: 20538 (cha), 20539 SCOPE, 20540 BRAND, 20541 VOICE, 20542 CONTENT-MAP, 20543 CONTENT-PLAN, 20544 CHANGES-SUMMARY; noindex, nofollow. Không sửa nội dung công khai | Chuyển các trang này về Thùng rác chỉ khi chủ site yêu cầu (không xóa tự động) |
| Tốc độ | LiteSpeed Cache 7.9.2: chỉ cache trang cho khách + Browser Cache; Do Not Cache/Optimize 9 URI ngoài phạm vi; .htaccess chỉ thêm khối LSCACHE/NON_LSCACHE | Tắt plugin LiteSpeed Cache; so .htaccess với `htaccess-before-speed.txt`; DB backup UpdraftPlus 22:21 |
| Nội dung – Bước 1 | Mục 0: quy tắc số liệu ngôi thứ nhất, bỏ gộp/301 (tài liệu). Mục 1: 29 câu thay thế + 3 meta trên 8 trang; bộ đếm 15+ → 10+. Mục 2: title/meta riêng cho 3 bài trùng title (20139, 20113, 19888) + title 2 chuyên mục blog (term 42, 43). Mục 3: 232 link nội bộ trên 106 bài (chỉ bọc chữ có sẵn; 6 trụ cột thêm khối "Bài viết liên quan"). Mục 4: 2 bài NHÁP chưa xuất bản (20565 làm mới The Privé, 20566 pháp lý – tiến độ) | `rollback/step1-pages/`, `rollback/step1-titles-before.json`, `rollback/step1-links/raw/`; nháp: chỉ cần không xuất bản/chuyển thùng rác khi chủ site yêu cầu |

## Điểm hoàn tác quan trọng
- **Bản sao lưu UpdraftPlus:** 2026-11-03 17:22 (DB + plugins) và 22:21 (DB). Cài đặt → UpdraftPlus → Khôi phục.
- **.htaccess:** `htaccess-before-speed.txt` (trước LSCache), `htaccess-after-lscache.txt` (sau).
- **CSS/JS tùy biến:** chỉ nằm trong The7 → Advanced → Custom CSS / Tracking code, mỗi khối có comment `velis-ux: UX-xx`.
- **Nội dung bài/trang trước khi sửa:** `rollback/*.txt|json` (trang chủ, /lien-he/, /du-an/vinhomes/, 29 bài UX-11).
- **Plugin mới:** UpdraftPlus, Loco Translate, Buttonizer (chính), LiteSpeed Cache. Plugin đã tắt (không xóa): Chat Button (`button-contact-vr`).

## Sự cố đã báo
- Đợt UX Bước A: trình duyệt tự động đi theo link "xóa cache FVM" trên thanh admin (`fvm_do=clear_all`). Đã báo người dùng; từ đó áp dụng danh sách URL được phép và bỏ mọi link hành động.
- Đợt sửa UX: script Việt hóa gây CLS ở trang chuyên mục; đã sửa (MutationObserver), sau đó thay hẳn bằng Loco.
- Đợt tốc độ: lệnh GET tới 8 đường dẫn ngoài phạm vi bị bộ phân loại chặn trước khi chạy; không có request nào được gửi đi. Kiểm lại chỉ bằng HEAD.
