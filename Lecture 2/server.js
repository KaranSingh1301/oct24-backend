const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  console.log("GET /home api is wroking");
  console.log(req);
  return res.send("Server is up and running......");
});

app.listen(8001, () => {
  console.log("Server is running at PORT : 8000");
});
