import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceService } from "../service/service.service";
import { Router } from "@angular/router";
import { StudentService } from '../student.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  id: string;
  data: any;
  sessionValue: any; 
  session = {
    userId: String
  }
  username: string;
  locemail: string;
  profileResponse: boolean = false;
  
  constructor(private service : ServiceService,
    private router: Router,
    private studentservice: StudentService) { }

  ngOnInit() {
    this.getProfile();
  }

  account;

  Create: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  })
  getProfile() {
    this.sessionValue = sessionStorage.getItem('_id');
    this.session.userId = this.sessionValue;
    this.username = sessionStorage.getItem('name');
    this.locemail = localStorage.getItem('email');
    console.log(this.session);
    this.service.getStudentProfile(this.session).subscribe((res: any) => {
        this.data = res.user;
        this.profileResponse = true;
        console.log(this.data);
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  // testing collapse

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showSpinner: boolean;

 
  onCreate() {
    this.showSpinner = true;
    console.log(this.Create.value)
    this.studentservice.commit(this.Create.value).subscribe((res) => {
      console.log(this.account = res['message']);
      if (res){
        this.showSpinner = false;
        this.resetForms();
      }
    })
  }
  resetForms() {
    this.Create.setValue({
      password: '',
    })
  }

}
