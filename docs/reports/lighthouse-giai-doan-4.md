# Lighthouse mobile – giai đoạn 4 (sau chuyển nội dung)

Ngày 2026-11-04 · Lighthouse 12.6.1, giả lập mobile, 1 trang/loại. SEO 58–66 vì staging chặn index toàn site (đúng chủ ý). JS/CSS = dung lượng tải về (chưa gzip). Đã tắt WPBakery, Ultimate Addons, Easy TOC, Header and Footer Scripts.

```
trang-chu    perf 97 a11y 100 bp 100 seo 66 | LCP 2.2 s CLS 0.015 TBT 20 ms | JS 14KB CSS 43KB font 3
du-an        perf 99 a11y 100 bp 100 seo 66 | LCP 1.3 s CLS 0 TBT 0 ms | JS 14KB CSS 43KB font 3
dai-do-thi   perf 97 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0.052 TBT 30 ms | JS 14KB CSS 43KB font 3
phan-khu     perf 97 a11y 100 bp 100 seo 66 | LCP 2.2 s CLS 0.048 TBT 10 ms | JS 14KB CSS 43KB font 3
thap-tang    perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0.002 TBT 0 ms | JS 14KB CSS 43KB font 3
du-an-doc-lap perf 97 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0.052 TBT 20 ms | JS 14KB CSS 43KB font 3
chu-dau-tu   perf 99 a11y 100 bp 100 seo 66 | LCP 1.6 s CLS 0 TBT 10 ms | JS 14KB CSS 43KB font 3
cdt-chi-tiet perf 99 a11y 100 bp 100 seo 66 | LCP 1.4 s CLS 0 TBT 40 ms | JS 14KB CSS 43KB font 3
blog         perf 98 a11y 100 bp 100 seo 66 | LCP 2.2 s CLS 0 TBT 0 ms | JS 14KB CSS 43KB font 3
cum-blog     perf 98 a11y 100 bp 100 seo 66 | LCP 1.7 s CLS 0 TBT 10 ms | JS 14KB CSS 43KB font 3
bai-viet     perf 98 a11y 100 bp 100 seo 66 | LCP 1.8 s CLS 0 TBT 10 ms | JS 14KB CSS 43KB font 3
tac-gia      perf 98 a11y 100 bp 100 seo 66 | LCP 2.1 s CLS 0 TBT 10 ms | JS 14KB CSS 43KB font 3
gioi-thieu   perf 98 a11y 100 bp 100 seo 66 | LCP 1.4 s CLS 0 TBT 30 ms | JS 14KB CSS 43KB font 3
lien-he      perf 98 a11y 100 bp 100 seo 66 | LCP 1.9 s CLS 0 TBT 20 ms | JS 14KB CSS 43KB font 3
tuyen-dung   perf 99 a11y 100 bp 100 seo 66 | LCP 1.1 s CLS 0.003 TBT 0 ms | JS 14KB CSS 43KB font 3
tim-kiem     perf 99 a11y 100 bp 100 seo 58 | LCP 1.8 s CLS 0 TBT 0 ms | JS 18KB CSS 43KB font 3
```

Trang đo: trang-chu `/`, dai-do-thi `/du-an/the-global-city/`, phan-khu `/du-an/spring-ville/persa-place/`, thap-tang `/du-an/vinhomes-saigon-park/ivy-park/nha-pho/`, du-an-doc-lap `/du-an/the-prive/`, bai-viet `/blog/vinhomes/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/`, tim-kiem `/?s=the+prive`; còn lại theo tên.
