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

/* const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'insurancehouseonline@gmail.com',
      pass: 'insurance1234'
  }
});
 */

/* var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "insurancehouseonline@gmail.com", // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      pass: "insurance1234",
      clientId: "534882566285-mac3pbh1a6i8skukjjbsqqlih7lnpnfr.apps.googleusercontent.com",
      clientSecret: "x9_JWdWHW25ujbjXtLPcsbT4",
      refreshToken: "1//04i2BeZvDRqllCgYIARAAGAQSNwF-L9IrZeksSJymGKUFUx8hP2Yl92a-2sKu8zelcStjUpMAq-iBdeU-Tcb8frwyDzWViI0-B9Q"
    }
  }
}) */

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      type: 'OAuth2',
      user: 'insurancehouseonline@gmail.com',
      clientId: '534882566285-mac3pbh1a6i8skukjjbsqqlih7lnpnfr.apps.googleusercontent.com',
      clientSecret: 'x9_JWdWHW25ujbjXtLPcsbT4',
      refreshToken: '1//04sd41aJzdi_lCgYIARAAGAQSNwF-L9Irr7zMTpnOX95hFwn7WV1eLdZldtxj7eHaKF12rRWiOYXKJsFoP_FUyvisYYM5sGIvCxM',
      accessToken: 'ya29.A0AfH6SMBBbN_6cvdI9nx-4K4u3MQHpAcSjBL3FlpJ2ERcK_y3jdXXxRYyGdU6ybbonuLjkLPdIPEVTwS5ByHXxAjx_WfL5iUT8QV3rOCzCF502kXXPTRcD0poFe61XHhLFtFLpTsUvE1V2whtnQWF7QCevxb4'
  }
});

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let role;
  let id;
  let name;
  let policy;
  let comments;
  let uploads;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        user = user.dataValues;
        role = user.role;
        id = user.id;
        name = user.name;
        policy = user.policy,
        comments = user.comments;
        uploads = user.uploads;
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
        { expiresIn: "12h" }
      );
      res.setHeader('Set-Cookie',`token=${token}; expires=${new Date(new Date().getTime()+86409000).toUTCString()};Max-Age=86400000;`);
      return res.status(200).send({ email: req.body.email, token: token, role: role, id: id, name: name, policy: policy, comments: comments, uploads: uploads });
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
          <p>Click this <a href="https://deepuvalecha.com/reset-password?${token}">link</a> to reset the password</p>`
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
    resetToken:req.query.token
   }
 }).then(user => {
   if(!user) {
     console.log("No user found");
     let err = new Error();
     err.statusCode = 404;
     err.message = "No user found."
     throw err;
   }
   return User.update(
    { password: req.body.password },
    { where: { resetToken:req.query.token } }
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
} 

exports.postEnquiry = (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message 

  const mail = {
    from: 'insurancehouseonline@gmail.com',
    to: email,
    subject: 'Message from Insurance House Official Online',
    html: `<h3>Name:</h3><span>${name}</span><br/><h3>Email:</h3><span>${email}</span><br/><h3>Message:</h3><span>${message}</span><br/>`
}
transporter.sendMail(mail, (err, response) => {
  if(err){
      console.log(err);
  } else {
      console.log('Message sent');
      return res.status(200).send({ result: 'Email sent' });
  }})
}
