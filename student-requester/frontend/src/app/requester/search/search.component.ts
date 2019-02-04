import { Component, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from '../interactionService/interaction.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, } from '@angular/forms';
import { RequesterService } from '../service/service.service';
import { MatSort, MatTableDataSource } from '@angular/material';


export const atLeastOne = (validator: ValidatorFn) => (
  group: FormGroup,
): ValidationErrors | null => {
  const hasAtLeastOne = group && group.controls && Object.keys(group.controls)
    .some(k => !validator(group.controls[k]));

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

export interface UserData {
  Created_time: Date;
  Status: String;
  requesterID: String;
  requesterName: String;
  studentID: String;
  studentName: String;
  _id: String;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
   disable= [];
  searchForm: FormGroup;
  status;
  searchResponse = {
    id: String,
    studentName: String
  };
  dataSource: MatTableDataSource<UserData>;
  searchDataSourceName;
  searchDataSourceStatus;

  requestdata = {
    requesterName: String,
    studentName: String,
    requesterID: String,
    studentID: String,
    Created_time: Date,
    Status: String
  }

  searchString = {
    requesterName: String,
    studentName: String,
    email: String,
    status: String,
    id: String,
  
  }
  sessionValue: any;
  username: string;
  permissionReq = {
    requesterID: String,
  }
  checkStatus={
    studentID:String,
    requesterID:String
  }
  searchDataSourceValue: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  showSpinner: boolean = false;
  constructor(private fb: FormBuilder,
    private requesterService: RequesterService,
    private _interactionservice: InteractionService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    this.searchForm = this.fb.group({
      'name': [''],
      'email': ['', [Validators.email]]
    }, { validator: atLeastOne(Validators.required) });

    this.getRequests();
  }

  displayedColumns: string[] = ['name', 'status','checkstatus'];

  search() {
    this.showSpinner = true;
    this.sessionValue = sessionStorage.getItem('_id');
    this.searchString.id = this.sessionValue;
    this.sessionValue = sessionStorage.getItem('name');
    this.searchString.requesterName = this.sessionValue;
    this.searchString.studentName = this.searchForm.value.name;
    this.searchString.email = this.searchForm.value.email;
    this.requesterService.checkAccess(this.searchString).subscribe((res: any) => {
      let array = [];
      console.log("response",+res);
      this.showSpinner = false;
      if (res.status == "request") {
        this.getRequests();
        this.searchDataSourceValue = true;
        this.searchResponse.id = res.user._id;
        this.searchResponse.studentName = res.user.name;
        this.searchDataSourceName = res.user.name;
      }
      else if (res.status === "Not Found") {
        this.searchDataSourceValue = true;
        this.searchDataSourceName = this.searchString.studentName;
        this.searchDataSourceStatus = res.status;
      }
      //  else if (res.status == "not student") {
      //   this.searchDataSourceValue = true;
      //   this.searchDataSourceName = this.searchString.studentName;
      //   this.searchDataSourceStatus = res.status;
      // }
      else {
        this.searchDataSourceValue = false;
        let name: any = this.searchString.studentName;
        this.dataSource.filter = name.trim();
      }
    })
  }

  sendData(name) {
    this.searchDataSourceValue = false;
    let sessionValue: any = sessionStorage.getItem('_id');
    let sessionNameValue: any = sessionStorage.getItem('name');
    let date: any = new Date();
    let temp: any = "pending";
    this.requestdata.studentName = name;
    this.requestdata.requesterName = sessionNameValue
    this.requestdata.requesterID = sessionValue;
    this.requestdata.studentID = this.searchResponse.id;
    this.requestdata.Created_time = date;
    this.requestdata.Status = temp;

    this.requesterService.request(this.requestdata).subscribe((res: any) => {
      this.search();
      this.getRequests();
    })
  }


  getRequests() {

    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.requesterID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res: any) => {
    
      let temp = res.students;
      let array = [];
      for (var i = 0; i < temp.length; i++) {
        array.push(temp[i]);
        console.log(res.students[i].Status)
      }

      this.dataSource = new MatTableDataSource(array);
      console.log(this.dataSource.data.length);
    })
  }

  Checkstatus(requestid,studentid){
    this.checkStatus.requesterID=requestid;
    this.checkStatus.studentID=studentid
    console.log(this.checkStatus);
    this.requesterService.checkstatus(this.checkStatus).subscribe((res: any) => {
      console.log(res)
  })
}
}