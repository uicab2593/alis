var sqlite3 = require('sqlite3').verbose();

exports.index = function(req, res){
  res.render('index');
};