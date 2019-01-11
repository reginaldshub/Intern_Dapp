import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { passValidator} from './../../custom-validator'
import { ServiceService } from "../service/service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';

// import 'rxjs/add/operator/map';


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
    console.log(this.myForm.value);
    this.authService.registerUser(this.myForm.value).subscribe(res=>{
      if((res['message']))
      {
      swal("", ""+res['message'], "success");
      this.router.navigate(['/login'])
      }
    })
  
  }
}
