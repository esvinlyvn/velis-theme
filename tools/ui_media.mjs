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
		if (r.width <= 40 || !i.complete || !i.naturalWidth || !i.currentSrc || /^data:image\/svg|\.svg(\?|$)/.test(i.currentSrc)) continue;
		const t = getComputedStyle(i).transform;
		const zoom = t && t !== 'none' ? Math.hypot(...t.match(/-?[\d.e]+/g).slice(0, 2).map(Number)) : 1;
		cache[i.currentSrc] ??= await fileSize(i.currentSrc);
		const [fw, fh] = cache[i.currentSrc];
		if (!fw) continue;
		// layout box (the transform scales the drawn box, not the frame); a cover crop of a wider photo needs the photo's
		// width at the frame's height
		const fit = getComputedStyle(i).objectFit;
		const frame = Math.max(r.width, fit === 'cover' && fh ? (r.height * fw) / fh : 0) / zoom;
		const file = i.dataset.file || i.currentSrc.split('/').pop(); // data-file: mockup photos inlined as data URIs
		const need = frame * dpr * zoom;
		const cands = [...(i.getAttribute('srcset') || '').matchAll(/(\d+)w(?:\s*,|\s*$)/g)].map((m) => +m[1]);
		const max = cands.length ? Math.max(...cands) : fw;
		// X-01 = d: the LCP photo (fetchpriority=high) needs a file ≥ frame × DPR; any other photo needs the file Chromium
		// picks for the true need (next candidate up, or the one below when the need is under their geometric mean)
		const up = cands.filter((c) => c >= need - 1).sort((a, b) => a - b)[0], down = cands.filter((c) => c < need - 1).sort((a, b) => b - a)[0];
		const lcp = i.getAttribute('fetchpriority') === 'high';
		const want = !cands.length ? 0 : up === undefined ? max : lcp || down === undefined ? up : need <= Math.sqrt(up * down) ? down : up;
		if (cands.length && fw < want - 1) out.wrong.push(`${file}: khung ${Math.round(frame)}px × ${dpr} × ${zoom.toFixed(2)} = ${Math.round(need)}px, đang dùng file ${fw}px (srcset tới ${max}px)`);
		if (max < need - 1) {
			const at = i.closest('.v-hero--full, .hero') ? 'hero' : i.closest('.v-feats, .rail, .feats') ? 'dải dự án nổi bật' : i.closest('.v-page__side, .v-article__side, .page__side, .within') ? 'cột phải' : i.closest('.v-gallery, .gallery') ? 'thư viện' : i.closest('.v-map, .map') ? 'bản đồ' : i.closest('.v-photos') ? 'ảnh tiến độ' : i.closest('.v-card, .card') ? 'thẻ' : i.closest('.v-prose, .prose') ? 'ảnh nội dung' : i.closest('.v-postimg') ? 'ảnh đầu bài' : 'khác';
			out.lowres.push(`${file} [${at}]: cần ${Math.round(need)}px, lớn nhất ${max}px`);
		}
		if (r.width * dpr > fw * 1.15) out.blurryOld.push(`${file} khung ${Math.round(r.width)}px × ${dpr} > file ${fw}px × 1,15`);
	}
	for (const g of document.querySelectorAll('.v-grid, .grid')) {
		const cards = [...g.children].filter(shown);
		const withMedia = cards.filter((c) => c.querySelector('.v-card__media, .card__media'));
		const framed = cards.filter((c) => !c.matches('.v-card--all, .card--all')); // the "see all" card is a link tile, not a card without photo
		if (withMedia.length && withMedia.length < framed.length) out.mixed.push(label(g) + ': ' + (framed.length - withMedia.length) + ' thẻ không khung');
		// last-row gaps: post grids of ≥ 3 columns must be full (round 8, item 9); other grids are reported only
		const lefts = [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().left)))];
		const tops = [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top)))];
		if (tops.length < 2 && lefts.length === cards.length && g.scrollWidth > g.clientWidth + 2) continue; // one-row horizontal rail
		// columns = most cards on one row (a centred short last row adds extra x positions, so distinct lefts over-count)
		const byRow = {}; cards.forEach((c) => { const t = Math.round(c.getBoundingClientRect().top); (byRow[t] ||= []).push(c.getBoundingClientRect()); });
		const rowsArr = Object.keys(byRow).sort((x, y) => x - y).map((k) => byRow[k]);
		const cols = tops.length > 1 ? Math.max(...rowsArr.map((r) => r.length)) : lefts.length;
		const last = rowsArr[rowsArr.length - 1], gr = g.getBoundingClientRect();
		const centred = rowsArr.length > 1 && last.length < cols && Math.abs((Math.min(...last.map((r) => r.left)) + Math.max(...last.map((r) => r.right))) / 2 - (gr.left + gr.width / 2)) <= 2; // rule 2.1 / 5.2 (duyệt 2026-11-10): short last row keeps card width, centred
		// cells actually used: a card spanning 2 columns (grid-column: span 2 – first card of 5 / 7 / 11) fills 2 (step 3)
		const cells = cards.reduce((n, c) => n + (+((getComputedStyle(c).gridColumnStart + ' ' + getComputedStyle(c).gridColumnEnd).match(/span (\d+)/) || [])[1] || 1), 0);
		const gap = cols && cells % cols ? cols - (cells % cols) : 0;
		if (!gap) continue;
		const posts = cards.length && cards.every((c) => c.matches('.v-card--all, .card--all, .card--post') || (c.matches('article.v-card') && c.querySelector('a[href*="/blog/"]')));
		(posts && cols >= 3 && !centred ? out.postgrid : out.gridinfo).push(`${label(g)}: ${cards.length} thẻ, ${cols} cột, ${gap} ô trống`);
	}
	for (const f of document.querySelectorAll('.v-media--empty, .card__media--empty')) if (shown(f) && !(f.innerText || '').trim()) out.noname.push(label(f.closest('.v-card, .card') || f));
	if (innerWidth >= 768) {
		const hs = [...document.querySelectorAll('.v-feats .v-feat, .rail .feat, .feats .feat')].map((li) => li.getBoundingClientRect().height).filter((h) => h > 0);
		if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 1) out.feats.push(`cao ${Math.round(Math.min(...hs))}–${Math.round(Math.max(...hs))}px`);
	}
	for (const g of document.querySelectorAll('.v-photos, .block .grid:has(img[data-zoom], [data-zoom])')) {
		if (!shown(g)) continue;
		const li = [...g.children].filter(shown);
		const rows = {}; li.forEach((x) => { const t = Math.round(x.getBoundingClientRect().top); rows[t] = (rows[t] || 0) + 1; });
		const last = rows[Math.max(...Object.keys(rows).map(Number))];
		if (li.length > 1 && last === 1) out.photos.push(`${li.length} ảnh, hàng cuối 1 ảnh`);
	}
	// map / construction grid edges = the text column (.v-prose) of the same section, ±1px (round 8, items 11–12)
	for (const el of document.querySelectorAll('main .v-map, main .v-photos, main .map')) {
		const col = [...(el.closest('section') || document).querySelectorAll('.v-prose, .prose')].find(shown);
		if (!shown(el) || !col) continue;
		const a = el.getBoundingClientRect(); const b = col.getBoundingClientRect();
		if (Math.abs(a.left - b.left) > 1 || Math.abs(a.right - b.right) > 1) out.edge.push(`${label(el)} ${Math.round(a.left)}–${Math.round(a.right)} ≠ cột chữ ${Math.round(b.left)}–${Math.round(b.right)}`);
	}
	// post card meta "Tác giả · ngày · 6 phút đọc": no line may start with "phút" (round 8, item 10)
	for (const m of document.querySelectorAll('.v-card .v-meta, .v-card__meta, .v-card small, .card__meta')) {
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
	const sel = 'img, main section, .v-hero--full, .v-card, .v-feat, .v-map, .v-photos, .v-gallery, .v-page__side, .v-article__side, main figure, main table, .hero, .card, .feat, .map, .gallery, .page__side, .facts__item';
	[...document.querySelectorAll(sel)].filter(shown).forEach((el, k) => {
		const r = el.getBoundingClientRect();
		out.boxes[k + ' ' + label(el)] = [r.left + scrollX, r.top + scrollY, r.width, r.height].map((v) => Math.round(v * 10) / 10);
	});
	return out;
}

