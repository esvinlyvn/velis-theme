<?php
/**
 * Title: Giới thiệu
 * Slug: velis/tpl-about
 * Inserter: no
 *
 * BRIEF.md "Giới thiệu": Câu chuyện Velis (page content) · CEO (author profile) · Cách Velis làm việc ·
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
	'lead'    => $pg->post_excerpt ?: velis_s( 'about_page_lead' ),
	'img'     => (int) velis_s( 'about_img' ) ?: (int) get_post_thumbnail_id( $pg ),
	'buttons' => velis_btn( 'Liên hệ Velis', '/lien-he/' ) . velis_call_btn( 'line' ),
) );
// Rhythm (1.5): story (ivory, 2 columns with the "Đang tư vấn" card) → CEO (white) → steps / values / company alternating.
if ( trim( $pg->post_content ) ) {
	$out .= '<div class="wrap page"><div class="page__main"><div class="block prose">' . velis_sechead( 'Câu chuyện Velis', 'Về chúng tôi' ) . velis_strip_contact( velis_content( $pg->post_content ) ) . velis_project_links() . '</div></div>' . velis_highlight_card() . '</div>';
}
$band = array( 'section--tint', '' );
$i    = 0;
if ( $ceo && $ceo->description ) {
	$out .= velis_section( velis_sechead( $ceo->display_name . ' – ' . ( trim( (string) get_user_meta( $ceo->ID, 'velis_role', true ) ) ?: velis_s( 'ceo_role' ) ), 'Người sáng lập' ) . '<p class="hero__lead">' . esc_html( $ceo->description ) . '</p>' . velis_btn( 'Bài viết của ' . $ceo->display_name, get_author_posts_url( $ceo->ID ), 'line' ), '', $band[ $i++ % 2 ] );
}
// Steps and values = the numbered values list of the home page (01–04 …); company facts = the facts list.
foreach ( array( 'velis_steps' => array( 'Cách Velis làm việc', 'Quy trình' ), 'velis_values' => array( 'Giá trị Velis theo đuổi', 'Giá trị' ) ) as $key => list( $h, $eb ) ) {
	if ( $items = $lines( $key ) ) {
		$out .= velis_section( velis_sechead( $h, $eb ) . '<ol class="values">' . implode( '', array_map( fn( $t ) => '<li><p>' . esc_html( $t ) . '</p></li>', $items ) ) . '</ol>', '', $band[ $i++ % 2 ] );
	}
}
if ( $company = $lines( 'velis_company' ) ) {
	$out .= velis_section( velis_sechead( 'Thông tin pháp nhân', 'Pháp nhân' ) . '<div class="prose"><ul>' . implode( '', array_map( fn( $t ) => '<li>' . esc_html( $t ) . '</li>', $company ) ) . '</ul></div>', '', $band[ $i++ % 2 ] );
}
$out .= velis_form_html();
wp_reset_postdata();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers / core content filter ?>
<!-- /wp:html -->
