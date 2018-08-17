<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $product;

?>
<div class="product__price"><?= $product->get_price_html() ?></div>
