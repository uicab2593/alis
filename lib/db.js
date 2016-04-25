var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database(__dirname+'/../databases/alisdb'),
AlisDb = {};
 
AlisDb.insertMessage = function(message)
{
	db.run("INSERT INTO messages VALUES (?)",message);
} 
AlisDb.getMessages = function(callback)
{
    db.all("SELECT * FROM messages", function(err, rows) {
        if(err) throw err;
        else callback(null, rows);
    });
}
AlisDb.getSuggests = function(q,callback)
{
	db.all("SELECT word FROM Dictionary WHERE word LIKE '"+q+"%' ORDER BY frecuencyNorm DESC LIMIT 5", function(err, rows) {
		if(err) throw err;
        var words = [];
        for(var i in rows) words.push(rows[i].word);
		callback(words);
	});
}
AlisDb.getMessage = function(messageId,callback)
{
	stmt = db.prepare("SELECT * FROM clientes WHERE id = ?");
    stmt.bind(messageId); 
    stmt.get(function(error, row)
    {
    	if(error) 
        {
            throw err;
        } 
        else 
        {
            if(row) 
            {
                callback("", row);
            }
            else
            {
            	console.log("No se encontro mensaje");
            }
        }
    });
}
module.exports = AlisDb;