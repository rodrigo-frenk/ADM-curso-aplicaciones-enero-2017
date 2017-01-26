$(document).ready(function(){

   $('.imgLiquidFill').imgLiquid();

   $('.imgLiquidNoFill').imgLiquid({
      fill: false
   });

   $('.imgLiquidNoFillLeft').imgLiquid({
      fill: false,
      horizontalAlign: 'left'
   });


   $(window).resize(function(){

      squareH()

      verticalCenter('.caja')
      verticalCenter('.v-center')

   })

   // obligar a la ventana a ejecutar acción de resize

   $(window).trigger('resize')

   console.log("introducción maquetado lista")


})

function verticalCenter( selector ) {

   // Seleccionar Elementos a Centrar

   $( selector ).each(function(){

      // Seleccionar Cada uno
      elemento = $(this)

      // Conocer Altura de Contenedor

      altura_contenedor = elemento.height()

      // Conocer Altura Total de Elementos Hijos:

      // seleccionar hijos

      hijos = elemento.children()

      // empezamos a contar desde 0

      altura_elementos = 0

      // iterar por todos los hijos

      hijos.each(function(){

         // almacenar hijo en envariable para claridad

         hijo = $(this)

         // aumentamos altura total hijos

         altura_elementos += hijo.height()

      })


      // Calcular diferencia entre alturas

      diferencia = altura_contenedor - altura_elementos

      // Aplicar mitad de diferencia arriba de Elementos

      elemento.css({
         paddingTop: diferencia / 2
      })

   })

}

function squareH() {

   //1. seleccionar los cuadrados
   var items = $('.square-h')

   // 2. iterar por cada uno de ellos
   items.each(function(){

      // 3. almacenar cada cuadrado en una
      // variable para acceso fácil
      var cuadrado = $(this)

      // 4. obtener el ancho del cuadrado
      var ancho = cuadrado.width()

      // 5. modificar altura para que sea igual al ancho
      cuadrado.height( ancho )


   })



}
