// Page markup for the 3 mockup pages – plain JS template strings, no framework. Text comes verbatim from
// data/*.json + content/*.html (extracted read-only from staging by tools/mockup_extract.mjs).
// `img(ref, opts)` is supplied by tools/build_mockup.mjs (srcset, sizes per X-01, crop per X-03, "ảnh tạm" tag).
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PHONE = '0911 237 979';

// sizes presets: [media query, slot width]; the last entry has no query
const S = {
	heroB: [['(min-width: 1600px)', '1320px'], ['(min-width: 1248px)', '1200px'], ['(min-width: 768px)', '(100vw - 48px)'], ['', '(100vw - 32px)']], // = .wrap (NT-17)
	card3: [['(min-width: 1024px)', '380px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	card3side: [['(min-width: 1024px)', '250px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	card2side: [['(min-width: 1024px)', '390px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	wide: [['(min-width: 1024px)', '440px'], ['(min-width: 768px)', '(55vw - 40px)'], ['', '(100vw - 32px)']],
	thumb: [['', '64px']],
	within: [['', '120px']],
	half: [['(min-width: 1024px)', '(50vw - 64px)'], ['', '(100vw - 32px)']],
	read: [['(min-width: 768px)', '720px'], ['', '(100vw - 32px)']],
	gallery: [['(min-width: 1024px)', '820px'], ['', '86vw']],
};

export function render({ home, homeCu, tgc, mpp, broker, content, img, usable, logo, logoWhite }) {
	const sechead = (h, extra = '') => `<header class="sechead${extra ? ' sechead--row' : ''}"><div>${h.eyebrow ? `<p class="eyebrow">${esc(h.eyebrow)}</p>` : ''}<h2>${esc(h.title)}</h2>${h.lead ? `<p>${esc(h.lead)}</p>` : ''}</div>${extra}</header>`;

	const header = () => `
<a class="sr-only" href="#noi-dung">Bỏ qua đến nội dung</a>
<header class="header"><div class="wrap header__bar">
	<a class="header__logo" href="trang-chu.html"><img src="${logo}" width="191" height="44" alt="Velis Realty"></a>
	<nav class="header__nav" aria-label="Menu chính"><ul>${home.header.nav.map(n => `<li><a href="#">${esc(n)}</a></li>`).join('')}</ul></nav>
	<a class="header__phone" href="#">Gọi hotline ${PHONE}</a>
	<a class="btn header__cta" href="#tu-van">${esc(home.header.cta)}</a>
	<button class="header__menu" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu"><span></span><b class="sr-only">Mở menu</b></button>
</div></header>
<dialog class="menu" id="menu" aria-label="Menu">
	<div class="menu__top"><img src="${logo}" width="156" height="36" alt="Velis Realty"><button class="menu__close" type="button" data-menu-close aria-label="Đóng menu">×</button></div>
	<nav aria-label="Menu chính (di động)"><ul>${home.header.nav.map(n => `<li><a href="#">${esc(n)}</a></li>`).join('')}</ul></nav>
	<div class="menu__actions"><a class="btn btn--line" href="#">Gọi hotline ${PHONE}</a><a class="btn" href="#tu-van">${esc(home.header.cta)}</a></div>
</dialog>`;

	const footer = ({ heroSwitch = true } = {}) => {
		const [brand, explore, apps, follow] = home.footer.cols;
		const sw = (big) => heroSwitch ? (big ? 'Hero: <button type="button" data-mk-hero="a">A – tràn</button><button type="button" data-mk-hero="b">B – khung có lề</button>\n\t&nbsp; ' : 'Hero <button type="button" data-mk-hero="a">A</button><button type="button" data-mk-hero="b">B</button> ') : '';
		const [copy, policy] = home.footer.bottom.split(/\n+/);
		const social = ['Facebook', 'YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'X', 'Pinterest'];
		return `
<footer class="footer"><div class="wrap">
	<div class="footer__grid">
		<div><img src="${logoWhite}" width="174" height="40" alt="Velis Realty"><p>${esc(brand[0])}</p><p class="footer__contact"><a href="#">${esc(brand[1])}</a><a href="#">${esc(brand[2])}</a>${esc(brand[3])}<br>${esc(brand[4])}</p></div>
		<nav aria-label="Khám phá"><p class="eyebrow">${esc(explore[0])}</p><ul>${explore.slice(1).map(x => `<li><a href="#">${esc(x)}</a></li>`).join('')}</ul></nav>
		<nav aria-label="Ứng dụng"><p class="eyebrow">${esc(apps[0])}</p><ul>${apps.slice(1).map(x => `<li><a href="#">${esc(x)}</a></li>`).join('')}</ul></nav>
		<div><p class="eyebrow">${esc(follow[0])}</p><ul class="footer__social">${social.map(x => `<li><a href="#" aria-label="Velis Realty trên ${x}">${x}</a></li>`).join('')}</ul></div>
	</div>
	<div class="footer__bottom"><p class="mb-0">${esc(copy)}</p><a href="#">${esc(policy)}</a></div>
</div></footer>
<nav class="cta" aria-label="Liên hệ nhanh"><a href="#">${esc(home.cta[0])}</a><a href="#">${esc(home.cta[1])}</a><a href="#tu-van">${esc(home.cta[2])}</a></nav>
<details class="mk-float"><summary aria-label="Công tắc mockup">${heroSwitch ? 'A/B' : 'Nhãn'}</summary><div class="mk__row">${sw(false)}Nhãn <button type="button" data-mk-tam="1">Hiện</button><button type="button" data-mk-tam="0">Ẩn</button></div></details>
<aside class="mk" aria-label="Công tắc mockup"><div class="wrap">
	<p><b>Mockup bước 2</b> – công tắc chỉ dùng để duyệt, không đưa vào theme. Trạng thái ghi vào địa chỉ: ${heroSwitch ? '<code>#hero-a</code> / <code>#hero-b</code>, ' : ''}<code>#tam-1</code> (nhãn "ảnh tạm" mặc định ẩn).</p>
	<div class="mk__row">${sw(true)}Nhãn ảnh tạm: <button type="button" data-mk-tam="1">Hiện</button><button type="button" data-mk-tam="0">Ẩn</button></div>
</div></aside>`;
	};

	// form fields shared by the full form and the short one; hidden fields = the live CF7 form (interest, page-url, utm)
	const fields = (id, { interest = '', choose = false } = {}) => {
		const f = home.form;
		return `
		<div class="form__row">
			<p class="field"><label for="${id}ten">Họ và tên</label><input id="${id}ten" name="ten" autocomplete="name" required data-rule="name" aria-describedby="${id}ten-loi"><span class="field__error" id="${id}ten-loi" hidden></span></p>
			<p class="field"><label for="${id}sdt">Số điện thoại</label><input id="${id}sdt" name="sdt" type="tel" inputmode="tel" autocomplete="tel" required data-rule="phone" aria-describedby="${id}sdt-loi"><span class="field__error" id="${id}sdt-loi" hidden></span></p>
		</div>
		${choose ? `<p class="field"><label for="${id}du-an">Dự án quan tâm</label><select id="${id}du-an" name="interest"><option value="">Chưa chọn</option>${broker.projects.map(p => `<option>${esc(p.title)}</option>`).join('')}</select></p>` : `<input type="hidden" name="interest" value="${esc(interest)}">`}
		<input type="hidden" name="page-url" value=""><input type="hidden" name="utm" value="">
		<div class="check"><input id="${id}dong-y" type="checkbox" data-rule="consent" aria-describedby="${id}dong-y-loi"><div><label for="${id}dong-y">${esc(f.consent)}</label><p class="field__error" id="${id}dong-y-loi" hidden></p></div></div>
		<p class="mb-0"><button class="btn" type="submit">${esc(f.submit)}</button></p>
		<p class="mb-0 muted" role="status"></p>`;
	};

	const form = (title, lead, interest = '') => {
		const f = home.form;
		return `
<section class="section section--dark" id="tu-van" aria-labelledby="tu-van-h"><div class="wrap contact">
	<div><p class="eyebrow">${esc(f.eyebrow)}</p><h2 id="tu-van-h">${esc(title)}</h2><p>${esc(lead ?? f.lead)}</p>
		<dl>${f.contact.map(([k, v]) => { const href = /^0[\d ]+$/.test(v) ? 'tel:' + v.replace(/\s/g, '') : /^zalo\.me/.test(v) ? '#' : /@/.test(v) ? 'mailto:' + v : ''; return `<div><dt>${esc(k)}</dt><dd>${href ? `<a href="${href}">${esc(v)}</a>` : esc(v)}</dd></div>`; }).join('')}</dl></div>
	<form class="form" novalidate>${fields('', { interest })}
	</form>
</div></section>`;
	};

	// [CEO] portrait (user-supplied, clean: no crop, no "ảnh tạm" tag) + the advisor card of project pages
	const CEO = { img: 'img/vu-thanh-xuan-ceo-velis.webp', name: 'Vũ Xuân', role: 'CEO Velis Realty' };
	const avatar = (px) => img(CEO.img, { alt: '', sizes: [['', `${px}px`]], frame: 1, tmp: '', widths: [720] });
	const advisor = (name, devName, dl, cls = '') => `<div class="advisor${cls}">
	<p class="eyebrow">VELIS TƯ VẤN DỰ ÁN NÀY</p>
	<div class="advisor__who"><span class="advisor__img">${avatar(80)}</span><p class="mb-0"><b>${esc(CEO.name)}</b><span>${esc(CEO.role)}</span></p></div>
	<p class="pricecard__title mb-0">${esc(name)}</p>
	<dl>${dl.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
	<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a><a class="btn btn--line" href="#">Zalo</a>
	${devName ? `<p class="advisor__role">Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là ${esc(devName)}.</p>` : ''}
</div>`;

	// hero: same text/button structure for A and B; B is the default, #hero-a switches before the image is chosen
	// home: style B only (its photo is a 1200 px file, X-02) – no A switch; intro = the old home's 2 paragraphs, verbatim
	const hero = (h, { lead, intro, chips, buttons, home: isHome }) => `
<section class="hero hero--b${isHome ? ' hero--home' : ''}" aria-labelledby="h1">
	<figure class="hero__media">${img(h.img, { alt: h.alt, sizes: S.heroB, frame: 2.4, lcp: true, tmp: 'ảnh tạm – ảnh thật sẽ nét' })}${isHome ? '' : `<script>if(/(^#|[,&])hero-a(?![\\w-])/.test(location.hash)){const s=document.currentScript,i=s.parentNode.querySelector('img');s.closest('.hero').classList.replace('hero--b','hero--a');i.dataset.sizesB=i.sizes;i.sizes='100vw'}</script>`}</figure>
	<div class="hero__body wrap">
		${h.eyebrow ? `<p class="eyebrow">${esc(h.eyebrow)}</p>` : ''}
		<h1 id="h1">${esc(h.title)}</h1>
		${lead ? `<p class="hero__lead">${esc(lead)}</p>` : ''}
		${intro ? intro.map(p => `<p class="hero__intro">${p}</p>`).join('') : ''}
		${chips ? `<ul class="chips">${chips.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
		<div class="actions">${buttons}</div>
	</div>
</section>`;

	const crumbs = list => `<nav class="wrap" aria-label="Đường dẫn"><ol class="crumbs">${list.map((c, i) => i < list.length - 1 ? `<li><a href="#">${esc(c)}</a></li>` : `<li aria-current="page">${esc(c)}</li>`).join('')}</ol></nav>`;
	const tabs = nav => `<nav class="tabs" aria-label="Mục trong trang"><div class="wrap"><ul>${nav.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></div></nav>`;
	const facts = items => `<section class="wrap facts" aria-label="Thông tin chính"><dl class="facts__list" data-n="${items.length}">${items.map(([k, v, more]) =>
		`<div class="facts__item"><dt>${esc(k)}</dt><dd${v === 'Chưa công bố' ? ' class="is-missing"' : ''}>${esc(v)}${more ? ` <a class="facts__more" href="${more}">Chi tiết</a>` : ''}</dd></div>`).join('')}</dl></section>`;

	const card = (c, sizes, { kicker = '', lines = [], more, frame = 4 / 3 } = {}) => `
<article class="card">
	${c.img && usable(c.img) ? `<div class="card__media">${img(c.img, { alt: '', sizes, frame })}</div>` : `<div class="card__media card__media--empty"><span>${esc(c.title)}</span></div>`}
	<div class="card__body">
	${kicker ? `<p class="eyebrow">${esc(kicker)}</p>` : ''}
	<h3 class="card__title"><a href="#">${esc(c.title)}</a></h3>
	${lines.filter(Boolean).map(l => `<p class="card__text">${esc(l)}</p>`).join('')}
	${more ? `<span class="card__more" aria-hidden="true">${esc(more)}</span>` : ''}
	</div>
</article>`;
	const postCard = (p, sizes) => card(p, sizes, { kicker: p.kicker, more: 'Đọc bài →' }).replace('<article class="card">', '<article class="card card--post">')
		.replace('</h3>', `</h3>\n\t<p class="card__meta">${esc(p.meta).split(' · ').map(x => `<span>${x}</span>`).join(' · ')}</p>`);
	// MPP compare table: the template repeats the current zone as first AND last column → keep the first, mark it
	const dropDupCol = html => html.replace(/<tr>(.*?)<\/tr>/gs, (m, row) => {
		const cells = row.match(/<(th|td)[^>]*>.*?<\/\1>/gs).slice(0, -1);
		cells[1] = cells[1].replace(/^<(th|td)/, '<$1 class="is-current"').replace('Trang này', ' <small class="muted">(trang này)</small>');
		return `<tr>${cells.join('')}</tr>`;
	});
	const grid = (items, cls = '') => `<div class="grid${cls}" data-n="${items.length}">${items.join('')}</div>`;
	const prose = (html, id) => `<div class="prose clamp" id="${id}-noi-dung">${html}</div>`;
	// project / zone pages: the advisor card sits in the side column (≥ 1024) and right after the facts bar (phones)
	const side = (name, dl) => `<aside class="page__side" aria-label="Velis tư vấn dự án này">${advisor(name, 'Masterise Homes', dl)}</aside>`;
	const advisorInline = (name, dl) => `<div class="wrap advisor-inline">${advisor(name, 'Masterise Homes', dl, ' advisor--inline')}</div>`;
	const map = (m, extra = '') => `<figure class="map">${img(m.img, { alt: m.alt, sizes: S.read, frame: 16 / 9 })}<a class="btn btn--line" href="#">Xem trên Google Maps</a></figure>${extra}<p class="source">${esc(m.source)}</p>`;
	const page = (title, body) => ({ title, body });

	/* ---------- Trang chủ ---------- */
	const H = home;
	// Trang chủ theo trang cũ + BRIEF (vòng chốt): chữ nguyên văn trang chủ cũ (home-cu.json), Giới thiệu (broker.json), dữ liệu
	// dự án / bài trên staging; thứ tự khối và đường đi tiếp học cách tổ chức của Newway Realty (docs/THAM-CHIEU.md)
	const O = homeCu, sentence = (t) => t.charAt(0) + t.slice(1).toLowerCase(); // old headings were all caps (NT-55)
	// round 5 (layout rules): the first sentence of intro paragraph 1 is the hero lead; the rest of both paragraphs goes,
	// word for word, to block e. Nothing is rewritten.
	// home hero = staging 0.9.8 hero, text and photos as they are there (read 2026-11-06); the old home's 2 intro paragraphs go
	// whole, word for word, to the values block under the H2 "Công ty TNHH Velis Realty" (duyệt 2026-11-06)
	const HERO = { title: 'Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận', lead: 'Căn hộ hạng sang, villa nghỉ dưỡng, shophouse của Vinhomes, Sun Group, Masterise Homes, Gamuda Land cho người mua ở và nhà đầu tư. CEO Vũ Xuân trực tiếp phân tích dòng tiền và rủi ro từng dự án.',
		feats: [['Ansana by Kita', 'Khu Tây', 'vi-tri-ansana-by-kita.webp'], ['Spring Ville', 'Nhơn Trạch – Long Thành', 'phoi-canh-spring-ville.webp'], ['The Global City', 'Nam Rạch Chiếc', 'the-global-city-3-1.webp'], ['The Privé', 'Nam Rạch Chiếc', 'can-ho-the-prive.webp'], ['Vinhomes Saigon Park', 'Tây Bắc', 'vinhomes-saigon-park-2.webp']] };
	const heroImg = img('img/can-ho-the-prive.webp', { alt: 'Phối cảnh dự án The Privé', sizes: [['', '100vw']], lcp: true, tmp: '' })
		.replace('<img ', '<img style="--focus: 85% 30%; --focus-m: 72% 0%; --zoom: 1.12" ').replace(/ class="[^"]*"/, '').replace('<img ', '<img class="hero__img" ');
	const aboutLead = O.paras;
	const LOGOS = { vinhomes: [712, 325], 'masterise-homes': [486, 330], 'sun-group': [712, 226], 'gamuda-land': [711, 144] }; // = build_mockup.mjs SUPPLIED
	// partner logos: same visual area (±15 %), ≤ 48 px high, ≤ 160 px wide, from each logo's own ratio (duyệt 2026-11-06)
	const logoBox = (w, h, area = 2304) => { const r = w / h; const lw = Math.min(160, Math.min(48, Math.sqrt(area / r)) * r); return [Math.round(lw), Math.round(lw / r)]; }; // = velis_logo_box() (theme)
	const withImg = broker.projects.filter(p => (H.projects.find(x => x.title === p.title) || {}).img), noImg = broker.projects.filter(p => !withImg.includes(p));
	const projCard = p => {
		const c = H.projects.find(x => x.title === p.title) || {}, hand = (c.lines || []).find(l => /^Bàn giao/.test(l));
		return card({ title: p.title, img: c.noimg ? '' : c.img }, S.card3, { kicker: `${p.devs.map(d => d.name).join(', ')} · ${p.khu.join(', ')}`, lines: [p.types.join(', '), hand], more: 'Xem dự án →' })
			.replace('<article class="card">', `<article class="card" data-khu="${p.regions.join(' ')}">`);
	};
	const homeBody = `${header()}
<main id="noi-dung" tabindex="-1">
<section class="hero hero--home" aria-label="${esc(HERO.title)}">
	${heroImg}
	<div class="hero__body">
		<p class="eyebrow">Velis Realty</p>
		<h1 id="h1">${esc(HERO.title)}</h1>
		<p class="hero__lead">${esc(HERO.lead)}</p>
		<div class="actions"><a class="btn" href="#tu-van">Nhận tư vấn</a><a class="btn btn--line" href="#du-an">Xem dự án</a></div>
	</div>
	<div class="hero__after"><div class="feats">
		<div class="feats__head"><p class="eyebrow">Dự án nổi bật</p><span class="feats__nav" hidden><button type="button" aria-label="Dự án trước"><span aria-hidden="true">‹</span></button><button type="button" aria-label="Dự án sau"><span aria-hidden="true">›</span></button></span></div>
		<div class="feats__row"><ul>${HERO.feats.map(([name, region, file]) => `<li><a class="feat" href="#"><span class="feat__img">${img(`img/${file}`, { alt: `Phối cảnh ${name}`, sizes: [['', '72px']], frame: 13 / 9, lcp: true, tmp: '' })}</span><span><b>${esc(name)}</b><small>${esc(region)}</small></span></a></li>`).join('')}</ul></div>
	</div></div>
</section>
<section class="section section--tight section--tint" aria-label="Velis Realty trong những con số"><div class="wrap">
	<dl class="numbers">${O.numbers.map(n => `<div><dt>${esc(n.label)}</dt><dd>${esc(n.value.replace('+', ''))}+</dd></div>`).join('')}</dl>
</div></section>
<section class="section" id="du-an" aria-labelledby="du-an-h"><div class="wrap">
	<header class="sechead"><h2 id="du-an-h">${sentence(O.featuredHead)}</h2></header>
	<div class="ftabs" role="group" aria-label="Lọc theo khu vực" data-filter="#du-an .grid" data-noun="dự án" data-single>
		<button type="button" data-clear aria-pressed="true">Tất cả</button>${broker.regions.slice().sort((x, y) => ['khu-dong', 'khu-tay', 've-tinh', 'tay-bac'].indexOf(x.slug) - ['khu-dong', 'khu-tay', 've-tinh', 'tay-bac'].indexOf(y.slug)).map(r => `<button type="button" data-key="khu" value="${r.slug}" aria-pressed="false">${esc(r.name)}</button>`).join('')}
		<p class="sr-only" data-count aria-live="polite">Hiển thị ${broker.projects.length}/${broker.projects.length} dự án</p>
	</div>
	${grid([...withImg, ...noImg].map(projCard), ' grid--three')}
	<p class="more-center"><a class="btn btn--line" href="#">Xem tất cả dự án</a></p>
</div></section>
<section class="section section--tint" aria-labelledby="cdt-h"><div class="wrap">
	<header class="sechead"><h2 id="cdt-h">${sentence(O.partnersHead)}</h2><p>${esc(broker.who.text.slice(0, broker.who.text.indexOf('. ') + 1))}</p></header>
	<ul class="partners">${O.partners.map(pt => { const dv = broker.devs.find(x => x.name === pt.name); const slug = dv?.slug || pt.oldLink.split('/').filter(Boolean).pop(); const [lw, lh] = logoBox(...LOGOS[slug]); return `<li><a href="#" data-href="/chu-dau-tu/${slug}/" aria-label="${esc(pt.name)}">${img(`img/doi-tac-${slug}.webp`, { alt: pt.name, sizes: [['', `${lw}px`]], tmp: '' }).replace('<img ', `<img style="--w: ${lw}px; --h: ${lh}px" `)}</a></li>`; }).join('')}</ul>
</div></section>
<section class="section" id="ve-velis" aria-labelledby="ve-velis-h"><div class="wrap">
	<header class="sechead"><h2 id="ve-velis-h">Công ty TNHH Velis Realty</h2><div class="about__lead">${aboutLead.map(t => `<p>${t}</p>`).join('')}</div></header>
	<h2 class="values-head">Giá trị khác biệt tại Velis Realty</h2>
	<ul class="values">${broker.values.items.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>
	<p class="mb-0"><a class="btn btn--line" href="#">${esc(H.about.button)}</a></p>
</div></section>
<section class="section section--tint" aria-labelledby="bai-h"><div class="wrap">
	${sechead({ title: sentence(O.postsHead) }, `<a class="btn btn--text" href="#">${esc(H.sections[2].more)} →</a>`).replace('<h2>', '<h2 id="bai-h">')}
	${grid(H.posts.map(p => postCard(p, S.card3)))}
</div></section>
<section class="section section--tight section--soft" aria-label="Thi thử chứng chỉ môi giới và cơ hội nghề nghiệp"><div class="wrap duo">
	<div class="duo__item"><h2 class="duo__title">${sentence(O.exam.button)}</h2><p>Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí.</p><a class="btn" href="#" data-href="${O.exam.link}">Thi thử CCMG</a></div>
	<div class="duo__item"><h2 class="duo__title">${sentence(O.career.head)}</h2><p>${esc(O.career.line)}</p><a class="btn" href="#" data-href="${O.career.link}">${sentence(O.career.button)}</a></div>
</div></section>
${form(H.form.title, H.form.lead)}
</main>
${footer({ heroSwitch: false })}`;

	/* ---------- The Global City ---------- */
	const T = tgc, F = T.fields;
	const zoneCard = z => card({ ...z, img: z.noimg || !z.img ? '' : z.img }, S.card2side, { lines: z.lines, more: 'Xem phân khu →' })
		.replace('<article class="card">', `<article class="card" data-loai="${z.title.startsWith('Thấp tầng') ? 'biet-thu dinh-thu shophouse' : 'can-ho'}">`);
	const high = T.zones.filter(z => !z.title.startsWith('Thấp tầng')), low = T.zones.filter(z => z.title.startsWith('Thấp tầng'));
	const c = k => content[`tgc-${k}`];
	const tgcBody = `${header()}
<main id="noi-dung" tabindex="-1">
${crumbs(T.hero.crumbs)}
${tabs(T.nav)}
${hero(T.hero, { chips: T.hero.chips, buttons: `<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a>` })}
${facts([['Chủ đầu tư', 'Masterise Homes'], ['Quy mô', F.velis_scale], ['Số phân khu', '5'], ['Giá', 'Chưa công bố'], ['Vị trí', F.velis_address, '#vi-tri'], ['Sản phẩm', 'Biệt thự, Căn hộ, Nhà phố liền kề, Shophouse'], ['Bàn giao', T.side.dl[1][1]], ['Pháp lý', F.velis_legal.replace(/^Hình thức sở hữu:\s*/, '')]])}
${advisorInline(T.hero.title, T.side.dl.slice(0, 2))}
<div class="wrap page">
<div class="page__main">
	<section class="block" id="tong-quan">${sechead(T.heads['tong-quan'])}${prose(c('tong-quan'), 'tong-quan')}</section>
	<section class="block" id="phan-khu">${sechead(T.heads['phan-khu'])}
		<div class="zfilter" data-filter=".zones"><p class="muted mb-0" data-count aria-live="polite">Hiển thị ${T.zones.length}/${T.zones.length} phân khu</p>
			<div class="actions" role="group" aria-label="Lọc theo loại sản phẩm">${[['can-ho', 'Căn hộ'], ['biet-thu', 'Biệt thự'], ['dinh-thu', 'Dinh thự'], ['shophouse', 'Shophouse']].map(([v, t]) => `<button class="chip" type="button" value="${v}" aria-pressed="false">${t}</button>`).join('')}<button class="btn btn--text" type="button" data-clear>Xóa lọc</button></div></div>
		<div data-group><h3>Cao tầng</h3>${grid(high.map(zoneCard), ' zones')}</div>
		<div data-group><h3>Thấp tầng</h3>${grid(low.map(z => zoneCard(z).replace('class="card"', 'class="card card--wide"')), ' zones')}</div>
		${prose(c('phan-khu'), 'phan-khu')}</section>
	<section class="block" id="dong-san-pham">${sechead(T.heads['dong-san-pham'])}${prose(c('dong-san-pham'), 'dong-san-pham')}</section>
	<section class="block" id="mat-bang">${sechead(T.heads['mat-bang'])}${prose(c('mat-bang'), 'mat-bang')}</section>
	<section class="block" id="so-sanh">${sechead(T.heads['so-sanh'])}<div class="table-wrap"><table>${T.compare}</table></div></section>
	<section class="block" id="vi-tri">${sechead(T.heads['vi-tri'])}<p>${esc(T.address)}</p>${map(mpp.map)}${prose(c('vi-tri'), 'vi-tri')}</section>
	<section class="block" id="tien-ich">${sechead(T.heads['tien-ich'])}${prose(c('tien-ich'), 'tien-ich')}</section>
	<section class="block block--dark gallery" id="thu-vien">${sechead(T.heads['thu-vien'])}
		<ul class="gallery__track" aria-label="Ảnh The Global City">${T.gallery.map(g => `<li><figure>${img(g.src, { alt: g.alt, sizes: S.gallery, frame: 16 / 9, plan: /mat-bang/.test(g.src) })}</figure></li>`).join('')}</ul>
		<div class="gallery__nav"><button type="button" data-prev aria-label="Ảnh trước">‹</button><span class="gallery__count" aria-live="polite"></span><button type="button" data-next aria-label="Ảnh sau">›</button></div></section>
	<section class="block" id="tien-do">${sechead(T.heads['tien-do'])}${prose(c('tien-do'), 'tien-do')}<h3>Pháp lý</h3><p>${esc(F.velis_legal)}</p></section>
	<section class="block" id="goc-nhin">${sechead(T.heads['goc-nhin'])}${prose(c('goc-nhin'), 'goc-nhin')}</section>
	<section class="block faq" id="hoi-dap">${sechead(T.heads['hoi-dap'])}${T.faq.map((f, i) => `<details${i ? '' : ' open'}><summary>${esc(f.q)}</summary>${f.a}</details>`).join('')}</section>
	<section class="block" id="bai-viet">${sechead(T.heads['bai-viet'], '<a class="btn btn--text" href="#">Tất cả bài The Global City →</a>')}${grid(T.posts.slice(0, 6).map(p => postCard(p, S.card3side)), ' grid--three')}</section>
	<div class="block"><p class="disclosure mb-0">${esc(T.disclosure)}</p></div>
</div>
${side(T.hero.title, T.side.dl.slice(0, 2))}
</div>
${form(T.form.title, undefined, T.hero.title)}
</main>
${footer()}`;

	/* ---------- Masteri Park Place ---------- */
	const M = mpp;
	const mppBody = `${header()}
<main id="noi-dung" tabindex="-1">
${crumbs(M.hero.crumbs)}
${tabs(M.nav)}
${hero(M.hero, { chips: M.hero.chips, buttons: `<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a>` })}
${facts([['Chủ đầu tư', 'Masterise Homes'], ['Quy mô', M.fields.velis_scale], ['Giá', 'Chưa công bố'], ['Vị trí', M.overview[0][1], '#vi-tri'], ['Diện tích', M.fields.velis_area], ['Bàn giao', M.fields.velis_handover]])}
${advisorInline(M.hero.title, [['Loại sản phẩm', 'Căn hộ'], ['Bàn giao', M.fields.velis_handover]])}
<div class="wrap page">
<div class="page__main">
	<section class="block" id="tong-quan">${sechead(M.heads['tong-quan'])}
		<a class="within" href="the-global-city.html"><span class="within__img">${img(M.within.img, { alt: '', sizes: S.within, frame: 4 / 3, tmp: '' })}</span><div><p class="eyebrow">${esc(M.within.eyebrow)}</p><p class="within__name">${esc(M.within.name)}</p><p class="muted">${esc(M.within.text)}</p></div></a>
		<dl>${M.overview.map(([k, v]) => `<div><dt class="eyebrow">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>
	<section class="block" id="so-sanh">${sechead(M.heads['so-sanh'])}<div class="table-wrap"><table>${dropDupCol(M.compare)}</table></div></section>
	<section class="block" id="vi-tri">${sechead(M.heads['vi-tri'])}${map(M.map)}</section>
	<section class="block" id="bai-viet">${sechead(M.heads['bai-viet'], '<a class="btn btn--text" href="#">Tất cả bài The Global City →</a>')}${grid(M.posts.slice(0, 6).map(p => postCard(p, S.card3side)), ' grid--three')}</section>
	<div class="block"><p class="disclosure mb-0">${esc(M.disclosure)}</p></div>
</div>
${side(M.hero.title, [['Loại sản phẩm', 'Căn hộ'], ['Bàn giao', M.fields.velis_handover]])}
</div>
${form(M.form.title, undefined, M.hero.title)}
</main>
${footer()}`;

	return {
		'trang-chu': page('Velis Realty – Tư vấn bất động sản cao cấp (mockup bước 2)', homeBody),
		'the-global-city': page('The Global City – Velis Realty (mockup bước 2)', tgcBody),
		'masteri-park-place': page('Masteri Park Place – Velis Realty (mockup bước 2)', mppBody),
	};
}
