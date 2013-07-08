/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:2, maxerr:50 */
/* global colorUtils: false, createMediaStream: false  */
window.test = false;

// Browser prefixes because we want to be cross browser and future proof here.
navigator.getUserMediaBrowserCompat = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

// We don't got no jquery, wait for the dom to load
document.addEventListener('DOMContentLoaded', init, false);

// Functiona called when the DOM is ready.
function init() {

  var videoElement = document.getElementsByTagName('video')[0];
  var ctxInput = document.getElementById('canvasInput').getContext('2d');
  var ctxOutput = document.getElementById('canvasOutput').getContext('2d');

  // Hoist the stream, so the below application can use it.
  var localMediaStream;

  navigator.getUserMediaBrowserCompat(
      // Media options, we don't want audio up in this.
     {
        video: true,
        audio: false
     },
     // When the user says its okay to record them
     function(stream) {
        // Set the <video> tag to the video stream URL
        videoElement.src = window.URL.createObjectURL(stream);

        // assign the stream variable so the application loop can use it below
        localMediaStream = stream;
     }
  );

  // Start looping every 25 milliseconds
  setInterval(function () {

    // Dont do anything if there is no stream available
    if (!localMediaStream) return true;

    // Draw the video element to the canvas source element
    // this way we can call getImageData from it
    ctxInput.drawImage(videoElement, 0, 0);

    // Get all the pixel information for the video image frame
    // This contains a datastructure something like this:
    //
    // ImageData {height: 480, width: 640, data: Uint8ClampedArray[1228800]}
    //
    // data: is an array containing every pixel and its rgb value, its
    // structured a little weird though
    //
    // data: [
    // 255, //red color of first pixel
    // 255, // green color of first pixel
    // 255, // blue color of first pixel
    // 1, // alpha value of second pixel
    // 255, //red color of second pixel
    // 255, // green color of second pixel
    // ... // etc for every pixel in the image.
    // ]
    //
    var imageData = ctxInput.getImageData(0, 0, 640, 480);

    // Because of how the datastructure is defined above lets go through every 4
    // pixels to be speedy.
    for (var i = 0; i < 640 * 480 * 4; i+=4) {
      // Where the magic happends...

      // The red pixel
      imageData.data[i] = imageData.data[i];
      // The green pixel, lets +100 it so the output is green.
      imageData.data[i + 1] = imageData.data[i + 1] + 100;
      // The blue pixel
      imageData.data[i + 2] = imageData.data[i + 2];

    }

    // Put the modified pixel input data into the output canvas tag
    ctxOutput.putImageData(imageData, 0, 0);

  }, 25);

} // end init()

