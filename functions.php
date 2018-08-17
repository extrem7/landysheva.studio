<?php

require_once 'includes/woocommerce_setup.php';
require_once 'includes/speed_up.php';

//wp setup
add_theme_support( 'post-thumbnails' );
add_theme_support( 'menus' );
add_theme_support( 'widgets' );
show_admin_bar( false );

//header menu classes
add_filter( 'nav_menu_link_attributes', 'filter_nav_menu_link_attributes', 10, 4 );
function filter_nav_menu_link_attributes( $atts, $item, $args, $depth ) {

	if ( $args->menu === 'Хедер' ) {
		$atts['class'] = 'nav__link';
		if ( $item->current ) {
			$atts['class'] .= ' nav__link';
		}
	}

	if ( $args->menu === 'Футер-левое' || $args->menu === 'Футер-правое' ) {
		$atts['class'] = 'footer__nav__link';
	}

	return $atts;
}

add_filter( 'nav_menu_css_class', 'filter_nav_menu_css_classes', 10, 4 );
function filter_nav_menu_css_classes( $classes, $item, $args, $depth ) {
	if ( $args->menu === 'Хедер' ) {
		$classes = [
			'nav__item',
			'menu-node--main_lvl_' . ( $depth + 1 )
		];
		if ( $item->current ) {
			$classes[] = 'menu-node--active';
		}
	}

	if ( $args->menu === 'Футер-левое' || $args->menu === 'Футер-правое' ) {
		$classes = array_merge( $classes, [
			'footer__nav__item',
			'menu-node--main_lvl_' . ( $depth + 1 )
		] );
		if ( $item->current ) {
			$classes[] = 'menu-node--active';
		}
	}

	return $classes;
}

//register css|js
function registerThemeStyles() {
	wp_register_style( 'main', get_template_directory_uri() . '/css/style.min.css' );
	wp_enqueue_style( 'main' );
	wp_register_style( 'custom', get_template_directory_uri() . '/css/custom.css' );
	wp_enqueue_style( 'custom' );
}

add_action( 'wp_print_styles', 'registerThemeStyles' );
function registerThemeJs() {
	wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js' );
	wp_enqueue_script( 'jquery' );
	/*wp_register_script( 'popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js' );
	wp_enqueue_script( 'popper' );
	wp_register_script( 'bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js' );
	wp_enqueue_script( 'bootstrap' );*/
	wp_register_script( 'swiper', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.1/js/swiper.min.js' );
	wp_enqueue_script( 'swiper' );
	wp_register_script( 'main', get_template_directory_uri() . '/js/bundle.js' );
	wp_enqueue_script( 'main' );
	wp_register_script( 'custom', get_template_directory_uri() . '/js/custom.js' );
	wp_enqueue_script( 'custom' );
}

add_action( 'wp_enqueue_scripts', 'registerThemeJs' );
// remove admin-menu links
function remove_menus() {
	//remove_menu_page( 'edit-comments.php' );
}

add_action( 'admin_menu', 'remove_menus' );

//cool functions for development
function path() {
	return get_template_directory_uri() . '/';
}

function phoneLink( $phone ) {
	return 'tel:' . preg_replace( '/[^0-9]/', '', $phone );
}

function the_image( $name, $id ) {
	echo 'src="' . get_field( $name, $id )['url'] . '" ';
	echo 'alt="' . get_field( $name, $id )['alt'] . '" ';
}

function the_checkbox( $field, $print, $post = null ) {
	if ( $post == null ) {
		global $post;
	}
	echo get_field( $field, $post ) ? $print : null;
}

function the_table( $field, $post = null ) {
	if ( $post == null ) {
		global $post;
	}
	$table = get_field( $field, $post );
	if ( $table ) {
		echo '<table>';
		if ( $table['header'] ) {
			echo '<thead>';
			echo '<tr>';
			foreach ( $table['header'] as $th ) {
				echo '<th>';
				echo $th['c'];
				echo '</th>';
			}
			echo '</tr>';
			echo '</thead>';
		}
		echo '<tbody>';
		foreach ( $table['body'] as $tr ) {
			echo '<tr>';
			foreach ( $tr as $td ) {
				echo '<td>';
				echo $td['c'];
				echo '</td>';
			}
			echo '</tr>';
		}
		echo '</tbody>';
		echo '</table>';
	}
}

function the_link( $field, $post = null, $classes = "" ) {
	if ( $post == null ) {
		global $post;
	}
	$link = get_field( $field, $post );
	if ( $link ) {
		echo "<a ";
		echo "href='{$link['url']}'";
		echo "class='$classes'";
		echo "target='{$link['target']}'>";
		echo $link['title'];
		echo "</a>";
	}
}

function repeater_image( $name ) {
	echo 'src="' . get_sub_field( $name )['url'] . '" ';
	echo 'alt="' . get_sub_field( $name )['alt'] . '" ';
}

function pre( $array ) {
	echo "<pre>";
	print_r( $array );
	echo "</pre>";
}

//options page
if ( function_exists( 'acf_add_options_page' ) ) {
	$main = acf_add_options_page( [
		'page_title' => 'Настройки темы',
		'menu_title' => 'Настройки темы',
		'menu_slug'  => 'theme-general-settings',
		'capability' => 'edit_posts',
		'redirect'   => false,
		'position'   => 2,
		'icon_url'   => 'dashicons-admin-customizer',
	] );
}

add_filter( 'wpcf7_autop_or_not', '__return_false' );


function register_my_widgets() {
	register_sidebar( array(
		'name'         => "Правая боковая панель сайта",
		'id'           => 'right-sidebar',
		'description'  => 'Эти виджеты будут показаны в правой колонке сайта',
		'before_title' => '<h1>',
		'after_title'  => '</h1>'
	) );
}

add_action( 'widgets_init', 'register_my_widgets' );

function blog_ajax_loop( $query ) {
	if ( isset( $_POST['blog_ajax'] ) && $_POST['blog_ajax'] == 1 ) {
		if ( isset( $_POST['offset'] ) ) {
			$query->set( 'posts_per_page', '3' );
			if ( isset( $_POST['offset'] ) ) {
				$query->set( 'offset', $_POST['offset'] );
			}
		}
	}
}

add_action( 'pre_get_posts', 'blog_ajax_loop' );

