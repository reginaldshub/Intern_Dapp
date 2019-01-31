import { RequesterService } from './../../../requester/service/service.service';
import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../common/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selfcertificate',
  templateUrl: './selfcertificate.component.html',
  styleUrls: ['./selfcertificate.component.css']
})
export class SelfcertificateComponent implements OnInit {

  public dataSource: any = null;
  Name = {
    name: String,
    Endyear: Number,
    Startyear: Number
  };
  response: any;
  showSpinner: boolean = false;

  constructor(private authservice: ServiceService, private router: Router,
    private service: RequesterService) { }

  ngOnInit() {
    this.showSpinner = true;
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
      // console.log(res.certificate);
      this.showSpinner = false;
      this.response = res.certificate;
    })
  }
}
