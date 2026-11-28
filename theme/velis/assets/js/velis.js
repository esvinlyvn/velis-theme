/* Velis – progressive enhancements only; every page is readable without this file. Plain JS, no library.
   Behaviour follows the mockup (mockup/src/js/mockup.js) on the theme's markup (inc/ui.php). */
document.documentElement.classList.add('js');
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const q = new URLSearchParams(location.search);

// Mobile menu (<dialog>).
const menu = document.getElementById('menu');
if (menu) {
	$$('[data-menu-open]').forEach((b) => b.addEventListener('click', () => menu.showModal()));
	$$('[data-menu-close], #menu a').forEach((b) => b.addEventListener('click', () => menu.close()));
}

// Header drop-downs ("Dự án", "Về Velis"): hover, click, keyboard (↓ opens + first link, ↑↓ move, Esc closes); one open at a time.
const subs = $$('[data-sub]');
const setSub = (li, on) => { li.querySelector('.header__toggle').setAttribute('aria-expanded', String(on)); li.classList.toggle('is-open', on); };
subs.forEach((li) => {
	const btn = li.querySelector('.header__toggle'), links = () => $$('a', li);
	let t;
	let hoverAt = 0; // a click right after the pointer opened it (hover) must not close it again
	btn.addEventListener('click', () => { const on = btn.getAttribute('aria-expanded') !== 'true' || Date.now() - hoverAt < 500; subs.forEach((o) => setSub(o, false)); setSub(li, on); });
	li.addEventListener('mouseenter', () => { clearTimeout(t); hoverAt = Date.now(); subs.forEach((o) => o !== li && setSub(o, false)); setSub(li, true); });
	li.addEventListener('mouseleave', () => { t = setTimeout(() => setSub(li, false), 200); });
	li.addEventListener('keydown', (e) => {
		const i = links().indexOf(document.activeElement);
		if (e.key === 'Escape') { setSub(li, false); btn.focus(); }
		else if (e.key === 'ArrowDown') { e.preventDefault(); setSub(li, true); links()[Math.min(i + 1, links().length - 1)].focus(); }
		else if (e.key === 'ArrowUp' && i >= 0) { e.preventDefault(); i ? links()[i - 1].focus() : btn.focus(); }
	});
	li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) setSub(li, false); });
});
document.addEventListener('click', (e) => subs.forEach((li) => li.contains(e.target) || setSub(li, false)));

// Section tabs (project pages): highlight the last section whose top has passed 35 % of the screen; scroll only the strip.
$$('[data-secnav]').forEach((nav) => {
	const links = $$('a[href^="#"]', nav);
	const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
	const mark = () => {
		let cur = -1;
		targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= innerHeight * 0.35) cur = i; });
		links.forEach((a, i) => {
			if (i === cur && a.getAttribute('aria-current') !== 'true') a.closest('ul').scrollTo({ left: a.offsetLeft - 16 });
			i === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); // only the current tab carries the attribute
		});
	};
	addEventListener('scroll', mark, { passive: true });
	mark();
});

