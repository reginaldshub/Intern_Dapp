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


  constructor(private fb: FormBuilder,
    private authService: RequesterService,
    private router: Router,
    private service: ServiceService,
  ) {
  }

  ngOnInit() {
    this.getProfile();
    this.profileDetails = this.fb.group({
      'Id': [{ value: '', disabled: true }],
      'userId': [{ value: '', disabled: true }],
      'name': [''],
      'address': [''],
      'city': [''],
      'state': [''],
      'pincode': [''],
      'url': [''],
      'email': ['', [Validators.required, Validators.email]],
      'country': [''],
      'phone': ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
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
    this.session.userId = this.sessionValue;
    this.authService.getProfile(this.session).subscribe((res: any) => {
      if (res.hide) {
        this.profileHider = true;
      } else {
        this.profileHider = false;
        this.data = res;

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
          phone: this.data.user.phone
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
    this.sessionValue = sessionStorage.getItem('_id');
    this.profileForm.value.userId = this.sessionValue;
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
