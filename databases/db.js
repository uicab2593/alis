var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('alisdb'),
AlisDb = {};
 
AlisDb.createTables = function()
{
	db.run("DROP TABLE IF EXISTS Messages");
	db.run("CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, creation DATETIME)");
	console.log("La tabla mensajes ha sido correctamente creada");
}
 
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