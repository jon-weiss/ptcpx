var path = require('path');
global.__base = path.join(__dirname + '/..');
global.__dbbase = path.join(__base + '/..' + '/db');
var fs = require('fs');
global.ext = require('./lib/extensions');

var http = require('http'); // needed to integrate with ws package for mock web socket server.
var express = require('express');
var app = express();
var httpServer = http.createServer(app);
var session = require('express-session');
var cookieParser = require('cookie-parser'); // used for session cookie
var bodyParser = require('body-parser');

// Models
global.Models = {
  PxaResults: require('./model/PxaResults')
  
};


/**********************************************************************
       SETTING UP EXRESS SERVER
***********************************************************************/
app.set('trust proxy', 1);

var node_env = process.env.node_env || 'development';
console.log('************ Environment: ' + node_env + '******************');

// Session Storage Configuration:
// *** Use this in-memory session store for development only. Use redis for prod. **
var sessionOptions = {
  secret: 'predixsample',
  name: 'cookie_name', // give a custom name for your cookie here
  maxAge: 30 * 60 * 1000,  // expire token after 30 min.
  proxy: true,
  resave: true,
  saveUninitialized: true
  // cookie: {secure: true} // secure cookie is preferred, but not possible in some clouds.
};
app.use(cookieParser('predixsample'));
app.use(session(sessionOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/****************************************************************************
	SET UP EXPRESS ROUTES
*****************************************************************************/
app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public')));

//  --> dynamically include routes (Controllers)
fs.readdirSync('./server/controllers').forEach(function (file) {
  if (file.substr(-9) === 'Router.js') {
    var rname = file.replace(file.substr(-3), '').replace('Router', '');
    var route = require('./controllers/' + file)({});
    app.use('/' + rname, route);
  }
});

////// error handlers //////
// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
  app.use(function (err, req, res, next) {
    if (!res.headersSent) {
      res.status(err.status || 500);
      res.send({
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  if (!res.headersSent) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: {}
    });
  }
});

httpServer.listen(process.env.VCAP_APP_PORT || process.env.PORT || 5000, function () {
  console.log('Server started on port: ' + httpServer.address().port);
});
//Add custom routes
require('./routes')(app);
module.exports = app;