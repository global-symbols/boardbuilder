import {Component, Input, OnChanges} from '@angular/core';
import {Board} from '@data/models/board.model';

interface BoardPreviewSvgThumbnail {
  height: number;
  width: number;
  x: number;
  y: number;
}

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

  viewBox: string;

  pageOutlineColour = '#6b6b6b';
  pageOutlineWidth: number;

  symbolSize = 24;

  pagePadding = 0;

  pageInnerHeight: number;
  pageInnerWidth: number;

  thumbnails: BoardPreviewSvgThumbnail[];

  constructor() { }

  ngOnChanges(): void {
    if (this.board.rows > this.board.columns) {
      this.height = this.a4.longEdge;
      this.width = this.a4.shortEdge;
    } else {
      this.height = this.a4.shortEdge;
      this.width = this.a4.longEdge;
    }

    this.viewBox = `0 0 ${this.width} ${this.height}`;

    this.pageOutlineWidth = this.height / 26.25;

    this.pageInnerHeight = this.height - this.pagePadding;
    this.pageInnerWidth = this.width - this.pagePadding;

    this.thumbnails = [];

    for (let row = 1; row <= this.board.rows; row++) {

      const cellY = this.pageInnerHeight / this.board.rows * (row - 1);

      for (let col = 1; col <= this.board.columns; col++) {

        const cellX = this.pageInnerWidth / this.board.columns * (col - 1);

        this.thumbnails.push({
          x: cellX,
          y: cellY,
          height: this.pageInnerHeight / this.board.rows,
          width: this.pageInnerWidth / this.board.columns,
        });

      }
    }
    console.log(this);
  }

}
