//var msgOption;
$(document).ready(function(){
	setTimeout("playTextToSpeech('Haz click para navegar entre las opciones.')",500);
});
var auxSignal3 = signal3;
signal3 = function(){
	auxSignal3();
}
function openNecesidadesMenu () {
	console.log("Necesidades Basicas");
	redirectTimer =  setTimeout(function(){
		localStorage.setItem("audio",true);
		window.location.href = "/necesidades";
	},6000);
}
function selectContactNecesidades () {	
	playTextToSpeech("Seleccione un contacto");
	$("#selectContactModal").modal('show');	
	console.log("Mensaje:"+menuOptions.data('necesidad'));
	console.log("Audio necesidades:"+menuOptions.data('audio'));	
}
function selectNecesidad(){
	console.log("SELECT NECESIDAD.....");
	currentMsg = menuOptions.data('necesidad');
	console.log("Mensaje:"+menuOptions.data('necesidad'));
}