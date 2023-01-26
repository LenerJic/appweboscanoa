import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { retry } from 'rxjs';
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
  sumaTotal : number = 0;

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
  btnAnular:boolean = true;

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
      pTotal: [0],
      maxcantidad: [0]
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
  get maxcantidad() { return this.oneProduct.get('maxcantidad'); }

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
      this.anularOption();
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
      let dato_selecccionado : boolean = true;
      let table_data : any;
      if (this.tablaproducto.length !== 0) {       
        const existe = this.tablaproducto.find( dato =>{
          return dato?.producto === producto?.nombre;
        });
        table_data = this.tablaproducto[existe?.id -1];
        if (table_data !== undefined) {          
          if (table_data?.cantidad < producto?.stock){
             dato_selecccionado = true
          }  else{
            dato_selecccionado = false
          };
        }
      }
      if (producto !== undefined && dato_selecccionado) {
        if (producto?.estado) {
          let p_id = this.tablaproducto.length;
          this.oneProduct = this.fb.group({
            id: [p_id+1],
            cantidad: [1],
            producto: [producto?.nombre],
            pUnit: [producto?.precioVenta],
            pTotal: [producto?.precioVenta],
            maxcantidad: [producto?.stock]
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
        };
      } else if (producto !== undefined && !dato_selecccionado){
        this.messageService.add({
          severity:'error',
          summary:'Ud. ya registro este producto con todas las unidades disponibles.',
          detail: `Ud. ya registro el producto ${producto?.nombre} con todas las unidades disponibles.`,
          life: 5000
        });
      }
    });
  }
  deleteProduct(product){
    this.tablaproducto.splice(product.id-1,1);
    this.calcularTotal();
    this.valueAnular();
  }
  inserintable(){
    this.oneProduct.value.pTotal = this.oneProduct.value.cantidad * this.oneProduct.value.pUnit;
    const productExist = this.tablaproducto.find( product =>{
      return product?.producto === this.oneProduct.value.producto;
    });
    if (productExist !== undefined) {
      let p_date = this.tablaproducto[productExist?.id -1];
      let productdata = this.oneProduct.value;
      let oldcantidad = p_date.cantidad;
      let actualcantidad = productdata.cantidad;
      let newcantidad = productdata.cantidad += oldcantidad;
      let _maxcantidad = productdata.maxcantidad;

      if (oldcantidad + actualcantidad > productdata.maxcantidad) {
        let olddata = this.oneProduct.value;
        let _datathis = this.fb.group({
          id: [olddata.id],
          cantidad: [1],
          producto: [olddata.producto],
          pUnit: [olddata.pUnit],
          pTotal: [olddata.pUnit],
          maxcantidad: [olddata.maxcantidad]
        });
        this.oneProduct.reset();
        this.oneProduct = _datathis;        
        this.messageService.add({
          severity:'warn',
          summary:'Fuera del Limite de Stock',
          detail: `Solo hay ${_maxcantidad} unidades en stock de este producto`
        });
      } else{
        p_date.cantidad = newcantidad;
        p_date.pTotal = p_date.cantidad * p_date.pUnit;
        this.oneProduct.reset();
        this.btnelegido = true;
      }      
    } else {      
      this.tablaproducto.push(this.oneProduct.value);
      this.oneProduct.reset();
      this.btnelegido = true;
    }
    this.calcularTotal();
    this.valueAnular();
  }
  calcularTotal(){
    let total = 0;
    for (let subtotal of this.tablaproducto) {
      total += subtotal.pTotal;
    }
    this.sumaTotal = total;
  }
  //*  #endregion

  anularOption(){
    this.tablaproducto = [];
    this.insertproducto = [];
    this.ventaForm.reset();
    this.detalleVentaForm.reset();
    this.oneProduct.reset();
    this.calcularTotal();
    this.btnAnular = true;
  }
  valueAnular(){
    if(this.tablaproducto.length <= 0){
      this.btnAnular = true;
    }else{
      this.btnAnular = false;
    }
  }

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
