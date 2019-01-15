import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private _MessageSource = new Subject<string>();
  Message$ = this._MessageSource.asObservable();  
  constructor() { }

  sendMessage(message:string){
    this._MessageSource.next(message);
  }
}
