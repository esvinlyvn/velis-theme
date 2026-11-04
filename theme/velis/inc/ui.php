<?php
/**
 * Reusable components (DESIGN.md) rendered from data. Every function returns escaped HTML.
 * Missing-data rules: empty field → element not rendered; price → one muted "chưa công bố" line; no image → neutral frame.
 */

defined( 'ABSPATH' ) || exit;

const VELIS_ICON_PHONE = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';

/**
 * Attachment image with the site framing: --focus top-right + slight zoom pushes the VELIS badge printed bottom-left
 * out of frame (DESIGN.md). data-alt = a second size, tried by velis.js when the first file is broken.
 */
function velis_img( int $id, string $alt, string $size = 'large', array $attr = array() ): string {
	if ( ! $id ) {
		return '';
	}
	$other = wp_get_attachment_image_url( $id, 'medium' === $size ? 'large' : 'medium' );
	return wp_get_attachment_image( $id, $size, false, $attr + array( 'alt' => $alt, 'loading' => 'lazy', 'style' => '--focus: 100% 0%; --zoom: 1.15', 'data-alt' => (string) $other ) );
}

function velis_media( int $id, string $name, string $class = 'v-card__media' ): string {
	return $id ? '<div class="' . esc_attr( $class ) . '" data-name="' . esc_attr( $name ) . '">' . velis_img( $id, $name, 'medium_large' ) . '</div>'
		: '<div class="' . esc_attr( $class ) . ' v-media--empty"><span>' . esc_html( $name ) . '</span></div>';
}

function velis_price_html( string $price, string $prefix = 'Giá ' ): string {
	return '' === $price ? '<p class="v-price is-missing">Giá: chưa công bố</p>' : '<p class="v-price">' . esc_html( $prefix . $price ) . '</p>';
}

function velis_more( string $t ): string {
	return '<span class="v-card__link" aria-hidden="true">' . esc_html( $t ) . ' →</span>';
}

/** Section header: eyebrow → H2 → lead; optional action (outline button) on the right of the title. */
function velis_sechead( string $title, string $eyebrow = '', string $lead = '', string $id = '', string $action = '' ): string {
	return '<header class="v-sechead' . ( $action ? ' has-action' : '' ) . '"><div>' . ( $eyebrow ? '<p class="v-eyebrow">' . esc_html( $eyebrow ) . '</p>' : '' )
		. '<h2' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '>' . esc_html( $title ) . '</h2>'
		. ( $lead ? '<p class="v-sechead__lead">' . esc_html( $lead ) . '</p>' : '' ) . '</div>' . $action . '</header>';
}

function velis_section( string $inner, string $id = '', string $class = '' ): string {
	return '<section class="v-section ' . esc_attr( $class ) . '"' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '><div class="v-wrap">' . $inner . '</div></section>';
}

/* ---------- Cards ---------- */

/**
 * Project card. Order (round 2): price (only when published) → number of phân khu or product-type chips → status →
 * handover. $mode: '' | true (project listing filter data) | 'zone' (phân khu: own scale, handover, lines) | 'embed'.
 */
function velis_card_project( $p, string $kicker = '', $mode = '' ): string {
	$p      = get_post( $p );
	$name   = $p->post_title;
	$level  = velis_level( $p );
	$devs   = velis_developers( $p );
	$status = velis_status( $p );
	$types  = velis_type_names( $p );
	$data   = '';
	if ( 'zone' === $mode ) {
		static $n = 0;
		$data = sprintf( ' data-n="%d" data-loai="%s" data-tt="%s" data-pn="" data-gia="" data-dt="" data-bg=""', ++$n, esc_attr( implode( ' ', array_keys( $types ) ) ), esc_attr( sanitize_title( $status ) ) );
	} elseif ( true === $mode ) {
		$data = sprintf( ' data-card data-khu="%s" data-cdt="%s" data-loai="%s" data-tt="%s"', esc_attr( implode( ' ', wp_list_pluck( velis_terms( $p, 'khu-vuc' ), 'slug' ) ) ), esc_attr( implode( ' ', wp_list_pluck( $devs, 'post_name' ) ) ), esc_attr( implode( ' ', array_keys( $types ) ) ), esc_attr( sanitize_title( $status ) ) );
	}
	$price = velis_price( $p );
	$rows  = array();
	if ( '' !== $price ) {
		$rows[] = '<p class="v-price">' . esc_html( 'Giá ' . $price ) . '</p>';
	}
	if ( 'zone' === $mode ) {
		$lines = array_merge( wp_list_pluck( velis_lines( $p ), 'name' ), array_map( 'velis_short_name', velis_children( $p, 'thap-tang' ) ) );
		$chips = $lines ?: array_values( $types );
		if ( $scale = (string) get_post_meta( $p->ID, 'velis_scale', true ) ) {
			$rows[] = '<p class="v-card__meta">' . esc_html( velis_short( $scale ) ) . '</p>';
		}
	} elseif ( 'thap-tang' === $level ) {
		$chips = array();
		$rows[] = '<p class="v-card__meta">' . esc_html( implode( ' · ', array_filter( array_slice( velis_facts( $p ), 0, 3 ) ) ) ) . '</p>';
	} else {
		$zones = 'dai-do-thi' === $level ? count( velis_children( $p, 'phan-khu' ) ) : 0;
		$chips = $zones ? array( $zones . ' phân khu' ) : array_values( $types );
	}
	if ( $chips ) {
		$rows[] = '<ul class="v-chips"><li>' . implode( '</li><li>', array_map( 'esc_html', array_slice( $chips, 0, 5 ) ) ) . '</li></ul>';
	}
	$hand = (string) get_post_meta( $p->ID, 'velis_handover', true );
	if ( $status || $hand ) {
		$rows[] = '<p class="v-card__meta">' . implode( ' · ', array_filter( array( $status ? '<span class="v-badge">' . esc_html( $status ) . '</span>' : '', $hand ? esc_html( 'Bàn giao ' . mb_strtolower( mb_substr( velis_short( $hand, 32 ), 0, 1 ) ) . mb_substr( velis_short( $hand, 32 ), 1 ) ) : '' ) ) ) . '</p>';
	}
	$meta = in_array( $mode, array( 'zone', 'embed' ), true ) || 'thap-tang' === $level ? '' : implode( ' · ', array_filter( array( $devs ? $devs[0]->post_title : '', velis_region_label( $p ) ) ) );
	$img  = velis_image_id( $p );
	$more = 'thap-tang' === $level ? 'Xem ' . mb_strtolower( velis_short_name( $p ) ) : ( 'phan-khu' === $level ? 'Xem phân khu' : 'Xem dự án' );
	$head = 'embed' === $mode ? 'p' : 'h3';
	return '<article class="v-card' . ( 'zone' === $mode ? ' v-zone' : '' ) . ( 'embed' === $mode ? ' v-card--row' : '' ) . '"' . $data . '>'
		. ( 'embed' === $mode && ! $img ? '' : velis_media( $img, $name ) )
		. '<div class="v-card__body">' . ( $kicker ? '<p class="v-card__kicker">' . esc_html( $kicker ) . '</p>' : '' )
		. "<$head class=\"v-card__title\"><a href=\"" . esc_url( get_permalink( $p ) ) . '">' . esc_html( $name ) . "</a></$head>"
		. ( $meta ? '<p class="v-card__meta">' . esc_html( $meta ) . '</p>' : '' ) . implode( '', $rows )
		. velis_more( $more ) . '</div></article>';
}

