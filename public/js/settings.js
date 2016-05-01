$(document).ready(function(){
	$("#newTelegramContact form").submit(function(e){
		e.preventDefault();
		var form = $(this);
		$(document.body).modalmanager('loading');
		$.get('/configuracion/addContact',{
			name:form.find("[name='name']").val(),
			idChat:form.find("[name='idChat']").val(),
		},function(r){
			location.reload();
		},'json');
	});
	$("#settingsForm").submit(function(e){
		e.preventDefault();
		var form = $(this);
		$(document.body).modalmanager('loading');
		$.get('/configuracion/setSettings?'+form.serialize(),function(r){
			location.reload();
		});
	});
	$(".updateContact").click(function(e){
		e.preventDefault();
		var tr = $(this).closest('tr');
		$(document.body).modalmanager('loading');
		$.get('/configuracion/updateContact',{
			id:$(this).attr('href'),
			name:tr.find("[name='name']").val(),
			idChat:tr.find("[name='idChat']").val()
		},function(r){
			location.reload();
		},'json');
	});
	$(".deleteContact").click(function(e){
		e.preventDefault();
		$(document.body).modalmanager('loading');
		$.get('/configuracion/deleteContact',{id:$(this).attr('href')},function(r){
			location.reload();
		});
	});
});
// inhabilita funcion normal de clicks
signal1 = function(){};
signal2 = function(){};
signal3 = function(){};