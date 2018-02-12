const {faceDetecting} = require('../../libs/faceDetecting')

exports.serveIndex = function (app, staticFolder) {
  app.post('/frame', function (req, res) {
    faceDetecting(req.body, res)
  })

  app.get('*', function (req, res) {
      res.sendFile('index.html', { root: staticFolder });
    });
};