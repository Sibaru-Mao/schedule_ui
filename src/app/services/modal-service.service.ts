import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  private renderSubject: BehaviorSubject<any> = new BehaviorSubject<string>(null);

  constructor() { }

  public getSubject(): Observable<any> {
    return this.renderSubject;
  }

  public emitInfo(msg: any): void {
    if (msg) {
      return this.renderSubject.next(msg)

    }
  }


}
