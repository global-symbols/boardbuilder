import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COLOURS} from '../colour-palette';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.css']
})
export class ColourSelectorComponent implements OnInit {

  colours = COLOURS;

  @Input() label;
  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selectColour(colour: string) {
    this.valueChange.emit(colour);
  }
}
