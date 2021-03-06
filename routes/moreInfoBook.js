var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserModel = require("../models/User");
var BookModel = require("../models/Book");
var CommentModel = require("../models/Comment");

router.get("/getInfoForAbook/:id", function (req, res, next) {
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

router.post("/editInfoForBook", function (req, res, next) {
  if (req.session.user == null && req.session.user.role != "admin") {
    res.status(401);
    res.send();
    return;
  }
  var book = req.body;
  BookModel.findById(book._id, function (err, bookFound) {
    if (err) {
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
      bookFound.aboutAuthor = book.aboutAuthor
      bookFound.price = book.price
      bookFound.linkToBuy = book.linkToBuy
      bookFound.pictureBook = book.pictureImg

      bookFound.save(function (err, updatedBook) {
        if (err) {
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


router.post("/saveBookToUser", function (req, res, next) {
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


router.post("/saveUserRating", function (req, res, next) {
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


router.post("/voted", function (req, res, next) {
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
          { "_id": body.bookId },
          { "$set": { "voted": bookL } },
          function (err, book) {
            console.log(book)
          }
        );
      }
    }
  });
  res.status(200);
  res.send("ok");

});


router.post("/newRating", function (req, res, next) {
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

    for (var count = 0; count < book.ratingNumbers.length; count++) {
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
          { "_id": body.bookId },
          { "$set": { "avgRating": avgSum } },
          function (err, book) {
            console.log(book)
          }
        );
      }
    }
  });
  res.status(200);
  res.send("ok");

});


module.exports = router;