import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadoI } from '../interfaces/EmpleadoInterface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Empleados/';
  // apiUrl: string = 'https://localhost:7029/api/Empleados/';

  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<EmpleadoI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<EmpleadoI[]>(this.apiUrl, {headers: headers});
  }
  getEmpleado(id: number):Observable<EmpleadoI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<EmpleadoI[]>(this.apiUrl + id, {headers: headers});
  }

  createEmpleado(data: any): Observable<EmpleadoI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<EmpleadoI>(this.apiUrl, data, {headers: headers});
  }

  updateEmpleado(id: number, client: EmpleadoI): Observable<EmpleadoI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<EmpleadoI>(this.apiUrl + id, client, {headers: headers});
  }

  deleteEmpleado(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
