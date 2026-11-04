<?php
/**
 * Velis – block theme bootstrap. Design tokens live in theme.json (generated from DESIGN.md).
 */

defined( 'ABSPATH' ) || exit;

require __DIR__ . '/inc/components.php';
require __DIR__ . '/inc/data.php';
require __DIR__ . '/inc/ui.php';
require __DIR__ . '/inc/seo.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	$ver = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'velis', get_stylesheet_uri(), array(), $ver );
	wp_enqueue_script( 'velis', get_theme_file_uri( 'assets/js/velis.js' ), array(), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
} );

// Preload the two above-the-fold fonts (DESIGN.md: preload 2 of 3 files).
add_action( 'wp_head', function () {
	foreach ( array( 'be-vietnam-pro-400', 'playfair-display-600' ) as $font ) {
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( get_theme_file_uri( "assets/fonts/$font.woff2" ) ) );
	}
	if ( ! has_site_icon() ) {
		printf( '<link rel="icon" href="%s" type="image/svg+xml">' . "\n", esc_url( get_theme_file_uri( 'assets/brand/favicon.svg' ) ) );
	}
}, 1 );

// Theme block styles: secondary (outline) and text buttons.
add_action( 'init', function () {
	register_block_style( 'core/button', array( 'name' => 'secondary', 'label' => 'Phụ (viền)' ) );
	register_block_style( 'core/button', array( 'name' => 'text', 'label' => 'Dạng chữ' ) );
} );

/**
 * Front end ships only the theme's own CSS/JS (brief: JS ≤ 60 KB, no jQuery, CSS ≤ 50 KB). Plugin assets for old
 * WPBakery / The7 content are dropped; that content is rebuilt as blocks in phase 4. Logged-in users keep the admin bar.
 */
add_action( 'wp_enqueue_scripts', function () {
	$keep_js  = array( 'velis', 'admin-bar' );
	$keep_css = array( 'velis', 'global-styles', 'wp-block-library', 'admin-bar', 'dashicons', 'core-block-supports' );
	foreach ( wp_scripts()->queue as $h ) {
		in_array( $h, $keep_js, true ) || wp_dequeue_script( $h );
	}
	foreach ( wp_styles()->queue as $h ) {
		in_array( $h, $keep_css, true ) || str_starts_with( $h, 'wp-block-' ) || wp_dequeue_style( $h );
	}
}, 999 );

/** Contact Form 7 form that receives the theme form (velis.js posts to its REST endpoint). 0 = not set up. */
function velis_cf7_form_id(): int {
	static $id = null;
	if ( null === $id ) {
		$f  = get_posts( array( 'post_type' => 'wpcf7_contact_form', 'title' => 'Velis – Nhận tư vấn', 'numberposts' => 1, 'fields' => 'ids' ) );
		$id = $f ? (int) $f[0] : 0;
	}
	return $id;
}
