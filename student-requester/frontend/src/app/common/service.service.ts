import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  registerUser(user) {
    console.log("in service")
    return this.http.post("http://localhost:3000/products/register", user);
  }
  login(user) {
    return this.http.post("http://localhost:3000/products/login", user);
  }

  newaccount(user) {
    user.email = localStorage.getItem('email');
    return this.http.post("http://localhost:3000/products/create", user);
  }
  logoutUser() {
    let email = localStorage.getItem('email');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    sessionStorage.removeItem('_id');
  }

  attach(user) {
    user.email = localStorage.getItem('email');
    return this.http.post("http://localhost:3000/products/set", user)
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
