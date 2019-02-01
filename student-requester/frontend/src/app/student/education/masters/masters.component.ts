import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {

  masters: FormGroup;
  id: string;
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.masters = this.fb.group({
      id: [],
      studentid: [],
      ecategory: [],
      Startyear: [],
      Endyear: [],
      Branchname:[],
      addsubjects: this.fb.array([this.addSubjectGroup()])
    });
  }
  ngOnInit() {
    this.id = sessionStorage.getItem('_id');
  }
  addSubjectGroup() {
    return this.fb.group({
      subjectname: ['', Validators.required],
      subjectmarks: ['', Validators.required]
    });
  }



  get subjectArray() {
    return <FormArray>this.masters.get('addsubjects');
  }

  Add(){
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    if(index >  1)
    this.subjectArray.removeAt(index);
  }

  submit() {
    this.masters.value.studentid = this.id;
    console.log("student id",this.masters.value.studentid);
     this.service.add(this.masters.value).subscribe((res)=>{
       console.log(res);
     })
  }
}
