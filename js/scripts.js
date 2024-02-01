'use strict'

console.log('Empieza el programa')

//Variables globales
var session="";
var agendaEventos={
  paginaAct:1,
  totalPages:0,
  tipoEvento:'',
  municipio:'',
  textoEvento:''
} ;

// Obtiene los tipos de evento
function cargarComboTipoEventos(){
  return fetch('https://api.euskadi.eus/culture/events/v1.0/eventType');
}

// Obtiene los municipios y carga en el combo
function cargarComboMunicipios(){
    $.ajax({
      url: "https://api.euskadi.eus/culture/events/v1.0/municipalities", 
      data:{_elements:300,_page:1},
	    success: function(result){
        console.log(result);
        for(var i=0;i<result.items.length;i++){
          $("#municipios").append("<option value='"+result.items[i].municipalityId+"'>"+result.items[i].nameEs+"</option>");
        }
        $("#municipios").val(agendaEventos.municipio).change();
      },
      
      error: function (xhr, ajaxOptions, thrownError) {
        $("#municipios").addClass(" border-danger text-danger")
        $('#municipios option:contains("Selecciona municipio...")').text('Error en la carga');
      }
  });
  }


  function limpiarPantallaYactivarSpinner(){
    var tableroHtml = document.getElementById("listaEventos");
    tableroHtml.innerHTML ='';
    $( "#buscar" ).prop("disabled", true);
    $( "#spiner" ).removeClass( "d-none" );
    $( "#listaEventos" ).addClass( "d-none" );
    $( "#divpagination" ).addClass( "d-none" );
  }

  function mostrarPantallaYdesactivarSpinner(){
    $( "#buscar" ).prop("disabled", false);
    $( "#spiner" ).addClass( "d-none" );
    $( "#listaEventos" ).removeClass( "d-none" );
  }

  function activarPaginacion(){
    $("#pagination").pagination({
      pages: agendaEventos.totalPages,
      itemsOnPage: 20,
      cssStyle: 'light-theme',
      currentPage:agendaEventos.paginaAct,
      prevText:"Anterior",
      nextText:"Siguiente",
      onPageClick:function(pagina){
        agendaEventos.paginaAct=pagina
 
        var tableroHtml = document.getElementById("listaEventos");
        tableroHtml.innerHTML ='';
        realizarPeticionEventos();
      }
    });
  }

  /**
   * Funcion para realizar la peticion de busqueda de eventos.
   */
  function realizarPeticionEventos(){
    limpiarPantallaYactivarSpinner()

    $.get("https://api.euskadi.eus/culture/events/v1.0/events/upcoming",{_elements:20,_page:agendaEventos.paginaAct,type:agendaEventos.tipoEvento,municipalityNoraCode:agendaEventos.municipio,description:agendaEventos.textoEvento},
    function(response){
      if(response.items.length>0){
        for (var i=0;i<response.items.length;i++){
          pintarEvento(response.items[i]);
        }
        agendaEventos.totalPages=response.totalPages;
       
        $(".evento").on('click', function(event,e){
          localStorage.setItem("filtroEventos",JSON.stringify(agendaEventos));
          window.location.href = './vista/detalle.html?id='+event.currentTarget.dataset.columns;
        });

        $( ".card" ).hover(
          function() {
            $( this ).addClass( "text-white bg-info " );
          }, function() {
            $( this ).removeClass( "text-white bg-info " );
          }
        );
        
        $(".card").on('click', function(event,e){
          localStorage.setItem("filtroEventos",JSON.stringify(agendaEventos));
          window.location.href = './vista/detalle.html?id='+event.currentTarget.dataset.columns;
        });

        $( "#divpagination" ).removeClass( "d-none" );
      }else{
        var tableroHtml = document.getElementById("listaEventos");
        tableroHtml.innerHTML +='';
        tableroHtml.innerHTML +='<div class="col-lg-6 col-md-8 mx-auto"><span class="text-danger">Opps!</span><h1 class="text-light">No existen eventos para esa búsqueda</h1>   </div>';
      }
      mostrarPantallaYdesactivarSpinner();
      activarPaginacion();

    }).fail( function(error) {
        window.location.href = './vista/error.html';
    });
   }
  

