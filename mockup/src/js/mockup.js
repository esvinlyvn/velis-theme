/* Mockup behaviour – plain JS, no library. Parts marked [mockup] are review switches, not carried into the theme. */
(() => {
	const q = new URLSearchParams(location.search);
	const $$ = (s, r = document) => [...r.querySelectorAll(s)];

	// [mockup] hero A/B + "ảnh tạm" tags (hidden by default, 1.8), switched in place; state kept in the hash (#hero-a /
	// #hero-b, #tam-1), read on open (the hero and the tags are already set before first paint by inline scripts)
	const ab = $$('.hero:not(.hero--home)').length > 0; // the home hero is always full-bleed (2026-11-06), no A/B switch
	const st = { hero: document.querySelector('.hero--a') ? 'a' : 'b', tam: document.documentElement.dataset.tam || '0' };
	const save = () => history.replaceState(null, '', '#' + [ab ? (st.hero === 'a' ? 'hero-a' : 'hero-b') : '', st.tam === '1' ? 'tam-1' : ''].filter(Boolean).join(','));
	const paint = () => {
		$$('.hero:not(.hero--home)').forEach(h => {
			h.classList.toggle('hero--a', st.hero === 'a'); h.classList.toggle('hero--b', st.hero !== 'a');
			const i = h.querySelector('.hero__media img');
			if (i) { i.dataset.sizesB ??= i.sizes; i.sizes = st.hero === 'a' ? '100vw' : i.dataset.sizesB; }
		});
		document.documentElement.dataset.tam = st.tam;
		$$('[data-mk-hero]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mkHero === st.hero)));
		$$('[data-mk-tam]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mkTam === st.tam)));
	};
	$$('[data-mk-hero]').forEach(b => { b.onclick = () => { st.hero = b.dataset.mkHero; paint(); save(); }; });
	$$('[data-mk-tam]').forEach(b => { b.onclick = () => { st.tam = b.dataset.mkTam; paint(); save(); }; });
	paint();
	// in-page links scroll without touching the hash, so the switch state survives; dead "#" links do nothing
	document.addEventListener('click', e => {
		const a = e.target.closest('a[href^="#"]');
		if (!a) return;
		e.preventDefault();
		const t = a.hash.length > 1 && document.getElementById(a.hash.slice(1));
		if (t) { t.scrollIntoView({ block: 'start' }); if (t.id === 'noi-dung') t.focus({ preventScroll: true }); }
	});

	// mobile menu: native <dialog>
	const menu = document.getElementById('menu');
	if (menu) {
		$$('[data-menu-open]').forEach(b => b.addEventListener('click', () => menu.showModal()));
		$$('[data-menu-close], #menu a').forEach(b => b.addEventListener('click', () => menu.close()));
		if (q.get('trang-thai') === 'menu') menu.showModal();
	}

	// mobile bottom CTA: hidden while the hero buttons are on screen (NT-79)
	const cta = document.querySelector('.cta'), heroBtns = document.querySelector('.hero .actions, .advise__form');
	// scroll check, not IntersectionObserver: a jump past buttons that start below the fold never crosses a threshold
	const ctaSync = () => cta.classList.toggle('is-on', heroBtns.getBoundingClientRect().bottom < 0);
	if (cta && heroBtns) { addEventListener('scroll', ctaSync, { passive: true }); ctaSync(); }

	// section tabs: highlight the section in view
	const tabs = $$('.tabs a[href^="#"]');
	const secs = tabs.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
	if (secs.length) {
		const spy = () => {
			let cur = secs[0];
			for (const s of secs) if (s.getBoundingClientRect().top <= innerHeight * .35) cur = s;
			tabs.forEach(a => a.setAttribute('aria-current', String(a.hash === '#' + cur.id)));
		};
		addEventListener('scroll', spy, { passive: true });
		spy();
	}

	// long blocks: show ~420 px, then "Đọc tiếp"
	$$('.clamp').forEach(el => {
		if (el.scrollHeight <= 520) return;
		el.classList.add('is-clamped');
		const b = document.createElement('button');
		b.type = 'button';
		b.className = 'btn btn--text clamp__more';
		b.textContent = 'Đọc tiếp';
		b.onclick = () => { el.classList.remove('is-clamped'); b.hidden = true; };
		el.after(b);
	});

	// home hero strip (NT-10): arrows only when more cards than fit, disabled at either end; fade on the right while more
	// cards are hidden; no autoplay
	$$('.feats').forEach(box => {
		const ul = box.querySelector('ul'), nav = box.querySelector('.feats__nav'), [prev, next] = nav.querySelectorAll('button');
		const sync = () => {
			nav.hidden = ul.scrollWidth <= ul.clientWidth + 2;
			prev.disabled = ul.scrollLeft <= 2;
			next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 2;
			ul.classList.toggle('has-more', !next.disabled);
		};
		const step = d => ul.scrollBy({ left: d * (ul.firstElementChild.getBoundingClientRect().width + 12), behavior: 'smooth' });
		prev.onclick = () => step(-1);
		next.onclick = () => step(1);
		ul.addEventListener('scroll', sync, { passive: true });
		addEventListener('resize', sync);
		sync();
	});

	// gallery: manual prev/next only (no autoplay)
	$$('.gallery').forEach(g => {
		const track = g.querySelector('.gallery__track'), items = [...track.children], count = g.querySelector('.gallery__count');
		const idx = () => Math.round(track.scrollLeft / (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth));
		const show = () => { count.textContent = `${Math.min(idx(), items.length - 1) + 1}/${items.length}`; };
		const step = d => track.scrollTo({ left: items[Math.max(0, Math.min(items.length - 1, idx() + d))].offsetLeft - items[0].offsetLeft });
		g.querySelector('[data-prev]').onclick = () => step(-1);
		g.querySelector('[data-next]').onclick = () => step(1);
		track.addEventListener('scroll', show, { passive: true });
		show();
	});

	// quick filters (zones by type; home: projects by area / type / developer): OR inside a group, AND across groups;
	// the grid count follows and visible cards come first, so no cell is left empty (X-06)
	$$('[data-filter]').forEach(f => {
		const grids = $$(f.dataset.filter), out = f.querySelector('[data-count]'), noun = f.dataset.noun || 'phân khu';
		const total = grids.reduce((t, g) => t + g.children.length, 0);
		grids.forEach(g => [...g.children].forEach((c, i) => { c.dataset.i = i; }));
		const apply = () => {
			const on = {};
			$$('button[aria-pressed="true"]', f).forEach(b => (on[b.dataset.key || 'loai'] ??= []).push(b.value));
			let all = 0;
			grids.forEach(g => {
				const cards = [...g.children].sort((a, b) => a.dataset.i - b.dataset.i);
				cards.forEach(c => { c.hidden = !Object.entries(on).every(([k, vals]) => vals.some(v => (c.dataset[k] || '').split(' ').includes(v))); });
				[...cards.filter(c => !c.hidden), ...cards.filter(c => c.hidden)].forEach(c => g.append(c));
				const n = cards.filter(c => !c.hidden).length;
				g.dataset.n = n;
				if (g.parentNode.matches('[data-group]')) g.parentNode.hidden = !n;
				all += n;
			});
			out.textContent = `Hiển thị ${all}/${total} ${noun}`;
		};
		// data-single (home area tabs): one value at a time, "Tất cả" pressed when none is
		const clear = f.querySelector('[data-clear]'), single = f.hasAttribute('data-single');
		const sync = () => { if (single) clear.setAttribute('aria-pressed', String(!$$('button[value][aria-pressed="true"]', f).length)); };
		$$('button[value]', f).forEach(b => { b.onclick = () => { const on = b.getAttribute('aria-pressed') !== 'true'; if (single) $$('button[value]', f).forEach(o => o.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', String(on)); sync(); apply(); }; });
		clear.onclick = () => { $$('button[value]', f).forEach(b => b.setAttribute('aria-pressed', 'false')); sync(); apply(); };
	});

	// consultation form: inline errors (the mockup sends nothing)
	const rules = {
		name: v => v.trim().length >= 2 || 'Vui lòng nhập họ và tên.',
		phone: v => /^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.]/g, '')) || 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).',
		consent: (v, el) => el.checked || 'Vui lòng đồng ý để Velis liên hệ tư vấn.',
	};
	const check = form => {
		let first = null;
		$$('[data-rule]', form).forEach(el => {
			const box = el.closest('.field, .check'), msg = box.querySelector('.field__error');
			const r = rules[el.dataset.rule](el.value, el), bad = r !== true;
			box.classList.toggle('is-error', bad);
			el.setAttribute('aria-invalid', String(bad));
			msg.textContent = bad ? r : '';
			msg.hidden = !bad;
			if (bad && !first) first = el;
		});
		return first;
	};
	$$('form.form').forEach(form => form.addEventListener('submit', e => {
		e.preventDefault();
		const bad = check(form);
		if (bad) { bad.focus(); return; }
		// same hidden fields as the live CF7 form (interest, page-url, utm); the mockup sends nothing, it only shows them
		form.elements['page-url'].value = location.href.split('#')[0];
		form.elements.utm.value = [...q].filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&');
		const sent = Object.fromEntries(['interest', 'page-url', 'utm'].map(k => [k, form.elements[k].value]));
		form.dataset.sent = JSON.stringify(sent);
		form.querySelector('[role="status"]').textContent = `Mockup: hợp lệ, không gửi đi đâu – dự án: ${sent.interest || '(chưa chọn)'}, trang: ${sent['page-url']}, utm: ${sent.utm || '(không có)'}.`;
	}));
	if (q.get('trang-thai') === 'loi-form') {
		const f = document.querySelector('#tu-van form.form');
		f.querySelector('[data-rule="phone"]').value = '0911 23';
		check(f);
	}
})();
