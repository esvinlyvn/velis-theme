<?php
/**
 * Title: Giới thiệu
 * Slug: velis/tpl-about
 * Inserter: no
 *
 * BRIEF.md "Giới thiệu": Câu chuyện Velis (page content) · CEO Vũ Xuân (author profile) · Cách Velis làm việc ·
 * Giá trị · Thông tin pháp nhân · CTA. Lists come from the page's custom fields, one item per line
 * (velis_steps, velis_values, velis_company); every block hides when empty.
 */
if ( ! is_page() ) {
	return;
}
$pg = get_queried_object();
setup_postdata( $GLOBALS['post'] = $pg ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
$lines = fn( $k ) => array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pg->ID, $k, true ) ) ) ) );
$ceo   = get_users( array( 'has_published_posts' => array( 'post' ), 'orderby' => 'post_count', 'order' => 'DESC', 'number' => 1 ) );
$ceo   = $ceo ? $ceo[0] : null;
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array(
	'eyebrow' => 'Velis Realty',
	'title'   => wp_strip_all_tags( get_the_title( $pg ) ),
	'lead'    => $pg->post_excerpt,
	'img'     => (int) get_post_thumbnail_id( $pg ),
	'buttons' => velis_btn( 'Liên hệ Velis', '/lien-he/' ) . velis_call_btn( 'secondary' ),
) );
if ( trim( $pg->post_content ) ) {
	$out .= velis_section( velis_sechead( 'Câu chuyện Velis', 'Về chúng tôi' ) . '<div class="v-prose">' . velis_content( $pg->post_content ) . '</div>' );
}
if ( $ceo && $ceo->description ) {
	$out .= velis_section( velis_sechead( $ceo->display_name . ' – CEO Velis Realty', 'Người sáng lập' ) . '<p class="v-lead">' . esc_html( $ceo->description ) . '</p>' . velis_btn( 'Bài viết của ' . $ceo->display_name, get_author_posts_url( $ceo->ID ), 'secondary' ) );
}
if ( $steps = $lines( 'velis_steps' ) ) {
	$out .= velis_section( velis_sechead( 'Cách Velis làm việc', 'Quy trình' ) . '<ol class="v-steps">' . implode( '', array_map( fn( $s ) => '<li>' . esc_html( $s ) . '</li>', $steps ) ) . '</ol>' );
}
if ( $values = $lines( 'velis_values' ) ) {
	$out .= velis_section( velis_sechead( 'Giá trị Velis theo đuổi', 'Giá trị' ) . '<ul class="v-list">' . implode( '', array_map( fn( $s ) => '<li>' . esc_html( $s ) . '</li>', $values ) ) . '</ul>' );
}
if ( $company = $lines( 'velis_company' ) ) {
	$out .= velis_section( velis_sechead( 'Thông tin pháp nhân', 'Pháp nhân' ) . '<ul class="v-list">' . implode( '', array_map( fn( $s ) => '<li>' . esc_html( $s ) . '</li>', $company ) ) . '</ul>' );
}
$out .= velis_form_html( '', wp_list_pluck( velis_top_projects(), 'post_title' ) );
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
