import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  setProfile(data){
    console.log(data);
    return this.http.post("http://localhost:3000/products/setprofile",data);
  }

  getProfile(id){
    // console.log("id is "+id);
    return this.http.post("http://localhost:3000/products/getprofile", id);
  }

  updateProfile(data){
console.log("tony"+data.userId);
  // debugger;
    return this.http.put("http://localhost:3000/products/requester/"+`${data.userId}`,data);
  }
}
