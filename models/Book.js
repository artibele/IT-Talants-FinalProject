const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

var BookSchema = new Schema(
   {
       title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
       },
       moreAboutBook: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too few symbols'],
            maxlength: 1000
       },
       author : {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too few symbols'],
       },
       typeBook :{
            type: String,
            required: true,
            trim: true
       },
       publisher :{
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too few symbols']
       },
       published  :{
            type: Date,
            required: true,
            trim: true
       },
       pages :{
            type: String,
            required: true,
            trim: true,
            min: [0, 'Too few pages']
       },
       aboutAuthor :{
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too few symbols'],
            maxlength: 1000
       },
       price:{
            type: String,
            required: true,
            trim: true
       },
       linkToBuy:{
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too few symbols'],
       },
       pictureBook:{
            type: String,
            required: true,
            
       }
   }
);

var Book = mongoose.model('Book', BookSchema );
module.exports = Book;