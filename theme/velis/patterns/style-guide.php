<?php
/**
 * Title: Style guide
 * Slug: velis/style-guide
 * Inserter: no
 *
 * Internal showcase of every DESIGN.md component. Sample data is illustrative only.
 */
$img = function ( $file ) {
	return esc_url( content_url( 'uploads/' . $file ) );
};
$logo = function ( $file ) {
	return esc_url( get_theme_file_uri( 'assets/brand/' . $file ) );
};
$colors = array(
	'ink' => '#1A1A1A', 'body-muted' => '#5C5C5C', 'canvas' => '#FAF8F5', 'surface' => '#FFFFFF', 'surface-sunken' => '#F2EEE8',
	'surface-dark' => '#141414', 'hairline' => '#E4DED5', 'velis-red' => '#B8282E', 'velis-red-hover' => '#9E1F26',
	'champagne' => '#B08D57', 'champagne-text' => '#8A6A3A',
);
?>
<!-- wp:group {"tagName":"main","className":"v-sg","layout":{"type":"constrained","contentSize":"1200px"}} -->
<main class="wp-block-group v-sg">
<!-- wp:html -->
<nav class="v-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Trang chủ</a></li><li><a href="/du-an/">Dự án</a></li><li><a href="#">Đại đô thị mẫu</a></li><li aria-current="page">Phân khu A</li></ol></nav>
<p class="v-eyebrow">Nội bộ · không index · dữ liệu minh họa</p>
<h1>Style guide Velis Realty</h1>
<p class="v-lead">Trưng bày mọi token và thành phần trong DESIGN.md. Tên dự án, giá, ngày trên trang này là dữ liệu minh họa, không phải thông tin bán hàng.</p>

<section class="v-sg__section" id="mau"><p class="v-eyebrow">01 · Màu</p><h2>Bảng màu</h2>
<ul class="v-swatches">
<?php foreach ( $colors as $slug => $hex ) : ?>
<li><span class="v-swatch" style="background:var(--wp--preset--color--<?php echo esc_attr( $slug ); ?>)"></span><b><?php echo esc_html( $slug ); ?></b><code><?php echo esc_html( $hex ); ?></code></li>
<?php endforeach; ?>
</ul></section>

<section class="v-sg__section" id="chu"><p class="v-eyebrow">02 · Chữ</p><h2>Thang chữ</h2>
<div class="v-type-scale">
<p class="has-heading-1-font-size v-serif">H1 · Tư vấn bất động sản cao cấp</p>
<p class="has-heading-2-font-size v-serif">H2 · Đại đô thị và các phân khu</p>
<p class="has-heading-3-font-size v-strong">H3 · Dòng sản phẩm căn hộ 2 phòng ngủ</p>
<p class="has-heading-4-font-size v-strong">H4 · Pháp lý và tiến độ bàn giao</p>
<p class="has-body-font-size">Nội dung 18/17 px · Nhà đầu tư cần đọc kỹ pháp lý, dòng tiền và giá vốn thực trước khi xuống tiền. Đoạn văn giới hạn 68 ký tự mỗi dòng để dễ đọc.</p>
<p class="has-caption-font-size">Chú thích 14 px · Ảnh phối cảnh minh họa – nguồn: CĐT · cập nhật 04/11/2026</p>
<p class="v-price">Giá từ <span>12.500.000.000 ₫</span> · 85,4 m² · 2 PN</p>
</div></section>

<section class="v-sg__section" id="nut"><p class="v-eyebrow">03 · Nút</p><h2>Nút và liên kết</h2>
<div class="v-row">
<a class="v-btn" href="#tu-van">Nhận bảng giá</a>
<a class="v-btn v-btn--secondary" href="#">Xem phân khu</a>
<a class="v-btn v-btn--text" href="#">Đọc phân tích của CEO</a>
<button class="v-btn" type="button" disabled>Đã hết hàng</button>
</div>
<p>Liên kết trong đoạn văn: <a href="#">pháp lý Phân khu A</a>. Dùng Tab để xem viền focus.</p>
</section>
<!-- /wp:html -->

