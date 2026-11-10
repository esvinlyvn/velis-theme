<?php
/**
 * wp-admin forms: meta boxes (shown under the block editor as well). Plain fields + repeatable apartment lines + the
 * core media picker. No third-party field plugin.
 */

defined( 'ABSPATH' ) || exit;

// Block editor for projects, developers and posts. WPBakery's "Disable Gutenberg Editor" stays on for pages, which are
// still WPBakery layouts until phase 4.
add_filter( 'use_block_editor_for_post_type', fn( $use, $type ) => in_array( $type, array( VELIS_CPT_PROJECT, VELIS_CPT_DEVELOPER, 'post' ), true ) ? true : $use, 100, 2 );

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'velis-level', 'Cấp & trạng thái', 'velis_box_level', VELIS_CPT_PROJECT, 'side', 'high' );
	add_meta_box( 'velis-project', 'Thông tin dự án', 'velis_box_project', VELIS_CPT_PROJECT, 'normal', 'high' );
	add_meta_box( 'velis-lines', 'Dòng căn hộ', 'velis_box_lines', VELIS_CPT_PROJECT, 'normal', 'high' );
	add_meta_box( 'velis-lowrise', 'Thông số dòng thấp tầng', 'velis_box_lowrise', VELIS_CPT_PROJECT, 'normal', 'high' );
	add_meta_box( 'velis-developer', 'Thông tin chủ đầu tư', 'velis_box_developer', VELIS_CPT_DEVELOPER, 'normal', 'high' );
	add_meta_box( 'velis-post-projects', 'Dự án / phân khu liên quan', 'velis_box_post_projects', 'post', 'side' );
	// Raw "Custom Fields" box would expose serialized arrays; the forms above are the only editing UI.
	remove_meta_box( 'postcustom', VELIS_CPT_PROJECT, 'normal' );
	remove_meta_box( 'postcustom', VELIS_CPT_DEVELOPER, 'normal' );
	remove_meta_box( 'trang-thaidiv', VELIS_CPT_PROJECT, 'side' ); // single choice lives in "Cấp & trạng thái"
} );
// Header and Footer Scripts adds a per-post "Insert Script to <head>" box: not used for content, hidden (data kept).
add_action( 'add_meta_boxes', function () {
	foreach ( array( VELIS_CPT_PROJECT, VELIS_CPT_DEVELOPER, 'post' ) as $type ) {
		foreach ( array( 'normal', 'advanced', 'side' ) as $ctx ) {
			remove_meta_box( 'jamify_hfs_all_post_meta', $type, $ctx );
		}
	}
}, 99 );

// Block editor: the taxonomy panel for "Trạng thái" allows several terms; the radio in "Cấp & trạng thái" replaces it.
add_action( 'enqueue_block_editor_assets', function () {
	if ( VELIS_CPT_PROJECT === get_current_screen()->post_type ) {
		wp_add_inline_script( 'wp-edit-post', "wp.domReady(()=>{const d=wp.data.dispatch('core/editor');(d.removeEditorPanel?d:wp.data.dispatch('core/edit-post')).removeEditorPanel('taxonomy-panel-trang-thai');});" );
	}
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
		return;
	}
	wp_enqueue_media();
	$url = plugin_dir_url( __DIR__ );
	wp_enqueue_script( 'velis-admin', $url . 'assets/admin.js', array(), '0.2.0', true );
	wp_enqueue_style( 'velis-admin', $url . 'assets/admin.css', array(), '0.2.0' );
	// WPBakery / Ultimate Addons licence & update notices on edit screens: noise for editors (shown elsewhere in wp-admin).
	wp_add_inline_script( 'velis-admin', "document.querySelectorAll('.notice').forEach(n=>{if(/WPBakery/.test(n.textContent))n.remove();});" );
} );

