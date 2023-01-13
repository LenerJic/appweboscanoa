import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteI } from '../interfaces/ClienteInterface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Clientes/';
  // apiUrl: string = 'https://localhost:7029/api/Clientes/';
  
  constructor(private http: HttpClient) { }

  getClients(): Observable<ClienteI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<ClienteI[]>(this.apiUrl, {headers: headers});
  }

  createClient(data: any): Observable<ClienteI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<ClienteI>(this.apiUrl, data, {headers: headers});
  }

  updateClient(id: number, client: ClienteI): Observable<ClienteI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<ClienteI>(this.apiUrl + id, client, {headers: headers});
  }

  deleteClient(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
