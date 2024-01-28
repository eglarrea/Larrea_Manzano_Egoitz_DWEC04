'use strict'
// Clase Carta
class Carta {
  constructor(id,imagen) {
      this.id=id;
      this.imagen=imagen;
      this.imagen2="../images/carta.png"
  }

  render(id) {
    return "<div class='card carta ms-3 mt-3' data-target-id='"+id+"' style='width: 18rem;'> <img class='card-img-top' src='"+this.imagen2+"' > </div>";
  }
}
