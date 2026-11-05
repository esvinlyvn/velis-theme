#!/usr/bin/env node
// Vòng sửa bước 2 – đo NT-49 (màn hình đầu hero B), NT-17 (căn lề hero B), NT-18 (nút hero), NT-10 (dải nổi bật),
// NT-43 (hero A) và độ giãn ảnh hero, chưa cuộn. Chỉ đọc, máy local.
// Usage: node tools/mockup_heroB.mjs http://127.0.0.1:8765 out-dir
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://127.0.0.1:8765', dir = 'screenshots/mockup-b2-r2/kiem-tra'] = process.argv.slice(2);
const PAGES = ['trang-chu', 'the-global-city', 'masteri-park-place'];
const SCREENS = [['M1', 1366, 768, 1], ['M2', 1536, 864, 1.25], ['M3', 1920, 1080, 1], ['M4', 960, 540, 2], ['M5', 390, 844, 2], ['768', 768, 1024, 2], ['1024', 1024, 768, 1]];

// Runs in the page. Returns { v: [violations], d: {measures} } for one page × hero × screen.
export function heroMeasure({ screen, dpr }) {
	const v = [], d = {};
	const R = (el) => el.getBoundingClientRect();
	const vh = innerHeight, vw = innerWidth, q = (s, r = document) => r.querySelector(s);
	const hero = q('.hero'), split = hero.matches('.hero--split'), isB = hero.matches('.hero--b'), home = hero.matches('.hero--home');
	const h1 = q('h1', hero), chips = q('.chips', hero), lead = q('.hero__lead', hero), actions = q('.actions', hero);
	const btns = [...actions.querySelectorAll('.btn')];
	const seen = (el) => { const r = R(el); return r.top >= -0.5 && r.bottom <= vh + 0.5; };
	// NT-49 first screen, hero B, M1–M3 (+ M5: H1 and the first button)
	if (isB && ['M1', 'M2', 'M3'].includes(screen)) {
		d.btnBottom = Math.round(Math.max(...btns.map((b) => R(b).bottom)));
		if (d.btnBottom > vh - 24) v.push(`NT-49 đáy nút ${d.btnBottom} > ${vh} − 24`);
		for (const [n, el] of [['tên', h1], ['chip', chips], ['đoạn dẫn', lead], ['đoạn giới thiệu đầu', q('.hero__intro', hero)]]) if (el && !seen(el)) v.push(`NT-49 ${n} không trọn trong màn đầu`);
		if (!home) {
			const items = [...q('.facts__list').children];
			const top0 = Math.min(...items.map((i) => Math.round(R(i).top)));
			const row = items.filter((i) => Math.abs(R(i).top - top0) < 2);
			d.factsRow1Bottom = Math.round(Math.max(...row.map((i) => R(i).bottom)));
			if (d.factsRow1Bottom > vh) v.push(`NT-49 hàng đầu thanh thông tin đáy ${d.factsRow1Bottom} > ${vh}`);
			if (!row.some((i) => /^Giá$/.test(q('dt', i).textContent.trim()))) v.push('NT-49 ô Giá không ở hàng đầu');
		}
	}
	// split hero (home, round 5): H1, lead, both buttons and the whole photo on the first screen, M1–M3; edges on the frame (1.1)
	if (split && ['M1', 'M2', 'M3'].includes(screen)) {
		d.btnBottom = Math.round(Math.max(...btns.map((b) => R(b).bottom)));
		if (d.btnBottom > vh - 24) v.push(`màn đầu: đáy nút ${d.btnBottom} > ${vh} − 24`);
		for (const [n, el] of [['tên', h1], ['đoạn dẫn', lead], ['ảnh', q('.hero__media', hero)], ...btns.map((b, i) => [`nút ${i + 1}`, b])]) if (!seen(el)) v.push(`màn đầu: ${n} không trọn`);
	}
	if (split && vw >= 768) {
		const ref = R(q('.header__bar')), m = R(q('.hero__media', hero));
		d.edgeL = +(R(h1).left - ref.left).toFixed(1); d.edgeR = +(m.right - ref.right).toFixed(1);
		if (Math.abs(d.edgeL) > 1 || Math.abs(d.edgeR) > 1) v.push(`1.1 chữ lệch mép trái ${d.edgeL} / ảnh lệch mép phải ${d.edgeR}`);
	}
	if (screen === 'M5') {
		d.h1Bottom = Math.round(R(h1).bottom); d.btn1Bottom = Math.round(R(btns[0]).bottom);
		if (d.h1Bottom > vh || d.btn1Bottom > vh) v.push(`NT-49 M5: H1 ${d.h1Bottom} / nút đầu ${d.btn1Bottom} > ${vh}`);
	}
	// NT-17 hero B frame = content frame (header .wrap), ±1 px, ≥ 768 px
	if (isB && vw >= 768) {
		const ref = R(q('.header__bar')), m = R(q('.hero__media', hero));
		d.edgeL = +(m.left - ref.left).toFixed(1); d.edgeR = +(m.right - ref.right).toFixed(1);
		if (Math.abs(d.edgeL) > 1 || Math.abs(d.edgeR) > 1) v.push(`NT-17 khung ảnh lệch mép trái ${d.edgeL} / phải ${d.edgeR}`);
		const lefts = [['logo', q('.header__logo img')], ['breadcrumb', q('.crumbs')], ['thanh mục', q('.tabs ul')], ['eyebrow', q('.eyebrow', hero)], ['tên', h1], ['nút', btns[0]]];
		for (const [n, el] of lefts) if (el && R(el).width && Math.abs(R(el).left - m.left) > 1) v.push(`NT-17 ${n} lệch mép trái ${(R(el).left - m.left).toFixed(1)}px`);
		const cta = q('.header__cta');
		if (cta && R(cta).width && Math.abs(R(cta).right - m.right) > 1) v.push(`NT-17 nút "Nhận tư vấn" header lệch mép phải ${(R(cta).right - m.right).toFixed(1)}px`);
	}
	// NT-18 buttons under the chips / lead, left with the title, ≤ 24 px; phones: stacked, equal width
	const above = chips || lead || [...hero.querySelectorAll('.hero__intro')].pop() || h1;
	d.btnGap = Math.round(R(actions).top - R(above).bottom); d.btnDx = +(R(btns[0]).left - R(h1).left).toFixed(1);
	if (d.btnGap > 24) v.push(`NT-18 nút cách chip ${d.btnGap}px > 24`);
	if (Math.abs(d.btnDx) > 1) v.push(`NT-18 nút lệch trái tiêu đề ${d.btnDx}px`);
	if (vw < 768) {
		const rs = btns.map(R);
		if (rs.some((r) => Math.abs(r.left - rs[0].left) > 1 || Math.abs(r.width - rs[0].width) > 1) || rs.some((r, i) => i && r.top < rs[i - 1].bottom - 1)) v.push('NT-18 mobile: nút không xếp dọc rộng đều');
	} else { // one row, or wrapped rows that each start at the title's left edge (never pushed to the right)
		const rows = {}; btns.forEach((x) => (rows[Math.round(R(x).top)] ??= []).push(R(x)));
		if (Object.values(rows).some((r) => Math.abs(Math.min(...r.map((x) => x.left)) - R(h1).left) > 1)) v.push('NT-18 hàng nút không bắt đầu ở mép trái tiêu đề');
	}
	// NT-43 hero A ≥ 1366: overlay reaches 0 by ~55 %, ≥ 45 % of the photo untouched, text block ≤ 40 % and inside the dark part
	if (!isB && !split && vw >= 1366) {
		const bg = getComputedStyle(q('.hero__media', hero), '::after').backgroundImage;
		const layers = bg.split(/,\s*(?=linear-gradient)/);
		const stops = [...layers[0].matchAll(/rgba?\(([^)]+)\)\s*([\d.]+)%/g)].map((m) => [+(m[1].split(',')[3] ?? 1), +m[2]]);
		const zero = stops.find(([a]) => a === 0);
		d.overlayZero = zero ? zero[1] : 100;
		d.brightPct = layers.length > 1 ? 0 : 100 - d.overlayZero;
		const hr = R(hero), kids = [...q('.hero__body', hero).children].map(R);
		const textR = Math.max(...kids.map((k) => k.right)), textL = Math.min(...kids.map((k) => k.left));
		d.textWidthPct = +((textR - textL) / hr.width * 100).toFixed(1); d.textRightPct = +((textR - hr.left) / hr.width * 100).toFixed(1);
		if (d.overlayZero > 55) v.push(`NT-43 lớp phủ về 0 ở ${d.overlayZero}% > 55`);
		if (d.brightPct < 45) v.push(`NT-43 ảnh giữ sáng ${d.brightPct}% < 45`);
		if (d.textWidthPct > 40) v.push(`NT-43 khối chữ rộng ${d.textWidthPct}% > 40`);
	}
	// stretch of the 1200 px file in the hero frame (cover, crop zoom included), ≤ 1,5 for hero B on M1–M5
	const img = q('.hero__media img', hero), ir = R(img);
	const t = getComputedStyle(img).transform, zoom = t && t !== 'none' ? Math.hypot(...t.match(/-?[\d.e]+/g).slice(0, 2).map(Number)) : 1;
	const fw = 1200, ratio = img.naturalWidth / img.naturalHeight || +img.getAttribute('width') / +img.getAttribute('height');
	const box = R(q('.hero__media', hero));
	d.stretch = +(Math.max(box.width, box.height * ratio) * dpr * zoom / fw).toFixed(2);
	d.frame = `${Math.round(box.width)}×${Math.round(box.height)}`;
	if ((isB || split) && /^M[1-5]$/.test(screen) && d.stretch > 1.5) v.push(`độ giãn ảnh ${d.stretch} > 1,5`);
	return { v, d, ir: ir.width };
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const b = await chromium.launch();
	const rows = [];
	for (const page of PAGES) for (const hero of page === 'trang-chu' ? ['tach'] : ['b', 'a']) for (const [s, w, h, dpr] of SCREENS) {
		const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
		const p = await ctx.newPage();
		await p.goto(`${base}/${page}.html${hero === 'tach' ? '' : '#hero-' + hero}`, { waitUntil: 'load' });
		await p.waitForFunction(() => document.querySelector('.hero img').complete);
		const r = await p.evaluate(heroMeasure, { screen: s, dpr });
		rows.push({ page, hero, s, ...r });
		await ctx.close();
	}
	await b.close();
	const bad = rows.filter((r) => r.v.length);
	const f = (x) => (x === undefined ? '–' : String(x).replace('.', ','));
	const md = ['| Trang | Hero | Màn | Khung ảnh | Đáy nút (≤ cao − 24) | Đáy hàng 1 thanh TT | Lệch mép T / P | Nút: cách chip · lệch trái | NT-43: lớp phủ 0 tại · ảnh giữ sáng · khối chữ | Độ giãn | Vi phạm |', '|---|---|---|---|---|---|---|---|---|---|---|',
		...rows.map((r) => `| ${r.page} | ${r.hero.toUpperCase()} | ${r.s} | ${r.d.frame} | ${f(r.d.btnBottom ?? r.d.btn1Bottom)} | ${f(r.d.factsRow1Bottom ?? r.d.railTop)} | ${r.d.edgeL === undefined ? '–' : f(r.d.edgeL) + ' / ' + f(r.d.edgeR)} | ${f(r.d.btnGap)} · ${f(r.d.btnDx)} | ${r.d.overlayZero === undefined ? '–' : `${f(r.d.overlayZero)}% · ${f(r.d.brightPct)}% · ${f(r.d.textWidthPct)}%`} | ${f(r.d.stretch)} | ${r.v.length ? r.v.join('; ') : 0} |`)];
	mkdirSync(dir, { recursive: true });
	writeFileSync(`${dir}/do-hero.md`, `# Đo NT-49 / NT-17 / NT-18 / NT-43 – ${new Date().toISOString().slice(0, 10)}\n\nChưa cuộn. Màn hình cao: M1 768, M2 864, M3 1080, M4 540, M5 844, 768 → 1024, 1024 → 768. Trang chủ: hero tách đôi (vòng 5, "TACH"): H1, đoạn dẫn, 2 nút và trọn ảnh trong màn đầu M1–M3, đáy nút ≤ cao − 24; M5: H1 + nút đầu; mép chữ / mép ảnh trùng khung (1.1).\n\n${md.join('\n')}\n\n**Vi phạm: ${bad.reduce((n, r) => n + r.v.length, 0)}**\n`);
	for (const r of bad) console.log(`${r.page || 'trang-chu'} ${r.hero || ''} ${r.s}: ${r.v.join('; ')}`);
	console.log(`vi phạm: ${bad.reduce((n, r) => n + r.v.length, 0)}`);
	process.exit(bad.length ? 1 : 0);
}
