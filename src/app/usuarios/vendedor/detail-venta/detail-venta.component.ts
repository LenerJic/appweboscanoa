import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetalleVentaI } from 'src/app/interfaces/VentaInterface';
import { ClienteService } from 'src/app/services/cliente.service';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-detail-venta',
  templateUrl: './detail-venta.component.html',
  styleUrls: ['./detail-venta.component.scss']
})
export class DetailVentaComponent {
  detailDialog: boolean;
  detailsSales: DetalleVentaI[];
  detailSaleForm: FormGroup;

  lstClientes: any;
  lstEmpleados: any;

  constructor(
    private ventaService: VentaService,
    private detalleService: DetalleVentaService,
    private clienteService: ClienteService,
    private empleadoService: EmpleadoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exportarPdf: ExportarPdfService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      this.lstEmpleados = data.result;
      this.cargarData();
    });
    this.clienteService.getClients().subscribe((data:any)=>{
      this.lstClientes = data.result;
      this.cargarData();
    });
  }
  cargarData(){
    this.ventaService.getVentas().subscribe((data:any) => {
      this.detailsSales = data.result;
    });
  }
  getValue(e: any){
    return e.target.value ?? '';
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
