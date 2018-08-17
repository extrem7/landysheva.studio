<? /* Template Name: Распродажа */
global $wp_query;
$saleQuery = new WP_Query( [
	'post_type'      => 'product',
	'posts_per_page' => - 1,
	'post_status'    => 'publish',
	'meta_key'       => '_sale_price',
	'meta_value'     => '0',
	'meta_compare'   => '>='
] );
$wp_query  = $saleQuery;
wc_get_template( 'archive-product.php' );