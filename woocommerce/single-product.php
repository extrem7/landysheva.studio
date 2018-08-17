<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
global $product;
$product = wc_get_product( $post );
get_header( 'shop' ); ?>

    <div class="row">
        <div class="col-xs-12 col-lg-10 offset-lg-1">
            <!-- START .product -->
            <article class="product">

				<? wc_get_template( 'single-product/product-image.php' ); ?>

				<? wc_get_template( 'single-product/title.php' ); ?>

				<? wc_get_template( 'single-product/price.php' ); ?>

				<? wc_get_template( 'single-product/short-description.php' ); ?>

				<?
				$productType = $product->get_type();
				switch ( $productType ) {
					case 'simple':
						woocommerce_simple_add_to_cart();
						break;
					case 'variable':
						woocommerce_variable_add_to_cart();
						break;
				}
				?>

				<? wc_get_template( 'single-product/tabs/description.php' ); ?>

				<? wc_get_template( 'single-product/product-attributes.php' ); ?>

				<? wc_get_template( 'single-product/product-thumbnails.php' ); ?>
            </article>
            <!-- END .product -->
        </div>
    </div>

    <!-- START .catalog -->
<? woocommerce_related_products() ?>
    <!-- END .catalog -->

<? get_template_part( 'template-parts/subscribe' ) ?>

<?php get_footer( 'shop' );
