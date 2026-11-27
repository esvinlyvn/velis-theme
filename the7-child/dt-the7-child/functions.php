<?php
require_once __DIR__ . '/inc/velis-elements.php'; // phần tử WPBakery "Velis"
require_once __DIR__ . '/inc/velis-tac-gia-dong-y.php'; // khung trang tác giả + hộp đồng ý cookie (2026-11-26)
add_filter( 'xmlrpc_enabled', '__return_false' ); // không plugin nào dùng XML-RPC (không Jetpack / ứng dụng di động); máy chủ cũng chặn 403
/**
 * The7 Velis child theme. Layout and content stay editable in WPBakery and The7 → Theme Options; this file only loads
 * velis.css (what the options cannot do) after The7's own CSS.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', function () {
	$f = get_stylesheet_directory() . '/velis.css';
	wp_enqueue_style( 'velis-child', get_stylesheet_directory_uri() . '/velis.css', array( 'dt-main' ), (string) filemtime( $f ) ); // file time: a re-upload is never served from a stale cache
}, 20 );

// Date archives are 301-redirected to /blog/ (Rank Math → Chuyển hướng); link The7's post dates straight there, not via the redirect.
foreach ( array( 'day_link', 'month_link', 'year_link' ) as $velis_hook ) {
	add_filter( $velis_hook, fn() => home_url( '/blog/' ) );
}

// The7's JS lazy load (Theme Options → Advanced) is off so the first image is in the HTML (LCP); give The7's other thumbnails
// native lazy loading instead. shortcut: the first 4 thumbnails per page stay eager (the home hero strip has 4), enough for one screen.
add_filter( 'dt_get_thumb_img-output', function ( $html ) {
	static $velis_n = 0;
	if ( 1 === ++$velis_n && ( is_archive() || is_search() ) ) {
		return preg_replace( '/<img /', '<img fetchpriority="high" ', $html, 1 ); // first post image of a list is its LCP
	}
	return $velis_n > 4 && ! str_contains( $html, 'loading=' ) ? preg_replace( '/<img /', '<img loading="lazy" ', $html, 1 ) : $html;
} );

// Files a page does not use (E2, bước 10). Category/search archives render only The7 elements, but Ultimate Addons cannot see
// that outside a single post and loads all its assets there, incl. a render-blocking Google Maps API (~1.8 s on mobile Lighthouse).
// Icon fonts load only where the page content uses them; child style.css holds only the theme header; Rank Math's front CSS
// styles its own blocks/breadcrumbs, which the site does not use (breadcrumbs are The7's). jQuery Migrate stays: The7 main.js
// reads jQuery.event.props, gone in jQuery 3.
function velis_unused_assets( $content, $is_archive ) {
	$css = array( 'style', 'rank-math', 'duplicate-post' );
	$js  = array();
	if ( ! preg_match( '/\bfa[srb]?\s+fa-|icon_fontawesome|fa-[a-z-]+"/', $content ) ) {
		array_push( $css, 'the7-awesome-fonts', 'the7-awesome-fonts-back' );
	}
	if ( ! str_contains( $content, 'icomoon-free-social-contact' ) ) {
		$css[] = 'the7-icomoon-free-social-contact-16x16';
	}
	if ( $is_archive ) {
		array_push( $js, 'ultimate-vc-addons-googleapis', 'jquery-ui-slider', 'jquery_ui', 'ultimate-vc-addons-modernizr', 'ultimate-vc-addons_range_tick', 'ultimate-vc-addons-script', 'ultimate-vc-addons-modal-all', 'ultimate-vc-addons-jquery.shake', 'ultimate-vc-addons-jquery.vhparallax', 'ultimate-vc-addons-row-bg', 'ultimate-vc-addons-jquery.ytplayer' );
		array_push( $css, 'ultimate-vc-addons-icons', 'ultimate-vc-addons-selected-google-fonts-style', 'ultimate-vc-addons-style-min', 'ultimate-vc-addons-vidcons' );
	}
	return array( $css, $js );
}

add_action( 'wp_enqueue_scripts', function () {
	if ( is_admin() || is_user_logged_in() ) {
		return; // admin bar / front-end editor need their assets
	}
	$archive = is_category() || is_search() || is_tag() || is_author() || is_date();
	$id      = $archive ? (int) of_get_option( 'template_page_id_' . ( is_search() ? 'search' : 'blog_category' ) ) : get_queried_object_id();
	list( $css, $js ) = velis_unused_assets( (string) get_post_field( 'post_content', $id ), $archive );
	array_map( 'wp_dequeue_style', $css );
	array_map( 'wp_dequeue_script', $js );
}, 1000 );


// Mobile contact bar (DESIGN sticky-cta-mobile; replaces Buttonizer). Phone, Zalo and the consult link are edited in
// Giao diện → Tùy biến → "Thanh liên hệ (điện thoại)"; layout in velis.css (.velis-cta-bar; .velis-cta is the WPBakery contact row), shown < 1024 px
// and only after the first screen is scrolled past (DESIGN: never over the hero buttons) – velis_cta_script().
function velis_cta_defaults() {
	return array( 'velis_cta_phone' => '0911 237 979', 'velis_cta_zalo' => 'https://zalo.me/0911237979', 'velis_cta_url' => '/lien-he/' );
}

add_action( 'customize_register', function ( $wp_customize ) {
	$wp_customize->add_section( 'velis_cta', array( 'title' => 'Thanh liên hệ (điện thoại)', 'priority' => 160 ) );
	$labels = array( 'velis_cta_phone' => 'Số điện thoại (nút Gọi)', 'velis_cta_zalo' => 'Link Zalo', 'velis_cta_url' => 'Link nút "Nhận tư vấn"' );
	foreach ( velis_cta_defaults() as $id => $default ) {
		$wp_customize->add_setting( $id, array( 'default' => $default, 'sanitize_callback' => 'velis_cta_phone' === $id ? 'sanitize_text_field' : 'esc_url_raw' ) );
		$wp_customize->add_control( $id, array( 'label' => $labels[ $id ], 'section' => 'velis_cta', 'type' => 'velis_cta_phone' === $id ? 'tel' : 'url' ) );
	}
} );

// Give the first Contact Form 7 form on a page a stable id, so "Nhận tư vấn" can jump to it on the consult page itself.
add_filter( 'wpcf7_form_id_attr', function ( $id ) {
	if ( '' !== $id || did_action( 'velis_form_seen' ) ) {
		return $id;
	}
	do_action( 'velis_form_seen' );
	return 'velis-tu-van';
} );

function velis_cta_html() {
	$m = array();
	foreach ( velis_cta_defaults() as $id => $default ) {
		$m[ $id ] = get_theme_mod( $id, $default );
	}
	$tel   = preg_replace( '/[^0-9+]/', '', $m['velis_cta_phone'] );
	$here  = untrailingslashit( (string) wp_parse_url( $m['velis_cta_url'], PHP_URL_PATH ) ) === untrailingslashit( (string) wp_parse_url( add_query_arg( array() ), PHP_URL_PATH ) );
	$zalo  = esc_url( $m['velis_cta_zalo'] );
	$url   = ( $here || did_action( 'velis_prefoot_shown' ) ) && did_action( 'velis_form_seen' ) ? '#velis-tu-van' : $m['velis_cta_url']; // trang có khối liên hệ cuối: nhảy tới form ngay trang đó
	$icon  = fn( $d ) => '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="' . $d . '"/></svg>';
	$phone = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z';
	$chat  = 'M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.7 6.2L5 21l4.1-2.3c.9.2 1.9.3 2.9.3 5.5 0 10-3.6 10-8s-4.5-8-10-8z';
	return '<nav class="velis-cta-bar" aria-label="Liên hệ nhanh">'
		. ( $tel ? '<a class="velis-cta-bar__item" href="tel:' . esc_attr( $tel ) . '">' . $icon( $phone ) . '<span>Gọi</span></a>' : '' )
		. ( $zalo ? '<a class="velis-cta-bar__item" href="' . $zalo . '" target="_blank" rel="noopener">' . $icon( $chat ) . '<span>Zalo</span></a>' : '' )
		. '<a class="velis-cta-bar__main" href="' . esc_url( $url ) . '">Nhận tư vấn</a></nav>';
}

// Hidden state only when JS runs (class set in <head>, before paint); without JS the bar simply stays visible.
function velis_cta_script() {
	return '<script>(function(){var b=document.querySelector(".velis-cta-bar");if(!b)return;var f=function(){b.classList.toggle("is-on",scrollY>innerHeight*0.6)};'
		. 'addEventListener("scroll",f,{passive:true});f();})();</script>';
}

add_action( 'wp_head', function () {
	// The7 main.js gọi vc_initVideoBackgrounds (tệp js_composer_front của WPBakery) cả khi trang chỉ có phần tử Velis – hàm rỗng tránh lỗi console
	echo '<script>document.documentElement.classList.add("velis-cta-js");window.vc_initVideoBackgrounds=window.vc_initVideoBackgrounds||function(){}</script>';
}, 1 );

add_action( 'wp_footer', function () {
	echo velis_cta_html() . velis_cta_script(); // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaped parts above
}, 5 );

// Front-page hero image (E1): a WPBakery Single Image with Extra class "velis-hero-bg" – a real <img> with srcset, so the editor
// changes it in WPBakery. It is the LCP image: preload it with its srcset and render it eager + fetchpriority=high, never lazy.
function velis_hero_image_id( $content ) {
	return preg_match( '/\[vc_single_image\b(?=[^\]]*\bvelis-hero-bg\b)[^\]]*\bimage="(\d+)"/', (string) $content, $m ) ? (int) $m[1] : 0;
}

function velis_front_hero_id() {
	static $id = null;
	return $id ??= is_front_page() ? velis_hero_image_id( get_post_field( 'post_content', get_queried_object_id() ) ) : 0;
}

add_action( 'wp_head', function () {
	$id = velis_front_hero_id();
	if ( $id && ( $src = wp_get_attachment_image_url( $id, 'full' ) ) ) {
		printf( '<link rel="preload" as="image" fetchpriority="high" href="%s" imagesrcset="%s" imagesizes="100vw">', esc_url( $src ), esc_attr( (string) wp_get_attachment_image_srcset( $id, 'full' ) ) );
	}
}, 2 );

add_filter( 'wp_get_attachment_image_attributes', function ( $attr, $attachment ) {
	if ( velis_front_hero_id() && velis_front_hero_id() === $attachment->ID ) {
		$attr['loading']       = 'eager';
		$attr['fetchpriority'] = 'high';
		$attr['sizes']         = '100vw';
	}
	return $attr;
}, 20, 2 );

// CLS máy tính (2026-11-26, bản 2): hàng / section "kéo rộng" của WPBakery được JS The7 (window.vc_rowBehaviour) đặt left / width / padding
// lúc tải và TÍNH LẠI về sau (đôi khi ra giá trị sai vài ms → The Privé CLS 0,09–0,33). Khóa hình học bằng #main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]{position:relative;left:auto!important;right:auto!important;box-sizing:border-box!important;width:var(--velis-vw,100vw)!important;max-width:none!important;margin-left:calc(50% - var(--velis-vw,100vw) / 2)!important;margin-right:0!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_section[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_row[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important}@media (max-width:778px){#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:1px!important;padding-right:1px!important}} !important theo đúng công thức
// JS (lề = nửa phần dư của khung nhìn so với khung nội dung, − 15 px section / − 16 px hàng; ≤ 778 px: 1 px) nên JS tính lại cũng không xô.
// --velis-vw = độ rộng khung nhìn KHÔNG gồm thanh cuộn (clientWidth, như JS dùng), cập nhật bằng ResizeObserver; trang có cột phải không áp (JS khác).
// In thẳng trong <head> (trước #main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]{position:relative;left:auto!important;right:auto!important;box-sizing:border-box!important;width:var(--velis-vw,100vw)!important;max-width:none!important;margin-left:calc(50% - var(--velis-vw,100vw) / 2)!important;margin-right:0!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_section[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_row[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important}@media (max-width:778px){#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:1px!important;padding-right:1px!important}} bất đồng bộ / C#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]{position:relative;left:auto!important;right:auto!important;box-sizing:border-box!important;width:var(--velis-vw,100vw)!important;max-width:none!important;margin-left:calc(50% - var(--velis-vw,100vw) / 2)!important;margin-right:0!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_section[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_row[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important}@media (max-width:778px){#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:1px!important;padding-right:1px!important}} của LiteSpeed).
add_action( 'wp_head', function () {
	echo '<script data-no-optimize="1">(function(){var r=document.documentElement,f=function(){r.style.setProperty("--velis-vw",r.clientWidth+"px")};f();if(window.ResizeObserver)new ResizeObserver(f).observe(r);else addEventListener("resize",f)})();</script>'
		. '<style id="velis-stretch">#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]{position:relative;left:auto!important;right:auto!important;box-sizing:border-box!important;width:var(--velis-vw,100vw)!important;max-width:none!important;margin-left:calc(50% - var(--velis-vw,100vw) / 2)!important;margin-right:0!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_section[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 15px)!important}#main:not(.sidebar-left):not(.sidebar-right) .vc_row[data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important;padding-right:calc(var(--velis-vw,100vw) / 2 - 50% - 16px)!important}@media (max-width:778px){#main:not(.sidebar-left):not(.sidebar-right) [data-vc-full-width="true"]:not([data-vc-stretch-content]){padding-left:1px!important;padding-right:1px!important}}</style>';
}, 3 );

// CSS gọn (2026-11-27, người dùng duyệt): bản lọc bỏ quy tắc không khớp phần tử nào (quét toàn sitemap 2 khổ + trạng thái JS) của The7 / WPBakery / plugin,
// sinh bằng tools/the7_gon_css.mjs vào gon/<tên miền>/ (bang.json: đường dẫn nguồn → tệp gọn + md5 nguồn). Chỉ thay khi md5 tệp nguồn trên máy chủ còn khớp:
// đổi Theme Options (uploads/the7-css/*) hoặc cập nhật theme / plugin → tự dùng lại tệp gốc (giao diện đúng, chỉ nặng hơn) tới khi sinh lại + đóng gói.
// Người đăng nhập luôn nhận tệp gốc (thanh quản trị, trình soạn thảo).
function velis_gon() {
	static $g = null;
	if ( null !== $g ) {
		return $g;
	}
	$g = array( 'tep' => array(), 'du' => false );
	$dir  = get_stylesheet_directory() . '/gon/' . wp_parse_url( home_url(), PHP_URL_HOST ) . '/';
	$bang = is_readable( $dir . 'bang.json' ) ? json_decode( (string) file_get_contents( $dir . 'bang.json' ), true ) : null;
	if ( is_admin() || is_user_logged_in() || ! is_array( $bang ) ) {
		return $g;
	}
	foreach ( $bang as $duong => $v ) {
		$nguon = ABSPATH . ltrim( $duong, '/' );
		if ( ! is_readable( $nguon ) || ! is_readable( $dir . $v['tep'] ) ) {
			continue;
		}
		$k  = 'velis_gon_' . md5( $duong . filemtime( $nguon ) . filesize( $nguon ) );
		$ok = get_transient( $k );
		if ( false === $ok ) {
			$ok = md5_file( $nguon ) === $v['md5'] ? 'y' : 'n';
			set_transient( $k, $ok, WEEK_IN_SECONDS );
		}
		if ( 'y' === $ok ) {
			$g['tep'][ $duong ] = $dir . $v['tep'];
		}
	}
	$g['du'] = count( $g['tep'] ) === count( $bang ); // mọi tệp còn khớp → critical CSS (sinh từ bản gọn) còn đúng
	return $g;
}
add_filter( 'style_loader_src', function ( $src ) {
	$p = wp_parse_url( (string) $src, PHP_URL_PATH );
	$t = $p ? ( velis_gon()['tep'][ $p ] ?? '' ) : '';
	if ( ! $t ) {
		return $src;
	}
	// tệp gọn rỗng (vd. custom-scrollbar không dùng ở đâu) → không in thẻ
	return filesize( $t ) ? get_stylesheet_directory_uri() . substr( $t, strlen( get_stylesheet_directory() ) ) . '?ver=' . filemtime( $t ) : '';
}, 20 );
// khối core WordPress in CSS nội tuyến theo dữ liệu 'path' (vd. social-links) → trỏ 'path' sang bản gọn trước wp_maybe_inline_styles (ưu tiên 1)
$velis_gon_path = function () {
	$g = velis_gon();
	if ( ! $g['tep'] ) {
		return;
	}
	$goc = wp_normalize_path( ABSPATH );
	foreach ( wp_styles()->registered as $o ) {
		$pa = isset( $o->extra['path'] ) ? '/' . ltrim( str_replace( $goc, '', wp_normalize_path( $o->extra['path'] ) ), '/' ) : '';
		if ( $pa && isset( $g['tep'][ $pa ] ) ) {
			$o->extra['path'] = $g['tep'][ $pa ];
		}
	}
};
add_action( 'wp_head', $velis_gon_path, 0 );
add_action( 'wp_footer', $velis_gon_path, 0 );

// Easy TOC chỉ hiện ở bài viết (trang / danh sách / chuyên mục: 0 mục lục – đo 2026-11-27) → không tải CSS của plugin ở chỗ khác.
add_action( 'wp_enqueue_scripts', function () {
	if ( ! is_singular( 'post' ) ) {
		wp_dequeue_style( 'eztoc' );
	}
}, 100 );

// Critical CSS tự làm (2026-11-27, người dùng chốt – thay CCSS QUIC.cloud): critical/<loại>.css (sinh bằng tools/the7_critical_css.mjs trên staging)
// in nội tuyến đầu <head>; CSS gộp của LiteSpeed (sau khi tối ưu – bộ lọc litespeed_buffer_after) chuyển sang tải bất đồng bộ.
// Không có tệp cho loại trang → giữ CSS chặn như cũ (an toàn). LiteSpeed "Load CSS Asynchronously" + CCSS phải TẮT (tránh chồng).
// CÔNG TẮC: 2.4.1 tắt (CSS gộp 920 KB tải bất đồng bộ → TBT site thật 370–1.200 ms); 2.5.0 BẬT lại sau khi làm gọn CSS (≈ 250 KB, gon/).
// Chỉ in khi mọi tệp gọn còn khớp nguồn (velis_gon()['du']) – critical sinh từ bản gọn; lệch → CSS chặn như cũ.
const VELIS_CRITICAL_BAT = true;
function velis_loai_trang() {
	if ( is_front_page() ) {
		return 'trang-chu';
	}
	if ( is_page( array( 'du-an', 'chu-dau-tu' ) ) ) {
		return 'danh-sach';
	}
	if ( is_singular( 'post' ) ) {
		return velis_la_trang_san_pham( get_queried_object_id() ) ? 'du-an' : 'bai';
	}
	if ( is_page() ) {
		return str_contains( (string) get_post_field( 'post_content', get_queried_object_id() ), 'velis-hero' ) ? 'du-an' : 'trang';
	}
	return 'chuyen-muc';
}
add_action( 'wp_head', function () {
	$f = get_stylesheet_directory() . '/critical/' . velis_loai_trang() . '.css';
	if ( VELIS_CRITICAL_BAT && velis_gon()['du'] && is_readable( $f ) && ! is_user_logged_in() ) {
		echo '<style id="velis-critical">' . preg_replace( '/^\/\*.*?\*\/\s*/s', '', (string) file_get_contents( $f ) ) . '</style>' . "\n"; // phpcs:ignore
	}
}, 2 );
function velis_css_bat_dong_bo( $html ) {
	if ( ! str_contains( $html, 'id="velis-critical"' ) ) {
		return $html;
	}
	$i = stripos( $html, '</head>' );
	if ( false === $i ) {
		return $html;
	}
	$dau = preg_replace_callback( '/<link\b[^>]*\brel=["\']stylesheet["\'][^>]*>/i', function ( $m ) {
		$t = $m[0];
		if ( preg_match( '/\bmedia=["\'](print|speech)["\']/i', $t ) || ! preg_match( '/\bhref=["\']([^"\']+)["\']/i', $t, $h ) ) {
			return $t;
		}
		return '<link rel="preload" as="style" href="' . $h[1] . '" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript>' . $t . '</noscript>';
	}, substr( $html, 0, $i ) );
	return $dau . substr( $html, $i );
}
add_filter( 'litespeed_buffer_after', 'velis_css_bat_dong_bo', 20 );

