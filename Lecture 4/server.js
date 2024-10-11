const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./userSchema");

const app = express();
const PORT = 8000;
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/oct24TestDb";

//middlware
app.use(express.json()); //axios, postman (json)
app.use(express.urlencoded({ extended: true })); // form (url encoded)

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  //return res.send("Server is up and running...");
  return res.status(200).json("Server is up and running...");
});

app.get("/get-form", (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div>
<br><br>
    <form action="/create-user" method="POST">
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

app.post("/create-user", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
