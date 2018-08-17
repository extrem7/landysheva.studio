<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<table>
    <tr class="shipping">
        <th style="display: none"><?php echo wp_kses_post( $package_name ); ?></th>
        <td data-title="<?php echo esc_attr( $package_name ); ?>" class="checkout__options">
			<?php if ( 1 < count( $available_methods ) ) : ?>
				<?php foreach ( $available_methods as $method ) : ?>
					<?php
					//pre( $method );
					$costPrefix  = '+';
					$description = 'Курьер доставит заказ в течение 3-5 дней.';
					if ( $method->id == 'flat_rate:9' ) {
						$costPrefix  = 'от';
						$description = 'Доставка Почтой России';
					}
					printf( '<input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s />
								<label for="shipping_method_%1$d_%2$s" class="checkout__option">
								 <span class="checkout__option__title">' . $method->get_label() . '</span>
              ' . $description . '
              <span class="checkout__option__value">' . $costPrefix . ' ' . $method->cost . ' руб.</span>
</label>',
						$index, sanitize_title( $method->id ), esc_attr( $method->id ), checked( $method->id, $chosen_method, false ), wc_cart_totals_shipping_method_label( $method ) );

					do_action( 'woocommerce_after_shipping_rate', $method, $index );
					?>
				<?php endforeach; ?>
			<?php elseif ( 1 === count( $available_methods ) ) : ?>
				<?php
				$method = current( $available_methods );
				printf( '%3$s <input type="hidden" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d" value="%2$s" class="shipping_method" />', $index, esc_attr( $method->id ), wc_cart_totals_shipping_method_label( $method ) );
				do_action( 'woocommerce_after_shipping_rate', $method, $index );
				?>
			<?php elseif ( WC()->customer->has_calculated_shipping() ) : ?>
				<?php
				if ( is_cart() ) {
					echo apply_filters( 'woocommerce_cart_no_shipping_available_html', wpautop( __( 'There are no shipping methods available. Please ensure that your address has been entered correctly, or contact us if you need any help.', 'woocommerce' ) ) );
				} else {
					echo apply_filters( 'woocommerce_no_shipping_available_html', wpautop( __( 'There are no shipping methods available. Please ensure that your address has been entered correctly, or contact us if you need any help.', 'woocommerce' ) ) );
				}
				?>
			<?php elseif ( ! is_cart() ) : ?>
				<?php echo wpautop( __( 'Enter your full address to see shipping costs.', 'woocommerce' ) ); ?>
			<?php endif; ?>

			<?php if ( $show_package_details ) : ?>
				<?php echo '<p class="woocommerce-shipping-contents"><small>' . esc_html( $package_details ) . '</small></p>'; ?>
			<?php endif; ?>

			<?php if ( ! empty( $show_shipping_calculator ) ) : ?>
				<?php woocommerce_shipping_calculator(); ?>
			<?php endif; ?>
        </td>
    </tr>
</table>
