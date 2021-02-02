import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {COLOURS} from '../../../colour-palette';
import {colourPickerColours} from '@data/colour-picker-colours';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent implements OnChanges {

  colours = COLOURS;
  newColours = colourPickerColours;

  @Input() icon = 'color_lens';
  @Input() label;

  @Input() width: number;

  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.value) { this.value = 'transparent'; }
  }

  selectColour(colour: string) {
    // 'Transparent' should never be output as a colour
    if (colour !== 'transparent') { this.valueChange.emit(colour); }
  }
}
