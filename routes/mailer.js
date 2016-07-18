var nodemailer = require('nodemailer');
var	that = {};
var config = require('../config');

that.smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "marcb@logancoach.com",
        pass: "coach1234"
    }
});

that.send = function(recipient,subject,body,callback){
    var mailOptions= {
        from: "Logan Coach <marcb@logancoach.com>",
        to: recipient,
        subject:subject,
        text: body
    };
    if (config.isdev){
      console.log("=======EmailTest========");
      console.log(subject, recipient);
      console.log("========================");
      callback(null,null);
      return;
    } else {
      that.smtpTransport.sendMail(mailOptions, function(error, res) {
        callback(error,res);
      });
    }
};

module.exports = that;
