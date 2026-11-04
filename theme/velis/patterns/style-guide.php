<?php
/**
 * Title: Style guide
 * Slug: velis/style-guide
 * Inserter: no
 *
 * Internal showcase of every DESIGN.md component, filled with real data already published on velisrealty.vn
 * (The Privé pillar page, Vinhomes Saigon Park pillar page). Prices marked "rumor/dự kiến" on the site are NOT shown.
 */

$up = function ( $path ) {
	return esc_url( content_url( 'uploads/' . $path ) );
};
$theme = function ( $path ) {
	return esc_url( get_theme_file_uri( $path ) );
};
$none = 'Chưa công bố';

// The Privé – source: velisrealty.vn/can-ho-the-prive/ (Velis, đăng 09/04/2026).
$prive = array(
	'name'     => 'The Privé',
	'dev'      => 'Tập đoàn Đất Xanh',
	'market'   => 'Nam Rạch Chiếc · Khu Đông',
	'address'  => 'Khu dân cư Nam Rạch Chiếc, phường Bình Trưng (trước đây phường An Phú, Quận 2), TP.HCM',
	'scale'    => '6,7 ha · 12 tháp · hơn 3.000 căn',
	'products' => 'Căn hộ 1–3 PN',
	'handover' => 'Quý 1/2028',
	'legal'    => 'Đủ điều kiện bán (04/2026)',
	'updated'  => '09/04/2026',
	'url'      => '/can-ho-the-prive/',
);
$lines = array(
	array( 'id' => 'can-1pn', 'label' => 'Căn 1 PN', 'area' => '49 m²', 'beds' => '1', 'img' => '2026/04/can-ho-1pn-the-prive-1024x683.webp', 'note' => 'Bếp mở nối liền phòng khách, ban công rộng.', 'fit' => '' ),
	array( 'id' => 'can-2pn', 'label' => 'Căn 2 PN', 'area' => '71–85 m²', 'beds' => '2', 'img' => '2026/04/can-ho-2pn-the-prive.webp', 'note' => 'Hai phòng ngủ đều có cửa sổ lớn.', 'fit' => '' ),
	array( 'id' => 'can-3pn', 'label' => 'Căn 3 PN', 'area' => '95 m²', 'beds' => '3', 'img' => '2026/04/can-ho-3pn-the-prive.webp', 'note' => 'Căn góc, view sông hai mặt, phòng ngủ chính có bồn tắm nằm.', 'fit' => 'Tích sản dài hạn; nhóm khách thuê chuyên gia nước ngoài (nhận định của Vũ Xuân trên trang dự án).' ),
);
$gallery = array(
	array( 'can-ho-the-prive.webp', 'Phối cảnh tổng thể dự án The Privé' ),
	array( 'the-prive-rach-chiec.webp', 'The Privé bên sông Rạch Chiếc' ),
	array( 'bat-dong-san-ven-song-the-prive.webp', 'The Privé ven sông Giồng Ông Tố' ),
	array( 'toa-cloud-9-tower-the-prive.webp', 'Tòa Cloud 9 Tower, The Privé' ),
	array( 'penthouse-duplex-the-prive.webp', 'Căn penthouse và duplex The Privé' ),
	array( 'kinh-doanh-airbnb-the-prive.webp', 'Căn hộ The Privé cho thuê ngắn hạn' ),
	array( 'kenh-tru-an-tai-san-the-prive.webp', 'Hình ảnh dự án The Privé' ),
	array( 'tien-do-the-prive-01.webp', 'Tiến độ xây dựng The Privé, ảnh 1' ),
	array( 'tien-do-the-prive-02.webp', 'Tiến độ xây dựng The Privé, ảnh 2' ),
	array( 'tien-do-the-prive-03.webp', 'Tiến độ xây dựng The Privé, ảnh 3' ),
	array( 'tien-do-the-prive-04.webp', 'Tiến độ xây dựng The Privé, ảnh 4' ),
	array( 'mat-bang-thap-9-the-prive.webp', 'Mặt bằng tầng Tháp 9 The Privé' ),
);

// Vinhomes Saigon Park – source: velisrealty.vn/vinhomes-saigon-park/. No per-subzone price/area/handover published.
$types = array( 'can-ho' => 'Căn hộ', 'nha-pho' => 'Nhà phố liền kề', 'shophouse' => 'Shophouse', 'biet-thu' => 'Biệt thự', 'dinh-thu' => 'Dinh thự' );
$high  = array( 'can-ho' ); // product types that make a subzone "cao tầng"
$zones = array(
	array( 'n' => 1, 'name' => 'Khu 1 – Ivy Park', 'theme' => 'Công viên tri thức', 'types' => array( 'can-ho', 'nha-pho', 'shophouse' ), 'core' => 'Làng Đại học quốc tế, ga Metro số 2', 'fit' => 'Nhà đầu tư dòng tiền cho thuê' ),
	array( 'n' => 2, 'name' => 'Khu 2 – Global Park', 'theme' => 'Công viên quốc tế', 'types' => array( 'shophouse', 'nha-pho' ), 'core' => 'Bệnh viện Vinmec 13,6 ha, Vincom Mega Mall 46 ha', 'fit' => 'Nhà đầu tư lợi suất kinh doanh' ),
	array( 'n' => 3, 'name' => 'Khu 3 – Laguna Park', 'theme' => 'Công viên biển xanh', 'types' => array( 'can-ho', 'biet-thu' ), 'core' => 'VinWonders Ocean Park 22,7 ha', 'fit' => 'Khai thác cho thuê nghỉ dưỡng' ),
	array( 'n' => 4, 'name' => 'Khu 4 – Zen Park', 'theme' => 'Công viên thiền', 'types' => array( 'biet-thu', 'nha-pho' ), 'core' => 'Công viên Kiyomi Park 10 ha, hơn 150 sân tennis, padel, pickleball', 'fit' => 'Mua để ở, gia đình nhiều thế hệ' ),
	array( 'n' => 5, 'name' => 'Khu 5 – Golf Park', 'theme' => 'Công viên golf', 'types' => array( 'biet-thu', 'dinh-thu' ), 'core' => 'Sân golf 36 hố, 200 ha', 'fit' => 'Tích sản dài hạn, tài chính mạnh' ),
);
$groups = array( 'Cao tầng' => array(), 'Thấp tầng' => array() );
foreach ( $zones as $z ) {
	$groups[ array_intersect( $z['types'], $high ) ? 'Cao tầng' : 'Thấp tầng' ][] = $z;
}
assert( 2 === count( $groups['Cao tầng'] ) && 3 === count( $groups['Thấp tầng'] ) );
$type_labels = function ( $keys ) use ( $types ) {
	return array_map( fn( $k ) => $types[ $k ], $keys );
};

