import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {passValidator} from './../../custom-validator'
import { ServiceService } from "./../service.service";
import { Router } from "@angular/router";
import 'rxjs/add/operator/map';


export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup;
  hide = true;
  post: any;
  name: string = '';
  Roles: string = '';
  phone: number;
  email: string = '';
  password: string = '';
  cnfpassword: string = '';
  
  roles: Role[] = [
    {value: 'student', viewValue: 'Student'},
    {value: 'requester', viewValue: 'Requester'}
  ];

  constructor(private fb: FormBuilder,
    private authService: ServiceService,
    private router: Router){
  }

  ngOnInit() {
    this.myForm = this.fb.group( {
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'Roles': [''],
      'phone':['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      'password': ['', [Validators.required, passValidator, Validators.pattern('^[0-9]*[a-zA-Z0-9]+[a-zA-Z0-9]+[a-zA-Z0-9]+$')]],
      'cnfpassword': ['', [Validators.required, passValidator]]
    });
  }

  initialize(){
    this.myForm.setValue({
      name: '',
      Roles: '',
      phone: "",
      email: '',
      password: '',
      cnfpassword: '',
    })
  }
  abc(){
    const user = {
      name: this.myForm.value.name,
      Roles: this.myForm.value.role,
      phone: this.myForm.value.phone,
      email: this.myForm.value.email,
      password: this.myForm.value.password
    }
  
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        // this.router.navigate(['/login']);
        console.log(data)
      }else{
        this.router.navigate(['/register'])
      }
    })
    // this.initialize();
    }


}