// Right-sized images (2026-11-26). The7's post grids crop ONE 768 px image per post (srcset 768w/788w) even for 99–430 px slots.
// Extra hard-crop sizes in the same ratios as the grids (13:9 hero strip, 4:3 project cards, 3:2 post cards) + 480/640 px proportional sizes
// (single images). Different ratio from the originals, so WordPress never mixes the crops into other images' srcset. Thumbnails for existing
// uploads: REST POST /wp/v2/media/<id>/post-process {action: create-image-subsizes} (tools/the7_tao_co_anh.py).
const VELIS_CO_ANH = array( '13x9' => array( array( 176, 122 ), array( 352, 244 ) ), '4x3' => array( array( 320, 240 ), array( 480, 360 ), array( 640, 480 ) ),
	'3x2' => array( array( 160, 107 ), array( 320, 213 ), array( 480, 320 ), array( 640, 427 ) ) );
// Displayed slot width per grid ratio (measured 390 / 768 / 1366 / 1920 px; velis.css): hero strip 99 px, project card ≤ 430 px, post card 116 / 314 px.
const VELIS_SIZES = array( '13x9' => '100px', '4x3' => '(max-width: 767px) 100vw, 430px', '3x2' => '(max-width: 767px) 120px, 320px' );

add_action( 'after_setup_theme', function () {
	foreach ( VELIS_CO_ANH as $tl => $ds ) {
		foreach ( $ds as $wh ) {
			add_image_size( "velis-$tl-{$wh[0]}", $wh[0], $wh[1], true );
		}
	}
	add_image_size( 'velis-480', 480, 0 );
	add_image_size( 'velis-640', 640, 0 );
	add_image_size( 'velis-1x1-96', 96, 96, true ); // 72 px related-post squares (velis_bai_viet): same ratio as 'thumbnail', joins its srcset
} );

