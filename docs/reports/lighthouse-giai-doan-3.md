# Lighthouse mobile – giai đoạn 3 (bản cuối)

Ngày 2026-11-04 · Lighthouse 12.6.1, giả lập mobile. SEO 58–66 vì staging chặn index toàn site (đúng chủ ý). JS/CSS = dung lượng tài nguyên tải về (chưa gzip).

```
trang-chu    perf 98 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 60 ms | JS 13KB CSS 43KB font 3
du-an        perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0 TBT 10 ms | JS 13KB CSS 43KB font 3
dai-do-thi   perf 98 a11y 100 bp 100 seo 66 | LCP 1.9 s CLS 0.052 TBT 10 ms | JS 13KB CSS 43KB font 3
phan-khu     perf 98 a11y 100 bp 100 seo 66 | LCP 2.0 s CLS 0.048 TBT 10 ms | JS 13KB CSS 43KB font 3
thap-tang    perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0.002 TBT 0 ms | JS 13KB CSS 43KB font 3
du-an-doc-lap perf 98 a11y 100 bp 100 seo 66 | LCP 2.0 s CLS 0.052 TBT 0 ms | JS 13KB CSS 43KB font 3
chu-dau-tu   perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0 TBT 10 ms | JS 13KB CSS 43KB font 3
cdt-chi-tiet perf 99 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0 TBT 0 ms | JS 13KB CSS 43KB font 3
blog         perf 98 a11y 100 bp 100 seo 66 | LCP 2.1 s CLS 0 TBT 10 ms | JS 13KB CSS 43KB font 3
cum-blog     perf 98 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 0 ms | JS 13KB CSS 43KB font 3
bai-viet     perf 99 a11y 100 bp 100 seo 66 | LCP 1.2 s CLS 0.001 TBT 0 ms | JS 13KB CSS 43KB font 3
tac-gia      perf 98 a11y 100 bp 100 seo 66 | LCP 2.0 s CLS 0 TBT 0 ms | JS 13KB CSS 43KB font 3
gioi-thieu   perf 97 a11y 96 bp 100 seo 66 | LCP 2.2 s CLS 0 TBT 0 ms | JS 1791KB CSS 43KB font 3
lien-he      perf 99 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0 TBT 0 ms | JS 13KB CSS 43KB font 3
tim-kiem     perf 95 a11y 100 bp 100 seo 58 | LCP 2.5 s CLS 0 TBT 0 ms | JS 17KB CSS 51KB font 3
```

- CSS theme: assets/velis.min.css 42 KB (rút gọn từ style.css bằng tools/build_css.py; test giữ ≤ 50 KB).
- Tìm kiếm: 51 KB = 42 KB theme + 9 KB CSS font Merriweather do Header and Footer Scripts chèn (tắt ở giai đoạn 4).
- Giới thiệu: 1,8 MB JS + a11y 96 là bản đồ Google nhúng trong nội dung cũ → giai đoạn 4 thay bằng bản đồ tĩnh.
- 404: Lighthouse không chấm trang trả mã 404.
