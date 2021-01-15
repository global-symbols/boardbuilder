import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appStopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('mousedown', ['$event']) onMouseDown($event) {
    $event.stopPropagation();
  }

}
