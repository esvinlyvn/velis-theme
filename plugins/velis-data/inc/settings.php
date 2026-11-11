<?php
/**
 * "Cài đặt Velis" (vòng hoàn thiện 1.1): every text, number, contact detail and picture the theme used to hard-code, in
 * one option `velis_settings`. Editors (edit_pages) can change it; the theme reads it with velis_setting(). Defaults = what
 * staging showed on 2026-11-11, so activating the plugin changes nothing a visitor sees. Media defaults are 0: picture IDs
 * belong to one site and are saved in the option (staging: seeded once, docs/STAGING-LOG.md).
 */

defined( 'ABSPATH' ) || exit;

/** key => [label, type (text | textarea | url | email | id), default, section]. Order = order on the page. */
function velis_settings_fields(): array {
	$f = array(
		'home_eyebrow'      => array( 'Nhãn nhỏ', 'text', 'Velis Realty', 'home' ),
		'home_title'        => array( 'Tiêu đề (H1)', 'text', 'Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận', 'home' ),
		'home_lead'         => array( 'Đoạn dẫn', 'textarea', 'Căn hộ hạng sang, villa nghỉ dưỡng, shophouse của Vinhomes, Sun Group, Masterise Homes, Gamuda Land cho người mua ở và nhà đầu tư. CEO Vũ Xuân trực tiếp phân tích dòng tiền và rủi ro từng dự án.', 'home' ),
		'home_img'          => array( 'Ảnh nền', 'id', 0, 'home' ),
		'home_btn1_label'   => array( 'Nút 1 – chữ', 'text', 'Nhận tư vấn', 'home' ),
		'home_btn1_url'     => array( 'Nút 1 – link', 'url', '#tu-van', 'home' ),
		'home_btn2_label'   => array( 'Nút 2 – chữ', 'text', 'Xem dự án', 'home' ),
		'home_btn2_url'     => array( 'Nút 2 – link', 'url', '/du-an/', 'home' ),
		'partners_title'    => array( 'Đối tác – tiêu đề', 'text', 'Đối tác của chúng tôi', 'home' ),
		'partners_lead'     => array( 'Đối tác – mô tả', 'textarea', 'Velis Realty là đơn vị chuyên tư vấn và phân phối bất động sản cao cấp, tập trung vào dự án của các chủ đầu tư có hồ sơ bàn giao và pháp lý công khai.', 'home' ),
		'about_eyebrow'     => array( 'Nhãn nhỏ', 'text', 'Về Velis', 'about' ),
		'about_title'       => array( 'Tiêu đề', 'text', 'Công ty TNHH Velis Realty', 'about' ),
		'about_p1'          => array( 'Đoạn 1', 'textarea', 'Tại Velis Realty, chúng tôi tin rằng mỗi bất động sản không chỉ là một tài sản, mà là tâm huyết và tương lai của nhà đầu tư. Velis Realty tư vấn các dự án của Vinhomes, Sun Group, Masterise Homes, Ecopark, Gamuda Land, với giỏ hàng đa dạng từ căn hộ hạng sang, villa nghỉ dưỡng đến shophouse thương mại tại các khu vực đang có hạ tầng mới tại TP.HCM và vùng lân cận.', 'about' ),
		'about_p2'          => array( 'Đoạn 2', 'textarea', 'Đội ngũ chuyên gia của chúng tôi kết hợp giữa tư duy Marketing sắc bén và sự am hiểu thị trường thực chiến, cung cấp thông tin có nguồn, phân tích dòng tiền và rủi ro để khách hàng tự quyết định.', 'about' ),
		'about_btn_label'   => array( 'Nút – chữ', 'text', 'Tìm hiểu Velis', 'about' ),
		'about_btn_url'     => array( 'Nút – link', 'url', '/gioi-thieu/', 'about' ),
		'values_title'      => array( 'Giá trị – tiêu đề', 'text', 'Giá trị khác biệt tại Velis Realty', 'about' ),
		'value1_title'      => array( 'Giá trị 01 – tiêu đề', 'text', 'Thông Tin Có Nguồn', 'about' ),
		'value1_text'       => array( 'Giá trị 01 – đoạn', 'textarea', 'Chúng tôi cung cấp thông tin dự án đầy đủ, chính xác về pháp lý và quy hoạch, giúp khách hàng yên tâm trước mỗi quyết định.', 'about' ),
		'value2_title'      => array( 'Giá trị 02 – tiêu đề', 'text', 'Hỗ Trợ Sau Bán', 'about' ),
		'value2_text'       => array( 'Giá trị 02 – đoạn', 'textarea', 'Từ lúc tư vấn, ký kết hợp đồng đến khi nhận nhà và quản lý vận hành, Velis Realty luôn hiện diện để hỗ trợ.', 'about' ),
		'value3_title'      => array( 'Giá trị 03 – tiêu đề', 'text', 'Tư Duy Chiến Lược', 'about' ),
		'value3_text'       => array( 'Giá trị 03 – đoạn', 'textarea', 'Không chỉ bán sản phẩm, chúng tôi cung cấp giải pháp. Velis Realty phân tích dòng tiền, đánh giá tiềm năng tăng giá và tính thanh khoản của từng vị trí.', 'about' ),
		'value4_title'      => array( 'Giá trị 04 – tiêu đề', 'text', 'Cập Nhật Quỹ Căn Và Chính Sách', 'about' ),
		'value4_text'       => array( 'Giá trị 04 – đoạn', 'textarea', 'Cập nhật quỹ căn và chính sách bán hàng ngay khi chủ đầu tư công bố.', 'about' ),
		'exam_title'        => array( 'Thi thử – tiêu đề', 'text', 'Thi thử chứng chỉ môi giới', 'band' ),
		'exam_text'         => array( 'Thi thử – câu', 'textarea', 'Ôn luyện và thi thử chứng chỉ hành nghề môi giới bất động sản miễn phí.', 'band' ),
		'exam_btn'          => array( 'Thi thử – nút', 'text', 'Thi thử CCMG', 'band' ),
		'exam_url'          => array( 'Thi thử – link', 'url', '/thi/', 'band' ),
		'jobs_title'        => array( 'Tuyển dụng – tiêu đề', 'text', 'Cơ hội nghề nghiệp', 'band' ),
		'jobs_text'         => array( 'Tuyển dụng – câu', 'textarea', 'Velis Realty đang tuyển nhiều vị trí Chuyên viên Kinh doanh Bất động sản cao cấp, làm việc toàn thời gian tại văn phòng 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh.', 'band' ),
		'jobs_btn'          => array( 'Tuyển dụng – nút', 'text', 'Ứng tuyển ngay', 'band' ),
		'jobs_url'          => array( 'Tuyển dụng – link', 'url', '/tuyen-dung/', 'band' ),
		'projects_eyebrow'  => array( '/du-an/ – nhãn nhỏ', 'text', 'Dự án Velis đang tư vấn', 'pages' ),
		'projects_title'    => array( '/du-an/ – tiêu đề', 'text', 'Dự án bất động sản cao cấp tại TP.HCM và vùng lân cận', 'pages' ),
		'projects_lead'     => array( '/du-an/ – đoạn dẫn', 'textarea', '{số} dự án và đại đô thị: {tên}. Lọc theo khu vực, chủ đầu tư và loại sản phẩm.', 'pages' ),
		'projects_img'      => array( '/du-an/ – ảnh', 'id', 0, 'pages' ),
		'developers_title'  => array( '/chu-dau-tu/ – tiêu đề', 'text', 'Chủ đầu tư có dự án Velis đang tư vấn', 'pages' ),
		'developers_lead'   => array( '/chu-dau-tu/ – đoạn dẫn', 'textarea', '{số} chủ đầu tư. Mỗi trang gồm dự án đang tư vấn, dữ kiện công khai có nguồn và nhận định của CEO Vũ Xuân.', 'pages' ),
		'developers_img'    => array( '/chu-dau-tu/ – ảnh', 'id', 0, 'pages' ),
		'blog_title'        => array( '/blog/ – tiêu đề', 'text', 'Blog bất động sản: phân tích dự án và thị trường', 'pages' ),
		'blog_lead'         => array( '/blog/ – đoạn dẫn (khi trang Blog chưa có chữ)', 'textarea', 'Phân tích của CEO Vũ Xuân về giá, pháp lý, tiến độ và dòng tiền từng dự án.', 'pages' ),
		'blog_img'          => array( '/blog/ – ảnh', 'id', 0, 'pages' ),
		'cluster_lead'      => array( 'Cụm blog – đoạn dẫn (khi cụm chưa có mô tả)', 'textarea', 'Phân tích {tên} của CEO Vũ Xuân: giá, pháp lý, tiến độ và kinh nghiệm mua.', 'pages' ),
		'about_page_lead'   => array( 'Giới thiệu – đoạn dẫn (khi trang chưa có tóm tắt)', 'textarea', 'Đơn vị chuyên tư vấn và phân phối bất động sản cao cấp, tập trung vào dự án của các chủ đầu tư có hồ sơ bàn giao và pháp lý công khai.', 'pages' ),
		'about_img'         => array( 'Giới thiệu – ảnh (trống = ảnh đại diện của trang)', 'id', 0, 'pages' ),
		'phone'             => array( 'Số điện thoại', 'text', '0911 237 979', 'contact' ),
		'zalo'              => array( 'Zalo (link)', 'url', 'https://zalo.me/0911237979', 'contact' ),
		'email'             => array( 'Email', 'email', 'lienhe@velisrealty.vn', 'contact' ),
		'address'           => array( 'Địa chỉ', 'text', '34 Lương Định Của, phường Bình Trưng, TP.HCM', 'contact' ),
		'hours'             => array( 'Giờ làm việc', 'text', 'Thứ 2 – Chủ nhật, 08:00–21:00', 'contact' ),
		'form_lead'         => array( 'Khối "Nhận tư vấn" – câu dẫn', 'textarea', 'Để lại họ tên và số điện thoại, Velis gọi lại trong giờ làm việc. Cần nhanh hơn, anh chị gọi hoặc nhắn Zalo.', 'contact' ),
		'role_sentence'     => array( 'Câu vai trò ({chủ đầu tư} = tên chủ đầu tư của dự án)', 'textarea', 'Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là {chủ đầu tư}.', 'contact' ),
		'ceo_name'          => array( 'CEO – tên', 'text', 'Vũ Xuân', 'contact' ),
		'ceo_role'          => array( 'CEO – chức danh', 'text', 'CEO Velis Realty', 'contact' ),
		'ceo_avatar'        => array( 'CEO – ảnh nhỏ (vuông)', 'id', 0, 'contact' ),
		'ceo_portrait'      => array( 'CEO – ảnh chân dung (trang tác giả)', 'id', 0, 'contact' ),
		'footer_tagline'    => array( 'Chân trang – câu giới thiệu', 'textarea', 'Tư vấn bất động sản cao cấp, phân tích theo dòng tiền và giá vốn thực.', 'contact' ),
		'footer_note'       => array( 'Chân trang – lưu ý', 'textarea', 'Thông tin dự án chỉ để tham khảo; vui lòng kiểm tra văn bản chính thức của chủ đầu tư.', 'contact' ),
		'disclosure_project' => array( 'Lưu ý cuối trang dự án', 'textarea', 'Thông tin trên trang chỉ để tham khảo, tổng hợp từ tài liệu công khai của chủ đầu tư tại thời điểm cập nhật. Giá, chính sách và tiến độ có thể thay đổi; vui lòng kiểm tra hợp đồng và văn bản chính thức của chủ đầu tư trước khi giao dịch.', 'contact' ),
		'disclosure_post'   => array( 'Lưu ý cuối bài viết', 'textarea', 'Bài viết thể hiện góc nhìn của Velis Realty tại thời điểm đăng, chỉ để tham khảo, không phải khuyến nghị đầu tư. Velis Realty là đơn vị tư vấn – phân phối bất động sản nên có lợi ích liên quan đến giao dịch. Giá, chính sách bán hàng và tiến độ có thể thay đổi. Vui lòng kiểm tra văn bản chính thức của chủ đầu tư.', 'contact' ),
	);
	foreach ( array( 1 => array( '10+', 'Năm kinh nghiệm' ), 2 => array( '50+', 'Đối tác' ), 3 => array( '999+', 'Giao dịch' ), 4 => array( '99+', 'Dự án' ) ) as $i => list( $n, $l ) ) {
		$f[ "num{$i}_value" ] = array( "Con số $i – số", 'text', $n, 'numbers' );
		$f[ "num{$i}_label" ] = array( "Con số $i – nhãn", 'text', $l, 'numbers' );
	}
	foreach ( velis_social_networks() as $k => $label ) { // empty = the network is not shown
		$f[ "social_$k" ] = array( $label, 'url', '', 'social' );
	}
	return $f;
}

