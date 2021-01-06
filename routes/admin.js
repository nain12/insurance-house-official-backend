const express = require("express");
const controller = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/users", isAuth, controller.getUsers);
routes.post("/add-user", isAuth, controller.postUser);
routes.post("/delete-user", isAuth, controller.deleteUser);
routes.post("/update-user", isAuth, controller.updateUser);

module.exports = routes;
