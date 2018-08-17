<?php

defined( 'ABSPATH' ) || exit;

global $product;

$gallery = $product->get_gallery_image_ids();
if ( ! empty( $gallery ) ): ?>
    <div class="product__gallery js-opacity">
        <div class="product__gallery__box js-slider"
             data-swiper-prev="#pg-prev"
             data-swiper-next="#pg-next"
             data-swiper-perview="1.845,1,1,1.845">
            <ul class="product__gallery__list swiper-wrapper">
                <!--<li class="product__gallery__item swiper-slide"
                    style="background-image: url('<? the_post_thumbnail_url( 'full' ); ?>')">
					<? // the_post_thumbnail( 'single_size', [ 'attr' => 'product__gallery__img' ] ) ?>
                </li>-->
				<?
				foreach ( $gallery as $photo ):
					?>
                    <li class="product__gallery__item swiper-slide"
                        style="background-image: url('<?= wp_get_attachment_image_src( $photo, 'full' )[0]; ?>')">
						<? // = wp_get_attachment_image( $photo, 'full', false, [ 'attr' => 'product__gallery__img' ] )
						?>
                    </li>
				<? endforeach; ?>
            </ul>
        </div>

        <div class="u-position-relative">
            <div class="product__gallery__controls">
                <button id="pg-prev" class="product__gallery__prev-btn"></button>
                <button id="pg-next" class="product__gallery__next-btn"></button>
            </div>
        </div>
    </div>
<? endif; ?>