// Ratio key of a W×H crop, or '' when it is none of the grid ratios.
function velis_ti_le( $w, $h ) {
	foreach ( array( '13x9' => 13 / 9, '4x3' => 4 / 3, '3x2' => 3 / 2 ) as $k => $r ) {
		if ( $h > 0 && abs( $w / $h - $r ) < 0.02 ) {
			return $k;
		}
	}
	return '';
}

// Rebuild srcset / sizes of The7 grid images (<img class="preload-me" src="…-768x576.webp">) from the crops above; images without those
// crops yet (thumbnails not regenerated) keep The7's markup.
function velis_anh_dung_co( $html, $find_id = 'attachment_url_to_postid', $get_src = 'wp_get_attachment_image_src' ) {
	return preg_replace_callback( '/<img\b[^>]*\bclass="[^"]*\bpreload-me\b[^"]*"[^>]*>/', function ( $m ) use ( $find_id, $get_src ) {
		$img = $m[0];
		if ( ! preg_match( '/\bsrc="([^"]+)-(\d+)x(\d+)\.(webp|jpe?g|png)"/i', $img, $s ) || ! ( $tl = velis_ti_le( (int) $s[2], (int) $s[3] ) ) ) {
			return $img;
		}
		static $ids = array();
		$goc = $s[1] . '.' . $s[4];
		$id  = $ids[ $goc ] ??= (int) $find_id( $goc );
		if ( ! $id ) {
			return $img;
		}
		$set = array();
		foreach ( VELIS_CO_ANH[ $tl ] as $wh ) {
			$a = $get_src( $id, "velis-$tl-{$wh[0]}" );
			if ( $a && (int) $a[1] === $wh[0] && (int) $a[2] === $wh[1] ) {
				$set[] = $a[0] . ' ' . $wh[0] . 'w';
			}
		}
		if ( ! $set ) {
			return $img;
		}
		$set[] = "{$s[1]}-{$s[2]}x{$s[3]}.{$s[4]} {$s[2]}w";
		$sizes = ( str_contains( $img, 'loading="lazy"' ) ? 'auto, ' : '' ) . VELIS_SIZES[ $tl ];
		$img   = preg_replace( '/\s(srcset|sizes)="[^"]*"/', '', $img );
		return str_replace( '<img ', '<img srcset="' . esc_attr( implode( ', ', $set ) ) . '" sizes="' . esc_attr( $sizes ) . '" ', $img );
	}, $html );
}

