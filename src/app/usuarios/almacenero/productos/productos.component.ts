import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { CategoryI } from 'src/app/interfaces/CategoryInterface';
import { ProductI, ProductImgI } from 'src/app/interfaces/ProductInterface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  productDialog: boolean;
  lstcategorias: CategoryI[] = [];

  products: ProductImgI[];

  public productForm: FormGroup;

  constructor(private productoService: ProductoService,
              private categoryservice: CategoriaService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private exportarPdf: ExportarPdfService,
              private fb: FormBuilder,
              private pd:DatePipe) { }

  ngOnInit(): void {
    this.categoryservice.getCategories().subscribe((data: any) => {
      this.lstcategorias = data.result;
      this.cargarData();
    });

    this.productForm = this.fb.group({  
      id: [0],
      nombre: ['',[Validators.required]],
      descripcion: ['',Validators.maxLength(250)],
      stock: [0,Validators.required],
      categoria: [0,Validators.required],
      precioCompra: [0,Validators.required],
      precioVenta: [0,Validators.required],
      estado: [Boolean],
      fecha: ['',Validators.required]
    });    
  }
  get nombre() { return this.productForm.get('nombre'); }
  get descripcion() { return this.productForm.get('descripcion'); }
  get stock() { return this.productForm.get('stock'); }
  get categoria() { return this.productForm.get('categoria'); }
  get precioCompra() { return this.productForm.get('precioCompra'); }
  get precioVenta() { return this.productForm.get('precioVenta'); }
  get fecha() { return this.productForm.get('fecha'); }

  cargarData(){
    this.productoService.getProducts().subscribe((data: any) => {
      this.products = data.result;
    });
  }

  getValue(e: any){
    return e.target.value ?? '';
  }

  openNew() {
    this.productForm = this.fb.group({  
      id: [0],
      nombre: ['',Validators.required],
      descripcion: ['',Validators.maxLength(250)],
      stock: [0,Validators.required],
      categoria: [0,Validators.required],
      precioCompra: [0,Validators.required],
      precioVenta: [0,Validators.required],
      estado: [true],
      fecha: ['',Validators.required]
    });
    this.productDialog = true;
  }
  hideDialog() {
    this.productDialog = false;
    this.productForm.reset();
  }

  editProduct(product: ProductI) {
    this.productForm = this.fb.group({  
      id: [product.id],
      nombre: [product.nombre,Validators.required],
      descripcion: [product.descripcion,Validators.maxLength(250)],
      stock: [product.stock,Validators.required],
      categoria: [product.categoria,Validators.required],
      precioCompra: [product.precioCompra,Validators.required],
      precioVenta: [product.precioVenta,Validators.required],
      estado: [product.estado],
      fecha: [product.fecha,Validators.required]
    });
    this.productDialog = true;
  }

  saveProduct() {
    if (this.productForm.valid && this.productForm.value.categoria != 0 && this.productForm.value.fecha != ''){
      if(this.productForm.value.id){
        this.validarEstado(this.productForm);
        this.validarFecha(this.productForm);
        if (this.productForm.value.descripcion.trim() === '') {
          this.productForm.value.descripcion = 'Sin descripción';
        };

        this.productoService.updateProduct(this.productForm.value.id, this.productForm.value).subscribe(
          (data)=>{
          this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Producto actualizado', life: 3000});
          this.productForm.reset();
          this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar el producto', life: 3000});
        });
      }
      else{
        this.validarEstado(this.productForm);
        this.validarFecha(this.productForm);
        if (this.productForm.value.descripcion.trim() === '') {
          this.productForm.value.descripcion = 'Sin descripción';
        };

        this.productoService.createProduct(this.productForm.value).subscribe(
          (data:any)=>{
            console.log(data);
            this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Nueva producto creado', life: 3000});
            this.productForm.reset();
            this.cargarData();            
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear el producto', life: 3000});
        });
      }
      this.productDialog = false;
    }
  }

  validarEstado(form: FormGroup){
    let datos = form.value;
    let d_stock = datos.stock;
    if (d_stock >= 1) {
      datos.estado = true;
    }else{
      datos.estado = false;
    }
  }
  validarFecha(form: FormGroup){
    let date_fecha = form.value.fecha;
    let valid_date = this.pd.transform(date_fecha, 'yyyy-MM-dd');
    form.value.fecha = valid_date;
  }

  deleteProduct(product) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar el producto ' + product.nombre + '?',
      header: 'Confirmar Eliminación',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-info p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productoService.deleteProduct(product.id).subscribe(
          (data: any)=>{
            this.cargarData();
            this.messageService.add({
              severity: 'success',
              summary: 'Elimación Exitosa!',
              detail: 'El producto se eliminó correctamente',
              life: 3000,
            });
          },
          error=>{
            console.log(error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar el producto', life: 3000});
          }
        );
      },
    });
  }

  exportPdf() {
    const titulo = "Lista de Productos";
    const encabezado = ["Id", "Nombre", "Descripcion", "Categoria", "Stock", "Precio de Compra", "Precio de Venta", "Ultimo Registro", "Estado"];

    this.productoService.getProducts().subscribe((data:any)=>{
      const cuerpo = Object(data.result).map(
        (obj:any)=>{
          const datos = [
            obj.id,
            obj.nombre,
            obj.descripcion,
            this.lstcategorias.find((categoria:any)=>categoria.id === obj.categoria)?.nombre ?? 'Categoria no registrado',
            obj.stock,
            obj.precioCompra,
            obj.precioVenta,
            obj.fecha = this.pd.transform(obj.fecha, 'dd/MM/yyyy'),
            (obj.estado) ? 'Con Stock' : 'Sin Stock'
          ]
          return datos;
        }
      )
      this.exportarPdf.imprimir(encabezado, cuerpo, titulo, true);
    });
  }

  getNmaeCategoria(id){
    this.categoryservice.getCategory(id).subscribe((data:any) => {

    })
  }
}
