<?php
/**
 * Read models for templates: every number, name and link on a page comes from velis-data fields, taxonomies and
 * post relations here, so cards, tables, schema and titles always agree. Returns plain arrays; escaping happens on output.
 */

defined( 'ABSPATH' ) || exit;

const VELIS_PHONE      = '0911 237 979';
const VELIS_PHONE_TEL  = '0911237979';
const VELIS_ZALO       = 'https://zalo.me/0911237979';
const VELIS_EMAIL      = 'lienhe@velisrealty.vn';
const VELIS_ADDRESS    = '34 Lương Định Của, phường Bình Trưng, TP.HCM';
const VELIS_HOURS      = 'Thứ 2 – Chủ nhật, 08:00–21:00';

/** Post kinds (brief: 5 blog post variants). */
const VELIS_KINDS = array( 'phan-tich' => 'Phân tích sản phẩm', 'nhan-dinh' => 'Nhận định thị trường', 'so-sanh' => 'So sánh', 'huong-dan' => 'Hướng dẫn mua & pháp lý', 'tin' => 'Tin tiến độ & chính sách' );

function velis_has_data(): bool {
	return function_exists( 'velis_project_field' );
}

/** Field with inheritance when the plugin is active; '' otherwise. */
function velis_f( $post, string $key ) {
	return velis_has_data() ? velis_project_field( $post, $key ) : '';
}

function velis_level( $post ): string {
	return (string) get_post_meta( get_post( $post )->ID, 'velis_level', true ) ?: 'du-an';
}

/** Terms of a taxonomy for a project; khu-vuc falls back to the parent chain (phân khu / dòng thấp tầng inherit). */
function velis_terms( $post, string $tax ): array {
	$post  = get_post( $post );
	$terms = wp_get_post_terms( $post->ID, $tax );
	if ( ( ! $terms || is_wp_error( $terms ) ) && 'khu-vuc' === $tax && $post->post_parent ) {
		return velis_terms( $post->post_parent, $tax );
	}
	if ( is_wp_error( $terms ) ) {
		return array();
	}
	usort( $terms, fn( $a, $b ) => $a->parent <=> $b->parent ); // Vùng before Tiểu khu
	return $terms;
}

/** Most specific region name (Tiểu khu if any, else Vùng) – cards show one level (docs/KHU-VUC.md). */
function velis_region_label( $post ): string {
	$t = velis_terms( $post, 'khu-vuc' );
	return $t ? end( $t )->name : '';
}

/** Root project (đại đô thị / dự án độc lập) of any record. */
function velis_root( $post ): WP_Post {
	$post = get_post( $post );
	while ( $post->post_parent ) {
		$post = get_post( $post->post_parent );
	}
	return $post;
}

/** Published developers of a project (inherited). Draft developer records keep the name but get no link. */
function velis_developers( $post ): array {
	$ids = (array) velis_f( $post, 'velis_developers' );
	return array_values( array_filter( array_map( 'get_post', $ids ), fn( $d ) => $d && in_array( $d->post_status, array( 'publish', 'draft' ), true ) ) );
}

function velis_children( $post, string $level = '' ): array {
	$kids = get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'post_parent' => get_post( $post )->ID, 'numberposts' => 100, 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
	return $level ? array_values( array_filter( $kids, fn( $k ) => velis_level( $k ) === $level ) ) : $kids;
}

/** Blog cluster (category) of a project: its own field, else the category whose slug is the root project's slug. */
function velis_cluster( $post ): ?WP_Term {
	$id = (int) velis_f( $post, 'velis_blog_cluster' );
	$t  = $id ? get_term( $id, 'category' ) : get_term_by( 'slug', velis_root( $post )->post_name, 'category' );
	return $t instanceof WP_Term ? $t : null;
}

/** The project a cluster belongs to (inverse of velis_cluster). */
function velis_cluster_project( WP_Term $cat ): ?WP_Post {
	$p = get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'name' => $cat->slug, 'post_parent' => 0, 'numberposts' => 1 ) );
	return $p ? $p[0] : null;
}

/** Posts about a project: related field first (incl. its sub-records), then the rest of its cluster. */
function velis_project_posts( $post, int $n = 6 ): array {
	$post = get_post( $post );
	$ids  = array_merge( array( $post->ID ), get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'post_parent' => $post->ID, 'numberposts' => 100, 'fields' => 'ids' ) ) );
	$rel  = get_posts( array( 'numberposts' => $n, 'meta_query' => array( 'relation' => 'OR' ) + array_map( fn( $id ) => array( 'key' => 'velis_projects', 'value' => sprintf( 'i:%d;', $id ), 'compare' => 'LIKE' ), $ids ) ) );
	$cat  = velis_cluster( $post );
	if ( count( $rel ) < $n && $cat ) {
		$rel = array_merge( $rel, get_posts( array( 'numberposts' => $n - count( $rel ), 'category' => $cat->term_id, 'exclude' => wp_list_pluck( $rel, 'ID' ) ) ) );
	}
	return $rel;
}

