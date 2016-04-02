var msg = [''];
var currentWord = 0;
var keyboardMenuModal;
var keyboardTimer;
var textArea;
var keyOrderSelected=0;
var keyboard;
var keyboardKeys;
var onKeyboard;
$(document).ready(function(){
	textArea = $("#textArea");
	keyboardMenuModal = $("#keyboardMenuModal");
	keyboard = $("#keyboard");
	loadArrayKeys();
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
	var suggests = findSuggest(currentWord);
	if(suggests){
		keyboardMenuModal.modal('show');
		setMenuContext(keyboardMenuModal);
		setMenuOption(0);
	}else{
		startKeyboard();
		setMsg();
	}
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
	keyboardTimer = setInterval(nextKey,2000);
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
function findSuggest (word) {
	return true;
}