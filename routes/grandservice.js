const express = require('express');
const router = express.Router();
const OAuth2 = require('oauth').OAuth2;

// Các biến cần thiết cho quá trình xác thực
const client_id = '3c0bb5370ea3396c31d9f1ee1794eca1';
const client_secret = 'bf74aaecc04f923f2f0ab42c66d860847bad2db1cf5fcf8391f3d43802be7ecb';
const redirect_uri = 'http://localhost:4040/install/grandservice';
const url_connect_token = 'https://accounts.haravan.com/connect/token';

// Khởi tạo đối tượng OAuth2
const oauth2 = new OAuth2(
  client_id,
  client_secret,
  '',
  'https://accounts.haravan.com/connect/authorize',
  url_connect_token
);

// Xử lý yêu cầu GET đến /install/grandservice
router.get('/', (req, res) => {
  const code = req.query.code;
//   const shopDomain = req.query.shop;

//   // Kiểm tra xem đã có shopDomain hay chưa
//   if (!shopDomain) {
//     return res.status(400).send('Thiếu thông tin tên miền cửa hàng');
//   }

//   // Tiếp tục xử lý với shopDomain
//   const appId = '3c0bb5370ea3396c31d9f1ee1794eca1';
//   const appUrl = `https://${shopDomain}/admin/apps/${appId}`;

  // Trao đổi mã xác thực để lấy access token và refresh token
  oauth2.getOAuthAccessToken(
    code,
    { grant_type: 'authorization_code', redirect_uri },
    (err, accessToken, refreshToken) => {
      if (err) {
        console.error('Lỗi khi trao đổi mã xác thực:', err);
        res.status(500).send('Đã xảy ra lỗi trong quá trình xác thực');
      } else {
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        // Lưu access token và refresh token vào cơ sở dữ liệu hoặc xử lý tiếp tục
        // res.send('Xác thực thành công');
        res.redirect('http://localhost:4040/shopinfo');
      }
    }
  );
});

module.exports = router;