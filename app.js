// modules
var express = require('express')
  , http = require('http')
  , morgan = require('morgan')
  , compression = require('compression');

  // configuration files
var configServer = require('./server/config/server');
var bodyParser = require('body-parser')

// app parameters
var app = express();

app.use(compression());
app.set('port', configServer.httpPort);
app.use(express.static(configServer.staticFolder));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json());

// serve index
require('./server/routes').serveIndex(app, configServer.staticFolder);

var gcInterval;
function init()
{
    gcInterval = setInterval(function() { gcDo(); }, 60000);
}
function gcDo()
{
    global.gc();
    clearInterval(gcInterval);
    init();
}
init();

// HTTP server
var server = http.createServer(app);


server.listen(app.get('port'), function () {
    console.log('HTTP server listening on port ' + app.get('port'));
});

module.exports.app = app;