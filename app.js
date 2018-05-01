var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
// ------------------------------------------- > MODELS
var UserModel = require("./models/User")
var BookModel = require("./models/Book")

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
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/login', loginRouter);
//  --------------------------------------------------------- за да мога да използвам моя fron-end
//TODO THIS BREAKS ALL API GET REQUESTS, RETURNS ONLY INDEX
app.get("/", function (req, res) {
  res.sendfile(path.join(__dirname, 'public/views/index.html'));

})

// ----------------------------------------------------------  Post request for register s user
app.post('/registerUser', function (req, res, next) {
  //TODO validation
  var body = req.body
  console.log(body)

  var userData = {
    firstName: body.firstName,
    secondName: body.secondName,
    username: body.username,
    email: body.email,
    password: body.password,
    profilePic: body.userImgUrl
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

app.post("/addToFavorite", function (req, res, next) {
  var body = req.body;
  console.log(body);

  BookModel.findOne({ _id: body.bookId }, function (err, book) {
    console.log("here")
    if (err) {
      res.status(404);
      res.send();
      return;
    }
    else {
      if (book != null) {
        UserModel.update(
          { "email": body.email},
          { "$addToSet": { "favoriteBooks": book } },
          function (err, raw) {
              if (err) return handleError(err);
              if(raw.nModified == 0 ){
                res.status(500)
              }
              console.log('The raw response from Mongo was ', raw);
          }
       );
      }
    }
  });

  res.status(200);
  res.send("ok");

});

app.post("/addBookInList", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }
  var body = req.body;
  console.log(body);

  var date = new Date(body.published).toLocaleDateString()
  console.log(date)
  var bookData = {
    title: body.title,
    moreAboutBook: body.moreAboutBook,
    author: body.author,
    typeBook: body.typeOfBook,
    publisher: body.publisher,
    published: date,
    pages: body.pages,
    aboutAuthor: body.aboutAuthor,
    price: body.price,
    linkToBuy: body.linkToBuy,
    pictureBook: body.pictureImg
  }
  BookModel.create(bookData, function (err, book) {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else {
      console.log(book);
      res.status(200);
      res.send(book);
    }
  })
});

app.get("/getAllBooks", function (req, res, next) {
  // if(req.session.user == null){
  //   res.status(401);
  //   res.send();
  //   return;
  // }
  BookModel.find({}, function (err, books) {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);
    } else {
      console.log(books);
      res.status(200);
      res.send(books);
    }
  })
})


app.post("/getFavorite", function (req, res) {
    var email = req.body.userEmail;
    console.log(email)
    console.log("here")
    UserModel.findOne({email : email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);
      
    } else {
      console.log(user.favoriteBooks);
      res.status(200);
      res.send({books: user.favoriteBooks});
    }
  })
})


app.delete('/removeBook/:id', function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 
  console.log("parameters")
  console.log(req.params.id)

  var querry = BookModel.find().remove({ _id: req.params.id })
  querry.remove({ _id: req.params.id }, function (err) {
    if (err) {
      console.log(err)
      res.status(404)
      res.send(err)
      return
    }
    else {
      res.status(200)
      res.send()
      return
    }
  })
  return
})

app.get("/getInfoForAbook/:id", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }
  BookModel.findOne({ _id: req.params.id }, function (err, book) {
    if (err) {
      res.status(404);
      res.send();
      return;
    } else {
      if (book != null) {
        res.status(200);
        res.send(book);
        return;
      } else {
        res.status(404);
        res.send();
        return;
      }
    }
  });

})
// ----------------------------------------------------------------------- Post request for login  user
app.post('/loginUser', function (req, res, next) {
  var uname = req.body.username;
  var pass = req.body.password;

  function authCallback() {
    if (arguments.length == 1) {
      var err = arguments[0]
      console.log(err)
      if (err.name == 'MongoNetworkError') {
        res.status(500)
        res.send()
        return
      }
      if (err.name == 'NotFound' || err.name == 'Password does not match') {
        res.status(401)
        res.send()
        return
      }

    }
    if (arguments.length == 2) {
      var user = arguments[1]
      res.status(200)
      req.session.user = user
      user.password = "";
      res.send(user)
      return
    }
  }
  UserModel.authenticate(uname, pass, authCallback)
})

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

app.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
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
