<?php
/**
 * Title: Header
 * Slug: velis/header
 * Inserter: no
 */
?>
<!-- wp:group {"tagName":"header","className":"v-header","layout":{"type":"constrained","contentSize":"1200px"}} -->
<header class="wp-block-group v-header">
<!-- wp:group {"className":"v-header__bar","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group v-header__bar">
<!-- wp:html -->
<a class="v-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) ); ?>" width="191" height="44" alt="Velis Realty – trang chủ"></a>
<!-- /wp:html -->
<!-- wp:navigation {"overlayMenu":"mobile","openSubmenusOnClick":true,"className":"v-nav","layout":{"type":"flex","justifyContent":"right"},"ariaLabel":"Menu chính"} -->
<!-- wp:navigation-link {"label":"Dự án","url":"/du-an/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Chủ đầu tư","url":"/chu-dau-tu/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Blog","url":"/blog/","kind":"custom"} /-->
<!-- wp:navigation-submenu {"label":"Về Velis","url":"/gioi-thieu/","kind":"custom"} -->
<!-- wp:navigation-link {"label":"Giới thiệu","url":"/gioi-thieu/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Tuyển dụng","url":"/tuyen-dung/","kind":"custom"} /-->
<!-- /wp:navigation-submenu -->
<!-- wp:navigation-link {"label":"Liên hệ","url":"/lien-he/","kind":"custom"} /-->
<!-- /wp:navigation -->
<!-- wp:html -->
<a class="v-header__phone" href="tel:0911237979"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg><span class="v-sr">Gọi hotline </span>0911 237 979</a>
<!-- /wp:html -->
<!-- wp:buttons {"className":"v-header__cta"} -->
<div class="wp-block-buttons v-header__cta"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#tu-van">Nhận tư vấn</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</header>
<!-- /wp:group -->
