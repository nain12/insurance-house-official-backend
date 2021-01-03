const User = require("../models/user");

module.exports.getUsers = (req, res, next) => {
  User.findAll({
    where: {
      role: "User",
    },
  })
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};

module.exports.postUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const policy = req.body.policy;
  const role = req.body.role;
  const uploads = req.body.uploads;
  const comments = req.body.comments;

  User.create({
    name: name,
    email: email,
    policy: policy,
    role: role,
    uploads: uploads,
    comments: comments,
  })
    .then((result) => {
      res.status(200).send({ result: "User added successfully!" });
    })
    .catch((err) => res.send(400).send({ error: err.message }));
};

module.exports.deleteUser = (req, res, next) => {
  const userId = req.body.id;
  User.destroy({
    where: {
      id: userId,
    },
  })
    .then((result) => {
      res.status(200).send({ result: "User deleted sucessfully!" });
    })
    .catch((err) => {
      res.status(400).send({ result: err.message });
    });
};
