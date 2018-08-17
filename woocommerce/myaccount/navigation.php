<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_account_navigation' );
?>

<ul class="cabinet__tabs">
	<?php foreach ( wc_get_account_menu_items() as $endpoint => $label ) : ?>
        <li class="<?php echo wc_get_account_menu_item_classes( $endpoint ); ?> cabinet__tabs__item">
            <a class="cabinet__tabs__btn <?= $endpoint == 'orders' && is_view_order_page() ? 'is-active' : '' ?>"
               href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>">
                <svg width="20" height="20" class="cabinet__tabs__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg
                <?
					switch ( $endpoint ) {
						case 'orders':
							echo '#cart';
							break;
						case'edit-address':
							echo '#location';
							break;
						case'edit-account':
							echo '#user';
							break;
						case'customer-logout':
							echo '#logout';
							break;
					}
					?>
            "></use>
                </svg>
				<?php echo esc_html( $label ); ?>
            </a>
        </li>
	<?php endforeach; ?>
</ul>

<?php do_action( 'woocommerce_after_account_navigation' ); ?>
