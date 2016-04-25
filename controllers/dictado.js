var alisDb = require("../lib/db");

exports.index = function(req, res){
  res.render('dictado/index');
};

exports.getsuggests = function(req, res){
	alisDb.getSuggests(req.query.q,function(words){
		res.json(words);
	});
};