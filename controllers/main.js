var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname+'/../databases/alisdb');
// console.log(__dirname);
exports.index = function(req, res){
  res.render('index');
};

exports.test = function(req,res){
	var words = [];
	db.each('SELECT word FROM Dictionary', function(err, row) {
		words.push(row.word);
	},function(){
		res.render('test',{words:words});
	});
};