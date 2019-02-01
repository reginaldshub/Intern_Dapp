import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';
@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})
export class DegreeComponent implements OnInit {

  degree: FormGroup
  id: string;
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.degree = this.fb.group({
      id:[],
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
    return <FormArray>this.degree.get('addsubjects');
  }

  Add(){
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    if(index >  1)
    this.subjectArray.removeAt(index);
  }

  submit() {
    this.degree.value.studentid = this.id;
    console.log("student id",this.degree.value.studentid);
     this.service.add(this.degree.value).subscribe((res)=>{
       console.log(res);
     })
  }

}
