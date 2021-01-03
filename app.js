const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const sequelize = require("./util/database");
const user = require("./models/user");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", adminRoutes);
app.post("/add-user", adminRoutes);
app.post("/delete-user", adminRoutes);

app.get("/user/:id", userRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
