#!/usr/bin/env node
// Bước 4 – Safari (WebKit) check on STAGING (guest view behind the staging password), screen + print.
// Per page × device: (a) screen: slow full scroll → images not loaded; (b) print: fresh load, no scroll, print media +
// beforeprint (what iPhone "Lưu PDF" does) → images not loaded; (c) black blocks: share of near-black pixels inside the
// fade / scroll-row components (strip, area tabs, section tabs, "Đọc tiếp" fades) in screen and print; (d) 2-column content
// tables < 768 px: cell lines holding a single word, words cut mid-word. Saves screen + print JPEGs.
// WebKit has no page.pdf (Chromium only): the print check renders print media in WebKit; a Chromium page.pdf of the same
// page is also written (→ pdftoppm) for the empty-image-box count.
// Usage: VIEW_PASSWORD_FILE=… node tools/safari_b4.mjs <out-dir> [devices: iphone14,iphonese,desktop] [--no-pdf]
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url);
const { webkit, chromium, devices } = req('playwright');

const BASE = process.env.STAGING_URL || 'https://staging.velisrealty.vn';
export const PAGES = [['trang-chu', '/'], ['the-global-city', '/du-an/the-global-city/'], ['the-prive', '/du-an/the-prive/'],
	['masteri-park-place', '/du-an/the-global-city/masteri-park-place/'], ['nha-pho-spring-ville', '/du-an/spring-ville/nha-pho/'],
	['bai-tgc', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/'], ['du-an', '/du-an/']];
const DEV = { iphone14: { ...devices['iPhone 14'] }, iphonese: { ...devices['iPhone SE'] }, desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } };
export const FADES = '.feats ul, .ftabs, .tabs ul, .clamp__fade, .clamp';

// in page: images in the DOM that should show (rendered box) but have no decoded pixels
export function notLoaded() {
	return [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(i).visibility !== 'hidden' && !(i.complete && i.naturalWidth > 0); })
		.map((i) => (i.closest('[class]')?.className || '').split(' ')[0] + ' ' + (i.currentSrc || i.src).split('/').pop());
}
// in page: 2-column content tables – lines with one word that came from narrow wrapping, words split across lines
export function tableIssues() {
	const out = [];
	for (const t of document.querySelectorAll('.prose table, main table')) {
		const rows = [...t.rows].filter((r) => r.cells.length === 2);
		if (!rows.length || rows.length < t.rows.length / 2) continue;
		for (const r of rows) for (const c of r.cells) {
			const words = c.innerText.trim().split(/\s+/).filter(Boolean);
			if (words.length < 2) continue;
			const lines = new Map(), w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), rg = document.createRange();
			for (let n; (n = w.nextNode());) for (const m of n.data.matchAll(/\S+/g)) {
				rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
				const rs = [...rg.getClientRects()];
				if (rs.length > 1 && Math.abs(rs[0].top - rs.at(-1).top) > 2) out.push(`cắt giữa từ "${m[0]}"`);
				const k = Math.round(rs[0]?.top ?? 0); lines.set(k, (lines.get(k) || 0) + 1);
			}
			if (lines.size > 1 && [...lines.values()].slice(0, -1).some((n) => n === 1)) out.push(`dòng 1 từ: ${c.innerText.trim().slice(0, 40)}`);
		}
	}
	return out;
}

