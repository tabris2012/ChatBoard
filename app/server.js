var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const static = require('node-static');

// Define server
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view as static html
app.use(express.static(__dirname + '/build'));

// Allow access from other hosts
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// Server side
var historyRouter = require('./routes/history');
app.use('/api/history', historyRouter);
var fileRouter = require('./routes/folder');
app.use('/api/folder', fileRouter);
var favoriteRouter = require('./routes/favorite');
app.use('/api/favorite', favoriteRouter);
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
*/
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server
var port = '8030';

app.listen(port, '0.0.0.0', () => {
  console.log("App server starting");
});
