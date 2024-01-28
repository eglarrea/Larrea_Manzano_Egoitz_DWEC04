'use strict'
const queryString = window.location.search;const urlParams = new URLSearchParams(queryString);
const idEvento=urlParams.get('id')

if(null==idEvento || idEvento==''){
  window.location.href = '../index.html';
}



function obtenerEvento(){
    $.get("https://api.euskadi.eus/culture/events/v1.0/events/"+idEvento ,function (response){
  } ).done( function(response) {
      $('#tipoEvento').text(response.typeEs);
      $('#tituloEvento').text(response.nameEs);

      const d = new Date(response.startDate);
      $('#fecha').text(d.getDate()+"/"+d.getMonth()+1+"/"+d.getFullYear());
      if(response.hasOwnProperty('descriptionEs')){
        $('#descripcion').html(response.descripcionEs);
      }else{
        $('#descripcion').text("No hay descripción para el evento");
      }


      $('#municipio').html(response.municipalityEs);

      
      $('#donde').text(response.establishmentEs);
      if(response.hasOwnProperty('purchaseUrlEs')){
        $('#entradas').append('<a  target="_blank" href="'+response.purchaseUrlEs+'" > Comprar </a>');
      }else{
        $('#entradas').text("No link para la comprar");
      }

     
      if(response.hasOwnProperty('sourceUrlEs')){
        $('#urlEvento').append('<a target="_blank" href="'+response.sourceUrlEs+'" > Ver el evento </a>');
      }else{
        $('#urlEvento').text("No link para la url");
      }
      
     $('#precio').text(response.priceEs);
     if(response.images.length>0){
        $('#imagen').attr("src", response.images[0].imageUrl);
     }else{
      $('#imagen').attr("src", "../images/evento.jpg");
      
     }

     $('#compania').text(response.companyEs);
     
     $( "#spiner" ).addClass( "d-none" );
     $( "#detalle" ).removeClass( "d-none" );
  }).fail( function(respuesta) {
    window.location.href = 'error.html';
  });
    
   }

  $(document).ready(function(){
    obtenerEvento(); 
  })

console.log('Acaba el programa')