/** One form row. $name is the input name, $def = [label, type, inherit, help, options]. */
function velis_field_html( string $name, array $def, $value, $post = null ): string {
	list( $label, $type ) = $def;
	$help    = $def[3] ?? '';
	$id      = 'f-' . sanitize_html_class( $name );
	$inherit = '';
	if ( ! empty( $def[2] ) && $post && $post->post_parent && ( '' === $value || array() === $value ) ) {
		$inherit = '<span class="velis-inherit">Đang thừa kế từ đại đô thị: ' . esc_html( get_the_title( $post->post_parent ) ) . '</span>';
	}
	switch ( $type ) {
		case 'textarea':
			$input = sprintf( '<textarea id="%s" name="%s" rows="3">%s</textarea>', $id, esc_attr( $name ), esc_textarea( $value ) );
			break;
		case 'select':
			$opts = '';
			foreach ( $def[4] as $k => $v ) {
				$opts .= sprintf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $value, $k, false ), esc_html( $v ) );
			}
			$input = sprintf( '<select id="%s" name="%s">%s</select>', $id, esc_attr( $name ), $opts );
			break;
		case 'posts':
			$type_for = 'velis_developers' === $name ? VELIS_CPT_DEVELOPER : VELIS_CPT_PROJECT;
			$items    = get_posts( array( 'post_type' => $type_for, 'numberposts' => 200, 'orderby' => 'title', 'order' => 'ASC', 'post_status' => array( 'publish', 'draft' ), 'exclude' => $post ? array( $post->ID ) : array() ) );
			$input    = '<div class="velis-checks" id="' . $id . '">';
			foreach ( $items as $it ) {
				$input .= sprintf( '<label><input type="checkbox" name="%s[]" value="%d"%s> %s</label>', esc_attr( $name ), $it->ID, checked( in_array( $it->ID, (array) $value, true ), true, false ), esc_html( $it->post_title ) );
			}
			$input .= $items ? '</div>' : '<em>Chưa có mục nào.</em></div>';
			break;
		case 'term':
			$input = wp_dropdown_categories( array( 'name' => $name, 'id' => $id, 'selected' => (int) $value, 'show_option_none' => '— Chọn cụm —', 'option_none_value' => '', 'hide_empty' => false, 'echo' => false ) );
			break;
		case 'id': case 'ids':
			$ids   = array_filter( (array) ( 'id' === $type ? array( $value ) : $value ) );
			$thumbs = implode( '', array_map( fn( $i ) => wp_get_attachment_image( $i, array( 64, 64 ) ), $ids ) );
			$input = sprintf( '<div class="velis-media" data-multiple="%d"><input type="hidden" id="%s" name="%s" value="%s"><div class="velis-media__thumbs">%s</div><button type="button" class="button velis-media__pick">%s</button> <button type="button" class="button-link velis-media__clear">Xóa</button></div>',
				'ids' === $type, $id, esc_attr( $name ), esc_attr( implode( ',', $ids ) ), $thumbs, 'ids' === $type ? 'Chọn ảnh' : 'Chọn ảnh/tệp' );
			break;
		default:
			$input = sprintf( '<input id="%s" name="%s" type="%s" value="%s"%s>', $id, esc_attr( $name ), in_array( $type, array( 'number', 'date', 'month', 'url' ), true ) ? $type : 'text', esc_attr( $value ), 'number' === $type ? ' step="any" min="0"' : '' );
	}
	return sprintf( '<div class="velis-row"><label for="%s">%s</label><div>%s%s%s</div></div>', $id, esc_html( $label ), $input, $help ? '<p class="description">' . esc_html( $help ) . '</p>' : '', $inherit );
}

function velis_box_level( $post ) {
	wp_nonce_field( 'velis_save', 'velis_nonce' );
	$level = get_post_meta( $post->ID, 'velis_level', true ) ?: 'du-an';
	echo '<p><label for="f-velis_level"><strong>Cấp</strong></label><select id="f-velis_level" name="velis_level" class="widefat" data-level>';
	foreach ( velis_levels() as $k => $v ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $level, $k, false ), esc_html( $v ) );
	}
	echo '</select></p><p class="description">Phân khu chọn đại đô thị, dòng thấp tầng chọn phân khu (hoặc dự án độc lập) ở ô "Cha" / "Thuộc".</p>';
	$current = wp_get_object_terms( $post->ID, 'trang-thai', array( 'fields' => 'ids' ) );
	echo '<fieldset><legend><strong>Trạng thái bán</strong></legend>';
	printf( '<label class="velis-radio"><input type="radio" name="velis_status" value=""%s> —</label>', checked( ! $current, true, false ) );
	foreach ( get_terms( array( 'taxonomy' => 'trang-thai', 'hide_empty' => false ) ) as $t ) {
		printf( '<label class="velis-radio"><input type="radio" name="velis_status" value="%d"%s> %s</label>', $t->term_id, checked( in_array( $t->term_id, $current, true ), true, false ), esc_html( $t->name ) );
	}
	echo '</fieldset>';
	if ( $missing = velis_missing( $post ) ) {
		echo '<p class="velis-noindex">Đang noindex tạm thời – thiếu: ' . esc_html( implode( ', ', $missing ) ) . '.</p>';
	}
}

