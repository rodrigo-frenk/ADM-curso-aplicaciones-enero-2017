
   var socket = io()

   var currentActiveUsers

   var targetUserId


   var conversations = []

   var currentConversation

   var userConversations


   // Interacciones de usuario

   $('#login-window').submit(function(){

      var username = $('#login-window input[type="text"]').val()

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


      var payload = {
         id: socket.id,
         message: message
      }

      // si hay un usuario seleccionado, acompañar mensaje con ID de usuario destino

      if( typeof(targetUserId) != "undefined" ) {
         payload.targetId = targetUserId
      }

      socket.emit('chat message', payload )

      $('#message').val('')

      return false

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
         date: new Date(),
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


   socket.on('update conversations', function(payload) {
      console.log("UPDATE", payload)

      userConversations = payload.conversations

      $('#conversations ul .conversation:not(.model)').remove()

      for(i in userConversations) {
         var conversationHtml = $('.conversation.model').clone().detach()

         conversationHtml.find('.name').html( userConversations[i].name )

         conversationHtml.find('.number-users').html(
            userConversations[i].participants.length
         )

         conversationHtml.attr( 'data-id', i )

         conversationHtml.removeClass('hidden model')


         conversationHtml.appendTo('#conversations ul')

      }

      setupConversationClick()

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

         $(this).addClass('active').siblings().removeClass('active')


         targetConversationId = $(this).data('id')

         var messages = userConversations[ targetConversationId ].messages

         $('#messages ul .message:not(.model)').remove()

         for( i in messages ) {

            printMessage({
               date: messages[i].date,
               username: messages[i].username,
               text: messages[i].message
            }, 'message' )

         }

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
