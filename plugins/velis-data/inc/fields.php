<?php
/**
 * Field definitions (single source for meta registration, admin form, REST and inheritance).
 */

defined( 'ABSPATH' ) || exit;

/** Project fields: key => [label, type, inherit-from-parent, help]. Types: text, textarea, number, date, url, select, ids, posts. */
function velis_project_fields(): array {
	return array(
		'velis_level'        => array( 'Cấp', 'select', false, 'Đại đô thị chứa phân khu; phân khu chọn đại đô thị ở ô "Thuộc đại đô thị" bên phải.', array( 'du-an' => 'Dự án độc lập', 'dai-do-thi' => 'Đại đô thị', 'phan-khu' => 'Phân khu' ) ),
		'velis_own_page'     => array( 'Trang riêng', 'select', false, 'Phân khu chưa đủ điều kiện (brief: ≥ 3/4 nội dung riêng + ~800 từ) thì chọn "Chưa": đường dẫn tự chuyển về mục có neo trên trang đại đô thị.', array( 'co' => 'Có trang riêng', 'khong' => 'Chưa – là mục trên trang đại đô thị' ) ),
		'velis_trade_name'   => array( 'Tên thương mại', 'text', false, '' ),
		'velis_developers'   => array( 'Chủ đầu tư', 'posts', true, 'Chọn một hoặc nhiều (liên doanh). Phân khu để trống thì lấy theo đại đô thị.' ),
		'velis_address'      => array( 'Địa chỉ', 'text', true, 'Phường/xã mới, có thể kèm "(trước đây …)".' ),
		'velis_lat'          => array( 'Vĩ độ', 'number', true, 'Ví dụ 10.7909' ),
		'velis_lng'          => array( 'Kinh độ', 'number', true, 'Ví dụ 106.7442' ),
		'velis_scale'        => array( 'Quy mô', 'text', false, 'Ví dụ: 6,7 ha · 12 tháp · hơn 3.000 căn' ),
		'velis_area'         => array( 'Diện tích từ–đến', 'text', false, 'Ví dụ: 49–95 m² (thông thủy)' ),
		'velis_price_from'   => array( 'Giá tham khảo từ', 'text', false, 'Chỉ giá có nguồn. Để trống = "chưa công bố".' ),
		'velis_price_to'     => array( 'Giá tham khảo đến', 'text', false, '' ),
		'velis_price_date'   => array( 'Ngày cập nhật giá', 'date', false, '' ),
		'velis_price_source' => array( 'Nguồn giá', 'text', false, 'Ví dụ: thông báo của CĐT ngày …' ),
		'velis_handover'     => array( 'Bàn giao', 'text', false, 'Ví dụ: Quý 1/2028' ),
		'velis_legal'        => array( 'Pháp lý', 'textarea', false, '' ),
		'velis_connectivity' => array( 'Vị trí & kết nối', 'textarea', true, 'Viết một lần ở đại đô thị; phân khu để trống để thừa kế.' ),
		'velis_amenities'    => array( 'Tiện ích', 'textarea', true, 'Phân khu: tiện ích nội khu; tiện ích chung lấy từ đại đô thị.' ),
		'velis_planning'     => array( 'Quy hoạch', 'textarea', true, '' ),
		'velis_gallery'      => array( 'Thư viện ảnh', 'ids', false, '' ),
		'velis_floorplans'   => array( 'Mặt bằng', 'ids', false, '' ),
		'velis_video'        => array( 'Video / tour 360 (URL)', 'url', false, '' ),
		'velis_compare'      => array( 'Dự án so sánh', 'posts', false, '2–3 dự án cùng phân khúc.' ),
		'velis_blog_cluster' => array( 'Cụm blog', 'term', false, 'Chuyên mục chứa bài về dự án này.' ),
	);
}

/** Product line columns (repeatable rows). Empty cells are hidden on the site. */
function velis_line_fields(): array {
	return array(
		'name'       => array( 'Tên dòng', 'text' ),
		'type'       => array( 'Loại', 'type' ),
		'beds'       => array( 'Phòng ngủ', 'number' ),
		'net'        => array( 'DT thông thủy', 'text' ),
		'gross'      => array( 'DT tim tường', 'text' ),
		'price'      => array( 'Giá từ–đến', 'text' ),
		'price_date' => array( 'Ngày giá', 'date' ),
		'source'     => array( 'Nguồn giá', 'text' ),
		'qty'        => array( 'Số lượng', 'number' ),
		'facing'     => array( 'Hướng / vị trí tòa', 'text' ),
		'plan'       => array( 'Mặt bằng mẫu', 'id' ),
		'finish'     => array( 'Bàn giao', 'select', array( '' => '—', 'tho' => 'Thô', 'co-ban' => 'Hoàn thiện cơ bản', 'hoan-thien' => 'Hoàn thiện nội thất' ) ),
		'ownership'  => array( 'Sở hữu', 'text' ),
		'stock'      => array( 'Tình trạng hàng', 'select', array( '' => '—', 'con-hang' => 'Còn hàng', 'sap-mo' => 'Sắp mở', 'het-hang' => 'Hết hàng CĐT' ) ),
		'anchor'     => array( 'Neo (#)', 'text' ),
	);
}

