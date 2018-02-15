// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');
var img = new Image();

// camera properties
const camWidth = 320;
const camHeight = 240;

let scrolledX = 0;
let timerId = 0;
let widthContainer = $( ".longSlider__longObject" ).width()

let startSlider = data => {
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
  }, 10)  
}

let drawResponse = data => {
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
}
let state = {
  intervalId: 0,
  pause: false,
  pauseTime: 500
}

let sendVideoFrame = () => {
  if (state.pause) return
  context.drawImage(video, 0, 0, camWidth, camHeight);
  var dataURL = canvas.toDataURL('image/jpeg', 1);

  state.pause = true;
  $.ajax({
    url: '/frame',
    method: "POST",
    data: {
      image: dataURL
    },
    success: function(res) {
      startSlider(res)
      setTimeout(() => {
        state.pause = false
      }, state.pauseTime)
      
      setTimeout(() => {
        sendVideoFrame()
      }, 2000)
    }
  });
}

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function capture(payload) {
	if(payload.score > 150 && !state.pause) {
    console.log(payload.score)
    sendVideoFrame()
  }
}

DiffCamEngine.init({
	video: video,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
  captureCallback: capture,
  captureWidth: 320,
  captureHeight: 240
});



if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function (stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();

  });
}