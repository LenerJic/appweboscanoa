import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryI } from 'src/app/interfaces/CategoryInterface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  categoryDialog: boolean;
  categories: CategoryI[];

  public categoryForm: FormGroup;

  constructor(private categoriaService: CategoriaService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private exportarPdf: ExportarPdfService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarData();
    this.categoryForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required]]
    });    
  }

  get nombre() { return this.categoryForm.get('nombre'); }

  cargarData(){
    this.categoriaService.getCategories().subscribe((data:any) => {
      this.categories = data.result;
    },
    (errorData) => this.router.navigate(['/not-found']));
  }

  getValue(e: any){
    return e.target.value ?? '';
  }

  openNew() {
    this.categoryForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required]
    });
    this.categoryDialog = true;
  }
  hideDialog() {
    this.categoryDialog = false;
    this.categoryForm.reset();
  }

  editCategory(category: CategoryI) {
    this.categoryForm = this.fb.group({
      id: [category.id],
      nombre: [category.nombre, Validators.required]
    })
    this.categoryDialog = true;
  }
  saveCategory() {
    if (this.categoryForm.valid){
      if(this.categoryForm.value.id){
        this.categoriaService.updateCategory(this.categoryForm.value.id, this.categoryForm.value).subscribe(
          (data)=>{
          this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Categoría actualizada', life: 3000});
          this.categoryForm.reset();
          this.cargarData();
        },
        (errorData)=>{
          console.log(errorData);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar la categoría', life: 3000});
        });
      }
      else{        
        this.categoriaService.createCategory(this.categoryForm.value).subscribe(
          (data:any)=>{
            this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Nueva categoría creada', life: 3000});
            this.categoryForm.reset();
            this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear la categoría', life: 3000});
        });
      }
      this.categoryDialog = false;
    }
  } 

  deleteCategory(category) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar la categoría ' + category.nombre + '?',
      header: 'Confirmar Eliminación',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-info p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriaService.deleteCategory(category.id).subscribe(
          (data: any)=>{
            this.cargarData();
            this.messageService.add({
              severity: 'success',
              summary: 'Elimación Exitosa!',
              detail: 'La categoría se elimino correctamente',
              life: 3000,
            });
          },
          error=>{
            console.log(error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar la categoría', life: 3000});
          }
        );
      },
    });
  }

  exportPdf() {
    const titulo = "Lista de Categorias";
    const encabezado = ["Id", "Nombre"];

    this.categoriaService.getCategories().subscribe((data:any)=>{
      const cuerpo = Object(data.result).map(
        (obj:any)=>{
          const datos = [
            obj.id,
            obj.nombre
          ]
          return datos;
        }
      )
      this.exportarPdf.imprimir(encabezado, cuerpo, titulo, true);
    });
  }
}