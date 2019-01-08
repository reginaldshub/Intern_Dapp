import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  setProfile(data){
    return this.http.post("http://localhost:3000/products/profile",data);
  }
  getProfile(){
    return this.http.get("http://localhost:3000/products/getprofile");
  }

}
