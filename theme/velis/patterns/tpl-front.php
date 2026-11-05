<?php
/**
 * Title: Trang chủ
 * Slug: velis/tpl-front
 * Inserter: no
 *
 * Hero A (who / what / where = the only H1) with 4 featured projects (photo only) · numbers strip · other projects · developers · Vì sao chọn Velis ·
 * CEO (intro + latest analyses) · testimonials · form. Blocks without content are not rendered:
 * "Vì sao chọn Velis", the CEO intro and testimonials come from the front page's custom fields once written
 * (velis_why, velis_ceo, velis_testimonials – one item per line; phase 4).
 */
$front    = get_post( (int) get_option( 'page_on_front' ) );
$projects = array_values( array_filter( velis_top_projects(), 'velis_image_id' ) ); // only projects with a real photo go on the home page
$hero     = 0;
foreach ( $projects as $p ) {
	if ( 'the-prive' === $p->post_name ) {
		$hero = velis_image_id( $p );
	}
}
$featured = $projects; // every project with a photo; the strip scrolls sideways when there are more than 4
$field    = fn( $k ) => $front ? array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $front->ID, $k, true ) ) ) ) ) : array();
$devs     = array_values( array_filter( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) ), fn( $d ) => velis_developer_projects( $d ) ) );
// CEO analyses: newest posts whose featured image is a real project image (velis_image_kind), one per project cluster.
$posts = array();
$seen  = array();
foreach ( get_posts( array( 'numberposts' => 40, 'meta_key' => 'velis_image_kind', 'meta_value' => 'du-an' ) ) as $p ) {
	$c = velis_primary_category( $p );
	if ( count( $posts ) < 3 && ! isset( $seen[ $c ? $c->term_id : 0 ] ) ) {
		$posts[]                       = $p;
		$seen[ $c ? $c->term_id : 0 ] = true;
	}
}

// Wording from the existing home / about pages (velisrealty.vn, 2026-11-04): who, what, where, and the CEO's own analysis.
$out  = velis_hero_a( array(
	'img' => $hero, 'h1' => true, 'alt' => 'Phối cảnh dự án The Privé', 'mod' => 'home',
	'eyebrow' => 'Velis Realty',
	'title' => 'Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận',
	'lead' => 'Căn hộ hạng sang, villa nghỉ dưỡng, shophouse của Vinhomes, Sun Group, Masterise Homes, Gamuda Land cho người mua ở và nhà đầu tư. CEO Vũ Xuân trực tiếp phân tích dòng tiền và rủi ro từng dự án.',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem dự án', get_post_type_archive_link( 'du-an' ), 'ghost' ),
	'after' => velis_feature_strip( $featured ),
) );
$count = wp_count_posts();
$nums  = array_filter( array( 'dự án đang tư vấn' => count( velis_top_projects() ), 'chủ đầu tư đối tác' => count( $devs ), 'bài phân tích của CEO' => (int) $count->publish ) );
$dl    = '';
foreach ( $nums as $label => $n ) {
	$dl .= '<div><dt>' . esc_html( $label ) . '</dt><dd>' . esc_html( $n >= 10 ? floor( $n / 10 ) * 10 . '+' : (string) $n ) . '</dd></div>';
}
$out .= velis_section( '<dl class="v-numbers" aria-label="Velis bằng con số">' . $dl . '</dl>', '', 'v-section--strip' );
// "Về Velis": the office photo of the about page + a quote (≤ 60 words, whole sentences) from its "Tầm nhìn & sứ mệnh" part.
$about = get_page_by_path( 'gioi-thieu' );
if ( $about && preg_match( '#<h[2-4][^>]*>(?:(?!</h).)*tầm nhìn(?:(?!</h).)*</h[2-4]>(.*?)(?=<!-- wp:heading|$)#siu', $about->post_content, $m ) ) {
	$quote = velis_sentence_run( html_entity_decode( wp_strip_all_tags( $m[1] ), ENT_QUOTES ) );
	$photo = (int) get_post_thumbnail_id( $about );
	if ( $quote ) {
		$out .= velis_section( '<div class="v-about">' . ( $photo ? '<figure>' . velis_img( $photo, 'Văn phòng Velis Realty', 'large', array( 'sizes' => '(min-width: 1024px) min(50vw - 64px, 628px), 100vw' ) ) . '</figure>' : '' )
			. '<div>' . velis_sechead( 'Velis Realty', 'Về Velis' ) . '<p class="v-lead">' . esc_html( $quote ) . '</p>' . velis_btn( 'Tìm hiểu Velis', get_permalink( $about ), 'secondary' ) . '</div></div>' );
	}
}
if ( $devs ) {
	$logos = array_filter( $devs, fn( $d ) => get_post_meta( $d->ID, 'velis_logo', true ) );
	$list  = count( $logos ) === count( $devs ) ? velis_grid( array_map( 'velis_card_developer', $devs ) )
		: '<ul class="v-devnames">' . implode( '', array_map( fn( $d ) => '<li><a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a><span>' . esc_html( implode( ', ', wp_list_pluck( velis_developer_projects( $d ), 'post_title' ) ) ) . '</span></li>', $devs ) ) . '</ul>';
	$out  .= velis_section( velis_sechead( 'Chủ đầu tư đối tác', 'Chủ đầu tư', 'Chủ đầu tư có dự án Velis đang tư vấn.', '', velis_btn( 'Tất cả chủ đầu tư', get_post_type_archive_link( 'chu-dau-tu' ), 'secondary' ) ) . $list, '', 'v-section--band' );
}
if ( $why = $field( 'velis_why' ) ) {
	$out .= velis_section( velis_sechead( 'Vì sao chọn Velis', 'Velis Realty' ) . '<ol class="v-reasons">' . implode( '', array_map( fn( $r ) => '<li>' . esc_html( $r ) . '</li>', array_slice( $why, 0, 3 ) ) ) . '</ol>' );
}
$ceo = $field( 'velis_ceo' );
if ( $ceo || $posts ) {
	$out .= velis_section( velis_sechead( 'Góc nhìn CEO Vũ Xuân', 'Phân tích mới', '', '', velis_btn( 'Đọc blog Velis', '/blog/', 'secondary' ) ) . ( $ceo ? '<div class="v-prose">' . wpautop( esc_html( implode( "\n\n", $ceo ) ) ) . '</div>' : '' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3 v-rail' ), '', 'v-section--dark' );
}
if ( $quotes = $field( 'velis_testimonials' ) ) {
	$out .= velis_section( velis_sechead( 'Khách hàng nói gì', 'Cảm nhận' ) . '<div class="v-quotes">' . implode( '', array_map( fn( $q ) => '<blockquote><p>' . esc_html( $q ) . '</p></blockquote>', $quotes ) ) . '</div>' );
}
$out .= velis_form_html( '', wp_list_pluck( velis_top_projects(), 'post_title' ) );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
