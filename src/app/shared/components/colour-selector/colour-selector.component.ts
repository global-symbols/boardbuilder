import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {COLOURS} from '../../../colour-palette';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent {

  colours = COLOURS;

  @Input() icon = 'color_lens';
  @Input() label;
  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  selectColour(colour: string) {
    this.valueChange.emit(colour);
  }
}
