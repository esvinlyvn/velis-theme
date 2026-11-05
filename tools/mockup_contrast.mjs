#!/usr/bin/env node
// NT-47: text contrast on the full-frame hero (style A), 5 background points behind every text line.
// The text (and chip borders) is made transparent, the screen is captured, and the background colour is read at 10/30/50/70/90 %
// of each line's width on its middle row; ratio = WCAG contrast of the text colour against that pixel. Read-only, local.
// Usage: node tools/mockup_contrast.mjs http://127.0.0.1:8765 out.json
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://127.0.0.1:8765', out = 'contrast.json'] = process.argv.slice(2);
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
const M = [['M1', 1366, 768, 1], ['M2', 1536, 864, 1.25], ['M3', 1920, 1080, 1], ['M4', 960, 540, 2], ['M5', 390, 844, 2]];

export const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// self-check of the formula (WCAG reference values)
console.assert(Math.abs(ratio([0, 0, 0], [255, 255, 255]) - 21) < 0.01 && Math.abs(ratio([118, 118, 118], [255, 255, 255]) - 4.54) < 0.02, 'WCAG ratio');

if (import.meta.url === `file://${process.argv[1]}`) {
	const b = await chromium.launch();
	const rows = [];
	for (const page of PAGES) for (const [m, w, h, dpr] of M) {
		const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })).newPage();
		await p.goto(`${base}/${page}.html#hero-a,tam-0`, { waitUntil: 'load' });
		await p.waitForFunction(() => document.querySelector('.hero img').complete);
		// every text line in the hero body: [label, color, x, y, w, h] in CSS px; then hide the text
		const lines = await p.evaluate(() => {
			const body = document.querySelector('.hero__body'), res = [];
			const walk = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
			for (let n; (n = walk.nextNode());) {
				const el = n.parentElement;
				if (!n.textContent.trim() || el.closest('.btn:not(.btn--line)')) continue; // a filled button carries its own ground
				const rg = document.createRange(); rg.selectNodeContents(n);
				for (const r of rg.getClientRects()) if (r.width > 2) res.push([n.textContent.trim().slice(0, 28), getComputedStyle(el).color, r.left, r.top, r.width, r.height]);
			}
			const st = document.createElement('style');
			st.textContent = '.hero__body, .hero__body * { color: transparent !important; border-color: transparent !important; } .cta { display: none !important; }'; // measuring only, never shipped; the fixed CTA bar would cover the hero bottom at M4
			document.head.append(st);
			return res;
		});
		await p.waitForTimeout(100);
		const hr = await p.evaluate(() => { const r = document.querySelector('.hero').getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; });
		const shot = (await p.screenshot({ fullPage: true, clip: hr })).toString('base64'); // the hero may run below the fold (M4)
		const px = await p.evaluate(async ({ shot, pts }) => {
			const img = new Image(); img.src = 'data:image/png;base64,' + shot; await img.decode();
			const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
			const x = c.getContext('2d'); x.drawImage(img, 0, 0);
			return pts.map(([a, b]) => [...x.getImageData(Math.min(c.width - 1, Math.round(a)), Math.min(c.height - 1, Math.round(b)), 1, 1).data.slice(0, 3)]);
		}, { shot, pts: lines.flatMap(([, , l, t, lw, lh]) => [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => [(l + lw * f) * dpr, (t + lh / 2 - hr.y) * dpr])) });
		lines.forEach(([text, color, , , , lh], i) => {
			const fg = color.match(/[\d.]+/g).slice(0, 3).map(Number);
			const r = px.slice(i * 5, i * 5 + 5).map((bg) => +ratio(fg, bg).toFixed(2));
			rows.push({ page, m, text, points: r, min: Math.min(...r), ok: Math.min(...r) >= 4.5 });
		});
		await p.context().close();
	}
	await b.close();
	writeFileSync(out, JSON.stringify(rows, null, 1));
	const bad = rows.filter((r) => !r.ok);
	for (const pg of PAGES) for (const [m] of M) { const rs = rows.filter((r) => r.page === pg && r.m === m); console.log(`${pg} ${m}: ${rs.length} dòng, min ${Math.min(...rs.map((r) => r.min)).toFixed(2)}`); }
	console.log(bad.length ? `KHÔNG ĐẠT: ${bad.length} dòng < 4,5` : 'ĐẠT: mọi điểm ≥ 4,5');
	process.exit(bad.length ? 1 : 0);
}
