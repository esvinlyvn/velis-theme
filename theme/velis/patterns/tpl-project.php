<?php
/**
 * Title: Trang dự án (theo cấp)
 * Slug: velis/tpl-project
 * Inserter: no
 *
 * One template for every project record; the level decides the blocks (BRIEF.md "Template trang đại đô thị",
 * "Template trang phân khu", "Trang dòng thấp tầng", "Template trang chi tiết"). All values come from velis-data.
 */
if ( ! velis_has_data() || ! is_singular( 'du-an' ) ) {
	return;
}
$p = get_queried_object();
setup_postdata( $GLOBALS['post'] = $p ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride -- shortcodes in content expect it
$level  = velis_level( $p );
$name   = $p->post_title;
$parent = $p->post_parent ? get_post( $p->post_parent ) : null;
$root   = velis_root( $p );
$devs   = velis_developers( $p );
$pub    = array_filter( $devs, fn( $d ) => 'publish' === $d->post_status );
$e      = fn( $s ) => esc_html( $s );
$out    = '';

// Hero A: name (H1), developer (link), region, 2 buttons.
$eyebrow = implode( ' · ', array_filter( array(
	implode( ', ', array_map( fn( $d ) => 'publish' === $d->post_status ? '<a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a>' : esc_html( $d->post_title ), $devs ) ),
	esc_html( velis_region_label( $p ) ),
) ) );
$out .= velis_breadcrumb_html( velis_trail() );
$out .= velis_hero_a( array(
	'img' => velis_image_id( $p ), 'title' => $name, 'h1' => true, 'eyebrow' => $eyebrow, 'alt' => 'Phối cảnh ' . $name,
	'buttons' => velis_btn( 'thap-tang' === $level ? 'Nhận bảng giá ' . mb_strtolower( velis_short_name( $p ) ) : 'Nhận bảng giá', '#tu-van', '', ' data-interest="' . esc_attr( $name ) . '"' ) . velis_call_btn(),
) );

// Quick facts + answer-first summary.
$price  = velis_price( $p );
$source = (string) get_post_meta( $p->ID, 'velis_price_source', true );
$intro  = '<div class="v-wrap v-projhead">';
if ( $parent && in_array( $level, array( 'phan-khu', 'thap-tang' ), true ) ) {
	// "Nằm trong …" box right under the hero (phân khu → đại đô thị; dòng thấp tầng → phân khu).
	$intro .= '<aside class="v-within" aria-label="Nằm trong"><p class="v-eyebrow">' . ( 'phan-khu' === $level ? 'Nằm trong đại đô thị' : 'Thuộc phân khu' ) . '</p><p><a href="' . esc_url( get_permalink( $parent ) ) . '">' . esc_html( $parent->post_title ) . '</a>'
		. ( 'thap-tang' === $level && $parent->post_parent ? ' · ' . esc_html( get_the_title( $parent->post_parent ) ) : '' ) . '</p>'
		. ( $parent->post_excerpt ? '<p>' . esc_html( $parent->post_excerpt ) . '</p>' : '' ) . '</aside>';
}
$intro .= velis_facts_html( velis_facts( $p ), $price, $source ? 'Nguồn giá: ' . $source : '' ); // after the "Nằm trong" box (brief: box right under the hero)
if ( $p->post_excerpt ) {
	$intro .= '<p class="v-lead v-answer">' . esc_html( $p->post_excerpt ) . '</p>';
}
$out .= $intro . '</div>';

$sections = array(); // [id, menu label, html]

if ( 'dai-do-thi' === $level ) {
	$zones = velis_children( $p, 'phan-khu' );
	$plan  = array_filter( (array) get_post_meta( $p->ID, 'velis_floorplans', true ) );
	if ( $plan ) {
		$sections[] = array( 'mat-bang-tong', 'Mặt bằng tổng', velis_sechead( 'Mặt bằng tổng thể ' . $name, 'Bản đồ phân khu' ) . velis_gallery_html( $plan, 'Mặt bằng tổng thể ' . $name, 'Mặt bằng' ) . '<ul class="v-list">' . implode( '', array_map( fn( $z ) => '<li><a href="' . esc_url( get_permalink( $z ) ) . '">' . esc_html( $z->post_title ) . '</a></li>', $zones ) ) . '</ul>' );
	}
	if ( $zones ) {
		$sections[] = array( 'phan-khu', 'Các phân khu', velis_sechead( 'Các phân khu ' . $name, count( $zones ) . ' phân khu', 'Mỗi phân khu mở bán riêng, có giá, mặt bằng và tiến độ riêng.' ) . velis_zone_listing( $p, $zones ) );
		$crit = array(
			'Loại sản phẩm' => fn( $z ) => implode( ', ', velis_type_names( $z ) ),
			'Quy mô' => fn( $z ) => get_post_meta( $z->ID, 'velis_scale', true ),
			'Diện tích' => fn( $z ) => get_post_meta( $z->ID, 'velis_area', true ),
			'Giá từ' => fn( $z ) => velis_price( $z ),
			'Bàn giao' => fn( $z ) => get_post_meta( $z->ID, 'velis_handover', true ),
			'Pháp lý' => fn( $z ) => get_post_meta( $z->ID, 'velis_legal', true ),
		);
		$sections[] = array( 'so-sanh', 'So sánh phân khu', velis_sechead( 'So sánh các phân khu ' . $name, 'Bảng so sánh' ) . velis_compare_html( $zones, $crit, 'So sánh phân khu ' . $name ) );
	}
}

if ( 'dai-do-thi' === $level && ( $low = velis_children( $p, 'thap-tang' ) ) ) { // lines not yet placed in a named phân khu
	$sections[] = array( 'thap-tang', 'Nhà phố, shophouse, biệt thự', velis_sechead( 'Sản phẩm thấp tầng ' . $name, 'Dòng thấp tầng' ) . velis_grid( array_map( 'velis_card_project', $low ), 'zones' ) );
}

if ( in_array( $level, array( 'du-an', 'phan-khu' ), true ) ) {
	if ( $lines = velis_lines_html( $p ) ) {
		$sections[] = array( 'dong-can-ho', 'Dòng căn hộ', velis_sechead( 'Dòng căn hộ ' . $name, 'Sản phẩm & mặt bằng' ) . $lines );
	}
	if ( $low = velis_children( $p, 'thap-tang' ) ) {
		$sections[] = array( 'thap-tang', 'Nhà phố, shophouse, biệt thự', velis_sechead( 'Sản phẩm thấp tầng ' . $name, 'Dòng thấp tầng' ) . velis_grid( array_map( 'velis_card_project', $low ), 'zones' ) );
	}
	if ( 'du-an' === $level && ( $zones = velis_children( $p, 'phan-khu' ) ) ) {
		$sections[] = array( 'phan-khu', 'Phân khu', velis_sechead( 'Phân khu của ' . $name, 'Phân khu' ) . velis_grid( array_map( 'velis_card_project', $zones ), 'zones' ) );
	}
}

if ( 'thap-tang' === $level ) {
	$plans = array_filter( (array) get_post_meta( $p->ID, 'velis_floorplans', true ) );
	if ( $plans ) {
		$sections[] = array( 'mat-bang', 'Mặt bằng từng tầng', velis_sechead( 'Mặt bằng ' . $name, 'Mặt bằng từng tầng' ) . velis_gallery_html( $plans, 'Mặt bằng ' . $name, 'Mặt bằng từng tầng' ) );
	}
	$sib = velis_children( $parent, 'thap-tang' );
	$crit = array(
		'Diện tích đất' => fn( $x ) => ( $v = get_post_meta( $x->ID, 'velis_land_area', true ) ) !== '' ? velis_num( $v ) . ' m²' : '',
		'Diện tích sàn' => fn( $x ) => ( $v = get_post_meta( $x->ID, 'velis_floor_area', true ) ) !== '' ? velis_num( $v ) . ' m²' : '',
		'Số tầng' => fn( $x ) => get_post_meta( $x->ID, 'velis_floors', true ),
		'Mặt tiền' => fn( $x ) => ( $v = get_post_meta( $x->ID, 'velis_frontage', true ) ) !== '' ? velis_num( $v ) . ' m' : '',
		'Giá' => fn( $x ) => velis_price( $x ),
		'Sở hữu' => fn( $x ) => get_post_meta( $x->ID, 'velis_ownership', true ),
	);
	if ( count( $sib ) > 1 ) {
		$sections[] = array( 'so-sanh', 'So sánh', velis_sechead( 'So sánh các dòng thấp tầng ' . $parent->post_title, 'So sánh' ) . velis_compare_html( $sib, $crit, 'Dòng thấp tầng ' . $parent->post_title, $p ) );
	}
}

// Location & amenities: written once on the đại đô thị; sub-records show their own text, else a summary + link.
$conn = (string) get_post_meta( $p->ID, 'velis_connectivity', true );
$amen = (string) get_post_meta( $p->ID, 'velis_amenities', true );
$plan = (string) get_post_meta( $p->ID, 'velis_planning', true );
$loc  = velis_text( $conn );
if ( ! $loc && $parent && velis_f( $p, 'velis_connectivity' ) ) {
	$loc = '<p>Vị trí và kết nối viết chung cho cả ' . esc_html( get_the_title( $root ) ) . ': <a href="' . esc_url( get_permalink( $root ) ) . '#vi-tri">xem trên trang ' . esc_html( get_the_title( $root ) ) . '</a>.</p>';
}
$addr = (string) velis_f( $p, 'velis_address' );
if ( $loc || $addr ) {
	$map = $addr ? '<p class="v-source">Địa chỉ: ' . esc_html( $addr ) . ' · <a href="' . esc_url( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( $root->post_title . ' ' . $addr ) ) . '" target="_blank" rel="noopener">Xem trên Google Maps</a></p>' : '';
	$sections[] = array( 'vi-tri', 'Vị trí & kết nối', velis_sechead( 'Vị trí ' . $name, 'Vị trí & kết nối' ) . $map . $loc );
}
if ( $amen || ( $parent && velis_f( $p, 'velis_amenities' ) ) ) {
	$common = $parent && velis_f( $parent, 'velis_amenities' ) ? '<p>Tiện ích chung của ' . esc_html( get_the_title( $root ) ) . ': <a href="' . esc_url( get_permalink( $root ) ) . '#tien-ich">xem trên trang đại đô thị</a>.</p>' : '';
	$sections[] = array( 'tien-ich', 'Tiện ích', velis_sechead( 'Tiện ích ' . $name, $parent ? 'Tiện ích nội khu' : 'Tiện ích' ) . velis_text( $amen ) . $common );
}
if ( $plan ) {
	$sections[] = array( 'quy-hoach', 'Quy hoạch', velis_sechead( 'Quy hoạch ' . $name, 'Quy hoạch' ) . velis_text( $plan ) );
}
$gallery = array_filter( (array) get_post_meta( $p->ID, 'velis_gallery', true ) );
if ( $gallery ) {
	$sections[] = array( 'hinh-anh', 'Hình ảnh', velis_sechead( 'Hình ảnh ' . $name, 'Thư viện ảnh' ) . velis_gallery_html( $gallery, $name ) );
}

// Editorial content (CEO view, FAQ, timeline) – written in the editor; migrated in phase 4.
$content = trim( $p->post_content ) ? velis_content( $p->post_content ) : ''; // phpcs:ignore -- core filter
if ( $content ) {
	$sections[] = array( 'phan-tich', 'Phân tích', '<div class="v-prose">' . $content . '</div>' );
}

if ( in_array( $level, array( 'du-an', 'phan-khu' ), true ) ) {
	$cmp = array_filter( array_map( 'get_post', (array) get_post_meta( $p->ID, 'velis_compare', true ) ) );
	if ( 'phan-khu' === $level ) {
		$cmp = array_merge( array( $p ), array_filter( velis_children( $parent, 'phan-khu' ), fn( $s ) => $s->ID !== $p->ID ), $cmp );
	} elseif ( $cmp ) {
		$cmp = array_merge( array( $p ), $cmp );
	}
	$crit = array(
		'Chủ đầu tư' => fn( $x ) => implode( ', ', wp_list_pluck( velis_developers( $x ), 'post_title' ) ),
		'Loại sản phẩm' => fn( $x ) => implode( ', ', velis_type_names( $x ) ),
		'Diện tích' => fn( $x ) => get_post_meta( $x->ID, 'velis_area', true ),
		'Giá từ' => fn( $x ) => velis_price( $x ),
		'Bàn giao' => fn( $x ) => get_post_meta( $x->ID, 'velis_handover', true ),
	);
	if ( count( $cmp ) > 1 ) {
		$sections[] = array( 'so-sanh', 'So sánh', velis_sechead( 'phan-khu' === $level ? 'So sánh với các phân khu khác của ' . $parent->post_title : 'So sánh ' . $name . ' với dự án cùng phân khúc', 'So sánh' ) . velis_compare_html( $cmp, $crit, 'So sánh ' . $name, $p ) );
	}
}

$posts = velis_project_posts( $p, 'thap-tang' === $level ? 3 : 6 );
if ( $posts ) {
	$cat  = velis_cluster( $p );
	$more = $cat ? '<p><a class="v-btn v-btn--text" href="' . esc_url( get_category_link( $cat ) ) . '">Tất cả phân tích về ' . esc_html( $cat->name ) . '</a></p>' : '';
	$sections[] = array( 'bai-viet', 'Bài phân tích', velis_sechead( 'Phân tích ' . get_the_title( $root ), 'Bài viết của Vũ Xuân' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3' ) . $more );
}

// Sticky table of contents when there are enough sections (desktop: side; mobile: collapsed).
$toc = count( $sections ) >= 4 ? '<details class="v-toc v-toc--page" data-toc><summary>Mục lục</summary><ol>' . implode( '', array_map( fn( $s ) => '<li><a href="#' . esc_attr( $s[0] ) . '">' . esc_html( $s[1] ) . '</a></li>', $sections ) ) . '<li><a href="#tu-van">Nhận tư vấn</a></li></ol></details>' : '';
$body = '';
foreach ( $sections as $s ) {
	$body .= '<section class="v-block" id="' . esc_attr( $s[0] ) . '">' . $s[2] . '</section>';
}
$out .= '<div class="v-wrap v-page' . ( $toc ? ' has-toc' : '' ) . '">' . $toc . '<div class="v-page__body">' . $body . velis_disclosure() . '</div></div>';

// Consultation form pre-filled with this record; đại đô thị offers its phân khu.
$opts = 'dai-do-thi' === $level ? array_map( fn( $z ) => $name . ' – ' . $z->post_title, velis_children( $p, 'phan-khu' ) ) : array();
$out .= velis_form_html( $name, $opts, 'thap-tang' === $level ? 'Nhận bảng giá ' . $name : 'Nhận tư vấn ' . $name );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaping helpers ?>
<!-- /wp:html -->
