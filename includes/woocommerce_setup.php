<?php
// woocommerce support

function categoryFilter() {
	global $filterAttr;
	$filterAttr = [ 'material' => 'Материал', 'color' => 'Цвет', 'size' => 'Размер' ];
	global $currentCategory;
	$currentCategory = get_queried_object_id();
	if ( isset( $_GET['filter_category'] ) && ! empty( $_GET['filter_category'] ) ) {
		$filterCategory = get_term( $_GET['filter_category'], 'product_cat' );
		foreach ( $filterAttr as $attr => $attrName ) {
			if ( isset( $_GET[ 'filter_' . $attr ] ) && $_GET[ 'filter_' . $attr ] == "" ) {
				unset( $_GET[ 'filter_' . $attr ] );
			}
		}
		if ( $_GET['filter_category'] == 'shop' ) {
			unset( $_GET['filter_category'] );
			$categoryUrl = get_permalink( wc_get_page_id( 'shop' ) );
			if ( ! empty( $_GET ) ) {
				$categoryUrl .= '?' . http_build_query( $_GET );
			}
			header( 'Location: ' . $categoryUrl );
			exit();
		}
		if ( $filterCategory ) {
			unset( $_GET['filter_category'] );
			$categoryUrl = get_term_link( $filterCategory );
			if ( ! empty( $_GET ) ) {
				$categoryUrl .= '?' . http_build_query( $_GET );
			}
			header( 'Location: ' . $categoryUrl );
			exit();
		}
	}
}

function ajax_loop( $query ) {
	if ( isset( $_POST['products_ajax'] ) && $_POST['products_ajax'] == 1 ) {
		$query->set( 'posts_per_page', '12' );
		if ( isset( $_POST['offset'] ) ) {
			$query->set( 'offset', $_POST['offset'] );
		}
	}
}

add_action( 'pre_get_posts', 'ajax_loop' );

add_action( 'after_setup_theme', 'woocommerce_support' );
function woocommerce_support() {
	add_theme_support( 'woocommerce' );
}

add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

add_filter( 'woocommerce_checkout_fields', 'custom_wc_checkout_fields' );
function custom_wc_checkout_fields( $fields ) {
	$fields['billing']['billing_address_1']['required'] = false;
	$fields['billing']['billing_country']['required']   = false;
	$fields['billing']['billing_city']['required']      = false;
	$fields['billing']['billing_postcode']['required']  = false;
	$fields['billing']['billing_address_2']['required'] = false;
	$fields['billing']['billing_state']['required']     = false;
	$fields['billing']['billing_email']['required']     = false;
	$fields['order']['order_comments']['type']          = 'text';
	$fields['billing']['billing_postcode']['label']     = 'Квартира';
	$fields['billing']['billing_state']['label']        = 'Корпус';
	//  unset($fields['billing']['billing_last_name']);
	unset( $fields['billing']['billing_company'] );
	//unset( $fields['billing']['billing_postcode'] );
	//unset( $fields['billing']['billing_state'] );
	//unset( $fields['billing']['billing_email'] );
	//unset($fields['billing']['billing_country']);
	//unset($fields['billing']['billing_address_2']);
	//unset($fields['billing']['billing_state']);
	return $fields;
}

add_filter( 'woocommerce_currency_symbol', 'add_my_currency_symbol', 10, 2 );
function add_my_currency_symbol( $currency_symbol, $currency ) {

	switch ( $currency ) {
		case 'RUB':
			$currency_symbol = ' руб.';
			break;
	}

	return $currency_symbol;
}

add_image_size( 'catalog_size', 400, 400, [ 'top', 'top' ] );

//add_image_size( 'single_size', 1040, 680, [ 'top', 'top' ] );

add_filter( 'default_checkout_billing_country', 'change_default_checkout_country' );
add_filter( 'default_checkout_billing_state', 'change_default_checkout_state' );

function change_default_checkout_country() {
	return 'RU'; // country code
}

function change_default_checkout_state() {
	return 'Московская'; // state code
}