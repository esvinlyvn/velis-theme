#!/usr/bin/env node
// Vòng bố cục + ổn định (mục 3.5, 4): per template page × screen – page height, main / side column widths, side share of
// the frame, left vs right empty space of the page header and of the main column, widest empty area beside content.
// Staging guest view (view password). Usage:
//   VIEW_PASSWORD_FILE=… node tools/check_layout_b5.mjs <out.json> [templates file = tools/templates-b5.txt] [screens = M1,M2,M3]
//   screens: M1 1366×768@1 · M2 1536×864@1.25 · M3 1920×1080@1 · X 2560×1440@1 · I14 iPhone 14 (WebKit)
// 2026-11-11 (item 2 / 1b): mainOff = elements of the main column whose left/right edge is off the column by > 1 px;
// sideTop = side column top − main column content top (≤ 8); underline = links underlined in their normal state (must be 0).
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const pw = require('playwright');
const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';
const SCREENS = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], X: [2560, 1440, 1], I14: 'iPhone 14' };
const [out = 'layout.json', list = 'tools/templates-b5.txt', scr = 'M1,M2,M3'] = process.argv.slice(2);
const pages = readFileSync(list, 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/).slice(0, 2));

// Runs in the page. Edges: the frame = header bar (.header__bar) left/right.
export function probe() {
	const R = (e) => e && e.getBoundingClientRect();
	const bar = R(document.querySelector('.header__bar, .header .wrap')), fw = bar.width;
	const main = R(document.querySelector('.page__main')), side = R(document.querySelector('.page__side'));
	const head = document.querySelector('main .hero:not(.hero--home) .hero__body, .hero--b .hero__body, .hero--a .hero__body');
	const kids = head ? [...head.children].filter((k) => R(k).width) : [];
	const hl = kids.length ? Math.min(...kids.map((k) => R(k).left)) : null, hr = kids.length ? Math.max(...kids.map((k) => R(k).right)) : null;
	const r = {
		h: Math.round(document.documentElement.scrollHeight), frame: Math.round(fw),
		main: main ? Math.round(main.width) : null, side: side && side.width ? Math.round(side.width) : null,
		sidePct: side && side.width ? +(side.width / fw * 100).toFixed(1) : null,
		sideEdge: side && side.width ? +(side.right - bar.right).toFixed(1) : null,
		gap: main && side && side.width ? Math.round(side.left - main.right) : null,
		headL: hl === null ? null : Math.round(hl - bar.left), headR: hr === null ? null : Math.round(bar.right - hr),
	};
	// widest empty band beside content: per 200 px slice of the main area, the largest horizontal gap inside the frame
	// a band counts only when it is empty at y − 32, y and y + 32 (the 24–40 px gap under a heading is not an empty area)
	const band = (y) => {
		const xs = [];
		for (let x = bar.left + 4; x < bar.right; x += 16) { const e = document.elementFromPoint(x, y - scrollY); if (!e) continue; const t = e.closest('p, li, h1, h2, h3, img, figure, table, .card, .btn, .facts, .advisor, dl, iframe, .map, .gallery, form'); xs.push(t ? 1 : 0); }
		let run = 0, best = 0, seen = false;
		for (const v of xs) { if (v) { seen = true; best = Math.max(best, run); run = 0; } else run++; }
		return seen ? best * 16 / fw * 100 : 0;
	};
	let empty = 0;
	for (let y = 120; y < innerHeight * 6 && y < document.documentElement.scrollHeight; y += 200) empty = Math.max(empty, Math.min(band(y - 32), band(y), band(y + 32)));
	r.emptyPct = +empty.toFixed(1);
	const mainEl = document.querySelector('.page__main');
	if (main && side && side.width) {
		const off = [];
		for (const e of mainEl.querySelectorAll(':scope > .block:not(.block--dark) > *, :scope > .block.prose > *, .block:not(.block--dark) > .prose > *, :scope > header')) { // the dark gallery box spans the column, its content is inset
			const st = getComputedStyle(e), b = R(e);
			if (!b.width || st.display.startsWith('inline') || st.position === 'absolute' || e.matches('.btn, .clamp__fade, script, style, .sr-only, .eyebrow, .clamp__more, .card__more')) continue;
			if (e.matches('figure, .crop') && e.querySelector('img') && e.querySelector('img').naturalWidth && b.width < main.width - 2) continue; // a small picture shows at its own size (round 8)
			const d = Math.max(Math.abs(b.left - main.left), Math.abs(main.right - b.right));
			if (d > 1) off.push(`${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]} ${Math.round(d)}`);
		}
		r.mainOff = off.length; r.mainOffList = off.slice(0, 5);
		const first = [...mainEl.querySelectorAll('.block, header')].find((x) => R(x).height > 0);
		const firstContent = first ? [...first.children].find((x) => R(x).height > 0) : null;
		r.sideTop = firstContent ? Math.round(side.top - R(firstContent).top) : null;
	}
	r.underline = [...document.querySelectorAll('a')].filter((a) => { const b = R(a); return b.width && getComputedStyle(a).textDecorationLine.includes('underline'); }).length;
	return r;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const res = {};
	for (const s of scr.split(',')) {
		const isWk = SCREENS[s] === 'iPhone 14';
		const br = await (isWk ? pw.webkit : pw.chromium).launch();
		const ctxOpt = isWk ? { ...pw.devices['iPhone 14'] } : { viewport: { width: SCREENS[s][0], height: SCREENS[s][1] }, deviceScaleFactor: SCREENS[s][2] };
		const ctx = await br.newContext(ctxOpt);
		const p = await ctx.newPage();
		await p.goto(BASE + '/'); await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
		for (const [name, path] of pages) {
			try {
				await p.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
				await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
				await p.waitForTimeout(300);
				(res[name] ??= {})[s] = await p.evaluate(probe);
			} catch (e) { (res[name] ??= {})[s] = { error: String(e).slice(0, 120) }; }
		}
		await br.close();
	}
	writeFileSync(out, JSON.stringify(res, null, 1));
	for (const [n, v] of Object.entries(res)) console.log(n.padEnd(20), Object.entries(v).map(([s, r]) => `${s} h${r.h} m${r.main}|s${r.side} ${r.sidePct ?? '-'}% gap${r.gap ?? '-'} edge${r.sideEdge ?? '-'} head ${r.headL}/${r.headR} empty${r.emptyPct}% off${r.mainOff ?? '-'} top${r.sideTop ?? '-'} u${r.underline}`).join(' · '));
}
