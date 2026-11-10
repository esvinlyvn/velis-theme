<?php
/**
 * Components rendered from data with the mockup's markup and class names (mockup/src/pages.mjs; CSS in css/, shared with
 * the mockup). Every function returns escaped HTML.
 * Missing-data rules: empty field → element not rendered; price → "Chưa công bố"; no usable photo → named frame.
 */

defined( 'ABSPATH' ) || exit;

// Width of the main column of a 2-column page (content wrap − 340 px side column − 48 px gap); phones: wrap − gutters.
const VELIS_SIZES_MAIN = '(min-width: 768px) 576px, calc(100vw - 32px)'; // main column = --read (vòng sửa 2.1)
const VELIS_SIZES_CARD = '(min-width: 1600px) 424px, (min-width: 1024px) 384px, (min-width: 768px) calc(50vw - 36px), calc(100vw - 32px)'; // 3 cards in the frame: (1320 | 1200 − 2 × 24) / 3
const VELIS_SIZES_HERO_B = '(min-width: 1600px) 1320px, (min-width: 1248px) 1200px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)'; // = .wrap (NT-17)
const VELIS_CEO = array( 'name' => 'Vũ Xuân', 'role' => 'CEO Velis Realty', 'img' => 'assets/brand/ceo-vu-xuan-160.webp' );

/* ---------- Images (X-01, X-03, F-B: server side, the same for every screen and DPR) ---------- */

/** Printed mark of a photo (plugin velis-data, meta velis_mark): '' clean, 'cat' badge the crop hides, 'khong-che' it cannot. */
function velis_mark( int $id ): string {
	return $id ? (string) get_post_meta( $id, 'velis_mark', true ) : '';
}

/** A photo may stand for a record in a hero, a card or the side column (NT-23): not when its logo / text cannot be hidden. */
function velis_usable( int $id ): bool {
	return $id && 'khong-che' !== velis_mark( $id );
}

/** Focal point (F-B) as an object-position. */
function velis_focus( int $id ): string {
	return function_exists( 'velis_focus_css' ) ? velis_focus_css( $id ) : '50% 50%';
}

/**
 * Attachment image in a cover frame. A flagged photo ('cat', also 'khong-che' where it is still shown: gallery, content) is
 * cropped from the top-right corner (W-A: zoom 1.15, hero 1.12) so the badge printed bottom-left leaves the frame; a clean
 * photo is never cropped and sits on its focal point (X-03 = a, F-B).
 * $attr: sizes = the frame width per screen; ratio = frame width / height (a wider photo is fetched at the frame's height);
 * zoom = crop (1 = never: plans, logos); lcp = the page's main picture (X-01: file ≥ frame × DPR, a pick margin is added).
 * data-alt = a second size, tried by velis.js when the chosen file is broken.
 */
function velis_img( int $id, string $alt, string $size = 'large', array $attr = array() ): string {
	if ( ! $id ) {
		return '';
	}
	$marked = '' !== velis_mark( $id ) && ( $attr['zoom'] ?? 1.15 ) > 1;
	$z      = $marked ? (float) ( $attr['zoom'] ?? 1.15 ) : 1;
	$k      = velis_cover_k( $id, (float) ( $attr['ratio'] ?? 4 / 3 ) );
	$lcp    = ! empty( $attr['lcp'] );
	$out    = array(
		'sizes'    => velis_sizes( $attr['sizes'] ?? VELIS_SIZES_CARD, $z * $k, $lcp ),
		'alt'      => $alt,
		'loading'  => $lcp ? 'eager' : 'lazy',
		'class'    => $marked ? 'is-marked' : '',
		'style'    => $marked ? '--zoom: ' . $z : '--focus: ' . velis_focus( $id ),
		'data-alt' => (string) wp_get_attachment_image_url( $id, 'large' ),
	) + ( $lcp ? array( 'fetchpriority' => 'high' ) : array() );
	unset( $attr['zoom'], $attr['ratio'], $attr['lcp'], $attr['sizes'] );
	$all = $attr + $out;
	if ( '' === $all['class'] ) {
		unset( $all['class'] );
	}
	return wp_get_attachment_image( $id, $size, false, $all );
}

/** How much wider than its frame a photo must be fetched when it is cropped (cover) into a frame of $ratio (w/h). */
function velis_cover_k( int $id, float $ratio ): float {
	$m = wp_get_attachment_metadata( $id );
	return empty( $m['height'] ) ? 1 : round( max( 1, $m['width'] / $m['height'] / $ratio ), 3 );
}

/** Card photo, or a placeholder that velis_grid() turns into the named frame when other cards of the group have a photo. */
function velis_media( int $id, string $name, string $class = 'card__media', string $label = '', string $sizes = VELIS_SIZES_CARD ): string {
	$label = $label ?: $name;
	if ( $id && ! velis_usable( $id ) ) {
		return velis_media_empty( $label ); // logo / printed text the crop cannot hide: the named frame (NT-23)
	}
	return $id ? '<div class="' . esc_attr( $class ) . '" data-name="' . esc_attr( $label ) . '">' . velis_img( $id, $name, 'medium_large', array( 'sizes' => $sizes ) ) . '</div>'
		: '<span hidden data-nomedia="' . esc_attr( $label ) . '"></span>';
}

/** Named fallback frame, same ratio as a photo. */
function velis_media_empty( string $label ): string {
	return '<div class="card__media card__media--empty"><span>' . esc_html( $label ) . '</span></div>';
}

function velis_price_html( string $price, string $prefix = 'Giá ' ): string {
	return '' === $price ? '<p class="card__text">Giá: chưa công bố</p>' : '<p class="card__text">' . esc_html( $prefix . $price ) . '</p>';
}

/** The card's single link line, pinned to the card bottom (.card__more, 2.2 (2)). */
function velis_more( string $t ): string {
	return '<span class="card__more" aria-hidden="true">' . esc_html( $t ) . ' →</span>';
}

/** Section header: eyebrow → H2 → lead; an action (text link / button) on the right turns it into a row. */
function velis_sechead( string $title, string $eyebrow = '', string $lead = '', string $id = '', string $action = '' ): string {
	return '<header class="sechead' . ( $action ? ' sechead--row' : '' ) . '"><div>' . ( $eyebrow ? '<p class="eyebrow">' . esc_html( $eyebrow ) . '</p>' : '' )
		. '<h2' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '>' . esc_html( $title ) . '</h2>'
		. ( $lead ? '<p>' . esc_html( $lead ) . '</p>' : '' ) . '</div>' . $action . '</header>';
}

/** $class: section modifiers of the layout layer (section--tint, section--soft, section--tight, section--dark). */
function velis_section( string $inner, string $id = '', string $class = '' ): string {
	return '<section class="section ' . esc_attr( $class ) . '"' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '><div class="wrap">' . $inner . '</div></section>';
}

/* ---------- Cards ---------- */

/** Top-level region slugs of a record (filters: home area tabs, /du-an/?khu=). */
function velis_region_slugs( $p ): array {
	$out = array();
	foreach ( velis_terms( $p, 'khu-vuc' ) ?: velis_terms( velis_root( $p ), 'khu-vuc' ) as $t ) {
		$top               = $t->parent ? get_term( $t->parent, 'khu-vuc' ) : $t;
		$out[ $t->slug ]   = true;
		$out[ $top->slug ] = true;
	}
	return array_keys( $out );
}

/**
 * Project card (mockup): photo, label "developer · region", serif name, 1–2 lines (product types, handover), one link.
 * $mode: '' | true (listing filter data) | 'zone' (phân khu: scale, types, handover; data-loai) | 'embed' (row in text).
 */
