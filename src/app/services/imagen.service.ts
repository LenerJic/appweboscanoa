import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  // apiUrl: string = 'https://apimueblesoscanoa.azurewebsites.net/api/Imagen/';
  apiUrl: string = 'https://localhost:7029/api/Imagen/';

  constructor(private http: HttpClient) { }
}
