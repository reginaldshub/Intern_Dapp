import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  add(sslc) {
    console.log(sslc);
    return this.http.post("http://localhost:3000/products/sslc", sslc);
  }
}
