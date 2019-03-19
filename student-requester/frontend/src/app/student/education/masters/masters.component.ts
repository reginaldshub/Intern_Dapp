import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { StudentService } from '../../student.service';
import { ServiceService } from '../../service/service.service';
import { EndYearValidator } from './../year.validator';
import { StartYearValidator } from './../year.validator';

export interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {

  months: Year[] = [
    { value: "january", viewValue: "Jan" },
    { value: "February", viewValue: "Feb" },
    { value: "March", viewValue: "Mar" },
    { value: "April", viewValue: "Apr" },
    { value: "May", viewValue: "May" },
    { value: "June", viewValue: "Jun" },
    { value: "July", viewValue: "Jul" },
    { value: "August", viewValue: "Aug" },
    { value: "September", viewValue: "Sep" },
    { value: "October", viewValue: "Oct" },
    { value: "November", viewValue: "Nov" },
    { value: "December", viewValue: "Dec" }
  ]


  years: Year[] = [
    { value: "1940", viewValue: "1940" },
    { value: "1941", viewValue: "1941" },
    { value: "1942", viewValue: "1942" },
    { value: "1943", viewValue: "1943" },
    { value: "1944", viewValue: "1944" },
    { value: "1945", viewValue: "1945" },
    { value: "1946", viewValue: "1946" },
    { value: "1947", viewValue: "1947" },
    { value: "1948", viewValue: "1948" },
    { value: "1949", viewValue: "1949" },
    { value: "1950", viewValue: "1950" },
    { value: "1951", viewValue: "1951" },
    { value: "1952", viewValue: "1952" },
    { value: "1953", viewValue: "1953" },
    { value: "1954", viewValue: "1954" },
    { value: "1955", viewValue: "1955" },
    { value: "1956", viewValue: "1956" },
    { value: "1957", viewValue: "1957" },
    { value: "1958", viewValue: "1958" },
    { value: "1959", viewValue: "1959" },
    { value: "1960", viewValue: "1960" },
    { value: "1961", viewValue: "1961" },
    { value: "1962", viewValue: "1962" },
    { value: "1963", viewValue: "1963" },
    { value: "1964", viewValue: "1964" },
    { value: "1965", viewValue: "1965" },
    { value: "1966", viewValue: "1966" },
    { value: "1967", viewValue: "1967" },
    { value: "1968", viewValue: "1968" },
    { value: "1969", viewValue: "1969" },
    { value: "1970", viewValue: "1970" },
    { value: "1971", viewValue: "1971" },
    { value: "1972", viewValue: "1972" },
    { value: "1973", viewValue: "1973" },
    { value: "1974", viewValue: "1974" },
    { value: "1975", viewValue: "1975" },
    { value: "1976", viewValue: "1976" },
    { value: "1977", viewValue: "1977" },
    { value: "1978", viewValue: "1978" },
    { value: "1979", viewValue: "1979" },
    { value: "1980", viewValue: "1980" },
    { value: "1981", viewValue: "1981" },
    { value: "1982", viewValue: "1982" },
    { value: "1983", viewValue: "1983" },
    { value: "1984", viewValue: "1984" },
    { value: "1985", viewValue: "1985" },
    { value: "1986", viewValue: "1986" },
    { value: "1987", viewValue: "1987" },
    { value: "1988", viewValue: "1988" },
    { value: "1989", viewValue: "1989" },
    { value: "1990", viewValue: "1990" },
    { value: "1991", viewValue: "1991" },
    { value: "1992", viewValue: "1992" },
    { value: "1993", viewValue: "1993" },
    { value: "1994", viewValue: "1994" },
    { value: "1995", viewValue: "1995" },
    { value: "1996", viewValue: "1996" },
    { value: "1997", viewValue: "1997" },
    { value: "1998", viewValue: "1998" },
    { value: "1999", viewValue: "1999" },
    { value: "2000", viewValue: "2000" },
    { value: "2001", viewValue: "2001" },
    { value: "2002", viewValue: "2002" },
    { value: "2003", viewValue: "2003" },
    { value: "2004", viewValue: "2004" },
    { value: "2005", viewValue: "2005" },
    { value: "2006", viewValue: "2006" },
    { value: "2007", viewValue: "2007" },
    { value: "2008", viewValue: "2008" },
    { value: "2009", viewValue: "2009" },
    { value: "2010", viewValue: "2010" },
    { value: "2011", viewValue: "2011" },
    { value: "2012", viewValue: "2012" },
    { value: "2013", viewValue: "2013" },
    { value: "2014", viewValue: "2014" },
    { value: "2015", viewValue: "2015" },
    { value: "2016", viewValue: "2016" },
    { value: "2017", viewValue: "2017" },
    { value: "2018", viewValue: "2018" },
  ];

file: any;
  isEditBtn: boolean;
  isSaveBtn: boolean;
  categories: any;
  level: any = "4";
  masters: FormGroup;
  id: string;
  disableBtn: boolean;
  isDisableBtn: boolean;
  constructor(private fb: FormBuilder, private service: StudentService,
    private studentService: ServiceService) {
    this.masters = this.fb.group({
      id: [''],
      studentid: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],
      ecategory: [''],
      Startyear: ['', Validators.required],
      Endyear: ['', [Validators.required, EndYearValidator]],
      Branchname: ['', Validators.required],
      level: [''],
      class: [''],
      addsubjects: this.fb.array([this.addSubjectGroup()])
    });
  }
  ngOnInit() {
    this.id = sessionStorage.getItem('_id');
    this.getCertificates();
    this.masters.valueChanges.subscribe((changedObj: any) => {
      for (let i = 0; i < changedObj.addsubjects.length; i++) {
        if (changedObj.addsubjects[i].subjectname != "" && changedObj.addsubjects[i].subjectmarks != "") {
          this.disableBtn = false;
          this.isDisableBtn = false;
        } else {
          this.disableBtn = true;
          this.isDisableBtn = true;
          break;
        }
      }
    });
    let edu = {
      level: String
    }
    edu.level = this.level;
    this.studentService.educationCategory(edu).subscribe((res: any) => {
      this.categories = res.streams;
    })
  }

  addSubjectGroup() {
    return this.fb.group({
      subjectname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      subjectmarks: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }



  get subjectArray() {
    return <FormArray>this.masters.get('addsubjects');
  }

  Add() {
    this.subjectArray.push(this.addSubjectGroup())
  }

  Remove(index) {
    if ((this.masters.value.addsubjects.length) > 1)
      this.subjectArray.removeAt(index);
  }

  submit() {
    this.masters.value.studentid = this.id;
    this.masters.value.level = this.level;
    this.masters.value.class = 'masters';
    this.service.add(this.masters.value).subscribe((res) => {
      swal("", "" + res['message'], "success");
      if(res){
        this.service.upload(this.masters.value, this.file).subscribe((res) => {

        })
      }
    })
  }
  getCertificates() {
    let data = {
      id: String,
      level: String
    }
    var temp: any = sessionStorage.getItem('_id');
    var temp1: any = "4";
    data.id = temp;
    data.level = temp1;
    // debugger;
    this.studentService.getCertificate(data).subscribe((res: any) => {
      // console.log(res.certificate[0]);
      console.log(res);
      if (res.status == "empty") {
        // debugger;
        this.isSaveBtn = true;
        this.isEditBtn = false;
      } else if (res) {
        // this.isEditBtn=false;
        this.masters.disable();
        this.isSaveBtn = false;
        this.isEditBtn = false;
        this.masters.patchValue({
          id: res.certificate[0].id,
          ecategory: res.certificate[0].ecategory,
          Startyear: res.certificate[0].Startyear,
          Endyear: res.certificate[0].Endyear,
          Branchname: res.certificate[0].Branchname,
        })
        for (var i = 0; i < res.certificate[0].addsubjects.length; i++) {
          this.masters.patchValue({
            addsubjects: res.certificate[0].addsubjects
          })
          this.Add();
        }
        this.Remove(i);
      }
    })
  }

  hideEditBtn() {
    this.masters.enable();
    this.isEditBtn = !this.isEditBtn;
  }

  CancelBtn(){
    this.getCertificates();
    this.isEditBtn = !this.isEditBtn;
  }

  onFileChanged(event) {
    console.log(event);
    if (event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg') {
      this.file = event.target.files[0];
    }
    else {
      this.file = "";
      alert("only jpg png and jpeg");
    }

  }
}
