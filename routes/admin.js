const express = require("express");
const controller = require("../controllers/admin");
const routes = express.Router();

routes.get("/users", controller.getUsers);
routes.post("/add-user", controller.postUser);
routes.post("/delete-user", controller.deleteUser);

module.exports = routes;
