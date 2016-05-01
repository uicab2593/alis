var messagesContainer;
$(document).ready(function(){
	messagesContainer = $("#messagesContainer");
	socket.on('pushmessage',function(){
		loadHistory();
	});
	loadHistory();
	$(document.body).on('click','#messagesContainer a',function(e){
		e.preventDefault();
	});
	$("#loadOldHistory").click(function(){
		var btn = $(this);
		loadHistory(true,$("#messagesContainer a").length);
	});
});
function loadHistory (append,offset) {
	append = append || false;
	offset = offset || 0;
	console.log(append);
	console.log(offset);
	$("#loadOldHistory").button('loading');
	$.get('/monitor/getHistory',{offset:offset},function(messages){
		if(messages.length>0){
			var auxDate; 
			if (!append) messagesContainer.html('');
			for(var i in messages){
				auxDate = $.format.date(messages[i].date,'dd/MMM hh:mm a');
				messagesContainer.append("<a href='/monitor/check' class='btn btn-block option-dark' >"+messages[i].message+"<span>"+auxDate.toLocaleString()+"</span></a>");
			}
		}else{
			showAlert(true,"No existen mas mensajes");
		}
		$("#loadOldHistory").button('reset');			
	},'json');
}
// inhabilita funcion normal de clicks
signal1 = function(){};
signal2 = function(){};
signal3 = function(){};