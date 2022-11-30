const express = require('express');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require('path');
const fs = require('fs');
var exec = require('child_process').exec;


const makeFilePath = require('./makeFilePath');

app.use('/public', express.static(process.cwd() + '/public'));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});

app.post('/upload', upload.single('fileupload'), async function (req, res) {
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    }
    const tempPath = req.file.path;
    console.log(tempPath);    
    const targetPath = path.join(__dirname, "./uploads/image.png");



    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);
    });

    exec('Rscript simulateImage.R', function(error, stdout, stderr) {
      if (error) {
          console.log(error);
          res.send(error);
      }
      else if (stderr) {
          console.log("stderr")
          console.log(stderr);
          res.send(stderr);
      }
      else if (stdout) {
          console.log(stdout);
          console.log("RAN SUCCESSFULLY");
          res.status(204).send();

      }
    return;
    });

    //const imagePath = path.join(__dirname, '/public/tempImages');
    //const fileUpload = new makeFilePath(imagePath);
    
    //const filename = await fileUpload.save(req.file.buffer);
    //return res.status(200).json({ name: filename });
  });


app.get("/uploads/image.png", (req, res) => {
  console.log("sendOver");
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});



const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server is running on "+port);
});