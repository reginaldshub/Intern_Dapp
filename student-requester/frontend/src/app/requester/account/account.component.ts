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
  create:boolean = false;
  attach: boolean = false;
  Account: FormGroup ;
  CreateForm: FormGroup ;
  
  
  constructor(private Service: RequesterService, private _fb : FormBuilder,
    private service: ServiceService, private router: Router) { }

 
    ngOnInit() {
      this.generateForm();
      this.onChanges();
    }
    
onChanges(){
  this.Account.get('create').valueChanges.subscribe(res =>{

    if(res === 'true'){
      this.Account.get('password').enable();
      if(!this.Account.get('accountNumber').disabled)
        this.Account.get('accountNumber').disable()
    }
    else{
      this.Account.get('accountNumber').enable()
      if(!this.Account.get('password').disabled)
        this.Account.get('password').disable()
    }
  })
}


    generateForm(){
      this.Account = this._fb.group({
        network : ['', Validators.required,],
        create : [false],
        accountNumber:[{ value:'', disabled:true}, Validators.required],
        password: [{ value:'', disabled:true}, Validators.required]
      })
    }



  // this.Account= new FormGroup({
  //   network: new FormControl('', Validators.required, ),
  //    accountNumber: new FormControl({ value:'', disabled:this.create}, Validators.required)
  // })

  // this.CreateForm = new FormGroup({
  //   password: new FormControl({ value:'', disabled:this.attach}, Validators.required)
  // })

  


  
  onSubmit() {
    debugger
    // this.Service.attach(this.Account.value).subscribe((res) => {
    // }, err => {
    //   if (err instanceof HttpErrorResponse) {
    //     if (err.status === 401) {
    //       this.router.navigate(['/login']);
    //     }
    //   }
    // })
  }

  onCreate() {
    debugger
    // this.Service.newaccount(this.CreateForm.value).subscribe((res) => {
    //   if (res['result']) {
    //     this.account = res['result'];
    //   }
    // },
    //   err => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status === 401) {
    //         this.router.navigate(['/login']);
    //       }
    //     }
    //   })
  }

  createacc(event){
 
   // this.Account.controls['accountNumber'].disable();
   this.create = true;
   this.attach = false;
  } 
   attachacc(event){
   
    //this.Account.controls['password'].disable();
    this.create = false;
    this.attach = true;
  }
}
