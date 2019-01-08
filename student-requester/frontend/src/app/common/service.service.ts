import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  registerUser(user){
    // console.log(user);
    // debugger;
    return this.http.post("http://localhost:3000/products/register",user);
  }
  login(user){
    debugger;
    console.log(user);
    return  this.http.post("http://localhost:3000/products/login",user);
  }
}
