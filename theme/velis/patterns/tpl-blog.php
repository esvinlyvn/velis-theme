<?php
/**
 * Title: Trang blog
 * Slug: velis/tpl-blog
 * Inserter: no
 *
 * /blog/: latest posts, entry by cluster (project / topic) and by post kind, search box.
 */
$latest   = get_posts( array( 'numberposts' => 9 ) );
$clusters = get_categories( array( 'hide_empty' => true, 'parent' => 0, 'orderby' => 'count', 'order' => 'DESC' ) );
$out      = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Blog Velis',
	'title'   => 'Blog bất động sản: phân tích dự án và thị trường',
	'lead'    => 'Phân tích theo dòng tiền và giá vốn thực của CEO Vũ Xuân, chia theo dự án và chủ đề.',
) );
$search   = '<form role="search" method="get" class="v-search" action="' . esc_url( home_url( '/' ) ) . '"><label for="blog-s" class="v-sr">Tìm bài viết</label><input id="blog-s" type="search" name="s" placeholder="Ví dụ: pháp lý The Privé"><button class="v-btn" type="submit">Tìm</button></form>';
$links    = '<ul class="v-clusters">' . implode( '', array_map( fn( $c ) => '<li><a href="' . esc_url( get_category_link( $c ) ) . '">' . esc_html( $c->name ) . '</a> <span>' . (int) $c->count . ' bài</span></li>', $clusters ) ) . '</ul>';
$kinds    = array();
foreach ( $latest as $p ) {
	$kinds[ velis_post_kind( $p ) ] = VELIS_KINDS[ velis_post_kind( $p ) ];
}
$out .= velis_section( velis_sechead( 'Theo dự án và chủ đề', 'Cụm bài viết' ) . $links . $search );
$out .= velis_section( velis_sechead( 'Bài mới nhất', 'Mới đăng' ) . '<div data-chipbox>' . velis_chipbar( 'kind', $kinds, 'Lọc theo loại bài' ) . velis_grid( array_map( fn( $p ) => velis_card_post( $p, true ), $latest ), '3' ) . '<div class="v-empty" hidden data-chip-empty><p><b>Chưa có bài phù hợp.</b></p></div></div>' );
$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
