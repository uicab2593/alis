var listMessages = [];
var currentMsgId=-1;

$(document).ready(function(){
	setTimeout("playTextToSpeech('Haz click para navegar entre los mensajes.')",300);
	$("#deleteMessage").removeClass('disabled').show();
	console.log(menuOptions);
});
function selectMessageMenu(){
	$("#outputMenuModal").modal('show');		
	currentMsg = menuOptions.eq(optionSelected).data('msg');
	currentMsgId = 	menuOptions.eq(optionSelected).data('msgid')
}
function deleteMessage(){
	$.get('/messages/deleteMessage?msgId='+currentMsgId,function (argument) {
		try{			
			$('#savedMessageModal').addClass("msgSendModalSuccess");
			$("#tittleModalMG").text("Mensaje eliminado");
			$("#msgTextMG").text(currentMsg.toUpperCase());
			playTextToSpeech("Mensaje "+ currentMsg.toUpperCase() + " eliminado");
			$('#savedMessageModal').modal("show").delay( 4000 ).hide("slow", function () {
		    	closeCurrentModal();
		    	window.location.href = "/messages";
			});			
		}catch(err){						
			$('#savedMessageModal').addClass("msgSendModalWarnning");
			$("#tittleModalMG").text("Mensaje no eliminado");
			$("#msgTextMG").text(currentMsg.toUpperCase());
			playTextToSpeech("Error, mensaje no eliminado, inténtelo otra vez");
			$('#savedMessageModal').modal("show").delay( 4000 ).hide("slow", function () {
		    	closeCurrentModal();
			});
		}	
	});
}