function velis_developer_fields(): array {
	return array(
		'velis_short_name' => array( 'Tên viết tắt', 'text', false, '' ),
		'velis_logo'       => array( 'Logo (SVG/PNG)', 'id', false, '' ),
		'velis_founded'    => array( 'Năm thành lập', 'number', false, '' ),
		'velis_hq'         => array( 'Trụ sở', 'text', false, '' ),
		'velis_website'    => array( 'Website chính thức', 'url', false, '' ),
		'velis_parent_co'  => array( 'Công ty mẹ', 'text', false, '' ),
		'velis_wikipedia'  => array( 'Wikipedia', 'url', false, '' ),
		'velis_relation'   => array( 'Quan hệ với Velis', 'textarea', false, 'Chỉ ghi khi có giấy tờ.' ),
		'velis_sources'    => array( 'Nguồn dữ kiện', 'textarea', false, '' ),
	);
}

/** Sanitize one value by field type. */
function velis_clean( string $type, $v ) {
	switch ( $type ) {
		case 'textarea':
			return sanitize_textarea_field( (string) $v );
		case 'number':
			return is_numeric( $v ) ? (string) ( 0 + $v ) : '';
		case 'url':
			return esc_url_raw( (string) $v );
		case 'date':
			return preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $v ) ? (string) $v : '';
		case 'id': case 'term':
			return absint( $v ) ?: '';
		case 'ids': case 'posts':
			return array_values( array_filter( array_map( 'absint', is_array( $v ) ? $v : explode( ',', (string) $v ) ) ) );
		default:
			return sanitize_text_field( (string) $v );
	}
}

/** Keep only rows that have at least one value; sanitize each cell. */
function velis_clean_lines( $rows ): array {
	$out = array();
	foreach ( (array) $rows as $row ) {
		$clean = array();
		foreach ( velis_line_fields() as $k => $def ) {
			$clean[ $k ] = velis_clean( 'select' === $def[1] || 'type' === $def[1] ? 'text' : $def[1], $row[ $k ] ?? '' );
		}
		if ( '' === $clean['anchor'] && '' !== $clean['name'] ) {
			$clean['anchor'] = sanitize_title( $clean['name'] );
		}
		if ( array_filter( $clean, fn( $v ) => '' !== $v && array() !== $v ) ) {
			$out[] = $clean;
		}
	}
	return $out;
}

function velis_register_meta() {
	$reg = function ( $post_type, $fields ) {
		foreach ( $fields as $key => $def ) {
			$is_list = in_array( $def[1], array( 'ids', 'posts' ), true );
			register_post_meta( $post_type, $key, array(
				'type'              => $is_list ? 'array' : 'string',
				'single'            => true,
				'show_in_rest'      => $is_list ? array( 'schema' => array( 'type' => 'array', 'items' => array( 'type' => 'integer' ) ) ) : true,
				'sanitize_callback' => fn( $v ) => velis_clean( $def[1], $v ),
				'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
			) );
		}
	};
	$reg( VELIS_CPT_PROJECT, velis_project_fields() );
	$reg( VELIS_CPT_DEVELOPER, velis_developer_fields() );
	$line_props = array();
	foreach ( velis_line_fields() as $k => $def ) {
		$line_props[ $k ] = array( 'type' => 'string' );
	}
	register_post_meta( VELIS_CPT_PROJECT, 'velis_lines', array(
		'type'              => 'array',
		'single'            => true,
		'show_in_rest'      => array( 'schema' => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => $line_props ) ) ),
		'sanitize_callback' => 'velis_clean_lines',
		'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
	) );
	// Blog post → the project / subzone it is about (brief: bài về phân khu link về đúng phân khu).
	register_post_meta( 'post', 'velis_projects', array(
		'type'              => 'array',
		'single'            => true,
		'show_in_rest'      => array( 'schema' => array( 'type' => 'array', 'items' => array( 'type' => 'integer' ) ) ),
		'sanitize_callback' => fn( $v ) => velis_clean( 'posts', $v ),
		'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
	) );
}

/**
 * Read a project field; phân khu fall back to their đại đô thị for inheritable fields (developers, address,
 * coordinates, connectivity, common amenities, planning). Taxonomy "khu-vuc" is inherited the same way.
 */
function velis_project_field( $post, string $key ) {
	$post  = get_post( $post );
	$defs  = velis_project_fields();
	$value = get_post_meta( $post->ID, $key, true );
	$empty = '' === $value || array() === $value || null === $value || false === $value;
	if ( $empty && ! empty( $defs[ $key ][2] ) && $post->post_parent ) {
		return velis_project_field( $post->post_parent, $key );
	}
	return $value;
}
