function selectContact () {	
	playTextToSpeech("Seleccione un contacto");
	$("#selectContactModal").modal('show');	
}

function getChatID(){
	var toPerson = menuOptions.eq(optionSelected).data('audio');	
	var idChat = menuOptions.eq(optionSelected).data('chat');	
	sendMessageTelegram(idChat, currentMsg.toUpperCase(),toPerson.toUpperCase());	
}
