// Suite measurement (tools/check_ui.mjs --suite): every page × device pixel ratio × viewport, after a real scroll to the
// bottom with every picture settled. The page functions below are serialised with page.evaluate: self-contained.
import { gapRuns } from './ui_gaps.mjs';

// Runs in the page. Sharpness (round 8): the real width of the file on screen is read by loading currentSrc into a fresh
// Image (an <img>'s own naturalWidth is density-corrected under a w-descriptor srcset, so it always reads as "DPR ×").
// need = layout box width × DPR × zoom (the crop scale that hides the printed badge).
export async function mediaAudit(dpr) {
	const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden], dialog:not([open])') && !(el.closest('details:not([open])') && !el.closest('summary')); }; // inside a closed <details> nothing is drawn
	const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
	const out = { broken: [], wrong: [], lowres: [], blurryOld: [], mixed: [], noname: [], feats: [], photos: [], edge: [], postgrid: [], gridinfo: [], meta: [], empty: [], table: [], overflow: [], h1: 0, caps: [], boxes: {} };
	const imgs = [...document.querySelectorAll('img')].filter(shown);
	for (const i of imgs) if (i.complete && i.naturalWidth === 0) out.broken.push(i.currentSrc || i.src);
	for (const f of document.querySelectorAll('.is-broken')) if (shown(f)) out.broken.push('khung ảnh lỗi: ' + (f.textContent || '').trim());
	const fileSize = (src) => new Promise((ok) => { const x = new Image(); x.onload = () => ok([x.naturalWidth, x.naturalHeight]); x.onerror = () => ok([0, 0]); x.src = src; });
	const cache = {};
	for (const i of imgs) {
		const r = i.getBoundingClientRect();
		if (r.width <= 40 || !i.complete || !i.naturalWidth || !i.currentSrc || /^data:|\.svg(\?|$)/.test(i.currentSrc)) continue;
		const t = getComputedStyle(i).transform;
		const zoom = t && t !== 'none' ? Math.hypot(...t.match(/-?[\d.e]+/g).slice(0, 2).map(Number)) : 1;
		cache[i.currentSrc] ??= await fileSize(i.currentSrc);
		const [fw, fh] = cache[i.currentSrc];
		if (!fw) continue;
		// layout box (the transform scales the drawn box, not the frame); a cover crop of a wider photo needs the photo's
		// width at the frame's height
		const fit = getComputedStyle(i).objectFit;
		const frame = Math.max(r.width, fit === 'cover' && fh ? (r.height * fw) / fh : 0) / zoom;
		const file = i.currentSrc.split('/').pop();
		const need = frame * dpr * zoom;
		const cands = [...(i.getAttribute('srcset') || '').matchAll(/(\d+)w(?:\s*,|\s*$)/g)].map((m) => +m[1]);
		const max = cands.length ? Math.max(...cands) : fw;
		if (cands.length && (cands.some((c) => c >= need - 1) ? fw < need - 1 : fw < max)) out.wrong.push(`${file}: khung ${Math.round(frame)}px × ${dpr} × ${zoom.toFixed(2)} = ${Math.round(need)}px, đang dùng file ${fw}px (srcset tới ${max}px)`);
		if (max < need - 1) {
			const at = i.closest('.v-hero--full') ? 'hero' : i.closest('.v-feats') ? 'dải dự án nổi bật' : i.closest('.v-page__side, .v-article__side') ? 'cột phải' : i.closest('.v-gallery') ? 'thư viện' : i.closest('.v-map') ? 'bản đồ' : i.closest('.v-photos') ? 'ảnh tiến độ' : i.closest('.v-card') ? 'thẻ' : i.closest('.v-prose') ? 'ảnh nội dung' : i.closest('.v-postimg') ? 'ảnh đầu bài' : 'khác';
			out.lowres.push(`${file} [${at}]: cần ${Math.round(need)}px, lớn nhất ${max}px`);
		}
		if (r.width * dpr > fw * 1.15) out.blurryOld.push(`${file} khung ${Math.round(r.width)}px × ${dpr} > file ${fw}px × 1,15`);
	}
	for (const g of document.querySelectorAll('.v-grid')) {
		const cards = [...g.children].filter(shown);
		const withMedia = cards.filter((c) => c.querySelector('.v-card__media'));
		const framed = cards.filter((c) => !c.matches('.v-card--all')); // the "see all" card is a link tile, not a card without photo
		if (withMedia.length && withMedia.length < framed.length) out.mixed.push(label(g) + ': ' + (framed.length - withMedia.length) + ' thẻ không khung');
		// last-row gaps: post grids of ≥ 3 columns must be full (round 8, item 9); other grids are reported only
		const lefts = [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().left)))];
		const tops = [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top)))];
		if (tops.length < 2 && lefts.length === cards.length && g.scrollWidth > g.clientWidth + 2) continue; // one-row horizontal rail
		const cols = lefts.length;
		const gap = cols && cards.length % cols ? cols - (cards.length % cols) : 0;
		if (!gap) continue;
		const posts = cards.length && cards.every((c) => c.matches('.v-card--all') || (c.matches('article.v-card') && c.querySelector('a[href*="/blog/"]')));
		(posts && cols >= 3 ? out.postgrid : out.gridinfo).push(`${label(g)}: ${cards.length} thẻ, ${cols} cột, ${gap} ô trống`);
	}
	for (const f of document.querySelectorAll('.v-media--empty')) if (shown(f) && !(f.innerText || '').trim()) out.noname.push(label(f.closest('.v-card') || f));
	if (innerWidth >= 768) {
		const hs = [...document.querySelectorAll('.v-feats .v-feat')].map((li) => li.getBoundingClientRect().height).filter((h) => h > 0);
		if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 1) out.feats.push(`cao ${Math.round(Math.min(...hs))}–${Math.round(Math.max(...hs))}px`);
	}
	for (const g of document.querySelectorAll('.v-photos')) {
		if (!shown(g)) continue;
		const li = [...g.children].filter(shown);
		const rows = {}; li.forEach((x) => { const t = Math.round(x.getBoundingClientRect().top); rows[t] = (rows[t] || 0) + 1; });
		const last = rows[Math.max(...Object.keys(rows).map(Number))];
		if (li.length > 1 && last === 1) out.photos.push(`${li.length} ảnh, hàng cuối 1 ảnh`);
	}
	// map / construction grid edges = the text column (.v-prose) of the same section, ±1px (round 8, items 11–12)
	for (const el of document.querySelectorAll('main .v-map, main .v-photos')) {
		const col = [...(el.closest('section') || document).querySelectorAll('.v-prose')].find(shown);
		if (!shown(el) || !col) continue;
		const a = el.getBoundingClientRect(); const b = col.getBoundingClientRect();
		if (Math.abs(a.left - b.left) > 1 || Math.abs(a.right - b.right) > 1) out.edge.push(`${label(el)} ${Math.round(a.left)}–${Math.round(a.right)} ≠ cột chữ ${Math.round(b.left)}–${Math.round(b.right)}`);
	}
	// post card meta "Tác giả · ngày · 6 phút đọc": no line may start with "phút" (round 8, item 10)
	for (const m of document.querySelectorAll('.v-card .v-meta, .v-card__meta, .v-card small')) {
		if (!shown(m)) continue;
		const walk = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
		for (let n; (n = walk.nextNode());) {
			const at = n.textContent.indexOf('phút');
			if (at < 0) continue;
			const rg = document.createRange(); rg.setStart(m, 0); rg.setEnd(n, at); const before = [...rg.getClientRects()].filter((x) => x.width > 0).pop();
			rg.setStart(n, at); rg.setEnd(n, at + 4); const word = rg.getBoundingClientRect();
			if (before && word.top > before.top + 2) out.meta.push(label(m) + ': "' + m.innerText.trim().slice(0, 50) + '"');
		}
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
	// boxes of every picture and block, page coordinates at scroll 0 – compared across DPRs by runSuite (item 1)
	const sel = 'img, main section, .v-hero--full, .v-card, .v-feat, .v-map, .v-photos, .v-gallery, .v-page__side, .v-article__side, main figure, main table';
	[...document.querySelectorAll(sel)].filter(shown).forEach((el, k) => {
		const r = el.getBoundingClientRect();
		out.boxes[k + ' ' + label(el)] = [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10);
	});
	return out;
}

