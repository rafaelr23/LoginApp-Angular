import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
//import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  usuario:UsuarioModel;
  Swal = require('sweetalert2');
  recordar:boolean = false;

  constructor( private http:HttpClient,
                private auth:AuthService,
                private router:Router
                ) { 
    this.usuario = new UsuarioModel
  }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }
  }
onSubmit(form:NgForm){
  if(form.valid === false){
      return
  }
  
  this.Swal.fire({
    allowOutsideClick:false,
      icon:'info',
      text:'Espere por favor...'
  })

  this.Swal.showLoading()

  this.auth.logIn(this.usuario).subscribe( resp =>{

    console.log(resp);
    this.Swal.close()
    if(this.recordar){
        localStorage.setItem('email',this.usuario.email);
    }

    this.router.navigateByUrl('/home');

  },(err)=>{

    console.log({
      error:err.error.error.message
    });

    this.Swal.fire({
        icon:'error',
        text: err.error.error.message
        
    })

  });
}
}
