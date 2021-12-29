var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//引入session模块
let session = require('express-session')
//引入上传模块
let multer = require('multer')
//配置上传
let upload = multer({dest:"./public/upload"})
let sqlQuery = require('./module/mysql')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//引入后台模块
var adminRouter = require('./routes/admin/adminRouter')
//引入注册登录模块
var loginRouter = require('./routes/login/loginRouter')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//配置session
app.use(session({
  secret:"asdqwe",
  resave:true, //强制保存session
  cookie:{
    //maxAge:7*24*60*60*1000,//设置session有效期为1周
  },
  saveUninitialized:true //是否保存初始化的session 
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//前台路由
app.use('/', indexRouter);
//后台路由
app.use('/admin',adminRouter)
app.use('/users', usersRouter);
//登录注册路由
app.use('/rl',loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
