<?php
/**
 * Field definitions (single source for meta registration, admin form, REST and inheritance) + small display helpers.
 */

defined( 'ABSPATH' ) || exit;

/** Levels. "thap-tang" = dòng thấp tầng: child record of a phân khu (or standalone project) with its own page. */
function velis_levels(): array {
	return array( 'du-an' => 'Dự án độc lập', 'dai-do-thi' => 'Đại đô thị', 'phan-khu' => 'Phân khu', 'thap-tang' => 'Dòng thấp tầng' );
}

const VELIS_PRICE_UNITS = array( '' => '—', 'ty-can' => 'tỷ/căn', 'trieu-m2' => 'triệu/m²' );
const VELIS_STOCK       = array( '' => '—', 'con-hang' => 'Còn hàng', 'sap-mo' => 'Sắp mở', 'het-hang' => 'Hết hàng CĐT' );

/** Project fields (dự án, đại đô thị, phân khu): key => [label, type, inherit-from-parent, help, options]. */
function velis_project_fields(): array {
	return array(
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
		'velis_source_url'   => array( 'Nguồn dữ liệu nhập', 'text', false, 'Trang trên site thật đã lấy dữ liệu (chỉ chép, chưa xác minh).' ),
	);
}

/** Dòng thấp tầng fields (own page). Location, developers… are inherited from the phân khu / đại đô thị. */
function velis_lowrise_fields(): array {
	return array(
		'velis_land_area'    => array( 'Diện tích đất (m²)', 'number', false, '' ),
		'velis_floor_area'   => array( 'Diện tích xây dựng / sàn (m²)', 'number', false, '' ),
		'velis_floors'       => array( 'Số tầng', 'number', false, '' ),
		'velis_frontage'     => array( 'Mặt tiền (m)', 'number', false, '' ),
		'velis_depth'        => array( 'Chiều sâu (m)', 'number', false, '' ),
		'velis_facing'       => array( 'Hướng', 'text', false, '' ),
		'velis_ownership'    => array( 'Hình thức sở hữu', 'text', false, 'Ví dụ: sở hữu lâu dài' ),
		'velis_price_min'    => array( 'Giá từ', 'number', false, 'Chỉ giá có nguồn. Để trống = "chưa công bố".' ),
		'velis_price_max'    => array( 'Giá đến', 'number', false, '' ),
		'velis_price_unit'   => array( 'Đơn vị giá', 'select', false, '', VELIS_PRICE_UNITS ),
		'velis_price_month'  => array( 'Tháng/năm giá', 'month', false, '' ),
		'velis_price_source' => array( 'Nguồn giá', 'text', false, '' ),
		'velis_stock'        => array( 'Tình trạng hàng', 'select', false, '', VELIS_STOCK ),
		'velis_gallery'      => array( 'Ảnh', 'ids', false, '' ),
		'velis_floorplans'   => array( 'Mặt bằng từng tầng', 'ids', false, 'Mỗi tầng một ảnh; ghi tên tầng ở "Chú thích" của ảnh.' ),
		'velis_source_url'   => array( 'Nguồn dữ liệu nhập', 'text', false, '' ),
	);
}

/** Apartment line columns (repeatable rows on a phân khu / standalone project; no own page). */
function velis_line_fields(): array {
	return array(
		'name'        => array( 'Tên dòng', 'text' ),
		'type'        => array( 'Loại', 'type' ),
		'beds'        => array( 'Phòng ngủ', 'number' ),
		'net_from'    => array( 'Thông thủy từ (m²)', 'number' ),
		'net_to'      => array( 'Thông thủy đến (m²)', 'number' ),
		'gross_from'  => array( 'Tim tường từ (m²)', 'number' ),
		'gross_to'    => array( 'Tim tường đến (m²)', 'number' ),
		'price_from'  => array( 'Giá từ', 'number' ),
		'price_to'    => array( 'Giá đến', 'number' ),
		'price_unit'  => array( 'Đơn vị giá', 'select', VELIS_PRICE_UNITS ),
		'price_month' => array( 'Tháng/năm giá', 'month' ),
		'source'      => array( 'Nguồn giá', 'text' ),
		'qty'         => array( 'Số lượng', 'number' ),
		'facing'      => array( 'Hướng / vị trí tòa', 'text' ),
		'plan'        => array( 'Mặt bằng mẫu', 'id' ),
		'finish'      => array( 'Bàn giao', 'select', array( '' => '—', 'tho' => 'Thô', 'co-ban' => 'Hoàn thiện cơ bản', 'hoan-thien' => 'Hoàn thiện nội thất' ) ),
		'ownership'   => array( 'Sở hữu', 'text' ),
		'stock'       => array( 'Tình trạng hàng', 'select', VELIS_STOCK ),
		'anchor'      => array( 'Neo (#)', 'text' ),
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
			$v = str_replace( ',', '.', trim( (string) $v ) ); // "75,8" typed the Vietnamese way
			return is_numeric( $v ) ? (string) ( 0 + $v ) : '';
		case 'url':
			return esc_url_raw( (string) $v );
		case 'date':
			return preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $v ) ? (string) $v : '';
		case 'month':
			return preg_match( '/^\d{4}-(0[1-9]|1[0-2])$/', (string) $v ) ? (string) $v : '';
		case 'id': case 'term':
			return absint( $v ) ?: '';
		case 'ids': case 'posts':
			return array_values( array_filter( array_map( 'absint', is_array( $v ) ? $v : explode( ',', (string) $v ) ) ) );
		default:
			return sanitize_text_field( (string) $v );
	}
}

