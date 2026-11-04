<?php
/**
 * Plugin Name: Velis Staging Guard
 * Description: Chỉ chạy trên staging.velisrealty.vn: robots.txt "Disallow: /" và chặn sitemap/KML với khách chưa đăng nhập.
 * Version: 1.0.0
 * Author: Velis Realty
 */

defined( 'ABSPATH' ) || exit;

// Never act outside staging, even if this file is copied to the live site by mistake.
if ( 'staging.velisrealty.vn' !== wp_parse_url( home_url(), PHP_URL_HOST ) ) {
	return;
}

add_filter( 'robots_txt', function () {
	return "User-agent: *\nDisallow: /\n";
}, PHP_INT_MAX );

add_action( 'init', function () {
	if ( is_user_logged_in() ) {
		return;
	}
	$path = (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH );
	if ( preg_match( '#(sitemap[^/]*\.(xml|xsl)|\.kml)$#i', $path ) ) {
		status_header( 403 );
		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow' );
		exit( 'Forbidden' );
	}
}, 0 );
