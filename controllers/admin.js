const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

const ITEMS_PER_PAGE = 10;

module.exports.getUsers = (req, res, next) => {
    const page = parseInt(req.query.page); 
    const offsetNumber = page - 1 > 0 ? page - 1 : 0;
    User.findAndCountAll({
      where: {
        role: "User",
      },
      offset: offsetNumber * ITEMS_PER_PAGE, limit: 10
    })
      .then((result) => {
        const noOfUsers = result.count;
        res.status(200).send({ result: result.rows, totalUsers: noOfUsers, hasNextPage: ITEMS_PER_PAGE * page < noOfUsers, hasPreviousPage: page > 1, nextPage: page + 1, previousPage: page - 1, lastPage: Math.ceil(noOfUsers/ITEMS_PER_PAGE), currentPage: page  });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ error: err });
      });
};

module.exports.postUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const policy = req.body.policy;
  const role = "User";
  const uploads = req.body.uploads;
  const comments = req.body.comments;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.create({
        name: name,
        email: email,
        password: hashedPassword,
        policy: policy,
        role: role,
        uploads: uploads,
        comments: comments,
      });
    })
    .then((result) => {
      res.status(200).send({ result: "User added successfully!" });
    })
    .catch((err) => res.send(400).send({ error: err.message }));
};

module.exports.updateUser = (req, res, next) => {
  let fileNames = "";
  for (let i = 0; i < req.files.length; i++) {
        if (i == req.files.length - 1) {
          fileNames = req.files[i].filename;
        } else {
          fileNames = req.files[i].filename + ",";
  }
}
  const userId = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const policy = req.body.policy;
  const uploads = fileNames;
  const comments = req.body.comments;

  User.update({ name: name, email: email, policy: policy, uploads: uploads, comments: comments}, {
    where: {
      id: userId
    }}).then((result) => {
      res.status(200).send({ result: "User updated successfully!" });
    })
    .catch((err) => res.status(400).send({ error: err.message }));
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

