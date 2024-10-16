const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const { userDataValidation, isEmailValidate } = require("./utils/authUtil");
const userModel = require("./models/userModel");

//constants
const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  return res.send("server is up and running");
});

app.get("/register-page", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, username, password } = req.body;

  try {
    await userDataValidation({ email, username, password, name });
  } catch (error) {
    return res.status(400).json(error);
  }

  //email and username exist or not

  const userEmailExist = await userModel.findOne({ email });
  if (userEmailExist) {
    return res.status(400).json("Email already exist");
  }

  const userUsernameExist = await userModel.findOne({ username });
  if (userUsernameExist) {
    return res.status(400).json("Username already exist");
  }

  //encypt of password
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const userObj = new userModel({
    name,
    email,
    username,
    password: hashedPassword,
  });

  try {
    const userDb = await userObj.save();

    return res
      .status(201)
      .json({ message: "Register successfull", data: userDb });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

app.get("/login-page", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("Missing user credentials");

  try {
    let userDb;
    if (isEmailValidate({ key: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb)
      return res.status(400).json("User does not exist, register first");

    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) return res.status(400).json("Password does not matched");

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at : http://localhost:${PORT}`);
});
