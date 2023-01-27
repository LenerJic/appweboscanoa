import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  newpasswordForm: FormGroup;
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) {

    this.newpasswordForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required,
                      Validators.minLength(6), 
                      Validators.maxLength(30)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  get userName() { return this.newpasswordForm.get('userName'); }
  get password() { return this.newpasswordForm.get('password'); }
  get passwordConfirm() { return this.newpasswordForm.get('passwordConfirm'); }

  onSubmit(){
    this.cargando = true;
    let formData = this.newpasswordForm.value;
    let newdata = {
      userName: formData.userName,
      password: formData.password
    }
    this.authService.changePassword(newdata).subscribe((data:any)=>{
      this.messageService.add({
        severity:'success',
        summary: 'Completado!',
        detail: data.displayMessage
      });
      this.cargando=false;
      this.router.navigate(['/login']);
    })
  }
  validarPassword(form:FormGroup){
    let datos = form.value;
    if(datos.password === datos.passwordConfirm){
      return true;
    }else{
      return false;
    }
  }
}
