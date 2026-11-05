/* Mockup behaviour – plain JS, no library. Parts marked [mockup] are review switches, not carried into the theme. */
(() => {
	const q = new URLSearchParams(location.search);
	const $$ = (s, r = document) => [...r.querySelectorAll(s)];

	// [mockup] hero A/B + "ảnh tạm" tags, switched in place; state kept in the hash (#hero-a / #hero-b, #tam-0), read on
	// open (the hero and the tags are already set before first paint by inline scripts)
	const st = { hero: document.querySelector('.hero--a') ? 'a' : 'b', tam: document.documentElement.dataset.tam || '1' };
	const save = () => history.replaceState(null, '', '#' + [st.hero === 'a' ? 'hero-a' : 'hero-b', st.tam === '0' ? 'tam-0' : ''].filter(Boolean).join(','));
	const paint = () => {
		$$('.hero').forEach(h => {
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

	// featured strip: ≤ 4 in the frame, arrows / swipe for the rest, never automatic (NT-10)
	$$('.feats').forEach(f => {
		const rail = f.querySelector('.rail'), prev = f.querySelector('[data-prev]'), next = f.querySelector('[data-next]');
		const step = () => rail.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0);
		const sync = () => { prev.disabled = rail.scrollLeft < 2; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2; };
		prev.onclick = () => rail.scrollBy({ left: -step() });
		next.onclick = () => rail.scrollBy({ left: step() });
		rail.addEventListener('scroll', sync, { passive: true });
		addEventListener('resize', sync);
		sync();
	});

	// mobile menu: native <dialog>
	const menu = document.getElementById('menu');
	if (menu) {
		$$('[data-menu-open]').forEach(b => b.addEventListener('click', () => menu.showModal()));
		$$('[data-menu-close], #menu a').forEach(b => b.addEventListener('click', () => menu.close()));
		if (q.get('trang-thai') === 'menu') menu.showModal();
	}

	// mobile bottom CTA: hidden while the hero buttons are on screen (NT-79)
	const cta = document.querySelector('.cta'), heroBtns = document.querySelector('.hero .actions');
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

	// zone filter by product type; the grid count follows so no cell is left empty (X-06)
	$$('[data-filter]').forEach(f => {
		const grids = $$(f.dataset.filter), out = f.querySelector('[data-count]');
		const total = grids.reduce((t, g) => t + g.children.length, 0);
		const apply = () => {
			const on = $$('button[aria-pressed="true"]', f).map(b => b.value);
			let all = 0;
			grids.forEach(g => {
				let n = 0;
				[...g.children].forEach(c => { const hit = !on.length || on.some(v => c.dataset.loai.split(' ').includes(v)); c.hidden = !hit; n += hit; });
				g.dataset.n = n;
				g.parentNode.hidden = !n;
				all += n;
			});
			out.textContent = `Hiển thị ${all}/${total} phân khu`;
		};
		$$('button[value]', f).forEach(b => { b.onclick = () => { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); apply(); }; });
		f.querySelector('[data-clear]').onclick = () => { $$('button[value]', f).forEach(b => b.setAttribute('aria-pressed', 'false')); apply(); };
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
		if (bad) bad.focus();
		else form.querySelector('[role="status"]').textContent = 'Mockup: biểu mẫu hợp lệ, không gửi đi đâu.';
	}));
	if (q.get('trang-thai') === 'loi-form') {
		const f = document.querySelector('form.form');
		f.querySelector('[data-rule="phone"]').value = '0911 23';
		check(f);
	}
})();
