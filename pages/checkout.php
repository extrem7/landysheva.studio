<?
/* Template Name: Оформление заказа */
get_header(); ?>
    <div class="row">
        <div class="col-xs-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
			<? wc_print_notices(); ?>
            <h1 class="title"><? the_title() ?></h1>
            <!-- START .checkout -->
			<?= do_shortcode( '[woocommerce_checkout]' ) ?>
            <!-- END .checkout -->
        </div>
    </div>
<? get_footer() ?>