$colors = array(
	'ink' => '#1A1A1A', 'body-muted' => '#5C5C5C', 'canvas' => '#FAF8F5', 'surface' => '#FFFFFF', 'surface-sunken' => '#F2EEE8',
	'surface-dark' => '#141414', 'hairline' => '#E4DED5', 'velis-red' => '#B8282E', 'velis-red-hover' => '#9E1F26',
	'champagne' => '#B08D57', 'champagne-text' => '#8A6A3A',
);
?>
<!-- wp:group {"className":"v-sg","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group v-sg">
<!-- wp:html -->
<nav class="v-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Trang chủ</a></li><li><a href="/du-an/">Dự án</a></li><li><a href="/chu-dau-tu/">Đất Xanh</a></li><li aria-current="page">The Privé</li></ol></nav>
<p class="v-eyebrow">Nội bộ · không index</p>
<h1>Style guide Velis Realty</h1>
<p class="v-lead">Mọi token và thành phần trong DESIGN.md, dùng dữ liệu thật đang có trên velisrealty.vn: The Privé (trang dự án, cập nhật <?php echo esc_html( $prive['updated'] ); ?>) và Vinhomes Saigon Park. Giá "dự kiến" trên site không được dùng; ô nào chưa có nguồn ghi "<?php echo esc_html( $none ); ?>".</p>

<!-- 12 · Hero -->
<section class="v-sg__section" id="hero">
<header class="v-sechead"><p class="v-eyebrow">12 · Hero (chọn 1)</p><h2>Phương án A – ảnh tràn màn hình</h2><p class="v-sechead__lead">Ảnh chiếm trọn chiều rộng, chữ đặt trên lớp phủ tối dần từ trái. Hợp khi có ảnh phối cảnh hoặc ảnh thật chất lượng cao.</p></header>
</section>
<!-- /wp:html -->
</div>
<!-- /wp:group -->

<!-- wp:html -->
<section class="v-hero v-hero--full" aria-label="Phương án hero A">
	<img src="<?php echo $up( '2026/04/can-ho-the-prive.webp' ); ?>" alt="Phối cảnh dự án The Privé bên sông Giồng Ông Tố" width="1200" height="675" fetchpriority="high">
	<div class="v-hero__body">
		<p class="v-eyebrow">Velis Realty · tư vấn bất động sản cao cấp</p>
		<p class="v-hero__title">Chọn đúng dự án bằng dòng tiền và giá vốn thực</p>
		<p class="v-hero__lead">Velis đồng hành cùng anh chị chọn căn hộ, nhà phố, biệt thự hạng sang tại TP.HCM, với thông tin pháp lý và quy hoạch minh bạch.</p>
		<div class="v-row"><a class="v-btn" href="#tu-van">Nhận tư vấn</a><a class="v-btn v-btn--ghost" href="/du-an/">Xem dự án</a></div>
	</div>
</section>
<!-- /wp:html -->

<!-- wp:group {"className":"v-sg","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group v-sg">
<!-- wp:html -->
<section class="v-sg__section">
<header class="v-sechead"><h2>Phương án B – ảnh và chữ chia đôi</h2><p class="v-sechead__lead">Chữ trên nền ngà, ảnh góc vuông bên phải. Đọc dễ hơn, ít phụ thuộc chất lượng ảnh, LCP thường nhẹ hơn.</p></header>
<div class="v-hero v-hero--split" aria-label="Phương án hero B">
	<div class="v-hero__body">
		<p class="v-eyebrow">Velis Realty · tư vấn bất động sản cao cấp</p>
		<p class="v-hero__title">Chọn đúng dự án bằng dòng tiền và giá vốn thực</p>
		<p class="v-hero__lead">Velis đồng hành cùng anh chị chọn căn hộ, nhà phố, biệt thự hạng sang tại TP.HCM, với thông tin pháp lý và quy hoạch minh bạch.</p>
		<div class="v-row"><a class="v-btn" href="#tu-van">Nhận tư vấn</a><a class="v-btn v-btn--secondary" href="/du-an/">Xem dự án</a></div>
	</div>
	<figure><img src="<?php echo $up( '2026/04/can-ho-the-prive.webp' ); ?>" alt="Phối cảnh dự án The Privé" width="1200" height="675" loading="lazy"><figcaption>Ảnh phối cảnh minh họa – nguồn: CĐT</figcaption></figure>
</div>
</section>

<section class="v-sg__section" id="dau-muc">
<header class="v-sechead"><p class="v-eyebrow">12 · Đầu mục section</p><h2>Mẫu đầu mục và nhịp khoảng cách</h2><p class="v-sechead__lead">Eyebrow chữ hoa champagne → tiêu đề Playfair → đoạn dẫn tối đa 2 dòng → đường kẻ champagne 48 px. Các section cách nhau 96 px (desktop) / 64 px (mobile); trong section: đầu mục → nội dung 32 px, giữa các khối 24 px.</p></header>
<ol class="v-rhythm" aria-label="Nhịp khoảng cách"><li style="--h:96px">96 px · giữa section (desktop)</li><li style="--h:64px">64 px · giữa section (mobile)</li><li style="--h:32px">32 px · đầu mục → nội dung</li><li style="--h:24px">24 px · giữa các khối</li><li style="--h:8px">8 px · eyebrow → tiêu đề</li></ol>
</section>

<section class="v-sg__section" id="anh">
<header class="v-sechead"><p class="v-eyebrow">12 · Ảnh</p><h2>Quy chuẩn xử lý ảnh</h2><p class="v-sechead__lead">Ảnh thật hoặc phối cảnh có bản quyền, một tông ấm, góc vuông. Không chữ đè lên ảnh trừ hero có lớp phủ.</p></header>
<div class="v-imgrules">
	<figure><div class="v-ratio" style="--r:16/9"><img src="<?php echo $up( '2026/04/can-ho-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy"></div><figcaption><b>16:9</b> · hero, ảnh đầu bài, thư viện, bản đồ</figcaption></figure>
	<figure><div class="v-ratio" style="--r:4/3"><img src="<?php echo $up( '2026/04/the-prive-rach-chiec.webp' ); ?>" alt="" width="1200" height="675" loading="lazy"></div><figcaption><b>4:3</b> · mọi loại thẻ</figcaption></figure>
	<figure><div class="v-ratio" style="--r:1/1"><img src="<?php echo $up( '2026/04/toa-cloud-9-tower-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy"></div><figcaption><b>1:1</b> · ảnh đại diện, tác giả</figcaption></figure>
	<figure><div class="v-ratio v-ratio--overlay" style="--r:16/9"><img src="<?php echo $up( '2026/04/can-ho-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy"><span>Chữ trên ảnh</span></div><figcaption><b>Lớp phủ</b> · gradient #141414 72% → 0%, chỉ cho hero</figcaption></figure>
</div>
<ul class="v-list"><li>Góc vuông 0 px cho ảnh; thẻ bo 2 px nhưng ảnh trong thẻ vẫn vuông.</li><li><code>object-fit: cover</code> chỉ cho ảnh không chứa thông tin (phối cảnh, tiến độ); mặt bằng và bản đồ dùng <code>contain</code>, không cắt.</li><li>Chú thích 14 px dưới ảnh: nội dung · nguồn · ngày chụp (ảnh thực tế).</li><li>Ảnh đầu trang ≤ 150 KB, AVIF/WebP, <code>fetchpriority="high"</code>; còn lại lazy-load và luôn có <code>width</code>/<code>height</code>.</li></ul>
</section>

<section class="v-sg__section" id="mau"><header class="v-sechead"><p class="v-eyebrow">01 · Màu</p><h2>Bảng màu</h2><p class="v-sechead__lead">Màu giao diện theo brief. Logo giữ màu gốc #DC2524 / #D2941B, không dùng làm màu giao diện.</p></header>
<ul class="v-swatches">
<?php foreach ( $colors as $slug => $hex ) : ?>
<li><span class="v-swatch" style="background:var(--wp--preset--color--<?php echo esc_attr( $slug ); ?>)"></span><b><?php echo esc_html( $slug ); ?></b><code><?php echo esc_html( $hex ); ?></code></li>
<?php endforeach; ?>
</ul></section>

<section class="v-sg__section" id="chu"><header class="v-sechead"><p class="v-eyebrow">02 · Chữ</p><h2>Thang chữ</h2><p class="v-sechead__lead">Tiêu đề Playfair dòng ≥ 1,2 để dấu chồng (Ể, Ỗ, Ữ, Ặ) không bị cắt.</p></header>
<div class="v-type-scale">
<p class="has-heading-1-font-size v-serif">H1 · Ể Ỗ Ữ Ặ – Tư vấn bất động sản cao cấp</p>
<p class="has-heading-2-font-size v-serif">H2 · Ỗ Ữ Ặ Ể – Đại đô thị và các phân khu</p>
<p class="has-heading-3-font-size v-strong">H3 · Dòng sản phẩm căn 2 phòng ngủ</p>
<p class="has-heading-4-font-size v-strong">H4 · Pháp lý và tiến độ bàn giao</p>
<p class="has-body-font-size">Nội dung 18/17 px · Nhà đầu tư cần đọc kỹ pháp lý, dòng tiền và giá vốn thực trước khi xuống tiền. Đoạn văn giới hạn 68 ký tự mỗi dòng.</p>
<p class="has-caption-font-size">Chú thích 14 px · Ảnh phối cảnh minh họa – nguồn: CĐT</p>
</div></section>

<section class="v-sg__section" id="nut"><header class="v-sechead"><p class="v-eyebrow">03 · Nút</p><h2>Nút và liên kết</h2></header>
<div class="v-row">
<a class="v-btn" href="#tu-van">Nhận bảng giá</a>
<a class="v-btn v-btn--secondary" href="<?php echo esc_url( $prive['url'] ); ?>">Xem dự án</a>
<a class="v-btn v-btn--text" href="/blog/">Đọc phân tích của CEO</a>
<button class="v-btn" type="button" disabled>Đã hết hàng</button>
</div>
<p>Liên kết trong đoạn văn: <a href="<?php echo esc_url( $prive['url'] ); ?>">pháp lý The Privé</a>. Dùng Tab để xem viền focus.</p>
</section>
<!-- /wp:html -->

<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#tu-van">Nút core chính</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-secondary"} --><div class="wp-block-button is-style-secondary"><a class="wp-block-button__link wp-element-button" href="/du-an/">Nút core phụ</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-text"} --><div class="wp-block-button is-style-text"><a class="wp-block-button__link wp-element-button" href="/blog/">Nút core dạng chữ</a></div><!-- /wp:button --></div><!-- /wp:buttons -->

<!-- wp:html -->
<section class="v-sg__section" id="the"><header class="v-sechead"><p class="v-eyebrow">04 · Thẻ</p><h2>Thẻ dự án, chủ đầu tư, bài viết, phân khu</h2><p class="v-sechead__lead">Cùng ảnh 4:3, cao bằng nhau trong một hàng, nút luôn ở đáy thẻ.</p></header>
<div class="v-grid v-grid--4">
	<article class="v-card v-reveal">
		<div class="v-card__media"><img src="<?php echo $up( '2026/04/can-ho-the-prive.webp' ); ?>" alt="Phối cảnh dự án The Privé" width="1200" height="675" loading="lazy"></div>
		<div class="v-card__body"><p class="v-card__kicker">Dự án</p>
		<h3 class="v-card__title"><a href="<?php echo esc_url( $prive['url'] ); ?>"><?php echo esc_html( $prive['name'] ); ?></a></h3>
		<p class="v-card__meta"><?php echo esc_html( $prive['dev'] . ' · ' . $prive['market'] ); ?></p>
		<p class="v-price">Giá: <?php echo esc_html( mb_strtolower( $none ) ); ?></p>
		<a class="v-btn v-btn--secondary v-card__cta" href="<?php echo esc_url( $prive['url'] ); ?>" tabindex="-1" aria-hidden="true">Xem dự án</a></div>
	</article>
	<article class="v-card v-reveal">
		<div class="v-card__media v-card__logo"><span class="v-monogram" aria-hidden="true">ĐX</span></div>
		<div class="v-card__body"><p class="v-card__kicker">Chủ đầu tư</p>
		<h3 class="v-card__title"><a href="/chu-dau-tu/">Tập đoàn Đất Xanh</a></h3>
		<p class="v-card__meta">1 dự án Velis đang tư vấn · Khu Đông</p>
		<p class="v-price">Dự án: The Privé</p>
		<a class="v-btn v-btn--secondary v-card__cta" href="/chu-dau-tu/" tabindex="-1" aria-hidden="true">Xem chủ đầu tư</a></div>
	</article>
	<article class="v-card v-reveal">
		<div class="v-card__media"><img src="<?php echo $up( '2026/04/penthouse-duplex-the-prive.webp' ); ?>" alt="Căn penthouse và duplex The Privé" width="1200" height="675" loading="lazy"></div>
		<div class="v-card__body"><p class="v-card__kicker">Phân tích sản phẩm</p>
		<h3 class="v-card__title"><a href="/penthouse-garden-duplex-the-prive-quan-2/">Penthouse &amp; Garden Duplex The Privé: tài sản truyền đời bên sông</a></h3>
		<p class="v-card__meta">Vũ Xuân · 13/04/2026 · 9 phút đọc</p>
		<a class="v-btn v-btn--secondary v-card__cta" href="/penthouse-garden-duplex-the-prive-quan-2/" tabindex="-1" aria-hidden="true">Đọc bài</a></div>
	</article>
	<article class="v-card v-reveal">
		<div class="v-card__media"><img src="<?php echo $up( '2026/05/phan-khu-1-vinhomes-saigon-park.webp' ); ?>" alt="Phân khu 1 Ivy Park, Vinhomes Saigon Park" width="1200" height="675" loading="lazy"></div>
		<div class="v-card__body"><p class="v-card__kicker">Phân khu · Vinhomes Saigon Park</p>
		<h3 class="v-card__title"><a href="/vinhomes-saigon-park/">Khu 1 – Ivy Park</a></h3>
		<ul class="v-chips"><li>Căn hộ</li><li>Nhà phố liền kề</li><li>Shophouse</li></ul>
		<p class="v-price">Giá: <?php echo esc_html( mb_strtolower( $none ) ); ?></p>
		<a class="v-btn v-btn--secondary v-card__cta" href="/vinhomes-saigon-park/" tabindex="-1" aria-hidden="true">Xem phân khu</a></div>
	</article>
</div></section>

<section class="v-sg__section" id="thong-tin"><header class="v-sechead"><p class="v-eyebrow">05 · Dữ liệu dự án</p><h2>Thanh thông tin nhanh – The Privé</h2></header>
<dl class="v-facts">
	<div><dt>Vị trí</dt><dd>Nam Rạch Chiếc, phường Bình Trưng</dd></div><div><dt>Quy mô</dt><dd><?php echo esc_html( $prive['scale'] ); ?></dd></div>
	<div><dt>Sản phẩm</dt><dd><?php echo esc_html( $prive['products'] ); ?></dd></div><div><dt>Bàn giao</dt><dd><?php echo esc_html( $prive['handover'] ); ?> <small>dự kiến</small></dd></div>
	<div><dt>Pháp lý</dt><dd><?php echo esc_html( $prive['legal'] ); ?></dd></div><div><dt>Giá tham khảo</dt><dd><?php echo esc_html( $none ); ?></dd></div>
</dl>
<p class="v-source">Nguồn: trang dự án The Privé của Velis, cập nhật <?php echo esc_html( $prive['updated'] ); ?>. Chủ đầu tư: <?php echo esc_html( $prive['dev'] ); ?>. Địa chỉ: <?php echo esc_html( $prive['address'] ); ?>.</p>

<h3 id="bang-gia">Bảng thông số dòng căn</h3>
<div class="v-table-wrap v-table-wrap--cards"><table class="v-table">
<caption>Diện tích dự kiến, đo tim tường – The Privé</caption>
<thead><tr><th scope="col">Loại căn</th><th scope="col" class="num">Diện tích</th><th scope="col" class="num">Phòng ngủ</th><th scope="col">Đặc điểm</th><th scope="col">Bàn giao</th><th scope="col" class="num">Giá từ</th></tr></thead>
<tbody>
<?php foreach ( $lines as $l ) : ?>
<tr><th scope="row"><?php echo esc_html( $l['label'] ); ?></th><td class="num" data-label="Diện tích"><?php echo esc_html( $l['area'] ); ?></td><td class="num" data-label="Phòng ngủ"><?php echo esc_html( $l['beds'] ); ?></td><td data-label="Đặc điểm"><?php echo esc_html( $l['note'] ); ?></td><td data-label="Bàn giao">Hoàn thiện nội thất</td><td class="num" data-label="Giá từ"><?php echo esc_html( $none ); ?></td></tr>
<?php endforeach; ?>
</tbody></table></div>
<p class="v-source">Nguồn: trang dự án The Privé, cập nhật <?php echo esc_html( $prive['updated'] ); ?>. Hướng và số lượng căn chưa công bố nên không hiển thị.</p>
</section>

<section class="v-sg__section" id="dong-san-pham"><header class="v-sechead"><p class="v-eyebrow">06 · Tab dòng sản phẩm</p><h2>Dòng sản phẩm The Privé</h2></header>
<div class="v-tabs" data-tabs>
	<div class="v-tabs__list" role="tablist" aria-label="Dòng sản phẩm The Privé" hidden>
	<?php foreach ( $lines as $l ) : ?><button role="tab" type="button" aria-controls="<?php echo esc_attr( $l['id'] ); ?>"><?php echo esc_html( $l['label'] ); ?></button><?php endforeach; ?>
	</div>
	<?php foreach ( $lines as $l ) : ?>
	<section class="v-tabs__panel" id="<?php echo esc_attr( $l['id'] ); ?>" role="tabpanel" tabindex="0">
		<h3><?php echo esc_html( $l['label'] ); ?></h3>
		<div class="v-line">
			<div class="v-line__info">
				<dl class="v-mini">
					<div><dt>Diện tích</dt><dd><?php echo esc_html( $l['area'] ); ?></dd></div>
					<div><dt>Phòng ngủ</dt><dd><?php echo esc_html( $l['beds'] ); ?></dd></div>
					<div><dt>Bàn giao</dt><dd><?php echo esc_html( $prive['handover'] ); ?>, hoàn thiện nội thất</dd></div>
					<div><dt>Giá từ</dt><dd><?php echo esc_html( $none ); ?></dd></div>
				</dl>
				<p><?php echo esc_html( $l['note'] ); ?></p>
				<p><b>Phù hợp với ai:</b>
				<?php if ( $l['fit'] ) : ?>
					<?php echo esc_html( $l['fit'] ); ?>
				<?php else : ?>
					chưa có nhận định riêng – xem <a href="/thanh-khoan-1pn-vs-2pn-the-prive-quan-2/">1PN hay 2PN The Privé dễ thanh khoản hơn</a>.
				<?php endif; ?></p>
				<a class="v-btn" href="#tu-van" data-interest="The Privé – <?php echo esc_attr( $l['label'] ); ?>">Nhận bảng giá <?php echo esc_html( $l['label'] ); ?></a>
				<p class="v-source">Cập nhật <?php echo esc_html( $prive['updated'] ); ?> · nguồn: trang dự án Velis</p>
			</div>
			<button class="v-line__plan" type="button" data-zoom="<?php echo $up( $l['img'] ); ?>" aria-label="Phóng to ảnh <?php echo esc_attr( $l['label'] ); ?>">
				<img src="<?php echo $up( $l['img'] ); ?>" alt="<?php echo esc_attr( $l['label'] . ' The Privé' ); ?>" width="1200" height="800" loading="lazy">
			</button>
		</div>
	</section>
	<?php endforeach; ?>
</div></section>

<section class="v-sg__section" id="listing"><header class="v-sechead"><p class="v-eyebrow">07 · Listing phân khu</p><h2>Các phân khu Vinhomes Saigon Park</h2><p class="v-sechead__lead">Xã Xuân Thới Sơn, TP.HCM (trước đây huyện Hóc Môn) · Khu Tây Bắc · 1.080 ha · nhà phát triển Vinhomes. Giá, diện tích, bàn giao từng phân khu chưa công bố.</p></header>
<div class="v-listing" data-listing>
	<div class="v-listing__bar">
		<div class="v-seg" role="group" aria-label="Chế độ xem"><button type="button" aria-pressed="true" data-view="zones">Theo phân khu</button><button type="button" aria-pressed="false" data-view="types">Theo loại sản phẩm</button></div>
		<p class="v-listing__count" role="status" data-count>Hiển thị <?php echo count( $zones ); ?>/<?php echo count( $zones ); ?> phân khu</p>
		<label class="v-sort">Sắp xếp <select data-sort><option value="n">Thứ tự phân khu</option><option value="gia">Giá từ thấp đến cao</option><option value="bg">Bàn giao sớm nhất</option></select></label>
		<button class="v-btn v-btn--secondary v-listing__open" type="button" data-open="v-filter">Bộ lọc</button>
	</div>
	<div class="v-listing__layout">
	<dialog class="v-drawer" id="v-filter" aria-label="Bộ lọc phân khu"><form method="dialog" class="v-filter" data-filter>
		<p class="v-filter__title">Bộ lọc</p>
		<fieldset><legend>Loại sản phẩm</legend>
		<?php foreach ( $types as $k => $label ) : ?><label><input type="checkbox" name="loai" value="<?php echo esc_attr( $k ); ?>"> <?php echo esc_html( $label ); ?></label><?php endforeach; ?></fieldset>
		<label class="v-filter__field">Phòng ngủ <select name="pn"><option value="">Tất cả</option><option>1</option><option>2</option><option>3</option><option value="4">4+</option></select></label>
		<label class="v-filter__field">Giá từ <select name="gia"><option value="">Tất cả</option><option value="0-5">Dưới 5 tỷ</option><option value="5-10">5–10 tỷ</option><option value="10-20">10–20 tỷ</option><option value="20-999">Trên 20 tỷ</option></select></label>
		<label class="v-filter__field">Diện tích <select name="dt"><option value="">Tất cả</option><option value="0-70">Dưới 70 m²</option><option value="70-120">70–120 m²</option><option value="120-9999">Trên 120 m²</option></select></label>
		<fieldset><legend>Trạng thái</legend><label><input type="checkbox" name="tt" value="dang-ban"> Đang bán</label><label><input type="checkbox" name="tt" value="sap-mo"> Sắp mở bán</label><label><input type="checkbox" name="tt" value="da-ban-giao"> Đã bàn giao</label></fieldset>
		<label class="v-filter__field">Bàn giao <select name="bg"><option value="">Tất cả</option><option value="0-2026">Đến 2026</option><option value="2027-2027">2027</option><option value="2028-9999">Từ 2028</option></select></label>
		<div class="v-row"><button class="v-btn v-filter__apply" value="apply">Xem kết quả</button><button class="v-btn v-btn--text" type="reset">Xóa lọc</button></div>
	</form></dialog>
	<div class="v-listing__results">
	<div data-panel="zones">
	<?php foreach ( $groups as $gname => $gzones ) : ?>
	<div class="v-listing__group" data-group>
	<p class="v-eyebrow"><?php echo esc_html( $gname ); ?></p>
	<div class="v-grid v-grid--zones">
	<?php foreach ( $gzones as $z ) : ?>
		<article class="v-card v-zone" data-n="<?php echo (int) $z['n']; ?>" data-loai="<?php echo esc_attr( implode( ' ', $z['types'] ) ); ?>" data-pn="" data-gia="" data-dt="" data-tt="" data-bg="">
			<div class="v-card__media"><img src="<?php echo $up( '2026/05/phan-khu-' . $z['n'] . '-vinhomes-saigon-park.webp' ); ?>" alt="<?php echo esc_attr( 'Phân khu ' . $z['n'] . ' Vinhomes Saigon Park' ); ?>" width="1200" height="675" loading="lazy"></div>
			<div class="v-card__body"><span class="v-badge">Trạng thái: chưa công bố</span>
			<h3 class="v-card__title"><a href="/vinhomes-saigon-park/"><?php echo esc_html( $z['name'] ); ?></a></h3>
			<ul class="v-chips"><?php foreach ( $type_labels( $z['types'] ) as $t ) : ?><li><?php echo esc_html( $t ); ?></li><?php endforeach; ?></ul>
			<p class="v-card__meta"><?php echo esc_html( $z['core'] ); ?></p>
			<p class="v-price">Giá: <?php echo esc_html( mb_strtolower( $none ) ); ?> · Bàn giao: <?php echo esc_html( mb_strtolower( $none ) ); ?></p>
			<div class="v-row v-card__cta"><a class="v-btn v-btn--secondary" href="/vinhomes-saigon-park/">Xem phân khu</a><a class="v-btn" href="#tu-van" data-interest="Vinhomes Saigon Park – <?php echo esc_attr( $z['name'] ); ?>">Nhận bảng giá</a></div></div>
		</article>
	<?php endforeach; ?>
	</div></div>
	<?php endforeach; ?>
	<div class="v-empty" hidden data-empty><p><b>Chưa có sản phẩm phù hợp.</b> Bỏ bớt điều kiện lọc, hoặc để lại nhu cầu, Velis báo khi có hàng.</p><div class="v-row"><button class="v-btn v-btn--secondary" type="button" data-reset>Xóa lọc</button><a class="v-btn" href="#tu-van">Để lại nhu cầu</a></div></div>
	</div>
	<div data-panel="types" hidden>
	<div class="v-table-wrap"><table class="v-table">
	<caption>Mọi loại sản phẩm trong Vinhomes Saigon Park, gom theo loại</caption>
	<thead><tr><th scope="col">Loại sản phẩm</th><th scope="col">Có tại phân khu</th><th scope="col" class="num">Diện tích</th><th scope="col" class="num">Giá từ</th><th scope="col">Bàn giao</th></tr></thead>
	<tbody>
	<?php foreach ( $types as $k => $label ) : ?>
	<tr><th scope="row"><?php echo esc_html( $label ); ?></th><td><?php echo esc_html( implode( ', ', array_map( fn( $z ) => 'Khu ' . $z['n'], array_filter( $zones, fn( $z ) => in_array( $k, $z['types'], true ) ) ) ) ); ?></td><td class="num"><?php echo esc_html( $none ); ?></td><td class="num"><?php echo esc_html( $none ); ?></td><td><?php echo esc_html( $none ); ?></td></tr>
	<?php endforeach; ?>
	</tbody></table></div>
	</div>
	</div>
	</div>
</div></section>

<section class="v-sg__section" id="so-sanh"><header class="v-sechead"><p class="v-eyebrow">08 · Bảng so sánh</p><h2>So sánh 5 phân khu Vinhomes Saigon Park</h2></header>
<p class="v-swipe" aria-hidden="true">Vuốt để xem thêm →</p>
<div class="v-table-wrap v-table-wrap--pin" tabindex="0" role="region" aria-label="Bảng so sánh phân khu, cuộn ngang được"><table class="v-table v-table--compare">
<thead><tr><th scope="col">Tiêu chí</th><?php foreach ( $zones as $z ) : ?><th scope="col"><?php echo esc_html( $z['name'] ); ?></th><?php endforeach; ?></tr></thead>
<tbody>
<tr><th scope="row">Chủ đề</th><?php foreach ( $zones as $z ) : ?><td><?php echo esc_html( $z['theme'] ); ?></td><?php endforeach; ?></tr>
<tr><th scope="row">Loại sản phẩm</th><?php foreach ( $zones as $z ) : ?><td><?php echo esc_html( implode( ', ', $type_labels( $z['types'] ) ) ); ?></td><?php endforeach; ?></tr>
<tr><th scope="row">Tiện ích lõi</th><?php foreach ( $zones as $z ) : ?><td><?php echo esc_html( $z['core'] ); ?></td><?php endforeach; ?></tr>
<?php foreach ( array( 'Diện tích', 'Giá từ', 'Bàn giao', 'Pháp lý' ) as $row ) : ?>
<tr><th scope="row"><?php echo esc_html( $row ); ?></th><?php foreach ( $zones as $z ) : ?><td class="is-empty"><?php echo esc_html( $none ); ?></td><?php endforeach; ?></tr>
<?php endforeach; ?>
<tr><th scope="row">Phù hợp với</th><?php foreach ( $zones as $z ) : ?><td><?php echo esc_html( $z['fit'] ); ?></td><?php endforeach; ?></tr>
<tr class="v-table__cta"><th scope="row"><span class="v-sr">Liên kết</span></th><?php foreach ( $zones as $z ) : ?><td><a class="v-btn v-btn--secondary" href="/vinhomes-saigon-park/">Xem phân khu<span class="v-sr"> <?php echo esc_html( $z['name'] ); ?></span></a></td><?php endforeach; ?></tr>
</tbody></table></div>
<p class="v-source">Nguồn: trang Vinhomes Saigon Park của Velis. "Phù hợp với" theo nhận định của Vũ Xuân trên trang đó.</p>
</section>

<section class="v-sg__section" id="hinh-anh"><header class="v-sechead"><p class="v-eyebrow">09 · Ảnh, bản đồ, tiến độ</p><h2>Thư viện ảnh The Privé</h2></header>
<div class="v-gallery" data-gallery>
	<ul class="v-gallery__track" tabindex="0" aria-label="Thư viện ảnh, cuộn ngang">
	<?php foreach ( $gallery as $i => list( $f, $alt ) ) : ?>
		<li><button type="button" data-zoom="<?php echo $up( '2026/04/' . $f ); ?>" aria-label="<?php echo esc_attr( 'Phóng to: ' . $alt ); ?>"><img src="<?php echo $up( '2026/04/' . $f ); ?>" alt="<?php echo esc_attr( $alt ); ?>" width="1200" height="675" loading="lazy"></button></li>
	<?php endforeach; ?>
	</ul>
	<div class="v-gallery__nav"><button type="button" class="v-iconbtn" data-prev aria-label="Ảnh trước">‹</button><span class="v-gallery__count" aria-live="polite" data-counter>1/<?php echo count( $gallery ); ?></span><button type="button" class="v-iconbtn" data-next aria-label="Ảnh sau">›</button></div>
</div>
<dialog class="v-lightbox" aria-label="Xem ảnh"><form method="dialog"><button class="v-lightbox__close" aria-label="Đóng">×</button></form><img alt=""></dialog>

<h3>Vị trí</h3>
<div class="v-map">
	<img src="<?php echo $up( '2026/11/ban-do-vi-tri-the-prive-osm.webp' ); ?>" alt="Bản đồ khu Nam Rạch Chiếc, phường Bình Trưng, nơi có dự án The Privé" width="1200" height="675" loading="lazy">
	<a class="v-btn" href="https://www.google.com/maps/search/?api=1&amp;query=The+Priv%C3%A9+%C4%90%E1%BA%A5t+Xanh+Nam+R%E1%BA%A1ch+Chi%E1%BA%BFc" target="_blank" rel="noopener">Xem trên Google Maps</a>
</div>
<p class="v-source">Bản đồ: © OpenStreetMap contributors. <?php echo esc_html( $prive['address'] ); ?>.</p>

<h3>Tiến độ</h3>
<ol class="v-timeline">
	<li><time datetime="2026-04">04/2026</time><p><b>Hoàn thiện hồ sơ pháp lý</b> – quy hoạch 1/500, giấy phép xây dựng phần thân, văn bản đủ điều kiện bán.</p></li>
	<li><time datetime="2026-07">07/2026</time><p><b>Thi công đến tầng 22</b> theo cập nhật tiến độ trên trang dự án.</p><img src="<?php echo $up( '2026/04/tien-do-the-prive-01.webp' ); ?>" alt="Ảnh tiến độ xây dựng The Privé" width="1200" height="675" loading="lazy"></li>
	<li class="is-next"><time datetime="2028-03">Quý 1/2028</time><p><b>Bàn giao dự kiến</b>, hoàn thiện nội thất.</p></li>
</ol></section>

<section class="v-sg__section" id="noi-dung"><header class="v-sechead"><p class="v-eyebrow">10 · Nội dung &amp; tin cậy</p><h2>Bố cục bài viết: mục lục, FAQ, tác giả, công bố</h2></header>
<div class="v-article">
	<details class="v-toc" open data-toc><summary>Mục lục</summary><ol>
		<li><a href="#hinh-anh">Thư viện ảnh và vị trí</a></li><li><a href="#thong-tin">Thông tin nhanh</a></li><li><a href="#bang-gia">Bảng thông số</a></li><li><a href="#dong-san-pham">Dòng sản phẩm</a></li>
		<li><a href="#listing">Listing phân khu</a></li><li><a href="#so-sanh">So sánh phân khu</a></li><li><a href="#faq">Câu hỏi thường gặp</a></li><li><a href="#tu-van">Nhận tư vấn</a></li>
	</ol></details>
	<div class="v-article__body">
		<h3 id="faq">Câu hỏi thường gặp về The Privé</h3>
		<div class="v-faq">
		<details><summary>Pháp lý The Privé hiện nay đã đủ để ký hợp đồng mua bán chưa?</summary><p>Theo trang dự án (cập nhật 04/2026), dự án đã có quy hoạch 1/500, giấy phép xây dựng phần thân, đã nộp tiền sử dụng đất và có văn bản đủ điều kiện bán, cho phép ký hợp đồng mua bán trực tiếp.</p></details>
		<details><summary>Ai là chủ đầu tư The Privé?</summary><p>Tập đoàn Đất Xanh. Thiết kế kiến trúc: CPG Consultants (Singapore); tổng thầu: Tập đoàn Hòa Bình.</p></details>
		<details><summary>Ai là khách thuê tiềm năng tại The Privé?</summary><p>Theo nhận định của Vũ Xuân: chuyên gia nước ngoài làm việc tại Khu Công nghệ cao và gia đình có con học tại các trường quốc tế lân cận.</p></details>
		</div>
		<aside class="v-author">
			<div class="v-author__photo" role="img" aria-label="Chỗ đặt ảnh chân dung Vũ Xuân (chưa có ảnh thật)"><span aria-hidden="true">VX</span></div>
			<div><p class="v-eyebrow">Tác giả</p><p class="v-author__name"><a href="/chuyen-gia/vu-xuan/">Vũ Xuân</a> · CEO Velis Realty</p>
			<p>Tư vấn bất động sản cao cấp khu Đông TP.HCM, phân tích theo dòng tiền và giá vốn thực.</p>
			<a class="v-btn v-btn--text" href="/chuyen-gia/vu-xuan/">Xem tất cả bài viết</a></div>
		</aside>
		<aside class="v-disclosure" role="note"><p>Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p></aside>
		<nav class="v-pagination" aria-label="Phân trang"><a href="#" aria-label="Trang trước">‹</a><a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a><a href="#" aria-label="Trang sau">›</a></nav>
	</div>
</div>
</section>

<section class="v-sg__section" id="menu"><header class="v-sechead"><p class="v-eyebrow">11 · Menu lớn</p><h2>Mega menu Dự án</h2></header>
<details class="v-mega" open><summary>Dự án</summary><div class="v-mega__panel">
	<div><p class="v-eyebrow">Vinhomes</p><ul><li><a href="/vinhomes-saigon-park/">Vinhomes Saigon Park</a><ul><?php foreach ( $zones as $z ) : ?><li><a href="/vinhomes-saigon-park/"><?php echo esc_html( $z['name'] ); ?></a></li><?php endforeach; ?></ul></li></ul></div>
	<div><p class="v-eyebrow">Đất Xanh</p><ul><li><a href="<?php echo esc_url( $prive['url'] ); ?>">The Privé</a></li></ul><p class="v-eyebrow">Masterise Homes</p><ul><li><a href="/the-global-city/">The Global City</a></li></ul></div>
	<div><p class="v-eyebrow">Theo khu vực</p><ul><li><a href="/du-an/">Thủ Thiêm</a></li><li><a href="/du-an/">Nam Rạch Chiếc</a></li><li><a href="/du-an/">Tây Bắc</a></li></ul></div>
</div></details></section>

<section class="v-sg__section" id="form"><header class="v-sechead"><p class="v-eyebrow">12 · Form</p><h2 id="tu-van">Nhận tư vấn</h2></header>
<div class="v-contact">
	<div class="v-contact__info">
		<p>Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị liên hệ trực tiếp:</p>
		<ul class="v-contact__list">
			<li><span>Hotline</span><a href="tel:0911237979">0911 237 979</a></li>
			<li><span>Zalo</span><a href="https://zalo.me/0911237979" rel="noopener">0911 237 979</a></li>
			<li><span>Email</span><a href="mailto:lienhe@velisrealty.vn">lienhe@velisrealty.vn</a></li>
			<li><span>Văn phòng</span>34 Lương Định Của, phường Bình Trưng, TP.HCM</li>
			<li><span>Giờ làm việc</span>Thứ 2 – Chủ nhật, 08:00–21:00</li>
		</ul>
	</div>
	<form class="v-form" novalidate data-form>
		<p class="v-field"><label for="f-name">Họ và tên</label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err"><span class="v-field__error" id="f-name-err" hidden>Vui lòng nhập họ tên.</span></p>
		<p class="v-field"><label for="f-phone">Số điện thoại</label><input id="f-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9 +.]{9,15}" aria-describedby="f-phone-err"><span class="v-field__error" id="f-phone-err" hidden>Vui lòng nhập số điện thoại 9–15 chữ số.</span></p>
		<fieldset class="v-field v-choice"><legend>Nhu cầu</legend><label><input type="radio" name="need" value="o" checked> Mua ở</label><label><input type="radio" name="need" value="dau-tu"> Đầu tư</label><label><input type="radio" name="need" value="cho-thue"> Cho thuê</label></fieldset>
		<p class="v-field"><label for="f-interest">Dự án / phân khu quan tâm</label><input id="f-interest" name="interest" value="The Privé" list="f-projects"><datalist id="f-projects"><option value="The Privé"></option><?php foreach ( $zones as $z ) : ?><option value="<?php echo esc_attr( 'Vinhomes Saigon Park – ' . $z['name'] ); ?>"></option><?php endforeach; ?></datalist></p>
		<p class="v-field"><label for="f-note">Ghi chú <span class="v-optional">(không bắt buộc)</span></label><textarea id="f-note" name="note" rows="3"></textarea></p>
		<p class="v-check"><input id="f-consent" type="checkbox" required aria-describedby="f-consent-err"><label for="f-consent">Tôi đồng ý để Velis Realty xử lý dữ liệu cá nhân nhằm tư vấn, theo <a href="/chinh-sach-bao-mat/">chính sách bảo mật</a>.</label></p>
		<span class="v-field__error" id="f-consent-err" hidden>Cần đồng ý để Velis liên hệ.</span>
		<button class="v-btn" type="submit">Gửi yêu cầu</button>
		<p class="v-form__ok" role="status" hidden>Đã nhận. Velis sẽ gọi lại trong giờ làm việc (form trưng bày, không gửi đi).</p>
	</form>
</div></section>

<section class="v-sg__section" id="logo"><header class="v-sechead"><p class="v-eyebrow">13 · Logo</p><h2>Bộ logo SVG</h2><p class="v-sechead__lead">Giữ màu gốc #DC2524 / #D2941B. Trên nền tối dùng bản trắng.</p></header>
<div class="v-logos"><div><img src="<?php echo $theme( 'assets/brand/velis-logo-horizontal.svg' ); ?>" alt="Logo ngang" width="261" height="60"></div><div class="is-dark"><img src="<?php echo $theme( 'assets/brand/velis-logo-horizontal-white.svg' ); ?>" alt="Logo ngang bản trắng" width="261" height="60"></div><div><img src="<?php echo $theme( 'assets/brand/velis-logo-vertical.svg' ); ?>" alt="Logo dọc" width="160" height="140"></div><div><img src="<?php echo $theme( 'assets/brand/favicon.svg' ); ?>" alt="Favicon" width="48" height="48"></div></div>
</section>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
