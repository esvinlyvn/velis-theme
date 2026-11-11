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
	'lead'    => $cat->description ? wp_strip_all_tags( $cat->description ) : str_replace( '{tên}', $cat->name, (string) velis_s( 'cluster_lead' ) ),
	'buttons' => $pill ? velis_btn( 'Thông tin dự án ' . $pill->post_title, get_permalink( $pill ), 'line' ) : '',
) ) . velis_cluster_nav( (int) $cat->term_id );
$kinds = array();
$pks   = array();
foreach ( $q->posts as $p ) {
	if ( $k = velis_post_kind( $p ) ) {
		$kinds[ $k ] = VELIS_KINDS[ $k ]; // only kinds set by hand
	}
	foreach ( velis_post_projects( $p ) as $r ) {
		if ( 'phan-khu' === velis_level( $r ) ) {
			$pks[ $r->post_name ] = $r->post_title;
		}
	}
}
$out .= '<section class="section section--tint">' . velis_post_list( $q->posts, velis_chipbars( array( 'kind' => array( 'Lọc theo loại bài', $kinds ), 'pk' => array( 'Lọc theo phân khu', $pks ) ) ), velis_pagination( $q ), velis_list_side( (int) $cat->term_id ) ) . '</section>'; // item 4: one post per row
$out .= velis_form_html( $pill ? $pill->post_title : '' );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
