var _cdpGetCookie = function (cookieName) {
  var cookiePattern = new RegExp("(^|;)[ ]*" + cookieName + "=([^;]*)");
  cookieMatch = cookiePattern.exec(document.cookie);
  return cookieMatch ? window.decodeURIComponent(cookieMatch[2]) : 0;
};

var _cdpSetCookie = function (cookieName, value, msToExpire, path, domain, secure) {
  var expiryDate;
  if (msToExpire != undefined) {
    expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + msToExpire);
  }
  var valueData = value + "";
  if (isNaN(value)) {
    valueData = window.encodeURIComponent(value);
  }
  var cookieInfo = cookieName + "=" + valueData + (msToExpire ? ";expires=" + expiryDate.toGMTString() : "") + ";path=" + (path || "/") + (domain ? ";domain=" + domain : "") + (secure ? ";secure" : "");
  document.cookie = cookieInfo;
};

var _cdpGetLeadTime = function () {
  var d = new Date();
  var m = d.getMonth() + 1;
  if (parseInt(m) < 10) {
    m = "0" + m;
  }

  var day = d.getDate();
  if (parseInt(day) < 10) {
    day = "0" + day;
  }

  var hour = d.getHours();
  if (parseInt(hour) < 10) {
    hour = "0" + hour;
  }

  var min = d.getMinutes();
  if (parseInt(min) < 10) {
    min = "0" + min;
  }

  var sec = d.getSeconds();
  if (parseInt(sec) < 10) {
    sec = "0" + sec;
  }

  var leadTime = d.getFullYear() + "-" + m + "-" + day + " " + hour + ":" + min + ":" + sec;

  return leadTime;
};

var _cdpGetCart = function (callback) {
  try {
    var _cdpGetCartCounter = 0;
    var _cdpIsProcessingCart = false;

    var _cdpGetCartTimer = setInterval(function () {
      _cdpGetCartCounter++;

      if (typeof Haravan != "undefined" && Object.keys(Haravan).length) {
        if (typeof Haravan.getCart == "function" && !_cdpIsProcessingCart) {
          _cdpIsProcessingCart = true;
          setTimeout(function () {
            try {
              Haravan.getCart(function (cart) {
                _cdpIsProcessingCart = false;
                clearInterval(_cdpGetCartTimer);

                if (typeof callback == "function") {
                  callback(cart);
                }
              });
            } catch (ex) {
              console.log("cdp log: ", ex);
            }
          }, 500);
        }
      }

      if (_cdpGetCartCounter > 50) {
        clearInterval(_cdpGetCartTimer);

        _cdpGetCartTimer = null;

        if (typeof callback == "function") {
          callback(null);
        }
      }
    }, 100);
  } catch (ex) {
    console.log("cdp log:", ex);

    if (typeof callback == "function") {
      callback(null);
    }
  }
};

