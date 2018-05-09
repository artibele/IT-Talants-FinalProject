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


app.post("/addToFavorite", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 
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
          { "email": body.email },
          { "$addToSet": { "favoriteBooks": book } },
          function (err, raw) {
            if (err) return handleError(err);
            if (raw.nModified == 0) {
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





app.post("/saveBookToUser", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 
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
          { "email": body.email },
          { "$addToSet": { "ratedBooks": book.title }, },
          function (err, raw) {
            if (err) return handleError(err);

            if (raw.nModified == 0) {
              res.status(500)

              return;
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


app.post("/saveUserRating", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 

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
        BookModel.findByIdAndUpdate(
          body.bookId,
          { $push: { "ratingNumbers": body.rating } },
          function (err, model) {
            console.log(err);
          }
        );
      }
    }
  });
  res.status(200);
  res.send("ok");

});


app.post("/voted", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 

  var body = req.body;

  console.log(body);

  BookModel.findOne({ _id: body.bookId }, function (err, book) {
    var bookL = 1 + book.ratingNumbers.length + "";
    console.log(bookL)
    console.log("here")
    console.log(bookL)
    console.log(bookL)
    if (err) {
      res.status(404);
      res.send();
      return;
    }
    else {
      console.log(bookL)
      if (book != null) {
        BookModel.update(
          {"_id": body.bookId}, 
          { "$set": { "voted": bookL } },
          function (err, book){
            console.log(book)
          }
      );
      }
    }
  });
  res.status(200);
  res.send("ok");

});


app.post("/newRating", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 

  var body = req.body;
  console.log(body);

  BookModel.findOne({ _id: body.bookId }, function (err, book) {
    var sum = 0
    var voted = book.voted

    for(var count = 0; count < book.ratingNumbers.length; count++){
      sum += book.ratingNumbers[count]
    }
    var avgSum = sum / voted 
    avgSum = avgSum.toFixed(2)
    avgSum += ""
    console.log(avgSum)
   
    if (err) {
      res.status(404);
      res.send();
      return;
    }
    else {
      if (book != null) {
        BookModel.update(
          {"_id": body.bookId}, 
          { "$set": { "avgRating": avgSum } },
          function (err, book){
            console.log(book)
          }
      );
      }
    }
  });
  res.status(200);
  res.send("ok");

});




app.post("/getFavorite", function (req, res) {
  var email = req.body.userEmail;
  console.log(email)
  console.log("here")
  UserModel.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);

    } else {
      console.log(user.favoriteBooks);
      res.status(200);
      res.send({ books: user.favoriteBooks });
    }
  })
})


// ----------------------------------------------------------------------- Post request for login  user



app.post("/deleteIdFromFavorites", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  };
  var body = req.body;

  console.log(body);

  UserModel.findOne({ email: body.userEmail }, function (err, user) {
    for (var index = 0; index < user.favoritesId.length; index++) {
      console.log(user.favoritesId[index])
      if (user.favoritesId[index] == body.bookId) {
        var bookIndex = index;
      }
    }
    var removeBook = user.favoritesId.splice(bookIndex, 1);
    var newBooks = user.favoritesId
    console.log(newBooks)
    if (err) {
      res.status(404);
      res.send();
      return;
    }
    else {
      if (user != null) {
        UserModel.update(
          { "email": body.userEmail },
          { "$set": { "favoritesId": newBooks } },
          function (err, book) {
            console.log(book)
          })
      }
    }
  });
  res.status(200);
  res.send("Ok");

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
