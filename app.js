const express = require('express');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require('path');
var bodyParser = require('body-parser')
const fs = require('fs');
var exec = require('child_process').exec;
const { v4: uuidv4 } = require('uuid');

let imageID;
//const makeFilePath = require('./makeFilePath');
const e = require('express');
const { type } = require('os');

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

//app.set('view engine', 'ejs');



app.post('/upload', /*upload.single('fileupload'),*/ async function (req, res) {
  if (!req.body.file) {
    res.status(404).json({ error: 'Please provide an image' });
    console.log("No file found.")
    return;
  }

  const directory = "uploads";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });

  //Read base64 into buffer then create new file in /uploads
  imageID =  uuidv4();
  let file = req.body.file.replace(/^data:image\/(png|jpeg);base64,/,"");
  const targetPath = path.join(__dirname, `./uploads/${imageID}.png`);
  fs.writeFileSync(targetPath, file, {'encoding': 'base64'});
  //const buffer = fs.readFileSync('buffer64.png');
  //fs.writeFileSync(targetPath, buffer);


  console.log("Going through upload...")
  
  res.status(200).json({ id: imageID });
  
  //res.status(204).send();
});



app.post("/convert", async(req, res)=> {
  console.log("converting...");
  if(imageID){
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
  } else {
    console.log("No image was provided");
    res.status(204).send();
  }
});

app.get("uploads/"+imageID+".png", (req, res) => {
  
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