<!-- wp:paragraph {"className":"v-eyebrow"} --><p class="v-eyebrow">Khối core WordPress dùng chung token</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#">Nút core chính</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-secondary"} --><div class="wp-block-button is-style-secondary"><a class="wp-block-button__link wp-element-button" href="#">Nút core phụ</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-text"} --><div class="wp-block-button is-style-text"><a class="wp-block-button__link wp-element-button" href="#">Nút core dạng chữ</a></div><!-- /wp:button --></div><!-- /wp:buttons -->

<!-- wp:html -->
<section class="v-sg__section" id="the"><p class="v-eyebrow">04 · Thẻ</p><h2>Thẻ dự án, chủ đầu tư, bài viết</h2>
<div class="v-grid v-grid--3">
	<article class="v-card v-reveal">
		<a class="v-card__media" href="#"><img src="<?php echo $img( '2026/06/phoi-canh-palm-river-1.webp' ); ?>" alt="Phối cảnh dự án minh họa" width="800" height="600" loading="lazy"></a>
		<div class="v-card__body"><span class="v-badge v-badge--open">Đang bán</span>
		<h3 class="v-card__title"><a href="#">Dự án mẫu A</a></h3>
		<p class="v-card__meta">Chủ đầu tư mẫu · TP. Thủ Đức</p>
		<p class="v-price">Giá từ <span>8,9 tỷ</span> <small>cập nhật 01/11/2026</small></p></div>
	</article>
	<article class="v-card v-card--developer v-reveal">
		<div class="v-card__logo"><img src="<?php echo $logo( 'velis-mark.svg' ); ?>" alt="" width="59" height="48"></div>
		<div class="v-card__body"><h3 class="v-card__title"><a href="#">Chủ đầu tư mẫu</a></h3>
		<p class="v-card__meta">4 dự án đang tư vấn · Khu Đông TP.HCM</p>
		<a class="v-btn v-btn--text" href="#">Xem chủ đầu tư</a></div>
	</article>
	<article class="v-card v-card--post v-reveal">
		<a class="v-card__media v-card__media--wide" href="#"><img src="<?php echo $img( '2026/06/tien-do-palm-city.webp' ); ?>" alt="Ảnh tiến độ minh họa" width="800" height="450" loading="lazy"></a>
		<div class="v-card__body"><p class="v-eyebrow">Nhận định thị trường</p>
		<h3 class="v-card__title"><a href="#">Chu kỳ giá căn hộ ven sông: đọc thế nào cho đúng</a></h3>
		<p class="v-card__meta">Vũ Xuân · 04/11/2026 · 8 phút đọc</p></div>
	</article>
</div></section>

<section class="v-sg__section" id="thong-tin"><p class="v-eyebrow">05 · Dữ liệu dự án</p><h2>Thanh thông tin nhanh</h2>
<dl class="v-facts">
	<div><dt>Vị trí</dt><dd>TP. Thủ Đức</dd></div><div><dt>Quy mô</dt><dd>30 ha · 12 tháp</dd></div>
	<div><dt>Sản phẩm</dt><dd>Căn hộ, nhà phố</dd></div><div><dt>Bàn giao</dt><dd>Quý 4/2027</dd></div>
	<div><dt>Pháp lý</dt><dd>Đã có GPXD</dd></div><div><dt>Giá tham khảo</dt><dd class="v-price">từ 85 tr/m² <small>01/11/2026</small></dd></div>
</dl>

