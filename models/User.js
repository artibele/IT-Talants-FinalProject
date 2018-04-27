const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//Define a schema
const Schema = mongoose.Schema;

var validateEmail = function(email) {

    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return re.test(email)

};

var UserSchema = new Schema({
    firstName : {
        type: String,
        required: true,
      },
    secondName : {
        type: String,
        required: true,
      },
    username : {
        type: String,
        unique: true,
        required: true, // zadyljitelno pole
        trim: true
      },
      email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate : [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],

      },
      password : {
        type: String,
        required: true,
      },
      profilePic : {
        type: String,
        required : true
    }
});

UserSchema.statics.authenticate = function (uname, password, callback) {
    User.findOne({ username:  uname})
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.name="NotFound"
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user); //we use 2 arguments to use the callback in 2 ways
          } else {
            var err = new Error('Password does not match')
            err.status = 401
            return callback(err);
          }
        })
      });
}

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
var User = mongoose.model('User', UserSchema );
module.exports = User;