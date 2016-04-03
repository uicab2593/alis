var msg = [''];
var keyboardMenuModal;
var keyboardTimer;
var textArea;
var keyOrderSelected=0;
var keyboard;
var keyboardKeys;
var onKeyboard;
var suggestsModal;
var confirmSuggestModal;
$(document).ready(function(){
	suggestsModal = $("#suggestsModal");
	textArea = $("#textArea");
	keyboardMenuModal = $("#keyboardMenuModal");
	keyboard = $("#keyboard");
	confirmSuggestModal = $("#confirmSuggest");
	loadArrayKeys();
	$("#showSuggests").click(function(){		
		suggestsModal.modal('show');
	});
	$("#finishWord").click(function(){		
		msg.push('');
		setMsg();
		// closeCurrentModal(startKeyboard);
		closeCurrentModal();
	});
	$("#finishMessage").click(function(){		
		closeCurrentModal();
	});
	$("#deleteWord").click(function(){
		if(msg[msg.length-1]==''){
			msg.pop();
		}
		msg[msg.length-1]='';
		setMsg();
		closeCurrentModal();
		// closeCurrentModal(startKeyboard);
	});
	$("#suggestsModal").on('click','.menuOption',function(){
		var word = $(this).data('word');
		confirmSuggestModal.find("h2").text('"'+word+'"');
		confirmSuggestModal.find('.menuOption').data('word',word);
		confirmSuggestModal.modal('show');
	});
	$("#confirmSuggest .modal-body button").click(function(){
		msg[msg.length-1]=$(this).data('word');
		msg.push('');
		setMsg();
		$("#showSuggests").addClass('disabled').removeClass('optionSelected');
		$("#finishWord").addClass('disabled').removeClass('optionSelected');
		closeCurrentModal(closeCurrentModal); //cierra 2 modales		
	});
	// $("#keyboardMenuModal .returnButton").click(function(){
		// setTimeout(startKeyboard,500);
	// });
});
signal1 = function (){
	if(onKeyboard){
		pushKey();
	}else if(getCurrentModal()==null){
		startKeyboard();
	}else{
		blinkSignal(1);
		nextOption();		
	}
}
function pushKey () {
	clearTimeout(keyboardTimer);
	onKeyboard=false;
	var key = keyboardKeys[keyOrderSelected];
	msg[msg.length-1]+=key.data('key');
	setMsg();
	// activa o desactiva boton sugerencias
	if(setSuggest()) $("#showSuggests").removeClass('disabled');
	else $("#showSuggests").addClass('disabled');
	// activa o desactiva boton terminar palabra
	if(msg[msg.length-1]=='') $("#finishWord").addClass('disabled');
	else $("#finishWord").removeClass('disabled');
	keyboardMenuModal.modal('show');
	setMenuContext(keyboardMenuModal);
	setMenuOption(0);
}
function loadArrayKeys () {
	auxKeyboardKeys = $("#keyboard .keyOption");
	keyboardKeys = new Array(auxKeyboardKeys.length);
	var obj;
	auxKeyboardKeys.each(function(i,o){
		obj = $(o);
		keyboardKeys[parseInt($(o).data('order'))] = obj;
	});
}
function startKeyboard() {
	onKeyboard  = true;
	keyboardKeys[keyOrderSelected].removeClass('optionSelected');
	keyOrderSelected=0;
	keyboardKeys[keyOrderSelected].addClass('optionSelected');
	keyboardTimer = setInterval(nextKey,1000);
}
function nextKey () {
	console.log(keyOrderSelected);
	keyboardKeys[keyOrderSelected].removeClass('optionSelected');
	// console.log(keyOrderSelected);
	keyOrderSelected = (keyOrderSelected+1)%keyboardKeys.length;
	keyboardKeys[keyOrderSelected].addClass('optionSelected');
}
function setMsg () {
	textArea.html(msg.join(' '));
}
function setSuggest () {
	var word = msg[msg.length-1];
	return true;
}