function velis_box_fields( $post, array $fields ) {
	echo '<div class="velis-form">';
	foreach ( $fields as $key => $def ) {
		echo velis_field_html( $key, $def, get_post_meta( $post->ID, $key, true ), $post ); // phpcs:ignore -- escaped inside
	}
	echo '</div>';
}
function velis_box_project( $post ) {
	velis_box_fields( $post, velis_project_fields() );
}
function velis_box_lowrise( $post ) {
	echo '<p class="description">Trang riêng của dòng thấp tầng: /du-an/{đại đô thị}/{phân khu}/{dòng}/. Vị trí, chủ đầu tư, tiện ích lấy từ phân khu / đại đô thị. Loại sản phẩm tự gán theo tên nếu để trống.</p>';
	velis_box_fields( $post, velis_lowrise_fields() );
}

function velis_box_lines( $post ) {
	$rows  = array_filter( (array) get_post_meta( $post->ID, 'velis_lines', true ), 'is_array' ); // no meta yet → '' → no rows
	$cols  = velis_line_fields();
	$types = get_terms( array( 'taxonomy' => 'loai-san-pham', 'hide_empty' => false ) );
	$cell  = function ( $i, $k, $def, $v ) use ( $types ) {
		$n = sprintf( 'velis_lines[%s][%s]', $i, $k );
		if ( 'type' === $def[1] ) {
			$o = '<option value="">—</option>';
			foreach ( $types as $t ) {
				$o .= sprintf( '<option value="%s"%s>%s</option>', esc_attr( $t->slug ), selected( $v, $t->slug, false ), esc_html( $t->name ) );
			}
			return '<select name="' . esc_attr( $n ) . '">' . $o . '</select>';
		}
		if ( 'select' === $def[1] ) {
			$o = '';
			foreach ( $def[2] as $ok => $ov ) {
				$o .= sprintf( '<option value="%s"%s>%s</option>', esc_attr( $ok ), selected( $v, $ok, false ), esc_html( $ov ) );
			}
			return '<select name="' . esc_attr( $n ) . '">' . $o . '</select>';
		}
		if ( 'id' === $def[1] ) {
			return sprintf( '<div class="velis-media" data-multiple="0"><input type="hidden" name="%s" value="%s"><div class="velis-media__thumbs">%s</div><button type="button" class="button velis-media__pick">Chọn</button></div>', esc_attr( $n ), esc_attr( $v ), $v ? wp_get_attachment_image( (int) $v, array( 48, 48 ) ) : '' );
		}
		return sprintf( '<input name="%s" type="%s" value="%s"%s>', esc_attr( $n ), in_array( $def[1], array( 'number', 'month' ), true ) ? $def[1] : 'text', esc_attr( $v ), 'number' === $def[1] ? ' step="any" min="0" inputmode="decimal"' : '' );
	};
	echo '<p class="description">Mỗi dòng là một loại căn hộ (Studio, 2 PN, Duplex, Penthouse…) – hiện thành tab trên trang. Nhà phố, shophouse, biệt thự, dinh thự là <strong>dòng thấp tầng</strong>: tạo bản ghi con có cấp "Dòng thấp tầng". Diện tích và giá nhập số (m², tỷ hoặc triệu); ô trống không hiện trên trang. Giá chỉ nhập khi có nguồn. Loại và neo tự sinh theo tên nếu để trống.</p>';
	echo '<div class="velis-lines" data-lines><div class="velis-lines__list">';
	foreach ( array_values( $rows ) as $i => $row ) {
		echo velis_line_card( $i, $cols, $row, $cell ); // phpcs:ignore -- escaped inside
	}
	echo '</div><template data-line-template>' . velis_line_card( '__i__', $cols, array(), $cell ) . '</template>'; // phpcs:ignore
	echo '<button type="button" class="button button-primary" data-line-add>+ Thêm dòng sản phẩm</button></div>';
}

function velis_line_card( $i, $cols, $row, $cell ): string {
	$html = '<details class="velis-line"' . ( $row ? '' : ' open' ) . '><summary><span class="velis-line__title">' . esc_html( velis_line_summary( $row ) ) . '</span><span class="velis-line__tools"><button type="button" class="button-link" data-line-up>↑</button><button type="button" class="button-link" data-line-down>↓</button><button type="button" class="button-link velis-danger" data-line-remove>Xóa dòng</button></span></summary><div class="velis-line__grid">';
	foreach ( $cols as $k => $def ) {
		$html .= '<label><span>' . esc_html( $def[0] ) . '</span>' . $cell( $i, $k, $def, $row[ $k ] ?? '' ) . '</label>';
	}
	return $html . '</div></details>';
}

