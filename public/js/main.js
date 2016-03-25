var options;
var optionSelected;
var menuContext;
$(document).ready(function(){
	$('.modal-trigger').leanModal({
		ready:function(){
			menuContext = $(".menu-context").eq(1);
		},
		complete:function(){
			menuContext = $(".menu-context.menu-default");
		}
	});
	menuContext = $(".menu-context.menu-default");
	var socket = io();
	socket.on('signal', function(signal){
	 	if(signal=='1') press1();
	 	if(signal=='2') press2();
	 	if(signal=='3') press3();
	});
});
function press1(){
	blinkSignal(1);
	options = menuContext.find(".menu-option");
	optionSelected = menuContext.find(".option-selected").index(".menu-option");
	options.eq((optionSelected+1)%options.length).addClass('option-selected');
	options.eq(optionSelected).removeClass('option-selected');
}
function press2(){
	blinkSignal(2);
	optionSelected = menuContext.find(".option-selected");
	console.log(optionSelected);
	if(optionSelected.hasClass('link-option')){
		window.location.href = optionSelected.attr('href');
	}else{
		optionSelected.click();
	}
}
function press3(){
	blinkSignal(3);
	var returnButtons = menuContext.find('.return-button');
	var zHigh = 0;
	var indexOb = -1;
	var aux;
	returnButtons.each(function(i,o){
		if((aux = parseInt($(this).css('zIndex')))>zHigh){
			zHigh = aux;
			indexOb = i;
		}
	});
	if(indexOb!=-1) returnButtons.eq(indexOb).click();
}
function blinkSignal(signal){
	var btn = $("#signal"+signal); 
	btn.removeClass('blue');
	btn.addClass('red');
	setTimeout(function(){
		btn.removeClass('red');
		btn.addClass('blue');
	},1000);
}
function findContext () {
	var contexts = $('.menu-context');
	var zHigh = 0;
	var indexOb = -1;
	var aux;
	contexts.each(function(i,o){
		if((aux = parseInt($(this).css('zIndex')))>zHigh){
			zHigh = aux;
			indexOb = i;
		}
	});
	if(indexOb!=-1) menuContext=contexts.eq(indexOb);
}