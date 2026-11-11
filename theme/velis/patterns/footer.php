<?php
/**
 * Title: Footer
 * Slug: velis/footer
 * Inserter: no
 *
 * Mockup footer: own ground #1A1A1A + champagne line (1.5), 4 columns, social links as outline pills; then the mobile
 * bottom CTA bar (shown once the hero buttons scroll away, velis.js).
 */
$social  = velis_social_links(); // only networks with a URL in Cài đặt Velis → Mạng xã hội
$explore = array_map( fn( $x ) => array( $x[0], $x[1] ), velis_menu_tree( 'kham-pha' ) ) ?: array( array( 'Dự án', '/du-an/' ), array( 'Chủ đầu tư', '/chu-dau-tu/' ), array( 'Blog', '/blog/' ), array( 'Giới thiệu', '/gioi-thieu/' ), array( 'Tuyển dụng', '/tuyen-dung/' ), array( 'Liên hệ', '/lien-he/' ) ); // Giao diện → Menu → "Chân trang – Khám phá", else these
$contact = array_filter( array( velis_phone_link(), velis_email_link(), esc_html( velis_s( 'address' ) ) . ( velis_s( 'hours' ) ? '<br>' . esc_html( velis_s( 'hours' ) ) : '' ) ) );
$li = fn( array $l ) => implode( '', array_map( fn( $x ) => '<li><a href="' . esc_url( $x[1] ) . '">' . esc_html( $x[0] ) . '</a></li>', $l ) );
?>
<!-- wp:html -->
<footer class="footer"><div class="wrap">
	<div class="footer__grid">
		<div><img src="<?php echo esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal-white.svg' ) ); ?>" width="174" height="40" alt="Velis Realty">
			<?php if ( velis_s( 'footer_tagline' ) ) : ?><p><?php echo esc_html( velis_s( 'footer_tagline' ) ); ?></p><?php endif; ?>
			<?php if ( $contact ) : ?><p class="footer__contact"><?php echo implode( '', $contact ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></p><?php endif; ?></div>
		<nav aria-label="Khám phá"><p class="eyebrow">Khám phá</p><ul><?php echo $li( $explore ); // phpcs:ignore WordPress.Security.EscapeOutput ?></ul></nav>
		<nav aria-label="Ứng dụng"><p class="eyebrow">Ứng dụng</p><ul><?php echo $li( array( array( 'Thi thử chứng chỉ môi giới', '/thi/' ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?></ul></nav>
		<?php if ( $social ) : ?><div><p class="eyebrow">Theo dõi Velis</p><ul class="footer__social">
		<?php foreach ( $social as $label => $url ) : ?>
			<li><a href="<?php echo esc_url( $url ); ?>" aria-label="<?php echo esc_attr( "Velis Realty trên $label" ); ?>" rel="me noopener" target="_blank"><?php echo esc_html( $label ); ?></a></li>
		<?php endforeach; ?>
		</ul></div><?php endif; ?>
	</div>
	<div class="footer__bottom"><p class="mb-0">© <?php echo esc_html( gmdate( 'Y' ) ); ?> Velis Realty.<?php echo velis_s( 'footer_note' ) ? ' ' . esc_html( velis_s( 'footer_note' ) ) : ''; ?></p><a href="/chinh-sach-bao-mat/">Chính sách bảo mật</a></div>
</div></footer>
<nav class="cta" aria-label="Liên hệ nhanh"><?php if ( velis_s( 'phone' ) ) : ?><a href="tel:<?php echo esc_attr( velis_tel() ); ?>">Gọi</a><?php endif; ?><?php if ( velis_s( 'zalo' ) ) : ?><a href="<?php echo esc_url( velis_s( 'zalo' ) ); ?>" rel="noopener">Zalo</a><?php endif; ?><a href="#tu-van">Nhận tư vấn</a></nav>
<!-- /wp:html -->