function velis_card_project( $p, string $kicker = '', $mode = '' ): string {
	$p      = get_post( $p );
	$name   = $p->post_title;
	$level  = velis_level( $p );
	$devs   = velis_developers( $p );
	$status = velis_status( $p );
	$types  = velis_type_names( $p );
	$hand   = (string) get_post_meta( $p->ID, 'velis_handover', true );
	$price  = velis_price( $p );
	$data   = '';
	if ( 'zone' === $mode ) {
		$data = sprintf( ' data-loai="%s"', esc_attr( implode( ' ', array_keys( $types ) ) ) );
	} elseif ( true === $mode ) {
		$data = sprintf( ' data-card data-khu="%s" data-cdt="%s" data-loai="%s" data-tt="%s"', esc_attr( implode( ' ', velis_region_slugs( $p ) ) ), esc_attr( implode( ' ', wp_list_pluck( $devs, 'post_name' ) ) ), esc_attr( implode( ' ', array_keys( $types ) ) ), esc_attr( sanitize_title( $status ) ) );
	}
	$lines = array();
	if ( 'zone' === $mode ) {
		$lines[] = velis_short( (string) get_post_meta( $p->ID, 'velis_scale', true ), 60 );
		$lines[] = implode( ', ', array_merge( wp_list_pluck( velis_lines( $p ), 'name' ), array_map( 'velis_short_name', velis_children( $p, 'thap-tang' ) ) ) ?: $types );
	} elseif ( 'thap-tang' === $level ) {
		$lines[] = implode( ' · ', array_filter( array_slice( velis_facts( $p ), 0, 3 ) ) );
	} else {
		$lines[] = implode( ', ', $types ); // as the mockup card: product types only (the phân khu count is on the project page)
	}
	// vòng bố cục 5.1: one project card everywhere – label → name → product types → handover (always shown) → link
	$lines[] = 'zone' === $mode || 'thap-tang' === $level ? ( '' !== $price ? 'Giá ' . $price : '' ) : '';
	$lines[] = $hand ? velis_label_value( 'Bàn giao', velis_short( $hand, 32 ) ) : 'Bàn giao: chưa công bố';
	if ( ! $kicker && ! in_array( $mode, array( 'zone', 'embed' ), true ) && 'thap-tang' !== $level ) {
		$kicker = implode( ' · ', array_filter( array( implode( ', ', wp_list_pluck( $devs, 'post_title' ) ), velis_region_label( $p ) ) ) );
	}
	$img  = velis_image_id( $p );
	$more = 'thap-tang' === $level ? 'Xem ' . mb_strtolower( velis_short_name( $p ) ) : ( 'phan-khu' === $level ? 'Xem phân khu' : 'Xem dự án' );
	$head = 'embed' === $mode ? 'p' : 'h3';
	return '<article class="card"' . $data . '>' . ( 'embed' === $mode && ! $img ? '' : velis_media( $img, $name ) )
		. '<div class="card__body">' . ( $kicker ? '<p class="eyebrow">' . esc_html( $kicker ) . '</p>' : '' )
		. "<$head class=\"card__title\"><a href=\"" . esc_url( get_permalink( $p ) ) . '">' . esc_html( $name ) . "</a></$head>"
		. implode( '', array_map( fn( $l ) => '<p class="card__text">' . esc_html( $l ) . '</p>', array_filter( $lines ) ) )
		. velis_more( $more ) . '</div></article>';
}

/** Developers with at least one project Velis advises on – the one source of every developer count (2.10). */
function velis_active_developers(): array {
	static $cache = null;
	return $cache ??= array_values( array_filter( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 100, 'orderby' => 'title', 'order' => 'ASC' ) ), fn( $d ) => velis_developer_projects( $d ) ) );
}

/** Developer card (2.10): logo (same area rule as the partner row) + name + project count + regions + link; no repeated label. */
function velis_card_developer( $d ): string {
	$d       = get_post( $d );
	$projs   = velis_developer_projects( $d );
	$regions = array_unique( array_filter( array_map( 'velis_region_label', $projs ) ) );
	$meta    = implode( ' · ', array_filter( array( $projs ? count( $projs ) . ' dự án đang tư vấn' : '', implode( ', ', $regions ) ) ) );
	$logo    = velis_dev_logo( $d );
	// vòng bố cục 5.3: the project card's 4:3 frame – the logo centred in it (area rule 2.9), or the name as a fallback frame
	return '<article class="card">' . ( $logo ? '<div class="card__media card__media--logo">' . $logo . '</div>' : velis_media_empty( $d->post_title ) ) . '<div class="card__body"><h3 class="card__title"><a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a></h3>'
		. ( $meta ? '<p class="card__text">' . esc_html( $meta ) . '</p>' : '' ) . velis_more( 'Xem chủ đầu tư' ) . '</div></article>';
}

/** Post card (mockup .card--post): photo, label, title (body font), "author · date · minutes", "Đọc bài →" pinned bottom. */
function velis_card_post( $p, bool $filter_data = false, string $mode = '' ): string {
	$p     = get_post( $p );
	$kind  = velis_post_kind( $p );
	$data  = $filter_data ? sprintf( ' data-card data-kind="%s" data-pk="%s"', esc_attr( $kind ), esc_attr( implode( ' ', wp_list_pluck( velis_post_projects( $p ), 'post_name' ) ) ) ) : '';
	$h     = 'feature' === $mode ? 'h2' : 'h3';
	$label = velis_post_label( $p );
	$thumb = (int) get_post_thumbnail_id( $p );
	return '<article class="card card--post' . ( 'feature' === $mode ? ' card--wide' : '' ) . '"' . $data . '>'
		. ( $thumb ? velis_media( $thumb, get_the_title( $p ), 'card__media', $label ?: get_the_title( $p ), 'feature' === $mode ? '(min-width: 768px) min(55vw - 40px, 660px), calc(100vw - 32px)' : VELIS_SIZES_CARD ) : velis_media_empty( $label ?: get_the_title( $p ) ) )
		. '<div class="card__body">' . ( $label ? '<p class="eyebrow">' . esc_html( $label ) . '</p>' : '' )
		. "<$h class=\"card__title\"><a href=\"" . esc_url( get_permalink( $p ) ) . '">' . esc_html( get_the_title( $p ) ) . "</a></$h>"
		. '<p class="card__meta"><span>' . implode( '</span> · <span>', array_map( 'esc_html', array( get_the_author_meta( 'display_name', $p->post_author ), get_the_date( 'd/m/Y', $p ), velis_reading_minutes( $p ) . ' phút đọc' ) ) ) . '</span></p>'
		. ( 'feature' === $mode && $p->post_excerpt ? '<p class="card__text">' . esc_html( velis_short( $p->post_excerpt, 220 ) ) . '</p>' : '' )
		. velis_more( 'Đọc bài' ) . '</div></article>';
}

/** "Tất cả bài về {cụm}": a text link under a post grid (no extra card – a grid never has an empty cell, X-06). */
function velis_all_posts_card( WP_Term $cat ): string {
	return '<p class="more-center"><a class="btn btn--line" href="' . esc_url( get_category_link( $cat ) ) . '">Tất cả bài về ' . esc_html( $cat->name ) . '</a></p>';
}

/**
 * Card grid: the column count follows the number of cards (data-n, 3-layout.css) so no row has an empty cell (X-06).
 * Placeholders become named frames when another card of the grid has a photo, and are dropped when none has.
 * $mod: '' | 'three' (3 columns from 1024 for 6 cards) | 'zones'; other values of older callers are ignored.
 */
function velis_grid( array $cards, string $mod = '', string $attrs = '' ): string {
	$after = implode( '', array_filter( $cards, fn( $c ) => str_starts_with( $c, '<p class="more-center">' ) ) ); // "Tất cả bài …" goes under the grid
	$cards = array_values( array_filter( $cards, fn( $c ) => ! str_starts_with( $c, '<p class="more-center">' ) ) );
	$any   = (bool) array_filter( $cards, fn( $c ) => str_contains( $c, 'class="card__media"' ) );
	$cards = array_map( fn( $c ) => preg_replace_callback( '#<span hidden data-nomedia="([^"]*)"></span>#', fn( $m ) => $any ? velis_media_empty( html_entity_decode( $m[1], ENT_QUOTES ) ) : '', $c ), $cards );
	// 2.5: cards with a photo first, named fallback frames after (stable inside each group)
	$cards = array_merge( array_values( array_filter( $cards, fn( $c ) => ! str_contains( $c, 'card__media--empty' ) ) ), array_values( array_filter( $cards, fn( $c ) => str_contains( $c, 'card__media--empty' ) ) ) );
	$cls   = array( 'three' => ' grid--three', 'zones' => ' zones' )[ $mod ] ?? '';
	$n     = count( $cards );
	foreach ( $cards as $i => $c ) { // a card wider than a third of the frame needs a bigger file (NT-21): sizes from its real column span
		$rules = str_contains( $attrs, 'data-live' ) ? '' : velis_grid_sizes( $n, $i ); // filterable grid: every card is a third of the frame (2.1)
		$cards[ $i ] = $rules ? preg_replace_callback( '#(<div class="card__media"[^>]*><img\b[^>]*?\s)sizes="([^"]*)"#', fn( $m ) => $m[1] . 'sizes="' . esc_attr( velis_sizes( $rules, preg_match( '/calc\(([\d.]+) \* \(/', $m[2], $z ) ? (float) $z[1] : 1 ) ) . '"', $c, 1 ) : $c;
	}
	return $cards ? '<div class="grid' . $cls . '" data-n="' . $n . '"' . $attrs . '>' . implode( '', $cards ) . '</div>' . $after : '';
}

/**
 * Photo width of card $i in a grid of $n cards (layout rules of css/3-layout.css, frame 1200 | 1320 px, gap 24 px), '' for an
 * ordinary third-of-the-frame card (VELIS_SIZES_CARD). Upper bounds: inside the main column of a 2-column page the card is narrower.
 */
function velis_grid_sizes( int $n, int $i ): string {
	$frame = '(min-width: 1600px) 1320px, (min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)';
	if ( 1 === $n ) {
		return '(min-width: 1600px) 707px, (min-width: 1280px) 642px, (min-width: 768px) calc(54.6vw - 39px), calc(100vw - 32px)'; // wide card: photo = 1.2fr of 2.2
	}
	if ( 5 === $n && 0 === $i ) {
		return '(min-width: 1600px) 872px, (min-width: 1280px) 792px, (min-width: 768px) calc(66.7vw - 40px), calc(100vw - 32px)'; // 2 of 3 columns
	}
	if ( in_array( $n, array( 7, 11 ), true ) && 0 === $i ) {
		return $frame; // full row
	}
	if ( in_array( $n, array( 2, 4, 6, 7, 8, 10, 11, 12 ), true ) ) {
		return '(min-width: 1600px) 648px, (min-width: 1280px) 588px, (min-width: 768px) calc(50vw - 36px), calc(100vw - 32px)'; // half the frame
	}
	return '';
}

