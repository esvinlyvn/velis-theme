<?php
/**
 * Title: Tìm kiếm
 * Slug: velis/tpl-search
 * Inserter: no
 *
 * Two groups (Dự án, Bài viết). Projects: a record whose name appears in the query wins ("căn hộ palm river" →
 * Palm River), then WordPress' own search. noindex via inc/seo.php.
 */
$s     = get_search_query();
$projs = $s ? velis_search_projects( $s ) : array();
$posts = $s ? get_posts( array( 's' => $s, 'post_type' => 'post', 'numberposts' => 12 ) ) : array();
if ( $s && ! $posts && $projs ) { // "căn hộ palm river": no post has every word – show posts about the matched project
	$posts = velis_project_posts( $projs[0], 6 );
}
$out  = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Tìm kiếm',
	'title'   => $s ? 'Kết quả cho “' . $s . '”' : 'Tìm kiếm',
	'after'   => velis_search_form( 's-q', $s ),
) );
$band = array( 'section--tint', '' );
$i    = 0;
if ( $projs ) {
	$out .= velis_section( velis_sechead( 'Dự án', count( $projs ) . ' kết quả' ) . velis_first_eager( velis_grid( array_map( 'velis_card_project', $projs ), 'three' ) ), '', $band[ $i++ % 2 ] );
}
if ( $posts ) {
	$grid = velis_grid( array_map( 'velis_card_post', $posts ), 'three' );
	$out .= velis_section( velis_sechead( 'Bài viết', count( $posts ) . ' kết quả' ) . ( $projs ? $grid : velis_first_eager( $grid ) ), '', $band[ $i++ % 2 ] );
}
if ( ! $projs && ! $posts ) {
	$out .= velis_section( velis_sechead( 'Dự án Velis đang tư vấn', 'Chưa tìm thấy nội dung phù hợp', 'Anh chị thử tên dự án hoặc xem các dự án dưới đây.' ) . velis_grid( array_map( 'velis_card_project', array_slice( velis_top_projects(), 0, 3 ) ) ), '', 'section--tint' );
}
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
