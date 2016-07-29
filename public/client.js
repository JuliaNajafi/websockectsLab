document.addEventListener("DOMContentLoaded", function(){
  var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  };

  var canvas = document.getElementById('drawing');
  var context = canvas.getContext('2d');
  var width = window.innerWidth;
  var height = (window.innerHeight)/2;
  var socket = io();

  canvas.width = width;
  canvas.height = height;

  canvas.onmousedown = function(e){
    mouse.click = true;
  };
  canvas.onmouseup = function(e){
    mouse.click = false;
  };

  canvas.onmousemove = function(e){
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    mouse.move = true;
  };

  socket.on('draw_line', function(data){
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x *width, line[1].y * height);
    context.stroke();
  });

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev){
      socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev]});
      mouse.move = false;
    }
    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 25);
  }

  mainLoop();



  $('form').submit(function(){
    socket.emit('send:message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('posting:message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });




}) //end of doc loaded
