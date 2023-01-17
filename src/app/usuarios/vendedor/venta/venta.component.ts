import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClienteI } from 'src/app/interfaces/ClienteInterface';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit{

  idEmpleado: number;
  clientes: ClienteI[];
  filteredClientes: any[];
  selectedClient: any;

  nameCliente: string = '';
  surnamesCliente: string = '';
  correoCliente: string = '';
  celCliente: string = '';
  dirCliente: string = '';

  ventaForm: FormGroup;

  constructor(private authService: AuthService,
              private clienteService: ClienteService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.idEmpleado = parseInt(this.authService.getUserid);

    this.clienteService.getClients().subscribe((data:any)=>{
      this.clientes = data.result;      
    });

    this.ventaForm = this.fb.group({
      id: [0],
      idCliente: [0],
      idEmpleado: [this.idEmpleado],
      numeroBoleta: [0],
      montopago: [0],
      fecha: [new Date()],
    });
  }

  filterClient(event) {
    let filtered : any[] = [];
    let query = event.query;    
    for(let i = 0; i < this.clientes.length; i++) {
        let cliente = this.clientes[i];
        if (cliente.nroDocumento.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(cliente);
        }
    }
    this.filteredClientes = filtered;
  }

  datosCliente(limpiar: boolean = false){
    let datos = this.selectedClient;
    if (limpiar) {
      this.selectedClient = '';
      this.nameCliente = '';
      this.surnamesCliente = '';
      this.correoCliente = '';
      this.celCliente = '';
      this.dirCliente = '';
    } else {
      this.nameCliente = datos.nombres;
      this.surnamesCliente = datos.apellidoPat+' '+datos.apellidoMat;
      this.correoCliente = datos.correo;
      this.celCliente = datos.celular;
      this.dirCliente = datos.direccion;
    }
  }

  rellenarCeros(valor, ancho){
    let numberOutput = Math.abs(valor);
    let length_number = valor.toString().length;
    let zero = '0';

    if( ancho <= length_number ) {
      if ( valor < 0 ) {
        return ('-' + numberOutput.toString());
      } else {
        return numberOutput.toString();
      }
    } else {
      if ( valor < 0 ) {
        return ('-' + (zero.repeat(ancho - length_number)) + numberOutput.toString());
      } else {
        return ((zero.repeat(ancho - length_number)) + numberOutput.toString());
      }
    }
  }
}
