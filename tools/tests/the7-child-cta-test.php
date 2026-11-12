<?php
// php tools/tests/the7-child-cta-test.php — the7-child functions.php: mobile contact bar renders from Customizer values with stubs.
define( 'ABSPATH', __DIR__ );
$GLOBALS['hooks'] = array(); $GLOBALS['done'] = array(); $GLOBALS['mods'] = array(); $_SERVER['REQUEST_URI'] = '/can-ho-persa-place/';
function add_action( $h, $cb ) { $GLOBALS['hooks'][ $h ][] = $cb; }
function add_filter( $h, $cb ) { $GLOBALS['hooks'][ $h ][] = $cb; }
function do_action( $h ) { $GLOBALS['done'][ $h ] = true; }
function did_action( $h ) { return ! empty( $GLOBALS['done'][ $h ] ); }
function get_theme_mod( $k, $d ) { return $GLOBALS['mods'][ $k ] ?? $d; }
function esc_attr( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_url( $u ) { return preg_match( '#^(https?://|/|\#|tel:)#', $u ) ? htmlspecialchars( $u, ENT_QUOTES ) : ''; }
function untrailingslashit( $s ) { return rtrim( $s, '/' ); }
function wp_parse_url( $u, $c ) { return parse_url( $u, $c ); }
function add_query_arg( $a ) { return $_SERVER['REQUEST_URI']; }
function home_url( $p = '' ) { return 'https://x' . $p; }
require __DIR__ . '/../../the7-child/dt-the7-child/functions.php';
$h = velis_cta_html();
$ok = str_contains( $h, 'href="tel:0911237979"' ) && str_contains( $h, 'href="https://zalo.me/0911237979"' ) && str_contains( $h, 'href="/lien-he/">Nhận tư vấn' ) && str_contains( $h, 'aria-label="Liên hệ nhanh"' );
// On the consult page itself, once a CF7 form got the stable id, the button jumps to the form.
$_SERVER['REQUEST_URI'] = '/lien-he/';
$form_id = $GLOBALS['hooks']['wpcf7_form_id_attr'][0];
$ok = $ok && 'velis-tu-van' === $form_id( '' ) && '' === $form_id( '' ) && str_contains( velis_cta_html(), 'href="#velis-tu-van"' );
// Edited values win; an empty phone or Zalo hides that item; a javascript: link is not printed.
$GLOBALS['mods'] = array( 'velis_cta_phone' => '', 'velis_cta_zalo' => 'javascript:alert(1)' );
$h   = velis_cta_html();
$ok  = $ok && ! str_contains( $h, 'tel:' ) && ! str_contains( $h, 'javascript' ) && ! str_contains( $h, 'Zalo' );
echo $ok ? "the7-child cta: ok\n" : "the7-child cta: FAIL\n";
