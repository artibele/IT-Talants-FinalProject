var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// ------------------------------------------- > MODELS
var UserModel = require("./models/User");
var BookModel = require("./models/Book");
var CommentModel = require("./models/Comment");

// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/finalproject');

var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/finalproject';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

// var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var comentsRouter = require('./routes/comments');
var moreInfoBookRouter = require('./routes/moreInfoBook');
var contacMeilRouter = require('./routes/contactMeil');
var myBooksRouter = require('./routes/myBooks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'somethings',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 }
}));

// Mongo BG ------------------------------------------------------------------- mongo db
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// app.use('/', indexRouter);
// app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use("/books",booksRouter)
app.use("/comments",comentsRouter);
app.use("/moreInfoBook",moreInfoBookRouter);
app.use("/contactMeil", contacMeilRouter);
app.use("/myBooks", myBooksRouter);

//  --------------------------------------------------------- за да мога да използвам моя fron-end
//TODO THIS BREAKS ALL API GET REQUESTS, RETURNS ONLY INDEX
app.get("/", function (req, res) {
  res.sendfile(path.join(__dirname, 'public/views/index.html'));

})

// ----------------------------------------------------------  Post request for register s user

app.get("/api/loggedIn", function (req, res, next) {
  if (req.session.user) {
    res.status(200);
    var msg = {
      message: "Logged"
    }
    res.send(msg);
  } else {
    res.status(200);
    var msg = {
      message: "Not logged"
    }
    res.send(msg);
  }
});



// ----------------------------------------------------------------------- Post request for login  user

// ------------------------------------------------------- checked
// function checkLogin(req, res, next) {
//   console.log(req.session);
//   if ((req.session) && (req.session.user)) {
//     next();
//   } else {
//     res.json({ status: 'not authorized' });
//     res.status(401);
//   }
// }

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
