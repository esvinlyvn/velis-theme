<?php
/**
 * Title: Trang chủ
 * Slug: velis/tpl-front
 * Inserter: no
 *
 * Hero A (photo of a flagship project + positioning line as the only H1) · projects (filters) · developers ·
 * CEO's latest analyses · numbers rendered in the HTML (counted from the data, "+" after the number) · form.
 * "Vì sao chọn Velis" and testimonials appear in phase 4 once the evidence and consented quotes exist.
 */
$projects = velis_top_projects();
$hero     = 0;
foreach ( $projects as $p ) {
	if ( 'the-prive' === $p->post_name && velis_image_id( $p ) ) {
		$hero = velis_image_id( $p );
	}
}
$devs  = array_values( array_filter( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) ), fn( $d ) => velis_developer_projects( $d ) ) );
$posts = get_posts( array( 'numberposts' => 3 ) );
$count = wp_count_posts();
$zones = velis_has_data() ? count( get_posts( array( 'post_type' => 'du-an', 'numberposts' => -1, 'fields' => 'ids', 'meta_key' => 'velis_level', 'meta_value' => 'phan-khu' ) ) ) : 0;

$out  = velis_hero_a( array(
	'img' => $hero, 'h1' => true, 'alt' => 'Phối cảnh dự án The Privé',
	'eyebrow' => 'Velis Realty · tư vấn bất động sản cao cấp',
	'title' => 'Chọn đúng dự án bằng dòng tiền và giá vốn thực',
	'lead' => 'Velis đồng hành cùng anh chị chọn căn hộ, nhà phố, biệt thự hạng sang tại TP.HCM, với thông tin pháp lý và quy hoạch minh bạch.',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem dự án', '#du-an', 'ghost' ),
) );
$out .= velis_section( velis_sechead( 'Dự án Velis đang tư vấn', 'Dự án', 'Lọc theo chủ đầu tư và khu vực; mỗi dự án có trang riêng với giá, pháp lý, tiến độ.', 'du-an' ) . velis_project_listing( $projects ) );
$nums = array_filter( array( 'dự án và đại đô thị' => count( $projects ), 'phân khu có trang riêng' => $zones, 'chủ đầu tư' => count( $devs ), 'bài phân tích' => (int) $count->publish ) );
$dl   = '';
foreach ( $nums as $label => $n ) {
	$dl .= '<div><dt>' . esc_html( $label ) . '</dt><dd>' . esc_html( $n >= 10 ? floor( $n / 10 ) * 10 . '+' : (string) $n ) . '</dd></div>';
}
$out .= velis_section( '<dl class="v-numbers" aria-label="Velis bằng con số">' . $dl . '</dl>', '', 'v-section--tight' );
if ( $devs ) {
	$out .= velis_section( velis_sechead( 'Chủ đầu tư đối tác', 'Chủ đầu tư', 'Chủ đầu tư có dự án Velis đang tư vấn.' ) . velis_grid( array_map( 'velis_card_developer', $devs ) ) . '<p><a class="v-btn v-btn--text" href="' . esc_url( get_post_type_archive_link( 'chu-dau-tu' ) ) . '">Tất cả chủ đầu tư</a></p>' );
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Góc nhìn CEO Vũ Xuân', 'Phân tích mới', 'Phân tích dự án theo dòng tiền, pháp lý và giá vốn thực.' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3' ) . '<p><a class="v-btn v-btn--text" href="/blog/">Đọc blog Velis</a></p>' );
}
$out .= velis_form_html( '', wp_list_pluck( $projects, 'post_title' ) );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
