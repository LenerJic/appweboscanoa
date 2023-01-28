import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { retry } from 'rxjs';
import { ClienteI } from 'src/app/interfaces/ClienteInterface';
import { ProductImgI } from 'src/app/interfaces/ProductInterface';
import { DetalleVentaI, VentaI } from 'src/app/interfaces/VentaInterface';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DetalleVentaService } from 'src/app/services/detalle-venta.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
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
  lstventas: VentaI[];
  filteredClientes: any[];
  selectedClient: any;
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
  tablaproducto: {
    id?: number;
    idProducto?: number;
    cantidad?: number;
    producto?: string;
    pUnit?: number;
    pTotal?: number;
  }[] = [];
  sumaTotal : number = 0;
  ventaForm: FormGroup;
  detalleVentaForm: FormGroup;
  oneProduct: FormGroup;

  pruebaDetalle: DetalleVentaI[];

  procederVenta: boolean = false;
  btnelegido: boolean = true;
  btnAnular:boolean = true;
  btnGuardar: boolean = true;

  constructor(public authService: AuthService,
              private clienteService: ClienteService,
              private productoService : ProductoService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private ventaService: VentaService,
              private detalleventaService: DetalleVentaService,
              private fb: FormBuilder) { }

  ref: DynamicDialogRef;

  ngOnInit() {
    this.idEmpleado = parseInt(this.authService.getUserid);

    this.clienteService.getClients().subscribe((data:any)=>{
      this.clientes = data.result;      
    });
    this.productoService.getProducts().subscribe((data:any)=>{
      this.lstproductos = data.result;
    });
    this.ventaService.getVentas().subscribe((data:any)=>{
      this.lstventas = data.result;
    })

    this.oneProduct = this.fb.group({
      id: [0],
      idProducto: [0],
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
  // * #region Lista de Productos
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
            idProducto: [producto?.id],
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
          idProducto: [olddata.idProducto],
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
  // * #endregion

  processSale(){
    this.confirmationService.confirm({
      message: '¿Desea realizar la venta?',
      header: 'Confirmar Proceso de Venta',
      acceptButtonStyleClass: 'p-button-info p-button-text',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.saveSale();
      },
    });
  }

  saveSale(){
    let dataVenta: any;
    let _idCliente = this.dataCliente.id;
    
    this.ventaForm = this.fb.group({
      id: [0],
      idCliente: [_idCliente],
      idEmpleado: [this.idEmpleado],
      numeroBoleta: [this.lstventas.length+1],
      montopago: [0],
      fecha: [new Date()],
    });
    try {
      // Create Sale
      this.ventaService.createVenta(this.ventaForm.value).subscribe(data=>{},(e)=>{
        console.log(e);
      })
      let ventaId = this.ventaForm.value.numeroBoleta;
      // Sale x Sale
      for(let pedido of this.tablaproducto){
        this.detalleVentaForm = this.fb.group({
          id: [0],
          idVenta: [ventaId],
          idMueble: [pedido.idProducto],
          cantidad: [pedido.cantidad],
          subtotal: [pedido.pTotal]
        });
        console.log(this.detalleVentaForm.value);
        this.detalleventaService.createDetalleVenta(this.detalleVentaForm.value).subscribe((data:any)=>{
          this.detalleVentaForm.reset();
        },
        (e)=>{
          console.log(e);
          this.detalleVentaForm.reset();
          this.messageService.add({
            severity:'error', summary: 'Error',
            detail: 'No se pudo completar la acción', life: 3000
          });
        });
      }
      // Update Sale
      this.ventaForm = this.fb.group({
        id: [ventaId],
        idCliente: [_idCliente],
        idEmpleado: [this.idEmpleado],
        numeroBoleta: [ventaId],
        montopago: [this.sumaTotal],
        fecha: [new Date()],
      });
      this.ventaService.updateVenta(ventaId,this.ventaForm.value).subscribe((data:any)=>{
        this.messageService.add({
          severity:'success', summary: 'Éxito!',
          detail: 'Se guardaron los datos de la venta', life: 3000
        });
      },
      (e)=>{
        console.log(e);
        this.messageService.add({
          severity:'error', summary: 'Error',
          detail: 'No se pudo guardar la venta', life: 3000
        });
      });
      this.anularOption();
    } catch (error) {
      console.log(error);
      this.anularOption();
    }
  }

  anularOption(){
    this.tablaproducto = [];
    this.ventaForm.reset();
    this.detalleVentaForm.reset();
    this.oneProduct.reset();
    this.calcularTotal();
    this.btnGuardar = true;
    this.btnAnular = true;
  }
  valueAnular(){
    if(this.tablaproducto.length <= 0){
      this.btnAnular = true;
      this.btnGuardar = true;
    }else{
      this.btnAnular = false;
      this.btnGuardar = false;
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
