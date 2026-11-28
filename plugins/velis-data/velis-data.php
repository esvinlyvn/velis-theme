<?php
/**
 * Plugin Name: Velis Data
 * Description: Mô hình dữ liệu Velis: Chủ đầu tư, Dự án (đại đô thị → phân khu → dòng thấp tầng, dự án độc lập), dòng căn hộ, loại sản phẩm, khu vực 2 cấp, trạng thái. Form nhập liệu trong wp-admin.
 * Version: 0.4.1
 * Author: Velis Realty
 * Requires PHP: 8.0
 *
 * Kept in a plugin (not the theme) so the data survives a theme change. Only WordPress core APIs; no third-party plugin.
 */

defined( 'ABSPATH' ) || exit;

const VELIS_CPT_PROJECT   = 'du-an';
const VELIS_CPT_DEVELOPER = 'chu-dau-tu';

require __DIR__ . '/inc/fields.php'; // after the constants: inc/admin.php uses them at load time
require __DIR__ . '/inc/admin.php';
require __DIR__ . '/inc/media.php'; // per-image flags: printed mark (X-03) + focal point (F-B) + broken original
require __DIR__ . '/inc/settings.php'; // "Cài đặt Velis": texts, numbers, contacts, pictures the theme shows

add_action( 'init', 'velis_register' );

function velis_register() {
	register_post_type( VELIS_CPT_DEVELOPER, array(
		'labels'       => array( 'name' => 'Chủ đầu tư', 'singular_name' => 'Chủ đầu tư', 'add_new_item' => 'Thêm chủ đầu tư', 'edit_item' => 'Sửa chủ đầu tư', 'all_items' => 'Tất cả chủ đầu tư' ),
		'public'       => true,
		'has_archive'  => 'chu-dau-tu',
		'rewrite'      => array( 'slug' => 'chu-dau-tu', 'with_front' => false ),
		'menu_icon'    => 'dashicons-building',
		'menu_position'=> 21,
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ), // custom-fields: required for meta in REST
		'show_in_rest' => true,
	) );
	register_post_type( VELIS_CPT_PROJECT, array(
		'labels'       => array( 'name' => 'Dự án', 'singular_name' => 'Dự án', 'add_new_item' => 'Thêm dự án / phân khu', 'edit_item' => 'Sửa dự án', 'all_items' => 'Tất cả dự án', 'parent_item_colon' => 'Thuộc đại đô thị:' ),
		'public'       => true,
		'hierarchical' => true, // /du-an/{dai-do-thi}/{phan-khu}/{dong-thap-tang}/
		'has_archive'  => 'du-an',
		'rewrite'      => array( 'slug' => 'du-an', 'with_front' => false ),
		'menu_icon'    => 'dashicons-location-alt',
		'menu_position'=> 20,
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'custom-fields' ),
		'show_in_rest' => true,
	) );

	$tax = function ( $slug, $name, $hier, $types ) {
		register_taxonomy( $slug, $types, array(
			'labels'            => array( 'name' => $name, 'singular_name' => $name ),
			'hierarchical'      => $hier,
			'public'            => false, // filters only; no archive pages to index (brief: URL lọc noindex)
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => false,
		) );
	};
	$tax( 'loai-san-pham', 'Loại sản phẩm', true, array( VELIS_CPT_PROJECT ) );
	$tax( 'khu-vuc', 'Khu vực', true, array( VELIS_CPT_PROJECT, VELIS_CPT_DEVELOPER ) );
	$tax( 'trang-thai', 'Trạng thái', true, array( VELIS_CPT_PROJECT ) );

	velis_register_meta();

	// Blog posts live at /blog/{cum}/{bai}/ with category base "blog" (/blog/{cum}/). Category rules run before post
	// rules, so a two-segment URL would be read as a nested category and 404; this rule reads it as the post instead.
	add_rewrite_rule( '^blog/([^/]+)/(?!page/|feed/)([^/]+)/?$', 'index.php?category_name=$matches[1]&name=$matches[2]', 'top' );
}

register_activation_hook( __FILE__, function () {
	velis_register(); // our types/taxonomies only – never re-run every plugin's init
	velis_seed_terms();
	flush_rewrite_rules( false ); // soft: never writes .htaccess
} );
register_deactivation_hook( __FILE__, fn() => flush_rewrite_rules( false ) );

