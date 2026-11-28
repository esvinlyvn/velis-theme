<?php
/** Velis · Nhận bảng giá – form duy nhất của trang (id lien-he-tu-van: nút "Nhận bảng giá" ở phần đầu nhảy tới). */
defined( 'ABSPATH' ) || exit;
$atts  = vc_map_get_attributes( $this->getShortcode(), $atts );
$ten   = get_the_title();
$tieu  = '' !== $atts['tieu_de'] ? $atts['tieu_de'] : 'Nhận bảng giá ' . $ten;
$li    = array_filter( array_column( (array) vc_param_group_parse_atts( $atts['loi_ich'] ), 'dong' ) );
$m     = array();
foreach ( velis_cta_defaults() as $k => $d ) {
	$m[ $k ] = get_theme_mod( $k, $d );
}
$tel = preg_replace( '/[^0-9+]/', '', $m['velis_cta_phone'] );
?>
<section class="velis-cta velis-nbg" id="lien-he-tu-van">
	<div class="velis-nbg__chu">
		<p class="velis-eyebrow">Tư vấn trực tiếp từ Velis Realty</p>
		<h2 id="<?php echo esc_attr( velis_neo( $tieu ) ); ?>"><?php echo esc_html( $tieu ); ?></h2>
		<?php if ( $li ) : ?><ul class="velis-checks"><?php foreach ( $li as $x ) { echo '<li>' . esc_html( $x ) . '</li>'; } ?></ul><?php endif; ?>
	</div>
	<div class="velis-nbg__form">
		<?php if ( $atts['form'] ) { echo do_shortcode( '[contact-form-7 id="' . (int) $atts['form'] . '" du-an="' . esc_attr( '' !== $atts['du_an'] ? $atts['du_an'] : $ten ) . '"]' ); } // phpcs:ignore ?>
		<p class="velis-cta-call">Hoặc gọi ngay <a href="tel:<?php echo esc_attr( $tel ); ?>"><?php echo esc_html( $m['velis_cta_phone'] ); ?></a> · <a href="<?php echo esc_url( $m['velis_cta_zalo'] ); ?>" target="_blank" rel="noopener">Zalo</a><?php echo $atts['goi_them'] ? ' ' . esc_html( $atts['goi_them'] ) : ''; ?></p>
	</div>
</section>
