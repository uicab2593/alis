var redirectTimer;
$(document).ready(function(){
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