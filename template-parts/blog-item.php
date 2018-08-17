<li class="blog-list__item js-opacity">
    <a href="<? the_permalink() ?>" title="<? the_title() ?>" class="blog-link">
        <figure>
            <div class="blog-link__img-box">
                <? the_post_thumbnail('full', ['class' => 'blog-link__img']) ?>
            </div>
            <figcaption class="blog-link__caption">
                <time class="blog-link__date"
                      datetime="2017-11-20"><? the_date('j F Y') ?></time>
                <? the_title() ?>
            </figcaption>
        </figure>
    </a>
</li>