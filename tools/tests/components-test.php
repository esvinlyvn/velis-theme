<?php
// php tools/tests/components-test.php — checks velis_table() hiding rules and velis_area().
define( 'ABSPATH', __DIR__ );
function wp_strip_all_tags( $s ) { return strip_tags( $s ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES ); }
require __DIR__ . '/../../theme/velis/inc/components.php';

$html = velis_table( array(
	'caption' => 'T',
	'cols'    => array( 'a' => array( 'Diện tích', 'num' ), 'b' => array( 'Giá từ', 'num' ), 'c' => array( 'Ghi chú', 'text' ) ),
	'rows'    => array(
		array( 'label' => 'Căn 1', 'a' => '49 m²', 'b' => '', 'c' => 'x' ),
		array( 'label' => 'Căn 2', 'a' => '', 'b' => ' ', 'c' => '' ),
	),
) );
$check = function ( $ok, $msg ) { if ( ! $ok ) { fwrite( STDERR, "FAIL: $msg\n" ); exit( 1 ); } };
$check( false === strpos( $html, '>Giá từ</th>' ), 'empty column hidden' );
$check( false === strpos( $html, '>Căn 2</th>' ), 'empty row hidden' );
$check( false !== strpos( $html, 'Chưa công bố: giá từ, căn 2.' ), 'note lists hidden column and row' );
$check( false !== strpos( $html, 'data-label="Diện tích"' ), 'cells carry labels for mobile cards' );
$all = velis_table( array( 'caption' => 'T', 'cols' => array( 'a' => array( 'A' ) ), 'rows' => array( array( 'label' => 'R', 'a' => '1' ) ) ) );
$check( false === strpos( $all, 'v-source' ), 'no note when nothing hidden' );
$check( '' === velis_area( '', '' ), 'empty area renders nothing' );
$check( false !== strpos( velis_area( '75,8 m²', '84,9 m²' ), '84,9 m² tim tường' ), 'secondary gross area' );
$check( false !== strpos( velis_area( '', '49 m²' ), 'tim tường' ), 'gross only is labelled' );
echo "components: all checks passed\n";
