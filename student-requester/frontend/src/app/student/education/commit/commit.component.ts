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

  constructor(private service: StudentService) { }
  account;
  ngOnInit() {
  }

  Create: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required)
  })
  onCreate() {
    this.showSpinner = true;
    console.log(this.Create.value)
    this.service.commit(this.Create.value).subscribe((res) => {
      console.log(this.account = res['message']);
      if (res)
        this.showSpinner = false;
    })
  }
}
