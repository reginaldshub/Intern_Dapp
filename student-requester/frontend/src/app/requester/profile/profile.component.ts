import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ServiceService } from "../service/service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';
// import { CookieService } from 'ngx-cookie-service';
// import { SessionStorageService} from 'ngx-webstorage';
import { analyzeFile } from '@angular/compiler';

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
  profileHider:boolean;
  data:any;

  cookie = {
    userId:String
  }

  session = {
    userId:String
  }

  profileDetails: FormGroup;
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
    private router: Router,
    // private cookieService: CookieService,
    // private sessionService: SessionStorageService
    ){
  }

  ngOnInit() {
    this.getProfile();
    this.profileDetails = this.fb.group( { 
      'Id': [{value:'', disabled:true}],
      'userId': [{value:'', disabled:true}],     
      'name': ['' ],
      'address': [''],
      'city': [''],
      'state': [''],
      'pincode': [''],
      'url': [''],
      'email': ['', [Validators.required, Validators.email]],
      'country': [''],
      'phone':['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.profileForm = this.fb.group( {
      'userId': [this.cookieValue],     
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
  
  getProfile(){
    // this.cookieValue = this.cookieService.get('_id');
    // this.cookie.userId = this.cookieValue;
    this.sessionValue = sessionStorage.getItem('_id');
    this.session.userId = this.sessionValue;
    console.log(this.session.userId)
    this.authService.getProfile(this.session).subscribe( (res:any) => {
      console.log(res.message);
      if(res.hide){
        this.profileHider = true;
      }else{
        this.profileHider = false;
      this.data = res;
       console.log(" treds "+this.data.user._id);

      this.profileDetails.setValue({
        Id: this.data.user._id,  
        userId: this.data.user.userId,   
        name: this.data.user.name,
        address: this.data.user.address,
        city : this.data.user.city,
        state : this.data.user.state,
        pincode: this.data.user.pincode,
        url: this.data.user.url,
        email: this.data.user.email,
        country: this.data.user.country,
        phone: this.data.user.phone
      })
      console.log("form"+this.profileDetails.value)
      // if(this.data.user.hide == true){
      //     this.profileHider = true;
      // }else{
      //   this.profileHider = false;
      // }
    }
    })
  }

  setProfile(){
    // console.log(this.profileForm.value);
    // this.authService.getProfile().subscribe( res => {
    //   console.log(res);
    // console.log(this.cookieValue);
    this.sessionValue = sessionStorage.getItem('_id');
    // this.profileForm.setValue({ userId: this.cookieValue });
    this.profileForm.value.userId = this.sessionValue;
    console.log( this.profileForm.value.userId);
    this.authService.setProfile(this.profileForm.value).subscribe(res=>{
      if((res['message']))
      {
      swal("", ""+res['message'], "success");
      }
    })
  }

  updateProfile(){
  // console.log(this.profileDetails.value)

    // debugger;
  this.authService.updateProfile(this.profileDetails.value).subscribe(res=>{
    if((res['message']))
    {
    swal("", ""+res['message'], "success");
    }
  })
  }

}
