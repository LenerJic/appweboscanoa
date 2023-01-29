import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    userName: '',
    password: ''
  };
  cargando: boolean = false;

  constructor(private authservice: AuthService,
              private messageService: MessageService,
              private router: Router) { }

  login(){
    this.cargando = true;
    this.authservice.login(this.loginData).subscribe((data:any) => {
      if (data.token.userName !== this.loginData.password) {
        if (data.result[0].estado === true) {
          localStorage.setItem('userId', data.result[0].id);
          localStorage.setItem('userName', data.result[0].nombres);
          localStorage.setItem('token_value', data.token.token);
          localStorage.setItem('tipoEmpleado', data.result[0].tipoEmpleado);
          localStorage.setItem('sb|sidebar-toggle', 'false')
          
          let user_rol = this.authservice.rolUser.toLowerCase();
          
          if (user_rol === 'administrador') {
            this.router.navigate(['/admin']);
            this.cargando=false;
          } else if(user_rol === 'almacenero') {
            this.router.navigate(['/almacenero']);
            this.cargando=false;
          } else if(user_rol === 'vendedor') {
            this.router.navigate(['/vendedor']);
            this.cargando=false;
          } else {
            this.router.navigate(['/not-found']);
            this.cargando=false;
          }
        } else {
          this.messageService.add({
            severity:'error',
            summary: 'Error',
            detail: 'Su usuario no esta permitido ingresar'
          }); 
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
          this.cargando=false;
        }
      } else {
        this.router.navigate(['/changePassword']);
        this.cargando=false;
      }
    },
    (errorData) => {
      setTimeout(()=>{
        this.cargando = false;
        this.messageService.add({
          severity:'error',
          summary: 'Error',
          detail: errorData.error.displayMessage
        });        
      }, 1000)
    }); 
  }
}
