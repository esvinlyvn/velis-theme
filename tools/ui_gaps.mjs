// Round 5 criterion (tools/check_ui.mjs): from 1024 px no horizontal empty area beside content wider than 30 % of the container for longer
// than one screen. bands[i] = content intervals [x1, x2] of the i-th horizontal strip (step px tall). Returns the runs.
export function gapRuns(bands, left, right, step, screen, limit = 0.3) {
	const width = right - left;
	const runs = [];
	let start = -1, worst = 0;
	const flush = (i) => { if (start >= 0 && (i - start) * step > screen) runs.push({ from: start * step, to: i * step, pct: Math.round(worst * 100) }); start = -1; worst = 0; };
	bands.forEach((iv, i) => {
		if (!iv.length) return flush(i); // vertical spacing between blocks is not a gap beside content
		const xs = iv.map(([a, b]) => [Math.max(a, left), Math.min(b, right)]).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
		let gap = 0, x = left;
		for (const [a, b] of xs) { gap = Math.max(gap, a - x); x = Math.max(x, b); }
		gap = Math.max(gap, right - x) / width;
		if (xs.length && gap > limit) { if (start < 0) start = i; worst = Math.max(worst, gap); } else flush(i);
	});
	flush(bands.length);
	return runs;
}


// In the page: content boxes per 40 px strip (text, media, controls, boxes with a background or border); a sticky box
// covers its whole parent (it travels with the reader).
export function contentBands() {
	const step = 40, H = document.documentElement.scrollHeight, bands = Array.from({ length: Math.ceil(H / step) }, () => []);
	const bodyBg = getComputedStyle(document.body).backgroundColor;
	for (const el of document.querySelectorAll('body *')) {
		const s = getComputedStyle(el);
		if (s.display === 'none' || s.visibility === 'hidden' || el.closest('dialog:not([open]), .v-sr, [hidden]')) continue;
		const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
		const media = el.matches('img, video, iframe, svg, canvas, input, select, textarea, button');
		const box = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== bodyBg) || s.backgroundImage !== 'none' || parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0;
		if (!text && !media && !box && s.position !== 'sticky') continue;
		let r = el.getBoundingClientRect();
		if (!r.width || !r.height) continue;
		let top = r.top + scrollY, bottom = r.bottom + scrollY;
		if (s.position === 'sticky' && el.parentElement) { const pr = el.parentElement.getBoundingClientRect(); top = pr.top + scrollY; bottom = pr.bottom + scrollY; }
		if (s.position === 'fixed') continue;
		for (let i = Math.max(0, Math.floor(top / step)); i < Math.min(bands.length, Math.ceil(bottom / step)); i++) bands[i].push([r.left, r.right]);
	}
	const wrap = Math.min(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v-wide')) || 1200, innerWidth - 2 * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v-gutter') || 24));
	const left = (document.documentElement.clientWidth - wrap) / 2;
	return { bands, left, right: left + wrap, step };
}
