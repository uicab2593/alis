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
		closeCurrentModal(function(){
			$("#outputMenuModal").modal('show');
		});
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

	$("#showMonitorPublic").click(function(){
		var text = msg.join(' ');
		socket.emit('message',text);
		console.log(text);
		$("#monitorPublicModal h2").text(text);
	});

	setTimeout("playTextToSpeech('Haz click para comenzar el dictado')",500);	
});
var auxSignal1 = signal1;
signal1 = function (){
	if(onKeyboard){
		pushKey();
	}else if(getCurrentModal()==null){
		startKeyboard();
	}else{
		auxSignal1();
		// blinkSignal(1);
		// nextOption();		
	}
}
function pushKey () {
	clearTimeout(keyboardTimer);
	onKeyboard=false;
	var key = keyboardKeys[keyOrderSelected];
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
		keyboardMenuModal.modal('show');
		setMenuContext(keyboardMenuModal);
		setMenuOption(0);		
	};
	playSugerencias(msg[msg.length-1],getSuggestsCallback);
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
	keyboardTimer = setInterval(nextKey,1500);	
	playTextToSpeech('A');
}
function nextKey () {
	// console.log(keyOrderSelected+' - '+keyboardKeys[keyOrderSelected].data('key'));
	keyboardKeys[keyOrderSelected].removeClass('optionSelected');	
	keyOrderSelected = (keyOrderSelected+1)%keyboardKeys.length;
	keyboardKeys[keyOrderSelected].addClass('optionSelected');
	playTextToSpeech(keyboardKeys[keyOrderSelected].data('key'));
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
		if(i<5) htmlButtons+="<button type='button' class='menuOption btn btn-default btn-xs' data-word='"+suggests[i]+"'>"+suggests[i]+"</button>";
	}
	suggestsModal.find('.modal-body').html(htmlButtons);
}