const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const sequelize = require("./util/database");
const user = require("./models/user");
const app = express();


app.use((req, res, next) => {
  const allowedOrigins = [ "https://nain12.github.io", "http://localhost:3000", "https://insurance-house-official.herokuapp.com", "https://deepuvalecha.com"];
  const origin = req.headers.origin;
  console.log("Origin", origin);

  // if (allowedOrigins.includes(origin)) {
//       res.setHeader('Access-Control-Allow-Origin', origin);
 // }   
>>>>>>> Stashed changes
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin");
  res.setHeader("Access-Control-Expose-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname
    );
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, limits: { fieldSize: 25 * 1024 * 1024 } }).array("uploads", 10));

app.get("/view-records", adminRoutes);
app.post("/add-user", adminRoutes);
app.delete("/delete-user", adminRoutes);
app.post("/update-user", adminRoutes);
app.post("/login", authRoutes);
app.post("/send-mail", authRoutes);
app.post("/reset-password", authRoutes);
app.post("/change-password", authRoutes);
app.get("/user/:id", userRoutes);
app.get("/download", function(req, res, next){
  const fileName = req.query.file;
  console.log("Filename", fileName);
  const file = `${__dirname}/uploads/${fileName}`;
  if(file) {
  res.download(file, fileName); // Set disposition and send it.
  }
  else {
    res.status(404).send({ result: err.message });
  }
});
app.post("/contact-us", authRoutes);
app.post("/search-user", adminRoutes);

sequelize
  .sync()
  .then((result) => {
   app.listen(process.env.PORT || 8000);
  })
  .catch((err) => {
    console.log(err);
  });
