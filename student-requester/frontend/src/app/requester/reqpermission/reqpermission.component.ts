import { InteractionService } from './../interactionService/interaction.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from "@angular/router";
import swal from 'sweetalert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ServiceService } from '../../common/service.service';
import { RequesterService } from '../service/service.service';

export interface permissionElement {
  name: String;
  Status: String;
}

let PermissionData: permissionElement[];

@Component({
  selector: 'app-reqpermission',
  templateUrl: './reqpermission.component.html',
  styleUrls: ['./reqpermission.component.css']
})
export class ReqpermissionComponent implements OnInit {

  public dataSource:any=null;
  searchString = {
    name: String,
    status: String
  }
  sessionValue;

  permissionReq = {
    requesterID: String,
    status: String
  }
  username: string;
  
  constructor( private fb: FormBuilder,
    private requesterService: RequesterService,
    private service: ServiceService,
    private router: Router,
    private _interactionSerice: InteractionService
   ) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    this.search();
  }
  displayedColumns: string[] = [ 'name','Created_time','status', 'view'];

  search(){
 
    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.requesterID = this.sessionValue;
    this.permissionReq.status = null;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res:any)=>
    { 
      let temp = res.students;
      let array = [];
      for( var i = 0; i < temp.length; i++){
        if(temp[i].Status == 'granted'){
         array.push(temp[i]);
        }
      }
      this.dataSource = array;
      console.log(this.dataSource.length);
    })
  }
  sendData(name:string){
    // this._interactionSerice.sendMessage(name);
    // this.router.navigate(['/requester/edudetails']); 

    this.router.navigate([`/edudetails/${name}`]);
  }
}