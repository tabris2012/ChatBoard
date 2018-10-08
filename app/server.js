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

// Server side
var fileRouter = require('./routes/history');
app.use('/api/history', fileRouter);
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
var port = '80';

app.listen(port, '0.0.0.0', () => {
  console.log("App server starting");
});
