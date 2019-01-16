import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/common/service.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit() {
  }

}
