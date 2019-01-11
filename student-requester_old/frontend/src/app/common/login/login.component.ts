import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private service: ServiceService, 
              private router: Router,
              // private cookieService: CookieService
              ) { }

  ngOnInit() {
  }

  proliform: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required)
  })

  onSubmit() {
    console.log(this.proliform.value);
    this.service.login(this.proliform.value).subscribe((res) => {
      console.log(res);
      if (res['role'] == "student") {
        sessionStorage.setItem('_id', res['_id']);
        swal("", "" + res['message'], "success");
        this.router.navigate(['/student'])
      }else if(res['role']== "requester"){
        // this.cookieService.set( '_id', res['_id'] );
        sessionStorage.setItem('_id', res['_id']);
        swal("", "" + res['message'], "success");
        this.router.navigate(['/requester'])
      }else{
        swal("", "" + res['message'], "error");
      }

    })

  }
}
