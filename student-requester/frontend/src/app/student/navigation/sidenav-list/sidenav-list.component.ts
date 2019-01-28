import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ServiceService } from 'src/app/common/service.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
@Output() closeSidenav = new EventEmitter<void>();
  username: string;
  constructor(
    private service: ServiceService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name');
  }
  onClose(){
    this.closeSidenav.emit();
  }

}
