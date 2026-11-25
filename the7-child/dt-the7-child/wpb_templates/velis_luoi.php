<?php
/** Velis · Lưới dự án / bài liên quan – dùng phần tử The7 "Blog Masonry & Grid" với cài đặt thẻ chung (velis.css mục 5). */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$so   = max( 1, (int) $atts['so'] );
$cats = implode( ',', array_filter( array_map( 'intval', explode( ',', (string) $atts['danh_muc'] ) ) ) );
$ids  = implode( ',', array_filter( array_map( 'intval', explode( ',', (string) $atts['bai'] ) ) ) );
if ( 'y' === $atts['noi_bat'] ) {
	$ids = implode( ',', get_posts( array( 'fields' => 'ids', 'post__in' => get_option( 'sticky_posts' ) ? get_option( 'sticky_posts' ) : array( 0 ), 'category' => $cats, 'numberposts' => $so ) ) );
}
$nguon = $ids ? 'post_type="posts" posts="' . $ids . '"' : 'post_type="category" category="' . $cats . '"';
$du_an = 'du_an' === $atts['loai'];
$sc    = $du_an
	? '[dt_blog_masonry ' . $nguon . ' mode="grid" layout="classic" image_sizing="resize" resized_image_dimensions="4x3" image_scale_animation_on_hover="disabled" image_hover_bg_color="disabled" bwb_columns="desktop:3|h_tablet:3|v_tablet:2|phone:1" gap_between_posts="12px" all_posts_the_same_width="y" content_alignment="left" post_content_paddings="24px 24px 24px 24px" post_date="n" post_category="n" post_author="n" post_comments="n" post_content="show_excerpt" read_more_button="off" loading_mode="disabled" dis_posts_total="' . $so . '" orderby="date" order="desc"]'
	: '[dt_blog_masonry ' . $nguon . ' mode="grid" image_scale_animation_on_hover="disabled" bwb_columns="desktop:3|h_tablet:3|v_tablet:2|phone:1" all_posts_the_same_width="y" content_alignment="left" post_author="n" post_comments="n" post_content="show_excerpt" excerpt_words_limit="30" read_more_button="off" dis_posts_total="' . $so . '" posts_offset="0"]';
?>
<section class="velis-luoi<?php echo $du_an ? ' velis-projects' : ' velis-bai'; ?>" id="<?php echo esc_attr( $atts['el_id'] ? $atts['el_id'] : velis_neo( $atts['tieu_de'] ) ); ?>">
	<?php if ( $atts['tieu_de'] ) : ?><h2><?php echo esc_html( $atts['tieu_de'] ); ?></h2><?php endif; ?>
	<?php echo do_shortcode( $sc ); // phpcs:ignore ?>
</section>
