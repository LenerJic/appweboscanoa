import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenI } from '../interfaces/ImagenInterface';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Imagen/';
  // apiUrl: string = 'https://localhost:7029/api/Imagen/';

  constructor(private http: HttpClient) { }

  getImages():Observable<ImagenI[]>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get<ImagenI[]>(this.apiUrl, {headers: headers});
  }
  getImage(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.get(this.apiUrl + id, {headers: headers});
  }
  createImage(_id: number,imagen: any): Observable<any>{
    let auth_token = localStorage.getItem('token_value');    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post(this.apiUrl + _id, imagen, {headers: headers});
  }

  deleteImage(id: number): Observable<{}>{
    let auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(this.apiUrl + id, {headers: headers});
  }
}
