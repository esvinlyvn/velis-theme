<?php
/**
 * (1) Khung trang tác giả (/chuyen-gia/<tên>/): ảnh, chức danh, tiểu sử, chứng chỉ hành nghề, liên hệ – chữ nhập ở Tài khoản → Hồ sơ.
 *     Ô trống không hiện với khách; quản trị viên thấy ô chờ (viền gạch) để biết chỗ cần điền.
 * (2) Hộp đồng ý cookie + Google Consent Mode v2: mặc định từ chối (analytics / ads), "Đồng ý" → granted; lựa chọn lưu localStorage.
 */
defined( 'ABSPATH' ) || exit;

const VELIS_TAC_GIA_O = array(
	'velis_chuc_danh' => 'Chức danh',
	'velis_chung_chi' => 'Chứng chỉ hành nghề môi giới (số, nơi cấp, ngày cấp)',
	'velis_lien_he'   => 'Liên hệ (điện thoại / email / Zalo)',
	'velis_anh'       => 'Ảnh chân dung (ID ảnh trong Thư viện)',
);

function velis_tac_gia_o( $uid ) {
	echo '<h2>Trang tác giả (velisrealty.vn)</h2><table class="form-table" role="presentation">';
	foreach ( VELIS_TAC_GIA_O as $k => $nhan ) {
		echo '<tr><th><label for="' . esc_attr( $k ) . '">' . esc_html( $nhan ) . '</label></th><td><input type="text" class="regular-text" id="' . esc_attr( $k ) . '" name="' . esc_attr( $k ) . '" value="' . esc_attr( get_user_meta( $uid->ID, $k, true ) ) . '"></td></tr>';
	}
	echo '<tr><th>Tiểu sử</th><td>Dùng ô "Thông tin tiểu sử" phía trên.</td></tr></table>';
}
add_action( 'show_user_profile', 'velis_tac_gia_o' );
add_action( 'edit_user_profile', 'velis_tac_gia_o' );

function velis_tac_gia_luu( $uid ) {
	if ( ! current_user_can( 'edit_user', $uid ) || ! check_admin_referer( 'update-user_' . $uid ) ) {
		return;
	}
	foreach ( array_keys( VELIS_TAC_GIA_O ) as $k ) {
		if ( isset( $_POST[ $k ] ) ) {
			update_user_meta( $uid, $k, 'velis_anh' === $k ? absint( $_POST[ $k ] ) : sanitize_text_field( wp_unslash( $_POST[ $k ] ) ) );
		}
	}
}
add_action( 'personal_options_update', 'velis_tac_gia_luu' );
add_action( 'edit_user_profile_update', 'velis_tac_gia_luu' );

/** HTML khung tác giả: mảng ô → chỉ ô có chữ (khách) hoặc thêm ô chờ (quản trị viên). */
function velis_tac_gia_html( array $o, $xem_cho ) {
	$dong = function ( $k, $html, $nhan ) use ( $xem_cho ) {
		if ( '' !== $html ) {
			return '<div class="velis-tac-gia__' . $k . '">' . $html . '</div>';
		}
		return $xem_cho ? '<div class="velis-tac-gia__' . $k . ' velis-tac-gia__cho">Chờ nội dung: ' . esc_html( $nhan ) . '</div>' : '';
	};
	$than = $dong( 'chuc-danh', esc_html( $o['chuc_danh'] ), 'chức danh' )
		. $dong( 'tieu-su', $o['tieu_su'] ? wpautop( esc_html( $o['tieu_su'] ) ) : '', 'tiểu sử' )
		. $dong( 'chung-chi', $o['chung_chi'] ? 'Chứng chỉ hành nghề môi giới: ' . esc_html( $o['chung_chi'] ) : '', 'chứng chỉ hành nghề' )
		. $dong( 'lien-he', esc_html( $o['lien_he'] ), 'liên hệ' );
	$anh = $o['anh'] ? $o['anh'] : ( $xem_cho ? '<span class="velis-tac-gia__cho">Ảnh</span>' : '' );
	if ( '' === $than && '' === $anh ) {
		return '';
	}
	return '<section class="velis-tac-gia" aria-label="Về tác giả">' . ( $anh ? '<div class="velis-tac-gia__anh">' . $anh . '</div>' : '' ) . '<div class="velis-tac-gia__than">' . $than . '</div></section>';
}

add_action( 'loop_start', function ( $q ) {
	static $xong = false;
	// The7 chạy vòng lặp sớm khi dựng dải tiêu đề (presscore_before_main_container) – chỉ in ở vòng lặp danh sách bài sau đó
	if ( $xong || ! is_author() || ! $q->is_main_query() || ! did_action( 'presscore_before_main_container' ) || doing_action( 'presscore_before_main_container' ) ) {
		return;
	}
	$xong = true;
	$u    = get_queried_object();
	$anh  = (int) get_user_meta( $u->ID, 'velis_anh', true );
	echo velis_tac_gia_html( // phpcs:ignore -- đã escape trong hàm
		array(
			'chuc_danh' => (string) get_user_meta( $u->ID, 'velis_chuc_danh', true ),
			'tieu_su'   => (string) get_user_meta( $u->ID, 'description', true ),
			'chung_chi' => (string) get_user_meta( $u->ID, 'velis_chung_chi', true ),
			'lien_he'   => (string) get_user_meta( $u->ID, 'velis_lien_he', true ),
			'anh'       => $anh ? wp_get_attachment_image( $anh, 'thumbnail', false, array( 'alt' => $u->display_name, 'loading' => 'eager' ) ) : '',
		),
		current_user_can( 'edit_users' )
	);
} );

// ── Hộp đồng ý cookie (Nghị định 13/2023) – chạy trước mã GA4 của plugin Header and Footer Scripts (wp_head mặc định 10). ─────────
// data-no-optimize: LiteSpeed không gộp / dời đoạn này (thứ tự consent default → gtag config phải giữ).
add_action( 'wp_head', function () {
	echo "<script data-no-optimize=\"1\">window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}(function(){var c=null;try{c=localStorage.getItem('velis-dong-y')}catch(e){}"
		. "var g=c==='1'?'granted':'denied';gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:g,wait_for_update:500})})();</script>\n";
}, 1 );

add_action( 'wp_footer', function () {
	$cs = get_privacy_policy_url() ? get_privacy_policy_url() : home_url( '/chinh-sach-bao-mat/' );
	echo '<div class="velis-dong-y" role="region" aria-label="Đồng ý cookie" hidden><p>Velis Realty dùng cookie Google Analytics để đo lượt xem trang. Xem <a href="' . esc_url( $cs ) . '#cookie">Chính sách bảo mật</a>.</p>'
		. '<div class="velis-dong-y__nut"><button type="button" data-dong-y="0">Từ chối</button><button type="button" data-dong-y="1">Đồng ý</button></div></div>'
		. "<script data-no-optimize=\"1\">(function(){var b=document.querySelector('.velis-dong-y');if(!b)return;var c=null;try{c=localStorage.getItem('velis-dong-y')}catch(e){}if(c===null)b.hidden=false;"
		. "b.addEventListener('click',function(e){var v=e.target.getAttribute('data-dong-y');if(v===null)return;try{localStorage.setItem('velis-dong-y',v)}catch(x){}"
		. "gtag('consent','update',{analytics_storage:v==='1'?'granted':'denied'});b.hidden=true;})})();</script>\n";
}, 20 );
