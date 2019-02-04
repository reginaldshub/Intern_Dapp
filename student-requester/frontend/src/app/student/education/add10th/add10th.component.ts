import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';

import { NgForm } from "@angular/forms";
@Component({
  selector: 'app-add10th',
  templateUrl: './add10th.component.html',
  styleUrls: ['./add10th.component.css']
})
export class Add10thComponent implements OnInit {

  disableBtn: boolean = true;
  add10th: FormGroup
  id: string;
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.add10th = this.fb.group({
      id: [''],
      studentid: [''],
      ecategory: ['', Validators.required],
      Startyear: ['', Validators.required],
      Endyear: ['', Validators.required],
      addsubjects: this.fb.array([this.addSubjectGroup()])
    });
  }
  ngOnInit() {
    this.id = sessionStorage.getItem('_id');
    this.add10th.valueChanges.subscribe((changedObj: any) => {

      // console.log(changedObj.addsubjects.length)
      for (let i = 0; i < changedObj.addsubjects.length; i++) {
        console.log(changedObj.addsubjects[i])
        if (changedObj.addsubjects[i].subjectname != "" && changedObj.addsubjects[i].subjectmarks != "") {
          this.disableBtn = false;
        }else {
          this.disableBtn = true;
          break;
        }
      }

    });
  }
  addSubjectGroup() {
    return this.fb.group({
      subjectname: ['', Validators.required],
      subjectmarks: ['', Validators.required]
    });
  }



  get subjectArray() {
    return <FormArray>this.add10th.get('addsubjects');
  }

  Add() {
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    if ((this.add10th.value.addsubjects.length) > 1)
      this.subjectArray.removeAt(index);
  }

  submit() {
    this.add10th.value.studentid = this.id;
    console.log(this.add10th.value);
    console.log("student id", this.add10th.value.studentid);
    this.service.add(this.add10th.value).subscribe((res) => {
      console.log(res);
    })
  }


}