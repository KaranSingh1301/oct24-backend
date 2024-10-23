const express = require("express");
require("dotenv").config();
const clc = require("cli-color");

//file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");

//constants
const app = express();
const PORT = process.env.PORT;

//middlewares
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.underline(`server is running at PORT:${PORT}`));
});
