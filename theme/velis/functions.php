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
	wp_enqueue_style( 'velis', get_theme_file_uri( 'assets/velis.min.css' ), array(), $ver ); // minified style.css (tools/build_css.py)
	wp_enqueue_script( 'velis', get_theme_file_uri( 'assets/js/velis.js' ), array(), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	if ( is_page( 'velis-style-guide' ) ) { // internal showcase only
		wp_enqueue_style( 'velis-style-guide', get_theme_file_uri( 'assets/style-guide.css' ), array( 'velis' ), $ver );
	}
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

// Sharp pictures (round 7): extra widths for the srcset (WordPress never makes one wider than the original), a 2560 px
// srcset limit, and --nw = the widest file on offer so CSS can keep the box no wider than the file allows (style.css).
add_action( 'after_setup_theme', function () {
	foreach ( array( 600, 900, 1600, 2000, 2560 ) as $w ) {
		add_image_size( 'velis-' . $w, $w, 0, false );
	}
} );
add_filter( 'max_srcset_image_width', fn() => 2560 );
add_filter( 'wp_get_attachment_image_attributes', function ( $attr, $att, $size ) {
	$src = wp_get_attachment_image_src( $att->ID, $size );
	$nw  = velis_max_candidate( (string) ( $attr['srcset'] ?? '' ), (int) ( $src[1] ?? 0 ) );
	if ( $nw ) {
		$attr['style'] = trim( rtrim( (string) ( $attr['style'] ?? '' ), '; ' ) . '; --nw: ' . $nw . 'px', '; ' );
	}
	return $attr;
}, 10, 3 );
add_filter( 'wp_content_img_tag', function ( $tag ) {
	$nw = velis_max_candidate( preg_match( '/\ssrcset="([^"]+)"/', $tag, $m ) ? $m[1] : '', preg_match( '/\swidth="(\d+)"/', $tag, $w ) ? (int) $w[1] : 0 );
	if ( ! $nw ) {
		return $tag;
	}
	return preg_match( '/\sstyle="/', $tag ) ? preg_replace( '/\sstyle="([^"]*)"/', ' style="$1; --nw: ' . $nw . 'px"', $tag, 1 ) : preg_replace( '/^<img/', '<img style="--nw: ' . $nw . 'px"', $tag );
} );

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
	$keep_css = array( 'velis', 'velis-style-guide', 'global-styles', 'wp-block-library', 'admin-bar', 'dashicons', 'core-block-supports' );
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
