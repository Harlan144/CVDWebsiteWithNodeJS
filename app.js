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
  if (!req) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  //fs.createWriteStream("try1").write(req.file.buffer);

  //const file = fs.readFileSync(req.body, {encoding: 'base64'});

  //const tempPath = req.file.path;
  //console.log(tempPath.split("/")[1]);
  imageID =  uuidv4(); //tempPath.split("/")[1] 
  let file = req.body.file.replace(/^data:image\/(png|jpg);base64,/,"");
  const targetPath = path.join(__dirname, `./uploads/${imageID}.png`);
  fs.writeFileSync("buffer64.png", file, {'encoding': 'base64'});
  const buffer = fs.readFileSync('buffer64.png');
  fs.writeFileSync(targetPath, buffer);



  console.log("Going through upload...")
  res.json({ id: imageID });
  
  //res.status(204).send();
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

