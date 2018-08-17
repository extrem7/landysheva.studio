<?php

defined( 'ABSPATH' ) || exit;

wc_print_notices();

do_action( 'woocommerce_before_cart' ); ?>

<form class="woocommerce-cart-form cart form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
	<?php do_action( 'woocommerce_before_cart_table' ); ?>

    <table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents cart__positions"
           cellspacing="0">
        <thead class="u-hidden-sm-down">
        <tr>
            <th colspan="2">Название товара</th>
            <th>Количество</th>
            <th>Сумма</th>
            <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
		<?php do_action( 'woocommerce_before_cart_contents' ); ?>

		<?php
		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
			$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
				$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
				?>
                <tr class="woocommerce-cart-form__cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">

                    <td class="product-thumbnail">
                        <a href="<?= $_product->get_permalink() ?>" title="<?= $_product->get_name() ?>"
                           class="cart__link">
                            <figure class="cart__img-box">
								<? $image = wp_prepare_attachment_for_js( $_product->get_image_id() ); ?>
                                <img src="<?= $image['url'] ?>" alt="<?= $image['alt'] ?>"/>
                            </figure>
                        </a>
                    </td>

                    <td class="product-name" data-title="<?php esc_attr_e( 'Product', 'woocommerce' ); ?>">
                        <a href="" title="" class="link"><?= $_product->get_name() ?></a>
                        <div class="cart__price"><?= $_product->get_price_html() ?></div>
                    </td>

                    <td class="product-quantity" data-title="<?php esc_attr_e( 'Quantity', 'woocommerce' ); ?>">
						<?php
						if ( $_product->is_sold_individually() ) {
							$product_quantity = sprintf( '1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key );
						} else {
							$product_quantity = woocommerce_quantity_input( array(
								'input_name'   => "cart[{$cart_item_key}][qty]",
								'input_value'  => $cart_item['quantity'],
								'max_value'    => $_product->get_max_purchase_quantity(),
								'min_value'    => '0',
								'product_name' => $_product->get_name(),
							), $_product, false );
						}

						echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
						?>
                    </td>

                    <td class="product-subtotal" data-title="<?php esc_attr_e( 'Total', 'woocommerce' ); ?>">
						<?php
						echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
						?>
                    </td>

                    <td class="product-remove">
						<?php
						// @codingStandardsIgnoreLine
						echo apply_filters( 'woocommerce_cart_item_remove_link', sprintf(
							'<a href="%s" class="cart__remove-btn" aria-label="%s" data-product_id="%s" data-product_sku="%s"></a>',
							esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
							__( 'Remove this item', 'woocommerce' ),
							esc_attr( $product_id ),
							esc_attr( $_product->get_sku() )
						), $cart_item_key );
						?>
                    </td>
                </tr>

				<?php
			}
		}
		?>

		<?php do_action( 'woocommerce_cart_contents' ); ?>
        <tr>
            <td colspan="6" class="actions">

				<?php if ( wc_coupons_enabled() ) { ?>
                    <div class="coupon">
                        <label for="coupon_code"><?php esc_html_e( 'Coupon:', 'woocommerce' ); ?></label> <input
                                type="text" name="coupon_code" class="input-text" id="coupon_code" value=""
                                placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>"/>
                        <button type="submit" class="button" name="apply_coupon"
                                value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>"><?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?></button>
						<?php do_action( 'woocommerce_cart_coupon' ); ?>
                    </div>
				<?php } ?>

                <button type="submit" class="button" name="update_cart"
                        value="<?php esc_attr_e( 'Update cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>

				<?php do_action( 'woocommerce_cart_actions' ); ?>

				<?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
            </td>
        </tr>
		<?php do_action( 'woocommerce_after_cart_contents' ); ?>
        </tbody>
    </table>
	<?php do_action( 'woocommerce_after_cart_table' ); ?>
</form>
<div class="cart__total">
    Итого:
    <b><?php wc_cart_totals_subtotal_html() ?></b>
</div>

<div class="cart__note">
    Цена с учетом всех сборов и НДС.<br>
    Стоимость доставки будет рассчитана в процессе оформления заказа.
</div>

<div class="cart__actions">
    <a href="<?= get_permalink( wc_get_page_id( 'shop' ) ); ?>" title="Каталог" class="btn btn--outline">Продолжить
        покупки</a>
	<? wc_get_template( 'cart/proceed-to-checkout-button.php' ); ?>
</div>

<div class="cart-collaterals">
	<?php
	do_action( 'woocommerce_cart_collaterals' );
	?>
</div>

<?php do_action( 'woocommerce_after_cart' ); ?>