/** Price line for a project/phân khu (text fields) or dòng thấp tầng (numbers). '' when not published. */
function velis_price( $post ): string {
	$post = get_post( $post );
	if ( 'thap-tang' === velis_level( $post ) ) {
		return velis_has_data() ? velis_price_text( get_post_meta( $post->ID, 'velis_price_min', true ), get_post_meta( $post->ID, 'velis_price_max', true ), (string) get_post_meta( $post->ID, 'velis_price_unit', true ), (string) get_post_meta( $post->ID, 'velis_price_month', true ) ) : '';
	}
	$from = (string) get_post_meta( $post->ID, 'velis_price_from', true );
	$to   = (string) get_post_meta( $post->ID, 'velis_price_to', true );
	$date = (string) get_post_meta( $post->ID, 'velis_price_date', true );
	if ( '' === $from ) {
		return '';
	}
	return trim( 'từ ' . $from . ( $to ? ' đến ' . $to : '' ) . ( $date ? ' (cập nhật ' . wp_date( 'd/m/Y', strtotime( $date ) ) . ')' : '' ) );
}

/** Apartment lines (rows); only rows of the record itself – they are not inherited. */
function velis_lines( $post ): array {
	return array_values( array_filter( (array) get_post_meta( get_post( $post )->ID, 'velis_lines', true ), 'is_array' ) );
}

/** "Căn hộ", "Shophouse"… names of a record's product types. */
function velis_type_names( $post ): array {
	return wp_list_pluck( velis_terms( $post, 'loai-san-pham' ), 'name', 'slug' );
}

function velis_status( $post ): string {
	$t = velis_terms( $post, 'trang-thai' );
	return $t ? $t[0]->name : '';
}

/** Short display name: "Khu 1 – Ivy Park" stays; dòng thấp tầng shows its line name ("Nhà phố"). */
function velis_short_name( $post ): string {
	$post = get_post( $post );
	if ( 'thap-tang' === velis_level( $post ) ) {
		$parent = get_post( $post->post_parent );
		$name   = trim( str_replace( array( $parent ? $parent->post_title : '', $parent ? preg_replace( '/^.*–\s*/u', '', $parent->post_title ) : '' ), '', $post->post_title ) );
		return $name ?: $post->post_title;
	}
	return $post->post_title;
}

/** Quick facts (label => value); empty values dropped by the caller. Price is always present (may be ''). */
function velis_facts( $post ): array {
	$post  = get_post( $post );
	$level = velis_level( $post );
	if ( 'thap-tang' === $level ) {
		$m = fn( $k, $u = '' ) => '' !== (string) get_post_meta( $post->ID, $k, true ) ? velis_num( get_post_meta( $post->ID, $k, true ) ) . $u : '';
		return array(
			'Diện tích đất' => $m( 'velis_land_area', ' m²' ), 'Diện tích sàn' => $m( 'velis_floor_area', ' m²' ), 'Số tầng' => $m( 'velis_floors' ),
			'Mặt tiền' => $m( 'velis_frontage', ' m' ), 'Chiều sâu' => $m( 'velis_depth', ' m' ), 'Hướng' => (string) get_post_meta( $post->ID, 'velis_facing', true ),
			'Sở hữu' => (string) get_post_meta( $post->ID, 'velis_ownership', true ), 'Vị trí' => (string) velis_f( $post, 'velis_address' ),
		);
	}
	$devs = velis_developers( $post );
	$f    = array(
		'Vị trí'   => (string) velis_f( $post, 'velis_address' ) ?: velis_region_label( $post ),
		'Chủ đầu tư' => implode( ', ', wp_list_pluck( $devs, 'post_title' ) ),
		'Quy mô'   => (string) get_post_meta( $post->ID, 'velis_scale', true ),
		'Sản phẩm' => implode( ', ', velis_type_names( $post ) ),
		'Diện tích' => (string) get_post_meta( $post->ID, 'velis_area', true ),
		'Bàn giao' => (string) get_post_meta( $post->ID, 'velis_handover', true ),
		'Pháp lý'  => (string) get_post_meta( $post->ID, 'velis_legal', true ),
	);
	if ( 'dai-do-thi' === $level ) {
		$n = count( velis_children( $post, 'phan-khu' ) );
		$f = array_slice( $f, 0, 3 ) + array( 'Số phân khu' => $n ? (string) $n : '' ) + $f;
	}
	return $f;
}

