'use strict'
// Clase Usuario
class Usuario {
  constructor(id,nombre,apellido,usuario,contrasena) {
      this.id=id;
      this.nombre=nombre;
      this.apellido=apellido;
      this.usuario=usuario;
      this.contrasena=contrasena;
  }
  esContrasenaValida(contra){
    if(this.contrasena===contra){
      return true;
    }else{
      return false;
    }
  }
  toString() {
    return "<br>Socio numero "+this.id +": "+ this.nombre+" "+this.apellido+"<br>";
  }
}
