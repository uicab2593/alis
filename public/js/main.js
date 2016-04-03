var redirectTimer;
$(document).ready(function(){
	$(document.body).on('shown.bs.modal','#audioConfigModal',function(){
		redirectTimer =  setTimeout(function(){
			window.location.href = $("#disableAudio").attr('href');
		},6000);

		console.log('open modal audio');		
		playTextToSpeech($("#disableAudio").attr('data-textAudio'));

	});
	$("#audioConfigModal .returnButton").click(function(){
		clearTimeout(redirectTimer);		
	});
	$("#disableAudio").click(function(e){		
		e.preventDefault();
		localStorage.setItem("audio",false);
		console.log(localStorage.getItem("audio"));
		window.location.href = $(this).attr('href');		
	});
});