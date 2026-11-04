# Lighthouse mobile – giai đoạn 3

Ngày 2026-11-04 · Lighthouse 12.6.1, giả lập mobile, staging (đăng nhập xem bằng cookie). SEO 58–66 vì staging chặn index toàn site (meta robots noindex) – đúng chủ ý. JS/CSS = dung lượng chưa nén của tài nguyên tải về.

```
trang-chu    perf 98 a11y 100 bp 100 seo 66 | LCP 2.1 s CLS 0.029 TBT 0 ms | JS 11KB CSS 39KB font 3
du-an        perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0 TBT 0 ms | JS 11KB CSS 39KB font 3
dai-do-thi   perf 96 a11y 100 bp 100 seo 66 | LCP 1.9 s CLS 0.083 TBT 10 ms | JS 11KB CSS 39KB font 3
phan-khu     perf 97 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0.084 TBT 0 ms | JS 11KB CSS 39KB font 3
thap-tang    perf 98 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 20 ms | JS 11KB CSS 39KB font 3
du-an-doc-lap perf 97 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0.083 TBT 30 ms | JS 11KB CSS 39KB font 3
chu-dau-tu   perf 99 a11y 100 bp 100 seo 66 | LCP 1.6 s CLS 0 TBT 10 ms | JS 11KB CSS 39KB font 3
cdt-chi-tiet perf 99 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 40 ms | JS 11KB CSS 39KB font 3
blog         perf 99 a11y 100 bp 100 seo 66 | LCP 1.2 s CLS 0 TBT 0 ms | JS 11KB CSS 39KB font 3
cum-blog     perf 99 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 60 ms | JS 11KB CSS 39KB font 3
bai-viet     perf 98 a11y 100 bp 100 seo 66 | LCP 2.0 s CLS 0.002 TBT 10 ms | JS 11KB CSS 39KB font 3
tac-gia      perf 98 a11y 100 bp 100 seo 66 | LCP 2.2 s CLS 0.001 TBT 0 ms | JS 11KB CSS 39KB font 3
gioi-thieu   perf 97 a11y 96 bp 100 seo 66 | LCP 1.9 s CLS 0 TBT 0 ms | JS 1789KB CSS 39KB font 3
lien-he      perf 99 a11y 100 bp 100 seo 66 | LCP 1.2 s CLS 0.001 TBT 50 ms | JS 11KB CSS 39KB font 3
tim-kiem     perf 90 a11y 100 bp 100 seo 58 | LCP 2.9 s CLS 0 TBT 0 ms | JS 14KB CSS 53KB font 3
```

- 404: Lighthouse không chấm trang trả mã 404 (giới hạn công cụ); trang đã qua kiểm tra 9 khung.
- Giới thiệu: JS 1,8 MB là bản đồ Google nhúng trong nội dung cũ → đổi thành "bấm mới tải" khi chuyển nội dung (giai đoạn 4).
- Tìm kiếm: CSS 45 KB của theme (không qua Fast Velocity Minify) + CSS font Merriweather do Header and Footer Scripts chèn → gỡ khi ra mắt.
