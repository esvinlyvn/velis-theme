// Round 7 measurement (tools/check_ui.mjs --suite): every page × device pixel ratio × viewport, after a real scroll to the
// bottom with every picture settled. The page functions below are serialised with page.evaluate: self-contained.
import { gapRuns } from './ui_gaps.mjs';

// A picture is sharp when the file has enough pixels for its box: box width × DPR ≤ file width × 1.15 (the real file width
// of the chosen srcset candidate, read from a fresh Image – an <img>'s naturalWidth is density-corrected under srcset).
export async function mediaAudit(dpr) {
	const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden], dialog:not([open])') && !(el.closest('details:not([open])') && !el.closest('summary')); }; // inside a closed <details> nothing is drawn
	const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
	const out = { broken: [], blurry: [], mixed: [], empty: [], table: [], overflow: [], h1: 0, caps: [] };
	const imgs = [...document.querySelectorAll('img')].filter(shown);
	for (const i of imgs) if (i.complete && i.naturalWidth === 0) out.broken.push(i.currentSrc || i.src);
	for (const f of document.querySelectorAll('.is-broken')) if (shown(f)) out.broken.push('khung ảnh lỗi: ' + (f.textContent || '').trim());
	const fileWidth = (src) => new Promise((ok) => { const x = new Image(); x.onload = () => ok(x.naturalWidth); x.onerror = () => ok(0); x.src = src; });
	const cache = {};
	for (const i of imgs) {
		const w = i.getBoundingClientRect().width;
		if (w <= 40 || !i.complete || !i.naturalWidth || !i.currentSrc || i.currentSrc.startsWith('data:')) continue;
		cache[i.currentSrc] ??= await fileWidth(i.currentSrc);
		const fw = cache[i.currentSrc];
		if (fw && w * dpr > fw * 1.15) out.blurry.push(`${i.currentSrc.split('/').pop()} khung ${Math.round(w)}px × ${dpr} > file ${fw}px × 1,15`);
	}
	// a group of cards where some have a picture: every card without one must show the named fallback frame
	for (const g of document.querySelectorAll('.v-grid')) {
		const cards = [...g.children].filter(shown);
		const withMedia = cards.filter((c) => c.querySelector('.v-card__media'));
		if (withMedia.length && withMedia.length < cards.length) out.mixed.push(label(g) + ': ' + (cards.length - withMedia.length) + ' thẻ không khung');
	}
	const media = 'img, svg, iframe, video, canvas, input, select, textarea, button, picture';
	const flagged = [];
	for (const el of document.querySelectorAll('main div, main section, main aside, main figure, main li, main article, main p')) {
		if (!shown(el) || flagged.some((f) => f.contains(el))) continue;
		const r = el.getBoundingClientRect();
		if (r.height <= 40 || r.width <= 200 || (el.innerText || '').trim() || el.querySelector(media) || el.matches(media)) continue;
		if (getComputedStyle(el).backgroundImage !== 'none') continue; // a picture drawn as background is content
		flagged.push(el);
		out.empty.push(label(el) + ` ${Math.round(r.width)}×${Math.round(r.height)}`);
	}
	for (const t of document.querySelectorAll('table')) {
		if (!shown(t)) continue;
		const rows = [...t.querySelectorAll('tr')].filter((tr) => !tr.closest('thead') && tr.querySelector('td'));
		if (rows.length < 2) out.table.push(label(t) + ': ' + rows.length + ' hàng');
	}
	if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) out.overflow.push(`${document.documentElement.scrollWidth} > ${document.documentElement.clientWidth}`);
	out.h1 = [...document.querySelectorAll('h1')].filter(shown).length;
	for (const h of document.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
		const t = (h.innerText || '').trim();
		const letters = [...t].filter((c) => c.toLowerCase() !== c.toUpperCase());
		if (shown(h) && letters.length >= 6 && letters.filter((c) => c === c.toUpperCase()).length / letters.length >= 0.85) out.caps.push(t.slice(0, 60));
	}
	return out;
}

const CRIT = [['broken', 'Ảnh hỏng'], ['blurry', 'Ảnh mờ'], ['mixed', 'Nhóm thẻ trộn thiếu khung'], ['empty', 'Khối trống'], ['table', 'Bảng < 2 hàng'], ['overflow', 'Tràn ngang'], ['h1', 'H1 ≠ 1'], ['caps', 'Heading HOA'], ['gaps', 'Khoảng trống > 30%']];

// pages: [[name, path]]; returns { rows, details } and writes nothing (the caller does)
export async function runSuite({ chromium, base, password, pages, dprs = [1, 1.25, 2], widths = [390, 1066, 1366, 1920], contentBands, log = console.log }) {
	const b = await chromium.launch();
	const login = await b.newContext();
	const lp = await login.newPage();
	await lp.goto(base + '/', { waitUntil: 'domcontentloaded' });
	if (await lp.locator('input[type=password]').count()) {
		await lp.fill('input[type=password]', password);
		await Promise.all([lp.waitForNavigation({ waitUntil: 'domcontentloaded' }), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const state = await login.storageState();
	await login.close();
	const result = {};
	for (const [name, path] of pages) {
		result[name] = {};
		for (const dpr of dprs) {
			const ctx = await b.newContext({ storageState: state, deviceScaleFactor: dpr });
			const cell = Object.fromEntries(CRIT.map(([k]) => [k, []]));
			for (const w of widths) {
				const p = await ctx.newPage();
				await p.setViewportSize({ width: w, height: w < 768 ? 844 : 900 });
				await p.goto(base + path, { waitUntil: 'load', timeout: 120000 });
				await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
				await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
				await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
				const m = await p.evaluate(mediaAudit, dpr);
				for (const [k] of CRIT) {
					if (k === 'h1') { if (m.h1 !== 1) cell.h1.push(`${w}px: ${m.h1} H1`); continue; }
					if (k === 'gaps') continue;
					cell[k].push(...m[k].map((x) => `${w}px: ${x}`));
				}
				if (w >= 1024) {
					const g = await p.evaluate(contentBands);
					for (const run of gapRuns(g.bands, g.left, g.right, g.step, 900)) cell.gaps.push(`${w}px: ${run.pct}% y=${run.from}–${run.to}`);
				}
				await p.close();
			}
			await ctx.close();
			result[name][dpr] = cell;
			log(`${name} DPR ${dpr}: ` + CRIT.map(([k]) => `${k}:${cell[k].length}`).join(' '));
		}
	}
	await b.close();
	const head = ['| Trang | DPR | ' + CRIT.map(([, t]) => t).join(' | ') + ' |', '|---|---|' + CRIT.map(() => '---|').join('')];
	const rows = Object.entries(result).flatMap(([name, byDpr]) => Object.entries(byDpr).map(([dpr, c]) => `| ${name} | ${dpr} | ` + CRIT.map(([k]) => c[k].length).join(' | ') + ' |'));
	const total = CRIT.map(([k]) => Object.values(result).reduce((s, d) => s + Object.values(d).reduce((t, c) => t + c[k].length, 0), 0));
	const details = Object.entries(result).flatMap(([name, byDpr]) => Object.entries(byDpr).flatMap(([dpr, c]) => CRIT.flatMap(([k, t]) => c[k].map((x) => `- ${name} · DPR ${dpr} · ${t}: ${x}`))));
	return { table: [...head, ...rows, `| **Tổng** | | ` + total.join(' | ') + ' |'].join('\n'), details, total, result };
}
