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

	$html = '<div class="table-wrap"><table>';
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
		$html .= '<p class="source">' . esc_html( ( $t['missing'] ?? 'Chưa công bố' ) . ': ' . mb_strtolower( implode( ', ', $hidden ) ) . '.' ) . '</p>';
	}
	return $html;
}

/** Area: net (thông thủy) is the main number, gross (tim tường) secondary. Either may be empty. */
function velis_area( string $net, string $gross ): string {
	if ( '' === $net && '' === $gross ) {
		return '';
	}
	if ( '' === $net ) {
		return '<span><b>' . esc_html( $gross ) . '</b> tim tường</span>';
	}
	return '<span><b>' . esc_html( $net ) . '</b> thông thủy' . ( '' !== $gross ? ' · ' . esc_html( $gross ) . ' tim tường' : '' ) . '</span>';
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
			if ( preg_match( '/^(bài viết liên quan|những bài phân tích|bài phân tích chuyên sâu)/u', $low ) ) {
				$add( 'bai-viet', '', $head . $parts[ $i + 2 ] ); // kept apart; templates do not print it (own related posts block)
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
		// The "Thông tin tổng quan …" H2 becomes the Tổng quan title (no second "Tổng quan" heading, round 6); other H2 of
		// tổng quan stay in the text; other slots use their first H2 as the section title, later ones stay in the text.
		if ( 'tong-quan' === $slot && '' === $out['tong-quan']['title'] && preg_match( '/tổng quan|^thông tin/u', $low ) ) {
			$out['tong-quan']['title'] = $text;
			$out['tong-quan']['html'] .= $parts[ $i + 2 ];
		} elseif ( 'tong-quan' === $slot || isset( $out[ $slot ] ) ) {
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
	return '<figure class="wp-block-embed is-type-video is-provider-youtube"><a class="pic" href="https://www.youtube.com/watch?v=' . esc_attr( $id ) . '" data-yt="' . esc_attr( $id ) . '" aria-label="Phát video trên YouTube">'
		. '<img src="https://i.ytimg.com/vi/' . esc_attr( $id ) . '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"><span class="btn" aria-hidden="true">Phát video</span></a>'
		. ( '' !== $caption ? '<figcaption>' . $caption . '</figcaption>' : '' ) . '</figure>';
}

/** Caption that is only a file name or an auto title ("The Privé 2", "the-prive-1024x683.webp"): not shown. */
function velis_auto_caption( string $c ): bool {
	$c = trim( html_entity_decode( wp_strip_all_tags( $c ), ENT_QUOTES ) );
	return '' === $c || (bool) preg_match( '/^[\w.-]+\.(jpe?g|png|webp|gif)$|^[\w-]*[-_][\w-]*$/ui', $c ) || ( count( preg_split( '/\s+/u', $c ) ) <= 8 && preg_match( '/^\D+\s\d{1,2}$/u', $c ) && false === strpos( $c, ',' ) );
}

/** Old "Bài viết liên quan" lists left in migrated text: heading + everything up to the next heading (templates show their own). */
function velis_strip_related( string $html ): string {
	return preg_replace( '#<h([2-4])[^>]*>\s*(?:<[^>]+>\s*)*(bài viết liên quan|những bài phân tích chuyên sâu|bài phân tích chuyên sâu)\s*(?:<[^>]+>\s*)*</h\1>.*?(?=<h[2-4][\s>]|$)#siu', '', $html );
}

/** Contact list left in migrated page text (address / hotline / email) and its lead-in line: dropped – the page shows
 *  the contact details once, in the "Nhận tư vấn" block (round 6). */
function velis_strip_contact( string $html ): string {
	$html = preg_replace( '#(?:<(p|h[2-6])[^>]*>(?:(?!</\1>).)*:\s*(?:</strong>)?\s*</\1>\s*)?<ul[^>]*>(?:(?!</ul>).)*Hotline(?:(?!</ul>).)*</ul>#siu', '', $html );
	$html = preg_replace( '#<(h[2-6])[^>]*>(?:(?!</\1>).)*Liên hệ ngay(?:(?!</\1>).)*</\1>#siu', '', $html ); // lead-in heading left alone
	return preg_replace( '#<figure[^>]*>(?:(?!</figure>).)*ban-do-van-phong-velis(?:(?!</figure>).)*</figure>#siu', '', $html ); // office map: shown on Liên hệ
}

/** Captions that are only a file name / auto title, also those added after the block filters (Rank Math). */
function velis_strip_auto_captions( string $html ): string {
	return preg_replace_callback( '#<figcaption[^>]*>(.*?)</figcaption>#s', fn( $m ) => velis_auto_caption( $m[1] ) ? '' : $m[0], $html );
}

/** Construction photo grid: [columns ≥ 768 px, first photo 2 cells wide] so the last row never holds a single photo. */
function velis_photo_cols( int $n ): array {
	$cols = ( $n < 3 || 4 === $n ) ? max( 1, min( 2, $n ) ) : 3;
	return array( $cols, 3 === $cols && 0 !== $n % 3 ); // 5 → 2+1 / 3, 7 → 2+1 / 3 / 2
}

/** "Bàn giao" + "Từ tháng 11/2023" → "Bàn giao từ tháng 11/2023": a common first word of the value goes lower case (round 8). */
function velis_label_value( string $label, string $value ): string {
	$value = preg_replace_callback( '/^(Từ|Dự kiến|Quý|Năm|Tháng)\b/u', fn( $m ) => mb_strtolower( $m[1] ), $value );
	return $label . ' ' . $value;
}

/**
 * `sizes` with the crop zoom / cover factor in it: each slot length L becomes calc(z * (L)), so the browser fetches the file
 * the zoomed picture needs. $rules: a normal sizes value, e.g. "(min-width: 1024px) 400px, 100vw".
 * X-01 = d: only the page's main picture ($lcp) gets a pick margin (× 1.15: above 1x Chromium may take the next smaller file
 * when the density sits below the geometric mean of two widths); every other picture is sized to frame × DPR, no margin.
 */
function velis_sizes( string $rules, float $z = 1, bool $lcp = false ): string {
	$z = round( $z * ( $lcp ? 1.15 : 1 ), 3 );
	if ( 1.0 === $z ) {
		return $rules;
	}
	return implode( ', ', array_map( function ( $r ) use ( $z ) {
		$r = trim( $r );
		return preg_match( '/^(\([^)]*\)\s+)?(.+)$/', $r, $m ) ? $m[1] . 'calc(' . $z . ' * (' . $m[2] . '))' : $r;
	}, preg_split( '/,(?![^(]*\))(?!(?:[^(]*\([^()]*\))*[^(]*\))/', $rules ) ) ); // split on top-level commas only (nested min()/max() keep theirs)
}

/** Widest file of a picture: the largest "NNNw" of its srcset, else the given width. */
function velis_max_candidate( string $srcset, int $fallback = 0 ): int {
	preg_match_all( '/\s(\d+)w(?:,|$)/', ' ' . $srcset, $m );
	return $m[1] ? max( array_map( 'intval', $m[1] ) ) : $fallback;
}

/** Image blocks of a text (block markup) taken out: [text without them, [[attachment id, caption], …]] in reading order. */
function velis_take_images( string $html ): array {
	$found = array();
	$rest  = preg_replace_callback( '#<!-- wp:image\b[^>]*-->(.*?)<!-- /wp:image -->#s', function ( $m ) use ( &$found ) {
		if ( preg_match( '/wp-image-(\d+)/', $m[1], $id ) ) {
			$cap     = preg_match( '#<figcaption[^>]*>(.*?)</figcaption>#s', $m[1], $f ) ? trim( wp_strip_all_tags( $f[1] ) ) : '';
			$found[] = array( (int) $id[1], $cap );
			return '';
		}
		return $m[0];
	}, $html );
	return array( $rest, $found );
}

/** Longest run of whole, consecutive sentences with at most $max words (quoting a page without writing new text). */
function velis_sentence_run( string $text, int $max = 60 ): string {
	$s    = preg_split( '/(?<=[.!?…])\s+/u', trim( preg_replace( '/\s+/u', ' ', $text ) ) );
	$best = '';
	foreach ( array_keys( $s ) as $i ) {
		for ( $j = $i; $j < count( $s ); $j++ ) {
			$run = implode( ' ', array_slice( $s, $i, $j - $i + 1 ) );
			if ( count( preg_split( '/\s+/u', $run ) ) > $max ) {
				break;
			}
			$best = mb_strlen( $run ) > mb_strlen( $best ) ? $run : $best;
		}
	}
	return $best;
}