// Runs in the page. Hero (NT-47 heroOverlay, NT-48 heroBox) – mockup `.hero` and theme `.v-hero--full`.
// A full-frame hero (≥ 768 px) carries ONE left → right linear gradient over the whole frame (+ an optional vertical
// one), nothing else behind the text; below 768 px the photo sits above the text, no overlay at all.
export function heroAudit() {
	const out = { overlay: [], box: [] };
	const hero = document.querySelector('.hero, .v-hero--full');
	if (!hero) return out;
	const full = hero.matches('.hero--a, .v-hero--full');
	const media = hero.querySelector('.hero__media, .v-hero__media, figure');
	const body = hero.querySelector('.hero__body, .v-hero__body');
	const hr = hero.getBoundingClientRect();
	const transparent = (c) => c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c);
	// every element inside the hero (and pseudo layers): no blur, no radial gradient, no shadow behind text
	for (const el of [hero, ...hero.querySelectorAll('*')]) {
		for (const ps of [null, '::before', '::after']) {
			const s = getComputedStyle(el, ps);
			if (ps && s.content === 'none') continue;
			const where = el.className + (ps || '');
			if (/radial-gradient|conic-gradient/.test(s.backgroundImage)) out.overlay.push(`${where}: radial/conic-gradient`);
			if (s.backdropFilter && s.backdropFilter !== 'none') out.overlay.push(`${where}: backdrop-filter ${s.backdropFilter}`);
			if (/blur/.test(s.filter)) out.overlay.push(`${where}: filter ${s.filter}`);
			if (s.textShadow !== 'none') out.box.push(`${where}: text-shadow`);
			if (!el.matches('.btn, .v-btn, .tmp') && s.boxShadow !== 'none') out.box.push(`${where}: box-shadow`);
		}
	}
	if (full && innerWidth >= 768) {
		const layers = [media].filter(Boolean).flatMap((m) => ['::before', '::after'].map((ps) => [m, ps, getComputedStyle(m, ps)]).filter(([, , s]) => s.content !== 'none' && s.backgroundImage !== 'none'));
		if (layers.length !== 1) out.overlay.push(`${layers.length} lớp phủ (cần đúng 1)`);
		for (const [m, ps, s] of layers) {
			const g = s.backgroundImage.match(/(linear|radial|conic)-gradient\((\d+deg|to [a-z ]+)?/g) || [];
			const lr = g.filter((x) => /linear-gradient\((90deg|to right)/.test(x)).length;
			const other = g.filter((x) => !/linear-gradient\((90deg|to right|0deg|180deg|to top|to bottom)/.test(x)).length;
			if (lr !== 1 || other || g.length > 2) out.overlay.push(`${ps}: ${g.join(' + ')} (cần 1 trái→phải + tối đa 1 dọc)`);
			const w = parseFloat(s.width), h = parseFloat(s.height), mr = m.getBoundingClientRect();
			if (Math.abs(w - hr.width) > 1 || Math.abs(h - hr.height) > 1 || Math.abs(mr.width - hr.width) > 1) out.overlay.push(`lớp phủ ${Math.round(w)}×${Math.round(h)} ≠ khung hero ${Math.round(hr.width)}×${Math.round(hr.height)}`);
			if (parseFloat(s.borderTopLeftRadius) || parseFloat(s.borderBottomRightRadius)) out.overlay.push(`lớp phủ bo góc ${s.borderRadius}`);
		}
	}
	if (innerWidth < 768 && media && body) { // photo above, text below on a solid ground
		const m = media.getBoundingClientRect(), b = body.getBoundingClientRect();
		if (b.top < m.bottom - 1) out.overlay.push(`mobile: chữ đè ảnh (${Math.round(b.top)} < ${Math.round(m.bottom)})`);
		const ms = getComputedStyle(media, '::after');
		if (ms.content !== 'none' && ms.backgroundImage !== 'none') out.overlay.push('mobile: còn lớp phủ');
	}
	// NT-48: text sits straight on the dark area / ground – no own background behind crumbs, eyebrow, chips, title, lead
	if (body) for (const el of body.querySelectorAll('p, h1, li, ol, ul, nav, span, a:not(.btn):not(.v-btn), div:not(.actions)')) {
		if (el.closest('.btn, .v-btn')) continue;
		const s = getComputedStyle(el);
		if (!transparent(s.backgroundColor) || s.backgroundImage !== 'none') out.box.push(`${el.tagName.toLowerCase()}.${el.className}: nền ${s.backgroundColor}`);
	}
	return out;
}

// Runs in the page. Facts bar (NT-66 factsCut, NT-67 factsRows): full values ≤ 3 lines, one "Chi tiết" at most; cells per
// row by frame width (≥ 1200 → ≤ 4, 5–8 cells in 2 even rows; 768–1199 → 2; < 768 → 1), no empty cell, cell ≥ 240 px.
export function factsAudit() {
	const out = { cut: [], rows: [] };
	for (const list of document.querySelectorAll('.facts__list, .v-facts dl')) {
		const items = [...list.children].filter((x) => x.getBoundingClientRect().height > 0);
		const more = list.querySelectorAll('.facts__more, a[href^="#"]');
		if (more.length > 1) out.cut.push(`${more.length} link "Chi tiết" (tối đa 1)`);
		for (const a of more) if (!document.getElementById(a.hash.slice(1))) out.cut.push(`"Chi tiết" tới ${a.hash} không có khối`);
		for (const it of items) {
			const dd = it.querySelector('dd'), s = getComputedStyle(dd);
			const k = (it.querySelector('dt')?.innerText || '').trim();
			if (/…|\.\.\./.test(dd.innerText)) out.cut.push(`${k}: có "…"`);
			const clips = s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.webkitLineClamp !== 'none'; // overflow that is drawn is not a cut
			if (s.textOverflow === 'ellipsis' || (clips && (dd.scrollWidth > dd.clientWidth + 1 || dd.scrollHeight > dd.clientHeight + 1))) out.cut.push(`${k}: bị cắt`);
			const rg = document.createRange(); rg.selectNodeContents(dd);
			const cs = [...rg.getClientRects()].filter((r) => r.width > 1).map((r) => (r.top + r.bottom) / 2).sort((a, b) => a - b);
			const lines = cs.filter((c, n) => !n || c - cs[n - 1] > 8).length; // line centres; a padded link shares its line's centre
			if (lines > 3) out.cut.push(`${k}: ${lines} dòng (tối đa 3)`);
		}
		const n = items.length, lw = list.getBoundingClientRect().width;
		const rows = {};
		items.forEach((it) => { const r = it.getBoundingClientRect(); (rows[Math.round(r.top)] ??= []).push(r); });
		const rr = Object.keys(rows).map(Number).sort((a, b) => a - b).map((t) => rows[t]);
		const max = innerWidth >= 1200 ? 4 : innerWidth >= 768 ? 2 : 1;
		const want = innerWidth >= 1200 ? (n <= 4 ? 1 : 2) : Math.ceil(n / max);
		if (rr.some((r) => r.length > max)) out.rows.push(`${innerWidth}px: ${rr.map((r) => r.length).join('+')} (tối đa ${max}/hàng)`);
		if (rr.length !== want || (innerWidth >= 1200 && Math.max(...rr.map((r) => r.length)) - Math.min(...rr.map((r) => r.length)) > 1)) out.rows.push(`${innerWidth}px: ${n} ô → ${rr.map((r) => r.length).join('+')} (cần ${want} hàng đều)`);
		for (const r of rr) {
			const used = r.reduce((s, x) => s + x.width, 0) + (r.length - 1);
			if (used < lw - 2) out.rows.push(`${innerWidth}px: hàng ${r.length} ô chừa trống ${Math.round(lw - used)}px`);
			if (r.some((x) => x.width < 240 - 0.5)) out.rows.push(`${innerWidth}px: ô hẹp ${Math.round(Math.min(...r.map((x) => x.width)))}px < 240`);
			const hs = r.map((x) => x.height);
			if (Math.max(...hs) - Math.min(...hs) > 1) out.rows.push(`${innerWidth}px: ô cùng hàng cao ${Math.round(Math.min(...hs))}–${Math.round(Math.max(...hs))}px`);
		}
	}
	return out;
}

// Runs in the page. Post side column (round 8, item 15) at one scroll position: [problems].
export function stickyAudit() {
	const side = document.querySelector('.v-article__side, .page__side');
	if (!side || getComputedStyle(side).display === 'none') return null;
	const head = document.querySelector('.v-header, .header');
	const hb = head ? head.getBoundingClientRect().bottom : 0;
	const r = side.getBoundingClientRect();
	const top = parseFloat(getComputedStyle(side).top) || 0;
	const out = [];
	const stuckOrBefore = r.top >= top - 1; // after the article ends the column scrolls away with it – no longer "dính"
	if (r.bottom > 0 && r.top < innerHeight && stuckOrBefore) {
		if (r.top < hb + 16 - 0.5) out.push(`NT-60 đỉnh ${Math.round(r.top)} < đáy header ${Math.round(hb)} + 16`);
		if (r.bottom > innerHeight - 16 + 0.5) out.push(`NT-60 đáy ${Math.round(r.bottom)} > ${innerHeight} − 16`);
		const cta = side.querySelector('.v-btn, .btn');
		if (cta) { const c = cta.getBoundingClientRect(); if (c.top < hb || c.bottom > innerHeight) out.push(`NT-60 nút tư vấn ngoài màn hình (${Math.round(c.top)}–${Math.round(c.bottom)})`); }
		for (const s of side.querySelectorAll('*')) { // inner scrollbars may only sit on the TOC list
			const cs = getComputedStyle(s);
			if (s === side || s.closest('.v-toc, [data-toc]')) continue;
			if (/(auto|scroll)/.test(cs.overflowY) && s.scrollHeight > s.clientHeight + 1) { out.push('NT-60 thanh cuộn bên trong: ' + s.className); break; }
		}
		if (/(auto|scroll)/.test(getComputedStyle(side).overflowY) && side.scrollHeight > side.clientHeight + 1) out.push('NT-60 cả cột cuộn bên trong');
	}
	const foot = document.querySelector('footer, .v-footer');
	if (foot) { const f = foot.getBoundingClientRect(); if (r.bottom > f.top + 0.5 && r.top < f.bottom) out.push('NT-60 đè footer'); }
	return out;
}

// labels start with the NT code of docs/NGHIEM-THU.md (reports print by NT code; test: ui-media.test.mjs)
const CRIT = [['broken', 'NT-20 Ảnh hỏng'], ['wrong', 'NT-21 Chọn sai file'], ['dpr', 'NT-01 Lệch theo DPR > 1px'], ['mixed', 'NT-24 Nhóm thẻ trộn thiếu khung'], ['noname', 'NT-24 Khung dự phòng không tên'],
	['feats', 'NT-09 Dải nổi bật lệch cao'], ['photos', 'NT-29 Ảnh lẻ lưới tiến độ'], ['edge', 'NT-28 Bản đồ/lưới lệch cột chữ'], ['postgrid', 'NT-07 Ô trống lưới bài'], ['meta', 'NT-54 Meta ngắt "phút"'],
	['empty', 'NT-04 Khối trống'], ['table', 'NT-53 Bảng < 2 hàng'], ['overflow', 'NT-02 Tràn ngang'], ['h1', 'NT-56 H1 ≠ 1'], ['caps', 'NT-55 Heading HOA'], ['gaps', 'NT-03 Khoảng trống > 30%']];
const INFO = [['lowres', 'NT-22 Ảnh nguồn thiếu độ phân giải'], ['blurryOld', 'NT-21 Ảnh mờ (cách đo cũ)'], ['gridinfo', 'NT-08 Ô trống lưới khác']];

// staging under load sometimes answers 5xx (page or picture) – the page is loaded again (≤ 3 times) before measuring, so a
// server hiccup is not counted as a theme error; a page that keeps failing is measured as it is
const openSettled = async (p, url) => {
	for (let i = 0; i < 3; i++) {
		const r = await p.goto(url, { waitUntil: 'load', timeout: 120000 }).catch(() => null);
		await settle(p);
		const bad = await p.evaluate(() => [...document.images].some((im) => im.complete && !im.naturalWidth && im.getBoundingClientRect().width > 40));
		if (r && r.status() < 500 && !bad && await p.locator('h1').count()) return;
		await p.waitForTimeout(5000);
	}
};
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
				await openSettled(p, base + path);
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
