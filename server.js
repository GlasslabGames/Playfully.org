/* jshint es5:true */

var express = require('express'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    errorhandler = require('errorhandler'),
    methodOverride = require('method-override');
    serveStatic = require('serve-static');
    http = require('http'),
    path = require('path'),
    config = require('./config');

var app = express();


app.set('port', config.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('layout', 'layout');

app.use(favicon(path.join(__dirname, config.PUBLIC_DIRECTORY) + '/favicon.ico'));
app.use(logger({format: config.LOGGING_FORMAT}));
app.use(bodyParser());
app.use(errorhandler());
app.use(methodOverride());
app.use(serveStatic(path.join(__dirname, config.PUBLIC_DIRECTORY)));


var router = express.Router();

http.createServer(app).listen(app.get('port'), function() {
  'use strict';
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Express static path: ' + path.join(__dirname, config.PUBLIC_DIRECTORY));
});

