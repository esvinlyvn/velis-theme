<?php
/**
 * Title: Trang chủ
 * Slug: velis/tpl-front
 * Inserter: no
 *
 * Mockup PR #7 @ eda87a0 + decisions of 2026-11-06 (docs/NGHIEM-THU.md): hero (photo, text left, "Dự án nổi bật" strip) →
 * 4 numbers → projects with area tabs → partners (developer logos balanced by area) → "Công ty Velis Realty" + values →
 * 3 analyses → Thi thử + Tuyển dụng → form. Every text, number and the hero photo come from Cài đặt Velis (velis-data plugin,
 * vòng hoàn thiện 1.1); projects newest first, the strip = projects ticked "Nổi bật" (else the 4 newest).
 */
$projects = velis_top_projects();
$s        = 'velis_s';
$hero_img = (int) $s( 'home_img' );
$buttons  = '';
foreach ( array( 1 => '', 2 => 'line' ) as $i => $mod ) {
	$buttons .= $s( "home_btn{$i}_label" ) && $s( "home_btn{$i}_url" ) ? velis_btn( $s( "home_btn{$i}_label" ), $s( "home_btn{$i}_url" ), $mod ) : '';
}
$out = velis_hero_home( array(
	'img'     => $hero_img,
	'alt'     => trim( (string) get_post_meta( $hero_img, '_wp_attachment_image_alt', true ) ) ?: $s( 'home_title' ),
	'eyebrow' => $s( 'home_eyebrow' ),
	'title'   => $s( 'home_title' ),
	'lead'    => $s( 'home_lead' ),
	'buttons' => $buttons,
	'after'   => velis_feature_strip( velis_featured_projects() ),
) );

// b. numbers ("+" typed with the number – duyệt 2026-11-06)
$nums = array_filter( array_map( fn( $i ) => array( $s( "num{$i}_label" ), $s( "num{$i}_value" ) ), range( 1, 4 ) ), fn( $x ) => '' !== $x[1] );
if ( $nums ) {
	$out .= '<section class="section section--tight section--tint" aria-label="Velis Realty trong những con số"><div class="wrap"><dl class="numbers">'
		. implode( '', array_map( fn( $x ) => '<div><dt>' . esc_html( $x[0] ) . '</dt><dd>' . esc_html( $x[1] ) . '</dd></div>', $nums ) ) . '</dl></div></section>';
}

// c. projects, newest first (vòng hoàn thiện 2), area tabs (one at a time); "Xem tất cả dự án" follows the chosen tab to
// /du-an/?khu=… (velis.js)
$order = array( 'khu-dong', 'khu-tay', 've-tinh', 'tay-bac' );
$tabs  = array();
foreach ( $projects as $p ) {
	foreach ( velis_terms( $p, 'khu-vuc' ) ?: velis_terms( velis_root( $p ), 'khu-vuc' ) as $t ) {
		$top = $t->parent ? get_term( $t->parent, 'khu-vuc' ) : $t;
		if ( $top && ! is_wp_error( $top ) ) {
			$tabs[ $top->slug ]['top']             = $top;
			$tabs[ $top->slug ]['sub'][ $t->slug ] = $t->parent ? $t->name : ( $tabs[ $top->slug ]['sub'][ $t->slug ] ?? null );
		}
	}
}
uksort( $tabs, fn( $a, $b ) => ( array_search( $a, $order, true ) === false ? 99 : array_search( $a, $order, true ) ) <=> ( array_search( $b, $order, true ) === false ? 99 : array_search( $b, $order, true ) ) );
$label = fn( $t ) => $t['top']->name; // 2.6: region names are the khu-vuc data names everywhere (home tabs = /du-an/ filter)
$cards = array_map( fn( $p ) => preg_replace( '/^<article class="card"/', '<article class="card" data-khu="' . esc_attr( implode( ' ', velis_region_slugs( $p ) ) ) . '"', velis_card_project( $p ) ), $projects );
$n     = count( $cards );
$out  .= '<section class="section" id="du-an" aria-labelledby="du-an-h"><div class="wrap"><header class="sechead"><h2 id="du-an-h">Dự án Velis đang tư vấn</h2></header>'
	. ( count( $tabs ) >= 2 ? '<div class="ftabs" role="group" aria-label="Lọc theo khu vực" data-filter="#du-an .grid" data-noun="dự án" data-single><button type="button" data-clear aria-pressed="true">Tất cả</button>'
		. implode( '', array_map( fn( $s, $t ) => '<button type="button" data-key="khu" value="' . esc_attr( $s ) . '" aria-pressed="false">' . esc_html( $label( $t ) ) . '</button>', array_keys( $tabs ), $tabs ) )
		. '<p class="sr-only" data-count aria-live="polite">Hiển thị ' . $n . '/' . $n . ' dự án</p></div>' : '' )
	. velis_grid( $cards, 'three', ' data-live' )
	. '<p class="more-center"><a class="btn btn--line" href="' . esc_url( (string) get_post_type_archive_link( 'du-an' ) ) . '" data-filter-link="khu">Xem tất cả dự án</a></p></div></section>';

