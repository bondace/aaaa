var http = require('http').createServer(function(req, res){
	fs.readFile(__dirname + '/chat_index.html', function(err, data){
		res.end(data);
	})
}).listen(8888);
var io = require('socket.io').listen(http);
var fs = require('fs');
var connectionToDB = require('mysql').createConnection({
	host: 'localhost',
	user: 'root',
	database: 'chat'
});

io.on('connection', function(socket){
	connectionToDB.query('SELECT * FROM `log` ORDER BY `log`.`number` ASC', function(err, result){
		for(var i = 0; i < result.length; i++){
			if(result[i].message){
				io.to(socket.id).send({
					val:	result[i].message,
					sender:	result[i].name
				});
			}
			else{
				io.to(socket.id).emit('blob', {
					val:		result[i].blob,
					filename:	result[i].filename,
					filetype:	result[i].filetype,
					sender:		result[i].name
				});
			}
		}
	});
	
	socket.on('set name', function(name){
		socket.username = name.value;
	});
	
	socket.on('message', function(data){
		io.send({
			val: data.val,
			sender: socket.username
		});
		connectionToDB.query('INSERT INTO `log`(`name`, `message`) VALUES(?, ?)',
					[socket.username, data.val], error);
	});
	
	socket.on('blob', function(data){
		io.emit('blob', {
			val:		data.val,
			filename:	data.filename,
			filetype:	data.filetype,
			sender:		socket.username
		});
		connectionToDB.query('INSERT INTO `log`(`name`, `filename`, `filetype`, `blob`) VALUES(?, ?, ?, ?)',
					[socket.username, data.filename, data.filetype, data.val], error);
	});
	
	function error(err){
		if(err){
			console.error('error');
			return;
		}
	}
});