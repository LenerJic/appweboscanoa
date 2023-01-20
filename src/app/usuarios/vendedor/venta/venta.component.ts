import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClienteI } from 'src/app/interfaces/ClienteInterface';
import { ProductImgI } from 'src/app/interfaces/ProductInterface';
import { DetalleVentaI } from 'src/app/interfaces/VentaInterface';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductListDemo } from './ProductListDemo';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [DialogService]
})
export class VentaComponent implements OnInit, OnDestroy{

  idEmpleado: number;
  clientes: ClienteI[];
  lstproductos: ProductImgI[];
  filteredClientes: any[];
  selectedClient: any;
  tablaproducto: {
    id?: number;
    cantidad?: number;
    producto?: string;
    pUnit?: number;
    pTotal?: number;
  }[] = [];
  insertproducto: {
    id?: number;
    cantidad?: number;
    producto?: string;
    pUnit?: number;
    pTotal?: number;
  }[] = [];

  dataCliente = {
    id: 0,
    nombres: '',
    apellidoPat: '',
    apellidoMat: '',
    tipoDocumento: 0,
    nroDocumento: '',
    direccion: '',
    correo: '',
    celular: '',
  };
  datanull = this.dataCliente;

  ventaForm: FormGroup;
  detalleVentaForm: FormGroup;
  oneProduct: FormGroup;

  pruebaDetalle: DetalleVentaI[];

  procederVenta: boolean = false;
  btnelegido: boolean = true;

  constructor(public authService: AuthService,
              private clienteService: ClienteService,
              private productoService : ProductoService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private fb: FormBuilder) { }

  ref: DynamicDialogRef;

  ngOnInit() {
    this.idEmpleado = parseInt(this.authService.getUserid);

    this.clienteService.getClients().subscribe((data:any)=>{
      this.clientes = data.result;      
    });
    this.productoService.getProducts().subscribe((data:any)=>{
      this.lstproductos =data.result;
    });

    this.oneProduct = this.fb.group({
      id: [0],
      cantidad: [0],
      producto: [''],
      pUnit: [0],
      pTotal: [0]
    });
    this.detalleVentaForm = this.fb.group({
      id: [0],
      idVenta: [0],
      idMueble: [0],
      cantidad: [0],
      subtotal: [0]
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

  get cantidad() { return this.oneProduct.get('cantidad'); }
  get producto() { return this.oneProduct.get('producto'); }
  get pUnit() { return this.oneProduct.get('pUnit'); }
  get pTotal() { return this.oneProduct.get('pTotal'); }

  filterClient(event) {
    let filtered : any[] = [];
    let query = event.query;    
    for(let i = 0; i < this.clientes?.length; i++) {
        let cliente = this.clientes[i];
        if (cliente.nroDocumento.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(cliente);
        }
    }
    this.filteredClientes = filtered;
  }

  datosCliente(limpiar: boolean = false){
    if (limpiar) {
      this.dataCliente = this.datanull;
      this.selectedClient = '';
      this.procederVenta = false;
    } else {
      this.dataCliente = this.selectedClient;
      this.procederVenta = true;
    }
  }
  //* #region Lista de Productos
  showProducts(){
    this.ref = this.dialogService.open(ProductListDemo,{
      header: 'Lista de Productos',
      width: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((producto: ProductImgI) => {         
      if (producto !== undefined) {
        if (producto?.estado) {
          let p_id = this.tablaproducto.length;
          this.oneProduct = this.fb.group({
            id: [p_id+1],
            cantidad: [1],
            producto: [producto?.nombre],
            pUnit: [producto?.precioVenta],
            pTotal: [producto?.precioVenta]
          });
          this.messageService.add({
            severity:'info',
            summary:'Producto Seleccionado',
            detail: producto?.nombre
          });
          this.btnelegido = false;
        } else if (!producto?.estado){
          this.messageService.add({
            severity:'error',
            summary:'Este Producto No Tiene Stock',
            detail: producto?.nombre
          });
        }
      }
    });
  }
  deleteProduct(product){
    this.tablaproducto.splice(product.id-1,1);
  }
  inserintable(){
    this.oneProduct.value.pTotal = this.oneProduct.value.cantidad * this.oneProduct.value.pUnit;
    const productExist = this.tablaproducto.find( product =>{
      return product?.producto === this.oneProduct.value.producto;
    });
    if (productExist !== undefined) {
      let p_date = this.tablaproducto[productExist?.id -1];
      let oldcantidad = p_date.cantidad;
      let newcantidad = this.oneProduct.value.cantidad += oldcantidad;
      p_date.cantidad = newcantidad;
      p_date.pTotal = p_date.cantidad * p_date.pUnit;
      this.oneProduct.reset();
      
    } else {
      this.tablaproducto.push(this.oneProduct.value);
      this.oneProduct.reset();
    }
    this.btnelegido = true;
  }
  //*  #endregion

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }else{ }
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
