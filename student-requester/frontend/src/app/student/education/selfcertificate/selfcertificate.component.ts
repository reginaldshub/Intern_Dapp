import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-selfcertificate',
  templateUrl: './selfcertificate.component.html',
  styleUrls: ['./selfcertificate.component.css']
})
export class SelfcertificateComponent implements OnInit {

  public dataSource: any = null;
  Name = {
    studentId: String,
    Endyear: Number,
    Startyear: Number
  };
  response: any;
  showSpinner: boolean = false;

  constructor(private service: ServiceService, private router: Router) { }

  ngOnInit() {
    this.showSpinner = true;
    this.Name.Endyear = null;
    this.Name.Startyear = null;
    this.Name.studentId = null;
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
    let sessionValue: any = sessionStorage.getItem('_id');
    this.Name.studentId = sessionValue;
    this.service.getCertificate(this.Name).subscribe((res: any) => {
      console.log(res);
      this.showSpinner = false;
      console.log(res);
      this.response = res.certificate;
    })
  }
}