// Tabs (ARIA tablist, apartment lines); #panel-id in the URL selects that tab.
$$('[data-tabs]').forEach((box) => {
	const list = box.querySelector('[role=tablist]');
	const tabs = $$('[role=tab]', list);
	const panel = (t) => document.getElementById(t.getAttribute('aria-controls'));
	const select = (tab, focus) => tabs.forEach((t) => {
		const on = t === tab;
		t.setAttribute('aria-selected', String(on));
		t.setAttribute('aria-pressed', String(on)); // chip look
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
	select(tabs.find((t) => '#' + t.getAttribute('aria-controls') === location.hash) || tabs[0]);
});

// Quick filters (home area tabs, zones by product type, /du-an/ rows): OR inside a key, AND across keys; the grid count
// follows and visible cards come first, so no cell is left empty (X-06). data-single: one value at a time ("Tất cả" when
// none). data-url: state read from / written to ?khu=…&cdt=…&loai=… . [data-filter-link] follows the chosen value.
$$('[data-filter]').forEach((f) => {
	const grids = $$(f.dataset.filter);
	const out = f.querySelector('[data-count]');
	const noun = f.dataset.noun || 'phân khu';
	const btns = $$('button[value]', f);
	const clear = f.querySelector('[data-clear]');
	const single = f.hasAttribute('data-single');
	const total = grids.reduce((t, g) => t + g.children.length, 0);
	const link = f.closest('section, main')?.querySelector('[data-filter-link]');
	grids.forEach((g) => [...g.children].forEach((c, i) => { c.dataset.i = i; }));
	const key = (b) => b.dataset.key || 'loai';
	let empty = null;
	const apply = () => {
		const on = {};
		btns.filter((b) => b.getAttribute('aria-pressed') === 'true').forEach((b) => (on[key(b)] ??= []).push(b.value));
		let all = 0;
		grids.forEach((g) => {
			const cards = [...g.children].sort((a, b) => a.dataset.i - b.dataset.i);
			cards.forEach((c) => { c.hidden = !Object.entries(on).every(([k, vals]) => vals.some((v) => (c.dataset[k] || '').split(' ').includes(v))); });
			[...cards.filter((c) => !c.hidden), ...cards.filter((c) => c.hidden)].forEach((c) => g.append(c));
			const n = cards.filter((c) => !c.hidden).length;
			g.dataset.n = n;
			if (g.parentNode.matches('[data-group]')) g.parentNode.hidden = !n;
			all += n;
		});
		if (out) out.textContent = `Hiển thị ${all}/${total} ${noun}`;
		// 0 results (2.1): a message + one button back to every card, under the last grid
		if (!all && !empty && clear) {
			empty = document.createElement('div');
			empty.className = 'more-center';
			empty.dataset.empty = '';
			empty.setAttribute('role', 'status');
			const p = document.createElement('p'); p.className = 'mb-0'; p.textContent = `Chưa có ${noun} phù hợp với bộ lọc.`;
			const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn--line'; b.textContent = `Xem tất cả ${noun}`;
			b.addEventListener('click', () => clear.click());
			empty.append(p, b);
			grids[grids.length - 1].after(empty);
		}
		if (empty) empty.hidden = all > 0;
		if (single && clear) clear.setAttribute('aria-pressed', String(!Object.keys(on).length));
		if (link) {
			const u = new URL(link.href, location.href);
			u.searchParams.delete(link.dataset.filterLink);
			(on[link.dataset.filterLink] || []).forEach((v) => u.searchParams.set(link.dataset.filterLink, v));
			link.href = u.pathname + u.search;
		}
		if (f.hasAttribute('data-url')) {
			const u = new URL(location.href);
			new Set(btns.map(key)).forEach((k) => u.searchParams.delete(k));
			Object.entries(on).forEach(([k, v]) => u.searchParams.set(k, v.join(',')));
			history.replaceState(null, '', u);
		}
	};
	btns.forEach((b) => b.addEventListener('click', () => {
		const on = b.getAttribute('aria-pressed') !== 'true';
		if (single) btns.forEach((o) => o.setAttribute('aria-pressed', 'false'));
		b.setAttribute('aria-pressed', String(on));
		if (b.parentNode.scrollWidth > b.parentNode.clientWidth) b.parentNode.scrollTo({ left: b.offsetLeft - 16 }); // 2.16: the chosen tab stays in view
		apply();
	}));
	clear?.addEventListener('click', () => { btns.forEach((b) => b.setAttribute('aria-pressed', 'false')); apply(); });
	if (f.hasAttribute('data-url')) btns.forEach((b) => (q.get(key(b)) || '').split(',').includes(b.value) && b.setAttribute('aria-pressed', 'true'));
	// phones (2.6): one <select> per group drives the same chips; chips and selects stay in step
	const sels = $$('select[data-key]', f);
	const syncSel = () => sels.forEach((s) => { s.value = btns.find((b) => key(b) === s.dataset.key && b.getAttribute('aria-pressed') === 'true')?.value || ''; });
	sels.forEach((s) => s.addEventListener('change', () => { btns.filter((b) => key(b) === s.dataset.key).forEach((b) => b.setAttribute('aria-pressed', String(b.value === s.value))); apply(); }));
	f.addEventListener('click', () => setTimeout(syncSel));
	apply();
	syncSel();
});

// Broken image (e.g. a corrupt original): try the other size in data-alt once, then the named frame.
const broken = (img) => {
	if (img.dataset.alt && !img.dataset.tried) {
		img.dataset.tried = '1';
		img.removeAttribute('srcset');
		img.src = img.dataset.alt;
		return;
	}
	const li = img.closest('.gallery__track > li');
	if (li) return li.remove();
	const box = img.closest('.card__media, .hero__media');
	const name = img.closest('[data-name]')?.dataset.name || img.alt || '';
	if (box) {
		box.classList.add('card__media--empty');
		box.innerHTML = '<span></span>';
		box.firstChild.textContent = name;
	}
};
$$('img[data-alt]').forEach((img) => {
	img.addEventListener('error', () => broken(img));
	if (img.complete && img.naturalWidth === 0 && img.currentSrc) broken(img); // failed before this script ran
});

// Gallery: prev / next + "n/total"; swipe is native scroll-snap; no autoplay. Slides load once the gallery is near.
$$('[data-gallery]').forEach((g) => {
	const track = g.querySelector('.gallery__track');
	const slides = [...track.children];
	const counter = g.querySelector('[data-counter]');
	if (slides.length < 2) return;
	const idx = () => Math.round(track.scrollLeft / (slides[1].offsetLeft - slides[0].offsetLeft));
	const go = (d) => track.scrollTo({ left: slides[Math.max(0, Math.min(slides.length - 1, idx() + d))].offsetLeft - slides[0].offsetLeft });
	track.addEventListener('scroll', () => (counter.textContent = `${Math.min(idx(), slides.length - 1) + 1}/${slides.length}`), { passive: true });
	g.querySelector('[data-prev]').addEventListener('click', () => go(-1));
	g.querySelector('[data-next]').addEventListener('click', () => go(1));
});
if ('IntersectionObserver' in window) {
	const near = new IntersectionObserver((list) => list.forEach((e) => {
		if (!e.isIntersecting) return;
		e.target.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
		near.unobserve(e.target);
	}), { rootMargin: '800px 0px' });
	$$('[data-gallery]').forEach((g) => near.observe(g));
}

// Lightbox (vòng bố cục 5.11): gallery / construction / plan buttons [data-zoom] and pictures in page text open the shared
// <dialog>: whole picture inside the screen, flagged photos keep their W-A crop (no badge), ‹ › and arrow keys move inside
// the same group, Esc / ground click / swipe down close, focus goes back to the picture that was opened.
const lightbox = document.querySelector('.lightbox') || (() => {
	if (!document.querySelector('.prose img')) return null;
	document.body.insertAdjacentHTML('beforeend', '<dialog class="lightbox" aria-label="Xem ảnh"><button type="button" class="lightbox__close" data-close aria-label="Đóng">×</button><button type="button" class="lightbox__nav" data-step="-1" aria-label="Ảnh trước">‹</button><span class="lightbox__frame"><img alt="" width="1200" height="800"></span><button type="button" class="lightbox__nav" data-step="1" aria-label="Ảnh sau">›</button></dialog>');
	return document.querySelector('.lightbox');
})();
if (lightbox) {
	const big = (img) => { // largest file of a text picture
		const c = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((s) => s[0]).sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10));
		return img.dataset.alt || (c[0] && c[0][0]) || img.currentSrc || img.src;
	};
	const item = (el) => el.matches('[data-zoom]')
		? { el, src: el.dataset.zoom, img: el.querySelector('img') }
		: { el, src: big(el), img: el };
	let list = [], at = 0, opener = null;
	const show = () => {
		const it = list[at], pic = lightbox.querySelector('img');
		pic.src = it.src;
		pic.alt = it.img?.alt || '';
		lightbox.classList.toggle('is-crop', !!it.img && it.img.classList.contains('is-marked') && !it.img.classList.contains('is-plan'));
		$$('[data-step]', lightbox).forEach((b) => { b.hidden = list.length < 2; });
	};
	const open = (el) => {
		const group = el.closest('[data-gallery], .grid, [data-tabs], .prose') || document;
		list = $$(el.matches('[data-zoom]') ? '[data-zoom]' : 'img:not(a img, .card img)', group).map(item);
		at = Math.max(0, list.findIndex((i) => i.el === el));
		opener = el;
		show();
		lightbox.showModal();
	};
	const step = (d) => { if (list.length > 1) { at = (at + d + list.length) % list.length; show(); } };
	$$('.prose img:not(a img, .card img)').forEach((img) => {
		img.tabIndex = 0;
		img.setAttribute('role', 'button');
		img.setAttribute('aria-label', 'Phóng to: ' + (img.alt || 'ảnh'));
		img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
	});
	document.addEventListener('click', (e) => {
		const el = e.target.closest('[data-zoom], .prose img:not(a img, .card img)');
		if (el && !lightbox.contains(el)) open(el);
	});
	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox || e.target.closest('[data-close]')) lightbox.close();
		const s = e.target.closest('[data-step]');
		if (s) step(+s.dataset.step);
	});
	lightbox.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
	let y0 = null;
	lightbox.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; }, { passive: true });
	lightbox.addEventListener('touchend', (e) => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 80) lightbox.close(); y0 = null; });
	lightbox.addEventListener('close', () => opener?.focus());
}

