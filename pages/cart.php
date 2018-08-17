<?
/* Template Name: Корзина */
get_header(); ?>
    <div class="row">
        <div class="col-xs-12 col-lg-10 offset-lg-1">
            <h1 class="title"><? the_title() ?></h1>

            <!-- START .cart -->
			<?= do_shortcode( '[woocommerce_cart]' ) ?>
            <!-- END .cart -->
        </div>
    </div>
<? get_footer() ?>