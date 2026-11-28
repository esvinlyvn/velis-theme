<?php
/**
 * Title: 404
 * Slug: velis/tpl-404
 * Inserter: no
 */
$photo    = fn( $list ) => array_values( array_filter( $list, fn( $p ) => velis_image_id( $p ) ) );
$featured = array_slice( $photo( velis_featured_projects() ) ?: $photo( velis_top_projects() ), 0, 3 ); // "Dự án nổi bật" = the ticked projects (vòng hoàn thiện 2), with a photo
$out      = velis_hero_b( array(
	'eyebrow' => 'Lỗi 404',
	'title'   => 'Trang này không còn ở đây',
	'lead'    => 'Đường dẫn có thể đã đổi khi Velis sắp xếp lại nội dung. Anh chị thử tìm kiếm hoặc đi tới một mục chính.',
	'buttons' => velis_btn( 'Dự án', '/du-an/', 'line' ) . velis_btn( 'Chủ đầu tư', '/chu-dau-tu/', 'line' ) . velis_btn( 'Blog', '/blog/', 'line' ) . velis_btn( 'Liên hệ', '/lien-he/', 'line' ),
	'after'   => velis_search_form( 'nf-s' ),
) );
if ( $featured ) {
	$out .= velis_section( velis_sechead( 'Dự án nổi bật', 'Có thể anh chị quan tâm' ) . velis_grid( array_map( 'velis_card_project', $featured ) ), '', 'section--tint' );
}
$out = '<div class="onecol">' . $out . '</div>'; // 3.2: one 760 px frame
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
