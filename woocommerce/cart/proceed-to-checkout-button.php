<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="checkout-button button alt wc-forward btn">
	<?php esc_html_e( 'Proceed to checkout', 'woocommerce' ); ?>
    <svg width="11" height="8" class="btn__icon">
        <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
    </svg>
</a>
