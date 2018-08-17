<?php

defined( 'ABSPATH' ) || exit;

global $product;

if ( ! $product->is_purchasable() ) {
	return;
}

//echo wc_get_stock_html( $product ); // WPCS: XSS ok.

if ( $product->is_in_stock() ) : ?>

	<?php do_action( 'woocommerce_before_add_to_cart_form' ); ?>

    <form class="cart product__options"
          action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); ?>"
          method="post" enctype='multipart/form-data'>
		<?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

		<?php
		do_action( 'woocommerce_before_add_to_cart_quantity' );
		wc_get_template( 'single-product/add-to-cart/quantity.php' );
		do_action( 'woocommerce_after_add_to_cart_quantity' );
		?>
        <button type="submit" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>" class="btn">
            <svg width="13" height="16" class="btn__icon">
                <use xlink:href="<?= path() ?>img/sprite.svg#bag"></use>
            </svg>
            <span>Добавить в корзину</span></button>

		<?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
    </form>

	<?php do_action( 'woocommerce_after_add_to_cart_form' ); ?>

<?php endif; ?>
