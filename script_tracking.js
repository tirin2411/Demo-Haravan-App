(function() { 
  console.log('request.page_type', "{{ template }}" );
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
      customer_id = window._cdpEventFunction.md5(phone);
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
    console.log('view_product');
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
})();
