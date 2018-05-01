const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

var CommentSchema =  new Schema({
    text:{
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Too few symbols'],
        maxlength: 1000
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookId:{
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    datePost:{
        type: Date,
        required: true
    }
})

var Comm = mongoose.model('Comment', CommentSchema );
module.exports = Comm;