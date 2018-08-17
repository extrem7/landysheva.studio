(function () {
    'use strict';

    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(),
                viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for ( // clone the target
                var clone = target.cloneNode(!0); clone.childNodes.length;) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }

    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function () {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), xhr._embeds.splice(0).map(function (item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), embed(item.parent, item.svg, target);
                });
            }
        }, xhr.onreadystatechange();
    }

    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for ( // get the cached <use> index
                var index = 0; index < uses.length;) {
                // get the current <use>
                var use = uses[index],
                    parent = use.parentNode,
                    svg = getSVGAncestor(parent),
                    src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"),
                                url = srcSplit.shift(),
                                id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), xhr._embeds = []), xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }

        var polyfill,
            opts = Object(rawopts),
            newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
            webkitUA = /\bAppleWebKit\/(\d+)\b/,
            olderEdgeUA = /\bEdge\/12\.(\d+)\b/,
            edgeUA = /\bEdge\/.(\d+)\b/,
            inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {},
            requestAnimationFrame = window.requestAnimationFrame || setTimeout,
            uses = document.getElementsByTagName("use"),
            numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }

    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode);) {
        }
        return svg;
    }

// Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

    try {
        var ce = new window.CustomEvent('test');
        ce.preventDefault();
        if (ce.defaultPrevented !== true) {
            // IE has problems with .preventDefault() on custom events
            // http://stackoverflow.com/questions/23349191
            throw new Error('Could not prevent default');
        }
    } catch (e) {
        var CustomEvent$1 = function CustomEvent(event, params) {
            var evt, origPrevent;
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };

            evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            origPrevent = evt.preventDefault;
            evt.preventDefault = function () {
                origPrevent.call(this);
                try {
                    Object.defineProperty(this, 'defaultPrevented', {
                        get: function get() {
                            return true;
                        }
                    });
                } catch (e) {
                    this.defaultPrevented = true;
                }
            };
            return evt;
        };

        CustomEvent$1.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent$1; // expose definition to window
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var defineProperty = function (obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    };

    var toConsumableArray = function (arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        } else {
            return Array.from(arr);
        }
    };

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
        return value != null && (type == 'object' || type == 'function');
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = function now() {
        return root.Date.now();
    };

    /** Built-in value references. */
    var _Symbol = root.Symbol;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
            tag = value[symToStringTag];

        try {
            value[symToStringTag] = undefined;
            var unmasked = true;
        } catch (e) {
        }

        var result = nativeObjectToString.call(value);
        if (unmasked) {
            if (isOwn) {
                value[symToStringTag] = tag;
            } else {
                delete value[symToStringTag];
            }
        }
        return result;
    }

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
        return nativeObjectToString$1.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
        if (value == null) {
            return value === undefined ? undefinedTag : nullTag;
        }
        value = Object(value);
        return symToStringTag$1 && symToStringTag$1 in value ? getRawTag(value) : objectToString(value);
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
        return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
    }

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
        if (typeof value == 'number') {
            return value;
        }
        if (isSymbol(value)) {
            return NAN;
        }
        if (isObject(value)) {
            var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
            value = isObject(other) ? other + '' : other;
        }
        if (typeof value != 'string') {
            return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, '');
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
        var lastArgs,
            lastThis,
            maxWait,
            result,
            timerId,
            lastCallTime,
            lastInvokeTime = 0,
            leading = false,
            maxing = false,
            trailing = true;

        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
            leading = !!options.leading;
            maxing = 'maxWait' in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }

        function invokeFunc(time) {
            var args = lastArgs,
                thisArg = lastThis;

            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
        }

        function leadingEdge(time) {
            // Reset any `maxWait` timer.
            lastInvokeTime = time;
            // Start the timer for the trailing edge.
            timerId = setTimeout(timerExpired, wait);
            // Invoke the leading edge.
            return leading ? invokeFunc(time) : result;
        }

        function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime,
                result = wait - timeSinceLastCall;

            return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
        }

        function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime;

            // Either this is the first call, activity has stopped and we're at the
            // trailing edge, the system time has gone backwards and we're treating
            // it as the trailing edge, or we've hit the `maxWait` limit.
            return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }

        function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }
            // Restart the timer.
            timerId = setTimeout(timerExpired, remainingWait(time));
        }

        function trailingEdge(time) {
            timerId = undefined;

            // Only invoke if we have `lastArgs` which means `func` has been
            // debounced at least once.
            if (trailing && lastArgs) {
                return invokeFunc(time);
            }
            lastArgs = lastThis = undefined;
            return result;
        }

        function cancel() {
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined;
        }

        function flush() {
            return timerId === undefined ? result : trailingEdge(now());
        }

        function debounced() {
            var time = now(),
                isInvoking = shouldInvoke(time);

            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;

            if (isInvoking) {
                if (timerId === undefined) {
                    return leadingEdge(lastCallTime);
                }
                if (maxing) {
                    // Handle invocations in a tight loop.
                    timerId = setTimeout(timerExpired, wait);
                    return invokeFunc(lastCallTime);
                }
            }
            if (timerId === undefined) {
                timerId = setTimeout(timerExpired, wait);
            }
            return result;
        }

        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
    }

    /** Error message constants. */
    var FUNC_ERROR_TEXT$1 = 'Expected a function';

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
        var leading = true,
            trailing = true;

        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT$1);
        }
        if (isObject(options)) {
            leading = 'leading' in options ? !!options.leading : leading;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
            'leading': leading,
            'maxWait': wait,
            'trailing': trailing
        });
    }

    if (!Array.from) {
        Array.from = function () {
            var toStr = Object.prototype.toString;
            var isCallable = function isCallable(fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function toInteger(value) {
                var number = Number(value);
                if (isNaN(number)) {
                    return 0;
                }
                if (number === 0 || !isFinite(number)) {
                    return number;
                }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function toLength(value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // Свойство length метода from равно 1.
            return function from(arrayLike /*, mapFn, thisArg */) {
                // 1. Положим C равным значению this.
                var C = this;

                // 2. Положим items равным ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }

                // 4. Если mapfn равен undefined, положим mapping равным false.
                var mapFn = arguments[1];
                if (typeof mapFn !== 'undefined') {
                    mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                    // 5. иначе
                    // 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Положим lenValue равным Get(items, "length").
                // 11. Положим len равным ToLength(lenValue).
                var len = toLength(items.length);

                // 13. Если IsConstructor(C) равен true, то
                // 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
                //     объекта C со списком аргументов, содержащим единственный элемент len.
                // 14. a. Иначе, положим A равным ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Положим k равным 0.
                var k = 0;
                // 17. Пока k < len, будем повторять... (шаги с a по h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Положим putStatus равным Put(A, "length", len, true).
                A.length = len;
                // 20. Вернём A.
                return A;
            };
        }();
    }

    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var hasSupportWebp = canvas.toDataURL && canvas.toDataURL('image/webp').indexOf('image/webp') === 5;

    var els = document.querySelectorAll('[data-bg]:not(.lazyload)');

    [].concat(toConsumableArray(els)).forEach(function (el) {
        var target = el.getAttribute('data-bg');
        var src = el.getAttribute('data-src') || el.src || target;
        var ext = el.getAttribute('data-webp-alt') || 'jpg';
        var arr = src.split(',');
        var bgi = '';

        if (target === 'parent') {
            el.setAttribute('hidden', true);
            el = el.parentNode;
        }

        // concatenation multiple backgrounds
        arr.forEach(function (src2, i) {
            if (i > 0) {
                bgi += ',';
            }

            if (!hasSupportWebp) {
                src2 = src2.replace(/\.webp/g, '.' + ext);
            }

            bgi += 'url(' + src2.trim() + ')';
        });

        el.style.backgroundImage = bgi;
    });

    (function (window, factory) {
        var globalInstall = function globalInstall(initialEvent) {
            factory(window.lazySizes, initialEvent);
            window.removeEventListener('lazyunveilread', globalInstall, true);
        };

        factory = factory.bind(null, window, window.document);

        if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
            factory(require('lazysizes'));
        } else if (window.lazySizes) {
            globalInstall();
        } else {
            window.addEventListener('lazyunveilread', globalInstall, true);
        }
    })(window, function (window, document, lazySizes, initialEvent) {

        var style = document.createElement('a').style;
        var fitSupport = 'objectFit' in style;
        var positionSupport = fitSupport && 'objectPosition' in style;
        var regCssFit = /object-fit["']*\s*:\s*["']*(contain|cover)/;
        var regCssPosition = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/;
        var blankSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        var regBgUrlEscape = /\(|\)|'/;
        var positionDefaults = {
            center: 'center',
            '50% 50%': 'center'
        };

        function getObject(element) {
            var css = getComputedStyle(element, null) || {};
            var content = css.fontFamily || '';
            var objectFit = content.match(regCssFit) || '';
            var objectPosition = objectFit && content.match(regCssPosition) || '';

            if (objectPosition) {
                objectPosition = objectPosition[1];
            }

            return {
                fit: objectFit && objectFit[1] || '',
                position: positionDefaults[objectPosition] || objectPosition || 'center'
            };
        }

        function initFix(element, config) {
            var switchClassesAdded;
            var lazysizesCfg = lazySizes.cfg;
            var styleElement = element.cloneNode(false);
            var styleElementStyle = styleElement.style;

            var onChange = function onChange() {
                var src = element.currentSrc || element.src;

                if (src) {
                    styleElementStyle.backgroundImage = 'url(' + (regBgUrlEscape.test(src) ? JSON.stringify(src) : src) + ')';

                    if (!switchClassesAdded) {
                        switchClassesAdded = true;
                        lazySizes.rC(styleElement, lazysizesCfg.loadingClass);
                        lazySizes.aC(styleElement, lazysizesCfg.loadedClass);
                    }
                }
            };

            element._lazysizesParentFit = config.fit;

            element.addEventListener('load', function () {
                lazySizes.rAF(onChange);
            }, true);

            styleElement.addEventListener('load', function () {
                var curSrc = styleElement.currentSrc || styleElement.src;

                if (curSrc && curSrc != blankSrc) {
                    styleElement.src = blankSrc;
                    styleElement.srcset = '';
                }
            });

            lazySizes.rAF(function () {

                var hideElement = element;
                var container = element.parentNode;

                if (container.nodeName.toUpperCase() == 'PICTURE') {
                    hideElement = container;
                    container = container.parentNode;
                }

                lazySizes.rC(styleElement, lazysizesCfg.loadedClass);
                lazySizes.rC(styleElement, lazysizesCfg.lazyClass);
                lazySizes.aC(styleElement, lazysizesCfg.loadingClass);
                lazySizes.aC(styleElement, lazysizesCfg.objectFitClass || 'lazysizes-display-clone');

                if (styleElement.getAttribute(lazysizesCfg.srcsetAttr)) {
                    styleElement.setAttribute(lazysizesCfg.srcsetAttr, '');
                }

                if (styleElement.getAttribute(lazysizesCfg.srcAttr)) {
                    styleElement.setAttribute(lazysizesCfg.srcAttr, '');
                }

                styleElement.src = blankSrc;
                styleElement.srcset = '';

                styleElementStyle.backgroundRepeat = 'no-repeat';
                styleElementStyle.backgroundPosition = config.position;
                styleElementStyle.backgroundSize = config.fit;

                hideElement.style.display = 'none';

                element.setAttribute('data-parent-fit', config.fit);
                element.setAttribute('data-parent-container', 'prev');

                container.insertBefore(styleElement, hideElement);

                if (element._lazysizesParentFit) {
                    delete element._lazysizesParentFit;
                }

                if (element.complete) {
                    onChange();
                }
            });
        }

        if (!fitSupport || !positionSupport) {
            var onRead = function onRead(e) {
                if (e.detail.instance != lazySizes) {
                    return;
                }

                var element = e.target;
                var obj = getObject(element);

                if (obj.fit && (!fitSupport || obj.position != 'center')) {
                    initFix(element, obj);
                }
            };

            window.addEventListener('lazyunveilread', onRead, true);

            if (initialEvent && initialEvent.detail) {
                onRead(initialEvent);
            }
        }
    });

    /*
This plugin extends lazySizes to lazyLoad:
background images, videos/posters and scripts

Background-Image:
For background images, use data-bg attribute:
<div class="lazyload" data-bg="bg-img.jpg"></div>

 Video:
 For video/audio use data-poster and preload="none":
 <video class="lazyload" data-poster="poster.jpg" preload="none">
 <!-- sources -->
 </video>

 Scripts:
 For scripts use data-script:
 <div class="lazyload" data-script="module-name.js"></div>


 Script modules using require:
 For modules using require use data-require:
 <div class="lazyload" data-require="module-name"></div>
*/

    (function (window, factory) {
        var globalInstall = function globalInstall() {
            factory(window.lazySizes);
            window.removeEventListener('lazyunveilread', globalInstall, true);
        };

        factory = factory.bind(null, window, window.document);

        if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
            factory(require('lazysizes'));
        } else if (window.lazySizes) {
            globalInstall();
        } else {
            window.addEventListener('lazyunveilread', globalInstall, true);
        }
    })(window, function (window, document, lazySizes) {

        var bgLoad, regBgUrlEscape;
        var uniqueUrls = {};

        if (document.addEventListener) {
            regBgUrlEscape = /\(|\)|\s|'/;

            bgLoad = function bgLoad(url, cb) {
                var img = document.createElement('img');
                img.onload = function () {
                    img.onload = null;
                    img.onerror = null;
                    img = null;
                    cb();
                };
                img.onerror = img.onload;

                img.src = url;

                if (img && img.complete && img.onload) {
                    img.onload();
                }
            };

            addEventListener('lazybeforeunveil', function (e) {
                if (e.detail.instance != lazySizes) {
                    return;
                }

                var tmp, load, bg, poster;
                if (!e.defaultPrevented) {

                    if (e.target.preload == 'none') {
                        e.target.preload = 'auto';
                    }

                    tmp = e.target.getAttribute('data-link');
                    if (tmp) {
                        addStyleScript(tmp, true);
                    }

                    // handle data-script
                    tmp = e.target.getAttribute('data-script');
                    if (tmp) {
                        addStyleScript(tmp);
                    }

                    // handle data-require
                    tmp = e.target.getAttribute('data-require');
                    if (tmp) {
                        if (lazySizes.cfg.requireJs) {
                            lazySizes.cfg.requireJs([tmp]);
                        } else {
                            addStyleScript(tmp);
                        }
                    }

                    // handle data-bg
                    bg = e.target.getAttribute('data-bg');
                    if (bg) {
                        e.detail.firesLoad = true;
                        load = function load() {
                            e.target.style.backgroundImage = 'url(' + (regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg) + ')';
                            e.detail.firesLoad = false;
                            lazySizes.fire(e.target, '_lazyloaded', {}, true, true);
                        };

                        bgLoad(bg, load);
                    }

                    // handle data-poster
                    poster = e.target.getAttribute('data-poster');
                    if (poster) {
                        e.detail.firesLoad = true;
                        load = function load() {
                            e.target.poster = poster;
                            e.detail.firesLoad = false;
                            lazySizes.fire(e.target, '_lazyloaded', {}, true, true);
                        };

                        bgLoad(poster, load);
                    }
                }
            }, false);
        }

        function addStyleScript(src, style) {
            if (uniqueUrls[src]) {
                return;
            }
            var elem = document.createElement(style ? 'link' : 'script');
            var insertElem = document.getElementsByTagName('script')[0];

            if (style) {
                elem.rel = 'stylesheet';
                elem.href = src;
            } else {
                elem.src = src;
            }
            uniqueUrls[src] = true;
            uniqueUrls[elem.src || elem.href] = true;
            insertElem.parentNode.insertBefore(elem, insertElem);
        }
    });

    (function (window, factory) {
        var lazySizes = factory(window, window.document);
        window.lazySizes = lazySizes;
        if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
            module.exports = lazySizes;
        }
    })(window, function l(window, document) {
        /*jshint eqnull:true */

        if (!document.getElementsByClassName) {
            return;
        }

        var lazySizesConfig;

        var docElem = document.documentElement;

        var Date = window.Date;

        var supportPicture = window.HTMLPictureElement;

        var _addEventListener = 'addEventListener';

        var _getAttribute = 'getAttribute';

        var addEventListener = window[_addEventListener];

        var setTimeout = window.setTimeout;

        var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

        var requestIdleCallback = window.requestIdleCallback;

        var regPicture = /^picture$/i;

        var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

        var regClassCache = {};

        var forEach = Array.prototype.forEach;

        var hasClass = function hasClass(ele, cls) {
            if (!regClassCache[cls]) {
                regClassCache[cls] = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            }
            return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
        };

        var addClass = function addClass(ele, cls) {
            if (!hasClass(ele, cls)) {
                ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
            }
        };

        var removeClass = function removeClass(ele, cls) {
            var reg;
            if (reg = hasClass(ele, cls)) {
                ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
            }
        };

        var addRemoveLoadEvents = function addRemoveLoadEvents(dom, fn, add) {
            var action = add ? _addEventListener : 'removeEventListener';
            if (add) {
                addRemoveLoadEvents(dom, fn);
            }
            loadEvents.forEach(function (evt) {
                dom[action](evt, fn);
            });
        };

        var triggerEvent = function triggerEvent(elem, name, detail, noBubbles, noCancelable) {
            var event = document.createEvent('CustomEvent');

            event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

            elem.dispatchEvent(event);
            return event;
        };

        var updatePolyfill = function updatePolyfill(el, full) {
            var polyfill;
            if (!supportPicture && (polyfill = window.picturefill || lazySizesConfig.pf)) {
                polyfill({reevaluate: true, elements: [el]});
            } else if (full && full.src) {
                el.src = full.src;
            }
        };

        var getCSS = function getCSS(elem, style) {
            return (getComputedStyle(elem, null) || {})[style];
        };

        var getWidth = function getWidth(elem, parent, width) {
            width = width || elem.offsetWidth;

            while (width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth) {
                width = parent.offsetWidth;
                parent = parent.parentNode;
            }

            return width;
        };

        var rAF = function () {
            var running, waiting;
            var firstFns = [];
            var secondFns = [];
            var fns = firstFns;

            var run = function run() {
                var runFns = fns;

                fns = firstFns.length ? secondFns : firstFns;

                running = true;
                waiting = false;

                while (runFns.length) {
                    runFns.shift()();
                }

                running = false;
            };

            var rafBatch = function rafBatch(fn, queue) {
                if (running && !queue) {
                    fn.apply(this, arguments);
                } else {
                    fns.push(fn);

                    if (!waiting) {
                        waiting = true;
                        (document.hidden ? setTimeout : requestAnimationFrame)(run);
                    }
                }
            };

            rafBatch._lsFlush = run;

            return rafBatch;
        }();

        var rAFIt = function rAFIt(fn, simple) {
            return simple ? function () {
                rAF(fn);
            } : function () {
                var that = this;
                var args = arguments;
                rAF(function () {
                    fn.apply(that, args);
                });
            };
        };

        var throttle = function throttle(fn) {
            var running;
            var lastTime = 0;
            var gDelay = 125;
            var RIC_DEFAULT_TIMEOUT = 666;
            var rICTimeout = RIC_DEFAULT_TIMEOUT;
            var run = function run() {
                running = false;
                lastTime = Date.now();
                fn();
            };
            var idleCallback = requestIdleCallback ? function () {
                requestIdleCallback(run, {timeout: rICTimeout});
                if (rICTimeout !== RIC_DEFAULT_TIMEOUT) {
                    rICTimeout = RIC_DEFAULT_TIMEOUT;
                }
            } : rAFIt(function () {
                setTimeout(run);
            }, true);

            return function (isPriority) {
                var delay;
                if (isPriority = isPriority === true) {
                    rICTimeout = 44;
                }

                if (running) {
                    return;
                }

                running = true;

                delay = gDelay - (Date.now() - lastTime);

                if (delay < 0) {
                    delay = 0;
                }

                if (isPriority || delay < 9 && requestIdleCallback) {
                    idleCallback();
                } else {
                    setTimeout(idleCallback, delay);
                }
            };
        };

        //based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
        var debounce = function debounce(func) {
            var timeout, timestamp;
            var wait = 99;
            var run = function run() {
                timeout = null;
                func();
            };
            var later = function later() {
                var last = Date.now() - timestamp;

                if (last < wait) {
                    setTimeout(later, wait - last);
                } else {
                    (requestIdleCallback || run)(run);
                }
            };

            return function () {
                timestamp = Date.now();

                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
            };
        };

        var loader = function () {
            var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

            var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

            var defaultExpand, preloadExpand, hFac;

            var regImg = /^img$/i;
            var regIframe = /^iframe$/i;

            var supportScroll = 'onscroll' in window && !/glebot/.test(navigator.userAgent);

            var shrinkExpand = 0;
            var currentExpand = 0;

            var isLoading = 0;
            var lowRuns = -1;

            var resetPreloading = function resetPreloading(e) {
                isLoading--;
                if (e && e.target) {
                    addRemoveLoadEvents(e.target, resetPreloading);
                }

                if (!e || isLoading < 0 || !e.target) {
                    isLoading = 0;
                }
            };

            var isNestedVisible = function isNestedVisible(elem, elemExpand) {
                var outerRect;
                var parent = elem;
                var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

                eLtop -= elemExpand;
                eLbottom += elemExpand;
                eLleft -= elemExpand;
                eLright += elemExpand;

                while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
                    visible = (getCSS(parent, 'opacity') || 1) > 0;

                    if (visible && getCSS(parent, 'overflow') != 'visible') {
                        outerRect = parent.getBoundingClientRect();
                        visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
                    }
                }

                return visible;
            };

            var checkElements = function checkElements() {
                var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal,
                    beforeExpandVal;

                if ((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {

                    i = 0;

                    lowRuns++;

                    if (preloadExpand == null) {
                        if (!('expand' in lazySizesConfig)) {
                            lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
                        }

                        defaultExpand = lazySizesConfig.expand;
                        preloadExpand = defaultExpand * lazySizesConfig.expFactor;
                    }

                    if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
                        currentExpand = preloadExpand;
                        lowRuns = 0;
                    } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) {
                        currentExpand = defaultExpand;
                    } else {
                        currentExpand = shrinkExpand;
                    }

                    for (; i < eLlen; i++) {

                        if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) {
                            continue;
                        }

                        if (!supportScroll) {
                            unveilElement(lazyloadElems[i]);
                            continue;
                        }

                        if (!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)) {
                            elemExpand = currentExpand;
                        }

                        if (beforeExpandVal !== elemExpand) {
                            eLvW = innerWidth + elemExpand * hFac;
                            elvH = innerHeight + elemExpand;
                            elemNegativeExpand = elemExpand * -1;
                            beforeExpandVal = elemExpand;
                        }

                        rect = lazyloadElems[i].getBoundingClientRect();

                        if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
                            unveilElement(lazyloadElems[i]);
                            loadedSomething = true;
                            if (isLoading > 9) {
                                break;
                            }
                        } else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesConfig.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto'))) {
                            autoLoadElem = preloadElems[0] || lazyloadElems[i];
                        }
                    }

                    if (autoLoadElem && !loadedSomething) {
                        unveilElement(autoLoadElem);
                    }
                }
            };

            var throttledCheckElements = throttle(checkElements);

            var switchLoadingClass = function switchLoadingClass(e) {
                addClass(e.target, lazySizesConfig.loadedClass);
                removeClass(e.target, lazySizesConfig.loadingClass);
                addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
            };
            var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
            var rafSwitchLoadingClass = function rafSwitchLoadingClass(e) {
                rafedSwitchLoadingClass({target: e.target});
            };

            var changeIframeSrc = function changeIframeSrc(elem, src) {
                try {
                    elem.contentWindow.location.replace(src);
                } catch (e) {
                    elem.src = src;
                }
            };

            var handleSources = function handleSources(source) {
                var customMedia, parent;

                var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

                if (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) {
                    source.setAttribute('media', customMedia);
                }

                if (sourceSrcset) {
                    source.setAttribute('srcset', sourceSrcset);
                }

                //https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
                if (customMedia) {
                    parent = source.parentNode;
                    parent.insertBefore(source.cloneNode(), source);
                    parent.removeChild(source);
                }
            };

            var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg) {
                var src, srcset, parent, isPicture, event, firesLoad;

                if (!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented) {

                    if (sizes) {
                        if (isAuto) {
                            addClass(elem, lazySizesConfig.autosizesClass);
                        } else {
                            elem.setAttribute('sizes', sizes);
                        }
                    }

                    srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
                    src = elem[_getAttribute](lazySizesConfig.srcAttr);

                    if (isImg) {
                        parent = elem.parentNode;
                        isPicture = parent && regPicture.test(parent.nodeName || '');
                    }

                    firesLoad = detail.firesLoad || 'src' in elem && (srcset || src || isPicture);

                    event = {target: elem};

                    if (firesLoad) {
                        addRemoveLoadEvents(elem, resetPreloading, true);
                        clearTimeout(resetPreloadingTimer);
                        resetPreloadingTimer = setTimeout(resetPreloading, 2500);

                        addClass(elem, lazySizesConfig.loadingClass);
                        addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
                    }

                    if (isPicture) {
                        forEach.call(parent.getElementsByTagName('source'), handleSources);
                    }

                    if (srcset) {
                        elem.setAttribute('srcset', srcset);
                    } else if (src && !isPicture) {
                        if (regIframe.test(elem.nodeName)) {
                            changeIframeSrc(elem, src);
                        } else {
                            elem.src = src;
                        }
                    }

                    if (srcset || isPicture) {
                        updatePolyfill(elem, {src: src});
                    }
                }

                if (elem._lazyRace) {
                    delete elem._lazyRace;
                }
                removeClass(elem, lazySizesConfig.lazyClass);

                rAF(function () {
                    if (!firesLoad || elem.complete && elem.naturalWidth > 1) {
                        if (firesLoad) {
                            resetPreloading(event);
                        } else {
                            isLoading--;
                        }
                        switchLoadingClass(event);
                    }
                }, true);
            });

            var unveilElement = function unveilElement(elem) {
                var detail;

                var isImg = regImg.test(elem.nodeName);

                //allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
                var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
                var isAuto = sizes == 'auto';

                if ((isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)) {
                    return;
                }

                detail = triggerEvent(elem, 'lazyunveilread').detail;

                if (isAuto) {
                    autoSizer.updateElem(elem, true, elem.offsetWidth);
                }

                elem._lazyRace = true;
                isLoading++;

                lazyUnveil(elem, detail, isAuto, sizes, isImg);
            };

            var onload = function onload() {
                if (isCompleted) {
                    return;
                }
                if (Date.now() - started < 999) {
                    setTimeout(onload, 999);
                    return;
                }
                var afterScroll = debounce(function () {
                    lazySizesConfig.loadMode = 3;
                    throttledCheckElements();
                });

                isCompleted = true;

                lazySizesConfig.loadMode = 3;

                throttledCheckElements();

                addEventListener('scroll', function () {
                    if (lazySizesConfig.loadMode == 3) {
                        lazySizesConfig.loadMode = 2;
                    }
                    afterScroll();
                }, true);
            };

            return {
                _: function _() {
                    started = Date.now();

                    lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
                    preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
                    hFac = lazySizesConfig.hFac;

                    addEventListener('scroll', throttledCheckElements, true);

                    addEventListener('resize', throttledCheckElements, true);

                    if (window.MutationObserver) {
                        new MutationObserver(throttledCheckElements).observe(docElem, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    } else {
                        docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
                        docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
                        setInterval(throttledCheckElements, 999);
                    }

                    addEventListener('hashchange', throttledCheckElements, true);

                    //, 'fullscreenchange'
                    ['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function (name) {
                        document[_addEventListener](name, throttledCheckElements, true);
                    });

                    if (/d$|^c/.test(document.readyState)) {
                        onload();
                    } else {
                        addEventListener('load', onload);
                        document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
                        setTimeout(onload, 20000);
                    }

                    if (lazyloadElems.length) {
                        checkElements();
                        rAF._lsFlush();
                    } else {
                        throttledCheckElements();
                    }
                },
                checkElems: throttledCheckElements,
                unveil: unveilElement
            };
        }();

        var autoSizer = function () {
            var autosizesElems;

            var sizeElement = rAFIt(function (elem, parent, event, width) {
                var sources, i, len;
                elem._lazysizesWidth = width;
                width += 'px';

                elem.setAttribute('sizes', width);

                if (regPicture.test(parent.nodeName || '')) {
                    sources = parent.getElementsByTagName('source');
                    for (i = 0, len = sources.length; i < len; i++) {
                        sources[i].setAttribute('sizes', width);
                    }
                }

                if (!event.detail.dataAttr) {
                    updatePolyfill(elem, event.detail);
                }
            });
            var getSizeElement = function getSizeElement(elem, dataAttr, width) {
                var event;
                var parent = elem.parentNode;

                if (parent) {
                    width = getWidth(elem, parent, width);
                    event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

                    if (!event.defaultPrevented) {
                        width = event.detail.width;

                        if (width && width !== elem._lazysizesWidth) {
                            sizeElement(elem, parent, event, width);
                        }
                    }
                }
            };

            var updateElementsSizes = function updateElementsSizes() {
                var i;
                var len = autosizesElems.length;
                if (len) {
                    i = 0;

                    for (; i < len; i++) {
                        getSizeElement(autosizesElems[i]);
                    }
                }
            };

            var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

            return {
                _: function _() {
                    autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
                    addEventListener('resize', debouncedUpdateElementsSizes);
                },
                checkElems: debouncedUpdateElementsSizes,
                updateElem: getSizeElement
            };
        }();

        var init = function init() {
            if (!init.i) {
                init.i = true;
                autoSizer._();
                loader._();
            }
        };

        (function () {
            var prop;

            var lazySizesDefaults = {
                lazyClass: 'lazyload',
                loadedClass: 'lazyloaded',
                loadingClass: 'lazyloading',
                preloadClass: 'lazypreload',
                errorClass: 'lazyerror',
                //strictClass: 'lazystrict',
                autosizesClass: 'lazyautosizes',
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',
                sizesAttr: 'data-sizes',
                //preloadAfterLoad: false,
                minSize: 40,
                customMedia: {},
                init: true,
                expFactor: 1.5,
                hFac: 0.8,
                loadMode: 2
            };

            lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

            for (prop in lazySizesDefaults) {
                if (!(prop in lazySizesConfig)) {
                    lazySizesConfig[prop] = lazySizesDefaults[prop];
                }
            }

            window.lazySizesConfig = lazySizesConfig;

            setTimeout(function () {
                if (lazySizesConfig.init) {
                    init();
                }
            });
        })();

        return {
            cfg: lazySizesConfig,
            autoSizer: autoSizer,
            loader: loader,
            init: init,
            uP: updatePolyfill,
            aC: addClass,
            rC: removeClass,
            hC: hasClass,
            fire: triggerEvent,
            gW: getWidth,
            rAF: rAF
        };
    });

    document.addEventListener('lazybeforeunveil', function (event) {
        var target = event.target;

        var altExt = hasSupportWebp ? null : target.getAttribute('data-webp-alt') || 'jpg';
        var bg = target.getAttribute('data-bg');
        var src = target.getAttribute('data-src') || target.src;

        target.classList.add('lazy');

        if (bg) {
            if (bg === 'parent') {
                if (!hasSupportWebp) {
                    src = src.replace('.webp', '.' + altExt);
                }

                target.setAttribute('hidden', true);
                target.parentNode.style.backgroundImage = 'url(' + src + ')';
            } else {
                if (!hasSupportWebp) {
                    bg = bg.replace(/\.webp/g, '.' + altExt);
                }

                var arr = bg.split(',');
                var bgi = '';

                // multiple backgrounds
                arr.forEach(function (el, i) {
                    if (i > 0) {
                        bgi += ',';
                    }
                    bgi += 'url(' + el.trim() + ')';
                });

                target.style.backgroundImage = bgi;
            }
        } else {
            if (!hasSupportWebp && target.nodeName === 'IMG') {
                target.setAttribute('data-src', src.replace(/\.webp/g, '.' + altExt));
            }
        }
    });

    /* global ymaps */

    var $map = document.getElementById('map');
    var throttleDelay = 50;
    var fnThrottle = throttle(scrolling, throttleDelay);

    if ($map) {
        scrolling();
    }

    window.mapInit = function () {
        var zoom = $map.getAttribute('data-zoom') || 16; // eslint-disable-line no-magic-numbers
        var coord1 = $map.getAttribute('data-coord').split(',');

        var myMap = new ymaps.Map('map', {
            zoom: zoom,
            center: coord1,
            controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'rulerControl']
        });

        var myPlacemark1 = new ymaps.Placemark(coord1, {
            hintContent: 'ЮЛИЯ ЛАНДЫШЕВА'
        }, {
            iconLayout: 'default#image',
            iconImageHref: '/wp-content/themes/landysheva/img/blocks/contacts/placeholder.svg',
            iconImageSize: [42, 42], // eslint-disable-line no-magic-numbers
            iconImageOffset: [-21, -42] // eslint-disable-line no-magic-numbers
        });

        myMap.behaviors.disable('scrollZoom');
        myMap.geoObjects.add(myPlacemark1);

        window.addEventListener('scroll', fnThrottle);
    };

    function scrolling() {
        // load map's script only if map block is visible
        if (isElementInViewport($map)) {
            window.removeEventListener('scroll', fnThrottle);
            loadScript();
        }
    }

    function loadScript() {
        var script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&onload=mapInit';
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        var vWidth = window.innerWidth || document.documentElement.clientWidth;
        var vHeight = window.innerHeight || document.documentElement.clientHeight;
        var efp = function efp(x, y) {
            return document.elementFromPoint(x, y);
        };

        // Return false if it's not in the viewport
        if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
            return false;
        }

        // Return true if any of its four corners are visible
        return el.contains(efp(rect.left, rect.top)) || el.contains(efp(rect.right, rect.top)) || el.contains(efp(rect.right, rect.bottom)) || el.contains(efp(rect.left, rect.bottom));
    }

    /**
     * Copyright 2016 Google Inc. All Rights Reserved.
     *
     * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
     *
     *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     */

    (function (window, document) {

        // Exits early if all IntersectionObserver and IntersectionObserverEntry
        // features are natively supported.

        if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

            // Minimal polyfill for Edge 15's lack of `isIntersecting`
            // See: https://github.com/w3c/IntersectionObserver/issues/211
            if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
                Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
                    get: function get() {
                        return this.intersectionRatio > 0;
                    }
                });
            }
            return;
        }

        /**
         * Creates the global IntersectionObserverEntry constructor.
         * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
         * @param {Object} entry A dictionary of instance properties.
         * @constructor
         */
        function IntersectionObserverEntry(entry) {
            this.time = entry.time;
            this.target = entry.target;
            this.rootBounds = entry.rootBounds;
            this.boundingClientRect = entry.boundingClientRect;
            this.intersectionRect = entry.intersectionRect || getEmptyRect();
            this.isIntersecting = !!entry.intersectionRect;

            // Calculates the intersection ratio.
            var targetRect = this.boundingClientRect;
            var targetArea = targetRect.width * targetRect.height;
            var intersectionRect = this.intersectionRect;
            var intersectionArea = intersectionRect.width * intersectionRect.height;

            // Sets intersection ratio.
            if (targetArea) {
                this.intersectionRatio = intersectionArea / targetArea;
            } else {
                // If area is zero and is intersecting, sets to 1, otherwise to 0
                this.intersectionRatio = this.isIntersecting ? 1 : 0;
            }
        }

        /**
         * Creates the global IntersectionObserver constructor.
         * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
         * @param {Function} callback The function to be invoked after intersection
         *     changes have queued. The function is not invoked if the queue has
         *     been emptied by calling the `takeRecords` method.
         * @param {Object=} opt_options Optional configuration options.
         * @constructor
         */
        function IntersectionObserver(callback, opt_options) {

            var options = opt_options || {};

            if (typeof callback != 'function') {
                throw new Error('callback must be a function');
            }

            if (options.root && options.root.nodeType != 1) {
                throw new Error('root must be an Element');
            }

            // Binds and throttles `this._checkForIntersections`.
            this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

            // Private properties.
            this._callback = callback;
            this._observationTargets = [];
            this._queuedEntries = [];
            this._rootMarginValues = this._parseRootMargin(options.rootMargin);

            // Public properties.
            this.thresholds = this._initThresholds(options.threshold);
            this.root = options.root || null;
            this.rootMargin = this._rootMarginValues.map(function (margin) {
                return margin.value + margin.unit;
            }).join(' ');
        }

        /**
         * The minimum interval within which the document will be checked for
         * intersection changes.
         */
        IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;

        /**
         * The frequency in which the polyfill polls for intersection changes.
         * this can be updated on a per instance basis and must be set prior to
         * calling `observe` on the first target.
         */
        IntersectionObserver.prototype.POLL_INTERVAL = null;

        /**
         * Use a mutation observer on the root element
         * to detect intersection changes.
         */
        IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;

        /**
         * Starts observing a target element for intersection changes based on
         * the thresholds values.
         * @param {Element} target The DOM element to observe.
         */
        IntersectionObserver.prototype.observe = function (target) {
            var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
                return item.element == target;
            });

            if (isTargetAlreadyObserved) {
                return;
            }

            if (!(target && target.nodeType == 1)) {
                throw new Error('target must be an Element');
            }

            this._registerInstance();
            this._observationTargets.push({element: target, entry: null});
            this._monitorIntersections();
            this._checkForIntersections();
        };

        /**
         * Stops observing a target element for intersection changes.
         * @param {Element} target The DOM element to observe.
         */
        IntersectionObserver.prototype.unobserve = function (target) {
            this._observationTargets = this._observationTargets.filter(function (item) {

                return item.element != target;
            });
            if (!this._observationTargets.length) {
                this._unmonitorIntersections();
                this._unregisterInstance();
            }
        };

        /**
         * Stops observing all target elements for intersection changes.
         */
        IntersectionObserver.prototype.disconnect = function () {
            this._observationTargets = [];
            this._unmonitorIntersections();
            this._unregisterInstance();
        };

        /**
         * Returns any queue entries that have not yet been reported to the
         * callback and clears the queue. This can be used in conjunction with the
         * callback to obtain the absolute most up-to-date intersection information.
         * @return {Array} The currently queued entries.
         */
        IntersectionObserver.prototype.takeRecords = function () {
            var records = this._queuedEntries.slice();
            this._queuedEntries = [];
            return records;
        };

        /**
         * Accepts the threshold value from the user configuration object and
         * returns a sorted array of unique threshold values. If a value is not
         * between 0 and 1 and error is thrown.
         * @private
         * @param {Array|number=} opt_threshold An optional threshold value or
         *     a list of threshold values, defaulting to [0].
         * @return {Array} A sorted list of unique and valid threshold values.
         */
        IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
            var threshold = opt_threshold || [0];
            if (!Array.isArray(threshold)) threshold = [threshold];

            return threshold.sort().filter(function (t, i, a) {
                if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
                    throw new Error('threshold must be a number between 0 and 1 inclusively');
                }
                return t !== a[i - 1];
            });
        };

        /**
         * Accepts the rootMargin value from the user configuration object
         * and returns an array of the four margin values as an object containing
         * the value and unit properties. If any of the values are not properly
         * formatted or use a unit other than px or %, and error is thrown.
         * @private
         * @param {string=} opt_rootMargin An optional rootMargin value,
         *     defaulting to '0px'.
         * @return {Array<Object>} An array of margin objects with the keys
         *     value and unit.
         */
        IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
            var marginString = opt_rootMargin || '0px';
            var margins = marginString.split(/\s+/).map(function (margin) {
                var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
                if (!parts) {
                    throw new Error('rootMargin must be specified in pixels or percent');
                }
                return {value: parseFloat(parts[1]), unit: parts[2]};
            });

            // Handles shorthand.
            margins[1] = margins[1] || margins[0];
            margins[2] = margins[2] || margins[0];
            margins[3] = margins[3] || margins[1];

            return margins;
        };

        /**
         * Starts polling for intersection changes if the polling is not already
         * happening, and if the page's visibilty state is visible.
         * @private
         */
        IntersectionObserver.prototype._monitorIntersections = function () {
            if (!this._monitoringIntersections) {
                this._monitoringIntersections = true;

                // If a poll interval is set, use polling instead of listening to
                // resize and scroll events or DOM mutations.
                if (this.POLL_INTERVAL) {
                    this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL);
                } else {
                    addEvent(window, 'resize', this._checkForIntersections, true);
                    addEvent(document, 'scroll', this._checkForIntersections, true);

                    if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
                        this._domObserver = new MutationObserver(this._checkForIntersections);
                        this._domObserver.observe(document, {
                            attributes: true,
                            childList: true,
                            characterData: true,
                            subtree: true
                        });
                    }
                }
            }
        };

        /**
         * Stops polling for intersection changes.
         * @private
         */
        IntersectionObserver.prototype._unmonitorIntersections = function () {
            if (this._monitoringIntersections) {
                this._monitoringIntersections = false;

                clearInterval(this._monitoringInterval);
                this._monitoringInterval = null;

                removeEvent(window, 'resize', this._checkForIntersections, true);
                removeEvent(document, 'scroll', this._checkForIntersections, true);

                if (this._domObserver) {
                    this._domObserver.disconnect();
                    this._domObserver = null;
                }
            }
        };

        /**
         * Scans each observation target for intersection changes and adds them
         * to the internal entries queue. If new entries are found, it
         * schedules the callback to be invoked.
         * @private
         */
        IntersectionObserver.prototype._checkForIntersections = function () {
            var rootIsInDom = this._rootIsInDom();
            var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

            this._observationTargets.forEach(function (item) {
                var target = item.element;
                var targetRect = getBoundingClientRect(target);
                var rootContainsTarget = this._rootContainsTarget(target);
                var oldEntry = item.entry;
                var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, rootRect);

                var newEntry = item.entry = new IntersectionObserverEntry({
                    time: now(),
                    target: target,
                    boundingClientRect: targetRect,
                    rootBounds: rootRect,
                    intersectionRect: intersectionRect
                });

                if (!oldEntry) {
                    this._queuedEntries.push(newEntry);
                } else if (rootIsInDom && rootContainsTarget) {
                    // If the new entry intersection ratio has crossed any of the
                    // thresholds, add a new entry.
                    if (this._hasCrossedThreshold(oldEntry, newEntry)) {
                        this._queuedEntries.push(newEntry);
                    }
                } else {
                    // If the root is not in the DOM or target is not contained within
                    // root but the previous entry for this target had an intersection,
                    // add a new record indicating removal.
                    if (oldEntry && oldEntry.isIntersecting) {
                        this._queuedEntries.push(newEntry);
                    }
                }
            }, this);

            if (this._queuedEntries.length) {
                this._callback(this.takeRecords(), this);
            }
        };

        /**
         * Accepts a target and root rect computes the intersection between then
         * following the algorithm in the spec.
         * TODO(philipwalton): at this time clip-path is not considered.
         * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
         * @param {Element} target The target DOM element
         * @param {Object} rootRect The bounding rect of the root after being
         *     expanded by the rootMargin value.
         * @return {?Object} The final intersection rect object or undefined if no
         *     intersection is found.
         * @private
         */
        IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, rootRect) {

            // If the element isn't displayed, an intersection can't happen.
            if (window.getComputedStyle(target).display == 'none') return;

            var targetRect = getBoundingClientRect(target);
            var intersectionRect = targetRect;
            var parent = getParentNode(target);
            var atRoot = false;

            while (!atRoot) {
                var parentRect = null;
                var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {};

                // If the parent isn't displayed, an intersection can't happen.
                if (parentComputedStyle.display == 'none') return;

                if (parent == this.root || parent == document) {
                    atRoot = true;
                    parentRect = rootRect;
                } else {
                    // If the element has a non-visible overflow, and it's not the <body>
                    // or <html> element, update the intersection rect.
                    // Note: <body> and <html> cannot be clipped to a rect that's not also
                    // the document rect, so no need to compute a new intersection.
                    if (parent != document.body && parent != document.documentElement && parentComputedStyle.overflow != 'visible') {
                        parentRect = getBoundingClientRect(parent);
                    }
                }

                // If either of the above conditionals set a new parentRect,
                // calculate new intersection data.
                if (parentRect) {
                    intersectionRect = computeRectIntersection(parentRect, intersectionRect);

                    if (!intersectionRect) break;
                }
                parent = getParentNode(parent);
            }
            return intersectionRect;
        };

        /**
         * Returns the root rect after being expanded by the rootMargin value.
         * @return {Object} The expanded root rect.
         * @private
         */
        IntersectionObserver.prototype._getRootRect = function () {
            var rootRect;
            if (this.root) {
                rootRect = getBoundingClientRect(this.root);
            } else {
                // Use <html>/<body> instead of window since scroll bars affect size.
                var html = document.documentElement;
                var body = document.body;
                rootRect = {
                    top: 0,
                    left: 0,
                    right: html.clientWidth || body.clientWidth,
                    width: html.clientWidth || body.clientWidth,
                    bottom: html.clientHeight || body.clientHeight,
                    height: html.clientHeight || body.clientHeight
                };
            }
            return this._expandRectByRootMargin(rootRect);
        };

        /**
         * Accepts a rect and expands it by the rootMargin value.
         * @param {Object} rect The rect object to expand.
         * @return {Object} The expanded rect.
         * @private
         */
        IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
            var margins = this._rootMarginValues.map(function (margin, i) {
                return margin.unit == 'px' ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
            });
            var newRect = {
                top: rect.top - margins[0],
                right: rect.right + margins[1],
                bottom: rect.bottom + margins[2],
                left: rect.left - margins[3]
            };
            newRect.width = newRect.right - newRect.left;
            newRect.height = newRect.bottom - newRect.top;

            return newRect;
        };

        /**
         * Accepts an old and new entry and returns true if at least one of the
         * threshold values has been crossed.
         * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
         *    particular target element or null if no previous entry exists.
         * @param {IntersectionObserverEntry} newEntry The current entry for a
         *    particular target element.
         * @return {boolean} Returns true if a any threshold has been crossed.
         * @private
         */
        IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {

            // To make comparing easier, an entry that has a ratio of 0
            // but does not actually intersect is given a value of -1
            var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
            var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;

            // Ignore unchanged ratios
            if (oldRatio === newRatio) return;

            for (var i = 0; i < this.thresholds.length; i++) {
                var threshold = this.thresholds[i];

                // Return true if an entry matches a threshold or if the new ratio
                // and the old ratio are on the opposite sides of a threshold.
                if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
                    return true;
                }
            }
        };

        /**
         * Returns whether or not the root element is an element and is in the DOM.
         * @return {boolean} True if the root element is an element and is in the DOM.
         * @private
         */
        IntersectionObserver.prototype._rootIsInDom = function () {
            return !this.root || containsDeep(document, this.root);
        };

        /**
         * Returns whether or not the target element is a child of root.
         * @param {Element} target The target element to check.
         * @return {boolean} True if the target element is a child of root.
         * @private
         */
        IntersectionObserver.prototype._rootContainsTarget = function (target) {
            return containsDeep(this.root || document, target);
        };

        /**
         * Adds the instance to the global IntersectionObserver registry if it isn't
         * already present.
         * @private
         */
        IntersectionObserver.prototype._registerInstance = function () {
        };

        /**
         * Removes the instance from the global IntersectionObserver registry.
         * @private
         */
        IntersectionObserver.prototype._unregisterInstance = function () {
        };

        /**
         * Returns the result of the performance.now() method or null in browsers
         * that don't support the API.
         * @return {number} The elapsed time since the page was requested.
         */
        function now() {
            return window.performance && performance.now && performance.now();
        }

        /**
         * Throttles a function and delays its executiong, so it's only called at most
         * once within a given time period.
         * @param {Function} fn The function to throttle.
         * @param {number} timeout The amount of time that must pass before the
         *     function can be called again.
         * @return {Function} The throttled function.
         */
        function throttle(fn, timeout) {
            var timer = null;
            return function () {
                if (!timer) {
                    timer = setTimeout(function () {
                        fn();
                        timer = null;
                    }, timeout);
                }
            };
        }

        /**
         * Adds an event handler to a DOM node ensuring cross-browser compatibility.
         * @param {Node} node The DOM node to add the event handler to.
         * @param {string} event The event name.
         * @param {Function} fn The event handler to add.
         * @param {boolean} opt_useCapture Optionally adds the even to the capture
         *     phase. Note: this only works in modern browsers.
         */
        function addEvent(node, event, fn, opt_useCapture) {
            if (typeof node.addEventListener == 'function') {
                node.addEventListener(event, fn, opt_useCapture || false);
            } else if (typeof node.attachEvent == 'function') {
                node.attachEvent('on' + event, fn);
            }
        }

        /**
         * Removes a previously added event handler from a DOM node.
         * @param {Node} node The DOM node to remove the event handler from.
         * @param {string} event The event name.
         * @param {Function} fn The event handler to remove.
         * @param {boolean} opt_useCapture If the event handler was added with this
         *     flag set to true, it should be set to true here in order to remove it.
         */
        function removeEvent(node, event, fn, opt_useCapture) {
            if (typeof node.removeEventListener == 'function') {
                node.removeEventListener(event, fn, opt_useCapture || false);
            } else if (typeof node.detatchEvent == 'function') {
                node.detatchEvent('on' + event, fn);
            }
        }

        /**
         * Returns the intersection between two rect objects.
         * @param {Object} rect1 The first rect.
         * @param {Object} rect2 The second rect.
         * @return {?Object} The intersection rect or undefined if no intersection
         *     is found.
         */
        function computeRectIntersection(rect1, rect2) {
            var top = Math.max(rect1.top, rect2.top);
            var bottom = Math.min(rect1.bottom, rect2.bottom);
            var left = Math.max(rect1.left, rect2.left);
            var right = Math.min(rect1.right, rect2.right);
            var width = right - left;
            var height = bottom - top;

            return width >= 0 && height >= 0 && {
                top: top,
                bottom: bottom,
                left: left,
                right: right,
                width: width,
                height: height
            };
        }

        /**
         * Shims the native getBoundingClientRect for compatibility with older IE.
         * @param {Element} el The element whose bounding rect to get.
         * @return {Object} The (possibly shimmed) rect of the element.
         */
        function getBoundingClientRect(el) {
            var rect;

            try {
                rect = el.getBoundingClientRect();
            } catch (err) {
                // Ignore Windows 7 IE11 "Unspecified error"
                // https://github.com/w3c/IntersectionObserver/pull/205
            }

            if (!rect) return getEmptyRect();

            // Older IE
            if (!(rect.width && rect.height)) {
                rect = {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                    width: rect.right - rect.left,
                    height: rect.bottom - rect.top
                };
            }
            return rect;
        }

        /**
         * Returns an empty rect object. An empty rect is returned when an element
         * is not in the DOM.
         * @return {Object} The empty rect.
         */
        function getEmptyRect() {
            return {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 0,
                height: 0
            };
        }

        /**
         * Checks to see if a parent element contains a child elemnt (including inside
         * shadow DOM).
         * @param {Node} parent The parent element.
         * @param {Node} child The child element.
         * @return {boolean} True if the parent node contains the child node.
         */
        function containsDeep(parent, child) {
            var node = child;
            while (node) {
                if (node == parent) return true;

                node = getParentNode(node);
            }
            return false;
        }

        /**
         * Gets the parent node of an element or its host element if the parent node
         * is a shadow root.
         * @param {Node} node The node whose parent to get.
         * @return {Node|null} The parent node or null if no parent exists.
         */
        function getParentNode(node) {
            var parent = node.parentNode;

            if (parent && parent.nodeType == 11 && parent.host) {
                // If the parent is a shadow root, return the host element.
                return parent.host;
            }
            return parent;
        }

        // Exposes the constructors globally.
        window.IntersectionObserver = IntersectionObserver;
        window.IntersectionObserverEntry = IntersectionObserverEntry;
        window.IntersectionObserverPolyfill = true;
    })(window, document);

    var $opacities = document.querySelectorAll('.js-opacity');
    var $opacities = [];
    var config = {
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
    };

    [].concat(toConsumableArray($opacities)).forEach(function ($opacity) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio <= 1) {
                    entry.target.style.opacity = entry.intersectionRatio;
                }
            });
        }, config);

        observer.observe($opacity);
    });

