<?php
/**
 * Title: Cụm blog
 * Slug: velis/tpl-cluster
 * Inserter: no
 *
 * /blog/{cum}/: intro (category description) · pillar link · featured post · grid filterable by post kind (and by
 * phân khu on a đại đô thị cluster) · pagination (page 2+ noindex via inc/seo.php).
 */
if ( ! is_category() ) {
	return;
}
$cat   = get_queried_object();
$paged = max( 1, (int) get_query_var( 'paged' ) );
$q     = new WP_Query( array( 'cat' => $cat->term_id, 'paged' => $paged, 'posts_per_page' => 12, 'ignore_sticky_posts' => true ) );
$pill  = velis_cluster_project( $cat );
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Blog · ' . $cat->count . ' bài',
	'title'   => 'Blog ' . $cat->name . ( $paged > 1 ? " – trang $paged" : '' ),
	'lead'    => $cat->description ? wp_strip_all_tags( $cat->description ) : 'Phân tích ' . $cat->name . ' của CEO Vũ Xuân: giá, pháp lý, tiến độ và kinh nghiệm mua.',
	'buttons' => $pill ? velis_btn( 'Thông tin dự án ' . $pill->post_title, get_permalink( $pill ), 'secondary' ) : '',
) );
$kinds = array();
$pks   = array();
foreach ( $q->posts as $p ) {
	$kinds[ velis_post_kind( $p ) ] = VELIS_KINDS[ velis_post_kind( $p ) ];
	foreach ( velis_post_projects( $p ) as $r ) {
		if ( 'phan-khu' === velis_level( $r ) ) {
			$pks[ $r->post_name ] = $r->post_title;
		}
	}
}
$out .= velis_section( velis_sechead( 'Bài viết ' . $cat->name, $paged > 1 ? "Trang $paged" : 'Mới nhất' ) . '<div data-chipbox>' . velis_chipbar( 'kind', $kinds, 'Lọc theo loại bài' ) . velis_chipbar( 'pk', $pks, 'Lọc theo phân khu' )
	. velis_grid( array_map( fn( $p ) => velis_card_post( $p, true ), $q->posts ), '3' ) . '<div class="v-empty" hidden data-chip-empty><p><b>Chưa có bài phù hợp.</b></p></div></div>' . velis_pagination( $q ) );
$out .= velis_form_html( $pill ? $pill->post_title : '' );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
