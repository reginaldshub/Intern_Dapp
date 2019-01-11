import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import swal from 'sweetalert';
import { ServiceService } from '../../common/service.service';

@Component({
  selector: 'app-reqdashboard',
  templateUrl: './reqdashboard.component.html',
  styleUrls: ['./reqdashboard.component.css']
})
export class ReqdashboardComponent implements OnInit {
  cookieValue;

  constructor(private authService: ServiceService,
    private router: Router) { }

  ngOnInit() {
  }
  navigate() {
    this.router.navigate(['/account'])
  }
  
  profile() {

    this.router.navigate(['/requester/profile']);

  }

}
