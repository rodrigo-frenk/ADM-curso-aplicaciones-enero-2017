var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var clients = []


app.get('/', function(req, res){
   res.sendFile( __dirname + '/index.html')
});

io.on('connection', function(socket){
   console.log('a user connected');

   clients[socket.id] = {
      id: socket.id,
      nickname: "Sin Nombre"
   }

   // clients.push({
   //    id: socket.id,
   //    nickname: "Sin Nombre"
   // })

   io.emit('chat message', 'Nuevo Usuario: ' + socket.id );

   socket.on('disconnect', function(){
      console.log('user disconnected');
      io.emit('chat message', 'Salió el usuario: ' + socket.id );
   });

   socket.on('chat message', function(msg){

      console.log('message: ' + msg);

      var user = clients[ socket.id ];

      var displayText = user.nickname + ": " + msg

      io.emit('chat message', displayText );

   });

   socket.on('set nickname', function(msg){

      console.log('set nickname: ' + msg);

      var user = clients[ socket.id ];

      user.nickname = msg

   });

});




http.listen(3000, function(){
   console.log('listening on *:3000');
});
