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
    console.log(this.proliform.value);
    this.service.login(this.proliform.value).subscribe((res) => {
      console.log(res);
      if (res['role'] == "student") {
        swal("", "" + res['message'], "success");
        this.router.navigate(['/student'])
      }else if(res['role']== "requester"){
        swal("", "" + res['message'], "success");
        this.router.navigate(['/requester'])
      }

    })

  }
}
