import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpleadoI } from 'src/app/interfaces/EmpleadoInterface';
import { Tipo_Doc } from 'src/app/interfaces/Tipo_Doc';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit{
  empleadoDialog: boolean;
  lstdocumento: Tipo_Doc[] = [];
  empleados: EmpleadoI[];
  roles: any[];

  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  empleadoForm: FormGroup;
  registerUser: FormGroup;

  constructor(private empleadoService: EmpleadoService,
              private authService: AuthService,
              private documentservice: DocumentoService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private exportarPdf: ExportarPdfService,
              private fb: FormBuilder,
              private pd: DatePipe)
              {
                this.documentservice.getDocument().subscribe((data: any) => {
                  this.lstdocumento = data.result;             
                });

                this.roles = [
                  {id: 1, nombre: 'Administrador'},
                  {id: 2, nombre: 'Almacenero'},
                  {id: 3, nombre: 'Vendedor'}
                ];

                this.registerUser = this.fb.group({
                  userName: [''],
                  password: ['']
                });
              }

  ngOnInit(): void {
    this.cargarData();
    this.empleadoForm = this.fb.group({
      id: [0],
      nombres: ['',Validators.required],
      apellidoPat: ['',Validators.required],
      apellidoMat: ['',Validators.required],
      tipoDocumento: [0,Validators.required],
      nroDocumento: [0,[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: ['',Validators.required],
      correo: ['',Validators.required],
      celular: ['',Validators.required],
      fechaNacimiento: ['',Validators.required],
      estado: [Boolean],
      tipoEmpleado: ['',Validators.required]
    });
    
  }

//* #region getNamesForm
  get nombres() { return this.empleadoForm.get('nombres'); }
  get apellidoPat() { return this.empleadoForm.get('apellidoPat'); }
  get apellidoMat() { return this.empleadoForm.get('apellidoMat'); }
  get tipoDocumento() { return this.empleadoForm.get('tipoDocumento'); }
  get nroDocumento() { return this.empleadoForm.get('nroDocumento'); }
  get direccion() { return this.empleadoForm.get('direccion'); }
  get correo() { return this.empleadoForm.get('correo'); }
  get celular() { return this.empleadoForm.get('celular'); }
  get fechaNacimiento() { return this.empleadoForm.get('fechaNacimiento'); }
  get estado() { return this.empleadoForm.get('estado'); }
  get tipoEmpleado() { return this.empleadoForm.get('tipoEmpleado'); }
//* #endregion

  cargarData(){
    this.empleadoService.getEmpleados().subscribe((data: any) => {
      this.empleados = data.result;
    });
  }
  getValue(e: any){
    return e.target.value ?? '';
  }
  openNew() {
    this.empleadoForm = this.fb.group({
      id: [0],
      nombres: ['',Validators.required],
      apellidoPat: ['',Validators.required],
      apellidoMat: ['',Validators.required],
      tipoDocumento: [0,Validators.required],
      nroDocumento: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: ['',Validators.required],
      correo: ['',[Validators.required,Validators.pattern(this.emailPattern)]],
      celular: ['',Validators.required],
      fechaNacimiento: ['',Validators.required],
      estado: [true],
      tipoEmpleado: ['',Validators.required]
    });
    this.empleadoDialog = true;
  }
  
  hideDialog() {
    this.empleadoDialog = false;
    this.empleadoForm.reset();
  }

  editEmpleado(empleado: EmpleadoI) {
    const formattedDate = new Date(empleado.fechaNacimiento);
    this.empleadoForm = this.fb.group({
      id: [empleado.id],
      nombres: [empleado.nombres,Validators.required],
      apellidoPat: [empleado.apellidoPat,Validators.required],
      apellidoMat: [empleado.apellidoMat,Validators.required],
      tipoDocumento: [empleado.tipoDocumento,Validators.required],
      nroDocumento: [empleado.nroDocumento,[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: [empleado.direccion,Validators.required],
      correo: [empleado.correo,[Validators.required,Validators.pattern(this.emailPattern)]],
      celular: [empleado.celular,Validators.required],
      fechaNacimiento: [formattedDate,Validators.required],
      estado: [empleado.estado],
      tipoEmpleado: [empleado.tipoEmpleado,Validators.required]
    });
    
    this.empleadoDialog = true;
  }

  saveEmpleado() {
    if (this.empleadoForm.valid &&
        this.empleadoForm.value.tipoDocumento != 0 &&
        this.validarDocumento(this.empleadoForm)==true &&
        this.empleadoForm.value.tipoEmpleado!== '')
    {
      if(this.empleadoForm.value.id){

        this.validarFecha(this.empleadoForm);

        this.empleadoService.updateEmpleado(this.empleadoForm.value.id, this.empleadoForm.value).subscribe(
          (data)=>{
          this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Datos del Empleado actualizado', life: 3000});
          this.empleadoForm.reset();
          this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar los datos', life: 3000});
        });
      }
      else{
        this.validarFecha(this.empleadoForm);
        this.empleadoService.createEmpleado(this.empleadoForm.value).subscribe(
          (data:any)=>{
            this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Nuevo Empleado Registrado', life: 3000});
            this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo registrar al cliente', life: 3000});
        });
        this.postUser(this.empleadoForm);
        this.empleadoForm.reset();
      }
      this.empleadoDialog = false;
    }
  }

  deleteEmpleado(empleado: EmpleadoI) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar al empleado ' + empleado.nombres + '?',
      header: 'Confirmar Eliminación',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-info p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.empleadoService.deleteEmpleado(empleado.id).subscribe(
          (data: any)=>{
            this.cargarData();
            this.messageService.add({
              severity: 'success',
              summary: 'Elimación Exitosa!',
              detail: 'Los Datos del Empleado se eliminaron correctamente',
              life: 3000,
            });
          },
          error=>{
            console.log(error);
            this.messageService.add({
              severity:'error',
              summary: 'Error',
              detail: 'No se pudo eliminar los datos del empleado',
              life: 3000
            });
          }
        );
      },
    });
  }

  validarDocumento(form: FormGroup){
    let datos = form.value;
    let nro_length = datos.nroDocumento.length;
    let tip_doc = datos.tipoDocumento;
    
    if(nro_length > 8 && tip_doc==1){
      return 'DNI_FALSE';
    }else if (nro_length < 12 && tip_doc==2) {
      return 'PAS_FALSE';
    }else if ((nro_length == 8 && tip_doc==1) || (nro_length > 12 && tip_doc==2)){
      return form.valid;
    }else{
      return form.valid;
    }

  }
  validarFecha(form: FormGroup){
    let date_fecha = form.value.fechaNacimiento;
    let valid_date = this.pd.transform(date_fecha, 'yyyy-MM-dd');
    form.value.fechaNacimiento = valid_date;
  }

  postUser(form: FormGroup){
    let user = form.value.nroDocumento;
    this.registerUser = this.fb.group({
      userName: [user],
      password: [user]
    });
    this.authService.register(this.registerUser.value).subscribe(data=>{
      this.registerUser.reset();
    },
    error=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo registrar su Usuario', life: 3000});
    });
  }

  exportPdf() {
    const titulo = "Lista de Categorias";
    const encabezado = ["Id", "Nombre"];

    this.empleadoService.getEmpleados().subscribe((data:any)=>{
      const cuerpo = Object(data.result).map(
        (obj:any)=>{
          const datos = [
            obj.id,
            obj.nombres,
            obj.apellidoPat,
            obj.apellidoMat,
            obj.tipoDocumento,
            obj.nroDocumento,
            obj.direccion,
            obj.correo,
            obj.celular,
            obj.fechaNacimiento = this.pd.transform(obj.fecha, 'dd/MM/yyyy'),
            obj.estado,
            obj.tipoEmpleado
          ]
          return datos;
        }
      )
      this.exportarPdf.imprimir(encabezado, cuerpo, titulo, true);
    });
  }
}
