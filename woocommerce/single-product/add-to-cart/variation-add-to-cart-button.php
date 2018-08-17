<?php

defined( 'ABSPATH' ) || exit;

global $product;
?>
<?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

<?php
do_action( 'woocommerce_before_add_to_cart_quantity' );
wc_get_template( 'single-product/add-to-cart/quantity.php' );
do_action( 'woocommerce_after_add_to_cart_quantity' );
?>

<button type="submit" class="btn">
    <svg width="13" height="16" class="btn__icon">
        <use xlink:href="<?= path() ?>img/sprite.svg#bag"></use>
    </svg>
    <span>Добавить в корзину</span></button>

<?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>

<input type="hidden" name="add-to-cart" value="<?php echo absint( $product->get_id() ); ?>"/>
<input type="hidden" name="product_id" value="<?php echo absint( $product->get_id() ); ?>"/>
<input type="hidden" name="variation_id" class="variation_id" value="0"/>