function velis_box_developer( $post ) {
	wp_nonce_field( 'velis_save', 'velis_nonce' );
	echo '<div class="velis-form">';
	foreach ( velis_developer_fields() as $key => $def ) {
		echo velis_field_html( $key, $def, get_post_meta( $post->ID, $key, true ) ); // phpcs:ignore
	}
	echo '</div>';
}

function velis_box_post_projects( $post ) {
	wp_nonce_field( 'velis_save', 'velis_nonce' );
	echo velis_field_html( 'velis_projects', array( 'Bài viết nói về', 'posts', false, 'Bài về một phân khu: chọn đúng phân khu.' ), get_post_meta( $post->ID, 'velis_projects', true ), $post ); // phpcs:ignore
	if ( defined( 'VELIS_KINDS' ) ) { // labels belong to the theme (5 post template variants)
		echo velis_field_html( 'velis_post_kind', array( 'Loại bài', 'select', false, 'Để trống: không hiện nhãn loại, hiện tên cụm dự án.', array( '' => '— Chưa gán —' ) + VELIS_KINDS ), get_post_meta( $post->ID, 'velis_post_kind', true ) ); // phpcs:ignore
	}
	echo velis_field_html( 'velis_image_kind', array( 'Ảnh đại diện là', 'select', false, 'Trang chủ chỉ chọn bài có ảnh dự án.', velis_image_kinds() ), get_post_meta( $post->ID, 'velis_image_kind', true ) ); // phpcs:ignore
}

add_action( 'save_post', function ( $post_id, $post ) {
	if ( ! isset( $_POST['velis_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['velis_nonce'] ), 'velis_save' ) || wp_is_post_autosave( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$level  = sanitize_key( $_POST['velis_level'] ?? '' );
	$fields = array(
		VELIS_CPT_PROJECT   => 'thap-tang' === $level ? velis_lowrise_fields() : velis_project_fields(),
		VELIS_CPT_DEVELOPER => velis_developer_fields(),
		'post'              => array( 'velis_projects' => array( '', 'posts' ), 'velis_post_kind' => array( '', 'text' ), 'velis_image_kind' => array( '', 'text' ) ),
	)[ $post->post_type ] ?? array();
	foreach ( $fields as $key => $def ) {
		$raw = wp_unslash( $_POST[ $key ] ?? ( in_array( $def[1], array( 'posts', 'ids' ), true ) ? array() : '' ) ); // phpcs:ignore -- sanitized by velis_clean
		update_post_meta( $post_id, $key, velis_clean( $def[1], $raw ) );
	}
	if ( VELIS_CPT_PROJECT === $post->post_type ) {
		update_post_meta( $post_id, 'velis_level', isset( velis_levels()[ $level ] ) ? $level : 'du-an' );
		if ( 'thap-tang' !== $level ) {
			update_post_meta( $post_id, 'velis_lines', velis_clean_lines( wp_unslash( $_POST['velis_lines'] ?? array() ), $post->post_name ) ); // phpcs:ignore
		} elseif ( ! wp_get_object_terms( $post_id, 'loai-san-pham', array( 'fields' => 'ids' ) ) && ( $type = velis_guess_type( $post->post_title ) ) ) {
			wp_set_object_terms( $post_id, $type, 'loai-san-pham' );
		}
		wp_set_object_terms( $post_id, absint( $_POST['velis_status'] ?? 0 ) ? array( absint( $_POST['velis_status'] ) ) : array(), 'trang-thai' );
	}
}, 10, 2 );

// List screen: level and index state at a glance.
add_filter( 'manage_' . VELIS_CPT_PROJECT . '_posts_columns', fn( $c ) => array_slice( $c, 0, 2 ) + array( 'velis_level' => 'Cấp', 'velis_index' => 'Index' ) + $c );
add_action( 'manage_' . VELIS_CPT_PROJECT . '_posts_custom_column', function ( $col, $id ) {
	if ( 'velis_level' === $col ) {
		echo esc_html( velis_levels()[ get_post_meta( $id, 'velis_level', true ) ] ?? '—' );
	}
	if ( 'velis_index' === $col ) {
		$missing = velis_missing( $id );
		echo $missing ? '<span class="velis-noindex">noindex – thiếu ' . esc_html( implode( ', ', $missing ) ) . '</span>' : 'index';
	}
}, 10, 2 );
