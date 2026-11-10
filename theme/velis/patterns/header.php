<?php
/**
 * Title: Header
 * Slug: velis/header
 * Inserter: no
 *
 * Mockup header: logo, 5 links, hotline (≥ 1280), "Nhận tư vấn"; below 1024 px a full-screen <dialog> menu. Rendered
 * inline by every template (no template-part wrapper, so the header itself is sticky). "Dự án" and "Về Velis" open a
 * drop-down (hover, click, keyboard – velis.js); in the mobile menu their links are sub-items (decision 2026-11-06).
 */
$logo  = esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) );
$projs = array_slice( velis_top_projects(), 0, 6 );
$subs  = array(
	'Dự án'    => array_merge( array_map( fn( $p ) => array( $p->post_title, get_permalink( $p ) ), $projs ), array( array( 'Tất cả dự án', '/du-an/' ) ) ),
	'Về Velis' => array( array( 'Giới thiệu', '/gioi-thieu/' ), array( 'Tuyển dụng', '/tuyen-dung/' ) ), // Liên hệ is its own top-level item (2026-11-11)
);
$nav   = array( 'Dự án' => '/du-an/', 'Chủ đầu tư' => '/chu-dau-tu/', 'Blog' => '/blog/', 'Về Velis' => '/gioi-thieu/', 'Liên hệ' => '/lien-he/' );
$list  = fn( $items ) => implode( '', array_map( fn( $x ) => '<li><a href="' . esc_url( $x[1] ) . '">' . esc_html( $x[0] ) . '</a></li>', $items ) );
$desk  = '';
$mob   = '';
foreach ( $nav as $l => $u ) {
	if ( isset( $subs[ $l ] ) ) {
		$id    = 'sub-' . sanitize_title( $l );
		$desk .= '<li class="header__item" data-sub><button type="button" class="header__toggle" aria-expanded="false" aria-controls="' . $id . '">' . esc_html( $l ) . '</button><ul class="header__sub" id="' . $id . '">' . $list( $subs[ $l ] ) . '</ul></li>';
		$mob  .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a><ul class="menu__sub">' . $list( $subs[ $l ] ) . '</ul></li>';
	} else {
		$desk .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a></li>';
		$mob  .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a></li>';
	}
}
?>
<!-- wp:html -->
<a class="skip" href="#noi-dung">Bỏ qua tới nội dung</a>
<header class="header"><div class="wrap header__bar">
	<a class="header__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo $logo; ?>" width="191" height="44" alt="Velis Realty – trang chủ"></a>
	<nav class="header__nav" aria-label="Menu chính"><ul><?php echo $desk; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<a class="header__phone" href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>" aria-label="Gọi <?php echo esc_attr( VELIS_PHONE ); ?>"><?php echo VELIS_ICON_PHONE; // phpcs:ignore -- static SVG ?><span><?php echo esc_html( VELIS_PHONE ); ?></span></a>
	<a class="btn header__cta" href="#tu-van">Nhận tư vấn</a>
	<button class="header__menu" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu"><span></span><b class="sr-only">Mở menu</b></button>
</div></header>
<dialog class="menu" id="menu" aria-label="Menu">
	<div class="menu__top"><img src="<?php echo $logo; ?>" width="156" height="36" alt="Velis Realty"><button class="menu__close" type="button" data-menu-close aria-label="Đóng menu">×</button></div>
	<nav aria-label="Menu chính (di động)"><ul><?php echo $mob; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<div class="menu__actions"><a class="btn btn--line" href="tel:<?php echo esc_attr( VELIS_PHONE_TEL ); ?>">Gọi <?php echo esc_html( VELIS_PHONE ); ?></a><a class="btn" href="#tu-van" data-menu-close>Nhận tư vấn</a></div>
</dialog>
<!-- /wp:html -->
