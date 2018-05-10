var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserModel = require("../models/User");

router.post("/deleteIdFromFavorites", function (req, res, next) {
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

module.exports = router;