<?php
/**
 * Title: Trang chính
 * Slug: velis/tpl-page
 * Inserter: no
 *
 * Giới thiệu, Tuyển dụng, Chính sách bảo mật and any page: H1 + editor content (migrated in phase 4) + one main action.
 * Liên hệ: the 3 channels first (Gọi, Zalo, Form), address & hours, map on click, social profiles.
 */
if ( ! is_page() ) {
	return;
}
$pg = get_queried_object();
setup_postdata( $GLOBALS['post'] = $pg ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
$slug    = $pg->post_name;
$title   = wp_strip_all_tags( get_the_title( $pg ) );
$content = trim( $pg->post_content ) ? velis_content( $pg->post_content ) : ''; // phpcs:ignore
$out     = velis_breadcrumb_html( velis_trail() );
if ( 'lien-he' === $slug ) {
	$map  = get_posts( array( 'post_type' => 'attachment', 'name' => 'ban-do-van-phong-velis', 'numberposts' => 1, 'fields' => 'ids' ) );
	$out .= '<div class="v-wrap v-pagehead"><h1>' . esc_html( $title ) . '</h1><p class="v-lead">Gọi, nhắn Zalo hoặc để lại số điện thoại, Velis phản hồi trong giờ làm việc.</p>'
		. '<ul class="v-channels"><li><a class="v-btn" href="tel:' . VELIS_PHONE_TEL . '">Gọi ' . VELIS_PHONE . '</a></li><li><a class="v-btn v-btn--secondary" href="' . esc_url( VELIS_ZALO ) . '" rel="noopener" target="_blank">Nhắn Zalo</a></li><li><a class="v-btn v-btn--secondary" href="#tu-van">Gửi yêu cầu</a></li></ul>'
		. velis_facts_html( array( 'Văn phòng' => VELIS_ADDRESS, 'Giờ làm việc' => VELIS_HOURS, 'Email' => VELIS_EMAIL ), null ) . '</div>';
	$out .= '<div class="v-wrap"><div class="v-map">' . ( $map ? wp_get_attachment_image( $map[0], 'large', false, array( 'loading' => 'lazy', 'alt' => 'Bản đồ văn phòng Velis Realty' ) ) : '' )
		. '<a class="v-btn" href="' . esc_url( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( 'Velis Realty ' . VELIS_ADDRESS ) ) . '" target="_blank" rel="noopener">Chỉ đường trên Google Maps</a></div><p class="v-source">Bản đồ © OpenStreetMap contributors.</p></div>';
	$out .= velis_form_html( '', wp_list_pluck( velis_top_projects(), 'post_title' ), 'Gửi yêu cầu tư vấn', false );
} else {
	$cta  = array( 'tuyen-dung' => array( 'Gửi CV', 'mailto:' . VELIS_EMAIL . '?subject=' . rawurlencode( 'Ứng tuyển – ' . $title ) ), 'gioi-thieu' => array( 'Liên hệ Velis', '/lien-he/' ) )[ $slug ] ?? null;
	$out .= '<div class="v-wrap v-pagehead"><h1>' . esc_html( $title ) . '</h1>' . ( $cta ? '<div class="v-row">' . velis_btn( $cta[0], $cta[1] ) . velis_call_btn( 'secondary' ) . '</div>' : '' ) . '</div>';
	$out .= $content ? '<div class="v-wrap"><div class="v-prose">' . $content . '</div></div>' : '';
	if ( in_array( $slug, array( 'gioi-thieu', 'tuyen-dung' ), true ) ) {
		$out .= velis_form_html( '', array(), 'tuyen-dung' === $slug ? 'Đăng ký ứng tuyển' : 'Nhận tư vấn' );
	}
}
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
