<?php
/**
 * Title: Bài viết
 * Slug: velis/tpl-post
 * Inserter: no
 *
 * BRIEF.md "Template bài viết" with 5 variants by post kind (velis_post_kind): phân tích, nhận định (point-in-time
 * note in the meta line), so sánh (comparison table of the related projects), hướng dẫn (numbered H2), tin (date first).
 * Right column (desktop): table of contents when the text is long, then "Dự án trong bài" + "Nhận tư vấn", sticky.
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
$thumb = (int) get_post_thumbnail_id( $p );
list( $toc, $content ) = velis_toc( velis_strip_dup_image( velis_content( $p->post_content ), $thumb ), velis_reading_minutes( $p ) * 200 );

// Dates: "Cập nhật" only with a real content edit (live site date, kept in velis_modified).
$posted  = get_the_date( 'Y-m-d', $p );
$edited  = (string) get_post_meta( $p->ID, 'velis_modified', true );
$updated = $edited && $edited > $posted ? $edited : '';
$meta    = array(
	( 'tin' === $kind ? '<b>' : '' ) . 'Đăng <time datetime="' . esc_attr( get_the_date( 'c', $p ) ) . '">' . esc_html( get_the_date( 'd/m/Y', $p ) ) . '</time>' . ( 'tin' === $kind ? '</b>' : '' ),
	$updated ? 'Cập nhật <time datetime="' . esc_attr( $updated ) . '">' . esc_html( wp_date( 'd/m/Y', strtotime( $updated ) ) ) . '</time>' : '',
	'nhan-dinh' === $kind ? 'Nhận định tại thời điểm ' . esc_html( get_the_date( 'm/Y', $p ) ) : '',
	velis_reading_minutes( $p ) . ' phút đọc',
	'<a href="' . esc_url( get_author_posts_url( $p->post_author ) ) . '">' . esc_html( get_the_author_meta( 'display_name', $p->post_author ) ) . '</a>, CEO Velis Realty',
);
$out  = velis_breadcrumb_html( velis_trail() );
$head = '<header class="v-posthead"><p class="v-eyebrow">' . esc_html( VELIS_KINDS[ $kind ] ) . ( $cat ? ' · <a href="' . esc_url( get_category_link( $cat ) ) . '">' . esc_html( $cat->name ) . '</a>' : '' ) . '</p>'
	. '<h1>' . esc_html( get_the_title( $p ) ) . '</h1><p class="v-meta">' . implode( ' · ', array_filter( $meta ) ) . '</p></header>';
$img  = $thumb ? '<figure class="v-postimg">' . wp_get_attachment_image( $thumb, 'large', false, array( 'loading' => 'eager', 'fetchpriority' => 'high', 'sizes' => '(min-width: 800px) 720px, 100vw', 'style' => '--focus: 100% 0%; --zoom: 1.12', 'data-alt' => (string) wp_get_attachment_image_url( $thumb, 'medium_large' ) ) ) . ( wp_get_attachment_caption( $thumb ) ? '<figcaption>' . esc_html( wp_get_attachment_caption( $thumb ) ) . '</figcaption>' : '' ) . '</figure>' : '';
$sum  = $p->post_excerpt ? '<aside class="v-summary" aria-label="Tóm tắt"><p class="v-eyebrow">Tóm tắt</p><p>' . esc_html( $p->post_excerpt ) . '</p></aside>' : '';
$top  = '';
if ( 'so-sanh' === $kind && count( $projs ) >= 2 ) {
	$top = velis_compare_html( $projs, array(
		'Chủ đầu tư' => fn( $x ) => implode( ', ', wp_list_pluck( velis_developers( $x ), 'post_title' ) ),
		'Khu vực' => fn( $x ) => velis_region_label( $x ),
		'Loại sản phẩm' => fn( $x ) => implode( ', ', velis_type_names( $x ) ),
		'Giá từ' => fn( $x ) => velis_price( $x ),
		'Bàn giao' => fn( $x ) => get_post_meta( $x->ID, 'velis_handover', true ),
	), 'So sánh nhanh' );
}
// Compact project card in the middle of the text (after the 3rd paragraph); hidden on wide screens where the side column shows it.
if ( $projs ) {
	$mid     = '<div class="v-embed">' . velis_card_project( $projs[0], 'Dự án trong bài', 'embed' ) . '</div>';
	$parts   = preg_split( '#(</p>)#', $content, 4, PREG_SPLIT_DELIM_CAPTURE );
	$content = count( $parts ) > 6 ? implode( '', array_slice( $parts, 0, 6 ) ) . $mid . implode( '', array_slice( $parts, 6 ) ) : $content . $mid;
}
$aside = '<aside class="v-article__side">' . $toc . ( $pill ? '<div class="v-side__box">' . velis_card_project( $pill, 'Dự án trong bài', 'embed' ) . '</div>' : '' )
	. '<div class="v-side__box"><p class="v-eyebrow">Cần tư vấn?</p><a class="v-btn" href="#tu-van">Nhận tư vấn</a> <a class="v-btn v-btn--secondary" href="tel:' . VELIS_PHONE_TEL . '">' . VELIS_PHONE . '</a></div></aside>';
$disc  = in_array( $kind, array( 'phan-tich', 'nhan-dinh', 'so-sanh' ), true ) ? velis_disclosure( 'post' ) : '';
$out  .= '<div class="v-wrap"><article class="v-article v-article--' . esc_attr( $kind ) . '"><div class="v-article__body">' . $head . $img . $sum . $top . '<div class="v-prose">' . $content . '</div>' . $disc . velis_author_box( (int) $p->post_author ) . '</div>' . $aside . '</article></div>';

// Same cluster: 3–6 other posts + the pillar project.
$same = $cat ? get_posts( array( 'numberposts' => 6, 'category' => $cat->term_id, 'exclude' => array( $p->ID ) ) ) : array();
if ( $same ) {
	$btn  = $pill ? velis_btn( 'Thông tin dự án ' . $pill->post_title, get_permalink( $pill ), 'secondary' ) : '';
	$out .= velis_section( velis_sechead( 'Cùng chủ đề ' . $cat->name, 'Đọc tiếp', '', '', $btn ) . velis_grid( array_map( 'velis_card_post', array_slice( $same, 0, count( $same ) >= 6 ? 6 : 3 ) ), '3' ) );
}
$out .= velis_form_html( $pill ? $pill->post_title : '', array(), $pill ? 'Nhận bảng giá ' . $pill->post_title : 'Nhận tư vấn' );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
