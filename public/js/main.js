var redirectTimer;
$(document).load(function(){
	listMessages = ['HOLA 1','HOLA 2','HOLA 3','HOLA 4','HOLA 5'];
});
$(document).ready(function(){
	listMessages = ['HOLA 1','HOLA 2','HOLA 3','HOLA 4','HOLA 5'];
});

function openAudioConfigModal(modal){
	redirectTimer =  setTimeout(function(){
		localStorage.setItem("audio",true);
		window.location.href = "/dictado";
	},6000);
}
function closeAudioConfigModal(modal){
	clearTimeout(redirectTimer);
}
function disableAudio(btn){
	localStorage.setItem("audio",false);
	window.location.href = "/dictado";
}
function openNecesidadesMenu(){
	// console.log("OPEN NECESIDADES......");
	// redirectTimer =  setTimeout(function(){
		localStorage.setItem("audio",true);
		window.location.href = "/necesidades";
	// },3000);	
}
function openMessageSavedMenu(){
	
	console.log(listMessages);
	window.location.href = "/messages";	
}