function velis_card_developer( $d ): string {
	$d       = get_post( $d );
	$logo    = (int) get_post_meta( $d->ID, 'velis_logo', true );
	$projs   = velis_developer_projects( $d );
	$regions = array_unique( array_filter( array_map( 'velis_region_label', $projs ) ) );
	$meta    = implode( ' · ', array_filter( array( $projs ? count( $projs ) . ' dự án đang tư vấn' : '', implode( ', ', $regions ) ) ) );
	$media   = $logo ? '<div class="v-card__media v-card__logo">' . velis_img( $logo, 'Logo ' . $d->post_title, 'medium' ) . '</div>'
		: '<div class="v-card__media v-card__logo"><svg class="v-logo-ph" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/></svg></div>';
	return '<article class="v-card">' . $media . '<div class="v-card__body"><p class="v-card__kicker">Chủ đầu tư</p><h3 class="v-card__title"><a href="' . esc_url( get_permalink( $d ) ) . '">' . esc_html( $d->post_title ) . '</a></h3>'
		. ( $meta ? '<p class="v-card__meta">' . esc_html( $meta ) . '</p>' : '' ) . velis_more( 'Xem chủ đầu tư' ) . '</div></article>';
}

/** Post card. $mode 'feature': the large horizontal card that opens /blog/ (title is an H2 there). */
function velis_card_post( $p, bool $filter_data = false, string $mode = '' ): string {
	$p    = get_post( $p );
	$kind = velis_post_kind( $p );
	$data = $filter_data ? sprintf( ' data-card data-kind="%s" data-pk="%s"', esc_attr( $kind ), esc_attr( implode( ' ', wp_list_pluck( velis_post_projects( $p ), 'post_name' ) ) ) ) : '';
	$h    = 'feature' === $mode ? 'h2' : 'h3';
	return '<article class="v-card' . ( 'feature' === $mode ? ' v-card--feature' : '' ) . '"' . $data . '>' . velis_media( (int) get_post_thumbnail_id( $p ), get_the_title( $p ) )
		. '<div class="v-card__body"><p class="v-card__kicker">' . esc_html( ( 'feature' === $mode ? 'Bài mới nhất · ' : '' ) . VELIS_KINDS[ $kind ] ) . '</p>'
		. "<$h class=\"v-card__title\"><a href=\"" . esc_url( get_permalink( $p ) ) . '">' . esc_html( get_the_title( $p ) ) . "</a></$h>"
		. ( 'feature' === $mode && $p->post_excerpt ? '<p>' . esc_html( velis_short( $p->post_excerpt, 220 ) ) . '</p>' : '' )
		. '<p class="v-card__meta">' . esc_html( get_the_author_meta( 'display_name', $p->post_author ) . ' · ' . get_the_date( 'd/m/Y', $p ) . ' · ' . velis_reading_minutes( $p ) . ' phút đọc' ) . '</p>'
		. velis_more( 'Đọc bài' ) . '</div></article>';
}

function velis_grid( array $cards, string $mod = '4', string $attrs = '' ): string {
	return $cards ? '<div class="v-grid v-grid--' . esc_attr( $mod ) . '"' . $attrs . '>' . implode( '', $cards ) . '</div>' : '';
}

/* ---------- Heroes ---------- */

