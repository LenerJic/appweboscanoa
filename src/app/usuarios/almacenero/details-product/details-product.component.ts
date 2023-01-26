import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryI } from 'src/app/interfaces/CategoryInterface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { MessageService } from 'primeng/api';
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
  selectedFile: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    private messageService: MessageService,
    private categoriasService: CategoriaService,
    private productoService: ProductoService,
    private imagenService: ImagenService,
    private fb: FormBuilder) { }

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

  newImage(){
    this.imageDialog = true;
  }

  myUploader(event: any) {
    try {
      let imagenForm = this.fb.group({
        image: [[File]]
      })
      this.selectedFile = event.files;
      imagenForm.value.image = event.files;
      
      console.log(this.selectedFile);
      console.log(imagenForm.value.image);
      
      this.imagenService.createImage(this.idproducto, imagenForm.value).subscribe((data:any)=>{
        console.log(data);
        this.messageService.add({severity: 'success', summary: 'Accion Completada con Éxito!!', detail: 'Imagen(es) Guardadas'});
        imagenForm.reset();
      },
      e=>{
        this.messageService.add({severity: 'error', summary: 'La accion no se pudo completar', detail: e});
        console.log(e.error.errors);
      })
      this.imageDialog = false;
    } catch (error) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: error});
      console.log(error);
    }
  }

  subirArchivo():any {
    try {
      const formData = new FormData();
      this.selectedFile.forEach(archivo => {
        // formData.append('id', this.idproducto.toString());
        formData.append('image', archivo);
        console.log(archivo);
        
      })
      /* this.imagenService.createImage(this.idproducto, formData).subscribe((data:any)=>{
        console.log(data);
        
        this.messageService.add({severity: 'success', summary: 'Accion Completada con Éxito!!', detail: 'Imagen(es) Guardadas'});
      },
      e=>{
        this.messageService.add({severity: 'error', summary: 'La accion no se pudo completar', detail: e});
        console.log(e.error.errors);
      }) */      
      this.imageDialog = false;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  sinImagen(){
    if (this.dataproduct?.imagenes[0] === null) {
      this.dataimagen = false;
    } else{
      this.dataimagen = true;
    }
  }

  prueba(){
    this.imagenService.getImage(this.idproducto).subscribe((data:any)=>{
      console.log(data);
    })
  }

  back(){
    this._location.back();
  }
}
