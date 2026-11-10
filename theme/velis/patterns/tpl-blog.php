<?php
/**
 * Title: Trang blog
 * Slug: velis/tpl-blog
 * Inserter: no
 *
 * /blog/: the newest post first and large, then the next posts (filter by post kind), clusters, search box.
 */
$latest   = get_posts( array( 'numberposts' => 10 ) );
$first    = array_shift( $latest );
$clusters = array_filter( get_categories( array( 'hide_empty' => true, 'parent' => 0, 'orderby' => 'count', 'order' => 'DESC' ) ), 'velis_is_cluster' );
$out      = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Blog Velis',
	'title'   => 'Blog bất động sản: phân tích dự án và thị trường',
	'lead'    => 'Phân tích của CEO Vũ Xuân về giá, pháp lý, tiến độ và dòng tiền từng dự án.',
) );
if ( $first ) {
	$out .= velis_section( velis_first_eager( velis_grid( array( velis_card_post( $first, false, 'feature' ) ) ) ), '', 'section--flush' );
}
$kinds = array();
foreach ( $latest as $p ) {
	if ( $k = velis_post_kind( $p ) ) {
		$kinds[ $k ] = VELIS_KINDS[ $k ]; // only kinds set by hand
	}
}
$out   .= velis_section( velis_sechead( 'Bài mới', 'Mới đăng' ) . '<div data-chipgrid>' . velis_chipbar( 'kind', $kinds, 'Lọc theo loại bài' ) . velis_grid( array_map( fn( $p ) => velis_card_post( $p, true ), $latest ), 'three' ) . '</div>', '', 'section--tint' );
$links  = '<nav class="actions" aria-label="Cụm bài viết">' . implode( '', array_map( fn( $c ) => velis_btn( $c->name . ' · ' . (int) $c->count . ' bài', get_category_link( $c ), 'line' ), $clusters ) ) . '</nav>';
$out   .= velis_section( velis_sechead( 'Theo dự án và chủ đề', 'Cụm bài viết' ) . $links . '<div class="block prose">' . velis_search_form( 'blog-s', '', 'Tìm bài viết' ) . '</div>' );
$out   .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
