<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_account_orders', $has_orders ); ?>
<h2 class="cabinet__title">Заказы</h2>
<?php if ( $has_orders ) : ?>

    <table class="cabinet__orders woocommerce-orders-table woocommerce-MyAccount-orders shop_table shop_table_responsive my_account_orders account-orders-table">
        <thead>
        <tr>
            <th class="u-hidden-sm-down"></th>
            <th class="u-hidden-sm-down">Номер заказа</th>
            <th colspan="2" class="u-hidden-md-up">Номер заказа</th>
            <th>Дата создания</th>
            <th>Статус</th>
            <th>Сумма</th>
        </tr>
        </thead>
        <tbody>
		<?php
		$orders         = wc_get_orders( [
			'customer' => get_user_meta( get_current_user_id(), 'email', true ),
			'limit'    => - 1
		] );
		foreach ( $orders as $customer_order ) :
			$order = wc_get_order( $customer_order );
			$item_count = $order->get_item_count();
			?>
            <tr class="woocommerce-orders-table__row woocommerce-orders-table__row--status-<?php echo esc_attr( $order->get_status() ); ?> order">
                <td>
                    <a href="<?= $order->get_view_order_url() ?>" title="" class="cabinet__orders__link">
                        <svg width="19" height="19">
                            <use xlink:href="<?= path() ?>img/sprite.svg#invoice"></use>
                        </svg>
                    </a>
                </td>
                <td class="cabinet__orders__code"><?= $order->get_id() ?></td>
                <td><?= wc_format_datetime( $order->get_date_created(), 'j F Y' ) ?></td>
				<?php foreach ( wc_get_account_orders_columns() as $column_id => $column_name ) :
					if ( $column_id == 'order-actions' || $column_id == 'order-number' || $column_id == 'order-date' ) {
						continue;
					}
					?>
                    <td class="woocommerce-orders-table__cell woocommerce-orders-table__cell-<?php echo esc_attr( $column_id ); ?>"
                        data-title="<?php echo esc_attr( $column_name ); ?>">
						<?php if ( has_action( 'woocommerce_my_account_my_orders_column_' . $column_id ) ) : ?>
							<?php do_action( 'woocommerce_my_account_my_orders_column_' . $column_id, $order ); ?>

						<?php elseif ( 'order-number' === $column_id ) : ?>
                            <a href="<?php echo esc_url( $order->get_view_order_url() ); ?>">
								<?php echo _x( '#', 'hash before order number', 'woocommerce' ) . $order->get_order_number(); ?>
                            </a>

						<?php elseif ( 'order-date' === $column_id ) : ?>
                            <time datetime="<?php echo esc_attr( $order->get_date_created()->date( 'c' ) ); ?>"><?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></time>

						<?php elseif ( 'order-status' === $column_id ) : ?>
							<?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?>

						<?php elseif ( 'order-total' === $column_id ) : ?>
							<?php
							echo wc_price( $order->get_total() );
							?>

						<?php elseif ( 'order-actions' === $column_id ) : ?>
							<?php
							$actions = wc_get_account_orders_actions( $order );

							if ( ! empty( $actions ) ) {
								foreach ( $actions as $key => $action ) {
									echo '<a href="' . esc_url( $action['url'] ) . '" class="woocommerce-button button ' . sanitize_html_class( $key ) . '">' . esc_html( $action['name'] ) . '</a>';
								}
							}
							?>
						<?php endif; ?>
                    </td>
				<?php endforeach; ?>
            </tr>
		<?php endforeach; ?>
        </tbody>
    </table>
	<?php do_action( 'woocommerce_before_account_orders_pagination' ); ?>
<?php else : ?>
    <div class="woocommerce-message woocommerce-message--info woocommerce-Message woocommerce-Message--info woocommerce-info">
        <a class="woocommerce-Button button"
           href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>">
			<?php _e( 'Go shop', 'woocommerce' ) ?>
        </a>
		<?php _e( 'No order has been made yet.', 'woocommerce' ); ?>
    </div>
<?php endif; ?>

<?php do_action( 'woocommerce_after_account_orders', $has_orders ); ?>
