<?php
/**
 * Title: Header
 * Slug: velis/header
 * Inserter: no
 *
 * Desktop (≥1024px): links + "Dự án" mega menu + "Về Velis" submenu (<details>), hotline, CTA.
 * Below 1024px: full-screen <dialog> menu (logo + close, Dự án expandable by developer, hotline at the bottom).
 */
// shortcut: menu is hard-coded from the current site; move to a Navigation post / CPT query in the template phase.
$projects = array(
	'Vinhomes'        => array( 'Vinhomes Saigon Park' => '/vinhomes-saigon-park/' ),
	'Masterise Homes' => array( 'The Global City' => '/the-global-city/' ),
	'Đất Xanh'        => array( 'The Privé' => '/can-ho-the-prive/' ),
	'Gamuda Land'     => array( 'Spring Ville' => '/spring-ville/', 'Persa Place' => '/can-ho-persa-place/' ),
	'Keppel Land'     => array( 'Palm City / Palm River' => '/can-ho-palm-river/' ),
	'Dự án khác'      => array( 'Ansana by Kita' => '/ansana-by-kita/' ),
);
$about = array( 'Giới thiệu' => '/gioi-thieu/', 'Tuyển dụng' => '/tuyen-dung/' );
$logo  = esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) );
$phone = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
$link  = function ( $label, $url ) {
	return '<a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>';
};
?>
<!-- wp:group {"tagName":"header","className":"v-header","layout":{"type":"constrained","contentSize":"1200px"}} -->
<header class="wp-block-group v-header">
<!-- wp:html -->
<div class="v-header__bar">
	<a class="v-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo $logo; ?>" width="191" height="44" alt="Velis Realty – trang chủ"></a>
	<nav class="v-nav" aria-label="Menu chính">
		<ul>
			<li><details class="v-dd v-dd--mega" data-dd><summary>Dự án</summary>
				<div class="v-dd__panel v-mega__panel">
				<?php foreach ( $projects as $dev => $list ) : ?>
					<div><p class="v-eyebrow"><?php echo esc_html( $dev ); ?></p><ul><?php foreach ( $list as $label => $url ) : ?><li><?php echo $link( $label, $url ); ?></li><?php endforeach; ?></ul></div>
				<?php endforeach; ?>
					<p class="v-mega__all"><a class="v-btn v-btn--secondary" href="/du-an/">Xem tất cả dự án</a></p>
				</div></details></li>
			<li><?php echo $link( 'Chủ đầu tư', '/chu-dau-tu/' ); ?></li>
			<li><?php echo $link( 'Blog', '/blog/' ); ?></li>
			<li><details class="v-dd" data-dd><summary>Về Velis</summary><ul class="v-dd__panel"><?php foreach ( $about as $label => $url ) : ?><li><?php echo $link( $label, $url ); ?></li><?php endforeach; ?></ul></details></li>
			<li><?php echo $link( 'Liên hệ', '/lien-he/' ); ?></li>
		</ul>
	</nav>
	<a class="v-header__phone" href="tel:0911237979"><?php echo $phone; // phpcs:ignore -- static SVG ?><span class="v-sr">Gọi hotline </span>0911 237 979</a>
	<a class="v-btn v-header__cta" href="#tu-van">Nhận tư vấn</a>
	<button class="v-menu-open" type="button" data-menu-open aria-haspopup="dialog" aria-controls="v-menu"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg><span class="v-sr">Mở menu</span></button>
</div>
<dialog class="v-menu" id="v-menu" aria-label="Menu">
	<div class="v-menu__top">
		<a class="v-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo $logo; ?>" width="156" height="36" alt="Velis Realty – trang chủ"></a>
		<form method="dialog"><button class="v-menu-close" type="submit"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="v-sr">Đóng menu</span></button></form>
	</div>
	<nav class="v-menu__nav" aria-label="Menu chính">
		<details><summary>Dự án</summary>
		<?php foreach ( $projects as $dev => $list ) : ?>
			<p class="v-eyebrow"><?php echo esc_html( $dev ); ?></p><ul><?php foreach ( $list as $label => $url ) : ?><li><?php echo $link( $label, $url ); ?></li><?php endforeach; ?></ul>
		<?php endforeach; ?>
			<p><a href="/du-an/">Xem tất cả dự án</a></p>
		</details>
		<?php echo $link( 'Chủ đầu tư', '/chu-dau-tu/' ); ?>
		<?php echo $link( 'Blog', '/blog/' ); ?>
		<details><summary>Về Velis</summary><ul><?php foreach ( $about as $label => $url ) : ?><li><?php echo $link( $label, $url ); ?></li><?php endforeach; ?></ul></details>
		<?php echo $link( 'Liên hệ', '/lien-he/' ); ?>
	</nav>
	<div class="v-menu__bottom">
		<a class="v-menu__phone" href="tel:0911237979"><?php echo $phone; // phpcs:ignore ?>0911 237 979</a>
		<a class="v-btn" href="#tu-van" data-menu-close>Nhận tư vấn</a>
	</div>
</dialog>
<!-- /wp:html -->
</header>
<!-- /wp:group -->
