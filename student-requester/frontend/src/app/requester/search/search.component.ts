import { Component, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from '../interactionService/interaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequesterService } from '../service/service.service';
import {MatSort, MatTableDataSource} from '@angular/material';

// export interface searchElement {
//   name: String;
//   status: String;
// }

// let SearchData: searchElement[];
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
  
  searchForm: FormGroup;
  status;
  searchResponse= {
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
    status: String,
    id: String
  }
  sessionValue: any;
  username: string;
  permissionReq = {
    requesterID: String,
  }
  searchDataSourceValue: any;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fb: FormBuilder,
    private requesterService: RequesterService,
    private _interactionservice: InteractionService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    this.searchForm = this.fb.group({
      'search': ['', [Validators.required, ]]
      // Validators.pattern('^[A-Za-z]+$')
    });
    this.getRequests();
  }

  displayedColumns: string[] = ['name', 'status'];

  // searchName(name, array){
  //   for (let i=0; i < array.length; i++) {
  //   if(array[i].studentName == name){
  //     console.log(array[i])
  //     this.dataSource = null;
  //     var a = [];
  //     a.push(array[i])
  //     this.dataSource = null;
  //     this.dataSource = a;
  //     console.log("if")
  //   }else{
  //     console.log("else")
  //   }
  // }
// }

  search() {
    this.sessionValue = sessionStorage.getItem('_id');
    this.searchString.id = this.sessionValue;
    this.sessionValue = sessionStorage.getItem('name');
    this.searchString.requesterName = this.sessionValue;
    this.searchString.studentName = this.searchForm.value.search;
    this.requesterService.checkAccess(this.searchString).subscribe((res: any) => {
      let array = [];
      console.log(res)
      if (res.status == "request") {
        this.getRequests();
        this.searchDataSourceValue = true;
        this.searchResponse.id = res.user._id;
        this.searchResponse.studentName = res.user.name;
        this.searchDataSourceName = res.user.name;
        this.searchDataSourceStatus = res.status;
        // this.dataSource = array;
      }
       else if (res.status === "student not registered") {
        this.getRequests();
        this.searchDataSourceValue = true;
        this.searchDataSourceName = this.searchString.studentName;
        this.searchDataSourceStatus = res.status;
      } else if (res.status == "not student") {
        this.getRequests();
        this.searchDataSourceValue = true;
        this.searchDataSourceName = this.searchString.studentName;
        this.searchDataSourceStatus = res.status;
      } 
      else {
        this.searchDataSourceValue = false;
        let name: any = this.searchString.studentName;
        this.dataSource.filter = name.trim();
        // this.searchName(this.searchString.studentName, this.dataSource);
        // console.log(res)
        // this.requestdata.studentName = res.user.studentName;
        // this.requestdata.requesterName = res.user.requesterName;
        // this.requestdata.requesterID = res.user.requesterID;
        // this.requestdata.studentID = res.user.studentID;
        // this.requestdata.Created_time = res.user.Created_time;
        // this.requestdata.Status = res.user.Status;
        // array.push(this.requestdata);
        // this.dataSource = array;
      }
    })
  }

  sendData(name) {
    this.searchDataSourceValue = false;
    // this._interactionservice.sendMessage(name);
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
      // console.log(res);
      this.search();
      this.getRequests();
    })
  }


  getRequests(){
 
    this.sessionValue = sessionStorage.getItem('_id');
    this.permissionReq.requesterID = this.sessionValue;

    this.requesterService.getGrantedList(this.permissionReq).subscribe((res:any)=>
    { 
      // console.log(res);
      let temp = res.students;
      let array = [];
      for( var i = 0; i < temp.length; i++){
         array.push(temp[i]);
      }

      this.dataSource = new MatTableDataSource(array);
      // this.dataSource = array;
      // console.log(this.dataSource);
    })
  }

}//   applyFilter(filterValue: string) {
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
// }