<?
/* Template Name: Личный кабинет */
get_header(); ?>
    <!-- START .cabinet -->
    <div class="cabinet">
        <div class="row">
            <div class="col-xs-12 col-lg-10 offset-lg-1">
				<? if ( is_user_logged_in() ): ?>
                    <h1 class="title"><? the_title() ?></h1>
				<? endif; ?>
				<?= do_shortcode( '[woocommerce_my_account]' ) ?>
            </div>
        </div>
    </div>
<? get_footer() ?>