<?php
/**
 * Reusable components (DESIGN.md) rendered from data. Every function returns escaped HTML.
 * Missing-data rules: empty field → element not rendered; price → one muted "chưa công bố" line; no image → neutral frame.
 */

defined( 'ABSPATH' ) || exit;

const VELIS_ICON_PHONE = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';

/** Attachment image with the theme's focus/zoom variables; '' when no image. */
function velis_img( int $id, string $alt, string $size = 'large', array $attr = array() ): string {
	if ( ! $id ) {
		return '';
	}
	return wp_get_attachment_image( $id, $size, false, $attr + array( 'alt' => $alt, 'loading' => 'lazy', 'style' => '--focus: 50% 50%' ) );
}

function velis_media( int $id, string $name, string $class = 'v-card__media' ): string {
	return $id ? '<div class="' . esc_attr( $class ) . '">' . velis_img( $id, $name, 'medium_large' ) . '</div>'
		: '<div class="' . esc_attr( $class ) . ' v-media--empty"><span>' . esc_html( $name ) . '</span></div>';
}

function velis_price_html( string $price, string $prefix = 'Giá ' ): string {
	return '' === $price ? '<p class="v-price is-missing">Giá: chưa công bố</p>' : '<p class="v-price">' . esc_html( $prefix . $price ) . '</p>';
}

function velis_more( string $t ): string {
	return '<span class="v-card__link" aria-hidden="true">' . esc_html( $t ) . ' →</span>';
}

/** Section header: eyebrow (not a heading) → H2 → lead. */
function velis_sechead( string $title, string $eyebrow = '', string $lead = '', string $id = '' ): string {
	return '<header class="v-sechead">' . ( $eyebrow ? '<p class="v-eyebrow">' . esc_html( $eyebrow ) . '</p>' : '' )
		. '<h2' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '>' . esc_html( $title ) . '</h2>'
		. ( $lead ? '<p class="v-sechead__lead">' . esc_html( $lead ) . '</p>' : '' ) . '</header>';
}

function velis_section( string $inner, string $id = '', string $class = '' ): string {
	return '<section class="v-section ' . esc_attr( $class ) . '"' . ( $id ? ' id="' . esc_attr( $id ) . '"' : '' ) . '><div class="v-wrap">' . $inner . '</div></section>';
}

/* ---------- Cards ---------- */

