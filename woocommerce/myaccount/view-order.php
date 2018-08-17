<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$order = wc_get_order( $order );
?>
<h2 class="cabinet__title">Заказ # <?= $order->get_order_number() ?></h2>

<div class="cabinet__order-info-box">
    <table class="cabinet__order-info">
        <tr>
            <td>Дата создания:</td>
            <td><?= wc_format_datetime( $order->get_date_created(), 'j F Y' ) ?> года</td>
        </tr>
        <tr>
            <td>Статус:</td>
            <td><?= esc_html( wc_get_order_status_name( $order->get_status() ) ); ?></td>
        </tr>
        <tr>
            <td>Заказчик:</td>
			<?
			$fullName = get_user_meta( $order->get_user_id(), 'billing_first_name', true );
			$fullName .= ' ' . get_user_meta( $order->get_user_id(), 'billing_last_name', true );

			?>
            <td><?= $fullName ?></td>
        </tr>
        <tr>
            <td>Телефон:</td>
            <td><?= get_user_meta( $order->get_user_id(), 'billing_phone', true ) ?></td>
        </tr>
    </table>

    <table class="cabinet__order-info">
        <tr>
            <td>E-mail:</td>
            <td><?= $order->get_billing_email() ?></td>
        </tr>
        <tr>
            <td>Типа оплаты:</td>
            <td><?= $order->get_payment_method_title() ?></td>
        </tr>
        <tr>
            <td>Тип доставки:</td>
            <td><?= $order->get_shipping_to_display() ?></td>
        </tr>
        <tr>
            <td>Адрес:</td>
            <td><?= $order->get_formatted_billing_address() ?></td>
        </tr>
    </table>
</div>

<h2 class="cabinet__title">Товары</h2>
<? $products = $order->get_items() ?>
<table class="cabinet__cart">
    <thead class="u-hidden-sm-down">
    <tr>
        <th colspan="2">Название товара</th>
        <th>Стоимость</th>
        <th>Количество</th>
        <th>Сумма</th>
    </tr>
    </thead>
    <tbody>
	<? foreach ( $products as $id ):
		$productData = $id->get_data();
		$_product = wc_get_product( $productData['product_id'] );
		?>
        <tr>
            <td>
                <figure class="cabinet__cart__img-box">
					<? $image = wp_prepare_attachment_for_js( $_product->get_image_id() ); ?>
                    <img src="<?= $image['url'] ?>" alt="<?= $image['alt'] ?>"/>
                </figure>
            </td>
            <td><?= $productData['name'] ?></td>
            <td>
                <div class="cabinet__cart__label">Стоимость за шт.:</div>
				<?= wc_price( $productData['subtotal'] / $productData['quantity'] ) ?>
            </td>
            <td>
                <div class="cabinet__cart__label">Количество:</div>
				<?= $productData['quantity'] ?> шт.
            </td>
            <td>
                <div class="cabinet__cart__label">Сумма:</div>
				<?= wc_price( $productData['subtotal'] ) ?>
            </td>
        </tr>
	<? endforeach;
	wp_reset_query() ?>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="5">
            Всего товаров: <b><?= $order->get_item_count() ?> шт.</b><br>
            На сумму: <b><?= $order->get_subtotal_to_display() ?></b><br>
            Стоимость доставки: <b><?= $order->get_total_shipping_refunded() ?> руб.</b>
        </td>
    </tr>
    </tfoot>
</table>