/** Hero A: full-bleed photo; focus keeps the printed badge out (desktop top-right, mobile 72% across). */
function velis_hero_a( array $a ): string {
	$tag = empty( $a['h1'] ) ? 'p' : 'h1';
	$img = $a['img'] ? wp_get_attachment_image( $a['img'], 'full', false, array( 'alt' => $a['alt'] ?? $a['title'], 'fetchpriority' => 'high', 'loading' => 'eager', 'sizes' => '100vw', 'style' => '--focus: 100% 0%; --focus-m: 72% 0%; --zoom: 1.12', 'data-alt' => (string) wp_get_attachment_image_url( $a['img'], 'large' ) ) ) : '';
	return '<section class="v-hero v-hero--full' . ( $img ? '' : ' is-empty' ) . '" aria-label="' . esc_attr( $a['title'] ) . '" data-name="' . esc_attr( $a['title'] ) . '">' . ( $img ?: '<span class="v-hero__fallback" aria-hidden="true">' . esc_html( $a['title'] ) . '</span>' ) . '<div class="v-hero__body">'
		. ( ! empty( $a['eyebrow'] ) ? '<p class="v-eyebrow">' . $a['eyebrow'] . '</p>' : '' )
		. "<$tag class=\"v-hero__title\">" . esc_html( $a['title'] ) . "</$tag>"
		. ( ! empty( $a['lead'] ) ? '<p class="v-hero__lead">' . esc_html( $a['lead'] ) . '</p>' : '' )
		. '<div class="v-row">' . ( $a['buttons'] ?? '' ) . '</div></div></section>';
}

/** Hero B: text on ivory + square image (index pages). $a: title, eyebrow, lead, img, buttons. */
function velis_hero_b( array $a ): string {
	$fig = ! empty( $a['img'] ) ? '<figure><div class="v-ratio" style="--r:4/3">' . velis_img( $a['img'], $a['alt'] ?? '', 'large', array( 'loading' => 'eager', 'fetchpriority' => 'high' ) ) . '</div></figure>' : '';
	return '<div class="v-wrap"><div class="v-hero v-hero--split' . ( $fig ? '' : ' is-text' ) . '"><div class="v-hero__body">'
		. ( ! empty( $a['eyebrow'] ) ? '<p class="v-eyebrow">' . esc_html( $a['eyebrow'] ) . '</p>' : '' )
		. '<h1 class="v-hero__title">' . esc_html( $a['title'] ) . '</h1>'
		. ( ! empty( $a['lead'] ) ? '<p class="v-hero__lead">' . esc_html( $a['lead'] ) . '</p>' : '' )
		. ( ! empty( $a['buttons'] ) ? '<div class="v-row">' . $a['buttons'] . '</div>' : '' ) . '</div>' . $fig . '</div></div>';
}

function velis_btn( string $label, string $url, string $mod = '', string $extra = '' ): string {
	return '<a class="v-btn' . ( $mod ? ' v-btn--' . $mod : '' ) . '" href="' . esc_url( $url ) . '"' . $extra . '>' . esc_html( $label ) . '</a>';
}

function velis_call_btn( string $mod = 'ghost' ): string {
	return '<a class="v-btn v-btn--' . $mod . '" href="tel:' . VELIS_PHONE_TEL . '">Gọi ' . VELIS_PHONE . '</a>';
}

/* ---------- Breadcrumb ---------- */

function velis_breadcrumb_html( array $trail ): string {
	if ( count( $trail ) < 2 ) {
		return '';
	}
	$li   = array();
	$last = count( $trail ) - 1;
	foreach ( $trail as $i => list( $name, $url ) ) {
		$li[] = $i === $last ? '<li aria-current="page">' . esc_html( $name ) . '</li>' : '<li><a href="' . esc_url( $url ) . '">' . esc_html( $name ) . '</a></li>';
	}
	return '<div class="v-wrap"><nav class="v-breadcrumb" aria-label="Breadcrumb"><ol>' . implode( '', $li ) . '</ol></nav></div>';
}

/* ---------- Project data blocks ---------- */

/**
 * Quick facts bar: short values (≤ ~45 chars); a cut value links to its full text ($more: label => #anchor).
 * Columns are chosen so no cell is left alone on the last row (desktop); mobile is 2 columns, an odd last cell spans both.
 */
function velis_facts_html( array $facts, ?string $price, string $note = '', array $more = array() ): string { // $price null: not a project, no price cell
	$cells = array();
	foreach ( array_filter( $facts, fn( $v ) => '' !== trim( (string) $v ) ) as $k => $v ) {
		$short   = velis_short( (string) $v );
		$link    = $short !== trim( preg_replace( '/\s+/u', ' ', (string) $v ) ) ? ' <a class="v-facts__more" href="' . esc_attr( $more[ $k ] ?? '#tong-quan' ) . '">Chi tiết</a>' : '';
		$cells[] = '<dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $short ) . $link . '</dd>';
	}
	if ( null !== $price ) {
		$cells[] = '<dt>Giá tham khảo</dt>' . ( '' === $price ? '<dd class="is-missing">Chưa công bố</dd>' : '<dd>' . esc_html( velis_short( $price ) ) . '</dd>' );
	}
	$n    = count( $cells );
	$cols = $n <= 6 ? $n : (int) ceil( $n / 2 );
	$html = '<dl class="v-facts" style="--cols:' . $cols . '">';
	foreach ( $cells as $i => $c ) {
		$span = $i === $n - 1 && $n % $cols ? ' style="--span:' . ( $cols - ( $n % $cols ) + 1 ) . '"' : '';
		$html .= '<div' . $span . '>' . $c . '</div>';
	}
	return $html . '</dl>' . ( $note ? '<p class="v-source">' . esc_html( $note ) . '</p>' : '' );
}

