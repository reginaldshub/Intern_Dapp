import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  setStudentProfile(data){
    console.log(data);
    return this.http.post("http://localhost:3000/products/setstudentprofile",data);
  }

  getStudentProfile(id){
    // console.log("id is "+id);
    return this.http.post("http://localhost:3000/products/getstudentprofile", id);
  }

  updateStudentProfile(data){
console.log("tony"+data.Id);
  // debugger;
    return this.http.put("http://localhost:3000/products/student/"+`${data.userId}`,data);
  }
}
