const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;
  User.findAll({
    where: {
      email: email,
    },
  })
    .then((result) => {
      if (result[0]) {
        user = result[0];
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
        { email: email, id: user.id },
        "$ghy#izpe;%VT*ewdjo",
        { expiresIn: "1h" }
      );
      res.setHeader('Set-Cookie',`token=${token}; HttpOnly=true`);
      return res.status(200).send({ email: user.email });
    })
    .catch((err) => {
      console.log("error", err.message);
      return res.status(500).send({ result: "Error" });
    });
};
