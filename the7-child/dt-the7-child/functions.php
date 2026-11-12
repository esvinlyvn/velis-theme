<?php
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
	$url   = $here && did_action( 'velis_form_seen' ) ? '#velis-tu-van' : $m['velis_cta_url'];
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
	echo '<script>document.documentElement.classList.add("velis-cta-js")</script>';
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

// Contact Form 7 – every form (B3): Vietnamese mobile number (10 digits starting with 0; spaces and dots allowed), the error text is
// the form's own "invalid_tel" message (Liên hệ → Contact Form 7 → Thông báo); numeric phone keypad.
function velis_vn_phone_ok( $value ) {
	return (bool) preg_match( '/^0\d{9}$/', preg_replace( '/[\s.]/', '', (string) $value ) );
}

foreach ( array( 'wpcf7_validate_tel', 'wpcf7_validate_tel*' ) as $velis_hook ) {
	add_filter( $velis_hook, function ( $result, $tag ) {
		$value = isset( $_POST[ $tag->name ] ) ? sanitize_text_field( wp_unslash( $_POST[ $tag->name ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- CF7 verifies the submission
		if ( '' !== $value && ! velis_vn_phone_ok( $value ) ) {
			$result->invalidate( $tag, wpcf7_get_message( 'invalid_tel' ) );
		}
		return $result;
	}, 20, 2 );
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

// Small page script (no library): CF7 submit button shows "Đang gửi…" and cannot be pressed twice until CF7 answers; the one-line
// "chủ đầu tư · khu vực" label of a project card gets the full text as a tooltip when it is cut with "…".
function velis_page_script() {
	return '<script>(function(){document.addEventListener("submit",function(e){var f=e.target,b=f.querySelector&&f.querySelector(".wpcf7-submit");'
		. 'if(!b||!f.closest(".wpcf7"))return;if(b.disabled){e.preventDefault();e.stopImmediatePropagation();return}b.dataset.v=b.value;b.value="Đang gửi…";'
		. 'setTimeout(function(){b.disabled=true},0)},true);document.addEventListener("wpcf7submit",function(e){var b=e.target.querySelector(".wpcf7-submit");'
		. 'if(b&&b.dataset.v){b.value=b.dataset.v;b.disabled=false}});'
		. 'document.querySelectorAll(".velis-projects .entry-excerpt").forEach(function(x){var p=x.children;if(p.length>1)p[0].parentNode.title=p[0].textContent+" · "+p[1].textContent})})();</script>';
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
