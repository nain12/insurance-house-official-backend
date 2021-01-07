const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const sequelize = require("./util/database");
const user = require("./models/user");

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [ "https://nain12.github.io", "http://localhost:3000"];
  const origin = req.headers.origin;
  console.log('Orgin',origin);
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.setHeader("Access-Control-Allow-Origin", "https://nain12.github.io");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin");
  res.setHeader("Access-Control-Expose-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  console.log('Response Headers', res);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", adminRoutes);
app.post("/add-user", adminRoutes);
app.post("/delete-user", adminRoutes);
app.post("/update-user", adminRoutes);
app.post("/login", authRoutes);
app.post("/send-mail", authRoutes);
app.post("/reset-password", authRoutes);
app.post("/change-password", authRoutes);
app.get("/user/:id", userRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
