var redirectTimer;
$(document).ready(function(){
	$(document.body).on('shown.bs.modal','#audioConfigModal',function(){
		redirectTimer =  setTimeout(function(){
			window.location.href = $("#disableAudio").attr('href');
		},3000);
	});
	$("#audioConfigModal .returnButton").click(function(){
		clearTimeout(redirectTimer);
	});
	$("#disableAudio").click(function(e){
		e.preventDefault();
		localStorage.setItem("audio",false);
		window.location.href = $(this).attr('href');
	});
});