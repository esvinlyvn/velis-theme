<?php
/**
 * Title: Trang tác giả
 * Slug: velis/tpl-author
 * Inserter: no
 *
 * Profile frame (photo, role, bio, years of experience, social profiles, fields of work) – every slot hides when empty.
 * User fields: description (core), velis_photo (attachment ID), velis_role, velis_years, and the social URLs Rank Math
 * adds to the profile (facebook, twitter, additional_profile_urls). Fields of work = clusters the author wrote in.
 */
if ( ! is_author() ) {
	return;
}
$u     = get_queried_object();
$paged = max( 1, (int) get_query_var( 'paged' ) );
$q     = new WP_Query( array( 'author' => $u->ID, 'paged' => $paged, 'posts_per_page' => 12 ) );
$m     = fn( $k ) => trim( (string) get_user_meta( $u->ID, $k, true ) );
$photo = (int) $m( 'velis_photo' );
$role  = $m( 'velis_role' ) ?: 'CEO Velis Realty';
$years = $m( 'velis_years' );
$urls  = array_filter( array_merge( array( $m( 'facebook' ), $m( 'twitter' ) ? 'https://x.com/' . ltrim( $m( 'twitter' ), '@' ) : '' ), preg_split( '/\s+/', $m( 'additional_profile_urls' ) ) ) );
$areas = array();
foreach ( get_posts( array( 'author' => $u->ID, 'numberposts' => 200, 'fields' => 'ids' ) ) as $id ) {
	if ( ( $c = velis_primary_category( $id ) ) && velis_is_cluster( $c ) ) {
		$areas[ $c->term_id ] = array( get_category_link( $c ), $c->name, '' );
	}
}
$facts = array_filter( array(
	'Kinh nghiệm' => $years ? esc_html( $years . ' năm' ) : '',
	'Mạng xã hội' => implode( ' · ', array_map( fn( $l ) => '<a href="' . esc_url( $l ) . '" rel="me noopener" target="_blank">' . esc_html( wp_parse_url( $l, PHP_URL_HOST ) ) . '</a>', $urls ) ),
) );
$dl  = implode( '', array_map( fn( $k, $v ) => '<div><dt>' . esc_html( $k ) . '</dt><dd>' . $v . '</dd></div>', array_keys( $facts ), $facts ) );
$dl .= $areas ? '</dl><p class="muted mb-0">Lĩnh vực</p>' . velis_sidelist( array_values( $areas ) ) . '<dl>' : ''; // 5.5: one link a line under its label, outside the 2-column facts list
$stats = array_filter( array( 'bài phân tích' => (int) count_user_posts( $u->ID, 'post', true ), 'cụm dự án theo dõi' => count( $areas ), 'năm kinh nghiệm' => (int) $years ) );
// Profile = hero B (photo when there is one) + the numbers band (mockup) + the facts as the advisor card.
$out = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Chuyên gia · ' . $role,
	'title'   => $u->display_name . ( $paged > 1 ? ' – trang ' . $paged : '' ),
	'lead'    => $u->description,
	// 5.10: portrait in the header (the author's photo; Vũ Xuân → the bundled CEO portrait), contact button under it
	'buttons' => ( $photo ? velis_img( $photo, $u->display_name, 'medium_large', array( 'zoom' => 1, 'sizes' => '200px', 'class' => 'hero__portrait', 'lcp' => true ) )
		: ( 'vu-xuan' === $u->user_nicename ? '<img class="hero__portrait" src="' . esc_url( get_theme_file_uri( 'assets/brand/vu-thanh-xuan-ceo-velis-720.webp' ) ) . '" width="720" height="960" alt="' . esc_attr( $u->display_name ) . '" fetchpriority="high">' : '' ) )
		. velis_btn( 'Liên hệ ' . $u->display_name, '#tu-van' ),
) );
if ( $stats ) {
	$out .= velis_section( '<dl class="numbers" aria-label="' . esc_attr( $u->display_name ) . ' bằng con số">' . implode( '', array_map( fn( $k, $v ) => '<div><dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( (string) $v ) . '</dd></div>', array_keys( $stats ), $stats ) ) . '</dl>', '', 'section--tight section--tint' );
}
$side = $dl ? '<aside class="page__side" aria-label="Thông tin tác giả"><div class="advisor"><p class="eyebrow">Hồ sơ</p>' . ( $photo ? '<div class="advisor__who"><span class="advisor__img">' . velis_img( $photo, $u->display_name, 'thumbnail', array( 'zoom' => 1, 'sizes' => '80px' ) ) . '</span><p><b>' . esc_html( $u->display_name ) . '</b><span>' . esc_html( $role ) . '</span></p></div>' : '<p class="pricecard__title">' . esc_html( $u->display_name ) . '</p>' ) . '<dl>' . $dl . '</dl></div></aside>' : '';
$grid = velis_sechead( 'Bài viết của ' . $u->display_name, $q->found_posts . ' bài' ) . velis_grid( array_map( 'velis_card_post', $q->posts ), $side ? '' : 'three' ) . velis_pagination( $q );
$out .= $side ? '<div class="wrap page"><div class="page__main"><div class="block">' . $grid . '</div><div class="block advisor-inline">' . str_replace( array( '<aside class="page__side" aria-label="Thông tin tác giả">', '</aside>' ), '', $side ) . '</div></div>' . $side . '</div>' : velis_section( $grid );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
