<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
global $post;
global $product;
$related = $product->get_upsell_ids();
if ( empty( $related ) ) {
	$related = wc_get_related_products( $post->ID, 3 );
}
if ( ! empty( $related ) ):
	?>
    <div class="catalog">
        <div class="title title--left">Рекомендуемые товары</div>
		<?
		?>
        <ul class="catalog__list">
			<?
			foreach ( $related as $post ) {
				$product = wc_get_product( $post );
				wc_get_template_part( 'content', 'product' );
			}
			?>
        </ul>
		<? //todo
		?>
        <div class="catalog__actions">
            <a href="<?= get_permalink( wc_get_page_id( 'shop' ) ); ?>" class="btn btn--w172">
                <span>Показать ещё</span>
                <svg width="11" height="8" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </div>
<?
endif;
wp_reset_postdata();
