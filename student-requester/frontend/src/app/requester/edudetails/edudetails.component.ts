import { Component, OnInit, Input } from '@angular/core';
import { InteractionService } from './../interactionService/interaction.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-edudetails',
  templateUrl: './edudetails.component.html',
  styleUrls: ['./edudetails.component.css']
})
export class EdudetailsComponent implements OnInit {
  constructor(private _interactionsrvice : InteractionService) { }
  Name;
  ngOnInit() {
    this._interactionsrvice.Message$
    .subscribe(
      message => {
        if(message!= null){
        this.Name = message;
        // alert(message);
      }
        else{
          alert("nothing");
        }

      }
    )
  }

}
