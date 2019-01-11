import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  setProfile(data) {
    return this.http.post("http://localhost:3000/products/setprofile", data);
  }

  getProfile(id) {
    return this.http.post("http://localhost:3000/products/getprofile", id);
  }

  updateProfile(data) {
    return this.http.put("http://localhost:3000/products/requester/" + `${data.userId}`, data);
  }
}
