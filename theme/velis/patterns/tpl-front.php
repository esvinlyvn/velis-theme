<?php
/**
 * Title: Trang chủ
 * Slug: velis/tpl-front
 * Inserter: no
 *
 * Mockup PR #7 @ eda87a0 + decisions of 2026-11-06 (docs/NGHIEM-THU.md):
 * hero = the staging 0.9.8 hero (photo The Privé, text left, "Dự án nổi bật" strip) → numbers 10+ · 50+ · 999+ · 99+ →
 * projects with area tabs → partners (logos balanced by area) → "Công ty TNHH Velis Realty" (the old home's 2 intro
 * paragraphs, verbatim) + Giá Trị Khác Biệt → 3 analyses → Thi thử + Tuyển dụng → form.
 * Texts are the live site's own words (old home, Giới thiệu – read 2026-11-05, mockup/src/data/home-cu.json, broker.json).
 */
$projects = velis_top_projects();
$hero_p   = null;
foreach ( $projects as $p ) {
	if ( 'the-prive' === $p->post_name ) {
		$hero_p = $p;
	}
}
$strip = array_values( array_filter( $projects, fn( $p ) => velis_usable( velis_image_id( $p ) ) ) ); // 0.9.8: projects with a real photo

$out = velis_hero_home( array(
	'img'     => $hero_p ? velis_image_id( $hero_p ) : 0,
	'alt'     => 'Phối cảnh dự án The Privé',
	'eyebrow' => 'Velis Realty',
	'title'   => 'Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận',
	'lead'    => 'Căn hộ hạng sang, villa nghỉ dưỡng, shophouse của Vinhomes, Sun Group, Masterise Homes, Gamuda Land cho người mua ở và nhà đầu tư. CEO Vũ Xuân trực tiếp phân tích dòng tiền và rủi ro từng dự án.',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem dự án', (string) get_post_type_archive_link( 'du-an' ), 'line' ),
	'after'   => velis_feature_strip( $strip ),
) );

// b. numbers (old home, HTML target values; "+" after the number – duyệt 2026-11-06)
$nums = array( 'Năm kinh nghiệm' => 10, 'Đối tác' => 50, 'Giao dịch' => 999, 'Dự án' => 99 );
$out .= '<section class="section section--tight section--tint" aria-label="Velis Realty trong những con số"><div class="wrap"><dl class="numbers">'
	. implode( '', array_map( fn( $l, $n ) => '<div><dt>' . esc_html( $l ) . '</dt><dd>' . $n . '+</dd></div>', array_keys( $nums ), $nums ) ) . '</dl></div></section>';

