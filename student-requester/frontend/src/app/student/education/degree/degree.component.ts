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
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.degree = this.fb.group({
      studentid: [],
      ecategory: [],
      Startyear: [],
      Endyear: [],
      Branchname:[],
      addsubjects: this.fb.array([this.addSubjectGroup()])
    });
  }
  ngOnInit() {

  }
  addSubjectGroup() {
    return this.fb.group({
      subjectname: [],
      subjectmarks: []
    });
  }



  get subjectArray() {
    return <FormArray>this.degree.get('addsubjects');
  }

  Add(){
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    this.subjectArray.removeAt(index);
  }

  submit() {
    console.log("student id",this.degree.value.studentid);
    //  this.service.add(this.add10th.value).subscribe((res)=>{
    //    console.log(res);
    //  })
  }

}
