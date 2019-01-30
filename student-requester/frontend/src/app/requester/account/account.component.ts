import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
export class AccountComponent implements OnInit {
  account: string;
  networks: Network[] = [
    { value: 'localhost', viewValue: 'Localhost 8545' },
    { value: 'ropston', viewValue: 'Ropston' },
    { value: 'rinkbey', viewValue: 'Rinkeby' }
  ];
  
  Create: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  })

  Account: FormGroup= new FormGroup({
    network: new FormControl('', Validators.required),
    accountNumber: new FormControl('', Validators.required)
  })
  constructor(private Service: RequesterService,
    private service: ServiceService, private router: Router) { 
      
    }

  ngOnInit() {
  }
  
  onSubmit() {
   console.log(this.Account.value);
    this.Service.attach(this.Account.value).subscribe((res) => {
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  onCreate() {
    console.log(this.Create.value);
    this.Service.newaccount(this.Create.value).subscribe((res) => {
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
