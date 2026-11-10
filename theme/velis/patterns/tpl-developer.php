<?php
/**
 * Title: Trang chủ đầu tư
 * Slug: velis/tpl-developer
 * Inserter: no
 *
 * Hero (logo, name, summary, photo of a flagship project) · quick facts with sources · projects (chip filter by status)
 * · CEO view (editor content) · latest posts of the silo · relation note · form pre-filled with the developer.
 */
if ( ! is_singular( 'chu-dau-tu' ) ) {
	return;
}
$d = get_queried_object();
setup_postdata( $GLOBALS['post'] = $d ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
$projs = velis_developer_projects( $d );
$img   = $projs ? velis_image_id( $projs[0] ) : 0;
$logo  = velis_dev_logo( $d ); // same area rule as the home partner row (2.9)
$out   = velis_breadcrumb_html( velis_trail() );
$out  .= velis_hero_b( array(
	'eyebrow' => 'Chủ đầu tư',
	'title'   => 'Chủ đầu tư ' . $d->post_title,
	'lead'    => $d->post_excerpt ?: ( $projs ? 'Dự án Velis đang tư vấn: ' . implode( ', ', wp_list_pluck( $projs, 'post_title' ) ) . '.' : '' ),
	'img'     => $img, 'alt' => $projs ? 'Phối cảnh ' . $projs[0]->post_title : '',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van', '', ' data-interest="' . esc_attr( $d->post_title ) . '"' ) . velis_call_btn( 'line' ),
	'after'   => $logo ? '<ul class="partners">' . '<li>' . $logo . '</li></ul>' : '', // 5.6: the logo belongs to the page header
) );
$facts = array(
	'Tên viết tắt' => get_post_meta( $d->ID, 'velis_short_name', true ),
	'Năm thành lập' => get_post_meta( $d->ID, 'velis_founded', true ),
	'Trụ sở' => get_post_meta( $d->ID, 'velis_hq', true ),
	'Công ty mẹ' => get_post_meta( $d->ID, 'velis_parent_co', true ),
);
$links = array_filter( array( 'Website chính thức' => get_post_meta( $d->ID, 'velis_website', true ), 'Wikipedia' => get_post_meta( $d->ID, 'velis_wikipedia', true ) ) );
$dl    = '';
foreach ( array_filter( $facts ) as $k => $v ) {
	$dl .= '<div><dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd></div>';
}
foreach ( $links as $k => $u ) {
	$dl .= '<div><dt>' . esc_html( $k ) . '</dt><dd><a href="' . esc_url( $u ) . '" rel="noopener" target="_blank">' . esc_html( wp_parse_url( $u, PHP_URL_HOST ) ) . '</a></dd></div>';
}
// Rhythm (1.5): facts (white) → projects (ivory) → CEO view (white) → posts (ivory) → relation note; dark = the form only.
$band     = array( 'section--tint', '' );
$i        = 0;
$sections = '';
if ( $dl ) { // 5.6: only when there is data, as a table (the facts list)
	$sections .= velis_section( velis_sechead( 'Thông tin nhanh về ' . $d->post_title, 'Dữ kiện công khai' ) . '<dl class="facts__list" data-n="' . substr_count( $dl, '<div>' ) . '">' . str_replace( '<div>', '<div class="facts__item">', $dl ) . '</dl>', '', $band[ $i++ % 2 ] );
}
if ( $projs ) {
	$st = array();
	foreach ( $projs as $p ) {
		if ( $s = velis_status( $p ) ) {
			$st[ sanitize_title( $s ) ] = $s;
		}
	}
	$sections .= velis_section( velis_sechead( 'Dự án ' . $d->post_title . ' Velis đang tư vấn', count( $projs ) . ' dự án' ) . '<div data-chipgrid>' . velis_chipbar( 'tt', $st, 'Lọc theo trạng thái', 'dự án' ) . velis_grid( array_map( fn( $p ) => velis_card_project( $p, '', true ), $projs ), 'three', ' data-live' ) . '</div>', 'du-an', $band[ $i++ % 2 ] );
}
if ( trim( $d->post_content ) ) {
	$sections .= velis_section( velis_sechead( 'Góc nhìn của CEO Vũ Xuân về ' . $d->post_title, 'Nhận định' ) . '<div class="prose">' . velis_content( $d->post_content ) . '</div>', 'nhan-dinh', $band[ $i++ % 2 ] ); // phpcs:ignore
}
$posts = array();
foreach ( $projs as $p ) {
	$posts = array_merge( $posts, velis_project_posts( $p, 3 ) );
}
if ( $posts ) {
	$sections .= velis_section( velis_sechead( 'Bài viết về dự án ' . $d->post_title, 'Bài viết mới' ) . velis_grid( array_map( 'velis_card_post', array_slice( $posts, 0, count( $posts ) >= 6 ? 6 : 3 ) ), 'three' ), '', $band[ $i++ % 2 ] );
}
if ( $rel = get_post_meta( $d->ID, 'velis_relation', true ) ) {
	$sections .= velis_section( '<p class="disclosure mb-0" role="note"><b>Quan hệ với Velis:</b> ' . esc_html( $rel ) . '</p>', '', $band[ $i++ % 2 ] . ' section--tight' );
}
$out .= $sections . velis_form_html( $d->post_title, wp_list_pluck( $projs, 'post_title' ), 'Nhận tư vấn dự án ' . $d->post_title );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