// Runs in the page. Post side column (round 8, item 15) at one scroll position: [problems].
export function stickyAudit() {
	const side = document.querySelector('.v-article__side');
	if (!side || getComputedStyle(side).display === 'none') return null;
	const head = document.querySelector('.v-header');
	const hb = head ? head.getBoundingClientRect().bottom : 0;
	const r = side.getBoundingClientRect();
	const top = parseFloat(getComputedStyle(side).top) || 0;
	const out = [];
	const stuckOrBefore = r.top >= top - 1; // after the article ends the column scrolls away with it – no longer "dính"
	if (r.bottom > 0 && r.top < innerHeight && stuckOrBefore) {
		if (r.top < hb + 16 - 0.5) out.push(`đỉnh ${Math.round(r.top)} < đáy header ${Math.round(hb)} + 16`);
		if (r.bottom > innerHeight - 16 + 0.5) out.push(`đáy ${Math.round(r.bottom)} > ${innerHeight} − 16`);
		const cta = side.querySelector('.v-btn');
		if (cta) { const c = cta.getBoundingClientRect(); if (c.top < hb || c.bottom > innerHeight) out.push(`nút tư vấn ngoài màn hình (${Math.round(c.top)}–${Math.round(c.bottom)})`); }
		for (const s of side.querySelectorAll('*')) { // inner scrollbars may only sit on the TOC list
			const cs = getComputedStyle(s);
			if (s === side || s.closest('.v-toc')) continue;
			if (/(auto|scroll)/.test(cs.overflowY) && s.scrollHeight > s.clientHeight + 1) { out.push('thanh cuộn bên trong: ' + s.className); break; }
		}
		if (/(auto|scroll)/.test(getComputedStyle(side).overflowY) && side.scrollHeight > side.clientHeight + 1) out.push('cả cột cuộn bên trong');
	}
	const foot = document.querySelector('footer, .v-footer');
	if (foot) { const f = foot.getBoundingClientRect(); if (r.bottom > f.top + 0.5 && r.top < f.bottom) out.push('đè footer'); }
	return out;
}

