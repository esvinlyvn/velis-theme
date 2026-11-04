<?php
/**
 * Small render helpers shared by patterns and (later) templates. Callers pass cell values already escaped.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Data table that hides every column and every row whose cells are all empty, and lists what was hidden in one note.
 *
 * @param array $t {
 *     caption: string, corner?: string (top-left header), class?: string, wrap?: string (extra wrapper classes),
 *     cols: array<string, array{0: string, 1?: string}>  key => [label, type num|text|short],
 *     rows: list<array{label: string}+array<string,string>>  first column header + one value per col key,
 *     after?: string  raw <tr> rows appended (e.g. a CTA row), not counted as data,
 *     missing?: string  word used in the note (default "Chưa công bố").
 * }
 */
function velis_table( array $t ): string {
	$filled = fn( $v ) => '' !== trim( wp_strip_all_tags( (string) $v ) );
	$cols   = array_filter( $t['cols'], fn( $k ) => (bool) array_filter( $t['rows'], fn( $r ) => $filled( $r[ $k ] ?? '' ) ), ARRAY_FILTER_USE_KEY );
	$rows   = array_filter( $t['rows'], fn( $r ) => (bool) array_filter( array_keys( $cols ), fn( $k ) => $filled( $r[ $k ] ?? '' ) ) );
	$hidden = array_merge(
		array_map( fn( $c ) => $c[0], array_diff_key( $t['cols'], $cols ) ),
		array_map( fn( $r ) => wp_strip_all_tags( $r['label'] ), array_udiff( $t['rows'], $rows, fn( $a, $b ) => $a <=> $b ) )
	);

	$html = '<div class="v-table-wrap ' . esc_attr( $t['wrap'] ?? '' ) . '"><table class="v-table ' . esc_attr( $t['class'] ?? '' ) . '">';
	$html .= '<caption>' . $t['caption'] . '</caption><thead><tr><th scope="col">' . ( $t['corner'] ?? '' ) . '</th>';
	foreach ( $cols as $c ) {
		$html .= '<th scope="col" class="is-' . esc_attr( $c[1] ?? 'short' ) . '">' . $c[0] . '</th>';
	}
	$html .= '</tr></thead><tbody>';
	foreach ( $rows as $r ) {
		$html .= '<tr><th scope="row">' . $r['label'] . '</th>';
		foreach ( $cols as $k => $c ) {
			$html .= '<td class="is-' . esc_attr( $c[1] ?? 'short' ) . '" data-label="' . esc_attr( wp_strip_all_tags( $c[0] ) ) . '">' . ( $r[ $k ] ?? '' ) . '</td>';
		}
		$html .= '</tr>';
	}
	$html .= ( $t['after'] ?? '' ) . '</tbody></table></div>';
	if ( $hidden ) {
		$html .= '<p class="v-source">' . esc_html( ( $t['missing'] ?? 'Chưa công bố' ) . ': ' . mb_strtolower( implode( ', ', $hidden ) ) . '.' ) . '</p>';
	}
	return $html;
}

/** Area: net (thông thủy) is the main number, gross (tim tường) secondary. Either may be empty. */
function velis_area( string $net, string $gross ): string {
	if ( '' === $net && '' === $gross ) {
		return '';
	}
	if ( '' === $net ) {
		return '<span class="v-area"><b>' . esc_html( $gross ) . '</b> <small>tim tường</small></span>';
	}
	return '<span class="v-area"><b>' . esc_html( $net ) . '</b> <small>thông thủy</small>'
		. ( '' !== $gross ? '<small class="v-area__alt">' . esc_html( $gross ) . ' tim tường</small>' : '' ) . '</span>';
}

/**
 * Old pillar post text (phase 4) split into project template slots by its H2 (and the trailing "Bài viết liên quan"
 * H3). Words are not changed: each H2 text becomes the section title, the rest stays as editor HTML.
 * Returns [slot => ['title' => first H2 text or '', 'html' => body]]; unmatched headings go to 'tong-quan'.
 */