/*
  Funcion para generar el html del evento
*/
function pintarEvento(evento){
  console.log(evento);
  var tableroHtml = document.getElementById("listaEventos");
  let urlImagen="./images/evento.jpg";
  if(evento.images.length>0){
    urlImagen=evento.images[0].imageUrl;
  }
  let fechaActual = new Date(evento.endDate);
  let opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  let tituloEvento= evento.nameEs.replace(/['"]+/g, '\'');
  
  //tableroHtml.innerHTML +='<div class="col"><div class="card shadow handPoint rounded-bottom" data-columns="'+evento.id+'"><img class="scale-with-grid rounded-top" title="'+tituloEvento+'" alt="'+tituloEvento+'" src="'+urlImagen+'"><div class="card-body"><small class="text-body-secondary">'+evento.typeEs+'</small><h2>'+evento.nameEs+'</h2><div class="d-flex justify-content-between align-items-center"><small class="text-body-secondary p-2">'+evento.municipalityEs +' '+fechaActual.toLocaleDateString('es-ES', opciones)+'</small></div></div></div></div>';

  //tableroHtml.innerHTML +='<div class="col"><div class="card shadow handPoint rounded-bottom" data-columns="'+evento.id+'"><img class="scale-with-grid rounded-top" title="'+tituloEvento+'" alt="'+tituloEvento+'" src="'+urlImagen+'"><div class="card-body"><span class="badge bg-secondary">'+evento.typeEs+'</span><h2>'+evento.nameEs+'</h2><div class="d-flex justify-content-between align-items-center"><span class="badge bg-success">'+evento.municipalityEs +' '+fechaActual.toLocaleDateString('es-ES', opciones)+'</span></div></div></div></div>';
  tableroHtml.innerHTML +='<div class="col"><div class="card shadow handPoint rounded-bottom" data-columns="'+evento.id+'"><img class="scale-with-grid rounded-top" title="'+tituloEvento+'" alt="'+tituloEvento+'" src="'+urlImagen+'"><div class="card-body"><span class="badge bg-secondary">'+evento.typeEs+'</span><h2>'+evento.nameEs+'</h2><div class="d-flex justify-content-between align-items-center"><small class="text-body-secondary p-2">'+evento.municipalityEs +' '+fechaActual.toLocaleDateString('es-ES', opciones)+'</small></div></div></div></div>';
}


// ------------------- MAIN ------------------------

$(document).ready(function(){
  //comprobamos si existe la sesion eventos
  session=$.cookie("eventos");
  if(session=='true'){
    // Si hay session comprobamos si tiene filtro aplicado
    let filtroEventos=localStorage.getItem("filtroEventos");
    if(null!=filtroEventos){
      agendaEventos=JSON.parse(filtroEventos)
      $('#textoEvento').val(agendaEventos.textoEvento)
    }
  }else{
    localStorage.removeItem("filtroEventos");
    $.cookie("eventos", true); 
  }

  cargarComboTipoEventos().then(response => { if (response.ok) {
          return response.json();
        }
        throw new Error('Se ha producido un error al obtener los tipos de evento');
      }).then(eventos=>{
          for(var i=0;i<eventos.length;i++){
            $("#tipoEventos").append("<option value='"+eventos[i].id+"'>"+eventos[i].nameEs+"</option>");
          }
          $("#tipoEventos").val(agendaEventos.tipoEvento).change();
      }).catch((error)=> {
        $("#tipoEventos").addClass(" border-danger text-danger")
        $('#tipoEventos option:contains("Selecciona tipo Evento...")').text('Error en la carga');
         console.log(error);
  });  

  cargarComboMunicipios();

  $( "#buscar" ).on( "click", function() {
        agendaEventos.tipoEvento=$('#tipoEventos').find(":selected").val();
        agendaEventos.municipio=$('#municipios').find(":selected").val();
        agendaEventos.textoEvento=$('#textoEvento').val();
        agendaEventos.paginaAct=1;
        var tableroHtml = document.getElementById("listaEventos");
        tableroHtml.innerHTML ='';
        realizarPeticionEventos()
  } );

  realizarPeticionEventos();

});

console.log('Acaba el programa')