/** Product type from a line / record name (loai-san-pham slug). Order matters: "shophouse khối đế căn hộ" is a shophouse. */
function velis_guess_type( string $name ): string {
	$n = mb_strtolower( $name );
	foreach ( array( 'shophouse' => 'shophouse', 'tmdv' => 'shophouse', 'dinh thự' => 'dinh-thu', 'biệt thự' => 'biet-thu', 'villa' => 'biet-thu', 'nhà phố' => 'nha-pho', 'liền kề' => 'nha-pho',
		'căn' => 'can-ho', 'studio' => 'can-ho', 'pn' => 'can-ho', 'penthouse' => 'can-ho', 'duplex' => 'can-ho' ) as $k => $slug ) {
		if ( str_contains( $n, $k ) ) {
			return $slug;
		}
	}
	return '';
}

/** Low-rise types get their own page; apartment types stay as tabs. */
function velis_is_lowrise_type( string $slug ): bool {
	return in_array( $slug, array( 'nha-pho', 'shophouse', 'biet-thu', 'dinh-thu' ), true );
}

/**
 * Anchor from a line name: no word repeated, none of the page's own name words, "2 PN" → "2pn".
 * "Căn 1 PN / 1 PN+" → "can-1pn-plus"; "Căn 2 PN" → "can-2pn"; "Shophouse khối đế" on Persa Place → "shophouse-khoi-de".
 */
function velis_line_anchor( string $name, string $page_slug = '' ): string {
	$slug  = preg_replace( '/(\d+)-pn\b/', '$1pn', sanitize_title( str_replace( '+', ' plus ', $name ) ) ); // "1 PN+" ≠ "1 PN"
	$skip  = array_filter( explode( '-', $page_slug ) );
	$words = array_diff( array_unique( array_filter( explode( '-', $slug ) ) ), $skip );
	return implode( '-', $words ) ?: $slug;
}

/** Keep only rows that have at least one value; sanitize each cell; fill type and a unique anchor. */
function velis_clean_lines( $rows, string $page_slug = '' ): array {
	$out  = array();
	$used = array();
	foreach ( (array) $rows as $row ) {
		$clean = array();
		foreach ( velis_line_fields() as $k => $def ) {
			$clean[ $k ] = velis_clean( in_array( $def[1], array( 'select', 'type' ), true ) ? 'text' : $def[1], $row[ $k ] ?? '' );
		}
		if ( ! array_filter( $clean, fn( $v ) => '' !== $v && array() !== $v ) ) {
			continue;
		}
		if ( '' === $clean['type'] ) {
			$clean['type'] = velis_guess_type( $clean['name'] );
		}
		$anchor = '' !== $clean['anchor'] ? sanitize_title( $clean['anchor'] ) : velis_line_anchor( $clean['name'], $page_slug );
		for ( $n = 2, $base = $anchor; '' !== $anchor && isset( $used[ $anchor ] ); $n++ ) {
			$anchor = $base . '-' . $n;
		}
		$used[ $anchor ]  = true;
		$clean['anchor'] = $anchor;
		$out[]           = $clean;
	}
	return $out;
}

