/* Velis – progressive enhancements only. Everything is readable without this file. */
document.documentElement.classList.add('js');
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Header shrinks after scrolling.
const header = document.querySelector('.v-header');
// Header: hides while scrolling down, returns on the way up (border once scrolled). The sticky section nav follows it:
// --v-stick is the header's visible height (0 when hidden), so the nav is never separated from it by a gap.
if (header) {
	const bar = header.closest('.wp-block-template-part') || header; // the sticky element (see style.css)
	let lastY = scrollY;
	const root = document.documentElement;
	const secnav = document.querySelector('[data-secnav]');
	const sync = () => {
		const y = scrollY;
		header.classList.toggle('is-scrolled', y > 8);
		if (y > lastY + 4 && y > header.offsetHeight * 2) bar.classList.add('is-hidden');
		else if (y < lastY - 4 || y < header.offsetHeight) bar.classList.remove('is-hidden');
		if (Math.abs(y - lastY) > 4) lastY = y;
		root.style.setProperty('--v-stick', bar.classList.contains('is-hidden') ? '0px' : header.offsetHeight + 'px');
		if (secnav) secnav.classList.toggle('is-stuck', secnav.getBoundingClientRect().top <= header.offsetHeight + 1);
	};
	addEventListener('scroll', sync, { passive: true });
	addEventListener('resize', sync);
	header.addEventListener('focusin', () => bar.classList.remove('is-hidden')); // keyboard users always see where focus is
	sync();
}

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

// Broken image (e.g. a corrupt original): try the other size in data-alt once, then show the neutral frame with the name.
const broken = (img) => {
	if (img.dataset.alt && !img.dataset.tried) {
		img.dataset.tried = '1';
		img.removeAttribute('srcset');
		if (img.dataset.altW) img.style.setProperty('--nw', img.dataset.altW + 'px'); // keep the frame within the fallback file
		img.src = img.dataset.alt;
		return;
	}
	const box = img.closest('[data-name]');
	const hero = img.closest('.v-hero--full');
	const li = img.closest('.v-gallery__track > li');
	if (li) return li.remove();
	if (hero) {
		hero.classList.add('is-empty');
		img.outerHTML = `<span class="v-hero__fallback" aria-hidden="true">${hero.dataset.name || ''}</span>`;
	} else if (box) {
		box.classList.add('v-media--empty', 'is-broken');
		box.innerHTML = '<span></span>';
		box.firstChild.textContent = box.dataset.name;
	}
};
$$('img[data-alt]').forEach((img) => {
	img.addEventListener('error', () => broken(img));
	if (img.complete && img.naturalWidth === 0 && img.currentSrc) broken(img); // failed before this script ran (a lazy image not fetched yet has no currentSrc)
});

// Mega menu / submenus: also open on mouse hover; close 200 ms after the pointer leaves. Click and keyboard keep working.
$$('[data-hover]').forEach((d) => {
	let t;
	let hovered = 0;
	d.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && wide()) { clearTimeout(t); if (!d.open) hovered = Date.now(); d.open = true; } });
	// a click right after hover-opening must not close it again
	d.querySelector('summary').addEventListener('click', (e) => { if (Date.now() - hovered < 800) { e.preventDefault(); hovered = 0; } });
	d.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && wide()) t = setTimeout(() => (d.open = false), 200); });
});

