var bot = require('telegram-bot-bootstrap');
var fs = require('fs');
var botALIS = new bot('210304290:AAFymxNSeZs6ilUPCsYrPCDJxhQmeQhdo18');

exports.index = function(req, res){  	
	res.render('dictado');
};

exports.sendMessageToContact = function (req, res) {
	var idChat = req.param("idChat");
	var msg = req.param("msgToSend");
	botALIS.sendMessage({chat_id: idChat, text: msg});
}