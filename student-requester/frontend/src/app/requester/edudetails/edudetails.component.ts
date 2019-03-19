import { Component, OnInit, Input } from '@angular/core';
import { InteractionService } from './../interactionService/interaction.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { RequesterService } from '../service/service.service';
import { ActivatedRoute } from '@angular/router';
import { SplitLastPipe } from 'src/app/common/split-last.pipe';

@Component({
  selector: 'app-edudetails',
  templateUrl: './edudetails.component.html',
  styleUrls: ['./edudetails.component.css'],
  providers: [ SplitLastPipe ]
})
export class EdudetailsComponent implements OnInit {
  constructor(private _interactionsrvice: InteractionService,
    private service: RequesterService,
    private route: ActivatedRoute,
    private splitlast: SplitLastPipe) { }
  public dataSource: any = null;
  public pucdataSource: any = null;
  public degreedataSource: any = null;
  response;
  showSpinner: boolean = false;
  Name = {
    name: String,
    Endyear: Number,
    Startyear: Number
  };
  ngOnInit() {
    {
      this.route.params.subscribe(params => {
        this.showSpinner = true;
        this.Name.name = params.name;
        this.Name.Endyear = null;
        this.Name.Startyear = null;
        console.log(this.Name)

        this.service.getCertificate(this.Name).subscribe((res: any) => {

          this.showSpinner = false;
          this.response = res.certificate;

          // console.log(this.response);
        })
      })
    }
  }

  //     this.response = null;
  //     this.Name.name = null;
  //     this.Name.Endyear = null;
  //     this.Name.Startyear = null;

  //     this._interactionsrvice.Message$
  //       .subscribe(
  //         (message: any) => {
  //           if (message != null) {
  //             this.Name.name = message;
  //             this.getCertificate();
  //             // alert(message);
  //           }
  //           else {
  //             console.log('no message');
  //             alert("nothing");
  //           }
  //         }
  //       )
  //   }

  displayedColumns: string[] = ['Subject_name', 'Subject_marks'];

  //   getCertificate() {
  //     this.service.getCertificate(this.Name).subscribe((res: any) => {
  //       this.response = res.certificate;
  //       console.log(this.response);
  //     })
  //   }
}
