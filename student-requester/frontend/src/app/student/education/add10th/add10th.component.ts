import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';
@Component({
  selector: 'app-add10th',
  templateUrl: './add10th.component.html',
  styleUrls: ['./add10th.component.css']
})
export class Add10thComponent implements OnInit {

  add10th: FormGroup
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.add10th = this.fb.group({
      studentid: [],
      ecategory: [],
      Startyear: [],
      Endyear: [],
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
    return <FormArray>this.add10th.get('addsubjects');
  }

  Add(){
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    this.subjectArray.removeAt(index);
  }

  submit() {
    console.log(this.add10th.value);
    console.log("student id",this.add10th.value.studentid);
     this.service.add(this.add10th.value).subscribe((res)=>{
       console.log(res);
     })
  }

}
