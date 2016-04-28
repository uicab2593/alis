var sqlite3 = require('sqlite3').verbose(),
fs = require('fs'),
db = new sqlite3.Database('../databases/alisdb'),
dic = process.argv[2];


fs.readFile(dic, 'utf8', function (err,data) {
  if (err) return console.log(err);
  var lines = data.split("\n"),  
  db.serialize(function(){
	db.run("DROP TABLE IF EXISTS MESSAGES");
	db.run("CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY, message VARCHAR(400), date DATETIME)");
  });
  db.close();
});
// console.log(process.argv[]);
