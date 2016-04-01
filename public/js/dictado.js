var msg = [''];
var currentWord = 0;
var keyboardModal;
var textArea;
$(document).ready(function(){
	textArea = $("#textArea");
	keyboardModal = $("#keyboardModal");
	$("button[data-key]").click(function(e){
		msg[currentWord]+=$(this).data('key');
		var suggests = findSuggest(currentWord);
		if(suggests){
			keyboardModal.modal('show');
		}else{
			setMenuOption(0);
			initMenuAuto();
			setMsg();
		}
	});
});
function setMsg () {
	textArea.html(msg.join(' '));
}
function findSuggest (word) {
	return false;
}