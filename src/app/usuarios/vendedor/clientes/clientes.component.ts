import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClienteI } from 'src/app/interfaces/ClienteInterface';
import { Tipo_Doc } from 'src/app/interfaces/Tipo_Doc';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  pipe = new DatePipe('es-PE');
  clientDialog: boolean;
  lstdocumento: Tipo_Doc[] = [];
  clients: ClienteI[];
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public clienteForm: FormGroup;

  constructor(private clienteservice: ClienteService,
              private documentservice: DocumentoService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private exportarPdf: ExportarPdfService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.documentservice.getDocument().subscribe((data: any) => {
      this.lstdocumento = data.result;
      this.cargarData();            
    });
    this.clienteForm = this.fb.group({
      id: [0],
      nombres: ['',Validators.required],
      apellidoPat: ['',Validators.required],
      apellidoMat: ['',Validators.required],
      tipoDocumento: [0,Validators.required],
      nroDocumento: [0,[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: ['',Validators.required],
      correo: ['',Validators.required],
      celular: ['',Validators.required],
    });
  }
//* #region getNamesForm
  get nombres() { return this.clienteForm.get('nombres'); }
  get apellidoPat() { return this.clienteForm.get('apellidoPat'); }
  get apellidoMat() { return this.clienteForm.get('apellidoMat'); }
  get tipoDocumento() { return this.clienteForm.get('tipoDocumento'); }
  get nroDocumento() { return this.clienteForm.get('nroDocumento'); }
  get direccion() { return this.clienteForm.get('direccion'); }
  get correo() { return this.clienteForm.get('correo'); }
  get celular() { return this.clienteForm.get('celular'); }
//* #endregion

  cargarData(){
    this.clienteservice.getClients().subscribe((data: any) => {
      this.clients = data.result;
    });
  }

  getValue(e: any){
    return e.target.value ?? '';
  }

  openNew() {
    this.clienteForm = this.fb.group({
      id: [0],
      nombres: ['',Validators.required],
      apellidoPat: ['',Validators.required],
      apellidoMat: ['',Validators.required],
      tipoDocumento: [0,Validators.required],
      nroDocumento: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: ['',Validators.required],
      correo: ['',[Validators.required,Validators.pattern(this.emailPattern)]],
      celular: ['',Validators.required],
    });
    this.clientDialog = true;
  }
  
  hideDialog() {
    this.clientDialog = false;
    this.clienteForm.reset();
  }

  editClient(client: ClienteI) {
    this.clienteForm = this.fb.group({
      id: [client.id],
      nombres: [client.nombres,Validators.required],
      apellidoPat: [client.apellidoPat,Validators.required],
      apellidoMat: [client.apellidoMat,Validators.required],
      tipoDocumento: [client.tipoDocumento,Validators.required],
      nroDocumento: [client.nroDocumento,[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      direccion: [client.direccion,Validators.required],
      correo: [client.correo,[Validators.required,Validators.pattern(this.emailPattern)]],
      celular: [client.celular,Validators.required],
    });
    this.clientDialog = true;
  }
  saveClient() {
    if (this.clienteForm.valid && this.clienteForm.value.tipoDocumento != 0 && this.validarDocumento(this.clienteForm)==true){
      if(this.clienteForm.value.id){
        this.clienteservice.updateClient(this.clienteForm.value.id, this.clienteForm.value).subscribe(
          (data)=>{
          this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Datos del Cliente actualizado', life: 3000});
          this.clienteForm.reset();
          this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar los datos', life: 3000});
        });
      }
      else{    
        this.clienteservice.createClient(this.clienteForm.value).subscribe(
          (data:any)=>{
            this.messageService.add({severity:'success', summary: 'Éxito!', detail: 'Nuevo Cliente Registrado', life: 3000});
            this.clienteForm.reset();
            this.cargarData();
        },
        error=>{
          console.log(error);
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo registrar al cliente', life: 3000});
        });
      }
      this.clientDialog = false;
    }
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
  deleteClient(client: ClienteI) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar al cliente ' + client.nombres + '?',
      header: 'Confirmar Eliminación',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-info p-button-text',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'none',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteservice.deleteClient(client.id).subscribe(
          (data: any)=>{
            this.cargarData();
            this.messageService.add({
              severity: 'success',
              summary: 'Elimación Exitosa!',
              detail: 'Los Datos del Cliente se eliminaron correctamente',
              life: 3000,
            });
          },
          error=>{
            console.log(error);
            this.messageService.add({
              severity:'error',
              summary: 'Error',
              detail: 'No se pudo eliminar los datos del cliente',
              life: 3000
            });
          }
        );
      },
    });
  }
  exportPdf(){
    let fechaHoy = this.pipe.transform(new Date(), 'dd/MM/yyyy hh:mm a','UTC-5');
    const titulo = `Lista de Clientes \n ${fechaHoy}`,
          encabezado = ["Nombres", "Ap. Paterno", "Ap. Materno", "Tipo de Doc.", "Num. de Doc.", "Correo", "Celular"];

    this.clienteservice.getClients().subscribe((data:any)=>{
      const cuerpo = Object(data.result).map(
        (obj:any)=>{
          const datos = [
            obj.nombres,
            obj.apellidoPat,
            obj.apellidoMat,
            this.lstdocumento.find((doc:any)=>doc.id === obj.tipoDocumento)?.nombre ?? '',
            obj.nroDocumento,
            obj.correo,
            obj.celular,
          ]
          return datos;
        }
      )
      this.exportarPdf.imprimir(encabezado, cuerpo, titulo, true);
    });
  }
}
