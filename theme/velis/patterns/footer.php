<?php
/**
 * Title: Footer
 * Slug: velis/footer
 * Inserter: no
 *
 * Mockup footer: own ground #1A1A1A + champagne line (1.5), 4 columns, social links as outline pills; then the mobile
 * bottom CTA bar (shown once the hero buttons scroll away, velis.js).
 */
$social = velis_social_links(); // only networks with a URL in Rank Math → Titles & Meta → Social Meta (2.5)
$li = fn( array $l ) => implode( '', array_map( fn( $t, $u ) => '<li><a href="' . esc_url( $u ) . '">' . esc_html( $t ) . '</a></li>', array_keys( $l ), $l ) );
?>
<!-- wp:html -->
<footer class="footer"><div class="wrap">
	<div class="footer__grid">
		<div><img src="<?php echo esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal-white.svg' ) ); ?>" width="174" height="40" alt="Velis Realty">
			<p>Tư vấn bất động sản cao cấp, phân tích theo dòng tiền và giá vốn thực.</p>
			<p class="footer__contact"><a href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>"><?php echo esc_html( VELIS_PHONE ); ?></a><a href="mailto:<?php echo esc_attr( VELIS_EMAIL ); ?>"><?php echo esc_html( VELIS_EMAIL ); ?></a><?php echo esc_html( VELIS_ADDRESS ); ?><br><?php echo esc_html( VELIS_HOURS ); ?></p></div>
		<nav aria-label="Khám phá"><p class="eyebrow">Khám phá</p><ul><?php echo $li( array( 'Dự án' => '/du-an/', 'Chủ đầu tư' => '/chu-dau-tu/', 'Blog' => '/blog/', 'Giới thiệu' => '/gioi-thieu/', 'Tuyển dụng' => '/tuyen-dung/', 'Liên hệ' => '/lien-he/' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></ul></nav>
		<nav aria-label="Ứng dụng"><p class="eyebrow">Ứng dụng</p><ul><?php echo $li( array( 'Thi thử chứng chỉ môi giới' => '/thi/' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></ul></nav>
		<?php if ( $social ) : ?><div><p class="eyebrow">Theo dõi Velis</p><ul class="footer__social">
		<?php foreach ( $social as $label => $url ) : ?>
			<li><a href="<?php echo esc_url( $url ); ?>" aria-label="<?php echo esc_attr( "Velis Realty trên $label" ); ?>" rel="me noopener" target="_blank"><?php echo esc_html( $label ); ?></a></li>
		<?php endforeach; ?>
		</ul></div><?php endif; ?>
	</div>
	<div class="footer__bottom"><p class="mb-0">© <?php echo esc_html( gmdate( 'Y' ) ); ?> Velis Realty. Thông tin dự án chỉ để tham khảo; vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p><a href="/chinh-sach-bao-mat/">Chính sách bảo mật</a></div>
</div></footer>
<nav class="cta" aria-label="Liên hệ nhanh"><a href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>">Gọi</a><a href="<?php echo esc_url( VELIS_ZALO ); ?>" rel="noopener">Zalo</a><a href="#tu-van">Nhận tư vấn</a></nav>
<!-- /wp:html -->
