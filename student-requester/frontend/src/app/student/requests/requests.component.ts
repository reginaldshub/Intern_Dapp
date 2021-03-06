import { MatSnackBar } from '@angular/material';

import { Component, OnInit } from '@angular/core';
import { RequesterService } from 'src/app/requester/service/service.service';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
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
  showSpinner: boolean = false;
  dataSourceLength: boolean = false;
  public message: string;

  constructor(private requesterService: RequesterService,
    private service: ServiceService, private router: Router,
    private bottomSheet: MaterialModule, private snackBar: MatSnackBar) { }
  public disable = [];
  public disablestatus = [];

  ngOnInit() {
    this.message = "testing";
    this.showSpinner = true;
    this.search();
    this.openSnackBar();
  }
  displayedColumns: string[] = ['name', 'Created_time', 'status', 'accept', 'reject'];
  search() {

    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.studentID = this.sessionValue;
    this.requesterService.getGrantedList(this.permissionReq).subscribe((res: any) => {
      let temp = res.students;
      console.log(res)
      let array = [];
      for (var i = 0; i < temp.length; i++) {
        // if(temp[i].Status == 'pending'){
        array.push(temp[i]);
        console.log(temp[i].Status)
        this.disable[i] = temp[i].Status !== "pending" ? false : true;
        this.disablestatus[i]=(temp[i].Status !== "Pending") ? false : true;
        // console.log(this.disable)
        // }
      }

      this.showSpinner = false;
      this.dataSource = array;
      if (this.dataSource.length == 0)
        this.dataSourceLength = true;
      else
        this.dataSourceLength = false;
      // console.log(this.dataSource)
    })
  }

  grant(req, stu, i, requesterName) {
    this.disable[i] = false;
    let status: any = "granted";
    this.requester_status.studentID = stu;
    this.requester_status.requesterID = req;
    this.requester_status.Status = status;
    this.service.grant(this.requester_status).subscribe((res: any) => {
      console.log(res);
      this.message = `Access Granted to ${requesterName}`;
      this.snackBar.openFromComponent(StatusComponent, {
        duration: 1000,
      });
      this.search();
    },
    (error) => {
      // swal("", "" + error.error.message, "error");
    })
  }

  deny(req, stu, i) {
    this.disable[i] = false;
    let status: any = "denied";
    this.requester_status.studentID = stu;
    this.requester_status.requesterID = req;
    this.requester_status.Status = status;
    this.service.deny(this.requester_status).subscribe((res: any) => {
      console.log(res)
      if(res.status == "denyHash"){ 
        this.disable[i] = false;
        }
      this.disable[i] = false;
      this.search();
    })
    this.search();
  }
  // checkstatus(req, stu, i) {
  //   console.log(i);
  //   this.requester_status.studentID = stu;
  //   this.requester_status.requesterID = req;
  //   this.service.checkstatus(this.requester_status).subscribe((res: any) => {
  //     console.log(res.res)
  //     // alert(res.res)
  //     this.search();
  //   })
  // }
  openSnackBar() {
    this.snackBar.openFromComponent(StatusComponent, {
      duration: 500,
    });
  }

}
@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`
    .example-pizza-party {
      color: hotpink;
    }
  `],
})
export class StatusComponent {
  // printmessage: string;
  // constructor(_req: RequestsComponent){
  //   this.printmessage = _req.message;
  //   console.log(_req.message)
  // }
}
