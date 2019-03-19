import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { SplitLastPipe } from '../../../common/split-last.pipe';

import {NgxChartsModule} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-selfcertificate',
  templateUrl: './selfcertificate.component.html',
  styleUrls: ['./selfcertificate.component.css'],
  providers: [ SplitLastPipe ]
})

export class SelfcertificateComponent implements OnInit {
  imgpath:string = 'http://localhost:8080/ipfs/';
  public dataSource: any = null;
  Name = {
    name:String,
    studentId: String,
    Endyear: Number,
    Startyear: Number,
    level: Number
  };
  response: any;
  showSpinner: boolean = false;
  hash: any;

  //Chart
  view: any[] = [500, 300];
  showLegend = true;
 
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  countryCount: any[];
  countryData: any[];
  chartdata: boolean = false;
  account: string;
  
  constructor(private service: ServiceService, private router: Router,private splitlast: SplitLastPipe) { }

  ngOnInit() {
    this.showSpinner = true;
    this.Name.Endyear = null;
    this.Name.Startyear = null;
    this.Name.studentId = null;
    this.Name.level = null;

    this.account = sessionStorage.getItem('account');
   this.getCertificate();
  }

  displayedColumns: string[] = ['Subject_name', 'Subject_marks'];

  displayColumns: string[] = ['Image'];
  navigate() {
    this.router.navigate(['/account'])

  }
  profile() {
    this.router.navigate(['/student/profile']);
  }
  getCertificate(){
    let sessionValue: any = sessionStorage.getItem('_id');
    this.Name.studentId = sessionValue;
    let sessionValueName: any = sessionStorage.getItem('name');
    this.Name.name = sessionValueName;
    this.service.getCertificate(this.Name).subscribe((res: any) => {
      console.log(res.certificate);
      this.showSpinner = false;
      
      // console.log(res.certificate[0]);
      // this.hash = res.certificate[0].ImageHash;
      this.response = res.certificate;
      this.processData(res.certificate)
    })
  }
  // chart
  onSelect(event) {
    console.log(event);
  }

  processData(entries) {
    // this.countryCount = [];
   
    this.countryData = [];
 
    // entries.forEach(element => {
    //   if (this.countryCount[element.country])
    //     this.countryCount[element.country] += 1;
    //   else
    //     this.countryCount[element.country] = 1;
    // });
    for(var i = 0; i < entries.length; i++) {
      var total;
      var name;
      var sum:number = 0;

      for( var j = 0; j < entries[i].addsubjects.length; j++){
        sum = sum + parseInt(entries[i].addsubjects[j].subjectmarks, 10);
    }
    if( i == 0){
      total = 625;
      name = 'Tenth'
    }
      else if( i == 1){
      total = 600;
      name = 'PU';
    }
      else if( i == 2) {
      total = 750;
      name = 'Degree';
    }
    else {

    }
    let singleentry = {
      name: name,
      value: ((sum/total)*100)
    }
    this.chartdata = true;
    this.countryData.push(singleentry);
    }
  }
}
