import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Network {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account:string;
  networks: Network[] = [
    {value: 'localhost', viewValue: 'Localhost 8545'},
    {value: 'ropston', viewValue: 'Ropston'},
    {value: 'rinkbey', viewValue: 'Rinkeby'}
  ];

  Account: FormGroup = new FormGroup({
    network: new FormControl('',Validators.required),
    accountNumber:new FormControl('',Validators.required)
  })

  Create: FormGroup = new FormGroup({
    password: new FormControl('',Validators.required)
  })
  
  constructor(private service:ServiceService,private router:Router) { }

  ngOnInit() {
  }
  onSubmit(){
    console.log(this.Account.value);
    this.service.attach(this.Account.value).subscribe((res)=>{
      console.log(res);
    },err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.router.navigate(['/login']);
        }
      }
    }) 
  }

  onCreate(){
    console.log(this.Create.value);
    this.service.newaccount(this.Create.value).subscribe((res)=>{
     if(res['result']){
       this.account=res['result'];
     }
    },
    err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.router.navigate(['/login']);
        }
      }
    })
  } 
}
