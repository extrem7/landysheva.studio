<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post;

$short_description = apply_filters( 'woocommerce_short_description', $post->post_excerpt );

if ( ! $short_description ) {
	return;
}

?>
<div class="product__about u-hidden-md-up">
    <p><?= $short_description ?></p>
</div>