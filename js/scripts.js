'use strict'
// Funcion para agretar ficheros js 

console.log('Empieza el programa')
//const now = new Date();
var session="";
var agendaEventos={
  paginaAct:1,
  totalPages:0,
  tipoEvento:'',
  municipio:''
  //,
  //anoFiltro:now.getFullYear(),
  //mesFiltro:now.getMonth()+1,
  //diaFiltro:now.getDate()
} ;


function cargarComboTipoEventos(){
  return fetch('https://api.euskadi.eus/culture/events/v1.0/eventType');
}

function cargarComboMunicipios(){
    $.ajax({url: "https://api.euskadi.eus/culture/events/v1.0/municipalities", 
      data:{_elements:300,_page:1},
	    success: function(result){
        console.log(result);
        for(var i=0;i<result.items.length;i++){
          $("#municipios").append("<option value='"+result.items[i].municipalityId+"'>"+result.items[i].nameEs+"</option>");
        }
    }});
  }

  function limpiarPantallaYactivarSpinner(){
    var tableroHtml = document.getElementById("listaEventos");
    tableroHtml.innerHTML ='';
    $( "#spiner" ).removeClass( "d-none" );
    $( "#listaEventos" ).addClass( "d-none" );
    $( "#divpagination" ).addClass( "d-none" );
  }

  function mostrarPantallaYdesactivarSpinner(){
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

  function realizarPeticionEventos(){
    limpiarPantallaYactivarSpinner()

    $.get("https://api.euskadi.eus/culture/events/v1.0/events/upcoming",{_elements:20,_page:agendaEventos.paginaAct,type:agendaEventos.tipoEvento,municipalityNoraCode:agendaEventos.municipio},
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
        tableroHtml.innerHTML +='<div class="col-lg-6 col-md-8 mx-auto"><span class="text-danger">Opps!</span><h1 class="fw-light">No existen eventos para esa búsqueda</h1>   </div>';
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
  var tableroHtml = document.getElementById("listaEventos");
  let urlImagen="./images/evento.jpg";
  if(evento.images.length>0){
    urlImagen=evento.images[0].imageUrl;
  }
  let fechaActual = new Date(evento.endDate);
  let opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  tableroHtml.innerHTML +='<div class="col"><div class="card shadow-sm handPoint" data-columns="'+evento.id+'"><img class="scale-with-grid" title="'+evento.nameEs+'" alt="'+evento.nameEs+'" src="'+urlImagen+'"><div class="card-body"><small class="text-body-secondary">'+evento.typeEs+'</small><h2>'+evento.nameEs+'</h2><div class="d-flex justify-content-between align-items-center"><small class="text-body-secondary p-2">'+evento.municipalityEs +' '+fechaActual.toLocaleDateString('es-ES', opciones)+'</small></div></div></div></div>';
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
    }
  }else{
    localStorage.removeItem("filtroEventos");
    $.cookie("eventos", true); 
  }

  cargarComboTipoEventos().then(response => response.json()).then(eventos=>{
    for(var i=0;i<eventos.length;i++){
      $("#tipoEventos").append("<option value='"+eventos[i].id+"'>"+eventos[i].nameEs+"</option>");
    }
    $("#tipoEventos").val(agendaEventos.tipoEvento).change();
  });  

  cargarComboMunicipios();

  $( "#buscar" ).on( "click", function() {
        agendaEventos.tipoEvento=$('#tipoEventos').find(":selected").val();
        agendaEventos.municipio=$('#municipios').find(":selected").val();
        agendaEventos.paginaAct=1;
        var tableroHtml = document.getElementById("listaEventos");
        tableroHtml.innerHTML ='';
        realizarPeticionEventos()
  } );

  realizarPeticionEventos();

});

console.log('Acaba el programa')
