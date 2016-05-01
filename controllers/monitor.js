var alisDb = require("../lib/db");

exports.index = function(req, res){
  res.render('monitor');
};

exports.getHistory = function(req, res){
	var offset = 'offset' in req.query?req.query.offset:0;
	alisDb.getHistory(offset,function(messages){
		res.json(messages);
	});
};

exports.saveInHistory = function(req, res){
	alisDb.saveInHistory(req.param("msg"),function(){
		res.json({success:true});
	});
};

exports.test = function(req, res){
	alisDb.insertInHistory('hola mensaje 2',function(){
		res.json('ya');
	});
};