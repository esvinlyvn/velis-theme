<?php
/**
 * Title: Trang tổng dự án
 * Slug: velis/tpl-projects
 * Inserter: no
 *
 * /du-an/: hero B, filter bar (Khu vực → Tiểu khu, Chủ đầu tư, Loại sản phẩm, Trạng thái), project cards. Filtering
 * runs on the page; the full list is in the HTML (no JS needed to read it).
 */
$projects = velis_top_projects();
$names    = wp_list_pluck( $projects, 'post_title' );
$out      = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Dự án Velis đang tư vấn',
	'title'   => 'Dự án bất động sản cao cấp tại TP.HCM và vùng lân cận',
	'lead'    => count( $projects ) . ' dự án và đại đô thị: ' . implode( ', ', $names ) . '. Lọc theo khu vực, chủ đầu tư và loại sản phẩm.',
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem danh sách', '#danh-sach', 'line' ),
	'img'     => velis_image_id( current( array_filter( $projects, fn( $p ) => 'the-prive' === $p->post_name ) ) ?: ( $projects[0] ?? 0 ) ),
	'alt'     => 'Phối cảnh dự án The Privé',
) );
$out     .= velis_section( velis_sechead( 'Danh sách dự án', 'Lọc dự án', '', 'danh-sach' ) . velis_project_listing( $projects ), 'du-an', 'section--tint' );
$out     .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
