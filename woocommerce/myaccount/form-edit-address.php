<?php

defined( 'ABSPATH' ) || exit;

$page_title = ( 'billing' === $load_address ) ? __( 'Billing address', 'woocommerce' ) : __( 'Shipping address', 'woocommerce' );

do_action( 'woocommerce_before_edit_account_address_form' ); ?>

<?php if ( ! $load_address ) : ?>
	<?php wc_get_template( 'myaccount/my-address.php' ); ?>
<?php else : ?>

    <form method="post" class="cabinet__form form">

        <h3 class="cabinet__title"><?php echo apply_filters( 'woocommerce_my_account_edit_address_title', $page_title, $load_address ); ?></h3><?php // @codingStandardsIgnoreLine ?>

        <div class="woocommerce-address-fields col-xs-12 col-sm-6 offset-sm-3 col-md-8 offset-md-2 col-xl-8 offset-xl-2">
			<?php do_action( "woocommerce_before_edit_address_form_{$load_address}" ); ?>

            <fieldset class="cabinet__form__set">
				<?php
				foreach ( $address as $key => $field ) {
					if ( isset( $field['country_field'], $address[ $field['country_field'] ] ) ) {
						$field['country'] = wc_get_post_data_by_key( $field['country_field'], $address[ $field['country_field'] ]['value'] );
					}
					$field['label_class'] = 'form__labelname';
					woocommerce_form_field( $key, $field, wc_get_post_data_by_key( $key, $field['value'] ) );
				}
				?>
            </fieldset>

			<?php do_action( "woocommerce_after_edit_address_form_{$load_address}" ); ?>

            <div class="col-xs-12 col-lg-10 offset-lg-1">
                <div class="cabinet__form__actions">
                    <button type="submit" class="button btn" name="save_address"
                            value="<?php esc_attr_e( 'Save address', 'woocommerce' ); ?>"><?php esc_html_e( 'Save address', 'woocommerce' ); ?>
                        <svg width="11" height="8" class="btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                        </svg>
                    </button>
					<?php wp_nonce_field( 'woocommerce-edit_address', 'woocommerce-edit-address-nonce' ); ?>
                    <input type="hidden" name="action" value="edit_address"/>
                </div>
            </div>
        </div>

    </form>

<?php endif; ?>

<?php do_action( 'woocommerce_after_edit_account_address_form' ); ?>
