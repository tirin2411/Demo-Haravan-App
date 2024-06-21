// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('login', { title: 'Express' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

// Các biến cần thiết cho quá trình xác thực
const client_id = '3c0bb5370ea3396c31d9f1ee1794eca1';
const redirect_uri = 'http://localhost:4040/install/grandservice';
const url_authorize = 'https://accounts.haravan.com/connect/authorize';
const scope = 'openid profile address email phone org userinfo grant_service web.write_themes web.read_themes web.write_script_tags web.read_script_tags com.read_shippings com.read_orders com.read_shipping_zones com.read_products com.read_customers com.read_discounts com.read_inventories wh_api';

// Tạo URL xác thực
const authUrl = `${url_authorize}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(scope)}`;

// Xử lý yêu cầu GET đến /install/login
router.get('/', (req, res) => {
  // Chuyển hướng người dùng đến trang xác thực của Haravan
  res.redirect(authUrl);
});

module.exports = router;