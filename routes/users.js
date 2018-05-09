var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserModel = require("../models/User");

/* GET users listing. */
router.post('/registerUser', function (req, res, next) {
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

router.post('/loginUser', function (req, res, next) {
  console.log("test test")
  var uname = req.body.username;
  var pass = req.body.password;

  function authCallback() {
    if (arguments.length == 1) {
      var err = arguments[0]
      console.log(err)
      if (err.name == 'MongoNetworkError') {
        console.log("network error")
        res.status(500)
        res.send()
        return
      }
      if (err.name == 'NotFound' || err.name == 'Password does not match') {
        console.log("user not found")
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


router.get('/logout', function (req, res, next) {
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

module.exports = router;
