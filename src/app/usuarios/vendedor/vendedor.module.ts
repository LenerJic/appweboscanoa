import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Date Import
import localePy from '@angular/common/locales/es-PE';
import { VentaComponent } from './venta/venta.component';
registerLocaleData(localePy, 'es');

@NgModule({
  declarations: [
    ClientesComponent,
    VentaComponent
  ],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    AutoCompleteModule
  ],
  exports:[
    ClientesComponent,
    VentaComponent
  ],
  providers: [
    ClienteService,
    DocumentoService,
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class VendedorModule { }
