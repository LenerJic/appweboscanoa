import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserI } from '../interfaces/UserInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Usuarios/';
  // apiUrl: string = 'https://localhost:7029/api/Usuarios/';

  constructor(private http: HttpClient) { }

  register(user: UserI){
    return this.http.post(this.apiUrl+'Register',user);
  }

  login(user: UserI){
    return this.http.post(this.apiUrl+'Login',user);
  }

  logout(){
    /* localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    localStorage.removeItem('tipoEmpleado'); */
    localStorage.clear();
  }

  get getUserid(){
    return localStorage.getItem('userId');
  }
  get getUsername(){
    return localStorage.getItem('userName');
  }

  get rolUser(){
    return localStorage.getItem('tipoEmpleado');
  }

  get isAutenticado(){
    return !!localStorage.getItem('token_value');
  }
}
