import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../interactionService/interaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequesterService } from '../service/service.service';

// export interface searchElement {
//   name: String;
//   status: String;
// }

// let SearchData: searchElement[];

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
  public dataSource: any = null;

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
  constructor(private fb: FormBuilder,
    private requesterService: RequesterService,
    private _interactionservice: InteractionService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    this.searchForm = this.fb.group({
      'search': ['', [Validators.required]]
      // Validators.pattern('^[A-Za-z]+$')
    });
  }

  displayedColumns: string[] = ['name', 'status'];

  search() {
    this.sessionValue = sessionStorage.getItem('_id');
    this.searchString.id = this.sessionValue;
    this.sessionValue = sessionStorage.getItem('name');
    this.searchString.requesterName = this.sessionValue;
    this.searchString.studentName = this.searchForm.value.search;
    this.requesterService.checkAccess(this.searchString).subscribe((res: any) => {
      let array = [];
      this.status = res.status;
      if (res.status == "request") {
        console.log(res);
        this.searchResponse.id = res.user._id;
        this.searchResponse.studentName = res.user.name;
        array.push(this.searchResponse);
        this.dataSource = array;
      } else if (res.status === "student not registered") {
        array = [{ "studentName": this.searchForm.value.search }];
        this.dataSource = array;
      } else if (res.status == "not student") {
        array = [{ "studentName": this.searchForm.value.search }];
        this.dataSource = array;
      } else {
        console.log(res)
        this.requestdata.studentName = res.user.studentName;
        this.requestdata.requesterName = res.user.requesterName;
        this.requestdata.requesterID = res.user.requesterID;
        this.requestdata.studentID = res.user.studentID;
        this.requestdata.Created_time = res.user.Created_time;
        this.requestdata.Status = res.user.Status;
        array.push(this.requestdata);
        this.dataSource = array;
      }
    })
  }

  sendData(name) {
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
      console.log(res);
      this.search();
    })
  }
}