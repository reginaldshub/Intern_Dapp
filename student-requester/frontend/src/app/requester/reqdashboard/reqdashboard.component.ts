import { InteractionService } from './../interactionService/interaction.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from "@angular/router";
import swal from 'sweetalert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ServiceService } from '../../common/service.service';
import { RequesterService } from '../service/service.service';

@Component({
  selector: 'app-reqdashboard',
  templateUrl: './reqdashboard.component.html',
  styleUrls: ['./reqdashboard.component.css']
})

export class ReqdashboardComponent implements OnInit {
  username: string;
  openSidenav:Boolean = false;

  constructor( private fb: FormBuilder,
    private requesterService: RequesterService,
    private service: ServiceService,
    private router: Router,
    private _interactionSerice: InteractionService
   ) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
    // this.router.navigate(['/', 'reqpermission']);
  }
}