/** Area of an apartment line: net (thông thủy) is the main number, gross (tim tường) secondary. */
function velis_line_area( array $l ): string {
	$net   = velis_has_data() ? velis_range( $l['net_from'] ?? '', $l['net_to'] ?? '', 'm²' ) : '';
	$gross = velis_has_data() ? velis_range( $l['gross_from'] ?? '', $l['gross_to'] ?? '', 'm²' ) : '';
	return velis_area( $net, $gross );
}

/** Apartment lines as tabs. A line with no data yet shows a short sentence + button instead of empty specs. */
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
		$tabs .= '<button role="tab" type="button" aria-controls="' . esc_attr( $id ) . '">' . esc_html( $l['name'] ) . '</button>';
		$price = velis_has_data() ? velis_price_text( $l['price_from'] ?? '', $l['price_to'] ?? '', $l['price_unit'] ?? '', $l['price_month'] ?? '' ) : '';
		$mini  = array_filter( array(
			'Diện tích' => velis_line_area( $l ), 'Phòng ngủ' => esc_html( $l['beds'] ?? '' ), 'Hướng / vị trí' => esc_html( $l['facing'] ?? '' ),
			'Số lượng' => esc_html( $l['qty'] ?? '' ), 'Bàn giao' => esc_html( $fin[ $l['finish'] ?? '' ] ?? '' ), 'Sở hữu' => esc_html( $l['ownership'] ?? '' ),
			'Tình trạng' => esc_html( ( $stock[ $l['stock'] ?? '' ] ?? '' ) === '—' ? '' : ( $stock[ $l['stock'] ?? '' ] ?? '' ) ),
			'Giá' => $price ? esc_html( $price ) . ( ! empty( $l['source'] ) ? ' <small>· ' . esc_html( $l['source'] ) . '</small>' : '' ) : '',
		), fn( $v ) => '' !== $v );
		$btn  = '<a class="v-btn" href="#tu-van" data-interest="' . esc_attr( $name . ' – ' . $l['name'] ) . '">Nhận bảng giá ' . esc_html( $l['name'] ) . '</a>';
		$plan = ! empty( $l['plan'] ) ? '<button class="v-line__plan" type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( (int) $l['plan'], 'large' ) ) . '" aria-label="' . esc_attr( 'Phóng to mặt bằng ' . $l['name'] ) . '">' . velis_img( (int) $l['plan'], 'Mặt bằng ' . $l['name'] . ' ' . $name, 'large', array( 'style' => '' ) ) . '</button>' : '';
		if ( $mini ) {
			$rows = '';
			foreach ( $mini as $k => $v ) {
				$rows .= '<div><dt>' . esc_html( $k ) . '</dt><dd>' . $v . '</dd></div>';
			}
			$body = '<div class="v-line' . ( $plan ? '' : ' is-noplan' ) . '"><div class="v-line__info"><dl class="v-mini">' . $rows . '</dl>' . $btn . '</div>' . $plan . '</div>';
		} else {
			$body = '<div class="v-line is-noplan"><div class="v-line__info"><p>Velis gửi thông tin chi tiết ' . esc_html( $l['name'] ) . ' (mặt bằng, diện tích, giá) khi anh chị để lại liên hệ.</p>' . $btn . '</div></div>';
		}
		$panes .= '<section class="v-tabs__panel" id="' . esc_attr( $id ) . '" role="tabpanel" tabindex="0"><h3>' . esc_html( $l['name'] ) . '</h3>' . $body . '</section>';
	}
	return '<div class="v-tabs" data-tabs><div class="v-tabs__list" role="tablist" aria-label="' . esc_attr( 'Dòng căn hộ ' . $name ) . '" hidden>' . $tabs . '</div>' . $panes . '</div>';
}

