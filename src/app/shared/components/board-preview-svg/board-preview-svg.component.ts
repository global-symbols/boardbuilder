import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Board} from '@data/models/board.model';

@Component({
  selector: 'app-board-preview-svg',
  templateUrl: './board-preview-svg.component.svg',
  styleUrls: ['./board-preview-svg.component.scss']
})
export class BoardPreviewSvgComponent implements OnChanges {

  @Input() board: Board;

  a4 = {
    shortEdge: 210,
    longEdge: 297
  };

  height: number;
  width: number;
  pageOutlineColour = '#6b6b6b';

  constructor() { }

  ngOnChanges(): void {
    if (this.board.rows > this.board.columns) {
      this.height = this.a4.longEdge;
      this.width = this.a4.shortEdge;
    } else {
      this.height = this.a4.shortEdge;
      this.width = this.a4.longEdge;
    }
  }

}
