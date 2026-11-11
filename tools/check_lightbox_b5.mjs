#!/usr/bin/env node
// Vòng bố cục 5.11 – lightbox on STAGING (view password, read-only): landscape photo, plan (gallery / product lines) and a
// picture in post text, at M2 (Chromium 1536×864@1.25) and iPhone 14 (WebKit). Checks: picture inside 90vw × 85vh and the
// screen, dark ground ≥ 90 % opacity, flagged photo cropped (is-crop), close ≥ 44 px, → moves, Esc / ground / swipe down
// close, focus back on the opener. Usage: VIEW_PASSWORD_FILE=… node tools/check_lightbox_b5.mjs [out-dir]
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const pw = createRequire(import.meta.url)('playwright');
const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';
const [dir = 'screenshots/on-dinh/lightbox'] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const CASES = [ // [name, path, selector of the opener]
	['anh-ngang', '/du-an/the-global-city/', '[data-gallery] [data-zoom]'],
	['mat-bang', '/du-an/the-prive/', '[data-zoom]:has(img.is-plan), button.pic[data-zoom]'],
	['anh-doc-trong-bai', '/blog/the-prive/velis-realty-phan-phoi-doc-quyen-thap-9-the-prive/', '.prose img:not(a img, .card img)'],
];
const rows = []; let bad = 0;
for (const [scr, kind, opt] of [['M2', 'chromium', { viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25 }], ['I14', 'webkit', { ...pw.devices['iPhone 14'] }]]) {
	const b = await pw[kind].launch(); const ctx = await b.newContext(opt); const p = await ctx.newPage();
	await p.goto(BASE + '/'); await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	for (const [name, path, sel] of CASES) {
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
		const opener = p.locator(sel).locator('visible=true').first(); // a picture in a collapsed part / hidden tab pane is not a target
		if (!(await opener.count())) { rows.push([scr, name, 'không có ảnh để mở']); bad++; continue; }
		await opener.scrollIntoViewIfNeeded(); await opener.click();
		await p.waitForFunction(() => { const i = document.querySelector('.lightbox[open] img'); return i && i.complete && i.naturalWidth; }, null, { timeout: 20000 }).catch(() => {});
		await p.waitForTimeout(400);
		const m = await p.evaluate(() => {
			const d = document.querySelector('.lightbox'), i = d.querySelector('img'), f = d.querySelector('.lightbox__frame').getBoundingClientRect(), c = d.querySelector('.lightbox__close').getBoundingClientRect();
			const bg = getComputedStyle(d).backgroundColor.match(/[\d.]+/g).map(Number);
			return { open: d.open, w: Math.round(f.width), h: Math.round(f.height), vw: innerWidth, vh: innerHeight, inside: f.left >= 0 && f.top >= 0 && f.right <= innerWidth + 0.5 && f.bottom <= innerHeight + 0.5,
				fit: f.width <= innerWidth * 0.9 + 1 && f.height <= innerHeight * 0.85 + 1, alpha: bg[3] ?? 1, dark: Math.max(...bg.slice(0, 3)) <= 26, crop: d.classList.contains('is-crop'), close: Math.min(c.width, c.height), n: [...d.querySelectorAll('[data-step]')].filter((x) => !x.hidden).length, src: i.currentSrc || i.src };
		});
		await p.screenshot({ path: `${dir}/${name}-${scr}.jpg`, type: 'jpeg', quality: 70, scale: 'css' });
		let moved = 'không cần (1 ảnh)';
		if (m.n) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200); moved = (await p.evaluate(() => document.querySelector('.lightbox img').src)) !== m.src ? 'đạt' : 'LỖI'; }
		await p.keyboard.press('Escape'); await p.waitForTimeout(200);
		const esc = await p.evaluate(() => !document.querySelector('.lightbox').open);
		const focus = await opener.evaluate((e) => document.activeElement === e);
		await opener.click(); await p.waitForTimeout(300);
		await p.mouse.click(4, Math.round(m.vh / 2 + 120)); await p.waitForTimeout(200); // the dark ground beside the picture
		const ground = await p.evaluate(() => !document.querySelector('.lightbox').open);
		let swipe = '–';
		if (scr === 'I14') {
			await opener.click(); await p.waitForTimeout(300);
			await p.evaluate(() => { // WebKit has no Touch constructor: plain events carrying the touch lists the handler reads
				const d = document.querySelector('.lightbox'), ev = (type, key, y) => { const e = new Event(type, { bubbles: true }); Object.defineProperty(e, key, { value: [{ clientX: 100, clientY: y }] }); return e; };
				d.dispatchEvent(ev('touchstart', 'touches', 200)); d.dispatchEvent(ev('touchend', 'changedTouches', 400)); });
			await p.waitForTimeout(200);
			swipe = (await p.evaluate(() => !document.querySelector('.lightbox').open)) ? 'đạt' : 'LỖI';
		}
		const ok = m.open && m.inside && m.fit && m.alpha >= 0.9 && m.dark && m.close >= 44 && moved !== 'LỖI' && esc && focus && ground && swipe !== 'LỖI';
		if (!ok) bad++;
		rows.push([scr, name, `${m.w}×${m.h} trong ${m.vw}×${m.vh} · trọn: ${m.inside && m.fit ? 'đạt' : 'LỖI'} · nền ${m.alpha} ${m.dark ? 'tối' : 'SÁNG'} · cắt W-A: ${m.crop ? 'có' : 'không'} · nút đóng ${Math.round(m.close)} px · → ${moved} · Esc ${esc ? 'đạt' : 'LỖI'} · focus ${focus ? 'đạt' : 'LỖI'} · bấm nền ${ground ? 'đạt' : 'LỖI'} · vuốt ${swipe}`]);
	}
	await b.close();
}
const md = `# Khung phóng to ảnh (5.11) – ${new Date().toISOString().slice(0, 10)}\n\n| Màn | Ảnh | Kết quả |\n|---|---|---|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n\n**Lỗi: ${bad}**\n`;
writeFileSync(`${dir}/ket-qua.md`, md);
console.log(md);
process.exit(bad ? 1 : 0);
