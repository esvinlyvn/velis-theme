<?php
// php tools/tests/plugin-load-test.php — loads plugins/velis-data/velis-data.php with WordPress hook stubs to catch load-time fatals.
define( 'ABSPATH', __DIR__ );
foreach ( array( 'add_action', 'add_filter', 'register_activation_hook', 'register_deactivation_hook' ) as $f ) {
	eval( "function $f() {}" );
}
require __DIR__ . '/../../plugins/velis-data/velis-data.php';
echo defined( 'VELIS_CPT_PROJECT' ) && function_exists( 'velis_register' ) ? "plugin load: ok\n" : "plugin load: FAIL\n";
// F-B: 9 focal points, each a CSS object-position; corners map to 0 % / 100 %
$fp = velis_focus_points();
echo 9 === count( $fp ) && '0% 0%' === $fp['trai-tren'][1] && '100% 100%' === $fp['phai-duoi'][1] && '50% 50%' === $fp['giua-giua'][1] && isset( velis_marks()['khong-che'] ) ? "focus/mark: ok\n" : "focus/mark: FAIL\n";
// Cài đặt Velis (vòng hoàn thiện 1.1): defaults = what staging showed, saved value wins, every field sanitized by type.
function absint( $v ) { return abs( (int) $v ); }
function esc_url_raw( $u, $p = null ) { return preg_match( '#^(https?://|/|\#|mailto:|tel:)#', $u ) ? $u : ''; }
function sanitize_email( $s ) { return filter_var( $s, FILTER_VALIDATE_EMAIL ) ?: ''; }
function wp_kses_post( $s ) { return strip_tags( $s, '<a><b><strong><em>' ); }
function sanitize_text_field( $s ) { return trim( strip_tags( $s ) ); }
$GLOBALS['opt'] = array();
function get_option( $k, $d = false ) { return $GLOBALS['opt'][ $k ] ?? $d; }
$ok = '0911 237 979' === velis_setting( 'phone' ) && 0 === velis_setting( 'home_img' ) && '' === velis_setting( 'social_facebook' ) && str_contains( velis_setting( 'role_sentence' ), '{chủ đầu tư}' );
$GLOBALS['opt']['velis_settings'] = array( 'phone' => '0909 000 111', 'social_facebook' => '' );
$ok = $ok && '' === velis_setting( 'social_facebook' ) && 'Vũ Xuân' === velis_setting( 'ceo_name' );
$clean = velis_settings_sanitize( array( 'home_img' => '12abc', 'home_btn1_url' => '#tu-van', 'zalo' => 'javascript:alert(1)', 'email' => 'x@', 'home_title' => '<b>Tiêu đề</b>', 'about_p1' => '<script>x</script><b>Đậm</b>' ) );
$ok = $ok && 12 === $clean['home_img'] && '#tu-van' === $clean['home_btn1_url'] && '' === $clean['zalo'] && '' === $clean['email'] && 'Tiêu đề' === $clean['home_title'] && 'x<b>Đậm</b>' === $clean['about_p1'] && count( $clean ) === count( velis_settings_fields() );
echo $ok ? "settings: ok\n" : "settings: FAIL\n";