function velis_card_project( $p, string $kicker = '', $filter_data = false ): string { // $filter_data: true (project listing) | 'zone' (phân khu listing)
	$p      = get_post( $p );
	$name   = $p->post_title;
	$devs   = velis_developers( $p );
	$status = velis_status( $p );
	$types  = velis_type_names( $p );
	$data   = '';
	if ( 'zone' === $filter_data ) {
		static $n = 0;
		$data = sprintf( ' data-n="%d" data-loai="%s" data-tt="%s" data-pn="" data-gia="" data-dt="" data-bg=""', ++$n, esc_attr( implode( ' ', array_keys( $types ) ) ), esc_attr( sanitize_title( $status ) ) );
	} elseif ( $filter_data ) {
		$data = sprintf( ' data-card data-khu="%s" data-cdt="%s" data-loai="%s" data-tt="%s"', esc_attr( implode( ' ', wp_list_pluck( velis_terms( $p, 'khu-vuc' ), 'slug' ) ) ), esc_attr( implode( ' ', wp_list_pluck( $devs, 'post_name' ) ) ), esc_attr( implode( ' ', array_keys( $types ) ) ), esc_attr( sanitize_title( $status ) ) );
	}
	$meta = 'thap-tang' === velis_level( $p ) ? implode( ' · ', array_filter( velis_facts( $p ) ) ) : implode( ' · ', array_filter( array( $devs ? $devs[0]->post_title : '', velis_region_label( $p ) ) ) );
	return '<article class="v-card' . ( 'zone' === $filter_data ? ' v-zone' : '' ) . '"' . $data . '>' . velis_media( velis_image_id( $p ), $name )
		. '<div class="v-card__body">' . ( $status ? '<span class="v-badge">' . esc_html( $status ) . '</span>' : '' )
		. ( $kicker ? '<p class="v-card__kicker">' . esc_html( $kicker ) . '</p>' : '' )
		. '<h3 class="v-card__title"><a href="' . esc_url( get_permalink( $p ) ) . '">' . esc_html( $name ) . '</a></h3>'
		. ( 'phan-khu' === velis_level( $p ) && $types ? '<ul class="v-chips"><li>' . implode( '</li><li>', array_map( 'esc_html', $types ) ) . '</li></ul>' : '' )
		. ( $meta ? '<p class="v-card__meta">' . esc_html( $meta ) . '</p>' : '' )
		. velis_price_html( velis_price( $p ) ) . velis_more( 'thap-tang' === velis_level( $p ) ? 'Xem ' . mb_strtolower( velis_short_name( $p ) ) : ( 'phan-khu' === velis_level( $p ) ? 'Xem phân khu' : 'Xem dự án' ) ) . '</div></article>';
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

function velis_card_post( $p, bool $filter_data = false ): string {
	$p    = get_post( $p );
	$kind = velis_post_kind( $p );
	$data = $filter_data ? sprintf( ' data-card data-kind="%s" data-pk="%s"', esc_attr( $kind ), esc_attr( implode( ' ', wp_list_pluck( velis_post_projects( $p ), 'post_name' ) ) ) ) : '';
	return '<article class="v-card"' . $data . '>' . velis_media( (int) get_post_thumbnail_id( $p ), get_the_title( $p ) )
		. '<div class="v-card__body"><p class="v-card__kicker">' . esc_html( VELIS_KINDS[ $kind ] ) . '</p>'
		. '<h3 class="v-card__title"><a href="' . esc_url( get_permalink( $p ) ) . '">' . esc_html( get_the_title( $p ) ) . '</a></h3>'
		. '<p class="v-card__meta">' . esc_html( get_the_author_meta( 'display_name', $p->post_author ) . ' · ' . get_the_date( 'd/m/Y', $p ) . ' · ' . velis_reading_minutes( $p ) . ' phút đọc' ) . '</p>'
		. velis_more( 'Đọc bài' ) . '</div></article>';
}

function velis_grid( array $cards, string $mod = '4', string $attrs = '' ): string {
	return $cards ? '<div class="v-grid v-grid--' . esc_attr( $mod ) . '"' . $attrs . '>' . implode( '', $cards ) . '</div>' : '';
}

/* ---------- Heroes ---------- */

/** Hero A: full-bleed photo + overlay. $a: img, title, h1 (bool), eyebrow, lead, buttons (html). */
function velis_hero_a( array $a ): string {
	$tag  = empty( $a['h1'] ) ? 'p' : 'h1';
	$img  = $a['img'] ? wp_get_attachment_image( $a['img'], 'full', false, array( 'alt' => $a['alt'] ?? $a['title'], 'fetchpriority' => 'high', 'loading' => 'eager', 'sizes' => '100vw', 'style' => '--focus: 50% 50%' ) ) : '<span class="v-hero__fallback" aria-hidden="true">' . esc_html( $a['title'] ) . '</span>';
	return '<section class="v-hero v-hero--full' . ( $a['img'] ? '' : ' is-empty' ) . '" aria-label="' . esc_attr( $a['title'] ) . '">' . $img . '<div class="v-hero__body">'
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

function velis_facts_html( array $facts, string $price, string $note = '' ): string {
	$html = '<dl class="v-facts">';
	foreach ( array_filter( $facts, fn( $v ) => '' !== trim( (string) $v ) ) as $k => $v ) {
		$html .= '<div><dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd></div>';
	}
	$html .= '<div><dt>Giá tham khảo</dt>' . ( '' === $price ? '<dd class="is-missing">Chưa công bố</dd>' : '<dd>' . esc_html( $price ) . '</dd>' ) . '</div></dl>';
	return $html . ( $note ? '<p class="v-source">' . esc_html( $note ) . '</p>' : '' );
}

/** Area of an apartment line: net (thông thủy) is the main number, gross (tim tường) secondary. */
function velis_line_area( array $l ): string {
	$net   = velis_has_data() ? velis_range( $l['net_from'] ?? '', $l['net_to'] ?? '', 'm²' ) : '';
	$gross = velis_has_data() ? velis_range( $l['gross_from'] ?? '', $l['gross_to'] ?? '', 'm²' ) : '';
	return velis_area( $net, $gross );
}

/** Apartment lines as tabs, each with its own anchor (#can-2pn). */
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
		$mini  = array(
			'Diện tích' => velis_line_area( $l ), 'Phòng ngủ' => esc_html( $l['beds'] ?? '' ), 'Hướng / vị trí' => esc_html( $l['facing'] ?? '' ),
			'Số lượng' => esc_html( $l['qty'] ?? '' ), 'Bàn giao' => esc_html( $fin[ $l['finish'] ?? '' ] ?? '' ), 'Sở hữu' => esc_html( $l['ownership'] ?? '' ),
			'Tình trạng' => esc_html( $stock[ $l['stock'] ?? '' ] ?? '' ),
		);
		$dl = '';
		foreach ( array_filter( $mini, fn( $v ) => '' !== $v && '—' !== $v ) as $k => $v ) {
			$dl .= '<div><dt>' . esc_html( $k ) . '</dt><dd>' . $v . '</dd></div>';
		}
		$dl   .= '<div><dt>Giá</dt>' . ( $price ? '<dd>' . esc_html( $price ) . ( ! empty( $l['source'] ) ? ' <small>· ' . esc_html( $l['source'] ) . '</small>' : '' ) . '</dd>' : '<dd class="is-missing">Chưa công bố</dd>' ) . '</div>';
		$plan  = ! empty( $l['plan'] ) ? '<button class="v-line__plan" type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( (int) $l['plan'], 'full' ) ) . '" aria-label="' . esc_attr( 'Phóng to mặt bằng ' . $l['name'] ) . '">' . velis_img( (int) $l['plan'], 'Mặt bằng ' . $l['name'] . ' ' . $name ) . '</button>' : '';
		$panes .= '<section class="v-tabs__panel" id="' . esc_attr( $id ) . '" role="tabpanel" tabindex="0"><h3>' . esc_html( $l['name'] ) . '</h3><div class="v-line' . ( $plan ? '' : ' is-noplan' ) . '"><div class="v-line__info"><dl class="v-mini">' . $dl . '</dl>'
			. '<a class="v-btn" href="#tu-van" data-interest="' . esc_attr( $name . ' – ' . $l['name'] ) . '">Nhận bảng giá ' . esc_html( $l['name'] ) . '</a></div>' . $plan . '</div></section>';
	}
	return '<div class="v-tabs" data-tabs><div class="v-tabs__list" role="tablist" aria-label="' . esc_attr( 'Dòng căn hộ ' . $name ) . '" hidden>' . $tabs . '</div>' . $panes . '</div>';
}

