var numbers = ['0','1','2','3','4','5','6','7','8','9'];
var vowels = ['e','a','o','i','u'];
var consonants = ['l','s','r','n','m','p','c','t','b','g','d','f','v','h',
				  'j','k','ñ','y','q','w','z','x'];				  
var optionKeys = [];
var msg = [''];
var keyboardMenuModal;
var keyboardTimer;
var keyboardTimerAux;
var boxMsg;
var keySelected=0;
var keyboard;
var keyboardKeys;
var onKeyboard;
var suggestsModal;
var confirmSuggestModal;
var pointer;
$(document).ready(function(){
	suggestsModal = $("#suggestsModal");
	boxMsg = $("#boxMsg");
	keyboardMenuModal = $("#keyboardMenuModal");
	keyboard = $("#keyboard");
	confirmSuggestModal = $("#confirmSuggest");
	keyboardKeys = $("#keyboard button[data-key]");
	getEnableKeys('');
	$("#saveMessage").removeClass('disabled').show();
	pointer = $("#pointer");
	togglePointer();
});
var auxSignal1 = signal1;
signal1 = function (){	
	if(onKeyboard){		
		if((new Date()).getTime() - keyboardTimerAux.getTime()<600){ //retardo del clicker
			setKeyOption(keySelected-1<0?keyboardKeys.length-1:keySelected-1);
		}
		pushKey();
	}else if(getCurrentModal()==null){
		startKeyboard();
	}else{
		auxSignal1();
	}
}
var auxSignal2 = signal2;
signal2 = function(){
	if(onKeyboard){
		clearTimeout(keyboardTimer);
		onKeyboard=false;
		playTextToSpeech("Haz escrito, "+currentMsg,function(){
			keyboardMenuModal.modal('show');
		});
	}else if(getCurrentModal()==null){
		clearTimeout(keyboardTimer);
		onKeyboard=false;
		playTextToSpeech("Haz escrito, "+currentMsg,function(){
			keyboardMenuModal.modal('show');
		});
	}else{
		auxSignal2();
	}
}
var auxSignal3 = signal3;
signal3 = function(){
	if(onKeyboard) deleteLetter();
	else auxSignal3();
}
function asdas() {
	// body...
}
function deleteLetter(){
	if(msg.length>0){
		if(msg[msg.length-1]==""){
			msg.pop();
			if(msg.length>0) msg[msg.length-1] = msg[msg.length-1].slice(0,-1); 
		}
		else{
			msg[msg.length-1] = msg[msg.length-1].slice(0,-1);
		}
	}
	setMsg();
	startKeyboard();
}

function setKeyOption (index) {
	clearTimeout(keyboardTimer);
	toggleKey(keyboardKeys,false);
	// keyboardKeys.removeClass('optionSelected');
	toggleKey(keyboardKeys.eq(index),true);
	// keyboardKeys.eq(index).addClass('optionSelected');
	keySelected = index;
	//console.log("data-audio:"+keyboardKeys.eq(keySelected).attr("data-key"));
	playTextToSpeech(keyboardKeys.eq(keySelected).attr("data-key"));
	keyboardTimer = setTimeout(nextKey,1500);
}
function pushKey () {
	clearTimeout(keyboardTimer);
	onKeyboard=false;
	var key = keyboardKeys.eq(keySelected);
	if(msg.length>0)
		msg[msg.length-1]+=key.data('key');
	else
		msg[0]=key.data('key');
	
	setMsg();
	getEnableKeys(key.data('key'));	
	// activa o desactiva boton terminar palabra
	$("#finishWord").removeClass('disabled');
	var getSuggestsCallback = function(words){
		var suggests = words; 
		if(suggests.length>0){
			// activa o desactiva boton sugerencias
			$("#showSuggests").removeClass('disabled');
			setSuggests(suggests);
		}else{
			$("#showSuggests").addClass('disabled');
		}
	};
	playSugerencias(msg[msg.length-1],getSuggestsCallback);
	startKeyboard();
}
function startKeyboard() {
	clearTimeout(keyboardTimer);
	onKeyboard  = true;
	toggleKey(keyboardKeys,false);
	// keyboardKeys.eq(keySelected).removeClass('optionSelected');
	keySelected=0;
	//console.log("--->"+optionKeys);
	//getEnableKeys('');
	if(optionKeys.indexOf('e')>-1){
		toggleKey(keyboardKeys.eq(keySelected),true);
		// keyboardKeys.eq(keySelected).addClass('optionSelected');
		keyboardTimerAux = new Date();
		playTextToSpeech('E');
		keyboardTimer = setTimeout(nextKey,2000);	
	}else nextKey();	

}
function jumpKeyOption(keys) {
	clearTimeout(keyboardTimer);
	// keyboardKeys.eq(keySelected).removeClass('optionSelected');
	keySelected = (keySelected+keys)%keyboardKeys.length;
	// keyboardKeys.eq(keySelected).addClass('optionSelected');
	playTextToSpeech(keyboardKeys[keySelected].data('key'));	
	keyboardTimer = setTimeout(nextKey,1500);	
}
function nextKey () {
	keyboardTimerAux = new Date();		
	keySelected = (keySelected+1)%keyboardKeys.length;	
	if(keyboardKeys.eq(keySelected).hasClass('keyOption')){
		playTextToSpeech(keyboardKeys.eq(keySelected).data('key'));		
		toggleKey(keyboardKeys,false);
		// keyboardKeys.removeClass('optionSelected');	
		toggleKey(keyboardKeys.eq(keySelected),true);
		// keyboardKeys.eq(keySelected).addClass('optionSelected');
		keyboardTimer = setTimeout(nextKey,1500);
	}else nextKey();
	
}
function toggleKey (keyObj,enable) {
	keyObj.css({background: enable?"#2780e3":''});
}
function printEnableKeys(){
	clearTimeout(keyboardTimer);	
	keyboardKeys.removeClass('keyOption');
	keyboardKeys.addClass('disableKey');
	
	//console.log("--:"+msg[msg.length-1]);
	//getEnableKeys('l');

	for(var i=0; i<keyboardKeys.length; i++){					
		for(var j=0; j<optionKeys.length; j++){			
			if(keyboardKeys.eq(i).data('key')==optionKeys[j])
				keyboardKeys.eq(i).addClass('keyOption');
		}
	}

}

