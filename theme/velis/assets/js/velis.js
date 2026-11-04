/* Velis – progressive enhancements only. Everything works (and is readable) without this file. */
document.documentElement.classList.add('js');

// Header shrinks after scrolling.
const header = document.querySelector('.v-header');
if (header) addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });

// Reveal blocks once.
const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => {
	if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.v-reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

// Tabs (ARIA tablist); hash #panel-id selects that tab.
document.querySelectorAll('[data-tabs]').forEach((box) => {
	const list = box.querySelector('[role=tablist]');
	const tabs = [...list.querySelectorAll('[role=tab]')];
	const select = (tab, focus) => tabs.forEach((t) => {
		const on = t === tab;
		t.setAttribute('aria-selected', on);
		t.tabIndex = on ? 0 : -1;
		document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
		if (on && focus) t.focus();
	});
	tabs.forEach((t, i) => {
		t.id ||= 'tab-' + t.getAttribute('aria-controls');
		document.getElementById(t.getAttribute('aria-controls')).setAttribute('aria-labelledby', t.id);
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

// Listing: view switch + filters kept in the URL (?loai=a,b) for sharing.
document.querySelectorAll('[data-listing]').forEach((box) => {
	const params = new URLSearchParams(location.search);
	const form = box.querySelector('[data-filter]');
	const dialog = box.querySelector('dialog');
	const items = [...box.querySelectorAll('.v-zone')];
	const apply = () => {
		const want = {};
		new FormData(form).forEach((v, k) => (want[k] ||= []).push(v));
		let shown = 0;
		items.forEach((el) => {
			const ok = Object.entries(want).every(([k, vals]) => vals.some((v) => (el.dataset[k.replace(/-(\w)/g, (_, c) => c.toUpperCase())] || '').split(' ').includes(v)));
			el.hidden = !ok;
			shown += ok;
		});
		box.querySelector('[data-empty]').hidden = shown > 0;
		const url = new URL(location.href);
		form.querySelectorAll('fieldset input').forEach((i) => url.searchParams.delete(i.name));
		Object.entries(want).forEach(([k, v]) => url.searchParams.set(k, v.join(',')));
		history.replaceState(null, '', url);
	};
	form.querySelectorAll('input').forEach((i) => (i.checked = (params.get(i.name) || '').split(',').includes(i.value)));
	form.addEventListener('submit', apply);
	form.addEventListener('reset', () => setTimeout(apply));
	box.querySelector('[data-reset]').addEventListener('click', () => form.reset());
	box.querySelector('[data-open]').addEventListener('click', () => dialog.showModal());
	box.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
		box.querySelectorAll('[data-view]').forEach((x) => x.setAttribute('aria-pressed', x === b));
		box.querySelectorAll('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.view));
	}));
	apply();
});

// Lightbox with <dialog>; swipe = native scroll-snap in the strip.
document.querySelectorAll('[data-gallery]').forEach((g) => {
	const dlg = g.nextElementSibling;
	g.addEventListener('click', (e) => {
		const a = e.target.closest('a');
		if (!a) return;
		e.preventDefault();
		const img = dlg.querySelector('img');
		img.src = a.href;
		img.alt = a.querySelector('img').alt;
		dlg.showModal();
	});
	dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
});

// Map loads only on demand.
document.querySelectorAll('[data-map]').forEach((m) => m.querySelector('button').addEventListener('click', () => {
	m.innerHTML = `<iframe src="${m.dataset.map}" title="Bản đồ" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}, { once: true }));

// Form: inline validation; "Nhận bảng giá {dòng}" pre-fills interest.
document.querySelectorAll('[data-interest]').forEach((a) => a.addEventListener('click', () => {
	const f = document.querySelector('[name=interest]');
	if (f) f.value = a.dataset.interest;
}));
document.querySelectorAll('[data-form]').forEach((form) => form.addEventListener('submit', (e) => {
	e.preventDefault();
	let ok = true;
	form.querySelectorAll('input[required]').forEach((i) => {
		const bad = !i.checkValidity();
		const err = i.getAttribute('aria-describedby') && document.getElementById(i.getAttribute('aria-describedby'));
		i.setAttribute('aria-invalid', bad);
		i.closest('.v-field')?.classList.toggle('is-invalid', bad);
		if (err) err.hidden = !bad;
		if (bad && ok) { i.focus(); ok = false; }
	});
	form.querySelector('.v-form__ok').hidden = !ok;
}));
