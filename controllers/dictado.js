var alisDb = require("../lib/db");
var bot = require('telegram-bot-bootstrap');
var botALIS = new bot('210304290:AAFymxNSeZs6ilUPCsYrPCDJxhQmeQhdo18');

exports.index = function(req, res){
	alisDb.getSettings(function(settings){
		console.log(settings);
		res.render('dictado/index',{dictationTimer:settings.dictationTimer});
	});
};

exports.getsuggests = function(req, res){
	alisDb.getSuggests(req.query.q,function(words){
		res.json(words);
	});
};

exports.sendMessageToContact = function (req, res) {
	var idChat = req.query.idChat;
	var msg = req.query.msgToSend;
	botALIS.sendMessage({chat_id: idChat, text: msg}).then(function(r){
		r = JSON.parse(r);
			//if(err) res.json({success:false});
			//console.log("RESPUESTA:"+r.ok);
			if(r.ok)
				res.json({success:true});
			else
				res.json({success:false});
	});
};

exports.saveMessage = function (req, res) {
	alisDb.getMessageId(req.query.message,function(messageId){
		console.log("REGRESO: "+messageId);		
		if(!messageId){
			alisDb.insertMessage(req.query.message,function(err,messages){
				if(err) throw err;
				return [1,"mensaje guardado"];
			});			
		}else
		 	return [0,"Ya existe mesaje"];
	});
};

exports.test = function (req,res) {
	botALIS.getUpdates().then(function(r){
		console.log(r);
		res.json('ya');
	});
};