var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sequelize = require('./models').sequelize;

var app = express();
sequelize.sync();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// static file 라우터 - 최상단 위치, 다른 미들웨어 작업 안하도록 함
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('sbk6648'));
app.use(session({
	resave : false,
	saveUninitialized : false,
	secret : 'sbk6648',
	cooke: {
		httpOnly : true,
		secure : false,
	}
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);
	// render the error page
	res.status(err.status || 500);
	res.render(res);
});

module.exports = app;