function getEnableKeys(lastChar){	
	switch(lastChar){
		case 'l': optionKeys = vowels.concat(['r','d','v','f','c','g','p','t','l']).concat(numbers);
			break;
		case 's': optionKeys = vowels.concat(['t','p','n','c','h','q','k']).concat(numbers);
			break;
		case 'r': optionKeys = vowels.concat(['l','s','d','r','t','n','m','c','g','v','b']).concat(numbers);
			break;
		case 'g': optionKeys = vowels.concat(['l','r','n','m']).concat(numbers);
			break;
		case 'c': optionKeys = vowels.concat(['l','t','r','n','h']).concat(numbers);
			break;
		case 'd': optionKeys = vowels.concat(['r','q','n','h']).concat(numbers);
			break;
		case 'b': optionKeys = vowels.concat(['l','r','s','v','d','n']).concat(numbers);
			break;
		case 'p': optionKeys = vowels.concat(['l','r','t','s','n','m','c']).concat(numbers);
			break;
		case 'm': optionKeys = vowels.concat(['s','b','p','n']).concat(numbers);
			break;
		case 'n': optionKeys = vowels.concat(['l','t','s','d','f','g','z','h','v','c','q']).concat(numbers);
			break;
		case 'f': optionKeys = vowels.concat(['r','l']).concat(numbers);
			break
		case 't': optionKeys = vowels.concat(['r','l']).concat(numbers);
			break;
		case 'h': optionKeys = vowels.concat(numbers);
			break;
		case 'j': optionKeys = vowels.concat(numbers);
			break;
		case 'ñ': optionKeys = vowels.concat(numbers);
			break;
		case 'z': optionKeys = vowels.concat(numbers);
			break;
		case 'v': optionKeys = vowels.concat(numbers);
			break;
		case 'y': optionKeys = vowels.concat(numbers);
			break;
		case 'k': optionKeys = vowels.concat(['y']).concat(numbers); 
			break;
		case 'q': optionKeys = ['u'].concat(numbers);
			break;
		case 'w': optionKeys = vowels.concat(['h']).concat(numbers); 
			break;
		case 'x': optionKeys = vowels.concat(['t','c']).concat(numbers); 
			break;		
		default: optionKeys = vowels.concat(consonants).concat(numbers);
			break;
	}
	printEnableKeys();
}
function setMsg () {		
	boxMsg.html(msg.join('&nbsp;'));
	currentMsg = msg.join(' ');	
}
function waitFunc() {
    if (!GlobalFlag) {
        console.log('--->');
    }
}
function setSuggests (suggests) {
	var htmlButtons = '';
	for(var i in suggests){
		if(i<5) htmlButtons+="<button type='button' data-audio='"+suggests[i]+"' onclick='selectSuggest(this)' class='menuOption btn btn-default btn-xs' data-word='"+suggests[i]+"'>"+suggests[i]+"</button>";
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
	getEnableKeys('');
	// closeCurrentModal(startKeyboard);
	getEnableKeys('');
	closeCurrentModal();
}
function finishMessage () {
	currentMsg = msg.join(' ');
	getEnableKeys('');
	closeCurrentModal(function(){
		$("#outputMenuModal").modal('show');
	});	
}
function deleteWord () {
	if(msg[msg.length-1]=='') msg.pop();
	msg[msg.length-1]='';
	getEnableKeys('');
	setMsg();
	getEnableKeys('');
	// closeCurrentModal();
}
function selectSuggest(btn) {
	var word = $(btn).data('word');
	confirmSuggestModal.find("h2").text('"'+word+'"');
	confirmSuggestModal.find('.menuOption').data('word',word);
	confirmSuggestModal.modal('show');	
	playTextToSpeech("Confirmar sugerencia, "+word);
}
function confirmSuggest (btn) {
	msg[msg.length-1]=$(btn).data('word');
	msg.push('');
	setMsg();
	$("#showSuggests").addClass('disabled');
	toggleKey($("#showSuggests"),false);
	$("#finishWord").addClass('disabled');
	toggleKey($("#showSuggests,#finishWord"),false);
	getEnableKeys('');
	closeAllModals();
}
function saveMessage(){	
	try{		
		$.get('/dictado/saveMessage?message='+currentMsg.toUpperCase());
		showSavedMsg('Mensaje guardado',' ','msgSendModalSuccess');
	}catch(ex){
		showSavedMsg('Mensaje no guardado','no','msgSendModalWarnning');
		setTimeout(playTextToSpeech("Inténtelo otra vez"),2000);
	}	
}
function showSavedMsg(tittle,strban,classname){
	$('#savedMessageModal').addClass(classname);
	$("#tittleModalMG").text(tittle);
	$("#msgTextMG").text(currentMsg.toUpperCase());
	playTextToSpeech("Mensaje "+ currentMsg.toUpperCase() +" "+strban+" guardado");
	$('#savedMessageModal').modal("show").delay( 4000 ).hide("slow", function () {
    	closeCurrentModal();
	});

}
function togglePointer(){ pointer.fadeIn(500).delay(250).fadeOut(500, togglePointer); }
