import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmpleadoI } from 'src/app/interfaces/EmpleadoInterface';
import { Tipo_Doc } from 'src/app/interfaces/Tipo_Doc';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalUsers: number = 0;
  totalClientes: number = 0;
  totalProductos: number = 0;
  idUser: number = 0;
  datoEmpleado: EmpleadoI;
  lstdocumento: Tipo_Doc[] = [];
  tipoDocumento: string;

  PasswordForm: FormGroup;
  valorUsuario:string;
  cargando: boolean = false;
  deshabilitar: boolean = false;
  icon_lock: boolean = false;

  constructor (private empleadoService: EmpleadoService,
               private clienteService: ClienteService,
               private productosService: ProductoService,
               private authService: AuthService,
               private docService: DocumentoService,
               private messageService: MessageService,
               private fb: FormBuilder
               ) { }
  
  ngOnInit() {
    this.idUser = parseInt(this.authService.getUserid);
    
    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      this.totalUsers = data.result.length;
    });
    this.clienteService.getClients().subscribe((data:any)=>{
      this.totalClientes = data.result.length;
    });
    this.productosService.getProducts().subscribe((data:any)=>{
      this.totalProductos = data.result.length;
    });
    // Ventas - falta
    this.docService.getDocument().subscribe((data:any)=>{
      this.lstdocumento = data.result;
    });
    this.empleadoService.getEmpleado(this.idUser).subscribe((data:any)=>{
      this.datoEmpleado = data.result;
      this.tipoDocumento = this.lstdocumento?.find((tipo:any)=>tipo.id === this.datoEmpleado.tipoDocumento)?.nombre ?? 'Documento';
      this.valorUsuario = data.result.nroDocumento;
      
    });
    
    this.PasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  get password() { return this.PasswordForm.get('password') }
  get passwordConfirm() { return this.PasswordForm.get('passwordConfirm') }

  onSubmit(){
    this.cargando = true;
    let formData = this.PasswordForm.value;
    let newdata = {
      userName: this.valorUsuario,
      password: formData.password
    }
    this.authService.changePassword(newdata).subscribe((data:any)=>{
      this.messageService.add({
        severity:'success',
        summary: 'Completado!',
        detail: data.displayMessage
      });
      this.cargando=false;
    });
    this.PasswordForm.reset();
    this.clickEvent();
  }
  validarPassword(form:FormGroup){
    let datos = form.value;
    if(datos.password === datos.passwordConfirm){
      return true;
    }else{
      return false;
    }
  }
  clickEvent(){
    this.icon_lock = !this.icon_lock;
    if(this.deshabilitar){
      this.deshabilitar = false;
    }else{
      this.deshabilitar = true;
    };
  }
}
