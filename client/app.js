// MODIFY THIS TO THE APPROPRIATE URL IF IT IS NOT BEING RUN LOCALLY
var socket = io();


// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');
var img = new Image();

// camera properties
var camWidth = 320;
var camHeight = 240;

let scrolledX = 0;
let timerId = 0;
let widthContainer = $( ".longSlider__longObject" ).width()
socket.on('faces', function(data) {
  document.querySelector('.countFaces').textContent = data.closer
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;

  clearTimeout(timerId)
  timerId = setInterval(()=> {
    switch (data.direction) {
      case 'right': 
        scrolledX += data.speed
        if(scrolledX > widthContainer ) {
          scrolledX = widthContainer
        }
        $( ".longSlider" ).scrollLeft(scrolledX);
        break;
      case 'left':
        scrolledX -= data.speed
        if(scrolledX < 0 ) {
          scrolledX = 0
        }
        $( ".longSlider" ).scrollLeft(scrolledX);
        break;
      case 'stop':
        // TODO: stop animation
        break;
    }
  }, 100)  
})



if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function (stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });

  setInterval(() => {
    context.drawImage(video, 0, 0, camWidth, camHeight);
    var dataURL = canvas.toDataURL();
    
    socket.emit("frame", {
      image: dataURL
    })
  }, 500)
}