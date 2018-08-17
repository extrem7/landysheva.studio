<?php

defined( 'ABSPATH' ) || exit;

if ( isset( $_POST['products_ajax'] ) ) {
	while ( have_posts() ) {
		the_post();
		wc_get_template_part( 'content', 'product' );
	}
	if ( isset( $_POST['offset'] ) && $_POST['offset'] + 12 >= $wp_query->found_posts ) {
		echo "<span style='display: none' class='overflow-blog'>true</span>";
	} else {
		$maxPages     = $wp_query->max_num_pages;
		$allPosts     = $wp_query->found_posts;
		$visiblePosts = $_POST['offset'] + 12;
		$postsSlice   = $allPosts - $visiblePosts;
		if ( $postsSlice > 12 ) {
			$postsSlice = 12;
		}
		if ( $maxPages > 1 ) {
			echo "<span style='display: none' class='overflow-blog'>$postsSlice</span>";
		}
	}
	exit;
}
$isSalePage = get_page_template_slug() == 'pages/sale.php';

global $filterAttr;
global $currentCategory;

$pageTitle = get_the_title( 5 );

if ( is_tax() ) {
	$pageTitle = single_cat_title( '', false );
}
if ( $isSalePage ) {
	$pageTitle = get_the_title();
}
if ( is_search() ) {
	$pageTitle = 'Поиск по запросу: "' . $_GET['s'] . '"';
}
if ( ! $isSalePage && ! is_search() ):
	categoryFilter();
	get_header( 'shop' );
	?>
    <div class="u-position-relative">
        <button class="btn btn--block catalog-btn u-hidden-lg-up js-toggle" data-toggle-target="#catalogFilter">
            <svg width="23" height="18" class="btn__icon">
                <use xlink:href="<?= path() ?>img/sprite.svg#filter"></use>
            </svg>
            <span>Фильтр поиска</span>
        </button>
        <!-- START .catalog-filter -->
        <form id="catalogFilter" action="" class="catalog-filter">
			<?

			$categories = get_terms( [ 'taxonomy' => 'product_cat' ] );
			?>
            <div class="catalog-filter__item">
                <select name="filter_category">
                    <option value="shop" selected>Категория</option>
					<?
					foreach ( $categories as $category ): ?>
                        <option value="<?= $category->term_id ?>" <?= $currentCategory == $category->term_id ? 'selected' : '' ?>><?= $category->name ?></option>
					<? endforeach; ?>
                </select>
            </div>
			<?
			foreach ( $filterAttr as $attr => $placeholder ):
				$attrValues = get_terms( [ 'taxomomy' => 'pa_' . $attr ] );
				$currentValue = null;
				$attrName = 'filter_' . $attr;
				if ( isset( $_GET[ $attrName ] ) && ! empty( $_GET[ $attrName ] ) ) {
					$currentValue = $_GET[ $attrName ];
				}
				?>
                <div class="catalog-filter__item">
                    <select name="<?= $attrName ?>">
                        <option value="" <?= ! $currentValue ? 'selected' : '' ?>><?= $placeholder ?></option>
						<? foreach ( $attrValues as $value ): ?>
                            <option value="<?= urldecode( $value->slug ) ?>" <?= $currentValue == urldecode( $value->slug ) ? 'selected' : '' ?>><?= $value->name ?></option>
						<? endforeach; ?>
                    </select>
                </div>
			<? endforeach; ?>
            <div class="catalog-filter__item u-text-center">
                <button type="submit" class="btn btn--w172">
                    <span>Применить</span>
                    <svg width="11" height="8" class="btn__icon">
                        <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                    </svg>
                </button>
            </div>
        </form>
        <!-- END .catalog-filter -->
    </div>
<? else: get_header( 'shop' );endif; ?>
    <!-- START .catalog -->
    <div class="catalog" id="main-catalog">
        <h1 class="title title--left"><?= $pageTitle ?></h1>
        <ul class="catalog__list">
			<?php
			global $catalogCounter;
			global $wp_query;

			if ( have_posts() ) :
				$catalogCounter = 0;

				while ( have_posts() ) : the_post();
					wc_get_template_part( 'content', 'product' );
				endwhile;
			endif; ?>
        </ul>
		<?
		$maxPages     = $wp_query->max_num_pages;
		$allPosts     = $wp_query->found_posts;
		$visiblePosts = $wp_query->post_count;
		$postsSlice   = $allPosts - $visiblePosts;
		if ( $postsSlice > 12 ) {
			$postsSlice = 12;
		}
		if ( $maxPages > 1 ):
			?>
            <div class="catalog__actions">
                <button type="submit" class="btn btn--w172">
                    Показать ещё <?= $postsSlice ?>
                </button>
            </div>
		<? endif; ?>
    </div>
    <!-- END .catalog -->
<?
if ( ! $isSalePage ): ?>
    <!-- START .catalog -->
    <div class="catalog">
        <div class="title title--left">Смотрите так же</div>

        <ul class="catalog__list">
			<?
			$saleQuery = new WP_Query( [
				'post_type'      => 'product',
				'posts_per_page' => 3,
				'post_status'    => 'publish',
				'meta_key'       => '_sale_price',
				'meta_value'     => '0',
				'meta_compare'   => '>='
			] );
			if ( $saleQuery->have_posts() ) :
				$catalogCounter = 0;
				while ( $saleQuery->have_posts() ) : $saleQuery->the_post();
					wc_get_template_part( 'content', 'product' );
				endwhile;
			endif;
			wp_reset_query();
			?>
        </ul>

        <div class="catalog__actions">
            <a href="<? the_permalink( 176 ) ?>" type="submit" class="btn btn--w172">
                <span>Показать ещё</span>
                <svg width="11" height="8" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </div>
    <!-- END .catalog -->
<? endif; ?>
<? get_template_part( 'template-parts/subscribe' ) ?>

<?
get_footer( 'shop' );
