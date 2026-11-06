#!/usr/bin/env node
// Step 3 – home hero on STAGING (guest view behind the staging password): first screen M1–M5 + the boxes of H1, lead,
// 2 buttons and the "Dự án nổi bật" strip, so the rebuilt hero can be compared with the 0.9.8 baseline (≤ 2 px).
// Selectors cover both the 0.9.8 markup (.v-*) and the 1.0 markup.
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_b3.mjs --hero <out-dir> <prefix>      (prefix: hero-trang-chu)
//        node tools/shots_b3.mjs --compare <before.json> <after.json>                 (prints the box deltas, exit 1 if > 2 px)
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';
export const SCREENS = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], M4: [960, 540, 2], M5: [390, 844, 2] };
export const BOXES = {
	h1: '.v-hero--home h1, .hero--home h1',
	lead: '.v-hero--home .v-hero__lead, .hero--home .hero__lead',
	btn1: ['.v-hero--home .v-row .v-btn, .hero--home .actions .btn', 0],
	btn2: ['.v-hero--home .v-row .v-btn, .hero--home .actions .btn', 1],
	dai: '.v-hero--home .v-feats, .hero--home .feats',
};

export async function login(b) {
	const c = await b.newContext(); const p = await c.newPage();
	await p.goto(BASE + '/');
	await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	const s = await c.storageState(); await c.close(); return s;
}

if (process.argv[2] === '--hero') {
	const [, , , dir, prefix = 'hero-trang-chu'] = process.argv;
	mkdirSync(dir, { recursive: true });
	const b = await chromium.launch(), state = await login(b), out = {};
	for (const [m, [w, h, dpr]] of Object.entries(SCREENS)) {
		const ctx = await b.newContext({ storageState: state, viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
		const p = await ctx.newPage();
		await p.goto(BASE + '/', { waitUntil: 'load', timeout: 120000 });
		await p.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => i.complete && i.naturalWidth), null, { timeout: 30000 }).catch(() => {});
		await p.waitForTimeout(500);
		await p.screenshot({ path: `${dir}/${prefix}-${m}.jpg`, type: 'jpeg', quality: 82 });
		out[m] = await p.evaluate((B) => Object.fromEntries(Object.entries(B).map(([k, s]) => {
			const [sel, i] = Array.isArray(s) ? s : [s, 0], e = document.querySelectorAll(sel)[i];
			if (!e) return [k, null];
			const r = e.getBoundingClientRect();
			return [k, { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), text: e.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) }];
		})), BOXES);
		await ctx.close();
	}
	await b.close();
	writeFileSync(`${dir}/${prefix}-hop.json`, JSON.stringify(out, null, 1));
	console.log(JSON.stringify(out));
}

if (process.argv[2] === '--compare') {
	const [a, z] = process.argv.slice(3).map((f) => JSON.parse(readFileSync(f, 'utf8')));
	let bad = 0;
	for (const m of Object.keys(a)) for (const k of Object.keys(a[m])) {
		const p = a[m][k], q = z[m]?.[k];
		if (!p || !q) { console.log(`${m} ${k}: thiếu (${!p ? 'trước' : 'sau'})`); bad++; continue; }
		const d = Math.max(...['x', 'y', 'w', 'h'].map((t) => Math.abs(p[t] - q[t])));
		if (d > 2 || p.text !== q.text) bad++;
		console.log(`${m} ${k}: lệch ${d.toFixed(1)} px${p.text !== q.text ? ' – CHỮ KHÁC' : ''}`);
	}
	console.log('vượt 2 px / khác chữ:', bad);
	process.exit(bad ? 1 : 0);
}
