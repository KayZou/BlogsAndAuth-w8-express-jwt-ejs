require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const path = require("path");
const cookies = require('cookie-parser')
const userRouter = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(cors());
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("salam zeubida");
});
app.get('*', (req, res, next) => {
  res.render('notFound')
  next();
})
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`khdam f port; http://localhost:${port}`);
});
