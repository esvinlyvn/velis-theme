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
