import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';






@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyB3eQFDIVwhpJT8TJ9plYI0GC_w11X0M_E';

  userToken:string='';
  //Crear Nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http:HttpClient) {
    this.leerToken();
    console.log(this.userToken);
      
   }
  logOut(){
    localStorage.removeItem('idToken');
  }
  logIn(usuario:UsuarioModel){
    const AUTHDATA ={
      email:usuario.email,
      password:usuario.password,
      nombre:usuario.nombre
    };
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,AUTHDATA
    ).pipe(
      map(res =>{
        console.log("Entro al Map");
        this.guardarToken(res['idToken']);
        return res;
      })
      );;
  }

  nuevoUsuario(usuario:UsuarioModel){
    const AUTHDATA ={
      email:usuario.email,
      password:usuario.password,
      nombre:usuario.nombre
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apiKey}`,AUTHDATA
    ).pipe(
      map(res =>{
        console.log("Entro al Map");
        this.guardarToken(res['idToken']);
        return res;
      })
      );
  }

  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('idToken',idToken);

    // fecha del token con 1 hora(3600) de expiracion
    let hoy:Date = new Date();
    hoy.setSeconds(3600);
    
    // Almacenamiento de Expiracion de Token
    localStorage.setItem('Expiracion',hoy.getTime().toString())
  }

  leerToken(){
    if(localStorage.getItem('idToken')){
      this.userToken = localStorage.getItem('idToken');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado():boolean{
    if(this.userToken.length < 2){
      return false;
    }

    const EXPIRA = Number(localStorage.getItem('Expiracion'));
    const EXPIRACION = new Date();
    EXPIRACION.setTime(EXPIRA);
    

    if(EXPIRACION > new Date()){
      return true
    }else{
      return false
    }

  }
}
