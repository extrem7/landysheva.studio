<?php
get_header(); ?>
<h1 class="section-title"><?= wp_get_document_title() ?></h1>
<?php

if ( have_posts() ) :
	while ( have_posts() ) : the_post();
		?>
	<?
	endwhile;
endif;
?>
<?php get_footer(); ?>
