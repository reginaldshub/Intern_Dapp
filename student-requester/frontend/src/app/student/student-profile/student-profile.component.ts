import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from "../service/service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';
import { HttpErrorResponse } from '@angular/common/http';

export interface Gender {
  value: string;
  viewValue: string;
}

export interface State {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit {
  cookieValue;
  sessionValue;
  profileHider: boolean = true;
  data: any;
  maxDate;

  cookie = {
    userId: String
  }

  session = {
    userId: String
  }

  state: State[] = [
    {value: 'Andhra Pradesh', viewValue: 'Andhra Pradesh'},
    {value: 'Arunachal Pradesh', viewValue: 'Arunachal Pradesh'},
    {value: 'Assam', viewValue: 'Assam'},
    {value: 'Bihar', viewValue: 'Bihar'},
    {value: 'Goa', viewValue: 'Goa'},
    {value: 'Gujarat', viewValue: 'Gujarat'},
    {value: 'Haryana', viewValue: 'Haryana'},
    {value: 'Himachal Pradesh', viewValue: 'Himachal Pradesh'},
    {value: 'Jammu & Kashmir', viewValue: 'Jammu & Kashmir'},
    {value: 'Karnataka', viewValue: 'Karnataka'},
    {value: 'Kerala', viewValue: 'Kerala'},
    {value: 'Madhya Pradesh', viewValue: 'Madhya Pradesh'},
    {value: 'Maharashtra', viewValue: 'Maharashtra'},
    {value: 'Manipur', viewValue: 'Manipur'},
    {value: 'Meghalaya', viewValue: 'Meghalaya'},
    {value: 'Mizoram', viewValue: 'Mizoram'},
    {value: 'Nagaland', viewValue: 'Nagaland'},
    {value: 'Orissa', viewValue: 'Orissa'},
    {value: 'Punjab', viewValue: 'Punjab'},
    {value: 'Rajasthan', viewValue: 'Rajasthan'},
    {value: 'Sikkim', viewValue: 'Sikkim'},
    {value: 'Tamil Nadu', viewValue: 'Tamil Nadu'},
    {value: 'Tripura', viewValue: 'Tripura'},
    {value: 'Uttar Pradesh', viewValue: 'Uttar Pradesh'},
    {value: 'West Bengal', viewValue: 'West Bengal'},
    {value: 'Chhattisgarh', viewValue: 'Chhattisgarh'},
    {value: 'Uttarakhand', viewValue: 'Uttarakhand'},
    {value: 'Jharkhand', viewValue: 'Jharkhand'},
    {value: 'Telangana', viewValue: 'Telangana'}
  ];

  profileDetails: FormGroup;
  profileForm: FormGroup;
  hide = true;
  post: any;
  userID: string = '';
  name: string = '';
  address: string = '';
  city: string = '';
  // state: string = '';
  pincode: number;
  gender: string = '';
  dob: Date;
  country: string = '';
  phone: number;
  username: string;
  locemail: string;
  account_address: string;

  GENDER: Gender[] = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' }
  ];


  constructor(private fb: FormBuilder,
    private authService: ServiceService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.getProfile();
    this.profileDetails = this.fb.group({
      'Id': [{ value: '', disabled: true }],
      'userId': [{ value: '', disabled: true }],
      'name': [{ value: '', disabled: true }],
      'address': ['', [Validators.required]],
      'city': [''],
      'state': [''],
      'pincode': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      'gender': ['', [Validators.required]],
      'dob': ['', [Validators.required]],
      'country': ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
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
      'gender': ['', [Validators.required]],
      'dob': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'phone': ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  getProfile() {
    this.sessionValue = sessionStorage.getItem('_id');
    this.session.userId = this.sessionValue;
    this.username = sessionStorage.getItem('name');
    this.locemail = localStorage.getItem('email');
    console.log(this.session);
    this.authService.getStudentProfile(this.session).subscribe((res: any) => {
      if (res.hide) {
        this.profileHider = true;
      } else {
        this.profileHider = false;
        this.data = res;
        if (this.data.user.account_address == null)
          this.data.user.account_address = "no account added";
        this.profileDetails.setValue({
          Id: this.data.user._id,
          userId: this.data.user.userId,
          name: this.data.user.name,
          address: this.data.user.address,
          city: this.data.user.city,
          state: this.data.user.state,
          pincode: this.data.user.pincode,
          gender: this.data.user.gender,
          dob: this.data.user.dob,
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
    this.profileForm.value.userId = this.sessionValue;
    this.authService.setStudentProfile(this.profileForm.value).subscribe(res => {
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
    console.log(this.profileDetails.value)
    this.authService.updateStudentProfile(this.profileDetails.value).subscribe(res => {
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
