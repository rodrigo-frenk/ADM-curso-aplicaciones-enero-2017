var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

// línea necesaria para poder servir recursos desde nuestro HTML:

// establecer el nombre de una locacion, y mapearla al directorio servido por express

app.use('/bower_components', express.static('bower_components') )

app.use('/assets', express.static('public/assets') )



var clients = []


app.get('/', function(req, res){
   res.sendFile( __dirname + '/views/index.html')
});


// io es un gestor de conexiones:
// declararemos funcion "callback" a ejecutarse al conectarse un cliente

/*
// cada mensaje enviado por un usuario está
// estructurado en un Objeto así:


   payload = {
      id: id_de_socket,
      message: "..."
   }

*/

io.on('connection', function(socket){

   console.log('a user connected');

   clients[socket.id] = {
      socket: socket,
      id: socket.id,
      username: "Sin Nombre",
      lastLogin: new Date()
   }


   socket.on('set username', function(payload){

      clients[socket.id].username = payload.message

      userLogin(socket)
      userListChanged()
   });

   socket.on('disconnect', function(){
      userLogout(socket)
      userListChanged()
   });

   socket.on('chat message', function(payload){

      console.log('message: ' + payload.message);
      // obtener usuario a partir de la ID de la conexion:

      // debido a la naturaleza asincrónica de la app,
      // tendremos que detectar qué socket está activo
      // utilizando su Id y buscándola en nuestra lista

      targetId = 0

      var messagePayload = {
         sourceId: payload.id,
         message: payload.message
      }


      if(typeof( payload.targetId ) === "undefined") {

         console.log( "TYPEOF", typeof( payload.targetId ) )
         // mensaje grupal
         io.emit('chat message', messagePayload )

      } else {

         //mesnaje privado

         messagePayload.targetId = payload.targetId

         clients[ payload.targetId ].socket.emit('chat message', messagePayload )

      }



   });

});




http.listen(3000, function(){
   console.log('listening on *:3000');
});







function userListChanged() {

   // recuperar lista de todos los usuarios
   var activeUsers = getActiveUsers()

   var payload = {
      activeUsers: activeUsers
   }

   io.emit('user list changed', payload)

}


function userLogin(socket) {
   io.emit('user login', getUserPayload(socket))
}

function userLogout(socket) {

   io.emit('user logout', getUserPayload(socket))

   delete clients[socket.id]

}


function getUserPayload(socket) {

   var payload = {
      id: socket.id,
      username: clients[socket.id].username,
      time: new Date()
   }

   return payload

}


// funciones lógicas


function getActiveUsers() {

   var activeUsersList = {}

   // popular una nueva lista de clientes
   for( i in clients ) {

      // preparar los datos relevantes
      activeUser = {
         id: clients[i].id,
         username: clients[i].username,
      }


      // insertar cada usuario en el objeto
      activeUsersList[ clients[i].id ] = activeUser

   }

   return activeUsersList

}
