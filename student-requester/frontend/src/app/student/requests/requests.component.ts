
import { Component, OnInit } from '@angular/core';
import { RequesterService } from 'src/app/requester/service/service.service';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  sessionValue;
  public dataSource: any = null;
  permissionReq = {
    studentID: String,
  }
requester_status = {
  studentID: String,
  requesterID: String,
  Status: String
}
  data_array = [{
    name: String,
    created_Time: Date,
    status: String
  }]

  constructor(private requesterService: RequesterService,
    private service: ServiceService) { }

  ngOnInit() {
    this.search();
  }

  displayedColumns: string[] = ['name', 'Created_time', 'status', 'accept', 'reject'];
  search() {

    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.studentID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res:any)=>
    { 
      let temp = res.students;
      let array = [];
      for( var i = 0; i < temp.length; i++){
        // if(temp[i].Status == 'pending'){
         array.push(temp[i]);
        // }
      }
      this.dataSource = array;
    })
  }

  grant(req, stu) {    
    let status: any = "granted";
    this.requester_status.studentID = stu;
    this.requester_status.requesterID = req;
    this.requester_status.Status = status;
    this.service.requesterPermit(this.requester_status).subscribe((res:any)=>{ 
      console.log(res)
    })
    
  }

  deny(req, stu) {
    let status: any = "denied";
    this.requester_status.studentID = stu;
    this.requester_status.requesterID = req;
    this.requester_status.Status = status;
    this.service.requesterPermit(this.requester_status).subscribe((res:any)=>{ 
      console.log(res)
    })
  }

}
