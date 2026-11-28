# Lighthouse CI – 4 trang chuẩn, mobile (staging, 2026-11-09, `npm run test:lhci`)

| Trang | Performance | Accessibility | SEO* | Best practices | CLS | LCP |
|---|---|---|---|---|---|---|
| / | 96 | 100 | 100 | 100 | 0 | 2,6 s ⚠ |
| /du-an/the-global-city/ | 99 | 100 | 100 | 100 | 0 | 1,9 s |
| /blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/ | 96 | 100 | 100 | 100 | 0 | 2,7 s ⚠ |
| /du-an/ | 100 | 100 | 100 | 100 | 0 | 1,9 s |

Ngưỡng (lỗi chặn): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, CLS ≤ 0,1 → **đạt cả 4 trang**. LCP > 2,5 s chỉ là cảnh báo
(2 trang): staging tắt cache, đo lại ngày ra mắt với LiteSpeed (`docs/SAU-RA-MAT.md` #2).
\* SEO không tính mục `is-crawlable` vì staging cố ý noindex – bật lại khi đo site thật (`docs/SAU-RA-MAT.md` #3).
