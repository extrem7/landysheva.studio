<!DOCTYPE html>
<html lang="<? bloginfo( 'language' ) ?>">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="format-detection" content="telephone=no"/>
    <meta name="format-detection" content="address=no"/>
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE"/>
    <!--<meta name="description" lang="ru" content="Place your description here">-->

    <title><?= wp_get_document_title() ?></title>
	<? wp_head() ?>
    <!-- Open Graph protocol -->
    <meta property="og:locale" content="ru_RU"/>
    <meta property="og:site_name" content="ЮЛИЯ ЛАНДЫШЕВА"/>
    <meta property="og:title" content="Главная"/>
    <meta property="og:description" content="Place your description here"/>
    <!-- end Open Graph protocol -->

    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_light.woff2" as="font" type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_light_italic.woff2" as="font"
          type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_regular.woff2" as="font" type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_regular_italic.woff2" as="font"
          type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_semibold.woff2" as="font" type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_semibold_italic.woff2" as="font"
          type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_bold.woff2" as="font" type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_bold_italic.woff2" as="font"
          type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_extrabold.woff2" as="font" type="font/woff2"
          crossorigin>
    <link rel="preload" href="<?= path() ?>fonts/proxima_nova/proxima_nova_extrabold_italic.woff2" as="font"
          type="font/woff2"
          crossorigin>

    <link rel="icon" type="image/png" href="<?= path() ?>favicon.png"/>
    <link rel="icon" type="image/svg+xml" href="<?= path() ?>favicon.svg"/>
    <link rel="mask-icon" color="#880000" href="<?= path() ?>favicon.svg"/>

    <!-- iOS, Android : sizes - 57x57, 114x114, 72x72, 144x144, 60x60, 120x120, 76x76, 152x152-->
    <!--<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">-->

    <link rel="preload" href="js/bundle.min.js" as="script">
    <script>
        /* NO NEED IF ANOTHER SCRIPT TAG EXISTS */
        /* yeah we need this empty stylesheet here. It's cool chrome & chromium fix
         chrome fix https://code.google.com/p/chromium/issues/detail?id=167083
         https://code.google.com/p/chromium/issues/detail?id=332189
         */
    </script>

</head>
<body <? body_class() ?>>
<div class="wrapper">
	<?
	$headerIsDark = is_front_page();
	?>
    <header class="header <?= $headerIsDark ? 'header--dark' : '' ?>">
        <div class="header__top">
            <div class="header__box">
                <div class="header__actions">
                    <button class="header__btn u-hidden-md-up js-popup" data-popup-target="mmenu">
                        <svg width="18" height="18" class="header__btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#menu"></use>
                        </svg>
                    </button>
                    <button class="header__btn u-ml-0-md-up js-popup" data-popup-target="search">
                        <svg width="18" height="18" class="header__btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#search"></use>
                        </svg>
                    </button>
                </div>

                <a href="<? bloginfo( 'url' ) ?>" class="header__logo">
                    <figure class="logo">
                        <svg width="303" height="31" class="logo__img">
                            <use xlink:href="<?= path() ?>img/sprite.svg#logo"></use>
                        </svg>
                    </figure>
                </a>

                <div class="header__actions">
                    <a href="<?= get_permalink( wc_get_page_id( 'myaccount' ) ); ?>" title="myaccount"
                       class="header__btn">
                        <svg width="18" height="18" class="header__btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#account"></use>
                        </svg>
                    </a>
                    <a href="<?= get_permalink( wc_get_page_id( 'cart' ) ); ?>" title="cart" class="header__btn">
                        <svg width="18" height="18" class="header__btn__icon">
                            <use xlink:href="<?= path() ?>img/sprite.svg#bag"></use>
                        </svg>
                        <div class="header__btn__count"><?= WC()->cart->get_cart_contents_count() ?></div>
                    </a>
                </div>
            </div>

            <picture>
                <img src="#"
                     srcset="<?= path() ?>img/blocks/header/bg.jpg 1x, <?= path() ?>img/blocks/header/bg@2x.jpg 2x"
                     alt=""
                     role="presentation" class="header__bg">
            </picture>
        </div><!-- end .header__top -->

        <div class="header__bottom u-hidden-sm-down">
            <nav class="container">
				<?php wp_nav_menu( array(
					'menu'       => 'Хедер',
					'container'  => null,
					'items_wrap' => '<ul  class="nav">%3$s</ul>',
				) ); ?>
            </nav>
        </div>
    </header><!-- end .header -->

    <main class="main">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-lg-10 offset-lg-1">
					<?
					if ( ! is_cart() ) {
						wc_print_notices();
					}
					?>
                </div>
            </div>