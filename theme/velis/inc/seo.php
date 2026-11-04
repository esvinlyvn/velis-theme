<?php
/**
 * On-page rules of BRIEF.md "On-page chi tiết theo template", applied through Rank Math filters so there is one
 * source of title/meta/robots/schema: breadcrumb trail, default title & meta formulas (a hand-written Rank Math title
 * always wins), robots for paged/search, 1200×630 share images, and schema entities built from velis-data fields.
 */

defined( 'ABSPATH' ) || exit;

/** Breadcrumb trail of the current request: list of [name, url]. Phân khu = 4 levels, dòng thấp tầng = 5. */
function velis_trail(): array {
	$t = array( array( 'Trang chủ', home_url( '/' ) ) );
	$o = get_queried_object();
	if ( is_front_page() ) {
		return $t;
	}
	if ( is_singular( 'du-an' ) || is_post_type_archive( 'du-an' ) ) {
		$t[] = array( 'Dự án', get_post_type_archive_link( 'du-an' ) );
		if ( is_singular() ) {
			foreach ( array_reverse( get_post_ancestors( $o ) ) as $a ) {
				$t[] = array( get_the_title( $a ), get_permalink( $a ) );
			}
			$t[] = array( get_the_title( $o ), get_permalink( $o ) );
		}
	} elseif ( is_singular( 'chu-dau-tu' ) || is_post_type_archive( 'chu-dau-tu' ) ) {
		$t[] = array( 'Chủ đầu tư', get_post_type_archive_link( 'chu-dau-tu' ) );
		if ( is_singular() ) {
			$t[] = array( get_the_title( $o ), get_permalink( $o ) );
		}
	} elseif ( is_category() || is_singular( 'post' ) ) {
		$t[]  = array( 'Blog', home_url( '/blog/' ) );
		$cat  = is_category() ? $o : ( function_exists( 'velis_primary_category' ) ? velis_primary_category( $o ) : null );
		if ( $cat ) {
			$t[] = array( $cat->name, get_category_link( $cat ) );
		}
		if ( is_singular() ) {
			$t[] = array( get_the_title( $o ), get_permalink( $o ) );
		}
	} elseif ( is_author() ) {
		$t[] = array( $o->display_name, get_author_posts_url( $o->ID ) );
	} elseif ( is_search() ) {
		$t[] = array( 'Tìm kiếm', get_search_link() );
	} elseif ( is_page() ) {
		foreach ( array_reverse( get_post_ancestors( $o ) ) as $a ) {
			$t[] = array( get_the_title( $a ), get_permalink( $a ) );
		}
		$t[] = array( get_the_title( $o ), get_permalink( $o ) );
	}
	return $t;
}

/** Primary category: Rank Math primary term if set, else the first category. */
function velis_primary_category( $post ): ?WP_Term {
	$id  = (int) get_post_meta( get_post( $post )->ID, 'rank_math_primary_category', true );
	$cat = $id ? get_term( $id, 'category' ) : null;
	if ( ! $cat instanceof WP_Term ) {
		$cats = get_the_category( get_post( $post )->ID );
		$cat  = $cats ? $cats[0] : null;
	}
	return $cat;
}

/** Fit a title into 60 characters by dropping trailing " – …" / ", …" parts. */
function velis_fit( string $title, int $max = 60 ): string {
	while ( mb_strlen( $title ) > $max && preg_match( '/^(.*)(, | – |: )[^,–:]*$/u', $title, $m ) ) {
		$title = $m[1];
	}
	return $title;
}

function velis_clip( string $text, int $max = 155 ): string {
	$text = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( $text ) ) );
	return mb_strlen( $text ) <= $max ? $text : rtrim( mb_substr( $text, 0, mb_strrpos( mb_substr( $text, 0, $max - 1 ), ' ' ) ), ' ,.;:–' ) . '…';
}

