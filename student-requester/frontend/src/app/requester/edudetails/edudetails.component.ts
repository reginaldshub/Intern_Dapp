import { Component, OnInit, Input } from '@angular/core';
import { InteractionService } from './../interactionService/interaction.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { RequesterService } from '../service/service.service';

@Component({
  selector: 'app-edudetails',
  templateUrl: './edudetails.component.html',
  styleUrls: ['./edudetails.component.css']
})
export class EdudetailsComponent implements OnInit {
  constructor(private _interactionsrvice: InteractionService,
    private service: RequesterService) { }
  public dataSource: any = null;
  public pucdataSource: any = null;
  public degreedataSource: any = null;
  response;
  Name = {
    name: String,
    Endyear: Number,
    Startyear: Number
  };
  ngOnInit() {
    this.Name.name = null;
    this.Name.Endyear = null;
    this.Name.Startyear = null;

    this._interactionsrvice.Message$
      .subscribe(
        (message: any) => {
          if (message != null) {
            this.Name.name = message;
            this.getCertificate();
            // alert(message);
          }
          else {
            alert("nothing");
          }
        }
      )
  }

  displayedColumns: string[] = ['Subject_name', 'Subject_marks'];

  getCertificate() {
    this.service.getCertificate(this.Name).subscribe((res: any) => {
      console.log(res.certificate);
      this.response = res.certificate;
      // console.log(res.status);
    //   if(res.certificate){
    //   this.Name.Startyear = res.certificate.Startyear;
    //   this.Name.Endyear = res.certificate.Endyear;
    //   this.dataSource = res.certificate;
    // }
    })
  }
}
