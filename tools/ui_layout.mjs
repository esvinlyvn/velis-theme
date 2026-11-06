// Layout audit run in the page after a real scroll to the bottom (tools/check_ui.mjs). Self-contained: it is serialised
// into the browser with page.evaluate, so it may not use anything from this module's scope.
// Errors: (a) a grid row with a single card ≤ 50 % of the row on a list of ≤ 2 items; (b) a section / wrapper > 40 px tall
// with nothing visible in it; (c) a map / media frame > 100 px tall without a loaded picture; (d) the contact block
// (phone + email + address) more than once in the page body; (e) an image fallback frame without a name; plus every
// visible <img> that did not load.
export function layoutAudit() {
	const shown = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden], dialog:not([open])'); };
	const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
	const loaded = (img) => img.complete && img.naturalWidth > 0;
	const body = document.querySelector('main') || document.body;
	const out = { images: [], grid: [], empty: [], media: [], contact: [], fallback: [] };

	for (const img of body.querySelectorAll('img')) if (shown(img) && !loaded(img)) out.images.push(img.currentSrc || img.src);

	for (const g of body.querySelectorAll('.v-grid, .v-feats ul, .grid, .rail, .feats ul')) {
		const items = [...g.children].filter(shown);
		if (!items.length || items.length > 2 || !shown(g)) continue;
		const gw = g.getBoundingClientRect().width;
		const rows = {};
		items.forEach((c) => { const t = Math.round(c.getBoundingClientRect().top); (rows[t] ||= []).push(c); });
		for (const row of Object.values(rows)) if (row.length === 1 && row[0].getBoundingClientRect().width <= gw * 0.5 + 1) out.grid.push(label(g));
	}

	const content = (el) => (el.innerText || '').trim() || [...el.querySelectorAll('img, iframe, video, svg, canvas, input, select, textarea, button')].some((m) => shown(m) && (m.tagName !== 'IMG' || loaded(m)));
	for (const el of body.querySelectorAll('section, aside, figure, .v-wrap, .v-block, .v-sub, .v-section, .v-page__main, .v-page__side, .wrap, .block, .page__main, .page__side')) {
		if (shown(el) && el.getBoundingClientRect().height > 40 && !content(el)) out.empty.push(label(el));
	}

	for (const el of body.querySelectorAll('.v-map, .v-card__media:not(.v-media--empty:not(.is-broken)), .v-ratio, figure.wp-block-image, figure.wp-block-embed, figure:has(> img), .v-gallery__track li, .v-hero--full:not(.v-hero--noimg), .v-pricecard > img, .map, .card__media:not(.card__media--empty), .gallery__track li, .hero__media:not(.card__media--empty), .pic')) { // a hero rendered without photo is a text band, not a frame
		if (!shown(el) || el.getBoundingClientRect().height <= 100) continue;
		const pics = el.matches('img') ? [el] : [...el.querySelectorAll('img, iframe, video')];
		if (!pics.some((m) => m.tagName !== 'IMG' || loaded(m))) out.media.push(label(el));
	}

	for (const el of body.querySelectorAll('.v-media--empty, .v-hero__fallback, .card__media--empty, .hero__media.card__media--empty')) if (shown(el) && !(el.textContent || '').trim()) out.fallback.push(label(el));

	// smallest elements holding phone + email + address, outside header/footer
	const has = (t) => /0911[\s.]?237[\s.]?979/.test(t) && /lienhe@velisrealty\.vn/i.test(t) && /Lương Định Của/i.test(t);
	const blocks = [...body.querySelectorAll('*')].filter((el) => shown(el) && !el.closest('header, footer, .v-header, .v-footer, .header, .footer') && has(el.innerText || ''));
	const minimal = blocks.filter((el) => !blocks.some((o) => o !== el && el.contains(o)));
	if (minimal.length > 1) out.contact.push(minimal.map(label).join(' + '));
	return out;
}
