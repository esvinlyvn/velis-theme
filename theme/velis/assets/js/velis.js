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

const wide = () => matchMedia('(min-width: 1024px)').matches;

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
	const want = () => {
		const w = {};
		new FormData(form).forEach((v, k) => v !== '' && (w[k] ||= []).push(v));
		return w;
	};
	const applyBtn = form.querySelector('[data-apply]');
	const preview = () => { // live "Xem N kết quả" in the mobile sheet
		if (applyBtn) applyBtn.textContent = `Xem ${items.filter((el) => matches(el, want())).length} kết quả`;
	};
	const apply = () => {
		const w = want();
		let shown = 0;
		items.forEach((el) => { el.hidden = !matches(el, w); shown += !el.hidden; });
		$$('[data-group]', box).forEach((g) => (g.hidden = !$$('.v-zone:not([hidden])', g).length));
		box.querySelector('[data-empty]').hidden = shown > 0;
		box.querySelector('[data-count]').textContent = `Hiển thị ${shown}/${items.length} phân khu`;
		const url = new URL(location.href);
		fields.forEach((f) => url.searchParams.delete(f.name));
		Object.entries(w).forEach(([k, v]) => url.searchParams.set(k, v.join(',')));
		history.replaceState(null, '', url);
		preview();
	};
	const sort = () => {
		const key = sortSel.value; // missing values sort last
		$$('.v-grid', box).forEach((grid) => $$('.v-zone', grid)
			.sort((a, b) => (a.dataset[key] === '' ? Infinity : +a.dataset[key]) - (b.dataset[key] === '' ? Infinity : +b.dataset[key]) || a.dataset.n - b.dataset.n)
			.forEach((el) => grid.append(el)));
	};
	const dialog = box.querySelector('dialog');
	const live = () => wide() || !dialog; // chip row applies at once; the mobile sheet waits for "Xem N kết quả"
	form.addEventListener('change', () => (live() ? apply() : preview()));
	form.addEventListener('submit', (e) => { if (!dialog) e.preventDefault(); apply(); });
	form.addEventListener('reset', () => setTimeout(live() ? apply : preview));
	sortSel?.addEventListener('change', sort);
	box.querySelector('[data-reset]').addEventListener('click', () => { form.reset(); setTimeout(apply); });
	if (dialog) {
		box.querySelector('[data-open]').addEventListener('click', () => dialog.showModal());
		dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
		dialog.addEventListener('click', (e) => e.target === dialog && dialog.close()); // tap on the backdrop
	}
	$$('[data-view]', box).forEach((b) => b.addEventListener('click', () => {
		$$('[data-view]', box).forEach((x) => x.setAttribute('aria-pressed', x === b));
		$$('[data-panel]', box).forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.view));
	}));
	apply();
});

// Header dropdowns (<details data-dd>): one open at a time; close on outside click or Esc.
const dds = $$('[data-dd]');
dds.forEach((d) => d.addEventListener('toggle', () => d.open && dds.forEach((o) => o !== d && (o.open = false))));
document.addEventListener('click', (e) => dds.forEach((d) => !d.contains(e.target) && (d.open = false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && dds.forEach((d) => d.open && ((d.open = false), d.querySelector('summary').focus())));

// Mobile menu (<dialog>).
const menu = document.getElementById('v-menu');
document.querySelector('[data-menu-open]')?.addEventListener('click', () => menu.showModal());
$$('[data-menu-close]').forEach((a) => a.addEventListener('click', () => menu.close()));

// Project listing filter: Khu vực (Vùng → Tiểu khu tree), Chủ đầu tư, Loại sản phẩm. Within a group any checked value
// matches; across groups all must match. Desktop: dropdowns apply at once; mobile: sheet with "Xem N kết quả".
$$('[data-plist]').forEach((box) => {
	const form = box.querySelector('[data-pfilter]');
	const dialog = box.querySelector('dialog');
	const boxes = $$('input[type=checkbox]', form);
	const drops = $$('[data-fdrop]', form);
	const cards = $$('[data-card]', box);
	const applyBtn = form.querySelector('[data-apply]');
	const want = () => {
		const w = {};
		boxes.filter((c) => c.checked).forEach((c) => (w[c.name] ||= []).push(c.value));
		return w;
	};
	const ok = (card, w) => Object.entries(w).every(([k, vals]) => vals.some((v) => (card.dataset[k] || '').split(' ').includes(v)));
	const label = () => drops.forEach((d) => { // "(n)" = chosen items; a parent with children counts through its children
		const n = $$('input:checked', d).filter((i) => !(i.hasAttribute('data-parent') && $$(`[data-child="${i.value}"]`, d).length)).length;
		d.querySelector('[data-n]').textContent = n ? `(${n})` : '';
	});
	const preview = () => { applyBtn.textContent = `Xem ${cards.filter((c) => ok(c, want())).length} kết quả`; label(); };
	const apply = () => {
		const w = want();
		let shown = 0;
		cards.forEach((c) => { c.hidden = !ok(c, w); shown += !c.hidden; });
		box.querySelector('[data-plist-count]').textContent = `Hiển thị ${shown}/${cards.length} dự án`;
		box.querySelector('[data-plist-empty]').hidden = shown > 0;
		preview();
	};
	form.addEventListener('change', (e) => {
		const t = e.target;
		if (t.hasAttribute('data-parent')) boxes.filter((c) => c.dataset.child === t.value).forEach((c) => (c.checked = t.checked));
		else if (t.dataset.child) {
			const parent = boxes.find((p) => p.value === t.dataset.child && p.hasAttribute('data-parent'));
			const kids = boxes.filter((c) => c.dataset.child === t.dataset.child);
			parent.checked = kids.every((c) => c.checked);
			parent.indeterminate = !parent.checked && kids.some((c) => c.checked);
		}
		wide() ? apply() : preview();
	});
	form.addEventListener('submit', apply);
	form.addEventListener('reset', () => setTimeout(() => { boxes.forEach((b) => (b.indeterminate = false)); wide() ? apply() : preview(); }));
	box.querySelector('[data-plist-reset]').addEventListener('click', () => form.reset());
	box.querySelector('[data-open]').addEventListener('click', () => { drops.forEach((d) => (d.open = true)); dialog.showModal(); });
	dialog.addEventListener('close', () => drops.forEach((d) => (d.open = false)));
	dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
	dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
	document.addEventListener('click', (e) => wide() && drops.forEach((d) => !d.contains(e.target) && (d.open = false)));
	drops.forEach((d) => d.addEventListener('toggle', () => wide() && d.open && drops.forEach((o) => o !== d && (o.open = false))));
});

// Table of contents: highlight the section being read.
$$('[data-toc]').forEach((toc) => {
	const links = $$('a[href^="#"]', toc);
	const targets = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
	const seen = new Set();
	const mark = () => {
		const cur = [...seen].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
		links.forEach((a) => (cur && a.hash === '#' + cur.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
	};
	const obs = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); mark(); }, { rootMargin: '-15% 0px -55% 0px' });
	targets.forEach((t) => obs.observe(t));
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
