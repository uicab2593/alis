var alisDb = require("../lib/db");
var limit =5;
exports.index = function(req, res){
	var listMessages;	
	alisDb.getMessagesLimit(0,limit,function(messages){		
		listMessages = messages;
		res.render('messages',{listMessages});
	});	
};
exports.nextMessage = function(req, res){
	alisDb.getMessagesLimit(req.query.lastMsgId,limit,function(messages){
		listMessages = messages;	
		res.json(listMessages);
	});		
};
exports.getMessages = function (req, res) {
	alisDb.getMessages(function(messages){
		res.render('messages',{messages});
	});
}
exports.deleteMessage = function (req, res) {
	alisDb.deleteMessage(req.query.msgId,function (err,result) {
		if(err) throw err;
		res.json("{[1, mensaje eliminado]}");
	});
};
exports.getMessage = function (req, res) {
	alisDb.getMessage(req.query.messageId,function(message){		
		res.json(message)
	});
};