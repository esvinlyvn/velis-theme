#!/usr/bin/env node
// DESIGN.md "Quy tắc bố cục" 1.2 / 1.3: every rendered font size and every margin / padding / gap of the 3 mockup pages
// must come from the scales. Lists the exceptions (must be 0). Mockup-only parts (switches, "ảnh tạm" tag) are skipped,
// and so is the home hero: it is the staging 0.9.8 hero kept with its own sizes (duyệt 2026-11-06, DESIGN.md "Hero").
// Usage: node tools/mockup_scale.mjs http://127.0.0.1:8765 [out.md]                     (the 3 mockup pages)
//        VIEW_PASSWORD_FILE=… node tools/mockup_scale.mjs --staging <paths.txt | /a/,/b/> [out.md]   (staging pages, guest view)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const STAGING = process.argv[2] === '--staging';
const [base = 'http://127.0.0.1:8765', out] = STAGING ? ['https://staging.velisrealty.vn', process.argv[4]] : process.argv.slice(2);
// staging: paths from a file (one per line, # comments) or a comma list; mockup: the 3 built pages
const list = STAGING ? (existsSync(process.argv[3]) ? readFileSync(process.argv[3], 'utf8').split('\n') : process.argv[3].split(',')).map((x) => x.trim()).filter((x) => x && !x.startsWith('#')) : null;
export const FONT = [56, 48, 40, 36, 28, 22, 19, 17, 16, 14, 13]; // H1 56/36 · số liệu 48 · H2 40/28 · H3 22 · dẫn 19 · thân 17 · thẻ 16 · phụ 14 · nhãn 13
export const SPACE = [0, 8, 16, 24, 32, 40, 48, 64, 96]; // 40 = tiêu đề khối → nội dung (desktop)
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
const SCREENS = [['M1', 1366, 768], ['M5', 390, 844], ['768', 768, 1024], ['1024', 1024, 768], ['M3', 1920, 1080]];

// Runs in the page.
export function scaleAudit({ FONT, SPACE }) {
	const skip = '.mk, .mk-float, .tmp, .draft, .sr-only, .screen-reader-text, #wpadminbar, #wpadminbar *, script, style, svg, img, iframe, br, option, dialog:not([open]), dialog:not([open]) *';
	const near = (v, set) => set.some((x) => Math.abs(v - x) < 0.5);
	const name = (e) => e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : '');
	const font = new Map(), space = new Map();
	for (const e of document.querySelectorAll('body *')) {
		if (e.matches(skip) || e.closest('.mk, .mk-float, [hidden], .hero--home')) continue;
		const r = e.getBoundingClientRect(), s = getComputedStyle(e);
		if (s.display === 'none' || s.visibility === 'hidden') continue;
		if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && r.width) {
			const f = parseFloat(s.fontSize);
			if (!near(f, FONT)) font.set(`${name(e)} ${f}px`, (font.get(`${name(e)} ${f}px`) || 0) + 1);
		}
		const ml = parseFloat(s.marginLeft), mr = parseFloat(s.marginRight);
		const props = [['margin-top', s.marginTop], ['margin-bottom', s.marginBottom], ['padding-top', s.paddingTop], ['padding-bottom', s.paddingBottom], ['padding-left', s.paddingLeft], ['padding-right', s.paddingRight], ['row-gap', s.rowGap], ['column-gap', s.columnGap]];
		const auto = (k) => e.computedStyleMap?.().get(k)?.toString() === 'auto'; // auto margins centre or push, they are not spacing
		if (Math.abs(ml - mr) > 0.5) props.push(...[['margin-left', s.marginLeft], ['margin-right', s.marginRight]].filter(([k]) => !auto(k)));
		for (const k of ['margin-top', 'margin-bottom']) if (auto(k)) props.splice(props.findIndex(([x]) => x === k), 1);
		for (const [k, v] of props) {
			const n = parseFloat(v);
			if (Number.isNaN(n) || v === 'normal') continue;
			if (!near(Math.abs(n), SPACE)) space.set(`${name(e)} ${k} ${n}px`, (space.get(`${name(e)} ${k} ${n}px`) || 0) + 1);
		}
	}
	// 1.6: characters per rendered line of running text (p, li, dd), counted glyph by glyph; > 68 is an exception
	const chars = new Map();
	for (const e of document.querySelectorAll('main p, main li, main dd, footer p')) {
		if (e.matches(skip) || e.closest('.mk, .mk-float, [hidden], .hero--home') || !e.getClientRects().length) continue;
		const lines = new Map(), w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), rg = document.createRange();
		for (let t; (t = w.nextNode());) for (let i = 0; i < t.length; i++) {
			rg.setStart(t, i); rg.setEnd(t, i + 1);
			const b = rg.getClientRects()[0]; if (!b) continue;
			const k = Math.round(b.bottom); lines.set(k, (lines.get(k) || '') + t.data[i]);
		}
		const max = Math.max(0, ...[...lines.values()].map((l) => l.replace(/\s+/g, ' ').trim().length)); // a space at the wrap is not on the line
		if (max > 68) chars.set(`${name(e)} ${max} ký tự`, (chars.get(`${name(e)} ${max} ký tự`) || 0) + 1);
	}
	return { font: [...font], space: [...space], chars: [...chars] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const b = await chromium.launch();
	let storageState;
	if (STAGING) { // guest view behind the staging password (same login as check_ui.mjs)
		const c = await b.newContext(); const lp = await c.newPage();
		await lp.goto(base + '/'); await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
		storageState = await c.storageState(); await c.close();
	}
	const lines = []; let total = 0;
	for (const page of list || PAGES) for (const [s, w, h] of SCREENS) {
		const p = await (await b.newContext({ viewport: { width: w, height: h }, storageState })).newPage();
		await p.goto(STAGING ? base + page : `${base}/${page}.html`, { waitUntil: 'load', timeout: 120000 });
		const r = await p.evaluate(scaleAudit, { FONT, SPACE });
		const n = r.font.length + r.space.length + r.chars.length; total += n;
		lines.push(`- ${page} ${s}: ${n} ngoại lệ${n ? ' – ' + [...r.font.map(([k, c]) => `chữ ${k} ×${c}`), ...r.space.map(([k, c]) => `${k} ×${c}`), ...r.chars.map(([k, c]) => `dòng ${k} ×${c}`)].join('; ') : ''}`);
		await p.context().close();
	}
	await b.close();
	const md = `# Đo thang chữ (1.3) và thang khoảng cách (1.2) – ${new Date().toISOString().slice(0, 10)}\n\nCỡ chữ cho phép: ${FONT.join(' · ')} px. Khoảng cách (margin, padding, gap): ${SPACE.join(' · ')} px. Dòng chữ (p, li, dd) ≤ 68 ký tự (1.6), đếm từng ký tự trên dòng hiển thị. Bỏ qua hero trang chủ (giữ nguyên hero 0.9.8, duyệt 2026-11-06) và phần chỉ có ở mockup (công tắc, nhãn ảnh tạm, nhãn câu chờ duyệt).\n\n${lines.join('\n')}\n\n**Tổng ngoại lệ: ${total}**\n`;
	if (out) writeFileSync(out, md);
	console.log(lines.join('\n').slice(0, 6000)); console.log('tổng ngoại lệ:', total);
	process.exit(total ? 1 : 0);
}
