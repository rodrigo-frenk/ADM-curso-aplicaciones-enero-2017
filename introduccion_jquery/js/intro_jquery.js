// Función que se ejecuta al
// terminar de cargar el Documento

$(document).ready(function(){

   // jquery funciona con selectores. Son iguales que en CSS,
   // pero entre comillas


   // seleccionamos una etiqueta por su nombre:
   // creando así un objeto de Jquery:
   var cuerpo = $('body')

   // ahora podemos hacer algo con él:
   cuerpo.css({ backgroundColor: '#0bc1ed'});

   // seleccionar un elemento por su ID
   $('#cabecera').css({ backgroundColor: '#c1ed0b'});



   // CREANDO UN MENÚ CON jQuery
   // seleccionar el primer elemento de lista:

   var elementomenu = $('#cabecera ul li').first()

   // clonarlo y sumarlo a la lista:
   // NOTA: los métodos se pueden encadenar en jQuery
   elementomenu
   .clone()
   .appendTo( '#cabecera ul' )
   .html("Nuevo Elemento Menú")



   // interacción de usuario:


   $('body').click(function(){

      var r,g,b;

      // vamos a calcular tres componentes, entre 0 y 255

      // redondear hacia abajo:
      r = Math.floor( Math.random() * 255 );

      // redondear hacia arriba o abajo,
      // dependiendo de cuál está más cerca:
      g = Math.round( Math.random() * 255 );

      // redondear hacia arriba:
      b = Math.ceil( Math.random() * 255 );


      // "this" recibe el objeto con el que se interactúa,
      // en este caso, es 'body'

      // integramos manualmente (concatenamos)
      // un string de color rgba
      var stringDeColor = 'rgba(' + r + ',' + g + ',' + b + ',1 )'

      console.log( r, g, b, stringDeColor );

      $(this).css({ backgroundColor: stringDeColor })

   })

})
