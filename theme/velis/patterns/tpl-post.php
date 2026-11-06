<?php
/**
 * Title: Bài viết
 * Slug: velis/tpl-post
 * Inserter: no
 *
 * BRIEF.md "Template bài viết" with 5 variants by post kind (velis_post_kind): phân tích, nhận định (point-in-time
 * note in the meta line), so sánh (comparison table of the related projects), hướng dẫn (numbered H2), tin (date first).
 * Right column (≥ 1024): table of contents when the text is long, then "Velis tư vấn" for the post's project, sticky.
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
$head = '<header class="block"><p class="eyebrow">' . implode( ' · ', array_filter( array( $kind ? esc_html( VELIS_KINDS[ $kind ] ) : '', $cat ? '<a href="' . esc_url( get_category_link( $cat ) ) . '">' . esc_html( $cat->name ) . '</a>' : '' ) ) ) . '</p>'
	. '<h1>' . esc_html( get_the_title( $p ) ) . '</h1><p class="muted">' . implode( ' · ', array_filter( $meta ) ) . '</p>'
	. ( $thumb ? '<figure class="pic">' . velis_img( $thumb, (string) get_post_meta( $thumb, '_wp_attachment_image_alt', true ) ?: get_the_title( $p ), 'large', array( 'lcp' => true, 'loading' => 'eager', 'fetchpriority' => 'high', 'ratio' => 1e9, 'sizes' => VELIS_SIZES_MAIN ) )
		. ( wp_get_attachment_caption( $thumb ) && ! velis_auto_caption( wp_get_attachment_caption( $thumb ) ) ? '<figcaption>' . esc_html( wp_get_attachment_caption( $thumb ) ) . '</figcaption>' : '' ) . '</figure>' : '' )
	. ( $p->post_excerpt ? '<p class="eyebrow">Tóm tắt</p><p class="hero__lead">' . esc_html( $p->post_excerpt ) . '</p>' : '' ) . '</header>';
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
// Project card in the middle of the text (after the 3rd paragraph) for phones; wide screens show the side column instead.
if ( $projs ) {
	$mid     = '<div class="advisor-inline">' . velis_card_project( $projs[0], 'Dự án trong bài', 'embed' ) . '</div>';
	// the card spans the text column (≤ 720 px), not a third of the frame: its photo sizes follow (NT-21)
	$mid     = preg_replace_callback( '#(<img\b[^>]*?\s)sizes="([^"]*)"#', fn( $m ) => $m[1] . 'sizes="' . esc_attr( velis_sizes( '(min-width: 768px) 640px, calc(100vw - 32px)', preg_match( '/calc\(([\d.]+) \* \(/', $m[2], $z ) ? (float) $z[1] : 1 ) ) . '"', $mid, 1 );
	$parts   = preg_split( '#(</p>)#', $content, 4, PREG_SPLIT_DELIM_CAPTURE );
	$content = count( $parts ) > 6 ? implode( '', array_slice( $parts, 0, 6 ) ) . $mid . implode( '', array_slice( $parts, 6 ) ) : $content . $mid;
}
// Side column (≥ 1024): table of contents, then "Velis tư vấn" for the project of the post, else the contact card.
$side = $pill ? '<aside class="page__side" aria-label="Velis tư vấn dự án trong bài">' . $toc . velis_advisor( $pill ) . '</aside>'
	: str_replace( '<div class="advisor">', $toc . '<div class="advisor">', velis_contact_card() );
$disc = in_array( $kind, array( 'phan-tich', 'nhan-dinh', 'so-sanh' ), true ) ? '<div class="block">' . velis_disclosure( 'post' ) . '</div>' : '';
$out .= '<div class="wrap page"><article class="page__main">' . $head . ( $top ? '<div class="block">' . $top . '</div>' : '' ) . '<div class="block prose">' . $content . '</div>' . $disc
	. '<div class="block">' . velis_author_box( (int) $p->post_author ) . '</div></article>' . $side . '</div>';

// Same cluster: 3 or 6 other posts (grid never leaves an empty cell) + the pillar project.
$same = $cat ? get_posts( array( 'numberposts' => 6, 'category' => $cat->term_id, 'exclude' => array( $p->ID ) ) ) : array();
if ( $same ) {
	$btn  = $pill ? '<a class="btn btn--text" href="' . esc_url( get_permalink( $pill ) ) . '">Thông tin dự án ' . esc_html( $pill->post_title ) . ' →</a>' : '';
	$out .= velis_section( velis_sechead( 'Cùng chủ đề ' . $cat->name, 'Đọc tiếp', '', '', $btn ) . velis_grid( array_map( 'velis_card_post', array_slice( $same, 0, count( $same ) >= 6 ? 6 : 3 ) ), 'three' ), '', 'section--tint' );
}
$out .= velis_form_html( $pill ? $pill->post_title : '', array(), $pill ? 'Nhận bảng giá ' . $pill->post_title : 'Nhận tư vấn' );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
