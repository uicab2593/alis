var request = require('request');
var fs = require('fs');
var audios = require('../public/js/audios.json');

var alphabet = "abcdefghijklmnñopqrstuvwxyz";
for(var l in alphabet) audios[alphabet[l]]=alphabet[l];
audios["0"]="zero";
for(var i=1;i<10;i++) audios[i.toString()]=i.toString();

var auxAudio = 0;
var audiosKeys = Object.keys(audios);
var audiosLength = audiosKeys.length;
var loadAudio = ()=>{
	if(auxAudio<audiosLength){
	// if(auxAudio<5){
		fileName = __dirname+'/../public/audios/'+audiosKeys[auxAudio]+'.mp3';
		fs.exists(fileName, (exists) => {
			if(!exists){
				var audioStream = fs.createWriteStream(fileName);
				audioStream.on('close',function(){
					console.log(audiosKeys[auxAudio]);
					auxAudio++;
					loadAudio();
				});
				request('http://responsivevoice.org/responsivevoice/getvoice.php?t='+encodeURIComponent(audios[audiosKeys[auxAudio]])+'&tl=es').pipe(audioStream);
			}else{
				auxAudio++;
				loadAudio();				
			}
		});		
	}
}
loadAudio();
