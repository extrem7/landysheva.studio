<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<?php wc_print_notices(); ?>

<?php do_action( 'woocommerce_before_customer_login_form' ); ?>

<h1 class="title">Вход и регистрация</h1>

<div class="login-form-box">
    <!-- START .login-form -->
    <form class="woocommerce-form woocommerce-form-login login login-form login-form--decor form" method="post">
        <div class="login-form__box">
			<?php do_action( 'woocommerce_login_form_start' ); ?>
            <div class="login-form__title">Войти в аккаунт</div>
            <p>Используйте e-mail и пароль для входа.<br>
                После входа вы сможете продолжить покупки или оформить заказ.</p>
            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide form-row">
                <label for="username"
                       class="form__labelname"><?php esc_html_e( 'Username or email address', 'woocommerce' ); ?>
                    &nbsp;<span
                            class="required">*</span></label>
                <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="username"
                       id="username"
                       autocomplete="username"
                       value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>"/><?php // @codingStandardsIgnoreLine ?>
            </p>
            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                <label for="password" class="form__labelname"><?php esc_html_e( 'Password', 'woocommerce' ); ?>
                    &nbsp;<span
                            class="required">*</span></label>
                <input class="woocommerce-Input woocommerce-Input--text input-text" type="password" name="password"
                       id="password" autocomplete="current-password"/>
            </p>

			<?php do_action( 'woocommerce_login_form' ); ?>

            <p class="form-row login-form__actions">
				<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
                <button type="submit" class="woocommerce-Button button btn btn--block" name="login"
                        value="<?php esc_attr_e( 'Log in', 'woocommerce' ); ?>"><?php esc_html_e( 'Log in', 'woocommerce' ); ?></button>
                <label class="woocommerce-form__label woocommerce-form__label-for-checkbox inline">
                    <input class="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme" value="forever" /> <span><?php esc_html_e( 'Remember me', 'woocommerce' ); ?></span>
                </label>
            </p>
            <p class="woocommerce-LostPassword lost_password u-text-center">
                <a href="<?php echo esc_url( wp_lostpassword_url() ); ?>"
                   class="link"><?php esc_html_e( 'Lost your password?', 'woocommerce' ); ?></a>
            </p>

			<?php do_action( 'woocommerce_login_form_end' ); ?>
        </div>
    </form>
    <!-- END .login-form -->

    <!-- START .register-form -->
    <form method="post" class="woocommerce-form woocommerce-form-register register login-form form">
        <div class="login-form__box">
			<?php do_action( 'woocommerce_register_form_start' ); ?>

            <div class="login-form__title">Зарегистрироваться</div>
            <p>Введите имя, e-mail адрес и пароль.<br>
                Указанные данные будут использоваться для авторизации на сайте.</p>

			<?php if ( 'no' === get_option( 'woocommerce_registration_generate_username' ) ) : ?>

                <p class="woocommerce-form-row woocommerce-form-row--wide form-row form__row form-row-wide">
                    <label class="form__labelname" for="reg_username"><?php esc_html_e( 'Username', 'woocommerce' ); ?>
                        &nbsp;<span
                                class="required">*</span></label>
                    <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" name="username"
                           id="reg_username" autocomplete="username"
                           value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>"/><?php // @codingStandardsIgnoreLine ?>
                </p>

			<?php endif; ?>

            <p class="woocommerce-form-row woocommerce-form-row--wide form-row form__row form-row-wide">
                <label class="form__labelname" for="reg_email"><?php esc_html_e( 'Email address', 'woocommerce' ); ?>
                    &nbsp;<span
                            class="required">*</span></label>
                <input type="email" class="woocommerce-Input woocommerce-Input--text input-text" name="email"
                       id="reg_email"
                       autocomplete="email"
                       value="<?php echo ( ! empty( $_POST['email'] ) ) ? esc_attr( wp_unslash( $_POST['email'] ) ) : ''; ?>"/><?php // @codingStandardsIgnoreLine ?>
            </p>

			<?php if ( 'no' === get_option( 'woocommerce_registration_generate_password' ) ) : ?>

                <p class="woocommerce-form-row woocommerce-form-row--wide form-row form__row form-row-wide">
                    <label class="form__labelname" for="reg_password"><?php esc_html_e( 'Password', 'woocommerce' ); ?>
                        &nbsp;<span
                                class="required">*</span></label>
                    <input type="password" class="woocommerce-Input woocommerce-Input--text input-text" name="password"
                           id="reg_password" autocomplete="new-password"/>
                </p>

			<?php endif; ?>

            <p class="woocommerce-FormRow form-row login-form__actions">
                <button type="submit" class="woocommerce-Button button btn btn--block" name="register"
                        value="<?php esc_attr_e( 'Register', 'woocommerce' ); ?>"><?php esc_html_e( 'Register', 'woocommerce' ); ?></button>
				<?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>

            </p>
			<?php do_action( 'woocommerce_register_form' ); ?>

			<?php do_action( 'woocommerce_register_form_end' ); ?>
        </div>
    </form>
    <!-- END .register-form -->
</div>

<?php do_action( 'woocommerce_after_customer_login_form' ); ?>
