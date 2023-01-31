import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-report-sale',
  templateUrl: './report-sale.component.html',
  styleUrls: ['./report-sale.component.scss']
})
export class ReportSaleComponent implements OnInit {

  pipeDate = new DatePipe('es-PE');
  lstVentas: any[] = [];
  lstDetalles: any[] = [];
  lstSale: any[] = [];
  detailforproduct: any[] = [];
  reportefinal: any[] = [];
  lstClientes: any;
  lstEmpleados: any;
  lstProductos: any;
  minDate: Date;
  maxDate: Date;
  fechamax: Date;
  fecha1: Date;
  fecha2: Date;
  btn_pdf: boolean = true;
  
  constructor(
    private clienteService: ClienteService,
    private empleadoService: EmpleadoService,
    private productosService: ProductoService,
    private ventaService: VentaService,
    private detallesService: DetalleVentaService,
    private exportPdf: ExportarPdfService
  ){}

  ngOnInit(): void {
    this.minDate = new Date('2000-01-01');
    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      this.lstEmpleados = data.result;
      // this.cargarData();
    });
    this.clienteService.getClients().subscribe((data:any)=>{
      this.lstClientes = data.result;
      // this.cargarData();
    });
    this.productosService.getProducts().subscribe((data:any)=>{
      this.lstProductos = data.result;
      // this.cargarData();
    });
    this.ventaService.getVentas().subscribe((data:any)=>{
      this.lstVentas = data.result;
    });
    this.detallesService.getDetalleVentas().subscribe((data:any)=>{
      this.lstDetalles = data.result;
    });
  }

  filterDate(){
    this.lstSale = [];
    this.detailforproduct = [];
    this.reportefinal = [];
    let initDate = this.pipeDate.transform(this.fecha1, 'dd/MM/yyyy');
    let endDate = this.pipeDate.transform(this.fecha2, 'dd/MM/yyyy');
    for (const venta of this.lstVentas) {
      let filt = this.pipeDate.transform(venta.fecha, 'dd/MM/yyyy')
      if (filt >= initDate && filt <= endDate) {
        this.lstSale.push(venta);
      }
    }
    if (this.lstSale.length !== 0) {
      this.detailproduct(this.lstSale);
      this.btn_pdf = false;
    }else{
      this.btn_pdf = true;
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

  detailproduct(data: any){
    for (const venta of data) {
      for (const producto of this.lstDetalles) {
        if (venta.id === producto.idVenta) {
          this.detailforproduct.push(producto)
        }
      }
    }
  }

  reportData(){
    let datareport:any;
    for (const venta of this.lstSale) {
      for (const producto of this.detailforproduct) {
        if (venta.id === producto.idVenta) {
          datareport = {
            boleta: this.rellenarCeros(venta.numeroBoleta,6),
            vendedor: venta.idEmpleado,
            cliente: venta.idCliente,
            producto: producto.idMueble,
            cantidad: producto.cantidad,
            monto: producto.subtotal,
            fecha: venta.fecha
          }
          this.reportefinal.push(datareport);
        }
        datareport = {};
      }
    };
  }
  convertPdf() {
    this.reportData();
    const titulo = 'Reporte de Ventas',
      encabezado = ["Boleta", "Vendedor", "Doc. Cliente",
       "Producto", "Cantidad", "Monto", "Fecha"
      ],
      numberFormat = new Intl.NumberFormat('es-PE',{
        style: 'currency',
        currency: 'PEN',
      });
    const cuerpo = Object(this.reportefinal).map(
      (obj:any)=>{
        const datos = [
          obj.boleta,
          this.lstEmpleados.find((emp:any)=>emp.id === obj.vendedor)?.nombres ?? '',
          this.lstEmpleados.find((cli:any)=>cli.id === obj.cliente)?.nroDocumento ?? '',
          this.lstProductos.find((prod:any)=>prod.id === obj.producto)?.nombre ?? '',
          obj.cantidad,
          numberFormat.format(obj.monto),
          obj.fecha = this.pipeDate.transform(obj.fecha, 'dd/MM/yyyy')
        ]
        return datos;
      }
    )
    this.exportPdf.imprimir(encabezado, cuerpo, titulo, true);
  }
}
