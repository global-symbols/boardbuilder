import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {palettes} from '@data/colour-picker-colours';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent implements OnInit, OnChanges {

  @Input() palette: 'regular' | 'skin' | 'hair' = 'regular';
  @Input() icon = 'color_lens';
  @Input() label;

  @Input() width: number;

  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  colours: string[];

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
