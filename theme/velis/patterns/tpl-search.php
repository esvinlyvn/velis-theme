<?php
/**
 * Title: Tìm kiếm
 * Slug: velis/tpl-search
 * Inserter: no
 *
 * Results in two groups (Dự án, Bài viết); suggestions when nothing matches. noindex via inc/seo.php.
 */
$s     = get_search_query();
$projs = $s ? get_posts( array( 's' => $s, 'post_type' => 'du-an', 'numberposts' => 12 ) ) : array();
$posts = $s ? get_posts( array( 's' => $s, 'post_type' => 'post', 'numberposts' => 12 ) ) : array();
$form  = '<form role="search" method="get" class="v-search" action="' . esc_url( home_url( '/' ) ) . '"><label for="s-q" class="v-sr">Tìm dự án hoặc bài viết</label><input id="s-q" type="search" name="s" value="' . esc_attr( $s ) . '" placeholder="Ví dụ: The Global City"><button class="v-btn" type="submit">Tìm</button></form>';
$out   = velis_breadcrumb_html( velis_trail() ) . '<div class="v-wrap v-pagehead"><h1>' . ( $s ? 'Kết quả cho “' . esc_html( $s ) . '”' : 'Tìm kiếm' ) . '</h1>' . $form . '</div>';
if ( $projs ) {
	$out .= velis_section( velis_sechead( 'Dự án', count( $projs ) . ' kết quả' ) . velis_grid( array_map( 'velis_card_project', $projs ) ) );
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Bài viết', count( $posts ) . ' kết quả' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3' ) );
}
if ( ! $projs && ! $posts ) {
	$out .= velis_section( '<p>Chưa tìm thấy nội dung phù hợp. Anh chị thử tên dự án hoặc xem các dự án Velis đang tư vấn.</p>' . velis_grid( array_map( 'velis_card_project', array_slice( velis_top_projects(), 0, 4 ) ) ) );
}
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
