const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const sequelize = require("./util/database");
/* const session = require("express-session"); */
/* const SequelizeStore = require("connect-session-sequelize")(session.Store); */
/* const store = new SequelizeStore({
  db: sequelize,
}); */
const user = require("./models/user");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://nain12.github.io/");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* app.use(
  session({
    secret: "$ghy#izpe;%VT*ewdjo",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
); */
app.get("/users", adminRoutes);
app.post("/add-user", adminRoutes);
app.post("/delete-user", adminRoutes);
app.post("/login", authRoutes);

app.get("/user/:id", userRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
