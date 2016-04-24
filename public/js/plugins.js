function selectContact () {	
	playTextToSpeech("Seleccione un contacto");
	$("#selectContactModal").modal('show');	
}

function getChatID(){
	var toPerson = menuOptions.eq(optionSelected).data('audio');	
	var idChat = menuOptions.eq(optionSelected).data('chat');	
	sendMessageTelegram(idChat, msgToShow.toUpperCase(),toPerson.toUpperCase());	
}

function sendMessageTelegram (idChat,msgToSend,toPerson) {
	$("#msgTo").text("   "+toPerson);
	$("#msgText").text("   "+msgToSend);
	try{		
		if(msgToSend){
			$.get('dictado/sendMessageToContact?idChat='+idChat+'&msgToSend='+msgToSend);
			$('#messageSendModal').addClass("msgSendModalSuccess");
			$("#tittleModal").text("Mensaje enviado");		
			playTextToSpeech("Mensaje "+msgToSend+". Enviado a "+toPerson);				
			$('#messageSendModal').modal("show").delay( 4000 ).hide("slow", function () {
		    	closeCurrentModal();
			});
		}		
	}catch(err){
		$('#messageSendModal').addClass("msgSendModalWarnning");
		$("#tittleModal").text("Mensaje no enviado");
		playTextToSpeech("Error, mensaje no enviado, inténtelo otra vez");
		$('#messageSendModal').modal("show").delay( 4000 ).hide("slow", function () {
	    	closeCurrentModal();
		});
	}
}



