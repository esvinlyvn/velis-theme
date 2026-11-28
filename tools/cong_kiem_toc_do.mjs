// CỔNG KIỂM TỐC ĐỘ (2026-11-27, người dùng chốt – bắt buộc trước mọi lần đưa theme / CSS / phần tử lên site thật).
// Lighthouse mobile (mô phỏng như PageSpeed: throttling "simulate", Moto G Power), 5 lần / trang, lấy trung vị, 4 trang chuẩn; + CLS máy tính 1366 / 1920.
// So bản mới (staging) với bản đang chạy (site thật). Staging không có cache trang → phản hồi đầu (TTFB) chậm hơn: trừ phần chênh TTFB khỏi
// FCP / LCP / Speed Index của staging rồi TÍNH LẠI điểm Performance bằng đúng công thức chấm của Lighthouse (trọng số + log-normal) → "điểm quy đổi".
// TRƯỢT nếu: vượt ngân sách (LCP ≤ 2,5 s, CLS ≤ 0,05, TBT ≤ 200 ms, tổng ≤ 1,5 MB, Performance ≥ 85 – trên số quy đổi) hoặc Performance quy đổi
// tụt > 3 điểm so với site thật ở bất kỳ trang nào, hoặc CLS máy tính > 0,05. Thoát mã 1 khi trượt.
// Dùng: node tools/cong_kiem_toc_do.mjs <out.json> [--chi-that] [--lan 3] [--trang /a/,/b/ (chỉ dò lỗi)]   (staging cần STAGING_VIEW_PASSWORD; LIGHTHOUSE_DIR = thư mục có node_modules/lighthouse)
//       node tools/cong_kiem_toc_do.mjs --test
import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process'; import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os';
const TRANG0 = ['/', '/du-an/', '/can-ho-the-prive/', '/gia-ban-the-prive-quan-2-2026/'];
const iT = process.argv.indexOf('--trang'); const TRANG = iT > 0 ? process.argv[iT + 1].split(',') : TRANG0; // --trang chỉ để dò lỗi; cổng kiểm thật = đủ 4 trang
const NGAN_SACH = { lcp: 2500, cls: 0.05, tbt: 200, bytes: 1.5 * 1024 * 1024, perf: 85, tut: 3 };
// Lighthouse 12 – chấm mobile (core/audits/metrics/*.js): p10 / median; trọng số category performance
const CHAM = { fcp: { p10: 1800, median: 3000, w: 0.10 }, si: { p10: 3387, median: 5800, w: 0.10 }, lcp: { p10: 2500, median: 4000, w: 0.25 }, tbt: { p10: 200, median: 600, w: 0.30 }, cls: { p10: 0.1, median: 0.25, w: 0.25 } };
function erfc(x) { const z = Math.abs(x), t = 1 / (1 + z / 2); const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function logNormal({ p10, median }, v) { if (v <= 0) return 1; const sh = Math.log(median / p10) / (Math.SQRT2 * 0.9061938024368232); const s = 0.5 * erfc(Math.log(v / median) / (Math.SQRT2 * sh)); return Math.min(1, Math.max(0, s)); }
export const diem = (m) => Math.round(100 * Object.entries(CHAM).reduce((a, [k, c]) => a + c.w * logNormal(c, m[k]), 0));
const trungVi = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
if (process.argv[2] === '--test') {
  console.assert(diem({ fcp: 1800, si: 3387, lcp: 2500, tbt: 200, cls: 0.1 }) === 90, 'p10 mọi chỉ số = 90 điểm');
  console.assert(diem({ fcp: 3000, si: 5800, lcp: 4000, tbt: 600, cls: 0.25 }) === 50, 'median = 50 điểm');
  console.assert(diem({ fcp: 900, si: 1000, lcp: 1000, tbt: 0, cls: 0 }) >= 99, 'rất nhanh ≈ 100');
  if (process.argv[3]) { // so công thức với một báo cáo Lighthouse thật: node tools/cong_kiem_toc_do.mjs --test <lh.json>
    const d = JSON.parse(readFileSync(process.argv[3], 'utf8')), a = d.audits; const m = { fcp: a['first-contentful-paint'].numericValue, si: a['speed-index'].numericValue, lcp: a['largest-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue };
    const lhd = Math.round(d.categories.performance.score * 100); console.assert(Math.abs(diem(m) - lhd) <= 1, `công thức ${diem(m)} ≠ Lighthouse ${lhd}`); console.log('so với Lighthouse:', diem(m), 'vs', lhd);
  }
  console.log('cong_kiem_toc_do: ok'); process.exit(0);
}
const out = process.argv[2]; const chiThat = process.argv.includes('--chi-that'); const LAN = +(process.argv[process.argv.indexOf('--lan') + 1] || 5) || 5; // 5 lần trung vị (2026-11-27, người dùng chốt: TBT dao động mạnh)
const LH = (process.env.LIGHTHOUSE_DIR || '.') + '/node_modules/.bin/lighthouse'; const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
async function cookieStaging() { // đăng nhập trang khóa "Password Protected" của staging (mật khẩu chỉ từ biến môi trường)
  const { chromium } = createRequire(import.meta.url)('playwright'); const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage();
  await p.goto('https://staging.velisrealty.vn/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
  const c = (await ctx.cookies()).map((x) => `${x.name}=${x.value}`).join('; '); await b.close(); return c;
}
function lh(url, cookie) {
  const dir = mkdtempSync(tmpdir() + '/lh-'); const f = dir + '/r.json';
  const args = [url, '--only-categories=performance', '--form-factor=mobile', '--throttling-method=simulate', `--chrome-flags=--headless=new --no-sandbox`, '--output=json', `--output-path=${f}`, '--quiet'];
  if (cookie) { writeFileSync(dir + '/h.json', JSON.stringify({ Cookie: cookie })); args.push(`--extra-headers=${dir}/h.json`); }
  execFileSync(LH, args, { env: { ...process.env, CHROME_PATH: CHROME }, stdio: 'ignore', timeout: 240000 });
  const d = JSON.parse(readFileSync(f, 'utf8')), a = d.audits;
  return { perf: Math.round(d.categories.performance.score * 100), fcp: a['first-contentful-paint'].numericValue, si: a['speed-index'].numericValue, lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue, bytes: a['total-byte-weight'].numericValue, ttfb: a['server-response-time'].numericValue };
}
function doTrang(base, cookie) {
  const r = {};
  for (const u of TRANG) { const runs = []; for (let i = 0; i < LAN; i++) { try { runs.push(lh(base + u, cookie)); } catch (e) { console.error('lỗi Lighthouse', u, e.message.slice(0, 80)); } }
    if (!runs.length) { r[u] = null; continue; }
    r[u] = Object.fromEntries(Object.keys(runs[0]).map((k) => [k, trungVi(runs.map((x) => x[k]))])); r[u].lan = runs.length; console.log(base.replace('https://', '').padEnd(24), u.padEnd(34), JSON.stringify(r[u])); }
  return r;
}
async function clsMayTinh(base) { // CLS máy tính 1366 / 1920 – 3 lần, lấy LỚN NHẤT (không trung vị)
  const { chromium } = createRequire(import.meta.url)('playwright'); const b = await chromium.launch(); const r = {};
  for (const w of [1366, 1920]) for (const u of TRANG) { const v = [];
    for (let i = 0; i < 3; i++) { const ctx = await b.newContext({ viewport: { width: w, height: w > 1900 ? 1080 : 768 } }); const p = await ctx.newPage();
      if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
      await p.addInitScript(() => { window.__c = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__c += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
      await p.goto(base + u, { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(4000); v.push(await p.evaluate(() => window.__c)); await ctx.close(); }
    r[`${w} ${u}`] = Math.max(...v); }
  await b.close(); return r;
}
const that = doTrang('https://velisrealty.vn', null); const ketQua = { that, ngay: new Date().toISOString() };
if (!chiThat) {
  ketQua.staging = doTrang('https://staging.velisrealty.vn', await cookieStaging());
  ketQua.cls_may_tinh = await clsMayTinh('https://staging.velisrealty.vn');
}
const loi = []; const bang = ['| Trang | Site thật: Perf / LCP / TBT / CLS / MB | Staging quy đổi: Perf / LCP / TBT / CLS / MB | Kết luận |', '|---|---|---|---|'];
for (const u of TRANG) {
  const t = that[u]; const s = ketQua.staging?.[u]; if (!t) { loi.push(`${u}: không đo được site thật`); continue; }
  const f = (m) => `${m.perf} / ${(m.lcp / 1000).toFixed(1)} s / ${Math.round(m.tbt)} ms / ${m.cls.toFixed(3)} / ${(m.bytes / 1048576).toFixed(2)}`;
  if (!s) { bang.push(`| ${u} | ${f(t)} | – | (chỉ đo site thật) |`); continue; }
  const lech = Math.max(0, s.ttfb - t.ttfb); const q = { ...s, fcp: s.fcp - lech, si: s.si - lech, lcp: s.lcp - lech }; q.perf = diem(q);
  const l = [];
  if (q.lcp > NGAN_SACH.lcp) l.push(`LCP ${(q.lcp / 1000).toFixed(1)} s > 2,5 s`);
  if (q.cls > NGAN_SACH.cls) l.push(`CLS ${q.cls.toFixed(3)} > 0,05`);
  if (q.tbt > NGAN_SACH.tbt) l.push(`TBT ${Math.round(q.tbt)} ms > 200 ms`);
  if (q.bytes > NGAN_SACH.bytes) l.push(`dung lượng ${(q.bytes / 1048576).toFixed(2)} MB > 1,5 MB`);
  if (q.perf < NGAN_SACH.perf) l.push(`Performance ${q.perf} < 85`);
  if (t.perf - q.perf > NGAN_SACH.tut) l.push(`Performance tụt ${t.perf - q.perf} điểm so với site thật`);
  loi.push(...l.map((x) => `${u}: ${x}`)); bang.push(`| ${u} | ${f(t)} | ${f(q)} (TTFB −${Math.round(lech)} ms) | ${l.length ? 'TRƯỢT: ' + l.join('; ') : 'ĐẠT'} |`);
}
for (const [k, v] of Object.entries(ketQua.cls_may_tinh || {})) if (v > NGAN_SACH.cls) loi.push(`CLS máy tính ${k}: ${v.toFixed(3)} > 0,05`);
if (ketQua.cls_may_tinh) bang.push('', 'CLS máy tính (staging, lớn nhất 3 lần): ' + Object.entries(ketQua.cls_may_tinh).map(([k, v]) => `${k} ${v.toFixed(3)}`).join(' · '));
ketQua.loi = loi; ketQua.bang = bang.join('\n'); writeFileSync(out, JSON.stringify(ketQua, null, 1));
console.log('\n' + ketQua.bang + '\n\n' + (chiThat ? 'CHỈ ĐO SITE THẬT' : loi.length ? 'CỔNG KIỂM: TRƯỢT\n- ' + loi.join('\n- ') : 'CỔNG KIỂM: ĐẠT'));
process.exit(!chiThat && loi.length ? 1 : 0);
