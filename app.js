var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session =  require('express-session') ;
// ------------------------------------------- > MODELS
var UserModel = require("./models/User")

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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

// Mongo BG ---------------------------------------------------------------------- mongo db
app.use(function(req,res,next){
  req.db = db;
  next();
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/login', loginRouter);
//  --------------------------------------------------------- за да мога да използвам моя fron-end
//TODO THIS BREAKS ALL API GET REQUESTS, RETURNS ONLY INDEX
app.get("*",function(req, res){
  res.sendfile(path.join(__dirname, 'public/views/index.html'))

})

// ----------------------------------------------------------  Post request for register s user
app.post('/registerUser',function(req,res,next){
  //TODO validation
  var body = req.body
  console.log(body)

  var userData={
    firstName:  body.firstName,
    secondName : body.secondName,
    username : body.username ,
    email : body.email,
    password : body.password,
    profilePic : body.userImgUrl  
  }

  UserModel.create(userData, function (err, user) {
    if (err) {
      console.log(err)
      res.status(500)
      res.json(err)
    } else {
      console.log("success")
      res.status(200)
      res.send()
    }
  });

})

// ----------------------------------------------------------------------- Post request for login  user
app.post('/loginUser',function(req,res,next){
  var uname = req.body.username
  var pass = req.body.password

  function authCallback(){
    if(arguments.length==1){
      var err = arguments[0]
      console.log(err)
      if(err.name=='MongoNetworkError'){
        res.status(500)
        res.send()
        return
      }
      if(err.name=='NotFound'){
        res.status(401)
        res.send()
        return
      } 
    }
    if(arguments.length==2){
      var user = arguments[1]
      res.status(200)
      req.session.user = user
      res.send(user)
      return
    }
  }
  UserModel.authenticate(uname,pass,authCallback)
})

app.post("/api/loggedIn",function(req,res,next){
  if(req.session.user){
    res.status(200);
    var msg = {
      message:"Logged"
    }
    res.send(msg);
  } else {
    res.status(200);
    var msg = {
      message:"Not logged"
    }
    res.send(msg);
  }
});
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
