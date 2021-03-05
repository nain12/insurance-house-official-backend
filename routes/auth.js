const express = require("express");
const controller = require("../controllers/auth");
const routes = express.Router();

routes.post("/login", controller.postLogin);
routes.post("/send-mail", controller.postReset);
routes.post("/reset-password", controller.verifyResetPassword);
routes.post("/change-password", controller.resetPassword);
routes.post("/contact-us", controller.postEnquiry);

module.exports = routes;
