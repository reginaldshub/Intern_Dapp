import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RequesterService } from './../service/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/common/service.service';

export interface Network {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{
  account: string;
  networks: Network[] = [
    { value: 'localhost', viewValue: 'Localhost 8545' },
    { value: 'ropston', viewValue: 'Ropston' },
    { value: 'rinkbey', viewValue: 'Rinkeby' }
  ];

  accountSelection;
  // Account: FormGroup ;
  // CreateForm: FormGroup ;
  createButton: boolean;
  attachButton: boolean;
  Account: FormGroup = new FormGroup({
    network: new FormControl('', Validators.required),
    accountNumber: new FormControl('', Validators.required)
  })

  CreateForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  })
  
  
  constructor(private Service: RequesterService,
    private service: ServiceService, private router: Router) { }

 
    ngOnInit() {
      // this.generateForm();
      // this.onChanges();
    }
    
// onChanges(){
//   this.Account.get('create').valueChanges.subscribe(res =>{

//     if(res === 'true'){
//       this.Account.get('password').enable();
//       if(!this.Account.get('accountNumber').disabled)
//         this.Account.get('accountNumber').disable()
//     }
//     else{
//       this.Account.get('accountNumber').enable()
//       if(!this.Account.get('password').disabled)
//         this.Account.get('password').disable()
//     }
//   })
// }


    // generateForm(){
    //   this.Account = this._fb.group({
    //     network : ['', Validators.required,],
    //     create : [false],
    //     accountNumber:[{ value:'', disabled:true}, Validators.required],
    //     password: [{ value:'', disabled:true}, Validators.required]
    //   })
    // }



  // this.Account= new FormGroup({
  //   network: new FormControl('', Validators.required, ),
  //    accountNumber: new FormControl({ value:'', disabled:this.create}, Validators.required)
  // })

  // this.CreateForm = new FormGroup({
  //   password: new FormControl({ value:'', disabled:this.attach}, Validators.required)
  // })

  


  onSubmit() {
    this.Service.attach(this.Account.value).subscribe((res) => {
      if(res)
      alert("attached")
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }
  create() {
    this.Account.controls['accountNumber'].disable();
    this.Account.controls['network'].disable();
    this.createButton = true;
    this.attachButton = false;
    this.CreateForm.controls['password'].enable();
  }
  attach() {
    this.CreateForm.controls['password'].disable();
    this.createButton = false;
    this.attachButton = true;
    this.Account.controls['network'].enable();
    this.Account.controls['accountNumber'].enable();
  }
  onCreate() {
    this.Service.newaccount(this.CreateForm.value).subscribe((res) => {
      if (res['result']) {
        this.account = res['result'];
      }
    },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      })
  }
}
