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
  username: string;
  
  constructor(private authservice: ServiceService, private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
  }

  name= sessionStorage.getItem('name');
  navigate() {
    this.router.navigate(['/account'])

  }
  profile() {
    this.router.navigate(['/student/profile']);
  }
}
