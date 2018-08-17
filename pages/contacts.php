<?
/* Template Name: Контакты */
get_header(); ?>
    <!-- START .contacts -->
    <div class="contacts">
        <h1 class="title"><? the_title() ?></h1>
		<? $map = get_field( 'карта' ) ?>
        <div id="map" class="contacts__map" data-coord="<?= $map['координаты'] ?>"
             data-zoom="<?= $map['приближение'] ?>"></div>
        <ul class="contacts__list">
            <li class="contacts__item icon-phone">
                <div class="contacts__title">Телефон:</div>
				<? the_field( 'телефоны' ) ?>
            </li>

            <li class="contacts__item icon-email">
                <div class="contacts__title">E-Mail:</div>
				<? the_field( 'почта' ) ?>
            </li>

            <li class="contacts__item icon-location">
                <div class="contacts__title">Адрес:</div>
				<? the_field( 'адрес' ) ?>
            </li>
        </ul>
		<?= do_shortcode( '[contact-form-7 id="126" title="Форма обратной связи" html_class="contacts__form form"]' ) ?>
    </div>
    <!-- END .contacts -->
<? get_footer() ?>