import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from './../../common/service.service';
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
  account: string;
  networks: Network[] = [
    { value: 'localhost', viewValue: 'Localhost 8545' },
    { value: 'ropston', viewValue: 'Ropston' },
    { value: 'rinkbey', viewValue: 'Rinkeby' }
  ];
  createButton;
  attachButton;
  Account: FormGroup = new FormGroup({
    network: new FormControl('', Validators.required),
    accountNumber: new FormControl('', Validators.required)
  })

  Create: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  })

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit() {
    this.Account.controls['network'].disable();
    this.Account.controls['accountNumber'].disable();
  }
  onSubmit() {
    console.log(this.Account.value);
    this.service.attach(this.Account.value).subscribe((res) => {
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
    this.Create.controls['password'].enable();
  }
  attach() {
    this.Create.controls['password'].disable();
    this.createButton = false;
    this.attachButton = true;
    this.Account.controls['network'].enable();
    this.Account.controls['accountNumber'].enable();
  }
  onCreate() {
    console.log(this.Create.value);
    this.service.newaccount(this.Create.value).subscribe((res) => {
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
