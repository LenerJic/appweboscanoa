import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductI, ProductImgI } from '../interfaces/ProductInterface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Productos/';
  // apiUrl: string = 'https://localhost:7029/api/Productos/';

  constructor(private http: HttpClient) { }

  getProducts():Observable<ProductImgI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<ProductImgI[]>(this.apiUrl, {headers: headers});
  }
  getProduct(id: number):Observable<ProductImgI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<ProductImgI[]>(this.apiUrl + id, {headers: headers});
  }
  createProduct(product: ProductI):Observable<ProductI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<ProductI>(this.apiUrl, product, {headers: headers});
  }
  updateProduct(id: number, product: ProductI):Observable<ProductI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<ProductI>(this.apiUrl + id, product, {headers: headers});
  }

  deleteProduct(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }

  search(keyword: string, list:any): string[]{
    let datos: string[] = [];
    for (let i=0; i<list.length; i++) {
      if(list[i].nombre.includes(keyword)){
        datos.push(list[i].nombre);
      }
    }
    return datos;
  }
}
