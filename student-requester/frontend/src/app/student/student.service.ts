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
  add1(puc) {
    console.log(puc);
    return this.http.post("http://localhost:3000/products/puc", puc);
  }
  add2(degree) {
    console.log(degree);
    return this.http.post("http://localhost:3000/products/degree", degree);
  }
}
