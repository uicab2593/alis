var msg = [''];
var keyboardMenuModal;
var keyboardTimer;
var keyboardTimerAux;
var textArea;
var keySelected=0;
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
	keyboardKeys = $("#keyboard button[data-key]");
	setTimeout("playTextToSpeech('Haz click para comenzar el dictado')",500);	
});
var auxSignal1 = signal1;
signal1 = function (){
	if(onKeyboard){
		console.log((new Date()).getTime() - keyboardTimerAux.getTime());
		if((new Date()).getTime() - keyboardTimerAux.getTime()<600){
			setKeyOption(keySelected-1<0?keyboardKeys.length-1:keySelected-1);
		}
		pushKey();
	}else if(getCurrentModal()==null){
		startKeyboard();
	}else{
		auxSignal1();
		// blinkSignal(1);
		// nextOption();		
	}
}
var auxSignal2 = signal2;
signal2 = function(){
	if(onKeyboard){
		clearTimeout(keyboardTimer);
		onKeyboard=false;
		keyboardMenuModal.modal('show');
	}else if(getCurrentModal()==null){
		clearTimeout(keyboardTimer);
		onKeyboard=false;
		keyboardMenuModal.modal('show');		
		// keyboardMenuModal.modal('show');
	}else{
		auxSignal2();
		// blinkSignal(1);
		// nextOption();		
	}
}
var auxSignal3 = signal3;
signal3 = function(){
	if(onKeyboard){
		startKeyboard();
	}else{
		auxSignal3();
	}
}
function setKeyOption (index) {
	clearTimeout(keyboardTimer);
	keyboardKeys.removeClass('optionSelected');
	keyboardKeys.eq(index).addClass('optionSelected');
	keySelected = index;
	console.log("data-audio:"+keyboardKeys.eq(keySelected).attr("data-key"));
	playTextToSpeech(keyboardKeys.eq(keySelected).attr("data-key"));
	keyboardTimer = setTimeout(nextKey,1500);
}
function pushKey () {
	clearTimeout(keyboardTimer);
	onKeyboard=false;
	var key = keyboardKeys.eq(keySelected);
	msg[msg.length-1]+=key.data('key');
	setMsg();
	var getSuggestsCallback = function(data){
		var suggests = data[1]; 
		if(suggests.length>0){
			// activa o desactiva boton sugerencias
			$("#showSuggests").removeClass('disabled');
			setSuggests(suggests);
		}
		else{
			$("#showSuggests").addClass('disabled');
		}
		// activa o desactiva boton terminar palabra
		if(msg[msg.length-1]=='') $("#finishWord").addClass('disabled');
		else $("#finishWord").removeClass('disabled');
		// keyboardMenuModal.modal('show');
		// setMenuContext(keyboardMenuModal);
		// setMenuOption(0);		
	};
	playSugerencias(msg[msg.length-1],getSuggestsCallback);
	startKeyboard();
}
function startKeyboard() {
	onKeyboard  = true;
	keyboardKeys.eq(keySelected).removeClass('optionSelected');
	keySelected=0;
	keyboardKeys.eq(keySelected).addClass('optionSelected');
	keyboardTimerAux = new Date();
	playTextToSpeech('A');
	keyboardTimer = setTimeout(nextKey,2000);
}
function jumpKeyOption(keys) {
	clearTimeout(keyboardTimer);
	keyboardKeys.eq(keySelected).removeClass('optionSelected');
	keySelected = (keySelected+keys)%keyboardKeys.length;
	keyboardKeys.eq(keySelected).addClass('optionSelected');
	playTextToSpeech(keyboardKeys[keySelected].data('key'));	
	keyboardTimer = setTimeout(nextKey,1500);	
}
function nextKey () {
	// console.log(keySelected+' - '+keyboardKeys[keySelected].data('key'));
	keyboardTimerAux = new Date();
	keySelected = (keySelected+1)%keyboardKeys.length;
	keyboardKeys.removeClass('optionSelected');	
	keyboardKeys.eq(keySelected).addClass('optionSelected');
	playTextToSpeech(keyboardKeys.eq(keySelected).data('key'));
	keyboardTimer = setTimeout(nextKey,1500);
}
function setMsg () {
	textArea.html(msg.join(' '));	
}
function waitFunc() {
    if (!GlobalFlag) {
        console.log('--->');
    }
}
function setSuggests (suggests) {
	var htmlButtons = '';
	for(var i in suggests){
		if(i<5) htmlButtons+="<button type='button' data-audio='"+suggests[i]+"' class='menuOption btn btn-default btn-xs' data-word='"+suggests[i]+"'>"+suggests[i]+"</button>";
	}
	suggestsModal.find('.modal-body').html(htmlButtons);
}
function newMessage(){
	msg = [''];
	setMsg();
	closeAllModals();
	socket.emit('message','');
}
function continueMessage(){
	closeAllModals();
	socket.emit('message','');
}
function finishWord () {
	msg.push('');
	setMsg();
	// closeCurrentModal(startKeyboard);
	closeCurrentModal();	
}
function finishMessage () {
	closeCurrentModal(function(){
		$("#outputMenuModal").modal('show');
	});	
}
function deleteWord () {
	if(msg[msg.length-1]=='') msg.pop();
	msg[msg.length-1]='';
	setMsg();
	closeCurrentModal();
}
function selectSuggest(btn) {
	var word = $(btn).data('word');
	confirmSuggestModal.find("h2").text('"'+word+'"');
	confirmSuggestModal.find('.menuOption').data('word',word);
	confirmSuggestModal.modal('show');
	confirmSuggestModal.find('.menuOption').addClass('optionSelected');
	playTextToSpeech("Confirmar sugerencia, "+word);
}
function confirmSuggest (btn) {
	msg[msg.length-1]=$(btn).data('word');
	msg.push('');
	setMsg();
	$("#showSuggests").addClass('disabled').removeClass('optionSelected');
	$("#finishWord").addClass('disabled').removeClass('optionSelected');
	closeAllModals();
}