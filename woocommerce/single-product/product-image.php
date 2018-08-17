<?php

defined( 'ABSPATH' ) || exit;
global $post;

$leftImage  = get_field( 'картинка_левая' );
$bigImage   = get_the_post_thumbnail_url( $post, 'full' );
$rightImage = get_field( 'картинка_правая' );
if ( $bigImage ):
	?>
    <div class="product__images">
        <figure class="product__images__box">
            <div class="product__images__img-box js-product-left-image">
                <picture>
                    <source srcset="<?= $leftImage['url'] ?>" media="(min-width: 576px)">
                    <img srcset="<?= $leftImage['url'] ?>"
                         class="product__images__img product__images__img--1" alt="">
                </picture>
            </div>

            <div class="product__images__img-box js-product-center-image">
                <picture>
                    <source srcset="<?= $bigImage ?>" media="(min-width: 576px)">
                    <img srcset="<?= $bigImage ?>"
                         class="product__images__img product__images__img--2" alt="">
                </picture>
            </div>

            <div class="product__images__img-box js-product-right-image">
                <picture>
                    <source srcset="<?= $rightImage['url'] ?>" media="(min-width: 576px)">
                    <img srcset="<?= $rightImage['url'] ?>"
                         class="product__images__img product__images__img--3" alt="">
                </picture>
            </div>
        </figure>
    </div>
<? endif; ?>