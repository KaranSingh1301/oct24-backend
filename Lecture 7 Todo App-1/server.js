const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

//constants
const app = express();
const PORT = process.env.PORT;

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("server is up and running");
});

app.get("/register-page", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  return res.send("resgiter api is working");
});

app.get("/login-page", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", (req, res) => {
  return res.send("login api is working");
});

app.listen(PORT, () => {
  console.log(`server is running at : http://localhost:${PORT}`);
});