/** Comparison table: columns = records, rows = criteria (label => fn(post): string). Empty rows/cols hidden. */
function velis_compare_html( array $posts, array $crit, string $caption, $current = null ): string {
	if ( count( $posts ) < 2 ) {
		return '';
	}
	$cols = array();
	$cta  = '<tr class="v-table__cta"><th scope="row"><span class="v-sr">Liên kết</span></th>';
	foreach ( $posts as $p ) {
		$cols[ 'p' . $p->ID ] = array( esc_html( velis_short_name( $p ) ) . ( $current && $current->ID === $p->ID ? ' <small>(trang này)</small>' : '' ), 'text' );
		$cta                 .= '<td>' . ( $current && $current->ID === $p->ID ? '' : '<a class="v-btn v-btn--secondary" href="' . esc_url( get_permalink( $p ) ) . '">Xem<span class="v-sr"> ' . esc_html( $p->post_title ) . '</span></a>' ) . '</td>';
	}
	$rows = array();
	foreach ( $crit as $label => $fn ) {
		$row = array( 'label' => esc_html( $label ) );
		foreach ( $posts as $p ) {
			$row[ 'p' . $p->ID ] = esc_html( (string) $fn( $p ) );
		}
		$rows[] = $row;
	}
	return '<p class="v-swipe" aria-hidden="true">Vuốt để xem thêm →</p>' . velis_table( array( 'caption' => esc_html( $caption ), 'corner' => 'Tiêu chí', 'class' => 'v-table--compare', 'wrap' => 'v-table-wrap--pin', 'cols' => $cols, 'rows' => $rows, 'after' => $cta . '</tr>', 'missing' => 'Chưa có dữ liệu' ) );
}

