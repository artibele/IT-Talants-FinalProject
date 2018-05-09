var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

router.post("/sendMeilToAdmin",function(req, res,next){
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
  
  



module.exports = router;