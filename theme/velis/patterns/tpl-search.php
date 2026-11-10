<?php
/**
 * Title: Tìm kiếm
 * Slug: velis/tpl-search
 * Inserter: no
 *
 * Groups: Dự án · Phân khu và dòng sản phẩm · Bài viết (12 per page, paginated). Projects: a record whose name appears in the
 * query wins ("căn hộ palm river" → Palm River), then WordPress' own search (accent-insensitive collation: "prive" → The Privé).
 * noindex via inc/seo.php.
 */
$s     = get_search_query();
$paged = max( 1, (int) get_query_var( 'paged' ) );
$found = $s && 1 === $paged ? velis_search_projects( $s ) : array(); // records whose name is in the query first; DB search is accent-insensitive
$projs = array_values( array_filter( $found, fn( $p ) => ! in_array( velis_level( $p ), array( 'phan-khu', 'thap-tang' ), true ) ) );
$parts = array_values( array_filter( $found, fn( $p ) => in_array( velis_level( $p ), array( 'phan-khu', 'thap-tang' ), true ) ) );
$q     = new WP_Query( array( 's' => $s, 'post_type' => 'post', 'paged' => $paged, 'posts_per_page' => 12 ) ); // 2.3: posts paginated
$posts = $s ? $q->posts : array();
if ( $s && ! $posts && $found && 1 === $paged ) { // "căn hộ palm river": no post has every word – show posts about the matched project
	$posts = velis_project_posts( $found[0], 6 );
}
$out  = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Tìm kiếm',
	'title'   => $s ? 'Kết quả cho “' . $s . '”' . ( $paged > 1 ? " – trang $paged" : '' ) : 'Tìm kiếm',
	'after'   => velis_search_form( 's-q', $s ),
) );
$band = array( 'section--tint', '' );
$i    = 0;
foreach ( array( array( 'Dự án', $projs ), array( 'Phân khu và dòng sản phẩm', $parts ) ) as list( $head, $list ) ) { // 2.3: grouped by type
	if ( $list ) {
		$out .= velis_section( velis_sechead( $head, count( $list ) . ' kết quả' ) . velis_grid( array_map( 'velis_card_project', $list ), 'three', ' data-live' ), '', $band[ $i++ % 2 ] );
	}
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Bài viết', ( $q->found_posts ?: count( $posts ) ) . ' kết quả' . ( $paged > 1 ? " · trang $paged" : '' ) ) . velis_grid( array_map( 'velis_card_post', $posts ), 'three', ' data-live' ) . velis_pagination( $q ), '', $band[ $i++ % 2 ] );
}
if ( ! $found && ! $posts ) {
	$out .= velis_section( velis_sechead( 'Dự án Velis đang tư vấn', 'Chưa tìm thấy nội dung phù hợp', 'Anh chị thử tên dự án hoặc xem các dự án dưới đây.' ) . velis_grid( array_map( 'velis_card_project', array_slice( velis_top_projects(), 0, 3 ) ), 'three', ' data-live' ), '', 'section--tint' );
}
$out = velis_first_eager( $out );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
