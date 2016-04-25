var sqlite3 = require('sqlite3').verbose(),
fs = require('fs'),
db = new sqlite3.Database('../databases/alisdb'),
dic = process.argv[2];


fs.readFile(dic, 'utf8', function (err,data) {
  if (err) return console.log(err);
  var lines = data.split("\n"),
  word,frecuencyNorm,frecuencyAbs,aux;
  db.serialize(function(){
	db.run("DROP TABLE IF EXISTS Dictionary");
	db.run("CREATE TABLE IF NOT EXISTS Dictionary (word VARCHAR(20) PRIMARY KEY, frecuencyAbs FLOAT, frecuencyNorm FLOAT)");
  	stmt = db.prepare('INSERT INTO Dictionary VALUES (?,?,?)');
		for(var i in lines){
			aux = lines[i].split("	");
			word = aux[1].trim();
			frecuencyAbs = parseFloat(aux[2].trim().replace(',',''));
			frecuencyNorm = parseFloat(aux[3].trim().replace(',',''));
			console.log(word);
			stmt.run(word,frecuencyAbs,frecuencyNorm);
		}
	stmt.finalize();
  });
  db.close();
});
// console.log(process.argv[]);
