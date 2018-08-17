<?php

defined( 'ABSPATH' ) || exit;

global $product;

if ( ! function_exists( 'print_attribute_radio' ) ) {
	function print_attribute_radio( $checked_value, $value, $label, $name ) {
		// This handles < 2.4.0 bw compatibility where text attributes were not sanitized.
		$checked        = sanitize_title( $checked_value ) === $checked_value ? checked( $checked_value, sanitize_title( $value ), false ) : checked( $checked_value, $value, false );
		$input_name     = 'attribute_' . esc_attr( $name );
		$esc_value      = esc_attr( $value );
		$id             = esc_attr( $name . '_v_' . $value );
		$filtered_label = apply_filters( 'woocommerce_variation_option_name', $label );
		printf( '<input type="radio" name="%1$s" value="%2$s" id="%3$s" %4$s><label for="%3$s" class="product__options__option">%5$s</label>', $input_name, $esc_value, $id, $checked, $filtered_label );
	}
}

$attribute_keys = array_keys( $attributes );

do_action( 'woocommerce_before_add_to_cart_form' ); ?>

    <form class="variations_form cart product__options"
          action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); ?>"
          method="post" enctype='multipart/form-data' data-product_id="<?php echo absint( $product->get_id() ); ?>"
          data-product_variations="<?php echo htmlspecialchars( wp_json_encode( $available_variations ) ); // WPCS: XSS ok. ?>">
		<?php do_action( 'woocommerce_before_variations_form' ); ?>

		<?php if ( empty( $available_variations ) && false !== $available_variations ) : ?>
            <p class="stock out-of-stock"><?php esc_html_e( 'This product is currently out of stock and unavailable.', 'woocommerce' ); ?></p>
		<?php else : ?>
			<?php foreach ( $attributes as $name => $options ) : ?>
				<?php
				$sanitized_name = sanitize_title( $name );
				if ( isset( $_REQUEST[ 'attribute_' . $sanitized_name ] ) ) {
					$checked_value = $_REQUEST[ 'attribute_' . $sanitized_name ];
				} elseif ( isset( $selected_attributes[ $sanitized_name ] ) ) {
					$checked_value = $selected_attributes[ $sanitized_name ];
				} else {
					$checked_value = '';
				}
				?>
                <div class="product__options__set">
                    <div class="product__options__title"><?= wc_attribute_label( $name ) ?>:</div>
					<?php
					if ( ! empty( $options ) ) {
						if ( taxonomy_exists( $name ) ) {
							// Get terms if this is a taxonomy - ordered. We need the names too.
							$terms = wc_get_product_terms( $product->get_id(), $name, array( 'fields' => 'all' ) );
							foreach ( $terms as $term ) {
								if ( ! in_array( $term->slug, $options ) ) {
									continue;
								}
								print_attribute_radio( $checked_value, $term->slug, $term->name, $sanitized_name );
							}
						} else {
							foreach ( $options as $option ) {
								print_attribute_radio( $checked_value, $option, $option, $sanitized_name );
							}
						}
					}
					//echo end( $attribute_keys ) === $name ? apply_filters( 'woocommerce_reset_variations_link', '<a class="reset_variations" href="#">' . __( 'Clear', 'woocommerce' ) . '</a>' ) : '';
					?>
                </div>
			<?php endforeach; ?>

			<?php
			do_action( 'woocommerce_single_variation' );
		endif; ?>

		<?php do_action( 'woocommerce_after_variations_form' ); ?>
    </form>

<?php
do_action( 'woocommerce_after_add_to_cart_form' );
