import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes
import { EmpleadosComponent } from './empleados/empleados.component';
// Servicios
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { AuthService } from 'src/app/services/auth.service';
// Modulos
import { AdminRoutingModule } from './admin-routing.module';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

// Date Import
import localePy from '@angular/common/locales/es-PE';
registerLocaleData(localePy, 'es');

@NgModule({
  declarations: [
    EmpleadosComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    InputSwitchModule,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    ProgressSpinnerModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    EmpleadoService,
    AuthService,
    DatePipe,
    {provide: LOCALE_ID, useValue: 'es'}
  ]
})
export class AdminModule { }
