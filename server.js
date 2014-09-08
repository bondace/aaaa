var http = require('http').createServer(function(req, res){
	fs.readFile(__dirname + '/chat_index.html', function(err, data){
		res.end(data);
	})
}).listen(8888);
var io = require('socket.io').listen(http);
var fs = require('fs');

io.on('connection', function(socket){
	socket.on('set name', function(name){
		socket.username = name.value;
	});
	
	socket.on('message', function(data){
		io.send({
			val: data.val,
			sender: socket.username
		});
	});
});