function velis_chunks( string $html ): array {
	$slots = array( // first match wins; "vị trí … vì sao nên mua" is a location heading
		'vi-tri' => 'vị trí', 'tien-do' => 'tiến độ', 'tien-ich' => 'tiện ích', 'mat-bang' => 'mặt bằng', 'gia' => 'giá bán',
		'hoi-dap' => 'câu hỏi thường gặp', 'chu-dau-tu' => 'chủ đầu tư', 'dong-san-pham' => 'loại hình sản phẩm|loại sản phẩm',
		'phan-khu' => 'phân khu', 'goc-nhin' => 'nên mua|phù hợp|lý do|đầu tư|nơi nhiều người',
	);
	$parts = preg_split( '#(<!-- wp:heading[^>]*-->\s*<h([23])[^>]*>.*?</h\2>\s*<!-- /wp:heading -->)#s', $html, -1, PREG_SPLIT_DELIM_CAPTURE );
	$out   = array();
	$slot  = 'tong-quan';
	$add   = function ( $slot, $title, $body ) use ( &$out ) {
		$out[ $slot ] ??= array( 'title' => $title, 'html' => '' );
		$out[ $slot ]['html'] .= $body;
	};
	$add( 'tong-quan', '', $parts[0] );
	for ( $i = 1; $i < count( $parts ); $i += 3 ) {
		$head = $parts[ $i ];
		$text = trim( html_entity_decode( wp_strip_all_tags( $head ), ENT_QUOTES ) );
		$low  = mb_strtolower( $text );
		if ( '3' === $parts[ $i + 1 ] ) {
			if ( preg_match( '/^(bài viết liên quan|những bài phân tích)/u', $low ) ) {
				$add( 'bai-viet', '', $head . $parts[ $i + 2 ] );
			} else {
				$add( $slot, '', $head . $parts[ $i + 2 ] );
			}
			continue;
		}
		$slot = 'tong-quan';
		foreach ( $slots as $k => $re ) {
			if ( preg_match( '/' . $re . '/u', $low ) ) {
				$slot = $k;
				break;
			}
		}
		// tổng quan keeps its H2s inside the text; other slots use the first H2 as the section title, later ones stay in the text
		if ( 'tong-quan' === $slot || isset( $out[ $slot ] ) ) {
			$add( $slot, '', $head . $parts[ $i + 2 ] );
		} else {
			$add( $slot, $text, $parts[ $i + 2 ] );
		}
	}
	return array_filter( $out, fn( $c ) => '' !== trim( $c['html'] ) || '' !== $c['title'] );
}

/** YouTube video id from a watch / youtu.be / embed / shorts URL, '' otherwise. */
function velis_youtube_id( string $url ): string {
	return preg_match( '#(?:youtu\.be/|youtube(?:-nocookie)?\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/))([\w-]{11})#', $url, $m ) ? $m[1] : '';
}

/** Click-to-load YouTube: a thumbnail link (works without JS); velis.js swaps in the player on click. */
function velis_youtube_facade( string $id, string $caption = '' ): string {
	return '<figure class="wp-block-embed is-type-video is-provider-youtube v-yt"><a class="v-yt__btn" href="https://www.youtube.com/watch?v=' . esc_attr( $id ) . '" data-yt="' . esc_attr( $id ) . '" aria-label="Phát video trên YouTube">'
		. '<img src="https://i.ytimg.com/vi/' . esc_attr( $id ) . '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"></a>'
		. ( '' !== $caption ? '<figcaption>' . $caption . '</figcaption>' : '' ) . '</figure>';
}

/** Caption that is only a file name or an auto title ("The Privé 2", "the-prive-1024x683.webp"): not shown. */
function velis_auto_caption( string $c ): bool {
	$c = trim( html_entity_decode( wp_strip_all_tags( $c ), ENT_QUOTES ) );
	return '' === $c || (bool) preg_match( '/^[\w.-]+\.(jpe?g|png|webp|gif)$|^[\w-]*[-_][\w-]*$/ui', $c ) || ( str_word_count( $c ) <= 5 && preg_match( '/^\D+\s\d{1,3}$/u', $c ) && false === strpos( $c, ',' ) );
}
