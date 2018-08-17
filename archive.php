<?php
if ( isset( $_POST['blog_ajax'] ) ) {
	if ( have_posts() ) :
		while ( have_posts() ) : the_post();
			get_template_part( 'template-parts/blog-item' );
		endwhile;
		if ( isset( $_POST['offset'] ) && $_POST['offset'] + 1 >= $wp_query->found_posts ) {
			echo "<span style='display: none' class='overflow-blog'>true</span>";
		}
	endif;
	exit;
}

get_header(); ?>
    <h1 class="title"><? single_cat_title() ?></h1>
    <!-- START .blog-list -->
    <ul class="blog-list">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/blog-item' );
			endwhile;
		endif; ?>
    </ul>
    <!-- END .blog-list -->
    <div class="u-text-center">
        <a href="" title="" class="btn blog-ajax-load">
            <div>Показать ещё</div>
            <svg width="8" height="11" class="btn__icon">
                <use xlink:href="<?= path() ?>img/sprite.svg#down"></use>
            </svg>
        </a>
    </div>
<?
get_footer() ?>