const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();
const PORT = 8000;

// server.on("request", (req, res) => {
//   console.log(req.url + " " + req.method);

//   const data = " This is oct nodejs module...";

//   if (req.url === "/" && req.method === "GET") {
//     return res.end("Server is up and running...");
//   }
//   //write
//   else if (req.url === "/writefile" && req.method === "GET") {
//     fs.writeFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Write successfull");
//     });
//     return;
//   }
//   //append
//   else if (req.url === "/appendfile" && req.method === "GET") {
//     fs.appendFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Append successfull");
//     });
//     return;
//   } else if (req.url === "/readfile" && req.method === "GET") {
//     fs.readFile("demo.txt", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//       return res.end(data);
//     });
//     return;
//   } else if (req.url === "/deletefile" && req.method === "GET") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Delete successfull");
//     });
//   } else if (req.url === "/renamefile" && req.method === "GET") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename successfull");
//     });
//   }
//   //stream read
//   else if (req.url === "/streamread" && req.method === "GET") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       console.log(char);
//       res.end(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   } else {
//     return res.end(req.method + " " + req.url + " Not found");
//   }
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      const src = files.fileToUpload[0].filepath;
      const dest =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;

      fs.copyFile(src, dest, (err) => {
        if (err) throw err;
        console.log("File copied successfully");
        fs.unlink(src, (err) => {
          if (err) throw err;
          console.log("File deleted from the src");
          return res.end("File uploaded succesfully");
        });
      });
    });
  } else {
    fs.readFile("form.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server is running at PORT:${PORT}`);
});
