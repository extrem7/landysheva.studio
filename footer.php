</div>
</main><!-- end .main -->

<!--<button class="mute-btn is-active" title="Включить/выключить звук"></button>-->

<footer class="footer">
    <div class="footer__box">
        <div class="footer__info">
            <div class="footer__logo">
                <figure class="logo">
                    <svg width="303" height="31" class="logo__img">
                        <use xlink:href="<?= path() ?>img/sprite.svg#logo"></use>
                    </svg>
                </figure>
            </div>
            <div class="footer__copyright"><? the_field( 'футер_копирайт', 'option' ) ?></div>

            <div class="footer__social">
                <ul class="social-buttons">
                    <li class="social-buttons__item">
                        <a href="<? the_field( 'футер_инстаграм', 'option' ) ?>" title="" class="social-buttons__link">
                            <svg width="26" height="26" class="social-buttons__icon">
                                <use xlink:href="<?= path() ?>img/sprite.svg#instagram"></use>
                            </svg>
                        </a>
                    </li>
                    <li class="social-buttons__item">
                        <a href="<? the_field( 'футер_фейсбук', 'option' ) ?>" title="" class="social-buttons__link">
                            <svg width="26" height="26" class="social-buttons__icon">
                                <use xlink:href="<?= path() ?>img/sprite.svg#facebook"></use>
                            </svg>
                        </a>
                    </li>
                    <li class="social-buttons__item">
                        <a href="<? the_field( 'футер_ютуб', 'option' ) ?>" title="" class="social-buttons__link">
                            <svg width="26" height="26" class="social-buttons__icon">
                                <use xlink:href="<?= path() ?>img/sprite.svg#youtube"></use>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer__nav-box">
			<?php wp_nav_menu( array(
				'menu'       => 'Футер-левое',
				'container'  => null,
				'items_wrap' => '<ul class="footer__nav u-hidden-md-down">%3$s</ul>',
			) ); ?>
			<?php wp_nav_menu( array(
				'menu'       => 'Футер-правое',
				'container'  => null,
				'items_wrap' => '<ul class="footer__nav">%3$s</ul>',
			) ); ?>
        </div>

        <div class="footer__payments">
            <div class="footer__payments__title">Мы принимаем:</div>

            <picture>
                <img src="#"
                     data-srcset="<?= path() ?>img/blocks/footer/payments.png 1x, <?= path() ?>img/blocks/footer/payments@2x.png 2x"
                     width="294" height="67" alt="Мы принимаем: VISA, MasterCard, МИР, Apple Pay, Яндекс Деньги, Qiwi"
                     class="footer__payments__img lazyload">
            </picture>
        </div>
    </div>
</footer><!-- end .footer -->
</div><!-- end .wrapper -->

<? get_search_form() ?>

<div class="popup popup--full popup--mmenu u-hidden-md-up" data-popup-name="mmenu">
    <div class="popup__body">
        <button class="popup__close js-popup-close" type="button" title="Закрыть" aria-label="Закрыть">
            <svg width="20" height="20">
                <use xlink:href="<?= path() ?>img/sprite.svg#cancel"></use>
            </svg>
        </button>
		<?php
		$mobileMenu = wp_nav_menu( array(
			'menu'       => 'Хедер',
			'container'  => null,
			'items_wrap' => '<ul  class="mobile-menu">%3$s</ul>',
			'echo'       => false
		) );
		echo preg_replace( '/nav__link/', 'mobile-menu__link', $mobileMenu );

		?>
    </div>
</div>

<? wp_footer(); ?>

<!-- ========== LEGACY ========== -->
<script>// Outdated browser (IE<11)
    /*@cc_on if (@_jscript_version < 11) {
      var d = document;
      var link = d.createElement( 'link' );

      link.rel = 'stylesheet';
      link.href = 'js/vendor/outdatedbrowser/outdatedbrowser.min.css';
      d.head.appendChild( link );

      d.write( '<div id="outdated" style="opacity:0;position:fixed"><h6>Ваш браузер устарел!</h6>' +
        '<p>Обновите ваш браузер для правильного отображения&nbsp;сайта.' +
        '<a id="btnUpdateBrowser" target="_blank" href="http://outdatedbrowser.com/ru">Обновить мой браузер</a></p>' +
        '<div class="last"><a href="#" id="btnCloseUpdateBrowser" title="Закрыть">&times;</a></div></div>' );

      d.getElementById( 'btnCloseUpdateBrowser' ).addEventListener( 'click', function() {
        d.getElementById( 'outdated' ).style.display = 'none';
      } );
    } @*/
</script>
<!-- ======== END LEGACY ======== -->

<noscript class="noscript-main">
    Для полноценной работы сайта необходимо
    <a href="//yandex.ru/support/common/browsers-settings/browsers-java-js-settings.xml" target="_blank">
        включить Javascript</a>
</noscript>
</body>
</html>