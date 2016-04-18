var msgToShow;
var menuContext=null;
var menuOptions;
var optionSelected = -1;
var socket;
var signal1 = function(){};
var signal2 = function(){};
var signal3 = function(){};

$(document).ready(function(){
	$.fn.modalmanager.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;color:#fff'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";
	$.fn.modal.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";

	$(document.body).on('hidden.bs.modal','.modal',function (e) {
		$(this).find('.menuOption').removeClass('optionSelected');
		if($(this).data('onclose')) window[$(this).data('onclose')]($(this));
		setMenuContext();
	});
	$(document.body).on('shown.bs.modal','.modal',function (e) {
		if($(this).data('onopen')) window[$(this).data('onopen')]($(this));
		setMenuContext();
	});
	$("button[data-msg]").click(function(){
		msgToShow = $(this).data('msg');
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
});
function setMenuContext(container){	
	menuContext = container;
	if(menuContext==null) menuContext = getCurrentModal();
	if(menuContext==null) menuContext = $(".menuContext").eq(0);
	menuOptions = menuContext.find('.menuOption').not('.disabled');
	menuOptions.removeClass('optionSelected');
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
	if(optionSelected>=0){
		console.log(menuOptions.eq(optionSelected));
		menuOptions.eq(optionSelected).click();
	}
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
	var newOptionSelected = (optionSelected+1)%menuOptions.length;
	var currentModal = getCurrentModal();
	if(currentModal!=null) currentModal.parent().scrollTo(menuOptions.eq(newOptionSelected));// debe hacer scroll al botón en caso de que sean muchas opciones
	menuOptions.removeClass('optionSelected');
	menuOptions.eq(newOptionSelected).addClass('optionSelected');	
	optionSelected = newOptionSelected;	
	playTextToSpeech(menuOptions.eq(newOptionSelected).data('audio'));
}
function setMenuOption (index) {
	menuOptions.removeClass('optionSelected');
	menuOptions.eq(index).addClass('optionSelected');
	optionSelected = index;
	playTextToSpeech(menuOptions.data('audio'));
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
	$.ajax({
		  url: 'http://suggestqueries.google.com/complete/search?client=chrome&q='+strVal,
		  type: 'GET',
		  dataType: 'jsonp',
		  async:false,
		  success: callback,		    
		  error: function(jqXHR, textStatus, errorThrown){
		  	console.log('err.');
		  }
		});
}
function showMonitorPublic () {
	socket.emit('message',msgToShow);
	$("#monitorModal h3").text("Mensaje en pantalla");
	$("#monitorModal h2").text(msgToShow);
	$("#monitorModal").modal('show');
	playTextToSpeech("Mensaje en pantalla, "+msgToShow);
}
function showMonitorPrivate () {
	$("#monitorModal h3").text("Mensaje:");
	$("#monitorModal h2").text(msgToShow);
	$("#monitorModal").modal('show');
	playTextToSpeech("Mensaje, "+msgToShow);
}
function playTextToSpeech(strVal){
	if(localStorage.getItem("audio")!='false'){
		responsiveVoice.cancel();
		responsiveVoice.speak(strVal,"Spanish Female");
		if(responsiveVoice.getResponsiveVoice("Spanish Female").mappedProfile==null){
			// segundo intento
			setTimeout(function(){
				responsiveVoice.cancel();
				responsiveVoice.speak(strVal,"Spanish Female");				
			},500)
		}
	}
}
function closeMonitorModal(modal){
	socket.emit('message','');
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