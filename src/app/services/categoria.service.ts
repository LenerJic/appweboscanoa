import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryI } from '../interfaces/CategoryInterface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Categorias/';
  // apiUrl: string = 'https://localhost:7029/api/Categorias/';

  constructor(private http: HttpClient){ }

  getCategories():Observable<CategoryI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<CategoryI[]>(this.apiUrl, {headers: headers});
  }

  getCategory(id: number):Observable<CategoryI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<CategoryI[]>(this.apiUrl + id, {headers: headers});
  }

  createCategory(category: CategoryI): Observable<CategoryI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post<CategoryI>(this.apiUrl, category, {headers: headers});
  }
  updateCategory(id: number, category: CategoryI): Observable<CategoryI>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put<CategoryI>(this.apiUrl + id, category, {headers: headers});
  }

  deleteCategory(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
