
  //console.log('request.page_type', "{{ template }}" );
  // Constants
  var _cdpBtnAddtocart = '#add-to-cart';
  var _cdpBtnBuyNow = '#buy-now';
  var _cdpQuantityAddCart = '.quantity-input';
  var _cdpFormSignIn = 'form#customer_login';
  var _cdpFormSignUp = 'form#create_customer';

  var _cdpCartListItems = '.table-cart';
  var _cdpCartItemArr = '.media-line-item.line-item';
  var _cdpBtnRemoveCart = '.item-remove';
  var _cdpBtnConfirmRemoveCart = '.swal-cart-remove .swal-button-container .swal-button--confirm';

  var _cdpSourceWebsite = 'Testing';

  var _cdpMD5 = function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);

            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }

            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;

            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }

            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }

            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;

        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);

            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }


        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    };

  // Utilities
  function waitForElement(params) {
    try {
      var selector = params.selector;
      var root;
      var interval = params.interval || 500;
      var loop = params.loop || 10;
      var mode = params.mode || "single"; // mode: single | multiple
      var type = params.type || "element"; // type: element | variable | xpath
      var callback = params.callback;
        if (typeof selector != 'string') {
          return 0;
        }
        var counter = 0;
        var interval = setInterval(
        function () {
          try {
            counter++;
            var el;
            switch (type) {
              case 'element': {
                root = params.root || document;
                el = root.querySelector(selector);
                break;
              }
              case 'variable': {
                root = params.root || window;
                el = root[selector];
                break;
              }
              case 'xpath': {
                root = params.root || document;
                el = document.evaluate(selector, root, null, XPathResult.ANY_TYPE, null);
                break;
              }
            }
            if (el) {
              if (typeof callback == 'function') {
              if (mode == 'multiple') {
                switch (type) {
                  case 'element': {
                    el = root.querySelectorAll(selector);
                    break;
                  }
                  case 'xpath': {
                    var array = [];
                    var iterate = el.iterateNext();
                    while (iterate) {
                      arrary = array.push(iterate);
                      iterate = el.iterateNext();
                    }
                    el = array;
                    break;
                  }
                }
              }
              else {
                switch (type) {
                  case 'xpath': {
                    el = el.iterateNext();
                    break;
                  }
                }
              }
              callback(el);
              }
              clearInterval(interval);
            }
            if (counter > loop) {
              clearInterval(interval);
            }
          }
          catch (ex) {
            console.log("cdp log: ", ex);
          }
        },
        interval
        );
          return 1;
        }
        catch (ex) {
            console.log("cdp log: ", ex);
            return 0;
        }
    }

  var _cdpGetCart = function (callback) {
        try {
            if (typeof Haravan != "undefined" && Object.keys(Haravan).length) {
                waitForElement({
                    type: 'variable',
                    selector: 'getCart',
                    root: Haravan,
                    callback: function (getCart) {
                        try {
                            getCart(function (cart) {
                                if (typeof callback == "function") {
                                    callback(cart);
                                }
                            });
                        } catch (ex) {
                            console.log("cdp log: ", ex);
                        }
                    }
                });
            }
        } catch (ex) {
            console.log("cdp log:", ex);

            if (typeof callback == "function") {
                callback(null);
            }
        }
    };
  
  class CDPTracking {
    constructor() {
      this.cdp_source = "Haravan";
      this.customers = null;
      //console.log("CDPTracking constructor");
    }
    
    // helper functions

    formatDate(date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let day = String(date.getDate()).padStart(2, "0");
      let hours = String(date.getHours()).padStart(2, "0");
      let minutes = String(date.getMinutes()).padStart(2, "0");
      let seconds = String(date.getSeconds()).padStart(2, "0");
  
      // Assemble the formatted date string
      let formattedDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return formattedDate;
    }

    getCurrentVariantId(){
      let variantIDSelect = document.getElementById("product-select");
      let variantIDSelector = document.getElementById("product-selector");
      if (variantIDSelect) {
        return $('#product-select').val();
      }
      if (variantIDSelector) {
        return $('#product-selector').val();
      }
    }
    
    getCurrentVariant(product, variantId) {
      return product.variants.find((variant) => {
        return variant.id == variantId;
      });
    }
    
    setCustomers(customer) {
      this.customers = customer;
    }
    
    getIdentifyTime() {
      return this.formatDate(new Date());
    }
    
    getCartItem(item, view_cart) {
      let product = {
        type: "product",
        cdp_source: this.cdp_source,
        id: item.variant_id,
        name: item.product_title,
        sku: item.sku,
        page_url: window.location.href,
        image_url: item.image,
        brand: item.vendor,
        main_category: item.product_type,
        //variant: item.title,
        option1: item.variant_options[0],
        option2: item.variant_options[1],
        option3: item.variant_options[2],
        haravan_product_id: `${item.variant_id}`,
        parent_item_id: item.sku,
        is_parent: "false",
        quantity: `${item.quantity}`,
        source_website: _cdpSourceWebsite
      };
      if (view_cart) {
        // product.line_item_unit_price = item.price / 100;
        // product.line_item_discount_amount = (item.price - item.discounted_price) / 100;
        // product.line_item_rounded_amount = item.discounted_price / 100;
        product.page_url = window.location.origin + item.url,
        product.price = item.price / 100;
        product.original_price = item.price_original / 100;
      }
      return product;
    }
    setCookie(name, value) {
      var date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      var expires = "; expires=" + date.toUTCString();
  
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  // tracking functions
    viewProduct(product, currentVariant, option1ValueEL, option2ValueEL, option3ValueEL, viewChild) {
      let item = {
        type: "product",
        cdp_source: this.cdp_source,
        id: currentVariant.id,
        name: product.title,
        sku: currentVariant.sku,
        page_url: window.location.href,
        image_url: `${product.featured_image}`,
        price: currentVariant.price / 100,
        original_price:
          currentVariant.compare_at_price > 0
            ? currentVariant.compare_at_price / 100
            : currentVariant.price / 100,
        brand: product.vendor,
        main_category: product.type,
        //variant: currentVariant.name,
        haravan_product_id: currentVariant.id,
        parent_item_id: currentVariant.sku,
        is_parent: "false",
        source_website: _cdpSourceWebsite
      };
      if(option1ValueEL){
        item.option1 = option1ValueEL;
      }
      else if (currentVariant.option1 !== "") {
        item.option1 = currentVariant.option1;
      }
      if(option2ValueEL){
        item.option2 = option2ValueEL;
      }
      else if (currentVariant.option2 !== "") {
        item.option2 = currentVariant.option2;
      }
      if(option3ValueEL){
        item.option3 = option3ValueEL;
      }
      else if (currentVariant.option3 !== "") {
        item.option3 = currentVariant.option3;
      }

      var titleLabel = "";
      if(item.option1 && item.option2 && item.option3){
        titleLabel = item.option1+' / '+item.option2+' / '+item.option3;
      }
      else if(item.option1 && item.option2){
        titleLabel = item.option1+' / '+item.option2;
      }
      else if(item.option1){
        titleLabel = item.option1;
      }
      if(titleLabel){
        let titleIndex = product.variants.findIndex((variant) => variant.title.trim() == titleLabel.trim());
        if (titleIndex !== -1 ) {
          item.id = product.variants[titleIndex].id;
          item.sku = product.variants[titleIndex].sku;
          item.haravan_product_id = product.variants[titleIndex].id;
          item.parent_item_id = product.variants[titleIndex].sku;
        }
      }

      const trackingOptions = {
        items: [item],

        extra: {
          identify_event: "view_product",
          identify_time: this.getIdentifyTime(),
        },
      };
      if (this.customers) {
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      if(viewChild){
        trackingOptions.extra.view_child = viewChild;
      }else{
        trackingOptions.extra.view_child = false;
      }
      web_event.track("product", "view", trackingOptions);
    }
    
    addToCart(items, carts) {
      let cart = carts;
      if (!cart) return;

      var quantityItem = document.querySelector(_cdpQuantityAddCart);
      if(quantityItem){
        quantityItem = quantityItem.value;
      }
      items.quantity = +quantityItem;
      const trackingOptions = {
        items: [items],
  
        extra: {
          cart_subtotal: cart.total_price / 100,
          cart_item_count: cart.item_count,
          identify_time: this.getIdentifyTime(),
          identify_event: "add_to_cart",
          event_source: "add_to_cart",
        },
      };
      if (this.customers) {
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      web_event.track("product", "add_to_cart", trackingOptions);
    }
    
    buyNow(items, carts) {
      let cart = carts;
      if (!cart) return;

      var quantityItem = document.querySelector(_cdpQuantityAddCart);
      if(quantityItem){
        quantityItem = quantityItem.value;
      }
      items.quantity = +quantityItem;
      const trackingOptions = {
        items: [items],
  
        extra: {
          cart_subtotal: cart.total_price / 100,
          cart_item_count: cart.item_count,
          identify_time: this.getIdentifyTime(),
          identify_event: "add_to_cart",
          event_source: "buy_now",
        },
      };
      if (this.customers) {
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      web_event.track("product", "add_to_cart", trackingOptions);
    }
    
    viewCart(carts) {
      let cart = carts;
      if (!cart) return;
      let items = cart.items.map((item) => {
        return this.getCartItem(item, true);
      });
      const trackingOptions = {
        items,
        extra: {
          cart_subtotal: cart.total_price / 100,
          cart_item_count: cart.item_count,
          identify_time: this.getIdentifyTime(),
          identify_event: "view_cart",
        },
      };
      if (this.customers) {
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      web_event.track("product", "view_cart", trackingOptions);
    }
    
    removeFromCart(id, carts) {
      let cart = carts;
      let items = {
          type: "product",
          id: id,
        };
      const trackingOptions = {
        items: [items],
        extra: {
          cart_subtotal: cart.total_price / 100,
          cart_item_count: cart.item_count,
          identify_time: this.getIdentifyTime(),
          identify_event: "remove_cart",
        },
      };
      if (this.customers) {
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      web_event.track("product", "remove_cart", trackingOptions);
    }
    
    userSignIn() {
      if (!this.customers.customer_id) return;
      web_event.track("user", "sign_in", {
        dims: {
          customers: {
            customer_id: this.customers.customer_id,
            name: this.customers.name,
            email: this.customers.email,
            phone: this.customers.phone,
            is_customer_mollis: true
          },
        },
        extra: {
          identify_event: "sign_in",
          identify_id: this.customers.customer_id,
          identify_time: this.getIdentifyTime(),
          name: this.customers.name,
          email: this.customers.email,
          phone: this.customers.phone
        },
      });
    }
    
    userSignUp() {
      if (!this.customers.customer_id) return;
      web_event.track("user", "sign_up", {
        dims: {
          customers: {
            customer_id: this.customers.customer_id,
            name: this.customers.name,
            email: this.customers.email,
            phone: this.customers.phone,
            is_customer_mollis: true
          },
        },
        extra: {
          identify_event: "sign_up",
          identify_id: this.customers.customer_id,
          identify_time: this.getIdentifyTime(),
          name: this.customers.name,
          email: this.customers.email,
          phone: this.customers.phone
        },
      });
    }
    
    identify() {
      web_event.track("user", "identify", {
        dims: {
          customers: {
            customer_id: this.customers.customer_id,
            name: this.customers.name,
            email: this.customers.email,
            phone: this.customers.phone,
            is_customer_mollis: true
          },
        },
        extra: {
          identify_event: "user_identify",
          identify_id: this.customers.customer_id,
          identify_time: this.getIdentifyTime(),
          name: this.customers.name,
          email: this.customers.email,
          phone: this.customers.phone
        },
      });
    }
  
    proudctSearch(products, src_search_term) {
      const items = products.map((item) => {
        return {
          type: "product",
          cdp_source: this.cdp_source,
          id: item.variants[0].id,
          name: item.title,
          source_website: _cdpSourceWebsite
        };
      });
      const trackingOptions = {
        items: items,
  
        extra: {
          src_search_term: src_search_term,
          identify_time: this.getIdentifyTime(),
          identify_event: "product_search",
        },
      };
      if (this.customers) {
        trackingOptions.extra.identify_id = this.customers.customer_id;
        // trackingOptions.dims = {
        //   customers: this.customers,
        // };
      }
  
      web_event.track("browsing", "product_search", trackingOptions);
    }
    
    checkout() {
      let cart = this.getCart();
      if (!cart) return;
      let items = cart.items;
      items = items.map((item) => {
        return {
          type: "product",
          cdp_source: this.cdp_source,
          id: item.id,
          name: item.product_title,
          line_item_unit_price: item.price / 100,
          line_item_discount_amount: (item.price - item.discounted_price) / 100,
          line_item_rounded_amount: item.discounted_price / 100,
          quantity: `${item.quantity}`,
          line_item_quantity: `${item.quantity}`,
          source_website: _cdpSourceWebsite
        };
      });
      const trackingOptions = {
        items: items,
  
        extra: {
          cart_subtotal: cart.items_subtotal_price / 100,
          cart_item_count: cart.item_count,
          identify_time: this.getIdentifyTime(),
          identify_event: "checkout",
        },
      };
      if (this.customers) {
        trackingOptions.dims = {
          customers: this.customers,
        };
        trackingOptions.extra.identify_id = this.customers.customer_id;
      }
      web_event.track("product", "checkout", trackingOptions);
    }
  }
// Init CDP tracking
window.cdpTracking = new CDPTracking();

// Customer event
document.addEventListener("DOMContentLoaded", function() {
  if (typeof Haravan !== 'undefined' && Haravan.customer) {
    const customer = Haravan.customer;
    const phone = customer.default_address ? customer.default_address.phone.replace('+84', '0') : '';
    let customer_id = '';

    if (phone !== "") {
      customer_id = _cdpMD5(phone);
    }
    const customerData = {
      customer_id: customer_id,
      name: customer.name,
      email: customer.email,
      phone: phone,
    };

    if (customerData.customer_id) {
      window.cdpTracking.setCustomers(customerData);
      window.localStorage.setItem("cdp_customer", JSON.stringify(customerData));
      const loginSubmitted = sessionStorage.getItem('loginSubmitted');
      const registerSubmitted = sessionStorage.getItem('registerSubmitted');
      
      if (registerSubmitted && !loginSubmitted) {
        window.cdpTracking.userSignUp();
        sessionStorage.removeItem('registerSubmitted');
      }
      if (loginSubmitted) {
        window.cdpTracking.userSignIn();
      }
      sessionStorage.removeItem('loginSubmitted');
      
      const identityUser = window.cdpTracking.getCookie('cdp_identity_user');
      if (!identityUser) {
        window.cdpTracking.setCookie('cdp_identity_user', true);
        window.cdpTracking.identify();
      }
    }
  } else {
    window.localStorage.removeItem('cdp_customer');
  }

  // View product event
  if (window.location.pathname.includes('/products/')) {
    const product = Haravan.product;
    window.cdpTracking.currentProduct = product;
    let currentVariant = window.cdpTracking.getCurrentVariant(product, product.selected_or_first_available_variant.id);
    window.cdpTracking.viewProduct(product, currentVariant);

    // Option selection logic
    const setupOptionListener = (selector, optionIndex) => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          setTimeout(() => {
            const optionValue = button.querySelector('input').value;
            const options = [
              document.querySelector("#variant-swatch-0 .sd span"),
              document.querySelector("#variant-swatch-1 .sd span"),
              document.querySelector("#variant-swatch-2 .sd span")
            ].map(el => el ? el.textContent : null);
            options[optionIndex] = optionValue;
            window.cdpTracking.viewProduct(product, currentVariant, ...options, true);
          }, 0);
        });
      });
    };

    setupOptionListener('#variant-swatch-0 .swatch-element label', 0);
    setupOptionListener('#variant-swatch-1 .swatch-element label', 1);
    setupOptionListener('#variant-swatch-2 .swatch-element label', 2);

    // Add to cart
    waitForElement({
      type: 'element',
      selector: _cdpBtnAddtocart,
      callback: function (btnAddtocart) {
        btnAddtocart.addEventListener("click", function () {
          let currentVariantAddtocart = window.cdpTracking.getCurrentVariant(product, window.cdpTracking.getCurrentVariantId());
          let itemAdded = {
            type: "product",
            cdp_source: this.cdp_source,
            id: currentVariantAddtocart.id,
            name: product.title,
            sku: currentVariantAddtocart.sku,
            page_url: window.location.href,
            image_url: product.featured_image,
            price: currentVariantAddtocart.price / 100,
            original_price: currentVariantAddtocart.compare_at_price > 0
              ? currentVariantAddtocart.compare_at_price / 100
              : currentVariantAddtocart.price / 100,
            brand: product.vendor,
            main_category: product.product_type,
            haravan_product_id: `${currentVariantAddtocart.id}`,
            parent_item_id: currentVariantAddtocart.sku,
            is_parent: "false",
            source_website: _cdpSourceWebsite
          };

          ['option1', 'option2', 'option3'].forEach(option => {
            if (currentVariantAddtocart[option] !== "") {
              itemAdded[option] = currentVariantAddtocart[option];
            }
          });

          _cdpGetCart(function (cart) {
            if (cart) {
              window.cdpTracking.addToCart(itemAdded, cart);
            }
          });
        });
      }
    });

    // Buy now
    // (Similar to Add to cart, but with buyNow instead of addToCart)
  }

  // View cart
  if (window.location.pathname.includes('/cart')) {
    const onRemoveCart = function (handleId, cartItems, carts) {
      return function () {
        const removingProduct = cartItems.find(item => item.variant_id == handleId);
        const id = removingProduct.variant_id;
        const btnConfirm = document.querySelector(_cdpBtnConfirmRemoveCart);
        if (btnConfirm) {
          btnConfirm.addEventListener("click", function () {
            setTimeout(() => {
              window.cdpTracking.removeFromCart(id, carts);
            }, 0);
          });
        }
      };
    };

    waitForElement({
      type: 'element',
      selector: _cdpCartListItems,
      callback: function (cartListItem) {
        _cdpGetCart(function (cart) {
          if (cart) {
            window.cdpTracking.viewCart(cart);
            const cartItemArr = cartListItem.querySelectorAll(_cdpCartItemArr);
            cartItemArr.forEach(item => {
              const btnRemove = item.querySelector(_cdpBtnRemoveCart);
              const handleId = item.getAttribute("data-variant-id");
              btnRemove.addEventListener("click", onRemoveCart(handleId, cart.items, cart));
            });
          }
        });
      }
    });
  }

  // Sign in
  waitForElement({
    type: 'element',
    selector: _cdpFormSignIn,
    callback: function (formLogin) {
      formLogin.addEventListener('submit', function() {
        sessionStorage.setItem('loginSubmitted', 1);
      });
    }
  });

  // Sign up
  if (window.location.href.includes("/account/register")) {
    waitForElement({
      type: 'element',
      selector: _cdpFormSignUp,
      callback: function (formSignUp) {
        formSignUp.addEventListener('submit', function() {
          sessionStorage.setItem('registerSubmitted', 1);
        });
      }
    });
  }

  // Search product event
  if (window.location.pathname.includes('/search')) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    if (searchTerm) {
      const products = window.searchResults || []; // Assume search results are provided globally
      window.cdpTracking.proudctSearch(products, searchTerm);
    }
  }
});