// c. projects: photo first, the hero's project never first (2.1), area tabs (one at a time); "Xem tất cả dự án" follows the
// chosen tab to /du-an/?khu=… (velis.js)
$with  = array_values( array_filter( $projects, fn( $p ) => velis_usable( velis_image_id( $p ) ) ) );
$none  = array_values( array_filter( $projects, fn( $p ) => ! velis_usable( velis_image_id( $p ) ) ) );
if ( $with && $hero_p && $with[0]->ID === $hero_p->ID ) {
	$with[] = array_shift( $with );
}
$order = array( 'khu-dong', 'khu-tay', 've-tinh', 'tay-bac' );
$tabs  = array();
foreach ( $projects as $p ) {
	foreach ( velis_terms( $p, 'khu-vuc' ) ?: velis_terms( velis_root( $p ), 'khu-vuc' ) as $t ) {
		$top = $t->parent ? get_term( $t->parent, 'khu-vuc' ) : $t;
		if ( $top && ! is_wp_error( $top ) ) {
			$tabs[ $top->slug ]['top']             = $top;
			$tabs[ $top->slug ]['sub'][ $t->slug ] = $t->parent ? $t->name : ( $tabs[ $top->slug ]['sub'][ $t->slug ] ?? null );
		}
	}
}
uksort( $tabs, fn( $a, $b ) => ( array_search( $a, $order, true ) === false ? 99 : array_search( $a, $order, true ) ) <=> ( array_search( $b, $order, true ) === false ? 99 : array_search( $b, $order, true ) ) );
$label = function ( $t ) { // "Vùng vệ tinh" says nothing on its own: its places (Nhơn Trạch – Long Thành) instead (mockup)
	$sub = array_filter( $t['sub'] ?? array() );
	return str_starts_with( $t['top']->name, 'Vùng' ) && $sub ? implode( ', ', $sub ) : $t['top']->name;
};
$cards = array_map( fn( $p ) => preg_replace( '/^<article class="card"/', '<article class="card" data-khu="' . esc_attr( implode( ' ', velis_region_slugs( $p ) ) ) . '"', velis_card_project( $p ) ), array_merge( $with, $none ) );
$n     = count( $cards );
$out  .= '<section class="section" id="du-an" aria-labelledby="du-an-h"><div class="wrap"><header class="sechead"><h2 id="du-an-h">Các dự án nổi bật</h2></header>'
	. ( count( $tabs ) >= 2 ? '<div class="ftabs" role="group" aria-label="Lọc theo khu vực" data-filter="#du-an .grid" data-noun="dự án" data-single><button type="button" data-clear aria-pressed="true">Tất cả</button>'
		. implode( '', array_map( fn( $s, $t ) => '<button type="button" data-key="khu" value="' . esc_attr( $s ) . '" aria-pressed="false">' . esc_html( $label( $t ) ) . '</button>', array_keys( $tabs ), $tabs ) )
		. '<p class="sr-only" data-count aria-live="polite">Hiển thị ' . $n . '/' . $n . ' dự án</p></div>' : '' )
	. velis_grid( $cards, 'three' )
	. '<p class="more-center"><a class="btn btn--line" href="' . esc_url( (string) get_post_type_archive_link( 'du-an' ) ) . '" data-filter-link="khu">Xem tất cả dự án</a></p></div></section>';

// d. partners: developers with a logo, every logo the same visual area (±15 %), ≤ 48 px high, ≤ 160 px wide (duyệt 2026-11-06)
$logo_box = function ( int $id ) {
	$m = wp_get_attachment_metadata( $id );
	$r = ! empty( $m['height'] ) ? $m['width'] / $m['height'] : 2;
	$h = min( 48, sqrt( 3600 / $r ) );
	$w = $h * $r;
	if ( $w > 160 ) {
		$w = 160;
		$h = $w / $r;
	}
	return array( (int) round( $w ), (int) round( $h ) );
};
$devs  = array_filter( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) ), fn( $d ) => get_post_meta( $d->ID, 'velis_logo', true ) && velis_developer_projects( $d ) );
$logos = implode( '', array_map( function ( $d ) use ( $logo_box ) {
	$id         = (int) get_post_meta( $d->ID, 'velis_logo', true );
	list( $w, $h ) = $logo_box( $id );
	return '<li><a href="' . esc_url( get_permalink( $d ) ) . '" aria-label="' . esc_attr( $d->post_title ) . '">' . wp_get_attachment_image( $id, 'medium', false, array( 'alt' => $d->post_title, 'loading' => 'lazy', 'sizes' => $w . 'px', 'style' => "--w: {$w}px; --h: {$h}px" ) ) . '</a></li>';
}, $devs ) );
if ( $logos ) {
	$out .= '<section class="section section--tint" aria-labelledby="cdt-h"><div class="wrap"><header class="sechead"><h2 id="cdt-h">Đối tác của chúng tôi</h2>'
		. '<p>Velis Realty là đơn vị chuyên tư vấn và phân phối bất động sản cao cấp, tập trung vào dự án của các chủ đầu tư có hồ sơ bàn giao và pháp lý công khai.</p></header>'
		. '<ul class="partners">' . $logos . '</ul></div></section>';
}

