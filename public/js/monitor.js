$(document).ready(function(){
	socket.on('message', function(message){
		console.log(message);
		$("#monitorText").text(message);
	});		
});