/** Default terms (idempotent). Khu vực: Vùng → Tiểu khu (docs/KHU-VUC.md). */
function velis_seed_terms() {
	$add = function ( $tax, $name, $slug, $parent = 0 ) {
		$t = term_exists( $slug, $tax );
		return $t ? (int) $t['term_id'] : (int) wp_insert_term( $name, $tax, array( 'slug' => $slug, 'parent' => $parent ) )['term_id'];
	};
	foreach ( array( 'can-ho' => 'Căn hộ', 'nha-pho' => 'Nhà phố liền kề', 'shophouse' => 'Shophouse', 'biet-thu' => 'Biệt thự', 'dinh-thu' => 'Dinh thự' ) as $s => $n ) {
		$add( 'loai-san-pham', $n, $s );
	}
	foreach ( array( 'dang-ban' => 'Đang bán', 'sap-mo-ban' => 'Sắp mở bán', 'da-ban-giao' => 'Đã bàn giao' ) as $s => $n ) {
		$add( 'trang-thai', $n, $s );
	}
	$regions = array(
		'trung-tam' => array( 'Trung tâm', array() ),
		'khu-dong'  => array( 'Khu Đông', array( 'thu-thiem' => 'Thủ Thiêm', 'thao-dien-an-phu' => 'Thảo Điền – An Phú', 'nam-rach-chiec' => 'Nam Rạch Chiếc' ) ),
		'khu-nam'   => array( 'Khu Nam', array( 'nam-sai-gon' => 'Nam Sài Gòn' ) ),
		'khu-tay'   => array( 'Khu Tây', array() ),
		'tay-bac'   => array( 'Tây Bắc', array() ),
		've-tinh'   => array( 'Vùng vệ tinh', array( 'binh-duong' => 'Bình Dương', 'nhon-trach-long-thanh' => 'Nhơn Trạch – Long Thành' ) ),
	);
	foreach ( $regions as $s => list( $n, $subs ) ) {
		$pid = $add( 'khu-vuc', $n, $s );
		foreach ( $subs as $ss => $sn ) {
			$add( 'khu-vuc', $sn, $ss, $pid );
		}
	}
}

// Every phân khu and dòng thấp tầng has its own page. Pages missing minimum data stay noindex (and out of the
// sitemap) until filled in – brief "Trang thiếu dữ liệu".
function velis_is_noindex( $post ): bool {
	return $post instanceof WP_Post && VELIS_CPT_PROJECT === $post->post_type && (bool) velis_missing( $post );
}
add_filter( 'wp_robots', fn( $r ) => is_singular( VELIS_CPT_PROJECT ) && velis_is_noindex( get_queried_object() ) ? array_merge( $r, array( 'noindex' => true, 'follow' => true ) ) : $r );
add_filter( 'rank_math/frontend/robots', fn( $r ) => is_singular( VELIS_CPT_PROJECT ) && velis_is_noindex( get_queried_object() ) ? array_merge( $r, array( 'index' => 'noindex', 'follow' => 'follow' ) ) : $r );
// Rank Math passes a raw DB row (stdClass), not a WP_Post, and its type is not always 'post' – load the post by ID first,
// or noindex pages stay in the sitemap (found in giai đoạn 5).
add_filter( 'rank_math/sitemap/entry', fn( $url, $type, $object ) => ( isset( $object->ID ) && velis_is_noindex( get_post( (int) $object->ID ) ) ) ? false : $url, 10, 3 );
add_action( 'rest_api_init', fn() => register_rest_field( VELIS_CPT_PROJECT, 'velis_missing', array( 'get_callback' => fn( $p ) => velis_missing( $p['id'] ) ) ) );

/**
 * Header menu data: Chủ đầu tư → dự án → up to 4 phân khu (published). Returns
 * [ developer title => [ project title (newest project first) => [ 'url' => …, 'zones' => [ title => url ], 'more' => bool ] ] ],
 * projects without a developer under "Dự án khác".
 */
function velis_project_menu(): array {
	$out = array();
	$projects = get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'post_parent' => 0, 'numberposts' => 100, 'orderby' => 'date', 'order' => 'DESC' ) ); // newest first (vòng hoàn thiện 2)
	foreach ( $projects as $p ) {
		$devs = array_filter( array_map( 'get_post', (array) get_post_meta( $p->ID, 'velis_developers', true ) ) );
		$key  = $devs ? reset( $devs )->post_title : 'Dự án khác';
		$zones = get_posts( array( 'post_type' => VELIS_CPT_PROJECT, 'post_parent' => $p->ID, 'numberposts' => 5, 'orderby' => 'menu_order title', 'order' => 'ASC', 'meta_key' => 'velis_level', 'meta_value' => 'phan-khu' ) );
		$out[ $key ][ $p->post_title ] = array(
			'url'   => get_permalink( $p ),
			'zones' => array_combine( wp_list_pluck( array_slice( $zones, 0, 4 ), 'post_title' ), array_map( 'get_permalink', array_slice( $zones, 0, 4 ) ) ),
			'more'  => count( $zones ) > 4,
		);
	}
	uksort( $out, fn( $a, $b ) => ( 'Dự án khác' === $a ) <=> ( 'Dự án khác' === $b ) ?: strcmp( $a, $b ) );
	return $out;
}
