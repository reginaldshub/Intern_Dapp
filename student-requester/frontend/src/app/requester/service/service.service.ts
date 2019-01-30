import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequesterService {


  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();
 
  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();
 
  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }
 
  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }

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

  checkAccess(data){
    return this.http.post("http://localhost:3000/products/checkaccess", data);
  }

  getGrantedList(data){
    return this.http.post("http://localhost:3000/products/grantedlist", data);
  }

  request(data){
    console.log(data);
    return this.http.post("http://localhost:3000/products/request", data);
  }
  
  getCertificate(name){
    console.log(name)
    return this.http.post("http://localhost:3000/products/certificate", name);
  }

  newaccount(user) {
    user._id = sessionStorage.getItem('_id');
    return this.http.post("http://localhost:3000/products/reqcreate", user);
  }
  
  attach(user) {
    user.email = localStorage.getItem('email');
    return this.http.post("http://localhost:3000/products/reqset", user)
  }
  
}