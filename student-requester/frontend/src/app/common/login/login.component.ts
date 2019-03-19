import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit() {
  }

  proliform: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required)
  })

  onSubmit() {
    localStorage.setItem('email', this.proliform.value.email);
    this.service.login(this.proliform.value).subscribe((res) => {
      sessionStorage.setItem('name', res['name']);
      if (res['role'] == "student") {
        // swal("", "" + res['message'], "success");
        sessionStorage.setItem('_id', res['_id']);
        sessionStorage.setItem('name', res['name']);
        localStorage.setItem('token', res['token']);
        console.log(res);
        if (res['account'])
          sessionStorage.setItem('account', res['account']);
        this.router.navigate(['/student'])
      } else if (res['role'] == "requester") {
        // swal("", "" + res['message'], "success");
        sessionStorage.setItem('_id', res['_id']);
        sessionStorage.setItem('name', res['name']);
        localStorage.setItem('token', res['token']);
        if (res['account'])
          sessionStorage.setItem('account', res['account']);
        this.router.navigate(['/requester'])
      } else {
        swal("", "" + res['message'], "error");
      }
    },
      (error) => {
        swal("", "" + error.error.message, "error");
      })

  }
}
