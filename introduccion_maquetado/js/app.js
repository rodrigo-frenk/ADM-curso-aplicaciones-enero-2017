$(document).ready(function(){

   $('.imgLiquidFill').imgLiquid();

   $('.imgLiquidNoFill').imgLiquid({
      fill: false
   });

   $('.imgLiquidNoFillLeft').imgLiquid({
      fill: false,
      horizontalAlign: 'left'
   });

   console.log("introducción maquetado lista")

})