<h2 id="bang-gia">Bảng giá / thông số</h2>
<div class="v-table-wrap"><table class="v-table">
<caption>Thông số dòng sản phẩm (minh họa)</caption>
<thead><tr><th scope="col">Loại căn</th><th scope="col" class="num">Diện tích (m²)</th><th scope="col" class="num">Phòng ngủ</th><th scope="col">Hướng</th><th scope="col" class="num">Giá từ</th></tr></thead>
<tbody><tr><th scope="row">1 PN</th><td class="num">52,0 – 56,5</td><td class="num">1</td><td>Đông Nam</td><td class="num">5,2 tỷ</td></tr>
<tr><th scope="row">2 PN</th><td class="num">75,0 – 85,4</td><td class="num">2</td><td>Tây Bắc</td><td class="num">7,8 tỷ</td></tr>
<tr><th scope="row">Duplex</th><td class="num">140,2 – 168,0</td><td class="num">3</td><td>Đông</td><td class="num">16,4 tỷ</td></tr></tbody>
</table></div>
<p class="v-source">Nguồn: thông báo của CĐT ngày 01/11/2026 (minh họa). Giá có thể thay đổi.</p>
</section>

<section class="v-sg__section" id="dong-san-pham"><p class="v-eyebrow">06 · Tab dòng sản phẩm</p><h2>Dòng sản phẩm</h2>
<div class="v-tabs" data-tabs>
	<div class="v-tabs__list" role="tablist" aria-label="Dòng sản phẩm" hidden>
		<button role="tab" type="button" aria-controls="can-2pn">Căn 2 PN</button><button role="tab" type="button" aria-controls="penthouse">Penthouse</button><button role="tab" type="button" aria-controls="shophouse">Shophouse</button>
	</div>
	<section class="v-tabs__panel" id="can-2pn" role="tabpanel" tabindex="0"><h3>Căn 2 PN</h3><div class="v-split"><img src="<?php echo $img( '2026/06/layout-2pn-palm-river.webp' ); ?>" alt="Mặt bằng căn 2 phòng ngủ minh họa" width="640" height="480" loading="lazy"><div><p class="v-price">Giá từ <span>7,8 tỷ</span> <small>01/11/2026</small></p><p><b>Phù hợp với ai:</b> gia đình trẻ cần ở thực, ngân sách 7–9 tỷ.</p><a class="v-btn" href="#tu-van" data-interest="Phân khu A – Căn 2 PN">Nhận bảng giá Căn 2 PN</a></div></div></section>
	<section class="v-tabs__panel" id="penthouse" role="tabpanel" tabindex="0"><h3>Penthouse</h3><p class="v-price">Giá từ <span>32 tỷ</span> <small>01/11/2026</small></p><p><b>Phù hợp với ai:</b> khách tìm không gian riêng tầng cao, ưu tiên tầm nhìn.</p><a class="v-btn" href="#tu-van" data-interest="Phân khu A – Penthouse">Nhận bảng giá Penthouse</a></section>
	<section class="v-tabs__panel" id="shophouse" role="tabpanel" tabindex="0"><h3>Shophouse</h3><p>Trường để trống thì ẩn, không ghi "đang cập nhật".</p><a class="v-btn" href="#tu-van" data-interest="Phân khu A – Shophouse">Nhận bảng giá Shophouse</a></section>
</div></section>

