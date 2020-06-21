var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Import routes for "catalog" area of site
var catalogRouter = require('./routes/catalog');  
var compression = require('compression');
var helmet = require('helmet');

// Create the Express application object
var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url  = 'mongodb+srv://admin:nevergiveup666@local-xizhw.gcp.mongodb.net/defaultBook?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, newUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
//引擎的設置有兩個部分。首先我們設置 'views' 值，來指定模板將被存儲的文件夾（在這種情況下是子文件夾 /views）。
app.set('views', path.join(__dirname, 'views'));

//然後我們設置 'view engine' 的值，來指定模板庫（在本例中為 “pug” ）。
app.set('view engine', 'pug');

//使用 express.static 中間件，來使 Express 提供在項目根目錄下
///public 目錄中的所有靜態文件。
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Compress all routes
app.use(compression()); 
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// Add catalog routes to middleware chain.
app.use('/catalog', catalogRouter);  

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

// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//回到上面的 www 入口點文件，它是在導入該文件時
//提供給調用者的這個 module.exports 對象
module.exports = app;
