<?php
/**
 * Title: Header
 * Slug: velis/header
 * Inserter: no
 *
 * Mockup header: logo, 5 links, hotline (≥ 1280), "Nhận tư vấn"; below 1024 px a full-screen <dialog> menu. Rendered
 * inline by every template (no template-part wrapper, so the header itself is sticky).
 */
$logo  = esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) );
$nav   = array( 'Dự án' => '/du-an/', 'Chủ đầu tư' => '/chu-dau-tu/', 'Blog' => '/blog/', 'Về Velis' => '/gioi-thieu/', 'Liên hệ' => '/lien-he/' );
$links = implode( '', array_map( fn( $l, $u ) => '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a></li>', array_keys( $nav ), $nav ) );
?>
<!-- wp:html -->
<a class="sr-only" href="#noi-dung">Bỏ qua đến nội dung</a>
<header class="header"><div class="wrap header__bar">
	<a class="header__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo $logo; ?>" width="191" height="44" alt="Velis Realty – trang chủ"></a>
	<nav class="header__nav" aria-label="Menu chính"><ul><?php echo $links; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<a class="header__phone" href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>">Gọi hotline <?php echo esc_html( VELIS_PHONE ); ?></a>
	<a class="btn header__cta" href="#tu-van">Nhận tư vấn</a>
	<button class="header__menu" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu"><span></span><b class="sr-only">Mở menu</b></button>
</div></header>
<dialog class="menu" id="menu" aria-label="Menu">
	<div class="menu__top"><img src="<?php echo $logo; ?>" width="156" height="36" alt="Velis Realty"><button class="menu__close" type="button" data-menu-close aria-label="Đóng menu">×</button></div>
	<nav aria-label="Menu chính (di động)"><ul><?php echo $links; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<div class="menu__actions"><a class="btn btn--line" href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>">Gọi hotline <?php echo esc_html( VELIS_PHONE ); ?></a><a class="btn" href="#tu-van" data-menu-close>Nhận tư vấn</a></div>
</dialog>
<!-- /wp:html -->
