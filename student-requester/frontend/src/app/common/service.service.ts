import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/addAccount', user, {headers: headers})
    .map(res => res.json());
  }
}