/** Vietnamese number: 6.1 → "6,1"; 1250 → "1.250". */
function velis_num( $n ): string {
	if ( '' === $n || null === $n ) {
		return '';
	}
	$s = number_format( (float) $n, 2, ',', '.' );
	return str_contains( $s, ',' ) ? rtrim( rtrim( $s, '0' ), ',' ) : $s;
}

/** "2026-04" → "tháng 4/2026". */
function velis_month( string $ym ): string {
	return preg_match( '/^(\d{4})-(\d{2})$/', $ym, $m ) ? 'tháng ' . (int) $m[2] . '/' . $m[1] : '';
}

/** "71–85 m²", "từ 49 m²" or "". */
function velis_range( $from, $to, string $unit ): string {
	$f = velis_num( $from );
	$t = velis_num( $to );
	if ( '' !== $f && '' !== $t && $f !== $t ) {
		return "{$f}–{$t} {$unit}";
	}
	return '' !== $f ? ( '' === $t ? "từ $f $unit" : "$f $unit" ) : ( '' !== $t ? "đến $t $unit" : '' );
}

/** Price text with unit and month, e.g. "6,9–7,2 tỷ/căn (tháng 4/2026)"; "" when no price. */
function velis_price_text( $from, $to, string $unit, string $month = '' ): string {
	$r = velis_range( $from, $to, VELIS_PRICE_UNITS[ $unit ] ?? '' );
	return '' === $r ? '' : trim( $r ) . ( velis_month( $month ) ? ' (' . velis_month( $month ) . ')' : '' );
}

/** Collapsed-row summary in the admin: "Căn 2 PN · 71–85 m² · 9,3 tỷ/căn". */
function velis_line_summary( array $row ): string {
	$area = velis_range( $row['net_from'] ?? '', $row['net_to'] ?? '', 'm²' ) ?: velis_range( $row['gross_from'] ?? '', $row['gross_to'] ?? '', 'm²' );
	return implode( ' · ', array_filter( array( $row['name'] ?? '' ?: 'Dòng mới', $area, velis_price_text( $row['price_from'] ?? '', $row['price_to'] ?? '', $row['price_unit'] ?? '' ) ) ) );
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
	$reg( VELIS_CPT_PROJECT, array( 'velis_level' => array( 'Cấp', 'text' ) ) + velis_project_fields() + velis_lowrise_fields() );
	$reg( VELIS_CPT_DEVELOPER, velis_developer_fields() );
	$line_props = array();
	foreach ( velis_line_fields() as $k => $def ) {
		$line_props[ $k ] = array( 'type' => 'string' );
	}
	register_post_meta( VELIS_CPT_PROJECT, 'velis_lines', array(
		'type'              => 'array',
		'single'            => true,
		'show_in_rest'      => array( 'schema' => array( 'type' => 'array', 'items' => array( 'type' => 'object', 'properties' => $line_props ) ) ),
		'sanitize_callback' => fn( $v ) => velis_clean_lines( $v ),
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

/** Inheritable keys (from velis_project_fields, flag 2). Dòng thấp tầng inherits through its phân khu up to the đại đô thị. */
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

/**
 * Minimum data for a phân khu / dòng thấp tầng page (brief: ảnh, thông số cơ bản, vị trí). Returns what is missing;
 * a non-empty list means the page is noindex for now (listed in docs/AUDIT-NOI-DUNG.md). Other levels: always [].
 */
function velis_missing( $post ): array {
	$post  = get_post( $post );
	$level = get_post_meta( $post->ID, 'velis_level', true );
	if ( ! in_array( $level, array( 'phan-khu', 'thap-tang' ), true ) ) {
		return array();
	}
	$has     = fn( $k ) => ! in_array( get_post_meta( $post->ID, $k, true ), array( '', array(), null, false ), true );
	$missing = array();
	if ( ! has_post_thumbnail( $post ) && ! $has( 'velis_gallery' ) ) {
		$missing[] = 'ảnh';
	}
	$specs = 'thap-tang' === $level ? ( $has( 'velis_land_area' ) || $has( 'velis_floor_area' ) ) : ( $has( 'velis_area' ) || $has( 'velis_scale' ) || $has( 'velis_lines' ) );
	if ( ! $specs ) {
		$missing[] = 'thông số cơ bản';
	}
	if ( '' === (string) velis_project_field( $post, 'velis_address' ) && '' === (string) velis_project_field( $post, 'velis_lat' ) ) {
		$missing[] = 'vị trí';
	}
	return $missing;
}
