<?php
// php tools/tests/plugin-load-test.php — loads plugins/velis-data/velis-data.php with WordPress hook stubs to catch load-time fatals.
define( 'ABSPATH', __DIR__ );
foreach ( array( 'add_action', 'add_filter', 'register_activation_hook', 'register_deactivation_hook' ) as $f ) {
	eval( "function $f() {}" );
}
require __DIR__ . '/../../plugins/velis-data/velis-data.php';
echo defined( 'VELIS_CPT_PROJECT' ) && function_exists( 'velis_register' ) ? "plugin load: ok\n" : "plugin load: FAIL\n";
