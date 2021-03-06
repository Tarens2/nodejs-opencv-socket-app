var cv = require('opencv');

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;
var dimentions = {
  current: 0,
  prev: 0,
}

const camWidth = 320
const camHeight = 240

module.exports.faceDetecting = (data, res) => {
  const pngPrefix = 'data:image/jpeg;base64,';
  const jpgPrefix = 'data:image/png;base64,';
  if (data.image.indexOf(pngPrefix) === -1 && data.image.indexOf(jpgPrefix) === -1) {
    throw new Error('Wrong format file')   
  }

  const base64Data = data.image.replace(pngPrefix, '').replace(jpgPrefix, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  cv.readImage(buffer, (err, img) => {
    img.detectObject('./node_modules/opencv/data/haarcascade_eye.xml', {}, (err, faces) => {
      if (err) throw err;
      let averageX = 0
      for (var i = 0; i < faces.length; i++) {
        face = faces[i];
        // im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        averageX += face.x + face.width / 2
      }
      averageX = averageX / faces.length
  
      let sending = {
        facesLength: faces.length,
        direction: 'stop'
      }
      if(faces.length) {
        sending['faceWidth'] = faces[0].width
        sending['faceHeight'] = faces[0].height
        if(Math.abs(averageX - camWidth/2) < 30) {
          sending['direction'] = 'stop'
        } else if (averageX < camWidth/2) {
          sending['direction'] = 'left'
        } else {
          sending['direction'] = 'right'
        }
        sending['speed'] = Math.sqrt(1 + Math.abs(averageX - camWidth/2))
      }
      res.json(sending)
    });
  });

  
}

