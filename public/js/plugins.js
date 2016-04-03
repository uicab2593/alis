function playSugerencias(strVal){  	
  	//alert('hola--->'+strVal);  	  	
    //http://suggestqueries.google.com/complete/search?hl=es&output=toolbar&q=Hola
    var result = [];
    $.when(
		$.ajax({
		  url: 'http://suggestqueries.google.com/complete/search?client=chrome&q='+strVal,
		  type: 'GET',
		  dataType: 'jsonp',
		  async:false,
		  success: function (data) {		    
		    $.each(data[1], function(key, val) {		    	   
		        result.push(val);
		    });
		    console.log('ajax ok');		    
		  },
		  error: function(jqXHR, textStatus, errorThrown){		   
		  	console.log('err.');
		  }
		})
	).then(function(){
		result.length = 5;
		console.log('resultado:'+result);
		/*INDEXAR LAS SUGERENCIAS*/
		return result;
	});	
}

function playTextToSpeech(strVal){
	console.log('----->TEXT:'+strVal);
	//console.log(localStorage.getItem("audio"));

	if(localStorage.getItem("audio")!='false'){
		responsiveVoice.cancel();
		responsiveVoice.speak(strVal,"Spanish Female");
	}
}