const CRIT = [['broken', 'Ảnh hỏng'], ['wrong', 'Chọn sai file'], ['dpr', 'Lệch theo DPR > 1px'], ['mixed', 'Nhóm thẻ trộn thiếu khung'], ['noname', 'Khung dự phòng không tên'],
	['feats', 'Dải nổi bật lệch cao'], ['photos', 'Ảnh lẻ lưới tiến độ'], ['edge', 'Bản đồ/lưới lệch cột chữ'], ['postgrid', 'Ô trống lưới bài'], ['meta', 'Meta ngắt "phút"'],
	['empty', 'Khối trống'], ['table', 'Bảng < 2 hàng'], ['overflow', 'Tràn ngang'], ['h1', 'H1 ≠ 1'], ['caps', 'Heading HOA'], ['gaps', 'Khoảng trống > 30%']];
const INFO = [['lowres', 'Ảnh nguồn thiếu độ phân giải'], ['blurryOld', 'Ảnh mờ (cách đo cũ)'], ['gridinfo', 'Ô trống lưới khác']];

const settle = async (p) => {
	await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
	await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
	await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900); // header back to full size (transitions 0.2–0.4 s)
};

async function loginState(b, base, password) {
	const login = await b.newContext();
	const lp = await login.newPage();
	await lp.goto(base + '/', { waitUntil: 'domcontentloaded' });
	if (await lp.locator('input[type=password]').count()) {
		await lp.fill('input[type=password]', password);
		await Promise.all([lp.waitForNavigation({ waitUntil: 'domcontentloaded' }), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const state = await login.storageState();
	await login.close();
	return state;
}

// pages: [[name, path]]; returns { table, details, total, result } and writes nothing (the caller does)
export async function runSuite({ chromium, base, password, pages, dprs = [1, 1.25, 2], widths = [390, 1066, 1366, 1536, 1920], contentBands, log = console.log }) {
	const b = await chromium.launch();
	const state = await loginState(b, base, password);
	const result = {};
	for (const [name, path] of pages) {
		result[name] = {};
		const boxes = {}; // width → dpr → boxes
		for (const dpr of dprs) {
			const ctx = await b.newContext({ storageState: state, deviceScaleFactor: dpr });
			const cell = Object.fromEntries([...CRIT, ...INFO].map(([k]) => [k, []]));
			for (const w of widths) {
				const p = await ctx.newPage();
				await p.setViewportSize({ width: w, height: w < 768 ? 844 : 900 });
				await p.goto(base + path, { waitUntil: 'load', timeout: 120000 });
				await settle(p);
				const m = await p.evaluate(mediaAudit, dpr);
				(boxes[w] ??= {})[dpr] = m.boxes;
				for (const [k] of [...CRIT, ...INFO]) {
					if (k === 'h1') { if (m.h1 !== 1) cell.h1.push(`${w}px: ${m.h1} H1`); continue; }
					if (k === 'gaps' || k === 'dpr') continue;
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
		}
		// layout must not depend on the screen's pixel density: every box at DPR ≠ 1 within 1px of DPR 1 (item 1)
		for (const w of widths) {
			const ref = boxes[w][dprs[0]];
			for (const dpr of dprs.slice(1)) {
				const cur = boxes[w][dpr];
				const keys = new Set([...Object.keys(ref), ...Object.keys(cur)]);
				const bad = [...keys].filter((k) => !ref[k] || !cur[k] || ref[k].some((v, i) => Math.abs(v - cur[k][i]) > 1));
				result[name][dpr].dpr.push(...bad.slice(0, 5).map((k) => `${w}px: ${k} ${JSON.stringify(ref[k] || null)} → ${JSON.stringify(cur[k] || null)}`), ...(bad.length > 5 ? [`${w}px: … và ${bad.length - 5} hộp khác`] : []));
			}
		}
		for (const dpr of dprs) log(`${name} DPR ${dpr}: ` + [...CRIT, ...INFO].map(([k]) => `${k}:${result[name][dpr][k].length}`).join(' '));
	}
	await b.close();
	return report(result, dprs);
}

// Post side column at fixed screens, scrolled from top to bottom in 40% steps (item 15).
export async function runSticky({ chromium, base, password, pages, screens = [[1366, 768, 1], [1536, 864, 1.25]] }) {
	const b = await chromium.launch();
	const state = await loginState(b, base, password);
	const rows = [];
	for (const [name, path] of pages) {
		for (const [w, h, dpr] of screens) {
			const ctx = await b.newContext({ storageState: state, deviceScaleFactor: dpr, viewport: { width: w, height: h } });
			const p = await ctx.newPage();
			await p.goto(base + path, { waitUntil: 'load', timeout: 120000 });
			await settle(p);
			const bad = [];
			let steps = 0;
			for (let y = 0; ; y += Math.round(h * 0.4)) {
				const max = await p.evaluate((y) => { scrollTo(0, y); return document.documentElement.scrollHeight - innerHeight; }, y);
				await p.waitForTimeout(350); // header slide (0.2 s) settled
				const r = await p.evaluate(stickyAudit);
				if (r === null) { bad.push('không có cột phải'); break; }
				steps++;
				bad.push(...r.map((x) => `y=${y}: ${x}`));
				if (y >= max) break;
			}
			rows.push({ name, screen: `${w}×${h} DPR ${dpr}`, steps, bad });
			await ctx.close();
		}
	}
	await b.close();
	return rows;
}

export function report(result, dprs) {
	const all = [...CRIT, ...INFO];
	const head = ['| Trang | DPR | ' + all.map(([, t]) => t).join(' | ') + ' |', '|---|---|' + all.map(() => '---|').join('')];
	const rows = Object.entries(result).flatMap(([name, byDpr]) => dprs.filter((d) => byDpr[d]).map((dpr) => `| ${name} | ${dpr} | ` + all.map(([k]) => byDpr[dpr][k].length).join(' | ') + ' |'));
	const total = all.map(([k]) => Object.values(result).reduce((s, d) => s + Object.values(d).reduce((t, c) => t + c[k].length, 0), 0));
	const details = Object.entries(result).flatMap(([name, byDpr]) => Object.entries(byDpr).flatMap(([dpr, c]) => all.flatMap(([k, t]) => c[k].map((x) => `- ${name} · DPR ${dpr} · ${t}: ${x}`))));
	return { table: [...head, ...rows, `| **Tổng** | | ` + total.map((n, i) => (i < CRIT.length ? `**${n}**` : n)).join(' | ') + ' |'].join('\n'), details, total: total.slice(0, CRIT.length), info: total.slice(CRIT.length), result };
}
export { CRIT, INFO };
