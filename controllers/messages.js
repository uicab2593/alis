var alisDb = require("../lib/db");

exports.index = function(req, res){  	
	var listMessages = getMessages();			
	res.render('messages',{listMessages});
};

function getMessages (req, res) {
	alisDb.getMessages(function(messages){		
		res.json(messages);
	});		
}