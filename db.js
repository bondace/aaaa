var mysql = require('mysql');

var connection = mysql.createConnection({
	host :		'localhost',
	user :		'root',
	database :	'chat'
});

connection.connect(function(err){
	if(err){
		console.error(err);
	}
});

connection.query('SELECT * FROM message', function(err, result){
	if(err){
		console.error('error');
		return;
	}
	console.log(result[2].name);
	console.log(result[2].text);
});

connection.end();