<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) );

	return;
}

?>

<form name="checkout" method="post" class="checkout woocommerce-checkout checkout form"
      action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">
	<?php if ( $checkout->get_checkout_fields() ) : ?>

		<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

        <div class="col2-set" id="customer_details">
            <div class="col-1">
				<?php do_action( 'woocommerce_checkout_billing' ); ?>
            </div>

            <div class="col-2">
				<?php do_action( 'woocommerce_checkout_shipping' ); ?>
            </div>
        </div>

		<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

	<?php endif; ?>
    <h3 id="order_review_heading"><?php _e( 'Your order', 'woocommerce' ); ?></h3>
	<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
    <div id="order_review" class="woocommerce-checkout-review-order">
		<?php do_action( 'woocommerce_checkout_order_review' ); ?>
    </div>
	<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
    <div class="checkout__total">
        Итого:
        <b><?php wc_cart_totals_order_total_html() ?></b>
    </div>
	<?php wc_get_template( 'checkout/terms.php' ); ?>
    <div class="checkout__actions">
        <button type="submit" class="btn">
            <span>Оплатить</span>
            <svg width="11" height="8" class="btn__icon">
                <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
            </svg>
        </button>
    </div>
</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
