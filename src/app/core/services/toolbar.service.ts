import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface ToolbarButton {
  text?: string;
  icon?: string;
  iconPosition?: string;
  action?: object;
  routerLink?: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private buttonsSubject$ = new BehaviorSubject<ToolbarButton[]>([]);
  public buttons$ = this.buttonsSubject$.asObservable();

  constructor() { }

  setButtons(buttons: ToolbarButton[]) {
    this.buttonsSubject$.next(buttons);
  }

  clearButtons() {
    this.buttonsSubject$.next([]);
  }
}