/** Default title by template (BRIEF.md table). '' = keep Rank Math's. */
function velis_default_title(): string {
	$o = get_queried_object();
	$p = max( 1, (int) get_query_var( 'paged' ) );
	if ( is_front_page() ) {
		return 'Velis Realty – tư vấn bất động sản cao cấp';
	}
	if ( is_singular( 'du-an' ) ) {
		$name = $o->post_title;
		switch ( velis_level( $o ) ) {
			case 'dai-do-thi':
				return velis_fit( "$name: các phân khu, vị trí, giá tham khảo" );
			case 'phan-khu':
				return velis_fit( preg_replace( '/^Khu \d+ – /u', '', $name ) . ' – ' . get_the_title( $o->post_parent ) . ': giá, mặt bằng, pháp lý' );
			case 'thap-tang':
				return velis_fit( "$name: giá, mặt bằng, thông số" );
			default:
				return velis_fit( trim( $name . ' ' . velis_region_label( $o ) ) . ': giá, mặt bằng, pháp lý' );
		}
	}
	if ( is_singular( 'chu-dau-tu' ) ) {
		return velis_fit( $o->post_title . ': dự án và đánh giá – Velis Realty' );
	}
	if ( is_post_type_archive( 'du-an' ) ) {
		return 'Dự án bất động sản cao cấp TP.HCM – Velis Realty';
	}
	if ( is_post_type_archive( 'chu-dau-tu' ) ) {
		return 'Chủ đầu tư bất động sản Velis tư vấn – Velis Realty';
	}
	if ( is_category() ) {
		return $p > 1 ? velis_fit( $o->name . ": phân tích và kinh nghiệm – trang $p" ) : velis_fit( $o->name . ': phân tích và kinh nghiệm – Velis Realty' );
	}
	if ( is_author() ) {
		return $o->display_name . ( $p > 1 ? " – bài viết, trang $p" : ' – chuyên gia bất động sản Velis Realty' );
	}
	if ( is_search() ) {
		return 'Tìm kiếm: ' . get_search_query() . ' – Velis Realty';
	}
	if ( is_page( 'blog' ) ) {
		return 'Blog bất động sản: phân tích dự án – Velis Realty';
	}
	return '';
}

function velis_default_description(): string {
	$o = get_queried_object();
	if ( is_front_page() ) {
		$names = wp_list_pluck( velis_top_projects(), 'post_title' );
		return velis_clip( 'Velis Realty tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận: ' . implode( ', ', $names ) . '. Phân tích theo dòng tiền và giá vốn thực.' );
	}
	if ( is_singular( 'du-an' ) ) {
		$devs  = implode( ', ', wp_list_pluck( velis_developers( $o ), 'post_title' ) );
		$types = mb_strtolower( implode( ', ', velis_type_names( $o ) ) );
		$hand  = (string) get_post_meta( $o->ID, 'velis_handover', true );
		$date  = (string) get_post_meta( $o->ID, 'velis_price_date', true );
		$parts = array_filter( array(
			$o->post_title . ( $devs ? " của $devs" : '' ) . ( $types ? ": $types" : '' ),
			$hand ? 'bàn giao ' . mb_strtolower( $hand ) : '',
			'' !== velis_price( $o ) ? 'giá tham khảo cập nhật ' . ( $date ? wp_date( 'm/Y', strtotime( $date ) ) : '' ) : 'giá tham khảo khi chủ đầu tư công bố',
		) );
		return velis_clip( implode( ', ', $parts ) . '.' );
	}
	if ( is_singular( 'chu-dau-tu' ) ) {
		$projs   = velis_developer_projects( $o );
		$regions = implode( ', ', array_unique( array_filter( array_map( 'velis_region_label', $projs ) ) ) );
		return velis_clip( 'Các dự án ' . $o->post_title . ' Velis đang tư vấn' . ( $regions ? " tại $regions" : '' ) . ( $projs ? ': ' . implode( ', ', wp_list_pluck( $projs, 'post_title' ) ) : '' ) . '. Góc nhìn của CEO Vũ Xuân.' );
	}
	if ( is_post_type_archive( 'du-an' ) ) {
		return velis_clip( 'Dự án Velis đang tư vấn: ' . implode( ', ', wp_list_pluck( velis_top_projects(), 'post_title' ) ) . '. Lọc theo khu vực, chủ đầu tư, loại sản phẩm.' );
	}
	if ( is_post_type_archive( 'chu-dau-tu' ) ) {
		return velis_clip( 'Chủ đầu tư có dự án Velis đang tư vấn: ' . implode( ', ', wp_list_pluck( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 20, 'orderby' => 'title', 'order' => 'ASC' ) ), 'post_title' ) ) . '.' );
	}
	if ( is_category() ) {
		return velis_clip( $o->description ?: 'Phân tích ' . $o->name . ' của CEO Vũ Xuân: giá, pháp lý, tiến độ, kinh nghiệm mua và đầu tư.' );
	}
	if ( is_page( 'blog' ) ) {
		return 'Phân tích dự án, nhận định thị trường và hướng dẫn mua bất động sản cao cấp của CEO Vũ Xuân, Velis Realty.';
	}
	return '';
}