function velis_social_networks(): array {
	return array( 'facebook' => 'Facebook', 'youtube' => 'YouTube', 'tiktok' => 'TikTok', 'instagram' => 'Instagram', 'linkedin' => 'LinkedIn', 'x' => 'X', 'pinterest' => 'Pinterest' );
}

function velis_settings_sections(): array {
	return array( 'home' => 'Trang chủ – phần đầu và đối tác', 'numbers' => 'Trang chủ – 4 con số', 'about' => 'Trang chủ – khối Công ty Velis Realty', 'band' => 'Trang chủ – Thi thử và Tuyển dụng', 'pages' => 'Trang Dự án, Chủ đầu tư, Blog, Giới thiệu', 'contact' => 'Liên hệ, CEO, chân trang', 'social' => 'Mạng xã hội (để trống thì ẩn)' );
}

/** Saved value, else the default. Media fields return an int. */
function velis_setting( string $key ) {
	$def = velis_settings_fields()[ $key ] ?? array( '', 'text', '' );
	$o   = get_option( 'velis_settings', array() );
	$v   = is_array( $o ) && array_key_exists( $key, $o ) ? $o[ $key ] : $def[2];
	return 'id' === $def[1] ? (int) $v : (string) $v;
}

/** Phone in a tel: link ("0911 237 979" → "0911237979"). */
function velis_setting_tel(): string {
	return preg_replace( '/[^\d+]/', '', velis_setting( 'phone' ) );
}

