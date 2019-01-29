import { ServiceService } from './../../../common/service.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit { 
@Output() sidenavToggle = new EventEmitter<void>();
  username: string;
  constructor(
    private service: ServiceService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
  }

  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

}
