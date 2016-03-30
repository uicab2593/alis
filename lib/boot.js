/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require('./../controllers/' + name);
    var name = obj.name || name;
    var prefix = obj.prefix || '';
    var app = express();
    var handler;
    var method;
    var path;
    var cleanName;

    for (var key in obj) {
      // route exports
      cleanName = name.replace('.js','');
      method = 'get';
      path = '/' + (cleanName=='main' && key=='index'?'':cleanName) + (key!='index'?'/'+key:'');

      // setup
      handler = obj[key];
      path = prefix + path;

      // before middleware support
      app[method](path, handler);
      verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
    }

    // mount the app
    parent.use(app);
  });
};
