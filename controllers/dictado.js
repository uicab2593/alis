var alisDb = require("../lib/db");
var bot = require('telegram-bot-bootstrap');
var botALIS = new bot('210304290:AAFymxNSeZs6ilUPCsYrPCDJxhQmeQhdo18');

exports.index = function(req, res){
  res.render('dictado/index');
};

exports.getsuggests = function(req, res){
	alisDb.getSuggests(req.query.q,function(words){
		res.json(words);
	});
};

exports.sendMessageToContact = function (req, res) {
	var idChat = req.param("idChat");
	var msg = req.param("msgToSend");
	botALIS.sendMessage({chat_id: idChat, text: msg});
}
