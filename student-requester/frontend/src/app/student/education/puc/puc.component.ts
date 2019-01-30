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
  id: string;
  constructor(private fb: FormBuilder, private service: StudentService) {
    this.puc = this.fb.group({
      id: [],
      studentid: [],
      ecategory: [],
      Startyear: [],
      Endyear: [],
      Groupname:[],
      addsubjects: this.fb.array([this.addSubjectGroup()])
    });
  }
  ngOnInit() {
    this.id = sessionStorage.getItem('_id');
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
    this.puc.value.studentid = this.id;
    console.log("student id",this.puc.value.studentid);
     this.service.add(this.puc.value).subscribe((res)=>{
       console.log(res);
     })
  }


}
