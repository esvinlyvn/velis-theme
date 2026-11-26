// So BreadcrumbList (JSON-LD) với breadcrumb đang hiển thị (The7 ol.breadcrumbs): cùng số mục, cùng URL (mục cuối không link), tên khớp
// (bỏ tiền tố 'Chuyên mục "…"' The7 thêm ở trang chuyên mục; tên The7 rút gọn "…" thì so phần đầu). Trang có breadcrumb mà thiếu BreadcrumbList = SAI. Khách xem, CHỈ ĐỌC.
// Dùng: node tools/the7_kiem_breadcrumb.mjs <base> /a/ /b/ …   |   --sitemap <base>  (mọi URL sitemap; staging: danh sách qua tham số)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2); let base = a[0]; let paths = a.slice(1);
const APPS = ['/check-can-the-prive/', '/check-sdt/', '/cmgd/', '/lucky-lead/', '/meta-check/', '/tao-qr-bank/', '/thi/'];
if (a[0] === '--sitemap') {
  base = a[1]; const idx = await (await fetch(base + '/sitemap_index.xml')).text(); paths = [];
  for (const c of [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) paths.push(...[...(await (await fetch(c)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  paths = [...new Set(paths)].filter((p) => !APPS.some((x) => p.startsWith(x)));
}
// chuyên mục cũ đã 301 (tools/the7_rankmath_chuyen_huong.mjs): link hiển thị cũ = đích chuyển hướng
const CHUYEN = { '/du-an-bds': '/du-an', '/du-an-bds/du-an-vinhomes': '/du-an/vinhomes', '/du-an-bds/du-an-gamuda-land': '/du-an/gamuda-land', '/du-an-bds/du-an-masterise-homes': '/du-an/masterise-homes', '/du-an-bds/du-an-sungroup': '/du-an/sun-group', '/du-an-bds/du-an-vinhomes/du-an-vinhomes-saigon-park': '/vinhomes-saigon-park', '/du-an-bds/du-an-gamuda-land/du-an-spring-ville': '/spring-ville' };
const dich = (u) => { const x = new URL(u); const k = x.pathname.replace(/\/$/, ''); return x.origin + (CHUYEN[k] || k); };
export const chuan = (t) => t.replace(/^Chuyên mục\s*[“"](.*)[”"]$/u, '$1').replace(/\s+/g, ' ').trim().toLowerCase();
const b = await chromium.launch(); const p = await b.newPage(); let sai = 0, co = 0;
if (base.includes('staging.')) { await p.goto(base + '/'); await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
for (const u of paths) {
  await p.goto(base + u + (u.includes('?') ? '&' : '?') + 'nc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  const r = await p.evaluate(() => {
    const ol = [...document.querySelectorAll('.breadcrumbs')].find((e) => e.offsetParent);
    const hien = ol ? [...ol.querySelectorAll(':scope > li, :scope > a, :scope > span')].map((li) => { const x = li.matches('a') ? li : li.querySelector('a'); return { ten: li.textContent.trim(), url: x ? x.href.split('?')[0] : null }; }).filter((x) => x.ten) : null;
    let bl = null;
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) { try { const j = JSON.parse(s.textContent); for (const n of (j['@graph'] || [j])) if (n['@type'] === 'BreadcrumbList') bl = n.itemListElement.map((i) => ({ ten: new DOMParser().parseFromString(i.item?.name || i.name || '', 'text/html').documentElement.textContent, url: (i.item?.['@id'] || i.item) ? String(i.item?.['@id'] || i.item).split('?')[0] : null })); } catch {} }
    return { hien, bl };
  });
  if (!r.hien) { if (r.bl) console.log('–', u, 'không breadcrumb hiển thị, có BreadcrumbList', r.bl.length); continue; }
  co++;
  const loi = [];
  if (!r.bl) loi.push('THIẾU BreadcrumbList');
  else {
    if (r.bl.length !== r.hien.length) loi.push(`số mục ${r.bl.length} ≠ ${r.hien.length}`);
    r.hien.forEach((h, i) => { const x = r.bl[i]; if (!x) return; if (h.ten.endsWith('…') ? !chuan(x.ten).startsWith(chuan(h.ten).slice(0, -1).trim()) : chuan(h.ten) !== chuan(x.ten)) loi.push(`tên ${i + 1}: "${h.ten}" ≠ "${x.ten}"`); if (h.url && x.url && dich(h.url) !== dich(x.url)) loi.push(`url ${i + 1}: ${h.url} ≠ ${x.url}`); });
  }
  if (loi.length) sai++;
  console.log(loi.length ? 'SAI' : 'ĐẠT', u, loi.join(' | ') || r.hien.map((x) => x.ten).join(' › '));
}
await b.close(); console.log(`trang có breadcrumb: ${co}, sai: ${sai}`); process.exitCode = sai ? 1 : 0;
