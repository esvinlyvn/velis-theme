// Dung lượng trang (byte truyền thật + số request) khung điện thoại 412 px, cuộn hết trang (ảnh lazy cũng tính) – so trước / sau. CHỈ ĐỌC.
// Dùng: node tools/the7_dung_luong.mjs <base> /a/ …
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ...paths] = process.argv.slice(2); const b = await chromium.launch();
for (const u of paths) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p); await cdp.send('Network.enable'); let byte = 0, req = 0, anh = 0; const loai = {};
  cdp.on('Network.loadingFinished', (e) => { byte += e.encodedDataLength; req++; });
  cdp.on('Network.responseReceived', (e) => { const t = e.type; loai[t] = (loai[t] || 0) + 1; });
  await p.goto(base + u, { waitUntil: 'networkidle', timeout: 90000 });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(1500);
  anh = await p.evaluate(() => performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'img' || /\.(webp|jpe?g|png|avif)/.test(r.name)).reduce((s, r) => s + r.transferSize, 0));
  console.log(u.padEnd(34), Math.round(byte / 1024) + ' KB', req + ' req', '| ảnh ' + Math.round(anh / 1024) + ' KB', JSON.stringify(loai));
  await ctx.close();
}
await b.close();
