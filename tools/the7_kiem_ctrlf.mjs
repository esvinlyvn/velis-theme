// Kiểm Ctrl+F (tìm trong trang của Chrome) thấy chữ nằm trong khối content-visibility:auto chưa dựng (2026-11-27). window.find / cây trợ năng
// KHÔNG thấy chữ ở khối chưa dựng nên phải bấm phím thật: Chrome có giao diện trong Xvfb + tools/the7_phim_x.py (XTEST). Đạt = trước khi tìm khối chưa dựng,
// sau Ctrl+F + Enter trang cuộn tới đoạn chữ và đoạn đã dựng. CHỈ ĐỌC.
// Dùng: XLIB_DIR=<thư mục có python-xlib> xvfb-run -a -s "-screen 0 1366x900x24" node tools/the7_kiem_ctrlf.mjs <base> <đường dẫn>:<chữ ASCII> …
import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ...ds] = process.argv.slice(2); const PHIM = new URL('./the7_phim_x.py', import.meta.url).pathname; let truot = 0;
for (const d of ds) { const [u, chu] = d.split(':');
  const b = await chromium.launch({ headless: false, args: ['--window-size=1366,900'] }); const p = await (await b.newContext({ viewport: null })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(2000); await p.bringToFront();
  const doc = (t) => p.evaluate((t) => { const x = [...document.querySelectorAll('p, li, td, h2, h3')].find((e) => e.textContent.includes(t)); if (!x) return null; const r = x.getBoundingClientRect(); return { y: Math.round(scrollY), dung: x.checkVisibility({ contentVisibilityAuto: true }), trongKhung: r.top < innerHeight && r.bottom > 0 }; }, t);
  const truoc = await doc(chu); execFileSync('python3', [PHIM, chu], { env: { ...process.env, PYTHONPATH: process.env.XLIB_DIR || '' } }); const sau = await doc(chu);
  const ok = truoc && !truoc.dung && sau.dung && sau.trongKhung; if (!ok) truot++;
  console.log(`| ${u} | "${chu}" | trước: ${truoc?.dung ? 'đã dựng' : 'chưa dựng'}, cuộn ${truoc?.y} | sau: ${sau?.dung ? 'đã dựng' : 'chưa dựng'}, cuộn ${sau?.y}, ${sau?.trongKhung ? 'trong khung' : 'ngoài khung'} | ${ok ? 'đạt' : 'TRƯỢT'} |`);
  await b.close(); }
process.exitCode = truot ? 1 : 0;