// Section nav (project pages): highlight the last section whose top has passed 35 % of the viewport.
document.querySelectorAll('[data-secnav]').forEach((nav) => {
	const links = [...nav.querySelectorAll('a[href^="#"]')];
	const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
	const mark = () => {
		let cur = -1;
		targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= innerHeight * 0.35) cur = i; });
		links.forEach((a, i) => {
			if (i === cur && !a.hasAttribute('aria-current')) a.closest('ul').scrollTo({ left: a.offsetLeft - 16 }); // only the strip, never the page
			i === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
		});
	};
	addEventListener('scroll', mark, { passive: true });
	mark();
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
	if (!form) return; // fewer than 2 values in every group: no filter bar
	const dialog = box.querySelector('dialog');
	const boxes = $$('input[type=checkbox]', form);
	const drops = $$('[data-fdrop]', form);
	const views = $$('[data-view]', box);
	const current = () => views.find((v) => !v.hidden) || box;
	let cards = $$('[data-card]', current());
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
		box.querySelector('[data-plist-count]').textContent = `Hiển thị ${shown}/${cards.length} ${current().dataset.noun || 'dự án'}`;
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
	// "Theo dự án" / "Theo phân khu & sản phẩm": same filters, other cards
	$$('[data-view-btn]', box).forEach((b) => b.addEventListener('click', () => {
		views.forEach((v) => (v.hidden = v.dataset.view !== b.dataset.viewBtn));
		$$('[data-view-btn]', box).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
		cards = $$('[data-card]', current());
		apply();
	}));
	box.querySelector('[data-open]').addEventListener('click', () => { drops.forEach((d) => (d.open = true)); dialog.showModal(); });
	dialog.addEventListener('close', () => drops.forEach((d) => (d.open = false)));
	dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
	dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
	document.addEventListener('click', (e) => wide() && drops.forEach((d) => !d.contains(e.target) && (d.open = false)));
	drops.forEach((d) => d.addEventListener('toggle', () => wide() && d.open && drops.forEach((o) => o !== d && (o.open = false))));
});

// Table of contents: highlight the section being read.
$$('[data-toc]').forEach((toc) => {
	if (matchMedia('(min-width: 1280px)').matches) toc.open = true; // side column on desktop; collapsed on mobile
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

// Tab row and section nav: a fade on the right edge while more items are hidden to the right.
document.querySelectorAll('.v-tabs__list, .v-secnav ul, .v-feats ul').forEach((l) => {
	const fade = () => l.classList.toggle('has-more', l.scrollLeft + l.clientWidth < l.scrollWidth - 4);
	l.addEventListener('scroll', fade, { passive: true });
	addEventListener('resize', fade);
	requestAnimationFrame(fade);
});

// Chip filter over a card grid ([data-chipbox]): any checked value per group, all groups must match.
$$('[data-chipbox]').forEach((box) => {
	const forms = $$('[data-chipfilter]', box);
	const cards = $$('[data-card]', box);
	const empty = box.querySelector('[data-chip-empty]');
	const apply = () => {
		const w = {};
		forms.forEach((f) => new FormData(f).forEach((v, k) => (w[k] ||= []).push(v)));
		let shown = 0;
		cards.forEach((c) => { c.hidden = !Object.entries(w).every(([k, vals]) => vals.some((v) => (c.dataset[k] || '').split(' ').includes(v))); shown += !c.hidden; });
		if (empty) empty.hidden = shown > 0;
	};
	forms.forEach((f) => { f.addEventListener('change', apply); f.addEventListener('reset', () => setTimeout(apply)); f.addEventListener('submit', (e) => e.preventDefault()); });
});

// Form: inline validation; "Nhận bảng giá …" pre-fills the project/subzone field (still editable).
$$('[data-interest]').forEach((a) => a.addEventListener('click', () => {
	const f = document.querySelector('#tu-van [name=interest]');
	if (f) f.value = a.dataset.interest;
}));
// Side card "Nhận bảng giá": opens the short form in place (the link to #tu-van stays the no-JS path).
$$('[data-open-form]').forEach((a) => a.addEventListener('click', (e) => {
	const box = a.nextElementSibling;
	if (!box?.matches('.v-pricecard__form')) return;
	e.preventDefault();
	box.hidden = !box.hidden;
	a.setAttribute('aria-expanded', String(!box.hidden));
	if (!box.hidden) box.querySelector('input')?.focus();
}));
// utm_* of the landing URL, kept for the visit; sent with the lead.
const utm = (() => {
	const q = [...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&');
	try { if (q) sessionStorage.setItem('velis-utm', q); return q || sessionStorage.getItem('velis-utm') || ''; } catch { return q; }
})();
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
	if (!ok) return;
	const done = (sent) => {
		form.querySelector('.v-form__ok').hidden = !sent;
		const fail = form.querySelector('.v-form__fail');
		if (fail) fail.hidden = sent;
		if (!sent) return;
		const detail = { form_id: 'tu-van', interest: form.elements.interest?.value || '' };
		(window.dataLayer ||= []).push({ event: 'generate_lead', ...detail }); // GA4 conversion (GTM or gtag)
		window.gtag?.('event', 'generate_lead', detail);
		form.querySelector('[type=submit]').disabled = true;
	};
	if (!form.dataset.cf7) return done(true); // no receiver configured (style guide demo)
	if (form.elements['page-url']) form.elements['page-url'].value = location.href.split('#')[0];
	if (form.elements.utm) form.elements.utm.value = utm;
	const data = new FormData(form);
	data.set('_wpcf7', form.dataset.cf7);
	data.set('_wpcf7_unit_tag', `wpcf7-f${form.dataset.cf7}-velis`);
	data.set('_wpcf7_locale', 'vi');
	fetch(form.action, { method: 'POST', body: data }).then((r) => r.json()).then((r) => done(r.status === 'mail_sent')).catch(() => done(false));
}));

