<?php
/** Velis · Khối nội dung – tiêu đề + chữ (7/12) | minh họa (5/12), cùng mép trên; < 1200: chữ trước, minh họa sau. */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$cap  = 'h3' === $atts['cap'] ? 'h3' : 'h2';
$id   = $atts['el_id'] ? $atts['el_id'] : velis_neo( $atts['tieu_de'] );
$mh   = '';
switch ( $atts['minh_hoa'] ) {
	case 'anh':
		$mh = $atts['anh'] ? do_shortcode( '[vc_single_image image="' . (int) $atts['anh'] . '" img_size="large" onclick="img_link_large" el_class="velis-badge"]' ) : '';
		break;
	case 'thu_vien':
		foreach ( array_filter( array_map( 'intval', explode( ',', (string) $atts['thu_vien'] ) ) ) as $img ) {
			$mh .= do_shortcode( '[vc_single_image image="' . $img . '" img_size="large" onclick="img_link_large" el_class="velis-badge"]' );
		}
		$mh = $mh ? '<div class="velis-thu-vien">' . $mh . '</div>' : '';
		break;
	case 'ban_do':
	case 'bang':
		$raw = rawurldecode( base64_decode( (string) $atts[ $atts['minh_hoa'] ], true ) ?: '' ); // textarea_raw_html của WPBakery: base64(rawurlencode)
		$mh  = $raw ? '<div class="velis-' . ( 'bang' === $atts['minh_hoa'] ? 'bang' : 'ban-do' ) . '">' . wp_kses_post( $raw ) . '</div>' : '';
		if ( 'ban_do' === $atts['minh_hoa'] && $raw ) {
			$mh = '<div class="velis-ban-do">' . wp_kses( $raw, array( 'iframe' => array( 'src' => true, 'width' => true, 'height' => true, 'style' => true, 'allowfullscreen' => true, 'loading' => true, 'referrerpolicy' => true, 'title' => true ) ) ) . '</div>';
		}
		break;
	default:
		$d = array_filter( array_column( (array) vc_param_group_parse_atts( $atts['diem'] ), 'dong' ) );
		$mh = $d ? '<div class="velis-diem"><p class="velis-eyebrow">Điểm chính</p><ul>' . implode( '', array_map( fn( $x ) => '<li>' . velis_so( esc_html( $x ) ) . '</li>', $d ) ) . '</ul></div>' : '';
}
?>
<section class="velis-khoi<?php echo $mh ? ' velis-khoi--' . esc_attr( $atts['minh_hoa'] ) . ( 'trai' === $atts['ben'] ? ' velis-khoi--trai' : '' ) : ' velis-khoi--chu'; ?>" id="<?php echo esc_attr( $id ); ?>">
	<div class="velis-khoi__chu">
		<?php if ( $atts['tieu_de'] ) : ?><<?php echo $cap; ?> class="velis-khoi__tieu-de"><?php echo esc_html( $atts['tieu_de'] ); ?></<?php echo $cap; ?>><?php endif; ?>
		<?php echo wpb_js_remove_wpautop( $content, true ); // phpcs:ignore ?>
	</div>
	<?php if ( $mh ) : ?><div class="velis-khoi__minh-hoa"><?php echo $mh; // phpcs:ignore ?></div><?php endif; ?>
</section>
