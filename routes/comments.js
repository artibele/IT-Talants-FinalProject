var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserModel = require("../models/User");
var BookModel = require("../models/Book");
var CommentModel = require("../models/Comment");


router.get("/getAllCommentsforBook/:id", function (req, res, next) {
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


  router.post("/inserComments", function (req, res, next) {
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

  router.delete("/deleteComment/:id", function(req, res, next){
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
  

  router.post("/editUserComment",function(req, res, next){
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

module.exports = router;