import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleVentaI } from '../interfaces/VentaInterface';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {

  // apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/DetalleVentas/';
  apiUrl: string = 'https://localhost:7029/api/DetalleVentas/';

  constructor(private http: HttpClient) { }

  getDetalleVentas():Observable<DetalleVentaI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<DetalleVentaI[]>(this.apiUrl, {headers: headers});
  }

  getDetalleVenta(id: number):Observable<DetalleVentaI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<DetalleVentaI[]>(this.apiUrl + id, {headers: headers});
  }

  createDetalleVenta(category: DetalleVentaI): Observable<DetalleVentaI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<DetalleVentaI>(this.apiUrl, category, {headers: headers});
  }
  updateDetalleVenta(id: number, category: DetalleVentaI): Observable<DetalleVentaI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<DetalleVentaI>(this.apiUrl + id, category, {headers: headers});
  }

  deleteDetalleVenta(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
