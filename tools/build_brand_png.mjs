// Ảnh nhận diện cho WordPress (bước 6 The7): site icon 512 (chỉ dấu "V", nền trắng) và ảnh chia sẻ mặc định 1200×630
// (logo ngang trên nền ngà #FAF7F2, gạch champagne #B08D57). Vẽ từ SVG gốc assets/brand/svg bằng Chromium.
// Chạy từ gốc repo: node tools/build_brand_png.mjs → assets/brand/png/
import { createRequire } from 'node:module'; import { readFileSync, mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const svg = (f) => readFileSync(`assets/brand/svg/${f}`, 'utf8');
const out = 'assets/brand/png'; mkdirSync(out, { recursive: true });
const jobs = [
  ['site-icon-512.png', 512, 512, `<body style="margin:0;background:#FFFFFF;display:grid;place-items:center;width:512px;height:512px">
     <div style="width:400px;height:400px">${svg('favicon.svg').replace(/width="[^"]*" height="[^"]*"/, 'width="400" height="400"')}</div></body>`],
  ['og-mac-dinh-1200x630.png', 1200, 630, `<body style="margin:0;background:#FAF7F2;display:grid;place-items:center;width:1200px;height:630px">
     <div style="display:grid;justify-items:center;gap:40px"><div style="width:620px">${svg('velis-logo-horizontal.svg').replace(/width="[^"]*" height="[^"]*"/, 'width="620" height="100%"')}</div>
     <div style="width:48px;height:2px;background:#B08D57"></div></div></body>`],
];
const b = await chromium.launch();
for (const [name, w, h, html] of jobs) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html); await p.screenshot({ path: `${out}/${name}` }); await p.close();
  console.log(name, w + '×' + h);
}
await b.close();
