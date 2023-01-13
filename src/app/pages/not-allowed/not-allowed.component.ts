import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.scss']
})
export class NotAllowedComponent {
  linkroluser = 'rol'
  constructor(private authService: AuthService) {
    let rol = authService.rolUser;
    if(rol === 'Administrador'){
      this.linkroluser = 'admin'
    } else if (rol === 'Almacenero'){
      this.linkroluser = 'almacenero'
    } else if (rol === 'Vendedor'){
      this.linkroluser = 'vendedor'
    }    
  }
}
