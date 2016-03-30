var msg="";
var keyboardTimer;
var startDictation = false;
$(document).ready(function(){
	callbackPress1 = function(){
		startDictation  = true;
		// addLetter($(this).data('letter'));
	}
	keyboardTimer = setTimeout(press1,2000);
	$("#keyboard .menuOption").click(function(e){
	});
});
function addLetter(letter){
	msg+=letter;
	$("#textArea").text(msg + "<span class='pipe'></span>");
}