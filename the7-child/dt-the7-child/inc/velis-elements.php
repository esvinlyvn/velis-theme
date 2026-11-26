<?php
/**
 * Phần tử WPBakery "Velis" (người dùng duyệt ngoại lệ 2026-11-25: mẫu phần tử nằm trong theme con).
 * Đăng ký bằng Inner API chính thức (vc_map, param_group, html_template – kb.wpbakery.com); không sửa mã plugin.
 * Mẫu HTML: wpb_templates/<tên>.php · CSS: velis.css mục 3b · kéo thả trong trình sửa WPBakery, nhóm "Velis".
 */
defined( 'ABSPATH' ) || exit;

/** Neo (id) từ tiêu đề – mục lục và khối dùng chung một hàm. */
function velis_neo( $text ) {
	return sanitize_title( remove_accents( wp_strip_all_tags( (string) $text ) ) );
}

/** Con số quan trọng (giá, diện tích, %, bàn giao…) → chữ số tabular màu champagne (DESIGN.md "Dấu riêng"). */
function velis_so( $html ) {
	// chỉ số có đơn vị (ha, m², %, tỷ, triệu, căn, tòa, tầng, phút, km) hoặc năm (19xx / 20xx) hoặc quý / tháng – "Quận 2", "Tháp 9" giữ màu chữ
	return preg_replace( '/(?<![\w#&\/=-])(?:\d[\d.,]*\s?(?:ha|m²|m2|%|tỷ|triệu|căn|tòa|tầng|phút|km)(?![\w-])|(?:19|20)\d\d(?![\d\w-])|(?:quý|tháng)\s\d+(?:\/\d+)?)/u', '<span class="velis-so">$0</span>', (string) $html );
}

/** Danh sách form CF7 cho ô chọn. */
function velis_cf7_lua_chon() {
	$out = array( 'Chọn form' => '' );
	foreach ( get_posts( array( 'post_type' => 'wpcf7_contact_form', 'numberposts' => 50 ) ) as $f ) {
		$out[ $f->post_title . ' (' . $f->ID . ')' ] = (string) $f->ID;
	}
	return $out;
}

/** Tiêu đề mục lục: tiêu đề các phần tử Velis có H2 trên trang (theo thứ tự). */
function velis_muc_luc_items( $content ) {
	$items = array();
	if ( ! preg_match_all( '/\[(velis_khoi|velis_hoi_dap|velis_nhan_bang_gia)(\s[^\]]*)?\]/', (string) $content, $m, PREG_SET_ORDER ) ) {
		return $items;
	}
	foreach ( $m as $sc ) {
		$a = shortcode_parse_atts( trim( $sc[2] ?? '' ) );
		$a = is_array( $a ) ? $a : array();
		if ( 'velis_khoi' === $sc[1] && 'h3' === ( $a['cap'] ?? 'h2' ) ) {
			continue;
		}
		$t = $a['tieu_de'] ?? '';
		if ( 'velis_hoi_dap' === $sc[1] && '' === $t ) {
			$t = 'Câu hỏi thường gặp';
		}
		if ( 'velis_nhan_bang_gia' === $sc[1] && '' === $t ) {
			$t = 'Nhận bảng giá ' . get_the_title();
		}
		if ( '' !== $t ) {
			$items[] = array( 'tieu_de' => $t, 'neo' => $a['el_id'] ?? velis_neo( $t ) );
		}
	}
	return $items;
}

/** Câu hỏi – trả lời của mọi phần tử Hỏi đáp trên trang (cho FAQPage). */
function velis_hoi_dap_items( $content ) {
	$out = array();
	if ( preg_match_all( '/\[velis_hoi_dap(\s[^\]]*)?\]/', (string) $content, $m ) ) {
		foreach ( $m[1] as $raw ) {
			$a = shortcode_parse_atts( trim( $raw ) );
			foreach ( (array) vc_param_group_parse_atts( is_array( $a ) ? ( $a['muc'] ?? '' ) : '' ) as $q ) {
				if ( ! empty( $q['hoi'] ) && ! empty( $q['dap'] ) ) {
					$out[] = array( wp_strip_all_tags( $q['hoi'] ), trim( wp_strip_all_tags( $q['dap'] ) ) );
				}
			}
		}
	}
	return $out;
}

