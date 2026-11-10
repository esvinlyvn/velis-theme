<?php
/**
 * Title: Trang blog
 * Slug: velis/tpl-blog
 * Inserter: no
 *
 * /blog/: cluster links under the header, the newest post first and large, then the next posts (filter by post kind),
 * 12 per page with pagination (/blog/page/N/, noindex from page 2 – inc/seo.php), search box.
 */
$paged = max( 1, (int) get_query_var( 'paged' ) );
$q     = new WP_Query( array( 'post_type' => 'post', 'paged' => $paged, 'posts_per_page' => 12, 'ignore_sticky_posts' => true ) ); // 2.2: 12 per page, every post reachable
$posts = $q->posts;
$first = 1 === $paged ? array_shift( $posts ) : null; // the newest post opens page 1, large
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Blog Velis',
	'title'   => 'Blog bất động sản: phân tích dự án và thị trường' . ( $paged > 1 ? " – trang $paged" : '' ),
	'lead'    => 'Phân tích của CEO Vũ Xuân về giá, pháp lý, tiến độ và dòng tiền từng dự án.',
) ) . velis_cluster_nav();
if ( $first ) {
	$out .= velis_section( velis_first_eager( velis_grid( array( velis_card_post( $first, false, 'feature' ) ) ) ), '', 'section--flush' );
}
$kinds = array();
foreach ( $posts as $p ) {
	if ( $k = velis_post_kind( $p ) ) {
		$kinds[ $k ] = VELIS_KINDS[ $k ]; // only kinds set by hand
	}
}
$out .= velis_section( velis_sechead( 'Bài mới', $paged > 1 ? "Trang $paged" : 'Mới đăng' ) . '<div data-chipgrid>' . velis_chipbar( 'kind', $kinds, 'Lọc theo loại bài' ) . velis_grid( array_map( fn( $p ) => velis_card_post( $p, true ), $posts ), 'three', ' data-live' ) . '</div>' . velis_pagination( $q ), '', 'section--tint' );
$out .= velis_section( velis_sechead( 'Tìm bài viết', 'Tìm kiếm' ) . '<div class="block prose">' . velis_search_form( 'blog-s', '', 'Tìm bài viết' ) . '</div>' );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
