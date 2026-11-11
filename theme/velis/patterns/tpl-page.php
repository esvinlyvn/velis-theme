<?php
/**
 * Title: Trang chính
 * Slug: velis/tpl-page
 * Inserter: no
 *
 * Tuyển dụng, Chính sách bảo mật and any page: hero B (text) + editor content + one main action, mockup components only.
 * Liên hệ: the 3 channels first (Gọi, Zalo, Form), address & hours (facts bar), map, form.
 * Long pages (policy): table of contents in the side column (FAQ row style).
 */
if ( ! is_page() ) {
	return;
}
$pg = get_queried_object();
setup_postdata( $GLOBALS['post'] = $pg ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
$slug    = $pg->post_name;
$title   = velis_display_title( wp_strip_all_tags( get_the_title( $pg ) ) );
$content = trim( $pg->post_content ) ? velis_content( $pg->post_content ) : ''; // phpcs:ignore
$trail   = velis_trail();
if ( 'tuyen-dung' === $slug ) {
	$trail[ count( $trail ) - 1 ][0] = 'Tuyển dụng'; // 2.13: the trail ends on the section name, not the job title
}
$out     = velis_breadcrumb_html( $trail );
if ( 'lien-he' === $slug ) {
	$map  = get_posts( array( 'post_type' => 'attachment', 'name' => 'ban-do-van-phong-velis', 'numberposts' => 1, 'fields' => 'ids' ) );
	$out .= velis_hero_b( array(
		'eyebrow' => 'Velis Realty',
		'title'   => $title,
		'lead'    => 'Gọi, nhắn Zalo hoặc để lại số điện thoại, Velis phản hồi trong giờ làm việc.',
		'buttons' => velis_call_btn( '' ) . velis_zalo_btn() . velis_btn( 'Gửi yêu cầu', '#tu-van', 'line' ),
	) );
	$out .= velis_facts_html( array_filter( array( 'Văn phòng' => velis_s( 'address' ), 'Giờ làm việc' => velis_s( 'hours' ), 'Email' => velis_s( 'email' ) ) ), null );
	$out .= velis_section( velis_sechead( 'Đường tới văn phòng Velis', 'Bản đồ' )
		. '<div class="map">' . ( $map ? wp_get_attachment_image( $map[0], 'full', false, array( 'loading' => 'lazy', 'sizes' => '(min-width: 1600px) 1320px, (min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)', 'alt' => 'Bản đồ văn phòng Velis Realty' ) ) : '' )
		. velis_btn( 'Chỉ đường trên Google Maps', 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( 'Velis Realty ' . velis_s( 'address' ) ), 'line', ' target="_blank" rel="noopener"' ) . '</div>'
		. '<p class="source">Bản đồ © OpenStreetMap contributors.</p>' . velis_project_links(), '', 'section--tint' );
	$out .= velis_form_html( '', array(), 'Gửi yêu cầu tư vấn', false );
} else {
	$cv   = 'tuyen-dung' === $slug;
	$out .= velis_hero_b( array(
		'eyebrow' => $cv ? 'Tuyển dụng' : 'Velis Realty',
		'title'   => $title,
		'lead'    => $pg->post_excerpt,
		'buttons' => $cv ? ( velis_s( 'email' ) ? velis_btn( 'Gửi CV', 'mailto:' . velis_s( 'email' ) . '?subject=' . rawurlencode( 'Ứng tuyển – ' . $title ) ) : '' ) . velis_call_btn( 'line' ) : '',
	) );
	if ( $cv ) {
		$side = velis_contact_card( 'cv', velis_s( 'email' ) ? 'mailto:' . velis_s( 'email' ) . '?subject=' . rawurlencode( 'Ứng tuyển – ' . $title ) : '' );
	} else {
		list( $toc, $content ) = velis_toc( $content, 1300 ); // policy pages: one centred reading column, the table of contents on top (2026-11-06)
		$content = $toc . $content;
		$side    = '';
	}
	$out .= $content ? velis_text_page( $content, $side ) : '';
	$out  = $cv ? $out : '<div class="onecol">' . $out . '</div>'; // 3.2: policy pages – one 760 px frame, crumbs / title / text on one edge
	$out .= velis_form_html( '', array(), $cv ? 'Đăng ký ứng tuyển' : 'Nhận tư vấn' );
}
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
