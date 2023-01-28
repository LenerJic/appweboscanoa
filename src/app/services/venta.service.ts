import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VentaI } from '../interfaces/VentaInterface';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Ventas/';
  // apiUrl: string = 'https://localhost:7029/api/Ventas/';

  constructor(private http: HttpClient) { }

  getVentas():Observable<VentaI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<VentaI[]>(this.apiUrl, {headers: headers});
  }

  getVenta(id: number):Observable<VentaI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<VentaI[]>(this.apiUrl + id, {headers: headers});
  }

  createVenta(venta: VentaI): Observable<VentaI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<VentaI>(this.apiUrl, venta, {headers: headers});
  }
  updateVenta(id: number, venta: VentaI): Observable<VentaI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<VentaI>(this.apiUrl + id, venta, {headers: headers});
  }

  deleteVenta(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
