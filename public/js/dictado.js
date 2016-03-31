var msg = '';
var currentWord = '';
$(document).ready(function(){
	$("button[data-key]").click(function(e){
		currentWord+=$(this).data('key');
		if(var suggests = findSuggest()){
			
		}else{
			
		}
	});
});
function setMsg () {
	$("#textArea").html(msg);
}
function findSuggest (word) {
	return false;
}