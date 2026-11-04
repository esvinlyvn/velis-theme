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
		$areas[ $c->term_id ] = '<a href="' . esc_url( get_category_link( $c ) ) . '">' . esc_html( $c->name ) . '</a>';
	}
}
$facts = array_filter( array(
	'Kinh nghiệm' => $years ? esc_html( $years . ' năm' ) : '',
	'Lĩnh vực' => implode( ', ', $areas ),
	'Mạng xã hội' => implode( ' · ', array_map( fn( $l ) => '<a href="' . esc_url( $l ) . '" rel="me noopener" target="_blank">' . esc_html( wp_parse_url( $l, PHP_URL_HOST ) ) . '</a>', $urls ) ),
) );
$dl  = implode( '', array_map( fn( $k, $v ) => '<div><dt>' . esc_html( $k ) . '</dt><dd>' . $v . '</dd></div>', array_keys( $facts ), $facts ) );
$out = velis_breadcrumb_html( velis_trail() ) . '<div class="v-wrap"><section class="v-profile' . ( $photo ? ' has-photo' : '' ) . '">' . ( $photo ? velis_img( $photo, $u->display_name, 'medium', array( 'loading' => 'eager', 'class' => 'v-profile__photo' ) ) : '' )
	. '<div><p class="v-eyebrow">Chuyên gia · ' . esc_html( $role ) . '</p><h1>' . esc_html( $u->display_name ) . ( $paged > 1 ? ' – trang ' . $paged : '' ) . '</h1>'
	. ( $u->description ? '<p class="v-lead">' . esc_html( $u->description ) . '</p>' : '' ) . ( $dl ? '<dl class="v-overview">' . $dl . '</dl>' : '' )
	. '<div class="v-row">' . velis_btn( 'Liên hệ ' . $u->display_name, '#tu-van' ) . '</div></div></section></div>';
$out .= velis_section( velis_sechead( 'Bài viết của ' . $u->display_name, $q->found_posts . ' bài' ) . velis_grid( array_map( 'velis_card_post', $q->posts ), '3' ) . velis_pagination( $q ) );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