function velis_gallery_html( array $ids, string $name, string $label = 'Thư viện ảnh' ): string {
	$ids = array_values( array_filter( array_map( 'intval', $ids ) ) );
	if ( ! $ids ) {
		return '';
	}
	$li = '';
	foreach ( $ids as $id ) {
		$alt = trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) ) ?: $name;
		$cap = wp_get_attachment_caption( $id );
		$li .= '<li><figure><button type="button" data-zoom="' . esc_url( wp_get_attachment_image_url( $id, 'full' ) ) . '" aria-label="' . esc_attr( 'Phóng to: ' . $alt ) . '">' . velis_img( $id, $alt ) . '</button>' . ( $cap ? '<figcaption>' . esc_html( $cap ) . '</figcaption>' : '' ) . '</figure></li>';
	}
	return '<div class="v-gallery" data-gallery><ul class="v-gallery__track" tabindex="0" aria-label="' . esc_attr( $label . ', cuộn ngang' ) . '">' . $li . '</ul>'
		. ( count( $ids ) > 1 ? '<div class="v-gallery__nav"><button type="button" class="v-iconbtn" data-prev aria-label="Ảnh trước">‹</button><span class="v-gallery__count" aria-live="polite" data-counter>1/' . count( $ids ) . '</span><button type="button" class="v-iconbtn" data-next aria-label="Ảnh sau">›</button></div>' : '' )
		. '</div><dialog class="v-lightbox" aria-label="Xem ảnh"><form method="dialog"><button class="v-lightbox__close" aria-label="Đóng">×</button></form><img alt=""></dialog>';
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
function velis_form_html( string $interest = '', array $options = array(), string $title = 'Nhận tư vấn' ): string {
	$uid  = wp_unique_id( 'f' );
	$cf7  = function_exists( 'velis_cf7_form_id' ) ? velis_cf7_form_id() : 0;
	$list = $options ? '<datalist id="' . $uid . '-list">' . implode( '', array_map( fn( $o ) => '<option value="' . esc_attr( $o ) . '"></option>', $options ) ) . '</datalist>' : '';
	return '<section class="v-section v-section--form" id="tu-van"><div class="v-wrap">' . velis_sechead( $title, 'Velis Realty', 'Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị gọi hoặc nhắn Zalo.' )
		. '<div class="v-contact"><div class="v-contact__info"><ul class="v-contact__list">'
		. '<li><span>Hotline</span><a href="tel:' . VELIS_PHONE_TEL . '">' . VELIS_PHONE . '</a></li>'
		. '<li><span>Zalo</span><a href="' . esc_url( VELIS_ZALO ) . '" rel="noopener" target="_blank">zalo.me/' . VELIS_PHONE_TEL . '</a></li>'
		. '<li><span>Email</span><a href="mailto:' . VELIS_EMAIL . '">' . VELIS_EMAIL . '</a></li>'
		. '<li><span>Giờ làm việc</span>' . VELIS_HOURS . '</li></ul></div>'
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