// e. "Công ty TNHH Velis Realty": the old home's 2 intro paragraphs, word for word, + Giá Trị Khác Biệt (Giới thiệu)
$intro  = array(
	'Tại Velis Realty, chúng tôi tin rằng mỗi bất động sản không chỉ là một tài sản, mà là tâm huyết và tương lai của nhà đầu tư. Velis Realty tư vấn các dự án của Vinhomes, Sun Group, Masterise Homes, Ecopark, Gamuda Land, với giỏ hàng đa dạng từ căn hộ hạng sang, villa nghỉ dưỡng đến shophouse thương mại tại các khu vực đang có hạ tầng mới tại TP.HCM và vùng lân cận.',
	'Đội ngũ chuyên gia của chúng tôi kết hợp giữa tư duy Marketing sắc bén và sự am hiểu thị trường thực chiến, cung cấp thông tin có nguồn, phân tích dòng tiền và rủi ro để khách hàng tự quyết định.',
);
$values = array(
	'Thông Tin Có Nguồn'             => 'Chúng tôi cung cấp thông tin dự án đầy đủ, chính xác về pháp lý và quy hoạch, giúp khách hàng yên tâm trước mỗi quyết định.',
	'Hỗ Trợ Sau Bán'                 => 'Từ lúc tư vấn, ký kết hợp đồng đến khi nhận nhà và quản lý vận hành, Velis Realty luôn hiện diện để hỗ trợ.',
	'Tư Duy Chiến Lược'              => 'Không chỉ bán sản phẩm, chúng tôi cung cấp giải pháp. Velis Realty phân tích dòng tiền, đánh giá tiềm năng tăng giá và tính thanh khoản của từng vị trí.',
	'Cập Nhật Quỹ Căn Và Chính Sách' => 'Cập nhật quỹ căn và chính sách bán hàng ngay khi chủ đầu tư công bố.',
);
$about = get_page_by_path( 'gioi-thieu' );
$out  .= '<section class="section" id="ve-velis" aria-labelledby="ve-velis-h"><div class="wrap"><header class="sechead"><h2 id="ve-velis-h">Công ty TNHH Velis Realty</h2><div class="about__lead">'
	. implode( '', array_map( fn( $t ) => '<p>' . esc_html( $t ) . '</p>', $intro ) ) . '</div></header><p class="eyebrow values-head">Giá Trị Khác Biệt Tại Velis Realty</p>'
	. '<ul class="values">' . implode( '', array_map( fn( $t, $d ) => '<li><h3>' . esc_html( $t ) . '</h3><p>' . esc_html( $d ) . '</p></li>', array_keys( $values ), $values ) ) . '</ul>'
	. ( $about ? '<p class="mb-0">' . velis_btn( 'Tìm hiểu Velis', (string) get_permalink( $about ), 'line' ) . '</p>' : '' ) . '</div></section>';

// f. analyses: newest posts whose featured image is a real project image (velis_image_kind), one per project cluster
$posts = array();
$seen  = array();
foreach ( get_posts( array( 'numberposts' => 40, 'meta_key' => 'velis_image_kind', 'meta_value' => 'du-an' ) ) as $p ) {
	$c = velis_primary_category( $p );
	if ( count( $posts ) < 3 && ! isset( $seen[ $c ? $c->term_id : 0 ] ) ) {
		$posts[]                       = $p;
		$seen[ $c ? $c->term_id : 0 ] = true;
	}
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Bài phân tích chuyên sâu', '', '', 'bai-h', '<a class="btn btn--text" href="/blog/">Đọc blog Velis →</a>' ) . velis_grid( array_map( 'velis_card_post', $posts ) ), '', 'section--tint' );
}

// g. exam + careers: one champagne band, 2 boxes of the same height (sentence of the exam box: duyệt 2026-11-06)
$out .= '<section class="section section--tight section--soft" aria-label="Thi thử chứng chỉ môi giới và cơ hội nghề nghiệp"><div class="wrap duo">'
	. '<div class="duo__item"><h2 class="duo__title">Thi thử chứng chỉ môi giới</h2><p>Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí.</p>' . velis_btn( 'Thi thử CCMG', '/thi/' ) . '</div>'
	. '<div class="duo__item"><h2 class="duo__title">Cơ hội nghề nghiệp</h2><p>Velis Realty đang tuyển nhiều vị trí Chuyên viên Kinh doanh Bất động sản cao cấp, làm việc toàn thời gian tại văn phòng 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh.</p>' . velis_btn( 'Ứng tuyển ngay', '/tuyen-dung/' ) . '</div>'
	. '</div></section>';

$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
