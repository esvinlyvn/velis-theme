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
$posts = $q->posts; // item 4 (2026-11-11): every post one row, the newest too (no large card)
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Blog Velis',
	'title'   => 'Blog bất động sản: phân tích dự án và thị trường' . ( $paged > 1 ? " – trang $paged" : '' ),
	'lead'    => trim( wp_strip_all_tags( (string) get_post_field( 'post_content', get_page_by_path( 'blog' ) ) ) ) ?: 'Phân tích của CEO Vũ Xuân về giá, pháp lý, tiến độ và dòng tiền từng dự án.', // 5.2: the Blog page's own text
) ) . velis_cluster_nav();
$kinds = array();
foreach ( $posts as $p ) {
	if ( $k = velis_post_kind( $p ) ) {
		$kinds[ $k ] = VELIS_KINDS[ $k ]; // only kinds set by hand
	}
}
$out .= '<section class="section section--tint">' . velis_post_list( $posts, velis_chipbar( 'kind', $kinds, 'Lọc theo loại bài' ), velis_pagination( $q ), velis_list_side() ) . '</section>';
$out .= velis_section( velis_sechead( 'Tìm bài viết', 'Tìm kiếm' ) . '<div class="block prose">' . velis_search_form( 'blog-s', '', 'Tìm bài viết' ) . '</div>' );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