// Home hero strip (NT-10): arrows only when more cards than fit, disabled at either end; fade while more are hidden.
$$('.feats').forEach((box) => {
	const ul = box.querySelector('ul');
	const nav = box.querySelector('.feats__nav');
	const [prev, next] = nav.querySelectorAll('button');
	const sync = () => {
		nav.hidden = ul.scrollWidth <= ul.clientWidth + 2;
		prev.disabled = ul.scrollLeft <= 2;
		next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 2;
		ul.classList.toggle('has-more', !next.disabled);
	};
	const step = (d) => ul.scrollBy({ left: d * (ul.firstElementChild.getBoundingClientRect().width + 12), behavior: 'smooth' });
	prev.addEventListener('click', () => step(-1));
	next.addEventListener('click', () => step(1));
	ul.addEventListener('scroll', sync, { passive: true });
	addEventListener('resize', sync);
	sync();
});

// Long text blocks of project / phân khu / dòng pages (vòng bố cục 4): a block taller than 520 px shows ~360 px, then
// "Xem thêm" / "Thu gọn" in place (all text stays in the page). The cut falls at a child boundary: children past ~360 px
// are hidden, the paragraph crossing the line fades out (same-colour gradient, Safari-safe); a heading is never faded – it
// is hidden with what follows it. A section-tab jump to a block opens it; print opens everything.
const clamps = [];
$$('.clamp').forEach((el) => {
	if (el.scrollHeight <= 520) return;
	const kids = [...el.children], top = el.getBoundingClientRect().top;
	let i = kids.findIndex((k) => k.getBoundingClientRect().bottom - top > 360);
	if (i < 0) return;
	while (i > 0 && /^H\d$/.test(kids[i].tagName)) i--; // cut before a heading; the paragraph above it fades
	if (/^H\d$/.test(kids[i].tagName)) return; // phones: the first paragraph alone may pass 360 px – it is then the one that fades
	const fade = kids[i], cut = kids.slice(i + 1);
	const b = document.createElement('button');
	b.type = 'button';
	b.className = 'btn btn--text clamp__more';
	const set = (open) => {
		cut.forEach((k) => { k.hidden = !open; });
		fade.classList.toggle('clamp__fade', !open);
		el.classList.toggle('is-clamped', !open);
		b.textContent = open ? 'Thu gọn' : 'Xem thêm';
		b.setAttribute('aria-expanded', String(open));
	};
	b.addEventListener('click', () => {
		const open = b.getAttribute('aria-expanded') !== 'true';
		set(open);
		if (!open && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' }); // closing far below: back to the block
	});
	set(false);
	el.after(b);
	clamps.push({ el, open: () => set(true) });
});
const openAt = (hash) => {
	const t = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
	if (t) clamps.forEach((c) => { if (t.contains(c.el)) c.open(); });
};
document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (a) openAt(a.hash); }, true);
addEventListener('hashchange', () => openAt(location.hash));
openAt(location.hash);

