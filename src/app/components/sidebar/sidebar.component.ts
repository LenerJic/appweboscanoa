import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { navbarAdmin } from './data/admin-nav-data';
import { navbarAlmacenero } from './data/almacenero-nav-data';
import { navbarVendedor } from './data/vendedor-nav-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navData = navbarAdmin;
  navAlmacen = navbarAlmacenero;
  navVendedor = navbarVendedor;
  rolUsuario = 'rol';

  constructor(public auth: AuthService) {
    this.rolUsuario = auth.rolUser.toLowerCase();
  }
}