// ==========================================================================
// Plyr
// plyr.js v2.0.18
// https://github.com/sampotts/plyr
// License: The MIT License (MIT)
// ==========================================================================
// Credits: http://paypal.github.io/accessible-html5-video-player/
// ==========================================================================

    (function (root, factory) {
        /*global define,module*/

        if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
            // Node, CommonJS-like
            module.exports = factory(root, document);
        } else if (typeof define === 'function' && define.amd) {
            // AMD
            define([], function () {
                return factory(root, document);
            });
        } else {
            // Browser globals (root is window)
            root.plyr = factory(root, document);
        }
    })(window, function (window, document) {

        // Globals

        var fullscreen,
            scroll = {x: 0, y: 0},

            // Default config
            defaults$$1 = {
                enabled: true,
                debug: false,
                autoplay: false,
                loop: false,
                seekTime: 10,
                volume: 10,
                volumeMin: 0,
                volumeMax: 10,
                volumeStep: 1,
                duration: null,
                displayDuration: true,
                loadSprite: true,
                iconPrefix: 'plyr',
                iconUrl: 'https://cdn.plyr.io/2.0.18/plyr.svg',
                blankUrl: 'https://cdn.plyr.io/static/blank.mp4',
                clickToPlay: true,
                hideControls: true,
                showPosterOnEnd: false,
                disableContextMenu: true,
                keyboardShorcuts: {
                    focused: true,
                    global: false
                },
                tooltips: {
                    controls: false,
                    seek: true
                },
                selectors: {
                    html5: 'video, audio',
                    embed: '[data-type]',
                    editable: 'input, textarea, select, [contenteditable]',
                    container: '.plyr',
                    controls: {
                        container: null,
                        wrapper: '.plyr__controls'
                    },
                    labels: '[data-plyr]',
                    buttons: {
                        seek: '[data-plyr="seek"]',
                        play: '[data-plyr="play"]',
                        pause: '[data-plyr="pause"]',
                        restart: '[data-plyr="restart"]',
                        rewind: '[data-plyr="rewind"]',
                        forward: '[data-plyr="fast-forward"]',
                        mute: '[data-plyr="mute"]',
                        captions: '[data-plyr="captions"]',
                        fullscreen: '[data-plyr="fullscreen"]'
                    },
                    volume: {
                        input: '[data-plyr="volume"]',
                        display: '.plyr__volume--display'
                    },
                    progress: {
                        container: '.plyr__progress',
                        buffer: '.plyr__progress--buffer',
                        played: '.plyr__progress--played'
                    },
                    captions: '.plyr__captions',
                    currentTime: '.plyr__time--current',
                    duration: '.plyr__time--duration'
                },
                classes: {
                    setup: 'plyr--setup',
                    ready: 'plyr--ready',
                    videoWrapper: 'plyr__video-wrapper',
                    embedWrapper: 'plyr__video-embed',
                    type: 'plyr--{0}',
                    stopped: 'plyr--stopped',
                    playing: 'plyr--playing',
                    muted: 'plyr--muted',
                    loading: 'plyr--loading',
                    hover: 'plyr--hover',
                    tooltip: 'plyr__tooltip',
                    hidden: 'plyr__sr-only',
                    hideControls: 'plyr--hide-controls',
                    isIos: 'plyr--is-ios',
                    isTouch: 'plyr--is-touch',
                    captions: {
                        enabled: 'plyr--captions-enabled',
                        active: 'plyr--captions-active'
                    },
                    fullscreen: {
                        enabled: 'plyr--fullscreen-enabled',
                        fallback: 'plyr--fullscreen-fallback',
                        active: 'plyr--fullscreen-active'
                    },
                    tabFocus: 'tab-focus'
                },
                captions: {
                    defaultActive: false
                },
                fullscreen: {
                    enabled: true,
                    fallback: true,
                    allowAudio: false
                },
                storage: {
                    enabled: true,
                    key: 'plyr'
                },
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen'],
                i18n: {
                    restart: 'Restart',
                    rewind: 'Rewind {seektime} secs',
                    play: 'Play',
                    pause: 'Pause',
                    forward: 'Forward {seektime} secs',
                    played: 'played',
                    buffered: 'buffered',
                    currentTime: 'Current time',
                    duration: 'Duration',
                    volume: 'Volume',
                    toggleMute: 'Toggle Mute',
                    toggleCaptions: 'Toggle Captions',
                    toggleFullscreen: 'Toggle Fullscreen',
                    frameTitle: 'Player for {title}'
                },
                types: {
                    embed: ['youtube', 'vimeo', 'soundcloud'],
                    html5: ['video', 'audio']
                },
                // URLs
                urls: {
                    vimeo: {
                        api: 'https://player.vimeo.com/api/player.js'
                    },
                    youtube: {
                        api: 'https://www.youtube.com/iframe_api'
                    },
                    soundcloud: {
                        api: 'https://w.soundcloud.com/player/api.js'
                    }
                },
                // Custom control listeners
                listeners: {
                    seek: null,
                    play: null,
                    pause: null,
                    restart: null,
                    rewind: null,
                    forward: null,
                    mute: null,
                    volume: null,
                    captions: null,
                    fullscreen: null
                },
                // Events to watch on HTML5 media elements
                events: ['ready', 'ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'pause', 'error', 'seeking', 'seeked', 'emptied'],
                // Logging
                logPrefix: '[Plyr]'
            };

        // Credits: http://paypal.github.io/accessible-html5-video-player/
        // Unfortunately, due to mixed support, UA sniffing is required
        function _browserSniff() {
            var ua = navigator.userAgent,
                name = navigator.appName,
                fullVersion = '' + parseFloat(navigator.appVersion),
                majorVersion = parseInt(navigator.appVersion, 10),
                nameOffset,
                verOffset,
                ix,
                isIE = false,
                isFirefox = false,
                isChrome = false,
                isSafari = false;

            if (navigator.appVersion.indexOf('Windows NT') !== -1 && navigator.appVersion.indexOf('rv:11') !== -1) {
                // MSIE 11
                isIE = true;
                name = 'IE';
                fullVersion = '11';
            } else if ((verOffset = ua.indexOf('MSIE')) !== -1) {
                // MSIE
                isIE = true;
                name = 'IE';
                fullVersion = ua.substring(verOffset + 5);
            } else if ((verOffset = ua.indexOf('Chrome')) !== -1) {
                // Chrome
                isChrome = true;
                name = 'Chrome';
                fullVersion = ua.substring(verOffset + 7);
            } else if ((verOffset = ua.indexOf('Safari')) !== -1) {
                // Safari
                isSafari = true;
                name = 'Safari';
                fullVersion = ua.substring(verOffset + 7);
                if ((verOffset = ua.indexOf('Version')) !== -1) {
                    fullVersion = ua.substring(verOffset + 8);
                }
            } else if ((verOffset = ua.indexOf('Firefox')) !== -1) {
                // Firefox
                isFirefox = true;
                name = 'Firefox';
                fullVersion = ua.substring(verOffset + 8);
            } else if ((nameOffset = ua.lastIndexOf(' ') + 1) < (verOffset = ua.lastIndexOf('/'))) {
                // In most other browsers, 'name/version' is at the end of userAgent
                name = ua.substring(nameOffset, verOffset);
                fullVersion = ua.substring(verOffset + 1);

                if (name.toLowerCase() === name.toUpperCase()) {
                    name = navigator.appName;
                }
            }

            // Trim the fullVersion string at semicolon/space if present
            if ((ix = fullVersion.indexOf(';')) !== -1) {
                fullVersion = fullVersion.substring(0, ix);
            }
            if ((ix = fullVersion.indexOf(' ')) !== -1) {
                fullVersion = fullVersion.substring(0, ix);
            }

            // Get major version
            majorVersion = parseInt('' + fullVersion, 10);
            if (isNaN(majorVersion)) {
                fullVersion = '' + parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion, 10);
            }

            // Return data
            return {
                name: name,
                version: majorVersion,
                isIE: isIE,
                isFirefox: isFirefox,
                isChrome: isChrome,
                isSafari: isSafari,
                isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform),
                isIphone: /(iPhone|iPod)/g.test(navigator.userAgent),
                isTouch: 'ontouchstart' in document.documentElement
            };
        }

        // Check for mime type support against a player instance
        // Credits: http://diveintohtml5.info/everything.html
        // Related: http://www.leanbackplyr.com/test/h5mt.html
        function _supportMime(plyr, mimeType) {
            var media = plyr.media;

            if (plyr.type === 'video') {
                // Check type
                switch (mimeType) {
                    case 'video/webm':
                        return !!(media.canPlayType && media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
                    case 'video/mp4':
                        return !!(media.canPlayType && media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
                    case 'video/ogg':
                        return !!(media.canPlayType && media.canPlayType('video/ogg; codecs="theora"').replace(/no/, ''));
                }
            } else if (plyr.type === 'audio') {
                // Check type
                switch (mimeType) {
                    case 'audio/mpeg':
                        return !!(media.canPlayType && media.canPlayType('audio/mpeg;').replace(/no/, ''));
                    case 'audio/ogg':
                        return !!(media.canPlayType && media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
                    case 'audio/wav':
                        return !!(media.canPlayType && media.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
                }
            }

            // If we got this far, we're stuffed
            return false;
        }

        // Inject a script
        function _injectScript(source) {
            if (document.querySelectorAll('script[src="' + source + '"]').length) {
                return;
            }

            var tag = document.createElement('script');
            tag.src = source;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Element exists in an array
        function _inArray(haystack, needle) {
            return Array.prototype.indexOf && haystack.indexOf(needle) !== -1;
        }

        // Replace all
        function _replaceAll(string, find, replace) {
            return string.replace(new RegExp(find.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
        }

        // Wrap an element
        function _wrap(elements, wrapper) {
            // Convert `elements` to an array, if necessary.
            if (!elements.length) {
                elements = [elements];
            }

            // Loops backwards to prevent having to clone the wrapper on the
            // first element (see `child` below).
            for (var i = elements.length - 1; i >= 0; i--) {
                var child = i > 0 ? wrapper.cloneNode(true) : wrapper;
                var element = elements[i];

                // Cache the current parent and sibling.
                var parent = element.parentNode;
                var sibling = element.nextSibling;

                // Wrap the element (is automatically removed from its current
                // parent).
                child.appendChild(element);

                // If the element had a sibling, insert the wrapper before
                // the sibling to maintain the HTML structure; otherwise, just
                // append it to the parent.
                if (sibling) {
                    parent.insertBefore(child, sibling);
                } else {
                    parent.appendChild(child);
                }

                return child;
            }
        }

        // Unwrap an element
        // http://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
        /*function _unwrap(wrapper) {
        // Get the element's parent node
        var parent = wrapper.parentNode;
         // Move all children out of the element
        while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, wrapper);
        }
         // Remove the empty element
        parent.removeChild(wrapper);
    }*/

        // Remove an element
        function _remove(element) {
            if (!element) {
                return;
            }
            element.parentNode.removeChild(element);
        }

        // Prepend child
        function _prependChild(parent, element) {
            parent.insertBefore(element, parent.firstChild);
        }

        // Set attributes
        function _setAttributes(element, attributes) {
            for (var key in attributes) {
                element.setAttribute(key, _is.boolean(attributes[key]) && attributes[key] ? '' : attributes[key]);
            }
        }

        // Insert a HTML element
        function _insertElement(type, parent, attributes) {
            // Create a new <element>
            var element = document.createElement(type);

            // Set all passed attributes
            _setAttributes(element, attributes);

            // Inject the new element
            _prependChild(parent, element);
        }

        // Get a classname from selector
        function _getClassname(selector) {
            return selector.replace('.', '');
        }

        // Toggle class on an element
        function _toggleClass(element, className, state) {
            if (element) {
                if (element.classList) {
                    element.classList[state ? 'add' : 'remove'](className);
                } else {
                    var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                    element.className = name + (state ? ' ' + className : '');
                }
            }
        }

        // Has class name
        function _hasClass(element, className) {
            if (element) {
                if (element.classList) {
                    return element.classList.contains(className);
                } else {
                    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
                }
            }
            return false;
        }

        // Element matches selector
        function _matches(element, selector) {
            var p = Element.prototype;

            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            return f.call(element, selector);
        }

        // Bind along with custom handler
        function _proxyListener(element, eventName, userListener, defaultListener, useCapture) {
            if (userListener) {
                // Register this before defaultListener
                _on(element, eventName, function (event) {
                    userListener.apply(element, [event]);
                }, useCapture);
            }
            _on(element, eventName, function (event) {
                defaultListener.apply(element, [event]);
            }, useCapture);
        }

        // Toggle event listener
        function _toggleListener(element, events, callback, toggle, useCapture) {
            var eventList = events.split(' ');

            // Whether the listener is a capturing listener or not
            // Default to false
            if (!_is.boolean(useCapture)) {
                useCapture = false;
            }

            // If a nodelist is passed, call itself on each node
            if (element instanceof NodeList) {
                for (var x = 0; x < element.length; x++) {
                    if (element[x] instanceof Node) {
                        _toggleListener(element[x], arguments[1], arguments[2], arguments[3]);
                    }
                }
                return;
            }

            // If a single node is passed, bind the event listener
            for (var i = 0; i < eventList.length; i++) {
                element[toggle ? 'addEventListener' : 'removeEventListener'](eventList[i], callback, useCapture);
            }
        }

        // Bind event
        function _on(element, events, callback, useCapture) {
            if (element) {
                _toggleListener(element, events, callback, true, useCapture);
            }
        }

        // Unbind event
        function _off(element, events, callback, useCapture) {
            if (element) {
                _toggleListener(element, events, callback, false, useCapture);
            }
        }

        // Trigger event
        function _event(element, type, bubbles, properties) {
            // Bail if no element
            if (!element || !type) {
                return;
            }

            // Default bubbles to false
            if (!_is.boolean(bubbles)) {
                bubbles = false;
            }

            // Create and dispatch the event
            var event = new CustomEvent(type, {
                bubbles: bubbles,
                detail: properties
            });

            // Dispatch the event
            element.dispatchEvent(event);
        }

        // Toggle aria-pressed state on a toggle button
        // http://www.ssbbartgroup.com/blog/how-not-to-misuse-aria-states-properties-and-roles
        function _toggleState(target, state) {
            // Bail if no target
            if (!target) {
                return;
            }

            // Get state
            state = _is.boolean(state) ? state : !target.getAttribute('aria-pressed');

            // Set the attribute on target
            target.setAttribute('aria-pressed', state);

            return state;
        }

        // Get percentage
        function _getPercentage(current, max) {
            if (current === 0 || max === 0 || isNaN(current) || isNaN(max)) {
                return 0;
            }
            return (current / max * 100).toFixed(2);
        }

        // Deep extend/merge destination object with N more objects
        // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
        // Removed call to arguments.callee (used explicit function name instead)
        function _extend() {
            // Get arguments
            var objects = arguments;

            // Bail if nothing to merge
            if (!objects.length) {
                return;
            }

            // Return first if specified but nothing to merge
            if (objects.length === 1) {
                return objects[0];
            }

            // First object is the destination
            var destination = Array.prototype.shift.call(objects),
                length = objects.length;

            // Loop through all objects to merge
            for (var i = 0; i < length; i++) {
                var source = objects[i];

                for (var property in source) {
                    if (source[property] && source[property].constructor && source[property].constructor === Object) {
                        destination[property] = destination[property] || {};
                        _extend(destination[property], source[property]);
                    } else {
                        destination[property] = source[property];
                    }
                }
            }

            return destination;
        }

        // Check variable types
        var _is = {
            object: function object(input) {
                return input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';
            },
            array: function array(input) {
                return input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.constructor === Array;
            },
            number: function number(input) {
                return input !== null && (typeof input === 'number' && !isNaN(input - 0) || (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.constructor === Number);
            },
            string: function string(input) {
                return input !== null && (typeof input === 'string' || (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.constructor === String);
            },
            boolean: function boolean(input) {
                return input !== null && typeof input === 'boolean';
            },
            nodeList: function nodeList(input) {
                return input !== null && input instanceof NodeList;
            },
            htmlElement: function htmlElement(input) {
                return input !== null && input instanceof HTMLElement;
            },
            function: function _function(input) {
                return input !== null && typeof input === 'function';
            },
            undefined: function undefined(input) {
                return input !== null && typeof input === 'undefined';
            }
        };

        // Parse YouTube ID from url
        function _parseYouTubeId(url) {
            var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            return url.match(regex) ? RegExp.$2 : url;
        }

        // Parse Vimeo ID from url
        function _parseVimeoId(url) {
            var regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
            return url.match(regex) ? RegExp.$2 : url;
        }

        // Fullscreen API
        function _fullscreen() {
            var fullscreen = {
                    supportsFullScreen: false,
                    isFullScreen: function isFullScreen() {
                        return false;
                    },
                    requestFullScreen: function requestFullScreen() {
                    },
                    cancelFullScreen: function cancelFullScreen() {
                    },
                    fullScreenEventName: '',
                    element: null,
                    prefix: ''
                },
                browserPrefixes = 'webkit o moz ms khtml'.split(' ');

            // Check for native support
            if (!_is.undefined(document.cancelFullScreen)) {
                fullscreen.supportsFullScreen = true;
            } else {
                // Check for fullscreen support by vendor prefix
                for (var i = 0, il = browserPrefixes.length; i < il; i++) {
                    fullscreen.prefix = browserPrefixes[i];

                    if (!_is.undefined(document[fullscreen.prefix + 'CancelFullScreen'])) {
                        fullscreen.supportsFullScreen = true;
                        break;
                    } else if (!_is.undefined(document.msExitFullscreen) && document.msFullscreenEnabled) {
                        // Special case for MS (when isn't it?)
                        fullscreen.prefix = 'ms';
                        fullscreen.supportsFullScreen = true;
                        break;
                    }
                }
            }

            // Update methods to do something useful
            if (fullscreen.supportsFullScreen) {
                // Yet again Microsoft awesomeness,
                // Sometimes the prefix is 'ms', sometimes 'MS' to keep you on your toes
                fullscreen.fullScreenEventName = fullscreen.prefix === 'ms' ? 'MSFullscreenChange' : fullscreen.prefix + 'fullscreenchange';

                fullscreen.isFullScreen = function (element) {
                    if (_is.undefined(element)) {
                        element = document.body;
                    }
                    switch (this.prefix) {
                        case '':
                            return document.fullscreenElement === element;
                        case 'moz':
                            return document.mozFullScreenElement === element;
                        default:
                            return document[this.prefix + 'FullscreenElement'] === element;
                    }
                };
                fullscreen.requestFullScreen = function (element) {
                    if (_is.undefined(element)) {
                        element = document.body;
                    }
                    return this.prefix === '' ? element.requestFullScreen() : element[this.prefix + (this.prefix === 'ms' ? 'RequestFullscreen' : 'RequestFullScreen')]();
                };
                fullscreen.cancelFullScreen = function () {
                    return this.prefix === '' ? document.cancelFullScreen() : document[this.prefix + (this.prefix === 'ms' ? 'ExitFullscreen' : 'CancelFullScreen')]();
                };
                fullscreen.element = function () {
                    return this.prefix === '' ? document.fullscreenElement : document[this.prefix + 'FullscreenElement'];
                };
            }

            return fullscreen;
        }

        // Local storage
        var _storage = {
            supported: function () {
                // Try to use it (it might be disabled, e.g. user is in private/porn mode)
                // see: https://github.com/sampotts/plyr/issues/131
                try {
                    // Add test item
                    window.localStorage.setItem('___test', 'OK');

                    // Get the test item
                    var result = window.localStorage.getItem('___test');

                    // Clean up
                    window.localStorage.removeItem('___test');

                    // Check if value matches
                    return result === 'OK';
                } catch (e) {
                    return false;
                }

                return false;
            }()
        };

        // Player instance
        function Plyr(media, config) {
            var plyr = this,
                timers = {},
                api;

            // Set media
            plyr.media = media;
            var original = media.cloneNode(true);

            // Trigger events, with plyr instance passed
            function _triggerEvent(element, type, bubbles, properties) {
                _event(element, type, bubbles, _extend({}, properties, {
                    plyr: api
                }));
            }

            // Debugging
            function _console(type, args) {
                if (config.debug && window.console) {
                    args = Array.prototype.slice.call(args);

                    if (_is.string(config.logPrefix) && config.logPrefix.length) {
                        args.unshift(config.logPrefix);
                    }

                    console[type].apply(console, args);
                }
            }

            var _log = function _log() {
                    _console('log', arguments);
                },
                _warn = function _warn() {
                    _console('warn', arguments);
                };

            // Log config options
            _log('Config', config);

            // Get icon URL
            function _getIconUrl() {
                return {
                    url: config.iconUrl,
                    // If you're using svg4everybody you don't need absolute paths
                    absolute: config.iconUrl.indexOf('http') === 0 || plyr.browser.isIE && !window.svg4everybody
                };
            }

            // Build the default HTML
            function _buildControls() {
                // Create html array
                var html = [],
                    iconUrl = _getIconUrl(),
                    iconPath = (!iconUrl.absolute ? iconUrl.url : '') + '#' + config.iconPrefix;

                // Larger overlaid play button
                if (_inArray(config.controls, 'play-large')) {
                    html.push('<button type="button" data-plyr="play" class="plyr__play-large">', '<svg><use xlink:href="' + iconPath + '-play" /></svg>', '<span class="plyr__sr-only">' + config.i18n.play + '</span>', '</button>');
                }

                html.push('<div class="plyr__controls">');

                // Restart button
                if (_inArray(config.controls, 'restart')) {
                    html.push('<button type="button" data-plyr="restart">', '<svg><use xlink:href="' + iconPath + '-restart" /></svg>', '<span class="plyr__sr-only">' + config.i18n.restart + '</span>', '</button>');
                }

                // Rewind button
                if (_inArray(config.controls, 'rewind')) {
                    html.push('<button type="button" data-plyr="rewind">', '<svg><use xlink:href="' + iconPath + '-rewind" /></svg>', '<span class="plyr__sr-only">' + config.i18n.rewind + '</span>', '</button>');
                }

                // Play Pause button
                // TODO: This should be a toggle button really?
                if (_inArray(config.controls, 'play')) {
                    html.push('<button type="button" data-plyr="play">', '<svg><use xlink:href="' + iconPath + '-play" /></svg>', '<span class="plyr__sr-only">' + config.i18n.play + '</span>', '</button>', '<button type="button" data-plyr="pause">', '<svg><use xlink:href="' + iconPath + '-pause" /></svg>', '<span class="plyr__sr-only">' + config.i18n.pause + '</span>', '</button>');
                }

                // Fast forward button
                if (_inArray(config.controls, 'fast-forward')) {
                    html.push('<button type="button" data-plyr="fast-forward">', '<svg><use xlink:href="' + iconPath + '-fast-forward" /></svg>', '<span class="plyr__sr-only">' + config.i18n.forward + '</span>', '</button>');
                }

                // Progress
                if (_inArray(config.controls, 'progress')) {
                    // Create progress
                    html.push('<span class="plyr__progress">', '<label for="seek{id}" class="plyr__sr-only">Seek</label>', '<input id="seek{id}" class="plyr__progress--seek" type="range" min="0" max="100" step="0.1" value="0" data-plyr="seek">', '<progress class="plyr__progress--played" max="100" value="0" role="presentation"></progress>', '<progress class="plyr__progress--buffer" max="100" value="0">', '<span>0</span>% ' + config.i18n.buffered, '</progress>');

                    // Seek tooltip
                    if (config.tooltips.seek) {
                        html.push('<span class="plyr__tooltip">00:00</span>');
                    }

                    // Close
                    html.push('</span>');
                }

                // Media current time display
                if (_inArray(config.controls, 'current-time')) {
                    html.push('<span class="plyr__time">', '<span class="plyr__sr-only">' + config.i18n.currentTime + '</span>', '<span class="plyr__time--current">00:00</span>', '</span>');
                }

                // Media duration display
                if (_inArray(config.controls, 'duration')) {
                    html.push('<span class="plyr__time">', '<span class="plyr__sr-only">' + config.i18n.duration + '</span>', '<span class="plyr__time--duration">00:00</span>', '</span>');
                }

                // Toggle mute button
                if (_inArray(config.controls, 'mute')) {
                    html.push('<button type="button" data-plyr="mute">', '<svg class="icon--muted"><use xlink:href="' + iconPath + '-muted" /></svg>', '<svg><use xlink:href="' + iconPath + '-volume" /></svg>', '<span class="plyr__sr-only">' + config.i18n.toggleMute + '</span>', '</button>');
                }

                // Volume range control
                if (_inArray(config.controls, 'volume')) {
                    html.push('<span class="plyr__volume">', '<label for="volume{id}" class="plyr__sr-only">' + config.i18n.volume + '</label>', '<input id="volume{id}" class="plyr__volume--input" type="range" min="' + config.volumeMin + '" max="' + config.volumeMax + '" value="' + config.volume + '" data-plyr="volume">', '<progress class="plyr__volume--display" max="' + config.volumeMax + '" value="' + config.volumeMin + '" role="presentation"></progress>', '</span>');
                }

                // Toggle captions button
                if (_inArray(config.controls, 'captions')) {
                    html.push('<button type="button" data-plyr="captions">', '<svg class="icon--captions-on"><use xlink:href="' + iconPath + '-captions-on" /></svg>', '<svg><use xlink:href="' + iconPath + '-captions-off" /></svg>', '<span class="plyr__sr-only">' + config.i18n.toggleCaptions + '</span>', '</button>');
                }

                // Toggle fullscreen button
                if (_inArray(config.controls, 'fullscreen')) {
                    html.push('<button type="button" data-plyr="fullscreen">', '<svg class="icon--exit-fullscreen"><use xlink:href="' + iconPath + '-exit-fullscreen" /></svg>', '<svg><use xlink:href="' + iconPath + '-enter-fullscreen" /></svg>', '<span class="plyr__sr-only">' + config.i18n.toggleFullscreen + '</span>', '</button>');
                }

                // Close everything
                html.push('</div>');

                return html.join('');
            }

            // Setup fullscreen
            function _setupFullscreen() {
                if (!plyr.supported.full) {
                    return;
                }

                if ((plyr.type !== 'audio' || config.fullscreen.allowAudio) && config.fullscreen.enabled) {
                    // Check for native support
                    var nativeSupport = fullscreen.supportsFullScreen;

                    if (nativeSupport || config.fullscreen.fallback && !_inFrame()) {
                        _log((nativeSupport ? 'Native' : 'Fallback') + ' fullscreen enabled');

                        // Add styling hook
                        if (!nativeSupport) {
                            _toggleClass(plyr.container, config.classes.fullscreen.fallback, true);
                        }

                        // Add styling hook
                        _toggleClass(plyr.container, config.classes.fullscreen.enabled, true);
                    } else {
                        _log('Fullscreen not supported and fallback disabled');
                    }

                    // Toggle state
                    if (plyr.buttons && plyr.buttons.fullscreen) {
                        _toggleState(plyr.buttons.fullscreen, false);
                    }

                    // Setup focus trap
                    _focusTrap();
                }
            }

            // Setup captions
            function _setupCaptions() {
                // Bail if not HTML5 video
                if (plyr.type !== 'video') {
                    return;
                }

                // Inject the container
                if (!_getElement(config.selectors.captions)) {
                    plyr.videoContainer.insertAdjacentHTML('afterbegin', '<div class="' + _getClassname(config.selectors.captions) + '"></div>');
                }

                // Determine if HTML5 textTracks is supported
                plyr.usingTextTracks = false;
                if (plyr.media.textTracks) {
                    plyr.usingTextTracks = true;
                }

                // Get URL of caption file if exists
                var captionSrc = '',
                    kind,
                    children = plyr.media.childNodes;

                for (var i = 0; i < children.length; i++) {
                    if (children[i].nodeName.toLowerCase() === 'track') {
                        kind = children[i].kind;
                        if (kind === 'captions' || kind === 'subtitles') {
                            captionSrc = children[i].getAttribute('src');
                        }
                    }
                }

                // Record if caption file exists or not
                plyr.captionExists = true;
                if (captionSrc === '') {
                    plyr.captionExists = false;
                    _log('No caption track found');
                } else {
                    _log('Caption track found; URI: ' + captionSrc);
                }

                // If no caption file exists, hide container for caption text
                if (!plyr.captionExists) {
                    _toggleClass(plyr.container, config.classes.captions.enabled);
                } else {
                    // Turn off native caption rendering to avoid double captions
                    // This doesn't seem to work in Safari 7+, so the <track> elements are removed from the dom below
                    var tracks = plyr.media.textTracks;
                    for (var x = 0; x < tracks.length; x++) {
                        tracks[x].mode = 'hidden';
                    }

                    // Enable UI
                    _showCaptions(plyr);

                    // Disable unsupported browsers than report false positive
                    // Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1033144
                    if (plyr.browser.isIE && plyr.browser.version >= 10 || plyr.browser.isFirefox && plyr.browser.version >= 31) {
                        // Debugging
                        _log('Detected browser with known TextTrack issues - using manual fallback');

                        // Set to false so skips to 'manual' captioning
                        plyr.usingTextTracks = false;
                    }

                    // Rendering caption tracks
                    // Native support required - http://caniuse.com/webvtt
                    if (plyr.usingTextTracks) {
                        _log('TextTracks supported');

                        for (var y = 0; y < tracks.length; y++) {
                            var track = tracks[y];

                            if (track.kind === 'captions' || track.kind === 'subtitles') {
                                _on(track, 'cuechange', function () {
                                    // Display a cue, if there is one
                                    if (this.activeCues[0] && 'text' in this.activeCues[0]) {
                                        _setCaption(this.activeCues[0].getCueAsHTML());
                                    } else {
                                        _setCaption();
                                    }
                                });
                            }
                        }
                    } else {
                        // Caption tracks not natively supported
                        _log('TextTracks not supported so rendering captions manually');

                        // Render captions from array at appropriate time
                        plyr.currentCaption = '';
                        plyr.captions = [];

                        if (captionSrc !== '') {
                            // Create XMLHttpRequest Object
                            var xhr = new XMLHttpRequest();

                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        var captions = [],
                                            caption,
                                            req = xhr.responseText;

                                        //According to webvtt spec, line terminator consists of one of the following
                                        // CRLF (U+000D U+000A), LF (U+000A) or CR (U+000D)
                                        var lineSeparator = '\r\n';
                                        if (req.indexOf(lineSeparator + lineSeparator) === -1) {
                                            if (req.indexOf('\r\r') !== -1) {
                                                lineSeparator = '\r';
                                            } else {
                                                lineSeparator = '\n';
                                            }
                                        }

                                        captions = req.split(lineSeparator + lineSeparator);

                                        for (var r = 0; r < captions.length; r++) {
                                            caption = captions[r];
                                            plyr.captions[r] = [];

                                            // Get the parts of the captions
                                            var parts = caption.split(lineSeparator),
                                                index = 0;

                                            // Incase caption numbers are added
                                            if (parts[index].indexOf(':') === -1) {
                                                index = 1;
                                            }

                                            plyr.captions[r] = [parts[index], parts[index + 1]];
                                        }

                                        // Remove first element ('VTT')
                                        plyr.captions.shift();

                                        _log('Successfully loaded the caption file via AJAX');
                                    } else {
                                        _warn(config.logPrefix + 'There was a problem loading the caption file via AJAX');
                                    }
                                }
                            };

                            xhr.open('get', captionSrc, true);

                            xhr.send();
                        }
                    }
                }
            }

            // Set the current caption
            function _setCaption(caption) {
                /* jshint unused:false */
                var container = _getElement(config.selectors.captions),
                    content = document.createElement('span');

                // Empty the container
                container.innerHTML = '';

                // Default to empty
                if (_is.undefined(caption)) {
                    caption = '';
                }

                // Set the span content
                if (_is.string(caption)) {
                    content.innerHTML = caption.trim();
                } else {
                    content.appendChild(caption);
                }

                // Set new caption text
                container.appendChild(content);

                // Force redraw (for Safari)
                var redraw = container.offsetHeight;
            }

            // Captions functions
            // Seek the manual caption time and update UI
            function _seekManualCaptions(time) {
                // Utilities for caption time codes
                function _timecodeCommon(tc, pos) {
                    var tcpair = [];
                    tcpair = tc.split(' --> ');
                    for (var i = 0; i < tcpair.length; i++) {
                        // WebVTT allows for extra meta data after the timestamp line
                        // So get rid of this if it exists
                        tcpair[i] = tcpair[i].replace(/(\d+:\d+:\d+\.\d+).*/, '$1');
                    }
                    return _subTcSecs(tcpair[pos]);
                }

                function _timecodeMin(tc) {
                    return _timecodeCommon(tc, 0);
                }

                function _timecodeMax(tc) {
                    return _timecodeCommon(tc, 1);
                }

                function _subTcSecs(tc) {
                    if (tc === null || tc === undefined) {
                        return 0;
                    } else {
                        var tc1 = [],
                            tc2 = [],
                            seconds;
                        tc1 = tc.split(',');
                        tc2 = tc1[0].split(':');
                        seconds = Math.floor(tc2[0] * 60 * 60) + Math.floor(tc2[1] * 60) + Math.floor(tc2[2]);
                        return seconds;
                    }
                }

                // If it's not video, or we're using textTracks, bail.
                if (plyr.usingTextTracks || plyr.type !== 'video' || !plyr.supported.full) {
                    return;
                }

                // Reset subcount
                plyr.subcount = 0;

                // Check time is a number, if not use currentTime
                // IE has a bug where currentTime doesn't go to 0
                // https://twitter.com/Sam_Potts/status/573715746506731521
                time = _is.number(time) ? time : plyr.media.currentTime;

                // If there's no subs available, bail
                if (!plyr.captions[plyr.subcount]) {
                    return;
                }

                while (_timecodeMax(plyr.captions[plyr.subcount][0]) < time.toFixed(1)) {
                    plyr.subcount++;
                    if (plyr.subcount > plyr.captions.length - 1) {
                        plyr.subcount = plyr.captions.length - 1;
                        break;
                    }
                }

                // Check if the next caption is in the current time range
                if (plyr.media.currentTime.toFixed(1) >= _timecodeMin(plyr.captions[plyr.subcount][0]) && plyr.media.currentTime.toFixed(1) <= _timecodeMax(plyr.captions[plyr.subcount][0])) {
                    plyr.currentCaption = plyr.captions[plyr.subcount][1];

                    // Render the caption
                    _setCaption(plyr.currentCaption);
                } else {
                    _setCaption();
                }
            }

            // Display captions container and button (for initialization)
            function _showCaptions() {
                // If there's no caption toggle, bail
                if (!plyr.buttons.captions) {
                    return;
                }

                _toggleClass(plyr.container, config.classes.captions.enabled, true);

                // Try to load the value from storage
                var active = plyr.storage.captionsEnabled;

                // Otherwise fall back to the default config
                if (!_is.boolean(active)) {
                    active = config.captions.defaultActive;
                }

                if (active) {
                    _toggleClass(plyr.container, config.classes.captions.active, true);
                    _toggleState(plyr.buttons.captions, true);
                }
            }

            // Find all elements
            function _getElements(selector) {
                return plyr.container.querySelectorAll(selector);
            }

            // Find a single element
            function _getElement(selector) {
                return _getElements(selector)[0];
            }

            // Determine if we're in an iframe
            function _inFrame() {
                try {
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            }

            // Trap focus inside container
            function _focusTrap() {
                var tabbables = _getElements('input:not([disabled]), button:not([disabled])'),
                    first = tabbables[0],
                    last = tabbables[tabbables.length - 1];

                function _checkFocus(event) {
                    // If it is TAB
                    if (event.which === 9 && plyr.isFullscreen) {
                        if (event.target === last && !event.shiftKey) {
                            // Move focus to first element that can be tabbed if Shift isn't used
                            event.preventDefault();
                            first.focus();
                        } else if (event.target === first && event.shiftKey) {
                            // Move focus to last element that can be tabbed if Shift is used
                            event.preventDefault();
                            last.focus();
                        }
                    }
                }

                // Bind the handler
                _on(plyr.container, 'keydown', _checkFocus);
            }

            // Add elements to HTML5 media (source, tracks, etc)
            function _insertChildElements(type, attributes) {
                if (_is.string(attributes)) {
                    _insertElement(type, plyr.media, {src: attributes});
                } else if (attributes.constructor === Array) {
                    for (var i = attributes.length - 1; i >= 0; i--) {
                        _insertElement(type, plyr.media, attributes[i]);
                    }
                }
            }

            // Insert controls
            function _injectControls() {
                // Sprite
                if (config.loadSprite) {
                    var iconUrl = _getIconUrl();

                    // Only load external sprite using AJAX
                    if (iconUrl.absolute) {
                        _log('AJAX loading absolute SVG sprite' + (plyr.browser.isIE ? ' (due to IE)' : ''));
                        loadSprite(iconUrl.url, 'sprite-plyr');
                    } else {
                        _log('Sprite will be used as external resource directly');
                    }
                }

                // Make a copy of the html
                var html = config.html;

                // Insert custom video controls
                _log('Injecting custom controls');

                // If no controls are specified, create default
                if (!html) {
                    html = _buildControls();
                }

                // Replace seek time instances
                html = _replaceAll(html, '{seektime}', config.seekTime);

                // Replace all id references with random numbers
                html = _replaceAll(html, '{id}', Math.floor(Math.random() * 10000));

                // Replace Title, if it exists
                if (config.title) {
                    html = _replaceAll(html, '{title}', config.title);
                }

                // Controls container
                var target;

                // Inject to custom location
                if (_is.string(config.selectors.controls.container)) {
                    target = document.querySelector(config.selectors.controls.container);
                }

                // Inject into the container by default
                if (!_is.htmlElement(target)) {
                    target = plyr.container;
                }

                // Inject controls HTML
                target.insertAdjacentHTML('beforeend', html);

                // Setup tooltips
                if (config.tooltips.controls) {
                    var labels = _getElements([config.selectors.controls.wrapper, ' ', config.selectors.labels, ' .', config.classes.hidden].join(''));

                    for (var i = labels.length - 1; i >= 0; i--) {
                        var label = labels[i];

                        _toggleClass(label, config.classes.hidden, false);
                        _toggleClass(label, config.classes.tooltip, true);
                    }
                }
            }

            // Find the UI controls and store references
            function _findElements() {
                try {
                    plyr.controls = _getElement(config.selectors.controls.wrapper);

                    // Buttons
                    plyr.buttons = {};
                    plyr.buttons.seek = _getElement(config.selectors.buttons.seek);
                    plyr.buttons.play = _getElements(config.selectors.buttons.play);
                    plyr.buttons.pause = _getElement(config.selectors.buttons.pause);
                    plyr.buttons.restart = _getElement(config.selectors.buttons.restart);
                    plyr.buttons.rewind = _getElement(config.selectors.buttons.rewind);
                    plyr.buttons.forward = _getElement(config.selectors.buttons.forward);
                    plyr.buttons.fullscreen = _getElement(config.selectors.buttons.fullscreen);

                    // Inputs
                    plyr.buttons.mute = _getElement(config.selectors.buttons.mute);
                    plyr.buttons.captions = _getElement(config.selectors.buttons.captions);

                    // Progress
                    plyr.progress = {};
                    plyr.progress.container = _getElement(config.selectors.progress.container);

                    // Progress - Buffering
                    plyr.progress.buffer = {};
                    plyr.progress.buffer.bar = _getElement(config.selectors.progress.buffer);
                    plyr.progress.buffer.text = plyr.progress.buffer.bar && plyr.progress.buffer.bar.getElementsByTagName('span')[0];

                    // Progress - Played
                    plyr.progress.played = _getElement(config.selectors.progress.played);

                    // Seek tooltip
                    plyr.progress.tooltip = plyr.progress.container && plyr.progress.container.querySelector('.' + config.classes.tooltip);

                    // Volume
                    plyr.volume = {};
                    plyr.volume.input = _getElement(config.selectors.volume.input);
                    plyr.volume.display = _getElement(config.selectors.volume.display);

                    // Timing
                    plyr.duration = _getElement(config.selectors.duration);
                    plyr.currentTime = _getElement(config.selectors.currentTime);
                    plyr.seekTime = _getElements(config.selectors.seekTime);

                    return true;
                } catch (e) {
                    _warn('It looks like there is a problem with your controls HTML');

                    // Restore native video controls
                    _toggleNativeControls(true);

                    return false;
                }
            }

            // Toggle style hook
            function _toggleStyleHook() {
                _toggleClass(plyr.container, config.selectors.container.replace('.', ''), plyr.supported.full);
            }

            // Toggle native controls
            function _toggleNativeControls(toggle) {
                if (toggle && _inArray(config.types.html5, plyr.type)) {
                    plyr.media.setAttribute('controls', '');
                } else {
                    plyr.media.removeAttribute('controls');
                }
            }

            // Setup aria attribute for play and iframe title
            function _setTitle(iframe) {
                // Find the current text
                var label = config.i18n.play;

                // If there's a media title set, use that for the label
                if (_is.string(config.title) && config.title.length) {
                    label += ', ' + config.title;

                    // Set container label
                    plyr.container.setAttribute('aria-label', config.title);
                }

                // If there's a play button, set label
                if (plyr.supported.full && plyr.buttons.play) {
                    for (var i = plyr.buttons.play.length - 1; i >= 0; i--) {
                        plyr.buttons.play[i].setAttribute('aria-label', label);
                    }
                }

                // Set iframe title
                // https://github.com/sampotts/plyr/issues/124
                if (_is.htmlElement(iframe)) {
                    iframe.setAttribute('title', config.i18n.frameTitle.replace('{title}', config.title));
                }
            }

            // Setup localStorage
            function _setupStorage() {
                var value = null;
                plyr.storage = {};

                // Bail if we don't have localStorage support or it's disabled
                if (!_storage.supported || !config.storage.enabled) {
                    return;
                }

                // Clean up old volume
                // https://github.com/sampotts/plyr/issues/171
                window.localStorage.removeItem('plyr-volume');

                // load value from the current key
                value = window.localStorage.getItem(config.storage.key);

                if (!value) {
                    // Key wasn't set (or had been cleared), move along
                    return;
                } else if (/^\d+(\.\d+)?$/.test(value)) {
                    // If value is a number, it's probably volume from an older
                    // version of plyr. See: https://github.com/sampotts/plyr/pull/313
                    // Update the key to be JSON
                    _updateStorage({volume: parseFloat(value)});
                } else {
                    // Assume it's JSON from this or a later version of plyr
                    plyr.storage = JSON.parse(value);
                }
            }

            // Save a value back to local storage
            function _updateStorage(value) {
                // Bail if we don't have localStorage support or it's disabled
                if (!_storage.supported || !config.storage.enabled) {
                    return;
                }

                // Update the working copy of the values
                _extend(plyr.storage, value);

                // Update storage
                window.localStorage.setItem(config.storage.key, JSON.stringify(plyr.storage));
            }

            // Setup media
            function _setupMedia() {
                // If there's no media, bail
                if (!plyr.media) {
                    _warn('No media element found!');
                    return;
                }

                if (plyr.supported.full) {
                    // Add type class
                    _toggleClass(plyr.container, config.classes.type.replace('{0}', plyr.type), true);

                    // Add video class for embeds
                    // This will require changes if audio embeds are added
                    if (_inArray(config.types.embed, plyr.type)) {
                        _toggleClass(plyr.container, config.classes.type.replace('{0}', 'video'), true);
                    }

                    // If there's no autoplay attribute, assume the video is stopped and add state class
                    _toggleClass(plyr.container, config.classes.stopped, config.autoplay);

                    // Add iOS class
                    _toggleClass(plyr.container, config.classes.isIos, plyr.browser.isIos);

                    // Add touch class
                    _toggleClass(plyr.container, config.classes.isTouch, plyr.browser.isTouch);

                    // Inject the player wrapper
                    if (plyr.type === 'video') {
                        // Create the wrapper div
                        var wrapper = document.createElement('div');
                        wrapper.setAttribute('class', config.classes.videoWrapper);

                        // Wrap the video in a container
                        _wrap(plyr.media, wrapper);

                        // Cache the container
                        plyr.videoContainer = wrapper;
                    }
                }

                // Embeds
                if (_inArray(config.types.embed, plyr.type)) {
                    _setupEmbed();
                }
            }

            // Setup YouTube/Vimeo
            function _setupEmbed() {
                var container = document.createElement('div'),
                    mediaId,
                    id = plyr.type + '-' + Math.floor(Math.random() * 10000);

                // Parse IDs from URLs if supplied
                switch (plyr.type) {
                    case 'youtube':
                        mediaId = _parseYouTubeId(plyr.embedId);
                        break;

                    case 'vimeo':
                        mediaId = _parseVimeoId(plyr.embedId);
                        break;

                    default:
                        mediaId = plyr.embedId;
                }

                // Remove old containers
                var containers = _getElements('[id^="' + plyr.type + '-"]');
                for (var i = containers.length - 1; i >= 0; i--) {
                    _remove(containers[i]);
                }

                // Add embed class for responsive
                _toggleClass(plyr.media, config.classes.videoWrapper, true);
                _toggleClass(plyr.media, config.classes.embedWrapper, true);

                if (plyr.type === 'youtube') {
                    // Create the YouTube container
                    plyr.media.appendChild(container);

                    // Set ID
                    container.setAttribute('id', id);

                    // Setup API
                    if (_is.object(window.YT)) {
                        _youTubeReady(mediaId, container);
                    } else {
                        // Load the API
                        _injectScript(config.urls.youtube.api);

                        // Setup callback for the API
                        window.onYouTubeReadyCallbacks = window.onYouTubeReadyCallbacks || [];

                        // Add to queue
                        window.onYouTubeReadyCallbacks.push(function () {
                            _youTubeReady(mediaId, container);
                        });

                        // Set callback to process queue
                        window.onYouTubeIframeAPIReady = function () {
                            window.onYouTubeReadyCallbacks.forEach(function (callback) {
                                callback();
                            });
                        };
                    }
                } else if (plyr.type === 'vimeo') {
                    // Vimeo needs an extra div to hide controls on desktop (which has full support)
                    if (plyr.supported.full) {
                        plyr.media.appendChild(container);
                    } else {
                        container = plyr.media;
                    }

                    // Set ID
                    container.setAttribute('id', id);

                    // Load the API if not already
                    if (!_is.object(window.Vimeo)) {
                        _injectScript(config.urls.vimeo.api);

                        // Wait for fragaloop load
                        var vimeoTimer = window.setInterval(function () {
                            if (_is.object(window.Vimeo)) {
                                window.clearInterval(vimeoTimer);
                                _vimeoReady(mediaId, container);
                            }
                        }, 50);
                    } else {
                        _vimeoReady(mediaId, container);
                    }
                } else if (plyr.type === 'soundcloud') {
                    // TODO: Currently unsupported and undocumented
                    // Inject the iframe
                    var soundCloud = document.createElement('iframe');

                    // Watch for iframe load
                    soundCloud.loaded = false;
                    _on(soundCloud, 'load', function () {
                        soundCloud.loaded = true;
                    });

                    _setAttributes(soundCloud, {
                        src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + mediaId,
                        id: id
                    });

                    container.appendChild(soundCloud);
                    plyr.media.appendChild(container);

                    // Load the API if not already
                    if (!window.SC) {
                        _injectScript(config.urls.soundcloud.api);
                    }

                    // Wait for SC load
                    var soundCloudTimer = window.setInterval(function () {
                        if (window.SC && soundCloud.loaded) {
                            window.clearInterval(soundCloudTimer);
                            _soundcloudReady.call(soundCloud);
                        }
                    }, 50);
                }
            }

            // When embeds are ready
            function _embedReady() {
                // Setup the UI and call ready if full support
                if (plyr.supported.full) {
                    _setupInterface();
                    _ready();
                }

                // Set title
                _setTitle(_getElement('iframe'));
            }

            // Handle YouTube API ready
            function _youTubeReady(videoId, container) {
                // Setup instance
                // https://developers.google.com/youtube/iframe_api_reference
                plyr.embed = new window.YT.Player(container.id, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: config.autoplay ? 1 : 0,
                        controls: plyr.supported.full ? 0 : 1,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        cc_load_policy: config.captions.defaultActive ? 1 : 0,
                        cc_lang_pref: 'en',
                        wmode: 'transparent',
                        modestbranding: 1,
                        disablekb: 1,
                        origin: '*' // https://code.google.com/p/gdata-issues/issues/detail?id=5788#c45
                    },
                    events: {
                        onError: function onError(event) {
                            _triggerEvent(plyr.container, 'error', true, {
                                code: event.data,
                                embed: event.target
                            });
                        },
                        onReady: function onReady(event) {
                            // Get the instance
                            var instance = event.target;

                            // Create a faux HTML5 API using the YouTube API
                            plyr.media.play = function () {
                                instance.playVideo();
                                plyr.media.paused = false;
                            };
                            plyr.media.pause = function () {
                                instance.pauseVideo();
                                plyr.media.paused = true;
                            };
                            plyr.media.stop = function () {
                                instance.stopVideo();
                                plyr.media.paused = true;
                            };
                            plyr.media.duration = instance.getDuration();
                            plyr.media.paused = true;
                            plyr.media.currentTime = 0;
                            plyr.media.muted = instance.isMuted();

                            // Set title if possible
                            if (typeof instance.getVideoData === 'function') {
                                config.title = instance.getVideoData().title;
                            }

                            // Set the tabindex
                            if (plyr.supported.full) {
                                plyr.media.querySelector('iframe').setAttribute('tabindex', '-1');
                            }

                            // Update UI
                            _embedReady();

                            // Trigger timeupdate
                            _triggerEvent(plyr.media, 'timeupdate');

                            // Trigger timeupdate
                            _triggerEvent(plyr.media, 'durationchange');

                            // Reset timer
                            window.clearInterval(timers.buffering);

                            // Setup buffering
                            timers.buffering = window.setInterval(function () {
                                // Get loaded % from YouTube
                                plyr.media.buffered = instance.getVideoLoadedFraction();

                                // Trigger progress only when we actually buffer something
                                if (plyr.media.lastBuffered === null || plyr.media.lastBuffered < plyr.media.buffered) {
                                    _triggerEvent(plyr.media, 'progress');
                                }

                                // Set last buffer point
                                plyr.media.lastBuffered = plyr.media.buffered;

                                // Bail if we're at 100%
                                if (plyr.media.buffered === 1) {
                                    window.clearInterval(timers.buffering);

                                    // Trigger event
                                    _triggerEvent(plyr.media, 'canplaythrough');
                                }
                            }, 200);
                        },
                        onStateChange: function onStateChange(event) {
                            // Get the instance
                            var instance = event.target;

                            // Reset timer
                            window.clearInterval(timers.playing);

                            // Handle events
                            // -1   Unstarted
                            // 0    Ended
                            // 1    Playing
                            // 2    Paused
                            // 3    Buffering
                            // 5    Video cued
                            switch (event.data) {
                                case 0:
                                    plyr.media.paused = true;
                                    _triggerEvent(plyr.media, 'ended');
                                    break;

                                case 1:
                                    plyr.media.paused = false;

                                    // If we were seeking, fire seeked event
                                    if (plyr.media.seeking) {
                                        _triggerEvent(plyr.media, 'seeked');
                                    }

                                    plyr.media.seeking = false;
                                    _triggerEvent(plyr.media, 'play');
                                    _triggerEvent(plyr.media, 'playing');

                                    // Poll to get playback progress
                                    timers.playing = window.setInterval(function () {
                                        // Set the current time
                                        plyr.media.currentTime = instance.getCurrentTime();

                                        // Trigger timeupdate
                                        _triggerEvent(plyr.media, 'timeupdate');
                                    }, 100);

                                    // Check duration again due to YouTube bug
                                    // https://github.com/sampotts/plyr/issues/374
                                    // https://code.google.com/p/gdata-issues/issues/detail?id=8690
                                    if (plyr.media.duration !== instance.getDuration()) {
                                        plyr.media.duration = instance.getDuration();
                                        _triggerEvent(plyr.media, 'durationchange');
                                    }

                                    break;

                                case 2:
                                    plyr.media.paused = true;
                                    _triggerEvent(plyr.media, 'pause');
                                    break;
                            }

                            _triggerEvent(plyr.container, 'statechange', false, {
                                code: event.data
                            });
                        }
                    }
                });
            }

            // Vimeo ready
            function _vimeoReady(mediaId, container) {
                // Setup instance
                // https://github.com/vimeo/player.js

                var options = {
                    loop: config.loop,
                    autoplay: config.autoplay,
                    byline: false,
                    portrait: false,
                    title: false,
                    speed: true,
                    transparent: 0
                };

                // Convert options into URL params for iframe
                function buildUrlParameters(options) {
                    return Object.keys(options).map(function (key) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
                    }).join('&');
                }

                // Get Vimeo params for the iframe
                var params = buildUrlParameters(options);

                // Build an iframe
                var iframe = document.createElement('iframe');
                var src = 'https://player.vimeo.com/video/' + mediaId + '?' + params;
                iframe.setAttribute('src', src);
                iframe.setAttribute('allowfullscreen', '');
                container.appendChild(iframe);

                plyr.embed = new window.Vimeo.Player(iframe);

                // Create a faux HTML5 API using the Vimeo API
                plyr.media.play = function () {
                    plyr.embed.play();
                    plyr.media.paused = false;
                };
                plyr.media.pause = function () {
                    plyr.embed.pause();
                    plyr.media.paused = true;
                };
                plyr.media.stop = function () {
                    plyr.embed.stop();
                    plyr.media.paused = true;
                };

                plyr.media.paused = true;
                plyr.media.currentTime = 0;

                // Update UI
                _embedReady();

                plyr.embed.getCurrentTime().then(function (value) {
                    plyr.media.currentTime = value;

                    // Trigger timeupdate
                    _triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.getDuration().then(function (value) {
                    plyr.media.duration = value;

                    // Trigger timeupdate
                    _triggerEvent(plyr.media, 'durationchange');
                });

                // TODO: Captions
                /*if (config.captions.defaultActive) {
                plyr.embed.enableTextTrack('en');
            }*/

                plyr.embed.on('loaded', function () {
                    // Fix keyboard focus issues
                    // https://github.com/sampotts/plyr/issues/317
                    if (_is.htmlElement(plyr.embed.element) && plyr.supported.full) {
                        plyr.embed.element.setAttribute('tabindex', '-1');
                    }
                });

                plyr.embed.on('play', function () {
                    plyr.media.paused = false;
                    _triggerEvent(plyr.media, 'play');
                    _triggerEvent(plyr.media, 'playing');
                });

                plyr.embed.on('pause', function () {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'pause');
                });

                plyr.embed.on('timeupdate', function (data) {
                    plyr.media.seeking = false;
                    plyr.media.currentTime = data.seconds;
                    _triggerEvent(plyr.media, 'timeupdate');
                });

                plyr.embed.on('progress', function (data) {
                    plyr.media.buffered = data.percent;
                    _triggerEvent(plyr.media, 'progress');

                    if (parseInt(data.percent) === 1) {
                        // Trigger event
                        _triggerEvent(plyr.media, 'canplaythrough');
                    }
                });

                plyr.embed.on('seeked', function () {
                    plyr.media.seeking = false;
                    _triggerEvent(plyr.media, 'seeked');
                    _triggerEvent(plyr.media, 'play');
                });

                plyr.embed.on('ended', function () {
                    plyr.media.paused = true;
                    _triggerEvent(plyr.media, 'ended');
                });
            }

            // Soundcloud ready
            function _soundcloudReady() {
                /* jshint validthis: true */
                plyr.embed = window.SC.Widget(this);

                // Setup on ready
                plyr.embed.bind(window.SC.Widget.Events.READY, function () {
                    // Create a faux HTML5 API using the Soundcloud API
                    plyr.media.play = function () {
                        plyr.embed.play();
                        plyr.media.paused = false;
                    };
                    plyr.media.pause = function () {
                        plyr.embed.pause();
                        plyr.media.paused = true;
                    };
                    plyr.media.stop = function () {
                        plyr.embed.seekTo(0);
                        plyr.embed.pause();
                        plyr.media.paused = true;
                    };

                    plyr.media.paused = true;
                    plyr.media.currentTime = 0;

                    plyr.embed.getDuration(function (value) {
                        plyr.media.duration = value / 1000;

                        // Update UI
                        _embedReady();
                    });

                    plyr.embed.getPosition(function (value) {
                        plyr.media.currentTime = value;

                        // Trigger timeupdate
                        _triggerEvent(plyr.media, 'timeupdate');
                    });

                    plyr.embed.bind(window.SC.Widget.Events.PLAY, function () {
                        plyr.media.paused = false;
                        _triggerEvent(plyr.media, 'play');
                        _triggerEvent(plyr.media, 'playing');
                    });

                    plyr.embed.bind(window.SC.Widget.Events.PAUSE, function () {
                        plyr.media.paused = true;
                        _triggerEvent(plyr.media, 'pause');
                    });

                    plyr.embed.bind(window.SC.Widget.Events.PLAY_PROGRESS, function (data) {
                        plyr.media.seeking = false;
                        plyr.media.currentTime = data.currentPosition / 1000;
                        _triggerEvent(plyr.media, 'timeupdate');
                    });

                    plyr.embed.bind(window.SC.Widget.Events.LOAD_PROGRESS, function (data) {
                        plyr.media.buffered = data.loadProgress;
                        _triggerEvent(plyr.media, 'progress');

                        if (parseInt(data.loadProgress) === 1) {
                            // Trigger event
                            _triggerEvent(plyr.media, 'canplaythrough');
                        }
                    });

                    plyr.embed.bind(window.SC.Widget.Events.FINISH, function () {
                        plyr.media.paused = true;
                        _triggerEvent(plyr.media, 'ended');
                    });
                });
            }

            // Play media
            function _play() {
                if ('play' in plyr.media) {
                    plyr.media.play();
                }
            }

            // Pause media
            function _pause() {
                if ('pause' in plyr.media) {
                    plyr.media.pause();
                }
            }

            // Toggle playback
            function _togglePlay(toggle) {
                // True toggle
                if (!_is.boolean(toggle)) {
                    toggle = plyr.media.paused;
                }

                if (toggle) {
                    _play();
                } else {
                    _pause();
                }

                return toggle;
            }

            // Rewind
            function _rewind(seekTime) {
                // Use default if needed
                if (!_is.number(seekTime)) {
                    seekTime = config.seekTime;
                }
                _seek(plyr.media.currentTime - seekTime);
            }

            // Fast forward
            function _forward(seekTime) {
                // Use default if needed
                if (!_is.number(seekTime)) {
                    seekTime = config.seekTime;
                }
                _seek(plyr.media.currentTime + seekTime);
            }

            // Seek to time
            // The input parameter can be an event or a number
            function _seek(input) {
                var targetTime = 0,
                    paused = plyr.media.paused,
                    duration = _getDuration();

                if (_is.number(input)) {
                    targetTime = input;
                } else if (_is.object(input) && _inArray(['input', 'change'], input.type)) {
                    // It's the seek slider
                    // Seek to the selected time
                    targetTime = input.target.value / input.target.max * duration;
                }

                // Normalise targetTime
                if (targetTime < 0) {
                    targetTime = 0;
                } else if (targetTime > duration) {
                    targetTime = duration;
                }

                // Update seek range and progress
                _updateSeekDisplay(targetTime);

                // Set the current time
                // Try/catch incase the media isn't set and we're calling seek() from source() and IE moans
                try {
                    plyr.media.currentTime = targetTime.toFixed(4);
                } catch (e) {
                }

                // Embeds
                if (_inArray(config.types.embed, plyr.type)) {
                    switch (plyr.type) {
                        case 'youtube':
                            plyr.embed.seekTo(targetTime);
                            break;

                        case 'vimeo':
                            // Round to nearest second for vimeo
                            plyr.embed.setCurrentTime(targetTime.toFixed(0));
                            break;

                        case 'soundcloud':
                            plyr.embed.seekTo(targetTime * 1000);
                            break;
                    }

                    if (paused) {
                        _pause();
                    }

                    // Trigger timeupdate
                    _triggerEvent(plyr.media, 'timeupdate');

                    // Set seeking flag
                    plyr.media.seeking = true;

                    // Trigger seeking
                    _triggerEvent(plyr.media, 'seeking');
                }

                // Logging
                _log('Seeking to ' + plyr.media.currentTime + ' seconds');

                // Special handling for 'manual' captions
                _seekManualCaptions(targetTime);
            }

            // Get the duration (or custom if set)
            function _getDuration() {
                // It should be a number, but parse it just incase
                var duration = parseInt(config.duration),

                    // True duration
                    mediaDuration = 0;

                // Only if duration available
                if (plyr.media.duration !== null && !isNaN(plyr.media.duration)) {
                    mediaDuration = plyr.media.duration;
                }

                // If custom duration is funky, use regular duration
                return isNaN(duration) ? mediaDuration : duration;
            }

            // Check playing state
            function _checkPlaying() {
                _toggleClass(plyr.container, config.classes.playing, !plyr.media.paused);

                _toggleClass(plyr.container, config.classes.stopped, plyr.media.paused);

                _toggleControls(plyr.media.paused);
            }

            // Save scroll position
            function _saveScrollPosition() {
                scroll = {
                    x: window.pageXOffset || 0,
                    y: window.pageYOffset || 0
                };
            }

            // Restore scroll position
            function _restoreScrollPosition() {
                window.scrollTo(scroll.x, scroll.y);
            }

            // Toggle fullscreen
            function _toggleFullscreen(event) {
                // We don't allow fullscreen on audio player
                if (plyr.type === 'audio') {
                    return;
                }

                // Check for native support
                var nativeSupport = fullscreen.supportsFullScreen;

                if (nativeSupport) {
                    // If it's a fullscreen change event, update the UI
                    if (event && event.type === fullscreen.fullScreenEventName) {
                        plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);
                    } else {
                        // Else it's a user request to enter or exit
                        if (!fullscreen.isFullScreen(plyr.container)) {
                            // Save scroll position
                            _saveScrollPosition();

                            // Request full screen
                            fullscreen.requestFullScreen(plyr.container);
                        } else {
                            // Bail from fullscreen
                            fullscreen.cancelFullScreen();
                        }

                        // Check if we're actually full screen (it could fail)
                        plyr.isFullscreen = fullscreen.isFullScreen(plyr.container);

                        return;
                    }
                } else {
                    // Otherwise, it's a simple toggle
                    plyr.isFullscreen = !plyr.isFullscreen;

                    // Bind/unbind escape key
                    document.body.style.overflow = plyr.isFullscreen ? 'hidden' : '';
                }

                // Set class hook
                _toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);

                // Trap focus
                _focusTrap(plyr.isFullscreen);

                // Set button state
                if (plyr.buttons && plyr.buttons.fullscreen) {
                    _toggleState(plyr.buttons.fullscreen, plyr.isFullscreen);
                }

                // Trigger an event
                _triggerEvent(plyr.container, plyr.isFullscreen ? 'enterfullscreen' : 'exitfullscreen', true);

                // Restore scroll position
                if (!plyr.isFullscreen && nativeSupport) {
                    _restoreScrollPosition();
                }
            }

            // Mute
            function _toggleMute(muted) {
                // If the method is called without parameter, toggle based on current value
                if (!_is.boolean(muted)) {
                    muted = !plyr.media.muted;
                }

                // Set button state
                _toggleState(plyr.buttons.mute, muted);

                // Set mute on the player
                plyr.media.muted = muted;

                // If volume is 0 after unmuting, set to default
                if (plyr.media.volume === 0) {
                    _setVolume(config.volume);
                }

                // Embeds
                if (_inArray(config.types.embed, plyr.type)) {
                    // YouTube
                    switch (plyr.type) {
                        case 'youtube':
                            plyr.embed[plyr.media.muted ? 'mute' : 'unMute']();
                            break;

                        case 'vimeo':
                        case 'soundcloud':
                            plyr.embed.setVolume(plyr.media.muted ? 0 : parseFloat(config.volume / config.volumeMax));
                            break;
                    }

                    // Trigger volumechange for embeds
                    _triggerEvent(plyr.media, 'volumechange');
                }
            }

            // Set volume
            function _setVolume(volume) {
                var max = config.volumeMax,
                    min = config.volumeMin;

                // Load volume from storage if no value specified
                if (_is.undefined(volume)) {
                    volume = plyr.storage.volume;
                }

                // Use config if all else fails
                if (volume === null || isNaN(volume)) {
                    volume = config.volume;
                }

                // Maximum is volumeMax
                if (volume > max) {
                    volume = max;
                }
                // Minimum is volumeMin
                if (volume < min) {
                    volume = min;
                }

                // Set the player volume
                plyr.media.volume = parseFloat(volume / max);

                // Set the display
                if (plyr.volume.display) {
                    plyr.volume.display.value = volume;
                }

                // Embeds
                if (_inArray(config.types.embed, plyr.type)) {
                    switch (plyr.type) {
                        case 'youtube':
                            plyr.embed.setVolume(plyr.media.volume * 100);
                            break;

                        case 'vimeo':
                        case 'soundcloud':
                            plyr.embed.setVolume(plyr.media.volume);
                            break;
                    }

                    // Trigger volumechange for embeds
                    _triggerEvent(plyr.media, 'volumechange');
                }

                // Toggle muted state
                if (volume === 0) {
                    plyr.media.muted = true;
                } else if (plyr.media.muted && volume > 0) {
                    _toggleMute();
                }
            }

            // Increase volume
            function _increaseVolume(step) {
                var volume = plyr.media.muted ? 0 : plyr.media.volume * config.volumeMax;

                if (!_is.number(step)) {
                    step = config.volumeStep;
                }

                _setVolume(volume + step);
            }

            // Decrease volume
            function _decreaseVolume(step) {
                var volume = plyr.media.muted ? 0 : plyr.media.volume * config.volumeMax;

                if (!_is.number(step)) {
                    step = config.volumeStep;
                }

                _setVolume(volume - step);
            }

            // Update volume UI and storage
            function _updateVolume() {
                // Get the current volume
                var volume = plyr.media.muted ? 0 : plyr.media.volume * config.volumeMax;

                // Update the <input type="range"> if present
                if (plyr.supported.full) {
                    if (plyr.volume.input) {
                        plyr.volume.input.value = volume;
                    }
                    if (plyr.volume.display) {
                        plyr.volume.display.value = volume;
                    }
                }

                // Update the volume in storage
                _updateStorage({volume: volume});

                // Toggle class if muted
                _toggleClass(plyr.container, config.classes.muted, volume === 0);

                // Update checkbox for mute state
                if (plyr.supported.full && plyr.buttons.mute) {
                    _toggleState(plyr.buttons.mute, volume === 0);
                }
            }

            // Toggle captions
            function _toggleCaptions(show) {
                // If there's no full support, or there's no caption toggle
                if (!plyr.supported.full || !plyr.buttons.captions) {
                    return;
                }

                // If the method is called without parameter, toggle based on current value
                if (!_is.boolean(show)) {
                    show = plyr.container.className.indexOf(config.classes.captions.active) === -1;
                }

                // Set global
                plyr.captionsEnabled = show;

                // Toggle state
                _toggleState(plyr.buttons.captions, plyr.captionsEnabled);

                // Add class hook
                _toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);

                // Trigger an event
                _triggerEvent(plyr.container, plyr.captionsEnabled ? 'captionsenabled' : 'captionsdisabled', true);

                // Save captions state to localStorage
                _updateStorage({captionsEnabled: plyr.captionsEnabled});
            }

            // Check if media is loading
            function _checkLoading(event) {
                var loading = event.type === 'waiting';

                // Clear timer
                clearTimeout(timers.loading);

                // Timer to prevent flicker when seeking
                timers.loading = setTimeout(function () {
                    // Toggle container class hook
                    _toggleClass(plyr.container, config.classes.loading, loading);

                    // Show controls if loading, hide if done
                    _toggleControls(loading);
                }, loading ? 250 : 0);
            }

            // Update <progress> elements
            function _updateProgress(event) {
                if (!plyr.supported.full) {
                    return;
                }

                var progress = plyr.progress.played,
                    value = 0,
                    duration = _getDuration();

                if (event) {
                    switch (event.type) {
                        // Video playing
                        case 'timeupdate':
                        case 'seeking':
                            if (plyr.controls.pressed) {
                                return;
                            }

                            value = _getPercentage(plyr.media.currentTime, duration);

                            // Set seek range value only if it's a 'natural' time event
                            if (event.type === 'timeupdate' && plyr.buttons.seek) {
                                plyr.buttons.seek.value = value;
                            }

                            break;

                        // Check buffer status
                        case 'playing':
                        case 'progress':
                            progress = plyr.progress.buffer;
                            value = function () {
                                var buffered = plyr.media.buffered;

                                if (buffered && buffered.length) {
                                    // HTML5
                                    return _getPercentage(buffered.end(0), duration);
                                } else if (_is.number(buffered)) {
                                    // YouTube returns between 0 and 1
                                    return buffered * 100;
                                }

                                return 0;
                            }();

                            break;
                    }
                }

                // Set values
                _setProgress(progress, value);
            }

            // Set <progress> value
            function _setProgress(progress, value) {
                if (!plyr.supported.full) {
                    return;
                }

                // Default to 0
                if (_is.undefined(value)) {
                    value = 0;
                }
                // Default to buffer or bail
                if (_is.undefined(progress)) {
                    if (plyr.progress && plyr.progress.buffer) {
                        progress = plyr.progress.buffer;
                    } else {
                        return;
                    }
                }

                // One progress element passed
                if (_is.htmlElement(progress)) {
                    progress.value = value;
                } else if (progress) {
                    // Object of progress + text element
                    if (progress.bar) {
                        progress.bar.value = value;
                    }
                    if (progress.text) {
                        progress.text.innerHTML = value;
                    }
                }
            }

            // Update the displayed time
            function _updateTimeDisplay(time, element) {
                // Bail if there's no duration display
                if (!element) {
                    return;
                }

                // Fallback to 0
                if (isNaN(time)) {
                    time = 0;
                }

                plyr.secs = parseInt(time % 60);
                plyr.mins = parseInt(time / 60 % 60);
                plyr.hours = parseInt(time / 60 / 60 % 60);

                // Do we need to display hours?
                var displayHours = parseInt(_getDuration() / 60 / 60 % 60) > 0;

                // Ensure it's two digits. For example, 03 rather than 3.
                plyr.secs = ('0' + plyr.secs).slice(-2);
                plyr.mins = ('0' + plyr.mins).slice(-2);

                // Render
                element.innerHTML = (displayHours ? plyr.hours + ':' : '') + plyr.mins + ':' + plyr.secs;
            }

            // Show the duration on metadataloaded
            function _displayDuration() {
                if (!plyr.supported.full) {
                    return;
                }

                // Determine duration
                var duration = _getDuration() || 0;

                // If there's only one time display, display duration there
                if (!plyr.duration && config.displayDuration && plyr.media.paused) {
                    _updateTimeDisplay(duration, plyr.currentTime);
                }

                // If there's a duration element, update content
                if (plyr.duration) {
                    _updateTimeDisplay(duration, plyr.duration);
                }

                // Update the tooltip (if visible)
                _updateSeekTooltip();
            }

            // Handle time change event
            function _timeUpdate(event) {
                // Duration
                _updateTimeDisplay(plyr.media.currentTime, plyr.currentTime);

                // Ignore updates while seeking
                if (event && event.type === 'timeupdate' && plyr.media.seeking) {
                    return;
                }

                // Playing progress
                _updateProgress(event);
            }

            // Update seek range and progress
            function _updateSeekDisplay(time) {
                // Default to 0
                if (!_is.number(time)) {
                    time = 0;
                }

                var duration = _getDuration(),
                    value = _getPercentage(time, duration);

                // Update progress
                if (plyr.progress && plyr.progress.played) {
                    plyr.progress.played.value = value;
                }

                // Update seek range input
                if (plyr.buttons && plyr.buttons.seek) {
                    plyr.buttons.seek.value = value;
                }
            }

            // Update hover tooltip for seeking
            function _updateSeekTooltip(event) {
                var duration = _getDuration();

                // Bail if setting not true
                if (!config.tooltips.seek || !plyr.progress.container || duration === 0) {
                    return;
                }

                // Calculate percentage
                var clientRect = plyr.progress.container.getBoundingClientRect(),
                    percent = 0,
                    visible = config.classes.tooltip + '--visible';

                // Determine percentage, if already visible
                if (!event) {
                    if (_hasClass(plyr.progress.tooltip, visible)) {
                        percent = plyr.progress.tooltip.style.left.replace('%', '');
                    } else {
                        return;
                    }
                } else {
                    percent = 100 / clientRect.width * (event.pageX - clientRect.left);
                }

                // Set bounds
                if (percent < 0) {
                    percent = 0;
                } else if (percent > 100) {
                    percent = 100;
                }

                // Display the time a click would seek to
                _updateTimeDisplay(duration / 100 * percent, plyr.progress.tooltip);

                // Set position
                plyr.progress.tooltip.style.left = percent + '%';

                // Show/hide the tooltip
                // If the event is a moues in/out and percentage is inside bounds
                if (event && _inArray(['mouseenter', 'mouseleave'], event.type)) {
                    _toggleClass(plyr.progress.tooltip, visible, event.type === 'mouseenter');
                }
            }

            // Show the player controls in fullscreen mode
            function _toggleControls(toggle) {
                // Don't hide if config says not to, it's audio, or not ready or loading
                if (!config.hideControls || plyr.type === 'audio') {
                    return;
                }

                var delay = 0,
                    isEnterFullscreen = false,
                    show = toggle,
                    loading = _hasClass(plyr.container, config.classes.loading);

                // Default to false if no boolean
                if (!_is.boolean(toggle)) {
                    if (toggle && toggle.type) {
                        // Is the enter fullscreen event
                        isEnterFullscreen = toggle.type === 'enterfullscreen';

                        // Whether to show controls
                        show = _inArray(['mousemove', 'touchstart', 'mouseenter', 'focus'], toggle.type);

                        // Delay hiding on move events
                        if (_inArray(['mousemove', 'touchmove'], toggle.type)) {
                            delay = 2000;
                        }

                        // Delay a little more for keyboard users
                        if (toggle.type === 'focus') {
                            delay = 3000;
                        }
                    } else {
                        show = _hasClass(plyr.container, config.classes.hideControls);
                    }
                }

                // Clear timer every movement
                window.clearTimeout(timers.hover);

                // If the mouse is not over the controls, set a timeout to hide them
                if (show || plyr.media.paused || loading) {
                    _toggleClass(plyr.container, config.classes.hideControls, false);

                    // Always show controls when paused or if touch
                    if (plyr.media.paused || loading) {
                        return;
                    }

                    // Delay for hiding on touch
                    if (plyr.browser.isTouch) {
                        delay = 3000;
                    }
                }

                // If toggle is false or if we're playing (regardless of toggle),
                // then set the timer to hide the controls
                if (!show || !plyr.media.paused) {
                    timers.hover = window.setTimeout(function () {
                        // If the mouse is over the controls (and not entering fullscreen), bail
                        if ((plyr.controls.pressed || plyr.controls.hover) && !isEnterFullscreen) {
                            return;
                        }

                        _toggleClass(plyr.container, config.classes.hideControls, true);
                    }, delay);
                }
            }

            // Add common function to retrieve media source
            function _source(source) {
                // If not null or undefined, parse it
                if (!_is.undefined(source)) {
                    _updateSource(source);
                    return;
                }

                // Return the current source
                var url;
                switch (plyr.type) {
                    case 'youtube':
                        url = plyr.embed.getVideoUrl();
                        break;

                    case 'vimeo':
                        plyr.embed.getVideoUrl.then(function (value) {
                            url = value;
                        });
                        break;

                    case 'soundcloud':
                        plyr.embed.getCurrentSound(function (object) {
                            url = object.permalink_url;
                        });
                        break;

                    default:
                        url = plyr.media.currentSrc;
                        break;
                }

                return url || '';
            }

            // Update source
            // Sources are not checked for support so be careful
            function _updateSource(source) {
                if (!_is.object(source) || !('sources' in source) || !source.sources.length) {
                    _warn('Invalid source format');
                    return;
                }

                // Remove ready class hook
                _toggleClass(plyr.container, config.classes.ready, false);

                // Pause playback
                _pause();

                // Update seek range and progress
                _updateSeekDisplay();

                // Reset buffer progress
                _setProgress();

                // Cancel current network requests
                _cancelRequests();

                // Setup new source
                function setup() {
                    // Remove embed object
                    plyr.embed = null;

                    // Remove the old media
                    _remove(plyr.media);

                    // Remove video container
                    if (plyr.type === 'video' && plyr.videoContainer) {
                        _remove(plyr.videoContainer);
                    }

                    // Reset class name
                    if (plyr.container) {
                        plyr.container.removeAttribute('class');
                    }

                    // Set the type
                    if ('type' in source) {
                        plyr.type = source.type;

                        // Get child type for video (it might be an embed)
                        if (plyr.type === 'video') {
                            var firstSource = source.sources[0];

                            if ('type' in firstSource && _inArray(config.types.embed, firstSource.type)) {
                                plyr.type = firstSource.type;
                            }
                        }
                    }

                    // Check for support
                    plyr.supported = supported(plyr.type);

                    // Create new markup
                    switch (plyr.type) {
                        case 'video':
                            plyr.media = document.createElement('video');
                            break;

                        case 'audio':
                            plyr.media = document.createElement('audio');
                            break;

                        case 'youtube':
                        case 'vimeo':
                        case 'soundcloud':
                            plyr.media = document.createElement('div');
                            plyr.embedId = source.sources[0].src;
                            break;
                    }

                    // Inject the new element
                    _prependChild(plyr.container, plyr.media);

                    // Autoplay the new source?
                    if (_is.boolean(source.autoplay)) {
                        config.autoplay = source.autoplay;
                    }

                    // Set attributes for audio and video
                    if (_inArray(config.types.html5, plyr.type)) {
                        if (config.crossorigin) {
                            plyr.media.setAttribute('crossorigin', '');
                        }
                        if (config.autoplay) {
                            plyr.media.setAttribute('autoplay', '');
                        }
                        if ('poster' in source) {
                            plyr.media.setAttribute('poster', source.poster);
                        }
                        if (config.loop) {
                            plyr.media.setAttribute('loop', '');
                        }
                    }

                    // Restore class hooks
                    _toggleClass(plyr.container, config.classes.fullscreen.active, plyr.isFullscreen);
                    _toggleClass(plyr.container, config.classes.captions.active, plyr.captionsEnabled);
                    _toggleStyleHook();

                    // Set new sources for html5
                    if (_inArray(config.types.html5, plyr.type)) {
                        _insertChildElements('source', source.sources);
                    }

                    // Set up from scratch
                    _setupMedia();

                    // HTML5 stuff
                    if (_inArray(config.types.html5, plyr.type)) {
                        // Setup captions
                        if ('tracks' in source) {
                            _insertChildElements('track', source.tracks);
                        }

                        // Load HTML5 sources
                        plyr.media.load();
                    }

                    // If HTML5 or embed but not fully supported, setupInterface and call ready now
                    if (_inArray(config.types.html5, plyr.type) || _inArray(config.types.embed, plyr.type) && !plyr.supported.full) {
                        // Setup interface
                        _setupInterface();

                        // Call ready
                        _ready();
                    }

                    // Set aria title and iframe title
                    config.title = source.title;
                    _setTitle();
                }

                // Destroy instance adn wait for callback
                // Vimeo throws a wobbly if you don't wait
                _destroy(setup, false);
            }

            // Update poster
            function _updatePoster(source) {
                if (plyr.type === 'video') {
                    plyr.media.setAttribute('poster', source);
                }
            }

            function onBodyClick() {
                _toggleClass(_getElement('.' + config.classes.tabFocus), config.classes.tabFocus, false);
            }

            // Listen for control events
            function _controlListeners() {
                // IE doesn't support input event, so we fallback to change
                var inputEvent = plyr.browser.isIE ? 'change' : 'input';

                // Click play/pause helper
                function togglePlay() {
                    var play = _togglePlay();

                    // Determine which buttons
                    var trigger = plyr.buttons[play ? 'play' : 'pause'],
                        target = plyr.buttons[play ? 'pause' : 'play'];

                    // Get the last play button to account for the large play button
                    if (target) {
                        if (target.length > 1) {
                            target = target[target.length - 1];
                        } else {
                            target = target[0];
                        }
                    }

                    // Setup focus and tab focus
                    if (target) {
                        var hadTabFocus = _hasClass(trigger, config.classes.tabFocus);

                        setTimeout(function () {
                            target.focus();

                            if (hadTabFocus) {
                                _toggleClass(trigger, config.classes.tabFocus, false);
                                _toggleClass(target, config.classes.tabFocus, true);
                            }
                        }, 100);
                    }
                }

                // Get the focused element
                function getFocusElement() {
                    var focused = document.activeElement;

                    if (!focused || focused === document.body) {
                        focused = null;
                    } else {
                        focused = document.querySelector(':focus');
                    }

                    return focused;
                }

                // Get the key code for an event
                function getKeyCode(event) {
                    return event.keyCode ? event.keyCode : event.which;
                }

                // Detect tab focus
                function checkTabFocus(focused) {
                    for (var button in plyr.buttons) {
                        var element = plyr.buttons[button];

                        if (_is.nodeList(element)) {
                            for (var i = 0; i < element.length; i++) {
                                _toggleClass(element[i], config.classes.tabFocus, element[i] === focused);
                            }
                        } else {
                            _toggleClass(element, config.classes.tabFocus, element === focused);
                        }
                    }
                }

                // Keyboard shortcuts
                if (config.keyboardShorcuts.focused) {
                    var last = null;

                    // Handle global presses
                    if (config.keyboardShorcuts.global) {
                        _on(window, 'keydown keyup', function (event) {
                            var code = getKeyCode(event),
                                focused = getFocusElement(),
                                allowed = [48, 49, 50, 51, 52, 53, 54, 56, 57, 75, 77, 70, 67],
                                count = get$$1().length;

                            // Only handle global key press if there's only one player
                            // and the key is in the allowed keys
                            // and if the focused element is not editable (e.g. text input)
                            // and any that accept key input http://webaim.org/techniques/keyboard/
                            if (count === 1 && _inArray(allowed, code) && (!_is.htmlElement(focused) || !_matches(focused, config.selectors.editable))) {
                                handleKey(event);
                            }
                        });
                    }

                    // Handle presses on focused
                    _on(plyr.container, 'keydown keyup', handleKey);
                }

                function handleKey(event) {
                    var code = getKeyCode(event),
                        pressed = event.type === 'keydown',
                        held = pressed && code === last;

                    // If the event is bubbled from the media element
                    // Firefox doesn't get the keycode for whatever reason
                    if (!_is.number(code)) {
                        return;
                    }

                    // Seek by the number keys
                    function seekByKey() {
                        // Get current duration
                        var duration = plyr.media.duration;

                        // Bail if we have no duration set
                        if (!_is.number(duration)) {
                            return;
                        }

                        // Divide the max duration into 10th's and times by the number value
                        _seek(duration / 10 * (code - 48));
                    }

                    // Handle the key on keydown
                    // Reset on keyup
                    if (pressed) {
                        // Which keycodes should we prevent default
                        var preventDefault = [48, 49, 50, 51, 52, 53, 54, 56, 57, 32, 75, 38, 40, 77, 39, 37, 70, 67];

                        // If the code is found prevent default (e.g. prevent scrolling for arrows)
                        if (_inArray(preventDefault, code)) {
                            event.preventDefault();
                            event.stopPropagation();
                        }

                        switch (code) {
                            // 0-9
                            case 48:
                            case 49:
                            case 50:
                            case 51:
                            case 52:
                            case 53:
                            case 54:
                            case 55:
                            case 56:
                            case 57:
                                if (!held) {
                                    seekByKey();
                                }
                                break;
                            // Space and K key
                            case 32:
                            case 75:
                                if (!held) {
                                    _togglePlay();
                                }
                                break;
                            // Arrow up
                            case 38:
                                _increaseVolume();
                                break;
                            // Arrow down
                            case 40:
                                _decreaseVolume();
                                break;
                            // M key
                            case 77:
                                if (!held) {
                                    _toggleMute();
                                }
                                break;
                            // Arrow forward
                            case 39:
                                _forward();
                                break;
                            // Arrow back
                            case 37:
                                _rewind();
                                break;
                            // F key
                            case 70:
                                _toggleFullscreen();
                                break;
                            // C key
                            case 67:
                                if (!held) {
                                    _toggleCaptions();
                                }
                                break;
                        }

                        // Escape is handle natively when in full screen
                        // So we only need to worry about non native
                        if (!fullscreen.supportsFullScreen && plyr.isFullscreen && code === 27) {
                            _toggleFullscreen();
                        }

                        // Store last code for next cycle
                        last = code;
                    } else {
                        last = null;
                    }
                }

                // Focus/tab management
                _on(window, 'keyup', function (event) {
                    var code = getKeyCode(event),
                        focused = getFocusElement();

                    if (code === 9) {
                        checkTabFocus(focused);
                    }
                });
                _on(document.body, 'click', onBodyClick);
                for (var button in plyr.buttons) {
                    var element = plyr.buttons[button];

                    _on(element, 'blur', function () {
                        _toggleClass(element, 'tab-focus', false);
                    });
                }

                // Play
                _proxyListener(plyr.buttons.play, 'click', config.listeners.play, togglePlay);

                // Pause
                _proxyListener(plyr.buttons.pause, 'click', config.listeners.pause, togglePlay);

                // Restart
                _proxyListener(plyr.buttons.restart, 'click', config.listeners.restart, _seek);

                // Rewind
                _proxyListener(plyr.buttons.rewind, 'click', config.listeners.rewind, _rewind);

                // Fast forward
                _proxyListener(plyr.buttons.forward, 'click', config.listeners.forward, _forward);

                // Seek
                _proxyListener(plyr.buttons.seek, inputEvent, config.listeners.seek, _seek);

                // Set volume
                _proxyListener(plyr.volume.input, inputEvent, config.listeners.volume, function () {
                    _setVolume(plyr.volume.input.value);
                });

                // Mute
                _proxyListener(plyr.buttons.mute, 'click', config.listeners.mute, _toggleMute);

                // Fullscreen
                _proxyListener(plyr.buttons.fullscreen, 'click', config.listeners.fullscreen, _toggleFullscreen);

                // Toggle fullscreen when user double clicks on video wrapper
                _proxyListener(plyr.container, 'dblclick', config.listeners.fullscreen, _toggleFullscreen);

                // Handle user exiting fullscreen by escaping etc
                if (fullscreen.supportsFullScreen) {
                    _on(document, fullscreen.fullScreenEventName, _toggleFullscreen);
                }

                // Captions
                _proxyListener(plyr.buttons.captions, 'click', config.listeners.captions, _toggleCaptions);

                // Seek tooltip
                _on(plyr.progress.container, 'mouseenter mouseleave mousemove', _updateSeekTooltip);

                // Toggle controls visibility based on mouse movement
                if (config.hideControls) {
                    // Toggle controls on mouse events and entering fullscreen
                    _on(plyr.container, 'mouseenter mouseleave mousemove touchstart touchend touchcancel touchmove enterfullscreen', _toggleControls);

                    // Watch for cursor over controls so they don't hide when trying to interact
                    _on(plyr.controls, 'mouseenter mouseleave', function (event) {
                        plyr.controls.hover = event.type === 'mouseenter';
                    });

                    // Watch for cursor over controls so they don't hide when trying to interact
                    _on(plyr.controls, 'mousedown mouseup touchstart touchend touchcancel', function (event) {
                        plyr.controls.pressed = _inArray(['mousedown', 'touchstart'], event.type);
                    });

                    // Focus in/out on controls
                    _on(plyr.controls, 'focus blur', _toggleControls, true);
                }

                // Adjust volume on scroll
                _on(plyr.volume.input, 'wheel', function (event) {
                    event.preventDefault();

                    // Detect "natural" scroll - suppored on OS X Safari only
                    // Other browsers on OS X will be inverted until support improves
                    var inverted = event.webkitDirectionInvertedFromDevice,
                        step = config.volumeStep / 5;

                    // Scroll down (or up on natural) to decrease
                    if (event.deltaY < 0 || event.deltaX > 0) {
                        if (inverted) {
                            _decreaseVolume(step);
                        } else {
                            _increaseVolume(step);
                        }
                    }

                    // Scroll up (or down on natural) to increase
                    if (event.deltaY > 0 || event.deltaX < 0) {
                        if (inverted) {
                            _increaseVolume(step);
                        } else {
                            _decreaseVolume(step);
                        }
                    }
                });
            }

            // Listen for media events
            function _mediaListeners() {
                // Time change on media
                _on(plyr.media, 'timeupdate seeking', _timeUpdate);

                // Update manual captions
                _on(plyr.media, 'timeupdate', _seekManualCaptions);

                // Display duration
                _on(plyr.media, 'durationchange loadedmetadata', _displayDuration);

                // Handle the media finishing
                _on(plyr.media, 'ended', function () {
                    // Show poster on end
                    if (plyr.type === 'video' && config.showPosterOnEnd) {
                        // Clear
                        if (plyr.type === 'video') {
                            _setCaption();
                        }

                        // Restart
                        _seek();

                        // Re-load media
                        plyr.media.load();
                    }
                });

                // Check for buffer progress
                _on(plyr.media, 'progress playing', _updateProgress);

                // Handle native mute
                _on(plyr.media, 'volumechange', _updateVolume);

                // Handle native play/pause
                _on(plyr.media, 'play pause ended', _checkPlaying);

                // Loading
                _on(plyr.media, 'waiting canplay seeked', _checkLoading);

                // Click video
                if (config.clickToPlay && plyr.type !== 'audio') {
                    // Re-fetch the wrapper
                    var wrapper = _getElement('.' + config.classes.videoWrapper);

                    // Bail if there's no wrapper (this should never happen)
                    if (!wrapper) {
                        return;
                    }

                    // Set cursor
                    wrapper.style.cursor = 'pointer';

                    // On click play, pause ore restart
                    _on(wrapper, 'click', function () {
                        // Touch devices will just show controls (if we're hiding controls)
                        if (config.hideControls && plyr.browser.isTouch && !plyr.media.paused) {
                            return;
                        }

                        if (plyr.media.paused) {
                            _play();
                        } else if (plyr.media.ended) {
                            _seek();
                            _play();
                        } else {
                            _pause();
                        }
                    });
                }

                // Disable right click
                if (config.disableContextMenu) {
                    _on(plyr.media, 'contextmenu', function (event) {
                        event.preventDefault();
                    });
                }

                // Proxy events to container
                // Bubble up key events for Edge
                _on(plyr.media, config.events.concat(['keyup', 'keydown']).join(' '), function (event) {
                    _triggerEvent(plyr.container, event.type, true);
                });
            }

            // Cancel current network requests
            // See https://github.com/sampotts/plyr/issues/174
            function _cancelRequests() {
                if (!_inArray(config.types.html5, plyr.type)) {
                    return;
                }

                // Remove child sources
                var sources = plyr.media.querySelectorAll('source');
                for (var i = 0; i < sources.length; i++) {
                    _remove(sources[i]);
                }

                // Set blank video src attribute
                // This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
                // Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection
                plyr.media.setAttribute('src', config.blankUrl);

                // Load the new empty source
                // This will cancel existing requests
                // See https://github.com/sampotts/plyr/issues/174
                plyr.media.load();

                // Debugging
                _log('Cancelled network requests');
            }

            // Destroy an instance
            // Event listeners are removed when elements are removed
            // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
            function _destroy(callback, restore) {
                // Bail if the element is not initialized
                if (!plyr.init) {
                    return null;
                }

                // Type specific stuff
                switch (plyr.type) {
                    case 'youtube':
                        // Clear timers
                        window.clearInterval(timers.buffering);
                        window.clearInterval(timers.playing);

                        // Destroy YouTube API
                        plyr.embed.destroy();

                        // Clean up
                        cleanUp();

                        break;

                    case 'vimeo':
                        // Destroy Vimeo API
                        // then clean up (wait, to prevent postmessage errors)
                        plyr.embed.unload().then(cleanUp);

                        // Vimeo does not always return
                        timers.cleanUp = window.setTimeout(cleanUp, 200);

                        break;

                    case 'video':
                    case 'audio':
                        // Restore native video controls
                        _toggleNativeControls(true);

                        // Clean up
                        cleanUp();

                        break;
                }

                function cleanUp() {
                    clearTimeout(timers.cleanUp);

                    // Default to restore original element
                    if (!_is.boolean(restore)) {
                        restore = true;
                    }

                    // Callback
                    if (_is.function(callback)) {
                        callback.call(original);
                    }

                    // Bail if we don't need to restore the original element
                    if (!restore) {
                        return;
                    }

                    // Remove init flag
                    plyr.init = false;

                    // Replace the container with the original element provided
                    plyr.container.parentNode.replaceChild(original, plyr.container);

                    // Free container in order for GC to remove it and prevent memory leaks due to added events
                    plyr.container = null;

                    // Allow overflow (set on fullscreen)
                    document.body.style.overflow = '';

                    //remove events
                    _off(document.body, 'click', onBodyClick);

                    // Event
                    _triggerEvent(original, 'destroyed', true);
                }
            }

            // Setup a player
            function _init() {
                // Bail if the element is initialized
                if (plyr.init) {
                    return null;
                }

                // Setup the fullscreen api
                fullscreen = _fullscreen();

                // Sniff out the browser
                plyr.browser = _browserSniff();

                // Bail if nothing to setup
                if (!_is.htmlElement(plyr.media)) {
                    return;
                }

                // Load saved settings from localStorage
                _setupStorage();

                // Set media type based on tag or data attribute
                // Supported: video, audio, vimeo, youtube
                var tagName = media.tagName.toLowerCase();
                if (tagName === 'div') {
                    plyr.type = media.getAttribute('data-type');
                    plyr.embedId = media.getAttribute('data-video-id');
                    // Clean up
                    media.removeAttribute('data-type');
                    media.removeAttribute('data-video-id');
                } else {
                    plyr.type = tagName;
                    config.crossorigin = media.getAttribute('crossorigin') !== null;
                    config.autoplay = config.autoplay || media.getAttribute('autoplay') !== null;
                    config.loop = config.loop || media.getAttribute('loop') !== null;
                }

                // Check for support
                plyr.supported = supported(plyr.type);

                // If no native support, bail
                if (!plyr.supported.basic) {
                    return;
                }

                // Wrap media
                plyr.container = _wrap(media, document.createElement('div'));

                // Allow focus to be captured
                plyr.container.setAttribute('tabindex', 0);

                // Add style hook
                _toggleStyleHook();

                // Debug info
                _log('' + plyr.browser.name + ' ' + plyr.browser.version);

                // Setup media
                _setupMedia();

                // Setup interface
                // If embed but not fully supported, setupInterface (to avoid flash of controls) and call ready now
                if (_inArray(config.types.html5, plyr.type) || _inArray(config.types.embed, plyr.type) && !plyr.supported.full) {
                    // Setup UI
                    _setupInterface();

                    // Call ready
                    _ready();

                    // Set title on button and frame
                    _setTitle();
                }

                // Successful setup
                plyr.init = true;
            }

            // Setup the UI
            function _setupInterface() {
                // Don't setup interface if no support
                if (!plyr.supported.full) {
                    _warn('Basic support only', plyr.type);

                    // Remove controls
                    _remove(_getElement(config.selectors.controls.wrapper));

                    // Remove large play
                    _remove(_getElement(config.selectors.buttons.play));

                    // Restore native controls
                    _toggleNativeControls(true);

                    // Bail
                    return;
                }

                // Inject custom controls if not present
                var controlsMissing = !_getElements(config.selectors.controls.wrapper).length;
                if (controlsMissing) {
                    // Inject custom controls
                    _injectControls();
                }

                // Find the elements
                if (!_findElements()) {
                    return;
                }

                // If the controls are injected, re-bind listeners for controls
                if (controlsMissing) {
                    _controlListeners();
                }

                // Media element listeners
                _mediaListeners();

                // Remove native controls
                _toggleNativeControls();

                // Setup fullscreen
                _setupFullscreen();

                // Captions
                _setupCaptions();

                // Set volume
                _setVolume();
                _updateVolume();

                // Reset time display
                _timeUpdate();

                // Update the UI
                _checkPlaying();

                // Display duration
                _displayDuration();
            }

            api = {
                getOriginal: function getOriginal() {
                    return original;
                },
                getContainer: function getContainer() {
                    return plyr.container;
                },
                getEmbed: function getEmbed() {
                    return plyr.embed;
                },
                getMedia: function getMedia() {
                    return plyr.media;
                },
                getType: function getType() {
                    return plyr.type;
                },
                getDuration: _getDuration,
                getCurrentTime: function getCurrentTime() {
                    return plyr.media.currentTime;
                },
                getVolume: function getVolume() {
                    return plyr.media.volume;
                },
                isMuted: function isMuted() {
                    return plyr.media.muted;
                },
                isReady: function isReady() {
                    return _hasClass(plyr.container, config.classes.ready);
                },
                isLoading: function isLoading() {
                    return _hasClass(plyr.container, config.classes.loading);
                },
                isPaused: function isPaused() {
                    return plyr.media.paused;
                },
                on: function on(event, callback) {
                    _on(plyr.container, event, callback);
                    return this;
                },
                play: _play,
                pause: _pause,
                stop: function stop() {
                    _pause();
                    _seek();
                },
                restart: _seek,
                rewind: _rewind,
                forward: _forward,
                seek: _seek,
                source: _source,
                poster: _updatePoster,
                setVolume: _setVolume,
                togglePlay: _togglePlay,
                toggleMute: _toggleMute,
                toggleCaptions: _toggleCaptions,
                toggleFullscreen: _toggleFullscreen,
                toggleControls: _toggleControls,
                isFullscreen: function isFullscreen() {
                    return plyr.isFullscreen || false;
                },
                support: function support(mimeType) {
                    return _supportMime(plyr, mimeType);
                },
                destroy: _destroy
            };

            // Everything done
            function _ready() {
                // Ready event at end of execution stack
                window.setTimeout(function () {
                    _triggerEvent(plyr.media, 'ready');
                }, 0);

                // Set class hook on media element
                _toggleClass(plyr.media, defaults$$1.classes.setup, true);

                // Set container class for ready
                _toggleClass(plyr.container, config.classes.ready, true);

                // Store a refernce to instance
                plyr.media.plyr = api;

                // Autoplay
                if (config.autoplay) {
                    _play();
                }
            }

            // Initialize instance
            _init();

            // If init failed, return null
            if (!plyr.init) {
                return null;
            }

            return api;
        }

        // Load a sprite
        function loadSprite(url, id) {
            var x = new XMLHttpRequest();

            // If the id is set and sprite exists, bail
            if (_is.string(id) && _is.htmlElement(document.querySelector('#' + id))) {
                return;
            }

            // Create placeholder (to prevent loading twice)
            var container = document.createElement('div');
            container.setAttribute('hidden', '');
            if (_is.string(id)) {
                container.setAttribute('id', id);
            }
            document.body.insertBefore(container, document.body.childNodes[0]);

            // Check for CORS support
            if ('withCredentials' in x) {
                x.open('GET', url, true);
            } else {
                return;
            }

            // Inject hidden div with sprite on load
            x.onload = function () {
                container.innerHTML = x.responseText;
            };

            x.send();
        }

        // Check for support
        function supported(type) {
            var browser = _browserSniff(),
                isOldIE = browser.isIE && browser.version <= 9,
                isIos = browser.isIos,
                isIphone = browser.isIphone,
                audioSupport = !!document.createElement('audio').canPlayType,
                videoSupport = !!document.createElement('video').canPlayType,
                basic = false,
                full = false;

            switch (type) {
                case 'video':
                    basic = videoSupport;
                    full = basic && !isOldIE && !isIphone;
                    break;

                case 'audio':
                    basic = audioSupport;
                    full = basic && !isOldIE;
                    break;

                // Vimeo does not seem to be supported on iOS via API
                // Issue raised https://github.com/vimeo/player.js/issues/87
                case 'vimeo':
                    basic = true;
                    full = !isOldIE && !isIos;
                    break;

                case 'youtube':
                    basic = true;
                    full = !isOldIE && !isIos;

                    // YouTube seems to work on iOS 10+ on iPad
                    if (isIos && !isIphone && browser.version >= 10) {
                        full = true;
                    }

                    break;

                case 'soundcloud':
                    basic = true;
                    full = !isOldIE && !isIphone;
                    break;

                default:
                    basic = audioSupport && videoSupport;
                    full = basic && !isOldIE;
            }

            return {
                basic: basic,
                full: full
            };
        }

        // Setup function
        function setup(targets, options) {
            // Get the players
            var players = [],
                instances = [],
                selector = [defaults$$1.selectors.html5, defaults$$1.selectors.embed].join(',');

            // Select the elements
            if (_is.string(targets)) {
                // String selector passed
                targets = document.querySelectorAll(targets);
            } else if (_is.htmlElement(targets)) {
                // Single HTMLElement passed
                targets = [targets];
            } else if (!_is.nodeList(targets) && !_is.array(targets) && !_is.string(targets)) {
                // No selector passed, possibly options as first argument
                // If options are the first argument
                if (_is.undefined(options) && _is.object(targets)) {
                    options = targets;
                }

                // Use default selector
                targets = document.querySelectorAll(selector);
            }

            // Convert NodeList to array
            if (_is.nodeList(targets)) {
                targets = Array.prototype.slice.call(targets);
            }

            // Bail if disabled or no basic support
            // You may want to disable certain UAs etc
            if (!supported().basic || !targets.length) {
                return false;
            }

            // Add to container list
            function add(target, media) {
                if (!_hasClass(media, defaults$$1.classes.hook)) {
                    players.push({
                        // Always wrap in a <div> for styling
                        //container:  _wrap(media, document.createElement('div')),
                        // Could be a container or the media itself
                        target: target,
                        // This should be the <video>, <audio> or <div> (YouTube/Vimeo)
                        media: media
                    });
                }
            }

            // Check if the targets have multiple media elements
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];

                // Get children
                var children = target.querySelectorAll(selector);

                // If there's more than one media element child, wrap them
                if (children.length) {
                    for (var x = 0; x < children.length; x++) {
                        add(target, children[x]);
                    }
                } else if (_matches(target, selector)) {
                    // Target is media element
                    add(target, target);
                }
            }

            // Create a player instance for each element
            players.forEach(function (player) {
                var element = player.target,
                    media = player.media;

                // Setup a player instance and add to the element
                // Create instance-specific config
                var data = {};

                // Try parsing data attribute config
                try {
                    data = JSON.parse(element.getAttribute('data-plyr'));
                } catch (e) {
                }

                var config = _extend({}, defaults$$1, options, data);

                // Bail if not enabled
                if (!config.enabled) {
                    return null;
                }

                // Create new instance
                if (window.innerWidth > 768) {
                    var instance = new Plyr(media, config);
                }

                // Go to next if setup failed
                if (!_is.object(instance)) {
                    return;
                }

                // Listen for events if debugging
                if (config.debug) {
                    var events = config.events.concat(['setup', 'statechange', 'enterfullscreen', 'exitfullscreen', 'captionsenabled', 'captionsdisabled']);

                    _on(instance.getContainer(), events.join(' '), function (event) {
                        console.log([config.logPrefix, 'event:', event.type].join(' '), event.detail.plyr);
                    });
                }

                // Callback
                _event(instance.getContainer(), 'setup', true, {
                    plyr: instance
                });

                // Add to return array even if it's already setup
                instances.push(instance);
            });

            return instances;
        }

        // Get all instances within a provided container
        function get$$1(container) {
            if (_is.string(container)) {
                // Get selector if string passed
                container = document.querySelector(container);
            } else if (_is.undefined(container)) {
                // Use body by default to get all on page
                container = document.body;
            }

            // If we have a HTML element
            if (_is.htmlElement(container)) {
                var elements = container.querySelectorAll('.' + defaults$$1.classes.setup),
                    instances = [];

                Array.prototype.slice.call(elements).forEach(function (element) {
                    if (_is.object(element.plyr)) {
                        instances.push(element.plyr);
                    }
                });

                return instances;
            }

            return [];
        }

        return {
            setup: setup,
            supported: supported,
            loadSprite: loadSprite,
            get: get$$1
        };
    });

