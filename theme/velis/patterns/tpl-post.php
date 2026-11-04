<?php
/**
 * Title: Bài viết
 * Slug: velis/tpl-post
 * Inserter: no
 *
 * BRIEF.md "Template bài viết" with 5 variants by post kind (velis_post_kind): phân tích (project card first),
 * nhận định (point-in-time note), so sánh (comparison table of the related projects), hướng dẫn (numbered H2 steps),
 * tin tiến độ (date first). Author box, same-cluster posts, link to the pillar project and a contextual CTA.
 */
if ( ! is_singular( 'post' ) ) {
	return;
}
$p = get_queried_object();
setup_postdata( $GLOBALS['post'] = $p ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
$kind  = velis_post_kind( $p );
$projs = velis_post_projects( $p );
$cat   = velis_primary_category( $p );
$pill  = $projs ? $projs[0] : ( $cat ? velis_cluster_project( $cat ) : null );
list( $toc, $content ) = velis_toc( velis_content( $p->post_content ), velis_reading_minutes( $p ) * 200 ); // phpcs:ignore
$mod   = get_the_modified_date( 'Y-m-d', $p ) !== get_the_date( 'Y-m-d', $p );
$out   = velis_breadcrumb_html( velis_trail() );
$head  = '<header class="v-posthead"><p class="v-eyebrow">' . esc_html( VELIS_KINDS[ $kind ] ) . ( $cat ? ' · <a href="' . esc_url( get_category_link( $cat ) ) . '">' . esc_html( $cat->name ) . '</a>' : '' ) . '</p>'
	. '<h1>' . esc_html( get_the_title( $p ) ) . '</h1>'
	. '<p class="v-meta">' . ( 'tin' === $kind ? '<b>' : '' ) . 'Đăng <time datetime="' . esc_attr( get_the_date( 'c', $p ) ) . '">' . esc_html( get_the_date( 'd/m/Y', $p ) ) . '</time>' . ( 'tin' === $kind ? '</b>' : '' )
	. ( $mod ? ' · Cập nhật <time datetime="' . esc_attr( get_the_modified_date( 'c', $p ) ) . '">' . esc_html( get_the_modified_date( 'd/m/Y', $p ) ) . '</time>' : '' )
	. ' · ' . velis_reading_minutes( $p ) . ' phút đọc · <a href="' . esc_url( get_author_posts_url( $p->post_author ) ) . '">' . esc_html( get_the_author_meta( 'display_name', $p->post_author ) ) . '</a>, CEO Velis Realty</p></header>';
$img   = get_post_thumbnail_id( $p ) ? '<figure class="v-postimg">' . wp_get_attachment_image( get_post_thumbnail_id( $p ), 'large', false, array( 'loading' => 'eager', 'fetchpriority' => 'high', 'sizes' => '(min-width: 800px) 720px, 100vw' ) ) . ( wp_get_attachment_caption( get_post_thumbnail_id( $p ) ) ? '<figcaption>' . esc_html( wp_get_attachment_caption( get_post_thumbnail_id( $p ) ) ) . '</figcaption>' : '' ) . '</figure>' : '';
$lead  = $p->post_excerpt ? '<p class="v-lead v-answer">' . esc_html( $p->post_excerpt ) . '</p>' : '';
$top   = '';
if ( 'phan-tich' === $kind && $projs ) {
	$top = '<div class="v-embed">' . velis_heading_to_p( velis_card_project( $projs[0], 'Dự án trong bài' ) ) . '</div>';
} elseif ( 'nhan-dinh' === $kind ) {
	$top = '<aside class="v-note" role="note"><p><b>Quan điểm của tôi</b> – nhận định của Vũ Xuân tại thời điểm ' . esc_html( get_the_date( 'm/Y', $p ) ) . '; thị trường có thể đã thay đổi.</p></aside>';
} elseif ( 'so-sanh' === $kind && count( $projs ) >= 2 ) {
	$top = velis_compare_html( $projs, array(
		'Chủ đầu tư' => fn( $x ) => implode( ', ', wp_list_pluck( velis_developers( $x ), 'post_title' ) ),
		'Khu vực' => fn( $x ) => velis_region_label( $x ),
		'Loại sản phẩm' => fn( $x ) => implode( ', ', velis_type_names( $x ) ),
		'Giá từ' => fn( $x ) => velis_price( $x ),
		'Bàn giao' => fn( $x ) => get_post_meta( $x->ID, 'velis_handover', true ),
	), 'So sánh nhanh' );
}
$mid = ( $projs && 'phan-tich' !== $kind ) ? '<div class="v-embed">' . velis_heading_to_p( velis_card_project( $projs[0], 'Dự án liên quan' ) ) . '</div>' : '';
// Related card in the middle of the text: after the 3rd paragraph.
if ( $mid ) {
	$parts   = preg_split( '#(</p>)#', $content, 4, PREG_SPLIT_DELIM_CAPTURE );
	$content = count( $parts ) > 6 ? implode( '', array_slice( $parts, 0, 6 ) ) . $mid . implode( '', array_slice( $parts, 6 ) ) : $content . $mid;
}
$disc  = in_array( $kind, array( 'phan-tich', 'nhan-dinh', 'so-sanh' ), true ) ? velis_disclosure( 'post' ) : '';
$body  = '<article class="v-article v-article--' . esc_attr( $kind ) . '">' . $toc . '<div class="v-article__body">' . $img . $lead . $top . '<div class="v-prose">' . $content . '</div>' . $disc . velis_author_box( (int) $p->post_author ) . '</div></article>';
$out  .= '<div class="v-wrap">' . $head . $body . '</div>';

$same = $cat ? get_posts( array( 'numberposts' => 3, 'category' => $cat->term_id, 'exclude' => array( $p->ID ) ) ) : array();
if ( $same || $pill ) {
	$out .= velis_section( velis_sechead( $cat ? 'Cùng chủ đề ' . $cat->name : 'Bài liên quan', 'Đọc tiếp' ) . velis_grid( array_map( 'velis_card_post', $same ), '3' )
		. ( $pill ? '<p><a class="v-btn v-btn--secondary" href="' . esc_url( get_permalink( $pill ) ) . '">Thông tin dự án ' . esc_html( $pill->post_title ) . '</a></p>' : '' ) );
}
$out .= velis_form_html( $pill ? $pill->post_title : '', array(), $pill ? 'Nhận bảng giá ' . $pill->post_title : 'Nhận tư vấn' );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
