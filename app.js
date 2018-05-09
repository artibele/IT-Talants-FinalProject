var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var nodemailer = require('nodemailer');
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

// Mongo BG ------------------------------------------------------------------- mongo db
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
    profilePic: body.userImgUrl,
    role: "user"
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


app.post("/addIdToFavorites", function (req, res, next) {
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
          { "$addToSet": { "favoritesId": body.bookId } },
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

app.post("/addBookInList", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  } else {
    if(req.session.user.role == "user"){
      res.status(401);
      res.send();
      return;
    }
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

app.post("/sendMeilToAdmin",function(req, res,next){
  var transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
      user: 'finalprojecttedy@gmail.com',
      pass: 'finalprojecttedy12'
    }
  });

  var mailOptions = {
    from: 'finalprojecttedy@gmail.com',
    to: 'finalprojecttedy@gmail.com',
    subject: 'Final Project contact form',
    text: "From: " + req.body.userName + "\n"
            + " phone: " + req.body.userPhone + "\n"
            + " email: " + req.body.userEmail + "\n"
            + " Text: " + req.body.userText + " !"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500);
      res.json(error);
    } else {
      console.log('Email sent: ');
      res.status(200);
      res.send();
    }
  });
  
});

app.post("/editUserComment",function(req, res, next){
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }
var comment = req.body;
  if(comment.userId._id != req.session.user._id){
    res.status(401);
    res.json();
    return;
  } 
  CommentModel.findById(comment._id , function(err, comm){
    if(err){
      res.status(500);
      res.send();
    } else {
      comm.text = comment.text;
      comm.datePost =  new Date().toLocaleDateString();
      comm.save(function(err, updatedComment){
        if(err){
          res.status(500);
          res.json(err);
        } else {
          // res.status(200);
          // res.json(updatedComment);
          CommentModel.populate(updatedComment,{path:"userId",select:["username","profilePic"]},function(err,comment2){
            if(err){
             res.status(500);
             res.json(err);
     
            } else {
             res.status(200);
             res.send(comment2);
            }
           })
          
        }
      });
    }
  })
    
})

app.post("/editInfoForBook",function(req, res, next){
  if (req.session.user == null && req.session.user.role != "admin") {
    res.status(401);
    res.send();
    return;
  }
  var book = req.body;
    BookModel.findById(book._id,function(err,bookFound){
      if(err){
        res.status(500);
        res.send();
      } else {
        console.log(bookFound);
        console.log(book);
        bookFound.title = book.title
        bookFound.moreAboutBook = book.moreAboutBook
        bookFound.author = book.author
        bookFound.typeBook = book.typeOfBook
        bookFound.publisher = book.publisher
        bookFound.published = book.published;
        bookFound.pages = book.pages
        bookFound.aboutAuthor= book.aboutAuthor
        bookFound.price= book.price
        bookFound.linkToBuy= book.linkToBuy
        bookFound.pictureBook= book.pictureImg

        bookFound.save(function(err,updatedBook){
          if(err){
            res.status(500);
            res.send();
          } else {
            res.status(200);
            res.send(updatedBook);
          }
        })
      }

    })
})

app.post("/inserComments", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }
  var datePostComm = new Date().toLocaleDateString()
  var body = req.body;

  var userComment = {
    text: body.text,
    userId: req.session.user._id,
    bookId: body.bookId,
    datePost: datePostComm
  }

  CommentModel.create(userComment, function (err, comment) {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else {
      // populate -> join comment with username nad profile pic
      CommentModel.populate(comment,{path:"userId",select:["username","profilePic"]},function(err,comment){
       if(err){
        res.status(500);
        res.json(err);

       } else {
        res.status(200);
        res.send(comment);
       }
      })
    }
  })

})

app.get("/getAllCommentsforBook/:id", function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  };

  var bookID = req.params.id;
  console.log(bookID);
  CommentModel.find({bookId:bookID})
  // join inner - >
  .populate({path:"userId",select:["username","profilePic"]}) // removeBook
  .exec(function(err,comments){ // да ч изпълни .. 
    if(err){
      res.status(500);
      res.json(err);

      } else {
        res.status(200);
        res.send(comments);
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

app.get("/gettAllBookByGanre/:type", function(req , res , next){
  // if(req.session.user == null){
  //   res.status(401);
  //   res.send();
  //   return;
  // }
  BookModel.find({typeBook:req.params.type},function(err, books){
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

app.delete("/deleteComment/:id", function(req, res, next){
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  }; 

  CommentModel.findOne({_id:req.params.id},function(err, comment){
    if(err){
      res.status(500);
      res.json();
      return;
    } else {
      
      if(comment){
      
        if(comment.userId == req.session.user._id){
          console.log("user identified")
          CommentModel.find(comment) // query -> object.remove .. request to server 
          .remove(function(err,removed){ // true / false
            console.log("remove callback")
            if(err){
              console.log("remove error")
              res.status(500); // error in server
              res.send();
              return;
            } else {
              if(removed){
                console.log("comment remove .. ")
                res.status(200);
                res.send();
                return;
              }else{
                res.status(500)
                res.json({error:"failed to remove comment"})
              }
              
            }
          })

        }else{
          res.status(401);
          res.send({error: "not your comment"});
          return;
        }
      } else {
        res.status(404); // not found
        res.send();
        return;
      }
    }
  })

});

app.delete('/removeBook/:id', function (req, res, next) {
  if (req.session.user == null) {
    res.status(401);
    res.send();
    return;
  } else {
    if(req.session.user.role == "user"){
      res.status(401);
      res.send();
      return;
    }
  }
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
  return;
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