add_filter( 'do_shortcode_tag', function ( $out, $tag ) {
	return 'dt_blog_masonry' === $tag ? velis_loc_the( velis_anh_dung_co( $out ) ) : $out;
}, 10, 2 );

// Lọc /du-an/ theo thẻ khu vực + loại hình (2026-11-26): nút lọc có sẵn của The7 chỉ lấy CHUYÊN MỤC và so lớp của ô lưới (wf-cell).
// Khi lưới bật bộ lọc: chép lớp tag-* của từng bài lên ô lưới (data-filter ".tag-x": JS của The7 bỏ ký tự đầu), thay nút lọc bằng các thẻ trong VELIS_LOC_THE có bài trong lưới (JS lọc của The7 giữ nguyên).
const VELIS_LOC_THE = array( 'khu-dong' => 'Khu Đông', 'khu-tay' => 'Khu Tây', 'tay-bac' => 'Tây Bắc', 'vung-ve-tinh' => 'Vùng vệ tinh',
	'can-ho' => 'Căn hộ', 'nha-pho' => 'Nhà phố', 'shophouse' => 'Shophouse', 'biet-thu' => 'Biệt thự' );
function velis_loc_the( $html ) {
	if ( ! str_contains( $html, 'filter-categories' ) ) {
		return $html;
	}
	$html = preg_replace_callback( '/(<div class="[^"]*\bwf-cell\b[^"]*)("[^>]*>\s*<article class="([^"]*)")/', function ( $m ) {
		preg_match_all( '/\btag-[a-z0-9-]+/', $m[3], $t );
		return $m[1] . ( $t[0] ? ' ' . implode( ' ', $t[0] ) : '' ) . $m[2];
	}, $html );
	$co = array_filter( VELIS_LOC_THE, fn( $slug ) => str_contains( $html, ' tag-' . $slug . ' ' ) || str_contains( $html, ' tag-' . $slug . '"' ), ARRAY_FILTER_USE_KEY );
	$nut = '<a href="#" class="show-all act" data-filter="*">Tất cả</a>';
	foreach ( $co as $slug => $ten ) {
		$nut .= '<a href="#" data-filter=".tag-' . esc_attr( $slug ) . '">' . esc_html( $ten ) . '</a>';
	}
	return preg_replace( '/(<div class="filter-categories"[^>]*>).*?(<\/div>)/s', '$1' . $nut . '$2', $html, 1 );
}

// Only the first image skips lazy-loading (WordPress default: 3) – the hero is already eager + fetchpriority=high above; the 2nd/3rd images
// (hero project thumbs, progress photos far below) were downloading before the CSS/LCP. Lazy images also get sizes="auto" (right file size).
add_filter( 'wp_omit_loading_attr_threshold', fn() => 1 );

// Old project categories are 301-redirected (Rank Math) to their replacement pages: link straight to the page, so the The7 breadcrumb and
// Rank Math's BreadcrumbList never point at a redirect (2026-11-26). Map = tools/the7_rankmath_chuyen_huong.mjs.
function velis_term_link( $url, $term, $taxonomy ) {
	$map = array( 'du-an-bds' => '/du-an/', 'du-an-vinhomes' => '/du-an/vinhomes/', 'du-an-gamuda-land' => '/du-an/gamuda-land/', 'du-an-masterise-homes' => '/du-an/masterise-homes/',
		'du-an-sungroup' => '/du-an/sun-group/', 'du-an-vinhomes-saigon-park' => '/vinhomes-saigon-park/', 'du-an-spring-ville' => '/spring-ville/' );
	return 'category' === $taxonomy && isset( $map[ $term->slug ] ) ? home_url( $map[ $term->slug ] ) : $url;
}
add_filter( 'term_link', 'velis_term_link', 10, 3 );

// Contact Form 7 – every form (B3): Vietnamese phone number – 0 + 9 digits, or +84 / 84 + 9 digits (spaces, dots, dashes, brackets
// allowed); the error text is the form's own "invalid_tel" message (Liên hệ → Contact Form 7 → Thông báo); numeric phone keypad.
// The mail / lead gets the number as 0xxxxxxxxx whatever form the visitor typed.
function velis_vn_phone( $value ) {
	return preg_match( '/^(?:0|\+?84)(\d{9})$/', preg_replace( '/[\s.\-()]/', '', (string) $value ), $m ) ? '0' . $m[1] : '';
}

function velis_vn_phone_ok( $value ) {
	return '' !== velis_vn_phone( $value );
}

