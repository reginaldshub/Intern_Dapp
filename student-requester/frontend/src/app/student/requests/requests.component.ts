import { Component, OnInit } from '@angular/core';
import { RequesterService } from 'src/app/requester/service/service.service';
import { StudentService } from '../student.service';

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
  constructor(private requesterService: RequesterService,private service: StudentService) { }

  ngOnInit() {
    this.search();
  }

  displayedColumns: string[] = [ 'name','Created_time','status','accept','reject'];
  search() {

    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.studentID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res: any) => {
      this.dataSource = res.students;
    })
  }
  grant(data){
    console.log(data);
    this.service.grantc(data).subscribe((res)=>{
      console.log(res);
    })
  }
  deny(data){
    console.log(data);
  }

}
