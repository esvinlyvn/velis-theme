#!/usr/bin/env node
// Step 3, review round – machine measures of items 2.1–2.16 on STAGING (guest view behind the staging password),
// M1–M5. One row per item × page × screen: value + pass/fail. Items judged by eye are not here (see the report).
// Usage: VIEW_PASSWORD_FILE=… node tools/check_b3r2.mjs <out.md>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { login, SCREENS } from './shots_b3.mjs';
import { blockGaps } from './ui_layout.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';

const TGC = '/du-an/the-global-city/', MPP = '/du-an/the-global-city/masteri-park-place/', DONG = '/du-an/spring-ville/nha-pho/',
	PRIVE = '/du-an/the-prive/', POST = '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/';
const COLUMN = [TGC, MPP, DONG, PRIVE, POST, '/gioi-thieu/', '/tuyen-dung/'];
const PROJECT = [TGC, MPP, DONG, PRIVE];
// [item, label, pages, fn(screen) run in the page → { v: string, ok: bool } | null (not applicable)]
const CHECKS = [
	['2.1', 'mép trái/phải cột chính (lệch tối đa, px)', COLUMN, () => {
		const main = document.querySelector('.page__main') || document.querySelector('main .wrap--read');
		if (!main) return null;
		const kids = [...main.querySelectorAll(':scope > .block > *, :scope > section > *, .prose > *, .block > .grid, .block > .map, .block > .table-wrap')]
			.filter((e) => !e.closest('.gallery, .block--dark, .advisor-inline, .clamp__more, [hidden]') && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'inline' && !e.matches('.sr-only, script, style, .btn, .actions, .eyebrow, .chips, .ftabs, details, .disclosure'));
		const mr = main.getBoundingClientRect(), cs = getComputedStyle(main);
		const L = mr.left + parseFloat(cs.paddingLeft), R = mr.right - parseFloat(cs.paddingRight);
		let worst = 0, who = '';
		for (const e of kids) { const r = e.getBoundingClientRect(), d = Math.max(Math.abs(r.left - L), Math.abs(r.right - R)); if (d > worst) { worst = d; who = e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''); } }
		return { v: `${worst.toFixed(1)}${worst > 1 ? ' (' + who + ')' : ''} / ${kids.length} phần tử`, ok: worst <= 1 };
	}],
	['2.1', 'khe cột chính ↔ cột phải (px)', COLUMN, () => {
		const m = document.querySelector('.page__main'), s = document.querySelector('.page__side');
		if (!m || !s || !s.getBoundingClientRect().width) return null;
		const g = s.getBoundingClientRect().left - m.getBoundingClientRect().right;
		return { v: g.toFixed(0), ok: g <= 48.5 };
	}],
	['2.2', 'khe dọc giữa 2 khối > 96 px (số chỗ)', ['/', '/du-an/', '/chu-dau-tu/', '/blog/', ...COLUMN], 'GAPS'],
	['2.3', 'cỡ tiêu đề khối > H2 nội dung > H3 (px)', PROJECT, () => {
		const t = document.querySelector('.page__main .sechead h2'), h2 = document.querySelector('.page__main .prose h2'), h3 = document.querySelector('.page__main .prose h3');
		if (!t) return null;
		const f = (e) => (e ? parseFloat(getComputedStyle(e).fontSize) : 0);
		const ok = f(t) > f(h2) && (!h3 || !h2 || f(h2) >= f(h3)) && [...document.querySelectorAll('.page__main .prose h2')].every((e) => f(e) < f(t));
		return { v: `${f(t)} > ${f(h2) || '–'} ≥ ${f(h3) || '–'}`, ok };
	}],
	['2.4', 'vùng "Đọc tiếp" (≤ 1); tiêu đề trong vùng mờ không mờ', PROJECT, () => {
		const c = [...document.querySelectorAll('.clamp.is-clamped, .clamp:not(.is-open)')].filter((e) => e.getBoundingClientRect().height);
		const faded = [...document.querySelectorAll('.clamp :is(h2,h3,h4)')].filter((h) => h.getBoundingClientRect().height && (getComputedStyle(h).maskImage !== 'none' || +getComputedStyle(h).opacity < 1));
		return { v: `${c.length} vùng, ${faded.length} tiêu đề mờ`, ok: c.length <= 1 && !faded.length };
	}],
	['2.5', 'thẻ có ảnh xếp trước thẻ khung tên (lưới sai thứ tự)', ['/', '/du-an/', TGC], () => {
		let bad = 0, n = 0;
		for (const g of document.querySelectorAll('.grid')) {
			const cards = [...g.children].filter((c) => c.getBoundingClientRect().height);
			const photo = cards.map((c) => !!c.querySelector('.card__media img'));
			n++; if (photo.lastIndexOf(true) > photo.indexOf(false) && photo.includes(false)) bad++;
		}
		return n ? { v: `${bad}/${n} lưới`, ok: !bad } : null;
	}],
	['2.6', 'bộ lọc /du-an/: 3 nhóm có nhãn; mobile 3 ô chọn', ['/du-an/'], (s) => {
		const labels = [...document.querySelectorAll('.zfilter__label')].filter((e) => e.getBoundingClientRect().width).map((e) => e.textContent.trim());
		const sel = [...document.querySelectorAll('.zfilter__select, [data-filter] select')].filter((e) => e.getBoundingClientRect().width).length;
		const chips = [...document.querySelectorAll('[data-filter] button[value]')].filter((e) => e.getBoundingClientRect().width).length;
		const okL = ['Khu vực', 'Chủ đầu tư', 'Loại sản phẩm'].every((x) => labels.some((l) => l.startsWith(x)));
		return { v: `nhãn: ${labels.join(' · ')}; ô chọn ${sel}; chip hiện ${chips}`, ok: okL && (s === 'M5' ? sel === 3 && !chips : chips > 0) };
	}],
	['2.7', 'ảnh hero (tên file)', ['/', '/du-an/', '/gioi-thieu/'], 'HERO'],
	['2.8', 'thứ tự khối "Công ty TNHH Velis Realty"', ['/'], () => {
		const b = document.querySelector('#ve-velis'); if (!b) return { v: 'không thấy', ok: false };
		const seq = [...b.querySelectorAll('h2, p, li, .btn')].filter((e) => e.getBoundingClientRect().height).map((e) => e.tagName === 'H2' ? 'H2:' + e.textContent.trim() : e.tagName);
		const i1 = seq.indexOf('H2:Công ty TNHH Velis Realty'), i2 = seq.findIndex((x) => /^H2:Giá trị khác biệt/i.test(x));
		const h2s = [...b.querySelectorAll('h2')].map((h) => parseFloat(getComputedStyle(h).fontSize));
		const ok = i1 === 0 && i2 > i1 + 2 && seq.slice(i1 + 1, i2).filter((x) => x === 'P').length === 2 && seq.indexOf('LI') > i2 && seq.lastIndexOf('A') > seq.lastIndexOf('LI') && new Set(h2s).size === 1;
		return { v: `H2 ${h2s.join('/')} px; ${i1}→${i2}`, ok };
	}],
	['2.9', 'logo đối tác: chênh diện tích; cao/rộng tối đa; mobile 2 cột căn giữa', ['/', '/chu-dau-tu/'], (s) => {
		const imgs = [...document.querySelectorAll('.partners img, .card__logo img')].filter((i) => i.getBoundingClientRect().width);
		if (!imgs.length) return null;
		const a = imgs.map((i) => { const r = i.getBoundingClientRect(); return { w: r.width, h: r.height, c: (r.left + r.right) / 2, p: i.closest('li, .card__media, .card__logo').getBoundingClientRect() }; });
		const ar = a.map((x) => x.w * x.h), spread = Math.max(...ar) / Math.min(...ar) - 1;
		const big = a.filter((x) => x.h > 48.5 || x.w > 160.5).length;
		const off = s === 'M5' ? Math.max(...a.map((x) => Math.abs(x.c - (x.p.left + x.p.right) / 2))) : 0;
		const cols = new Set(a.filter((x) => document.querySelector('.partners')?.contains(document.elementFromPoint(x.c, 1) || document.body) || true).map((x) => Math.round(x.p.left))).size;
		return { v: `${imgs.length} logo, chênh ${(spread * 100).toFixed(1)} %, vượt khung ${big}${s === 'M5' ? `, lệch tâm ${off.toFixed(1)} px, ${cols} cột` : ''}`, ok: spread <= 0.15 && !big && off <= 1 };
	}],
	['2.10', '/chu-dau-tu/: số thẻ; nhãn "Chủ đầu tư" lặp', ['/chu-dau-tu/'], () => {
		const cards = [...document.querySelectorAll('main .grid .card')];
		const rep = cards.filter((c) => /^chủ đầu tư$/i.test(c.querySelector('.eyebrow')?.textContent.trim() || '')).length;
		return { v: `${cards.length} thẻ, ${rep} nhãn lặp`, ok: cards.length > 0 && !rep };
	}],
	['2.11', 'câu vai trò (14 px, cuối khối); Zalo nút viền; giá trị nhiều dòng căn trái', PROJECT, (s) => {
		const adv = [...document.querySelectorAll('.page__side .advisor, .advisor-inline .advisor')].find((e) => e.getBoundingClientRect().height);
		if (!adv) return { v: 'không thấy khối', ok: false };
		const role = adv.querySelector('.advisor__role'), last = [...adv.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().height && e.children.length === 0).pop();
		const zalo = [...adv.querySelectorAll('a')].find((a) => /zalo/i.test(a.textContent));
		const multi = [...adv.querySelectorAll('dd')].filter((d) => d.getClientRects().length && d.getBoundingClientRect().height > parseFloat(getComputedStyle(d).lineHeight) * 1.5);
		const okRole = role && /^Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là .+\.$/.test(role.textContent.trim()) && parseFloat(getComputedStyle(role).fontSize) === 14 && (role === last || role.contains(last));
		const okZ = zalo && /btn--line/.test(zalo.className);
		const okM = multi.every((d) => getComputedStyle(d).textAlign !== 'right' && getComputedStyle(d).textAlign !== 'end');
		return { v: `${role ? '"' + role.textContent.trim().slice(-30) + '"' : 'không có câu'}; Zalo ${zalo?.className || '–'}; ${multi.length} giá trị nhiều dòng`, ok: !!(okRole && okZ && okM) };
	}],
	['2.12', 'bảng so sánh: tên cột ≤ 2 dòng; cột toàn "Chưa công bố"; link "Xem phân khu →" ≥ 44 px; không lặp cột', [TGC, MPP], () => {
		const t = document.querySelector('#so-sanh table'); if (!t) return null;
		const ths = [...t.querySelectorAll('thead th')].slice(1);
		const lines = ths.map((th) => { const r = document.createRange(); r.selectNodeContents(th); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size; });
		const rows = [...t.querySelectorAll('tbody tr')].filter((r) => !r.querySelector('a'));
		const names = ths.map((th) => th.childNodes[0]?.textContent.trim()), dup = names.length - new Set(names).size;
		const empty = ths.filter((_, i) => rows.length && rows.every((r) => /Chưa công bố/.test(r.children[i + 1]?.textContent || ''))).length;
		const vis = (a) => [...a.childNodes].filter((n) => !(n.nodeType === 1 && n.matches('.sr-only'))).map((n) => n.textContent).join('').trim(); // text a sighted reader sees
		const links = [...t.querySelectorAll('a')], small = links.filter((a) => a.getBoundingClientRect().height < 44).length;
		return { v: `dòng tên cột tối đa ${Math.max(...lines)}; ${dup} cột lặp; ${empty} cột rỗng; ${links.length} link "${links[0] ? vis(links[0]) : ''}", ${small} < 44 px`, ok: Math.max(...lines) <= 2 && !dup && !empty && !small && links.every((a) => /^Xem (phân khu|dự án|dòng sản phẩm) →$/.test(vis(a))) };
	}],
	['2.13', 'Tuyển dụng: mục cuối breadcrumb; H1', ['/tuyen-dung/'], () => {
		const last = [...document.querySelectorAll('.crumbs li')].pop()?.textContent.trim(), h1 = document.querySelector('h1')?.textContent.trim();
		return { v: `"${last}" · "${h1}"`, ok: last === 'Tuyển dụng' && !/Velis Realty\s*$/.test(h1) };
	}],
	['2.14', '404: ô tìm + nút cùng hàng (mobile: nút dưới, rộng hết); nhãn cách hàng nút', ['/khong-ton-tai-xyz/'], (s) => {
		const f = document.querySelector('main form[role="search"], main form.search, main form'); if (!f) return { v: 'không thấy form', ok: false };
		const inp = f.querySelector('input[type="search"], input[name="s"]').getBoundingClientRect(), btn = f.querySelector('button').getBoundingClientRect();
		const lab = f.querySelector('label')?.getBoundingClientRect(), row = f.previousElementSibling?.getBoundingClientRect();
		const gap = lab && row ? Math.round(lab.top - row.bottom) : NaN;
		const same = Math.abs(inp.top - btn.top) < 1;
		const ok = (s === 'M5' ? !same && Math.abs(btn.width - inp.width) < 1 : same) && gap >= 24;
		return { v: `${same ? 'cùng hàng' : 'nút dưới'}, nút ${btn.width.toFixed(0)}/${inp.width.toFixed(0)} px; nhãn cách ${gap} px`, ok };
	}],
	['2.15', 'vùng bấm ngoài đoạn văn < 44 px (số chỗ)', ['/', '/blog/', '/du-an/', TGC], () => {
		const sel = '.feats a, .footer a, .card a, .chips button, .ftabs button, .tabs a, [data-filter] button, .crumbs a, .advisor a, .pricecard a';
		// a title link whose ::after covers the card (stretched link) is tapped through the whole card
		const box = (a) => (getComputedStyle(a, '::after').position === 'absolute' ? a.closest('.card, .feat') || a : a).getBoundingClientRect();
		const bad = [...document.querySelectorAll(sel)].filter((a) => { const r = box(a); return r.width && !a.closest('p:not(.card__more), li.prose') && (r.height < 43.5 || r.width < 43.5); });
		return { v: `${bad.length}${bad.length ? ' (' + bad.slice(0, 3).map((a) => a.textContent.trim().slice(0, 18) + ' ' + Math.round(box(a).height)).join('; ') + ')' : ''}`, ok: !bad.length };
	}],
	['2.16', 'mobile: tab dự án cuộn ngang, không cắt chữ, mục chọn trong khung; tab khu vực 1 hàng', [TGC, '/'], (s) => {
		if (s !== 'M5') return null;
		const tabs = document.querySelector(location.pathname === '/' ? '.ftabs' : '.tabs ul'); if (!tabs) return { v: 'không thấy', ok: false };
		const items = [...tabs.querySelectorAll('a, button')].filter((e) => e.getBoundingClientRect().width);
		const rows = new Set(items.map((e) => Math.round(e.getBoundingClientRect().top))).size;
		const wrapped = items.filter((e) => { const r = document.createRange(); r.selectNodeContents(e); return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > 1; }).length;
		const ox = getComputedStyle(tabs).overflowX, tr = tabs.getBoundingClientRect();
		const cur = items.find((e) => e.getAttribute('aria-current') || e.getAttribute('aria-pressed') === 'true' || e.classList.contains('is-current'));
		const inView = !cur || (cur.getBoundingClientRect().left >= tr.left - 1 && cur.getBoundingClientRect().right <= tr.right + 1);
		return { v: `${rows} hàng, ${wrapped} mục xuống dòng, overflow-x ${ox}, mục chọn ${inView ? 'trong khung' : 'NGOÀI khung'}`, ok: rows === 1 && !wrapped && /auto|scroll/.test(ox) && inView };
	}],
];