// Print / "Lưu PDF" (Safari never scrolls, so native lazy images below the fold would print as empty boxes): load every
// picture now and open the collapsed text. beforeprint where it fires, print media query where it does not.
const forPrint = () => {
	$$('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
	clamps.forEach((c) => c.open());
};
addEventListener('beforeprint', forPrint);
matchMedia('print').addEventListener?.('change', (e) => e.matches && forPrint());

// Table of contents (long posts): highlight the section being read.
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

// Mobile bottom CTA: hidden while the hero's own buttons are on screen (NT-79). A scroll check, not an observer: a jump past
// buttons that start below the fold never crosses a threshold.
(() => {
	const cta = document.querySelector('.cta');
	const btns = document.querySelector('.hero .actions');
	if (!cta) return;
	const sync = () => cta.classList.toggle('is-on', btns ? btns.getBoundingClientRect().bottom < 0 : scrollY > 120);
	addEventListener('scroll', sync, { passive: true });
	sync();
})();

// Form: "Nhận bảng giá …" pre-fills the project of the consultation form; the advisor's "Nhận bảng giá" opens its short
// form in place (the link to #tu-van stays the no-JS path).
$$('[data-interest]').forEach((a) => a.addEventListener('click', () => {
	const f = document.querySelector('#tu-van [name=interest]');
	if (f) f.value = a.dataset.interest;
}));
$$('[data-open-form]').forEach((a) => a.addEventListener('click', (e) => {
	const box = a.nextElementSibling;
	if (!box?.matches('[data-mini-form]')) return;
	e.preventDefault();
	box.hidden = !box.hidden;
	a.setAttribute('aria-expanded', String(!box.hidden));
	if (!box.hidden) box.querySelector('input')?.focus();
}));
// utm_* of the landing URL, kept for the visit; sent with the lead.
const utm = (() => {
	const s = [...q].filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&');
	try { if (s) sessionStorage.setItem('velis-utm', s); return s || sessionStorage.getItem('velis-utm') || ''; } catch { return s; }
})();
$$('[data-form]').forEach((form) => form.addEventListener('submit', (e) => {
	e.preventDefault();
	let ok = true;
	$$('input[required]', form).forEach((i) => {
		const bad = !i.checkValidity();
		const err = document.getElementById(i.getAttribute('aria-describedby'));
		i.setAttribute('aria-invalid', String(bad));
		i.closest('.field, .check')?.classList.toggle('is-error', bad);
		if (err) err.hidden = !bad;
		if (bad && ok) { i.focus(); ok = false; }
	});
	if (!ok) return;
	const done = (sent) => {
		form.querySelector('[data-ok]').hidden = !sent;
		form.querySelector('[data-fail]').hidden = sent;
		if (!sent) return;
		const detail = { form_id: 'tu-van', interest: form.elements.interest?.value || '' };
		(window.dataLayer ||= []).push({ event: 'generate_lead', ...detail }); // GA4 conversion (GTM or gtag)
		window.gtag?.('event', 'generate_lead', detail);
		form.querySelector('[type=submit]').disabled = true;
	};
	if (form.elements['page-url']) form.elements['page-url'].value = location.href.split('#')[0];
	if (form.elements.utm) form.elements.utm.value = utm;
	if (!form.dataset.cf7) return done(false); // no receiver configured: say so, never pretend it was sent
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
