<? get_header(); ?>
    <div class="row">
        <div class="col-xs-12 col-lg-10 offset-lg-1">
            <article class="article">
                <h1 class="title"><? the_title() ?></h1>
                <figure class="article__img-box">
                    <picture>
                        <source  data-srcset="<? the_post_thumbnail_url() ?>" media="(min-width: 480px)">
                        <? the_post_thumbnail('full', ['class' => 'article__img']) ?>
                    </picture>
                </figure>
                <?= apply_filters( 'the_content', wpautop( get_post_field( 'post_content', $id ), true ) ); ?>
            </article>
        </div>
    </div>
<? get_footer(); ?>