// Hand-written in Rank Math = a value without template variables ("%sitename% %sep% …" is a default, not hand-written).
$velis_manual = function ( string $key ): bool {
	$v = is_singular() ? (string) get_post_meta( get_queried_object_id(), $key, true ) : '';
	return '' !== $v && ! str_contains( $v, '%' );
};
add_filter( 'rank_math/frontend/title', function ( $title ) use ( $velis_manual ) {
	return $velis_manual( 'rank_math_title' ) ? $title : ( velis_default_title() ?: $title );
}, 20 );
add_filter( 'rank_math/frontend/description', function ( $desc ) use ( $velis_manual ) {
	return $velis_manual( 'rank_math_description' ) ? $desc : ( velis_default_description() ?: $desc );
}, 20 );

// Robots: page 2+ of any listing and internal search are noindex, follow (brief "Index từng loại trang").
add_filter( 'rank_math/frontend/robots', function ( $r ) {
	if ( is_paged() || is_search() ) {
		$r['index']  = 'noindex';
		$r['follow'] = 'follow';
	}
	return $r;
}, 20 );

/* ---------- Share image 1200×630 ---------- */

add_action( 'after_setup_theme', fn() => add_image_size( 'velis-og', 1200, 630, true ) );
add_filter( 'rank_math/opengraph/image_sizes', fn( $s ) => array_merge( array( 'velis-og' ), (array) $s ) );
// Existing uploads predate the size: create it once, the first time a page shares the image.
add_filter( 'rank_math/opengraph/attachment_id', function ( $id ) {
	$meta = wp_get_attachment_metadata( $id );
	if ( ! $meta || isset( $meta['sizes']['velis-og'] ) || empty( $meta['width'] ) || empty( $meta['height'] ) ) {
		return $id;
	}
	// Largest centred 40:21 area, scaled to exactly 1200×630 (a 1200×628 source is stretched by 0.3 %).
	$w = min( $meta['width'], (int) floor( $meta['height'] * 40 / 21 ) );
	$h = (int) round( $w * 21 / 40 );
	$file   = get_attached_file( $id );
	$editor = $file ? wp_get_image_editor( $file ) : null;
	if ( $editor && ! is_wp_error( $editor ) && ! is_wp_error( $editor->crop( (int) ( ( $meta['width'] - $w ) / 2 ), (int) ( ( $meta['height'] - $h ) / 2 ), $w, $h, 1200, 630 ) ) ) {
		$saved = $editor->save( $editor->generate_filename( '1200x630' ) );
		if ( ! is_wp_error( $saved ) ) {
			$meta['sizes']['velis-og'] = array( 'file' => $saved['file'], 'width' => 1200, 'height' => 630, 'mime-type' => $saved['mime-type'] );
			wp_update_attachment_metadata( $id, $meta );
		}
	}
	return $id;
} );

/* ---------- Schema ---------- */

add_filter( 'rank_math/schema/add_global_entities', fn( $add ) => is_singular( array( 'du-an', 'chu-dau-tu' ) ) || is_post_type_archive( array( 'du-an', 'chu-dau-tu' ) ) ? true : $add );

function velis_place_id( $p ): string {
	return get_permalink( $p ) . '#place';
}

function velis_qv( $value, string $unit = 'MTK' ): array {
	return array( '@type' => 'QuantitativeValue', 'value' => (float) $value, 'unitCode' => $unit );
}

