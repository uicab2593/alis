var alisDb = require("../lib/db");

exports.index = function(req, res){
	// obtener contactos de telegram
	alisDb.getTelegramContacts(function(contacts){
		alisDb.getSettings(function(settings){
			var sets = {};
			for(var i in settings) sets[settings[i].tag] = settings[i].value;
			res.render('settings',{contacts:contacts,settings:sets});
		});
	});
};

exports.setSettings = function(req, res){
	var settings = req.query.settings;
	alisDb.updateSettings(settings,function(){
		res.json({success:true});
	});
};

exports.addContact = function(req, res){
	var name = req.query.name;
	var idChat = req.query.idChat;
	alisDb.addTelegramContact(name,idChat,function(){
		res.json({success:true});
	});
};

exports.updateContact = function(req, res){
	var id = req.query.id;
	var name = req.query.name;
	var idChat = req.query.idChat;
	alisDb.updateTelegramContact(id,name,idChat,function(){
		res.json({success:true});
	});
};

exports.deleteContact = function(req, res){
	var id = req.query.id;
	alisDb.deleteTelegramContact(id,function(){
		res.json({success:true});
	});
};

exports.getContacts = function(req, res){
	alisDb.getTelegramContacts(function(contacts){
		res.json(contacts);
	});
};