

//Display images on website or uploaded by user 
let myImage = document.getElementById("uploadedFile");
let uploadForm = document.getElementById("uploadForm");

function getBase64(file) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onloadend = function() {
        resolve(reader.result)
        }
        reader.readAsDataURL(file);
    })
}



// document.getElementById('show_simulated').addEventListener('onclick', function(evt){
//     let output_image = document.getElementById("output_image");
//     output_image.src = "uploads/image.png";
//     document.getElementById("input_image_container").style.display = "block";
//     console.log("Changed image source");
// });
async function display() {
    console.log("displayed");
    let input_image = document.getElementById("input_image");
    if(myImage.files[0]){
        let image = myImage.files[0];
        let url=URL.createObjectURL(image);
        input_image.src = url;
        document.getElementById("input_image_container").style.display = "block";
    }
}

let imageID;
uploadForm.onsubmit = async function(e) {
    e.preventDefault();
    //imageTag = document.getElementById("input_image");
    let base64data;
    if (myImage.files[0]){
        base64data= await getBase64(myImage.files[0]);
        console.log("found file...");
    }
    console.log("uploaded form.");
    jQuery.ajax({
        method: 'POST',
        url: '/upload',
        data: {
            file: base64data
        }
    })
    .then(function (res) {
        if (res.id){
            console.log("Yeeeeeeee");
            imageID = res.id;
            return;
        } 
        throw new Error('Something went wrong');
    })
    .catch((error)=>{
        console.log("Error in upload.")
        alert("No image was uploaded. Please try again.");
    })
}
// function display(event) {
//     console.log("displayed");
//     let input_image = document.getElementById("input_image");
//     let url=URL.createObjectURL(event.target.files[0]);
//     input_image.src = url;
//     document.getElementById("input_image_container").style.display = "block";
// }


//Predict image and display output



function simulateImage(){
    let output_image = document.getElementById("output_image");
    output_image.src = "public/converted_image.png";
    if (imageID){ //check if exists
        output_image.src = "uploads/"+imageID+".png";
    }
    else {
        console.log("isn't there");
    }
    document.getElementById("input_image_container").style.display = "block";

}
async function predict_image() {
    let input = document.getElementById("output_image");
    //Preprocessing steps 
    /*
    (1)Resize to 224*224
    (2)Convert to float
    */
    let tfImg;
    console.log("Called predict_image");
    
    tfImg = tf.browser.fromPixels(input)
        .resizeNearestNeighbor([224, 224]) // change image size
        .expandDims() // expand tensor rank
        .toFloat();

    const model = await tf.loadGraphModel('/public/savedModel/model.json');
    console.log("Loaded model");

    pred = model.predict(tfImg);
    //In dataset, 0 = Friendly, 1 = Unfriendly
    //At which index in tensor we get the largest value ?
    let result = "";

    pred.data().then((data) => {
        //output = document.getElementById("output_chart");
        //output.innerHTML = "";
        document.getElementsByClassName("output_screen")[0].style.display = "flex";

        if (data > 0.5) {
            
            result = "Unfriendly";
            document.getElementById("output_text").innerHTML = "<p>Our model predicts that this image is: </p><p>" + result + " with a " + (data * 100).toFixed(2) + "% probability</p>";

        }
        else {
            result = "Friendly";
            document.getElementById("output_text").innerHTML = "<p>Our model predicts that this image is: </p><p>" + result + " with a " + (100-data * 100).toFixed(2) + "% probability</p>";

        }

        //style_text = "width: 100px; height: 25px; position:relative; margin-top: 3vh; background-color: green; ";
        //output.innerHTML += "<div style = '" + style_text + "'></div>";

        //document.getElementById("output_text").innerHTML = "";
    });
}