/** Bài đích cho ô chọn (Đọc thêm / Bài phân tích chi tiết): bài blog đã đăng, mới nhất trước; chỉ dựng trong trình sửa. */
function velis_bai_lua_chon() {
	$out = array( 'Chọn bài' => '' );
	if ( ! is_admin() && ! ( function_exists( 'vc_is_inline' ) && vc_is_inline() ) ) {
		return $out; // ngoài trình sửa không cần danh sách (vc_before_init chạy ở mọi trang)
	}
	foreach ( get_posts( array( 'numberposts' => 300, 'category__not_in' => array( 34, 57 ), 'fields' => 'ids' ) ) as $id ) {
		$out[ get_the_title( $id ) . ' (' . $id . ')' ] = (string) $id;
	}
	return $out;
}

/** Bài đích còn đăng → array( link, tiêu đề ), không thì null (bài bị gỡ / nháp: phần tử không in gì). */
function velis_bai_dich( $id ) {
	$id = (int) $id;
	return $id && 'publish' === get_post_status( $id ) ? array( get_permalink( $id ), get_the_title( $id ) ) : null;
}

/** "Đọc thêm": tối đa 2 thẻ mỗi bài – thẻ thứ 3 trở đi không in. */
function velis_doc_them_con_cho() {
	static $n = 0;
	return ++$n <= 2;
}

