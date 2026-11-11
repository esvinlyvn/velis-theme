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
