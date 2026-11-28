#!/usr/bin/env node
// Giai đoạn 5, mục 6: 6 trang chuẩn (tools/suite-pages-ci.txt) trên 5 thiết bị – màn đầu + cả trang (JPEG nhỏ) và 3 số:
// tràn ngang, ảnh chưa tải sau khi cuộn hết, ảnh hỏng. Staging chỉ đọc (cookie mật khẩu xem, VIEW_PASSWORD_FILE).
// Usage: VIEW_PASSWORD_FILE=… node tools/thiet_bi_g5.mjs screenshots/g5/thiet-bi
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const { chromium, webkit, devices } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn', out = process.argv[2] || 'screenshots/g5/thiet-bi';
const PAGES = readFileSync(new URL('suite-pages-ci.txt', import.meta.url), 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/));
export const DEVICES = [
	['iphone-14', webkit, devices['iPhone 14']],
	['iphone-se', webkit, devices['iPhone SE']],
	['pixel-7', chromium, devices['Pixel 7']],
	['win-1536-125', chromium, { viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25 }],
	['win-150', chromium, { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 }], // 1920×1080 ở 150 %
];
console.assert(DEVICES.length === 5 && DEVICES.every(([, b, o]) => b && o.viewport), 'thiết bị thiếu cấu hình');
mkdirSync(out, { recursive: true });
const rows = [];
for (const [dev, engine, opts] of DEVICES) {
	const b = await engine.launch(), ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' }), p = await ctx.newPage();
	await p.goto(BASE + '/'); await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	for (const [name, path] of PAGES) {
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
		await p.waitForTimeout(800);
		await p.screenshot({ path: `${out}/${name}-${dev}-man-dau.jpg`, type: 'jpeg', quality: 60 });
		const m = await p.evaluate(async () => {
			for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
			await new Promise((r) => setTimeout(r, 1500));
			const imgs = [...document.images].filter((i) => i.getClientRects().length);
			const res = { overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth), notLoaded: imgs.filter((i) => !i.complete).length, broken: imgs.filter((i) => i.complete && !i.naturalWidth).length, h: document.documentElement.scrollHeight };
			scrollTo(0, 0); return res;
		});
		await p.waitForTimeout(400);
		// WebKit stops at 32 767 px: clip the full page there (rest is covered by the baselines / numbers)
		await p.screenshot({ path: `${out}/${name}-${dev}-ca-trang.jpg`, type: 'jpeg', quality: 45, fullPage: m.h * (opts.deviceScaleFactor || 1) < 32000, clip: m.h * (opts.deviceScaleFactor || 1) < 32000 ? undefined : { x: 0, y: 0, width: opts.viewport.width, height: Math.floor(32000 / (opts.deviceScaleFactor || 1)) } });
		rows.push(`| ${name} | ${dev} | ${m.overflow} | ${m.notLoaded} | ${m.broken} |`);
		console.log(name, dev, JSON.stringify(m));
	}
	await b.close();
}
writeFileSync(`${out}/ket-qua.md`, `# Thiết bị – 6 trang chuẩn (${new Date().toISOString().slice(0, 10)})\n\n| Trang | Thiết bị | Tràn ngang (px) | Ảnh chưa tải sau khi cuộn hết | Ảnh hỏng |\n|---|---|---|---|---|\n${rows.join('\n')}\n`);
