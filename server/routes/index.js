const {faceDetecting} = require('../../libs/faceDetecting')

exports.serveIndex = function (app, staticFolder) {
  app.post('/frame', function (req, res) {
    if(req.body && req.body.image) {
      faceDetecting(req.body, res)
    } else {
      throw new Error('Wrong parametrs')
    }
  })

  app.get('*', function (req, res) {
    res.sendFile('index.html', { root: staticFolder });
  });
};