if (import.meta.url === `file://${process.argv[1]}`) {
	const out = process.argv[2] || 'screenshots/b3-r2/kiem-tra/do-may.md';
	const b = await chromium.launch(), state = await login(b);
	const rows = [], hero = {};
	const pages = [...new Set(CHECKS.flatMap((c) => c[2]))];
	for (const [m, [w, h, dpr]] of Object.entries(SCREENS)) {
		const ctx = await b.newContext({ storageState: state, viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
		for (const path of pages) {
			const p = await ctx.newPage();
			for (let k = 0; k < 3; k++) { const r = await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }).catch(() => null); if (r && r.status() < 500 && await p.evaluate(() => !!document.querySelector('link[href*="velis.min.css"]'))) break; await p.waitForTimeout(3000); }
			await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
			await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
			await p.waitForTimeout(300);
			for (const [item, label, list, fn] of CHECKS) {
				if (!list.includes(path)) continue;
				let r;
				if (fn === 'GAPS') { const g = await p.evaluate(blockGaps); r = { v: `${g.length}${g.length ? ' (' + g.map((x) => `${x.from}→${x.to} ${x.gap}`).join('; ') + ')' : ''}`, ok: !g.length }; }
				else if (fn === 'HERO') { r = await p.evaluate(() => { const i = document.querySelector('.hero img'); return i ? (i.currentSrc || i.src).split('/').pop().replace(/-\d+x\d+(?=\.)/, '') : '–'; }); hero[path] ??= r; r = { v: r, ok: true }; }
				else r = await p.evaluate(fn, m);
				if (r) rows.push([item, label, path, m, r.v, r.ok]);
			}
			await p.close();
		}
		await ctx.close();
	}
	await b.close();
	const distinct = new Set(Object.values(hero)).size === Object.keys(hero).length;
	rows.filter((r) => r[0] === '2.7').forEach((r) => { r[5] = distinct; });
	const bad = rows.filter((r) => !r[5]);
	const md = `# Bước 3, vòng sửa – đo máy mục 2.1–2.16 trên staging (${new Date().toISOString().slice(0, 10)})\n\nMỗi dòng = mục × trang × màn. Ảnh hero: ${Object.entries(hero).map(([k, v]) => `${k} → \`${v}\``).join(', ')} (${distinct ? 'khác nhau' : 'TRÙNG'}).\n\n| Mục | Đo | Trang | Màn | Giá trị | Kết quả |\n|---|---|---|---|---|---|\n${rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${String(r[4]).replace(/\|/g, '/')} | ${r[5] ? 'ĐẠT' : '**KHÔNG**'} |`).join('\n')}\n\n**Không đạt: ${bad.length} / ${rows.length}**\n`;
	writeFileSync(out, md);
	for (const r of bad) console.log(r.join(' | '));
	console.log(`không đạt ${bad.length}/${rows.length}`);
}
