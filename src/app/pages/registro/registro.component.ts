import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario:UsuarioModel;
  Swal=require('sweetalert2');
  recordar:boolean = false;

  constructor(private auth:AuthService,
              private router:Router) { }
  
  ngOnInit() {
    this.usuario          = new UsuarioModel
   }

onSubmit(RegForm:NgForm){
  if(RegForm.valid === false){
      return
  }

  this.Swal.fire({
    allowOutsideClick:false,
      icon:'info',
      text:'Espere por favor...'
  })

  this.Swal.showLoading()

  this.auth.nuevoUsuario(this.usuario).subscribe(resp =>{

    console.log(resp);
    this.Swal.close();

    if(this.recordar){
      localStorage.setItem('email',this.usuario.email);
    }
    this.router.navigateByUrl('/home');

  }, (err) =>{

    console.log({
      error:err.error.error.message
    });

    this.Swal.fire({
        icon:'error',
        text: err.error.error.message
    })

  })
}
}
