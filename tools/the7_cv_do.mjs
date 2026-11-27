// content-visibility (2026-11-27, người dùng duyệt): đo chiều cao thật các khối DƯỚI màn đầu theo loại (lớp velis-* đầu tiên / loại phần tử) ở 412 + 1366
// để đặt contain-intrinsic-size gần đúng trong velis.css. Ứng viên = hàng / section cấp đầu trong .wpb-content-wrapper trừ khối đầu (màn đầu),
// khối có form CF7, khối có phần tử position:sticky / fixed. CHỈ ĐỌC. Dùng: node tools/the7_cv_do.mjs <base> [đường dẫn …]  (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const TRANG = ['/', '/du-an/', '/chu-dau-tu/', '/can-ho-the-prive/', '/du-an/gamuda-land/', '/gia-ban-the-prive-quan-2-2026/', '/tieu-chuan-ban-giao-persa-place-gamuda-land/', '/blog/', '/blog/the-prive/',
  '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/chinh-sach-bao-mat/', '/can-ho-persa-place/', '/the-global-city/'];
// = bộ chọn trong velis.css: hàng / section cấp đầu (trừ khối đầu) không chứa khối Velis; hoặc khối Velis (khoi / hoi-dap / luoi) nằm dưới khối đầu
export const UNG_VIEN = '.wpb-content-wrapper > :is(.vc_row, .vc_section):not(:first-child):not(:has(.velis-khoi, .velis-hoi-dap, .velis-luoi)), .wpb-content-wrapper > :not(:first-child) :is(.velis-khoi, .velis-hoi-dap, .velis-luoi)';
const [base, ...ds] = process.argv.slice(2); const b = await chromium.launch(); const nhom = {};
for (const [w, m] of [[412, true], [1366, false]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: m ? 915 : 900 }, isMobile: m })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const u of ds.length ? ds : TRANG) {
    await p.goto(base + u, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(1200);
    const r = await p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => {
      const bo = e.querySelector('.wpcf7') ? 'form' : [e, ...e.querySelectorAll('*')].some((x) => /sticky|fixed/.test(getComputedStyle(x).position)) ? 'sticky' : '';
      const k = (e.className.match(/\bvelis-khoi--[\w-]+/) || e.className.match(/\bvelis-[\w-]+/) || [e.classList.contains('vc_section') ? 'vc_section' : 'vc_row'])[0];
      return { k, h: Math.round(e.getBoundingClientRect().height), bo };
    }), UNG_VIEN);
    for (const x of r) { const n = (nhom[x.k] ||= { 412: [], 1366: [], bo: new Set() }); if (x.bo) n.bo.add(x.bo); else n[w].push(x.h); }
  }
}
await b.close();
const tv = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
console.log('| Loại khối | số khối 412 / 1366 | trung vị cao 412 / 1366 (px) | loại trừ |\n|---|---|---|---|');
for (const [k, n] of Object.entries(nhom)) console.log(`| ${k} | ${n[412].length} / ${n[1366].length} | ${tv(n[412])} / ${tv(n[1366])} | ${[...n.bo].join(', ')} |`);
