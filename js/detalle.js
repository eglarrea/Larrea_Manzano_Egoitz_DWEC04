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

      const fechaIni = new Date(response.startDate);
      const fechaFin = new Date(response.endDate);
      
      let dia=fechaIni.getDate();
      let mes=fechaIni.getMonth()+1;
      let ano=fechaIni.getFullYear();
      let diaFin=fechaFin.getDate();
      let mesFin=fechaFin.getMonth()+1;
      let anoFin=fechaFin.getFullYear();

      if(response.startDate!=response.endDate){
      $('#fecha').text(dia+"/"+mes+"/"+ano+" - "+ diaFin+"/"+mesFin+"/"+anoFin  );
      }else{
        $('#fecha').text(dia+"/"+mes+"/"+ano );
      }
      
      if(response.hasOwnProperty('openingHoursEs')){
        $('#hora').text(response.openingHoursEs);
      }

      if(response.hasOwnProperty('descriptionEs')){
        $('#descripcion').html(response.descriptionEs);
      }else{
        $('#descripcion').text("No hay descripción para el evento");
      }

      $('#municipio').html(response.municipalityEs);
      
      $('#donde').text(response.establishmentEs);
     
      if(response.hasOwnProperty('placeEs')){
        $('#direccion').html(response.placeEs)
      }

      if(response.hasOwnProperty('purchaseUrlEs')){
        $('#entradas').append('<a class="btn bg-info" target="_blank" href="'+response.purchaseUrlEs+'" > Comprar </a>');
      }else{
        $('#entradas').text("No hay link para la comprar");
      }
     
      if(response.hasOwnProperty('sourceUrlEs')){
        $('#urlEvento').append('<a target="_blank" class="btn bg-info" href="'+response.sourceUrlEs+'" >Ver el evento</a>');
      }else{
        $('#urlEvento').text("No hay link para la url del evento");
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
