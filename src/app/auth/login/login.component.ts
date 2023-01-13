import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  loginData = {
    userName: '',
    password: ''
  };
  cargando: boolean = false;

  constructor(private authservice: AuthService,
              private router: Router,
              private messageService: MessageService) { }

  login(){
    this.cargando = true;
    this.authservice.login(this.loginData).subscribe((data:any) => {
      localStorage.setItem('userId', data.result[0].id);
      localStorage.setItem('userName', data.result[0].nombres);
      localStorage.setItem('token_value', data.token.token);
      localStorage.setItem('tipoEmpleado', data.result[0].tipoEmpleado);
      localStorage.setItem('sb|sidebar-toggle', 'false')
      
      let user_rol = this.authservice.rolUser.toLowerCase();
      
      if (user_rol === 'administrador') {
        this.router.navigate(['/admin']);
      } else if(user_rol === 'almacenero') {
        this.router.navigate(['/almacenero']);
      } else if(user_rol === 'vendedor') {
        this.router.navigate(['/vendedor']);
      } else {
        this.router.navigate(['/not-found']);
      }
      this.cargando=false;
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