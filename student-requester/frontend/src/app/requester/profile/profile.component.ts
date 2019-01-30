import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequesterService } from "../service/service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';

import { analyzeFile } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceService } from 'src/app/student/service/service.service';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  cookieValue;
  sessionValue;
  profileHider: boolean;
  data: any;

  cookie = {
    userId: String
  }

  session = {
    userId: String
  }

  profileDetails: FormGroup;
  profileForm: FormGroup;
  hide = true;
  post: any;
  userID: string = '';
  name: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  pincode: number;
  url: string = '';
  email: string = '';
  country: string = '';
  phone: number;
  username: string;
  locemail: string;
  account_address: string;


  constructor(private fb: FormBuilder,
    private authService: RequesterService,
    private router: Router,
    private service: ServiceService,
  ) {
  }

  ngOnInit() {
    this.getProfile();
    this.profileDetails = this.fb.group({
      'Id': [''],
      'userId': [''],
      'name': [{ value: '', disabled: true }],
      'address': [''],
      'city': [''],
      'state': [''],
      'pincode': [''],
      'url': [''],
      'email': [{ value: '', disabled: true }],
      'country': [''],
      'phone': ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      'account_address': [{ value: '', disabled: true }]
    });

    this.profileForm = this.fb.group({
      'userId': [this.cookieValue],
      'name': ['', [Validators.required]],
      'address': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'pincode': ['', [Validators.required]],
      'url': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'country': ['', [Validators.required]],
      'phone': ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  getProfile() {
    this.username = sessionStorage.getItem('name');
    this.sessionValue = sessionStorage.getItem('_id');

    this.locemail = localStorage.getItem('email');
    this.session.userId = this.sessionValue;
    this.authService.getProfile(this.session).subscribe((res: any) => {
      console.log(res);
      if (res.hide) {
        this.profileHider = true;
      } else {
        this.profileHider = false;
        this.data = res;
        if (this.data.user.account_address == null)
          this.data.user.account_address = "no account added"


        this.profileDetails.setValue({
          Id: this.data.user._id,
          userId: this.data.user.userId,
          name: this.data.user.name,
          address: this.data.user.address,
          city: this.data.user.city,
          state: this.data.user.state,
          pincode: this.data.user.pincode,
          url: this.data.user.url,
          email: this.data.user.email,
          country: this.data.user.country,
          phone: this.data.user.phone,
          account_address: this.data.user.account_address
        })
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  setProfile() {
    this.profileForm.value.userId = this.sessionValue;
    this.profileForm.value.name = this.username;
    this.profileForm.value.email = this.locemail;
    console.log(this.profileForm.value);
    this.authService.setProfile(this.profileForm.value).subscribe(res => {
      if ((res['message'])) {
        swal("", "" + res['message'], "success");
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  updateProfile() {
    this.profileDetails.value.userId = this.sessionValue;
    this.profileDetails.value.name = this.username;
    this.profileDetails.value.email = this.locemail;

    this.authService.updateProfile(this.profileDetails.value).subscribe(res => {
      if ((res['message'])) {
        swal("", "" + res['message'], "success");
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

}
