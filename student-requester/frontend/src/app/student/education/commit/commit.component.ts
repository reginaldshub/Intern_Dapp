import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StudentService } from '../../student.service';
@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent implements OnInit {
  showSpinner: boolean;
  Account: string;

  constructor(private service: StudentService) { }
  account;
  ngOnInit() {
    this.Account = sessionStorage.getItem('account');
  }

  Create: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    account: new FormControl('')
  })
  onCreate() {
    this.showSpinner = true;
    console.log(this.Create)
    this.Create.value.Account = this.Account;
    console.log(this.Create.value)
    this.service.commit(this.Create.value).subscribe((res) => {
      console.log(this.account = res['message']);
      if (res){
        this.showSpinner = false;
        this.resetForms();
      }
    })
  }
  resetForms() {
    this.Create.setValue({
      password: '',
    })
  }
}