/**
 * Comparison table (own markup): columns = records, rows = criteria. A missing cell reads "Chưa công bố"; rows where
 * every column says the same are dropped; records without any data are dropped; fewer than 2 records left → ''.
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
	$posts = array_values( array_filter( $posts, fn( $p ) => array_diff( $cells[ $p->ID ], array( $miss ) ) ) );
	if ( count( $posts ) < 2 ) {
		return '';
	}
	$labels = array_filter( array_keys( $crit ), fn( $l ) => count( array_unique( array_map( fn( $p ) => $cells[ $p->ID ][ $l ], $posts ) ) ) > 1 );
	if ( ! $labels ) {
		return '';
	}
	$head = '<tr><th scope="col">Tiêu chí</th>';
	$cta  = '<tr class="v-table__cta"><th scope="row"><span class="v-sr">Liên kết</span></th>';
	foreach ( $posts as $p ) {
		$cur   = $current && $current->ID === $p->ID;
		$head .= '<th scope="col"' . ( $cur ? ' class="is-current"' : '' ) . '>' . esc_html( velis_short_name( $p ) ) . ( $cur ? '<span class="v-current">Trang này</span>' : '' ) . '</th>';
		$cta  .= '<td>' . ( $cur ? '' : '<a class="v-btn v-btn--secondary" href="' . esc_url( get_permalink( $p ) ) . '">Xem<span class="v-sr"> ' . esc_html( $p->post_title ) . '</span></a>' ) . '</td>';
	}
	$body = '';
	foreach ( $labels as $l ) {
		$body .= '<tr><th scope="row">' . esc_html( $l ) . '</th>';
		foreach ( $posts as $p ) {
			$v     = $cells[ $p->ID ][ $l ];
			$body .= '<td data-label="' . esc_attr( velis_short_name( $p ) ) . '"' . ( $miss === $v ? ' class="is-missing"' : '' ) . '>' . esc_html( $v ) . '</td>';
		}
		$body .= '</tr>';
	}
	$wide = count( $posts ) > 5 ? ' v-table-wrap--pin' : '';
	return ( $wide ? '<p class="v-swipe" aria-hidden="true">Vuốt để xem thêm →</p>' : '' ) . '<div class="v-table-wrap v-compare' . $wide . '"><table class="v-table v-table--compare"><caption>' . esc_html( $caption ) . '</caption><thead>' . $head . '</tr></thead><tbody>' . $body . $cta . '</tr></tbody></table></div>';
}

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
	$pos  = array_flip( $ids );
	usort( $ids, fn( $a, $b ) => $late( $a ) <=> $late( $b ) ?: $pos[ $a ] <=> $pos[ $b ] );
	$li = '';
	foreach ( $ids as $id ) {
		$alt = trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) ) ?: $name;
		$cap = wp_get_attachment_caption( $id );
		$li .= '<li><figure><button type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( $id, 'large' ) ) . '" aria-label="' . esc_attr( 'Phóng to: ' . $alt ) . '">' . velis_img( $id, $alt ) . '</button>' . ( $cap ? '<figcaption>' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure></li>';
	}
	return '<div class="v-gallery" data-gallery><ul class="v-gallery__track" tabindex="0" aria-label="' . esc_attr( $label . ', cuộn ngang' ) . '">' . $li . '</ul>'
		. ( count( $ids ) > 1 ? '<div class="v-gallery__nav"><button type="button" class="v-iconbtn" data-prev aria-label="Ảnh trước">‹</button><span class="v-gallery__count" aria-live="polite" data-counter>1/' . count( $ids ) . '</span><button type="button" class="v-iconbtn" data-next aria-label="Ảnh sau">›</button></div>' : '' )
		. '</div><dialog class="v-lightbox" aria-label="Xem ảnh"><form method="dialog"><button class="v-lightbox__close" aria-label="Đóng">×</button></form><img alt="" width="1200" height="800"></dialog>';
}

/** Long text field → paragraphs. */
function velis_text( string $t ): string {
	return '' === trim( $t ) ? '' : wpautop( esc_html( $t ) );
}

/** Project listing with the dropdown filter bar (Khu vực → Tiểu khu, Chủ đầu tư, Loại sản phẩm, Trạng thái). */
function velis_project_listing( array $projects ): string {
	if ( ! $projects ) {
		return '';
	}
	$devs = $types = $khu = $tt = array();
	foreach ( $projects as $p ) {
		foreach ( velis_developers( $p ) as $d ) {
			$devs[ $d->post_name ] = $d->post_title;
		}
		$types += velis_type_names( $p );
		foreach ( velis_terms( $p, 'khu-vuc' ) as $t ) {
			$khu[ $t->slug ] = $t;
		}
		if ( $s = velis_status( $p ) ) {
			$tt[ sanitize_title( $s ) ] = $s;
		}
	}
	$n      = count( $projects );
	$check  = fn( $name, $items ) => implode( '', array_map( fn( $k, $v ) => '<label><input type="checkbox" name="' . $name . '" value="' . esc_attr( $k ) . '"> ' . esc_html( $v ) . '</label>', array_keys( $items ), $items ) );
	$drop   = fn( $label, $body ) => '<details class="v-fdrop" data-fdrop><summary>' . esc_html( $label ) . ' <span data-n></span></summary><div class="v-fdrop__panel">' . $body . '</div></details>';
	$groups = '';
	if ( count( $khu ) >= 2 ) {
		$body = '';
		foreach ( get_terms( array( 'taxonomy' => 'khu-vuc', 'parent' => 0, 'hide_empty' => false ) ) as $v ) {
			$subs = array_filter( $khu, fn( $t ) => $t->parent === $v->term_id );
			if ( ! isset( $khu[ $v->slug ] ) && ! $subs ) {
				continue; // only regions that have projects
			}
			$body .= '<div class="v-regions__group"><label><input type="checkbox" name="khu" value="' . esc_attr( $v->slug ) . '" data-parent> ' . esc_html( $v->name ) . '</label>';
			foreach ( $subs as $s ) {
				$body .= '<label class="v-regions__sub"><input type="checkbox" name="khu" value="' . esc_attr( $s->slug ) . '" data-child="' . esc_attr( $v->slug ) . '"> ' . esc_html( $s->name ) . '</label>';
			}
			$body .= '</div>';
		}
		$groups .= '<details class="v-fdrop" data-fdrop><summary>Khu vực <span data-n></span></summary><div class="v-fdrop__panel v-regions" data-regions>' . $body . '</div></details>';
	}
	$groups .= count( $devs ) >= 2 ? $drop( 'Chủ đầu tư', $check( 'cdt', $devs ) ) : '';
	$groups .= count( $types ) >= 2 ? $drop( 'Loại sản phẩm', $check( 'loai', $types ) ) : '';
	$groups .= count( $tt ) >= 2 ? $drop( 'Trạng thái', $check( 'tt', $tt ) ) : '';
	$close   = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
	return '<div class="v-plist" data-plist><div class="v-plist__top">'
		. ( $groups ? '<button class="v-btn v-btn--secondary v-listing__open" type="button" data-open aria-haspopup="dialog">Bộ lọc</button><dialog class="v-drawer v-drawer--bar" aria-label="Bộ lọc dự án"><form method="dialog" class="v-filter v-fbar" data-pfilter><div class="v-drawer__head"><p class="v-filter__title">Bộ lọc dự án</p><button class="v-drawer__close" type="button" data-close>' . $close . '<span class="v-sr">Đóng bộ lọc</span></button></div><div class="v-drawer__body v-fbar__groups">' . $groups . '</div><div class="v-drawer__foot"><button class="v-btn v-btn--secondary" type="reset">Xóa lọc</button><button class="v-btn" value="apply" data-apply>Xem ' . $n . ' kết quả</button></div></form></dialog>' : '' )
		. '<p class="v-listing__count" role="status" data-plist-count>Hiển thị ' . $n . '/' . $n . ' dự án</p></div>'
		. velis_grid( array_map( fn( $p ) => velis_card_project( $p, '', true ), $projects ) )
		. '<div class="v-empty" hidden data-plist-empty><p><b>Chưa có dự án phù hợp.</b></p><button class="v-btn v-btn--secondary" type="button" data-plist-reset>Xóa lọc</button></div></div>';
}

