<?
/* Template Name: Главная */
get_header(); ?>

    <!-- START .hero-video -->
    <figure class="hero-video">
        <div class="hero-video__video js-plyr" data-type="youtube" data-video-id="<? the_field( 'видео_id' ) ?>"></div>
    </figure>
    <div class="mobile-video" style="background-image: url('<?= get_field( 'видео_картинка' ) ?>')"></div>
    <!-- END .hero-video -->

    <!-- START .catalog -->
    <div class="catalog">
        <h1 class="title title--left"><? the_field( 'коллекция_заголовок' ) ?></h1>
		<? $categories = get_field( 'категории' ) ?>
        <ul class="catalog__list catalog__list--nav">
			<?
			$i             = 0;
			foreach ( $categories as $category ):
				$thumbnailId = get_term_meta( $category->term_id, 'thumbnail_id', true );
				$image     = wp_prepare_attachment_for_js( $thumbnailId );
				$mobileImg = get_field( 'мобильное_изображение', $category );
				if ( ! $mobileImg ) {
					$mobileImg = $image['url'];
				}
				$position = $i == 0 || $i == 2 || $i == 3 ? 'catalog__nav-title--left ' : 'catalog__nav-title--right ';
				$position = ( $i + 1 ) % 3 == 0 || $i % 3 == 0 ? 'catalog__nav-title--left ' : 'catalog__nav-title--right ';
				$position .= $i == 0 || $i == 1 ? 'catalog__nav-title--bottom' : '';
				?>
                <li class="catalog__item <?= $i == 0 ? 'catalog__item--2x' : '' ?> js-opacity">
                    <a href="<?= get_term_link( $category ) ?>" title="" class="catalog__nav-link">
                        <figure class="catalog__img-box">
                            <picture>
                                <source srcset="<?= $image['url'] ?>, <?= $image['url'] ?>"
                                        media="(min-width: 768px)">
                                <img srcset="<?= $mobileImg ?>, <?= $mobileImg ?>"
                                     class="catalog__nav-img" alt="">
                            </picture>
                            <figcaption
                                    class="catalog__nav-title <?= $position ?>"><?= $category->name ?></figcaption>
                        </figure>
                    </a>
                </li>
				<?
				$i ++;
			endforeach; ?>
        </ul>

        <div class="catalog__actions">
            <a href="<?= get_term_link( get_field( 'коллекция' ) ) ?>" class="btn btn--w172">
                <span>Вся коллекция</span>
                <svg width="11" height="8" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </div>
    <!-- END .catalog -->

    <!-- START .catalog -->
    <div class="catalog">
        <div class="title title--left"><?= get_the_title( 176 ) ?></div>

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

    <!-- START .about -->
    <article class="about article">
		<?
		$photo = get_field( 'дизайнер_фото' );
		//pre($photo);
		?>
        <div class="row row-lg-center">
            <div class="col-xs-12 col-md-6 col-lg-4 js-opacity">
                <figure class="article__img-box u-mt-0-xs-up u-mb-0-md-up u-ml-0-sm-down u-mr-0-sm-down">
                    <picture>
                        <source data-srcset="<?= $photo['url'] ?>, <?= $photo['url'] ?>"
                                media="(min-width: 768px)">
                        <img src="#"
                             data-srcset="<?= $photo['url'] ?>, <?= $photo['url'] ?>"
                             class="lazyload article__img" alt="Дизайнер Юлия Ландышева">
                    </picture>
                </figure>
            </div>

            <div class="col-xs-12 col-md-6 col-lg-7 offset-lg-1 js-opacity">
                <h2 class="title title--left"><? the_field( 'дизайнер_заголовок' ) ?></h2>

				<?= apply_filters( 'the_content', wpautop( get_field( 'дизайнер_текст' ), true ) ); ?>

                <div class="about__actions">
                    <a href="<? the_field( 'дизайнер_ссылка' ) ?>" title="<? the_field( 'дизайнер_заголовок' ) ?>"
                       class="btn">
                        <span>Подробнее</span>
                        <svg width="11" height="8" class="btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </article>
    <!-- END .about -->

<? get_template_part( 'template-parts/subscribe' ) ?>

    <div class="main__news">
		<?
		$news = get_term( 1 );
		?>
        <h2 class="title title--left"><?= $news->name ?></h2>

        <!-- START .blog-list -->
        <ul class="blog-list">
			<?
			$newsQuery = new WP_Query();
			$newsQuery->query( [ 'posts_per_page' => 3 ] );
			if ( $newsQuery->have_posts() ) :
				while ( $newsQuery->have_posts() ) : $newsQuery->the_post();
					get_template_part( 'template-parts/blog-item' );
				endwhile;
			endif;
			?>
        </ul>
        <!-- END .blog-list -->

        <div class="u-text-center">
            <a href="<?= get_term_link( $news ) ?>" title="<?= $news->name ?>" class="btn">
                <div>Показать ещё</div>
                <svg width="8" height="11" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </div>

<? get_footer() ?>