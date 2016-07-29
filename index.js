var express= require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
  console.log("connected")
});

var line_history = [];


io.on('connection', function(socket){
  // socket.join('pictionary');
  // var clients = io.sockets.clients('pictionary')


  // socket.on('room', function(room) {
  //       socket.join(room);
  //       var clients = io.sockets.clients(room)
  //       console.log(clients)
  //   });

  for (var i in line_history){
    socket.emit('draw_line', {line: line_history[i] } );
  }

  socket.on('draw_line', function(data){
    line_history.push(data.line);
    io.emit('draw_line', {line: data.line});
  });

  socket.on('send:message', function(msg){
    console.log(msg)
    io.emit('posting:message', msg);
  });



});




http.listen(3000, function(){
  console.log('listening on *:3000');
});
