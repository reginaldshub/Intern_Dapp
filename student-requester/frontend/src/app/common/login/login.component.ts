import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  proliform: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required)
  })

  onSubmit() {
    if (this.proliform.valid)
      console.log(this.proliform.value);
    this.proliform.reset();
  }



}
