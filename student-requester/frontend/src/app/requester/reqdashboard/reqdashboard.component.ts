import { Component, OnInit } from '@angular/core';
import { ServiceService } from "../service/service.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';

@Component({
  selector: 'app-reqdashboard',
  templateUrl: './reqdashboard.component.html',
  styleUrls: ['./reqdashboard.component.css']
})
export class ReqdashboardComponent implements OnInit {
  cookieValue;

  constructor( private authService: ServiceService,
    private router: Router) { }

  ngOnInit() {
  }
profile(){

  this.router.navigate(['/requester/profile']);
  
}
}
