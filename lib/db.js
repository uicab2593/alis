var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database(__dirname+'/../databases/alisdb'),
AlisDb = {};
 
AlisDb.insertMessage = function(message,callback)
{
    var dateVal = new Date();
	stmt = db.prepare("INSERT INTO messages (id,message,date) VALUES (?,?,?)");
    stmt.run(null,message,dateVal.toLocaleString());
    stmt.finalize();
    callback();
} 
AlisDb.getMessages = function(callback)
{
    db.all("SELECT * FROM messages", function(err, rows) {
        if(err) throw err;
        var messages = [];
        for(var i in rows){
            //console.log("Mensaje:"+rows[i].message);
            messages.push(rows[i].message);
        }
        callback(messages);
    });
}
AlisDb.getMessagesLimit = function(lastIdMessage,limit,callback)
{
    console.log("LAST ID MSG:"+lastIdMessage);
    stmt = db.prepare("SELECT * FROM messages WHERE ID > ? ORDER BY ID LIMIT ?");
    stmt.bind(lastIdMessage,limit);
    stmt.all(function(error, rows)
    {
        var messages = [];
        if(error) throw err;                
        if(rows) messages = rows;
        console.log("Resultado:");
        console.log(messages);
        callback(messages);
    }); 
    stmt.finalize();   
}
AlisDb.getMessageId = function(message,callback)
{    
    var messageId =null;
    stmt = db.prepare("SELECT * FROM messages WHERE message = ?");
    stmt.bind(message); 
    stmt.get(function(error, row)
    {   
        if(error) throw err;                
        if(row) messageId = row.id;            
        callback(messageId);
    }); 
    stmt.finalize();   
}
AlisDb.getMessage = function(messageId,callback)
{    
    var message =null;    
    stmt = db.prepare("SELECT * FROM messages WHERE id = ?");
    stmt.bind(messageId); 
    console.log("db: messageid:"+messageId);
    stmt.get(function(error, row)
    {
        if(error) throw err;                
        if(row) message = row.message;            
        console.log("db: message:"+message);
        callback(message);
    }); 
    stmt.finalize();   
}
AlisDb.deleteMessage = function(msgId,callback)
{
    console.log("DB: eliminado"+msgId);
    stmt = db.prepare("DELETE FROM messages WHERE ID = ?")
    stmt.run(msgId);     
    stmt.finalize();    
    callback();
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
AlisDb.getHistory = function(offset,callback)
{
	db.all("SELECT * FROM History ORDER BY date DESC LIMIT 10 OFFSET "+offset, function(err, rows) {
		if(err) throw err;
		callback(rows);
	});
}
AlisDb.saveInHistory = function(msg,callback){
    db.serialize(function(){
        stmt = db.prepare("INSERT INTO History (message) VALUES (?)");
        stmt.run(msg);
        stmt.finalize();
    });
    callback();
}
AlisDb.addTelegramContact = function(name,idChat,callback){
    db.serialize(function(){
        stmt = db.prepare("INSERT INTO TelegramContacts (name,idChat) VALUES (?,?)");
        stmt.run(name,idChat);
        stmt.finalize();
    });
    callback();    
}
AlisDb.updateTelegramContact = function(id,name,idChat,callback){
    db.serialize(function(){
        stmt = db.prepare("UPDATE TelegramContacts SET name = ?, idChat = ? WHERE id = ?");
        stmt.run(name,idChat,id);
        stmt.finalize();
    });
    callback();
}
AlisDb.deleteTelegramContact = function(id,callback){
    db.serialize(function(){
        stmt = db.prepare("DELETE FROM TelegramContacts WHERE id = ?");
        stmt.run(id);
        stmt.finalize();
    });
    callback();
}
AlisDb.getTelegramContacts = function(callback)
{
    db.all("SELECT * FROM TelegramContacts", function(err, rows) {
        if(err) throw err;
        callback(rows);
    });
}
AlisDb.getSettings = function(callback)
{
    db.all("SELECT * FROM Settings", function(err, rows) {
        if(err) throw err;
        var sets = {};
        for(var i in rows) sets[rows[i].tag] = rows[i].value;
        callback(sets);
    });
}
AlisDb.updateSettings = function(settings,callback)
{
    db.serialize(function(){
        stmt = db.prepare("UPDATE Settings SET value = ? WHERE tag = ?");
        for(var tag in settings) stmt.run(settings[tag],tag);
        stmt.finalize();
    });
    callback();
}
module.exports = AlisDb;