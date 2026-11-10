#!/usr/bin/env node
// Vòng sửa trang chủ (2026-11-11), mục 3: khối đối tác (ô đầu / ô cuối trùng mép khung ±1 px, diện tích logo lệch ≤ 15 %,
// cao hiển thị ~56 px) và khối "Công ty TNHH Velis Realty" (2 cột cao lệch ≤ 15 %) ở 1366 / 1536 / 1920 / 2560 + iPhone 14.
// Staging chỉ đọc (cookie mật khẩu xem). Usage: VIEW_PASSWORD_FILE=… node tools/check_trang_chu.mjs [out.json]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { login } from './shots_on_dinh.mjs';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const SCREENS = { M1: { viewport: { width: 1366, height: 768 } }, M2: { viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25 }, M3: { viewport: { width: 1920, height: 1080 } }, X: { viewport: { width: 2560, height: 1440 } }, I14: devices['iPhone 14'] };

// Runs in the page.
export function probe() {
	const R = (e) => e.getBoundingClientRect();
	const frame = R(document.querySelector('#tu-van .wrap, main .wrap, .wrap'));
	const cells = [...document.querySelectorAll('.partners > li')], imgs = cells.map((c) => c.querySelector('img')).filter(Boolean);
	const areas = imgs.map((i) => R(i).width * R(i).height), mean = areas.reduce((a, b) => a + b, 0) / (areas.length || 1);
	const velis = document.querySelector('#ve-velis'), cols = velis ? [...velis.querySelectorAll(':scope .wrap > *')].filter((e) => R(e).width > 100) : [];
	const hs = cols.map((c) => R(c).height), oneRow = cols.length === 2 && Math.abs(R(cols[0]).top - R(cols[1]).top) < 2;
	return {
		cells: cells.length, firstLeft: cells[0] ? +(R(cells[0]).left - frame.left).toFixed(1) : null, lastRight: cells.length ? +(R(cells.at(-1)).right - frame.right).toFixed(1) : null,
		logoH: imgs.map((i) => Math.round(R(i).height)), areaSpread: areas.length ? +(100 * (Math.max(...areas) - Math.min(...areas)) / mean).toFixed(1) : null,
		velisCols: hs.map(Math.round), velisSpread: oneRow ? +(100 * Math.abs(hs[0] - hs[1]) / Math.max(...hs)).toFixed(1) : 'một cột',
	};
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const b = await chromium.launch(), state = await login(b), out = {};
	for (const [k, s] of Object.entries(SCREENS)) {
		const c = await b.newContext({ storageState: state, ...s }); const p = await c.newPage();
		await p.goto('https://staging.velisrealty.vn/', { waitUntil: 'load' });
		await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
		await p.waitForFunction(() => [...document.querySelectorAll('.partners img')].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
		out[k] = await p.evaluate(probe); await c.close();
		console.log(k, JSON.stringify(out[k]));
	}
	await b.close();
	if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
}
