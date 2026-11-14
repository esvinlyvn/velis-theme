<?php
/**
 * Title: Header
 * Slug: velis/header
 * Inserter: no
 *
 * Mockup header: logo, menu, phone (icon + number, ≥ 1280), "Nhận tư vấn"; below 1024 px a full-screen <dialog> menu. Rendered
 * inline by every template (no template-part wrapper, so the header itself is sticky). Items come from the menu assigned to
 * "Menu chính" (Giao diện → Menu), else the built-in structure. The item that links to /du-an/ lists the projects by itself
 * (newest first, ≤ 6) + "Tất cả dự án"; an item with sub-items opens a drop-down (hover, click, keyboard – velis.js); in the
 * mobile menu the sub-items sit under it (decision 2026-11-06).
 */
$logo  = esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) );
$nav   = velis_menu_tree( 'chinh' ) ?: array(
	array( 'Dự án', '/du-an/', array() ), array( 'Chủ đầu tư', '/chu-dau-tu/', array() ), array( 'Blog', '/blog/', array() ),
	array( 'Về Velis', '/gioi-thieu/', array( array( 'Giới thiệu', '/gioi-thieu/' ), array( 'Tuyển dụng', '/tuyen-dung/' ) ) ), // Liên hệ is its own top-level item (2026-11-11)
	array( 'Liên hệ', '/lien-he/', array() ),
);
$list  = fn( $items ) => implode( '', array_map( fn( $x ) => '<li><a href="' . esc_url( $x[1] ) . '">' . esc_html( $x[0] ) . '</a></li>', $items ) );
$desk  = '';
$mob   = '';
foreach ( $nav as list( $l, $u, $sub ) ) {
	if ( '/du-an/' === trailingslashit( (string) wp_parse_url( $u, PHP_URL_PATH ) ) ) {
		$sub = array_merge( array_map( fn( $p ) => array( $p->post_title, get_permalink( $p ) ), array_slice( velis_top_projects(), 0, 6 ) ), array( array( 'Tất cả dự án', $u ) ) );
	}
	if ( $sub ) {
		$id    = 'sub-' . sanitize_title( $l );
		$desk .= '<li class="header__item" data-sub><button type="button" class="header__toggle" aria-expanded="false" aria-controls="' . $id . '">' . esc_html( $l ) . '</button><ul class="header__sub" id="' . $id . '">' . $list( $sub ) . '</ul></li>';
		$mob  .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a><ul class="menu__sub">' . $list( $sub ) . '</ul></li>';
	} else {
		$desk .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a></li>';
		$mob  .= '<li><a href="' . esc_url( $u ) . '">' . esc_html( $l ) . '</a></li>';
	}
}
$phone = (string) velis_s( 'phone' );
?>
<!-- wp:html -->
<a class="skip" href="#noi-dung">Bỏ qua tới nội dung</a>
<header class="header"><div class="wrap header__bar">
	<a class="header__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo $logo; ?>" width="191" height="44" alt="Velis Realty – trang chủ"></a>
	<nav class="header__nav" aria-label="Menu chính"><ul><?php echo $desk; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<?php if ( $phone ) : ?><a class="header__phone" href="tel:<?php echo esc_attr( velis_tel() ); ?>" aria-label="Gọi <?php echo esc_attr( $phone ); ?>"><?php echo VELIS_ICON_PHONE; // phpcs:ignore -- static SVG ?><span><?php echo esc_html( $phone ); ?></span></a><?php endif; ?>
	<a class="btn header__cta" href="#tu-van">Nhận tư vấn</a>
	<button class="header__menu" type="button" data-menu-open aria-haspopup="dialog" aria-controls="menu"><span></span><b class="sr-only">Mở menu</b></button>
</div></header>
<dialog class="menu" id="menu" aria-label="Menu">
	<div class="menu__top"><img src="<?php echo $logo; ?>" width="156" height="36" alt="Velis Realty"><button class="menu__close" type="button" data-menu-close aria-label="Đóng menu">×</button></div>
	<nav aria-label="Menu chính (di động)"><ul><?php echo $mob; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above ?></ul></nav>
	<div class="menu__actions"><?php echo velis_call_btn( 'line' ); // phpcs:ignore -- escaped in helper ?><a class="btn" href="#tu-van" data-menu-close>Nhận tư vấn</a></div>
</dialog>
<!-- /wp:html -->
