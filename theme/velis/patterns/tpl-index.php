<?php
/**
 * Title: Danh sách (dự phòng)
 * Slug: velis/tpl-index
 * Inserter: no
 *
 * Fallback for archives without their own template (tag, date …): hero B (text) + the main query as post cards + pagination.
 */
global $wp_query;
$title = wp_strip_all_tags( get_the_archive_title() ?: get_bloginfo( 'name' ) );
$out   = velis_breadcrumb_html( velis_trail() ) . velis_hero_b( array( 'eyebrow' => 'Blog Velis', 'title' => $title ) );
$out  .= $wp_query->posts
	? velis_section( velis_grid( array_map( 'velis_card_post', $wp_query->posts ), 'three' ) . velis_pagination( $wp_query ), '', 'section--tint' )
	: velis_section( '<p class="mb-0">Chưa có nội dung phù hợp.</p>' . velis_search_form( 'idx-s' ), '', 'section--tint' );
$out  .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
