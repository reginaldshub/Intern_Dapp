import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  setStudentProfile(data) {
    return this.http.post("http://localhost:3000/products/setstudentprofile", data);
  }

  getStudentProfile(data) {
    return this.http.post("http://localhost:3000/products/getstudentprofile", data);
  }

  updateStudentProfile(data) {
    return this.http.put("http://localhost:3000/products/student/" + `${data.userId}`, data);
  }
  grant(data) {
    return this.http.post("http://localhost:3000/products/grant", data);
  }
  deny(data) {
    return this.http.post("http://localhost:3000/products/deny", data);
  }
  checkstatus(data){
    return this.http.post("http://localhost:3000/products/checkstatus",data);
  }
  getCertificate(data){
    return this.http.post("http://localhost:3000/products/studentSelfCertificate",data);
  }

}