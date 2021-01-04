const express = require("express");
const controller = require("../controllers/auth");
const routes = express.Router();

routes.post("/login", controller.postLogin);

module.exports = routes;
