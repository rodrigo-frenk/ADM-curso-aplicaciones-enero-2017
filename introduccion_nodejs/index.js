var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

// línea necesaria para poder servir recursos desde nuestro HTML:
app.use('/bower_components', express.static('bower_components') )

app.use('/assets', express.static('public/assets') )

var clients = []


app.get('/', function(req, res){
   res.sendFile( __dirname + '/views/index.html')
});


// io es un gestor de conexiones:
// declarar funcion "callback" a ejecutarse al conectarse un cliente

io.on('connection', function(socket){

   console.log('a user connected');

   clients[socket.id] = {
      id: socket.id,
      username: "Sin Nombre"
   }

   // enviar un mensaje a todos los clientes:
   io.emit('chat message', 'Nuevo Usuario: ' + socket.id );


   socket.on('disconnect', function(){
      console.log('user disconnected');
      io.emit('chat message', 'Salió el usuario: ' + socket.id );
   });

   socket.on('chat message', function(msg){

      console.log('message: ' + msg);
      // obtener usuario a partir de la ID de la conexion:
      var user = clients[ socket.id ];

      // construir un mensaje
      var displayText = user.username + ": " + msg

      // enviamos nuevo mensaje a todos los clientes
      io.emit('chat message', displayText );

   });

   socket.on('set username', function(msg){

      console.log('set username: ' + msg);

      var user = clients[ socket.id ];

      user.username = msg

   });

});




http.listen(3000, function(){
   console.log('listening on *:3000');
});
