<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post;
global $id;

?>
<div class="product__about u-hidden-sm-down js-opacity">
	<?= apply_filters( 'the_content', wpautop( get_post_field( 'post_content', $id ), true ) ); ?>
</div>