var _cdpGetProductDetail = function (callback, _handleId) {
  try {
    var _cdpGetProductDetailCounter = 0;
    var _cdpIsProcessingProduct = false;

    var _cdpGetProductDetailTimer = setInterval(function () {
      _cdpGetProductDetailCounter++;

      if (typeof HaravanAnalytics != "undefined" && Object.keys(HaravanAnalytics).length) {
        var meta = HaravanAnalytics.meta;

        if (typeof meta != "undefined" && Object.keys(meta).length) {
          var productMeta = meta.product;

          if (typeof productMeta != "undefined" && Object.keys(productMeta).length) {
            var selectedVariant = productMeta.selected_or_first_available_variant;

            if (typeof selectedVariant != "undefined" && Object.keys(selectedVariant).length) {
              var sku = selectedVariant.sku;

              if (typeof HaravanAnalytics != "undefined" && Object.keys(HaravanAnalytics).length) {
                var handleId = _handleId || window.location.pathname.split("/").pop();

                if (handleId) {
                  if (typeof Haravan != "undefined" && Object.keys(Haravan).length) {
                    if (typeof Haravan.getProduct == "function" && !_cdpIsProcessingProduct) {
                      _cdpIsProcessingProduct = true;
                      setTimeout(function () {
                        try {
                          Haravan.getProduct(handleId, function (product) {
                            _cdpIsProcessingProduct = false;
                            var haravan_product_id = product.id;
                            var name = product.title;
                            var image_url = product.featured_image;
                            var page_url = "https://" + Haravan.domain + product.url;
                            var variant = null;
                            for (var i = 0; i < product.variants.length; i++) {
                              var currVariant = product.variants[i];

                              if (currVariant.sku === sku) {
                                variant = currVariant;

                                break;
                              }
                            }

                            if (variant) {
                              var price = +variant.price / 100;
                              var orginal_price = +variant.compare_at_price / 100 || price;

                              var product_item = {
                                type: "product",
                                id: sku,
                                sku: sku,
                                name: name,
                                image_url: image_url,
                                page_url: page_url,
                                haravan_product_id: haravan_product_id,
                                parent_item_id: haravan_product_id,
                                price: price,
                                original_price: orginal_price,
                                brand: brand
                              };
                              clearInterval(_cdpGetProductDetailTimer);

                              if (typeof callback == "function") {
                                callback(product_item);
                              }
                            }
                          });
                        } catch (ex) {
                          console.log("cdp log: ", ex);
                        }
                      }, 500);
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (_cdpGetProductDetailCounter > 50) {
        clearInterval(_cdpGetProductDetailTimer);

        _cdpGetProductDetailTimer = null;

        if (typeof callback == "function") {
          callback(null);
        }
      }
    }, 100);
  } catch (ex) {
    console.log("cdp log:", ex);

    if (typeof callback == "function") {
      callback(null);
    }
  }
};

var cdpProductDetailTracking = function () {
  try {
    if (window.location.href.includes("/products")) {
      console.log('view_product_nè');
      _cdpGetProductDetail(function (products) {
        if (products) {
          var dataProps = {
            items: [products],
          };

          web_event.queue.push(["track", "product", "view", dataProps]);
          // console.log(dataProps)
          // button buy now
          jQuery("button.buynow-detail").on("click", function () {
            try {
              _cdpGetProductDetail(function (products) {
                if (products) {
                  var quantity = +document.querySelector('input#pdQuantity.input-text.qty.text').value;
                  products.quantity = quantity;

                  var dataProps = {
                    items: [products],
                    extra: {
                      event_source: "buy_now",
                    },
                  };

                  _cdpGetCart(function (cart) {
                    if (cart) {
                      dataProps.extra.cart_subtotal = cart.total_price;
                      dataProps.extra.cart_item_count = cart.item_count;

                      web_event.track("product", "buy_now", dataProps);
                      // console.log(dataProps)
                    }
                  });
                }
              });
            } catch (ex) {
              console.log("cdp log: ", ex);
            }
          });

          // button add to cart
          jQuery("button.addtocart-detail").on("click", function () {
            try {
              _cdpGetProductDetail(function (products) {
                if (products) {
                  var quantity = +document.querySelector('input#pdQuantity.input-text.qty.text').value;
                  products.quantity = quantity;

                  var dataProps = {
                    items: [products],
                    extra: {
                      event_source: "add_to_cart",
                    },
                  };

                  _cdpGetCart(function (cart) {
                    if (cart) {
                      dataProps.extra.cart_subtotal = cart.total_price/100;
                      dataProps.extra.cart_item_count = cart.item_count;

                      web_event.track("product", "add_to_cart", dataProps);
                      // console.log(dataProps)
                    }
                  });
                }
              });
            } catch (ex) {
              console.log("cdp log: ", ex);
            }
          });
        }
      });
    }
  } catch (ex) {
    console.log("cdp log:", ex);
  }
};

var cdpActionClickTracking = function () {
  try {
    // Remove Item cart from view cart popup
    var tableCartEl = document.querySelector("table#cart-view");
    if (tableCartEl) {
      _cdpGetCart(function (cart) {
        try {
          if (cart) {
            var cartItems = cart.items;
            if (cartItems.length) {
              jQuery("table#cart-view tr.item_2 td span.remove_link.remove-cart a").each(function () {
                try {
                  jQuery(this).on("click", function () {
                    try {
                      var handleId = jQuery(this).closest("td").find("a.pro-title-view").attr("href").toString().replace("/products/", "");

                      var removingProduct;
                      for (var i = 0; i < cartItems.length; i++) {
                        if (cartItems[i] && cartItems[i].handle === handleId) {
                          removingProduct = cartItems[i];
                          break;
                        }
                      }

                      if (removingProduct) {
                        var sku = removingProduct.sku;

                        if (sku) {
                          var product_item = {
                            type: "product",
                            id: sku,
                          };

                          var dataProps = {
                            items: [product_item],
                            extra: {
                              cart_subtotal: cart.total_price,
                              cart_item_count: cart.item_count,
                            },
                          };

                          web_event.track("product", "remove_cart", dataProps);
                        }
                      }
                    } catch (ex) {
                      console.log("cdp log: ", ex);
                    }
                  });
                } catch (ex) {
                  console.log("cdp log: ", ex);
                }
              });
            }
          }
        } catch (ex) {
          console.log("cdp log:", ex);
        }
      });
    }

    // Remove Item cart from view cart page
    if (window.location.href.includes("/cart")) {
      var tableCartEl = document.querySelectorAll('tr.line-item-container');
      if (tableCartEl) {
        try {
          for(var i = 0;i< tableCartEl.length;i++)
          {
            curr= tableCartEl[i]
            sku_remove = curr.querySelector('td.item').querySelectorAll('p.sku_item')[1].innerText.replace('Mã SP:','').trim()
            name_remove = curr.querySelector('td.item a').innerText
            var allcart_delete = curr.querySelector('td.remove')
            jQuery(allcart_delete).on("click", function () {
              try {
                var productRemoving = sku_remove
                if (productRemoving) {
                  var product_item = {
                    type: "product",
                    id: productRemoving,
                    name: name_remove
                  };
                  var dataProps = {
                    items: [product_item],
                    extra: {
                      cart_subtotal: +document.querySelector('span.total_price').innerText.replace(/\D/g, ''),
                    },
                  };
                  web_event.track("product", "remove_cart", dataProps);
                  // console.log(dataProps)
                }

              } catch (ex) {
                console.log("cdp log: ", ex);
              }
            });
          }
          
        } catch (ex) {
          console.log("cdp log: ", ex);
        }

      }
    }
  } catch (ex) {
    console.log("cdp log:", ex);
  }
};

var cdpPageTracking = function () {
  try {
    // View cart
    if (window.location.href.includes("/cart")) {
      _cdpGetCart(function (cart) {
        try {
          if (cart) {
            var cartItems = cart.items;
            if (cartItems.length) {
              var items = [];
              for (var i = 0; i < cartItems.length; i++) {
                var curr = cartItems[i];
                var sku = curr.sku;
                var name = curr.title;
                var quantity = curr.quantity;
                var price = curr.price / 100;
                var original_price = curr.price_original / 100 || curr.price / 100;
                var sale_price = curr.line_price / 100;

                items.push({
                  type: "product",
                  id: sku,
                  name: name,
                  price: price,
                  original_price: original_price,
                  quantity: quantity,
                  line_item_unit_price: price,
                  line_Item_rounded_amount: sale_price,
                  line_item_quantity: quantity
                });
              }

              var dataProps = {
                items: items,
                extra: {
                  cart_subtotal: cart.total_price / 100,
                  cart_item_count: cart.item_count,
                },
              };

              web_event.queue.push(["track", "product", "view_cart", dataProps]);
            }
          }
        } catch (ex) {
          console.log("cdp log: ", ex);
        }
      });
    }

    // Checkout
    else if (window.location.href.includes("/checkouts")) {
      var currentStep = jQuery("div.step div.step-sections").attr("step");

      if (+currentStep == 1) {
        _cdpGetCart(function (cart) {
          try {
            if (cart) {
              var items = [];
              var extra = {
                page_type: "checkout",
                page_category: "cart",
                currency: HaravanAnalytics.meta.currency,
              };

              for (var i = 0; i < cart.items.length; i++) {
                var curr = cart.items[i];

                var sku = curr.sku;
                var name = curr.title;
                var quantity = curr.quantity;
                var price = curr.price / 100;

                items.push({
                  type: "product",
                  id: sku,
                  sku: sku,
                  name: name,
                  price: price,
                  quantity: quantity,
                });
              }

              extra.revenue = cart.total_price / 100;

              var dataProps = {
                items: items,
                extra: extra,
              };

              web_event.queue.push(["track", "product", "checkout", dataProps]);
            }
          } catch (ex) {
            console.log("cdp log: ", ex);
          }
        });
      }
    }

    // Product Search
    else if (window.location.href.includes("/search")) {
      //var searchKeyword = jQuery('div.header-search input[name="q"]').val().trim();

      var searchKeyword = document.querySelector('p.subtext-result strong').innerText.split('&&')[0].replace('"', '');

      if (searchKeyword) {
        var dataProps = {
          extra: {
            src_search_term: searchKeyword,
          },
        };

        web_event.queue.push(["track", "browsing", "product_search", dataProps]);
      }
    }
  } catch (ex) {
    console.log("cdp log:", ex);
  }
};

var cdpPurchaseTracking = function () {
  try {
    if (window.location.href.includes("/checkouts") && window.location.href.includes("/thank_you")) {
      var cdpPurchaseTrackingCounter = 0;

      var cdpPurchaseTrackingTimer = setInterval(function () {
        cdpPurchaseTrackingCounter++;

        if (typeof Haravan != "undefined" && Object.keys(Haravan).length) {
          var checkoutInfo = Haravan.checkout;
          if (typeof checkoutInfo != "undefined" && Object.keys(checkoutInfo).length) {
            var source = checkoutInfo.source_name;
            var orderId = checkoutInfo.order_number;

            var billingAddress = checkoutInfo.billing_address;
            var billingName = billingAddress.full_name;
            var billingPhone = billingAddress.phone;

            var shippingAddress = checkoutInfo.shipping_address;
            var address = shippingAddress.address1;
            var country = shippingAddress.country;
            var district = shippingAddress.district;
            var province = shippingAddress.province;
            var ward = shippingAddress.ward;

            var shippingName = shippingAddress.full_name;
            var shippingPhone = shippingAddress.phone;

            var shippingRate = checkoutInfo.shipping_rate;
            var shippingFee = shippingRate.price;

            var discountInfo = checkoutInfo.discount;
            var discountCode = discountInfo.code;
            var discountAmount = discountInfo.amount;

            var subTotal = checkoutInfo.subtotal_price;
            var total = checkoutInfo.total_price;

            var orderItems = [];
            for (var i = 0; i < checkoutInfo.line_items.length; i++) {
              var item = checkoutInfo.line_items[i];

              var sku = item.sku;
              var name = item.title;
              var quantity = +item.quantity;
              var sale_price = +item.line_price;
              var unit_price = +item.price;

              orderItems.push({
                type: "product",
                id: sku,
                name: name,
                line_item_rounded_amount: sale_price,
                line_item_unit_price: unit_price,
                quantity: quantity
              });
            }

            var customer_id = window._cdpEventFunction.md5(billingPhone);
            var customerData = {
              id: customer_id,
              name: billingName,
              phone: billingPhone,
            };

            var purchaseData = {
              customer_id: customer_id,
              customer_name: billingName,
              customer_phone: billingPhone,
              shipping_name: shippingName,
              shipping_phone: shippingPhone,
              shipping_address: [address, ward, district, province, country].join(", "),
              id: orderId,
              name: orderId,
              order_id: orderId,
              discount_amount: +discountAmount,
              shipping_amount: +shippingFee,
              subtotal_price: +subTotal,
              total_price: +total,
              revenue: +total      
            };

            var extra = {
              order_id: orderId,
              revenue: +total,
              customer_id: customer_id,
              customer_name: billingName,
              phone: billingPhone,
              address: shippingAddress,
              identify_event: "purchase",
              identify_time: _cdpGetLeadTime(),
            };

            if (discountCode) {
              purchaseData.promotion_code = discountCode;
              extra.promotion_code = discountCode;
              extra.discount_amount = discountAmount;

              var extraPromo = {
                cdp_property_id: 564990840,
              };
              var dataPropsPromo = {
                items: [
                  {
                    type: "promotion_code",
                    id: discountCode,
                    name: discountCode,
                    code_status: 4,
                  },
                ],
                dims: {
                  purchase: {
                    id: orderId,
                  },
                },
                extra: extraPromo,
              };

              web_event.queue.push(["track", "promotion_code", "used", dataPropsPromo]);
            }

            var cookieName = "_cdp_purchase_tracking_order";
            var cookieOrder = _cdpGetCookie(cookieName);

            if (!cookieOrder || !cookieOrder.includes(orderId)) {
              _cdpSetCookie(cookieName, orderId + "," + cookieOrder);

              var dataPropsPurchase = {
                items: orderItems,
                dims: {
                  customers: customerData,
                  purchase: purchaseData,
                },
                extra: extra,
              };

              web_event.queue.push(["track", "product", "purchase", dataPropsPurchase]);
            }

            clearInterval(cdpPurchaseTrackingTimer);
          }
        }

        if (cdpPurchaseTrackingCounter > 50) {
          clearInterval(cdpPurchaseTrackingTimer);
        }
      }, 100);
    }
  } catch (ex) {
    console.log("cdp log: ", ex);
  }
};

var cdpIdentifyTracking = function () {
  try {
    var cdpIdentifyTrackingCounter = 0;

    var cdpIdentifyTrackingTimer = setInterval(function () {
      try {
        cdpIdentifyTrackingCounter++;

        if (typeof identify_str != "undefined" && identify_str) {
          var identifyInfo = decodeURI(identify_str);
          try {
            identifyInfo = JSON.parse(identifyInfo);
          } catch (ex) { }

          if (typeof identifyInfo != "undefined" && Object.keys(identifyInfo).length) {
            var user_name = identifyInfo.name;
            var email = identifyInfo.email;
            var phone = identifyInfo.phone;

            var customers = {};
            var customer_id = null;

            var extra = {};

            var dataProps = {};

            if (phone) {
              customer_id = window._cdpEventFunction.md5(phone);

              extra.phone = phone;
              extra.identity_id = customer_id;
              extra.identify_type = "exact";
            }

            if (customer_id && user_name) {
              customers = {
                customer_id: customer_id,
                name: user_name,
                phone: phone,
              };
            }

            if (email) {
              customers.email = email;
              extra.email = email;
            }

            if (customers.customer_id && customers.name) {
              dataProps = {
                dims: {
                  customers: customers,
                },
                extra: extra,
              };

              var cookieName = "_cdp_identify_tracking";
              var cookieCustomer = _cdpGetCookie(cookieName);

              if (!cookieCustomer) {
                _cdpSetCookie(cookieName, true);

                web_event.queue.push(["track", "user", "identify", dataProps]);
              }

              clearInterval(cdpIdentifyTrackingTimer);
            }
          }
        }

        if (cdpIdentifyTrackingCounter > 50) {
          clearInterval(cdpIdentifyTrackingTimer);
        }
      } catch (ex) {
        console.log("cdp log: ", ex);
      }
    }, 100);
  } catch (ex) {
    console.log("cdp log: ", ex);
  }
};

var cdpSignInTracking = function () {
  try {
    if (window.location.href.includes("/account") && document.referrer.includes("/login")) {
      var cdpSignInTrackingCounter = 0;

      var cdpSignInTrackingTimer = setInterval(function () {
        cdpSignInTrackingCounter++;

        if (typeof identify_str != "undefined" && identify_str) {
          var identifyInfo = decodeURI(identify_str);
          try {
            identifyInfo = JSON.parse(identifyInfo);
          } catch (ex) { }

          if (typeof identifyInfo != "undefined" && Object.keys(identifyInfo).length) {
            var user_name = identifyInfo.name;
            var email = identifyInfo.email;
            var phone = identifyInfo.phone;

            var customers = {};
            var customer_id = null;

            var extra = {};

            if (phone) {
              customer_id = window._cdpEventFunction.md5(phone);

              extra.phone = phone;
              extra.identity_id = customer_id;
              extra.identify_type = "exact";
            }

            if (customer_id && user_name) {
              customers = {
                customer_id: customer_id,
                name: user_name,
                phone: phone,
              };
            }

            if (email) {
              customers.email = email;
              extra.email = email;
            }

            if (customers.customer_id && customers.name) {
              var dataProps = {
                dims: {
                  customers: customers,
                },
                extra: extra,
              };

              var cookieName = "_cdp_signin_tracking";
              var cookieCustomer = _cdpGetCookie(cookieName);

              if (!cookieCustomer) {
                _cdpSetCookie(cookieName, true);

                web_event.track("user", "sign_in", dataProps);
              }

              var cookieName = "_cdp_identify_tracking";
              var cookieCustomer = _cdpGetCookie(cookieName);

              if (!cookieCustomer) {
                _cdpSetCookie(cookieName, true);

                web_event.queue.push(["track", "user", "identify", dataProps]);
              }

              clearInterval(cdpSignInTrackingTimer);
            }
          }
        }

        if (cdpSignInTrackingCounter > 50) {
          clearInterval(cdpSignInTrackingTimer);
        }
      }, 100);
    }
  } catch (ex) {
    console.log("cdp log: ", ex);
  }
};

var cdpSignUpTracking = function () {
  try {
    jQuery("form#create_customer").on("submit", function () {
      try {
        var firstname = jQuery("input#first_name").val().trim();
        var lastname = jQuery("input#last_name").val().trim();
        var email = jQuery("input#email").val().trim();
        var telephone = jQuery("input#phone").val().trim();
        var childBirthday = jQuery("input#birthday").val().trim();

        var signupInfo = JSON.stringify({
          email: email,
          fullname: lastname + " " + firstname,
          telephone: telephone,
          childBirthday: childBirthday,
        });
        localStorage.setItem("_cdp_signup_tracking", signupInfo);
      } catch (ex) {
        console.log("cdp log: ", ex);
      }
    });

    if (window.location.href.includes("/account")) {
      var signupInfo = localStorage.getItem("_cdp_signup_tracking");

      if (signupInfo) {
        signupInfo = JSON.parse(signupInfo);

        var email = signupInfo.email;
        var fullname = signupInfo.fullname;
        var telephone = signupInfo.telephone;

        var extra = {};

        var customer_id = null;
        var customers = {};

        if (telephone) {
          customer_id = window._cdpEventFunction.md5(telephone);

          extra.phone = telephone;
          extra.identity_id = customer_id;
          extra.identify_type = "exact";
        }

        if (customer_id && fullname) {
          customers = {
            customer_id: customer_id,
            name: fullname,
            phone: telephone,
          };
        }

        if (email) {
          customers.email = email;
          extra.email = email;
        }

        if (customers.customer_id && customers.name) {
          var cookieName = "_cdp_signup_tracking";
          var cookieCustomer = _cdpGetCookie(cookieName);

          if (!cookieCustomer) {
            var dataProps = {
              dims: {
                customers: customers,
              },
              extra: extra,
            };

            _cdpSetCookie(cookieName, true);
            localStorage.removeItem("_cdp_signup_tracking");

            web_event.track("user", "sign_up", dataProps);
          }
        }
      }
    }
  } catch (ex) {
    console.log("cdp log: ", ex);
  }
};

var cdpSignOutTracking = function () {
  try {
    jQuery('a[href*="/logout"]').each(function () {
      try {
        jQuery(this).on("click", function () {
          try {
            _cdpSetCookie("_cdp_identify_tracking", "", -1);
            _cdpSetCookie("_cdp_signin_tracking", "", -1);
            _cdpSetCookie("_cdp_signup_tracking", "", -1);
          } catch (ex) {
            console.log("cdp log: ", ex);
          }
        });
      } catch (ex) {
        console.Log("cdp log: ", ex);
      }
    });
  } catch (ex) {
    console.log("cdp log: ", ex);
  }
};

setTimeout(function () {
  var indexCount = 0;
  var timer = setInterval(function () {
    indexCount++;
    if (typeof jQuery != "undefined") {
      clearInterval(timer);

      jQuery(document).ready(function () {
        window.cdpProductDetailTracking();
        window.cdpActionClickTracking();

        window.cdpPageTracking();
        window.cdpPurchaseTracking();

        window.cdpIdentifyTracking();
        window.cdpSignInTracking();
        window.cdpSignUpTracking();
        window.cdpSignOutTracking();
      });
    }

    if (indexCount > 50) {
      clearInterval(timer);
    }
  }, 100);
}, 2000);