/**
 * Phân khu listing on a đại đô thị: view "Theo phân khu" (cards grouped Cao tầng / Hỗn hợp / Thấp tầng) and
 * "Theo loại sản phẩm" (every line of every phân khu in one table, each row linking to its tab or page).
 */
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
	foreach ( array_filter( $groups ) as $g => $list ) {
		$cards .= '<div class="v-listing__group" data-group><p class="v-eyebrow">' . esc_html( $g ) . '</p>' . velis_grid( array_map( fn( $z ) => velis_card_project( $z, '', 'zone' ), $list ), 'zones' ) . '</div>';
	}
	$rows = array();
	foreach ( $zones as $z ) {
		foreach ( velis_lines( $z ) as $l ) {
			$rows[] = array( 'label' => '<a href="' . esc_url( get_permalink( $z ) . '#' . $l['anchor'] ) . '">' . esc_html( $l['name'] ) . '</a>', 'zone' => esc_html( $z->post_title ), 'area' => velis_line_area( $l ), 'price' => esc_html( velis_price_text( $l['price_from'] ?? '', $l['price_to'] ?? '', $l['price_unit'] ?? '', $l['price_month'] ?? '' ) ), 'handover' => esc_html( get_post_meta( $z->ID, 'velis_handover', true ) ) );
		}
		foreach ( velis_children( $z, 'thap-tang' ) as $low ) {
			$area   = get_post_meta( $low->ID, 'velis_land_area', true );
			$rows[] = array( 'label' => '<a href="' . esc_url( get_permalink( $low ) ) . '">' . esc_html( velis_short_name( $low ) ) . '</a>', 'zone' => esc_html( $z->post_title ), 'area' => '' !== (string) $area ? esc_html( velis_num( $area ) . ' m² đất' ) : '', 'price' => esc_html( velis_price( $low ) ), 'handover' => esc_html( get_post_meta( $z->ID, 'velis_handover', true ) ) );
		}
	}
	$table = velis_table( array( 'caption' => esc_html( 'Sản phẩm trong ' . get_the_title( $root ) ), 'corner' => 'Dòng sản phẩm', 'cols' => array( 'zone' => array( 'Phân khu', 'text' ), 'area' => array( 'Diện tích', 'num' ), 'price' => array( 'Giá', 'num' ), 'handover' => array( 'Bàn giao', 'short' ) ), 'rows' => $rows ) );
	$n     = count( $zones );
	return '<div class="v-listing" data-listing><div class="v-listing__bar"><div class="v-seg" role="group" aria-label="Chế độ xem"><button type="button" aria-pressed="true" data-view="zones">Theo phân khu</button><button type="button" aria-pressed="false" data-view="types">Theo loại sản phẩm</button></div>'
		. '<p class="v-listing__count" role="status" data-count>Hiển thị ' . $n . '/' . $n . ' phân khu</p></div>'
		. ( count( $types ) >= 2 ? str_replace( 'data-chipfilter', 'data-filter', velis_chipbar( 'loai', $types, 'Lọc theo loại sản phẩm' ) ) : '<form data-filter hidden></form>' )
		. '<div class="v-listing__layout is-single"><div class="v-listing__results"><div data-panel="zones">' . $cards
		. '<div class="v-empty" hidden data-empty><p><b>Chưa có sản phẩm phù hợp.</b> Bỏ bớt điều kiện lọc, hoặc để lại nhu cầu, Velis báo khi có hàng.</p><div class="v-row"><button class="v-btn v-btn--secondary" type="button" data-reset>Xóa lọc</button><a class="v-btn" href="#tu-van">Để lại nhu cầu</a></div></div></div>'
		. '<div data-panel="types" hidden>' . ( $rows ? $table : '<p class="v-source">Chưa có dòng sản phẩm nào được nhập.</p>' ) . '</div></div></div></div>';
}

/** Chip filter for a card grid (single dimension): data-$key on cards. $items slug => label. */
function velis_chipbar( string $key, array $items, string $label ): string {
	if ( count( $items ) < 2 ) {
		return '';
	}
	$chips = '';
	foreach ( $items as $k => $v ) {
		$chips .= '<label class="v-chip"><input type="checkbox" name="' . esc_attr( $key ) . '" value="' . esc_attr( $k ) . '"> ' . esc_html( $v ) . '</label>';
	}
	return '<form class="v-chipbar" data-chipfilter aria-label="' . esc_attr( $label ) . '">' . $chips . '<button class="v-btn v-btn--text" type="reset">Xóa lọc</button></form>';
}

/* ---------- Trust & conversion ---------- */

