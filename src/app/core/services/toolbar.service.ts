import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface ToolbarButton {
  text?: string;
  icon?: string;
  tooltip?: string;
  routerLink?: Array<string>;

  action?();
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private leftButtonsSubject$ = new BehaviorSubject<ToolbarButton[]>([]);
  public leftButtons$ = this.leftButtonsSubject$.asObservable();

  private rightButtonsSubject$ = new BehaviorSubject<ToolbarButton[]>([]);
  public rightButtons$ = this.rightButtonsSubject$.asObservable();

  constructor() { }

  setButtons(left: ToolbarButton[], right?: ToolbarButton[]) {
    this.leftButtonsSubject$.next(left);
    this.rightButtonsSubject$.next(right);
  }

  clearButtons() {
    this.leftButtonsSubject$.next([]);
    this.rightButtonsSubject$.next([]);
  }
}
