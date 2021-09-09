import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ToolbarButton {
  text?: string;
  icon?: string;
  tooltip?: string;

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

  // The global nav button should show automatically when there are no left buttons.
  private showGlobalNavSubject$ = new BehaviorSubject<boolean>(true);
  public showGlobalNav$ = this.showGlobalNavSubject$.asObservable();

  constructor() { }

  setButtons(left: ToolbarButton[], right?: ToolbarButton[]) {
    this.leftButtonsSubject$.next(left);
    this.rightButtonsSubject$.next(right);

    // If there are any left buttons, hide the global nav button.
    if (left.length > 0) {
      this.showGlobalNavSubject$.next(false);
    }
  }

  clearButtons() {
    this.leftButtonsSubject$.next([]);
    this.rightButtonsSubject$.next([]);
    this.showGlobalNavSubject$.next(true);
  }
}
