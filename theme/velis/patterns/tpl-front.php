<?php
/**
 * Title: Trang chủ
 * Slug: velis/tpl-front
 * Inserter: no
 *
 * Brief order: Hero A (positioning line = the only H1) · 6 featured projects · developers · Vì sao chọn Velis ·
 * CEO (intro + latest analyses) · numbers · testimonials · form. Blocks without content are not rendered:
 * "Vì sao chọn Velis", the CEO intro and testimonials come from the front page's custom fields once written
 * (velis_why, velis_ceo, velis_testimonials – one item per line; phase 4).
 */
$front    = get_post( (int) get_option( 'page_on_front' ) );
$projects = velis_top_projects();
usort( $projects, fn( $a, $b ) => ( ! velis_image_id( $a ) ) <=> ( ! velis_image_id( $b ) ) ); // with a photo first
$hero = 0;
foreach ( $projects as $p ) {
	if ( 'the-prive' === $p->post_name ) {
		$hero = velis_image_id( $p );
	}
}
$field = fn( $k ) => $front ? array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $front->ID, $k, true ) ) ) ) ) : array();
$devs  = array_values( array_filter( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) ), fn( $d ) => velis_developer_projects( $d ) ) );
$posts = get_posts( array( 'numberposts' => 3 ) );

$out  = velis_hero_a( array(
	'img' => $hero, 'h1' => true, 'alt' => 'Phối cảnh dự án The Privé',
	'eyebrow' => 'Velis Realty · tư vấn bất động sản cao cấp',
	'title' => 'Chọn đúng dự án bằng dòng tiền và giá vốn thực',
	'lead' => 'Velis đồng hành cùng anh chị chọn căn hộ, nhà phố, biệt thự hạng sang tại TP.HCM, với thông tin pháp lý và quy hoạch minh bạch.',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem dự án', '#du-an', 'ghost' ),
) );
$all  = velis_btn( 'Xem tất cả dự án', get_post_type_archive_link( 'du-an' ), 'secondary' );
$out .= velis_section( velis_sechead( 'Dự án Velis đang tư vấn', 'Dự án', 'Mỗi dự án có trang riêng với giá, pháp lý, tiến độ.', 'du-an', $all ) . velis_grid( array_map( 'velis_card_project', array_slice( $projects, 0, 6 ) ), 'zones' ) );
if ( $devs ) {
	$logos = array_filter( $devs, fn( $d ) => get_post_meta( $d->ID, 'velis_logo', true ) );
	$list  = count( $logos ) === count( $devs ) ? velis_grid( array_map( 'velis_card_developer', $devs ) )
		: '<ul class="v-devnames">' . implode( '', array_map( fn( $d ) => '<li><a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a><span>' . esc_html( implode( ', ', wp_list_pluck( velis_developer_projects( $d ), 'post_title' ) ) ) . '</span></li>', $devs ) ) . '</ul>';
	$out  .= velis_section( velis_sechead( 'Chủ đầu tư đối tác', 'Chủ đầu tư', 'Chủ đầu tư có dự án Velis đang tư vấn.', '', velis_btn( 'Tất cả chủ đầu tư', get_post_type_archive_link( 'chu-dau-tu' ), 'secondary' ) ) . $list );
}
if ( $why = $field( 'velis_why' ) ) {
	$out .= velis_section( velis_sechead( 'Vì sao chọn Velis', 'Velis Realty' ) . '<ol class="v-reasons">' . implode( '', array_map( fn( $r ) => '<li>' . esc_html( $r ) . '</li>', array_slice( $why, 0, 3 ) ) ) . '</ol>' );
}
$ceo = $field( 'velis_ceo' );
if ( $ceo || $posts ) {
	$out .= velis_section( velis_sechead( 'Góc nhìn CEO Vũ Xuân', 'Phân tích mới', '', '', velis_btn( 'Đọc blog Velis', '/blog/', 'secondary' ) ) . ( $ceo ? '<div class="v-prose">' . wpautop( esc_html( implode( "\n\n", $ceo ) ) ) . '</div>' : '' ) . velis_grid( array_map( 'velis_card_post', $posts ), '3' ) );
}
$count = wp_count_posts();
$nums  = array_filter( array( 'dự án đang tư vấn' => count( $projects ), 'chủ đầu tư đối tác' => count( $devs ), 'bài phân tích của CEO' => (int) $count->publish ) );
$dl    = '';
foreach ( $nums as $label => $n ) {
	$dl .= '<div><dt>' . esc_html( $label ) . '</dt><dd>' . esc_html( $n >= 10 ? floor( $n / 10 ) * 10 . '+' : (string) $n ) . '</dd></div>';
}
$out .= velis_section( '<dl class="v-numbers" aria-label="Velis bằng con số">' . $dl . '</dl>', '', 'v-section--tight' );
if ( $quotes = $field( 'velis_testimonials' ) ) {
	$out .= velis_section( velis_sechead( 'Khách hàng nói gì', 'Cảm nhận' ) . '<div class="v-quotes">' . implode( '', array_map( fn( $q ) => '<blockquote><p>' . esc_html( $q ) . '</p></blockquote>', $quotes ) ) . '</div>' );
}
$out .= velis_form_html( '', wp_list_pluck( $projects, 'post_title' ) );
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