// Custom event polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    (function () {
        if (typeof window.CustomEvent === 'function') {
            return;
        }

        function CustomEvent(event, params) {
            params = params || {bubbles: false, cancelable: false, detail: undefined};
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();

    /* global plyr */

    var options = {
        contorls: [],
        loadSprite: false,
        autoplay: true,
        loop: true,
        // clickToPlay: false,
        hideControls: false,
        volume: 5
    };

    plyr.setup('.js-plyr', options);

    /*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.201711092
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

    if ("document" in self) {

        // Full polyfill for browsers with no classList support
        // Including IE < Edge missing SVGElement.classList
        if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

            (function (view) {

                if (!('Element' in view)) return;

                var classListProp = "classList",
                    protoProp = "prototype",
                    elemCtrProto = view.Element[protoProp],
                    objCtr = Object,
                    strTrim = String[protoProp].trim || function () {
                        return this.replace(/^\s+|\s+$/g, "");
                    },
                    arrIndexOf = Array[protoProp].indexOf || function (item) {
                        var i = 0,
                            len = this.length;
                        for (; i < len; i++) {
                            if (i in this && this[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }
                    // Vendors: please allow content code to instantiate DOMExceptions
                    ,
                    DOMEx = function DOMEx(type, message) {
                        this.name = type;
                        this.code = DOMException[type];
                        this.message = message;
                    },
                    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
                        if (token === "") {
                            throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
                        }
                        if (/\s/.test(token)) {
                            throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
                        }
                        return arrIndexOf.call(classList, token);
                    },
                    ClassList = function ClassList(elem) {
                        var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                            i = 0,
                            len = classes.length;
                        for (; i < len; i++) {
                            this.push(classes[i]);
                        }
                        this._updateClassName = function () {
                            elem.setAttribute("class", this.toString());
                        };
                    },
                    classListProto = ClassList[protoProp] = [],
                    classListGetter = function classListGetter() {
                        return new ClassList(this);
                    };
                // Most DOMException implementations don't allow calling DOMException's toString()
                // on non-DOMExceptions. Error's toString() is sufficient here.
                DOMEx[protoProp] = Error[protoProp];
                classListProto.item = function (i) {
                    return this[i] || null;
                };
                classListProto.contains = function (token) {
                    return !~checkTokenAndGetIndex(this, token + "");
                };
                classListProto.add = function () {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false;
                    do {
                        token = tokens[i] + "";
                        if (~checkTokenAndGetIndex(this, token)) {
                            this.push(token);
                            updated = true;
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.remove = function () {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false,
                        index;
                    do {
                        token = tokens[i] + "";
                        index = checkTokenAndGetIndex(this, token);
                        while (~index) {
                            this.splice(index, 1);
                            updated = true;
                            index = checkTokenAndGetIndex(this, token);
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.toggle = function (token, force) {
                    var result = this.contains(token),
                        method = result ? force !== true && "remove" : force !== false && "add";

                    if (method) {
                        this[method](token);
                    }

                    if (force === true || force === false) {
                        return force;
                    } else {
                        return !result;
                    }
                };
                classListProto.replace = function (token, replacement_token) {
                    var index = checkTokenAndGetIndex(token + "");
                    if (~index) {
                        this.splice(index, 1, replacement_token);
                        this._updateClassName();
                    }
                };
                classListProto.toString = function () {
                    return this.join(" ");
                };

                if (objCtr.defineProperty) {
                    var classListPropDesc = {
                        get: classListGetter,
                        enumerable: true,
                        configurable: true
                    };
                    try {
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    } catch (ex) {
                        // IE 8 doesn't support enumerable:true
                        // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                        // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                        if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                            classListPropDesc.enumerable = false;
                            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                        }
                    }
                } else if (objCtr[protoProp].__defineGetter__) {
                    elemCtrProto.__defineGetter__(classListProp, classListGetter);
                }
            })(self);
        }

        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function () {

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function createMethod(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function (token) {
                        var i,
                            len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function (token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            }

            // replace() polyfill
            if (!("replace" in document.createElement("_").classList)) {
                DOMTokenList.prototype.replace = function (token, replacement_token) {
                    var tokens = this.toString().split(" "),
                        index = tokens.indexOf(token + "");
                    if (~index) {
                        tokens = tokens.slice(index);
                        this.remove.apply(this, tokens);
                        this.add(replacement_token);
                        this.add.apply(this, tokens.slice(1));
                    }
                };
            }

            testElement = null;
        })();
    }

    /**
     * core-js 2.4.1
     * https://github.com/zloirock/core-js
     * License: http://rock.mit-license.org
     * © 2017 Denis Pushkarev
     */
    !function (__e, __g, undefined) {
        /******/
        (function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/
            var installedModules = {};
            /******/
            /******/ // The require function
            /******/
            function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/
                if (installedModules[moduleId]) {
                    /******/
                    return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/
                var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/
                };
                /******/
                /******/ // Execute the module function
                /******/
                modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/
                module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/
                return module.exports;
                /******/
            }

            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/
            __webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/
            __webpack_require__.c = installedModules;
            /******/
            /******/ // identity function for calling harmony imports with the correct context
            /******/
            __webpack_require__.i = function (value) {
                return value;
            };
            /******/
            /******/ // define getter function for harmony exports
            /******/
            __webpack_require__.d = function (exports, name, getter) {
                /******/
                if (!__webpack_require__.o(exports, name)) {
                    /******/
                    Object.defineProperty(exports, name, {
                        /******/configurable: false,
                        /******/enumerable: true,
                        /******/get: getter
                        /******/
                    });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/
            __webpack_require__.n = function (module) {
                /******/
                var getter = module && module.__esModule ?
                    /******/function getDefault() {
                        return module['default'];
                    } :
                    /******/function getModuleExports() {
                        return module;
                    };
                /******/
                __webpack_require__.d(getter, 'a', getter);
                /******/
                return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/
            __webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/ // __webpack_public_path__
            /******/
            __webpack_require__.p = "";
            /******/
            /******/ // Load entry module and return exports
            /******/
            return __webpack_require__(__webpack_require__.s = 49);
            /******/
        })(
            /************************************************************************/
            /******/[
                /* 0 */
                /***/function (module, exports) {

                    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
                    var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
                        // eslint-disable-next-line no-new-func
                        : Function('return this')();
                    if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


                    /***/
                },
                /* 1 */
                /***/function (module, exports, __webpack_require__) {

                    // Thank's IE8 for his funny defineProperty
                    module.exports = !__webpack_require__(7)(function () {
                        return Object.defineProperty({}, 'a', {
                            get: function get$$1() {
                                return 7;
                            }
                        }).a != 7;
                    });

                    /***/
                },
                /* 2 */
                /***/function (module, exports) {

                    var hasOwnProperty = {}.hasOwnProperty;
                    module.exports = function (it, key) {
                        return hasOwnProperty.call(it, key);
                    };

                    /***/
                },
                /* 3 */
                /***/function (module, exports, __webpack_require__) {

                    var anObject = __webpack_require__(6),
                        IE8_DOM_DEFINE = __webpack_require__(20),
                        toPrimitive = __webpack_require__(16),
                        dP = Object.defineProperty;

                    exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty$$1(O, P, Attributes) {
                        anObject(O);
                        P = toPrimitive(P, true);
                        anObject(Attributes);
                        if (IE8_DOM_DEFINE) try {
                            return dP(O, P, Attributes);
                        } catch (e) {/* empty */
                        }
                        if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
                        if ('value' in Attributes) O[P] = Attributes.value;
                        return O;
                    };

                    /***/
                },
                /* 4 */
                /***/function (module, exports, __webpack_require__) {

                    // to indexed object, toObject with fallback for non-array-like ES3 strings
                    var IObject = __webpack_require__(37),
                        defined = __webpack_require__(33);
                    module.exports = function (it) {
                        return IObject(defined(it));
                    };

                    /***/
                },
                /* 5 */
                /***/function (module, exports) {

                    var id = 0,
                        px = Math.random();
                    module.exports = function (key) {
                        return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
                    };

                    /***/
                },
                /* 6 */
                /***/function (module, exports, __webpack_require__) {

                    var isObject = __webpack_require__(8);
                    module.exports = function (it) {
                        if (!isObject(it)) throw TypeError(it + ' is not an object!');
                        return it;
                    };

                    /***/
                },
                /* 7 */
                /***/function (module, exports) {

                    module.exports = function (exec) {
                        try {
                            return !!exec();
                        } catch (e) {
                            return true;
                        }
                    };

                    /***/
                },
                /* 8 */
                /***/function (module, exports) {

                    module.exports = function (it) {
                        return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
                    };

                    /***/
                },
                /* 9 */
                /***/function (module, exports, __webpack_require__) {

                    // 19.1.2.14 / 15.2.3.14 Object.keys(O)
                    var $keys = __webpack_require__(24),
                        enumBugKeys = __webpack_require__(11);

                    module.exports = Object.keys || function keys(O) {
                        return $keys(O, enumBugKeys);
                    };

                    /***/
                },
                /* 10 */
                /***/function (module, exports) {

                    var core = module.exports = {version: '2.4.0'};
                    if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


                    /***/
                },
                /* 11 */
                /***/function (module, exports) {

                    // IE 8- don't enum bug keys
                    module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

                    /***/
                },
                /* 12 */
                /***/function (module, exports, __webpack_require__) {

                    var dP = __webpack_require__(3),
                        createDesc = __webpack_require__(14);
                    module.exports = __webpack_require__(1) ? function (object, key, value) {
                        return dP.f(object, key, createDesc(1, value));
                    } : function (object, key, value) {
                        object[key] = value;
                        return object;
                    };

                    /***/
                },
                /* 13 */
                /***/function (module, exports) {

                    exports.f = {}.propertyIsEnumerable;

                    /***/
                },
                /* 14 */
                /***/function (module, exports) {

                    module.exports = function (bitmap, value) {
                        return {
                            enumerable: !(bitmap & 1),
                            configurable: !(bitmap & 2),
                            writable: !(bitmap & 4),
                            value: value
                        };
                    };

                    /***/
                },
                /* 15 */
                /***/function (module, exports, __webpack_require__) {

                    var global = __webpack_require__(0),
                        SHARED = '__core-js_shared__',
                        store = global[SHARED] || (global[SHARED] = {});
                    module.exports = function (key) {
                        return store[key] || (store[key] = {});
                    };

                    /***/
                },
                /* 16 */
                /***/function (module, exports, __webpack_require__) {

                    // 7.1.1 ToPrimitive(input [, PreferredType])
                    var isObject = __webpack_require__(8);
                    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
                    // and the second argument - flag - preferred type is a string
                    module.exports = function (it, S) {
                        if (!isObject(it)) return it;
                        var fn, val;
                        if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
                        if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
                        if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
                        throw TypeError("Can't convert object to primitive value");
                    };

                    /***/
                },
                /* 17 */
                /***/function (module, exports, __webpack_require__) {

                    var store = __webpack_require__(15)('wks'),
                        uid = __webpack_require__(5),
                        _Symbol = __webpack_require__(0).Symbol,
                        USE_SYMBOL = typeof _Symbol == 'function';

                    var $exports = module.exports = function (name) {
                        return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
                    };

                    $exports.store = store;

                    /***/
                },
                /* 18 */
                /***/function (module, exports) {

                    var toString = {}.toString;

                    module.exports = function (it) {
                        return toString.call(it).slice(8, -1);
                    };

                    /***/
                },
                /* 19 */
                /***/function (module, exports, __webpack_require__) {

                    var isObject = __webpack_require__(8),
                        document = __webpack_require__(0).document
                        // in old IE typeof document.createElement is 'object'
                        ,
                        is = isObject(document) && isObject(document.createElement);
                    module.exports = function (it) {
                        return is ? document.createElement(it) : {};
                    };

                    /***/
                },
                /* 20 */
                /***/function (module, exports, __webpack_require__) {

                    module.exports = !__webpack_require__(1) && !__webpack_require__(7)(function () {
                        return Object.defineProperty(__webpack_require__(19)('div'), 'a', {
                            get: function get$$1() {
                                return 7;
                            }
                        }).a != 7;
                    });

                    /***/
                },
                /* 21 */
                /***/function (module, exports) {

                    module.exports = false;

                    /***/
                },
                /* 22 */
                /***/function (module, exports, __webpack_require__) {

                    // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
                    var $keys = __webpack_require__(24),
                        hiddenKeys = __webpack_require__(11).concat('length', 'prototype');

                    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
                        return $keys(O, hiddenKeys);
                    };

                    /***/
                },
                /* 23 */
                /***/function (module, exports) {

                    exports.f = Object.getOwnPropertySymbols;

                    /***/
                },
                /* 24 */
                /***/function (module, exports, __webpack_require__) {

                    var has = __webpack_require__(2),
                        toIObject = __webpack_require__(4),
                        arrayIndexOf = __webpack_require__(31)(false),
                        IE_PROTO = __webpack_require__(26)('IE_PROTO');

                    module.exports = function (object, names) {
                        var O = toIObject(object),
                            i = 0,
                            result = [],
                            key;
                        for (key in O) {
                            if (key != IE_PROTO) has(O, key) && result.push(key);
                        } // Don't enum bug & hidden keys
                        while (names.length > i) {
                            if (has(O, key = names[i++])) {
                                ~arrayIndexOf(result, key) || result.push(key);
                            }
                        }
                        return result;
                    };

                    /***/
                },
                /* 25 */
                /***/function (module, exports, __webpack_require__) {

                    var global = __webpack_require__(0),
                        hide = __webpack_require__(12),
                        has = __webpack_require__(2),
                        SRC = __webpack_require__(5)('src'),
                        TO_STRING = 'toString',
                        $toString = Function[TO_STRING],
                        TPL = ('' + $toString).split(TO_STRING);

                    __webpack_require__(10).inspectSource = function (it) {
                        return $toString.call(it);
                    };

                    (module.exports = function (O, key, val, safe) {
                        var isFunction = typeof val == 'function';
                        if (isFunction) has(val, 'name') || hide(val, 'name', key);
                        if (O[key] === val) return;
                        if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
                        if (O === global) {
                            O[key] = val;
                        } else if (!safe) {
                            delete O[key];
                            hide(O, key, val);
                        } else if (O[key]) {
                            O[key] = val;
                        } else {
                            hide(O, key, val);
                        }
                        // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
                    })(Function.prototype, TO_STRING, function toString() {
                        return typeof this == 'function' && this[SRC] || $toString.call(this);
                    });

                    /***/
                },
                /* 26 */
                /***/function (module, exports, __webpack_require__) {

                    var shared = __webpack_require__(15)('keys'),
                        uid = __webpack_require__(5);
                    module.exports = function (key) {
                        return shared[key] || (shared[key] = uid(key));
                    };

                    /***/
                },
                /* 27 */
                /***/function (module, exports) {

                    // 7.1.4 ToInteger
                    var ceil = Math.ceil,
                        floor = Math.floor;
                    module.exports = function (it) {
                        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
                    };

                    /***/
                },
                /* 28 */
                /***/function (module, exports, __webpack_require__) {

                    exports.f = __webpack_require__(17);

                    /***/
                },
                /* 29 */
                /***/function (module, exports, __webpack_require__) {

                    // ECMAScript 6 symbols shim

                    var global = __webpack_require__(0),
                        has = __webpack_require__(2),
                        DESCRIPTORS = __webpack_require__(1),
                        $export = __webpack_require__(35),
                        redefine = __webpack_require__(25),
                        META = __webpack_require__(40).KEY,
                        $fails = __webpack_require__(7),
                        shared = __webpack_require__(15),
                        setToStringTag = __webpack_require__(45),
                        uid = __webpack_require__(5),
                        wks = __webpack_require__(17),
                        wksExt = __webpack_require__(28),
                        wksDefine = __webpack_require__(48),
                        keyOf = __webpack_require__(39),
                        enumKeys = __webpack_require__(34),
                        isArray = __webpack_require__(38),
                        anObject = __webpack_require__(6),
                        toIObject = __webpack_require__(4),
                        toPrimitive = __webpack_require__(16),
                        createDesc = __webpack_require__(14),
                        _create = __webpack_require__(41),
                        gOPNExt = __webpack_require__(44),
                        $GOPD = __webpack_require__(43),
                        $DP = __webpack_require__(3),
                        $keys = __webpack_require__(9),
                        gOPD = $GOPD.f,
                        dP = $DP.f,
                        gOPN = gOPNExt.f,
                        $Symbol = global.Symbol,
                        $JSON = global.JSON,
                        _stringify = $JSON && $JSON.stringify,
                        PROTOTYPE = 'prototype',
                        HIDDEN = wks('_hidden'),
                        TO_PRIMITIVE = wks('toPrimitive'),
                        isEnum = {}.propertyIsEnumerable,
                        SymbolRegistry = shared('symbol-registry'),
                        AllSymbols = shared('symbols'),
                        OPSymbols = shared('op-symbols'),
                        ObjectProto = Object[PROTOTYPE],
                        USE_NATIVE = typeof $Symbol == 'function',
                        QObject = global.QObject;
                    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
                    var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

                    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
                    var setSymbolDesc = DESCRIPTORS && $fails(function () {
                        return _create(dP({}, 'a', {
                            get: function get$$1() {
                                return dP(this, 'a', {value: 7}).a;
                            }
                        })).a != 7;
                    }) ? function (it, key, D) {
                        var protoDesc = gOPD(ObjectProto, key);
                        if (protoDesc) delete ObjectProto[key];
                        dP(it, key, D);
                        if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
                    } : dP;

                    var wrap = function wrap(tag) {
                        var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
                        sym._k = tag;
                        return sym;
                    };

                    var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
                        return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
                    } : function (it) {
                        return it instanceof $Symbol;
                    };

                    var $defineProperty = function defineProperty$$1(it, key, D) {
                        if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
                        anObject(it);
                        key = toPrimitive(key, true);
                        anObject(D);
                        if (has(AllSymbols, key)) {
                            if (!D.enumerable) {
                                if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
                                it[HIDDEN][key] = true;
                            } else {
                                if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
                                D = _create(D, {enumerable: createDesc(0, false)});
                            }
                            return setSymbolDesc(it, key, D);
                        }
                        return dP(it, key, D);
                    };
                    var $defineProperties = function defineProperties(it, P) {
                        anObject(it);
                        var keys = enumKeys(P = toIObject(P)),
                            i = 0,
                            l = keys.length,
                            key;
                        while (l > i) {
                            $defineProperty(it, key = keys[i++], P[key]);
                        }
                        return it;
                    };
                    var $create = function create(it, P) {
                        return P === undefined ? _create(it) : $defineProperties(_create(it), P);
                    };
                    var $propertyIsEnumerable = function propertyIsEnumerable(key) {
                        var E = isEnum.call(this, key = toPrimitive(key, true));
                        if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
                        return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
                    };
                    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
                        it = toIObject(it);
                        key = toPrimitive(key, true);
                        if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
                        var D = gOPD(it, key);
                        if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
                        return D;
                    };
                    var $getOwnPropertyNames = function getOwnPropertyNames(it) {
                        var names = gOPN(toIObject(it)),
                            result = [],
                            i = 0,
                            key;
                        while (names.length > i) {
                            if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
                        }
                        return result;
                    };
                    var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
                        var IS_OP = it === ObjectProto,
                            names = gOPN(IS_OP ? OPSymbols : toIObject(it)),
                            result = [],
                            i = 0,
                            key;
                        while (names.length > i) {
                            if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
                        }
                        return result;
                    };

                    // 19.4.1.1 Symbol([description])
                    if (!USE_NATIVE) {
                        $Symbol = function _Symbol2() {
                            if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
                            var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
                            var $set = function $set(value) {
                                if (this === ObjectProto) $set.call(OPSymbols, value);
                                if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                                setSymbolDesc(this, tag, createDesc(1, value));
                            };
                            if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
                            return wrap(tag);
                        };
                        redefine($Symbol[PROTOTYPE], 'toString', function toString() {
                            return this._k;
                        });

                        $GOPD.f = $getOwnPropertyDescriptor;
                        $DP.f = $defineProperty;
                        __webpack_require__(22).f = gOPNExt.f = $getOwnPropertyNames;
                        __webpack_require__(13).f = $propertyIsEnumerable;
                        __webpack_require__(23).f = $getOwnPropertySymbols;

                        if (DESCRIPTORS && !__webpack_require__(21)) {
                            redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
                        }

                        wksExt.f = function (name) {
                            return wrap(wks(name));
                        };
                    }

                    $export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

                    for (var es6Symbols =
                        // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
                        'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
                        wks(es6Symbols[j++]);
                    }
                    for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
                        wksDefine(wellKnownSymbols[k++]);
                    }
                    $export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
                        // 19.4.2.1 Symbol.for(key)
                        'for': function _for(key) {
                            return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
                        },
                        // 19.4.2.5 Symbol.keyFor(sym)
                        keyFor: function keyFor(key) {
                            if (isSymbol(key)) return keyOf(SymbolRegistry, key);
                            throw TypeError(key + ' is not a symbol!');
                        },
                        useSetter: function useSetter() {
                            setter = true;
                        },
                        useSimple: function useSimple() {
                            setter = false;
                        }
                    });

                    $export($export.S + $export.F * !USE_NATIVE, 'Object', {
                        // 19.1.2.2 Object.create(O [, Properties])
                        create: $create,
                        // 19.1.2.4 Object.defineProperty(O, P, Attributes)
                        defineProperty: $defineProperty,
                        // 19.1.2.3 Object.defineProperties(O, Properties)
                        defineProperties: $defineProperties,
                        // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
                        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
                        // 19.1.2.7 Object.getOwnPropertyNames(O)
                        getOwnPropertyNames: $getOwnPropertyNames,
                        // 19.1.2.8 Object.getOwnPropertySymbols(O)
                        getOwnPropertySymbols: $getOwnPropertySymbols
                    });

                    // 24.3.2 JSON.stringify(value [, replacer [, space]])
                    $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
                        var S = $Symbol();
                        // MS Edge converts symbol values to JSON as {}
                        // WebKit converts symbol values to JSON as null
                        // V8 throws on boxed symbols
                        return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
                    })), 'JSON', {
                        stringify: function stringify(it) {
                            if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
                            var args = [it],
                                i = 1,
                                replacer,
                                $replacer;
                            while (arguments.length > i) {
                                args.push(arguments[i++]);
                            }
                            replacer = args[1];
                            if (typeof replacer == 'function') $replacer = replacer;
                            if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
                                if ($replacer) value = $replacer.call(this, key, value);
                                if (!isSymbol(value)) return value;
                            };
                            args[1] = replacer;
                            return _stringify.apply($JSON, args);
                        }
                    });

                    // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
                    $Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
                    // 19.4.3.5 Symbol.prototype[@@toStringTag]
                    setToStringTag($Symbol, 'Symbol');
                    // 20.2.1.9 Math[@@toStringTag]
                    setToStringTag(Math, 'Math', true);
                    // 24.3.3 JSON[@@toStringTag]
                    setToStringTag(global.JSON, 'JSON', true);

                    /***/
                },
                /* 30 */
                /***/function (module, exports) {

                    module.exports = function (it) {
                        if (typeof it != 'function') throw TypeError(it + ' is not a function!');
                        return it;
                    };

                    /***/
                },
                /* 31 */
                /***/function (module, exports, __webpack_require__) {

                    // false -> Array#indexOf
                    // true  -> Array#includes
                    var toIObject = __webpack_require__(4),
                        toLength = __webpack_require__(47),
                        toIndex = __webpack_require__(46);
                    module.exports = function (IS_INCLUDES) {
                        return function ($this, el, fromIndex) {
                            var O = toIObject($this),
                                length = toLength(O.length),
                                index = toIndex(fromIndex, length),
                                value;
                            // Array#includes uses SameValueZero equality algorithm
                            // eslint-disable-next-line no-self-compare
                            if (IS_INCLUDES && el != el) while (length > index) {
                                value = O[index++];
                                // eslint-disable-next-line no-self-compare
                                if (value != value) return true;
                                // Array#toIndex ignores holes, Array#includes - not
                            } else for (; length > index; index++) {
                                if (IS_INCLUDES || index in O) {
                                    if (O[index] === el) return IS_INCLUDES || index || 0;
                                }
                            }
                            return !IS_INCLUDES && -1;
                        };
                    };

                    /***/
                },
                /* 32 */
                /***/function (module, exports, __webpack_require__) {

                    // optional / simple context binding
                    var aFunction = __webpack_require__(30);
                    module.exports = function (fn, that, length) {
                        aFunction(fn);
                        if (that === undefined) return fn;
                        switch (length) {
                            case 1:
                                return function (a) {
                                    return fn.call(that, a);
                                };
                            case 2:
                                return function (a, b) {
                                    return fn.call(that, a, b);
                                };
                            case 3:
                                return function (a, b, c) {
                                    return fn.call(that, a, b, c);
                                };
                        }
                        return function () /* ...args */ {
                            return fn.apply(that, arguments);
                        };
                    };

                    /***/
                },
                /* 33 */
                /***/function (module, exports) {

                    // 7.2.1 RequireObjectCoercible(argument)
                    module.exports = function (it) {
                        if (it == undefined) throw TypeError("Can't call method on  " + it);
                        return it;
                    };

                    /***/
                },
                /* 34 */
                /***/function (module, exports, __webpack_require__) {

                    // all enumerable object keys, includes symbols
                    var getKeys = __webpack_require__(9),
                        gOPS = __webpack_require__(23),
                        pIE = __webpack_require__(13);
                    module.exports = function (it) {
                        var result = getKeys(it),
                            getSymbols = gOPS.f;
                        if (getSymbols) {
                            var symbols = getSymbols(it),
                                isEnum = pIE.f,
                                i = 0,
                                key;
                            while (symbols.length > i) {
                                if (isEnum.call(it, key = symbols[i++])) result.push(key);
                            }
                        }
                        return result;
                    };

                    /***/
                },
                /* 35 */
                /***/function (module, exports, __webpack_require__) {

                    var global = __webpack_require__(0),
                        core = __webpack_require__(10),
                        hide = __webpack_require__(12),
                        redefine = __webpack_require__(25),
                        ctx = __webpack_require__(32),
                        PROTOTYPE = 'prototype';

                    var $export = function $export(type, name, source) {
                        var IS_FORCED = type & $export.F,
                            IS_GLOBAL = type & $export.G,
                            IS_STATIC = type & $export.S,
                            IS_PROTO = type & $export.P,
                            IS_BIND = type & $export.B,
                            target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE],
                            exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
                            expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
                            key,
                            own,
                            out,
                            exp;
                        if (IS_GLOBAL) source = name;
                        for (key in source) {
                            // contains in native
                            own = !IS_FORCED && target && target[key] !== undefined;
                            // export native or passed
                            out = (own ? target : source)[key];
                            // bind timers to global for call from export context
                            exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                            // extend global
                            if (target) redefine(target, key, out, type & $export.U);
                            // export
                            if (exports[key] != out) hide(exports, key, exp);
                            if (IS_PROTO && expProto[key] != out) expProto[key] = out;
                        }
                    };
                    global.core = core;
                    // type bitmap
                    $export.F = 1; // forced
                    $export.G = 2; // global
                    $export.S = 4; // static
                    $export.P = 8; // proto
                    $export.B = 16; // bind
                    $export.W = 32; // wrap
                    $export.U = 64; // safe
                    $export.R = 128; // real proto method for `library`
                    module.exports = $export;

                    /***/
                },
                /* 36 */
                /***/function (module, exports, __webpack_require__) {

                    var document = __webpack_require__(0).document;
                    module.exports = document && document.documentElement;

                    /***/
                },
                /* 37 */
                /***/function (module, exports, __webpack_require__) {

                    // fallback for non-array-like ES3 and non-enumerable old V8 strings
                    var cof = __webpack_require__(18);
                    // eslint-disable-next-line no-prototype-builtins
                    module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
                        return cof(it) == 'String' ? it.split('') : Object(it);
                    };

                    /***/
                },
                /* 38 */
                /***/function (module, exports, __webpack_require__) {

                    // 7.2.2 IsArray(argument)
                    var cof = __webpack_require__(18);
                    module.exports = Array.isArray || function isArray(arg) {
                        return cof(arg) == 'Array';
                    };

                    /***/
                },
                /* 39 */
                /***/function (module, exports, __webpack_require__) {

                    var getKeys = __webpack_require__(9),
                        toIObject = __webpack_require__(4);
                    module.exports = function (object, el) {
                        var O = toIObject(object),
                            keys = getKeys(O),
                            length = keys.length,
                            index = 0,
                            key;
                        while (length > index) {
                            if (O[key = keys[index++]] === el) return key;
                        }
                    };

                    /***/
                },
                /* 40 */
                /***/function (module, exports, __webpack_require__) {

                    var META = __webpack_require__(5)('meta'),
                        isObject = __webpack_require__(8),
                        has = __webpack_require__(2),
                        setDesc = __webpack_require__(3).f,
                        id = 0;
                    var isExtensible = Object.isExtensible || function () {
                        return true;
                    };
                    var FREEZE = !__webpack_require__(7)(function () {
                        return isExtensible(Object.preventExtensions({}));
                    });
                    var setMeta = function setMeta(it) {
                        setDesc(it, META, {
                            value: {
                                i: 'O' + ++id, // object ID
                                w: {} // weak collections IDs
                            }
                        });
                    };
                    var fastKey = function fastKey(it, create) {
                        // return primitive with prefix
                        if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
                        if (!has(it, META)) {
                            // can't set metadata to uncaught frozen object
                            if (!isExtensible(it)) return 'F';
                            // not necessary to add metadata
                            if (!create) return 'E';
                            // add missing metadata
                            setMeta(it);
                            // return object ID
                        }
                        return it[META].i;
                    };
                    var getWeak = function getWeak(it, create) {
                        if (!has(it, META)) {
                            // can't set metadata to uncaught frozen object
                            if (!isExtensible(it)) return true;
                            // not necessary to add metadata
                            if (!create) return false;
                            // add missing metadata
                            setMeta(it);
                            // return hash weak collections IDs
                        }
                        return it[META].w;
                    };
                    // add metadata on freeze-family methods calling
                    var onFreeze = function onFreeze(it) {
                        if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
                        return it;
                    };
                    var meta = module.exports = {
                        KEY: META,
                        NEED: false,
                        fastKey: fastKey,
                        getWeak: getWeak,
                        onFreeze: onFreeze
                    };

                    /***/
                },
                /* 41 */
                /***/function (module, exports, __webpack_require__) {

                    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
                    var anObject = __webpack_require__(6),
                        dPs = __webpack_require__(42),
                        enumBugKeys = __webpack_require__(11),
                        IE_PROTO = __webpack_require__(26)('IE_PROTO'),
                        Empty = function Empty() {/* empty */
                        },
                        PROTOTYPE = 'prototype';

                    // Create object with fake `null` prototype: use iframe Object with cleared prototype
                    var _createDict = function createDict() {
                        // Thrash, waste and sodomy: IE GC bug
                        var iframe = __webpack_require__(19)('iframe'),
                            i = enumBugKeys.length,
                            lt = '<',
                            gt = '>',
                            iframeDocument;
                        iframe.style.display = 'none';
                        __webpack_require__(36).appendChild(iframe);
                        iframe.src = 'javascript:'; // eslint-disable-line no-script-url
                        // createDict = iframe.contentWindow.Object;
                        // html.removeChild(iframe);
                        iframeDocument = iframe.contentWindow.document;
                        iframeDocument.open();
                        iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
                        iframeDocument.close();
                        _createDict = iframeDocument.F;
                        while (i--) {
                            delete _createDict[PROTOTYPE][enumBugKeys[i]];
                        }
                        return _createDict();
                    };

                    module.exports = Object.create || function create(O, Properties) {
                        var result;
                        if (O !== null) {
                            Empty[PROTOTYPE] = anObject(O);
                            result = new Empty();
                            Empty[PROTOTYPE] = null;
                            // add "__proto__" for Object.getPrototypeOf polyfill
                            result[IE_PROTO] = O;
                        } else result = _createDict();
                        return Properties === undefined ? result : dPs(result, Properties);
                    };

                    /***/
                },
                /* 42 */
                /***/function (module, exports, __webpack_require__) {

                    var dP = __webpack_require__(3),
                        anObject = __webpack_require__(6),
                        getKeys = __webpack_require__(9);

                    module.exports = __webpack_require__(1) ? Object.defineProperties : function defineProperties(O, Properties) {
                        anObject(O);
                        var keys = getKeys(Properties),
                            length = keys.length,
                            i = 0,
                            P;
                        while (length > i) {
                            dP.f(O, P = keys[i++], Properties[P]);
                        }
                        return O;
                    };

                    /***/
                },
                /* 43 */
                /***/function (module, exports, __webpack_require__) {

                    var pIE = __webpack_require__(13),
                        createDesc = __webpack_require__(14),
                        toIObject = __webpack_require__(4),
                        toPrimitive = __webpack_require__(16),
                        has = __webpack_require__(2),
                        IE8_DOM_DEFINE = __webpack_require__(20),
                        gOPD = Object.getOwnPropertyDescriptor;

                    exports.f = __webpack_require__(1) ? gOPD : function getOwnPropertyDescriptor(O, P) {
                        O = toIObject(O);
                        P = toPrimitive(P, true);
                        if (IE8_DOM_DEFINE) try {
                            return gOPD(O, P);
                        } catch (e) {/* empty */
                        }
                        if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
                    };

                    /***/
                },
                /* 44 */
                /***/function (module, exports, __webpack_require__) {

                    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
                    var toIObject = __webpack_require__(4),
                        gOPN = __webpack_require__(22).f,
                        toString = {}.toString;

                    var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

                    var getWindowNames = function getWindowNames(it) {
                        try {
                            return gOPN(it);
                        } catch (e) {
                            return windowNames.slice();
                        }
                    };

                    module.exports.f = function getOwnPropertyNames(it) {
                        return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
                    };

                    /***/
                },
                /* 45 */
                /***/function (module, exports, __webpack_require__) {

                    var def = __webpack_require__(3).f,
                        has = __webpack_require__(2),
                        TAG = __webpack_require__(17)('toStringTag');

                    module.exports = function (it, tag, stat) {
                        if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
                            configurable: true,
                            value: tag
                        });
                    };

                    /***/
                },
                /* 46 */
                /***/function (module, exports, __webpack_require__) {

                    var toInteger = __webpack_require__(27),
                        max = Math.max,
                        min = Math.min;
                    module.exports = function (index, length) {
                        index = toInteger(index);
                        return index < 0 ? max(index + length, 0) : min(index, length);
                    };

                    /***/
                },
                /* 47 */
                /***/function (module, exports, __webpack_require__) {

                    // 7.1.15 ToLength
                    var toInteger = __webpack_require__(27),
                        min = Math.min;
                    module.exports = function (it) {
                        return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
                    };

                    /***/
                },
                /* 48 */
                /***/function (module, exports, __webpack_require__) {

                    var global = __webpack_require__(0),
                        core = __webpack_require__(10),
                        LIBRARY = __webpack_require__(21),
                        wksExt = __webpack_require__(28),
                        defineProperty$$1 = __webpack_require__(3).f;
                    module.exports = function (name) {
                        var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
                        if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$$1($Symbol, name, {value: wksExt.f(name)});
                    };

                    /***/
                },
                /* 49 */
                /***/function (module, exports, __webpack_require__) {

                    module.exports = __webpack_require__(29);

                    /***/
                }]
            /******/);
        // CommonJS export
        if (typeof module != 'undefined' && module.exports) module.exports = __e;
        // RequireJS export
        else if (typeof define == 'function' && define.amd) define(function () {
            return __e;
        });
        // Export to global object
        else __g.core = __e;
    }(1, 1);

    if (typeof Object.assign != 'function') {
        Object.assign = function (target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    if (![].includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex*/) {

            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1]) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            while (k < len) {
                var currentElement = O[k];
                if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
                    return true;
                }
                k++;
            }
            return false;
        };
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function () {

            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

    /**
     * Popup (dialog block)
     *
     * =============================================================================
     * @example Bind invoke popup to DOM element (by click)
     * ---
     * html:
     * <button type="button" class="js-popup" data-popup-target="login">Login</button>
     *
     * javascript:
     * const popup = new Popup( '.js-popup', {
 *  // optional
 *  activeClassName: 'is-open',
 *  closeBtn: '.js-popup-close',
 *  contentBox: '.popup__body',
 * } );
     *
     * =============================================================================
     * @example Show popup by script (if another popup is visible one will be hide)
     * ---
     * const eventPopupShowSuccess =
     *        new CustomEvent( 'popup.show', { detail: { name: 'success' } } );
     * document.dispatchEvent( eventPopupShowSuccess );
     *
     * =============================================================================
     * @example Hide popup by script
     * ---
     * const eventPopupHide = new CustomEvent( 'popup.hide' );
     * document.dispatchEvent( eventPopupHide );
     */

    var defaults$1 = {
        activeClassName: 'is-open',
        closeBtn: '.js-popup-close',
        contentBox: '.popup__body'
    };

// helpers
    var $ = function $(selector) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
        return context.querySelector(selector);
    };
    var $$ = function $$(selector) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
        return context.querySelectorAll(selector);
    };

    var $html = $('html');

    var INIT_METHOD = Symbol('@@init method');
    var SHOW_METHOD = Symbol('@@show method');
    var HIDE_METHOD = Symbol('@@hide method');
    var CREATE_BOX = Symbol('@@create popup container');

    var SHOW_EVENT = 'popup.show';
    var HIDE_EVENT = 'popup.hide';
    var KEY_ESC = 27;
    var instances = [];

    var $popupActive = null;
    var $popupCloseBtn = null;
    var $popupContentBox = null;

    var Popup = function () {
        /**
         * Constructor
         *
         * @constructor
         * @param {string} selector - css selector
         * @param {object} options - popup options [optional]
         * @example
         * const popup = new Popup( '.js-popup' );
         */
        function Popup(selector) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            classCallCheck(this, Popup);

            // one instance for the css selector
            if (!instances.includes(selector)) {
                instances.push(selector);
                this[INIT_METHOD](selector, options);
            }
        }

        // ***************
        // PUBLIC METHODS
        // ***************

        // ***************
        // PRIVATE METHODS
        // ***************
        /**
         * Initialize the instance
         *
         * @param {string} selector - css selector
         * @param {object} options - popup options
         *
         * @return {null} - nothing
         */


        createClass(Popup, [{
            key: INIT_METHOD,
            value: function value(selector, options) {
                var _this = this;

                this.options = Object.assign({}, defaults$1, options);

                this[CREATE_BOX]();

                this.hide = function (ev) {
                    return _this[HIDE_METHOD](ev);
                };
                this.show = function (ev) {
                    return _this[SHOW_METHOD](ev);
                };

                // buttons click
                [].concat(toConsumableArray($$(selector))).forEach(function (btn) {
                    btn.addEventListener('click', _this.show);
                });

                // show popup on document custom event 'popup.show'
                document.addEventListener(SHOW_EVENT, this.show);
                // hide popup on document custom event 'popup.hide'
                document.addEventListener(HIDE_EVENT, this.hide);
            }
        }, {
            key: CREATE_BOX,
            value: function value() {
                var box = document.createElement('div');

                box.id = 'popup' + Date.now();
                document.body.appendChild(box);

                this.box = box;
            }

            /**
             * show popup block
             *
             * @param {object} ev - Event()
             * @return {Popup} - Popup object
             */

        }, {
            key: SHOW_METHOD,
            value: function value(ev) {
                var btn = null;
                var popupTarget = null;
                var $popup = null;
                var formSubject = null;

                ev.preventDefault();

                if (ev.isTrusted === true) {
                    // if event dispatched by user
                    btn = ev.currentTarget;
                    popupTarget = btn.getAttribute('data-popup-target');
                    formSubject = btn.getAttribute('data-form-subject');
                } else {
                    // if event dispatched by script
                    popupTarget = ev.detail.name;
                }

                // find DOM popup-element
                if (popupTarget !== null) {
                    $popup = $('[data-popup-name=' + popupTarget + ']');
                }

                if ($popup !== null) {
                    // if visible another popup then hide it
                    this.hide();

                    $popupActive = $popup;
                    $popup.classList.add(this.options.activeClassName);

                    // close button
                    $popupCloseBtn = $popup.querySelector(this.options.closeBtn);

                    // close popup by click outside an popup content (on fade)
                    $popupContentBox = $popup.querySelector(this.options.contentBox);
                    $popup.addEventListener('click', this.hide);

                    // close popup by press ESC button
                    document.addEventListener('keyup', this.hide);

                    $html.style.maxWidth = (document.documentElement.clientWidth || document.body.clientWidth) + 'px';
                    $html.style.overflow = 'hidden';

                    // !!! No need for popup functionality
                    // Set subject for an inside form
                    if (formSubject !== null) {
                        var subject = $popup.querySelector('input[name=_subject]');

                        if (subject !== null) {
                            subject.value = formSubject;
                        }
                    }
                }

                return this;
            }

            /**
             * Hide popup block
             *
             * @param {object} ev - Event()
             * @return {Popup} - Popup object
             */

        }, {
            key: HIDE_METHOD,
            value: function value(ev) {
                // if no visible popup then skip process
                if ($popupActive === null) {
                    return this;
                }

                // if ESC button pressed
                if (typeof ev !== 'undefined' && ev.type === 'keyup') {
                    var code = ev.keyCode || ev.which;

                    if (code !== KEY_ESC) {
                        return this;
                    }
                }

                if (typeof ev !== 'undefined' && ev.isTrusted === true) {
                    // if clicked outside the popup content (on fade)
                    // and if NOT clicked the popup close button
                    var isInsideClick = $popupContentBox !== null && $popupContentBox.contains(ev.target);
                    var isCloseBtnClick = $popupCloseBtn !== null && $popupCloseBtn.contains(ev.target);

                    if (isInsideClick === true && isCloseBtnClick !== true) {
                        return this;
                    }
                }

                // remove document listeners
                document.removeEventListener('keyup', this.hide);

                // remove popup listeners
                $popupActive.removeEventListener('click', this.hide);

                // remove active class name
                $popupActive.classList.remove(this.options.activeClassName);

                $html.style.maxWidth = 'none';
                $html.style.overflow = 'auto';

                $popupActive = null;
                $popupCloseBtn = null;
                $popupContentBox = null;

                return this;
            }
        }]);
        return Popup;
    }();

    if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype && !window.IntersectionObserverPolyfill) {
        productImages();
    }

    /**
     * product images
     */
    function productImages() {
        var config = {
            // root: null,
            threshold: [].concat(toConsumableArray(Array(21).keys())).map(function (x) {
                return x / 20;
            }) // eslint-disable-line no-magic-numbers
        };

        var $leftBox = document.querySelector('.js-product-left-image');
        var $leftImage = $leftBox ? $leftBox.querySelector('img') : null;
        var $centerBox = document.querySelector('.js-product-center-image');
        var $centerImage = $centerBox ? $centerBox.querySelector('img') : null;
        var $rightBox = document.querySelector('.js-product-right-image');
        var $rightImage = $rightBox ? $rightBox.querySelector('img') : null;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var vh = entry.rootBounds.height;
                var ratio = entry.intersectionRatio > 1 ? 1 : entry.intersectionRatio;

                if (entry.target.classList.contains('js-product-left-image')) {
                    var isUponMiddle = entry.boundingClientRect.top < vh / 2;

                    if (isUponMiddle) {
                        entry.target.style.opacity = ratio;
                        $leftImage.style.transform = 'translate3d(' + (ratio * 100 - 100) + '%, 0, 0)';
                    } else {
                        $leftImage.style.transform = 'translate3d(-100%, 0, 0)';
                    }
                } else if (entry.target.classList.contains('js-product-right-image')) {
                    var _isUponMiddle = entry.boundingClientRect.top < vh / 2;

                    if (_isUponMiddle) {
                        entry.target.style.opacity = ratio;
                        $rightImage.style.transform = 'translate3d(' + (100 - ratio * 100) + '%, 0, 0)';
                    } else {
                        $rightImage.style.transform = 'translate3d(100%, 0, 0)';
                    }
                } else if (entry.target.classList.contains('js-product-center-image')) {
                    if (entry.boundingClientRect.top < 0) {
                        entry.target.style.opacity = entry.intersectionRatio;
                    } else {
                        entry.target.style.opacity = 1;
                    }
                }
                // } else if ( entry.target.classList.contains( 'js-product-center-image' ) && entry.boundingClientRect.top >= 0 ) {
                //   entry.target.style.opacity = ratio;
                //   $centerImage.style.transform = `translate3d(0, ${ 100 - ( ratio * 100 ) }%, 0)`;
                // }
                if (navigator.platform == 'MacIntel') {
                    $leftBox.style.opacity = 1;
                    $rightBox.style.opacity = 1;
                }
            });
        }, config);

        if ($leftBox) {
            [$leftBox, $centerBox, $rightBox].forEach(function ($el) {
                return observer.observe($el);
            });
        }
    }

    var $selects = document.querySelectorAll('select');

    var selectClasses = {
        select: 'select',
        open: 'is-open',
        box: 'select__box',
        value: 'select__value',
        list: 'select__list',
        item: 'select__item',
        itemActive: 'is-active'
    };

    var eventSelectChange = new CustomEvent('change');

    var $activeSelect = null;

    [].concat(toConsumableArray($selects)).forEach(function ($select) {
        var select = getCustomSelectHtml($select);
        var $customSelect = null;
        var $currentValue = null;
        var $options = null;

        $select.insertAdjacentHTML('beforeBegin', select);
        $select.style.display = 'none';

        $customSelect = $select.parentNode.querySelector('.' + selectClasses.select);
        $currentValue = $select.parentNode.querySelector('.' + selectClasses.value);
        $options = $select.parentNode.querySelectorAll('li');

        $currentValue.addEventListener('click', toggleVisibility);

        [].concat(toConsumableArray($options)).forEach(function ($option) {
            return $option.addEventListener('click', selectOption);
        });

        function toggleVisibility() {
            if ($customSelect.classList.contains(selectClasses.open)) {
                hideSelect();
            } else {
                hideSelect();

                $activeSelect = $customSelect;
                $customSelect.classList.add(selectClasses.open);
            }
        }

        function selectOption(event) {
            var $selectedOption = $select.querySelector('option[value="' + event.target.getAttribute('data-value') + '"]');
            var prevValue = $select.value;

            if ($selectedOption) {
                $selectedOption.selected = true;
            }

            // select new value
            if (prevValue !== $select.value) {
                $currentValue.innerHTML = event.target.innerHTML;

                [].concat(toConsumableArray($options)).forEach(function ($option) {
                    return $option.classList.remove(selectClasses.itemActive);
                });

                $select.dispatchEvent(eventSelectChange);
                event.target.classList.add(selectClasses.itemActive);
                hideSelect();
            }
        }
    });

    function hideSelect() {
        if ($activeSelect) {
            $activeSelect.classList.remove(selectClasses.open);
            $activeSelect = null;
        }
    }

    function getCustomSelectHtml($element) {
        var $options = $element.querySelectorAll('option');
        var valueHtml = '';
        var listHtml = '';

        [].concat(toConsumableArray($options)).forEach(function ($option) {
            if ($option.selected || $option.value === 'placeholder') {
                valueHtml = $option.innerHTML;
            }

            if ($option.value !== 'placeholder') {
                listHtml += '<li data-value="' + $option.value + '" \nclass="' + selectClasses.item + ' ' + ($option.selected ? selectClasses.itemActive : '') + '">' + $option.innerHTML + '</li>';
            }
        });

        return '\n<div class="' + selectClasses.select + '">\n  <div class="' + selectClasses.value + '">' + valueHtml + '</div>\n  <div class="' + selectClasses.box + '">\n    <ul class="' + selectClasses.list + '">\n      ' + listHtml + '\n    </ul>\n  </div>\n</div>\n';
    }

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

    /* global Swiper*/

    /**
     * @example {NodeList}
     * <div class="js-slider"
     * data-swiper-prev="#prev-btn"
     * data-swiper-next="#next-btn"
     * data-swiper-perview="1,1,1,1"
     * data-swiper-between="0,10,5,1">
     *
     * data-swiper-***="1,1,1,1": [extra-large, small, medium, large]
     */

    var elSliders = document.querySelectorAll('.js-slider');
    var breakpointSmall = 540;
    var breakpointMedium = 992;
    var breakpointLarge = 1240;

    if (window.Swiper) {
        [].concat(toConsumableArray(elSliders)).forEach(function (el) {
            var _breakpoints;

            var autoplay = el.getAttribute('data-swiper-autoplay');
            var speed = +el.getAttribute('data-swiper-speed') || 500;
            var prevButton = el.getAttribute('data-swiper-prev');
            var nextButton = el.getAttribute('data-swiper-next');
            var pagination = el.getAttribute('data-swiper-pagination');
            var loop = el.getAttribute('data-swiper-loop');
            var slidesPerView = el.getAttribute('data-swiper-perview') || '1';
            var spaceBetween = el.getAttribute('data-swiper-between') || '0';
            var slidesPerGroup = el.getAttribute('data-swiper-group') || '1';

            loop = loop !== 'false';
            slidesPerView = slidesPerView.split(',');
            spaceBetween = spaceBetween.split(',');
            slidesPerGroup = slidesPerGroup.split(',');

            var slider = new Swiper(el, {
                autoplay: autoplay,
                speed: speed,
                prevButton: prevButton,
                nextButton: nextButton,
                loop: loop,
                loopAdditionalSlides: 100,
                pagination: pagination,
                // slidesPerGroup: +slidesPerView[ 0 ],
                slidesPerView: +slidesPerView[0],
                spaceBetween: +spaceBetween[0],
                roundLengths: true,
                paginationClickable: true,
                centeredSlides: true,
                breakpoints: {
                    720: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        loopAdditionalSlides: false,
                        centeredSlides: false,
                    },
                }
            });

            el.addEventListener('mouseenter', function () {
                slider.stopAutoplay();
            });

            el.addEventListener('mouseleave', function () {
                slider.startAutoplay();
            });
        });
    }

    /**
     * toggle active class and some attributes
     * @type {NodeList}
     */
    var elToggles = document.querySelectorAll('.js-toggle');

    [].concat(toConsumableArray(elToggles)).forEach(function (el) {
        el.addEventListener('click', toggle);
    });

    function toggle(e) {
        var $btn = e.currentTarget;

        var activeClassName = $btn.getAttribute('data-toggle-active-class') || 'is-active';
        var target = $btn.getAttribute('data-toggle-target') || null;
        var newText = $btn.getAttribute('data-toggle-text') || null;
        var newTitle = $btn.getAttribute('data-toggle-title') || null;
        var group = $btn.getAttribute('data-toggle-group') || null;
        var done = $btn.getAttribute('data-toggle-callback-name') || null;

        if (newText) {
            $btn.setAttribute('data-toggle-text', $btn.innerHTML);
            $btn.innerHTML = newText;
        }

        if (newTitle) {
            $btn.setAttribute('data-toggle-title', $btn.getAttribute('title'));
            $btn.title = newTitle;
        }

        if (target === 'parent') {
            // target: parent node
            $btn.parentNode.classList.toggle(activeClassName);
        } else if (target) {
            // target: other nodes
            target.split(',').forEach(function (targ) {
                var elTarget = document.querySelector(targ.trim());

                if (elTarget) {
                    var targ2 = elTarget;

                    if (targ === 'parent') {
                        targ2 = elTarget.parentNode;
                    } else if (targ === 'self') {
                        targ2 = $btn;
                    }

                    targ2.classList.toggle(activeClassName);
                }
            });
        }

        // set active class for button
        $btn.classList.toggle(activeClassName);

        // show only 1 item if group
        if (group && $btn.classList.contains(activeClassName)) {
            var filteredEls = document.querySelectorAll('.js-toggle[data-toggle-group="' + group + '"]');

            [].concat(toConsumableArray(filteredEls)).forEach(function ($el) {
                if ($el !== $btn) {
                    $el.classList.remove(activeClassName);
                }
            });
        }

        // callback
        if (done) {
            done();
        }
    }

    var vanillaTextMask = function (e) {
        function r(n) {
            if (t[n]) {
                return t[n].exports;
            }
            var o = t[n] = {exports: {}, id: n, loaded: !1};
            return e[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports;
        }

        var t = {};
        return r.m = e, r.c = t, r.p = "", r(0);
    }([function (e, r, t) {

        function n(e) {
            return e && e.__esModule ? e : {default: e};
        }

        function o(e) {
            var r = e.inputElement,
                t = (0, u.default)(e),
                n = function n(e) {
                    var r = e.target.value;
                    return t.update(r);
                };
            return r.addEventListener("input", n), t.update(r.value), {
                textMaskInputElement: t,
                destroy: function destroy() {
                    r.removeEventListener("input", n);
                }
            };
        }

        Object.defineProperty(r, "__esModule", {value: !0}), r.conformToMask = void 0, r.maskInput = o;
        var i = t(2);
        Object.defineProperty(r, "conformToMask", {
            enumerable: !0,
            get: function get$$1() {
                return n(i).default;
            }
        });
        var a = t(5),
            u = n(a);
        r.default = o;
    }, function (e, r) {

        Object.defineProperty(r, "__esModule", {value: !0});
        r.placeholderChar = "_";
    }, function (e, r, t) {

        function n() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : a,
                t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                n = t.guide,
                u = void 0 === n || n,
                l = t.previousConformedValue,
                s = void 0 === l ? a : l,
                d = t.placeholderChar,
                f = void 0 === d ? i.placeholderChar : d,
                c = t.placeholder,
                v = void 0 === c ? (0, o.convertMaskToPlaceholder)(r, f) : c,
                p = t.currentCaretPosition,
                h = t.keepCharPositions,
                m = u === !1 && void 0 !== s,
                g = e.length,
                y = s.length,
                C = v.length,
                b = r.length,
                P = g - y,
                k = P > 0,
                x = p + (k ? -P : 0),
                O = x + Math.abs(P);
            if (h === !0 && !k) {
                for (var T = a, M = x; M < O; M++) {
                    v[M] === f && (T += f);
                }
                e = e.slice(0, x) + T + e.slice(x, g);
            }
            for (var _ = e.split(a).map(function (e, r) {
                return {
                    char: e,
                    isNew: r >= x && r < O
                };
            }), w = g - 1; w >= 0; w--) {
                var S = _[w].char;
                if (S !== f) {
                    var V = w >= x && y === b;
                    S === v[V ? w - P : w] && _.splice(w, 1);
                }
            }
            var j = a,
                N = !1;
            e: for (var E = 0; E < C; E++) {
                var A = v[E];
                if (A === f) {
                    if (_.length > 0) {
                        for (; _.length > 0;) {
                            var I = _.shift(),
                                L = I.char,
                                R = I.isNew;
                            if (L === f && m !== !0) {
                                j += f;
                                continue e;
                            }
                            if (r[E].test(L)) {
                                if (h === !0 && R !== !1 && s !== a && u !== !1 && k) {
                                    for (var J = _.length, q = null, F = 0; F < J; F++) {
                                        var W = _[F];
                                        if (W.char !== f && W.isNew === !1) {
                                            break;
                                        }
                                        if (W.char === f) {
                                            q = F;
                                            break;
                                        }
                                    }
                                    null !== q ? (j += L, _.splice(q, 1)) : E--;
                                } else {
                                    j += L;
                                }
                                continue e;
                            }
                            N = !0;
                        }
                    }
                    m === !1 && (j += v.substr(E, C));
                    break;
                }
                j += A;
            }
            if (m && k === !1) {
                for (var z = null, B = 0; B < j.length; B++) {
                    v[B] === f && (z = B);
                }
                j = null !== z ? j.substr(0, z + 1) : a;
            }
            return {conformedValue: j, meta: {someCharsRejected: N}};
        }

        Object.defineProperty(r, "__esModule", {value: !0}), r.default = n;
        var o = t(3),
            i = t(1),
            a = "";
    }, function (e, r, t) {

        function n() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l,
                r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u.placeholderChar;
            if (e.indexOf(r) !== -1) {
                throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n" + ("The placeholder character that was received is: " + JSON.stringify(r) + "\n\n") + ("The mask that was received is: " + JSON.stringify(e)));
            }
            return e.map(function (e) {
                return e instanceof RegExp ? r : e;
            }).join("");
        }

        function o(e) {
            return "string" == typeof e || e instanceof String;
        }

        function i(e) {
            return "number" == typeof e && void 0 === e.length && !isNaN(e);
        }

        function a(e) {
            for (var r = [], t = void 0; t = e.indexOf(s), t !== -1;) {
                r.push(t), e.splice(t, 1);
            }
            return {maskWithoutCaretTraps: e, indexes: r};
        }

        Object.defineProperty(r, "__esModule", {value: !0}), r.convertMaskToPlaceholder = n, r.isString = o, r.isNumber = i, r.processCaretTraps = a;
        var u = t(1),
            l = [],
            s = "[]";
    }, function (e, r) {

        function t(e) {
            var r = e.previousConformedValue,
                t = void 0 === r ? o : r,
                i = e.previousPlaceholder,
                a = void 0 === i ? o : i,
                u = e.currentCaretPosition,
                l = void 0 === u ? 0 : u,
                s = e.conformedValue,
                d = e.rawValue,
                f = e.placeholderChar,
                c = e.placeholder,
                v = e.indexesOfPipedChars,
                p = void 0 === v ? n : v,
                h = e.caretTrapIndexes,
                m = void 0 === h ? n : h;
            if (0 === l) {
                return 0;
            }
            var g = d.length,
                y = t.length,
                C = c.length,
                b = s.length,
                P = g - y,
                k = P > 0,
                x = 0 === y,
                O = P > 1 && !k && !x;
            if (O) {
                return l;
            }
            var T = k && (t === s || s === c),
                M = 0,
                _ = void 0;
            if (T) {
                M = l - P;
            } else {
                var w = s.toLowerCase(),
                    S = d.toLowerCase(),
                    V = S.substr(0, l).split(o),
                    j = V.filter(function (e) {
                        return w.indexOf(e) !== -1;
                    }),
                    N = j[j.length - 1];
                _ = void 0 !== a[j.length - 1] && void 0 !== c[j.length - 2] && a[j.length - 1] !== f && a[j.length - 1] !== c[j.length - 1] && a[j.length - 1] === c[j.length - 2];
                for (var E = p.map(function (e) {
                    return w[e];
                }), A = E.filter(function (e) {
                    return e === N;
                }).length, I = j.filter(function (e) {
                    return e === N;
                }).length, L = c.substr(0, c.indexOf(f)).split(o).filter(function (e, r) {
                    return e === N && d[r] !== e;
                }).length, R = L + I + A, J = 0, q = 0; q < b; q++) {
                    var F = w[q];
                    if (M = q + 1, F === N && J++, J >= R) {
                        break;
                    }
                }
            }
            if (k) {
                for (var W = M, z = M; z <= C; z++) {
                    if (c[z] === f && (W = z), c[z] === f || m.indexOf(z) !== -1 || z === C) {
                        return W;
                    }
                }
            } else {
                for (var B = M + (_ ? 1 : 0); B >= 0; B--) {
                    if (c[B - 1] === f || m.indexOf(B) !== -1 || 0 === B) {
                        return B;
                    }
                }
            }
        }

        Object.defineProperty(r, "__esModule", {value: !0}), r.default = t;
        var n = [],
            o = "";
    }, function (e, r, t) {

        function n(e) {
            return e && e.__esModule ? e : {default: e};
        }

        function o(e) {
            var r = {
                previousConformedValue: void 0,
                previousPlaceholder: void 0
            };
            return {
                state: r,
                update: function update(t) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e,
                        o = n.inputElement,
                        s = n.mask,
                        f = n.guide,
                        g = n.pipe,
                        C = n.placeholderChar,
                        b = void 0 === C ? p.placeholderChar : C,
                        P = n.keepCharPositions,
                        k = void 0 !== P && P;
                    if ("undefined" == typeof t && (t = o.value), t !== r.previousConformedValue) {
                        ("undefined" == typeof s ? "undefined" : l(s)) === y && void 0 !== s.pipe && void 0 !== s.mask && (g = s.pipe, s = s.mask);
                        var x = void 0,
                            O = void 0;
                        if (s instanceof Array && (x = (0, v.convertMaskToPlaceholder)(s, b)), s !== !1) {
                            var T = a(t),
                                M = o.selectionStart,
                                _ = r.previousConformedValue,
                                w = r.previousPlaceholder,
                                S = void 0;
                            if (("undefined" == typeof s ? "undefined" : l(s)) === h) {
                                if (O = s(T, {
                                    currentCaretPosition: M,
                                    previousConformedValue: _,
                                    placeholderChar: b
                                }), O === !1) {
                                    return;
                                }
                                var V = (0, v.processCaretTraps)(O),
                                    j = V.maskWithoutCaretTraps,
                                    N = V.indexes;
                                O = j, S = N, x = (0, v.convertMaskToPlaceholder)(O, b);
                            } else {
                                O = s;
                            }
                            var E = {
                                    previousConformedValue: _,
                                    guide: f,
                                    placeholderChar: b,
                                    pipe: g,
                                    placeholder: x,
                                    currentCaretPosition: M,
                                    keepCharPositions: k
                                },
                                A = (0, c.default)(T, O, E),
                                I = A.conformedValue,
                                L = ("undefined" == typeof g ? "undefined" : l(g)) === h,
                                R = {};
                            L && (R = g(I, u({rawValue: T}, E)), R === !1 ? R = {
                                value: _,
                                rejected: !0
                            } : (0, v.isString)(R) && (R = {value: R}));
                            var J = L ? R.value : I,
                                q = (0, d.default)({
                                    previousConformedValue: _,
                                    previousPlaceholder: w,
                                    conformedValue: J,
                                    placeholder: x,
                                    rawValue: T,
                                    currentCaretPosition: M,
                                    placeholderChar: b,
                                    indexesOfPipedChars: R.indexesOfPipedChars,
                                    caretTrapIndexes: S
                                }),
                                F = J === x && 0 === q,
                                W = F ? m : J;
                            r.previousConformedValue = W, r.previousPlaceholder = x, o.value !== W && (o.value = W, i(o, q));
                        }
                    }
                }
            };
        }

        function i(e, r) {
            document.activeElement === e && (C ? b(function () {
                return e.setSelectionRange(r, r, g);
            }, 0) : e.setSelectionRange(r, r, g));
        }

        function a(e) {
            if ((0, v.isString)(e)) {
                return e;
            }
            if ((0, v.isNumber)(e)) {
                return String(e);
            }
            if (void 0 === e || null === e) {
                return m;
            }
            throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e));
        }

        Object.defineProperty(r, "__esModule", {value: !0});
        var u = Object.assign || function (e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = arguments[r];
                    for (var n in t) {
                        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                    }
                }
                return e;
            },
            l = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
                return typeof e === "undefined" ? "undefined" : _typeof(e);
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
            };
        r.default = o;
        var s = t(4),
            d = n(s),
            f = t(2),
            c = n(f),
            v = t(3),
            p = t(1),
            h = "function",
            m = "",
            g = "none",
            y = "object",
            C = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
            b = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
    }]);

    var phoneMask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
    var CARET_POS = 4;
    var $phones = document.querySelectorAll('input[type=tel]');

    [].concat(toConsumableArray($phones)).forEach(function (inputElement) {
        var options = {
            inputElement: inputElement,
            mask: phoneMask,
            placeholderChar: '_'
        };
        var mask = vanillaTextMask.maskInput(options);
        // let placeholder;

        // inputElement.addEventListener( 'focus', () => {
        //   if ( !placeholder ) {
        //     placeholder = inputElement.placeholder;
        //   }
        //   inputElement.placeholder = '+7 (___) ___-____';
        // } );

        inputElement.addEventListener('click', function () {
            if (inputElement.value === '') {
                inputElement.value = '+7 (___) ___-__-__';
                inputElement.setSelectionRange(CARET_POS, CARET_POS);
                inputElement.focus();
            }
        });

        inputElement.addEventListener('blur', function () {
            // inputElement.placeholder = placeholder;

            if (/_/.test(inputElement.value)) {
                inputElement.value = '';
                mask.destroy();
                mask = vanillaTextMask.maskInput(options);
            }
        });
    });

    svg4everybody();

    var popup = new Popup('.js-popup');
    var fnThrottle$1 = throttle(resize, 50);
    var eventPopupHide = new CustomEvent('popup.hide');

    window.addEventListener('resize', fnThrottle$1);

    function resize() {
        document.dispatchEvent(eventPopupHide);
    }

}());

//# sourceMappingURL=bundle.js.map