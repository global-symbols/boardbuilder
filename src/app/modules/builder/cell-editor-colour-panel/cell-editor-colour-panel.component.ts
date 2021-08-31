import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {palettes} from '@data/colour-picker-colours';
import {MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-cell-editor-colour-panel',
  templateUrl: './cell-editor-colour-panel.component.html',
  styleUrls: ['./cell-editor-colour-panel.component.scss']
})
export class CellEditorColourPanelComponent implements OnInit, OnChanges {

  @Input() palette: 'regular' | 'skin' | 'hair' = 'regular';
  @Input() icon = 'color_lens';
  @Input() label;

  @Input() width: number;

  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild(MatExpansionPanel, { static: false }) expansionPanel;

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
