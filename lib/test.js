var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('../databases/alisdb');
db.each('SELECT word FROM Dictionary', function(err, row) {
	console.log(row);
    // console.log(row.id + ': ' + row.info);
 });