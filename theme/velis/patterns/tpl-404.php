<?php
/**
 * Title: 404
 * Slug: velis/tpl-404
 * Inserter: no
 */
$featured = array_slice( array_values( array_filter( velis_top_projects(), fn( $p ) => velis_image_id( $p ) ) ), 0, 3 );
$out      = '<div class="v-wrap v-pagehead v-404"><p class="v-eyebrow">Lỗi 404</p><h1>Trang này không còn ở đây</h1><p>Đường dẫn có thể đã đổi khi Velis sắp xếp lại nội dung. Anh chị thử tìm kiếm hoặc đi tới một mục chính.</p>'
	. '<form role="search" method="get" class="v-search" action="' . esc_url( home_url( '/' ) ) . '"><label for="nf-s" class="v-sr">Tìm dự án hoặc bài viết</label><input id="nf-s" type="search" name="s" placeholder="Ví dụ: The Global City"><button class="v-btn" type="submit">Tìm</button></form>'
	. '<ul class="v-links"><li><a href="/du-an/">Dự án</a></li><li><a href="/chu-dau-tu/">Chủ đầu tư</a></li><li><a href="/blog/">Blog</a></li><li><a href="/lien-he/">Liên hệ</a></li></ul></div>';
if ( $featured ) {
	$out .= velis_section( velis_sechead( 'Dự án nổi bật', 'Có thể anh chị quan tâm' ) . velis_grid( array_map( 'velis_card_project', $featured ), 'zones' ) );
}
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
