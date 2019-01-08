import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ServiceService } from "./../service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';

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

  profileForm: FormGroup;
  hide = true;
  post: any;
  // ID: string = '';
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
  

  constructor(private fb: FormBuilder,
    private authService: ServiceService,
    private router: Router){
  }

  ngOnInit() {
    this.profileForm = this.fb.group( {
      'name': ['', [Validators.required]],
      'address': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'pincode': ['', [Validators.required]],
      'url': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'country': ['', [Validators.required]],
      'phone':['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  setProfile(){
    console.log(this.profileForm.value);
    this.authService.getProfile().subscribe( res => {
      console.log(res);
    
    // this.authService.setProfile(this.profileForm.value).subscribe(res=>{
    //   if((res['message']))
    //   {
    //   swal("", ""+res['message'], "success");
    //   }
    // })

  })
  }

}
