<?php
/**
 * Title: Trang tổng chủ đầu tư
 * Slug: velis/tpl-developers
 * Inserter: no
 */
$devs = velis_active_developers(); // 2.10: developers with 0 projects keep their page but are not listed
// Developers with projects first: they are the root of a silo.
usort( $devs, fn( $a, $b ) => count( velis_developer_projects( $b ) ) <=> count( velis_developer_projects( $a ) ) ?: strcmp( $a->post_title, $b->post_title ) );
$intro = get_post_type_object( 'chu-dau-tu' )->description;
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Chủ đầu tư',
	'title'   => velis_s( 'developers_title' ),
	'lead'    => str_replace( '{số}', (string) count( $devs ), (string) velis_s( 'developers_lead' ) ),
	'img'     => (int) velis_s( 'developers_img' ),
	'alt'     => (string) get_post_meta( (int) velis_s( 'developers_img' ), '_wp_attachment_image_alt', true ),
	'buttons' => velis_btn( 'Xem dự án', get_post_type_archive_link( 'du-an' ), 'line' ),
) );
$out  .= velis_section( velis_sechead( 'Danh sách chủ đầu tư', 'Chủ đầu tư' ) . ( $intro ? '<div class="prose">' . wpautop( esc_html( $intro ) ) . '</div>' : '' ) . velis_grid( array_map( 'velis_card_developer', $devs ), 'three' ), '', 'section--tint' );
$out  .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