<section class="v-sg__section" id="listing"><p class="v-eyebrow">07 · Listing phân khu</p><h2>Các phân khu của đại đô thị mẫu</h2>
<div class="v-listing" data-listing>
	<div class="v-listing__bar">
		<div class="v-seg" role="group" aria-label="Chế độ xem"><button type="button" aria-pressed="true" data-view="zones">Theo phân khu</button><button type="button" aria-pressed="false" data-view="types">Theo loại sản phẩm</button></div>
		<button class="v-btn v-btn--secondary v-listing__open" type="button" data-open="v-filter">Bộ lọc</button>
	</div>
	<dialog class="v-drawer" id="v-filter" aria-label="Bộ lọc"><form method="dialog" class="v-filter" data-filter>
		<fieldset><legend>Loại sản phẩm</legend>
		<label><input type="checkbox" name="loai" value="can-ho"> Căn hộ</label><label><input type="checkbox" name="loai" value="nha-pho"> Nhà phố</label><label><input type="checkbox" name="loai" value="shophouse"> Shophouse</label></fieldset>
		<fieldset><legend>Trạng thái</legend><label><input type="checkbox" name="trang-thai" value="dang-ban"> Đang bán</label><label><input type="checkbox" name="trang-thai" value="sap-mo"> Sắp mở bán</label></fieldset>
		<div class="v-row"><button class="v-btn" value="apply">Xem kết quả</button><button class="v-btn v-btn--text" type="reset">Bỏ lọc</button></div>
	</form></dialog>
	<div data-panel="zones">
	<p class="v-eyebrow">Cao tầng</p>
	<div class="v-grid v-grid--2">
		<article class="v-card v-zone" data-loai="can-ho shophouse" data-trang-thai="dang-ban">
			<a class="v-card__media" href="#"><img src="<?php echo $img( '2026/05/vinhomes-saigon-park-3.webp' ); ?>" alt="Phối cảnh phân khu minh họa" width="800" height="600" loading="lazy"></a>
			<div class="v-card__body"><span class="v-badge v-badge--open">Đang bán</span><h3 class="v-card__title"><a href="#">Phân khu A</a></h3>
			<ul class="v-chips"><li>1 PN</li><li>2 PN</li><li>Duplex</li><li>Shophouse khối đế</li></ul>
			<p class="v-card__meta">52–168 m² · bàn giao Q4/2027</p><p class="v-price">Giá từ <span>5,2 tỷ</span> <small>01/11/2026</small></p>
			<div class="v-row"><a class="v-btn v-btn--secondary" href="#">Xem phân khu</a><a class="v-btn" href="#tu-van">Nhận bảng giá</a></div></div>
		</article>
		<article class="v-card v-zone" data-loai="nha-pho" data-trang-thai="sap-mo">
			<a class="v-card__media" href="#"><img src="<?php echo $img( '2026/05/thap-tang-vinhomes-saigon-park.webp' ); ?>" alt="Phối cảnh thấp tầng minh họa" width="800" height="600" loading="lazy"></a>
			<div class="v-card__body"><span class="v-badge v-badge--soon">Sắp mở bán</span><h3 class="v-card__title"><a href="#">Phân khu B</a></h3>
			<ul class="v-chips"><li>Nhà phố</li><li>Biệt thự</li></ul>
			<p class="v-card__meta">120–300 m² đất · bàn giao 2028</p>
			<div class="v-row"><a class="v-btn v-btn--secondary" href="#">Xem phân khu</a><a class="v-btn" href="#tu-van">Nhận bảng giá</a></div></div>
		</article>
	</div>
	<div class="v-empty" hidden data-empty><p><b>Chưa có sản phẩm phù hợp.</b> Bỏ bớt điều kiện lọc, hoặc để lại nhu cầu, Velis báo khi có hàng.</p><button class="v-btn v-btn--secondary" type="button" data-reset>Bỏ lọc</button></div>
	</div>
	<div data-panel="types" hidden>
	<h3>Tất cả căn 2 PN</h3>
	<div class="v-table-wrap v-table-wrap--pin"><table class="v-table">
	<thead><tr><th scope="col">Phân khu</th><th scope="col" class="num">Diện tích</th><th scope="col" class="num">Giá từ</th><th scope="col">Bàn giao</th><th scope="col">Trạng thái</th></tr></thead>
	<tbody><tr><th scope="row"><a href="#can-2pn">Phân khu A</a></th><td class="num">75–85 m²</td><td class="num">7,8 tỷ</td><td>Q4/2027</td><td>Còn hàng</td></tr>
	<tr><th scope="row"><a href="#can-2pn">Phân khu C</a></th><td class="num">70–80 m²</td><td class="num">6,9 tỷ</td><td>Q2/2028</td><td>Sắp mở</td></tr></tbody></table></div>
	</div>
</div></section>

