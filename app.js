// modules
var express = require('express')
  , http = require('http')
  , morgan = require('morgan');

// configuration files
var configServer = require('./server/config/server');

// app parameters
var app = express();
app.set('port', configServer.httpPort);
app.use(express.static(configServer.staticFolder));
app.use(morgan('dev'));

// serve index
require('./server/routes').serveIndex(app, configServer.staticFolder);

// HTTP server
var server = http.createServer(app);


// WebSocket server
var io = require('socket.io')(server);
io.on('connection', require('./server/routes/socket'));


server.listen(app.get('port'), function () {
    console.log('HTTP server listening on port ' + app.get('port'));
});

module.exports.app = app;