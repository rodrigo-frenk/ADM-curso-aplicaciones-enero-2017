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

   })
   // obligar a la ventana a ejecutar acción de resize
   $(window).trigger('resize')

   console.log("introducción maquetado lista")


})


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
