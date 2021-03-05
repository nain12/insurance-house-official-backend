const express = require("express");
const controller = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/view-records", isAuth, controller.getUsers);
routes.post("/add-user", controller.postUser);
routes.delete("/delete-user", isAuth, controller.deleteUser);
routes.post("/update-user", isAuth, controller.updateUser);
routes.post("/search-user", isAuth, controller.getUser);

module.exports = routes;
