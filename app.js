/**
 * Module dependencies.
 */

var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server)
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('databases/alisdb');

// settings

// set our default template engine to "jade"
// which prevents the need for extensions
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// set views for error and 404 pages
app.set('views', __dirname + '/views');

// define a custom res.message() method
// which stores messages in the session

// log
if (!module.parent) app.use(logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/bower_components'));

// session support
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'some secret here'
}));

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'));

// load controllers
require('./lib/boot')(app, { verbose: !module.parent });

app.use(function(err, req, res, next){
  // log it
  if (!module.parent) console.error(err.stack);

  // error page
  res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).render('404', { url: req.originalUrl });
});

var tcpCon = require('./lib/telnet');
tcpCon.run(io);

server.listen(3000);