// YouTube click-to-load: swap the thumbnail link for the player (privacy-enhanced domain).
document.addEventListener('click', (e) => {
	const a = e.target.closest('[data-yt]');
	if (!a || e.ctrlKey || e.metaKey) return;
	e.preventDefault();
	const f = document.createElement('iframe');
	f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1`;
	f.title = 'Video YouTube';
	f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
	f.allowFullscreen = true;
	a.replaceWith(f);
});

// Long text from the old pillar posts (every project section): shown in part, "Đọc tiếp" opens the rest (all text stays in the page).
$$('.v-long').forEach((prose) => {
	if (prose.scrollHeight < (prose.matches('.v-long--short') ? 420 : 640) + 160) return; // short enough: nothing to fold
	prose.classList.add('is-clamped');
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'v-btn v-btn--secondary v-more';
	btn.textContent = 'Đọc tiếp';
	btn.setAttribute('aria-expanded', 'false');
	btn.addEventListener('click', () => {
		const open = !prose.classList.toggle('is-clamped');
		btn.textContent = open ? 'Thu gọn' : 'Đọc tiếp';
		btn.setAttribute('aria-expanded', String(open));
		if (!open) prose.scrollIntoView({ block: 'start' });
	});
	prose.after(btn);
});

// Mobile CTA bar: hidden while the hero's own buttons are on screen (and at the top of the page), shown once they scroll away.
(() => {
	const bar = document.querySelector('.v-sticky-cta');
	if (!bar) return;
	const btns = document.querySelector('.v-hero .v-row, .v-pagehead .v-row, .v-pagehead .v-channels');
	let seen = !!btns;
	const set = () => bar.classList.toggle('is-on', !seen && scrollY > 120);
	if (btns) new IntersectionObserver(([e]) => { seen = e.isIntersecting || e.boundingClientRect.top > 0; set(); }).observe(btns);
	addEventListener('scroll', set, { passive: true });
	set();
})();

// Gallery: slides after the first are fetched as soon as the gallery is near the screen, so a slide is ready before the
// reader swipes to it (round 7). A slide whose picture fails is dropped (see the broken-image handler above).
if ('IntersectionObserver' in window) {
	const near = new IntersectionObserver((list) => list.forEach((e) => {
		if (!e.isIntersecting) return;
		e.target.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
		near.unobserve(e.target);
	}), { rootMargin: '800px 0px' });
	document.querySelectorAll('[data-gallery]').forEach((g) => near.observe(g));
}

// Featured projects strip: arrows when more cards than fit, disabled at either end (round 7).
document.querySelectorAll('.v-feats').forEach((box) => {
	const ul = box.querySelector('ul');
	const nav = box.querySelector('.v-feats__nav');
	if (!ul || !nav) return;
	const [prev, next] = nav.querySelectorAll('button');
	const sync = () => {
		nav.hidden = ul.scrollWidth <= ul.clientWidth + 2;
		prev.disabled = ul.scrollLeft <= 2;
		next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 2;
	};
	nav.addEventListener('click', (e) => {
		const b = e.target.closest('[data-feats]');
		if (b) ul.scrollBy({ left: +b.dataset.feats * (ul.firstElementChild?.getBoundingClientRect().width + 12 || 260), behavior: 'smooth' });
	});
	ul.addEventListener('scroll', sync, { passive: true });
	addEventListener('resize', sync);
	sync();
});
