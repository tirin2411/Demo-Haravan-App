var createError = require('http-errors');
var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//test Authentication 
var OAuth2 = require('oauth').OAuth2;
let grant_type = 'authorization_code';
let callback_url = 'http://localhost:4040/install/grandservice';
let client_id = '3c0bb5370ea3396c31d9f1ee1794eca1';
let client_secret = 'bf74aaecc04f923f2f0ab42c66d860847bad2db1cf5fcf8391f3d43802be7ecb';
let url_authorize = 'https://accounts.haravan.com/connect/authorize';
let url_connect_token = 'https://accounts.haravan.com/connect/token';
let code = '2F6A3E87B036FEA40E38466FF699940061592E2D390B05ED91CC0F9BF52B5828';

let params = {};
params.grant_type = grant_type;
params.redirect_uri = callback_url;

let _oauth2 = new OAuth2 (
  client_id,
  client_secret,
  '',
  url_authorize,
  url_connect_token,
  ''
);
//---close test Authentication 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var grandserviceRouter = require('./routes/grandservice');
var shopinfoRouter = require('./routes/shopinfo');

var app = express();

// app.use((req, res, next) => {
//   res.set('ngrok-skip-browser-warning', 1);
//   next();
// });

//test Authentication 
_oauth2.getOAuthAccessToken(code, params, (err, accessToken, refreshToken, params) => {
  if(err){
    let parseErrData = JSON.parse(err.data);
    console.log('error', parseErrData);
  } else {
    console.log('accessToken', accessToken);
  }
});
//---close test Authentication 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/install/login', loginRouter);
app.use('/install/grandservice', grandserviceRouter);
app.use('/shopinfo', shopinfoRouter);

// Xử lý yêu cầu trên cổng 3000
app.get("/", (req, res) => {
  const query = req.query;
  const mode = query["hub.mode"];
  const challenge = query["hub.challenge"];
  const verifyToken = "b0f46a50-37ab-4705-a38c-b297f63eb9e0";
  if (query["hub.verify_token"] === verifyToken) {
    if (mode === "subscribe" && challenge) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
