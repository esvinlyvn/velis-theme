<?php
/**
 * Title: Style guide
 * Slug: velis/style-guide
 * Inserter: no
 *
 * Internal showcase of every DESIGN.md component. Content comes from pages already on velisrealty.vn
 * (The Privé, Vinhomes Saigon Park); its accuracy is checked in the content phase, not here.
 * Rules shown: empty field → block hidden; all-empty table row/column → hidden + one note; price → one muted line.
 */

$up    = fn( $path ) => esc_url( content_url( 'uploads/' . $path ) );
$theme = fn( $path ) => esc_url( get_theme_file_uri( $path ) );
$e     = fn( $s ) => esc_html( $s );
$filled = fn( $v ) => '' !== trim( (string) $v );
$more  = fn( $t ) => '<span class="v-card__link" aria-hidden="true">' . esc_html( $t ) . ' →</span>'; // whole card is the link (stretched title)
$price = fn( $p ) => '' === $p ? '<p class="v-price is-missing">Giá: chưa công bố</p>' : '<p class="v-price">Giá từ ' . esc_html( $p ) . '</p>';

// Regions: Vùng → Tiểu khu. Cards show the most specific level; filters accept both.
$regions = array(
	'khu-dong' => array( 'Khu Đông', array( 'thu-thiem' => 'Thủ Thiêm', 'thao-dien-an-phu' => 'Thảo Điền – An Phú', 'nam-rach-chiec' => 'Nam Rạch Chiếc' ) ),
	'tay-bac'  => array( 'Tây Bắc', array() ),
	've-tinh'  => array( 'Vùng vệ tinh', array( 'nhon-trach-long-thanh' => 'Nhơn Trạch – Long Thành' ) ),
);
$region_label = function ( $slugs ) use ( $regions ) {
	foreach ( array_reverse( $slugs ) as $s ) { // most specific first
		foreach ( $regions as $k => list( $vung, $subs ) ) {
			if ( isset( $subs[ $s ] ) ) { return $subs[ $s ]; }
			if ( $k === $s ) { return $vung; }
		}
	}
	return '';
};

$prive = array(
	'name' => 'The Privé', 'dev' => 'Tập đoàn Đất Xanh', 'khu' => array( 'khu-dong', 'nam-rach-chiec' ), 'status' => '', 'price' => '',
	'img' => '2026/04/can-ho-the-prive.webp', 'url' => '/can-ho-the-prive/', 'updated' => '09/04/2026', 'types' => array( 'can-ho' ),
	'address' => 'Khu dân cư Nam Rạch Chiếc, phường Bình Trưng (trước đây phường An Phú, Quận 2), TP.HCM',
);
$projects = array(
	$prive,
	array( 'name' => 'Vinhomes Saigon Park', 'dev' => 'Vinhomes', 'khu' => array( 'tay-bac' ), 'status' => '', 'price' => '', 'img' => '2026/05/vinhomes-saigon-park-2.webp', 'url' => '/vinhomes-saigon-park/', 'types' => array( 'can-ho', 'nha-pho', 'shophouse', 'biet-thu', 'dinh-thu' ) ),
	array( 'name' => 'The Global City', 'dev' => 'Masterise Homes', 'khu' => array( 'khu-dong', 'nam-rach-chiec' ), 'status' => '', 'price' => '', 'img' => '', 'url' => '/the-global-city/', 'types' => array( 'can-ho', 'nha-pho', 'shophouse', 'biet-thu' ) ),
	array( 'name' => 'Spring Ville', 'dev' => 'Gamuda Land', 'khu' => array( 've-tinh', 'nhon-trach-long-thanh' ), 'status' => '', 'price' => '', 'img' => '', 'url' => '/spring-ville/', 'types' => array( 'can-ho' ) ),
);
$facts = array( // empty value → item hidden; price always shown (muted when missing)
	'Vị trí' => 'Nam Rạch Chiếc, phường Bình Trưng', 'Quy mô' => '6,7 ha · 12 tháp · hơn 3.000 căn', 'Sản phẩm' => 'Căn hộ 1–3 PN',
	'Bàn giao' => 'Quý 1/2028', 'Pháp lý' => 'Đủ điều kiện bán (04/2026)', 'Hướng' => '',
);
$lines = array(
	array( 'id' => 'can-1pn', 'label' => 'Căn 1 PN', 'net' => '', 'gross' => '49 m²', 'beds' => '1', 'dir' => '', 'qty' => '', 'img' => '2026/04/can-ho-1pn-the-prive-1024x683.webp', 'note' => 'Bếp mở nối liền phòng khách, ban công rộng.', 'fit' => '' ),
	array( 'id' => 'can-2pn', 'label' => 'Căn 2 PN', 'net' => '', 'gross' => '71–85 m²', 'beds' => '2', 'dir' => '', 'qty' => '', 'img' => '2026/04/can-ho-2pn-the-prive.webp', 'note' => 'Hai phòng ngủ đều có cửa sổ lớn.', 'fit' => '' ),
	array( 'id' => 'can-3pn', 'label' => 'Căn 3 PN', 'net' => '', 'gross' => '95 m²', 'beds' => '3', 'dir' => '', 'qty' => '', 'img' => '2026/04/can-ho-3pn-the-prive.webp', 'note' => 'Căn góc, view sông hai mặt, phòng ngủ chính có bồn tắm nằm.', 'fit' => 'Tích sản dài hạn; khách thuê chuyên gia nước ngoài.' ),
);
// Gallery: [file, alt, focus] – focus (object-position) keeps the printed VELIS badge (bottom-left) out of the frame.
$gallery = array(
	array( '2026/04/can-ho-the-prive.webp', 'Phối cảnh tổng thể The Privé', '100% 0%' ),
	array( '2026/04/the-prive-rach-chiec.webp', 'The Privé bên sông Rạch Chiếc', '100% 0%' ),
	array( '2026/04/loi-nhuan-dau-tu-the-prive-1.webp', 'The Privé về đêm', '100% 0%' ),
	array( '2026/04/dau-tu-luot-song-the-prive.webp', 'Toàn cảnh The Privé về đêm', '100% 0%' ),
	array( '2026/04/bat-dong-san-ven-song-the-prive.webp', 'Ban công nhìn ra sông', '100% 0%' ),
	array( '2026/04/kinh-doanh-airbnb-the-prive.webp', 'Hồ bơi ven sông', '100% 0%' ),
	array( '2026/04/penthouse-duplex-the-prive.webp', 'Phòng khách căn penthouse', '100% 0%' ),
	array( '2026/04/tien-do-the-prive-01.webp', 'Công trường The Privé, ảnh 1', '100% 0%' ),
	array( '2026/04/tien-do-the-prive-02.webp', 'Công trường The Privé, ảnh 2', '100% 0%' ),
	array( '2026/04/tien-do-the-prive-03.webp', 'Công trường The Privé, ảnh 3', '100% 0%' ),
	array( '2026/04/tien-do-the-prive-04.webp', 'Công trường The Privé, ảnh 4', '100% 0%' ),
);

