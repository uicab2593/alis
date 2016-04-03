var msg = [''];
var currentWord = 0;
var keyboardMenuModal;
var keyboardTimer;
var textArea;
var keyOrderSelected=0;
var keyboard;
var keyboardKeys;
var onKeyboard;
var suggestModal;
$(document).ready(function(){
	suggestModal = $("#suggestModal");
	textArea = $("#textArea");
	keyboardMenuModal = $("#keyboardMenuModal");
	keyboard = $("#keyboard");
	loadArrayKeys();
	$("#showSuggest").click(function(){		
		suggestModal.modal('show');
	});
	$("#finishWord").click(function(){		
		msg.push('');
		currentWord = msg.length-1;
		setMsg();
		closeCurrentModal(startKeyboard);
	});
	$("#finishMessage").click(function(){		
		closeCurrentModal(function(){alert('mensaje terminado')});
	});
	$("#deleteWord").click(function(){
		msg[currentWord]='';
		setMsg();
		closeCurrentModal(startKeyboard);
	});
	$("#keyboardMenuModal .returnButton").click(function(){
		setTimeout(startKeyboard,500);
	});
});
signal1 = function (){
	if(onKeyboard){
		pushKey();
	}else if(optionSelected==-1){
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
	msg[currentWord]+=key.data('key');
	setMsg();
	if(setSuggest()){
		$("#showSuggests").removeClass('disabled');
	}else{
		$("#showSuggests").addClass('disabled');
	}
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
	var word = msg['currentWord'];
	return false;
}
