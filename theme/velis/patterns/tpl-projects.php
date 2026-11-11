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
$img      = (int) velis_s( 'projects_img' ); // Cài đặt Velis; 2.7: not the photo of the home hero nor of Giới thiệu
$out      = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => velis_s( 'projects_eyebrow' ),
	'title'   => velis_s( 'projects_title' ),
	'lead'    => strtr( (string) velis_s( 'projects_lead' ), array( '{số}' => count( $projects ), '{tên}' => implode( ', ', wp_list_pluck( $projects, 'post_title' ) ) ) ),
	'buttons' => velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Xem danh sách', '#danh-sach', 'line' ),
	'img'     => $img,
	'alt'     => (string) get_post_meta( $img, '_wp_attachment_image_alt', true ),
) );
$out     .= velis_section( velis_sechead( 'Danh sách dự án', 'Lọc dự án', '', 'danh-sach' ) . velis_project_listing( $projects ), 'du-an', 'section--tint' );
$intro = get_page_by_path( 'du-an' ); // 5.2: the text of the old "Dự án" page is shown here, not lost under the archive
if ( $intro && '' !== trim( $intro->post_content ) ) {
	$out .= velis_text_section( $intro->post_content );
}
$out     .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
