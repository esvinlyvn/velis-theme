#!/usr/bin/env node
// Step-2 screenshots (mockup over local http): first screen + full page at M1–M5 × 3 pages × hero A/B (real scroll, every
// picture decoded, sticky parts left as they are), hero A overlay close-ups, MPP facts close-ups, visible states.
// Saved as JPEG; full pages are scaled to ≤ 1000 px wide afterwards (python3 + PIL) to keep the repo small.
// Usage: node tools/shots_mockup.mjs http://127.0.0.1:8765 screenshots/mockup-b2
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://127.0.0.1:8765', dir = 'screenshots/mockup-b2'] = process.argv.slice(2);
const M = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], M4: [960, 540, 2], M5: [390, 844, 2] };
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
for (const d of ['man-dau', 'ca-trang', 'can-canh']) mkdirSync(`${dir}/${d}`, { recursive: true });

const b = await chromium.launch();
async function open(page, m, q) {
	const [w, h, dpr] = typeof m === 'string' ? M[m] : m;
	const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
	const p = await ctx.newPage();
	await p.goto(`${base}/${page}.html?${q}`, { waitUntil: 'load' });
	await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
	await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }))); // lazy slides off to the side never load otherwise
	await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(250);
	return p;
}
const jpg = { type: 'jpeg', quality: 72 };
for (const page of PAGES) for (const hero of ['a', 'b']) for (const m of Object.keys(M)) {
	const p = await open(page, m, `hero=${hero}`);
	await p.screenshot({ ...jpg, path: `${dir}/man-dau/${page}-${hero}-${m}.jpg` });
	await p.screenshot({ ...jpg, path: `${dir}/ca-trang/${page}-${hero}-${m}.jpg`, fullPage: true });
	await p.context().close();
}
// hero A: 600 × 400 at the gradient's fade-out (≈ 45–75 % of the width), M2 / M3, TGC + MPP
for (const page of ['the-global-city', 'masteri-park-place']) for (const m of ['M2', 'M3']) {
	const p = await open(page, m, 'hero=a&tam=0');
	const r = await p.evaluate(() => { const h = document.querySelector('.hero').getBoundingClientRect(); return { x: Math.round(innerWidth * 0.42), y: Math.round(h.top + h.height / 2 - 200) }; });
	await p.screenshot({ type: 'jpeg', quality: 88, path: `${dir}/can-canh/lop-phu-${page}-${m}.jpg`, clip: { ...r, width: 600, height: 400 } });
	await p.context().close();
}
// MPP facts bar at M1, M2, 1024, M5
for (const [name, m] of [['M1', 'M1'], ['M2', 'M2'], ['1024', [1024, 768, 1]], ['M5', 'M5']]) {
	const p = await open('masteri-park-place', m, 'hero=b');
	await p.locator('.facts').screenshot({ type: 'jpeg', quality: 88, path: `${dir}/can-canh/thanh-thong-tin-mpp-${name}.jpg` });
	await p.context().close();
}
// visible states: mobile menu open, active tab, open FAQ, form field error
{
	let p = await open('trang-chu', 'M5', 'trang-thai=menu');
	await p.screenshot({ ...jpg, path: `${dir}/can-canh/trang-thai-menu-M5.jpg` }); await p.context().close();
	p = await open('the-global-city', 'M1', 'hero=b');
	await p.evaluate(() => { const t = document.getElementById('vi-tri'); scrollTo(0, t.getBoundingClientRect().top + scrollY - 160); }); await p.waitForTimeout(300);
	await p.screenshot({ ...jpg, path: `${dir}/can-canh/trang-thai-tab-vi-tri-M1.jpg` });
	await p.locator('#hoi-dap').screenshot({ ...jpg, path: `${dir}/can-canh/trang-thai-faq-mo-M1.jpg` }); await p.context().close();
	p = await open('masteri-park-place', 'M5', 'trang-thai=loi-form');
	await p.locator('#tu-van').screenshot({ ...jpg, path: `${dir}/can-canh/trang-thai-loi-form-M5.jpg` }); await p.context().close();
}
await b.close();
console.log('xong');
