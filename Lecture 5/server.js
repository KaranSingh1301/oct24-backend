const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const userModel = require("./userSchema");

//constants
const app = express();
const PORT = 8000;
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/oct24TestDb";

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlware
app.use(express.json()); //axios, postman (json)
app.use(express.urlencoded({ extended: true })); // form (url encoded)

app.use(
  session({
    secret: "This is oct backend module",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  //return res.send("Server is up and running...");
  return res.status(200).json("Server is up and running...");
});

//register
app.get("/register-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div>
<br>
    <h1>Register Form</h1>
    <form action="/register" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="email">Email:</label>
        <input type="text" id="email" name="email"><br><br>
        <label for="password">Password:</label>
        <input type="text" id="password" name="password"><br><br>
        <input type="submit" value="Submit">
      </form>
      </div
</body>
</html>`);
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  const userObj = new userModel({
    //schema : client
    name: req.body.name,
    email: email,
    password: password,
  });

  try {
    const userDb = await userObj.save();

    // const userDb = await userModel.create({name, email, username})

    return res.status(201).json({
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

//login
app.get("/login-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div>
<br>
    <h1>Login Form</h1>
    <form action="/login" method="POST">
        <label for="loginId">Email:</label>
        <input type="text" id="loginId" name="loginId"><br><br>
        <label for="password">Password:</label>
        <input type="text" id="password" name="password"><br><br>
        <input type="submit" value="Submit">
      </form>
      </div
</body>
</html>`);
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  //find the user with loginId
  //if not, than user is not registed
  //if yes, compare the password
  //if not, incorrect password
  //if yes, session base auth
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("Missing user credentials.");

  try {
    const userDb = await userModel.findOne({ email: loginId });

    if (!userDb)
      return res.status(400).json("User does not exist, please register first");

    if (password !== userDb.password)
      return res.status(400).json("Incorrect Password");

    //session
    console.log(req.session);
    req.session.isAuth = true;

    return res.status(200).json("Login successfull");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/test", (req, res) => {
  console.log(req.session);

  if (req.session.isAuth) {
    return res.status(200).json("Private important data");
  } else {
    return res.status(401).json("Session expired, please login again");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});

//find --> [{} , {}], []
//findOne ---> {}, Null

// sid + "This is a string" ===> "encrypted string"
