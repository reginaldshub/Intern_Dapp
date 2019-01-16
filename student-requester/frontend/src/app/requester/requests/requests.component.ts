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
  
  constructor(
    private requesterService: RequesterService,
    private service: ServiceService
   ) { }

  ngOnInit() {
    this.search();
  }
  displayedColumns: string[] = [ 'name','status'];

  search(){
    this.requesterService.getGrantedList().subscribe((res:any)=>
    { 
      PermissionData = res.students;
      this.dataSource = PermissionData;
    })
  }
}
