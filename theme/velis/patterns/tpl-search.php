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
$form = '<form role="search" method="get" class="v-search" action="' . esc_url( home_url( '/' ) ) . '"><label for="s-q" class="v-sr">Tìm dự án hoặc bài viết</label><input id="s-q" type="search" name="s" value="' . esc_attr( $s ) . '" placeholder="Ví dụ: The Global City"><button class="v-btn" type="submit">Tìm</button></form>';
$out  = velis_breadcrumb_html( velis_trail() ) . '<div class="v-wrap v-pagehead"><h1>' . ( $s ? 'Kết quả cho “' . esc_html( $s ) . '”' : 'Tìm kiếm' ) . '</h1>' . $form . '</div>';
if ( $projs ) {
	$out .= velis_section( velis_sechead( 'Dự án', count( $projs ) . ' kết quả' ) . velis_grid( array_map( 'velis_card_project', $projs ), 'zones' ) );
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Bài viết', count( $posts ) . ' kết quả' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3' ) );
}
if ( ! $projs && ! $posts ) {
	$out .= velis_section( '<p>Chưa tìm thấy nội dung phù hợp. Anh chị thử tên dự án hoặc xem các dự án Velis đang tư vấn.</p>' . velis_grid( array_map( 'velis_card_project', array_slice( velis_top_projects(), 0, 3 ) ), 'zones' ) );
}
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
