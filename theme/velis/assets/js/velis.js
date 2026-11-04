/* Velis – progressive enhancements only. Everything is readable without this file. */
document.documentElement.classList.add('js');
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Header shrinks after scrolling.
const header = document.querySelector('.v-header');
if (header) addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });

// Reveal blocks once.
const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => {
	if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -10% 0px' });
$$('.v-reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

// Tabs (ARIA tablist); #panel-id in the URL selects that tab.
$$('[data-tabs]').forEach((box) => {
	const list = box.querySelector('[role=tablist]');
	const tabs = $$('[role=tab]', list);
	const panel = (t) => document.getElementById(t.getAttribute('aria-controls'));
	const select = (tab, focus) => tabs.forEach((t) => {
		const on = t === tab;
		t.setAttribute('aria-selected', on);
		t.tabIndex = on ? 0 : -1;
		panel(t).hidden = !on;
		if (on && focus) t.focus();
	});
	tabs.forEach((t, i) => {
		t.id ||= 'tab-' + t.getAttribute('aria-controls');
		panel(t).setAttribute('aria-labelledby', t.id);
		t.addEventListener('click', () => select(t));
		t.addEventListener('keydown', (e) => {
			const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
			if (d) select(tabs[(i + d + tabs.length) % tabs.length], true);
		});
	});
	list.hidden = false;
	box.classList.add('is-ready');
	select(tabs.find((t) => '#' + t.getAttribute('aria-controls') === location.hash) || tabs[0]);
});

// Listing filter. Items carry data-loai (space list), data-pn, data-gia (tỷ), data-dt (m²), data-tt, data-bg (year).
// An empty data value never matches an active filter. State is kept in the URL (?loai=a,b&gia=5-10) for sharing.
const inRange = (v, range) => {
	if (v === '') return false;
	const [lo, hi] = range.split('-').map(Number);
	return +v >= lo && +v <= hi;
};
const matches = (el, want) => Object.entries(want).every(([k, vals]) => {
	const v = el.dataset[k] ?? '';
	if (k === 'loai' || k === 'tt') return vals.some((x) => v.split(' ').includes(x));
	if (k === 'pn') return v !== '' && (vals[0] === '4' ? +v >= 4 : v === vals[0]);
	return inRange(v, vals[0]);
});
$$('[data-listing]').forEach((box) => {
	const form = box.querySelector('[data-filter]');
	const items = $$('.v-zone', box);
	const sortSel = box.querySelector('[data-sort]');
	const fields = $$('input, select', form);
	const params = new URLSearchParams(location.search);
	fields.forEach((f) => {
		const vals = (params.get(f.name) || '').split(',');
		if (f.type === 'checkbox') f.checked = vals.includes(f.value);
		else if (params.has(f.name)) f.value = vals[0];
	});
	const apply = () => {
		const want = {};
		new FormData(form).forEach((v, k) => v !== '' && (want[k] ||= []).push(v));
		let shown = 0;
		items.forEach((el) => { el.hidden = !matches(el, want); shown += !el.hidden; });
		$$('[data-group]', box).forEach((g) => (g.hidden = !$$('.v-zone:not([hidden])', g).length));
		box.querySelector('[data-empty]').hidden = shown > 0;
		box.querySelector('[data-count]').textContent = `Hiển thị ${shown}/${items.length} phân khu`;
		const url = new URL(location.href);
		fields.forEach((f) => url.searchParams.delete(f.name));
		Object.entries(want).forEach(([k, v]) => url.searchParams.set(k, v.join(',')));
		history.replaceState(null, '', url);
	};
	const sort = () => {
		const key = sortSel.value; // missing values sort last
		$$('.v-grid', box).forEach((grid) => $$('.v-zone', grid)
			.sort((a, b) => (a.dataset[key] === '' ? Infinity : +a.dataset[key]) - (b.dataset[key] === '' ? Infinity : +b.dataset[key]) || a.dataset.n - b.dataset.n)
			.forEach((el) => grid.append(el)));
	};
	form.addEventListener('change', () => matchMedia('(min-width: 1024px)').matches && apply());
	form.addEventListener('submit', apply);
	form.addEventListener('reset', () => setTimeout(apply));
	sortSel.addEventListener('change', sort);
	box.querySelector('[data-reset]').addEventListener('click', () => form.reset());
	box.querySelector('[data-open]').addEventListener('click', () => box.querySelector('dialog').showModal());
	$$('[data-view]', box).forEach((b) => b.addEventListener('click', () => {
		$$('[data-view]', box).forEach((x) => x.setAttribute('aria-pressed', x === b));
		$$('[data-panel]', box).forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.view));
	}));
	apply();
});

// Gallery: arrows + "n/total" counter; swipe is native scroll-snap.
$$('[data-gallery]').forEach((g) => {
	const track = g.querySelector('ul');
	const slides = $$('li', track);
	const counter = g.querySelector('[data-counter]');
	if (slides.length < 2) return g.querySelector('.v-gallery__nav').remove(); // nothing to page through
	const current = () => Math.round(track.scrollLeft / (slides[1].offsetLeft - slides[0].offsetLeft));
	const go = (d) => slides[Math.max(0, Math.min(slides.length - 1, current() + d))].scrollIntoView({ block: 'nearest', inline: 'start' });
	track.addEventListener('scroll', () => (counter.textContent = `${current() + 1}/${slides.length}`), { passive: true });
	g.querySelector('[data-prev]').addEventListener('click', () => go(-1));
	g.querySelector('[data-next]').addEventListener('click', () => go(1));
});

// Lightbox: any [data-zoom] button opens the shared <dialog>.
const lightbox = document.querySelector('.v-lightbox');
if (lightbox) {
	document.addEventListener('click', (e) => {
		const b = e.target.closest('[data-zoom]');
		if (!b) return;
		const img = lightbox.querySelector('img');
		img.src = b.dataset.zoom;
		img.alt = b.querySelector('img')?.alt || '';
		lightbox.showModal();
	});
	lightbox.addEventListener('click', (e) => e.target === lightbox && lightbox.close());
}

// Form: inline validation; "Nhận bảng giá …" pre-fills the project/subzone field (still editable).
$$('[data-interest]').forEach((a) => a.addEventListener('click', () => {
	const f = document.querySelector('[name=interest]');
	if (f) f.value = a.dataset.interest;
}));
$$('[data-form]').forEach((form) => form.addEventListener('submit', (e) => {
	e.preventDefault();
	let ok = true;
	$$('input[required]', form).forEach((i) => {
		const bad = !i.checkValidity();
		const err = document.getElementById(i.getAttribute('aria-describedby'));
		i.setAttribute('aria-invalid', bad);
		i.closest('.v-field')?.classList.toggle('is-invalid', bad);
		if (err) err.hidden = !bad;
		if (bad && ok) { i.focus(); ok = false; }
	});
	form.querySelector('.v-form__ok').hidden = !ok;
}));
