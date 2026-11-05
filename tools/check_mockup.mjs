#!/usr/bin/env node
// Step-2 mockup check: 3 pages × hero A/B × screens (M1–M5 + the 7-frame set) → NT × page × hero × screen error counts.
// Rules: tools/ui_media.mjs (mediaAudit, heroAudit NT-47/48, factsAudit NT-66/67), tools/ui_layout.mjs, DPR invariance (NT-01).
// Read-only, local server only. Usage: node tools/check_mockup.mjs http://127.0.0.1:8765 out-dir
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { mediaAudit, heroAudit, factsAudit, CRIT } from './ui_media.mjs';
import { layoutAudit } from './ui_layout.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://127.0.0.1:8765', dir = 'screenshots/mockup-b2/kiem-tra'] = process.argv.slice(2);
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
// M1–M5 (docs/NGHIEM-THU.md, X-08) + the 7 automated frames 360/390/430/768/1024/1366/1920; D* = same width, other DPR (NT-01)
const SCREENS = [['M1', 1366, 768, 1], ['M2', 1536, 864, 1.25], ['M3', 1920, 1080, 1], ['M4', 960, 540, 2], ['M5', 390, 844, 2],
	['360', 360, 780, 2], ['430', 430, 932, 3], ['768', 768, 1024, 2], ['1024', 1024, 768, 1], ['D1', 1366, 768, 2], ['D5', 390, 844, 1]];
const PAIRS = [['M1', 'D1'], ['M5', 'D5']];
const NT = [...CRIT.filter(([k]) => k !== 'gaps').map(([k, t]) => [k, t]), ['heroOverlay', 'NT-47 Lớp phủ hero A'], ['heroBox', 'NT-48 Hộp nền chữ hero'],
	['factsCut', 'NT-66 Thanh thông tin cắt chữ'], ['factsRows', 'NT-67 Thanh thông tin chia hàng'], ['layout', 'NT-06/04/25/24 Bố cục']];

const b = await chromium.launch();
const res = {}; const boxes = {}; const details = [];
for (const page of PAGES) for (const hero of ['a', 'b']) for (const [s, w, h, dpr] of SCREENS) {
	const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' }); // no smooth scroll while measuring
	const p = await ctx.newPage();
	await p.goto(`${base}/${page}.html#hero-${hero}`, { waitUntil: 'load' });
	await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
	await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
	await p.waitForTimeout(300);
	const m = await p.evaluate(mediaAudit, dpr);
	const he = await p.evaluate(heroAudit);
	const fa = await p.evaluate(factsAudit);
	const la = await p.evaluate(layoutAudit);
	const cell = Object.fromEntries(NT.map(([k]) => [k, []]));
	for (const [k] of CRIT) if (cell[k]) cell[k] = k === 'h1' ? (m.h1 === 1 ? [] : [`${m.h1} H1`]) : (m[k] || []);
	cell.heroOverlay = he.overlay; cell.heroBox = he.box; cell.factsCut = fa.cut; cell.factsRows = fa.rows;
	cell.layout = [...la.images, ...la.grid, ...la.empty, ...la.media, ...la.fallback, ...la.contact];
	(res[page] ??= {})[hero] ??= {};
	res[page][hero][s] = cell;
	((boxes[page] ??= {})[hero] ??= {})[s] = m.boxes;
	for (const [k, t] of NT) for (const x of cell[k]) details.push(`- ${page} · hero ${hero.toUpperCase()} · ${s} · ${t}: ${x}`);
	await ctx.close();
}
await b.close();
// NT-01: same width, other DPR → every box within 1 px
for (const page of PAGES) for (const hero of ['a', 'b']) for (const [a, d] of PAIRS) {
	const ref = boxes[page][hero][a], cur = boxes[page][hero][d];
	const bad = [...new Set([...Object.keys(ref), ...Object.keys(cur)])].filter((k) => !ref[k] || !cur[k] || ref[k].some((v, i) => Math.abs(v - cur[k][i]) > 1));
	res[page][hero][d].dpr = bad.slice(0, 5);
	for (const k of bad.slice(0, 5)) details.push(`- ${page} · hero ${hero.toUpperCase()} · ${a}↔${d} · NT-01: ${k} ${JSON.stringify(ref[k] || null)} → ${JSON.stringify(cur[k] || null)}`);
}
const S = SCREENS.map(([s]) => s);
const head = `| NT | Trang | Hero | ${S.join(' | ')} | Tổng |\n|---|---|---|${S.map(() => '---|').join('')}---|`;
const rows = NT.flatMap(([k, t]) => PAGES.flatMap((pg) => ['a', 'b'].map((h) => { const n = S.map((s) => res[pg][h][s][k].length); return `| ${t} | ${pg} | ${h.toUpperCase()} | ${n.join(' | ')} | ${n.reduce((x, y) => x + y, 0)} |`; })));
const total = details.length;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/bang-nt.md`, `# Bộ đo mockup bước 2 – ${new Date().toISOString().slice(0, 10)}\n\nMỗi ô = số lỗi. Màn: M1–M5 + khung 360/430/768/1024; D1/D5 = cùng bề rộng M1/M5 ở DPR khác (NT-01).\n\n${head}\n${rows.join('\n')}\n\n**Tổng lỗi: ${total}**\n\n## Chi tiết\n\n${details.join('\n') || 'Không có lỗi.'}\n`);
writeFileSync(`${dir}/ket-qua.json`, JSON.stringify(res, null, 1));
console.log(details.slice(0, 60).join('\n'));
console.log(`tổng lỗi: ${total}`);
process.exit(total ? 1 : 0);
