import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tipo_Doc } from '../interfaces/Tipo_Doc';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/TipoDocumentos/';
  // apiUrl: string = 'https://localhost:7029/api/TipoDocumentos/';

  constructor(private http: HttpClient) { }

  getDocument(): Observable<Tipo_Doc[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<Tipo_Doc[]>(this.apiUrl, {headers: headers});
  }
}
