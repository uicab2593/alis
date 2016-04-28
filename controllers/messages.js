var alisDb = require("../lib/db");
var limit =5;
exports.index = function(req, res){
	var listMessages;
	/*alisDb.getMessages(function(messages){		
		listMessages = messages;
		console.log("LISTA DE MENSAGES CONTROLLER....:"+listMessages);
		res.render('messages',{listMessages});
	});*/
	alisDb.getMessagesLimit(0,limit,function(messages){		
		listMessages = messages;
		console.log("LISTA DE MENSAGES CONTROLLER....:"+listMessages);
		res.render('messages',{listMessages});
	});	
};

exports.nextMessage = function(req, res){
	console.log("NEXT MESSAGES .......");
	alisDb.getMessagesLimit(req.query.lastMsgId,limit,function(messages){		
		listMessages = messages;
		console.log("LISTA DE MENSAGES CONTROLLER....:"+listMessages[0].message);
		res.json(listMessages);
	});		
};

exports.getMessages = function (req, res) {
	alisDb.getMessages(function(messages){		
		res.render('messages',{messages});
	});
}

exports.deleteMessage = function (req, res) {
	console.log("CONTROLLER: eliminado");
	/*alisDb.deleteMessage(req.query.msgId,function (err,result) {
		if(err) throw err;
		console.log("Mesaje eliminado");
		res.json("{[1, mensaje eliminado]}");
	})*/	
	res.json("{[1, mensaje eliminado]}");
};

exports.getMessage = function (req, res) {
	console.log("get meesage ....");
	alisDb.getMessage(req.query.messageId,function(message){		
		console.log("REGRESO: "+message);
		res.json(message)
	});
};