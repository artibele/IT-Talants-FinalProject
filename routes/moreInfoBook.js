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

  router.post("/editInfoForBook",function(req, res, next){
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

module.exports = router;