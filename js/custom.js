let blogOffset = 3,
    productOffset = 12;

function cartCounter() {
    const $update = $("button[name='update_cart']");
    $update.removeAttr('disabled');
    $update.trigger("click");
    $(document.body).on('updated_wc_div', function () {
        var toConsumableArray = function (arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

                return arr2;
            } else {
                return Array.from(arr);
            }
        };
        var elems = document.querySelectorAll('.js-spin');
        var defaults$2 = {
            min: 1,
            max: 99,
            upClassName: 'spin__up',
            downClassName: 'spin__down'
        };
        var KEY_ARROW_UP = 38;
        var KEY_ARROW_DOWN = 40;
        var CHANGE_EVENT = new CustomEvent('change');

        [].concat(toConsumableArray(elems)).forEach(function (el) {
            var input = el.querySelector('input');

            if (input !== null) {
                createSpin(el, input);
            }
        });

        function createSpin(el, input) {
            var min = +el.getAttribute('data-spin-min') || defaults$2.min;
            var max = +el.getAttribute('data-spin-max') || defaults$2.max;
            var upBtn = document.createElement('button');
            var downBtn = document.createElement('button');

            var value = +input.value || min;

            // up button
            upBtn.setAttribute('type', 'button');
            upBtn.setAttribute('class', defaults$2.upClassName);

            // down button
            downBtn.setAttribute('type', 'button');
            downBtn.setAttribute('class', defaults$2.downClassName);

            el.appendChild(upBtn);
            el.appendChild(downBtn);

            input.addEventListener('keyup', changeValue, false);

            upBtn.addEventListener('click', add, false);
            downBtn.addEventListener('click', subtract, false);

            function checkValue(newValue) {
                var val = newValue || min;

                val = val > max ? max : val;
                val = val < min ? min : val;

                input.value = value = val;

                input.dispatchEvent(CHANGE_EVENT);
            }

            function changeValue(e) {
                var code = e.keyCode ? e.keyCode : e.which;

                if (code === KEY_ARROW_UP) {
                    add();
                } else if (code === KEY_ARROW_DOWN) {
                    subtract();
                } else {
                    checkValue(+input.value);
                }
            }

            function add() {
                checkValue(++value);
            }

            function subtract() {
                checkValue(--value);
            }
        }

        $('.cart__total .woocommerce-Price-amount').text($('.cart-collaterals .cart-subtotal .woocommerce-Price-amount').text());
    });
}

function checkoutPrice() {
    $(document.body).on("updated_checkout", () => {
        $('.checkout__total .woocommerce-Price-amount').text($('.order-total .woocommerce-Price-amount').text());
    });
}

function ajaxBlog() {
    $('.blog-ajax-load').click(function (e) {
        e.preventDefault();
        let data = {blog_ajax: 1, offset: blogOffset};
        jQuery.ajax({
            url: "",
            method: 'POST',
            data: data,
            success: function (result) {
                blogOffset += 3;
                if ($($(result)[1]).text() === 'true') {
                    $('.blog-ajax-load').fadeOut();
                }
                jQuery(".blog-list").animate({opacity: 0}, 500, function () {
                    jQuery(".blog-list").append(result)
                    jQuery(".blog-list").animate({opacity: 1}, 500);
                });
            }
        });
    });
}

function ajaxProducts() {
    $('#main-catalog .catalog__actions .btn').click(function (e) {
        e.preventDefault();
        let data = {products_ajax: 1, offset: productOffset};
        // jQuery('#main-catalog .catalog__actions').fadeOut();
        jQuery.ajax({
            url: "",
            type: 'POST',
            data: data,
            success: function (result) {
                let offsetResult = $(result).last();
                console.log(offsetResult.text());
                if (offsetResult.hasClass('overflow-blog')) {
                    if (offsetResult.text() === 'true') {
                        $('#main-catalog .btn').fadeOut();
                    } else {
                        $('#main-catalog .btn').text(`Показать ещё ${offsetResult.text()}`)
                    }
                }
                productOffset += 12;
                jQuery("#main-catalog .catalog__list").animate({opacity: 0}, 500, function () {
                    jQuery("#main-catalog .catalog__list").append(result);
                    jQuery("#main-catalog .catalog__list").animate({opacity: 1}, 500);
                });
            }
        });
    });
}

function singlePhotos() {
    let height = $('.product__images__img-box:nth-of-type(2)').height();
    if ($('.product__images__img-box:nth-of-type(1) img').height() > height) {
        $('.product__images__img-box:nth-of-type(1)').height(height * .9);
    }
    if ($('.product__images__img-box:nth-of-type(3) img').height() > height) {
        $('.product__images__img-box:nth-of-type(3)').height(height * .9);
    }
}

$(function () {
    $('body').on('click', '.js-spin button', function () {
        cartCounter();
    });
    $('body').on('change', '.js-spin input', function () {
        cartCounter();
    });
    checkoutPrice();
    ajaxBlog();
    ajaxProducts();
});

$(window).ready(function () {
    singlePhotos();
});