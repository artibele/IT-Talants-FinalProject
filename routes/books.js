var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var BookModel = require("../models/Book");
var UserModel = require("../models/User");


router.post("/addBookInList", function (req, res, next) {
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

  router.delete('/removeBook/:id', function (req, res, next) {
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


  router.get("/getAllBooks", function (req, res, next) {
    
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

    router.get("/gettAllBookByGanre/:type", function(req , res , next){
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

      router.post("/addIdToFavorites", function (req, res, next) {
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
  


module.exports = router;