async function login(b) {
	const c = await b.newContext(); const p = await c.newPage();
	await p.goto(BASE + '/');
	await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	const s = await c.storageState(); await c.close(); return s;
}
// share of near-black pixels in each fade/scroll component (decoded in a blank page through a canvas)
async function black(p, blank) {
	const res = [];
	for (const el of await p.$$(FADES)) {
		const box = await el.boundingBox();
		if (!box || box.width < 20 || box.height < 10) continue;
		const png = (await el.screenshot({ type: 'png' }).catch(() => null))?.toString('base64');
		if (!png) continue;
		const share = await blank.evaluate(async (src) => {
			const i = new Image(); i.src = 'data:image/png;base64,' + src; await i.decode();
			const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
			const x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
			let n = 0; for (let k = 0; k < d.length; k += 4) if (d[k] < 28 && d[k + 1] < 28 && d[k + 2] < 28) n++;
			return n / (d.length / 4);
		}, png);
		const cls = await el.evaluate((e) => e.tagName.toLowerCase() + '.' + (e.className || e.parentElement.className).split(' ')[0]);
		const darkGround = await el.evaluate((e) => !!e.closest('.hero--home, .section--dark, .block--dark, .gallery'));
		res.push({ cls, share: +share.toFixed(3), darkGround });
	}
	return res;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [out, devArg = 'iphone14,iphonese,desktop', flag] = process.argv.slice(2);
	mkdirSync(out, { recursive: true });
	const wb = await webkit.launch(), state = await login(wb), rows = [];
	const blankCtx = await wb.newContext(), blank = await blankCtx.newPage();
	const only = process.env.ONLY ? process.env.ONLY.split(',') : null; // re-run some pages only
	for (const d of devArg.split(',')) for (const [name, path] of PAGES.filter(([n]) => !only || only.includes(n))) {
		const ctx = await wb.newContext({ ...DEV[d], storageState: state });
		// (a) screen
		let p = await ctx.newPage();
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
		await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); } });
		await p.waitForTimeout(2500);
		const scr = { notLoaded: await p.evaluate(notLoaded), tables: d === 'desktop' ? [] : await p.evaluate(tableIssues) };
		await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
		scr.black = (await black(p, blank)).filter((x) => !x.darkGround && x.share > 0.25);
		const h = Math.min(await p.evaluate(() => document.documentElement.scrollHeight), Math.floor(32000 / (DEV[d].deviceScaleFactor || 1))); // WebKit: image ≤ 32 767 px
		await p.screenshot({ path: `${out}/${name}-${d}-man-hinh.jpg`, type: 'jpeg', quality: 60, fullPage: true, clip: { x: 0, y: 0, width: DEV[d].viewport.width, height: h } }).catch((e) => console.log('không chụp được', name, d, e.message.split('\n')[0]));
		await p.close();
		// (b) print, as "Lưu PDF" on the phone: no scroll, print media, beforeprint
		p = await ctx.newPage();
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
		await p.emulateMedia({ media: 'print' });
		await p.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
		await p.waitForTimeout(4000);
		const prn = { notLoaded: await p.evaluate(notLoaded), black: (await black(p, blank)).filter((x) => !x.darkGround && x.share > 0.25) };
		const h2 = Math.min(await p.evaluate(() => document.documentElement.scrollHeight), Math.floor(32000 / (DEV[d].deviceScaleFactor || 1)));
		await p.screenshot({ path: `${out}/${name}-${d}-in.jpg`, type: 'jpeg', quality: 60, fullPage: true, clip: { x: 0, y: 0, width: DEV[d].viewport.width, height: h2 } }).catch(() => {});
		await ctx.close();
		rows.push({ name, d, scr, prn });
		console.log(`${name} ${d}: màn hình ảnh chưa tải ${scr.notLoaded.length}, khối đen ${scr.black.length}, bảng ${scr.tables.length} · in: ảnh chưa tải ${prn.notLoaded.length}, khối đen ${prn.black.length}`);
	}
	await wb.close();
	// Chromium page.pdf (WebKit has none): empty image boxes = images not loaded when the PDF is made without scrolling
	if (flag !== '--no-pdf') {
		const cb = await chromium.launch(), cs = await login(cb);
		for (const [name, path] of PAGES) {
			const ctx = await cb.newContext({ ...devices['iPhone 14'], storageState: cs }); const p = await ctx.newPage();
			await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
			await p.emulateMedia({ media: 'print' });
			await p.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
			await p.waitForTimeout(4000);
			const empty = await p.evaluate(notLoaded);
			await p.pdf({ path: `${out}/${name}.pdf`, width: '390px', printBackground: true });
			try { execFileSync('pdftoppm', ['-jpeg', '-r', '40', '-f', '1', '-l', '2', `${out}/${name}.pdf`, `${out}/${name}-pdf`]); } catch {}
			rows.find((r) => r.name === name && r.d === 'iphone14') && (rows.find((r) => r.name === name && r.d === 'iphone14').pdfEmpty = empty);
			console.log(`${name} pdf (Chromium): ô ảnh trống ${empty.length}`);
			await ctx.close();
		}
		await cb.close();
	}
	writeFileSync(`${out}/ket-qua.json`, JSON.stringify(rows, null, 1));
	const sum = (f) => rows.reduce((n, r) => n + f(r), 0);
	console.log('TỔNG – ảnh chưa tải (màn hình):', sum((r) => r.scr.notLoaded.length), '· ảnh chưa tải (in):', sum((r) => r.prn.notLoaded.length),
		'· khối đen:', sum((r) => r.scr.black.length + r.prn.black.length), '· bảng:', sum((r) => r.scr.tables.length), '· ô ảnh trống PDF:', sum((r) => r.pdfEmpty?.length || 0));
}
