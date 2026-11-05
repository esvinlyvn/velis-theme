#!/usr/bin/env node
// Step-2 screenshots (mockup over local http, state in the #hash): first screen M1–M5 × 3 pages × hero A/B (images
// decoded, sticky parts left as they are), featured strip at 1024/1366/1536/1920, dark form, hero B edges at M2 with the
// content-frame edges drawn, hero A overlay boundary, visible states. Optional full pages with --full.
// Usage: node tools/shots_mockup.mjs http://127.0.0.1:8765 screenshots/mockup-b2-r2 [--full]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://127.0.0.1:8765', dir = 'screenshots/mockup-b2-r2', full] = process.argv.slice(2);
const M = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], M4: [960, 540, 2], M5: [390, 844, 2] };
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
for (const d of ['man-dau', 'can-canh', ...(full ? ['ca-trang'] : [])]) mkdirSync(`${dir}/${d}`, { recursive: true });

const b = await chromium.launch();
async function open(page, m, hash = '', query = '') {
	const [w, h, dpr] = typeof m === 'string' ? M[m] : m;
	const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
	const p = await ctx.newPage();
	await p.goto(`${base}/${page}.html${query}${hash}`, { waitUntil: 'load' });
	await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
	await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }))); // lazy slides off to the side never load otherwise
	await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(250);
	return p;
}
const jpg = { type: 'jpeg', quality: 80 };
// --r4 (trang chủ theo trang cũ + BRIEF): home first screen + full page M1–M5; old live home | new home at 1536×864 DPR 1,25
if (full === '--r4') {
	mkdirSync(`${dir}/ca-trang`, { recursive: true });
	for (const m of Object.keys(M)) {
		const p = await open('trang-chu', m);
		await p.screenshot({ ...jpg, path: `${dir}/man-dau/trang-chu-${m}.jpg` });
		await p.screenshot({ ...jpg, quality: 70, path: `${dir}/ca-trang/trang-chu-${m}.jpg`, fullPage: true });
		await p.context().close();
	}
	// the old home on the live site: read-only GET of the public page, counters left to finish, nothing clicked but scroll
	const ctx = await b.newContext({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25, userAgent: 'Mozilla/5.0 (compatible; velis-redesign-audit)' });
	const old = await ctx.newPage();
	await old.goto('https://velisrealty.vn/', { waitUntil: 'load', timeout: 60000 });
	await old.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); } scrollTo(0, 0); });
	await old.waitForTimeout(3000);
	await old.screenshot({ ...jpg, quality: 70, path: `${dir}/ca-trang/trang-chu-cu-1536.jpg`, fullPage: true });
	await ctx.close();
	await b.close();
	console.log('xong');
	process.exit(0);
}
// --r3 (vòng định vị môi giới): new home – first screen + full page M1–M5; "Velis tư vấn" card on TGC / MPP (desktop + mobile)
if (full === '--r3') {
	mkdirSync(`${dir}/ca-trang`, { recursive: true });
	for (const m of Object.keys(M)) {
		const p = await open('trang-chu', m);
		await p.screenshot({ ...jpg, path: `${dir}/man-dau/trang-chu-${m}.jpg` });
		await p.screenshot({ ...jpg, quality: 70, path: `${dir}/ca-trang/trang-chu-${m}.jpg`, fullPage: true });
		await p.context().close();
	}
	for (const page of ['the-global-city', 'masteri-park-place']) {
		let p = await open(page, 'M1', '#hero-b');
		await p.evaluate(() => scrollTo(0, document.querySelector('#tong-quan').getBoundingClientRect().top + scrollY - 160)); await p.waitForTimeout(300);
		await p.locator('.page__side .advisor').screenshot({ ...jpg, path: `${dir}/can-canh/velis-tu-van-${page}-M1.jpg` });
		await p.screenshot({ ...jpg, path: `${dir}/can-canh/velis-tu-van-${page}-M1-ca-man.jpg` });
		await p.context().close();
		p = await open(page, 'M5', '#hero-b');
		await p.locator('.advisor--inline').screenshot({ ...jpg, path: `${dir}/can-canh/velis-tu-van-${page}-M5.jpg` });
		await p.context().close();
	}
	for (const [n, sel, m] of [['form-ngan', '.advise__form', 'M1'], ['tim-du-an', '#tim-du-an', 'M1'], ['vi-sao-velis', '#ve-velis', 'M1'], ['form-toi', '#tu-van', 'M1']]) {
		const p = await open('trang-chu', m);
		await p.locator(sel).screenshot({ ...jpg, path: `${dir}/can-canh/trang-chu-${n}-${m}.jpg` });
		await p.context().close();
	}
	await b.close();
	console.log('xong');
	process.exit(0);
}
for (const page of PAGES) for (const hero of ['a', 'b']) for (const m of Object.keys(M)) {
	const p = await open(page, m, `#hero-${hero}`);
	await p.screenshot({ ...jpg, path: `${dir}/man-dau/${page}-${hero}-${m}.jpg` });
	if (full) await p.screenshot({ ...jpg, quality: 70, path: `${dir}/ca-trang/${page}-${hero}-${m}.jpg`, fullPage: true });
	await p.context().close();
}
// NT-10 featured strip, hero A and B, 1024 / 1366 / 1536 / 1920
for (const hero of ['a', 'b']) for (const [n, m] of [['1024', [1024, 768, 1]], ['1366', 'M1'], ['1536', 'M2'], ['1920', 'M3']]) {
	const p = await open('trang-chu', m, `#hero-${hero}`);
	await p.locator('.feats').screenshot({ ...jpg, path: `${dir}/can-canh/dai-noi-bat-${hero}-${n}.jpg` });
	await p.context().close();
}
// NT-13 dark form (3 pages at M1, one at M5) + the error state
for (const [page, m, q] of [['trang-chu', 'M1', ''], ['the-global-city', 'M1', ''], ['masteri-park-place', 'M1', ''], ['masteri-park-place', 'M5', '?trang-thai=loi-form']]) {
	const p = await open(page, m, '#hero-b', q);
	await p.locator('#tu-van').screenshot({ ...jpg, path: `${dir}/can-canh/form-toi-${page}-${m}${q ? '-loi' : ''}.jpg` });
	await p.context().close();
}
// NT-17 hero B edges at M2: the content-frame edges (header .wrap) drawn as 1 px red lines over the whole first screen
for (const page of PAGES) {
	const p = await open(page, 'M2', '#hero-b');
	await p.evaluate(() => {
		const r = document.querySelector('.header__bar').getBoundingClientRect();
		for (const x of [r.left, r.right - 1]) { const l = document.createElement('div'); l.style.cssText = `position:fixed;top:0;bottom:0;left:${x}px;width:1px;background:#e00;z-index:99`; document.body.append(l); }
	});
	const r = await p.evaluate(() => { const m = document.querySelector('.hero__media').getBoundingClientRect(); return { l: m.left, r: m.right }; });
	await p.screenshot({ ...jpg, path: `${dir}/can-canh/mep-hero-b-${page}-M2.jpg` });
	await p.screenshot({ type: 'png', path: `${dir}/can-canh/mep-trai-${page}-M2.png`, clip: { x: Math.round(r.l) - 60, y: 0, width: 200, height: 864 } });
	await p.screenshot({ type: 'png', path: `${dir}/can-canh/mep-phai-${page}-M2.png`, clip: { x: Math.round(r.r) - 140, y: 0, width: 200, height: 864 } });
	await p.context().close();
}
// NT-41/43 hero A overlay boundary 600 × 400 at the fade-out, M2 / M3
for (const page of ['the-global-city', 'masteri-park-place']) for (const m of ['M2', 'M3']) {
	const p = await open(page, m, '#hero-a,tam-0');
	const r = await p.evaluate(() => { const h = document.querySelector('.hero').getBoundingClientRect(); return { x: Math.round(innerWidth * 0.3), y: Math.round(h.top + h.height / 2 - 200) }; });
	await p.screenshot({ type: 'jpeg', quality: 88, path: `${dir}/can-canh/lop-phu-${page}-${m}.jpg`, clip: { ...r, width: 600, height: 400 } });
	await p.context().close();
}
// visible states: mobile menu open, floating switch open
{
	let p = await open('trang-chu', 'M5', '', '?trang-thai=menu');
	await p.screenshot({ ...jpg, path: `${dir}/can-canh/trang-thai-menu-M5.jpg` }); await p.context().close();
	p = await open('the-global-city', 'M1', '#hero-b');
	await p.click('.mk-float summary'); await p.waitForTimeout(150);
	await p.screenshot({ ...jpg, path: `${dir}/can-canh/cong-tac-noi-M1.jpg` }); await p.context().close();
}
await b.close();
console.log('xong');
