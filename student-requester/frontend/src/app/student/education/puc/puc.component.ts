import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';
@Component({
  selector: 'app-puc',
  templateUrl: './puc.component.html',
  styleUrls: ['./puc.component.css']
})
export class PucComponent implements OnInit {

  puc: FormGroup
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.puc = this.fb.group({
      studentid: [],
      ecategory: [],
      Startyear: [],
      Endyear: [],
      Groupname:[],
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
    return <FormArray>this.puc.get('addsubjects');
  }

  Add(){
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    this.subjectArray.removeAt(index);
  }

  submit() {
    console.log("student id",this.puc.value.studentid);
    //  this.service.add(this.add10th.value).subscribe((res)=>{
    //    console.log(res);
    //  })
  }


}
