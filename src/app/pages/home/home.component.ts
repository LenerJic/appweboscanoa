import { Component } from '@angular/core';
import { EmpleadoI } from 'src/app/interfaces/EmpleadoInterface';
import { Tipo_Doc } from 'src/app/interfaces/Tipo_Doc';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  totalUsers: number = 0;
  totalClientes: number = 0;
  totalProductos: number = 0;
  idUser: number = 0;
  datoEmpleado: EmpleadoI;
  lstdocumento: Tipo_Doc[];

  constructor (private empleadoService: EmpleadoService,
               private clienteService: ClienteService,
               private productosService: ProductoService,
               private authService: AuthService,
               private docService: DocumentoService
               ) 
  {
    this.idUser = parseInt(this.authService.getUserid);
    
    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      this.totalUsers = data.result.length;
    });
    this.empleadoService.getEmpleado(this.idUser).subscribe((data:any)=>{
      this.datoEmpleado = data.result;
    });
    this.clienteService.getClients().subscribe((data:any)=>{
      this.totalClientes = data.result.length;
    });
    this.productosService.getProducts().subscribe((data:any)=>{
      this.totalProductos = data.result.length;
    });
    this.docService.getDocument().subscribe((data:any)=>{
      this.lstdocumento = data.result;
    });
  }
}
