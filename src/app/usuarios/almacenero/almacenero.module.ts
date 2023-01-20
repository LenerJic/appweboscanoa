import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlmaceneroRoutingModule } from './almacenero-routing.module';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';

import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { ProductoService } from 'src/app/services/producto.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';

// Date Import
import localePy from '@angular/common/locales/es-PE';
import { DetailsProductComponent } from './details-product/details-product.component'
registerLocaleData(localePy, 'es');

@NgModule({
  declarations: [
    CategoriasComponent,
    ProductosComponent,
    DetailsProductComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AlmaceneroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  exports:[
    CategoriasComponent,
    ProductosComponent,
    DetailsProductComponent
  ],
  providers: [
    ProductoService,
    CategoriaService,
    MessageService,
    ConfirmationService,
    ExportarPdfService,
    DatePipe,
    {provide: LOCALE_ID, useValue: 'es'}
  ]
})
export class AlmaceneroModule { }