/** Schema node of a project record from its fields. */
function velis_project_schema( $p ): array {
	$p     = get_post( $p );
	$level = velis_level( $p );
	$types = array_keys( velis_type_names( $p ) );
	$high  = in_array( 'can-ho', $types, true );
	$type  = array( 'dai-do-thi' => 'Place', 'thap-tang' => 'SingleFamilyResidence' )[ $level ] ?? ( $high ? 'ApartmentComplex' : 'Residence' );
	$node  = array( '@type' => $type, '@id' => velis_place_id( $p ), 'name' => $p->post_title, 'url' => get_permalink( $p ) );
	if ( $d = trim( get_the_excerpt( $p ) ) ) {
		$node['description'] = $d;
	}
	if ( $addr = (string) velis_f( $p, 'velis_address' ) ) {
		$node['address'] = array( '@type' => 'PostalAddress', 'streetAddress' => $addr, 'addressCountry' => 'VN' );
	}
	$lat = velis_f( $p, 'velis_lat' );
	$lng = velis_f( $p, 'velis_lng' );
	if ( '' !== (string) $lat && '' !== (string) $lng ) {
		$node['geo'] = array( '@type' => 'GeoCoordinates', 'latitude' => (float) $lat, 'longitude' => (float) $lng );
	}
	$imgs = array_filter( array_merge( array( (int) get_post_thumbnail_id( $p ) ), array_map( 'intval', (array) get_post_meta( $p->ID, 'velis_gallery', true ) ) ) );
	foreach ( array_unique( $imgs ) as $i ) {
		$node['image'][] = array( '@type' => 'ImageObject', 'url' => wp_get_attachment_image_url( $i, 'full' ), 'caption' => (string) ( get_post_meta( $i, '_wp_attachment_image_alt', true ) ?: $p->post_title ) );
	}
	if ( $p->post_parent ) {
		$node['containedInPlace'] = array( '@id' => velis_place_id( $p->post_parent ) );
	}
	if ( 'dai-do-thi' === $level && ( $kids = velis_children( $p, 'phan-khu' ) ) ) {
		$node['containsPlace'] = array_map( fn( $k ) => array( '@id' => velis_place_id( $k ) ), $kids );
	}
	if ( 'thap-tang' === $level ) {
		$area = get_post_meta( $p->ID, 'velis_floor_area', true ) ?: get_post_meta( $p->ID, 'velis_land_area', true );
		if ( '' !== (string) $area ) {
			$node['floorSize'] = velis_qv( $area );
		}
	}
	return $node;
}

/** Apartment lines → Accommodation (Apartment) nodes; offers only with a published price and month. */
function velis_lines_schema( $p ): array {
	$out = array();
	foreach ( velis_lines( $p ) as $l ) {
		$n    = array( '@type' => 'Apartment', '@id' => get_permalink( $p ) . '#' . $l['anchor'], 'name' => $l['name'] . ' – ' . get_the_title( $p ), 'containedInPlace' => array( '@id' => velis_place_id( $p ) ) );
		$area = $l['net_from'] ?: $l['gross_from'];
		if ( '' !== (string) $area ) {
			$n['floorSize'] = velis_qv( $area );
		}
		if ( '' !== (string) $l['beds'] ) {
			$n['numberOfRooms'] = (int) $l['beds'];
		}
		if ( '' !== (string) $l['price_from'] && 'ty-can' === $l['price_unit'] && $l['price_month'] ) {
			$n['offers'] = array( '@type' => 'Offer', 'priceCurrency' => 'VND', 'price' => (int) round( $l['price_from'] * 1e9 ), 'validFrom' => $l['price_month'] . '-01' );
		}
		$out[ 'velisLine' . $l['anchor'] ] = $n;
	}
	return $out;
}

