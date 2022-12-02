const express = require('express');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require('path');
const fs = require('fs');
var exec = require('child_process').exec;
const { v4: uuidv4 } = require('uuid');

let imageID;
//const makeFilePath = require('./makeFilePath');
const e = require('express');
const { type } = require('os');

app.use('/public', express.static(process.cwd() + '/public'));
//app.set('view engine', 'ejs');



app.post('/upload/id.json', upload.single('fileupload'), async function (req, res) {
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  const tempPath = req.file.path;
  //console.log(tempPath.split("/")[1]);
  imageID = tempPath.split("/")[1]  //uuidv4();

  const targetPath = path.join(__dirname, `./uploads/${imageID}.png`);
  console.log(targetPath)
  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);
  });

  console.log("Going through upload...")
  //return res.json({ id: imageID });

  res.status(204).send();
});



app.post("/convert", async(req, res)=> {
  console.log("converting...");
  exec('Rscript simulateImage.R '+imageID, function (error, stdout, stderr) {
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
    return;
  });
});

app.get("/uploads/"+imageID+".png", (req, res) => {
  console.log("sendOver");
  res.sendFile(path.join(__dirname, "/uploads/"+imageID+".png"));
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