<section class="v-sg__section" id="so-sanh"><p class="v-eyebrow">08 · Bảng so sánh</p><h2>So sánh phân khu</h2>
<div class="v-table-wrap v-table-wrap--pin" tabindex="0" role="region" aria-label="Bảng so sánh phân khu, cuộn ngang"><table class="v-table v-table--compare">
<thead><tr><th scope="col">Tiêu chí</th><th scope="col">Phân khu A</th><th scope="col">Phân khu B</th><th scope="col">Phân khu C</th></tr></thead>
<tbody><tr><th scope="row">Loại sản phẩm</th><td>Căn hộ, duplex</td><td>Nhà phố, biệt thự</td><td>Căn hộ</td></tr>
<tr><th scope="row">Diện tích</th><td>52–168 m²</td><td>120–300 m²</td><td>48–110 m²</td></tr>
<tr><th scope="row">Giá từ</th><td class="v-price">5,2 tỷ</td><td>—</td><td class="v-price">4,6 tỷ</td></tr>
<tr><th scope="row">Bàn giao</th><td>Q4/2027</td><td>2028</td><td>Q2/2028</td></tr>
<tr><th scope="row">Pháp lý</th><td>Đã có GPXD</td><td>Đang hoàn thiện</td><td>Đã có GPXD</td></tr>
<tr><th scope="row">Phù hợp với</th><td>Ở thực, gia đình trẻ</td><td>Tích sản dài hạn</td><td>Cho thuê</td></tr></tbody></table></div>
</section>

<section class="v-sg__section" id="hinh-anh"><p class="v-eyebrow">09 · Ảnh, bản đồ, tiến độ</p><h2>Thư viện ảnh</h2>
<ul class="v-gallery" data-gallery>
<?php foreach ( array( 'tien-do-palm-city', 'tien-do-palm-city-2', 'tien-do-palm-city-3', 'tien-do-palm-city-4' ) as $i => $f ) : ?>
<li><a href="<?php echo $img( "2026/06/$f.webp" ); ?>"><img src="<?php echo $img( "2026/06/$f.webp" ); ?>" alt="Ảnh tiến độ minh họa <?php echo (int) $i + 1; ?>" width="800" height="600" loading="lazy"></a></li>
<?php endforeach; ?>
</ul>
<dialog class="v-lightbox" aria-label="Xem ảnh"><form method="dialog"><button class="v-lightbox__close" aria-label="Đóng">×</button></form><img alt=""></dialog>

<h2>Bản đồ (tải khi bấm)</h2>
<div class="v-map" data-map="https://www.google.com/maps?q=34+L%C6%B0%C6%A1ng+%C4%90%E1%BB%8Bnh+C%E1%BB%A7a&amp;output=embed">
	<img src="<?php echo $img( '2026/06/vi-tri-palm-river.webp' ); ?>" alt="Ảnh tĩnh vị trí minh họa" width="1200" height="675" loading="lazy">
	<button class="v-btn" type="button">Mở bản đồ tương tác</button>
</div>

<h2>Tiến độ</h2>
<ol class="v-timeline">
	<li><time datetime="2026-03">03/2026</time><p><b>Khởi công</b> – lễ động thổ phân khu A.</p></li>
	<li><time datetime="2026-08">08/2026</time><p><b>Xong móng</b> – ảnh thực tế chụp 20/08/2026.</p></li>
	<li class="is-next"><time datetime="2027-12">Q4/2027</time><p><b>Bàn giao dự kiến</b> theo thông báo CĐT.</p></li>
</ol></section>

<section class="v-sg__section" id="noi-dung"><p class="v-eyebrow">10 · Nội dung &amp; tin cậy</p><h2>Mục lục, FAQ, tác giả, công bố</h2>
<details class="v-toc" open><summary>Mục lục</summary><ol><li><a href="#mau">Bảng màu</a></li><li><a href="#the">Thẻ</a></li><li><a href="#listing">Listing phân khu</a></li><li><a href="#form">Form tư vấn</a></li></ol></details>
<div class="v-faq">
<details><summary>Pháp lý phân khu này đã đủ để ký hợp đồng mua bán chưa?</summary><p>Câu trả lời minh họa: cần kiểm tra giấy phép xây dựng và văn bản đủ điều kiện bán nhà ở hình thành trong tương lai.</p></details>
<details><summary>Có được vay ngân hàng không?</summary><p>Câu trả lời minh họa: tùy chính sách từng đợt của CĐT và ngân hàng bảo lãnh.</p></details>
</div>
<aside class="v-author"><img src="<?php echo $logo( 'velis-mark.svg' ); ?>" alt="" width="72" height="59"><div><p class="v-eyebrow">Tác giả</p><p class="v-author__name"><a href="/chuyen-gia/vu-xuan/">Vũ Xuân</a> · CEO Velis Realty</p><p>Tư vấn bất động sản cao cấp khu Đông TP.HCM, phân tích theo dòng tiền và giá vốn thực.</p></div></aside>
<aside class="v-disclosure" role="note"><p>Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p></aside>
<nav class="v-pagination" aria-label="Phân trang"><a href="#" aria-label="Trang trước">‹</a><a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a><a href="#" aria-label="Trang sau">›</a></nav>
</section>

