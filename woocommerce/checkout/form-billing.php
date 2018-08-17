<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<div class="woocommerce-billing-fields">
	<?php if ( wc_ship_to_billing_address_only() && WC()->cart->needs_shipping() ) : ?>

        <!--<h3><?php _e( 'Billing &amp; Shipping', 'woocommerce' ); ?></h3>-->

	<?php else : ?>

    <!--<h3><?php _e( 'Billing details', 'woocommerce' ); ?></h3>-->

	<?php endif; ?>
	<?php do_action( 'woocommerce_before_checkout_billing_form', $checkout ); ?>
    <fieldset class="checkout__set">
        <div class="checkout__title">Личные данные</div>
        <div class="form__line">
            <label class="form__item form__item__name">
                <span class="form__labelname">Фамилия</span>
                <input type="text" class="input-text " name="billing_last_name" id="billing_last_name" placeholder=""
                       value="<?= $checkout->get_value( 'billing_last_name' ) ?>" autocomplete="family-name">
            </label>
            <label class="form__item form__item__name">
                <span class="form__labelname">Имя</span>
                <input type="text" class="input-text " name="billing_first_name" id="billing_first_name" placeholder=""
                       value="<?= $checkout->get_value( 'billing_first_name' ) ?>" autocomplete="given-name">
            </label>
            <label class="form__item form__item__phone">
                <span class="form__labelname">Телефон</span>
                <input type="tel" class="input-text " name="billing_phone" id="billing_phone" placeholder=""
                       value="<?= $checkout->get_value( 'billing_phone' ) ?>" autocomplete="tel">
            </label>
            <label class="form__item">
                <span class="form__labelname">E-mail</span>
                <input type="email" class="input-text " name="billing_email" id="billing_email" placeholder=""
                       value="<?= $checkout->get_value( 'billing_email' ) ?>" autocomplete="email">
            </label>
        </div>
    </fieldset>

    <fieldset class="checkout__set">
        <div class="checkout__title">Выберите способ доставки</div>

	        <?php wc_cart_totals_shipping_html(); ?>
            <!--
            <input id="co1" type="radio" name="type" checked>
            <label for="co1" class="checkout__option">
                <span class="checkout__option__title">Доставка по Москве и области</span>
                Курьер доставит заказ в течение 3-5 дней.
                <span class="checkout__option__value">+ 500 руб.</span>
            </label>

            <input id="co2" type="radio" name="type">
            <label for="co2" class="checkout__option">
                <span class="checkout__option__title">Доставка по России</span>
                Доставка Почтой России
                <span class="checkout__option__value">от 299 руб.</span>
            </label>-->
    </fieldset>

    <fieldset class="checkout__set">
        <div class="checkout__title">Введите адрес доставки</div>
        <div class="woocommerce-billing-fields__field-wrapper">
			<?php
			$fields = $checkout->get_checkout_fields( 'billing' );

			foreach ( $fields as $key => $field ) {
				if ( isset( $field['country_field'], $fields[ $field['country_field'] ] ) ) {
					$field['country'] = $checkout->get_value( $field['country_field'] );
				}
				$excluded = [
					'billing_last_name',
					'billing_first_name',
					'billing_phone',
					'billing_email',
					'billing_country'
				];
				$field['label_class'] = 'form__labelname';
				if ( ! in_array( $key, $excluded ) ) {
					woocommerce_form_field( $key, $field, $checkout->get_value( $key ) );
				}
			}
			?>
            <label class="billing_country_field">
                <select name="billing_country" id="billing_country" class="country_to_state country_select "
                        autocomplete="country" style="display: none;">
                    <option value="RU" selected></option>
                </select>
            </label>
        </div>
        <!--<div class="form__line form__line--address">
            <label class="form__item">
                <span class="form__labelname">Улица *</span>
                <input/>
            </label>
            <label class="form__item">
                <span class="form__labelname">Дом *</span>
                <input/>
            </label>
            <label class="form__item">
                <span class="form__labelname">Корпус</span>
                <input/>
            </label>
            <label class="form__item">
                <span class="form__labelname">Подъезд</span>
                <input/>
            </label>
            <label class="form__item">
                <span class="form__labelname">Квартира *</span>
                <input/>
            </label>
            <label class="form__item">
                <span class="form__labelname">Домофон</span>
                <input/>
            </label>
        </div>-->
    </fieldset>
	<?php do_action( 'woocommerce_after_checkout_billing_form', $checkout ); ?>
</div>

<?php if ( ! is_user_logged_in() && $checkout->is_registration_enabled() ) : ?>
    <div class="woocommerce-account-fields">
		<?php if ( ! $checkout->is_registration_required() ) : ?>

            <p class="form-row form-row-wide create-account">
                <label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
                    <input class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox"
                           id="createaccount" <?php checked( ( true === $checkout->get_value( 'createaccount' ) || ( true === apply_filters( 'woocommerce_create_account_default_checked', false ) ) ), true ) ?>
                           type="checkbox" name="createaccount" value="1"/>
                    <span><?php _e( 'Create an account?', 'woocommerce' ); ?></span>
                </label>
            </p>

		<?php endif; ?>

		<?php do_action( 'woocommerce_before_checkout_registration_form', $checkout ); ?>

		<?php if ( $checkout->get_checkout_fields( 'account' ) ) : ?>

            <div class="create-account">
				<?php foreach ( $checkout->get_checkout_fields( 'account' ) as $key => $field ) : ?>
					<?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>
				<?php endforeach; ?>
                <div class="clear"></div>
            </div>

		<?php endif; ?>

		<?php do_action( 'woocommerce_after_checkout_registration_form', $checkout ); ?>
    </div>
<?php endif; ?>