// d. partners: developers with a logo (their featured image), every logo the same visual area (±15 %), ≤ 48 px high, ≤ 160 px wide (duyệt 2026-11-06)
$logos = '';
foreach ( get_posts( array( 'post_type' => 'chu-dau-tu', 'numberposts' => 50, 'orderby' => 'title', 'order' => 'ASC' ) ) as $d ) {
	if ( '' === ( $img = velis_dev_logo( $d, array( 6800, 64, 200 ) ) ) ) {
		continue;
	}
	$logos .= '<li><a href="' . esc_url( get_permalink( $d ) ) . '" aria-label="' . esc_attr( $d->post_title ) . '">' . $img . '</a></li>';
}
if ( $logos ) {
	$out .= '<section class="section section--tint" aria-labelledby="cdt-h"><div class="wrap"><header class="sechead"><h2 id="cdt-h">' . esc_html( $s( 'partners_title' ) ) . '</h2>'
		. ( $s( 'partners_lead' ) ? '<p>' . esc_html( $s( 'partners_lead' ) ) . '</p>' : '' ) . '</header>'
		. '<ul class="partners partners--row" style="--n: ' . substr_count( $logos, '<li>' ) . '">' . $logos . '</ul></div></section>'; // 3.1: equal cells across the frame
}

// e. "Công ty Velis Realty" (3.2): one block, 6/12 + 6/12 – the intro (eyebrow, H2, 2 paragraphs, button) beside the 4
// values as a numbered list
$values = array_filter( array_map( fn( $i ) => array( $s( "value{$i}_title" ), $s( "value{$i}_text" ) ), range( 1, 4 ) ), fn( $v ) => '' !== $v[0] );
$out   .= '<section class="section" id="ve-velis" aria-labelledby="ve-velis-h"><div class="wrap about"><div class="about__text"><p class="eyebrow">' . esc_html( $s( 'about_eyebrow' ) ) . '</p><h2 id="ve-velis-h">' . esc_html( $s( 'about_title' ) ) . '</h2>'
	. implode( '', array_map( fn( $t ) => '<p>' . esc_html( $t ) . '</p>', array_filter( array( $s( 'about_p1' ), $s( 'about_p2' ) ) ) ) )
	. ( $s( 'about_btn_label' ) && $s( 'about_btn_url' ) ? '<p class="mb-0">' . velis_btn( $s( 'about_btn_label' ), $s( 'about_btn_url' ), 'line' ) . '</p>' : '' ) . '</div>'
	. ( $values ? '<div class="about__values"><h3 class="about__values-h">' . esc_html( $s( 'values_title' ) ) . '</h3><ol class="values">'
	. implode( '', array_map( fn( $v ) => '<li><h4>' . esc_html( $v[0] ) . '</h4><p>' . esc_html( $v[1] ) . '</p></li>', $values ) ) . '</ol></div>' : '' ) . '</div></section>';

// f. analyses: newest posts whose featured image is a real project image (velis_image_kind), one per project cluster
$posts = array();
$seen  = array();
foreach ( get_posts( array( 'numberposts' => 40, 'meta_key' => 'velis_image_kind', 'meta_value' => 'du-an' ) ) as $p ) {
	$c = velis_primary_category( $p );
	if ( count( $posts ) < 3 && ! isset( $seen[ $c ? $c->term_id : 0 ] ) ) {
		$posts[]                       = $p;
		$seen[ $c ? $c->term_id : 0 ] = true;
	}
}
if ( $posts ) {
	$out .= velis_section( velis_sechead( 'Bài phân tích chuyên sâu', '', '', 'bai-h', '<a class="btn btn--text" href="/blog/">Đọc blog Velis →</a>' ) . velis_grid( array_map( 'velis_card_post', $posts ) ), '', 'section--tint' );
}

// g. exam + careers: one champagne band, 2 boxes of the same height
$duo = '';
foreach ( array( 'exam', 'jobs' ) as $k ) {
	$duo .= $s( "{$k}_title" ) ? '<div class="duo__item"><h2 class="duo__title">' . esc_html( $s( "{$k}_title" ) ) . '</h2>' . ( $s( "{$k}_text" ) ? '<p>' . esc_html( $s( "{$k}_text" ) ) . '</p>' : '' )
		. ( $s( "{$k}_btn" ) && $s( "{$k}_url" ) ? velis_btn( $s( "{$k}_btn" ), $s( "{$k}_url" ) ) : '' ) . '</div>' : '';
}
$out .= $duo ? '<section class="section section--tight" aria-label="' . esc_attr( implode( ' và ', array_filter( array( $s( 'exam_title' ), $s( 'jobs_title' ) ) ) ) ) . '"><div class="wrap duo">' . $duo . '</div></section>' : '';

$out .= velis_form_html();
?>
<!-- wp:html -->
<?php echo $out; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in helpers ?>
<!-- /wp:html -->