<section class="v-sg__section" id="menu"><p class="v-eyebrow">11 · Menu lớn</p><h2>Mega menu Dự án</h2>
<details class="v-mega" open><summary>Dự án</summary><div class="v-mega__panel">
	<div><p class="v-eyebrow">Chủ đầu tư mẫu 1</p><ul><li><a href="#">Đại đô thị mẫu</a><ul><li><a href="#">Phân khu A</a></li><li><a href="#">Phân khu B</a></li></ul></li></ul></div>
	<div><p class="v-eyebrow">Chủ đầu tư mẫu 2</p><ul><li><a href="#">Dự án độc lập mẫu</a></li></ul></div>
	<div><p class="v-eyebrow">Theo khu vực</p><ul><li><a href="#">TP. Thủ Đức</a></li><li><a href="#">Quận 7</a></li></ul></div>
</div></details></section>

<section class="v-sg__section" id="form"><p class="v-eyebrow">12 · Form</p><h2 id="tu-van">Nhận tư vấn</h2>
<form class="v-form" novalidate data-form>
	<p class="v-field"><label for="sg-name">Họ và tên</label><input id="sg-name" name="name" autocomplete="name" required></p>
	<p class="v-field"><label for="sg-phone">Số điện thoại</label><input id="sg-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9 +.]{9,15}" aria-describedby="sg-phone-err"><span class="v-field__error" id="sg-phone-err" hidden>Vui lòng nhập số điện thoại 9–15 chữ số.</span></p>
	<p class="v-field"><label for="sg-interest">Quan tâm</label><input id="sg-interest" name="interest" value="Phân khu A"></p>
	<p class="v-field"><label for="sg-zone">Phân khu</label><select id="sg-zone" name="zone"><option>Phân khu A</option><option>Phân khu B</option></select></p>
	<p class="v-check"><input id="sg-consent" type="checkbox" required><label for="sg-consent">Tôi đồng ý để Velis Realty xử lý dữ liệu cá nhân nhằm tư vấn, theo <a href="/chinh-sach-bao-mat/">chính sách bảo mật</a>.</label></p>
	<button class="v-btn" type="submit">Gửi yêu cầu</button>
	<p class="v-form__ok" role="status" hidden>Đã nhận. Velis sẽ gọi lại trong giờ làm việc (minh họa, form này không gửi đi đâu).</p>
</form></section>

<section class="v-sg__section" id="logo"><p class="v-eyebrow">13 · Logo</p><h2>Bộ logo SVG</h2>
<div class="v-logos"><div><img src="<?php echo $logo( 'velis-logo-horizontal.svg' ); ?>" alt="Logo ngang" width="261" height="60"></div><div class="is-dark"><img src="<?php echo $logo( 'velis-logo-horizontal-white.svg' ); ?>" alt="Logo ngang bản trắng" width="261" height="60"></div><div><img src="<?php echo $logo( 'velis-logo-vertical.svg' ); ?>" alt="Logo dọc" width="160" height="140"></div><div><img src="<?php echo $logo( 'favicon.svg' ); ?>" alt="Favicon" width="48" height="48"></div></div>
</section>
<!-- /wp:html -->
</main>
<!-- /wp:group -->
