import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/common/service.service';
import { RequesterService } from '../service/service.service';
import { Router } from '@angular/router';
import { InteractionService } from '../interactionService/interaction.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  public dataSource:any=null;
  searchString = {
    name: String,
    status: String
  }
  sessionValue;
  
  constructor( private fb: FormBuilder,
    private requesterService: RequesterService,
    private service: ServiceService,
    private router: Router,
    private _interactionSerice: InteractionService
   ) { }
   permissionReq = {
    requesterID: String,
  }

  ngOnInit() {
    this.search();
  }
  displayedColumns: string[] = [ 'name','Created_time','status', 'view'];

  search(){
   
    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.requesterID = this.sessionValue;
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
    })
  }
  sendData(name){
    this._interactionSerice.sendMessage(name);
  }

}
