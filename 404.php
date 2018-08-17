<? get_header(); ?>
    <!-- START .e404 -->
    <div class="e404">
        <h1 class="title"><? the_field( 'заголовок_404', 'option' ) ?></h1>

        <picture>
            <img src="#" srcset="<?= path() ?>img/blocks/404/404.jpg 1x, <?= path() ?>img/blocks/404/404@2x.jpg 2x"
                 alt=""
                 width="596" height="323" role="presentation" class="e404__img">
        </picture>

        <p><? the_field( 'текст_404', 'option' ) ?></p>

        <div class="e404__actions">
            <a href="<? bloginfo( 'url' ) ?>" title="" class="btn">
                <div>На главную</div>
                <svg width="11" height="8" class="btn__icon">
                    <use xlink:href="<?= path() ?>img/sprite.svg#next"></use>
                </svg>
            </a>
        </div>
    </div>
    <!-- END .e404 -->

<? get_footer(); ?>