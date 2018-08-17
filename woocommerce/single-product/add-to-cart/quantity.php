<?php

defined( 'ABSPATH' ) || exit;

global $product;
?>

<div class="product__options__set">
    <div class="product__options__title">Количество:</div>
	<?
	$maxCount = 0;
	if ( $product->get_max_purchase_quantity() == - 1 ) {
		$maxCount = 4;
	} else {
		$maxCount = $product->get_max_purchase_quantity();
	}


	for ( $i = 1; $i <= $maxCount; $i ++ ):
		$isChecked = $i == 1;
		if ( isset( $_POST['quantity'] ) && $_POST['quantity'] == $i ) {
			$isChecked = true;
		}
		?>
        <input id="quantity-option-<?= $i ?>" type="radio" value="<?= $i ?>"
               name="quantity" <?= $isChecked ? 'checked' : '' ?>>
        <label for="quantity-option-<?= $i ?>" class="product__options__option"><?= $i ?></label>
	<? endfor; ?>
</div>