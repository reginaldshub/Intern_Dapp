import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/common/service.service';
import { RequesterService } from '../service/service.service';

export interface permissionElement {
  name: String;
  Status: String;
}

let PermissionData: permissionElement[];

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  public dataSource:any=null;
  searchString = {
    name: String,
    status: String
  }
  sessionValue;
  permissionReq = {
    requesterID: String,
  }
  username: string;
  constructor(
    private requesterService: RequesterService,
    private service: ServiceService
   ) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    this.search();
  }
  displayedColumns: string[] = [ 'name','status'];

  search(){
 
    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.requesterID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res:any)=>
    { 
      console.log(res);
      let temp = res.students;
      let array = [];
      for( var i = 0; i < temp.length; i++){
         array.push(temp[i]);
      }
      this.dataSource = array;
    })
  }
}
