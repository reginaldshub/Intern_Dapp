import { Component, OnInit } from '@angular/core';
import { RequesterService } from 'src/app/requester/service/service.service';
import { StudentService } from '../student.service';

interface type{
  name: String,
  created_Time: Date,
  status: String
}

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
s
  public data_array:type[]=[];
  


  constructor(private requesterService: RequesterService,private service :StudentService) { }

  ngOnInit() {
    this.search();
  }

  displayedColumns: string[] = ['name', 'Created_time', 'status', 'accept', 'reject'];
  search() {

    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.studentID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res: any) => {
console.log(res);
      for (var i = 0; i < res.students.length; i++) {
        this.data_array[i].name = res.name[i];
        this.data_array[i].status = res.students[i].Status;
        this.data_array[i].created_Time = res.students[i].Created_time;
      }
      this.dataSource = this.data_array;
    })
  }
  grant(data) {
    console.log(data);
    this.service.grantc(data).subscribe((res)=>{
      console.log(res);
    })
  }
  deny(data){
    console.log(data);
  }

}
