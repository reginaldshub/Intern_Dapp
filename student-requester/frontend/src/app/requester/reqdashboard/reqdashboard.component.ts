import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from "@angular/router";
import swal from 'sweetalert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../common/service.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RequesterService } from '../service/service.service';
import { InteractionService } from '../interactionService/interaction.service';


export interface searchElement {
  name: String;
  status: String;
}
let SearchData: searchElement[];
@Component({
  selector: 'app-reqdashboard',
  templateUrl: './reqdashboard.component.html',
  styleUrls: ['./reqdashboard.component.css']
})

export class ReqdashboardComponent implements OnInit {
  cookieValue;
  searchForm: FormGroup;
  public dataSource:any=null;
  searchString = {
    name: String,
    status: String
  }

  constructor(private fb: FormBuilder,
    private authService: ServiceService,
    private requesterService: RequesterService,
    private router: Router,
    private _interactionservice : InteractionService) { }

      // greetStudent(){
      //   this._interactionservice.sendMessage('Good morning');
      // }
      // appreciateSudent(){
      //   this._interactionservice.sendMessage('Well Done');
      // }

    @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.searchForm = this.fb.group({
      'search': ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]]
    }); 
  }

  displayedColumns: string[] = [ 'name','status'];

  // applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();


    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  // }

  navigate() {
    this.router.navigate(['/account'])
  }
  
  profile() {
    this.router.navigate(['/requester/profile']);
  }
  search(){
    this.searchString.name = this.searchForm.value.search;
    this.requesterService.checkAccess(this.searchString).subscribe((res:any)=>
    { 
      SearchData = res.user;
      this.dataSource = SearchData;
    // this.dataSource = new MatTableDataSource(SearchData);
    // console.log(this.dataSource);
    // this.dataSource.paginator = this.paginator;
    })
  }

  sendData(name){
    this._interactionservice.sendMessage(name);   

    // setInterval(() => this.router.navigate(['/requester/edudetails']), 500);
  }
}