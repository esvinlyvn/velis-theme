<?php
/**
 * Title: Trang tổng chủ đầu tư
 * Slug: velis/tpl-developers
 * Inserter: no
 */
$devs = get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) );
// Developers with projects first: they are the root of a silo.
usort( $devs, fn( $a, $b ) => count( velis_developer_projects( $b ) ) <=> count( velis_developer_projects( $a ) ) ?: strcmp( $a->post_title, $b->post_title ) );
$intro = get_post_type_object( 'chu-dau-tu' )->description;
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Chủ đầu tư',
	'title'   => 'Chủ đầu tư có dự án Velis đang tư vấn',
	'lead'    => count( $devs ) . ' chủ đầu tư. Mỗi trang gồm dự án đang tư vấn, dữ kiện công khai có nguồn và nhận định của CEO Vũ Xuân.',
	'buttons' => velis_btn( 'Xem dự án', get_post_type_archive_link( 'du-an' ), 'line' ),
) );
$out  .= velis_section( velis_sechead( 'Danh sách chủ đầu tư', 'Chủ đầu tư' ) . ( $intro ? '<div class="prose">' . wpautop( esc_html( $intro ) ) . '</div>' : '' ) . velis_grid( array_map( 'velis_card_developer', $devs ), 'three' ), '', 'section--tint' );
$out  .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