add_action( 'vc_before_init', function () {
	$dir  = get_stylesheet_directory() . '/wpb_templates/';
	$cat  = 'Velis';
	$bai  = velis_bai_lua_chon();
	$neo  = array( 'type' => 'el_id', 'heading' => 'ID neo (để trống = tự tạo từ tiêu đề)', 'param_name' => 'el_id' );

	vc_map( array(
		'name' => 'Velis · Thông tin dự án', 'base' => 'velis_thong_tin', 'category' => $cat, 'icon' => 'icon-wpb-ui-separator',
		'description' => 'Lưới thông số dự án (nhãn + giá trị), các ô thẳng hàng; con số tự in đậm số champagne.',
		'html_template' => $dir . 'velis_thong_tin.php',
		'params' => array(
			array( 'type' => 'param_group', 'heading' => 'Các ô thông tin', 'param_name' => 'muc',
				'value' => rawurlencode( wp_json_encode( array( array( 'nhan' => 'Chủ đầu tư', 'gia_tri' => 'Tập đoàn Đất Xanh' ), array( 'nhan' => 'Quy mô', 'gia_tri' => '6,7 ha · 12 tòa tháp' ), array( 'nhan' => 'Bàn giao', 'gia_tri' => 'Năm 2027 (dự kiến)' ) ) ) ),
				'params' => array(
					array( 'type' => 'textfield', 'heading' => 'Nhãn', 'param_name' => 'nhan', 'admin_label' => true ),
					array( 'type' => 'textfield', 'heading' => 'Giá trị', 'param_name' => 'gia_tri' ),
				) ),
			array( 'type' => 'dropdown', 'heading' => 'Số cột (máy tính)', 'param_name' => 'cot', 'value' => array( '3 cột' => '3', '2 cột' => '2' ), 'std' => '3' ),
		),
	) );

	vc_map( array(
		'name' => 'Velis · Khối nội dung', 'base' => 'velis_khoi', 'category' => $cat, 'icon' => 'icon-wpb-layer-shape-text',
		'description' => 'Một mục của trang, một cột rộng hết khung: tiêu đề → nội dung → minh họa (ảnh, thư viện, bản đồ hoặc bảng) bên dưới.',
		'html_template' => $dir . 'velis_khoi.php',
		'params' => array(
			array( 'type' => 'textfield', 'heading' => 'Tiêu đề', 'param_name' => 'tieu_de', 'admin_label' => true, 'value' => 'Vị trí dự án có gì nổi bật?' ),
			array( 'type' => 'dropdown', 'heading' => 'Cấp tiêu đề', 'param_name' => 'cap', 'value' => array( 'H2 (có trong mục lục)' => 'h2', 'H3' => 'h3' ), 'std' => 'h2' ),
			array( 'type' => 'textarea_html', 'heading' => 'Nội dung', 'param_name' => 'content', 'value' => '<p>Đoạn văn mô tả – viết bằng số liệu có nguồn.</p>' ),
			array( 'type' => 'dropdown', 'heading' => 'Minh họa', 'param_name' => 'minh_hoa', 'std' => '', 'admin_label' => true,
				'value' => array( 'Không' => '', 'Ảnh' => 'anh', 'Thư viện ảnh' => 'thu_vien', 'Bản đồ nhúng' => 'ban_do', 'Bảng' => 'bang' ) ),
			array( 'type' => 'attach_image', 'heading' => 'Ảnh', 'param_name' => 'anh', 'dependency' => array( 'element' => 'minh_hoa', 'value' => 'anh' ) ),
			array( 'type' => 'attach_images', 'heading' => 'Thư viện ảnh (bấm để phóng to)', 'param_name' => 'thu_vien', 'dependency' => array( 'element' => 'minh_hoa', 'value' => 'thu_vien' ) ),
			array( 'type' => 'textarea_raw_html', 'heading' => 'Mã nhúng bản đồ (iframe Google Maps)', 'param_name' => 'ban_do', 'dependency' => array( 'element' => 'minh_hoa', 'value' => 'ban_do' ) ),
			array( 'type' => 'textarea_raw_html', 'heading' => 'Bảng (HTML <table>)', 'param_name' => 'bang', 'dependency' => array( 'element' => 'minh_hoa', 'value' => 'bang' ) ),
			array( 'type' => 'dropdown', 'heading' => 'Bài phân tích chi tiết (không bắt buộc) – hiện 1 dòng link cuối khối', 'param_name' => 'bai_chi_tiet', 'value' => $bai, 'std' => '' ),
			$neo,
		),
	) );

	vc_map( array(
		'name' => 'Velis · Nhận bảng giá', 'base' => 'velis_nhan_bang_gia', 'category' => $cat, 'icon' => 'icon-wpb-contactform7',
		'description' => 'Khối form duy nhất của trang: tiêu đề, 3 lợi ích, form CF7, dòng Gọi / Zalo (lấy từ Tùy biến → Thanh liên hệ).',
		'html_template' => $dir . 'velis_nhan_bang_gia.php',
		'params' => array(
			array( 'type' => 'textfield', 'heading' => 'Tiêu đề (để trống = "Nhận bảng giá {tên trang}")', 'param_name' => 'tieu_de', 'admin_label' => true ),
			array( 'type' => 'param_group', 'heading' => 'Lợi ích (3 dòng)', 'param_name' => 'loi_ich',
				'value' => rawurlencode( wp_json_encode( array( array( 'dong' => 'Bảng giá chi tiết và chính sách bán hàng mới nhất' ), array( 'dong' => 'Giỏ hàng căn đang có, chọn theo nhu cầu và số vốn' ), array( 'dong' => 'Phân tích pháp lý và tiềm năng đầu tư' ) ) ) ),
				'params' => array( array( 'type' => 'textfield', 'heading' => 'Dòng', 'param_name' => 'dong', 'admin_label' => true ) ) ),
			array( 'type' => 'dropdown', 'heading' => 'Form', 'param_name' => 'form', 'value' => velis_cf7_lua_chon(), 'admin_label' => true ),
			array( 'type' => 'textfield', 'heading' => 'Dự án ghi vào lead (để trống = tên trang)', 'param_name' => 'du_an' ),
			array( 'type' => 'textfield', 'heading' => 'Ghi chú sau dòng Gọi / Zalo (vd. giờ làm việc)', 'param_name' => 'goi_them', 'value' => '(08:00–21:00 hằng ngày)' ),
		),
	) );

	vc_map( array(
		'name' => 'Velis · Hỏi đáp', 'base' => 'velis_hoi_dap', 'category' => $cat, 'icon' => 'icon-wpb-toggle-small-expand',
		'description' => 'Câu hỏi thường gặp: bấm câu hỏi để mở; tự tạo dữ liệu có cấu trúc FAQPage cho Google.',
		'html_template' => $dir . 'velis_hoi_dap.php',
		'params' => array(
			array( 'type' => 'textfield', 'heading' => 'Tiêu đề', 'param_name' => 'tieu_de', 'value' => 'Câu hỏi thường gặp', 'admin_label' => true ),
			array( 'type' => 'textarea', 'heading' => 'Đoạn dẫn (không bắt buộc)', 'param_name' => 'gioi_thieu' ),
			array( 'type' => 'param_group', 'heading' => 'Câu hỏi', 'param_name' => 'muc',
				'value' => rawurlencode( wp_json_encode( array( array( 'hoi' => 'Pháp lý dự án hiện nay ra sao?', 'dap' => 'Trả lời ngắn, có số liệu và nguồn.' ) ) ) ),
				'params' => array(
					array( 'type' => 'textfield', 'heading' => 'Câu hỏi', 'param_name' => 'hoi', 'admin_label' => true ),
					array( 'type' => 'textarea', 'heading' => 'Trả lời (được dùng HTML đơn giản: <p>, <strong>, <a>)', 'param_name' => 'dap' ),
				) ),
			$neo,
		),
	) );

	vc_map( array(
		'name' => 'Velis · Mục lục', 'base' => 'velis_muc_luc', 'category' => $cat, 'icon' => 'icon-wpb-ui-custom_heading',
		'description' => 'Tự lấy tiêu đề H2 của các khối Velis trên trang. Đặt ngay sau phần đầu trang. Điện thoại: thu gọn.',
		'html_template' => $dir . 'velis_muc_luc.php',
		'params' => array( array( 'type' => 'textfield', 'heading' => 'Tiêu đề', 'param_name' => 'tieu_de', 'value' => 'Nội dung chính', 'admin_label' => true ) ),
	) );

	vc_map( array(
		'name' => 'Velis · Lưới dự án / bài liên quan', 'base' => 'velis_luoi', 'category' => $cat, 'icon' => 'icon-wpb-application-icon-large',
		'description' => 'Lưới thẻ dự án hoặc danh sách bài theo chuyên mục (cùng mẫu thẻ toàn site).',
		'html_template' => $dir . 'velis_luoi.php',
		'params' => array(
			array( 'type' => 'textfield', 'heading' => 'Tiêu đề', 'param_name' => 'tieu_de', 'value' => 'Bài viết liên quan', 'admin_label' => true ),
			array( 'type' => 'dropdown', 'heading' => 'Loại', 'param_name' => 'loai', 'value' => array( 'Thẻ dự án' => 'du_an', 'Danh sách bài' => 'bai' ), 'std' => 'bai', 'admin_label' => true ),
			array( 'type' => 'textfield', 'heading' => 'ID chuyên mục (cách nhau dấu phẩy; Dự án = 34, Phân khu = 57)', 'param_name' => 'danh_muc', 'value' => '48' ),
			array( 'type' => 'textfield', 'heading' => 'ID bài cụ thể (để trống = mới nhất trong chuyên mục)', 'param_name' => 'bai' ),
			array( 'type' => 'checkbox', 'heading' => 'Chỉ bài nổi bật (Bài viết → Dính lên đầu)', 'param_name' => 'noi_bat', 'value' => array( 'Có' => 'y' ) ),
			array( 'type' => 'textfield', 'heading' => 'Số bài', 'param_name' => 'so', 'value' => '3' ),
			$neo,
		),
	) );
	vc_map( array(
		'name' => 'Velis · Trả lời nhanh', 'base' => 'velis_tra_loi', 'category' => $cat, 'icon' => 'icon-wpb-information-white',
		'description' => 'Đầu bài: H2 câu hỏi + ô nền nhẹ 2–4 câu (hoặc 3–5 gạch đầu dòng số liệu) + dòng "Nguồn · Cập nhật · Phân tích". Chỉ bài trả lời một câu hỏi cụ thể.',
		'html_template' => $dir . 'velis_tra_loi.php',
		'params' => array(
			array( 'type' => 'textfield', 'heading' => 'Câu hỏi (H2, theo cách người đọc tìm, vd. "Giá The Privé bao nhiêu?")', 'param_name' => 'cau_hoi', 'admin_label' => true ),
			array( 'type' => 'textarea_html', 'heading' => 'Trả lời (2–4 câu hoặc 3–5 gạch đầu dòng; số kiểu Việt: 5,0–6,5 tỷ; 100–130 triệu/m²)', 'param_name' => 'content', 'value' => '<p>Câu trả lời chính trong 2–4 câu.</p>' ),
			array( 'type' => 'textfield', 'heading' => 'Nguồn (để trống = "Tổng hợp từ thông tin chủ đầu tư công bố")', 'param_name' => 'nguon' ),
			array( 'type' => 'textfield', 'heading' => 'Nhãn trong ô', 'param_name' => 'nhan', 'value' => 'Trả lời nhanh' ),
		),
	) );

	vc_map( array(
		'name' => 'Velis · Đọc thêm', 'base' => 'velis_doc_them', 'category' => $cat, 'icon' => 'icon-wpb-ui-icon',
		'description' => 'Thẻ link giữa bài, đặt ngay sau đoạn nhắc tới chủ đề. Tối đa 2 thẻ mỗi bài (thẻ thứ 3 không hiện).',
		'html_template' => $dir . 'velis_doc_them.php',
		'params' => array(
			array( 'type' => 'dropdown', 'heading' => 'Bài đích', 'param_name' => 'bai', 'value' => $bai, 'admin_label' => true ),
			array( 'type' => 'textfield', 'heading' => 'Một dòng: người đọc sẽ biết thêm gì', 'param_name' => 'mo_ta', 'value' => '' ),
		),
	) );
} );

