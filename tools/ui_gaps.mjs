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