/** Consultation form. Posts to Contact Form 7 (velis.js); $interest pre-fills the project field. */
function velis_form_html( string $interest = '', array $options = array(), string $title = 'Nhận tư vấn', bool $info = true ): string { // $info false: the page already shows the contact details
	$uid  = wp_unique_id( 'f' );
	$cf7  = function_exists( 'velis_cf7_form_id' ) ? velis_cf7_form_id() : 0;
	$list = $options ? '<datalist id="' . $uid . '-list">' . implode( '', array_map( fn( $o ) => '<option value="' . esc_attr( $o ) . '"></option>', $options ) ) . '</datalist>' : '';
	return '<section class="v-section v-section--form" id="tu-van"><div class="v-wrap">' . velis_sechead( $title, 'Velis Realty', 'Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị gọi hoặc nhắn Zalo.' )
		. ( $info ? '<div class="v-contact"><div class="v-contact__info"><ul class="v-contact__list">'
		. '<li><span>Hotline</span><a href="tel:' . VELIS_PHONE_TEL . '">' . VELIS_PHONE . '</a></li>'
		. '<li><span>Zalo</span><a href="' . esc_url( VELIS_ZALO ) . '" rel="noopener" target="_blank">zalo.me/' . VELIS_PHONE_TEL . '</a></li>'
		. '<li><span>Email</span><a href="mailto:' . VELIS_EMAIL . '">' . VELIS_EMAIL . '</a></li>'
		. '<li><span>Giờ làm việc</span>' . VELIS_HOURS . '</li></ul></div>' : '<div class="v-contact is-form-only">' )
		. '<form class="v-form" novalidate data-form' . ( $cf7 ? ' data-cf7="' . $cf7 . '" action="' . esc_url( rest_url( 'contact-form-7/v1/contact-forms/' . $cf7 . '/feedback' ) ) . '" method="post"' : '' ) . '>'
		. '<p class="v-field"><label for="' . $uid . '-name">Họ và tên</label><input id="' . $uid . '-name" name="your-name" autocomplete="name" required aria-describedby="' . $uid . '-name-err"><span class="v-field__error" id="' . $uid . '-name-err" hidden>Vui lòng nhập họ tên.</span></p>'
		. '<p class="v-field"><label for="' . $uid . '-phone">Số điện thoại</label><input id="' . $uid . '-phone" name="your-phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9 +.]{9,15}" aria-describedby="' . $uid . '-phone-err"><span class="v-field__error" id="' . $uid . '-phone-err" hidden>Vui lòng nhập số điện thoại 9–15 chữ số.</span></p>'
		. '<fieldset class="v-field v-choice"><legend>Nhu cầu</legend><label><input type="radio" name="need" value="Mua ở"> Mua ở</label><label><input type="radio" name="need" value="Đầu tư"> Đầu tư</label><label><input type="radio" name="need" value="Cho thuê"> Cho thuê</label></fieldset>'
		. '<p class="v-field"><label for="' . $uid . '-interest">Dự án / phân khu quan tâm</label><input id="' . $uid . '-interest" name="interest" value="' . esc_attr( $interest ) . '"' . ( $list ? ' list="' . $uid . '-list"' : '' ) . '>' . $list . '</p>'
		. '<p class="v-field"><label for="' . $uid . '-note">Ghi chú <span class="v-optional">(không bắt buộc)</span></label><textarea id="' . $uid . '-note" name="note" rows="3"></textarea></p>'
		. '<p class="v-check"><input id="' . $uid . '-consent" name="consent" value="1" type="checkbox" required aria-describedby="' . $uid . '-consent-err"><label for="' . $uid . '-consent">Tôi đồng ý để Velis Realty xử lý dữ liệu cá nhân nhằm tư vấn, theo <a href="/chinh-sach-bao-mat/">chính sách bảo mật</a>.</label></p>'
		. '<span class="v-field__error" id="' . $uid . '-consent-err" hidden>Cần đồng ý để Velis liên hệ.</span>'
		. '<button class="v-btn" type="submit">Gửi yêu cầu</button>'
		. '<p class="v-form__ok" role="status" hidden>Đã nhận. Velis sẽ gọi lại trong giờ làm việc.</p><p class="v-form__fail" role="alert" hidden>Chưa gửi được. Anh chị vui lòng gọi ' . VELIS_PHONE . ' hoặc nhắn Zalo.</p>'
		. '</form></div></div></section>';
}

function velis_disclosure( string $kind = 'project' ): string {
	$t = 'project' === $kind
		? 'Thông tin trên trang chỉ để tham khảo, tổng hợp từ tài liệu công khai của chủ đầu tư tại thời điểm cập nhật. Giá, chính sách và tiến độ có thể thay đổi; vui lòng kiểm tra hợp đồng và văn bản chính thức của chủ đầu tư trước khi giao dịch.'
		: 'Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.';
	return '<aside class="v-disclosure" role="note"><p>' . esc_html( $t ) . '</p></aside>';
}

/** Author box (no portrait until a real photo exists – DESIGN.md). */
function velis_author_box( int $user_id ): string {
	$name = get_the_author_meta( 'display_name', $user_id );
	$bio  = get_the_author_meta( 'description', $user_id );
	$url  = get_author_posts_url( $user_id );
	return '<aside class="v-author" aria-label="Tác giả"><div><p class="v-eyebrow">Tác giả</p><p class="v-author__name"><a href="' . esc_url( $url ) . '">' . esc_html( $name ) . '</a> · CEO Velis Realty</p>'
		. ( $bio ? '<p>' . esc_html( $bio ) . '</p>' : '' ) . '<a class="v-btn v-btn--text" href="' . esc_url( $url ) . '">Tất cả bài của ' . esc_html( $name ) . '</a></div></aside>';
}

