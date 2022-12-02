const express = require('express');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require('path');
const fs = require('fs');
var exec = require('child_process').exec;
//const ejs = require('ejs');
let image;
const makeFilePath = require('./makeFilePath');
const e = require('express');

app.use('/public', express.static(process.cwd() + '/public'));
//app.set('view engine', 'ejs');



app.post('/upload', upload.single('fileupload'), async function (req, res) {
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "./uploads/image.png");
  
  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);
  });

  console.log("Going through upload...")
  res.status(204).send();
  return;
});



app.post("/convert", async(req, res)=> {
  console.log("converting...");
  exec('Rscript simulateImage.R', function (error, stdout, stderr) {
    if (error) {
      console.log("error");
      console.log(error);
      res.send(error);
      return;
    }
    else if (stderr) {
      console.log("stderr")
      console.log(stderr);
      res.send(stderr);
      return;
    }
    else if (stdout) {
      console.log(stdout);
      res.status(204).send();
    }
    image = "./uploads/image.png";
    return;
  });
});

app.get("/uploads/image.png", (req, res) => {
  console.log("sendOver");
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});


app.get("/", function (req, res) {
  
  // if (!image){
  //   image = "public/converted_image.png";
  // }

  // res.render('index', {
  //   image: image
  // });
  res.sendFile(process.cwd() + "/index.html");
});
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server is running on " + port);
});

