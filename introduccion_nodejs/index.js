var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

// línea necesaria para poder servir recursos desde nuestro HTML:

// establecer el nombre de una locacion, y mapearla al directorio servido por express

app.use('/bower_components', express.static('bower_components') )

app.use('/assets', express.static('public/assets') )



var clients = []

var conversations = []

var groupChatId = 0

/*

conversation = {
   participants: [],
   messages: []
}


*/


app.get('/', function(req, res){
   res.sendFile( __dirname + '/views/index.html')
});




http.listen(3000, function(){
   console.log('listening on *:3000');
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


startGroupConversation()


io.on('connection', function(socket){

   console.log('a user connected');

   // almacenaremos el nuevo cliente usando su ID de socket como índice
   clients[socket.id] = {
      socket: socket,
      id: socket.id,
      username: "Sin Nombre",
      loginComplete: false,
      lastLogin: new Date(),
      conversations: []
   }

   userListChanged()



   socket.on('disconnect', function(){
      userLogout(socket)
      userListChanged()
   });

   socket.on('set username', function(payload){

      clients[socket.id].username = payload.message
      clients[socket.id].loginComplete = true

      userLogin(socket)
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

      // Verificar si el emisor especificó un destino:
      // esto lo haremos revisando si la variable tiene un valor asignado
      if(typeof( payload.targetId ) === "undefined") {

         // si no, mandó un mensaje grupal

         console.log( "TYPEOF", typeof( payload.targetId ) )
         //
         io.emit('chat message', messagePayload )

      } else {

         //mesnaje privado
         // almacenar id del destinatario en el mensaje
         messagePayload.targetId = payload.targetId

         clients[ payload.targetId ].socket.emit('chat message', messagePayload )

      }



   });

});








function userListChanged() {

   // recuperar lista de todos los usuarios y meterla en un nuevo objeto
   var payload = {
      activeUsers: getActiveUsers()
   }

   io.emit('user list changed', payload)

}


function userLogin(socket) {

   addToConversation( groupChatId, socket.id )

   console.log( "conversation", conversations[groupChatId].participants )

   io.emit('user login', getUserPayload(socket))

}

function userLogout(socket) {


   // eliminar usuario de todas las conversaciones en las que esté

   oldConversations = clients[socket.id].conversations

   for( i in oldConversations ) {
      removeFromConversation( i, socket.id )
   }

   console.log( "conversation", conversations[groupChatId].participants )

   io.emit('user logout', getUserPayload(socket))

   delete clients[socket.id]

}



// funciones lógicas


function getUserPayload(socket) {

   var payload = {
      id: socket.id,
      username: clients[socket.id].username,
      // time: new Date()
   }

   return payload

}

function getActiveUsers() {

   var activeUsersList = {}

   // popular una nueva lista de clientes
   for( i in clients ) {

      if( clients[i].loginComplete ) {

         // preparar los datos relevantes
         var activeUser = {
            id: clients[i].id,
            username: clients[i].username,
         }


         // insertar cada usuario en el objeto
         activeUsersList[ clients[i].id ] = activeUser

      }

   }

   return activeUsersList

}


function startGroupConversation() {

   var newConversation = {
      participants: [],
      messages: [],
      startedAt: new Date()
   }

   conversations[ groupChatId ] = newConversation

}


function addToConversation( conversationId, userId ) {

   chosenConversation = conversations[ conversationId ]

   // buscar el usuario en la conversación
   chosenUserIndex = chosenConversation.participants.indexOf( userId )

   // si el usuario no está en la conversación, añádelo
   if( chosenUserIndex === -1 ) {
      chosenConversation.participants.push( userId )

      clients[ userId ].conversations.push( conversationId )
   }

}

function removeFromConversation( conversationId, userId ) {


   chosenConversation = conversations[ conversationId ]

   // buscar el usuario en la conversación
   chosenUserIndex = chosenConversation.participants.indexOf( userId )

   // si el usuario no está en la conversación, añádelo
   if( chosenUserIndex !== -1 ) {
      // sacar elemento del arreglo usando splice
      chosenConversation.participants.splice( chosenUserIndex, 1 )

      oldConversationIndex = clients[userId].conversations.indexOf( conversationId )

      if( oldConversationIndex !== -1 ) {
         clients[userId].conversations.splice( oldConversationIndex, 1 )
      }

      // eliminar conversaciones vacías, exceptuando la grupal:
      if(
         conversationId !== groupChatId
         &&
         conversations[conversationId].participants.length <= 0
      ) {
         delete conversations[conversationId]
      }

   }

}
