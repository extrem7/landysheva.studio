<div class="popup" data-popup-name="search">
    <div class="popup__body">
        <button class="popup__close js-popup-close" type="button" title="Закрыть" aria-label="Закрыть">
            <svg width="20" height="20">
                <use xlink:href="<?= path() ?>img/sprite.svg#cancel"></use>
            </svg>
        </button>
        <form action="<?php echo home_url( '/' ); ?>" class="search-form">
            <input placeholder="Введите поисковый запрос ..." name="s"/>
            <input type="hidden" name="post_type" value="product">
            <button type="submit" class="search-form__btn">
                <svg width="20" height="20">
                    <use xlink:href="<?= path() ?>img/sprite.svg#search"></use>
                </svg>
            </button>
        </form>
    </div>
</div>