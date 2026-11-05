// Page markup for the 3 mockup pages – plain JS template strings, no framework. Text comes verbatim from
// data/*.json + content/*.html (extracted read-only from staging by tools/mockup_extract.mjs).
// `img(ref, opts)` is supplied by tools/build_mockup.mjs (srcset, sizes per X-01, crop per X-03, "ảnh tạm" tag).
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PHONE = '0911 237 979';

// sizes presets: [media query, slot width]; the last entry has no query
const S = {
	heroB: [['(min-width: 1024px)', '1120px'], ['(min-width: 768px)', '760px'], ['', '(100vw - 32px)']],
	card3: [['(min-width: 1024px)', '380px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	card3side: [['(min-width: 1024px)', '250px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	card2side: [['(min-width: 1024px)', '390px'], ['(min-width: 768px)', '(50vw - 36px)'], ['', '(100vw - 32px)']],
	wide: [['(min-width: 1024px)', '440px'], ['(min-width: 768px)', '(55vw - 40px)'], ['', '(100vw - 32px)']],
	thumb: [['', '96px']],
	within: [['', '120px']],
	half: [['(min-width: 1024px)', '(50vw - 64px)'], ['', '(100vw - 32px)']],
	read: [['(min-width: 768px)', '720px'], ['', '(100vw - 32px)']],
	gallery: [['(min-width: 1024px)', '820px'], ['', '86vw']],
};

export function render({ home, tgc, mpp, content, img, logo, logoWhite }) {
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

	const footer = () => {
		const [brand, explore, apps, follow] = home.footer.cols;
		const [copy, policy] = home.footer.bottom.split(/\n+/);
		const social = ['Facebook', 'YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'X', 'Pinterest'];
		return `
<footer class="footer"><div class="wrap">
	<div class="footer__grid">
		<div><img src="${logoWhite}" width="174" height="40" alt="Velis Realty"><p>${esc(brand[0])}</p><p><a href="#">${esc(brand[1])}</a><br><a href="#">${esc(brand[2])}</a><br>${esc(brand[3])}<br>${esc(brand[4])}</p></div>
		<nav aria-label="Khám phá"><p class="eyebrow">${esc(explore[0])}</p><ul>${explore.slice(1).map(x => `<li><a href="#">${esc(x)}</a></li>`).join('')}</ul></nav>
		<nav aria-label="Ứng dụng"><p class="eyebrow">${esc(apps[0])}</p><ul>${apps.slice(1).map(x => `<li><a href="#">${esc(x)}</a></li>`).join('')}</ul></nav>
		<div><p class="eyebrow">${esc(follow[0])}</p><ul class="footer__social">${social.map(x => `<li><a href="#" aria-label="Velis Realty trên ${x}">${x}</a></li>`).join('')}</ul></div>
	</div>
	<div class="footer__bottom"><p class="mb-0">${esc(copy)}</p><a href="#">${esc(policy)}</a></div>
</div></footer>
<nav class="cta" aria-label="Liên hệ nhanh"><a href="#">${esc(home.cta[0])}</a><a href="#">${esc(home.cta[1])}</a><a href="#tu-van">${esc(home.cta[2])}</a></nav>
<aside class="mk" aria-label="Công tắc mockup"><div class="wrap">
	<p><b>Mockup bước 2</b> – công tắc chỉ dùng để duyệt, không đưa vào theme.</p>
	<div class="mk__row">Hero: <button type="button" data-mk-hero="a">A – tràn</button><button type="button" data-mk-hero="b">B – khung có lề</button>
	&nbsp; Nhãn ảnh tạm: <button type="button" data-mk-tam="1">Hiện</button><button type="button" data-mk-tam="0">Ẩn</button></div>
</div></aside>`;
	};

	const form = (title, lead) => {
		const f = home.form;
		return `
<section class="section section--tint" id="tu-van" aria-labelledby="tu-van-h"><div class="wrap contact">
	<div><p class="eyebrow">${esc(f.eyebrow)}</p><h2 id="tu-van-h">${esc(title)}</h2><p>${esc(lead ?? f.lead)}</p>
		<dl>${f.contact.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
	<form class="form" novalidate>
		<div class="form__row">
			<p class="field"><label for="ten">Họ và tên</label><input id="ten" name="ten" autocomplete="name" required data-rule="name" aria-describedby="ten-loi"><span class="field__error" id="ten-loi" hidden></span></p>
			<p class="field"><label for="sdt">Số điện thoại</label><input id="sdt" name="sdt" type="tel" inputmode="tel" autocomplete="tel" required data-rule="phone" aria-describedby="sdt-loi"><span class="field__error" id="sdt-loi" hidden></span></p>
		</div>
		<div class="check"><input id="dong-y" type="checkbox" data-rule="consent" aria-describedby="dong-y-loi"><div><label for="dong-y">${esc(f.consent)}</label><p class="field__error" id="dong-y-loi" hidden></p></div></div>
		<p class="mb-0"><button class="btn" type="submit">${esc(f.submit)}</button></p>
		<p class="mb-0 muted" role="status"></p>
	</form>
</div></section>`;
	};

	// hero: same text/button structure for A and B; B is the default, ?hero=a switches before the image is chosen
	const hero = (h, { lead, chips, buttons }) => `
<section class="hero hero--b" aria-labelledby="h1">
	<figure class="hero__media">${img(h.img, { alt: h.alt, sizes: S.heroB, frame: 16 / 9, lcp: true, tmp: 'ảnh tạm – ảnh thật sẽ nét' })}<script>if(/[?&]hero=a(&|$)/.test(location.search)){const s=document.currentScript;s.closest('.hero').classList.replace('hero--b','hero--a');s.parentNode.querySelector('img').sizes='100vw'}</script></figure>
	<div class="hero__body wrap">
		<p class="eyebrow">${esc(h.eyebrow)}</p>
		<h1 id="h1">${esc(h.title)}</h1>
		${lead ? `<p class="hero__lead">${esc(lead)}</p>` : ''}
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
	${c.img ? `<div class="card__media">${img(c.img, { alt: '', sizes, frame })}</div>` : `<div class="card__media card__media--empty"><span>${esc(c.title)}</span></div>`}
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
	const side = (name, dl) => `<aside class="page__side" aria-label="Nhận bảng giá"><div class="pricecard"><div class="pricecard__body">
	<p class="eyebrow">NHẬN BẢNG GIÁ</p><p class="pricecard__title">${esc(name)}</p>
	<dl>${dl.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
	<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a><a class="btn btn--text" href="#">Zalo</a>
</div></div></aside>`;
	const map = (m, extra = '') => `<figure class="map">${img(m.img, { alt: m.alt, sizes: S.read, frame: 16 / 9 })}<a class="btn btn--line" href="#">Xem trên Google Maps</a></figure>${extra}<p class="source">${esc(m.source)}</p>`;
	const page = (title, body) => ({ title, body });

	/* ---------- Trang chủ ---------- */
	const H = home;
	const homeBody = `${header()}
<main id="noi-dung">
${hero(H.hero, { lead: H.hero.lead, buttons: `<a class="btn" href="#tu-van">${esc(H.hero.buttons[0])}</a><a class="btn btn--line" href="#du-an">${esc(H.hero.buttons[1])}</a>` })}
<section class="section section--tight" aria-labelledby="noi-bat-h"><div class="wrap">
	<p class="eyebrow" id="noi-bat-h">DỰ ÁN NỔI BẬT</p>
	<div class="rail" data-n="${H.feats.length}">${H.feats.map(f => `<a class="feat" href="#"><span class="feat__img">${img(f.img, { alt: '', sizes: S.thumb, frame: 4 / 3, tmp: '' })}</span><span><b>${esc(f.name)}</b><small>${esc(f.meta)}</small></span></a>`).join('')}</div>
	<dl class="numbers">${H.numbers.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</div></section>
<section class="section" id="du-an" aria-labelledby="du-an-h"><div class="wrap">
	<header class="sechead sechead--row"><div><p class="eyebrow">DỰ ÁN</p><h2 id="du-an-h">Dự án đang tư vấn</h2></div><a class="btn btn--text" href="#">Xem dự án →</a></header>
	${grid(H.projects.map(p => { const [lead, ...rest] = p.lines; return card({ ...p, img: p.noimg ? '' : p.img }, S.card3, { kicker: lead, lines: [rest.join(' · ')], more: 'Xem dự án →' }); }), ' grid--three')}
</div></section>
<section class="section section--tint" aria-labelledby="ve-velis-h"><div class="wrap split">
	<div class="card__media about__media">${img(H.about.img, { alt: H.about.alt, sizes: S.half, frame: 3 / 2 })}</div>
	<div><p class="eyebrow">${esc(H.about.eyebrow)}</p><h2 id="ve-velis-h">${esc(H.about.title)}</h2><blockquote class="quote">${esc(H.about.quote)}</blockquote><a class="btn btn--line" href="#">${esc(H.about.button)}</a></div>
</div></section>
<section class="section" aria-labelledby="cdt-h"><div class="wrap">
	${sechead({ ...H.sections[1] }, `<a class="btn btn--text" href="#">${esc(H.sections[1].more)} →</a>`).replace('<h2>', '<h2 id="cdt-h">')}
	<ul class="devs">${H.devs.map(([d, p]) => `<li><b>${esc(d)}</b><span class="muted">${esc(p)}</span></li>`).join('')}</ul>
</div></section>
<section class="section section--tint" aria-labelledby="bai-h"><div class="wrap">
	${sechead(H.sections[2], `<a class="btn btn--text" href="#">${esc(H.sections[2].more)} →</a>`).replace('<h2>', '<h2 id="bai-h">')}
	${grid(H.posts.map(p => postCard(p, S.card3)))}
</div></section>
${form(H.form.title, H.form.lead).replace('section--tint', '')}
</main>
${footer()}`;

	/* ---------- The Global City ---------- */
	const T = tgc, F = T.fields;
	const zoneCard = z => card({ ...z, img: z.noimg || !z.img ? '' : z.img }, S.card2side, { lines: z.lines, more: 'Xem phân khu →' })
		.replace('<article class="card">', `<article class="card" data-loai="${z.title.startsWith('Thấp tầng') ? 'biet-thu dinh-thu shophouse' : 'can-ho'}">`);
	const high = T.zones.filter(z => !z.title.startsWith('Thấp tầng')), low = T.zones.filter(z => z.title.startsWith('Thấp tầng'));
	const c = k => content[`tgc-${k}`];
	const tgcBody = `${header()}
<main id="noi-dung">
${crumbs(T.hero.crumbs)}
${tabs(T.nav)}
${hero(T.hero, { chips: T.hero.chips, buttons: `<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a>` })}
${facts([['Vị trí', F.velis_address, '#vi-tri'], ['Chủ đầu tư', 'Masterise Homes'], ['Quy mô', F.velis_scale], ['Số phân khu', '5'], ['Sản phẩm', 'Biệt thự, Căn hộ, Nhà phố liền kề, Shophouse'], ['Bàn giao', T.side.dl[1][1]], ['Pháp lý', F.velis_legal.replace(/^Hình thức sở hữu:\s*/, '')], ['Giá', 'Chưa công bố']])}
<div class="wrap page">
<div class="page__main">
	<section class="block" id="tong-quan">${sechead(T.heads['tong-quan'])}${prose(c('tong-quan'), 'tong-quan')}</section>
	<section class="block" id="phan-khu">${sechead(T.heads['phan-khu'])}
		<div class="zfilter" data-filter=".zones"><p class="muted mb-0" data-count aria-live="polite">Hiển thị ${T.zones.length}/${T.zones.length} phân khu</p>
			<div class="actions" role="group" aria-label="Lọc theo loại sản phẩm">${[['can-ho', 'Căn hộ'], ['biet-thu', 'Biệt thự'], ['dinh-thu', 'Dinh thự'], ['shophouse', 'Shophouse']].map(([v, t]) => `<button class="chip" type="button" value="${v}" aria-pressed="false">${t}</button>`).join('')}<button class="btn btn--text" type="button" data-clear>Xóa lọc</button></div></div>
		<div data-group><p class="eyebrow">CAO TẦNG</p>${grid(high.map(zoneCard), ' zones')}</div>
		<div data-group><p class="eyebrow">THẤP TẦNG</p>${grid(low.map(z => zoneCard(z).replace('class="card"', 'class="card card--wide"')), ' zones')}</div>
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
${form(T.form.title)}
</main>
${footer()}`;

	/* ---------- Masteri Park Place ---------- */
	const M = mpp;
	const mppBody = `${header()}
<main id="noi-dung">
${crumbs(M.hero.crumbs)}
${tabs(M.nav)}
${hero(M.hero, { chips: M.hero.chips, buttons: `<a class="btn" href="#tu-van">Nhận bảng giá</a><a class="btn btn--line" href="#">Gọi ${PHONE}</a>` })}
${facts([['Vị trí', M.overview[0][1], '#vi-tri'], ['Chủ đầu tư', 'Masterise Homes'], ['Quy mô', M.fields.velis_scale], ['Diện tích', M.fields.velis_area], ['Bàn giao', M.fields.velis_handover], ['Giá', 'Chưa công bố']])}
<div class="wrap page">
<div class="page__main">
	<section class="block" id="tong-quan">${sechead(M.heads['tong-quan'])}
		<a class="within" href="the-global-city.html"><span class="within__img">${img(M.within.img, { alt: '', sizes: S.within, frame: 4 / 3, tmp: '' })}</span><div><p class="eyebrow">${esc(M.within.eyebrow)}</p><p class="within__name">${esc(M.within.name)}</p><p class="muted">${esc(M.within.text)}</p></div></a>
		<dl>${M.overview.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>
	<section class="block" id="so-sanh">${sechead(M.heads['so-sanh'])}<div class="table-wrap"><table>${dropDupCol(M.compare)}</table></div></section>
	<section class="block" id="vi-tri">${sechead(M.heads['vi-tri'])}${map(M.map)}</section>
	<section class="block" id="bai-viet">${sechead(M.heads['bai-viet'], '<a class="btn btn--text" href="#">Tất cả bài The Global City →</a>')}${grid(M.posts.slice(0, 6).map(p => postCard(p, S.card3side)), ' grid--three')}</section>
	<div class="block"><p class="disclosure mb-0">${esc(M.disclosure)}</p></div>
</div>
${side(M.hero.title, [['Loại sản phẩm', 'Căn hộ'], ['Bàn giao', M.fields.velis_handover]])}
</div>
${form(M.form.title)}
</main>
${footer()}`;

	return {
		'trang-chu': page('Velis Realty – Tư vấn bất động sản cao cấp (mockup bước 2)', homeBody),
		'the-global-city': page('The Global City – Velis Realty (mockup bước 2)', tgcBody),
		'masteri-park-place': page('Masteri Park Place – Velis Realty (mockup bước 2)', mppBody),
	};
}