/** One field through its type's sanitizer (pure: also used by the unit test). */
function velis_settings_clean( string $type, $v ) {
	$v = is_scalar( $v ) ? (string) $v : '';
	switch ( $type ) {
		case 'id':
			return absint( $v );
		case 'url': // relative links (/du-an/, #tu-van) are kept
			return '' === trim( $v ) ? '' : esc_url_raw( trim( $v ), array( 'http', 'https', 'mailto', 'tel' ) );
		case 'email':
			return sanitize_email( $v );
		case 'textarea':
			return trim( wp_kses_post( $v ) );
		default:
			return sanitize_text_field( $v );
	}
}

function velis_settings_sanitize( $in ): array {
	$out = array();
	foreach ( velis_settings_fields() as $k => $def ) {
		$out[ $k ] = velis_settings_clean( $def[1], is_array( $in ) ? ( $in[ $k ] ?? '' ) : '' );
	}
	return $out;
}

add_action( 'admin_init', fn() => register_setting( 'velis_settings', 'velis_settings', array( 'type' => 'array', 'sanitize_callback' => 'velis_settings_sanitize', 'default' => array() ) ) );
add_filter( 'option_page_capability_velis_settings', fn() => 'edit_pages' ); // Biên tập viên save the page too

add_action( 'admin_menu', function () {
	add_menu_page( 'Cài đặt Velis', 'Cài đặt Velis', 'edit_pages', 'velis-settings', 'velis_settings_page', 'dashicons-admin-generic', 22 );
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'toplevel_page_velis-settings' !== $hook ) {
		return;
	}
	wp_enqueue_media();
	$url = plugin_dir_url( __DIR__ );
	wp_enqueue_script( 'velis-admin', $url . 'assets/admin.js', array(), '0.4.0', true );
	wp_enqueue_style( 'velis-admin', $url . 'assets/admin.css', array(), '0.4.0' );
} );

function velis_settings_page() {
	$fields = velis_settings_fields();
	echo '<div class="wrap"><h1>Cài đặt Velis</h1><p>Chữ, con số, ảnh và thông tin liên hệ hiện trên website. Lưu xong, trang ngoài đổi ngay (bộ nhớ đệm của trình duyệt có thể giữ bản cũ vài phút).</p>';
	echo '<form method="post" action="options.php">';
	settings_fields( 'velis_settings' );
	foreach ( velis_settings_sections() as $sec => $title ) {
		echo '<h2>' . esc_html( $title ) . '</h2><div class="velis-form">';
		foreach ( $fields as $k => $def ) {
			if ( $sec === $def[3] ) {
				$type = in_array( $def[1], array( 'email', 'url' ), true ) ? 'text' : $def[1]; // type=url would refuse /du-an/ and #tu-van
				echo velis_field_html( "velis_settings[$k]", array( $def[0], $type ), velis_setting( $k ) ?: '' ); // phpcs:ignore -- escaped inside
			}
		}
		echo '</div>';
	}
	submit_button( 'Lưu cài đặt' );
	echo '</form></div>';
}
