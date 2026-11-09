#!/usr/bin/env node
// Step 3 – main component boxes of the mockup (local) vs STAGING, same page / screen / hero style. One selector list for both
// sides (the theme uses the mockup's class names). For every selector the n-th match on each side is paired; x / width /
// height must agree within 2 px (y is printed for information: it adds up the heights of everything above).
// Usage: VIEW_PASSWORD_FILE=… node tools/compare_mockup.mjs http://127.0.0.1:8765 out-dir
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

export const SEL = ['.header__bar', '.hero__body', '.hero__media', '.hero h1', '.hero .actions', '.feats', '.facts__list', '.tabs', '.sechead', '.card', '.numbers', '.partners', '.values', '.duo__item', '.page__side', '.gallery', '.faq', '.contact', '.footer__grid'];
const SCREENS = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], M4: [960, 540, 2], M5: [390, 844, 2] };
const PAGES = [['trang-chu', '/', 'trang-chu.html', ['']], ['the-global-city', '/du-an/the-global-city/', 'the-global-city.html', ['a', 'b']], ['masteri-park-place', '/du-an/the-global-city/masteri-park-place/', 'masteri-park-place.html', ['a', 'b']]];

/** Pairs the boxes of both sides: { sel, i, dx, dw, dh, dy } with dx/dw/dh in px; a box missing on one side is reported as such. */
export function diff(a, b) {
	const out = [];
	for (const s of Object.keys(a)) for (let i = 0; i < Math.max(a[s].length, (b[s] || []).length); i++) {
		const p = a[s][i], q = (b[s] || [])[i];
		if (!p || !q) { out.push({ sel: s, i, missing: !p ? 'mockup' : 'staging' }); continue; }
		out.push({ sel: s, i, dx: +(q.x - p.x).toFixed(1), dw: +(q.w - p.w).toFixed(1), dh: +(q.h - p.h).toFixed(1), dy: +(q.y - p.y).toFixed(1) });
	}
	return out;
}
const over = (d) => d.missing || Math.max(Math.abs(d.dx), Math.abs(d.dw), Math.abs(d.dh)) > 2;
// self-check
{ const r = diff({ '.a': [{ x: 0, y: 0, w: 10, h: 10 }] }, { '.a': [{ x: 1, y: 50, w: 13, h: 10 }, { x: 0, y: 0, w: 1, h: 1 }] }); console.assert(r.length === 2 && r[0].dw === 3 && over(r[0]) && r[1].missing === 'mockup', 'diff'); }

async function boxes(p) {
	return p.evaluate((SEL) => Object.fromEntries(SEL.map((s) => [s, [...document.querySelectorAll(s)].filter((e) => e.getClientRects().length && !e.closest('[hidden], .mk, .mk-float')).map((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; })])), SEL);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [mock = 'http://127.0.0.1:8765', dir = 'screenshots/b3/so-mockup'] = process.argv.slice(2);
	mkdirSync(dir, { recursive: true });
	const b = await chromium.launch();
	const c = await b.newContext(), lp = await c.newPage();
	await lp.goto('https://staging.velisrealty.vn/'); await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	const state = await c.storageState(); await c.close();
	const lines = [], all = {};
	for (const [name, path, file, heroes] of PAGES) for (const hero of heroes) for (const [m, [w, h, dpr]] of Object.entries(SCREENS)) {
		const get = async (url, st) => {
			const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, storageState: st, reducedMotion: 'reduce' });
			const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'load', timeout: 120000 });
			await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
			await p.waitForTimeout(300);
			const r = await boxes(p);
			if (m === 'M2') await p.screenshot({ path: `${dir}/${name}${hero ? '-' + hero : ''}-${url.startsWith('http://127') ? 'mockup' : 'staging'}.jpg`, fullPage: true, type: 'jpeg', quality: 60 });
			await ctx.close(); return r;
		};
		const a = await get(`${mock}/${file}${hero ? '#hero-' + hero : ''}`), z = await get(`https://staging.velisrealty.vn${path}${hero ? '?velis_hero=' + hero : ''}`, state);
		const d = diff(a, z), bad = d.filter(over);
		all[`${name}${hero ? ' ' + hero.toUpperCase() : ''} ${m}`] = d;
		lines.push(`| ${name}${hero ? ' ' + hero.toUpperCase() : ''} | ${m} | ${d.length - bad.length}/${d.length} | ${bad.slice(0, 6).map((x) => x.missing ? `${x.sel}[${x.i}] thiếu ở ${x.missing}` : `${x.sel}[${x.i}] x${x.dx} w${x.dw} h${x.dh}`).join('; ') || '–'} |`);
		console.log(lines.at(-1));
	}
	await b.close();
	writeFileSync(`${dir}/hop.json`, JSON.stringify(all, null, 1));
	writeFileSync(`${dir}/so-hop.md`, `# Hộp component mockup ↔ staging – ${new Date().toISOString().slice(0, 10)}\n\nCặp hộp thứ n của cùng selector; đạt khi lệch x, rộng, cao ≤ 2 px (y chỉ để tham khảo).\n\n| Trang | Màn | Hộp đạt | Hộp lệch > 2 px (tối đa 6) |\n|---|---|---|---|\n${lines.join('\n')}\n`);
}
