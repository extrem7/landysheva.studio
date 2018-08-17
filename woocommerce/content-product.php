<?php


defined('ABSPATH') || exit;
global $post;
global $product;
$product = wc_get_product($product);
// Ensure visibility.
if (empty($product) || !$product->is_visible()) {
    return;
}
global $catalogCounter;
$catalogCounter++;
$isDouble = false;
//$isDouble = ($catalogCounter + 1) % 5 == 0 ? 'catalog__item--2x' : '';
?>
<li <?php wc_product_class("catalog__item js-opacity $isDouble"); ?>>
    <a href="<? the_permalink() ?>" title="<? the_title() ?>" class="catalog__link">
        <figure>
            <div class="catalog__img-box">
                <? the_post_thumbnail('catalog_size', ['class' => 'catalog__img']) ?>
            </div>
            <figcaption>
                <?
                $discount = null;
                $salePrice = $product->get_sale_price();
                $regularPrice = $product->get_regular_price();
                if ($salePrice) {
                    $discount = 100 - intval($salePrice / $regularPrice * 100);
                }
                if ($discount):
                    ?>
                    <div class="catalog__discount">-<?= $discount ?>%</div>
                <? endif; ?>
                <div class="catalog__title"><? the_title() ?></div>
                <? if ($discount): ?>
                    <s class="catalog__old-price"><?= wc_price($regularPrice) ?></s>
                    <div class="catalog__price catalog__price--new"><?= wc_price($salePrice) ?></div>
                <? else: ?>
                    <div class="catalog__price"><?= $product->get_price_html() ?></div>
                <? endif; ?>
            </figcaption>
        </figure>
    </a>
</li>