/**
 * Adds ids to H2/H3 in content and returns [toc html, content]. TOC only when the text is long (brief: > 1.200 words)
 * and has at least 3 H2.
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
	$toc = ( $words > 1200 && count( $items ) >= 3 ) ? '<details class="v-toc" data-toc><summary>Mục lục</summary><ol>' . implode( '', $items ) . '</ol></details>' : '';
	return array( $toc, $content );
}

function velis_pagination( WP_Query $q ): string {
	$links = paginate_links( array( 'total' => $q->max_num_pages, 'current' => max( 1, (int) get_query_var( 'paged' ) ), 'type' => 'array', 'prev_text' => '‹<span class="v-sr"> Trang trước</span>', 'next_text' => '<span class="v-sr">Trang sau </span>›' ) );
	return $links ? '<nav class="v-pagination" aria-label="Phân trang">' . implode( '', $links ) . '</nav>' : '';
}

/** Editor content for templates: the page already has its H1, so any H1 inside the content becomes an H2. */
function velis_content( string $raw ): string {
	return preg_replace( '#<(/?)h1(\b[^>]*)>#i', '<$1h2$2>', apply_filters( 'the_content', $raw ) ); // phpcs:ignore -- core filter
}

/** A card embedded inside text keeps the outline intact: its H3 title becomes a paragraph (brief: theme block titles are not headings). */
function velis_heading_to_p( string $html ): string {
	return preg_replace( '#<(/?)h3( class="v-card__title")?>#', '<$1p$2>', $html );
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

/** Full facts (the "Tổng quan" section): every value in full. */
function velis_overview_html( array $facts ): string {
	$rows = '';
	foreach ( array_filter( $facts, fn( $v ) => '' !== trim( (string) $v ) ) as $k => $v ) {
		$rows .= '<div><dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd></div>';
	}
	return $rows ? '<dl class="v-overview">' . $rows . '</dl>' : '';
}

/**
 * Static location map: the record's own map (velis_map on the project, none yet), else the map of its most specific
 * region that has one – then the caption says "khu vực". Plus a link to Google Maps for the address.
 */
function velis_map_html( $p ): string {
	$p     = get_post( $p );
	$own   = (int) get_post_meta( $p->ID, 'velis_map', true );
	$area  = '';
	$map   = $own;
	if ( ! $map ) {
		foreach ( array_reverse( velis_terms( $p, 'khu-vuc' ) ) as $t ) {
			if ( $map = (int) get_term_meta( $t->term_id, 'velis_map', true ) ) {
				$area = $t->name;
				break;
			}
		}
	}
	$addr = (string) velis_f( $p, 'velis_address' );
	$link = '<a class="v-btn" href="' . esc_url( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( velis_root( $p )->post_title . ' ' . $addr ) ) . '" target="_blank" rel="noopener">Xem trên Google Maps</a>';
	if ( ! $map ) {
		return $addr ? '<p class="v-source">' . esc_html( $addr ) . '</p><p>' . $link . '</p>' : '';
	}
	return '<div class="v-map">' . wp_get_attachment_image( $map, 'large', false, array( 'loading' => 'lazy', 'alt' => $area ? 'Bản đồ khu vực ' . $area : 'Bản đồ vị trí ' . $p->post_title ) ) . $link . '</div>'
		. '<p class="v-source">' . esc_html( ( $area ? 'Vị trí khu vực ' . $area . ' (chưa có tọa độ riêng của dự án). ' : '' ) . ( $addr ? 'Địa chỉ: ' . $addr . '. ' : '' ) . 'Bản đồ © OpenStreetMap contributors.' ) . '</p>';
}

/** "Nằm trong" box: small photo + name + 1–2 lines + link. */
function velis_within_html( $parent, string $label ): string {
	$parent  = get_post( $parent );
	$img     = velis_image_id( $parent );
	$summary = $parent->post_excerpt ?: implode( ' · ', array_filter( array( velis_short( (string) get_post_meta( $parent->ID, 'velis_scale', true ) ), implode( ', ', wp_list_pluck( velis_developers( $parent ), 'post_title' ) ), velis_region_label( $parent ) ) ) );
	return '<aside class="v-within" aria-label="' . esc_attr( $label ) . '">' . ( $img ? '<div class="v-within__img">' . velis_img( $img, $parent->post_title, 'medium' ) . '</div>' : '' )
		. '<div><p class="v-eyebrow">' . esc_html( $label ) . '</p><p class="v-within__name"><a href="' . esc_url( get_permalink( $parent ) ) . '">' . esc_html( $parent->post_title ) . '</a></p>'
		. ( $summary ? '<p class="v-within__text">' . esc_html( velis_short( $summary, 140 ) ) . '</p>' : '' ) . '</div></aside>';
}

/** Sticky horizontal section nav under the hero: only sections that have content; the one in view is highlighted. */
function velis_section_nav( array $sections ): string {
	if ( count( $sections ) < 2 ) {
		return '';
	}
	$li = '';
	foreach ( $sections as $id => $label ) {
		$li .= '<li><a href="#' . esc_attr( $id ) . '">' . esc_html( $label ) . '</a></li>';
	}
	return '<nav class="v-secnav" aria-label="Mục trên trang" data-secnav><div class="v-wrap"><ul>' . $li . '</ul></div></nav>';
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
