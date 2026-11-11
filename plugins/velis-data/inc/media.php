<?php
/**
 * Per-image flags read by the theme (step 3, decisions X-03 and F-B):
 *  - velis_mark: what is printed on the photo. '' = clean (never cropped), 'cat' = VELIS badge that the W-A crop hides,
 *    'khong-che' = developer logo / printed text the crop cannot hide (theme shows the named fallback frame in hero, card
 *    and side column). Imported from data/kiem-ke-anh-mat.csv by tools/import_image_flags.py.
 *  - velis_focus: focal point, one of 9 positions (F-B), used as object-position of a clean photo in a cover frame.
 *  - velis_broken: the uploaded original does not decode (data/kiem-ke-anh-mat.csv "hong"); its own file never enters a
 *    srcset, the largest generated copy is used. Clear the box once a clean original is uploaded.
 * All are editable in Media → Edit and over REST (attachment meta).
 */

defined( 'ABSPATH' ) || exit;

function velis_marks(): array {
	return array( '' => 'Sạch (không cắt)', 'cat' => 'Có huy hiệu – cắt khung che được', 'khong-che' => 'Có logo / chữ – cắt không che được (dùng khung có tên)' );
}

/** 9 positions (F-B): slug => [label, CSS object-position]. '' = centre. */
function velis_focus_points(): array {
	$out = array();
	foreach ( array( 'tren' => array( 'trên', '0%' ), 'giua' => array( 'giữa', '50%' ), 'duoi' => array( 'dưới', '100%' ) ) as $v => list( $vl, $y ) ) {
		foreach ( array( 'trai' => array( 'Trái', '0%' ), 'giua' => array( 'Giữa', '50%' ), 'phai' => array( 'Phải', '100%' ) ) as $h => list( $hl, $x ) ) {
			$out[ "$h-$v" ] = array( "$hl $vl", "$x $y" );
		}
	}
	return $out;
}

/** CSS object-position of an attachment ('50% 50%' when not set). */
function velis_focus_css( int $id ): string {
	return velis_focus_points()[ (string) get_post_meta( $id, 'velis_focus', true ) ][1] ?? '50% 50%';
}

add_action( 'init', function () {
	$auth = fn() => current_user_can( 'upload_files' );
	register_post_meta( 'attachment', 'velis_mark', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'auth_callback' => $auth,
		'sanitize_callback' => fn( $v ) => isset( velis_marks()[ (string) $v ] ) ? (string) $v : '' ) );
	register_post_meta( 'attachment', 'velis_focus', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'auth_callback' => $auth,
		'sanitize_callback' => fn( $v ) => isset( velis_focus_points()[ (string) $v ] ) ? (string) $v : '' ) );
	register_post_meta( 'attachment', 'velis_broken', array( 'type' => 'boolean', 'single' => true, 'show_in_rest' => true, 'auth_callback' => $auth ) );
} );

add_filter( 'wp_calculate_image_srcset', function ( $sources, $size, $src, $meta, $id ) {
	if ( empty( $meta['file'] ) || ! get_post_meta( (int) $id, 'velis_broken', true ) ) {
		return $sources;
	}
	return array_filter( $sources, fn( $c ) => basename( $c['url'] ) !== basename( $meta['file'] ) );
}, 10, 5 );

// Media → Edit / the media modal: two drop-downs (no JS).
add_filter( 'attachment_fields_to_edit', function ( $fields, $post ) {
	if ( ! wp_attachment_is_image( $post ) ) {
		return $fields;
	}
	$select = function ( string $key, array $opts ) use ( $post ) {
		$cur  = (string) get_post_meta( $post->ID, $key, true );
		$html = '<select name="attachments[' . $post->ID . '][' . $key . ']">';
		foreach ( $opts as $v => $label ) {
			$html .= '<option value="' . esc_attr( $v ) . '"' . selected( $cur, (string) $v, false ) . '>' . esc_html( $label ) . '</option>';
		}
		return $html . '</select>';
	};
	$fields['velis_mark']  = array( 'label' => 'Dấu trên ảnh', 'input' => 'html', 'html' => $select( 'velis_mark', velis_marks() ) );
	$fields['velis_broken'] = array( 'label' => 'Bản gốc hỏng', 'input' => 'html', 'html' => '<label><input type="checkbox" name="attachments[' . $post->ID . '][velis_broken]" value="1"' . checked( (bool) get_post_meta( $post->ID, 'velis_broken', true ), true, false ) . '> không dùng tệp gốc</label>' );
	$fields['velis_focus'] = array( 'label' => 'Tiêu điểm', 'input' => 'html', 'html' => $select( 'velis_focus', array( '' => 'Giữa (mặc định)' ) + array_map( fn( $p ) => $p[0], velis_focus_points() ) ), 'helps' => 'Phần ảnh giữ lại khi khung cắt (ảnh sạch).' );
	return $fields;
}, 10, 2 );

add_filter( 'attachment_fields_to_save', function ( $post, $data ) {
	foreach ( array( 'velis_mark' => velis_marks(), 'velis_focus' => velis_focus_points() ) as $key => $allowed ) {
		if ( isset( $data[ $key ] ) && current_user_can( 'edit_post', $post['ID'] ) ) {
			$v = sanitize_key( $data[ $key ] );
			'' === $v || ! isset( $allowed[ $v ] ) ? delete_post_meta( $post['ID'], $key ) : update_post_meta( $post['ID'], $key, $v );
		}
	}
	if ( isset( $data['velis_mark'] ) && current_user_can( 'edit_post', $post['ID'] ) ) { // the form was shown: an unticked box sends nothing
		empty( $data['velis_broken'] ) ? delete_post_meta( $post['ID'], 'velis_broken' ) : update_post_meta( $post['ID'], 'velis_broken', true );
	}
	return $post;
}, 10, 2 );
