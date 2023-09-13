# Colorblind Friendly Tester

## Using the Website
This GitHub contains the source code for this website: [https://bioapps.byu.edu/colorblind_friendly_tester](https://bioapps.byu.edu/colorblind_friendly_tester).
We intend for the website to function as a tool for researchers preparing manuscripts to verify that their images
are colorblind-friendly to people with deuteranopia (red-green colorblind).

A user can upload a JPG or PNG image to the website and an image is returned how someone with 80% deuteranopia would see 
that same image. If the user wants, they can then run that deuteranopia-simulated image through our [machine-learning model](https://github.com/Harlan144/CVDMachineLearning)
and return a confidence score for whether the image is colorblind-friendly or not.

## Running the code locally
If you want to experiment with this website or improve it (there is a lot of room for that!), feel free to download the GitHub.

The website can either be run directly with NodeJS or through Docker (which will create an Image with NodeJS). I will describe both processes below.  
### Using NodeJS
1. Ensure that you have NodeJS and npm installed on your computer with:
  ```
node -v
npm -v
  ```
If those are not installed, follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  
2. Move to the website folder at the terminal.  
3. Run `npm install`.  
4. Run `node app.js`.  
5. Open the website at localhost:3000/colorblind_friendly_tester on your browser of choice.  

### Using Docker
1. Ensure you have Docker up and running. It can be downloaded [here](https://docs.docker.com/get-docker/).
2. Move to the website folder at the terminal
3. Run `./build_docker.sh`
4. Run `./run_docker/sh`
5. Open the website at localhost:8080/colorblind_friendly_tester on your browser of choice.

## Website Background

We created this website as part of a larger project to expose how often scientific figures can be problematic to people with color vision deficiencies (CVD). From manually annotating and classifying 5,000 images from the eLife journal, we found that >12% of images would be hard to understand for someone with red-green color blindness. From this curated dataset, we trained a convolutional neural network to predict whether images are colorblind-friendly or not.  

This website is meant to make our machine learning model more accessible and to enable researchers to identify whether their own images are potentially problematic. This tool allows for users to see their image alongside a deuteranopia-simulated version of the image. If the user requests it, the application uses our classification model to make a prediction about whether the image is likely to be problematic to a person with deuteranopia; this prediction includes a probability so that users can understand the extent to which the model is "confident" in its predictions.

To transfer our [trained convolutional neural network](https://github.com/Harlan144/CVDMachineLearning) to this website, we used Tensorflowjs version 4.0.0 to export the model as a JSON. This website uses a NodeJS framework. To be consistent with how the deuteranopia-simulated images were generated for training the model, the web server executes an R-script to simulate the image as someone with deuteranopia would see it. The model prediction runs on the front-end through vanilla Javascript and uses Tensorflowjs 2.0.0. We use Tensorflowjs to resize the deuteranopia-simulated image to 224x224 pixels (the input image size for the model) and predict how problematic the image is to a person with deuteranopia.

   

