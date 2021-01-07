const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

/* const transporter = nodemailer.createTransport(nodeMailerSendgrid({
  auth: {
    api_key: ''
  }
})) */

const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'insurancehouseonline@gmail.com',
      pass: 'insurance1234'
  }
});


module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        user = user.dataValues;
        return bcrypt.compare(password, user.password);
      } else {
        const error = new Error(
          "A user with this email address could not be found."
        );
        error.statusCode = 404;
        throw error;
      }
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password.");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: req.body.email },
        "$ghy#izpe;%VT*ewdjo",
        { expiresIn: "24h" }
      );
      res.setHeader('Set-Cookie',`token=${token}; expires=${new Date(new Date().getTime()+86409000).toUTCString()};SameSite=None;Secure;`);
      return res.status(200).send({ email: req.body.email, token: token });
    })
    .catch((err) => {
       const error = new Error('Error during Login');
       error.statusCode = 500;
       throw err;
    });
};

module.exports.postReset =(req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({
      where: {
        email: email,
      },
    })
      .then((user) => {
        if(!user) {
          console.log("No user found");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return User.update(
          { resetToken: user.resetToken,
            resetTokenExpiration: user.resetTokenExpiration },
          { where: { email: email } }
        )
      }).then(result => {
        const mail = {
          from: 'insurancehouseonline@gmail.com',
          to: email,
          subject: 'Password Reset The Insurance House',
          html: ` <h2>You requested a New Password</h2>
          <p>Click this <a href="http://localhost:3000/reset-password?${token}">link</a> to reset the password</p>`
      }
      transporter.sendMail(mail, (err, response) => {
        if(err){
            console.log(err);
        } else {
            console.log('Message sent');
            return res.status(200).send({ result: 'Email sent' });
        }
    })
      }).catch(err => console.log(err));

  })
}

module.exports.verifyResetPassword = (req, res, next) => {
   const token = req.body.token;

   User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        [Op.gt]: Date.now()
      }
    }
  }).then(user => {
      if(!user) {
        let error = new Error();
        error.statusCode = 401;
        error.message = 'Password not updated';
        throw error;
      }
      return res.status(200).send({ result: 'Authenticated'});
  }).catch((err) => {
    console.log(err);
    err.statusCode = 401;
    err.message = "Error while processing the request";
    throw err;
  })
} 

module.exports.resetPassword = (req, res, next) => {
  User.findOne({
   where: {
     email:req.body.email
   }
 }).then(user => {
   if(!user) {
     console.log("No user found");
     let err = new Error();
     err.statusCode = 404;
     err.message = "No user found."
     throw err;
   }
   bcrypt
   .hash(req.body.password, 12)
   .then((hashedPassword) => {
   return User.update(
     { password: hashedPassword },
     { where: { email: req.body.email } }
   )
 }).then(result => {
  if(!result) {
    let error = new Error();
    error.statusCode = 401;
    error.message = 'Password not updated';
    throw error;
  }
  return res.status(200).send({ result: 'Password Changed' });
 }).catch(err => {
   console.log(err);
   err.statusCode = 401;
   err.message = "Error while processing the request";
   throw err;
 })
 })
} 

