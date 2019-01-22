import { MaterialModule } from './../../material/material.module';
import { RequesterService } from './../../requester/service/service.service';
import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../common/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  response;

  public dataSource: any = null;
  Name = {
    name: String,
    Endyear: Number,
    Startyear: Number
  };

  constructor(private authservice: ServiceService, private router: Router,
    private service: RequesterService) { }

  ngOnInit() {
    this.Name.Endyear = null;
    this.Name.Startyear = null;
    this.Name.name = null;
   this.getCertificate();
  }

  displayedColumns: string[] = ['Subject_name', 'Subject_marks'];
  navigate() {
    this.router.navigate(['/account'])

  }
  profile() {
    this.router.navigate(['/student/profile']);
  }
  getCertificate(){
    let sessionValue: any = sessionStorage.getItem('name');
    this.Name.name = sessionValue;
    this.service.getCertificate(this.Name).subscribe((res: any) => {
      console.log(res.certificate);
      this.response = res.certificate;
    })
  }
}
