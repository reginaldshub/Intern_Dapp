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
  searchResponse;
  public dataSource: any = null;

  requestdata = {
    name: String,
    requesterID: String,
    studentID: String,
    Created_time: Date,
    Status: String
  }

  searchString = {
    name: String,
    status: String
  }
  constructor(private fb: FormBuilder,
    private requesterService: RequesterService,
    private _interactionservice: InteractionService) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      'search': ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]]
    });
  }

  displayedColumns: string[] = ['name', 'status'];

  search() {
    this.searchString.name = this.searchForm.value.search;
    this.requesterService.checkAccess(this.searchString).subscribe((res: any) => {
      let array = [];
      this.status = res.status;
      if (res.status == "request") {
        this.searchResponse = res.user;
        array.push(res.user);
        this.dataSource = array;
      } else if (res.status === "student not registered") {
        array = [{ "name": this.searchForm.value.search }];
        this.dataSource = array;
      } else if (res.status == "not student") {
        array = [{ "name": this.searchForm.value.search }];
        this.dataSource = array;
      } else {
        this.requestdata.name = res.name;
        array.push(this.requestdata);
        this.dataSource = array;
      }
    })
  }

  sendData(name) {
    // this._interactionservice.sendMessage(name);
    let sessionValue: any = sessionStorage.getItem('_id');
    let date: any = new Date();
    let temp: any = "pending";
    this.requestdata.name = name;
    this.requestdata.requesterID = sessionValue;
    this.requestdata.studentID = this.searchResponse._id;
    this.requestdata.Created_time = date;
    this.requestdata.Status = temp;

    this.requesterService.request(this.requestdata).subscribe((res: any) => {
      console.log(res);
    })
  }
}