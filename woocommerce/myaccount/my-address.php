<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$customer_id = get_current_user_id();

if ( ! wc_ship_to_billing_address_only() && wc_shipping_enabled() ) {
	$get_addresses = apply_filters( 'woocommerce_my_account_get_addresses', array(
		'billing'  => __( 'Billing address', 'woocommerce' ),
		'shipping' => __( 'Shipping address', 'woocommerce' ),
	), $customer_id );
} else {
	$get_addresses = apply_filters( 'woocommerce_my_account_get_addresses', array(
		'billing' => __( 'Billing address', 'woocommerce' ),
	), $customer_id );
}

$oldcol = 1;
$col    = 1;
?>
    <h2 class="cabinet__title">Адреса</h2>

    <p class="cabinet__address-info"><?php echo apply_filters( 'woocommerce_my_account_my_address_description', __( 'The following addresses will be used on the checkout page by default.', 'woocommerce' ) ); ?></p>
<?php if ( ! wc_ship_to_billing_address_only() && wc_shipping_enabled() ) : ?>
    <ul class="cabinet__address-list">
<?php endif; ?>

<?php foreach ( $get_addresses as $name => $title ) : ?>

    <li class="cabinet__address u-column<?php echo ( ( $col = $col * - 1 ) < 0 ) ? 1 : 2; ?> col-<?php echo ( ( $oldcol = $oldcol * - 1 ) < 0 ) ? 1 : 2; ?> woocommerce-Address">
        <div class="cabinet__address__title"><?php echo $title; ?></div>
        <p><?php
			$address = preg_replace( '/<br\W*?\/>/', ', ', wc_get_account_formatted_address( $name ) );
			echo $address ?  $address : esc_html_e( 'You have not set up this type of address yet.', 'woocommerce' );
			?></p>

        <div class="cabinet__address__actions">
            <a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-address', $name ) ); ?>"
               title="<?php _e( 'Edit', 'woocommerce' ); ?>" class="btn">
                <div><?php _e( 'Edit', 'woocommerce' ); ?></div>
                <svg width="11" height="8" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </li>

<?php endforeach; ?>

<?php if ( ! wc_ship_to_billing_address_only() && wc_shipping_enabled() ) : ?>
    </ul>
<?php endif;