// Vinhomes Saigon Park subzones. Group: has apartments + low-rise → Hỗn hợp; only apartments → Cao tầng; else Thấp tầng.
$types = array( 'can-ho' => 'Căn hộ', 'nha-pho' => 'Nhà phố liền kề', 'shophouse' => 'Shophouse', 'biet-thu' => 'Biệt thự', 'dinh-thu' => 'Dinh thự' );
$zones = array(
	array( 'n' => 1, 'name' => 'Khu 1 – Ivy Park', 'theme' => 'Công viên tri thức', 'types' => array( 'can-ho', 'nha-pho', 'shophouse' ), 'core' => 'Làng Đại học quốc tế, ga Metro số 2', 'fit' => 'Nhà đầu tư dòng tiền cho thuê', 'img' => '2026/05/shophouse-vinhomes-saigon-park.webp' ),
	array( 'n' => 2, 'name' => 'Khu 2 – Global Park', 'theme' => 'Công viên quốc tế', 'types' => array( 'shophouse', 'nha-pho' ), 'core' => 'Bệnh viện Vinmec 13,6 ha, Vincom Mega Mall 46 ha', 'fit' => 'Nhà đầu tư lợi suất kinh doanh', 'img' => '2026/05/thiet-ke-nha-pho-vinhomes-1.webp' ),
	array( 'n' => 3, 'name' => 'Khu 3 – Laguna Park', 'theme' => 'Công viên biển xanh', 'types' => array( 'can-ho', 'biet-thu' ), 'core' => 'VinWonders Ocean Park 22,7 ha', 'fit' => 'Khai thác cho thuê nghỉ dưỡng', 'img' => '2026/05/vinhomes-saigon-park-2.webp' ),
	array( 'n' => 4, 'name' => 'Khu 4 – Zen Park', 'theme' => 'Công viên thiền', 'types' => array( 'biet-thu', 'nha-pho' ), 'core' => 'Công viên Kiyomi Park 10 ha, hơn 150 sân tennis, padel, pickleball', 'fit' => 'Mua để ở, gia đình nhiều thế hệ', 'img' => '2026/05/biet-thu-ven-kenh-vinhomes.webp' ),
	array( 'n' => 5, 'name' => 'Khu 5 – Golf Park', 'theme' => 'Công viên golf', 'types' => array( 'biet-thu', 'dinh-thu' ), 'core' => 'Sân golf 36 hố, 200 ha', 'fit' => 'Tích sản dài hạn, tài chính mạnh', 'img' => '2026/05/thap-tang-vinhomes-saigon-park.webp' ),
);
foreach ( $zones as &$z ) {
	$z += array( 'pn' => '', 'gia' => '', 'dt' => '', 'tt' => '', 'bg' => '', 'area' => '', 'handover' => '', 'legal' => '', 'price' => '', 'status' => '' );
}
unset( $z );
$group_of = function ( $z ) {
	$high = in_array( 'can-ho', $z['types'], true );
	$low  = (bool) array_diff( $z['types'], array( 'can-ho' ) );
	return $high && $low ? 'Hỗn hợp' : ( $high ? 'Cao tầng' : 'Thấp tầng' );
};
$groups = array( 'Cao tầng' => array(), 'Hỗn hợp' => array(), 'Thấp tầng' => array() );
foreach ( $zones as $z ) {
	$groups[ $group_of( $z ) ][] = $z;
}
$groups = array_filter( $groups );
assert( array( 'Hỗn hợp', 'Thấp tầng' ) === array_keys( $groups ) );
// A filter/sort group is shown only when the listed items hold at least 2 different values for it.
$distinct = function ( $key ) use ( $zones ) {
	$vals = array();
	foreach ( $zones as $z ) {
		foreach ( (array) $z[ $key ] as $v ) {
			if ( '' !== $v ) { $vals[ $v ] = true; }
		}
	}
	return count( $vals );
};
$show = fn( $key ) => $distinct( $key ) >= 2;
$filter_groups = count( array_filter( array_map( $show, array( 'types', 'pn', 'gia', 'dt', 'tt', 'bg' ) ) ) );
$sorts = array_filter( array( 'gia' => 'Giá từ thấp đến cao', 'bg' => 'Bàn giao sớm nhất' ), fn( $k ) => $show( $k ), ARRAY_FILTER_USE_KEY );
?>
<!-- wp:group {"className":"v-sg","layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group v-sg">
<!-- wp:html -->
<nav class="v-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Trang chủ</a></li><li><a href="/du-an/">Dự án</a></li><li aria-current="page">Style guide</li></ol></nav>
<p class="v-eyebrow">Nội bộ · không index</p>
<h1>Style guide Velis Realty</h1>
<p class="v-lead">Mọi token và thành phần trong DESIGN.md, minh họa bằng nội dung đang có trên velisrealty.vn. Quy tắc thiếu dữ liệu: trường trống thì ẩn cả khối; giá luôn hiện một dòng "chưa công bố" chữ mờ.</p>

<section class="v-sg__section" id="hero">
<header class="v-sechead"><p class="v-eyebrow">Hero</p><h2>Hero A – trang chủ, trang dự án, phân khu</h2><p class="v-sechead__lead">Ảnh tràn màn hình, lớp phủ tối. Điểm lấy nét (<code>--focus</code>) đẩy huy hiệu in trong ảnh ra ngoài khung.</p></header>
</section>
<!-- /wp:html -->
</div>
<!-- /wp:group -->

<!-- wp:html -->
<section class="v-hero v-hero--full" aria-label="Hero A">
	<img src="<?php echo $up( $prive['img'] ); ?>" alt="Phối cảnh dự án The Privé" width="1200" height="675" fetchpriority="high" style="--focus: 100% 0%; --focus-m: 72% 0%; --zoom: 1.12">
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
<header class="v-sechead"><h2>Hero A khi chưa có ảnh</h2><p class="v-sechead__lead">Nền trung tính tối kèm tên dự án; nội dung và nút giữ nguyên vị trí.</p></header>
<div class="v-hero v-hero--full is-empty" aria-label="Hero A không ảnh">
	<span class="v-hero__fallback" aria-hidden="true">The Global City</span>
	<div class="v-hero__body"><p class="v-eyebrow">Masterise Homes · Nam Rạch Chiếc</p><p class="v-hero__title">The Global City</p><div class="v-row"><a class="v-btn" href="#tu-van">Nhận bảng giá</a><a class="v-btn v-btn--ghost" href="tel:0911237979">Gọi</a></div></div>
</div>
</section>

<section class="v-sg__section">
<header class="v-sechead"><h2>Hero B – trang tổng (Dự án, Chủ đầu tư, Blog, cụm blog)</h2><p class="v-sechead__lead">Chữ trên nền ngà, ảnh góc vuông; tiêu đề cân dòng (<code>text-wrap: balance</code>).</p></header>
<div class="v-hero v-hero--split" aria-label="Hero B">
	<div class="v-hero__body">
		<p class="v-eyebrow">Dự án Velis đang tư vấn</p>
		<p class="v-hero__title">Dự án bất động sản cao cấp tại TP.HCM và vùng lân cận</p>
		<p class="v-hero__lead">Lọc theo chủ đầu tư, khu vực và loại sản phẩm; mỗi dự án kèm nhận định của CEO Vũ Xuân.</p>
		<div class="v-row"><a class="v-btn" href="#tu-van">Nhận tư vấn</a><a class="v-btn v-btn--secondary" href="#listing-du-an">Xem danh sách</a></div>
	</div>
	<figure><div class="v-ratio" style="--r:4/3"><img src="<?php echo $up( '2026/04/the-prive-rach-chiec.webp' ); ?>" alt="The Privé bên sông" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div><figcaption>Ảnh phối cảnh minh họa – nguồn: CĐT</figcaption></figure>
</div>
</section>

<section class="v-sg__section" id="dau-muc">
<header class="v-sechead"><p class="v-eyebrow">Đầu mục section</p><h2>Mẫu đầu mục và nhịp khoảng cách</h2><p class="v-sechead__lead">Eyebrow → tiêu đề Playfair → đoạn dẫn ≤ 2 dòng → đường kẻ champagne 48 px. Section cách nhau 96/64 px; đầu mục → nội dung 32 px; giữa các khối 24 px.</p></header>
<ol class="v-rhythm" aria-label="Nhịp khoảng cách"><li style="--h:96px">96 px · giữa section (desktop)</li><li style="--h:64px">64 px · giữa section (mobile)</li><li style="--h:32px">32 px · đầu mục → nội dung</li><li style="--h:24px">24 px · giữa các khối</li><li style="--h:8px">8 px · eyebrow → tiêu đề</li></ol>
</section>

<section class="v-sg__section" id="anh">
<header class="v-sechead"><p class="v-eyebrow">Ảnh</p><h2>Quy chuẩn xử lý ảnh</h2><p class="v-sechead__lead">Ảnh minh họa không có chữ đè. Mọi khung ảnh nhận điểm lấy nét <code>--focus</code> (object-position) và có nền dự phòng khi thiếu ảnh.</p></header>
<div class="v-imgrules">
	<figure><div class="v-ratio" style="--r:16/9"><img src="<?php echo $up( '2026/04/kinh-doanh-airbnb-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div><figcaption><b>16:9</b> · hero, ảnh đầu bài, bản đồ</figcaption></figure>
	<figure><div class="v-ratio" style="--r:4/3"><img src="<?php echo $up( '2026/04/bat-dong-san-ven-song-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div><figcaption><b>4:3</b> · mọi loại thẻ</figcaption></figure>
	<figure><div class="v-ratio" style="--r:1/1"><img src="<?php echo $up( '2026/04/penthouse-duplex-the-prive.webp' ); ?>" alt="" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div><figcaption><b>1:1</b> · ảnh đại diện</figcaption></figure>
	<figure><div class="v-ratio v-media--empty" style="--r:4/3"><span>Ansana by Kita</span></div><figcaption><b>Chưa có ảnh</b> · nền trung tính + tên dự án</figcaption></figure>
</div>
<ul class="v-list"><li>Góc vuông 0 px cho ảnh. <code>cover</code> + <code>--focus</code> cho ảnh phối cảnh/tiến độ; mặt bằng và bản đồ dùng <code>contain</code>.</li><li>Chú thích 14 px dưới ảnh: nội dung · nguồn · ngày chụp.</li><li>Lớp phủ chỉ cho hero A; chữ trên ảnh ≥ 4,5:1 (kiểm tự động bằng điểm ảnh sáng nhất sau chữ).</li></ul>
</section>

<section class="v-sg__section" id="chu"><header class="v-sechead"><p class="v-eyebrow">Chữ &amp; màu</p><h2>Thang chữ</h2></header>
<div class="v-type-scale">
<p class="has-heading-1-font-size v-serif">H1 · Ể Ỗ Ữ Ặ – Tư vấn bất động sản cao cấp</p>
<p class="has-heading-2-font-size v-serif">H2 · Đại đô thị và các phân khu</p>
<p class="has-heading-3-font-size v-strong">H3 · Dòng sản phẩm căn 2 phòng ngủ</p>
<p class="has-body-font-size">Nội dung 18/17 px · đoạn văn tối đa 68 ký tự mỗi dòng.</p>
<p class="has-caption-font-size">Chú thích 14 px · Ảnh phối cảnh minh họa – nguồn: CĐT</p>
</div>
<div class="v-row"><a class="v-btn" href="#tu-van">Nhận bảng giá</a><a class="v-btn v-btn--secondary" href="<?php echo esc_url( $prive['url'] ); ?>">Xem dự án</a><a class="v-btn v-btn--text" href="/blog/">Đọc phân tích</a><button class="v-btn" type="button" disabled>Đã hết hàng</button></div>
</section>

<section class="v-sg__section" id="the"><header class="v-sechead"><p class="v-eyebrow">Thẻ</p><h2>Thẻ dự án, chủ đầu tư, bài viết, phân khu</h2><p class="v-sechead__lead">Không trạng thái → không nhãn. Thiếu giá → một dòng mờ. Thiếu ảnh/logo → khung trung tính.</p></header>
<div class="v-grid v-grid--4">
	<article class="v-card">
		<div class="v-card__media"><img src="<?php echo $up( $prive['img'] ); ?>" alt="Phối cảnh dự án The Privé" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div>
		<div class="v-card__body"><p class="v-card__kicker">Dự án</p>
		<h3 class="v-card__title"><a href="<?php echo esc_url( $prive['url'] ); ?>">The Privé</a></h3>
		<p class="v-card__meta"><?php echo $e( $prive['dev'] . ' · ' . $region_label( $prive['khu'] ) ); ?></p>
		<?php echo $price( $prive['price'] ) . $more( 'Xem dự án' ); // phpcs:ignore -- escaped in helpers ?></div>
	</article>
	<article class="v-card">
		<div class="v-card__media v-card__logo"><svg class="v-logo-ph" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/></svg></div>
		<div class="v-card__body"><p class="v-card__kicker">Chủ đầu tư</p>
		<h3 class="v-card__title"><a href="/chu-dau-tu/">Tập đoàn Đất Xanh</a></h3>
		<p class="v-card__meta">1 dự án đang tư vấn · Khu Đông</p>
		<?php echo $more( 'Xem chủ đầu tư' ); // phpcs:ignore ?></div>
	</article>
	<article class="v-card">
		<div class="v-card__media"><img src="<?php echo $up( '2026/04/penthouse-duplex-the-prive.webp' ); ?>" alt="Phòng khách căn penthouse The Privé" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div>
		<div class="v-card__body"><p class="v-card__kicker">Phân tích sản phẩm</p>
		<h3 class="v-card__title"><a href="/penthouse-garden-duplex-the-prive-quan-2/">Penthouse &amp; Garden Duplex The Privé: tài sản truyền đời bên sông</a></h3>
		<p class="v-card__meta">Vũ Xuân · 13/04/2026 · 9 phút đọc</p>
		<?php echo $more( 'Đọc bài' ); // phpcs:ignore ?></div>
	</article>
	<article class="v-card">
		<div class="v-card__media"><img src="<?php echo $up( $zones[0]['img'] ); ?>" alt="Phố shophouse Vinhomes Saigon Park" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div>
		<div class="v-card__body"><p class="v-card__kicker">Phân khu · Vinhomes Saigon Park</p>
		<h3 class="v-card__title"><a href="/vinhomes-saigon-park/">Khu 1 – Ivy Park</a></h3>
		<ul class="v-chips"><li>Căn hộ</li><li>Nhà phố liền kề</li><li>Shophouse</li></ul>
		<?php echo $price( '' ) . $more( 'Xem phân khu' ); // phpcs:ignore ?></div>
	</article>
</div></section>

<section class="v-sg__section" id="listing-du-an"><header class="v-sechead"><p class="v-eyebrow">Listing dự án</p><h2>Thanh lọc ngang</h2><p class="v-sechead__lead">Desktop: ô thả xuống Khu vực (Vùng → Tiểu khu), Chủ đầu tư, Loại sản phẩm + số kết quả + xóa lọc. Mobile: ngăn kéo.</p></header>
<?php
$devs   = array_values( array_unique( array_column( $projects, 'dev' ) ) );
$ptypes = array_keys( array_intersect_key( $types, array_flip( array_merge( ...array_column( $projects, 'types' ) ) ) ) );
$pkhu   = array_unique( array_map( fn( $p ) => $p['khu'][0], $projects ) );
?>
<div class="v-plist" data-plist>
	<div class="v-plist__top">
		<button class="v-btn v-btn--secondary v-listing__open" type="button" data-open aria-haspopup="dialog">Bộ lọc</button>
		<dialog class="v-drawer v-drawer--bar" aria-labelledby="v-pfilter-title"><form method="dialog" class="v-filter v-fbar" data-pfilter>
			<div class="v-drawer__head"><p class="v-filter__title" id="v-pfilter-title">Bộ lọc dự án</p><button class="v-drawer__close" type="button" data-close><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="v-sr">Đóng bộ lọc</span></button></div>
			<div class="v-drawer__body v-fbar__groups">
			<?php if ( count( $pkhu ) >= 2 ) : ?>
				<details class="v-fdrop" data-fdrop><summary>Khu vực <span data-n></span></summary><div class="v-fdrop__panel v-regions" data-regions>
				<?php foreach ( $regions as $k => list( $vung, $subs ) ) : ?>
					<div class="v-regions__group"><label><input type="checkbox" name="khu" value="<?php echo esc_attr( $k ); ?>" data-parent> <?php echo $e( $vung ); ?></label>
					<?php foreach ( $subs as $sk => $sl ) : ?><label class="v-regions__sub"><input type="checkbox" name="khu" value="<?php echo esc_attr( $sk ); ?>" data-child="<?php echo esc_attr( $k ); ?>"> <?php echo $e( $sl ); ?></label><?php endforeach; ?>
					</div>
				<?php endforeach; ?>
				</div></details>
			<?php endif; ?>
			<?php if ( count( $devs ) >= 2 ) : ?>
				<details class="v-fdrop" data-fdrop><summary>Chủ đầu tư <span data-n></span></summary><div class="v-fdrop__panel">
				<?php foreach ( $devs as $d ) : ?><label><input type="checkbox" name="cdt" value="<?php echo esc_attr( sanitize_title( $d ) ); ?>"> <?php echo $e( $d ); ?></label><?php endforeach; ?>
				</div></details>
			<?php endif; ?>
			<?php if ( count( $ptypes ) >= 2 ) : ?>
				<details class="v-fdrop" data-fdrop><summary>Loại sản phẩm <span data-n></span></summary><div class="v-fdrop__panel">
				<?php foreach ( $ptypes as $t ) : ?><label><input type="checkbox" name="loai" value="<?php echo esc_attr( $t ); ?>"> <?php echo $e( $types[ $t ] ); ?></label><?php endforeach; ?>
				</div></details>
			<?php endif; ?>
			</div>
			<div class="v-drawer__foot"><button class="v-btn v-btn--secondary" type="reset">Xóa lọc</button><button class="v-btn" value="apply" data-apply>Xem <?php echo count( $projects ); ?> kết quả</button></div>
		</form></dialog>
		<p class="v-listing__count" role="status" data-plist-count>Hiển thị <?php echo count( $projects ); ?>/<?php echo count( $projects ); ?> dự án</p>
	</div>
	<div class="v-grid v-grid--4">
	<?php foreach ( $projects as $p ) : ?>
		<article class="v-card" data-card data-khu="<?php echo esc_attr( implode( ' ', $p['khu'] ) ); ?>" data-cdt="<?php echo esc_attr( sanitize_title( $p['dev'] ) ); ?>" data-loai="<?php echo esc_attr( implode( ' ', $p['types'] ) ); ?>">
			<?php if ( $p['img'] ) : ?>
			<div class="v-card__media"><img src="<?php echo $up( $p['img'] ); ?>" alt="<?php echo esc_attr( 'Phối cảnh ' . $p['name'] ); ?>" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div>
			<?php else : ?>
			<div class="v-card__media v-media--empty"><span><?php echo $e( $p['name'] ); ?></span></div>
			<?php endif; ?>
			<div class="v-card__body">
			<?php if ( $p['status'] ) : ?><span class="v-badge"><?php echo $e( $p['status'] ); ?></span><?php endif; ?>
			<h3 class="v-card__title"><a href="<?php echo esc_url( $p['url'] ); ?>"><?php echo $e( $p['name'] ); ?></a></h3>
			<p class="v-card__meta"><?php echo $e( implode( ' · ', array_filter( array( $p['dev'], $region_label( $p['khu'] ) ) ) ) ); ?></p>
			<?php echo $price( $p['price'] ) . $more( 'Xem dự án' ); // phpcs:ignore ?></div>
		</article>
	<?php endforeach; ?>
	</div>
	<div class="v-empty" hidden data-plist-empty><p><b>Chưa có dự án phù hợp.</b></p><button class="v-btn v-btn--secondary" type="button" data-plist-reset>Xóa lọc</button></div>
</div></section>

<section class="v-sg__section" id="thong-tin"><header class="v-sechead"><p class="v-eyebrow">Dữ liệu dự án</p><h2>Thanh thông tin nhanh</h2><p class="v-sechead__lead">Ô trống bị ẩn (ví dụ "Hướng"); giá luôn hiện.</p></header>
<dl class="v-facts">
<?php foreach ( array_filter( $facts, $filled ) as $k => $v ) : ?><div><dt><?php echo $e( $k ); ?></dt><dd><?php echo $e( $v ); ?></dd></div><?php endforeach; ?>
	<div><dt>Giá tham khảo</dt><dd class="is-missing">Chưa công bố</dd></div>
</dl>
<p class="v-source">Nguồn: trang The Privé của Velis, cập nhật <?php echo $e( $prive['updated'] ); ?>. <?php echo $e( $prive['address'] ); ?>.</p>

<h3>Diện tích hai giá trị</h3>
<div class="v-row v-area-demo"><p><?php echo velis_area( '75,8 m²', '84,9 m²' ); // phpcs:ignore -- escaped in helper ?><br><small class="v-source">Ví dụ căn 2 PN Palm River (thông thủy là số chính)</small></p><p><?php echo velis_area( '', '49 m²' ); // phpcs:ignore ?><br><small class="v-source">Chỉ có tim tường: ghi rõ loại</small></p></div>

<h3 id="bang-gia">Bảng thông số dòng căn</h3>
<?php
echo velis_table( array( // phpcs:ignore -- cells escaped below
	'caption' => 'Dòng căn The Privé',
	'corner'  => 'Loại căn',
	'wrap'    => 'v-table-wrap--cards',
	'cols'    => array( 'area' => array( 'Diện tích', 'num' ), 'beds' => array( 'Phòng ngủ', 'num' ), 'dir' => array( 'Hướng', 'short' ), 'note' => array( 'Đặc điểm', 'text' ), 'price' => array( 'Giá từ', 'num' ) ),
	'rows'    => array_map( fn( $l ) => array( 'label' => esc_html( $l['label'] ), 'area' => velis_area( $l['net'], $l['gross'] ), 'beds' => esc_html( $l['beds'] ), 'dir' => esc_html( $l['dir'] ), 'note' => esc_html( $l['note'] ), 'price' => '' ), $lines ),
) );
?>
</section>

<section class="v-sg__section" id="dong-san-pham"><header class="v-sechead"><p class="v-eyebrow">Tab dòng sản phẩm</p><h2>Dòng sản phẩm The Privé</h2></header>
<div class="v-tabs" data-tabs>
	<div class="v-tabs__list" role="tablist" aria-label="Dòng sản phẩm The Privé" hidden>
	<?php foreach ( $lines as $l ) : ?><button role="tab" type="button" aria-controls="<?php echo esc_attr( $l['id'] ); ?>"><?php echo $e( $l['label'] ); ?></button><?php endforeach; ?>
	</div>
	<?php foreach ( $lines as $l ) : ?>
	<section class="v-tabs__panel" id="<?php echo esc_attr( $l['id'] ); ?>" role="tabpanel" tabindex="0">
		<h3><?php echo $e( $l['label'] ); ?></h3>
		<div class="v-line">
			<div class="v-line__info">
				<dl class="v-mini">
				<?php
				$mini = array( 'Diện tích' => velis_area( $l['net'], $l['gross'] ), 'Phòng ngủ' => esc_html( $l['beds'] ), 'Hướng' => esc_html( $l['dir'] ), 'Số lượng' => esc_html( $l['qty'] ), 'Bàn giao' => 'Quý 1/2028, hoàn thiện nội thất' );
				foreach ( array_filter( $mini, $filled ) as $k => $v ) :
					?>
					<div><dt><?php echo $e( $k ); ?></dt><dd><?php echo $v; // phpcs:ignore -- escaped above ?></dd></div>
				<?php endforeach; ?>
					<div><dt>Giá từ</dt><dd class="is-missing">Chưa công bố</dd></div>
				</dl>
				<p><?php echo $e( $l['note'] ); ?></p>
				<?php if ( $l['fit'] ) : ?><p><b>Phù hợp với ai:</b> <?php echo $e( $l['fit'] ); ?></p><?php endif; ?>
				<a class="v-btn" href="#tu-van" data-interest="The Privé – <?php echo esc_attr( $l['label'] ); ?>">Nhận bảng giá <?php echo $e( $l['label'] ); ?></a>
			</div>
			<button class="v-line__plan" type="button" data-zoom="<?php echo $up( $l['img'] ); ?>" aria-label="Phóng to ảnh <?php echo esc_attr( $l['label'] ); ?>">
				<img src="<?php echo $up( $l['img'] ); ?>" alt="<?php echo esc_attr( $l['label'] . ' The Privé' ); ?>" width="1200" height="800" loading="lazy">
			</button>
		</div>
	</section>
	<?php endforeach; ?>
</div></section>

<section class="v-sg__section" id="listing"><header class="v-sechead"><p class="v-eyebrow">Listing phân khu</p><h2>Các phân khu Vinhomes Saigon Park</h2><p class="v-sechead__lead">Chỉ có 1 nhóm lọc có dữ liệu → hàng chip phía trên lưới, không cột bộ lọc. Nhóm "Hỗn hợp" cho phân khu có cả cao tầng và thấp tầng.</p></header>
<div class="v-listing" data-listing>
	<div class="v-listing__bar">
		<div class="v-seg" role="group" aria-label="Chế độ xem"><button type="button" aria-pressed="true" data-view="zones">Theo phân khu</button><button type="button" aria-pressed="false" data-view="types">Theo loại sản phẩm</button></div>
		<p class="v-listing__count" role="status" data-count>Hiển thị <?php echo count( $zones ); ?>/<?php echo count( $zones ); ?> phân khu</p>
		<?php if ( $sorts ) : ?><label class="v-sort">Sắp xếp <select data-sort><option value="n">Thứ tự phân khu</option><?php foreach ( $sorts as $k => $label ) : ?><option value="<?php echo esc_attr( $k ); ?>"><?php echo $e( $label ); ?></option><?php endforeach; ?></select></label><?php endif; ?>
		<?php if ( $filter_groups > 1 ) : ?><button class="v-btn v-btn--secondary v-listing__open" type="button" data-open="v-filter" aria-haspopup="dialog">Bộ lọc</button><?php endif; ?>
	</div>
	<?php if ( 1 === $filter_groups ) : // a single group: chip row above the grid, no sidebar ?>
	<form class="v-chipbar" data-filter aria-label="Lọc theo loại sản phẩm">
		<?php foreach ( $types as $k => $label ) : ?><label class="v-chip"><input type="checkbox" name="loai" value="<?php echo esc_attr( $k ); ?>"> <?php echo $e( $label ); ?></label><?php endforeach; ?>
		<button class="v-btn v-btn--text" type="reset">Xóa lọc</button>
	</form>
	<div class="v-listing__layout is-single">
	<?php else : ?>
	<div class="v-listing__layout">
	<dialog class="v-drawer" id="v-filter" aria-labelledby="v-filter-title"><form method="dialog" class="v-filter" data-filter>
		<div class="v-drawer__head"><p class="v-filter__title" id="v-filter-title">Bộ lọc</p><button class="v-drawer__close" type="button" data-close><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="v-sr">Đóng bộ lọc</span></button></div>
		<div class="v-drawer__body">
		<?php if ( $show( 'types' ) ) : ?>
		<fieldset><legend>Loại sản phẩm</legend>
		<?php foreach ( $types as $k => $label ) : ?><label><input type="checkbox" name="loai" value="<?php echo esc_attr( $k ); ?>"> <?php echo $e( $label ); ?></label><?php endforeach; ?></fieldset>
		<?php endif; ?>
		<?php if ( $show( 'pn' ) ) : ?><label class="v-filter__field">Phòng ngủ <select name="pn"><option value="">Tất cả</option><option>1</option><option>2</option><option>3</option><option value="4">4+</option></select></label><?php endif; ?>
		<?php if ( $show( 'gia' ) ) : ?><label class="v-filter__field">Giá từ <select name="gia"><option value="">Tất cả</option><option value="0-5">Dưới 5 tỷ</option><option value="5-10">5–10 tỷ</option><option value="10-20">10–20 tỷ</option><option value="20-999">Trên 20 tỷ</option></select></label><?php endif; ?>
		<?php if ( $show( 'dt' ) ) : ?><label class="v-filter__field">Diện tích <select name="dt"><option value="">Tất cả</option><option value="0-70">Dưới 70 m²</option><option value="70-120">70–120 m²</option><option value="120-9999">Trên 120 m²</option></select></label><?php endif; ?>
		<?php if ( $show( 'tt' ) ) : ?><fieldset><legend>Trạng thái</legend><label><input type="checkbox" name="tt" value="dang-ban"> Đang bán</label><label><input type="checkbox" name="tt" value="sap-mo"> Sắp mở bán</label></fieldset><?php endif; ?>
		<?php if ( $show( 'bg' ) ) : ?><label class="v-filter__field">Bàn giao <select name="bg"><option value="">Tất cả</option><option value="0-2026">Đến 2026</option><option value="2027-2027">2027</option><option value="2028-9999">Từ 2028</option></select></label><?php endif; ?>
		</div>
		<div class="v-drawer__foot"><button class="v-btn v-btn--secondary" type="reset">Xóa lọc</button><button class="v-btn" value="apply" data-apply>Xem <?php echo count( $zones ); ?> kết quả</button></div>
	</form></dialog>
	<?php endif; ?>
	<div class="v-listing__results">
	<div data-panel="zones">
	<?php foreach ( $groups as $gname => $gzones ) : ?>
	<div class="v-listing__group" data-group>
	<p class="v-eyebrow"><?php echo $e( $gname ); ?></p>
	<div class="v-grid v-grid--zones">
	<?php foreach ( $gzones as $z ) : ?>
		<article class="v-card v-zone" data-n="<?php echo (int) $z['n']; ?>" data-loai="<?php echo esc_attr( implode( ' ', $z['types'] ) ); ?>" data-pn="" data-gia="" data-dt="" data-tt="" data-bg="">
			<div class="v-card__media"><img src="<?php echo $up( $z['img'] ); ?>" alt="<?php echo esc_attr( 'Phối cảnh ' . $z['name'] ); ?>" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"></div>
			<div class="v-card__body">
			<?php if ( $z['status'] ) : ?><span class="v-badge"><?php echo $e( $z['status'] ); ?></span><?php endif; ?>
			<h3 class="v-card__title"><a href="/vinhomes-saigon-park/"><?php echo $e( $z['name'] ); ?></a></h3>
			<ul class="v-chips"><?php foreach ( $z['types'] as $t ) : ?><li><?php echo $e( $types[ $t ] ); ?></li><?php endforeach; ?></ul>
			<p class="v-card__meta"><?php echo $e( $z['core'] ); ?></p>
			<?php echo $price( $z['price'] ); // phpcs:ignore ?>
			<div class="v-card__actions"><a class="v-btn" href="#tu-van" data-interest="Vinhomes Saigon Park – <?php echo esc_attr( $z['name'] ); ?>">Nhận bảng giá</a><?php echo $more( 'Xem phân khu' ); // phpcs:ignore ?></div></div>
		</article>
	<?php endforeach; ?>
	</div></div>
	<?php endforeach; ?>
	<div class="v-empty" hidden data-empty><p><b>Chưa có sản phẩm phù hợp.</b> Bỏ bớt điều kiện lọc, hoặc để lại nhu cầu, Velis báo khi có hàng.</p><div class="v-row"><button class="v-btn v-btn--secondary" type="button" data-reset>Xóa lọc</button><a class="v-btn" href="#tu-van">Để lại nhu cầu</a></div></div>
	</div>
	<div data-panel="types" hidden>
	<?php
	echo velis_table( array( // phpcs:ignore
		'caption' => 'Loại sản phẩm trong Vinhomes Saigon Park',
		'corner'  => 'Loại sản phẩm',
		'cols'    => array( 'zones' => array( 'Có tại phân khu', 'text' ), 'area' => array( 'Diện tích', 'num' ), 'price' => array( 'Giá từ', 'num' ), 'handover' => array( 'Bàn giao', 'short' ) ),
		'rows'    => array_map( fn( $k ) => array( 'label' => esc_html( $types[ $k ] ), 'zones' => esc_html( implode( ', ', array_map( fn( $z ) => 'Khu ' . $z['n'], array_filter( $zones, fn( $z ) => in_array( $k, $z['types'], true ) ) ) ) ), 'area' => '', 'price' => '', 'handover' => '' ), array_keys( $types ) ),
	) );
	?>
	</div>
	</div>
	</div>
</div></section>

<section class="v-sg__section" id="so-sanh"><header class="v-sechead"><p class="v-eyebrow">Bảng so sánh</p><h2>So sánh 5 phân khu Vinhomes Saigon Park</h2></header>
<p class="v-swipe" aria-hidden="true">Vuốt để xem thêm →</p>
<?php
$crit = array( 'theme' => 'Chủ đề', 'types' => 'Loại sản phẩm', 'core' => 'Tiện ích lõi', 'area' => 'Diện tích', 'price' => 'Giá từ', 'handover' => 'Bàn giao', 'legal' => 'Pháp lý', 'fit' => 'Phù hợp với' );
$cta  = '<tr class="v-table__cta"><th scope="row"><span class="v-sr">Liên kết</span></th>';
foreach ( $zones as $z ) {
	$cta .= '<td><a class="v-btn v-btn--secondary" href="/vinhomes-saigon-park/">Xem phân khu<span class="v-sr"> ' . esc_html( $z['name'] ) . '</span></a></td>';
}
echo velis_table( array( // phpcs:ignore
	'caption' => 'So sánh phân khu',
	'corner'  => 'Tiêu chí',
	'class'   => 'v-table--compare',
	'wrap'    => 'v-table-wrap--pin',
	'cols'    => array_combine( array_map( fn( $z ) => 'k' . $z['n'], $zones ), array_map( fn( $z ) => array( esc_html( $z['name'] ), 'text' ), $zones ) ),
	'rows'    => array_map( fn( $key, $label ) => array( 'label' => esc_html( $label ) ) + array_combine( array_map( fn( $z ) => 'k' . $z['n'], $zones ), array_map( fn( $z ) => esc_html( is_array( $z[ $key ] ) ? implode( ', ', array_map( fn( $t ) => $types[ $t ], $z[ $key ] ) ) : $z[ $key ] ), $zones ) ), array_keys( $crit ), $crit ),
	'after'   => $cta . '</tr>',
) );
?>
</section>

<section class="v-sg__section" id="hinh-anh"><header class="v-sechead"><p class="v-eyebrow">Ảnh, bản đồ, tiến độ</p><h2>Thư viện ảnh The Privé</h2></header>
<div class="v-gallery" data-gallery>
	<ul class="v-gallery__track" tabindex="0" aria-label="Thư viện ảnh, cuộn ngang">
	<?php foreach ( $gallery as list( $f, $alt, $focus ) ) : ?>
		<li><button type="button" data-zoom="<?php echo $up( $f ); ?>" aria-label="<?php echo esc_attr( 'Phóng to: ' . $alt ); ?>"><img src="<?php echo $up( $f ); ?>" alt="<?php echo esc_attr( $alt ); ?>" width="1200" height="675" loading="lazy" style="--focus: <?php echo esc_attr( $focus ); ?>; --zoom: 1.15"></button></li>
	<?php endforeach; ?>
	</ul>
	<div class="v-gallery__nav"><button type="button" class="v-iconbtn" data-prev aria-label="Ảnh trước">‹</button><span class="v-gallery__count" aria-live="polite" data-counter>1/<?php echo count( $gallery ); ?></span><button type="button" class="v-iconbtn" data-next aria-label="Ảnh sau">›</button></div>
</div>
<dialog class="v-lightbox" aria-label="Xem ảnh"><form method="dialog"><button class="v-lightbox__close" aria-label="Đóng">×</button></form><img alt=""></dialog>

<h3>Vị trí</h3>
<div class="v-map">
	<img src="<?php echo $up( '2026/11/ban-do-the-prive-xam.webp' ); ?>" alt="Bản đồ vị trí The Privé, khu Nam Rạch Chiếc" width="1200" height="675" loading="lazy" style="--focus: 57.5% 51%">
	<a class="v-btn" href="https://www.google.com/maps/search/?api=1&amp;query=The+Priv%C3%A9+%C4%90%E1%BA%A5t+Xanh+Nam+R%E1%BA%A1ch+Chi%E1%BA%BFc" target="_blank" rel="noopener">Xem trên Google Maps</a>
</div>
<p class="v-source">Bản đồ © OpenStreetMap contributors. <?php echo $e( $prive['address'] ); ?>.</p>

<h3>Tiến độ</h3>
<ol class="v-timeline">
	<li><time datetime="2026-04">04/2026</time><p><b>Hoàn thiện hồ sơ pháp lý</b> – quy hoạch 1/500, giấy phép xây dựng phần thân, văn bản đủ điều kiện bán.</p></li>
	<li><time datetime="2026-07">07/2026</time><p><b>Thi công đến tầng 22</b>.</p><figure><img src="<?php echo $up( '2026/04/tien-do-the-prive-01.webp' ); ?>" alt="Công trường The Privé" width="1200" height="675" loading="lazy" style="--focus: 100% 0%; --zoom: 1.15"><figcaption>Ảnh chụp tháng 07/2026 · nguồn: trang dự án Velis</figcaption></figure></li>
	<li class="is-next"><time datetime="2028-03">Quý 1/2028</time><p><b>Bàn giao dự kiến</b>, hoàn thiện nội thất.</p></li>
</ol></section>

<section class="v-sg__section" id="noi-dung"><header class="v-sechead"><p class="v-eyebrow">Nội dung &amp; tin cậy</p><h2>Bố cục bài viết</h2></header>
<div class="v-article">
	<details class="v-toc" open data-toc><summary>Mục lục</summary><ol>
		<li><a href="#faq">Câu hỏi thường gặp</a></li><li><a href="#tac-gia">Tác giả</a></li><li><a href="#cong-bo">Công bố đầu tư</a></li><li><a href="#hinh-anh">Thư viện ảnh và vị trí</a></li>
		<li><a href="#thong-tin">Thông tin nhanh</a></li><li><a href="#dong-san-pham">Dòng sản phẩm</a></li><li><a href="#so-sanh">So sánh phân khu</a></li><li><a href="#tu-van">Nhận tư vấn</a></li>
	</ol></details>
	<div class="v-article__body">
		<h3 id="faq">Câu hỏi thường gặp về The Privé</h3>
		<div class="v-faq">
		<details><summary>Pháp lý The Privé hiện nay đã đủ để ký hợp đồng mua bán chưa?</summary><p>Theo trang dự án (cập nhật 04/2026), dự án đã có quy hoạch 1/500, giấy phép xây dựng phần thân và văn bản đủ điều kiện bán.</p></details>
		<details><summary>Ai là chủ đầu tư The Privé?</summary><p>Tập đoàn Đất Xanh; thiết kế kiến trúc CPG Consultants, tổng thầu Tập đoàn Hòa Bình.</p></details>
		<details><summary>Ai là khách thuê tiềm năng tại The Privé?</summary><p>Theo nhận định của Vũ Xuân: chuyên gia nước ngoài làm việc tại Khu Công nghệ cao và gia đình có con học trường quốc tế lân cận.</p></details>
		</div>
		<?php $author_photo = ''; // no real portrait yet → the photo frame is not rendered ?>
		<aside class="v-author" id="tac-gia">
			<?php if ( $author_photo ) : ?><img class="v-author__photo" src="<?php echo esc_url( $author_photo ); ?>" alt="Vũ Xuân" width="88" height="88"><?php endif; ?>
			<div><p class="v-eyebrow">Tác giả</p><p class="v-author__name"><a href="/chuyen-gia/vu-xuan/">Vũ Xuân</a> · CEO Velis Realty</p>
			<p>Tư vấn bất động sản cao cấp khu Đông TP.HCM, phân tích theo dòng tiền và giá vốn thực.</p>
			<a class="v-btn v-btn--text" href="/chuyen-gia/vu-xuan/">Xem tất cả bài viết</a></div>
		</aside>
		<aside class="v-disclosure" id="cong-bo" role="note"><p>Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p></aside>
		<nav class="v-pagination" aria-label="Phân trang"><a href="#" aria-label="Trang trước">‹</a><a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a><a href="#" aria-label="Trang sau">›</a></nav>
	</div>
</div>
</section>

<section class="v-sg__section" id="form"><header class="v-sechead"><p class="v-eyebrow">Form</p><h2 id="tu-van">Nhận tư vấn</h2></header>
<div class="v-contact">
	<div class="v-contact__info">
		<p>Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị liên hệ trực tiếp:</p>
		<ul class="v-contact__list">
			<li><span>Hotline</span><a href="tel:0911237979">0911 237 979</a></li>
			<li><span>Zalo</span><a href="https://zalo.me/0911237979" rel="noopener" target="_blank">zalo.me/0911237979</a></li>
			<li><span>Email</span><a href="mailto:lienhe@velisrealty.vn">lienhe@velisrealty.vn</a></li>
			<li><span>Văn phòng</span>34 Lương Định Của, phường Bình Trưng, TP.HCM</li>
			<li><span>Giờ làm việc</span>Thứ 2 – Chủ nhật, 08:00–21:00</li>
		</ul>
	</div>
	<form class="v-form" novalidate data-form>
		<p class="v-field"><label for="f-name">Họ và tên</label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err"><span class="v-field__error" id="f-name-err" hidden>Vui lòng nhập họ tên.</span></p>
		<p class="v-field"><label for="f-phone">Số điện thoại</label><input id="f-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9 +.]{9,15}" aria-describedby="f-phone-err"><span class="v-field__error" id="f-phone-err" hidden>Vui lòng nhập số điện thoại 9–15 chữ số.</span></p>
		<fieldset class="v-field v-choice"><legend>Nhu cầu</legend><label><input type="radio" name="need" value="o"> Mua ở</label><label><input type="radio" name="need" value="dau-tu"> Đầu tư</label><label><input type="radio" name="need" value="cho-thue"> Cho thuê</label></fieldset>
		<p class="v-field"><label for="f-interest">Dự án / phân khu quan tâm</label><input id="f-interest" name="interest" value="The Privé" list="f-projects"><datalist id="f-projects"><option value="The Privé"></option><?php foreach ( $zones as $z ) : ?><option value="<?php echo esc_attr( 'Vinhomes Saigon Park – ' . $z['name'] ); ?>"></option><?php endforeach; ?></datalist></p>
		<p class="v-field"><label for="f-note">Ghi chú <span class="v-optional">(không bắt buộc)</span></label><textarea id="f-note" name="note" rows="3"></textarea></p>
		<p class="v-check"><input id="f-consent" type="checkbox" required aria-describedby="f-consent-err"><label for="f-consent">Tôi đồng ý để Velis Realty xử lý dữ liệu cá nhân nhằm tư vấn, theo <a href="/chinh-sach-bao-mat/">chính sách bảo mật</a>.</label></p>
		<span class="v-field__error" id="f-consent-err" hidden>Cần đồng ý để Velis liên hệ.</span>
		<button class="v-btn" type="submit">Gửi yêu cầu</button>
		<p class="v-form__ok" role="status" hidden>Đã nhận. Velis sẽ gọi lại trong giờ làm việc (form trưng bày, không gửi đi).</p>
	</form>
</div></section>

<section class="v-sg__section" id="logo"><header class="v-sechead"><p class="v-eyebrow">Logo</p><h2>Bộ logo SVG</h2></header>
<div class="v-logos"><div><img src="<?php echo $theme( 'assets/brand/velis-logo-horizontal.svg' ); ?>" alt="Logo ngang" width="261" height="60"></div><div class="is-dark"><img src="<?php echo $theme( 'assets/brand/velis-logo-horizontal-white.svg' ); ?>" alt="Logo ngang bản trắng" width="261" height="60"></div><div><img src="<?php echo $theme( 'assets/brand/velis-logo-vertical.svg' ); ?>" alt="Logo dọc" width="160" height="140"></div><div><img src="<?php echo $theme( 'assets/brand/favicon.svg' ); ?>" alt="Favicon" width="48" height="48"></div></div>
</section>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
