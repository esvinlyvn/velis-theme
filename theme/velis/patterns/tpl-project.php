<?php
/**
 * Title: Trang dự án (theo cấp)
 * Slug: velis/tpl-project
 * Inserter: no
 *
 * One template for every project record; the level decides the blocks (BRIEF.md "Template trang đại đô thị",
 * "Template trang phân khu", "Trang dòng thấp tầng", "Template trang chi tiết"). All values come from velis-data.
 * Every block hides itself when it has nothing to show; the sticky section nav lists only the blocks present.
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
$out    = velis_breadcrumb_html( velis_trail() );

// Hero A: name (H1), developer (link), region, 2 buttons.
$eyebrow = implode( ' · ', array_filter( array(
	implode( ', ', array_map( fn( $d ) => 'publish' === $d->post_status ? '<a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a>' : esc_html( $d->post_title ), $devs ) ),
	esc_html( velis_region_label( $p ) ),
) ) );
$out .= velis_hero_a( array(
	'img' => velis_image_id( $p ), 'title' => $name, 'h1' => true, 'eyebrow' => $eyebrow, 'alt' => 'Phối cảnh ' . $name,
	'buttons' => velis_btn( 'thap-tang' === $level ? 'Nhận bảng giá ' . mb_strtolower( velis_short_name( $p ) ) : 'Nhận bảng giá', '#tu-van', '', ' data-interest="' . esc_attr( $name ) . '"' ) . velis_call_btn(),
) );

$facts    = velis_facts( $p );
$sections = array(); // id => [nav label, html]
// Old pillar post text (phase 4) split into the slots below; its H2 becomes the slot's title (words unchanged).
$chunks = velis_chunks( (string) $p->post_content );
$ct     = fn( $slot, $default ) => ( $chunks[ $slot ]['title'] ?? '' ) ?: $default;
$cb     = fn( $slot ) => trim( $chunks[ $slot ]['html'] ?? '' ) ? '<div class="v-prose">' . velis_content( $chunks[ $slot ]['html'] ) . '</div>' : '';

// Tổng quan: "Nằm trong" box, answer-first summary, every fact in full, editorial content (CEO view, FAQ – phase 4).
$over = '';
if ( $parent && in_array( $level, array( 'phan-khu', 'thap-tang' ), true ) ) {
	$over .= velis_within_html( $parent, 'phan-khu' === $level ? 'Nằm trong đại đô thị' : 'Thuộc ' . ( 'phan-khu' === velis_level( $parent ) ? 'phân khu' : 'dự án' ) );
}
if ( $p->post_excerpt ) {
	$over .= '<p class="v-lead v-answer">' . esc_html( $p->post_excerpt ) . '</p>';
}
// Full text of the quick facts that the bar had to shorten ("Chi tiết" links here); the rest is already readable above.
$over .= velis_overview_html( array_filter( $facts, fn( $v ) => velis_short( (string) $v ) !== trim( preg_replace( '/\s+/u', ' ', (string) $v ) ) ) );
$over .= $cb( 'tong-quan' );
if ( $over ) {
	$sections['tong-quan'] = array( 'Tổng quan', velis_sechead( 'Tổng quan ' . $name, 'Tổng quan' ) . $over );
}

if ( 'dai-do-thi' === $level ) {
	$zones = velis_children( $p, 'phan-khu' );
	if ( $zones ) {
		$sections['phan-khu'] = array( 'Phân khu', velis_sechead( $ct( 'phan-khu', 'Các phân khu ' . $name ), count( $zones ) . ' phân khu', 'Mỗi phân khu mở bán riêng, có giá, mặt bằng và tiến độ riêng.' ) . velis_zone_listing( $p, $zones ) . $cb( 'phan-khu' ) );
	}
	if ( $low = velis_children( $p, 'thap-tang' ) ) { // lines not yet placed in a named phân khu
		$sections['thap-tang'] = array( 'Thấp tầng', velis_sechead( 'Sản phẩm thấp tầng ' . $name, 'Dòng thấp tầng' ) . velis_grid( array_map( 'velis_card_project', $low ), 'zones' ) );
	}
	$crit = array(
		'Loại sản phẩm' => fn( $z ) => implode( ', ', velis_type_names( $z ) ),
		'Quy mô' => fn( $z ) => get_post_meta( $z->ID, 'velis_scale', true ),
		'Diện tích' => fn( $z ) => get_post_meta( $z->ID, 'velis_area', true ),
		'Giá từ' => fn( $z ) => velis_price( $z ),
		'Bàn giao' => fn( $z ) => get_post_meta( $z->ID, 'velis_handover', true ),
		'Pháp lý' => fn( $z ) => get_post_meta( $z->ID, 'velis_legal', true ),
	);
	// Compare like with like: apartment phân khu together, low-rise phân khu together.
	$high = array_filter( $zones, fn( $z ) => isset( velis_type_names( $z )['can-ho'] ) );
	$cmp  = velis_compare_html( array_values( $high ), $crit, 'So sánh phân khu căn hộ ' . $name ) . velis_compare_html( array_values( array_diff_key( $zones, $high ) ), $crit, 'So sánh phân khu thấp tầng ' . $name );
	if ( $cmp ) {
		$sections['so-sanh'] = array( 'So sánh', velis_sechead( 'So sánh các phân khu ' . $name, 'Bảng so sánh' ) . $cmp );
	}
}

if ( in_array( $level, array( 'du-an', 'phan-khu' ), true ) ) {
	$prod = velis_lines_html( $p ) . $cb( 'dong-san-pham' );
	if ( $low = velis_children( $p, 'thap-tang' ) ) {
		$prod .= ( $prod ? '<p class="v-eyebrow v-gap">Dòng thấp tầng</p>' : '' ) . velis_grid( array_map( 'velis_card_project', $low ), 'zones' );
	}
	if ( $prod ) {
		$sections['dong-san-pham'] = array( 'Dòng sản phẩm', velis_sechead( $ct( 'dong-san-pham', 'Dòng sản phẩm ' . $name ), 'Sản phẩm & mặt bằng' ) . $prod );
	}
	if ( 'du-an' === $level && ( $zones = velis_children( $p, 'phan-khu' ) ) ) {
		$sections['phan-khu'] = array( 'Phân khu', velis_sechead( $ct( 'phan-khu', 'Phân khu của ' . $name ), 'Phân khu' ) . velis_grid( array_map( fn( $z ) => velis_card_project( $z, '', 'zone' ), $zones ), 'zones' ) . $cb( 'phan-khu' ) );
	}
	$apart = fn( $x ) => isset( velis_type_names( $x )['can-ho'] );
	$cmp   = array_filter( array_map( 'get_post', (array) get_post_meta( $p->ID, 'velis_compare', true ) ) );
	if ( 'phan-khu' === $level ) {
		$cmp = array_merge( array_filter( velis_children( $parent, 'phan-khu' ), fn( $s ) => $s->ID !== $p->ID ), $cmp );
	}
	$cmp  = array_merge( array( $p ), array_filter( $cmp, fn( $x ) => $apart( $x ) === $apart( $p ) ) );
	$crit = array(
		'Chủ đầu tư' => fn( $x ) => implode( ', ', wp_list_pluck( velis_developers( $x ), 'post_title' ) ),
		'Loại sản phẩm' => fn( $x ) => implode( ', ', velis_type_names( $x ) ),
		'Quy mô' => fn( $x ) => get_post_meta( $x->ID, 'velis_scale', true ),
		'Diện tích' => fn( $x ) => get_post_meta( $x->ID, 'velis_area', true ),
		'Giá từ' => fn( $x ) => velis_price( $x ),
		'Bàn giao' => fn( $x ) => get_post_meta( $x->ID, 'velis_handover', true ),
	);
	if ( $html = velis_compare_html( $cmp, $crit, 'So sánh ' . $name, $p ) ) {
		$sections['so-sanh'] = array( 'So sánh', velis_sechead( 'phan-khu' === $level ? 'So sánh với các phân khu khác của ' . $parent->post_title : 'So sánh ' . $name . ' với dự án cùng phân khúc', 'So sánh' ) . $html );
	}
}

if ( 'thap-tang' === $level ) {
	$plans = array_filter( (array) get_post_meta( $p->ID, 'velis_floorplans', true ) );
	if ( $plans ) {
		$sections['mat-bang'] = array( 'Mặt bằng', velis_sechead( 'Mặt bằng ' . $name, 'Mặt bằng từng tầng' ) . velis_gallery_html( $plans, 'Mặt bằng ' . $name, 'Mặt bằng từng tầng' ) );
	}
	$num  = fn( $k, $u ) => fn( $x ) => '' !== (string) get_post_meta( $x->ID, $k, true ) ? velis_num( get_post_meta( $x->ID, $k, true ) ) . $u : '';
	$crit = array( 'Diện tích đất' => $num( 'velis_land_area', ' m²' ), 'Diện tích sàn' => $num( 'velis_floor_area', ' m²' ), 'Số tầng' => $num( 'velis_floors', '' ), 'Mặt tiền' => $num( 'velis_frontage', ' m' ), 'Giá' => fn( $x ) => velis_price( $x ), 'Sở hữu' => fn( $x ) => get_post_meta( $x->ID, 'velis_ownership', true ) );
	if ( $html = velis_compare_html( velis_children( $parent, 'thap-tang' ), $crit, 'Dòng thấp tầng ' . $parent->post_title, $p ) ) {
		$sections['so-sanh'] = array( 'So sánh', velis_sechead( 'So sánh các dòng thấp tầng ' . $parent->post_title, 'So sánh' ) . $html );
	}
}

// Location: always a static map (own or region-level), connectivity written once on the đại đô thị.
$conn = velis_text( (string) get_post_meta( $p->ID, 'velis_connectivity', true ) );
if ( ! $conn && $parent && velis_f( $p, 'velis_connectivity' ) ) {
	$conn = '<p>Vị trí và kết nối viết chung cho cả ' . esc_html( $root->post_title ) . ': <a href="' . esc_url( get_permalink( $root ) ) . '#vi-tri">xem trên trang ' . esc_html( $root->post_title ) . '</a>.</p>';
}
$conn .= $cb( 'vi-tri' );
if ( ( $map = velis_map_html( $p ) ) || $conn ) {
	$sections['vi-tri'] = array( 'Vị trí', velis_sechead( $ct( 'vi-tri', 'Vị trí ' . $name ), 'Vị trí & kết nối' ) . $map . $conn );
}
$amen   = velis_text( (string) get_post_meta( $p->ID, 'velis_amenities', true ) ) . $cb( 'tien-ich' );
$common = $parent && velis_f( $parent, 'velis_amenities' ) ? '<p>Tiện ích chung của ' . esc_html( $root->post_title ) . ': <a href="' . esc_url( get_permalink( $root ) ) . '#tien-ich">xem trên trang đại đô thị</a>.</p>' : '';
if ( $amen || $common ) {
	$sections['tien-ich'] = array( 'Tiện ích', velis_sechead( $ct( 'tien-ich', 'Tiện ích ' . $name ), $parent ? 'Tiện ích nội khu' : 'Tiện ích' ) . $amen . $common );
}
if ( $planning = velis_text( (string) get_post_meta( $p->ID, 'velis_planning', true ) ) ) {
	$sections['quy-hoach'] = array( 'Quy hoạch', velis_sechead( 'Quy hoạch ' . $name, 'Quy hoạch' ) . $planning );
}
$master = 'dai-do-thi' === $level ? array_filter( (array) get_post_meta( $p->ID, 'velis_floorplans', true ) ) : array();
$photos = array_merge( $master, array_filter( (array) get_post_meta( $p->ID, 'velis_gallery', true ) ) );
if ( $photos ) {
	$sections['thu-vien'] = array( 'Thư viện', velis_sechead( 'Hình ảnh ' . $name, $master ? 'Mặt bằng tổng & thư viện ảnh' : 'Thư viện ảnh' ) . velis_gallery_html( $photos, $name ) );
}

// Slots that only the old pillar text fills (a slot already built above got its text there).
foreach ( array( 'dong-san-pham' => array( 'Dòng sản phẩm', 'Sản phẩm' ), 'phan-khu' => array( 'Phân khu', 'Phân khu' ), 'gia' => array( 'Giá', 'Giá bán' ), 'mat-bang' => array( 'Mặt bằng', 'Mặt bằng' ),
	'tien-do' => array( 'Tiến độ', 'Tiến độ' ), 'goc-nhin' => array( 'Góc nhìn CEO', 'Góc nhìn của CEO' ), 'chu-dau-tu' => array( 'Chủ đầu tư', 'Chủ đầu tư' ), 'hoi-dap' => array( 'Hỏi đáp', 'Câu hỏi thường gặp' ) ) as $slot => $l ) {
	if ( ! isset( $sections[ $slot ] ) && isset( $chunks[ $slot ] ) ) {
		$sections[ $slot ] = array( $l[0], velis_sechead( $ct( $slot, $l[0] . ' ' . $name ), $l[1] ) . $cb( $slot ) );
	}
}

$posts = velis_project_posts( $p, 'thap-tang' === $level ? 3 : 6 );
if ( $posts || isset( $chunks['bai-viet'] ) ) {
	$cat = velis_cluster( $p );
	$all = $cat ? '<a class="v-btn v-btn--secondary" href="' . esc_url( get_category_link( $cat ) ) . '">Tất cả bài ' . esc_html( $cat->name ) . '</a>' : '';
	$sections['bai-viet'] = array( 'Bài viết', velis_sechead( 'Phân tích ' . $root->post_title, 'Bài viết của Vũ Xuân', '', '', $all ) . ( $posts ? velis_grid( array_map( 'velis_card_post', $posts ), '3 v-rail' ) : '' ) . $cb( 'bai-viet' ) );
}
$order = array_flip( array( 'tong-quan', 'dong-san-pham', 'gia', 'mat-bang', 'phan-khu', 'thap-tang', 'so-sanh', 'tien-do', 'vi-tri', 'tien-ich', 'quy-hoach', 'thu-vien', 'goc-nhin', 'chu-dau-tu', 'hoi-dap', 'bai-viet' ) );
uksort( $sections, fn( $a, $b ) => $order[ $a ] <=> $order[ $b ] );

$nav  = array_map( fn( $s ) => $s[0], $sections ) + array( 'tu-van' => 'Nhận tư vấn' );
$body = '';
foreach ( $sections as $id => $s ) {
	$body .= '<section class="v-block" id="' . esc_attr( $id ) . '">' . $s[1] . '</section>';
}
$price = velis_price( $p );
$src   = (string) get_post_meta( $p->ID, 'velis_price_source', true );
$out  .= velis_section_nav( $nav ) . '<div class="v-wrap v-projhead">' . velis_facts_html( $facts, '' === $price ? null : $price, $src ? 'Nguồn giá: ' . $src : '', array( 'Vị trí' => '#vi-tri' ) ) . '</div>'
	. '<div class="v-wrap v-page">' . $body . velis_disclosure() . '</div>';

// Consultation form pre-filled with this record; đại đô thị offers its phân khu.
$opts = 'dai-do-thi' === $level ? array_map( fn( $z ) => $name . ' – ' . $z->post_title, velis_children( $p, 'phan-khu' ) ) : array();
$out .= velis_form_html( $name, $opts, 'thap-tang' === $level ? 'Nhận bảng giá ' . $name : 'Nhận tư vấn ' . $name );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaping helpers ?>
<!-- /wp:html -->
