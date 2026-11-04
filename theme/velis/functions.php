<?php
/**
 * Velis – block theme bootstrap. Design tokens live in theme.json (generated from DESIGN.md).
 */

defined( 'ABSPATH' ) || exit;

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
