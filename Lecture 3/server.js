const express = require("express");

const app = express();
const PORT = 8000;

//middlware
app.use(express.json());

app.get("/", (req, res) => {
  //return res.send("Server is up and running...");
  return res.status(200).json("Server is up and running...");
});

//query
// /api?key=val
app.get("/api", (req, res) => {
  console.log(req.query);
  const val = req.query.key;
  return res.send(`Value is ${val}`);
});

// /api1?key1=val1&key2=val2
app.get("/api1", (req, res) => {
  console.log(req.query);
  const { key1, key2 } = req.query;
  return res.send(`Val1 : ${key1} and Val2:${key2}`);
});

// /api2?key=100,200,300
app.get("/api2", (req, res) => {
  console.log(req.query.key.split(","));
  return res.send(`api is working`);
});

//params
app.get("/profile/:id", (req, res) => {
  console.log(req.params);
  return res.send("API for dynamic params is working");
});

app.get("/profile1/:id1/:id2", (req, res) => {
  console.log(req.params);
  return res.send("API for dynamic params is working");
});

// html form

app.post("/user", (req, res) => {
  console.log(req.body);
  return res.send("user created successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
