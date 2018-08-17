<?php


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$options = get_field( 'характеристики' );

if ( ! empty( $options ) ):
	if ( count( $options ) !== 1 ) {
		$options = array_chunk( $options, ceil(count( $options ) / 2) );
	} else {
		$options = [ [ $options[0] ] ];
	}
	?>
    <h2 class="title">Характеристики</h2>

    <div class="row">
		<?
		foreach ( $options as $column ):
			?>
            <div class="col-xs-12 col-md-6">
                <ul class="product__specs product__specs--1">
					<? foreach ( $column as $option ): ?>
                        <li class="product__specs__item"><?= $option['поле'] ?>
                            <b><?= $option['значение'] ?></b>
                        </li>
					<? endforeach; ?>
                </ul>
            </div>
		<? endforeach; ?>
    </div>
<? endif; ?>

