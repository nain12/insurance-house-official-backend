const express = require("express");
const controller = require("../controllers/user");
const routes = express.Router();

routes.get("/user/:id", controller.getUser);

module.exports = routes;
