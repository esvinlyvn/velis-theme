// Kiểm lệnh "gỡ thiết kế không yêu cầu" (2026-11-25) trên trang có "Velis · Khối nội dung". CHỈ ĐỌC, khách xem.
//   diem: số ô "Điểm chính" đang hiện (.velis-khoi--diem, .velis-diem, tiêu đề "Điểm chính") – phải 0
//   canh: phần tử hiện trong .velis-khoi nằm CẠNH khối chữ (chồng dọc > 4 px, không chồng ngang) – phải 0
//   form: số form CF7 trên trang – phải ≤ 1
// Dùng: node tools/the7_check_mot_cot.mjs <base> <out.json> <widths=1920,390> /duong-dan/ …   (staging: STAGING_VIEW_PASSWORD)  | --test
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

export function doTrang() {
  const vis = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const diem = [...document.querySelectorAll('.velis-khoi--diem, .velis-diem, .velis-khoi__diem')].filter(vis).length
    + [...document.querySelectorAll('h2, h3, h4, strong, p, div')].filter((e) => e.children.length === 0 && /^Điểm chính$/i.test(e.textContent.trim()) && vis(e)).length;
  const canh = [];
  for (const k of document.querySelectorAll('.velis-khoi')) {
    const c = k.querySelector(':scope > .velis-khoi__chu'); if (!c || !vis(c)) continue; const a = c.getBoundingClientRect();
    for (const e of k.children) {
      if (e === c || !vis(e)) continue; const r = e.getBoundingClientRect();
      if (Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top) > 4 && (r.left >= a.right - 1 || r.right <= a.left + 1)) canh.push((k.querySelector('.velis-khoi__tieu-de')?.textContent || '?').slice(0, 40));
    }
  }
  return { khoi: document.querySelectorAll('.velis-khoi').length, diem, canh, form: document.querySelectorAll('form.wpcf7-form').length };
}

async function main() {
  const [base, out, ws, ...paths] = process.argv.slice(2);
  const b = await chromium.launch(); const kq = []; let sai = 0;
  for (const w of ws.split(',').map(Number)) {
    const m = w < 768;
    const ctx = await b.newContext({ viewport: { width: w, height: m ? 844 : 1080 }, isMobile: m, hasTouch: m, userAgent: m ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
    const p = await ctx.newPage();
    if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
    for (const u of paths) {
      const res = await p.goto(base + u + '?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
      const r = { url: u, w, http: res.status(), ...(await p.evaluate(doTrang)) }; kq.push(r);
      const dat = r.http === 200 && r.khoi > 0 && r.diem === 0 && r.canh.length === 0 && r.form <= 1; if (!dat) sai++; // 404 / 0 khối không được tính đạt
      console.log(dat ? 'ĐẠT' : 'SAI', w, u, 'HTTP', r.http, 'khối', r.khoi, '| điểm chính', r.diem, '| cạnh', r.canh.length, r.canh.slice(0, 2).join(' ; '), '| form', r.form);
    }
    await ctx.close();
  }
  await b.close(); writeFileSync(out, JSON.stringify(kq, null, 1)); process.exitCode = sai ? 1 : 0;
}

async function test() {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
  const khoi = (canh) => `<section class="velis-khoi" style="display:flex;${canh ? '' : 'flex-direction:column'}"><div class="velis-khoi__chu" style="width:600px;height:200px"><h2 class="velis-khoi__tieu-de">A</h2></div><div class="velis-khoi__minh-hoa" style="width:300px;height:100px"></div></section>`;
  await p.setContent(khoi(false) + '<form class="wpcf7-form"></form>'); let r = await p.evaluate(doTrang);
  if (r.diem || r.canh.length || r.form !== 1) throw new Error('một cột: ' + JSON.stringify(r));
  await p.setContent(khoi(true) + '<div class="velis-diem" style="height:20px">x</div><p>Điểm chính</p>'); r = await p.evaluate(doTrang);
  if (r.diem !== 2 || r.canh.length !== 1) throw new Error('cạnh: ' + JSON.stringify(r));
  await b.close(); console.log('self-test ok');
}

if (process.argv[1]?.endsWith('the7_check_mot_cot.mjs')) await (process.argv[2] === '--test' ? test() : main());
