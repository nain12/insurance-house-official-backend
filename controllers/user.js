const User = require("../models/user");

module.exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  User.findAll({ where: { id: userId } })
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch((err) => {
      res.status(400).send({ result: err.message });
    });
};
