import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-boleta-venta',
  templateUrl: './boleta-venta.component.html',
  styleUrls: ['./boleta-venta.component.scss']
})


export class BoletaVentaComponent implements OnInit {

  idVenta: number;
  dataVenta: any;
  detailVenta: any[] = [];
  empleado: any;
  dataCliente: any;
  lstProductos:any;

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private detalleService: DetalleVentaService,
    private empleadoService: EmpleadoService,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) =>{
      const {params} = paramMap;
      if (params.id !== undefined) {
        this.idVenta = parseInt(params.id);
      };
      this.empleadoService.getEmpleados().subscribe((data:any)=>{
        let dataEmpleados = data.result;
        this.ventaService.getVenta(this.idVenta).subscribe((data:any)=>{
          this.dataVenta = data.result;
          for (const empleado of dataEmpleados) {
            if (empleado.id === this.dataVenta.idEmpleado) {
              this.empleado = empleado.nombres
            }
          }
        });
      });
      this.detalleService.getDetalleVentas().subscribe((data:any)=>{
        for (let detail of data.result) {
          if (detail.idVenta === this.idVenta) {
            this.detailVenta.push(detail);
          }
        }
      });
      this.productoService.getProducts().subscribe((data:any)=>{
        this.lstProductos = data.result;
      })
      this.ventaService.getVenta(this.idVenta).subscribe((data:any)=>{
        this.dataVenta = data.result;
        this.clienteService.getClient(this.dataVenta.idCliente).subscribe((data:any)=>{
          this.dataCliente = data.result;
        });
      });
    });    
  }
  rellenarCeros(valor, ancho){
    let numberOutput = Math.abs(valor);
    let length_number = valor?.toString().length;
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
