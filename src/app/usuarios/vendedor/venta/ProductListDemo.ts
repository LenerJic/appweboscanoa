
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CategoryI } from 'src/app/interfaces/CategoryInterface';
import { ProductImgI } from 'src/app/interfaces/ProductInterface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
  
@Component({
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        TableModule,
        TagModule,
        ButtonModule,
        ProgressSpinnerModule,
        ImageModule
    ],
    template: `
        <p-table #dt [value]="tablaproductos" responsiveLayout="scroll" [paginator]="true" [rows]="5"
        [globalFilterFields]="['nombre','categoria','precioVenta','stock']"
        *ngIf="tablaproductos; else table_error">
        <ng-template pTemplate="caption">
                <div class="flex align-items-center justify-content-between">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" (input)="dt.filterGlobal(getValue($event), 'contains')" placeholder="Buscar..." />
                    </span>
                </div>
            </ng-template>
        <ng-template pTemplate="header">
            <tr>
                <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
                <th pSortableColumn="categoria">Categoria <p-sortIcon field="categoria"></p-sortIcon></th>
                <th pSortableColumn="precioVenta">Precio <p-sortIcon field="precioVenta"></p-sortIcon></th>
                <th pSortableColumn="stock">Stock <p-sortIcon field="stock"></p-sortIcon></th>
                <th pSortableColumn="estado">Estado <p-sortIcon field="estado"></p-sortIcon></th>
                <th pSortableColumn="imagen">Imagen <p-sortIcon field="imagen"></p-sortIcon></th>
                <th style="width:4em"></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product >
            <tr *ngIf="product.estado">
                <td>{{product.nombre}}</td>
                <td>
                  <span *ngFor="let catg of lstCategorias">
                      {{(product.categoria === catg.id) ? catg.nombre : ''}}
                  </span>
                </td>
                <td>{{product.precioVenta}}</td>
                <td>{{product.stock}}</td>
                <td>
                    <p-tag *ngIf="(product.estado && product.stock>= 10)" severity="success" value="Con Stock" [rounded]="true"></p-tag>
                    <p-tag *ngIf="(product.estado && product.stock < 10)" severity="warning" value="Bajo Stock" [rounded]="true"></p-tag>
                    <p-tag *ngIf="!product.estado" severity="danger" value="Sin Stock" [rounded]="true"></p-tag>
                </td>
                <td>
                    <div *ngIf="product.imagenes[0] === null || product.imagenes.length === 0">
                        Sin Imagen
                    </div>
                    <div *ngIf="product.imagenes[0] !== null && product.imagenes.length >= 1">
                        <p-image [src]="product.imagenes[0]" [alt]="product.nombre" width="100" class="shadow-4" [preview]="true"></p-image>
                    </div>
                </td>
                <td>
                    <button type="button" pButton icon="pi pi-plus" (click)="selectProduct(product)"></button>
                </td>
            </tr>
        </ng-template>
        </p-table>
        <ng-template #table_error>
            <p-progressSpinner class="d-flex justify-content-center align-items-center mt-5"></p-progressSpinner>
        </ng-template>
    `,
    styles: [`
        :host {
            &::ng-deep {
                .p-image-preview {
                    max-height: 60vh;
                }
            }
        }
    `]
})
export class ProductListDemo {

    lstCategorias: CategoryI[] = [];
    tablaproductos: ProductImgI[];
    constructor(
        private productoService: ProductoService,
        private categoryservice: CategoriaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) { }
  
    ngOnInit() {
        this.categoryservice.getCategories().subscribe((data:any)=>{
            this.lstCategorias = data.result;
            this.productoService.getProducts().subscribe((data:any)=>{
                this.tablaproductos = data.result;
            });
        })
    }
    getValue(e: any){
        return e.target.value ?? '';
    }

    selectProduct(producto: ProductImgI){
        this.ref.close(producto);
    }
}