add_filter( 'rank_math/json_ld', function ( $data ) {
	if ( is_front_page() || is_404() ) {
		return $data;
	}
	$org   = array( '@id' => $data['publisher']['@id'] ?? home_url( '/#organization' ) );
	$trail = velis_trail();
	if ( count( $trail ) > 1 ) {
		unset( $data['BreadcrumbList'] );
		$data['velisBreadcrumb'] = array(
			'@type' => 'BreadcrumbList', '@id' => end( $trail )[1] . '#breadcrumb',
			'itemListElement' => array_map( fn( $c, $i ) => array( '@type' => 'ListItem', 'position' => $i + 1, 'name' => $c[0], 'item' => $c[1] ), $trail, array_keys( $trail ) ),
		);
	}
	$o = get_queried_object();
	if ( is_singular( 'du-an' ) && velis_has_data() ) {
		$data['velisPlace'] = velis_project_schema( $o );
		$data              += velis_lines_schema( $o );
		if ( 'dai-do-thi' === velis_level( $o ) && ( $kids = velis_children( $o, 'phan-khu' ) ) ) {
			$data['velisZones'] = array( '@type' => 'ItemList', 'name' => 'Phân khu ' . $o->post_title, 'itemListElement' => array_map( fn( $k, $i ) => array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => get_permalink( $k ), 'name' => $k->post_title ), $kids, array_keys( $kids ) ) );
		}
	} elseif ( is_singular( 'chu-dau-tu' ) ) {
		$about = array( '@type' => 'Organization', '@id' => get_permalink( $o ) . '#organization', 'name' => $o->post_title );
		foreach ( array( 'velis_website' => 'url', 'velis_founded' => 'foundingDate' ) as $k => $prop ) {
			if ( $v = get_post_meta( $o->ID, $k, true ) ) {
				$about[ $prop ] = (string) $v;
			}
		}
		$same = array_values( array_filter( array( get_post_meta( $o->ID, 'velis_website', true ), get_post_meta( $o->ID, 'velis_wikipedia', true ) ) ) );
		if ( $same ) {
			$about['sameAs'] = $same;
		}
		$projs = velis_developer_projects( $o );
		$data['velisCollection'] = array(
			'@type' => 'CollectionPage', '@id' => get_permalink( $o ) . '#collection', 'url' => get_permalink( $o ), 'name' => $o->post_title, 'about' => $about,
			'mainEntity' => array( '@type' => 'ItemList', 'itemListElement' => array_map( fn( $p, $i ) => array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => get_permalink( $p ), 'name' => $p->post_title ), $projs, array_keys( $projs ) ) ),
		);
	} elseif ( is_post_type_archive( array( 'du-an', 'chu-dau-tu' ) ) ) {
		$items = is_post_type_archive( 'du-an' ) ? velis_top_projects() : get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) );
		$data['velisCollection'] = array( '@type' => 'CollectionPage', '@id' => end( $trail )[1] . '#collection', 'url' => end( $trail )[1], 'name' => end( $trail )[0], 'mainEntity' => array( '@type' => 'ItemList', 'itemListElement' => array_map( fn( $p, $i ) => array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => get_permalink( $p ), 'name' => $p->post_title ), $items, array_keys( $items ) ) ) );
	} elseif ( is_singular( 'post' ) ) {
		$projs = velis_post_projects( $o );
		foreach ( $data as $k => $node ) {
			if ( is_array( $node ) && in_array( $node['@type'] ?? '', array( 'BlogPosting', 'Article', 'NewsArticle' ), true ) && $projs ) {
				$data[ $k ]['about'] = array_map( fn( $p ) => array( '@id' => velis_place_id( $p ) ), $projs );
				$data[ $k ]['mentions'] = array_map( fn( $d ) => array( '@type' => 'Organization', 'name' => $d->post_title, 'url' => get_permalink( $d ) ), array_filter( velis_developers( $projs[0] ), fn( $d ) => 'publish' === $d->post_status ) );
				if ( ! $data[ $k ]['mentions'] ) {
					unset( $data[ $k ]['mentions'] );
				}
			}
		}
	} elseif ( is_page( 'tuyen-dung' ) && ! in_array( 'JobPosting', array_map( fn( $n ) => is_array( $n ) ? ( $n['@type'] ?? '' ) : '', $data ), true ) ) {
		$data['velisJob'] = array(
			'@type' => 'JobPosting', 'title' => wp_strip_all_tags( get_the_title( $o ) ), 'description' => wpautop( wp_strip_all_tags( strip_shortcodes( $o->post_content ) ) ),
			'datePosted' => get_the_date( 'Y-m-d', $o ), 'hiringOrganization' => $org + array( '@type' => 'Organization', 'name' => 'Velis Realty', 'sameAs' => home_url( '/' ) ),
			'jobLocation' => array( '@type' => 'Place', 'address' => array( '@type' => 'PostalAddress', 'streetAddress' => '34 Lương Định Của, phường Bình Trưng', 'addressLocality' => 'TP. Hồ Chí Minh', 'addressCountry' => 'VN' ) ),
		);
	}
	return $data;
}, 20 );
