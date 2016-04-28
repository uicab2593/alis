var listMessages =[];
var currentMsg;
var menuContext=null;
var menuOptions;
var optionSelected = -1;
var localAudios=false;
var loadedAudios={};
var socket;
var audio=false;
var signal1 = function(){};
var signal2 = function(){};
var signal3 = function(){};

$(document).ready(function(){

	$.fn.modalmanager.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;color:#fff'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";
	$.fn.modal.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";

	$(document.body).on('hidden.bs.modal','.modal',function (e) {
		toggleOption($(this).find('.menuOption'),false);
		// $(this).find('.menuOption').removeClass('optionSelected');
		if($(this).data('onclose')) window[$(this).data('onclose')]($(this));
		setMenuContext();
	});
	$(document.body).on('shown.bs.modal','.modal',function (e) {
		if($(this).data('onopen')) window[$(this).data('onopen')]($(this));
		setMenuContext();
	});
	$("button[data-msg]").click(function(){
		currentMsg = $(this).data('msg');
		$("#outputMenuModal").modal('show');
	});
	// para pruebas
	$("#testSignal1").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal1();});
	$("#testSignal2").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal2();});
	$("#testSignal3").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal3();});

	socket = io();
	socket.on('signal', function(signal){
		console.log(signal);
		var signal = parseInt(signal);
		if(menuContext==null) setMenuContext();
	 	if(signal==1) signal1();
	 	else if(signal==2) signal2();
	 	else if(signal==3) signal3();
	 	else if(signal==4){
	 		playSugerencias("Botón sincronizado");
	 		alert('Botón sincronizado');
	 	}
	});
	setMenuContext();
});
function setMenuContext(container){	
	menuContext = container;
	if(menuContext==null) menuContext = getCurrentModal();
	if(menuContext==null) menuContext = $(".menuContext").eq(0);
	menuOptions = menuContext.find('.menuOption').not('.disabled');
	toggleOption(menuOptions,false);
	// menuOptions.removeClass('optionSelected');
	optionSelected = -1;
	if(menuContext.data('audio')) playTextToSpeech(menuContext.data('audio'));
	if(menuContext.data('default-option')!=null){
		optionSelected = parseInt(menuContext.data('default-option'));
		setMenuOption(optionSelected);
	}
}
signal1 = function (){
	blinkSignal(1);
	// si solo hay una opcion, puede dar un click para seleccionar
	if(menuOptions.length==1) signal2();
	else nextOption();
}
signal2 = function (){
	blinkSignal(2);
	if(optionSelected>=0) menuOptions.eq(optionSelected).click();
}
signal3 = function (){
	blinkSignal(3);
	var returnButton = menuContext.find('.returnButton');
	if(returnButton.attr('href')){
		window.location.href = returnButton.attr('href');
	}else{
		returnButton.click();
	}
}
function nextOption(){	
	toggleOption(menuOptions,false);
	var newOptionSelected = (optionSelected+1)%menuOptions.length;
	// menuOptions.removeClass('optionSelected');
	scrollToOption(menuOptions.eq(newOptionSelected));
	toggleOption(menuOptions.eq(newOptionSelected),true);
	optionSelected = newOptionSelected;	
	playTextToSpeech(menuOptions.eq(newOptionSelected).data('audio'));
	setTimeout(function (argument) {
		getNextMessages(newOptionSelected);
	},900);
		
}
function getNextMessages(newOptionSelected){
	var rownum = menuOptions.eq(newOptionSelected).data('rownum')+1;
	if (rownum%5==0 || rownum==menuOptions.length) {		
		//console.log("SET MENU OPTION:"+menuOptions.eq(newOptionSelected).data('msgid'));
		//console.log("LAST ID:"+(menuOptions.eq(newOptionSelected).data('rownum')+1));
		setTimeout($.get('/messages/nextMessage?lastMsgId='+menuOptions.eq(newOptionSelected).data('msgid'),function (listMsgs) {
			menuOptions.addClass('disabled').hide();
			for(var item in listMsgs){
				menuOptions.eq(item).removeClass('disabled').show();
				menuOptions.eq(item).data('msgid', listMsgs[item].id);
				menuOptions.eq(item).data('msg', listMsgs[item].message);
				menuOptions.eq(item).find("h2").text(listMsgs[item].message);
				menuOptions.eq(item).data('audio',listMsgs[item].message);


			}
			setMenuContext();
		}),1000);			
		if(rownum%5!=0){
			setTimeout(function (argument) {
				window.location.href = "/messages";
				console.log("REPINTAR LISTA DE MENSAJES");
			},2700);			
		}
	}	
}
function scrollToOption (option) {
	// debe hacer scroll al botón en caso de que sean muchas opciones
	var currentModal = getCurrentModal();
	if(currentModal!=null) currentModal.parent().scrollTo(option);
	else $("body,html").scrollTo(option);
}
function setMenuOption (index) {
	toggleOption(menuOptions,false);
	// menuOptions.removeClass('optionSelected');
	// menuOptions.eq(index).addClass('optionSelected');	
	toggleOption(menuOptions.eq(index),true);
	scrollToOption(menuOptions.eq(index));
	optionSelected = index;
	if(menuOptions.data('audio')) playTextToSpeech(menuOptions.data('audio'));
}
function blinkSignal(signal){
	var btn = $("#signal"+signal); 
	btn.removeClass('btn-primary');
	btn.addClass('btn-danger');
	setTimeout(function(){
		btn.removeClass('btn-danger');
		btn.addClass('btn-primary');
	},1000);
}
function getCurrentModal(){
	var open_modals = $('.modal.in');
	var highest = 0;
	if(open_modals.length>0){
		var best_modal = open_modals.eq(0); 
		open_modals.each(function(index,value){
			var zindex = parseInt($(this).parent().css('zIndex'),10);
			if(zindex>highest){
				highest=zindex;
				best_modal = open_modals.eq(index);
			}	
		});
		return best_modal;
	}
	return null;
}
function closeCurrentModal(callback){
	callback = callback || function(){};
	var m = getCurrentModal();
	m.on('hidden.bs.modal',function(){
		setTimeout(callback,330);//espera los 3ms de efecto de css
	}).modal('hide');
}
function closeAllModals () {
	$(".modal").modal('hide');
}
function playSugerencias(strVal,callback){  	
	console.log(jQuery.param({q:strVal}));
	$.get('/dictado/getsuggests?'+jQuery.param({q:strVal}),callback,'json');
}
function showMonitorPublic () {
	socket.emit('message',currentMsg);
	$("#monitorModal h3").text("Mensaje en pantalla");
	$("#monitorModal h2").text(currentMsg);
	$("#monitorModal").modal('show');
	playTextToSpeech("Mensaje en pantalla, "+currentMsg);
}
function showMonitorPrivate () {
	$("#monitorModal h3").text("Mensaje:");
	$("#monitorModal h2").text(currentMsg);
	$("#monitorModal").modal('show');
	playTextToSpeech("Mensaje, "+currentMsg);
}
function playTextToSpeech(strVal,callback){
	console.log(strVal);
	callback = callback || function(){};
	if(localStorage.getItem("audio")!='false'){
		if(!localAudios===false){
	    	playAudio(strVal,callback);
		}else{
			$.getJSON('/js/audios.json', function(data) {
	    		localAudios = data;
	    		playAudio(strVal,callback);
			});
		}
	}else{
		callback();
	}
}
function playAudio (strVal,callback) {
	strVal = strVal.toString().toLowerCase();
	if(strVal in localAudios || strVal.length==1){
		if(!audio===false) audio.pause();
		if(!(strVal in loadedAudios)){
	        loadedAudios[strVal]= document.createElement("AUDIO");
	        loadedAudios[strVal].src = "/audios/"+strVal+".mp3";
	        loadedAudios[strVal].playbackRate = 1;
	        loadedAudios[strVal].preload = 'auto';
			// audio = document.createElement("AUDIO");
	        // audio.src = "/audios/"+strVal+".mp3";
		}
        loadedAudios[strVal].addEventListener('ended', callback);
        loadedAudios[strVal].currentTime = 0;
        loadedAudios[strVal].play();
        audio = loadedAudios[strVal];
        // audio.volume = 
	}else{
		responsiveVoice.cancel();
		responsiveVoice.speak(strVal,"Spanish Female",{onend:callback});
		if(!responsiveVoice.getResponsiveVoice("Spanish Female").mappedProfile==null){
			callback();
			// segundo intento
			// setTimeout(function(){
				// responsiveVoice.cancel();
				// responsiveVoice.speak(strVal,"Spanish Female",{onend:callback});				
			// },500)
		}			
	}
}
function toggleOption(option,enable){
	option.css({background: enable?"#2780e3":''});
}
function closeMonitorModal(modal){
	socket.emit('message','');
}
function sendMessageTelegram (btn) {
	console.log(currentMsg);
	var btn = $(btn);
	var idChat = btn.data('chat');
	var toPerson = btn.data('audio');
	$("#msgTo").text("   "+toPerson);
	$("#msgText").text("   "+currentMsg);
	try{		
		if(currentMsg){
			$.get('/dictado/sendMessageToContact?idChat='+idChat+'&msgToSend='+currentMsg);
			$('#messageSendModal').addClass("msgSendModalSuccess");
			$("#tittleModal").text("Mensaje enviado");
			playTextToSpeech("Mensaje "+currentMsg+". Enviado a "+toPerson);				
			$('#messageSendModal').modal("show").delay( 4000 ).hide("slow", function () {
		    	closeCurrentModal();
			});
		}		
	}catch(err){
		$('#messageSendModal').addClass("msgSendModalWarnning");
		$("#tittleModal").text("Mensaje no enviado");
		playTextToSpeech("Error, mensaje no enviado, inténtelo otra vez");
		$('#messageSendModal').modal("show").delay( 4000 ).hide("slow", function () {
	    	closeCurrentModal();
		});
	}
}

$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}