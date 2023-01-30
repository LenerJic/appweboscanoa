import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmpleadoI } from 'src/app/interfaces/EmpleadoInterface';
import { Tipo_Doc } from 'src/app/interfaces/Tipo_Doc';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pipe = new DatePipe('es-PE');

  totalUsers: number = 0;
  totalClientes: number = 0;
  totalProductos: number = 0;
  lowStockProducts: number = 0;
  outofStockProducts: number = 0;
  totalVentas: number = 0;
  totalVentasHoy: number = 0;
  idUser: number = 0;
  datoEmpleado: EmpleadoI;
  lstdocumento: Tipo_Doc[] = [];
  lstcategorias: any[] = [];
  lstlowStock: any[] = [];
  lstoutofStock: any[] = [];
  tipoDocumento: string;

  PasswordForm: FormGroup;
  valorUsuario:string;
  cargando: boolean = false;
  deshabilitar: boolean = false;
  icon_lock: boolean = false;

  constructor (
    private empleadoService: EmpleadoService,
    private clienteService: ClienteService,
    private categoriaService: CategoriaService,
    private productosService: ProductoService,
    private ventasService: VentaService,
    private authService: AuthService,
    private docService: DocumentoService,
    private messageService: MessageService,
    private exportPdf: ExportarPdfService,
    private fb: FormBuilder
  ) { }
  
  ngOnInit() {
    this.idUser = parseInt(this.authService.getUserid);
    
    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      this.totalUsers = data.result.length;
    });
    this.clienteService.getClients().subscribe((data:any)=>{
      this.totalClientes = data.result.length;
    });
    this.categoriaService.getCategories().subscribe((data:any)=>{
      this.lstcategorias = data.result;
    });
    this.productosService.getProducts().subscribe((data:any)=>{
      this.totalProductos = data.result.length;
      for (const product of data.result) {
        if (product.stock < 10 && product.estado) {
          ++this.lowStockProducts;
          this.lstlowStock.push(product);
        } else if (!product.estado) {
          ++this.outofStockProducts;
          this.lstoutofStock.push(product)
        }
      }
    });
    this.ventasService.getVentas().subscribe((data:any)=>{
      this.totalVentas = data.result.length;
      for (const venta of data.result) {
        let fechaVenta = this.pipe.transform(venta.fecha, 'dd/MM/yyyy'),
            fechaHoy = this.pipe.transform(new Date(), 'dd/MM/yyyy');
        if (fechaVenta === fechaHoy) {
          ++this.totalVentasHoy;
        }
      }
    });
    // Ventas - falta
    this.docService.getDocument().subscribe((data:any)=>{
      this.lstdocumento = data.result;
      this.empleadoService.getEmpleado(this.idUser).subscribe((dat:any)=>{
        this.datoEmpleado = dat.result;
        this.tipoDocumento = this.lstdocumento?.find((tipo:any)=>tipo.id === this.datoEmpleado.tipoDocumento)?.nombre+':' ?? 'Documento:';
        this.valorUsuario = dat.result.nroDocumento;
      });
    });
    
    this.PasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  get password() { return this.PasswordForm.get('password') }
  get passwordConfirm() { return this.PasswordForm.get('passwordConfirm') }

  onSubmit(){
    this.cargando = true;
    let formData = this.PasswordForm.value;
    let newdata = {
      userName: this.valorUsuario,
      password: formData.password
    }
    this.authService.changePassword(newdata).subscribe((data:any)=>{
      this.messageService.add({
        severity:'success',
        summary: 'Completado!',
        detail: data.displayMessage
      });
      this.cargando=false;
    });
    this.PasswordForm.reset();
    this.clickEvent();
  }
  validarPassword(form:FormGroup){
    let datos = form.value;
    if(datos.password === datos.passwordConfirm){
      return true;
    }else{
      return false;
    }
  }
  lowStockExport(){
    this.convertpdf('Productos con Bajo Stock', this.lstlowStock);
  }
  outofStockExport(){
    this.convertpdf('Productos Sin Stock', this.lstoutofStock);
  }
  clickEvent(){
    this.icon_lock = !this.icon_lock;
    if(this.deshabilitar){
      this.deshabilitar = false;
    }else{
      this.deshabilitar = true;
    };
  }
  convertpdf(title: string, datos:any){
    let fechaHoy = this.pipe.transform(new Date(), 'dd/MM/yyyy hh:mm a','UTC-5');
    const titulo = `${title} \n ${fechaHoy}`,
      encabezado = ["COD", "Nombres", "Categoria", "Stock", "P. Compra", "P. Venta", "Ultimo Registro", "Estado"],
      numberFormat = new Intl.NumberFormat('es-PE',{
        style: 'currency',
        currency: 'PEN',
      });
    const cuerpo = Object(datos).map(
      (obj:any)=>{
        const datos = [
          obj.id,
          obj.nombre,
          this.lstcategorias.find((categoria:any)=>categoria.id === obj.categoria)?.nombre ?? 'Categoria no registrado',
          obj.stock,
          numberFormat.format(obj.precioCompra),
          numberFormat.format(obj.precioVenta),
          obj.fecha = this.pipe.transform(obj.fecha, 'dd/MM/yyyy'),
          (obj.estado && obj.stock >= 10) ? 'Con Stock' :
          (obj.estado && obj.stock < 10) ? 'Bajo Stock' :
          (!obj.estado) ? 'Sin Stock' : ''
        ]
        return datos;
      }
    )
    this.exportPdf.imprimir(encabezado, cuerpo, titulo, true);
  }
}
