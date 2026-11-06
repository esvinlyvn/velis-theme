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
