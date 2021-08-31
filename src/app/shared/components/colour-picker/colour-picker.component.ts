import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {palettes} from '@data/colour-picker-colours';

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.scss']
})
export class ColourPickerComponent implements OnInit, OnChanges {

  @Input() palette: 'regular' | 'skin' | 'hair' = 'regular';

  // Hides or shows the outline around the inner Github colour picker.
  @Input() border = false;

  @Input() width: number;

  @Input() value;
  @Output() valueChange = new EventEmitter<string>();




  colours: string[];

  constructor() { }

  ngOnInit(): void {
    this.colours = palettes[this.palette];
  }

  ngOnChanges(): void {
    if (!this.value) { this.value = 'transparent'; }
  }

  selectColour(colour: string) {
    // 'Transparent' should never be output as a colour
    if (colour !== 'transparent') { this.valueChange.emit(colour); }
  }

}
