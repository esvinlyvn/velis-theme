<?php
/**
 * The7 Velis child theme. Layout and content stay editable in WPBakery and The7 → Theme Options; this file only loads
 * velis.css (what the options cannot do) after The7's own CSS.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', function () {
	$f = get_stylesheet_directory() . '/velis.css';
	wp_enqueue_style( 'velis-child', get_stylesheet_directory_uri() . '/velis.css', array( 'dt-main' ), (string) filemtime( $f ) ); // file time: a re-upload is never served from a stale cache
}, 20 );

// Date archives are 301-redirected to /blog/ (Rank Math → Chuyển hướng); link The7's post dates straight there, not via the redirect.
foreach ( array( 'day_link', 'month_link', 'year_link' ) as $velis_hook ) {
	add_filter( $velis_hook, fn() => home_url( '/blog/' ) );
}

// The7's JS lazy load (Theme Options → Advanced) is off so the first image is in the HTML (LCP); give The7's other thumbnails
// native lazy loading instead. shortcut: the first 2 thumbnails per page stay eager, enough for one screen of blog list/grid.
add_filter( 'dt_get_thumb_img-output', function ( $html ) {
	static $velis_n = 0;
	return ++$velis_n > 2 && ! str_contains( $html, 'loading=' ) ? preg_replace( '/<img /', '<img loading="lazy" ', $html, 1 ) : $html;
} );

// Category archives (/blog/ and its clusters) render only The7 elements, but Ultimate Addons cannot see that outside a
// single post and loads all its assets there, incl. a render-blocking Google Maps API (~1.8 s on mobile Lighthouse).
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_category() ) {
		return;
	}
	array_map( 'wp_dequeue_script', array( 'ultimate-vc-addons-googleapis', 'jquery-ui-slider' ) );
	array_map( 'wp_dequeue_style', array( 'ultimate-vc-addons-icons', 'ultimate-vc-addons-selected-google-fonts-style', 'ultimate-vc-addons-style-min', 'ultimate-vc-addons-vidcons' ) );
}, 1000 );

// Mobile contact bar (DESIGN sticky-cta-mobile; replaces Buttonizer). Phone, Zalo and the consult link are edited in
// Giao diện → Tùy biến → "Thanh liên hệ (điện thoại)"; layout in velis.css (.velis-cta-bar; .velis-cta is the WPBakery contact row), shown < 1024 px
// and only after the first screen is scrolled past (DESIGN: never over the hero buttons) – velis_cta_script().
function velis_cta_defaults() {
	return array( 'velis_cta_phone' => '0911 237 979', 'velis_cta_zalo' => 'https://zalo.me/0911237979', 'velis_cta_url' => '/lien-he/' );
}

add_action( 'customize_register', function ( $wp_customize ) {
	$wp_customize->add_section( 'velis_cta', array( 'title' => 'Thanh liên hệ (điện thoại)', 'priority' => 160 ) );
	$labels = array( 'velis_cta_phone' => 'Số điện thoại (nút Gọi)', 'velis_cta_zalo' => 'Link Zalo', 'velis_cta_url' => 'Link nút "Nhận tư vấn"' );
	foreach ( velis_cta_defaults() as $id => $default ) {
		$wp_customize->add_setting( $id, array( 'default' => $default, 'sanitize_callback' => 'velis_cta_phone' === $id ? 'sanitize_text_field' : 'esc_url_raw' ) );
		$wp_customize->add_control( $id, array( 'label' => $labels[ $id ], 'section' => 'velis_cta', 'type' => 'velis_cta_phone' === $id ? 'tel' : 'url' ) );
	}
} );

// Give the first Contact Form 7 form on a page a stable id, so "Nhận tư vấn" can jump to it on the consult page itself.
add_filter( 'wpcf7_form_id_attr', function ( $id ) {
	if ( '' !== $id || did_action( 'velis_form_seen' ) ) {
		return $id;
	}
	do_action( 'velis_form_seen' );
	return 'velis-tu-van';
} );

function velis_cta_html() {
	$m = array();
	foreach ( velis_cta_defaults() as $id => $default ) {
		$m[ $id ] = get_theme_mod( $id, $default );
	}
	$tel   = preg_replace( '/[^0-9+]/', '', $m['velis_cta_phone'] );
	$here  = untrailingslashit( (string) wp_parse_url( $m['velis_cta_url'], PHP_URL_PATH ) ) === untrailingslashit( (string) wp_parse_url( add_query_arg( array() ), PHP_URL_PATH ) );
	$zalo  = esc_url( $m['velis_cta_zalo'] );
	$url   = $here && did_action( 'velis_form_seen' ) ? '#velis-tu-van' : $m['velis_cta_url'];
	$icon  = fn( $d ) => '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="' . $d . '"/></svg>';
	$phone = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z';
	$chat  = 'M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.7 6.2L5 21l4.1-2.3c.9.2 1.9.3 2.9.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z';
	return '<nav class="velis-cta-bar" aria-label="Liên hệ nhanh">'
		. ( $tel ? '<a class="velis-cta-bar__item" href="tel:' . esc_attr( $tel ) . '">' . $icon( $phone ) . '<span>Gọi</span></a>' : '' )
		. ( $zalo ? '<a class="velis-cta-bar__item" href="' . $zalo . '" target="_blank" rel="noopener">' . $icon( $chat ) . '<span>Zalo</span></a>' : '' )
		. '<a class="velis-cta-bar__main" href="' . esc_url( $url ) . '">Nhận tư vấn</a></nav>';
}

// Hidden state only when JS runs (class set in <head>, before paint); without JS the bar simply stays visible.
function velis_cta_script() {
	return '<script>(function(){var b=document.querySelector(".velis-cta-bar");if(!b)return;var f=function(){b.classList.toggle("is-on",scrollY>innerHeight*0.6)};'
		. 'addEventListener("scroll",f,{passive:true});f();})();</script>';
}

add_action( 'wp_head', function () {
	echo '<script>document.documentElement.classList.add("velis-cta-js")</script>';
}, 1 );

add_action( 'wp_footer', function () {
	echo velis_cta_html() . velis_cta_script(); // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaped parts above
}, 5 );

// Front-page hero background (WPBakery Design Options → CSS only, found late) is the LCP image: preload whatever image the
// editor set on the row whose classes include "velis-home-hero" – nothing hard-coded here.
function velis_hero_preload( $content ) {
	return preg_match( '/velis-home-hero[^"]*"[^\]]*?background-image:\s*url\(([^)\s]+)/', (string) $content, $m )
		? '<link rel="preload" as="image" fetchpriority="high" href="' . esc_url( $m[1] ) . '">' : '';
}

add_action( 'wp_head', function () {
	if ( is_front_page() ) {
		echo velis_hero_preload( get_post_field( 'post_content', get_queried_object_id() ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- esc_url above
	}
}, 2 );
