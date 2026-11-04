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
<a class="v-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/brand/velis-logo-horizontal.svg' ) ); ?>" width="174" height="40" alt="Velis Realty – trang chủ"></a>
<!-- /wp:html -->
<!-- wp:navigation {"overlayMenu":"mobile","className":"v-nav","layout":{"type":"flex","justifyContent":"right"},"ariaLabel":"Menu chính"} -->
<!-- wp:navigation-link {"label":"Dự án","url":"/du-an/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Chủ đầu tư","url":"/chu-dau-tu/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Blog","url":"/blog/","kind":"custom"} /-->
<!-- wp:navigation-submenu {"label":"Về Velis","url":"/gioi-thieu/","kind":"custom"} -->
<!-- wp:navigation-link {"label":"Giới thiệu","url":"/gioi-thieu/","kind":"custom"} /-->
<!-- wp:navigation-link {"label":"Tuyển dụng","url":"/tuyen-dung/","kind":"custom"} /-->
<!-- /wp:navigation-submenu -->
<!-- wp:navigation-link {"label":"Liên hệ","url":"/lien-he/","kind":"custom"} /-->
<!-- /wp:navigation -->
<!-- wp:buttons {"className":"v-header__cta"} -->
<div class="wp-block-buttons v-header__cta"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#tu-van">Nhận tư vấn</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</header>
<!-- /wp:group -->
