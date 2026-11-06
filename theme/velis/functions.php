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
	add_editor_style( 'assets/velis.min.css' ); // the same CSS as the front end (built from css/, tools/build_css.py)
} );

add_action( 'wp_enqueue_scripts', function () {
	$ver = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'velis', get_theme_file_uri( 'assets/velis.min.css' ), array(), $ver ); // css/1-tokens … 5-utilities, built by tools/build_css.py
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

// Site verification + GA4, moved from the "Header and Footer Scripts" plugin (phase 4). Production host only:
// staging must not send hits or claim the domain.
const VELIS_GA4 = 'G-QSJ8EH9CWB';
add_action( 'wp_head', function () {
	if ( 'velisrealty.vn' !== wp_parse_url( home_url(), PHP_URL_HOST ) ) {
		return;
	}
	echo '<meta name="p:domain_verify" content="61c508b8fea6f53c5988fd9613d8bc5d">' . "\n"
		. '<meta name="facebook-domain-verification" content="n0tenm1utob7tp7q6fe7h7r03v505p">' . "\n"
		. '<script async src="https://www.googletagmanager.com/gtag/js?id=' . VELIS_GA4 . '"></script>' . "\n"
		. "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" . VELIS_GA4 . "');</script>\n";
}, 2 );

// YouTube embeds load nothing from YouTube until the reader clicks (BRIEF: video "bấm mới tải").
add_filter( 'render_block_core/embed', function ( $html, $block ) {
	$id = 'youtube' === ( $block['attrs']['providerNameSlug'] ?? '' ) ? velis_youtube_id( (string) ( $block['attrs']['url'] ?? '' ) ) : '';
	if ( '' === $id ) {
		return $html;
	}
	return velis_youtube_facade( $id, preg_match( '#<figcaption[^>]*>(.*?)</figcaption>#s', $html, $m ) ? wp_kses_post( $m[1] ) : '' );
}, 10, 2 );

// Button blocks in content take the theme button (.btn, outline style → .btn--line): no separate block-button style.
add_filter( 'render_block_core/button', function ( $html ) {
	$line = preg_match( '/is-style-(outline|secondary)/', $html );
	return preg_replace( '/class="wp-block-button__link/', 'class="btn' . ( $line ? ' btn--line' : '' ) . ' wp-block-button__link', $html, 1 );
} );

// Image captions that are only a file name / auto title are dropped (round 5).
add_filter( 'render_block_core/image', function ( $html ) {
	return preg_replace_callback( '#<figcaption[^>]*>(.*?)</figcaption>#s', fn( $m ) => velis_auto_caption( $m[1] ) ? '' : $m[0], $html );
} );

// STAGING only: emails are switched off there, so the last CF7 email (subject + body after field replacement) is kept in
// an option that admins can read at /wp-json/velis/v1/last-lead – used to check that the hidden fields reach the sales email.
if ( 'staging.velisrealty.vn' === wp_parse_url( home_url(), PHP_URL_HOST ) ) {
	add_filter( 'wpcf7_mail_components', function ( $c ) {
		update_option( 'velis_cf7_last_mail', array( 'time' => current_time( 'mysql' ), 'subject' => $c['subject'] ?? '', 'body' => $c['body'] ?? '' ), false );
		return $c;
	} );
	add_action( 'rest_api_init', fn() => register_rest_route( 'velis/v1', '/last-lead', array( 'methods' => 'GET', 'callback' => fn() => get_option( 'velis_cf7_last_mail', array() ), 'permission_callback' => fn() => current_user_can( 'manage_options' ) ) ) );
}

// Sharp pictures: extra widths for the srcset (WordPress never makes one wider than the original) and a 2560 px srcset
// limit. Frames follow the design and the viewport only (round 8); the crop zoom is part of every `sizes` (velis_sizes()).
add_action( 'after_setup_theme', function () {
	foreach ( array( 600, 900, 1600, 2000, 2560 ) as $w ) {
		add_image_size( 'velis-' . $w, $w, 0, false );
	}
} );
add_filter( 'max_srcset_image_width', fn() => 2560 );
add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' ); // "auto" = layout width, which leaves out the crop zoom
// Images in post/page text: a flagged photo (velis_mark) gets the same crop as every photo (badge printed bottom-left),
// inside a clipping box no wider than the widest file; a clean one is shown whole (X-03 = a). Sized to the reading column
// (X-01: frame × DPR, no margin).
add_filter( 'wp_content_img_tag', function ( $tag, $context, $id ) {
	if ( 'the_content' !== $context || ! preg_match( '/\ssrcset="([^"]+)"/', $tag, $m ) ) { // not the theme's own template images
		return $tag;
	}
	$max    = velis_max_candidate( $m[1], preg_match( '/\swidth="(\d+)"/', $tag, $w ) ? (int) $w[1] : 0 );
	$marked = '' !== velis_mark( (int) $id );
	$tag    = preg_replace( '/\ssizes="[^"]*"/', '', $tag );
	// the box ratio comes from the width / height attributes, not from whichever srcset file loaded (files of one photo differ
	// by a fraction of a pixel in ratio → the text below moved with the DPR, NT-01)
	$ratio  = preg_match( '/\sheight="(\d+)"/', $tag, $h ) && ! empty( $w[1] ) ? 'aspect-ratio: ' . (int) $w[1] . ' / ' . (int) $h[1] . '; ' : '';
	$style  = $ratio . ( $marked ? '--zoom: 1.12; ' : '' );
	$tag    = preg_match( '/\sstyle="/', $tag ) ? preg_replace( '/\sstyle="/', ' style="' . $style, $tag, 1 ) : preg_replace( '/^<img/', '<img style="' . trim( $style ) . '"', $tag ); // keep a style the editor set
	$tag    = preg_replace( '/^<img/', '<img sizes="' . esc_attr( velis_sizes( '(min-width: 768px) min(720px, ' . $max . 'px), min(100vw - 32px, ' . $max . 'px)', $marked ? 1.12 : 1 ) ) . '"', $tag );
	$tag    = $marked ? preg_replace( '/^<img([^>]*?)\sclass="/', '<img$1 class="is-marked ', $tag, 1, $n ) : $tag;
	$tag    = $marked && empty( $n ) ? preg_replace( '/^<img/', '<img class="is-marked"', $tag ) : $tag;
	return $marked ? '<span class="pic" style="max-width: ' . $max . 'px">' . $tag . '</span>' : $tag;
}, 10, 3 );

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

/**
 * <body> classes: WordPress adds page, search, home, blog, single, archive, author, category… – names the theme's components
 * use (.page = the 2-column grid, mockup naming without prefix). Only the admin bar marker is kept.
 */
add_filter( 'body_class', fn( $c ) => array_values( array_intersect( $c, array( 'admin-bar', 'logged-in' ) ) ), 99 );
