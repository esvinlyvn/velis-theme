<?php
/**
 * Title: Trang tác giả
 * Slug: velis/tpl-author
 * Inserter: no
 */
if ( ! is_author() ) {
	return;
}
$u     = get_queried_object();
$paged = max( 1, (int) get_query_var( 'paged' ) );
$q     = new WP_Query( array( 'author' => $u->ID, 'paged' => $paged, 'posts_per_page' => 12 ) );
$bio   = get_the_author_meta( 'description', $u->ID );
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Chuyên gia · CEO Velis Realty',
	'title'   => $u->display_name . ( $paged > 1 ? " – trang $paged" : '' ),
	'lead'    => $bio ?: 'Tư vấn bất động sản cao cấp, phân tích theo dòng tiền và giá vốn thực.',
	'buttons' => velis_btn( 'Liên hệ ' . $u->display_name, '#tu-van' ),
) );
$cats = array();
foreach ( $q->posts as $p ) {
	if ( $c = velis_primary_category( $p ) ) {
		$cats[ $c->term_id ] = '<a href="' . esc_url( get_category_link( $c ) ) . '">' . esc_html( $c->name ) . '</a>';
	}
}
$out .= velis_section( ( $cats ? '<p class="v-source">Lĩnh vực: ' . implode( ', ', $cats ) . '</p>' : '' ) . velis_sechead( 'Bài viết của ' . $u->display_name, $q->found_posts . ' bài' ) . velis_grid( array_map( 'velis_card_post', $q->posts ), '3' ) . velis_pagination( $q ) );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
