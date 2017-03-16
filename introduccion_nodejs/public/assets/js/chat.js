// Variables globales para cada cliente

   var socket = io()

   var currentActiveUsers

   var targetUserId

   var targetConversationId

   var conversations = []

   var currentConversation

   var userConversations = {}

   var username

   // Interacciones de usuario

   $('#login-window').submit(function(){

      username = $('#login-window input[type="text"]').val()

      var shouldDoLogin = true

      $('#login-window .warning:not(.hidden)').addClass('hidden')

      if( username === "" ) {
         // avisar al usuario que debe corregir nombre vacio
         $('#login-warning-empty').removeClass('hidden')
         shouldDoLogin = false
      }

      if( ! isNameAvailable(username) ) {
         // avisar al usuario que debe corregir nombre duplicado
         $('#login-warning-duplicated').removeClass('hidden')
         shouldDoLogin = false
      }


      if(shouldDoLogin) {

         var payload = {
            id: socket.id,
            message: username
         }

         socket.emit('set username', payload )


         $('#chat-window header h6').html( username )

         $('#login-window').fadeOut(300, function(){

            $('#chat-window').fadeIn(300)

         })

      }

      return false;

   });

   $('#message-form').submit(function(){

      message = $('#message').val()

      var messageObject = {
         username: username,
         message: message,
         date: new Date()
      }

      var payload = {
         user_id: socket.id,
         conversation_id: targetConversationId,
         message: messageObject
      }



      socket.emit('chat message', payload )

      $('#message').val('')

      return false

   });



   $('#new-conversation').submit(function(){
      conversationName = $('#new-conversation input[name=conversation-name]').val()
      var payload = {
         creator: socket.id,
         name: conversationName
      }

      socket.emit( 'new conversation', payload )

   });




   // selector entre paneles users y conversations en movil

   $('#users-conversations-selector button').click(function(){

      var target = $(this).data('target')
      selector = '#'+target

      if( $(selector).length > 0 ) {
         $(selector).removeClass('hidden-xs').siblings().addClass('hidden-xs')
      }

   })





   // Funciones que responderán a socket.io

   socket.on('chat message', function(payload){

      printMessage({
         date: new Date(),
         username: currentActiveUsers[ payload.sourceId ].username,
         text: payload.message
      }, 'chat-message' )

   });




   socket.on('user list changed', function(payload) {

      currentActiveUsers = payload.activeUsers

      $('#users ul .user:not(.model)').remove()

      for(i in currentActiveUsers) {

         var userHtml = $('.user.model').clone().detach()

         userHtml.find('.username').html( currentActiveUsers[i].username )

         userHtml.attr( 'data-id', currentActiveUsers[i].id )

         userHtml.removeClass('hidden model')

         userHtml.appendTo('#users ul')

      }

      setupUserClick()

   })

   socket.on('user login', function(payload) {

      printMessage({
         nodate: new Date(),
         username: payload.username,
         text: 'Entró al chat.'
      }, 'notification' )

   })

   socket.on('user logout', function(payload) {

      printMessage({
         date: new Date(),
         username: payload.username,
         text: 'Salió del chat.'
      }, 'notification' )

   })



   socket.on('update conversation', function(payload) {
      console.log("update!!!");
      updateConversation( payload.conversation )

   })


   socket.on('update conversations', function(payload) {

      for( i in payload.conversations ) {
      console.log(payload.conversations )
         updateConversation( payload.conversations[i] )
      }

      // if( typeof(targetConversationId) === "undefined" ) {
      //    targetConversationId =
      // }

      $('#conversations ul .conversation:not(.model)').remove()


      for(i in payload.conversations) {
         var conversationHtml = $('.conversation.model').clone().detach()

         conversationHtml.find('.name').html(
            payload.conversations[i].name
         )

         conversationHtml.find('.number-users').html(
            payload.conversations[i].participants.length
         )

         conversationHtml.attr( 'data-id', i )

         conversationHtml.removeClass('hidden model')


         conversationHtml.appendTo('#conversations ul')

      }

      setupConversationClick()

   })


   socket.on('set conversation', function( payload ) {

      targetConversationId = payload.id

      openConversation( userConversations[targetConversationId] )



   })



   function printMessage( message, cssClasses ) {

      newMessage = $('#messages .message.model').clone().detach()

      newMessage.find('.datetime').html( message.date )
      newMessage.find('.username').html( message.username )
      newMessage.find('.message-text').html( message.text )

      newMessage.addClass( cssClasses )

      newMessage.removeClass('model hidden')

      newMessage.appendTo('#messages ul')

   }






   function setupUserClick() {
      // clicar un usuario para abrir conversación con él
      $('#users .user').click(function(){
         // obtener su ID a partir de atributo 'data-id' del 'li' clicado

         targetUserId = $(this).data('id')

         console.log( "selected:", targetUserId )

         // al abrir conversación con usuario
         // marcar mensajes como Leidos
         // mostrar los mensajes previos con ese usuario
      })

   }

   function setupConversationClick() {

      // clicar un usuario para abrir conversación con él

      $('#conversations .conversation').click(function(){
         // obtener su ID a partir de atributo 'data-id' del 'li' clicado

         $(this).addClass('active')
         .siblings().removeClass('active')


         targetConversationId = $(this).data('id')

         openConversation( userConversations[ targetConversationId ] )


      })

   }

   $('#button-group-chat').click(function(){
      targetUserId = undefined;
   })

   // si recibimos mensaje de un usuario
      // si tenemos la ventana de ese usuario abierta
         // mostrar mensaje en ventana
      // de otro modo,
         // aumentar numero de mensajes no leidos de ese usuario en la lista de usuarios



   function isNameAvailable(username) {

      var available = true

      for( i in currentActiveUsers ) {
         if( username === currentActiveUsers[i].username ) {

            available = false

            // si ya encontramos uno, interrumpir la iteracion

            break

         }
      }

      return available

   }


   function openConversation( conversation ) {

      var messages = conversation.messages

      $('#messages ul .message:not(.model)').remove()


      for( i in messages ) {

         // console.log(userConversations[conversation.id].messages);

         printMessage({
            date: messages[i].date,
            username: messages[i].username,
            text: messages[i].message
         }, 'message' )

      }

      for( i in userConversations[ conversation.id ].messages ) {
         userConversations[ conversation.id ].messages[i].viewed = true
      }

      $('#conversations .conversation[data-id='+conversation.id+']')
      .find('.number-new-messages').html('0')



   }




   function updateConversation( conversation ) {

      if( !( conversation.id in userConversations )) {
         userConversations[conversation.id] = conversation
      }
      // console.log("conv", userConversations[conversation.id] );

         // crear copia del arreglo de mensajes
         localMessages = userConversations[ conversation.id ].messages.slice(0)
         //
         //
         // console.log("openConversation( conversation )", conversation.id)

         userConversations[ conversation.id ] = conversation

         var newMessagesNumber = 0

         if( targetConversationId === conversation.id ) {


            openConversation( conversation )



         } else {





               // copiar solo los mensajes nuevos desde la conversación del server
               serverMessages = conversation.messages


               for( i in serverMessages ) {
                  var isNew = true
                  for( j in localMessages ) {

                     if( serverMessages[i].id === localMessages[j].id ) {
                        if( localMessages[j].viewed ) {
                           userConversations[conversation.id].messages[i].viewed = true
                           isNew = false
                           break
                        }
                     }
                  }
                  if ( isNew ) {
                     userConversations[conversation.id].messages[i].viewed = false
                     newMessagesNumber++
                  }

               }

               $('#conversations .conversation[data-id='+conversation.id+']')
               .find('.number-new-messages').html(
                  newMessagesNumber
               )


         }


   }