/* ---------- Heroes ---------- */

/**
 * Project / phân khu hero (mockup): one structure, two frames chosen from the FILE (X-02): ≥ 1920 px wide → A (full
 * frame, one left → right gradient), smaller → B (framed photo on the Velis ground, text below). A photo whose logo / text
 * the crop cannot hide → B with the named frame (NT-23). Testing only: ?velis_hero=a|b on the staging host.
 * $a: img, title, h1, eyebrow (HTML), lead, chips, buttons, alt.
 */
function velis_hero_a( array $a ): string {
	$id   = (int) ( $a['img'] ?? 0 );
	$meta = $id ? wp_get_attachment_metadata( $id ) : array();
	$use  = velis_usable( $id );
	$kind = $use && ( $meta['width'] ?? 0 ) >= 1920 ? 'a' : 'b';
	$test = isset( $_GET['velis_hero'] ) && 'staging.velisrealty.vn' === wp_parse_url( home_url(), PHP_URL_HOST ) ? sanitize_key( wp_unslash( $_GET['velis_hero'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification -- read-only display switch
	$kind = $use && in_array( $test, array( 'a', 'b' ), true ) ? $test : $kind;
	$k    = $id ? velis_cover_k( $id, 4 / 3 ) : 1; // phones: 4:3 frame for both kinds
	$sz   = 'a' === $kind ? '(min-width: 768px) 100vw, calc(' . $k . ' * 100vw)' : '(min-width: 1600px) 1320px, (min-width: 1248px) 1200px, (min-width: 768px) calc(100vw - 48px), calc(' . $k . ' * (100vw - 32px))';
	$img  = $use ? velis_img( $id, $a['alt'] ?? $a['title'], 'full', array( 'lcp' => true, 'zoom' => 1.12, 'ratio' => 1e9, 'sizes' => $sz ) ) : '';
	$tag  = empty( $a['h1'] ) ? 'p' : 'h1';
	$chip = array_filter( $a['chips'] ?? array() );
	return '<section class="hero hero--' . $kind . '"' . ( 'h1' === $tag ? ' aria-labelledby="h1"' : '' ) . '>'
		. ( $img ? '<figure class="hero__media">' . $img . '</figure>' : '<figure class="hero__media card__media--empty"><span>' . esc_html( $a['title'] ) . '</span></figure>' )
		. '<div class="hero__body wrap">' . ( ! empty( $a['eyebrow'] ) ? '<p class="eyebrow">' . $a['eyebrow'] . '</p>' : '' )
		. "<$tag" . ( 'h1' === $tag ? ' id="h1"' : '' ) . '>' . esc_html( $a['title'] ) . "</$tag>"
		. ( ! empty( $a['lead'] ) ? '<p class="hero__lead">' . esc_html( $a['lead'] ) . '</p>' : '' )
		. ( $chip ? '<ul class="chips" aria-label="Thông tin chính"><li>' . implode( '</li><li>', array_map( 'esc_html', $chip ) ) . '</li></ul>' : '' )
		. ( ! empty( $a['buttons'] ) ? '<div class="actions">' . $a['buttons'] . '</div>' : '' ) . '</div></section>';
}

/**
 * Home hero = the staging 0.9.8 hero, kept (duyệt 2026-11-06, X-02 exception: always full-bleed): photo + text left + the
 * "Dự án nổi bật" strip. Only the overlay (one gradient, CSS) and the strip (NT-10) changed.
 */
function velis_hero_home( array $a ): string {
	$id  = (int) $a['img'];
	$img = $id ? wp_get_attachment_image( $id, 'full', false, array( 'class' => 'hero__img', 'alt' => $a['alt'], 'fetchpriority' => 'high', 'loading' => 'eager',
		'sizes' => velis_sizes( '(max-width: 767px) ' . velis_cover_k( $id, 4 / 3 ) . ' * 100vw, 100vw', 1.12, true ),
		'style' => '--focus: 85% 30%; --focus-m: 72% 0%; --zoom: 1.12', 'data-alt' => (string) wp_get_attachment_image_url( $id, 'large' ) ) ) : '';
	return '<section class="hero hero--home" aria-label="' . esc_attr( $a['title'] ) . '">' . $img
		. '<div class="hero__body"><p class="eyebrow">' . esc_html( $a['eyebrow'] ) . '</p><h1 id="h1">' . esc_html( $a['title'] ) . '</h1>'
		. '<p class="hero__lead">' . esc_html( $a['lead'] ) . '</p><div class="actions">' . $a['buttons'] . '</div></div>'
		. ( $a['after'] ? '<div class="hero__after">' . $a['after'] . '</div>' : '' ) . '</section>';
}

/** Featured projects inside the home hero (NT-10): photo, name on one line, region (may wrap); arrows, no autoplay. */
function velis_feature_strip( array $projects ): string {
	$li = array_map( function ( $p ) {
		$meta = implode( ' · ', array_filter( array( velis_region_label( $p ), velis_status( $p ) ) ) );
		return '<li><a class="feat" href="' . esc_url( get_permalink( $p ) ) . '"><span class="feat__img">' . velis_img( velis_image_id( $p ), 'Phối cảnh ' . $p->post_title, 'medium', array( 'lcp' => true, 'sizes' => '72px', 'ratio' => 13 / 9 ) ) . '</span>'
			. '<span><b>' . esc_html( $p->post_title ) . '</b>' . ( $meta ? '<small>' . esc_html( $meta ) . '</small>' : '' ) . '</span></a></li>';
	}, $projects );
	$nav = '<span class="feats__nav" hidden><button type="button" data-feats="-1" aria-label="Dự án trước"><span aria-hidden="true">‹</span></button><button type="button" data-feats="1" aria-label="Dự án sau"><span aria-hidden="true">›</span></button></span>';
	return $li ? '<div class="feats"><div class="feats__head"><p class="eyebrow">Dự án nổi bật</p>' . $nav . '</div><div class="feats__row"><ul>' . implode( '', $li ) . '</ul></div></div>' : '';
}

/** Index pages (Dự án, Chủ đầu tư, Blog …): hero B – framed photo when there is one, text below. $a: title, eyebrow, lead, img, buttons, after. */
function velis_hero_b( array $a ): string {
	$id  = (int) ( $a['img'] ?? 0 );
	$k   = $id ? velis_cover_k( $id, 4 / 3 ) : 1; // phones: 4:3 frame – a wider photo is fetched at the frame's height
	$fig = velis_usable( $id ) ? '<figure class="hero__media">' . velis_img( $id, $a['alt'] ?? '', 'large', array( 'lcp' => true, 'ratio' => 1e9, 'sizes' => str_replace( 'calc(100vw - 32px)', 'calc(' . $k . ' * (100vw - 32px))', VELIS_SIZES_HERO_B ) ) ) . '</figure>' : '';
	return '<section class="hero hero--b" aria-labelledby="h1">' . $fig . '<div class="hero__body wrap">'
		. ( ! empty( $a['eyebrow'] ) ? '<p class="eyebrow">' . esc_html( $a['eyebrow'] ) . '</p>' : '' )
		. '<h1 id="h1">' . esc_html( $a['title'] ) . '</h1>'
		. ( ! empty( $a['lead'] ) ? '<p class="hero__lead">' . esc_html( $a['lead'] ) . '</p>' : '' )
		. ( ! empty( $a['buttons'] ) ? '<div class="actions">' . $a['buttons'] . '</div>' : '' ) . ( $a['after'] ?? '' ) . '</div></section>';
}

/* ---------- Side column ---------- */

/**
 * "Velis tư vấn dự án này" (mockup .advisor): CEO, the record's name, 2–4 facts, Nhận bảng giá (opens the short form in
 * place; the link to #tu-van is the no-JS path), call, Zalo. Side column ≥ 1024; $inline = the copy after the facts bar (< 1024).
 */
function velis_advisor( $p, bool $inline = false ): string {
	$p    = get_post( $p );
	$name = $p->post_title;
	$hand = (string) get_post_meta( $p->ID, 'velis_handover', true );
	$rows = array_filter( array( 'Loại sản phẩm' => implode( ', ', velis_type_names( $p ) ), 'Giá từ' => velis_price( $p ), 'Bàn giao' => $hand ? velis_short( $hand, 32 ) : '' ) );
	$dl   = implode( '', array_map( fn( $k, $v ) => '<div><dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd></div>', array_keys( $rows ), $rows ) );
	return '<div class="advisor' . ( $inline ? ' advisor--inline' : '' ) . '"><p class="eyebrow">Velis tư vấn dự án này</p>'
		. '<div class="advisor__who"><span class="advisor__img"><img src="' . esc_url( get_theme_file_uri( VELIS_CEO['img'] ) ) . '" width="80" height="80" alt=""></span><p><b>' . esc_html( VELIS_CEO['name'] ) . '</b><span>' . esc_html( VELIS_CEO['role'] ) . '</span></p></div>'
		. '<p class="pricecard__title">' . esc_html( $name ) . '</p>' . ( $dl ? '<dl>' . $dl . '</dl>' : '' )
		. velis_btn( 'Nhận bảng giá', '#tu-van', '', ' data-interest="' . esc_attr( $name ) . '" data-open-form aria-expanded="false"' ) . '<div data-mini-form hidden>' . velis_form_tag( $name, 'mini' ) . '</div>'
		. velis_call_btn( 'line' ) . velis_btn( 'Zalo', VELIS_ZALO, 'line', ' rel="noopener" target="_blank"' ) . velis_role_sentence( $p ) . '</div>';
}

/** Role sentence (approved 2026-11-06): last line of the advisor block; hidden when no developer is known. */
function velis_role_sentence( $p ): string {
	$devs = velis_developers( $p ) ?: velis_developers( velis_root( $p ) );
	return $devs ? '<p class="advisor__role">Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là ' . esc_html( implode( ', ', wp_list_pluck( $devs, 'post_title' ) ) ) . '.</p>' : '';
}

/** Kept name for older callers: the side column of a project page is the advisor card. */
function velis_price_card( $p ): string {
	return '<aside class="page__side" aria-label="Velis tư vấn dự án này">' . velis_advisor( $p ) . '</aside>';
}

/** Side card of text pages: contact Velis, or ('cv') apply for a job – the advisor component without the record. */
function velis_contact_card( string $mode = 'contact', string $mail = '' ): string {
	$cv   = 'cv' === $mode;
	$rows = array( 'Hotline' => '<a href="tel:' . VELIS_PHONE_TEL . '">' . VELIS_PHONE . '</a>', 'Email' => '<a href="mailto:' . VELIS_EMAIL . '">' . VELIS_EMAIL . '</a>', 'Văn phòng' => esc_html( VELIS_ADDRESS ) );
	$dl   = implode( '', array_map( fn( $k, $v ) => '<div><dt>' . $k . '</dt><dd>' . $v . '</dd></div>', array_keys( $rows ), $rows ) );
	return '<aside class="page__side" aria-label="' . ( $cv ? 'Ứng tuyển' : 'Liên hệ Velis' ) . '"><div class="advisor"><p class="eyebrow">' . ( $cv ? 'Ứng tuyển' : 'Liên hệ Velis' ) . '</p>'
		. '<p class="pricecard__title">' . ( $cv ? 'Gửi CV cho Velis Realty' : 'Velis Realty' ) . '</p>' . ( $cv ? '<p>Gửi CV qua email hoặc để lại số điện thoại, Velis liên hệ hẹn phỏng vấn.</p>' : '<dl>' . $dl . '</dl>' )
		. ( $cv ? velis_btn( 'Gửi CV qua email', $mail ) . velis_btn( 'Điền form ứng tuyển', '#tu-van', 'line' ) : velis_btn( 'Nhận tư vấn', '#tu-van' ) . velis_btn( 'Nhắn Zalo', VELIS_ZALO, 'line', ' rel="noopener" target="_blank"' ) )
		. '</div></aside>';
}

/** One line of links to the projects Velis advises on (answers "what do they sell" on contact / about pages). */
function velis_project_links(): string {
	$p = velis_top_projects();
	// a row of chips (existing component, 44 px tap targets – NT-86) instead of inline links in a sentence
	return $p ? '<p class="muted mb-0">Dự án đang tư vấn</p><div class="actions">' . implode( '', array_map( fn( $x ) => '<a class="chip" href="' . esc_url( get_permalink( $x ) ) . '">' . esc_html( $x->post_title ) . '</a>', $p ) ) . '</div>' : '';
}

/** Side card of the about page: what Velis advises on – the advisor component with a link list. */
function velis_highlight_card(): string {
	$projs = velis_top_projects();
	$devs  = velis_active_developers();
	$list  = velis_sidelist( array_map( fn( $p ) => array( get_permalink( $p ), $p->post_title, velis_region_label( $p ) ), $projs ) );
	return '<aside class="page__side" aria-label="Dự án Velis đang tư vấn"><div class="advisor"><p class="eyebrow">Đang tư vấn</p><p class="pricecard__title">' . count( $projs ) . ' dự án · ' . count( $devs ) . ' chủ đầu tư</p>'
		. $list . velis_btn( 'Xem tất cả dự án', (string) get_post_type_archive_link( 'du-an' ), 'line' ) . '</div></aside>';
}

/** Side-column list (vòng bố cục 5.5): one item a line, the whole row is the link, name (not underlined) + info under it. $items: [url, name, info]. */
function velis_sidelist( array $items ): string {
	$li = array_map( fn( $i ) => '<li><a href="' . esc_url( $i[0] ) . '"><b>' . esc_html( $i[1] ) . '</b>' . ( empty( $i[2] ) ? '' : '<span>' . esc_html( $i[2] ) . '</span>' ) . '</a></li>', $items );
	return $li ? '<ul class="sidelist">' . implode( '', $li ) . '</ul>' : '';
}

/**
 * Construction photos (tiến độ) as a card grid as wide as the text column; each opens the lightbox. Columns follow the
 * count (X-06, data-n); caption = the date when there is one.
 */
function velis_photo_grid( array $imgs ): string {
	$li = array();
	$n  = count( $imgs );
	foreach ( array_values( $imgs ) as $i => list( $id, $cap ) ) {
		$alt  = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
		$cap  = velis_auto_caption( $cap ) ? '' : $cap;
		$li[] = '<figure class="card"><button class="card__media" type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( $id, 'large' ) ) . '" aria-label="' . esc_attr( 'Phóng to: ' . ( $alt ?: $cap ?: 'ảnh tiến độ' ) ) . '">'
			. velis_img( $id, $alt ?: $cap, 'large', array( 'sizes' => velis_grid_sizes( $n, $i ) ?: VELIS_SIZES_CARD ) ) . '</button>' . ( $cap ? '<figcaption class="card__meta">' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure>';
	}
	return $li ? '<div class="grid" data-n="' . count( $li ) . '">' . implode( '', $li ) . '</div>' . velis_lightbox() : '';
}

/* ---------- Buttons, breadcrumb, section tabs ---------- */

/** $mod: '' primary (solid red) | 'line' secondary (outline) | 'text'. Older names map: ghost/secondary → line. */
function velis_btn( string $label, string $url, string $mod = '', string $extra = '' ): string {
	$mod = in_array( $mod, array( 'ghost', 'secondary' ), true ) ? 'line' : $mod;
	return '<a class="btn' . ( $mod ? ' btn--' . $mod : '' ) . '" href="' . esc_url( $url ) . '"' . $extra . '>' . esc_html( $label ) . '</a>';
}

function velis_call_btn( string $mod = 'line' ): string {
	return velis_btn( 'Gọi ' . VELIS_PHONE, 'tel:' . VELIS_PHONE_TEL, $mod );
}

/** Page title as shown (H1, breadcrumb): the site-name suffix of old page titles ("Tuyển dụng – Velis Realty") is dropped (2.13). */
function velis_display_title( string $t ): string {
	return trim( preg_replace( '/\s+[–-]\s+Velis Realty$/u', '', html_entity_decode( $t, ENT_QUOTES, 'UTF-8' ) ) );
}

function velis_breadcrumb_html( array $trail, bool $wrap = true ): string {
	if ( count( $trail ) < 2 ) {
		return '';
	}
	$li   = array();
	$last = count( $trail ) - 1;
	foreach ( $trail as $i => list( $name, $url ) ) {
		$name = velis_display_title( (string) $name );
		$li[] = $i === $last ? '<li aria-current="page">' . esc_html( $name ) . '</li>' : '<li><a href="' . esc_url( $url ) . '">' . esc_html( $name ) . '</a></li>';
	}
	$ol = '<ol class="crumbs">' . implode( '', $li ) . '</ol>';
	return $wrap ? '<nav class="wrap" aria-label="Đường dẫn">' . $ol . '</nav>' : '<nav aria-label="Đường dẫn">' . $ol . '</nav>';
}

/** Sticky section tabs under the header: only sections that have content; the one in view is highlighted (velis.js). */
function velis_section_nav( array $sections ): string {
	if ( count( $sections ) < 2 ) {
		return '';
	}
	$li = '';
	foreach ( $sections as $id => $label ) {
		$li .= '<li><a href="#' . esc_attr( $id ) . '">' . esc_html( $label ) . '</a></li>';
	}
	return '<nav class="tabs" aria-label="Mục trong trang" data-secnav><div class="wrap"><ul>' . $li . '</ul></div></nav>';
}

/* ---------- Project data blocks ---------- */

/**
 * Facts bar (mockup .facts): full values (NT-66), cells per row by frame width (NT-67, data-n); "Chi tiết" links a value to
 * its section ($more: label => #anchor). $price null: not a project, no price cell; '' → "Chưa công bố".
 */
function velis_facts_html( array $facts, ?string $price, string $note = '', array $more = array() ): string {
	if ( null !== $price ) {
		$at    = array_search( 'Vị trí', array_keys( $facts ), true ); // right before Vị trí, as in the mockup
		$at    = false === $at ? 3 : $at;
		$facts = array_slice( $facts, 0, $at, true ) + array( 'Giá' => '' === $price ? null : $price ) + $facts;
	}
	$cells = '';
	$n     = 0;
	// as the mockup: handover as short as on the side card (the full sentence is in Tổng quan), legal text without its own label
	if ( ! empty( $facts['Bàn giao'] ) ) {
		$facts['Bàn giao'] = velis_short( (string) $facts['Bàn giao'], 32 );
	}
	if ( ! empty( $facts['Pháp lý'] ) ) {
		$facts['Pháp lý'] = preg_replace( '/^Hình thức sở hữu:\s*/u', '', (string) $facts['Pháp lý'] );
	}
	foreach ( $facts as $k => $v ) {
		if ( null !== $v && '' === trim( (string) $v ) ) {
			continue;
		}
		$n++;
		$cells .= '<div class="facts__item"><dt>' . esc_html( $k ) . '</dt>' . ( null === $v ? '<dd class="is-missing">Chưa công bố</dd>'
			: '<dd>' . esc_html( trim( preg_replace( '/\s+/u', ' ', (string) $v ) ) ) . ( isset( $more[ $k ] ) ? ' <a class="facts__more" href="' . esc_attr( $more[ $k ] ) . '">Chi tiết</a>' : '' ) . '</dd>' ) . '</div>';
	}
	return '<section class="wrap facts" aria-label="Thông tin chính"><dl class="facts__list" data-n="' . $n . '">' . $cells . '</dl>' . ( $note ? '<p class="source">' . esc_html( $note ) . '</p>' : '' ) . '</section>';
}

/** Area of an apartment line: net (thông thủy) is the main number, gross (tim tường) secondary. */
function velis_line_area( array $l ): string {
	$net   = velis_has_data() ? velis_range( $l['net_from'] ?? '', $l['net_to'] ?? '', 'm²' ) : '';
	$gross = velis_has_data() ? velis_range( $l['gross_from'] ?? '', $l['gross_to'] ?? '', 'm²' ) : '';
	return velis_area( $net, $gross );
}

/**
 * Apartment lines as tabs (chip buttons, ARIA tablist – velis.js); each panel: the line's facts as a facts list, its plan
 * (opens the lightbox) and "Nhận bảng giá {line}". A line with no data yet: one sentence + the button.
 */
function velis_lines_html( $post ): string {
	$lines = velis_lines( $post );
	if ( ! $lines ) {
		return '';
	}
	$name  = get_the_title( $post );
	$fin   = array( 'tho' => 'Thô', 'co-ban' => 'Hoàn thiện cơ bản', 'hoan-thien' => 'Hoàn thiện nội thất' );
	$stock = defined( 'VELIS_STOCK' ) ? VELIS_STOCK : array();
	$tabs  = '';
	$panes = '';
	foreach ( $lines as $l ) {
		$id    = $l['anchor'] ?: sanitize_title( $l['name'] );
		$tabs .= '<button class="chip" role="tab" type="button" aria-controls="' . esc_attr( $id ) . '">' . esc_html( $l['name'] ) . '</button>';
		$price = velis_has_data() ? velis_price_text( $l['price_from'] ?? '', $l['price_to'] ?? '', $l['price_unit'] ?? '', $l['price_month'] ?? '' ) : '';
		$mini  = array_filter( array(
			'Diện tích' => velis_line_area( $l ), 'Phòng ngủ' => '0' === (string) ( $l['beds'] ?? '' ) ? '' : esc_html( $l['beds'] ?? '' ),
			'Số lượng' => esc_html( $l['qty'] ?? '' ), 'Bàn giao' => esc_html( $fin[ $l['finish'] ?? '' ] ?? '' ), 'Sở hữu' => esc_html( $l['ownership'] ?? '' ),
			'Tình trạng' => esc_html( ( $stock[ $l['stock'] ?? '' ] ?? '' ) === '—' ? '' : ( $stock[ $l['stock'] ?? '' ] ?? '' ) ),
			'Giá' => $price ? esc_html( $price ) . ( ! empty( $l['source'] ) ? ' · ' . esc_html( $l['source'] ) : '' ) : '',
		), fn( $v ) => '' !== $v );
		$btn  = '<p><a class="btn" href="#tu-van" data-interest="' . esc_attr( $name . ' – ' . $l['name'] ) . '">Nhận bảng giá ' . esc_html( $l['name'] ) . '</a></p>';
		$plan = ! empty( $l['plan'] ) ? '<button class="pic" type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( (int) $l['plan'], 'large' ) ) . '" aria-label="' . esc_attr( 'Phóng to mặt bằng ' . $l['name'] ) . '">' . velis_img( (int) $l['plan'], 'Mặt bằng ' . $l['name'] . ' ' . $name, 'large', array( 'zoom' => 1, 'sizes' => VELIS_SIZES_MAIN ) ) . '</button>' : '';
		$rows = implode( '', array_map( fn( $k, $v ) => '<div class="facts__item"><dt>' . esc_html( $k ) . '</dt><dd>' . $v . '</dd></div>', array_keys( $mini ), $mini ) );
		$body = $mini ? '<dl class="facts__list" data-n="' . count( $mini ) . '">' . $rows . '</dl>' . $plan . $btn
			: '<p>Velis gửi thông tin chi tiết ' . esc_html( $l['name'] ) . ' (mặt bằng, diện tích, giá) khi anh chị để lại liên hệ.</p>' . $btn;
		$panes .= '<section id="' . esc_attr( $id ) . '" role="tabpanel" tabindex="0"><h3>' . esc_html( $l['name'] ) . '</h3>' . $body . '</section>';
	}
	return '<div data-tabs><div class="actions" role="tablist" aria-label="' . esc_attr( 'Dòng căn hộ ' . $name ) . '" hidden>' . $tabs . '</div>' . $panes . '</div>' . velis_lightbox();
}

/**
 * Comparison table (mockup .table-wrap table): columns = records, rows = criteria. A missing cell reads "Chưa công bố";
 * rows where every column says the same are dropped; records without any data are dropped; fewer than 2 records → ''.
 */
function velis_compare_html( array $posts, array $crit, string $caption, $current = null ): string {
	$miss  = 'Chưa công bố';
	$cells = array();
	foreach ( $posts as $p ) {
		foreach ( $crit as $label => $fn ) {
			$v                          = trim( (string) $fn( $p ) );
			$cells[ $p->ID ][ $label ] = '' === $v ? $miss : $v;
		}
	}
	// rows = criteria that differ; a column that is "Chưa công bố" on every shown row is dropped (2.12) – repeat until stable
	do {
		$n      = count( $posts );
		$labels = array_values( array_filter( array_keys( $crit ), fn( $l ) => count( array_unique( array_map( fn( $p ) => $cells[ $p->ID ][ $l ], $posts ) ) ) > 1 ) );
		$posts  = array_values( array_filter( $posts, fn( $p ) => array_diff( array_intersect_key( $cells[ $p->ID ], array_flip( $labels ) ), array( $miss ) ) ) );
	} while ( $n !== count( $posts ) && count( $posts ) >= 2 );
	if ( count( $posts ) < 2 ) {
		return '';
	}
	if ( count( array_filter( $labels, fn( $l ) => array_filter( $posts, fn( $p ) => $miss !== $cells[ $p->ID ][ $l ] ) ) ) < 2 ) {
		return ''; // fewer than 2 rows with real data: nothing to compare (round 7)
	}
	$head = '<tr><th scope="col">Tiêu chí</th>';
	$cta  = '<tr><th scope="row"><span class="sr-only">Liên kết</span></th>';
	foreach ( $posts as $p ) {
		$cur   = $current && $current->ID === $p->ID;
		$head .= '<th scope="col"' . ( $cur ? ' class="is-current"' : '' ) . '>' . esc_html( velis_short_name( $p ) ) . ( $cur ? ' <small class="muted">(trang này)</small>' : '' ) . '</th>';
		$cta  .= '<td>' . ( $cur ? '' : '<a class="btn btn--text" href="' . esc_url( get_permalink( $p ) ) . '">' . esc_html( array( 'phan-khu' => 'Xem phân khu', 'thap-tang' => 'Xem dòng sản phẩm' )[ velis_level( $p ) ] ?? 'Xem dự án' ) . ' →<span class="sr-only"> ' . esc_html( $p->post_title ) . '</span></a>' ) . '</td>';
	}
	$body = '';
	foreach ( $labels as $l ) {
		$body .= '<tr><th scope="row">' . esc_html( $l ) . '</th>';
		foreach ( $posts as $p ) {
			$cur   = $current && $current->ID === $p->ID;
			$body .= '<td' . ( $cur ? ' class="is-current"' : '' ) . '>' . esc_html( $cells[ $p->ID ][ $l ] ) . '</td>';
		}
		$body .= '</tr>';
	}
	return '<div class="table-wrap"><table><caption>' . esc_html( $caption ) . '</caption><thead>' . $head . '</tr></thead><tbody>' . $body . $cta . '</tr></tbody></table></div>';
}

/** One shared lightbox <dialog> per page (printed once): photos with [data-zoom] open in it (velis.js). */
function velis_lightbox(): string {
	static $done = false;
	if ( $done ) {
		return '';
	}
	$done = true;
	// 5.11: whole picture inside the screen, solid dark ground, close / previous / next buttons ≥ 44 px (velis.js)
	return '<dialog class="lightbox" aria-label="Xem ảnh"><button type="button" class="lightbox__close" data-close aria-label="Đóng">×</button>'
		. '<button type="button" class="lightbox__nav" data-step="-1" aria-label="Ảnh trước">‹</button><span class="lightbox__frame"><img alt="" width="1200" height="800"></span>'
		. '<button type="button" class="lightbox__nav" data-step="1" aria-label="Ảnh sau">›</button></dialog>';
}

/** Gallery (mockup: dark block, manual prev / next, counter); each photo opens the lightbox. Plans / maps shown whole. */
function velis_gallery_html( array $ids, string $name, string $label = 'Thư viện ảnh' ): string {
	$ids = array_values( array_unique( array_filter( array_map( 'intval', $ids ) ) ) );
	if ( ! $ids ) {
		return '';
	}
	// Renderings and finished views first, then maps / plans, construction and progress photos last (stable in each group).
	$late = function ( $id ) {
		$t = mb_strtolower( basename( (string) get_attached_file( $id ) ) . ' ' . get_post_meta( $id, '_wp_attachment_image_alt', true ) );
		return preg_match( '/tien-do|tiến độ|cong-truong|công trường|thi-cong|thi công/u', $t ) ? 2 : ( preg_match( '/ban-do|bản đồ|vi-tri|vị trí|khoang-cach|khoảng cách|mat-bang|mặt bằng|layout/u', $t ) ? 1 : 0 );
	};
	$pos = array_flip( $ids );
	usort( $ids, fn( $a, $b ) => $late( $a ) <=> $late( $b ) ?: $pos[ $a ] <=> $pos[ $b ] );
	$li = '';
	foreach ( $ids as $id ) {
		$alt  = trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) ) ?: $name;
		$cap  = wp_get_attachment_caption( $id );
		$plan = 1 === $late( $id );
		$img  = velis_img( $id, $alt, 'large', array( 'sizes' => '(min-width: 768px) 576px, calc(100vw - 80px)', 'ratio' => 16 / 9 ) + ( $plan ? array( 'zoom' => 1, 'class' => 'is-plan' ) : array() ) );
		$li  .= '<li><figure><button type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( $id, 'large' ) ) . '" aria-label="' . esc_attr( 'Phóng to: ' . $alt ) . '">' . $img . '</button>'
			. ( $cap && ! velis_auto_caption( (string) $cap ) ? '<figcaption class="sr-only">' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure></li>';
	}
	return '<div data-gallery><ul class="gallery__track" tabindex="0" aria-label="' . esc_attr( $label . ', cuộn ngang' ) . '">' . $li . '</ul>'
		. ( count( $ids ) > 1 ? '<div class="gallery__nav"><button type="button" data-prev aria-label="Ảnh trước">‹</button><span class="gallery__count" aria-live="polite" data-counter>1/' . count( $ids ) . '</span><button type="button" data-next aria-label="Ảnh sau">›</button></div>' : '' )
		. '</div>' . velis_lightbox();
}

/** Long text field → paragraphs. */
function velis_text( string $t ): string {
	return '' === trim( $t ) ? '' : wpautop( esc_html( $t ) );
}

/**
 * Project listing (/du-an/): filter = the mockup's quick filter rows (chips, OR inside a row, AND across rows, data-n follows
 * the visible count) for Khu vực, Chủ đầu tư, Loại sản phẩm; ?khu= / ?cdt= / ?loai= in the URL pre-select (home area tabs).
 */
function velis_project_listing( array $projects ): string {
	if ( ! $projects ) {
		return '';
	}
	$devs = $types = $khu = array();
	foreach ( $projects as $p ) {
		foreach ( velis_developers( $p ) as $d ) {
			$devs[ $d->post_name ] = $d->post_title;
		}
		$types += velis_type_names( $p );
		foreach ( velis_region_slugs( $p ) as $s ) {
			$t = get_term_by( 'slug', $s, 'khu-vuc' );
			if ( $t && ! $t->parent ) {
				$khu[ $s ] = $t->name;
			}
		}
	}
	// 2.6: three labelled groups, one row each; phones: a <select> per group instead of the chips (same filter, velis.js)
	$row = fn( $key, $label, $items ) => count( $items ) >= 2 ? '<div class="zfilter__row"><p class="zfilter__label" id="loc-' . $key . '">' . esc_html( $label ) . '</p>'
		. '<div class="actions" role="group" aria-labelledby="loc-' . $key . '">' . implode( '', array_map( fn( $k, $v ) => '<button class="chip" type="button" data-key="' . $key . '" value="' . esc_attr( $k ) . '" aria-pressed="false">' . esc_html( $v ) . '</button>', array_keys( $items ), $items ) ) . '</div>'
		. '<select class="zfilter__select" data-key="' . $key . '" aria-labelledby="loc-' . $key . '"><option value="">Tất cả</option>' . implode( '', array_map( fn( $k, $v ) => '<option value="' . esc_attr( $k ) . '">' . esc_html( $v ) . '</option>', array_keys( $items ), $items ) ) . '</select></div>' : '';
	$rows = $row( 'khu', 'Khu vực', $khu ) . $row( 'cdt', 'Chủ đầu tư', $devs ) . $row( 'loai', 'Loại sản phẩm', $types );
	$n    = count( $projects );
	return ( $rows ? '<div class="zfilter" data-filter="#du-an-luoi" data-noun="dự án" data-url><p class="muted mb-0" data-count aria-live="polite">Hiển thị ' . $n . '/' . $n . ' dự án</p>' . $rows . '<button class="btn btn--text" type="button" data-clear>Xóa lọc</button></div>' : '' )
		. str_replace( '<div class="grid', '<div id="du-an-luoi" class="grid', velis_grid( array_map( fn( $p ) => velis_card_project( $p, '', true ), $projects ), 'three', ' data-live' ) );
}

/** Phân khu of a đại đô thị (mockup TGC): filter by product type, groups Cao tầng / Hỗn hợp / Thấp tầng (low-rise as wide cards). */
function velis_zone_listing( $root, array $zones ): string {
	$groups = array( 'Cao tầng' => array(), 'Hỗn hợp' => array(), 'Thấp tầng' => array() );
	$types  = array();
	foreach ( $zones as $z ) {
		$t     = array_keys( velis_type_names( $z ) );
		$types += velis_type_names( $z );
		$high  = in_array( 'can-ho', $t, true );
		$low   = (bool) array_diff( $t, array( 'can-ho' ) );
		$groups[ $high && $low ? 'Hỗn hợp' : ( $high || ! $t ? 'Cao tầng' : 'Thấp tầng' ) ][] = $z;
	}
	$cards = '';
	$any   = (bool) array_filter( $zones, 'velis_image_id' ); // a group without photos still gets named frames when another group has photos (mockup TGC)
	foreach ( array_filter( $groups ) as $g => $list ) {
		$c      = array_map( fn( $z ) => velis_card_project( $z, '', 'zone' ), $list );
		$c      = $any ? preg_replace_callback( '#<span hidden data-nomedia="([^"]*)"></span>#', fn( $m ) => velis_media_empty( html_entity_decode( $m[1], ENT_QUOTES ) ), $c ) : $c;
		$cards .= '<div data-group><h3>' . esc_html( $g ) . '</h3>' . velis_grid( $c, 'zones', ' data-live' ) . '</div>';
	}
	$n    = count( $zones );
	$chip = count( $types ) >= 2 ? '<div class="actions" role="group" aria-label="Lọc theo loại sản phẩm">' . implode( '', array_map( fn( $k, $v ) => '<button class="chip" type="button" value="' . esc_attr( $k ) . '" aria-pressed="false">' . esc_html( $v ) . '</button>', array_keys( $types ), $types ) ) . '<button class="btn btn--text" type="button" data-clear>Xóa lọc</button></div>' : '';
	return '<div class="zfilter" data-filter=".zones"><p class="muted mb-0" data-count aria-live="polite">Hiển thị ' . $n . '/' . $n . ' phân khu</p>' . $chip . '</div>' . $cards;
}

/** Chip filter for a card grid (single dimension): data-$key on cards. $items slug => label. */
function velis_chipbar( string $key, array $items, string $label, string $noun = 'bài' ): string {
	return velis_chipbars( array( $key => array( $label, $items ) ), $noun );
}

/** One filter with several chip rows (OR inside a row, AND across rows – velis.js): $rows key => [label, slug => name]. */
function velis_chipbars( array $rows, string $noun = 'bài' ): string {
	$html = '';
	foreach ( $rows as $key => list( $label, $items ) ) {
		$html .= count( $items ) >= 2 ? '<div class="actions" role="group" aria-label="' . esc_attr( $label ) . '">' . implode( '', array_map( fn( $k, $v ) => '<button class="chip" type="button" data-key="' . esc_attr( $key ) . '" value="' . esc_attr( $k ) . '" aria-pressed="false">' . esc_html( $v ) . '</button>', array_keys( $items ), $items ) ) . '</div>' : '';
	}
	return $html ? '<div class="zfilter" data-filter="[data-chipgrid] .grid" data-noun="' . esc_attr( $noun ) . '"><p class="muted mb-0" data-count aria-live="polite"></p>' . $html . '<button class="btn btn--text" type="button" data-clear>Xóa lọc</button></div>' : '';
}

/* ---------- Trust & conversion ---------- */

/** Lead form: name + phone + consent; project / page URL / utm travel as hidden fields to the sales email (CF7, velis.js). */
function velis_form_tag( string $interest, string $mod = '' ): string {
	$uid = wp_unique_id( 'f' );
	$cf7 = function_exists( 'velis_cf7_form_id' ) ? velis_cf7_form_id() : 0;
	return '<form class="form' . ( $mod ? ' form--' . $mod : '' ) . '" novalidate data-form' . ( $cf7 ? ' data-cf7="' . $cf7 . '" action="' . esc_url( rest_url( 'contact-form-7/v1/contact-forms/' . $cf7 . '/feedback' ) ) . '" method="post"' : '' ) . '>'
		. '<div class="form__row"><p class="field"><label for="' . $uid . '-name">Họ và tên</label><input id="' . $uid . '-name" name="your-name" autocomplete="name" required aria-describedby="' . $uid . '-name-err"><span class="field__error" id="' . $uid . '-name-err" hidden>Vui lòng nhập họ tên.</span></p>'
		. '<p class="field"><label for="' . $uid . '-phone">Số điện thoại</label><input id="' . $uid . '-phone" name="your-phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9 +.]{9,15}" aria-describedby="' . $uid . '-phone-err"><span class="field__error" id="' . $uid . '-phone-err" hidden>Vui lòng nhập số điện thoại 9–15 chữ số.</span></p></div>'
		. '<input type="hidden" name="interest" value="' . esc_attr( $interest ) . '"><input type="hidden" name="page-url" value=""><input type="hidden" name="utm" value="">'
		. '<div class="check"><input id="' . $uid . '-consent" name="consent" value="1" type="checkbox" required aria-describedby="' . $uid . '-consent-err"><div><label for="' . $uid . '-consent">Tôi đồng ý để Velis Realty xử lý dữ liệu cá nhân nhằm tư vấn, theo <a href="/chinh-sach-bao-mat/">chính sách bảo mật</a>.</label>'
		. '<p class="field__error" id="' . $uid . '-consent-err" hidden>Cần đồng ý để Velis liên hệ.</p></div></div>'
		. '<p class="mb-0"><button class="btn" type="submit">Gửi yêu cầu</button></p>'
		. '<p class="mb-0" role="status" data-ok hidden>Đã nhận. Velis sẽ gọi lại trong giờ làm việc.</p><p class="mb-0 field__error" role="alert" data-fail hidden>Chưa gửi được. Anh chị vui lòng gọi ' . VELIS_PHONE . ' hoặc nhắn Zalo.</p></form>';
}

/** "Nhận tư vấn" block (mockup): the ONE dark block before the footer – heading + contact channels left, the form right. */
function velis_form_html( string $interest = '', array $options = array(), string $title = 'Nhận tư vấn', bool $info = true ): string { // $info false: the page already shows the contact details
	unset( $options ); // the project travels as a hidden field (round 6)
	$rows = array( 'Hotline' => '<a href="tel:' . VELIS_PHONE_TEL . '">' . VELIS_PHONE . '</a>', 'Zalo' => '<a href="' . esc_url( VELIS_ZALO ) . '" rel="noopener" target="_blank">zalo.me/' . VELIS_PHONE_TEL . '</a>',
		'Email' => '<a href="mailto:' . VELIS_EMAIL . '">' . VELIS_EMAIL . '</a>', 'Giờ làm việc' => VELIS_HOURS );
	$dl   = $info ? '<dl>' . implode( '', array_map( fn( $k, $v ) => '<div><dt>' . $k . '</dt><dd>' . $v . '</dd></div>', array_keys( $rows ), $rows ) ) . '</dl>' : '';
	return '<section class="section section--dark" id="tu-van" aria-labelledby="tu-van-h"><div class="wrap contact"><div><p class="eyebrow">Velis Realty</p><h2 id="tu-van-h">' . esc_html( $title ) . '</h2>'
		. '<p>Để lại họ tên và số điện thoại, Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị gọi hoặc nhắn Zalo.</p>' . $dl . '</div>' . velis_form_tag( $interest ) . '</div></section>';
}

function velis_disclosure( string $kind = 'project' ): string {
	$t = 'project' === $kind
		? 'Thông tin trên trang chỉ để tham khảo, tổng hợp từ tài liệu công khai của chủ đầu tư tại thời điểm cập nhật. Giá, chính sách và tiến độ có thể thay đổi; vui lòng kiểm tra hợp đồng và văn bản chính thức của chủ đầu tư trước khi giao dịch.'
		: 'Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.';
	return '<p class="disclosure mb-0" role="note">' . esc_html( $t ) . '</p>';
}

/** Author box = the advisor component (no portrait until a real photo of the author exists – DESIGN.md). */
function velis_author_box( int $user_id ): string {
	$name = get_the_author_meta( 'display_name', $user_id );
	$bio  = get_the_author_meta( 'description', $user_id );
	$url  = get_author_posts_url( $user_id );
	return '<aside class="advisor" aria-label="Tác giả"><p class="eyebrow">Tác giả</p><p class="pricecard__title"><a href="' . esc_url( $url ) . '">' . esc_html( $name ) . '</a></p><p class="muted">CEO Velis Realty</p>'
		. ( $bio ? '<p>' . esc_html( $bio ) . '</p>' : '' ) . velis_btn( 'Tất cả bài của ' . $name, $url, 'text' ) . '</aside>';
}

/**
 * Adds ids to H2/H3 in content and returns [toc html, content]. TOC only when the text is long (brief: > 1.200 words)
 * and has at least 3 H2. The list is a <details> (B3-2b styles it with existing components).
 */
function velis_toc( string $content, int $words ): array {
	$items = array();
	$used  = array();
	$content = preg_replace_callback( '#<h([23])([^>]*)>(.*?)</h\1>#is', function ( $m ) use ( &$items, &$used ) {
		$text = trim( wp_strip_all_tags( $m[3] ) );
		if ( preg_match( '/\bid="([^"]+)"/', $m[2], $id ) ) {
			$id = $id[1];
		} else {
			$id   = sanitize_title( $text ) ?: 'muc';
			$base = $id;
			for ( $n = 2; isset( $used[ $id ] ); $n++ ) {
				$id = $base . '-' . $n;
			}
			$m[2] .= ' id="' . esc_attr( $id ) . '"';
		}
		$used[ $id ] = true;
		if ( '2' === $m[1] && '' !== $text ) {
			$items[] = '<li><a href="#' . esc_attr( $id ) . '">' . esc_html( $text ) . '</a></li>';
		}
		return '<h' . $m[1] . $m[2] . '>' . $m[3] . '</h' . $m[1] . '>';
	}, $content );
	$toc = ( $words > 1200 && count( $items ) >= 3 ) ? '<div class="faq"><details data-toc><summary>Mục lục</summary><ol>' . implode( '', $items ) . '</ol></details></div>' : '';
	return array( $toc, $content );
}

/** Search form = the form row of the lead form (.field + .btn), no new style. */
function velis_search_form( string $id, string $value = '', string $label = 'Tìm dự án hoặc bài viết' ): string {
	// field + "Tìm" on one row (phones: the button under it, full width); 24 px from what is above (2.14)
	return '<form role="search" method="get" class="form search" action="' . esc_url( home_url( '/' ) ) . '"><div class="field"><label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label>'
		. '<div class="search__row"><input id="' . esc_attr( $id ) . '" type="search" name="s" value="' . esc_attr( $value ) . '" placeholder="Ví dụ: The Global City"><button class="btn" type="submit">Tìm</button></div></div></form>';
}

/** Text page body: one reading column, or the 2-column page (text | sticky side card) when there is a side card. */
function velis_text_page( string $html, string $side = '' ): string {
	return $side ? '<div class="wrap page"><div class="page__main"><div class="block prose">' . $html . '</div></div>' . $side . '</div>'
		: '<div class="wrap--read"><div class="block prose">' . $html . '</div></div>'; // policy pages: one centred reading column, no side column (2026-11-06)
}

/** Pagination: a row of outline buttons (existing button component). */
function velis_pagination( WP_Query $q ): string {
	$links = paginate_links( array( 'total' => $q->max_num_pages, 'current' => max( 1, (int) get_query_var( 'paged' ) ), 'type' => 'array', 'prev_text' => '‹<span class="sr-only"> Trang trước</span>', 'next_text' => '<span class="sr-only">Trang sau </span>›' ) );
	$links = array_map( fn( $l ) => preg_replace( '/class="([^"]*page-numbers[^"]*)"/', 'class="btn btn--line $1"', $l ), (array) $links );
	return $links ? '<nav class="actions more-center" aria-label="Phân trang">' . implode( '', $links ) . '</nav>' : '';
}

/** Editor content for templates: the page already has its H1, so any H1 inside the content becomes an H2. */
function velis_content( string $raw ): string {
	return velis_strip_auto_captions( velis_strip_related( preg_replace( '#<(/?)h1(\b[^>]*)>#i', '<$1h2$2>', apply_filters( 'the_content', $raw ) ) ) ); // phpcs:ignore -- core filter
}

/** A card embedded inside text keeps the outline intact: its H3 title becomes a paragraph (brief: theme block titles are not headings). */
function velis_heading_to_p( string $html ): string {
	return preg_replace( '#<(/?)h3( class="card__title")?>#', '<$1p$2>', $html );
}

/** Short text for compact places (cards, quick facts): first clause, then a word-safe cut. */
function velis_short( string $t, int $max = 45 ): string {
	$t = trim( preg_replace( '/\s+/u', ' ', $t ) );
	if ( mb_strlen( $t ) <= $max ) {
		return $t;
	}
	$first = trim( preg_split( '/\s*[;(]\s*/u', $t )[0] );
	if ( mb_strlen( $first ) <= $max && mb_strlen( $first ) >= 8 ) {
		return $first;
	}
	return rtrim( mb_substr( $t, 0, mb_strrpos( mb_substr( $t, 0, $max ), ' ' ) ?: $max ), ' ,.;:–·' ) . '…';
}

/** Full facts (the "Tổng quan" section, mockup MPP): every value in full, label in the label style. */
function velis_overview_html( array $facts ): string {
	$rows = '';
	foreach ( array_filter( $facts, fn( $v ) => '' !== trim( (string) $v ) ) as $k => $v ) {
		$rows .= '<div><dt class="eyebrow">' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd></div>';
	}
	return $rows ? '<dl>' . $rows . '</dl>' : '';
}

/**
 * Static location map (mockup .map): the record's own map, else the map of its most specific region that has one – then
 * the caption says "khu vực". The Google Maps link sits on the map.
 */
function velis_map_html( $p, bool $with_image = true ): string { // false: the text already shows a location map – keep only the link
	$p    = get_post( $p );
	$area = '';
	$map  = (int) get_post_meta( $p->ID, 'velis_map', true );
	for ( $x = $p; ! $map && $x; $x = $x->post_parent ? get_post( $x->post_parent ) : null ) {
		$map = $x === $p ? 0 : (int) get_post_meta( $x->ID, 'velis_map', true );
		foreach ( $map ? array() : array_reverse( velis_terms( $x, 'khu-vuc' ) ) as $t ) {
			if ( $map = (int) get_term_meta( $t->term_id, 'velis_map', true ) ) {
				$area = $t->name;
				break;
			}
		}
	}
	$addr = (string) velis_f( $p, 'velis_address' );
	$link = '<a class="btn btn--line" href="' . esc_url( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( velis_root( $p )->post_title . ' ' . $addr ) ) . '" target="_blank" rel="noopener">Xem trên Google Maps</a>';
	if ( ! $map || ! $with_image ) {
		return $addr || ! $with_image ? ( $addr ? '<p>' . esc_html( $addr ) . '</p>' : '' ) . '<p>' . $link . '</p>' : '';
	}
	return '<figure class="map">' . velis_img( $map, $area ? 'Bản đồ khu vực ' . $area : 'Bản đồ vị trí ' . $p->post_title, 'large', array( 'zoom' => 1, 'ratio' => 16 / 9, 'sizes' => '(min-width: 768px) 720px, calc(100vw - 32px)' ) ) . $link . '</figure>'
		. '<p class="source">' . esc_html( ( $area ? 'Vị trí khu vực ' . $area . ' (chưa có tọa độ riêng của dự án). ' : '' ) . ( $addr ? 'Địa chỉ: ' . $addr . '. ' : '' ) . 'Bản đồ © OpenStreetMap contributors.' ) . '</p>';
}

/** "Nằm trong" box (mockup .within): small photo + label + name + 1–2 lines; the whole box is the link. */
function velis_within_html( $parent, string $label ): string {
	$parent  = get_post( $parent );
	$img     = velis_image_id( $parent ) ?: velis_image_id( velis_root( $parent ) );
	$summary = $parent->post_excerpt ?: implode( ' · ', array_filter( array( velis_short( (string) get_post_meta( $parent->ID, 'velis_scale', true ) ), implode( ', ', wp_list_pluck( velis_developers( $parent ), 'post_title' ) ), velis_region_label( $parent ) ) ) );
	return '<a class="within" href="' . esc_url( get_permalink( $parent ) ) . '">' . ( velis_usable( $img ) ? '<span class="within__img">' . velis_img( $img, '', 'medium', array( 'sizes' => '120px' ) ) . '</span>' : '' )
		. '<div><p class="eyebrow">' . esc_html( $label ) . '</p><p class="within__name">' . esc_html( $parent->post_title ) . '</p>'
		. ( $summary ? '<p class="muted">' . esc_html( velis_short( $summary, 140 ) ) . '</p>' : '' ) . '</div></a>';
}

/**
 * The featured image is shown above the text; when the first image of the content is the same file (any size:
 * "-1024x683", "-scaled"), drop it with its wrapper (figure / paragraph / link).
 */
function velis_strip_dup_image( string $html, int $thumb ): string {
	if ( ! $thumb || ! preg_match( '#<img[^>]+src="([^"]+)"[^>]*>#i', $html, $m, PREG_OFFSET_CAPTURE ) ) {
		return $html;
	}
	$base = fn( $u ) => preg_replace( '/(-\d+x\d+|-scaled)+(?=\.\w+$)/', '', basename( wp_parse_url( $u, PHP_URL_PATH ) ?: $u ) );
	$feat = (string) wp_get_attachment_url( $thumb );
	if ( ! $feat || $base( $m[1][0] ) !== $base( $feat ) ) {
		return $html;
	}
	$img = preg_quote( $m[0][0], '#' );
	foreach ( array( '#<figure[^>]*>(?:(?!</figure>).)*?' . $img . '.*?</figure>#is', '#<p[^>]*>\s*(?:<a[^>]*>)?\s*' . $img . '\s*(?:</a>)?\s*</p>#is', '#(?:<a[^>]*>)?\s*' . $img . '\s*(?:</a>)?#is' ) as $re ) {
		$out = preg_replace( $re, '', $html, 1, $n );
		if ( $n ) {
			return $out;
		}
	}
	return $html;
}

/** The first image of a block above the fold is the page's LCP: load it now, not lazily. */
function velis_first_eager( string $html ): string {
	return preg_replace( '/loading="lazy"/', 'loading="eager" fetchpriority="high"', $html, 1 );
}

/** Logo box of a given width/height ratio: every logo the same visual area (areas within ±15 %), ≤ 48 px high, ≤ 160 px wide (2.9). */
function velis_logo_box( float $r ): array {
	$h = min( 48, sqrt( 2304 / $r ) ); // 2 304 px² = a square logo at the 48 px cap, so every logo from square to 11:1 reaches it
	$w = min( 160, $h * $r );
	return array( (int) round( $w ), (int) round( $w / $r ) );
}

/**
 * Developer logo <img> sized by velis_logo_box(): the developer's velis_logo, else the cleaned copy of the old home's partner
 * row bundled in the theme (assets/brand/doi-tac/{slug}.webp) – staging has no developer logo uploaded yet. '' when none.
 */
function velis_dev_logo( $d ): string {
	$d    = get_post( $d );
	$id   = (int) get_post_meta( $d->ID, 'velis_logo', true );
	$file = get_theme_file_path( 'assets/brand/doi-tac/' . $d->post_name . '.webp' );
	if ( $id && ( $m = wp_get_attachment_metadata( $id ) ) && ! empty( $m['height'] ) ) {
		list( $w, $h ) = velis_logo_box( $m['width'] / $m['height'] );
		return wp_get_attachment_image( $id, 'medium', false, array( 'alt' => $d->post_title, 'loading' => 'eager', 'sizes' => $w . 'px', 'style' => "--w: {$w}px; --h: {$h}px" ) );
	}
	if ( is_readable( $file ) && ( $s = getimagesize( $file ) ) ) {
		list( $w, $h ) = velis_logo_box( $s[0] / $s[1] );
		return '<img src="' . esc_url( get_theme_file_uri( 'assets/brand/doi-tac/' . $d->post_name . '.webp' ) ) . '" width="' . $s[0] . '" height="' . $s[1] . '" alt="' . esc_attr( $d->post_title ) . '" decoding="async" style="--w: ' . $w . 'px; --h: ' . $h . 'px">';
	}
	return '';
}

/** Cluster links right under the page header of /blog/ and every cluster (2.2); the current cluster is marked, not linked away. */
function velis_cluster_nav( int $current = 0 ): string {
	$cats = array_filter( get_categories( array( 'hide_empty' => true, 'parent' => 0, 'orderby' => 'count', 'order' => 'DESC' ) ), 'velis_is_cluster' );
	$a    = array_map( fn( $c ) => '<a class="chip" href="' . esc_url( get_category_link( $c ) ) . '"' . ( $current === (int) $c->term_id ? ' aria-current="page"' : '' ) . '>' . esc_html( $c->name . ' · ' . (int) $c->count . ' bài' ) . '</a>', $cats );
	return $a ? '<nav class="wrap actions" aria-label="Cụm bài viết">' . implode( '', $a ) . '</nav>' : '';
}
