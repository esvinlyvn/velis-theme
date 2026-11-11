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
