<?php
// php tools/tests/the7-child-cta-test.php — the7-child functions.php with stubs: mobile contact bar, hero image, CF7 phone rule,
// unused assets, schema graph.
define( 'ABSPATH', __DIR__ );
$GLOBALS['hooks'] = array(); $GLOBALS['done'] = array(); $GLOBALS['mods'] = array(); $_SERVER['REQUEST_URI'] = '/can-ho-persa-place/';
function add_action( $h, $cb ) { $GLOBALS['hooks'][ $h ][] = $cb; }
function add_filter( $h, $cb ) { $GLOBALS['hooks'][ $h ][] = $cb; }
function do_action( $h ) { $GLOBALS['done'][ $h ] = true; }
function did_action( $h ) { return ! empty( $GLOBALS['done'][ $h ] ); }
function get_theme_mod( $k, $d ) { return $GLOBALS['mods'][ $k ] ?? $d; }
function esc_attr( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_url( $u ) { return preg_match( '#^(https?://|/|\#|tel:)#', $u ) ? htmlspecialchars( $u, ENT_QUOTES ) : ''; }
function untrailingslashit( $s ) { return rtrim( $s, '/' ); }
function wp_parse_url( $u, $c ) { return parse_url( $u, $c ); }
function add_query_arg( $a ) { return $_SERVER['REQUEST_URI']; }
function home_url( $p = '' ) { return 'https://x' . $p; }
function add_shortcode( $t, $cb ) { $GLOBALS['hooks'][ 'shortcode_' . $t ][] = $cb; }
function sanitize_text_field( $s ) { return trim( strip_tags( $s ) ); }
require __DIR__ . '/../../the7-child/dt-the7-child/functions.php';
$h = velis_cta_html();
$ok = str_contains( $h, 'href="tel:0911237979"' ) && str_contains( $h, 'href="https://zalo.me/0911237979"' ) && str_contains( $h, 'href="/lien-he/">Nhận tư vấn' ) && str_contains( $h, 'aria-label="Liên hệ nhanh"' );
// On the consult page itself, once a CF7 form got the stable id, the button jumps to the form.
$_SERVER['REQUEST_URI'] = '/lien-he/';
$form_id = $GLOBALS['hooks']['wpcf7_form_id_attr'][0];
$ok = $ok && 'velis-tu-van' === $form_id( '' ) && '' === $form_id( '' ) && str_contains( velis_cta_html(), 'href="#velis-tu-van"' );
// Edited values win; an empty phone or Zalo hides that item; a javascript: link is not printed.
$GLOBALS['mods'] = array( 'velis_cta_phone' => '', 'velis_cta_zalo' => 'javascript:alert(1)' );
$h   = velis_cta_html();
$ok  = $ok && ! str_contains( $h, 'tel:' ) && ! str_contains( $h, 'javascript' ) && ! str_contains( $h, 'Zalo' );
// The reveal script toggles .is-on on the bar; <head> marks JS so the hidden state never applies without JS.
$ok  = $ok && str_contains( velis_cta_script(), 'classList.toggle("is-on"' ) && ! empty( $GLOBALS['hooks']['wp_head'] );
// Hero image = WPBakery Single Image with class velis-hero-bg (attribute order free); none → 0.
$ok  = $ok && 19968 === velis_hero_image_id( '[vc_section el_class="velis-home-hero"][vc_single_image image="19968" img_size="full" el_class="velis-hero-bg"]' )
	&& 7 === velis_hero_image_id( '[vc_single_image el_class="x velis-hero-bg" image="7"][vc_single_image image="8"]' ) && 0 === velis_hero_image_id( '[vc_single_image image="8"]' );
// Vietnamese mobile number: 10 digits from 0, spaces / dots allowed; +84, 9 or 11 digits, letters rejected.
$ok  = $ok && velis_vn_phone_ok( '0911 237 979' ) && velis_vn_phone_ok( '0911.237.979' ) && velis_vn_phone_ok( '0911237979' )
	&& ! velis_vn_phone_ok( '+84911237979' ) && ! velis_vn_phone_ok( '091123797' ) && ! velis_vn_phone_ok( '09112379790' ) && ! velis_vn_phone_ok( '0911a37979' ) && ! velis_vn_phone_ok( '' );
$f   = $GLOBALS['hooks']['wpcf7_form_elements'][0];
$ok  = $ok && '<input inputmode="tel" type="tel" name="sdt">' === $f( '<input type="tel" name="sdt">' ) && '<input type="text">' === $f( '<input type="text">' )
	&& '<input inputmode="numeric" type="tel">' === $f( '<input inputmode="numeric" type="tel">' );
$ok  = $ok && str_contains( velis_page_script(), 'Đang gửi…' ) && str_contains( velis_page_script(), 'wpcf7submit' );
// Unused files: icon fonts only where content uses them; archive drops Ultimate Addons assets; page never drops them.
list( $css, $js ) = velis_unused_assets( '[vc_column_text]x[/vc_column_text]', false );
$ok  = $ok && in_array( 'the7-awesome-fonts', $css, true ) && in_array( 'style', $css, true ) && ! in_array( 'jquery_ui', $js, true );
list( $css, $js ) = velis_unused_assets( '<i class="fas fa-brain"></i>', true );
$ok  = $ok && ! in_array( 'the7-awesome-fonts', $css, true ) && in_array( 'ultimate-vc-addons-googleapis', $js, true );
// Masonry queries only from rows with velis-projects (Posts list or Category), not other grids on the page.
function shortcode_parse_atts( $s ) { preg_match_all( '/(\w+)="([^"]*)"/', $s, $m ); return array_combine( $m[1], $m[2] ); }
$q   = velis_masonry_queries( '[vc_row el_class="velis-projects"][vc_column][dt_blog_masonry posts="3,1" dis_posts_total="6"][/vc_column][/vc_row][vc_row][vc_column][dt_blog_masonry category="40"][/vc_column][/vc_row]'
	. '[vc_section el_class="velis-section velis-projects"][vc_row][vc_column][dt_blog_masonry post_type="category" category="34"][/vc_column][/vc_row][/vc_section]' );
$ok  = $ok && 2 === count( $q ) && array( 3, 1 ) === $q[0]['post__in'] && 6 === $q[0]['numberposts'] && '34' === $q[1]['cat'] && 12 === $q[1]['numberposts'];
// Developer hub cards: links of card names (h2 a) inside velis-devs rows only, de-duplicated, in page order.
$l = velis_card_links( '[vc_row el_class="velis-devs velis-boxes"][vc_column][vc_column_text]<h2><a href="/du-an/vinhomes/">Vinhomes</a></h2>[/vc_column_text][/vc_column][vc_column][vc_column_text]<h2 class="x"><a class="y" href="/du-an/sun-group/">Sun Group</a></h2><p><a href="/z/">z</a></p>[/vc_column_text][/vc_column][/vc_row][vc_row][vc_column][vc_column_text]<h2><a href="/khac/">x</a></h2>[/vc_column_text][/vc_column][/vc_row]' );
assert( $l === array( '/du-an/vinhomes/', '/du-an/sun-group/' ) );
assert( velis_card_links( '[vc_row][vc_column][/vc_column][/vc_row]' ) === array() );

// Schema graph: a page loses Article + its author Person (other Person kept); list page → CollectionPage + ItemList; post → Place.
$g   = array( 'WebPage' => array( '@type' => 'WebPage', '@id' => 'u#webpage' ), 'richSnippet' => array( '@type' => 'Article', 'author' => array( '@id' => '/a/' ) ),
	'ProfilePage' => array( '@type' => 'Person', '@id' => '/a/' ), 'ceo' => array( '@type' => 'Person', '@id' => '/b/' ), 'svc' => array( '@type' => 'Service' ) );
$r   = velis_schema_graph( $g, array( 'url' => 'https://x/du-an/', 'is_page' => true, 'is_front' => false, 'items' => array( array( 'https://x/p/', 'P' ), array( 'https://x/q/', 'Q' ) ), 'address' => '', 'name' => '' ) );
$t   = array_map( fn( $n ) => is_array( $n['@type'] ) ? implode( '+', $n['@type'] ) : $n['@type'], $r );
$ok  = $ok && ! in_array( 'Article', $t, true ) && ! isset( $r['ProfilePage'] ) && isset( $r['ceo'], $r['svc'] ) && 'CollectionPage' === $r['WebPage']['@type']
	&& 'https://x/du-an/#itemlist' === $r['WebPage']['mainEntity']['@id'] && 2 === $r['velisItemList']['itemListElement'][1]['position'] && 'Q' === $r['velisItemList']['itemListElement'][1]['name'];
$r   = velis_schema_graph( $g, array( 'url' => 'https://x/', 'is_page' => true, 'is_front' => true, 'items' => array(), 'address' => '', 'name' => '' ) );
$ok  = $ok && 'WebPage' === $r['WebPage']['@type'] && ! isset( $r['velisItemList'], $r['richSnippet'] );
$r   = velis_schema_graph( array( 'a' => array( '@type' => 'BlogPosting' ) ), array( 'url' => 'https://x/p/', 'is_page' => false, 'is_front' => false, 'items' => array(), 'address' => '69 Võ Văn Kiệt, TP.HCM', 'name' => 'Ansana' ) );
$ok  = $ok && 'BlogPosting' === $r['a']['@type'] && 'https://x/p/#place' === $r['a']['about']['@id'] && '69 Võ Văn Kiệt, TP.HCM' === $r['velisPlace']['address']['streetAddress'];

// Bước 12 – dự án của bài blog: bài thuộc chuyên mục Dự án (34) thắng Phân khu (57) khi cùng trỏ một cụm; không có ứng viên → null.
$pv  = velis_pick_project( array( array( 'title' => 'Persa Place', 'cats' => array( 57 ) ), array( 'title' => 'Spring Ville', 'cats' => array( 34 ) ) ) );
$ok  = $ok && 'Spring Ville' === $pv['title'] && null === velis_pick_project( array() );
// Chữ chờ trong widget: có dự án → tên + link; không → chữ mặc định, khối "velis-if-du-an" ẩn.
$w   = '<h2>Nhận bảng giá {du_an|&amp; tư vấn dự án}</h2><p class="velis-cta-call velis-if-du-an"><a href="{du_an_link}">Xem dự án {du_an}</a></p>[contact-form-7 id="1" du-an="{du_an}"]';
$a   = velis_fill_tokens( $w, array( 'title' => 'The Privé', 'link' => '/can-ho-the-prive/' ) );
$b   = velis_fill_tokens( $w, null );
$ok  = $ok && str_contains( $a, 'Nhận bảng giá The Privé' ) && str_contains( $a, 'href="/can-ho-the-prive/"' ) && str_contains( $a, 'du-an="The Privé"' ) && ! str_contains( $a, 'hidden' )
	&& str_contains( $b, 'Nhận bảng giá &amp; tư vấn dự án' ) && str_contains( $b, 'velis-if-du-an" hidden' ) && str_contains( $b, 'du-an=""' ) && ! str_contains( $b, '{' );
// CF7 nhận thuộc tính du-an từ shortcode (trường ẩn default:shortcode_attr).
$sa  = $GLOBALS['hooks']['shortcode_atts_wpcf7'][0];
$ok  = $ok && 'The Privé' === $sa( array( 'id' => 1 ), array(), array( 'du-an' => ' The Privé ' ) )['du-an'] && ! isset( $sa( array(), array(), array() )['du-an'] );
// Danh sách sidebar: cùng dự án trước, bài mới bù cho đủ, bỏ bài đang đọc và bài đã hiện ở "liên quan" cuối bài, không trùng.
list( $sm, $rc ) = velis_post_list_ids( array( 5, 6, 7, 8 ), array( 9, 5, 10, 11, 12 ), array( 5, 7 ), 4 );
$ok  = $ok && array( 6, 8 ) === $sm && array( 9, 10 ) === $rc;
list( $sm, $rc ) = velis_post_list_ids( array(), array( 1, 2, 3 ), array( 2 ), 5 );
$ok  = $ok && array() === $sm && array( 1, 3 ) === $rc;
echo $ok ? "the7-child cta: ok\n" : "the7-child cta: FAIL\n"; exit( $ok ? 0 : 1 );
