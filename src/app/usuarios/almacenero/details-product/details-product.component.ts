import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryI } from 'src/app/interfaces/CategoryInterface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImagenService } from 'src/app/services/imagen.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.scss']
})
export class DetailsProductComponent implements OnInit {

  idproducto: number;
  lstcategorias: CategoryI[] = [];
  namecategoria: any;
  dataproduct: any;
  responsiveOptions: any;
  imageDialog: boolean;
  dataimagen: boolean;
  btnTrash: boolean = false;
  lstimagen: [] = [];

  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    private messageService: MessageService,
    private categoriasService: CategoriaService,
    private productoService: ProductoService,
    private imagenService: ImagenService,
    private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) =>{
      const {params} = paramMap;
      if (params.id !== undefined) {
        this.categoriasService.getCategories().subscribe((data:any)=>{
          this.lstcategorias = data.result;
          this.productoService.getProduct(parseInt(params.id)).subscribe((data:any)=>{
            this.dataproduct = data.result[0];            
            this.idproducto = data.result[0].id;
            this.namecategoria = this.lstcategorias?.find((tipo:any)=>tipo.id === this.dataproduct.categoria)?.nombre ?? 'Error';
            this.sinImagen();
          });
        })
        this.imagenService.getImage(parseInt(params.id)).subscribe((data:any)=>{
          this.lstimagen = data.result;
        })
      }
    });
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  loadData(){
    this.productoService.getProduct(this.idproducto).subscribe((data:any)=>{
      this.dataproduct = data.result[0];
      this.namecategoria = this.lstcategorias?.find((tipo:any)=>tipo.id === this.dataproduct.categoria)?.nombre ?? 'Error';
      this.sinImagen();
    });
  }

  newImage(){
    this.imageDialog = true;
  }

  myUploader(event: any) {
    try {
      const formData = new FormData();
      for(let archivo of event.files){
        formData.append('image', archivo)
      }
      this.imagenService.createImage(this.idproducto, formData).subscribe((data:any)=>{
        console.log(data);
        this.messageService.add({severity: 'success', summary: 'Accion Completada con Éxito!!', detail: 'Imagen(es) Guardado(s)'});
        formData.delete('image');
      },
      e=>{
        this.messageService.add({severity: 'error', summary: 'La accion no se pudo completar', detail: e});
        return console.log(e);
      });
      this.imageDialog = false;
    } catch (error) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: error});
      console.log(error);
    }
  }

  sinImagen(){
    if (this.dataproduct?.imagenes[0] === null) {
      this.dataimagen = false;
    } else{
      this.dataimagen = true;
    }
  }

  deleteImage(_id){
    this.btnTrash = true;
    this.confirmService.confirm({
      message: '¿Está seguro de eliminar esta imagen?',
      header: 'Confirmar Eliminación',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-info p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.imagenService.deleteImage(_id).subscribe((data:any)=>{
          this.messageService.add({severity: 'success', summary: 'Accion Completada con Éxito!!', detail: 'Se eliminó la Imagen'});
          this.imagenService.getImage(this.idproducto).subscribe((data:any)=>{
            this.lstimagen = data.result;
            this.btnTrash = false;
          })
        },
        e=>{
          this.messageService.add({severity: 'error', summary: 'La accion no se pudo completar', detail: e});
          console.log(e);
          this.btnTrash = false;
        });
      },
      closeOnEscape: this.btnTrash = false,
    });
  }

  back(){
    this._location.back();
  }
}
