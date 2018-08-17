<? get_header(); ?>
    <div class="row">
        <div class="col-xs-12 col-lg-10 offset-lg-1">
            <article class="article">
                <h1 class="title"><? the_title() ?></h1>
				<?= apply_filters( 'the_content', wpautop( get_post_field( 'post_content', $id ), true ) ); ?>
            </article>
        </div>
    </div>
<? get_footer(); ?>