/** Reading time in minutes (Vietnamese ~200 words/min). */
function velis_reading_minutes( $post ): int {
	return max( 1, (int) round( str_word_count( wp_strip_all_tags( get_post_field( 'post_content', $post ) ), 0, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ' ) / 200 ) );
}

/** Post kind set by hand in velis-data; '' when not set (no guessing: a wrong label is worse than none). */
function velis_post_kind( $post ): string {
	$k = (string) get_post_meta( get_post( $post )->ID, 'velis_post_kind', true );
	return isset( VELIS_KINDS[ $k ] ) ? $k : '';
}

/** Label above a post title: its kind when set by hand, else the cluster (project) name. */
function velis_post_label( $post ): string {
	$k = velis_post_kind( $post );
	if ( '' !== $k ) {
		return VELIS_KINDS[ $k ];
	}
	$cat = velis_primary_category( $post );
	return $cat ? $cat->name : '';
}

/** Projects linked from a blog post (velis_projects), published only. */
function velis_post_projects( $post ): array {
	return array_values( array_filter( array_map( 'get_post', (array) get_post_meta( get_post( $post )->ID, 'velis_projects', true ) ), fn( $p ) => $p && 'publish' === $p->post_status ) );
}

/** Top-level projects (dự án độc lập + đại đô thị) for listings. */
function velis_top_projects(): array {
	static $cache = null; // called by many cards and sorts in one request
	return $cache ??= velis_has_data() ? get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'post_parent' => 0, 'numberposts' => 100, 'orderby' => 'title', 'order' => 'ASC' ) ) : array();
}

/** Projects of a developer (top level, published). */
function velis_developer_projects( $dev ): array {
	return array_values( array_filter( velis_top_projects(), fn( $p ) => in_array( get_post( $dev )->ID, wp_list_pluck( velis_developers( $p ), 'ID' ), true ) ) );
}

/** Image id of a record: featured image, else first gallery image. Not inherited: a phân khu never shows its đại đô thị's photo as its own. */
function velis_image_id( $post ): int {
	$post = get_post( $post );
	$id   = (int) get_post_thumbnail_id( $post );
	if ( ! $id ) {
		$g  = (array) get_post_meta( $post->ID, 'velis_gallery', true );
		$id = (int) reset( $g );
	}
	return $id;
}

/** Lower case without Vietnamese diacritics: "Căn hộ Palm River" → "can ho palm river". */
function velis_fold( string $s ): string {
	$s = remove_accents( mb_strtolower( $s ) );
	return trim( preg_replace( '/[^a-z0-9]+/', ' ', str_replace( 'đ', 'd', $s ) ) );
}

/** A blog cluster is a category named after a project or a developer (old categories wait for their redirect). */
function velis_is_cluster( $cat ): bool {
	static $slugs = null;
	$slugs ??= array_merge( wp_list_pluck( velis_top_projects(), 'post_name' ), wp_list_pluck( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 100, 'post_status' => 'any' ) ), 'post_name' ) );
	return $cat instanceof WP_Term && in_array( $cat->slug, $slugs, true );
}

/**
 * Project search: records whose name (full, after "Khu n –", or trade name) is contained in the query come first –
 * longest name first – then WordPress' own search results.
 */
function velis_search_projects( string $s ): array {
	if ( ! velis_has_data() ) {
		return array();
	}
	$q     = ' ' . velis_fold( $s ) . ' ';
	$score = array();
	foreach ( get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'numberposts' => 200 ) ) as $p ) {
		$names = array_filter( array( $p->post_title, preg_replace( '/^.*–\s*/u', '', $p->post_title ), (string) get_post_meta( $p->ID, 'velis_trade_name', true ) ) );
		foreach ( $names as $n ) {
			$f = velis_fold( $n );
			if ( mb_strlen( $f ) >= 4 && str_contains( $q, ' ' . $f . ' ' ) ) {
				$score[ $p->ID ] = max( $score[ $p->ID ] ?? 0, mb_strlen( $f ) + ( 'thap-tang' === velis_level( $p ) ? 0 : 100 ) );
			}
		}
	}
	arsort( $score );
	$found = array_map( 'get_post', array_keys( $score ) );
	foreach ( get_posts( array( 's' => $s, 'post_type' => VELIS_CPT_PROJECT, 'numberposts' => 12 ) ) as $p ) {
		if ( ! isset( $score[ $p->ID ] ) ) {
			$found[] = $p;
		}
	}
	return array_slice( $found, 0, 12 );
}
