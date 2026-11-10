#!/usr/bin/env node
// Vòng bố cục + ổn định: full-page shots of every template of tools/templates-b5.txt (STAGING, view password, read-only).
// Screens: M2 1536×864@1.25 · W1027 1027×768@1 · M3 1920×1080@1 (Chromium) · I14 iPhone 14 (WebKit). JPEG, CSS pixels.
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_templates_b5.mjs <out-dir> [screens = M2,I14] [only = name,name]
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
const pw = createRequire(import.meta.url)('playwright');
const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';
const SCREENS = { M2: [1536, 864, 1.25], W1027: [1027, 768, 1], M3: [1920, 1080, 1], I14: 'iPhone 14' };
const [dir = 'screenshots/on-dinh/trang', scr = 'M2,I14', only = ''] = process.argv.slice(2);
const pages = readFileSync('tools/templates-b5.txt', 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/).slice(0, 2))
	.filter(([n]) => !only || only.split(',').includes(n));
mkdirSync(dir, { recursive: true });
for (const s of scr.split(',')) {
	const wk = SCREENS[s] === 'iPhone 14';
	const b = await (wk ? pw.webkit : pw.chromium).launch();
	const ctx = await b.newContext(wk ? { ...pw.devices['iPhone 14'] } : { viewport: { width: SCREENS[s][0], height: SCREENS[s][1] }, deviceScaleFactor: SCREENS[s][2] });
	const p = await ctx.newPage();
	await p.goto(BASE + '/'); await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	for (const [name, path] of pages) {
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
		await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
		await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
		await p.addStyleTag({ content: '.header, .tabs, .cta { position: static !important; }' }); // sticky bars once, at the top
		await p.waitForTimeout(300);
		await p.screenshot({ path: `${dir}/${name}-${s}.jpg`, type: 'jpeg', quality: 60, fullPage: true, scale: 'css' });
	}
	await b.close();
}
console.log('xong', dir);
