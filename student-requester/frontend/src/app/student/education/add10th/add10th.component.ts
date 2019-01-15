import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormArray,FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';
@Component({
  selector: 'app-add10th',
  templateUrl: './add10th.component.html',
  styleUrls: ['./add10th.component.css']
})
export class Add10thComponent implements OnInit {
  constructor(private fb:FormBuilder,private service:StudentService) {
   
  }
  ngOnInit() {
 
  }
  add10th: FormGroup = this.fb.group({
    studentid: [],
    ecategory: [],
    Startyear: [],
    Endyear:   [],
    addsubjects: this.fb.array([this.addSubjectGroup()])
  });

  addSubjectGroup(){
    return this.fb.group({
      subjectname:[],
      subjectmarks:[]
    });
  }

  get subjectArray(){
  return <FormArray> this.add10th.get('addsubjects');
  }

  add(){
    this.subjectArray.push(this.addSubjectGroup())
  }
  Remove(index){
    this.subjectArray.removeAt(index);
  }
  value(){
    //console.log(this.add10th.value);
     this.service.add(this.add10th.value).subscribe((res)=>{
       console.log(res);
     })
  }

}