// FAQPage từ phần tử Hỏi đáp (Rank Math không tạo FAQ cho trình sửa cổ điển – không trùng)
add_filter( 'rank_math/json_ld', function ( $data ) {
	if ( ! is_singular() ) {
		return $data;
	}
	foreach ( $data as $node ) {
		if ( is_array( $node ) && 'FAQPage' === ( $node['@type'] ?? '' ) ) {
			return $data;
		}
	}
	$qa = velis_hoi_dap_items( get_post_field( 'post_content', get_queried_object_id() ) );
	if ( $qa ) {
		$data['velisFaq'] = array(
			'@type'      => 'FAQPage',
			'@id'        => get_permalink() . '#faq',
			'mainEntity' => array_map( fn( $x ) => array( '@type' => 'Question', 'name' => $x[0], 'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $x[1] ) ), $qa ),
		);
	}
	return $data;
}, 100 ); // sau Rank Math + velis_schema_graph (99): không chen vào lúc Rank Math dựng WebPage

// Trang có Mục lục Velis / ô Trả lời nhanh: không chèn mục lục Easy TOC tự động
add_filter( 'ez_toc_maybe_apply_the_content_filter', function ( $apply ) {
	$nd = is_singular() ? (string) get_post_field( 'post_content', get_queried_object_id() ) : '';
	return has_shortcode( $nd, 'velis_muc_luc' ) || has_shortcode( $nd, 'velis_tra_loi' ) ? false : $apply; // ô Trả lời nhanh tự in mục lục sau nó
} );