foreach ( array( 'tel', 'tel*' ) as $velis_type ) {
	add_filter( 'wpcf7_validate_' . $velis_type, function ( $result, $tag ) {
		$value = isset( $_POST[ $tag->name ] ) ? sanitize_text_field( wp_unslash( $_POST[ $tag->name ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- CF7 verifies the submission
		if ( '' !== $value && ! velis_vn_phone_ok( $value ) ) {
			$result->invalidate( $tag, wpcf7_get_message( 'invalid_tel' ) );
		}
		return $result;
	}, 20, 2 );
	add_filter( 'wpcf7_posted_data_' . $velis_type, fn( $value ) => is_string( $value ) && velis_vn_phone_ok( $value ) ? velis_vn_phone( $value ) : $value );
}

add_filter( 'wpcf7_form_elements', function ( $html ) {
	return preg_replace( '/<input(?![^>]*\binputmode=)([^>]*\btype="tel")/', '<input inputmode="tel"$1', $html );
} );

// Archive / search lists: The7 prints post titles as H3 right under the page H1 – a hidden H2 keeps the heading order (D2).
add_action( 'presscore_before_loop', function () {
	if ( is_archive() || is_search() ) {
		echo '<h2 class="screen-reader-text">Danh sách bài viết</h2>';
	}
} );

// The7 paginator prints the "…" between page numbers as <a href="javascript:void(0);"> (Lighthouse SEO: link not crawlable) and has
// no filter for it: on list pages turn it into plain text. The hidden page links next to it keep their real URLs.
function velis_paginator_dots( $html ) {
	return preg_replace( '#<a href="javascript:void\(0\);" class="dots">(.*?)</a>#', '<span class="dots">$1</span>', $html );
}
add_action( 'template_redirect', function () {
	if ( is_archive() || is_search() || is_home() ) {
		ob_start( 'velis_paginator_dots' );
	}
} );

// Small page script (no library): CF7 submit button shows "Đang gửi…" and cannot be pressed twice until CF7 answers; the one-line
// "chủ đầu tư · khu vực" label of a project card gets the full text as a tooltip when it is cut with "…".
function velis_page_script() {
	return '<script>(function(){document.addEventListener("submit",function(e){var f=e.target,b=f.querySelector&&f.querySelector(".wpcf7-submit");'
		. 'if(!b||!f.closest(".wpcf7"))return;if(b.disabled){e.preventDefault();e.stopImmediatePropagation();return}b.dataset.v=b.value;b.value="Đang gửi…";'
		. 'setTimeout(function(){if(b.value==="Đang gửi…")b.disabled=true},0)},true);document.addEventListener("wpcf7submit",function(e){var b=e.target.querySelector(".wpcf7-submit");'
		. 'if(b&&b.dataset.v){b.value=b.dataset.v;b.disabled=false}e.target.querySelectorAll(".wpcf7-form-control-wrap").forEach(function(w){w.parentElement.style.minHeight=""})});'
		// Sửa ô sau khi báo lỗi: CF7 gỡ lời nhắc lúc rời ô (change) – đúng lúc bấm nút – làm nút nhảy lên, cú bấm trượt. Giữ chiều cao khung ô (nhãn – ô bọc là span nội dòng) tới lần gửi sau.
		. 'document.addEventListener("change",function(e){var f=e.target.form;if(f&&f.closest(".wpcf7")&&f.querySelector(".wpcf7-not-valid-tip"))f.querySelectorAll(".wpcf7-form-control-wrap").forEach(function(w){w=w.parentElement;w.style.minHeight=w.offsetHeight+"px"})},true);'
		. 'document.querySelectorAll(".velis-projects .entry-excerpt").forEach(function(x){var p=x.children;if(p.length>1)p[0].parentNode.title=p[0].textContent+" · "+p[1].textContent});'
		// Form chưa hợp lệ (vd. chưa tick đồng ý): đưa focus về ô lỗi đầu tiên – lời nhắc tiếng Việt nằm ngay dưới ô đó.
		. 'document.addEventListener("wpcf7invalid",function(e){var f=e.target;setTimeout(function(){var x=f.querySelector(".wpcf7-not-valid");if(x)(x.matches("input,textarea,select")?x:x.querySelector("input")||x).focus()},0)});'
		// utm_* từ URL (LiteSpeed bỏ utm khỏi khóa cache nên CF7 default:get không thấy) – giữ trong phiên, điền trường ẩn của mọi form.
		. 'var q=new URLSearchParams(location.search),u={};try{u=JSON.parse(sessionStorage.velisUtm||"{}")}catch(e){}["utm_source","utm_medium","utm_campaign"].forEach(function(k){if(q.get(k))u[k]=q.get(k)});'
		. 'try{sessionStorage.velisUtm=JSON.stringify(u)}catch(e){}Object.keys(u).forEach(function(k){document.querySelectorAll(".wpcf7 input[name="+k+"]").forEach(function(i){i.value=u[k]})});'
		// Footer điện thoại: cột link (tiêu đề + danh sách) gập / mở bằng tiêu đề. shortcut: chỉ xét cỡ màn hình lúc tải trang, đủ cho điện thoại.
		. 'if(matchMedia("(max-width:767px)").matches)document.querySelectorAll("#footer .widget:has(.menu,.wp-block-latest-posts) > .widget-title").forEach(function(t){var w=t.parentNode;'
		. 'w.classList.add("is-shut");t.setAttribute("role","button");t.tabIndex=0;t.setAttribute("aria-expanded","false");var f=function(){var o=w.classList.toggle("is-shut");t.setAttribute("aria-expanded",String(!o))};'
		. 't.addEventListener("click",f);t.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();f()}})});'
		// Hỏi đáp / "Xem thêm" (vc_toggle của WPBakery chỉ bắt chuột): dòng tiêu đề nhận Tab, Enter / Space mở – đóng.
		. 'document.querySelectorAll(".vc_toggle_title").forEach(function(t){var g=t.closest(".vc_toggle");t.setAttribute("role","button");t.tabIndex=0;'
		. 'var s=function(){t.setAttribute("aria-expanded",String(g.classList.contains("vc_toggle_active")))};s();new MutationObserver(s).observe(g,{attributes:true,attributeFilter:["class"]});'
		. 't.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();t.click()}})});'
		// Điện thoại / máy tính bảng (< 1024): thu gọn tối đa 2 khối nội dung dài nhất (> 900 px) – không thu khối giá / pháp lý / tiến độ / hỏi đáp;
		// nút "Xem thêm" do JS tạo (không phải phần tử riêng); bấm mục lục / link # tới chữ trong khối đang thu thì tự mở. Mục lục Velis thu gọn.
		// shortcut: xét cỡ màn hình lúc tải trang.
		. 'var mo=function(e){var g=e&&e.closest&&e.closest(".velis-thu");if(g){g.classList.remove("velis-thu");var b=g.querySelector(".velis-xem-them");if(b)b.remove()}};'
		. 'if(matchMedia("(max-width:1023px)").matches){document.querySelectorAll("details.velis-muc-luc").forEach(function(d){d.open=false});'
		. '[].slice.call(document.querySelectorAll(".velis-khoi")).map(function(g){var c=g.querySelector(".velis-khoi__chu");return{g:g,c:c,h:c?c.scrollHeight:0}})'
		. '.filter(function(x){var t=x.g.querySelector(".velis-khoi__tieu-de");return x.h>900&&!/giá|pháp lý|tiến độ|hỏi|FAQ/i.test(t?t.textContent:"")})'
		. '.sort(function(a,b){return b.h-a.h}).slice(0,2).forEach(function(x){x.g.classList.add("velis-thu");var b=document.createElement("button");b.type="button";'
		. 'b.className="velis-xem-them";b.textContent="Xem thêm";b.setAttribute("aria-expanded","false");b.addEventListener("click",function(){mo(b)});x.c.after(b)})}'
		. 'window.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href^=\'#\']");if(a&&a.hash.length>1)mo(document.getElementById(decodeURIComponent(a.hash.slice(1))))},true);'
		. 'window.addEventListener("hashchange",function(){mo(document.getElementById(decodeURIComponent(location.hash.slice(1))))})})();</script>';
}

add_action( 'wp_footer', function () {
	echo velis_page_script(); // phpcs:ignore WordPress.Security.EscapeOutput -- static markup
}, 6 );

// Schema (D1). Rank Math settings keep Organization/RealEstateAgent, WebSite, WebPage and custom schemas (Service, JobPosting, …);
// this only adds what Rank Math cannot: pages are not articles (drop Article + its author node), list pages are CollectionPage +
// ItemList of the cards they show, project posts get a Place (custom field "velis_dia_chi" = address shown on the page).
// Visible breadcrumbs carry BreadcrumbList microdata (The7), so no JSON-LD copy is added.
function velis_schema_graph( array $data, array $ctx ) {
	$url  = $ctx['url'];
	$drop = array();
	if ( $ctx['is_page'] ) {
		foreach ( $data as $k => $n ) {
			$t = (array) ( $n['@type'] ?? array() );
			if ( array_intersect( $t, array( 'Article', 'BlogPosting', 'NewsArticle' ) ) ) {
				$drop[] = $n['author']['@id'] ?? '';
				unset( $data[ $k ] );
			}
		}
		foreach ( $data as $k => $n ) {
			if ( 'Person' === ( $n['@type'] ?? '' ) && in_array( $n['@id'] ?? '', $drop, true ) ) {
				unset( $data[ $k ] );
			}
		}
	}
	foreach ( $data as $k => $n ) {
		if ( ! $ctx['items'] || ! in_array( $n['@type'] ?? '', array( 'WebPage', 'CollectionPage' ), true ) ) {
			continue;
		}
		if ( ! $ctx['is_front'] ) {
			$data[ $k ]['@type'] = 'CollectionPage';
		}
		$data[ $k ]['mainEntity'] = array( '@id' => $url . '#itemlist' );
		$data['velisItemList']   = array(
			'@type'           => 'ItemList',
			'@id'             => $url . '#itemlist',
			'itemListElement' => array_map( fn( $i, $it ) => array( '@type' => 'ListItem', 'position' => $i + 1, 'url' => $it[0], 'name' => $it[1] ), array_keys( $ctx['items'] ), $ctx['items'] ),
		);
	}
	if ( $ctx['address'] ) {
		$data['velisPlace'] = array(
			'@type'   => 'Place',
			'@id'     => $url . '#place',
			'name'    => $ctx['name'],
			'address' => array( '@type' => 'PostalAddress', 'streetAddress' => $ctx['address'], 'addressCountry' => 'VN' ),
		);
		foreach ( $data as $k => $n ) {
			if ( array_intersect( (array) ( $n['@type'] ?? array() ), array( 'Article', 'BlogPosting' ) ) ) {
				$data[ $k ]['about'] = array( '@id' => $url . '#place' );
			}
		}
	}
	return $data;
}

// Cards a list page shows: the archive's posts, or on a page the posts of the The7 "Blog Masonry & Grid" elements inside rows
// with class "velis-projects" (Posts list or Category, newest first – same query as the element). Home is a WebPage, not a list.
function velis_masonry_queries( $content ) {
	$out = array();
	preg_match_all( '/\[(vc_section|vc_row)\b[^\]]*\bvelis-projects\b[^\]]*\](.*?)\[\/\1\]/s', (string) $content, $rows );
	foreach ( $rows[2] as $row ) {
		preg_match_all( '/\[dt_blog_masonry ([^\]]*)\]/', $row, $m );
		foreach ( $m[1] as $a ) {
			$a = shortcode_parse_atts( $a );
			if ( ! empty( $a['posts'] ) || ! empty( $a['category'] ) ) {
				$out[] = ( ! empty( $a['posts'] ) ? array( 'post__in' => array_map( 'intval', explode( ',', $a['posts'] ) ) ) : array( 'cat' => $a['category'] ) )
					+ array( 'numberposts' => (int) ( $a['dis_posts_total'] ?? 12 ), 'orderby' => 'date', 'order' => 'DESC' );
			}
		}
	}
	// phần tử Velis · Lưới dự án (loại "Thẻ dự án") – cùng truy vấn với mẫu wpb_templates/velis_luoi.php
	preg_match_all( '/\[velis_luoi ([^\]]*)\]/', (string) $content, $m );
	foreach ( $m[1] as $a ) {
		$a = shortcode_parse_atts( $a );
		if ( 'du_an' !== ( $a['loai'] ?? '' ) ) {
			continue;
		}
		$ids = array_filter( array_map( 'intval', explode( ',', (string) ( $a['bai'] ?? '' ) ) ) );
		if ( $ids || ! empty( $a['danh_muc'] ) ) {
			$out[] = ( $ids ? array( 'post__in' => $ids ) : array( 'cat' => $a['danh_muc'] ) ) + array( 'numberposts' => max( 1, (int) ( $a['so'] ?? 3 ) ), 'orderby' => 'date', 'order' => 'DESC' );
		}
	}
	return $out;
}

// Card rows built from WPBakery columns (class "velis-devs", e.g. the developer hub): each card's name is a link (h2 a) → its page.
function velis_card_links( $content ) {
	preg_match_all( '/\[(vc_section|vc_row)\b[^\]]*\bvelis-devs\b[^\]]*\](.*?)\[\/\1\]/s', (string) $content, $rows );
	preg_match_all( '/<h2[^>]*>\s*<a [^>]*href="([^"]+)"/', implode( '', $rows[2] ), $m );
	return array_values( array_unique( $m[1] ) );
}

function velis_listed_posts() {
	if ( is_category() || is_search() || is_tag() ) {
		return $GLOBALS['wp_query']->posts;
	}
	if ( ! is_page() || is_front_page() ) {
		return array();
	}
	$content = get_post_field( 'post_content', get_queried_object_id() );
	$cards   = array();
	foreach ( velis_card_links( $content ) as $u ) {
		$id = url_to_postid( '/' === $u[0] ? home_url( $u ) : $u );
		if ( $id ) {
			$cards[] = get_post( $id );
		}
	}
	return array_merge( $cards, ...array_map( 'get_posts', velis_masonry_queries( $content ) ) );
}

add_filter( 'rank_math/json_ld', function ( $data ) {
	$id    = get_queried_object_id();
	$items = array();
	foreach ( velis_listed_posts() as $p ) {
		$items[ $p->ID ] = array( get_permalink( $p ), get_the_title( $p ) );
	}
	return velis_schema_graph( (array) $data, array(
		'url'      => is_category() || is_search() || is_tag() ? (string) get_pagenum_link( 1, false ) : (string) get_permalink( $id ),
		'is_page'  => is_page() || is_front_page(),
		'is_front' => is_front_page(),
		'items'    => array_values( $items ),
		'address'  => is_single() ? trim( (string) get_post_meta( $id, 'velis_dia_chi', true ) ) : '',
		'name'     => is_single() ? get_the_title( $id ) : '',
	) );
}, 99 );

// ── Bước 12 (2026-11-13): CTA "Nhận bảng giá" đúng dự án ở sidebar bài blog + danh sách bài cùng dự án ─────────────────────────────
// Dự án của một bài blog = bài dự án (chuyên mục Dự án 34, rồi Phân khu 57) có "Bài viết liên quan → chọn chuyên mục" (The7 Post
// Options) trỏ đúng chuyên mục cụm của bài. Không cấu hình mới: đổi dự án của cụm = đổi chuyên mục liên quan ở trang dự án.
// Widget HTML tùy chỉnh dùng chữ chờ: {du_an} / {du_an|chữ khi không có dự án}, {du_an_link}; phần tử class "velis-if-du-an" ẩn khi
// bài không thuộc dự án nào. [contact-form-7 … du-an="{du_an}"] → trường ẩn du-an của form (lead ghi dự án).
function velis_pick_project( array $cands ) {
	usort( $cands, fn( $a, $b ) => (int) ! in_array( 34, $a['cats'], true ) <=> (int) ! in_array( 34, $b['cats'], true ) );
	return $cands[0] ?? null;
}

function velis_fill_tokens( $html, $p ) {
	$html = preg_replace_callback( '/\{du_an(?:\|([^}]*))?\}/u', fn( $m ) => $p ? $p['title'] : ( $m[1] ?? '' ), $html );
	$html = str_replace( '{du_an_link}', $p ? $p['link'] : '', $html );
	return $p ? $html : preg_replace( '/class="([^"]*\bvelis-if-du-an\b[^"]*)"/', 'class="$1" hidden', $html );
}

function velis_current_project() {
	static $p = false;
	if ( false !== $p ) {
		return $p;
	}
	$p = null;
	if ( ! is_singular( 'post' ) ) {
		return $p;
	}
	$id = get_queried_object_id();
	if ( array_intersect( array( 34, 57 ), wp_get_post_categories( $id ) ) ) { // trang dự án / phân khu: chính nó (thẻ cột phải "Nhận bảng giá {du_an}")
		return $p = array( 'title' => get_the_title( $id ), 'link' => get_permalink( $id ), 'cat' => 0, 'cats' => array_map( 'intval', wp_get_post_categories( $id ) ) );
	}
	foreach ( wp_get_post_categories( get_queried_object_id() ) as $cat ) {
		$cands = array();
		foreach ( get_posts( array( 'category__in' => array( 34, 57 ), 'numberposts' => 20, 'meta_key' => '_dt_post_options_related_categories', 'meta_value' => '"' . (int) $cat . '"', 'meta_compare' => 'LIKE' ) ) as $q ) {
			$cands[] = array( 'title' => get_the_title( $q ), 'link' => get_permalink( $q ), 'cat' => $cat, 'cats' => array_map( 'intval', wp_get_post_categories( $q->ID ) ) );
		}
		$p = velis_pick_project( $cands );
		if ( $p ) {
			break;
		}
	}
	return $p;
}

add_filter( 'widget_custom_html_content', fn( $html ) => str_contains( $html, '{du_an' ) ? velis_fill_tokens( $html, velis_current_project() ) : $html, 5 );
add_filter( 'widget_custom_html_content', fn( $html ) => str_contains( $html, '[' ) ? do_shortcode( $html ) : $html, 20 );
add_filter( 'shortcode_atts_wpcf7', function ( $out, $pairs, $atts ) {
	if ( isset( $atts['du-an'] ) ) {
		$out['du-an'] = sanitize_text_field( $atts['du-an'] );
	}
	return $out;
}, 10, 3 );

// Cuối bài (2026-11-26): The7 "Bài viết liên quan" (lấy bài cùng chuyên mục = cùng cụm, mới nhất, trừ bài đang đọc; mỗi bài blog đúng 1
// chuyên mục) → tiêu đề "Cùng chủ đề <dự án>" (không có dự án: tên cụm), 3 bài. The7 đọc Theme Options qua of_get_option → bộ lọc
// "dt_of_get_option-<khóa>"; số bài vẫn chỉnh được ở Theme Options → Blog (ô này chỉ thay tiêu đề).
function velis_related_title( $p, $cat_name ) {
	return 'Cùng chủ đề ' . ( $p ? $p['title'] : ( $cat_name ? $cat_name : 'này' ) );
}
add_filter( 'dt_of_get_option-general-rel_posts_head_title', function ( $title ) {
	if ( ! is_singular( 'post' ) ) {
		return $title;
	}
	$cat = get_the_category( get_queried_object_id() );
	return velis_related_title( velis_current_project(), $cat ? $cat[0]->name : '' );
} );

// "Cùng chủ đề" theo chuyên mục SÂU NHẤT (2026-11-26): truy vấn bài liên quan của The7 (trang bài viết, loại bài đang đọc qua post__not_in)
// mặc định lấy cả chuyên mục con (Spring Ville → kéo bài Persa Place) – chỉ lấy đúng chuyên mục của bài.
function velis_lien_quan_khong_con( $q ) {
	if ( $q->is_main_query() || ! is_singular( 'post' ) || ! in_array( get_queried_object_id(), array_map( 'intval', (array) $q->get( 'post__not_in' ) ), true ) ) {
		return;
	}
	$tq = $q->get( 'tax_query' );
	if ( is_array( $tq ) && $tq ) {
		foreach ( $tq as $k => $t ) {
			if ( is_array( $t ) && 'category' === ( $t['taxonomy'] ?? '' ) ) {
				$tq[ $k ]['include_children'] = false;
			}
		}
		$q->set( 'tax_query', $tq );
	}
	if ( $q->get( 'cat' ) ) {
		$q->set( 'category__in', array_map( 'intval', explode( ',', (string) $q->get( 'cat' ) ) ) );
		$q->set( 'cat', '' );
	}
}
add_action( 'pre_get_posts', 'velis_lien_quan_khong_con' );

// Bài đã hiện trên trang (The7 "Bài viết liên quan" cuối bài chạy trước sidebar) – danh sách sidebar không lặp lại.
add_action( 'the_post', function ( $post ) {
	$GLOBALS['velis_seen'][ $post->ID ] = true;
} );

// Chia danh sách: bài cùng dự án trước (tối đa $n), rồi bài mới cho đủ $n; bỏ bài đang đọc / đã hiện; không trùng giữa hai nhóm.
function velis_post_list_ids( array $same, array $recent, array $exclude, $n ) {
	$same   = array_slice( array_values( array_diff( $same, $exclude ) ), 0, $n );
	$recent = array_slice( array_values( array_diff( $recent, $exclude, $same ) ), 0, $n - count( $same ) );
	return array( $same, $recent );
}

add_shortcode( 'velis_bai_viet', function ( $atts ) {
	$n    = max( 1, (int) ( $atts['so'] ?? 5 ) );
	$id   = get_queried_object_id();
	$p    = velis_current_project();
	$ids  = fn( $args ) => get_posts( $args + array( 'numberposts' => $n + 40, 'fields' => 'ids', 'category__not_in' => array( 34, 57 ) ) );
	list( $same, $recent ) = velis_post_list_ids( $p ? $ids( array( 'category__in' => array( (int) $p['cat'] ) ) ) : array(), $ids( array() ), array_merge( array( $id ), array_keys( $GLOBALS['velis_seen'] ?? array() ) ), $n );
	$li  = function ( $pid ) {
		$cat = get_the_category( $pid );
		return '<li><a href="' . esc_url( get_permalink( $pid ) ) . '" tabindex="-1" aria-hidden="true">' . get_the_post_thumbnail( $pid, 'thumbnail', array( 'alt' => '', 'loading' => 'lazy', 'sizes' => '72px' ) ) . '</a><div>'
			. '<a class="velis-post-title" href="' . esc_url( get_permalink( $pid ) ) . '">' . esc_html( get_the_title( $pid ) ) . '</a>'
			. '<div class="entry-meta">' . ( $cat ? '<span>' . esc_html( $cat[0]->name ) . '</span>' : '' ) . '<time datetime="' . esc_attr( get_the_date( 'c', $pid ) ) . '">' . esc_html( get_the_date( 'd/m/Y', $pid ) ) . '</time></div></div></li>';
	};
	$out = '';
	foreach ( array( array( $same, $p ? 'Cùng dự án ' . $p['title'] : '' ), array( $recent, 'Bài mới' ) ) as list( $list, $title ) ) {
		if ( $list ) {
			$out .= '<div class="widget-title">' . esc_html( $title ) . '</div><ul class="velis-post-list">' . implode( '', array_map( $li, $list ) ) . '</ul>';
		}
	}
	return $out;
} );

// Khối liên hệ cuối trang (pre-footer): nội dung = widget area "Khối liên hệ cuối trang" (Giao diện → Tiện ích), in trước footer The7.
// Chỉ ở trang chưa có form riêng: bài viết (dự án: hàng CTA trong bài; blog: hộp CTA ở sidebar) và trang có [contact-form-7] hoặc
// phần tử "Velis · Nhận bảng giá" thì không – mỗi trang tối đa 1 form tư vấn.
function velis_prefoot_on( $is_post, $content ) {
	return ! $is_post && ! preg_match( '/\[(contact-form-7|velis_nhan_bang_gia)[\s\]]/', (string) $content );
}

add_action( 'widgets_init', function () {
	register_sidebar( array(
		'id'            => 'velis-lien-he-cuoi',
		'name'          => 'Khối liên hệ cuối trang',
		'description'   => 'Hiện trên footer ở trang chưa có form (trang chủ, danh sách, chuyên mục, Giới thiệu, tìm kiếm, 404). Không hiện ở bài viết và trang đã có form.',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<p class="velis-eyebrow">',
		'after_title'   => '</p>',
	) );
} );

add_action( 'presscore_after_main_container', function () {
	if ( ! is_active_sidebar( 'velis-lien-he-cuoi' ) || ! velis_prefoot_on( is_singular( 'post' ), is_singular() ? get_post_field( 'post_content', get_queried_object_id() ) : '' ) ) {
		return;
	}
	echo '<section class="velis-prefoot-wrap" aria-label="Liên hệ tư vấn"><div class="wf-wrap">';
	dynamic_sidebar( 'velis-lien-he-cuoi' );
	echo '</div></section>';
	do_action( 'velis_prefoot_shown' );
}, 5 );

// Bài viết – điện thoại: dòng "cụm · ngày · phút đọc" ngay dưới H1 (in đầu nội dung; velis.css chỉ hiện < 768 px, máy tính giữ dòng meta The7).
// Cụm = chuyên mục con đầu tiên (chuyên mục cha "Blog" bỏ qua); phút đọc = số chữ / 200, tối thiểu 1. Trang dự án (có velis-hero) không in.
function velis_reading_minutes( $raw ) {
	$text  = preg_replace( '/\[\/?[A-Za-z0-9_-]+[^\]]*\]/', ' ', (string) $raw ); // bỏ thẻ shortcode WPBakery, giữ chữ bên trong
	$words = preg_split( '/\s+/u', trim( html_entity_decode( strip_tags( $text ), ENT_QUOTES, 'UTF-8' ) ), -1, PREG_SPLIT_NO_EMPTY );
	return max( 1, (int) round( count( $words ) / 200 ) );
}

function velis_post_line( $cat, $date_iso, $date, $minutes, $sua = '' ) {
	return '<p class="velis-post-line">' . ( $cat ? '<span>' . esc_html( $cat ) . '</span>' : '' )
		. '<time datetime="' . esc_attr( $date_iso ) . '">' . esc_html( $date ) . '</time>' . $sua . '<span>' . (int) $minutes . ' phút đọc</span></p>';
}

// "Cập nhật dd/mm/yyyy" (ngày sửa, = schema dateModified của Rank Math) cạnh ngày đăng – chỉ khi sửa khác ngày đăng. The7 không có tùy chọn này.
function velis_ngay_sua( $id = null ) {
	return get_the_modified_date( 'Ymd', $id ) > get_the_date( 'Ymd', $id )
		? '<time class="velis-ngay-sua" datetime="' . esc_attr( get_the_modified_date( 'c', $id ) ) . '">Cập nhật ' . esc_html( get_the_modified_date( 'd/m/Y', $id ) ) . '</time>' : '';
}
// Dòng meta The7 (máy tính, cuối bài): thêm phần "Cập nhật" vào danh sách phần tử ngày / tác giả / chuyên mục.
add_filter( 'presscore_posted_on_parts', function ( $parts ) {
	if ( is_array( $parts ) && is_singular( 'post' ) && get_the_ID() === get_queried_object_id() && velis_ngay_sua() ) {
		$parts['velis_ngay_sua'] = velis_ngay_sua();
	}
	return $parts;
} );

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query() || get_the_ID() !== get_queried_object_id() || str_contains( $content, 'velis-hero' ) ) {
		return $content;
	}
	$cats = array_values( array_filter( get_the_category(), function ( $c ) { return $c->parent > 0; } ) );
	return velis_post_line( $cats ? $cats[0]->name : '', get_the_date( 'c' ), get_the_date( 'd/m/Y' ), velis_reading_minutes( get_post_field( 'post_content' ) ), velis_ngay_sua() ) . $content;
}, 5 );

// Font tự lưu (velis.css @font-face, thư mục fonts/): không tải Google Fonts của The7 ("dt-web-fonts" – Theme Options → Typography vẫn giữ
// tên Be Vietnam Pro / Playfair Display, trình duyệt dùng tệp trong theme con); tải sớm 2 tệp màn đầu (chữ thân 400, tiêu đề Playfair 600).
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'dt-web-fonts' );
	wp_deregister_style( 'dt-web-fonts' );
}, 100 );
add_filter( 'wp_resource_hints', fn( $urls, $rel ) => 'dns-prefetch' === $rel || 'preconnect' === $rel ? array_values( array_filter( $urls, fn( $u ) => ! str_contains( is_array( $u ) ? ( $u['href'] ?? '' ) : (string) $u, 'fonts.g' ) ) ) : $urls, 10, 2 );
add_action( 'wp_head', function () {
	foreach ( array( 'be-vietnam-pro-400', 'playfair-display-600' ) as $f ) {
		echo '<link rel="preload" href="' . esc_url( get_stylesheet_directory_uri() . '/fonts/' . $f . '.woff2' ) . '" as="font" type="font/woff2" crossorigin>' . "\n";
	}
}, 1 );
