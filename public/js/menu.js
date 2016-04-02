var menuContext=null;
var menuOptions;
var optionSelected = -1;
var signal1 = function(){};
var signal2 = function(){};
var signal3 = function(){};
// var callbackSignal1 = function(){};
// var callbackSignal2 = function(){};
// var callbackSignal3 = function(){};
$(document).ready(function(){
	$.fn.modalmanager.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;color:#fff'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";
	$.fn.modal.defaults['spinner'] = "<div class='loading-spinner fade in text-center' style='width: 200px; margin-left: -100px;'><i class='fa fa-refresh fa-spin fa-4x'></i></div>";

	$(document.body).on('hidden.bs.modal','.modal',function (e) {
		setMenuContext();
	});
	$(document.body).on('shown.bs.modal','.modal',function (e) {
		setMenuContext();
	});

	// para pruebas
	$("#testSignal1").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal1();});
	$("#testSignal2").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal2();});
	$("#testSignal3").click(function(e){e.preventDefault();if(menuContext==null) setMenuContext(); signal3();});

	var socket = io();
	socket.on('signal', function(signal){
		console.log(signal);
		var signal = parseInt(signal);
	 	if(signal==1) signal1();
	 	else if(signal==2) signal2();
	 	else if(signal==3) signal3();
	});	
});
function setMenuContext(container){
	menuContext = container;
	if(menuContext==null){
		menuContext = getCurrentModal();
	}
	if(menuContext==null){
		menuContext = $(".menuContext").eq(0);
	}
	menuOptions = menuContext.find('.menuOption');
	optionSelected = -1;
	menuOptions.each(function(i,o){
		if($(o).hasClass('optionSelected')) optionSelected = i;
	});
}
signal1 = function (){
	blinkSignal(1);
	nextOption();
}
signal2 = function (){
	blinkSignal(2);
	if(optionSelected>=0){
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
	console.log(optionSelected);
	var newOptionSelected = (optionSelected+1)%menuOptions.length;
	menuOptions.removeClass('optionSelected');
	menuOptions.eq(newOptionSelected).addClass('optionSelected');
	optionSelected = newOptionSelected;
}
function setMenuOption (index) {
	menuOptions.removeClass('optionSelected');
	menuOptions.eq(index).addClass('optionSelected');
	optionSelected = index;
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