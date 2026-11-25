<?php
/** Velis · Hỏi đáp – <details>/<summary>, "+ / –" bên phải; FAQPage do inc/velis-elements.php tạo. */
defined( 'ABSPATH' ) || exit;
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$muc  = (array) vc_param_group_parse_atts( $atts['muc'] );
$t    = '' !== $atts['tieu_de'] ? $atts['tieu_de'] : 'Câu hỏi thường gặp';
?>
<section class="velis-hoi-dap" id="<?php echo esc_attr( $atts['el_id'] ? $atts['el_id'] : velis_neo( $t ) ); ?>">
	<h2><?php echo esc_html( $t ); ?></h2>
	<?php if ( $atts['gioi_thieu'] ) { echo wpautop( wp_kses_post( $atts['gioi_thieu'] ) ); } // phpcs:ignore ?>
	<?php foreach ( $muc as $q ) : if ( empty( $q['hoi'] ) ) { continue; } ?>
	<details class="velis-hoi-dap__muc"><summary><h3><?php echo esc_html( $q['hoi'] ); ?></h3></summary><div class="velis-hoi-dap__tra-loi"><?php echo wpautop( wp_kses_post( $q['dap'] ?? '' ) ); // phpcs:ignore ?></div></details>
	<?php endforeach; ?>
</section>
